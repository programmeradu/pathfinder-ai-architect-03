/**
 * Loading Spinner Component
 * Reusable loading spinner with different sizes and variants
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'secondary' | 'muted';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const variantClasses = {
  default: 'text-gray-600',
  primary: 'text-primary',
  secondary: 'text-secondary',
  muted: 'text-muted-foreground',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className,
  text,
}) => {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Loader2 
        className={cn(
          'animate-spin',
          sizeClasses[size],
          variantClasses[variant]
        )} 
      />
      {text && (
        <span className={cn('ml-2 text-sm', variantClasses[variant])}>
          {text}
        </span>
      )}
    </div>
  );
};
