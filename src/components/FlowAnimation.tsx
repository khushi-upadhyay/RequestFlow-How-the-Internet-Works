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
    <div className={`w-full overflow-x-auto py-8 px-4 rounded-lg ${
      darkMode ? 'bg-slate-900' : 'bg-gray-50'
    }`}>
      <div className="flex items-center gap-4 min-w-min px-4">
        {requestFlowSteps.map((step, index) => {
          const IconComponent = (Icons as any)[step.icon] || Icons.Zap;
          const isActive = index === currentStep;
          const isPassed = index < currentStep;

          return (
            <React.Fragment key={step.id}>
              {/* Step Node */}
              <motion.div
                onClick={() => onStepClick(index)}
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                className="cursor-pointer relative"
              >
                <motion.div
                  animate={{
                    boxShadow: isActive
                      ? [
                          `0 0 0 4px rgba(59, 130, 246, 0)`,
                          `0 0 20px 4px rgba(59, 130, 246, 0.5)`,
                          `0 0 0 4px rgba(59, 130, 246, 0)`,
                        ]
                      : 'none',
                  }}
                  transition={{
                    duration: 2,
                    repeat: isActive && isAnimating ? Infinity : 0,
                  }}
                  className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-white transition-colors relative ${
                    isActive
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                      : isPassed
                      ? 'bg-green-500'
                      : darkMode
                      ? 'bg-slate-700'
                      : 'bg-gray-300'
                  }`}
                >
                  {isPassed ? (
                    <span className="text-lg">✓</span>
                  ) : (
                    <IconComponent size={24} />
                  )}
                </motion.div>

                {/* Label */}
                <div className={`text-center mt-2 text-xs font-semibold ${
                  isActive
                    ? 'text-blue-500'
                    : darkMode
                    ? 'text-gray-300'
                    : 'text-gray-600'
                }`}>
                  {step.latency}ms
                </div>
              </motion.div>

              {/* Arrow between steps */}
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
                  className={`w-8 h-1 rounded ${
                    index < currentStep
                      ? 'bg-green-500'
                      : darkMode
                      ? 'bg-slate-600'
                      : 'bg-gray-300'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
