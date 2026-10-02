import type { CSSProperties, ReactNode } from 'react';

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  /** Seconds for one full loop */
  duration?: number;
}

/**
 * Infinite horizontal marquee. Children are rendered twice (second copy
 * aria-hidden) and the track translates -50% in a loop.
 */
export function Marquee({ children, className = '', duration = 32 }: MarqueeProps) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="flex w-max animate-marquee"
        style={{ '--marquee-duration': `${duration}s` } as CSSProperties}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
