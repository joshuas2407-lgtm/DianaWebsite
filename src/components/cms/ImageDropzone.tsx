"use client";

import { useCallback, useState } from "react";
import Image from "next/image";

interface ImageDropzoneProps {
  images: string[];
  onChange: (images: string[]) => void;
  disabled?: boolean;
}

export function ImageDropzone({
  images,
  onChange,
  disabled = false,
}: ImageDropzoneProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      if (disabled) return;
      setUploading(true);
      const urls: string[] = [...images];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const { url } = (await res.json()) as { url: string };
          urls.push(url);
        }
      }
      onChange(urls);
      setUploading(false);
    },
    [disabled, images, onChange]
  );

  const removeImage = (index: number) => {
    if (disabled) return;
    onChange(images.filter((_, i) => i !== index));
  };

  if (disabled && images.length === 0) return null;

  return (
    <div className="image-dropzone">
      {!disabled && (
        <div
          className={`image-dropzone__area ${dragOver ? "image-dropzone__area--active" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            void uploadFiles(e.dataTransfer.files);
          }}
        >
          <p>{uploading ? "Uploading…" : "Drop images here or click to browse"}</p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files) void uploadFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      )}
      {images.length > 0 && (
        <div className="image-dropzone__grid">
          {images.map((src, i) => (
            <div key={src} className="image-dropzone__thumb">
              <Image src={src} alt="" fill sizes="200px" className="object-cover" />
              {!disabled && (
                <button
                  type="button"
                  className="image-dropzone__remove"
                  onClick={() => removeImage(i)}
                  aria-label="Remove image"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
