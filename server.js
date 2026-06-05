import express from "express";
import cookieParser from "cookie-parser";
import next from "next";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { apiRouter } from "./backend/routes/api.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env.local") });
dotenv.config({ path: path.join(__dirname, ".env") });

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3000", 10);

const nextApp = next({ dev, dir: __dirname });
const handle = nextApp.getRequestHandler();

await nextApp.prepare();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api", apiRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.all("*", (req, res) => handle(req, res));

app.listen(port, () => {
  console.log(`> Ready on http://localhost:${port}`);
});
