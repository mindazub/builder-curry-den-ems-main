import React from 'react';
import { motion, AnimatePresence } from "framer-motion";

// Animation presets - easy to switch between
export const animationPresets = {
  // Current: Simple fade
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: "easeInOut" }
  },
  
  // Option A: Slide from right
  slideRight: {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
    transition: { duration: 0.2, ease: "easeOut" }
  },
  
  // Option B: Scale/zoom
  scale: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.05, opacity: 0 },
    transition: { duration: 0.2, ease: "easeOut" }
  },
  
  // Option C: Vertical slide (CURRENT)
  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
    transition: { duration: 0.2, ease: "easeOut" }
  },
  
  // Option D: Instant (minimal animation)
  instant: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.1 }
  },
  
  // Option E: Bounce effect
  bounce: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
    transition: { type: "spring", stiffness: 260, damping: 20 }
  },
  
  // Option F: Rotate fade
  rotate: {
    initial: { rotate: -2, opacity: 0 },
    animate: { rotate: 0, opacity: 1 },
    exit: { rotate: 2, opacity: 0 },
    transition: { duration: 0.25, ease: "easeOut" }
  },
  
  // Option G: Slide from left
  slideLeft: {
    initial: { x: -50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 50, opacity: 0 },
    transition: { duration: 0.2, ease: "easeOut" }
  },
  
  // Option H: Slide down
  slideDown: {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
    transition: { duration: 0.2, ease: "easeOut" }
  },
  
  // Option I: Scale with blur effect (if supported)
  scaleBlur: {
    initial: { scale: 0.98, opacity: 0, filter: "blur(2px)" },
    animate: { scale: 1, opacity: 1, filter: "blur(0px)" },
    exit: { scale: 1.02, opacity: 0, filter: "blur(2px)" },
    transition: { duration: 0.25, ease: "easeOut" }
  },
  
  // Option J: Gentle elastic
  elastic: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.1, opacity: 0 },
    transition: { type: "spring", stiffness: 300, damping: 25, duration: 0.3 }
  }
};

// Type for animation preset names
export type AnimationPreset = keyof typeof animationPresets;

// Helper function to get animation props
export const getAnimationProps = (preset: AnimationPreset) => animationPresets[preset];

// Simple component for testing animations
export const AnimationTester: React.FC<{
  children: React.ReactNode;
  preset: AnimationPreset;
  isVisible: boolean;
  className?: string;
}> = ({ children, preset, isVisible, className = "" }) => {
  const animProps = getAnimationProps(preset);
  
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={`${preset}-${isVisible}`}
          initial={animProps.initial}
          animate={animProps.animate}
          exit={animProps.exit}
          transition={animProps.transition}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
