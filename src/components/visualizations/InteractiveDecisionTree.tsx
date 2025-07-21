/**
 * Interactive Decision Tree Visualization
 * Advanced decision tree component with AI reasoning explanation
 */

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronRight, 
  ChevronDown, 
  Brain, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  Target,
  Users,
  DollarSign,
  Clock,
  Star
} from 'lucide-react';

export interface DecisionNode {
  id: string;
  title: string;
  description: string;
  type: 'root' | 'decision' | 'outcome' | 'factor';
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  children?: DecisionNode[];
  data?: {
    probability?: number;
    cost?: number;
    timeframe?: string;
    requirements?: string[];
    benefits?: string[];
    risks?: string[];
  };
  aiReasoning?: {
    factors: string[];
    dataSource: string;
    confidence: number;
    alternatives: string[];
  };
}

export interface DecisionTreeProps {
  data: DecisionNode;
  onNodeClick?: (node: DecisionNode) => void;
  onPathSelect?: (path: DecisionNode[]) => void;
  interactive?: boolean;
  showAIReasoning?: boolean;
  className?: string;
}

const DecisionTreeNode: React.FC<{
  node: DecisionNode;
  level: number;
  isExpanded: boolean;
  onToggle: () => void;
  onNodeClick?: (node: DecisionNode) => void;
  showAIReasoning: boolean;
  selectedPath: string[];
  onPathUpdate: (nodeId: string, selected: boolean) => void;
}> = ({ 
  node, 
  level, 
  isExpanded, 
  onToggle, 
  onNodeClick, 
  showAIReasoning,
  selectedPath,
  onPathUpdate,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const isSelected = selectedPath.includes(node.id);
  const hasChildren = node.children && node.children.length > 0;

  const getNodeIcon = () => {
    switch (node.type) {
      case 'root':
        return <Target className="w-5 h-5" />;
      case 'decision':
        return <Brain className="w-5 h-5" />;
      case 'outcome':
        return <CheckCircle className="w-5 h-5" />;
      case 'factor':
        return <Info className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getImpactColor = () => {
    switch (node.impact) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const handleNodeSelect = () => {
    onPathUpdate(node.id, !isSelected);
    if (onNodeClick) {
      onNodeClick(node);
    }
  };

  return (
    <div className="relative">
      {/* Connection Line */}
      {level > 0 && (
        <div className="absolute -left-6 top-6 w-6 h-px bg-gray-300"></div>
      )}
      
      {/* Node Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: level * 0.1 }}
        className={`mb-4 ${level > 0 ? 'ml-8' : ''}`}
      >
        <Card 
          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
            isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
          } ${getImpactColor()}`}
          onClick={handleNodeSelect}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {hasChildren && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggle();
                    }}
                    className="p-1 h-6 w-6"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                )}
                
                <div className="flex items-center space-x-2">
                  {getNodeIcon()}
                  <CardTitle className="text-lg">{node.title}</CardTitle>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {Math.round(node.confidence * 100)}% confidence
                </Badge>
                
                {node.data?.probability && (
                  <Badge variant="secondary" className="text-xs">
                    {Math.round(node.data.probability * 100)}% likely
                  </Badge>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDetails(!showDetails);
                  }}
                  className="p-1 h-6 w-6"
                >
                  <Info className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">{node.description}</p>
            
            {/* Confidence Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Confidence</span>
                <span>{Math.round(node.confidence * 100)}%</span>
              </div>
              <Progress value={node.confidence * 100} className="h-2" />
            </div>
            
            {/* Quick Stats */}
            {node.data && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {node.data.cost && (
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-3 h-3" />
                    <span>${node.data.cost.toLocaleString()}</span>
                  </div>
                )}
                
                {node.data.timeframe && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{node.data.timeframe}</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Detailed Information Panel */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 ml-4"
            >
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="pt-4">
                  {/* Requirements */}
                  {node.data?.requirements && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Requirements
                      </h4>
                      <ul className="text-xs space-y-1">
                        {node.data.requirements.map((req, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Benefits */}
                  {node.data?.benefits && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm mb-2 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
                        Benefits
                      </h4>
                      <ul className="text-xs space-y-1">
                        {node.data.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center text-green-700">
                            <div className="w-1 h-1 bg-green-500 rounded-full mr-2"></div>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Risks */}
                  {node.data?.risks && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm mb-2 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1 text-red-600" />
                        Risks
                      </h4>
                      <ul className="text-xs space-y-1">
                        {node.data.risks.map((risk, index) => (
                          <li key={index} className="flex items-center text-red-700">
                            <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* AI Reasoning */}
                  {showAIReasoning && node.aiReasoning && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-sm mb-2 flex items-center">
                        <Brain className="w-4 h-4 mr-1 text-purple-600" />
                        AI Reasoning
                      </h4>
                      
                      <div className="space-y-3 text-xs">
                        <div>
                          <span className="font-medium">Key Factors:</span>
                          <ul className="mt-1 space-y-1">
                            {node.aiReasoning.factors.map((factor, index) => (
                              <li key={index} className="flex items-center">
                                <Zap className="w-3 h-3 mr-1 text-yellow-500" />
                                {factor}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <span className="font-medium">Data Source:</span>
                          <span className="ml-2 text-gray-600">{node.aiReasoning.dataSource}</span>
                        </div>
                        
                        <div>
                          <span className="font-medium">Alternatives Considered:</span>
                          <ul className="mt-1 space-y-1">
                            {node.aiReasoning.alternatives.map((alt, index) => (
                              <li key={index} className="text-gray-600">• {alt}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Children Nodes */}
      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="relative"
          >
            {/* Vertical Connection Line */}
            <div className="absolute left-3 top-0 w-px h-full bg-gray-300"></div>
            
            {node.children!.map((child, index) => (
              <DecisionTreeNodeContainer
                key={child.id}
                node={child}
                level={level + 1}
                onNodeClick={onNodeClick}
                showAIReasoning={showAIReasoning}
                selectedPath={selectedPath}
                onPathUpdate={onPathUpdate}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DecisionTreeNodeContainer: React.FC<{
  node: DecisionNode;
  level: number;
  onNodeClick?: (node: DecisionNode) => void;
  showAIReasoning: boolean;
  selectedPath: string[];
  onPathUpdate: (nodeId: string, selected: boolean) => void;
}> = ({ node, level, onNodeClick, showAIReasoning, selectedPath, onPathUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels

  return (
    <DecisionTreeNode
      node={node}
      level={level}
      isExpanded={isExpanded}
      onToggle={() => setIsExpanded(!isExpanded)}
      onNodeClick={onNodeClick}
      showAIReasoning={showAIReasoning}
      selectedPath={selectedPath}
      onPathUpdate={onPathUpdate}
    />
  );
};

export const InteractiveDecisionTree: React.FC<DecisionTreeProps> = ({
  data,
  onNodeClick,
  onPathSelect,
  interactive = true,
  showAIReasoning = true,
  className = '',
}) => {
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [showPathSummary, setShowPathSummary] = useState(false);

  const handlePathUpdate = useCallback((nodeId: string, selected: boolean) => {
    setSelectedPath(prev => {
      const newPath = selected 
        ? [...prev, nodeId]
        : prev.filter(id => id !== nodeId);
      
      if (onPathSelect) {
        const pathNodes = newPath.map(id => findNodeById(data, id)).filter(Boolean) as DecisionNode[];
        onPathSelect(pathNodes);
      }
      
      return newPath;
    });
  }, [data, onPathSelect]);

  const findNodeById = (node: DecisionNode, id: string): DecisionNode | null => {
    if (node.id === id) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findNodeById(child, id);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedNodes = useMemo(() => {
    return selectedPath.map(id => findNodeById(data, id)).filter(Boolean) as DecisionNode[];
  }, [selectedPath, data]);

  const pathSummary = useMemo(() => {
    if (selectedNodes.length === 0) return null;
    
    const totalCost = selectedNodes.reduce((sum, node) => sum + (node.data?.cost || 0), 0);
    const avgConfidence = selectedNodes.reduce((sum, node) => sum + node.confidence, 0) / selectedNodes.length;
    const timeframes = selectedNodes.map(node => node.data?.timeframe).filter(Boolean);
    
    return {
      totalCost,
      avgConfidence,
      timeframes,
      nodeCount: selectedNodes.length,
    };
  }, [selectedNodes]);

  return (
    <div className={`decision-tree ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center">
            <Brain className="w-6 h-6 mr-2 text-purple-600" />
            Decision Analysis
          </h2>
          
          <div className="flex items-center space-x-2">
            {selectedPath.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPathSummary(!showPathSummary)}
              >
                <Star className="w-4 h-4 mr-1" />
                Path Summary ({selectedPath.length})
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedPath([])}
              disabled={selectedPath.length === 0}
            >
              Clear Selection
            </Button>
          </div>
        </div>
        
        <p className="text-gray-600 mt-2">
          Click on nodes to explore decision paths. AI reasoning shows the factors behind each recommendation.
        </p>
      </div>

      {/* Path Summary */}
      <AnimatePresence>
        {showPathSummary && pathSummary && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Selected Path Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Total Cost</div>
                    <div className="text-lg font-semibold">
                      ${pathSummary.totalCost.toLocaleString()}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600">Avg Confidence</div>
                    <div className="text-lg font-semibold">
                      {Math.round(pathSummary.avgConfidence * 100)}%
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600">Decisions</div>
                    <div className="text-lg font-semibold">
                      {pathSummary.nodeCount}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600">Timeframe</div>
                    <div className="text-lg font-semibold">
                      {pathSummary.timeframes[0] || 'Varies'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decision Tree */}
      <div className="decision-tree-container">
        <DecisionTreeNodeContainer
          node={data}
          level={0}
          onNodeClick={onNodeClick}
          showAIReasoning={showAIReasoning}
          selectedPath={selectedPath}
          onPathUpdate={handlePathUpdate}
        />
      </div>
    </div>
  );
};

export default InteractiveDecisionTree;
