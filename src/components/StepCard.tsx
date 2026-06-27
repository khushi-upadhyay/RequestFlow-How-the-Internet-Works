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

export const StepCard: React.FC<StepCardProps> = ({ step, isActive, onClick, index }) => {
  const IconComponent = (Icons as any)[step.icon] || Icons.Zap;

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      whileHover={{ y: -1, scale: 1.02 }}
      onClick={onClick}
      className={`group relative rounded-xl border p-4 text-left transition-all duration-200 ${
        isActive
          ? 'border-blue-500 bg-[#232326] shadow-sm'
          : 'border-[#2b2b30] bg-[#18181b] hover:border-[#3a3a40] hover:bg-[#232326]'
      }`}
    >
      <span
        className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-md font-mono text-[10px] font-bold ${
          isActive ? 'bg-blue-500/15 text-blue-400' : 'bg-white/5 text-[#71717a]'
        }`}
      >
        {index + 1}
      </span>

      <div
        className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg border ${
          isActive ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' : 'border-[#2b2b30] bg-[#111113] text-[#a1a1aa]'
        }`}
      >
        <IconComponent size={16} strokeWidth={2} />
      </div>

      <h3 className={`mb-1 text-sm font-semibold ${isActive ? 'text-[#fafafa]' : 'text-[#e4e4e7]'}`}>
        {step.name}
      </h3>
      <p className="mb-2 font-mono text-[10px] text-[#71717a]">{step.latency}ms</p>
      <p className="line-clamp-2 text-[11px] leading-relaxed text-[#a1a1aa]">
        {step.description}
      </p>

      <div className="mt-3">
        <span className="inline-flex rounded-full border border-[#2b2b30] bg-[#111113] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#a1a1aa]">
          {step.category}
        </span>
      </div>
    </motion.button>
  );
};
