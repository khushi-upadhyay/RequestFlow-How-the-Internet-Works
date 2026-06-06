import React, { useState } from 'react';
import { Play, Pause, RotateCcw, ChevronRight, Activity, Terminal, Info, Zap } from 'lucide-react';
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

  const sim = useRequestSimulation(simulatorSettings);
  const activeStepIndex = requestFlowSteps.findIndex(s => s.id === sim.currentStepId);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col w-full">

      {/* ── Hero Header ───────────────────────────────────── */}
      <section className="py-12 px-4 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-900/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Network Simulator
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
                RequestFlow Monitor
              </h1>
              <p className="text-gray-400 text-base max-w-2xl mx-auto leading-relaxed">
                Watch your request travel through DNS, TLS, CDN, Load Balancers, and databases — in real time.
                Inspired by Wireshark & Chrome DevTools.
              </p>
            </motion.div>
          </div>

          {/* ── URL Input Bar ───────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 max-w-3xl mx-auto backdrop-blur-md shadow-2xl shadow-black/30"
          >
            <div className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-3">Target URL</div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex gap-2">
                <div className="flex items-center px-3 bg-slate-950 border border-slate-800 rounded-lg text-gray-500 font-mono text-xs select-none shrink-0">
                  HTTPS://
                </div>
                <input
                  type="text"
                  value={sim.url.replace(/^https?:\/\//i, '')}
                  onChange={(e) => sim.setUrl('https://' + e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
                  placeholder="api.github.com/users/octocat"
                  disabled={sim.isSimulating}
                />
              </div>

              <div className="flex gap-2 shrink-0">
                {sim.isSimulating ? (
                  <button
                    onClick={() => sim.isPaused ? sim.resumeSimulation() : sim.pauseSimulation()}
                    className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
                      sim.isPaused ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-amber-600 hover:bg-amber-500 text-white'
                    }`}
                  >
                    {sim.isPaused ? <Play size={15} /> : <Pause size={15} />}
                    {sim.isPaused ? 'Resume' : 'Pause'}
                  </button>
                ) : (
                  <button
                    onClick={sim.startSimulation}
                    className="flex-1 sm:flex-initial px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40"
                  >
                    <Zap size={15} />
                    Trace Request
                  </button>
                )}

                <button
                  onClick={sim.resetSimulation}
                  className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg text-sm transition-colors flex items-center justify-center"
                  title="Reset simulation"
                >
                  <RotateCcw size={15} />
                </button>
              </div>
            </div>

            {/* Quick URL suggestions */}
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="text-[11px] text-gray-600">Try:</span>
              {['api.github.com', 'jsonplaceholder.typicode.com', 'httpbin.org/get'].map(url => (
                <button
                  key={url}
                  onClick={() => sim.setUrl('https://' + url)}
                  disabled={sim.isSimulating}
                  className="text-[11px] font-mono text-blue-400 hover:text-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {url}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Main Dashboard Grid ──────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Left: Trace Map + Wireshark */}
          <div className="xl:col-span-2 flex flex-col gap-6">

            {/* 1. Live Trace Map */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="overflow-x-auto"
            >
              <DatadogTopology
                activeTrail={sim.activeTrail}
                ips={sim.ips}
                darkMode={darkMode}
              />
            </motion.div>

            {/* 2. Wireshark Inspector */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 overflow-x-auto"
            >
              <WiresharkPane
                packets={sim.visiblePackets}
                selectedPacketIndex={sim.selectedPacketIndex}
                onSelectPacket={sim.setSelectedPacketIndex}
                timingBreakdown={sim.timingBreakdown}
                darkMode={darkMode}
              />
            </motion.div>
          </div>

          {/* Right: Metrics + Settings */}
          <div className="xl:col-span-1 flex flex-col gap-6">

            {/* 1. Live Metrics */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <LiveMetrics
                metrics={sim.metrics}
                chartData={sim.chartData}
                darkMode={darkMode}
              />
            </motion.div>

            {/* 2. Simulator Settings */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <LatencyMeter
                settings={simulatorSettings}
                onSettingsChange={setSimulatorSettings}
                darkMode={true}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── How it Works: Step Cards ─────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-900/60">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
            <Activity size={16} className="text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-100">Trace Stages</h2>
        </div>
        <p className="text-sm text-gray-500 mb-8 max-w-2xl">
          Each stage in the request lifecycle. Click any card to explore its full explanation, interview Q&As, and bottlenecks.
          During a live trace, the active stage highlights automatically.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {requestFlowSteps.map((step, idx) => (
            <StepCard
              key={step.id}
              step={step}
              index={idx}
              isActive={activeStepIndex === idx || selectedStep === idx}
              onClick={() => setSelectedStep(idx)}
              darkMode={true}
            />
          ))}
        </div>
      </section>

      {/* ── Core Concepts Grid ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-900/60">
        <h2 className="text-xl font-bold mb-2 text-gray-100">Core Concepts</h2>
        <p className="text-sm text-gray-500 mb-8">The building blocks behind every web request</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              title: 'Networking Protocols',
              description: 'DNS over HTTPS, TCP sequence alignment, TLS asymmetric key exchange, HTTP/2 multiplexing.',
              icon: '🌐',
              color: '#06b6d4',
            },
            {
              title: 'Distributed Routing',
              description: 'Geo-aware CDN edge caching, Layer 4/7 load balancing algorithms, horizontal gateway scaling.',
              icon: '🏗️',
              color: '#8b5cf6',
            },
            {
              title: 'Caching Strategy',
              description: 'Multi-layer caching (Redis, HTTP Cache-Control, CDN purges) reduces DB lookups by 95%+.',
              icon: '⚡',
              color: '#f59e0b',
            },
            {
              title: 'Persistent Stores',
              description: 'B-Tree indexing, connection pooling, ACID sharding, and write-through cache serialization.',
              icon: '🗄️',
              color: '#10b981',
            },
            {
              title: 'Security & TLS',
              description: 'Certificate verification, Perfect Forward Secrecy, ephemeral Diffie-Hellman, HSTS pinning.',
              icon: '🔒',
              color: '#f43f5e',
            },
            {
              title: 'Browser Rendering',
              description: 'DOM construction, CSSOM, JS engine execution, critical render path optimization, Core Web Vitals.',
              icon: '🖥️',
              color: '#34d399',
            },
          ].map((concept, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -2, boxShadow: `0 8px 30px ${concept.color}15` }}
              className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 hover:border-slate-700 transition-all duration-200 cursor-default"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">{concept.icon}</div>
                <h3 className="font-bold text-sm text-gray-200">{concept.title}</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{concept.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Detail Panel (slide-in drawer) */}
      <DetailPanel
        step={selectedStep !== null ? requestFlowSteps[selectedStep] : null}
        onClose={() => setSelectedStep(null)}
        darkMode={true}
      />
    </div>
  );
};
