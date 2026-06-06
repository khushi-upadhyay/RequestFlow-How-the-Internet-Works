import React from 'react';
import type { RequestStep } from '../types/flow';
import { X, Lightbulb, Zap, BookOpen, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DetailPanelProps {
  step: RequestStep | null;
  onClose: () => void;
  darkMode: boolean;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({ step, onClose, darkMode }) => {
  if (!step) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 400 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 400 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`fixed right-0 top-0 h-full w-full md:w-96 ${
          darkMode ? 'bg-slate-800' : 'bg-white'
        } border-l ${darkMode ? 'border-slate-700' : 'border-gray-200'} shadow-2xl overflow-y-auto z-40`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={`sticky top-4 right-4 p-2 rounded-lg ${
            darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <X size={20} />
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {step.name}
            </h2>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400">
                {step.latency}ms
              </span>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gray-500/20 text-gray-400">
                {step.category}
              </span>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {step.description}
            </p>
          </div>

          {/* What Happens */}
          <div className="mb-6 pb-6 border-b border-gray-700/50">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={18} className="text-blue-400" />
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                What Happens
              </h3>
            </div>
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {step.details.whatHappens}
            </p>
          </div>

          {/* Why It Exists */}
          <div className="mb-6 pb-6 border-b border-gray-700/50">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={18} className="text-yellow-400" />
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Why It Exists
              </h3>
            </div>
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {step.details.whyItExists}
            </p>
          </div>

          {/* Real World Example */}
          <div className="mb-6 pb-6 border-b border-gray-700/50">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={18} className="text-green-400" />
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Real-World Example
              </h3>
            </div>
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {step.details.realWorldExample}
            </p>
          </div>

          {/* Bottlenecks */}
          <div className="mb-6 pb-6 border-b border-gray-700/50">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={18} className="text-red-400" />
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Common Bottlenecks
              </h3>
            </div>
            <ul className="space-y-2">
              {step.bottlenecks.map((bottleneck, i) => (
                <li key={i} className={`text-sm flex gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className="text-red-400 font-bold">•</span>
                  {bottleneck}
                </li>
              ))}
            </ul>
          </div>

          {/* Interview Questions */}
          <div className="mb-6 pb-6 border-b border-gray-700/50">
            <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Interview Questions
            </h3>
            <div className="space-y-4">
              {step.interviewQuestions.map((q, i) => (
                <details key={i} className={`p-3 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                  <summary className="cursor-pointer font-medium text-sm">{q.question}</summary>
                  <div className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {q.answer}
                  </div>
                  <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                    q.difficulty === 'beginner'
                      ? 'bg-green-500/20 text-green-400'
                      : q.difficulty === 'intermediate'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {q.difficulty}
                  </span>
                </details>
              ))}
            </div>
          </div>

          {/* Technologies */}
          {step.technologies && step.technologies.length > 0 && (
            <div className="pb-6 border-b border-gray-700/50">
              <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {step.technologies.map((tech, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      darkMode
                        ? 'bg-slate-700 text-gray-300'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Concepts */}
          {step.relatedConcepts && step.relatedConcepts.length > 0 && (
            <div>
              <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Related Concepts
              </h3>
              <div className="flex flex-wrap gap-2">
                {step.relatedConcepts.map((concept, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      darkMode
                        ? 'bg-slate-700 text-blue-300'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
