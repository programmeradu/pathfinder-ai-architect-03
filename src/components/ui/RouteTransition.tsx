/**
 * Route Transition Component
 * Beautiful page transitions with smooth animations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface RouteTransitionProps {
  children: React.ReactNode;
  variant?: 'fade' | 'slide' | 'scale' | 'blur';
}

// Animation variants for different transition types
const transitionVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: "easeInOut" }
  },
  slide: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
    transition: { duration: 0.3, ease: "easeInOut" }
  },
  blur: {
    initial: { opacity: 0, filter: "blur(10px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
    exit: { opacity: 0, filter: "blur(10px)" },
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export const RouteTransition: React.FC<RouteTransitionProps> = ({ 
  children, 
  variant = 'fade' 
}) => {
  const location = useLocation();
  const selectedVariant = transitionVariants[variant];

  return (
    <motion.div
      key={location.pathname}
      initial={selectedVariant.initial}
      animate={selectedVariant.animate}
      exit={selectedVariant.exit}
      transition={selectedVariant.transition}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

// Page wrapper with enhanced transitions
export const PageTransition: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.5, 
        ease: "easeOut",
        staggerChildren: 0.1
      }}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

// Staggered children animation wrapper
export const StaggeredTransition: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0.1 }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: delay,
            delayChildren: 0.2
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

// Individual item animation for staggered lists
export const StaggeredItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.5, ease: "easeOut" }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default RouteTransition;
