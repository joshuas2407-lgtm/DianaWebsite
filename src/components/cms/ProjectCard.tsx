"use client";

import { useState } from "react";
import Image from "next/image";
import { useOwner } from "@/context/OwnerContext";
import { ImageDropzone } from "@/components/cms/ImageDropzone";
import { ArtProjectImage } from "@/components/cms/ArtProjectImage";
import type { CategorySlug, Project } from "@/types/content";

interface ProjectCardProps {
  project: Project;
  category: CategorySlug;
  onUpdate: (project: Project) => void;
  onDelete: () => void;
}

export function ProjectCard({
  project,
  category,
  onUpdate,
  onDelete,
}: ProjectCardProps) {
  const { isOwner } = useOwner();
  const [title, setTitle] = useState(project.title);
  const [date, setDate] = useState(project.date);
  const [text, setText] = useState(project.text);
  const [images, setImages] = useState(project.images);
  const [saving, setSaving] = useState(false);

  const persist = async (updates: Partial<Project>) => {
    setSaving(true);
    const payload =
      typeof project.column === "number"
        ? { projectId: project.id, column: project.column, ...updates }
        : { projectId: project.id, ...updates };
    const res = await fetch(`/api/projects/${category}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = (await res.json()) as { projects: Project[] };
      const updated = data.projects.find((p) => p.id === project.id);
      if (updated) onUpdate(updated);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${category}?projectId=${project.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    onDelete();
  };

  const isLeather = category === "leather";
  const isArt = category === "art";

  return (
    <article className="project-card">
      {isOwner ? (
        isLeather ? (
          <>
            <div className="project-card__copy">
              <div className="project-card__fields">
                <input
                  className="project-card__title-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => void persist({ title })}
                  placeholder="Project title"
                />
                <input
                  type="date"
                  className="project-card__date-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  onBlur={() => void persist({ date })}
                />
              </div>
              <textarea
                className="project-card__text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onBlur={() => void persist({ text })}
                placeholder="Describe this project…"
                rows={8}
              />
            </div>
            <div className="project-card__media">
              <ImageDropzone
                images={images}
                onChange={(next) => {
                  setImages(next);
                  void persist({ images: next });
                }}
              />
            </div>
            <div className="project-card__owner-actions">
              {saving && <span>Saving…</span>}
              <button type="button" onClick={() => void handleDelete()}>
                Delete project
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="project-card__fields">
              <input
                className="project-card__title-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => void persist({ title })}
                placeholder="Project title"
              />
              <input
                type="date"
                className="project-card__date-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                onBlur={() => void persist({ date })}
              />
            </div>
            <textarea
              className="project-card__text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={() => void persist({ text })}
              placeholder="Describe this project…"
              rows={4}
            />
            <ImageDropzone
              images={images}
              naturalAspect={isArt}
              onChange={(next) => {
                setImages(next);
                void persist({ images: next });
              }}
            />
            <div className="project-card__owner-actions">
              {saving && <span>Saving…</span>}
              <button type="button" onClick={() => void handleDelete()}>
                Delete project
              </button>
            </div>
          </>
        )
      ) : isLeather ? (
        <>
          <div className="project-card__copy">
            <header className="project-card__header">
              <h2>{project.title}</h2>
              <time dateTime={project.date}>{formatDate(project.date)}</time>
            </header>
            {project.text && <p className="project-card__text">{project.text}</p>}
          </div>
          {project.images.length > 0 && (
            <div className="project-card__gallery">
              {project.images.map((src) => (
                <div key={src} className="project-card__image-wrap">
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width:768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </>
      ) : isArt ? (
        <>
          <header className="project-card__header">
            <h2>{project.title}</h2>
            <time dateTime={project.date}>{formatDate(project.date)}</time>
          </header>
          <p className="project-card__text">{project.text}</p>
          {project.images.length > 0 && (
            <div className="project-card__gallery">
              {project.images.map((src) => (
                <ArtProjectImage key={src} src={src} />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <header className="project-card__header">
            <h2>{project.title}</h2>
            <time dateTime={project.date}>{formatDate(project.date)}</time>
          </header>
          {project.text && <p className="project-card__text">{project.text}</p>}
          {project.images.length > 0 && (
            <div className="project-card__gallery">
              {project.images.map((src) => (
                <div key={src} className="project-card__image-wrap">
                  <Image src={src} alt="" fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </article>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}
