import React from 'react';
import type { RequestStep } from '../types/flow';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

interface StepCardProps {
  step: RequestStep;
  isActive: boolean;
  onClick: () => void;
  darkMode: boolean;
  index: number;
}

export const StepCard: React.FC<StepCardProps> = ({ 
  step, 
  isActive, 
  onClick, 
  darkMode,
  index 
}) => {
  const IconComponent = (Icons as any)[step.icon] || Icons.Zap;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={`cursor-pointer group relative p-4 rounded-xl transition-all duration-300 ${
        isActive
          ? darkMode
            ? 'bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/50 text-white'
            : 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30 text-white'
          : darkMode
          ? 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-gray-300'
          : 'bg-white hover:bg-gray-50 border border-gray-200 text-gray-600'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
            <IconComponent size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{step.name}</h3>
            <p className={`text-xs ${isActive ? 'opacity-90' : ''}`}>{step.latency}ms</p>
          </div>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded ${
          isActive 
            ? 'bg-white/20 text-white' 
            : darkMode 
            ? 'bg-slate-700 text-gray-300' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {index + 1}
        </span>
      </div>
      <p className={`text-xs ${isActive ? 'opacity-90' : ''}`}>{step.description}</p>

      {/* Category badge */}
      <div className="mt-3 flex gap-1">
        <span className={`text-xs px-2 py-1 rounded ${
          isActive
            ? 'bg-white/20 text-white'
            : darkMode
            ? 'bg-slate-700/50 text-gray-400'
            : 'bg-gray-100 text-gray-500'
        }`}>
          {step.category}
        </span>
      </div>
    </motion.div>
  );
};
