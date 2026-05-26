"use client";

import { useEffect, useState } from "react";
import { useOwner } from "@/context/OwnerContext";

interface EditableBioProps {
  initialBio: string;
}

export function EditableBio({ initialBio }: EditableBioProps) {
  const { isOwner } = useOwner();
  const [bio, setBio] = useState(initialBio);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setBio(initialBio);
  }, [initialBio]);

  const save = async (value: string) => {
    setSaving(true);
    await fetch("/api/content", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bio: value }),
    });
    setSaving(false);
  };

  if (!isOwner) {
    return <p className="bio-panel__text">{bio}</p>;
  }

  return (
    <div className="bio-panel__edit">
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        onBlur={() => void save(bio)}
        placeholder="Write a short bio or introduction…"
        rows={5}
      />
      {saving && <span className="bio-panel__saving">Saving…</span>}
    </div>
  );
}
