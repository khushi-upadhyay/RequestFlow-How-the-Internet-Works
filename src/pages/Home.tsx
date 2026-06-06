import React, { useState } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, Activity, Terminal, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  StepCard,
  DetailPanel,
  LatencyMeter,
  DatadogTopology,
  LiveMetrics,
  WiresharkPane
} from '../components';
import { useRequestSimulation } from '../hooks/useRequestSimulation';
import { requestFlowSteps } from '../data/requestFlow.json';
import type { SimulatorSettings } from '../types/flow';

interface HomeProps {
  darkMode: boolean;
}

export const Home: React.FC<HomeProps> = ({ darkMode }) => {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [simulatorSettings, setSimulatorSettings] = useState<SimulatorSettings>({
    networkSpeed: 7,
    serverLoad: 30,
    cacheHitRate: 75,
  });

  // Load the live request simulator hook
  const sim = useRequestSimulation(simulatorSettings);

  const handleTraceRequest = () => {
    sim.startSimulation();
  };

  // Find active step index based on simulator stepId
  const activeStepIndex = requestFlowSteps.findIndex(s => s.id === sim.currentStepId);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-900 text-white'}`}>
      {/* Hero Header */}
      <section className="py-8 px-4 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              RequestFlow Monitor
            </h1>
            <p className="text-xs md:text-sm text-gray-400 max-w-2xl mx-auto">
              Inspect how the internet works in real-time. Trace your requests through DNS, TLS handshakes, CDNs, Load Balancers, caches, and databases in our virtual sandbox.
            </p>
          </div>

          {/* URL Input Bar */}
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 max-w-3xl mx-auto backdrop-blur-md shadow-2xl flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex gap-2">
              <div className="flex items-center pl-3 pr-1 bg-slate-950 border border-slate-800 rounded-lg text-gray-500 font-mono text-xs select-none">
                HTTPS://
              </div>
              <input
                type="text"
                value={sim.url}
                onChange={(e) => sim.setUrl(e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-955 border border-slate-800 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="api.github.com/users/octocat"
                disabled={sim.isSimulating}
              />
            </div>
            
            <div className="flex gap-2">
              {sim.isSimulating ? (
                <button
                  onClick={() => sim.isPaused ? sim.resumeSimulation() : sim.pauseSimulation()}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                    sim.isPaused ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-amber-600 hover:bg-amber-500 text-white'
                  }`}
                >
                  {sim.isPaused ? <Play size={14} /> : <Pause size={14} />}
                  {sim.isPaused ? 'Resume' : 'Pause'}
                </button>
              ) : (
                <button
                  onClick={handleTraceRequest}
                  className="flex-1 sm:flex-initial px-5 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20"
                >
                  <ChevronRight size={14} />
                  Trace Request
                </button>
              )}
              
              <button
                onClick={sim.resetSimulation}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg text-xs transition-colors flex items-center justify-center"
                title="Reset simulation state"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard Grid */}
      <section className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Trace Map & Packet Grid */}
          <div className="lg:col-span-2 space-y-6 flex flex-col">
            {/* 1. Live Trace Map */}
            <DatadogTopology
              activeTrail={sim.activeTrail}
              ips={sim.ips}
              darkMode={darkMode}
            />

            {/* 2. Wireshark Inspector Pane */}
            <div className="flex-1">
              <WiresharkPane
                packets={sim.visiblePackets}
                selectedPacketIndex={sim.selectedPacketIndex}
                onSelectPacket={sim.setSelectedPacketIndex}
                timingBreakdown={sim.timingBreakdown}
                darkMode={darkMode}
              />
            </div>
          </div>

          {/* Right Column: Metrics & Sliders */}
          <div className="lg:col-span-1 space-y-6">
            {/* 1. Live Datadog Metrics */}
            <LiveMetrics
              metrics={sim.metrics}
              chartData={sim.chartData}
              darkMode={darkMode}
            />

            {/* 2. Latency Settings */}
            <LatencyMeter
              settings={simulatorSettings}
              onSettingsChange={setSimulatorSettings}
              darkMode={true}
            />
          </div>
        </div>
      </section>

      {/* Educational Deep Dive - Step Card list */}
      <section className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-900/60 bg-slate-950/40">
        <div className="flex items-center gap-2 mb-6">
          <Info size={20} className="text-cyan-400" />
          <h2 className="text-xl font-bold">Interactive Learning Modules</h2>
        </div>
        
        <p className="text-xs text-gray-400 mb-6 max-w-3xl">
          Click any step card below to review interview study guides, common backend bottlenecks, and core technologies associated with each protocol. During a live trace, the currently active protocol will highlight automatically.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {requestFlowSteps.map((step, idx) => (
            <StepCard
              key={step.id}
              step={step}
              index={idx}
              isActive={activeStepIndex === idx || selectedStep === idx}
              onClick={() => {
                setSelectedStep(idx);
              }}
              darkMode={true}
            />
          ))}
        </div>
      </section>

      {/* Core Concepts Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-900/60">
        <h2 className="text-xl font-bold mb-8 text-center text-gray-100">
          Core Distributed System Concepts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Networking Protocols',
              description: 'DNS over HTTPS, TCP sequence window alignment, TLS asymmetric key establishment, and HTTP payload packets routing.',
              icon: '🌐',
            },
            {
              title: 'Distributed Routing',
              description: 'Geo-aware CDN edge caching nodes, layer-4 and layer-7 load balancer routing algorithms, and horizontal gateway scaling.',
              icon: '🏗️',
            },
            {
              title: 'Caching Optimization',
              description: 'Multi-layer memory caching (Redis KV stores, HTTP cache-control specs, CDN purges) reducing DB lookups by 95%+',
              icon: '⚡',
            },
            {
              title: 'Persistent Stores',
              description: 'Relational DB indexing, connection pooling, ACID transaction sharding, and write-through cache serialization.',
              icon: '🗄️',
            },
            {
              title: 'Secure Enclaves',
              description: 'Certificates verification, perfect forward secrecy (PFS), ephemeral Diffie-Hellman keys exchange, and HTTPS validation.',
              icon: '🔒',
            },
            {
              title: 'Browser Engines',
              description: 'Critical rendering paths optimization (DOM construction, CSSOM compilation, JS engines execution, reflows batching).',
              icon: '🏢',
            },
          ].map((concept, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-slate-900 bg-slate-900/30 text-left hover:border-slate-800 transition-colors duration-200"
            >
              <div className="text-2xl mb-2">{concept.icon}</div>
              <h3 className="font-bold text-sm text-gray-200 mb-1.5">
                {concept.title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {concept.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pop-out Detail Panel for Educational Step Cards */}
      <DetailPanel
        step={selectedStep !== null ? requestFlowSteps[selectedStep] : null}
        onClose={() => setSelectedStep(null)}
        darkMode={true}
      />
    </div>
  );
};

