import React from 'react';
import { motion } from 'framer-motion';
import { requestFlowSteps } from '../data/requestFlow.json';
import * as Icons from 'lucide-react';

interface FlowAnimationProps {
  currentStep: number;
  isAnimating: boolean;
  onStepClick: (index: number) => void;
  darkMode: boolean;
}

export const FlowAnimation: React.FC<FlowAnimationProps> = ({
  currentStep,
  isAnimating,
  onStepClick,
  darkMode,
}) => {
  return (
    <div className={`w-full overflow-x-auto rounded-xl border px-4 py-7 ${darkMode ? 'border-[#2b2b30] bg-[#18181b]' : 'border-gray-200 bg-white'}`}>
      <div className="flex min-w-min items-center gap-4 px-4">
        {requestFlowSteps.map((step, index) => {
          const IconComponent = (Icons as any)[step.icon] || Icons.Zap;
          const isActive = index === currentStep;
          const isPassed = index < currentStep;

          return (
            <React.Fragment key={step.id}>
              <motion.button
                type="button"
                onClick={() => onStepClick(index)}
                animate={{ scale: isActive ? 1.02 : 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                className="relative cursor-pointer"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full border text-white transition-colors ${
                    isActive
                      ? 'border-blue-500 bg-blue-500'
                      : isPassed
                      ? 'border-green-500 bg-green-500'
                      : darkMode
                      ? 'border-[#2b2b30] bg-[#111113] text-[#a1a1aa]'
                      : 'border-gray-300 bg-white text-gray-500'
                  }`}
                >
                  {isPassed ? <span className="text-lg">✓</span> : <IconComponent size={24} />}
                </div>
                <div className={`mt-2 text-center text-xs font-semibold ${isActive ? 'text-blue-500' : darkMode ? 'text-[#a1a1aa]' : 'text-gray-600'}`}>
                  {step.latency}ms
                </div>
              </motion.button>

              {index < requestFlowSteps.length - 1 && (
                <motion.div
                  animate={{
                    opacity: index < currentStep ? 1 : 0.3,
                    x: isAnimating && index === currentStep ? [0, 4, 0] : 0,
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: isAnimating && index === currentStep ? Infinity : 0,
                  }}
                  className={`h-1 w-8 rounded-full ${index < currentStep ? 'bg-blue-500' : darkMode ? 'bg-[#2b2b30]' : 'bg-gray-300'}`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
