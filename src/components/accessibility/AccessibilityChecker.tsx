/**
 * Accessibility Checker - Beautiful A11y Compliance Tool
 * Real-time accessibility scanning and WCAG compliance verification
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX,
  MousePointer,
  Keyboard,
  Contrast,
  Type,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Play,
  Pause,
  Settings,
  Zap,
  Target,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AccessibilityIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  category: 'keyboard' | 'screen-reader' | 'color-contrast' | 'focus' | 'semantic' | 'aria';
  title: string;
  description: string;
  element?: HTMLElement;
  wcagLevel: 'A' | 'AA' | 'AAA';
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  suggestion: string;
}

interface AccessibilityCheckerProps {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  autoScan?: boolean;
}

export const AccessibilityChecker: React.FC<AccessibilityCheckerProps> = ({
  className,
  isOpen,
  onClose,
  autoScan = true
}) => {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [highlightMode, setHighlightMode] = useState(false);
  const [screenReaderMode, setScreenReaderMode] = useState(false);
  const scanIntervalRef = useRef<NodeJS.Timeout>();

  const categories = [
    { id: 'all', label: 'All Issues', icon: Target },
    { id: 'keyboard', label: 'Keyboard', icon: Keyboard },
    { id: 'screen-reader', label: 'Screen Reader', icon: Volume2 },
    { id: 'color-contrast', label: 'Contrast', icon: Contrast },
    { id: 'focus', label: 'Focus', icon: MousePointer },
    { id: 'semantic', label: 'Semantic', icon: Type },
    { id: 'aria', label: 'ARIA', icon: Users },
  ];

  useEffect(() => {
    if (isOpen && autoScan) {
      startScanning();
    }

    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, [isOpen, autoScan]);

  const startScanning = () => {
    setIsScanning(true);
    performAccessibilityScan();
    
    // Set up periodic scanning
    scanIntervalRef.current = setInterval(() => {
      performAccessibilityScan();
    }, 5000);
  };

  const stopScanning = () => {
    setIsScanning(false);
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
  };

  const performAccessibilityScan = () => {
    const foundIssues: AccessibilityIssue[] = [];

    // Scan for missing alt text
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.alt && !img.getAttribute('aria-label')) {
        foundIssues.push({
          id: `img-alt-${index}`,
          type: 'error',
          category: 'screen-reader',
          title: 'Missing Alt Text',
          description: 'Image is missing alternative text for screen readers',
          element: img,
          wcagLevel: 'A',
          impact: 'serious',
          suggestion: 'Add descriptive alt text or aria-label to the image'
        });
      }
    });

    // Scan for missing form labels
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach((input, index) => {
      const hasLabel = input.getAttribute('aria-label') || 
                      input.getAttribute('aria-labelledby') ||
                      document.querySelector(`label[for="${input.id}"]`);
      
      if (!hasLabel) {
        foundIssues.push({
          id: `input-label-${index}`,
          type: 'error',
          category: 'screen-reader',
          title: 'Missing Form Label',
          description: 'Form control is missing an accessible label',
          element: input as HTMLElement,
          wcagLevel: 'A',
          impact: 'critical',
          suggestion: 'Add a label element or aria-label attribute'
        });
      }
    });

    // Scan for keyboard accessibility
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [tabindex]');
    interactiveElements.forEach((element, index) => {
      const tabIndex = element.getAttribute('tabindex');
      if (tabIndex && parseInt(tabIndex) > 0) {
        foundIssues.push({
          id: `tabindex-${index}`,
          type: 'warning',
          category: 'keyboard',
          title: 'Positive Tab Index',
          description: 'Positive tabindex values can disrupt natural tab order',
          element: element as HTMLElement,
          wcagLevel: 'A',
          impact: 'moderate',
          suggestion: 'Use tabindex="0" or remove tabindex to maintain natural order'
        });
      }
    });

    // Scan for color contrast (simplified check)
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a, button');
    textElements.forEach((element, index) => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // Simple contrast check (in real implementation, you'd use a proper contrast ratio calculation)
      if (color === 'rgb(128, 128, 128)' && backgroundColor === 'rgb(255, 255, 255)') {
        foundIssues.push({
          id: `contrast-${index}`,
          type: 'warning',
          category: 'color-contrast',
          title: 'Low Color Contrast',
          description: 'Text may not have sufficient contrast ratio',
          element: element as HTMLElement,
          wcagLevel: 'AA',
          impact: 'moderate',
          suggestion: 'Increase color contrast to meet WCAG AA standards (4.5:1 ratio)'
        });
      }
    });

    // Scan for missing headings hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    headings.forEach((heading, index) => {
      const currentLevel = parseInt(heading.tagName.charAt(1));
      if (currentLevel > previousLevel + 1) {
        foundIssues.push({
          id: `heading-hierarchy-${index}`,
          type: 'warning',
          category: 'semantic',
          title: 'Heading Hierarchy Skip',
          description: 'Heading levels should not skip (e.g., h1 to h3)',
          element: heading as HTMLElement,
          wcagLevel: 'AA',
          impact: 'moderate',
          suggestion: 'Use proper heading hierarchy without skipping levels'
        });
      }
      previousLevel = currentLevel;
    });

    // Scan for missing ARIA attributes
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button, index) => {
      if (button.textContent?.trim() === '' && !button.getAttribute('aria-label')) {
        foundIssues.push({
          id: `button-aria-${index}`,
          type: 'error',
          category: 'aria',
          title: 'Button Missing Accessible Name',
          description: 'Button has no visible text or aria-label',
          element: button,
          wcagLevel: 'A',
          impact: 'critical',
          suggestion: 'Add visible text or aria-label to describe the button\'s purpose'
        });
      }
    });

    setIssues(foundIssues);
  };

  const filteredIssues = selectedCategory === 'all' 
    ? issues 
    : issues.filter(issue => issue.category === selectedCategory);

  const getIssueIcon = (type: AccessibilityIssue['type']) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: AccessibilityIssue['impact']) => {
    switch (impact) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'serious':
        return 'bg-orange-100 text-orange-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'minor':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const highlightElement = (element: HTMLElement) => {
    if (!highlightMode) return;
    
    element.style.outline = '3px solid #ef4444';
    element.style.outlineOffset = '2px';
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    setTimeout(() => {
      element.style.outline = '';
      element.style.outlineOffset = '';
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const accessibilityScore = Math.max(0, 100 - (issues.length * 5));

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="h-full border-0 rounded-none">
          <CardHeader className="border-b bg-gradient-to-r from-purple-500 to-pink-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Eye className="w-6 h-6" />
                <div>
                  <CardTitle className="text-white">Accessibility Checker</CardTitle>
                  <p className="text-white/80 text-sm">
                    WCAG compliance scanner • {issues.length} issues found
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge className={cn("text-xs", getScoreColor(accessibilityScore))}>
                  Score: {accessibilityScore}%
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={isScanning ? stopScanning : startScanning}
                  className="text-white hover:bg-white/20"
                >
                  {isScanning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 h-full overflow-hidden flex flex-col">
            {/* Controls */}
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Accessibility Tools</h3>
                <Badge className={cn(
                  "text-xs",
                  isScanning ? "bg-green-100 text-green-800 animate-pulse" : "bg-gray-100 text-gray-800"
                )}>
                  {isScanning ? 'Scanning' : 'Stopped'}
                </Badge>
              </div>
              
              <div className="flex space-x-2 mb-4">
                <Button
                  variant={highlightMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setHighlightMode(!highlightMode)}
                >
                  <Target className="w-4 h-4 mr-1" />
                  Highlight
                </Button>
                <Button
                  variant={screenReaderMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setScreenReaderMode(!screenReaderMode)}
                >
                  <Volume2 className="w-4 h-4 mr-1" />
                  SR Mode
                </Button>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-colors",
                      selectedCategory === category.id
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    <category.icon className="w-3 h-3" />
                    <span>{category.label}</span>
                    {category.id !== 'all' && (
                      <Badge className="bg-white/50 text-xs">
                        {issues.filter(i => i.category === category.id).length}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Issues List */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredIssues.length > 0 ? (
                <div className="space-y-4">
                  <AnimatePresence>
                    {filteredIssues.map((issue, index) => (
                      <motion.div
                        key={issue.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => issue.element && highlightElement(issue.element)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="mt-1">
                            {getIssueIcon(issue.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 truncate">
                                {issue.title}
                              </h4>
                              <div className="flex items-center space-x-2">
                                <Badge className={cn("text-xs", getImpactColor(issue.impact))}>
                                  {issue.impact}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  WCAG {issue.wcagLevel}
                                </Badge>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3">
                              {issue.description}
                            </p>
                            
                            <div className="bg-blue-50 rounded-lg p-3">
                              <h5 className="text-xs font-semibold text-blue-900 mb-1">
                                Suggestion:
                              </h5>
                              <p className="text-xs text-blue-800">
                                {issue.suggestion}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {selectedCategory === 'all' ? 'No Issues Found!' : `No ${selectedCategory} Issues`}
                  </h3>
                  <p className="text-gray-600">
                    {selectedCategory === 'all' 
                      ? 'Your page meets accessibility standards for the scanned criteria.'
                      : `No issues found in the ${selectedCategory} category.`
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Summary Footer */}
            <div className="border-t bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{filteredIssues.length}</span> issues found
                  {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Accessibility Score:</span>
                  <span className={cn("text-lg font-bold", getScoreColor(accessibilityScore))}>
                    {accessibilityScore}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
