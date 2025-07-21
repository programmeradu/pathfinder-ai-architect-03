/**
 * Enhanced Select Component
 * Beautiful, searchable select with animations and custom styling
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface EnhancedSelectProps {
  options: Option[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  searchable?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  className?: string;
  variant?: 'default' | 'minimal' | 'filled';
  size?: 'sm' | 'md' | 'lg';
}

export const EnhancedSelect: React.FC<EnhancedSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  searchable = false,
  multiple = false,
  disabled = false,
  loading = false,
  error = false,
  className,
  variant = 'default',
  size = 'md'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const selectRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];
  
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-sm',
    lg: 'h-13 px-5 text-base'
  };

  const variantClasses = {
    default: 'border-2 border-gray-200 bg-white hover:border-gray-300 focus-within:border-indigo-500',
    minimal: 'border-0 border-b-2 border-gray-200 bg-transparent hover:border-gray-300 focus-within:border-indigo-500 rounded-none',
    filled: 'border-0 bg-gray-100 hover:bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20'
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const newValue = selectedValues.includes(optionValue)
        ? selectedValues.filter(v => v !== optionValue)
        : [...selectedValues, optionValue];
      onChange(newValue);
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple) {
      onChange(selectedValues.filter(v => v !== optionValue));
    } else {
      onChange('');
    }
  };

  const getSelectedLabel = () => {
    if (selectedValues.length === 0) return placeholder;
    if (selectedValues.length === 1) {
      const option = options.find(opt => opt.value === selectedValues[0]);
      return option?.label || selectedValues[0];
    }
    return `${selectedValues.length} selected`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          handleSelect(filteredOptions[focusedIndex].value);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setFocusedIndex(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;
    }
  };

  return (
    <div ref={selectRef} className={cn("relative w-full", className)}>
      {/* Trigger */}
      <motion.div
        whileTap={{ scale: 0.99 }}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        className={cn(
          "flex items-center justify-between rounded-lg cursor-pointer transition-all duration-200",
          sizeClasses[size],
          variantClasses[variant],
          error && "border-red-300 focus-within:border-red-500",
          disabled && "opacity-50 cursor-not-allowed",
          isOpen && "ring-2 ring-indigo-500/20",
          className
        )}
      >
        <div className="flex items-center flex-1 min-w-0">
          {/* Selected Values */}
          {multiple && selectedValues.length > 0 ? (
            <div className="flex flex-wrap gap-1 mr-2">
              {selectedValues.slice(0, 3).map(val => {
                const option = options.find(opt => opt.value === val);
                return (
                  <motion.span
                    key={val}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-md"
                  >
                    {option?.label || val}
                    <button
                      onClick={(e) => handleRemove(val, e)}
                      className="ml-1 hover:text-indigo-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                );
              })}
              {selectedValues.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                  +{selectedValues.length - 3} more
                </span>
              )}
            </div>
          ) : (
            <span className={cn(
              "truncate",
              selectedValues.length === 0 ? "text-gray-500" : "text-gray-900"
            )}>
              {getSelectedLabel()}
            </span>
          )}
        </div>

        {/* Loading or Arrow */}
        <div className="flex items-center space-x-2">
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-gray-300 border-t-indigo-500 rounded-full"
            />
          ) : (
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-hidden"
          >
            {/* Search */}
            {searchable && (
              <div className="p-3 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search options..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Options */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = selectedValues.includes(option.value);
                  const isFocused = index === focusedIndex;
                  
                  return (
                    <motion.div
                      key={option.value}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => !option.disabled && handleSelect(option.value)}
                      className={cn(
                        "flex items-center px-4 py-3 cursor-pointer transition-colors",
                        option.disabled && "opacity-50 cursor-not-allowed",
                        isFocused && "bg-indigo-50",
                        isSelected && "bg-indigo-100 text-indigo-900",
                        !option.disabled && !isFocused && !isSelected && "hover:bg-gray-50"
                      )}
                    >
                      {option.icon && (
                        <div className="mr-3 flex-shrink-0">
                          {option.icon}
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{option.label}</div>
                        {option.description && (
                          <div className="text-sm text-gray-500 truncate">
                            {option.description}
                          </div>
                        )}
                      </div>
                      
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-2 text-indigo-600"
                        >
                          <Check className="w-4 h-4" />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
