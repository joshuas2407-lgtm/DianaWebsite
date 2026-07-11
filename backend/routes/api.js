import { Router } from "express";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";
import {
  COOKIE_NAME,
  SESSION_MAX_AGE,
  createOwnerSession,
  isOwnerAuthenticated,
  verifyOwnerPassword,
} from "../lib/auth.js";
import {
  addProject,
  deleteProject,
  readContent,
  updateBio,
  updateProject,
} from "../lib/content.js";
import { isValidCategory } from "../lib/categories.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const UPLOAD_DIR = path.join(ROOT, "public", "uploads");

const upload = multer({
  storage: multer.diskStorage({
    destination: async (_req, _file, cb) => {
      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      cb(null, UPLOAD_DIR);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname) || ".jpg";
      cb(null, `${crypto.randomUUID()}${ext}`);
    },
  }),
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images allowed"));
    }
  },
});

export const apiRouter = Router();

function requireOwner(req, res, next) {
  isOwnerAuthenticated(req)
    .then((ok) => {
      if (!ok) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
      next();
    })
    .catch(next);
}

apiRouter.post("/auth/login", async (req, res) => {
  const { password } = req.body ?? {};
  if (!password || !verifyOwnerPassword(password)) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  const token = await createOwnerSession();
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE * 1000,
    path: "/",
  });
  res.json({ ok: true });
});

apiRouter.post("/auth/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.json({ ok: true });
});

apiRouter.get("/auth/session", async (req, res) => {
  const isOwner = await isOwnerAuthenticated(req);
  res.json({ isOwner });
});

apiRouter.get("/content", async (_req, res, next) => {
  try {
    const content = await readContent();
    res.json(content);
  } catch (err) {
    next(err);
  }
});

apiRouter.patch("/content", requireOwner, async (req, res, next) => {
  try {
    const { bio } = req.body ?? {};
    if (typeof bio !== "string") {
      res.status(400).json({ error: "Invalid bio" });
      return;
    }
    const content = await updateBio(bio);
    res.json(content);
  } catch (err) {
    next(err);
  }
});

apiRouter.get("/projects/:category", async (req, res, next) => {
  try {
    const { category } = req.params;
    if (!isValidCategory(category)) {
      res.status(400).json({ error: "Invalid category" });
      return;
    }
    const content = await readContent();
    res.json({ projects: content.categories[category].projects });
  } catch (err) {
    next(err);
  }
});

apiRouter.post("/projects/:category", requireOwner, async (req, res, next) => {
  try {
    const { category } = req.params;
    if (!isValidCategory(category)) {
      res.status(400).json({ error: "Invalid category" });
      return;
    }

    const { title, date, text, images, column } = req.body ?? {};
    const project = {
      title: typeof title === "string" ? title : "New project",
      date:
        typeof date === "string"
          ? date
          : new Date().toISOString().slice(0, 10),
      text: typeof text === "string" ? text : "",
      images: Array.isArray(images) ? images.filter((i) => typeof i === "string") : [],
    };

    if (typeof column === "number" && column >= 0 && column <= 2) {
      project.column = column;
    }

    const content = await addProject(category, project);
    res.json({ projects: content.categories[category].projects });
  } catch (err) {
    next(err);
  }
});

apiRouter.patch("/projects/:category", requireOwner, async (req, res, next) => {
  try {
    const { category } = req.params;
    if (!isValidCategory(category)) {
      res.status(400).json({ error: "Invalid category" });
      return;
    }

    const { projectId, ...updates } = req.body ?? {};
    if (typeof projectId !== "string") {
      res.status(400).json({ error: "projectId required" });
      return;
    }

    const content = await updateProject(category, projectId, updates);
    res.json({ projects: content.categories[category].projects });
  } catch (err) {
    if (err instanceof Error && err.message === "Project not found") {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    next(err);
  }
});

apiRouter.delete("/projects/:category", requireOwner, async (req, res, next) => {
  try {
    const { category } = req.params;
    if (!isValidCategory(category)) {
      res.status(400).json({ error: "Invalid category" });
      return;
    }

    const projectId = req.query.projectId;
    if (typeof projectId !== "string") {
      res.status(400).json({ error: "projectId required" });
      return;
    }

    const content = await deleteProject(category, projectId);
    res.json({ projects: content.categories[category].projects });
  } catch (err) {
    next(err);
  }
});

apiRouter.post("/upload", requireOwner, (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      if (err.message === "Only images allowed") {
        res.status(400).json({ error: err.message });
        return;
      }
      next(err);
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }

    res.json({ url: `/uploads/${req.file.filename}` });
  });
});
