/**
 * Global Search - Beautiful Intelligent Search
 * Advanced search with AI-powered suggestions, filters, and real-time results
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  Filter, 
  Clock, 
  TrendingUp,
  MapPin,
  DollarSign,
  Briefcase,
  GraduationCap,
  Star,
  Zap,
  ArrowRight,
  Command
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedInput } from '@/components/ui/EnhancedInput';
import { useDebouncedAPI } from '@/hooks/useAPI';
import { useRecentSearches } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  type: 'job' | 'company' | 'skill' | 'course' | 'person' | 'article';
  title: string;
  description: string;
  metadata: {
    location?: string;
    salary?: { min: number; max: number };
    company?: string;
    skills?: string[];
    rating?: number;
    verified?: boolean;
  };
  relevanceScore: number;
  url: string;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'query' | 'filter' | 'recent';
  category?: string;
  count?: number;
}

interface GlobalSearchProps {
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  className,
  isOpen,
  onClose,
  placeholder = "Search jobs, skills, companies..."
}) => {
  const [query, setQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedResult, setSelectedResult] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const { searches, addSearch, clearSearches } = useRecentSearches();

  // Debounced search API call
  const { data: searchResults, loading } = useDebouncedAPI<SearchResult[]>(
    ['search', query, selectedFilters],
    async () => {
      if (!query.trim()) return [];
      
      // Mock API call - replace with actual search endpoint
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return mockSearchResults.filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase())
      );
    },
    300,
    { enabled: query.length > 2 }
  );

  // Mock search suggestions
  const suggestions: SearchSuggestion[] = [
    { id: '1', text: 'React Developer', type: 'query', count: 1250 },
    { id: '2', text: 'Remote Jobs', type: 'filter', category: 'location', count: 890 },
    { id: '3', text: 'Senior Frontend', type: 'query', count: 567 },
    { id: '4', text: 'TypeScript', type: 'query', count: 445 },
    { id: '5', text: 'San Francisco', type: 'filter', category: 'location', count: 334 },
  ];

  // Mock search results
  const mockSearchResults: SearchResult[] = [
    {
      id: '1',
      type: 'job',
      title: 'Senior React Developer',
      description: 'Join our team building next-generation web applications with React, TypeScript, and modern tools.',
      metadata: {
        location: 'San Francisco, CA',
        salary: { min: 140000, max: 180000 },
        company: 'TechCorp',
        skills: ['React', 'TypeScript', 'Node.js'],
        verified: true
      },
      relevanceScore: 95,
      url: '/jobs/1'
    },
    {
      id: '2',
      type: 'company',
      title: 'TechCorp',
      description: 'Leading technology company focused on AI and machine learning solutions.',
      metadata: {
        location: 'San Francisco, CA',
        rating: 4.8,
        verified: true
      },
      relevanceScore: 88,
      url: '/companies/techcorp'
    },
    {
      id: '3',
      type: 'skill',
      title: 'React Development',
      description: 'Master React.js with hooks, context, and modern patterns.',
      metadata: {
        rating: 4.9,
        verified: true
      },
      relevanceScore: 92,
      url: '/skills/react'
    },
    {
      id: '4',
      type: 'course',
      title: 'Advanced React Patterns',
      description: 'Learn advanced React patterns and best practices from industry experts.',
      metadata: {
        rating: 4.7,
        skills: ['React', 'JavaScript', 'TypeScript']
      },
      relevanceScore: 85,
      url: '/courses/advanced-react'
    }
  ];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedResult(prev => 
            prev < (searchResults?.length || 0) - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedResult(prev => prev > -1 ? prev - 1 : prev);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedResult >= 0 && searchResults?.[selectedResult]) {
            handleResultClick(searchResults[selectedResult]);
          } else if (query.trim()) {
            handleSearch(query);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedResult, searchResults, query, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      addSearch(searchQuery.trim());
      // Navigate to search results page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      onClose();
    }
  };

  const handleResultClick = (result: SearchResult) => {
    addSearch(query);
    window.location.href = result.url;
    onClose();
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'filter') {
      setSelectedFilters(prev => [...prev, suggestion.text]);
    } else {
      setQuery(suggestion.text);
      handleSearch(suggestion.text);
    }
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'job':
        return <Briefcase className="w-5 h-5 text-blue-500" />;
      case 'company':
        return <Star className="w-5 h-5 text-purple-500" />;
      case 'skill':
        return <Zap className="w-5 h-5 text-green-500" />;
      case 'course':
        return <GraduationCap className="w-5 h-5 text-orange-500" />;
      case 'person':
        return <Star className="w-5 h-5 text-pink-500" />;
      case 'article':
        return <Star className="w-5 h-5 text-indigo-500" />;
      default:
        return <Search className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatSalary = (salary: { min: number; max: number }) => {
    return `$${(salary.min / 1000).toFixed(0)}K - $${(salary.max / 1000).toFixed(0)}K`;
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex items-start justify-center pt-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full max-w-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
            <CardContent className="p-0">
              {/* Search Input */}
              <div className="p-6 border-b">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-12 pr-20 py-4 text-lg border-0 focus:outline-none bg-transparent"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className={cn(
                        "text-gray-400 hover:text-gray-600",
                        showFilters && "text-indigo-600"
                      )}
                    >
                      <Filter className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Keyboard Shortcut Hint */}
                <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                  <span>Press Enter to search</span>
                  <div className="flex items-center space-x-2">
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">↑↓</kbd>
                    <span>to navigate</span>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">ESC</kbd>
                    <span>to close</span>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-b bg-gray-50"
                  >
                    <div className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {['Remote', 'Full-time', 'Senior Level', '$100K+', 'Tech'].map((filter) => (
                          <Button
                            key={filter}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedFilters(prev => 
                                prev.includes(filter) 
                                  ? prev.filter(f => f !== filter)
                                  : [...prev, filter]
                              );
                            }}
                            className={cn(
                              "text-xs",
                              selectedFilters.includes(filter) && "bg-indigo-100 border-indigo-300 text-indigo-700"
                            )}
                          >
                            {filter}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Search Results */}
              <div ref={resultsRef} className="max-h-96 overflow-y-auto">
                {query.length === 0 ? (
                  // Recent searches and suggestions
                  <div className="p-4 space-y-4">
                    {searches.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-gray-900">Recent Searches</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearSearches}
                            className="text-xs text-gray-500 hover:text-gray-700"
                          >
                            Clear
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {searches.slice(0, 5).map((search, index) => (
                            <button
                              key={index}
                              onClick={() => handleSearch(search)}
                              className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-50 text-left"
                            >
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-700">{search}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Trending Searches</h3>
                      <div className="space-y-2">
                        {suggestions.map((suggestion) => (
                          <button
                            key={suggestion.id}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-50 text-left"
                          >
                            <div className="flex items-center space-x-3">
                              <TrendingUp className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-700">{suggestion.text}</span>
                              {suggestion.type === 'filter' && (
                                <Badge variant="outline" className="text-xs">
                                  Filter
                                </Badge>
                              )}
                            </div>
                            {suggestion.count && (
                              <span className="text-xs text-gray-500">
                                {suggestion.count.toLocaleString()}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Search results
                  <div className="p-4">
                    {loading ? (
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                              <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : searchResults && searchResults.length > 0 ? (
                      <div className="space-y-2">
                        {searchResults.map((result, index) => (
                          <motion.button
                            key={result.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleResultClick(result)}
                            className={cn(
                              "flex items-start space-x-3 w-full p-3 rounded-lg text-left transition-colors",
                              selectedResult === index 
                                ? "bg-indigo-50 border border-indigo-200" 
                                : "hover:bg-gray-50"
                            )}
                          >
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                              {getResultIcon(result.type)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-gray-900 truncate">
                                  {result.title}
                                </h4>
                                <div className="flex items-center space-x-2">
                                  {result.metadata.verified && (
                                    <Badge className="bg-green-100 text-green-800 text-xs">
                                      Verified
                                    </Badge>
                                  )}
                                  <ArrowRight className="w-4 h-4 text-gray-400" />
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {result.description}
                              </p>
                              
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                {result.metadata.location && (
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>{result.metadata.location}</span>
                                  </div>
                                )}
                                {result.metadata.salary && (
                                  <div className="flex items-center space-x-1">
                                    <DollarSign className="w-3 h-3" />
                                    <span>{formatSalary(result.metadata.salary)}</span>
                                  </div>
                                )}
                                {result.metadata.company && (
                                  <span>{result.metadata.company}</span>
                                )}
                                {result.metadata.rating && (
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-3 h-3 text-yellow-500" />
                                    <span>{result.metadata.rating}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No results found
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Try adjusting your search terms or filters
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};
