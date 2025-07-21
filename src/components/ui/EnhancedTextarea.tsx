/**
 * Enhanced Textarea Component
 * Beautiful, auto-resizing textarea with character count and validation
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Type, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'filled' | 'minimal';
  state?: 'default' | 'error' | 'success' | 'warning';
  label?: string;
  helperText?: string;
  maxLength?: number;
  minRows?: number;
  maxRows?: number;
  autoResize?: boolean;
  showCharCount?: boolean;
  resizable?: boolean;
  loading?: boolean;
}

export const EnhancedTextarea = React.forwardRef<HTMLTextAreaElement, EnhancedTextareaProps>(
  ({
    className,
    variant = 'default',
    state = 'default',
    label,
    helperText,
    maxLength,
    minRows = 3,
    maxRows = 10,
    autoResize = true,
    showCharCount = false,
    resizable = true,
    loading = false,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [charCount, setCharCount] = useState(props.value?.toString().length || 0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const combinedRef = ref || textareaRef;

    const baseClasses = "w-full transition-all duration-300 resize-none focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";

    const variantClasses = {
      default: "rounded-xl border-2 bg-white px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 shadow-sm hover:shadow-md",
      filled: "rounded-xl border-0 bg-gray-100 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 hover:bg-gray-50",
      minimal: "border-0 border-b-2 rounded-none bg-transparent px-0 py-3 focus:border-indigo-500"
    };

    const stateClasses = {
      default: "border-gray-200 focus:border-indigo-500",
      error: "border-red-300 focus:border-red-500 focus:ring-red-500/20",
      success: "border-green-300 focus:border-green-500 focus:ring-green-500/20",
      warning: "border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500/20"
    };

    const stateIcons = {
      error: <AlertCircle className="w-4 h-4 text-red-500" />,
      success: <CheckCircle className="w-4 h-4 text-green-500" />,
      warning: <AlertCircle className="w-4 h-4 text-yellow-500" />
    };

    // Auto-resize functionality
    useEffect(() => {
      if (autoResize && combinedRef && 'current' in combinedRef && combinedRef.current) {
        const textarea = combinedRef.current;
        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
        const minHeight = lineHeight * minRows;
        const maxHeight = lineHeight * maxRows;
        
        textarea.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`;
      }
    }, [props.value, autoResize, minRows, maxRows, combinedRef]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setCharCount(value.length);
      
      if (maxLength && value.length > maxLength) {
        return; // Prevent input beyond max length
      }
      
      props.onChange?.(e);
    };

    const getCharCountColor = () => {
      if (!maxLength) return 'text-gray-500';
      const percentage = (charCount / maxLength) * 100;
      if (percentage >= 90) return 'text-red-500';
      if (percentage >= 75) return 'text-yellow-500';
      return 'text-gray-500';
    };

    const toggleExpanded = () => {
      setIsExpanded(!isExpanded);
    };

    return (
      <div className="relative w-full">
        {/* Label */}
        {label && (
          <motion.label
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "block text-sm font-semibold mb-2 transition-colors",
              state === 'error' ? "text-red-700" : "text-gray-700"
            )}
          >
            {label}
          </motion.label>
        )}

        <div className="relative">
          {/* Textarea */}
          <motion.textarea
            ref={combinedRef}
            className={cn(
              baseClasses,
              variantClasses[variant],
              stateClasses[state],
              resizable && "resize-y",
              isExpanded && "fixed inset-4 z-50 h-auto max-h-none",
              loading && "cursor-wait",
              className
            )}
            rows={isExpanded ? 20 : minRows}
            maxLength={maxLength}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleChange}
            whileFocus={{ scale: isExpanded ? 1 : 1.01 }}
            transition={{ duration: 0.2 }}
            {...props}
          />

          {/* Overlay for expanded mode */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={toggleExpanded}
            />
          )}

          {/* Controls */}
          <div className="absolute top-3 right-3 flex items-center space-x-2">
            {/* Loading Spinner */}
            {loading && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-gray-300 border-t-indigo-500 rounded-full"
              />
            )}

            {/* State Icon */}
            {!loading && state !== 'default' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                {stateIcons[state as keyof typeof stateIcons]}
              </motion.div>
            )}

            {/* Expand/Collapse Button */}
            {resizable && (
              <motion.button
                type="button"
                onClick={toggleExpanded}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-md hover:bg-gray-100"
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </motion.button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-2">
          {/* Helper Text */}
          {helperText && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={cn(
                "text-xs font-medium",
                state === 'error' && "text-red-600",
                state === 'success' && "text-green-600",
                state === 'warning' && "text-yellow-600",
                state === 'default' && "text-gray-500"
              )}
            >
              {helperText}
            </motion.p>
          )}

          {/* Character Count */}
          {(showCharCount || maxLength) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className={cn(
                "text-xs font-medium flex items-center space-x-1",
                getCharCountColor()
              )}
            >
              <Type className="w-3 h-3" />
              <span>
                {charCount}
                {maxLength && `/${maxLength}`}
              </span>
            </motion.div>
          )}
        </div>

        {/* Character Limit Progress */}
        {maxLength && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2"
          >
            <div className="w-full bg-gray-200 rounded-full h-1">
              <motion.div
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  charCount / maxLength >= 0.9 ? "bg-red-500" :
                  charCount / maxLength >= 0.75 ? "bg-yellow-500" : "bg-indigo-500"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((charCount / maxLength) * 100, 100)}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}

        {/* Focus Ring Animation */}
        {isFocused && !isExpanded && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className={cn(
              "absolute inset-0 rounded-xl border-2 pointer-events-none",
              state === 'default' && "border-indigo-500/30",
              state === 'error' && "border-red-500/30",
              state === 'success' && "border-green-500/30",
              state === 'warning' && "border-yellow-500/30",
              variant === 'minimal' && "rounded-none"
            )}
          />
        )}
      </div>
    );
  }
);

EnhancedTextarea.displayName = "EnhancedTextarea";

export { EnhancedTextarea };
