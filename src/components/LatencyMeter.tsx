import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sliders } from 'lucide-react';
import { requestFlowSteps } from '../data/requestFlow.json';
import type { SimulatorSettings } from '../types/flow';

interface LatencyMeterProps {
  settings: SimulatorSettings;
  onSettingsChange: (settings: SimulatorSettings) => void;
  darkMode: boolean;
}

export const LatencyMeter: React.FC<LatencyMeterProps> = ({
  settings,
  onSettingsChange,
  darkMode,
}) => {
  const calculatedLatency = useMemo(() => {
    let baseLatency = requestFlowSteps.reduce((sum, step) => sum + step.latency, 0);

    // Network speed affects DNS, TCP, TLS
    const networkMultiplier = (11 - settings.networkSpeed) / 5;
    
    // Server load affects app server
    const loadMultiplier = 1 + (settings.serverLoad / 100) * 2;
    
    // Cache hit rate affects database latency (lower rate = higher latency)
    const cacheHitRate = settings.cacheHitRate / 100;
    const databaseLatency = requestFlowSteps.find(s => s.id === '8-database')?.latency || 150;
    const adjustedDatabaseLatency = databaseLatency * (1 + (1 - cacheHitRate) * 1.5);

    return Math.round(
      baseLatency * networkMultiplier * loadMultiplier +
      adjustedDatabaseLatency - (requestFlowSteps.find(s => s.id === '8-database')?.latency || 150)
    );
  }, [settings]);

  const cacheImpact = useMemo(() => {
    const baseDb = requestFlowSteps.find(s => s.id === '8-database')?.latency || 150;
    const cacheHit = 2; // Redis latency
    const cacheMiss = baseDb;
    return {
      hit: Math.round(cacheHit),
      miss: Math.round(cacheMiss),
      saved: Math.round(cacheMiss - cacheHit),
    };
  }, []);

  return (
    <div className={`p-6 rounded-lg space-y-6 ${darkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-gray-200'}`}>
      <div className="flex items-center gap-2 mb-6">
        <Sliders size={20} className="text-blue-500" />
        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Latency Simulator
        </h3>
      </div>

      {/* Network Speed */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Network Speed
          </label>
          <span className="text-sm font-bold text-blue-500">{settings.networkSpeed}x</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={settings.networkSpeed}
          onChange={(e) =>
            onSettingsChange({
              ...settings,
              networkSpeed: parseInt(e.target.value),
            })
          }
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
        />
        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          10x = Super fast | 1x = Very slow
        </p>
      </div>

      {/* Server Load */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Server Load
          </label>
          <span className="text-sm font-bold text-orange-500">{settings.serverLoad}%</span>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          value={settings.serverLoad}
          onChange={(e) =>
            onSettingsChange({
              ...settings,
              serverLoad: parseInt(e.target.value),
            })
          }
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
        />
        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          0% = Idle | 100% = Maximum load
        </p>
      </div>

      {/* Cache Hit Rate */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Cache Hit Rate
          </label>
          <span className="text-sm font-bold text-green-500">{settings.cacheHitRate}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={settings.cacheHitRate}
          onChange={(e) =>
            onSettingsChange({
              ...settings,
              cacheHitRate: parseInt(e.target.value),
            })
          }
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
        />
        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          0% = Cache miss | 100% = Cache hit
        </p>
      </div>

      {/* Results */}
      <div className={`p-4 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
        <p className={`text-xs font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          ESTIMATED RESPONSE TIME
        </p>
        <motion.p
          key={calculatedLatency}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.3 }}
          className="text-3xl font-bold text-blue-500 mb-2"
        >
          {calculatedLatency}ms
        </motion.p>
        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          {calculatedLatency < 200 ? '⚡ Excellent' : calculatedLatency < 400 ? '✓ Good' : '⚠ Needs optimization'}
        </p>
      </div>

      {/* Cache Impact */}
      <div className="space-y-2">
        <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          CACHE IMPACT
        </p>
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-green-50'} border border-green-200`}>
          <p className={`text-sm font-semibold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
            ✓ Cache Hit: {cacheImpact.hit}ms
          </p>
          <p className={`text-xs ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
            Direct Redis lookup
          </p>
        </div>
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-red-50'} border border-red-200`}>
          <p className={`text-sm font-semibold ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
            ✗ Cache Miss: {cacheImpact.miss}ms
          </p>
          <p className={`text-xs ${darkMode ? 'text-red-300' : 'text-red-600'}`}>
            Database query needed (+{cacheImpact.saved}ms overhead)
          </p>
        </div>
      </div>
    </div>
  );
};
