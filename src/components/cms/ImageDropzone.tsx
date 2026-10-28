"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { useOwner, type UploadMode } from "@/context/OwnerContext";

async function uploadImage(file: File, mode: UploadMode): Promise<string> {
  if (mode === "blob") {
    const blob = await upload(`uploads/${file.name}`, file, {
      access: "public",
      handleUploadUrl: "/api/upload",
      contentType: file.type,
      multipart: file.size > 5 * 1024 * 1024,
    });
    return blob.url;
  }

  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) throw new Error(`Upload failed (${res.status})`);
  const { url } = (await res.json()) as { url: string };
  return url;
}

interface ImageDropzoneProps {
  images: string[];
  onChange: (images: string[]) => void;
  disabled?: boolean;
  naturalAspect?: boolean;
}

export function ImageDropzone({
  images,
  onChange,
  disabled = false,
  naturalAspect = false,
}: ImageDropzoneProps) {
  const { uploadMode } = useOwner();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      if (disabled) return;
      setUploading(true);
      setError("");
      const urls: string[] = [...images];
      let failed = 0;
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        try {
          urls.push(await uploadImage(file, uploadMode));
        } catch (err) {
          console.error("Image upload failed", err);
          failed += 1;
        }
      }
      onChange(urls);
      if (failed > 0) {
        setError(
          failed === 1
            ? "One image failed to upload."
            : `${failed} images failed to upload.`
        );
      }
      setUploading(false);
    },
    [disabled, images, onChange, uploadMode]
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
      {error && (
        <p className="owner-bar__error" role="alert">
          {error}
        </p>
      )}
      {images.length > 0 && (
        <div
          className={`image-dropzone__grid${naturalAspect ? " image-dropzone__grid--natural" : ""}`}
        >
          {images.map((src, i) => (
            <NaturalAspectThumb
              key={src}
              src={src}
              naturalAspect={naturalAspect}
              onRemove={!disabled ? () => removeImage(i) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NaturalAspectThumb({
  src,
  naturalAspect,
  onRemove,
}: {
  src: string;
  naturalAspect: boolean;
  onRemove?: () => void;
}) {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  return (
    <div
      className={`image-dropzone__thumb${naturalAspect ? " image-dropzone__thumb--natural" : ""}`}
      style={naturalAspect && aspectRatio ? { aspectRatio: `${aspectRatio}` } : undefined}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="200px"
        className={naturalAspect ? "object-contain" : "object-cover"}
        onLoad={(event) => {
          if (!naturalAspect) return;
          const img = event.currentTarget;
          if (img.naturalWidth > 0 && img.naturalHeight > 0) {
            setAspectRatio(img.naturalWidth / img.naturalHeight);
          }
        }}
      />
      {onRemove && (
        <button
          type="button"
          className="image-dropzone__remove"
          onClick={onRemove}
          aria-label="Remove image"
        >
          ×
        </button>
      )}
    </div>
  );
}
