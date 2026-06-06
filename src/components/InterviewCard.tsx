import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { RequestStep } from '../types/flow';
import { ChevronDown } from 'lucide-react';

interface InterviewCardProps {
  step: RequestStep;
  darkMode: boolean;
}

export const InterviewCard: React.FC<InterviewCardProps> = ({ step, darkMode }) => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const difficultyColors = {
    beginner: { bg: 'bg-green-500/10', text: 'text-green-600', label: 'Beginner' },
    intermediate: { bg: 'bg-yellow-500/10', text: 'text-yellow-600', label: 'Intermediate' },
    advanced: { bg: 'bg-red-500/10', text: 'text-red-600', label: 'Advanced' },
  };

  return (
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-gray-200'}`}>
      <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Interview Prep - {step.name}
      </h3>

      <div className="space-y-3">
        {step.interviewQuestions.map((q, idx) => {
          const colors = difficultyColors[q.difficulty];
          const isExpanded = expandedIdx === idx;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`rounded-lg overflow-hidden border ${
                isExpanded
                  ? darkMode
                    ? 'border-blue-500 bg-slate-800'
                    : 'border-blue-300 bg-blue-50'
                  : darkMode
                  ? 'border-slate-700 bg-slate-800'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <button
                onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between hover:opacity-80 transition-opacity"
              >
                <div className="flex-1">
                  <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {q.question}
                  </p>
                  <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-bold ${colors.bg} ${colors.text}`}>
                    {colors.label}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={`ml-2 ${isExpanded ? 'text-blue-500' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}
                >
                  <ChevronDown size={20} />
                </motion.div>
              </button>

              {isExpanded && q.answer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`px-4 pb-4 pt-0 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}
                >
                  <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {q.answer}
                  </p>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
