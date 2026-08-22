import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  /** Seconds to wait before the reveal starts */
  delay?: number;
  /** Initial vertical offset in px */
  y?: number;
  /** Initial horizontal offset in px */
  x?: number;
  /** Initial scale */
  scale?: number;
  className?: string;
  once?: boolean;
}

/**
 * Scroll-triggered reveal. Fades/slides content in the first time it
 * enters the viewport with a buttery ease curve.
 */
export function Reveal({ children, delay = 0, y = 32, x = 0, scale = 1, className, once = true }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x, scale }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once, margin: '-70px' }}
      transition={{ duration: 0.75, delay, ease: [0.21, 0.65, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
