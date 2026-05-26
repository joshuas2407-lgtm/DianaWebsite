"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useOwner } from "@/context/OwnerContext";
import { ProjectCard } from "@/components/cms/ProjectCard";
import {
  CATEGORY_LABELS,
  type CategorySlug,
  type Project,
} from "@/types/content";

interface CategoryPageProps {
  category: CategorySlug;
  initialProjects: Project[];
}

export function CategoryPageClient({
  category,
  initialProjects,
}: CategoryPageProps) {
  const { isOwner } = useOwner();
  const [projects, setProjects] = useState(initialProjects);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const refresh = useCallback(async () => {
    const res = await fetch(`/api/projects/${category}`);
    const data = (await res.json()) as { projects: Project[] };
    setProjects(data.projects);
  }, [category]);

  const addProject = async () => {
    await fetch(`/api/projects/${category}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "New project",
        date: new Date().toISOString().slice(0, 10),
        text: "",
        images: [],
      }),
    });
    await refresh();
  };

  return (
    <div className="category-page">
      <header className="category-page__header">
        <Link href="/" className="category-page__back">
          ← Home
        </Link>
        <h1>{CATEGORY_LABELS[category]}</h1>
        {isOwner && (
          <button
            type="button"
            className="category-page__add"
            onClick={() => void addProject()}
            aria-label="Add project"
          >
            +
          </button>
        )}
      </header>

      <main className="category-page__main">
        {projects.length === 0 && !isOwner && (
          <p className="category-page__empty">Projects coming soon.</p>
        )}
        {projects.length === 0 && isOwner && (
          <p className="category-page__empty">
            No projects yet. Click + to add your first project.
          </p>
        )}
        <div className="category-page__projects">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              category={category}
              onUpdate={(updated) =>
                setProjects((prev) =>
                  prev.map((p) => (p.id === updated.id ? updated : p))
                )
              }
              onDelete={() =>
                setProjects((prev) => prev.filter((p) => p.id !== project.id))
              }
            />
          ))}
        </div>
      </main>
    </div>
  );
}
