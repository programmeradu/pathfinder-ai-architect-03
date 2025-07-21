/**
 * Beautiful Loading Spinner Component
 * Elegant loading states with multiple variants
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'pulse' | 'orbit' | 'wave';
  className?: string;
  color?: 'primary' | 'secondary' | 'white' | 'gray';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const colorClasses = {
  primary: 'text-indigo-600',
  secondary: 'text-purple-600',
  white: 'text-white',
  gray: 'text-gray-600',
};

// Default spinning loader
const DefaultSpinner: React.FC<{ size: string; color: string; className?: string }> = ({ 
  size, 
  color, 
  className 
}) => (
  <motion.div
    className={cn(size, className)}
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  >
    <svg
      className={cn("w-full h-full", color)}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  </motion.div>
);

// Dots loader
const DotsSpinner: React.FC<{ size: string; color: string; className?: string }> = ({ 
  size, 
  color, 
  className 
}) => {
  const dotSize = size === 'w-4 h-4' ? 'w-1 h-1' : 
                 size === 'w-6 h-6' ? 'w-1.5 h-1.5' :
                 size === 'w-8 h-8' ? 'w-2 h-2' : 'w-3 h-3';

  return (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn(dotSize, "rounded-full bg-current", color)}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};

// Pulse loader
const PulseSpinner: React.FC<{ size: string; color: string; className?: string }> = ({ 
  size, 
  color, 
  className 
}) => (
  <motion.div
    className={cn(size, "rounded-full bg-current", color, className)}
    animate={{
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
    }}
    transition={{
      duration: 1.5,
      repeat: Infinity,
    }}
  />
);

// Orbit loader
const OrbitSpinner: React.FC<{ size: string; color: string; className?: string }> = ({ 
  size, 
  color, 
  className 
}) => {
  const orbitSize = size === 'w-4 h-4' ? 'w-8 h-8' : 
                   size === 'w-6 h-6' ? 'w-12 h-12' :
                   size === 'w-8 h-8' ? 'w-16 h-16' : 'w-20 h-20';

  const dotSize = size === 'w-4 h-4' ? 'w-1 h-1' : 
                 size === 'w-6 h-6' ? 'w-1.5 h-1.5' :
                 size === 'w-8 h-8' ? 'w-2 h-2' : 'w-2.5 h-2.5';

  return (
    <div className={cn("relative", orbitSize, className)}>
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className={cn(dotSize, "absolute top-0 left-1/2 transform -translate-x-1/2 rounded-full bg-current", color)} />
      </motion.div>
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      >
        <div className={cn(dotSize, "absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded-full bg-current opacity-60", color)} />
      </motion.div>
    </div>
  );
};

// Wave loader
const WaveSpinner: React.FC<{ size: string; color: string; className?: string }> = ({ 
  size, 
  color, 
  className 
}) => {
  const barHeight = size === 'w-4 h-4' ? 'h-4' : 
                   size === 'w-6 h-6' ? 'h-6' :
                   size === 'w-8 h-8' ? 'h-8' : 'h-12';

  return (
    <div className={cn("flex items-end space-x-1", className)}>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className={cn("w-1 bg-current", barHeight, color)}
          animate={{
            scaleY: [1, 0.3, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className,
  color = 'primary',
}) => {
  const sizeClass = sizeClasses[size];
  const colorClass = colorClasses[color];

  const spinnerComponents = {
    default: DefaultSpinner,
    dots: DotsSpinner,
    pulse: PulseSpinner,
    orbit: OrbitSpinner,
    wave: WaveSpinner,
  };

  const SpinnerComponent = spinnerComponents[variant];

  return (
    <div className="flex items-center justify-center">
      <SpinnerComponent 
        size={sizeClass} 
        color={colorClass} 
        className={className}
      />
    </div>
  );
};

// Convenience components for common use cases
export const PageLoader: React.FC<{ message?: string }> = ({ message = "Loading..." }) => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
    <LoadingSpinner size="xl" variant="orbit" />
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-4 text-gray-600 font-medium"
    >
      {message}
    </motion.p>
  </div>
);

export const InlineLoader: React.FC<{ message?: string }> = ({ message }) => (
  <div className="flex items-center space-x-3 py-4">
    <LoadingSpinner size="sm" variant="dots" />
    {message && (
      <span className="text-sm text-gray-600">{message}</span>
    )}
  </div>
);

export const ButtonLoader: React.FC = () => (
  <LoadingSpinner size="sm" color="white" />
);

export default LoadingSpinner;
