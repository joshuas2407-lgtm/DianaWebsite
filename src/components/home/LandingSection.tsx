"use client";

import { EditableBio } from "@/components/cms/EditableBio";

interface LandingSectionProps {
  bio: string;
}

export function LandingSection({ bio }: LandingSectionProps) {
  return (
    <section className="snap-section landing">
      <div className="landing__peek" aria-hidden>
        <div className="landing__peek-grid">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
      <h1 className="landing__hey">Hey</h1>
      <div className="bio-panel">
        <EditableBio initialBio={bio} />
      </div>
      <div className="landing__scroll-hint" aria-hidden>
        <span>Scroll</span>
        <span className="landing__scroll-line" />
      </div>
    </section>
  );
}
