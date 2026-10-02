import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ParallaxProps {
  children?: ReactNode;
  /** Vertical travel in px as the section crosses the viewport (positive moves down slower) */
  speed?: number;
  className?: string;
}

/**
 * Scroll-driven parallax: the child translates vertically as the
 * section scrolls through the viewport, spring-smoothed. Positive
 * `speed` makes content lag (move slower) relative to the page.
 */
export function Parallax({ children, speed = 60, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  const springY = useSpring(y, { stiffness: 70, damping: 22, mass: 0.6 });

  return (
    <motion.div ref={ref} style={{ y: springY }} className={className}>
      {children}
    </motion.div>
  );
}
