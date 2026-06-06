import { useState, useEffect, useCallback } from 'react';
import type { AnimationState } from '../types/flow';
import { requestFlowSteps } from '../data/requestFlow.json';

export const useAnimation = (autoStart: boolean = false) => {
  const [state, setState] = useState<AnimationState>({
    currentStep: 0,
    isAnimating: false,
    progress: 0,
    totalLatency: requestFlowSteps.reduce((sum, step) => sum + step.latency, 0),
  });

  const totalSteps = requestFlowSteps.length;
  const stepDuration = 800; // ms per step
  const delayBetweenSteps = 200; // ms between steps

  useEffect(() => {
    if (!state.isAnimating) return;

    const interval = setInterval(() => {
      setState((prev) => {
        if (prev.currentStep >= totalSteps - 1) {
          return { ...prev, isAnimating: false, currentStep: totalSteps - 1 };
        }

        const nextStep = prev.currentStep + 1;
        const progress = ((nextStep + 1) / totalSteps) * 100;

        return {
          ...prev,
          currentStep: nextStep,
          progress,
        };
      });
    }, stepDuration + delayBetweenSteps);

    return () => clearInterval(interval);
  }, [state.isAnimating, totalSteps]);

  const start = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isAnimating: true,
      currentStep: 0,
      progress: 0,
    }));
  }, []);

  const pause = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isAnimating: false,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      currentStep: 0,
      isAnimating: false,
      progress: 0,
      totalLatency: requestFlowSteps.reduce((sum, step) => sum + step.latency, 0),
    });
  }, []);

  const goToStep = useCallback((stepIndex: number) => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(Math.max(stepIndex, 0), totalSteps - 1),
      progress: (Math.min(Math.max(stepIndex, 0), totalSteps - 1) / totalSteps) * 100,
    }));
  }, [totalSteps]);

  return {
    ...state,
    start,
    pause,
    reset,
    goToStep,
    totalSteps,
    currentStepData: requestFlowSteps[state.currentStep],
  };
};
