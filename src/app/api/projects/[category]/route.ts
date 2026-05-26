import { NextResponse } from "next/server";
import { isOwnerAuthenticated } from "@/lib/auth";
import {
  addProject,
  deleteProject,
  readContent,
  updateProject,
} from "@/lib/content";
import { CATEGORY_SLUGS, type CategorySlug } from "@/types/content";

function isCategorySlug(value: string): value is CategorySlug {
  return CATEGORY_SLUGS.includes(value as CategorySlug);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;
  if (!isCategorySlug(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }
  const content = await readContent();
  return NextResponse.json(content.categories[category]);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  if (!(await isOwnerAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { category } = await params;
  if (!isCategorySlug(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }
  const body = (await request.json()) as {
    title?: string;
    date?: string;
    text?: string;
    images?: string[];
  };
  const content = await addProject(category, {
    title: body.title ?? "Untitled",
    date: body.date ?? new Date().toISOString().slice(0, 10),
    text: body.text ?? "",
    images: body.images ?? [],
  });
  return NextResponse.json(content.categories[category]);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  if (!(await isOwnerAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { category } = await params;
  if (!isCategorySlug(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }
  const body = (await request.json()) as {
    projectId: string;
    title?: string;
    date?: string;
    text?: string;
    images?: string[];
  };
  const content = await updateProject(category, body.projectId, {
    title: body.title,
    date: body.date,
    text: body.text,
    images: body.images,
  });
  return NextResponse.json(content.categories[category]);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  if (!(await isOwnerAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { category } = await params;
  if (!isCategorySlug(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  if (!projectId) {
    return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
  }
  const content = await deleteProject(category, projectId);
  return NextResponse.json(content.categories[category]);
}
