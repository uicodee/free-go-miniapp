import { AnimatePresence, motion } from "motion/react";

interface AnimatedProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
}

export function Animated({
  children,
  className,
  duration = 0.25,
  delay = 0,
}: AnimatedProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: 6, filter: "blur(6px)" }}
        transition={{ duration, delay: 0.04 + delay, ease: "easeOut" }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
