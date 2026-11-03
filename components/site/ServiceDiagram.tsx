'use client';

import { ArrowRight } from 'lucide-react';
import type { ServiceKind } from '@/data/laxitechSite';
import { EngineeringIllustration } from '@/components/illustrations/EngineeringIllustration';

export function ServiceDiagram({ kind, nodes, label }: { kind: ServiceKind; nodes: readonly string[]; label: string }) {
  return (
    <div className="site-engineering-visual">
      <EngineeringIllustration kind={kind} label={label} />
      <ul className="site-art-legend" aria-label={`${label} components`}>
        {nodes.map((node, index) => <li key={node}><span>{node}</span>{index < nodes.length - 1 && <ArrowRight aria-hidden="true" />}</li>)}
      </ul>
    </div>
  );
}
