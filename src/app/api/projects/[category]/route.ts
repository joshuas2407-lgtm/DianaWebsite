import { NextResponse } from "next/server";
import { isOwner } from "@/lib/auth";
import {
  addProject,
  categoryResponse,
  deleteProject,
  isValidCategory,
  readContent,
  updateProject,
} from "@/lib/content";
import type { Project } from "@/types/content";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ category: string }> };

const unauthorized = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });
const invalidCategory = () =>
  NextResponse.json({ error: "Invalid category" }, { status: 400 });

/** Keeps only known project fields with the right types. */
function pickProjectFields(body: Record<string, unknown>) {
  const fields: Partial<Omit<Project, "id">> = {};
  if (typeof body.title === "string") fields.title = body.title;
  if (typeof body.date === "string") fields.date = body.date;
  if (typeof body.text === "string") fields.text = body.text;
  if (Array.isArray(body.images)) {
    fields.images = body.images.filter(
      (i): i is string => typeof i === "string"
    );
  }
  if (typeof body.column === "number" && body.column >= 0) {
    fields.column = body.column;
  }
  return fields;
}

export async function GET(_request: Request, { params }: Params) {
  const { category } = await params;
  if (!isValidCategory(category)) return invalidCategory();
  return NextResponse.json(categoryResponse(await readContent(), category));
}

export async function POST(request: Request, { params }: Params) {
  if (!(await isOwner())) return unauthorized();
  const { category } = await params;
  if (!isValidCategory(category)) return invalidCategory();

  const body = ((await request.json().catch(() => null)) ?? {}) as Record<
    string,
    unknown
  >;
  const fields = pickProjectFields(body);
  const project: Omit<Project, "id"> = {
    title: fields.title ?? "New project",
    date: fields.date ?? new Date().toISOString().slice(0, 10),
    text: fields.text ?? "",
    images: fields.images ?? [],
  };
  if (
    fields.column !== undefined &&
    (category === "art" || fields.column <= 2)
  ) {
    project.column = fields.column;
  }

  const content = await addProject(category, project);
  return NextResponse.json(categoryResponse(content, category));
}

export async function PATCH(request: Request, { params }: Params) {
  if (!(await isOwner())) return unauthorized();
  const { category } = await params;
  if (!isValidCategory(category)) return invalidCategory();

  const body = ((await request.json().catch(() => null)) ?? {}) as Record<
    string,
    unknown
  >;
  if (typeof body.projectId !== "string") {
    return NextResponse.json({ error: "projectId required" }, { status: 400 });
  }

  try {
    const content = await updateProject(
      category,
      body.projectId,
      pickProjectFields(body)
    );
    return NextResponse.json(categoryResponse(content, category));
  } catch (err) {
    if (err instanceof Error && err.message === "Project not found") {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    throw err;
  }
}

export async function DELETE(request: Request, { params }: Params) {
  if (!(await isOwner())) return unauthorized();
  const { category } = await params;
  if (!isValidCategory(category)) return invalidCategory();

  const projectId = new URL(request.url).searchParams.get("projectId");
  if (!projectId) {
    return NextResponse.json({ error: "projectId required" }, { status: 400 });
  }

  const content = await deleteProject(category, projectId);
  return NextResponse.json(categoryResponse(content, category));
}
