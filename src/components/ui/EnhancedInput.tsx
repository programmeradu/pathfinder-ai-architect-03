/**
 * Enhanced Input Component
 * Beautiful, accessible input with animations and validation states
 */

import * as React from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, AlertCircle, CheckCircle, Search, User, Mail, Lock } from "lucide-react"

import { cn } from "@/lib/utils"

export interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'filled' | 'floating' | 'minimal' | 'search';
  state?: 'default' | 'error' | 'success' | 'warning';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  label?: string;
  helperText?: string;
  showPasswordToggle?: boolean;
  loading?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ 
    className, 
    type, 
    variant = 'default',
    state = 'default',
    icon,
    iconPosition = 'left',
    label,
    helperText,
    showPasswordToggle = false,
    loading = false,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(!!props.value || !!props.defaultValue);

    const inputType = type === 'password' && showPassword ? 'text' : type;

    const baseClasses = "flex w-full text-sm transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

    const variantClasses = {
      default: "h-12 rounded-xl border-2 bg-white px-4 py-3 focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:ring-offset-0 shadow-sm hover:shadow-md",
      filled: "h-12 rounded-xl border-0 bg-gray-100 px-4 py-3 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 hover:bg-gray-50",
      floating: "h-16 rounded-xl border-2 bg-white px-4 pt-6 pb-2 focus-visible:ring-2 focus-visible:ring-indigo-500/20 shadow-sm hover:shadow-md",
      minimal: "h-12 border-0 border-b-2 rounded-none bg-transparent px-0 py-3 focus-visible:border-indigo-500",
      search: "h-11 rounded-full border-2 bg-white px-6 py-2 focus-visible:ring-2 focus-visible:ring-indigo-500/20 shadow-sm hover:shadow-md"
    };

    const stateClasses = {
      default: "border-gray-200 focus:border-indigo-500",
      error: "border-red-300 focus:border-red-500 focus-visible:ring-red-500/20",
      success: "border-green-300 focus:border-green-500 focus-visible:ring-green-500/20",
      warning: "border-yellow-300 focus:border-yellow-500 focus-visible:ring-yellow-500/20"
    };

    const stateIcons = {
      error: <AlertCircle className="w-4 h-4 text-red-500" />,
      success: <CheckCircle className="w-4 h-4 text-green-500" />,
      warning: <AlertCircle className="w-4 h-4 text-yellow-500" />
    };

    // Auto-detect icons based on input type
    const getAutoIcon = () => {
      if (icon) return icon;
      
      switch (type) {
        case 'email':
          return <Mail className="w-4 h-4" />;
        case 'password':
          return <Lock className="w-4 h-4" />;
        case 'search':
          return <Search className="w-4 h-4" />;
        default:
          if (variant === 'search') return <Search className="w-4 h-4" />;
          return null;
      }
    };

    const autoIcon = getAutoIcon();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    return (
      <div className="relative w-full">
        {/* Floating Label */}
        {variant === 'floating' && label && (
          <motion.label
            animate={{
              top: isFocused || hasValue ? '0.75rem' : '1.25rem',
              fontSize: isFocused || hasValue ? '0.75rem' : '0.875rem',
              color: isFocused ? (state === 'default' ? '#6366f1' : state === 'error' ? '#ef4444' : '#10b981') : '#6b7280'
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-4 pointer-events-none font-medium z-10"
            style={{ transformOrigin: 'left top' }}
          >
            {label}
          </motion.label>
        )}

        {/* Regular Label */}
        {variant !== 'floating' && label && (
          <motion.label
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            {label}
          </motion.label>
        )}

        <div className="relative">
          {/* Left Icon */}
          {autoIcon && iconPosition === 'left' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className={cn(
                "absolute top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors",
                variant === 'search' ? "left-4" : "left-3",
                isFocused && "text-indigo-500"
              )}
            >
              {autoIcon}
            </motion.div>
          )}

          <motion.input
            type={inputType}
            className={cn(
              baseClasses,
              variantClasses[variant],
              stateClasses[state],
              autoIcon && iconPosition === 'left' && (variant === 'search' ? "pl-12" : "pl-10"),
              (autoIcon && iconPosition === 'right') || showPasswordToggle || state !== 'default' || loading && "pr-12",
              loading && "cursor-wait",
              className
            )}
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleInputChange}
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            {...props}
          />

          {/* Right Icons */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
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
            
            {/* Custom Right Icon */}
            {!loading && autoIcon && iconPosition === 'right' && (
              <div className={cn("text-gray-400 transition-colors", isFocused && "text-indigo-500")}>
                {autoIcon}
              </div>
            )}
            
            {/* Password Toggle */}
            {!loading && showPasswordToggle && type === 'password' && (
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </motion.button>
            )}
          </div>
        </div>

        {/* Helper Text */}
        {helperText && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={cn(
              "mt-2 text-xs font-medium",
              state === 'error' && "text-red-600",
              state === 'success' && "text-green-600",
              state === 'warning' && "text-yellow-600",
              state === 'default' && "text-gray-500"
            )}
          >
            {helperText}
          </motion.p>
        )}

        {/* Focus Ring Animation */}
        {isFocused && (
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
              variant === 'search' && "rounded-full",
              variant === 'minimal' && "rounded-none"
            )}
          />
        )}
      </div>
    );
  }
);
Input.displayName = "EnhancedInput"

export { Input as EnhancedInput };
