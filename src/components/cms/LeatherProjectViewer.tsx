"use client";

import { useEffect, useState } from "react";
import { ProjectCard } from "@/components/cms/ProjectCard";
import type { CategorySlug, Project } from "@/types/content";

interface LeatherProjectViewerProps {
  projects: Project[];
  category: CategorySlug;
  isOwner: boolean;
  onUpdate: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

export function LeatherProjectViewer({
  projects,
  category,
  isOwner,
  onUpdate,
  onDelete,
}: LeatherProjectViewerProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex((current) =>
      projects.length === 0 ? 0 : Math.min(current, projects.length - 1)
    );
  }, [projects.length]);

  if (projects.length === 0) {
    if (isOwner) {
      return (
        <p className="category-page__empty">
          No projects yet. Click + to add your first project.
        </p>
      );
    }
    return <p className="category-page__empty">Projects coming soon.</p>;
  }

  const project = projects[index];
  const canGoPrev = index > 0;
  const canGoNext = index < projects.length - 1;

  return (
    <div className="leather-viewer">
      <button
        type="button"
        className="leather-viewer__nav leather-viewer__nav--prev"
        onClick={() => setIndex((current) => Math.max(0, current - 1))}
        disabled={!canGoPrev}
        aria-label="Previous project"
      >
        ←
      </button>

      <div className="leather-viewer__slide">
        <ProjectCard
          key={project.id}
          project={project}
          category={category}
          onUpdate={onUpdate}
          onDelete={() => {
            onDelete(project.id);
            setIndex((current) => Math.max(0, current - 1));
          }}
        />
        {projects.length > 1 && (
          <p className="leather-viewer__counter" aria-live="polite">
            {index + 1} / {projects.length}
          </p>
        )}
      </div>

      <button
        type="button"
        className="leather-viewer__nav leather-viewer__nav--next"
        onClick={() =>
          setIndex((current) => Math.min(projects.length - 1, current + 1))
        }
        disabled={!canGoNext}
        aria-label="Next project"
      >
        →
      </button>
    </div>
  );
}
