"use client";

import { useState } from "react";
import Image from "next/image";

interface ArtProjectImageProps {
  src: string;
  framed?: boolean;
}

export function ArtProjectImage({ src, framed = false }: ArtProjectImageProps) {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  const canvas = (
    <div
      className="project-card__image-canvas"
      style={aspectRatio ? { aspectRatio: `${aspectRatio}` } : undefined}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-contain"
        onLoad={(event) => {
          const img = event.currentTarget;
          if (img.naturalWidth > 0 && img.naturalHeight > 0) {
            setAspectRatio(img.naturalWidth / img.naturalHeight);
          }
        }}
      />
    </div>
  );

  if (framed) {
    return (
      <div className="project-card__image-wrap project-card__image-wrap--framed">
        {canvas}
      </div>
    );
  }

  return <div className="project-card__image-wrap">{canvas}</div>;
}
