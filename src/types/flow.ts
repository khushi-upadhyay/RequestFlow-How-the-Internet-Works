export interface RequestStep {
  id: string;
  name: string;
  description: string;
  latency: number; // in ms
  icon: string; // lucide icon name
  category: 'network' | 'server' | 'data' | 'browser';
  details: {
    whatHappens: string;
    whyItExists: string;
    realWorldExample: string;
  };
  interviewQuestions: {
    question: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    answer?: string;
  }[];
  bottlenecks: string[];
  technologies?: string[];
  relatedConcepts?: string[];
}

export interface FlowData {
  steps: RequestStep[];
  totalLatency: number;
}

export interface AnimationState {
  currentStep: number;
  isAnimating: boolean;
  progress: number;
  totalLatency: number;
}

export interface DetailPanelData extends RequestStep {
  estimatedLatency: number;
  actualLatency?: number;
}

export interface SimulatorSettings {
  networkSpeed: number; // 1-10
  serverLoad: number; // 1-10
  cacheHitRate: number; // 0-100 (percentage)
}

export interface LatencyBreakdown {
  step: string;
  latency: number;
  percentage: number;
}

export interface LearnTopic {
  id: string;
  title: string;
  description: string;
  content: string;
  relatedSteps: string[];
  keyPoints: string[];
  resources?: {
    title: string;
    url: string;
  }[];
}
