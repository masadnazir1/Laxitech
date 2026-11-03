// Ambient TypeScript declaration for <mockup-player> custom element.
// Picked up automatically by TypeScript across all .tsx files.
import type React from 'react';

export interface MockupPlayerAttributes {
  'mockup-id'?: string;
  designer?: string;
  studio?: string;
  'studio-root'?: string;
  'aspect-ratio'?: string;
  width?: string;
  height?: string;
  theme?: 'light' | 'dark';
  loader?: string;
  progressive?: string;
  'low-bandwidth'?: string;
  debug?: string;
  trigger?: 'load' | 'click' | 'hover' | 'scroll' | 'inview' | 'mousemove';
  'trigger-delay'?: string;
  'trigger-loop'?: string;
  'trigger-target'?: 'object' | 'scene';
  'trigger-restart'?: string;
  'trigger-range'?: string;
  'trigger-affect-page'?: string;
  'trigger-axis'?: 'vertical' | 'horizontal';
  'trigger-threshold'?: string;
  'cursor-enabled'?: string;
  'cursor-affect-page'?: string;
  'cursor-range'?: string;
  'click-enabled'?: string;
  'click-range'?: string;
  'shake-enabled'?: string;
  'shake-intensity'?: string;
  'shake-z'?: string;
  'shake-angle'?: string;
  'shake-duration'?: string;
  'zoom-enabled'?: string;
  'zoom-mode'?: 'fov' | 'dolly';
  'zoom-amount'?: string;
  'zoom-duration'?: string;
  'camera-zoom'?: string;
  'background-color'?: string;
  'background-transparent'?: string;
  'data-screen-src'?: string;
  'data-project-title'?: string;
  'data-initial-time'?: string;
}

type MockupPlayerElementProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
> &
  MockupPlayerAttributes;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'mockup-player': MockupPlayerElementProps;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'mockup-player': MockupPlayerElementProps;
    }
  }
}
