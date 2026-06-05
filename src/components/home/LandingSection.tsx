"use client";

import { EditableBio } from "@/components/cms/EditableBio";

interface LandingSectionProps {
  bio: string;
}

export function LandingSection({ bio }: LandingSectionProps) {
  return (
    <section className="snap-section landing">
      <h1 className="landing__hey">Hey</h1>
      <div className="bio-panel" aria-label="Introduction">
        <EditableBio initialBio={bio} />
      </div>
      <div className="landing__scroll-hint" aria-hidden>
        <span>Scroll</span>
        <span className="landing__scroll-line" />
      </div>
    </section>
  );
}