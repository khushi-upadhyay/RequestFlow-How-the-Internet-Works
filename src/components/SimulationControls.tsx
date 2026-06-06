import React, { useMemo } from 'react';
import { Sliders } from 'lucide-react';
import type { SimulatorSettings } from '../types/flow';

interface SimulationControlsProps {
  settings: SimulatorSettings;
  onSettingsChange: (settings: SimulatorSettings) => void;
  totalLatency: number;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  settings,
  onSettingsChange,
  totalLatency
}) => {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6 border-b border-[var(--color-border)] pb-4">
        <Sliders size={20} className="text-[var(--color-primary)]" />
        <h3 className="text-lg font-bold text-[var(--color-text)]">
          Real-time Simulation
        </h3>
      </div>

      <div className="flex-1 space-y-6">
        {/* Network Speed */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-[var(--color-muted)]">Network Speed</label>
            <span className="text-sm font-bold text-[var(--color-primary)]">{settings.networkSpeed}x</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={settings.networkSpeed}
            onChange={(e) => onSettingsChange({ ...settings, networkSpeed: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
          />
        </div>

        {/* Server Load */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-[var(--color-muted)]">Server Load</label>
            <span className="text-sm font-bold text-[var(--color-warning)]">{settings.serverLoad}%</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={settings.serverLoad}
            onChange={(e) => onSettingsChange({ ...settings, serverLoad: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer accent-[var(--color-warning)]"
          />
        </div>

        {/* Cache Hit Rate */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-[var(--color-muted)]">Cache Hit Rate</label>
            <span className="text-sm font-bold text-[var(--color-success)]">{settings.cacheHitRate}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.cacheHitRate}
            onChange={(e) => onSettingsChange({ ...settings, cacheHitRate: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer accent-[var(--color-success)]"
          />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
        <p className="text-xs font-medium text-[var(--color-muted)] mb-2 uppercase tracking-wider">
          Total Response Time
        </p>
        <p className="text-4xl font-extrabold text-[var(--color-text)] tracking-tight">
          {totalLatency}<span className="text-xl text-[var(--color-muted)] ml-1">ms</span>
        </p>
      </div>
    </div>
  );
};
