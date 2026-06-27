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
  const currentStepLatency = requestFlowSteps
    .slice(0, currentStep + 1)
    .reduce((sum, s) => sum + s.latency, 0);

  return (
    <div className={`rounded-xl border p-5 ${darkMode ? 'border-[#2b2b30] bg-[#18181b]' : 'border-gray-200 bg-white'}`}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className={`mb-1 text-sm font-medium ${darkMode ? 'text-[#a1a1aa]' : 'text-gray-600'}`}>
            Request Progress
          </p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-[#fafafa]' : 'text-gray-900'}`}>
            {progress.toFixed(0)}%
          </p>
        </div>
        <div className="text-right">
          <p className={`mb-1 text-sm font-medium ${darkMode ? 'text-[#a1a1aa]' : 'text-gray-600'}`}>
            Estimated Latency
          </p>
          <p className="text-2xl font-bold text-blue-500">
            {currentStepLatency}ms / {totalLatency}ms
          </p>
        </div>
      </div>

      <div className={`relative h-3 overflow-hidden rounded-full ${darkMode ? 'bg-[#111113]' : 'bg-gray-200'}`}>
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full rounded-full bg-blue-500"
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className={`text-sm font-medium ${darkMode ? 'text-[#a1a1aa]' : 'text-gray-600'}`}>
          Step {currentStep + 1} of {totalSteps}
        </p>
        <p className={`text-sm font-medium ${darkMode ? 'text-[#a1a1aa]' : 'text-gray-600'}`}>
          {requestFlowSteps[currentStep].name}
        </p>
      </div>
    </div>
  );
};
