"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useOwner } from "@/context/OwnerContext";
import { ProjectCard } from "@/components/cms/ProjectCard";
import {
  ARCHITECTURE_COLUMNS,
  CATEGORY_PAGE_TITLES,
  type CategorySlug,
  type Project,
} from "@/types/content";

interface CategoryPageProps {
  category: CategorySlug;
  initialProjects: Project[];
}

function projectColumn(project: Project): number {
  return typeof project.column === "number" ? project.column : 0;
}

export function CategoryPageClient({
  category,
  initialProjects,
}: CategoryPageProps) {
  const { isOwner } = useOwner();
  const [projects, setProjects] = useState(initialProjects);
  const isArchitecture = category === "architecture";

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const refresh = useCallback(async () => {
    const res = await fetch(`/api/projects/${category}`, {
      credentials: "include",
    });
    const data = (await res.json()) as { projects: Project[] };
    setProjects(data.projects);
  }, [category]);

  const addProject = async (column?: number) => {
    await fetch(`/api/projects/${category}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title: "New project",
        date: new Date().toISOString().slice(0, 10),
        text: "",
        images: [],
        ...(typeof column === "number" ? { column } : {}),
      }),
    });
    await refresh();
  };

  const columnProjects = (column: number) =>
    projects.filter((project) => projectColumn(project) === column);

  return (
    <div className={`page-category page-category--${category} category-page`}>
      <header
        className={`category-page__header${!isOwner ? " category-page__header--viewer" : ""}`}
      >
        <Link href="/" className="category-page__back">
          ← Home
        </Link>
        <h1>{CATEGORY_PAGE_TITLES[category]}</h1>
        {isOwner && !isArchitecture && (
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
        {isArchitecture ? (
          <>
            {projects.length === 0 && !isOwner && (
              <p className="category-page__empty">Projects coming soon.</p>
            )}
            <div className="category-page__columns">
              {Array.from({ length: ARCHITECTURE_COLUMNS }, (_, column) => (
                <section
                  key={column}
                  className="category-page__column"
                  aria-label={`Portfolio column ${column + 1}`}
                >
                  {isOwner && (
                    <button
                      type="button"
                      className="category-page__column-add"
                      onClick={() => void addProject(column)}
                      aria-label={`Add project to column ${column + 1}`}
                    >
                      +
                    </button>
                  )}
                  <div className="category-page__projects">
                    {columnProjects(column).map((project) => (
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
                          setProjects((prev) =>
                            prev.filter((p) => p.id !== project.id)
                          )
                        }
                      />
                    ))}
                  </div>
                  {isOwner && columnProjects(column).length === 0 && (
                      <p className="category-page__empty category-page__empty--column">
                        Click + to add a project
                      </p>
                    )}
                </section>
              ))}
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </main>
    </div>
  );
}
