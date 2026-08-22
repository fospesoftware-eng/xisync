import type { MouseEvent } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

/**
 * Mouse-driven parallax: tracks the cursor over an element and exposes
 * spring-smoothed x/y motion values. Apply to layered elements with
 * different `strength` values to create depth on hover/mouse move.
 */
export function useMouseParallax(strength = 24) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 16, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 55, damping: 16, mass: 0.4 });

  function onMouseMove(e: MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * strength);
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * strength);
  }

  return { onMouseMove, mx, my, sx, sy };
}
