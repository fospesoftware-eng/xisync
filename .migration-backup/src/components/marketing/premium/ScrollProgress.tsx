import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Thin gradient progress bar pinned to the top of the viewport.
 * Fills left-to-right with the XiSync brand gradient (blue → cyan → green)
 * as the user scrolls the page.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-xisync-blue-700 via-xisync-cyan-500 to-xisync-green-500"
      style={{ scaleX }}
    />
  );
}
