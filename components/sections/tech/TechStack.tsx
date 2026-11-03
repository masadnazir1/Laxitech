'use client';

import React from 'react';
import { LogoCloud } from '@/components/ui/logo-cloud-2';

/**
 * Section 02: Tech Stack / Collaboration
 * Implemented using the exact 21st.dev @efferd/components/logo-cloud-2 pattern requested.
 */
export function TechStack() {
  return (
    <div className="w-full place-content-center px-4 py-16 md:py-24">
      <section className="relative mx-auto grid max-w-3xl">
        <h2 className="mb-6 text-center font-medium text-lg text-muted-foreground tracking-tight md:text-2xl">
          The technologies behind your next chapter.
        </h2>

        <LogoCloud />
      </section>
    </div>
  );
}
