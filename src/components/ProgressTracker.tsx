import React from 'react';
import { motion } from 'framer-motion';
import { requestFlowSteps } from '../data/requestFlow.json';

interface ProgressTrackerProps {
  progress: number;
  currentStep: number;
  totalSteps: number;
  totalLatency: number;
  darkMode: boolean;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  progress,
  currentStep,
  totalSteps,
  totalLatency,
  darkMode,
}) => {
  const currentStepLatency = requestFlowSteps.slice(0, currentStep + 1).reduce((sum, s) => sum + s.latency, 0);

  return (
    <div className={`p-6 rounded-lg ${darkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-gray-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Request Progress
          </p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {progress.toFixed(0)}%
          </p>
        </div>
        <div className="text-right">
          <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Estimated Latency
          </p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            {currentStepLatency}ms / {totalLatency}ms
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className={`relative h-3 rounded-full overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-gray-200'}`}>
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
        />
      </div>

      {/* Step indicator */}
      <div className="mt-4 flex items-center justify-between">
        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Step {currentStep + 1} of {totalSteps}
        </p>
        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {requestFlowSteps[currentStep].name}
        </p>
      </div>
    </div>
  );
};
