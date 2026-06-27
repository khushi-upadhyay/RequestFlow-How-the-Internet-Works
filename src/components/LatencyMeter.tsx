import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sliders, TrendingDown, TrendingUp } from 'lucide-react';
import { requestFlowSteps } from '../data/requestFlow.json';
import type { SimulatorSettings } from '../types/flow';

interface LatencyMeterProps {
  settings: SimulatorSettings;
  onSettingsChange: (settings: SimulatorSettings) => void;
  darkMode: boolean;
}

export const LatencyMeter: React.FC<LatencyMeterProps> = ({ settings, onSettingsChange }) => {
  const calculatedLatency = useMemo(() => {
    const baseLatency = requestFlowSteps.reduce((sum, step) => sum + step.latency, 0);
    const networkMultiplier = (11 - settings.networkSpeed) / 5;
    const loadMultiplier = 1 + (settings.serverLoad / 100) * 2;
    const cacheHitRate = settings.cacheHitRate / 100;
    const databaseLatency = requestFlowSteps.find((s) => s.id === '8-database')?.latency || 150;
    const adjustedDatabaseLatency = databaseLatency * (1 + (1 - cacheHitRate) * 1.5);

    return Math.round(
      baseLatency * networkMultiplier * loadMultiplier +
        adjustedDatabaseLatency -
        (requestFlowSteps.find((s) => s.id === '8-database')?.latency || 150),
    );
  }, [settings]);

  const cacheImpact = useMemo(() => {
    const baseDb = requestFlowSteps.find((s) => s.id === '8-database')?.latency || 150;
    return {
      hit: 2,
      miss: baseDb,
      saved: baseDb - 2,
    };
  }, []);

  const latencyStatus =
    calculatedLatency < 200
      ? { label: 'Excellent', color: '#22c55e', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: '●' }
      : calculatedLatency < 400
      ? { label: 'Good', color: '#f59e0b', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: '●' }
      : { label: 'Needs Optimization', color: '#ef4444', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: '●' };

  const sliders = [
    {
      key: 'networkSpeed' as keyof SimulatorSettings,
      label: 'Network Speed',
      hint: '1× slow, 10× fast',
      min: 1,
      max: 10,
      valueLabel: `${settings.networkSpeed}×`,
      valueCls: 'text-blue-400',
    },
    {
      key: 'serverLoad' as keyof SimulatorSettings,
      label: 'Server Load',
      hint: '0% idle, 100% max capacity',
      min: 1,
      max: 100,
      valueLabel: `${settings.serverLoad}%`,
      valueCls: 'text-[#fafafa]',
    },
    {
      key: 'cacheHitRate' as keyof SimulatorSettings,
      label: 'Cache Hit Rate',
      hint: '0% miss, 100% always cached',
      min: 0,
      max: 100,
      valueLabel: `${settings.cacheHitRate}%`,
      valueCls: 'text-[#fafafa]',
    },
  ];

  return (
    <div className="rounded-xl border border-[#2b2b30] bg-[#18181b] p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2b2b30] bg-[#111113] text-blue-400">
          <Sliders size={16} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#fafafa]">Latency Simulator</h3>
          <p className="text-[11px] text-[#71717a]">Adjust conditions, see impact</p>
        </div>
      </div>

      <div className="my-5 h-px bg-[#2b2b30]" />

      <div className="space-y-5">
        {sliders.map((s) => (
          <div key={s.key}>
            <div className="mb-2.5 flex items-center justify-between">
              <label className="text-xs font-medium text-[#e4e4e7]">{s.label}</label>
              <span className={`font-mono text-xs font-semibold ${s.valueCls}`}>{s.valueLabel}</span>
            </div>
            <input
              type="range"
              min={s.min}
              max={s.max}
              value={settings[s.key]}
              onChange={(e) => onSettingsChange({ ...settings, [s.key]: parseInt(e.target.value) })}
              style={{ accentColor: '#3b82f6' }}
              className="w-full"
            />
            <p className="mt-1.5 text-[10px] text-[#71717a]">{s.hint}</p>
          </div>
        ))}
      </div>

      <div className="my-5 h-px bg-[#2b2b30]" />

      <div className={`rounded-xl border p-4 ${latencyStatus.bg} ${latencyStatus.border}`}>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#71717a]">
          Estimated Response Time
        </p>
        <div className="flex items-end gap-3">
          <motion.span
            key={calculatedLatency}
            initial={{ scale: 1.03, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="text-4xl font-extrabold tracking-tight text-[#fafafa]"
          >
            {calculatedLatency}
          </motion.span>
          <span className="mb-0.5 font-mono text-lg text-[#71717a]">ms</span>
          <span className="ml-auto rounded-full border border-[#2b2b30] bg-[#111113] px-2.5 py-1 text-xs font-semibold text-[#e4e4e7]">
            {latencyStatus.label}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#71717a]">
          Cache Impact
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[#2b2b30] bg-[#111113] p-3">
            <div className="flex items-center gap-1.5">
              <TrendingDown size={12} className="text-green-500" />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-green-500">
                Cache Hit
              </span>
            </div>
            <span className="mt-1 block text-lg font-bold text-[#fafafa]">{cacheImpact.hit}ms</span>
            <span className="text-[9px] text-[#71717a]">Redis lookup</span>
          </div>
          <div className="rounded-xl border border-[#2b2b30] bg-[#111113] p-3">
            <div className="flex items-center gap-1.5">
              <TrendingUp size={12} className="text-amber-500" />
              <span className="text-[10px] font-semibold uppercase tracking-wide text-amber-500">
                Cache Miss
              </span>
            </div>
            <span className="mt-1 block text-lg font-bold text-[#fafafa]">{cacheImpact.miss}ms</span>
            <span className="text-[9px] text-[#71717a]">+{cacheImpact.saved}ms overhead</span>
          </div>
        </div>
      </div>
    </div>
  );
};
