import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import type { RequestStep } from '../types/flow';

interface HorizontalNodeProps {
  step: RequestStep;
  isActive: boolean;
  isPast: boolean;
  onClick: () => void;
  calculatedLatency: number;
}

export const HorizontalNode: React.FC<HorizontalNodeProps> = ({ 
  step, 
  isActive, 
  isPast, 
  onClick, 
  calculatedLatency 
}) => {
  const IconComponent = (Icons as any)[step.icon] || Icons.Server;

  return (
    <div className="flex flex-col items-center relative group cursor-pointer" onClick={onClick}>
      {/* Glow effect when active */}
      {isActive && (
        <div className="absolute inset-0 -m-4 bg-[var(--color-primary)]/20 blur-xl rounded-full z-0 pointer-events-none" />
      )}
      
      {/* Node Circle */}
      <motion.div 
        animate={{ 
          scale: isActive ? 1.1 : 1,
          borderColor: isActive ? 'var(--color-primary)' : isPast ? 'var(--color-success)' : 'var(--color-border)',
          backgroundColor: isActive ? 'var(--color-surface)' : isPast ? 'var(--color-surface)' : 'var(--color-background)'
        }}
        className="w-16 h-16 rounded-full border-2 flex items-center justify-center z-10 relative transition-colors duration-300 shadow-lg"
      >
        <IconComponent 
          size={24} 
          className={`${isActive ? 'text-[var(--color-primary)]' : isPast ? 'text-[var(--color-success)]' : 'text-[var(--color-muted)]'}`} 
        />
        
        {/* Packet Animation */}
        {isActive && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.5, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 border-2 border-[var(--color-primary)] rounded-full"
          />
        )}
      </motion.div>

      {/* Label & Latency */}
      <div className="mt-4 text-center z-10">
        <p className={`text-sm font-semibold ${isActive ? 'text-[var(--color-text)]' : 'text-[var(--color-muted)]'}`}>
          {step.name}
        </p>
        <div className={`mt-1 text-xs font-mono px-2 py-0.5 rounded ${isActive ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'bg-[var(--color-surface)] text-[var(--color-muted)]'}`}>
          {calculatedLatency}ms
        </div>
      </div>
    </div>
  );
};
