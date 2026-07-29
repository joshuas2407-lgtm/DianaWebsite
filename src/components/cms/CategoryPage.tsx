"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useOwner } from "@/context/OwnerContext";
import { ProjectCard } from "@/components/cms/ProjectCard";
import { LeatherProjectViewer } from "@/components/cms/LeatherProjectViewer";
import {
  CATEGORY_PAGE_TITLES,
  EXPANDABLE_COLUMN_CATEGORIES,
  resolveColumnCount,
  usesColumnLayout,
  type CategorySlug,
  type Project,
} from "@/types/content";

interface CategoryPageProps {
  category: CategorySlug;
  initialProjects: Project[];
  initialColumnCount?: number;
}

function projectColumn(project: Project): number {
  return typeof project.column === "number" ? project.column : 0;
}

export function CategoryPageClient({
  category,
  initialProjects,
  initialColumnCount,
}: CategoryPageProps) {
  const { isOwner } = useOwner();
  const [projects, setProjects] = useState(initialProjects);
  const [columnCount, setColumnCount] = useState(() =>
    resolveColumnCount(category, initialProjects, initialColumnCount)
  );
  const hasColumnLayout = usesColumnLayout(category);
  const hasExpandableColumns = EXPANDABLE_COLUMN_CATEGORIES.includes(category);
  const isLeather = category === "leather";

  useEffect(() => {
    setProjects(initialProjects);
    setColumnCount(
      resolveColumnCount(category, initialProjects, initialColumnCount)
    );
  }, [category, initialColumnCount, initialProjects]);

  const refresh = useCallback(async () => {
    const res = await fetch(`/api/projects/${category}`, {
      credentials: "include",
    });
    const data = (await res.json()) as {
      projects: Project[];
      columnCount?: number;
    };
    setProjects(data.projects);
    setColumnCount(resolveColumnCount(category, data.projects, data.columnCount));
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

  const addColumn = async () => {
    await fetch(`/api/projects/${category}/columns`, {
      method: "POST",
      credentials: "include",
    });
    await refresh();
  };

  const columnProjects = (column: number) =>
    projects.filter((project) => projectColumn(project) === column);

  const layoutClassName = hasExpandableColumns
    ? " category-page--columns-expandable"
    : hasColumnLayout
      ? " category-page--columns"
      : "";

  const renderColumn = (column: number) => (
    <section
      key={column}
      className="category-page__column"
      aria-label={`${CATEGORY_PAGE_TITLES[category]} column ${column + 1}`}
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
              setProjects((prev) => prev.filter((p) => p.id !== project.id))
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
  );

  return (
    <div
      className={`page-category page-category--${category} category-page${layoutClassName}`}
    >
      <header
        className={`category-page__header${!isOwner ? " category-page__header--viewer" : ""}`}
      >
        <Link href="/" className="category-page__back">
          ← Home
        </Link>
        <h1>{CATEGORY_PAGE_TITLES[category]}</h1>
        {isOwner && !hasColumnLayout && (
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
        {hasColumnLayout ? (
          <>
            {projects.length === 0 && !isOwner && (
              <p className="category-page__empty">Projects coming soon.</p>
            )}
            <div className="category-page__columns">
              {Array.from({ length: columnCount }, (_, column) =>
                renderColumn(column)
              )}
              {isOwner && hasExpandableColumns && (
                <div className="category-page__add-column-wrap">
                  <button
                    type="button"
                    className="category-page__add-column"
                    onClick={() => void addColumn()}
                    aria-label="Add column"
                  >
                    +
                  </button>
                  <span className="category-page__add-column-label">
                    Add column
                  </span>
                </div>
              )}
            </div>
          </>
        ) : isLeather ? (
          <LeatherProjectViewer
            projects={projects}
            category={category}
            isOwner={isOwner}
            onUpdate={(updated) =>
              setProjects((prev) =>
                prev.map((p) => (p.id === updated.id ? updated : p))
              )
            }
            onDelete={(projectId) =>
              setProjects((prev) => prev.filter((p) => p.id !== projectId))
            }
          />
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
