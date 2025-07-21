/**
 * Beautiful Form Field Component
 * Comprehensive form field with validation, animations, and accessibility
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  children: React.ReactNode;
  label?: string;
  description?: string;
  error?: string;
  success?: string;
  warning?: string;
  required?: boolean;
  className?: string;
  variant?: 'default' | 'floating' | 'inline';
}

export const FormField: React.FC<FormFieldProps> = ({
  children,
  label,
  description,
  error,
  success,
  warning,
  required = false,
  className,
  variant = 'default'
}) => {
  const hasError = !!error;
  const hasSuccess = !!success;
  const hasWarning = !!warning;
  const hasMessage = hasError || hasSuccess || hasWarning;

  const getMessageIcon = () => {
    if (hasError) return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (hasSuccess) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (hasWarning) return <Info className="w-4 h-4 text-yellow-500" />;
    return null;
  };

  const getMessageText = () => {
    if (hasError) return error;
    if (hasSuccess) return success;
    if (hasWarning) return warning;
    return '';
  };

  const getMessageColor = () => {
    if (hasError) return 'text-red-600';
    if (hasSuccess) return 'text-green-600';
    if (hasWarning) return 'text-yellow-600';
    return '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("space-y-2", className)}
    >
      {/* Label */}
      {variant !== 'floating' && label && (
        <motion.label
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "block text-sm font-semibold transition-colors",
            hasError ? "text-red-700" : "text-gray-700"
          )}
        >
          {label}
          {required && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-red-500 ml-1"
            >
              *
            </motion.span>
          )}
        </motion.label>
      )}

      {/* Description */}
      {description && variant !== 'floating' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-gray-600"
        >
          {description}
        </motion.p>
      )}

      {/* Form Control */}
      <div className="relative">
        {children}
      </div>

      {/* Message */}
      <AnimatePresence mode="wait">
        {hasMessage && (
          <motion.div
            key={getMessageText()}
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              "flex items-center space-x-2 text-sm font-medium",
              getMessageColor()
            )}
          >
            {getMessageIcon()}
            <span>{getMessageText()}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Form Group for organizing multiple fields
interface FormGroupProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  variant?: 'default' | 'card' | 'section';
}

export const FormGroup: React.FC<FormGroupProps> = ({
  children,
  title,
  description,
  className,
  variant = 'default'
}) => {
  const baseClasses = "space-y-6";
  
  const variantClasses = {
    default: "",
    card: "p-6 bg-white rounded-xl border border-gray-200 shadow-sm",
    section: "p-6 bg-gray-50 rounded-xl border border-gray-200"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(baseClasses, variantClasses[variant], className)}
    >
      {title && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="border-b border-gray-200 pb-4"
        >
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </motion.div>
      )}
      
      <div className="space-y-6">
        {children}
      </div>
    </motion.div>
  );
};

// Form Row for side-by-side fields
interface FormRowProps {
  children: React.ReactNode;
  className?: string;
  gap?: 'sm' | 'md' | 'lg';
}

export const FormRow: React.FC<FormRowProps> = ({
  children,
  className,
  gap = 'md'
}) => {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-6',
    lg: 'gap-8'
  };

  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  );
};

// Form Actions for buttons
interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'between';
}

export const FormActions: React.FC<FormActionsProps> = ({
  children,
  className,
  align = 'right'
}) => {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={cn(
        "flex items-center space-x-4 pt-6 border-t border-gray-200",
        alignClasses[align],
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default FormField;
