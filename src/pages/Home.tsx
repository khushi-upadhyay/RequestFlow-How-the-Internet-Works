import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Activity, Zap, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  StepCard,
  DetailPanel,
  LatencyMeter,
  DatadogTopology,
  LiveMetrics,
  WiresharkPane,
  PageShell,
} from '../components';
import { useRequestSimulation } from '../hooks/useRequestSimulation';
import { requestFlowSteps } from '../data/requestFlow.json';
import type { SimulatorSettings } from '../types/flow';

interface HomeProps {
  darkMode: boolean;
}

const CONCEPT_CARDS = [
  {
    title: 'Networking Protocols',
    description: 'DNS, TCP, TLS, and HTTP cooperate to move every request safely across the network.',
  },
  {
    title: 'Distributed Routing',
    description: 'CDN edges, load balancers, and gateways decide where traffic should go next.',
  },
  {
    title: 'Caching Strategy',
    description: 'Browser cache, CDN cache, and Redis all trim latency by serving hot data first.',
  },
  {
    title: 'Persistent Stores',
    description: 'Databases, indexes, and connection pools keep long-lived data fast and consistent.',
  },
  {
    title: 'Security & TLS',
    description: 'Certificates, cipher negotiation, and forward secrecy protect traffic in transit.',
  },
  {
    title: 'Browser Rendering',
    description: 'DOM, CSSOM, layout, and paint turn raw markup into a polished interface.',
  },
];

const FLOW_STATS = [
  { label: 'Journey stages', value: requestFlowSteps.length.toString(), note: 'DNS through browser paint' },
  { label: 'Average trace', value: `${requestFlowSteps.reduce((sum, step) => sum + step.latency, 0)}ms`, note: 'from the demo flow' },
  { label: 'Live controls', value: '3', note: 'URL, trace, and latency' },
];

export const Home: React.FC<HomeProps> = ({ darkMode }) => {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [simulatorSettings, setSimulatorSettings] = useState<SimulatorSettings>({
    networkSpeed: 7,
    serverLoad: 30,
    cacheHitRate: 75,
  });

  const sim = useRequestSimulation(simulatorSettings);
  const activeStepIndex = requestFlowSteps.findIndex((s) => s.id === sim.currentStepId);

  return (
    <PageShell fullBleed className="bg-[#09090b] text-white">
      <section className="px-4 py-14 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[#2b2b30] bg-[#111113] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-blue-400">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              Live request simulator
            </div>

            <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-[#fafafa] sm:text-5xl md:text-6xl">
              RequestFlow <span className="text-blue-500">Monitor</span>
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#a1a1aa] sm:text-base">
              Watch a request move through DNS, TLS, CDN edges, load balancers, and databases in real time.
              The layout is intentionally plain and readable, like an internal developer tool.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="mx-auto mt-10 max-w-3xl rounded-2xl border border-[#2b2b30] bg-[#18181b] p-4 shadow-sm sm:p-5"
          >
            <div className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#71717a]">
              Target URL
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex min-w-0 flex-1 gap-2">
                <div className="flex shrink-0 select-none items-center rounded-lg border border-[#2b2b30] bg-[#111113] px-3 font-mono text-[11px] text-[#71717a]">
                  HTTPS://
                </div>
                <input
                  type="text"
                  value={sim.url.replace(/^https?:\/\//i, '')}
                  onChange={(e) => sim.setUrl(`https://${e.target.value}`)}
                  className="min-w-0 flex-1 rounded-lg border border-[#2b2b30] bg-[#09090b] px-4 py-2.5 font-mono text-sm text-[#fafafa] transition-colors placeholder:text-[#71717a] focus:border-blue-500 focus:outline-none"
                  placeholder="api.github.com/users/octocat"
                  disabled={sim.isSimulating}
                />
              </div>

              <div className="flex gap-2">
                {sim.isSimulating ? (
                  <button
                    onClick={() => (sim.isPaused ? sim.resumeSimulation() : sim.pauseSimulation())}
                    className={`flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors ${
                      sim.isPaused ? 'bg-green-500 hover:bg-green-600' : 'bg-amber-500 hover:bg-amber-600'
                    }`}
                  >
                    {sim.isPaused ? <Play size={14} /> : <Pause size={14} />}
                    {sim.isPaused ? 'Resume' : 'Pause'}
                  </button>
                ) : (
                  <button
                    onClick={sim.startSimulation}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
                  >
                    <Zap size={14} />
                    Trace Request
                  </button>
                )}

                <button
                  onClick={sim.resetSimulation}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2b2b30] bg-[#111113] text-[#a1a1aa] transition-colors hover:bg-[#232326] hover:text-[#fafafa]"
                  title="Reset"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#71717a]">
                Try:
              </span>
              {['api.github.com', 'jsonplaceholder.typicode.com', 'httpbin.org/get'].map((url) => (
                <button
                  key={url}
                  onClick={() => sim.setUrl(`https://${url}`)}
                  disabled={sim.isSimulating}
                  className="text-[11px] font-mono text-blue-400 transition-colors hover:text-blue-300 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {url}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {FLOW_STATS.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-[#2b2b30] bg-[#18181b] p-4 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#71717a]">
                {stat.label}
              </p>
              <div className="mt-2 text-2xl font-extrabold text-[#fafafa]">{stat.value}</div>
              <p className="mt-1 text-xs leading-relaxed text-[#a1a1aa]">{stat.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="flex flex-col gap-5 xl:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="overflow-x-auto"
            >
              <DatadogTopology activeTrail={sim.activeTrail} ips={sim.ips} darkMode={darkMode} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="overflow-x-auto"
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

          <div className="flex flex-col gap-5">
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 }}
            >
              <LiveMetrics metrics={sim.metrics} chartData={sim.chartData} darkMode={darkMode} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.14 }}
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

      <section className="mx-auto w-full max-w-7xl border-t border-[#2b2b30] px-4 py-14">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2b2b30] bg-[#111113]">
            <Activity size={15} className="text-blue-500" />
          </div>
          <h2 className="text-lg font-extrabold tracking-tight text-[#fafafa]">Trace Stages</h2>
          <ChevronRight size={16} className="text-[#71717a]" />
          <span className="font-mono text-xs text-[#71717a]">{requestFlowSteps.length} steps</span>
        </div>
        <p className="mb-7 max-w-2xl pl-11 text-xs leading-relaxed text-[#71717a]">
          Click a step to inspect its explanation, interview questions, and bottlenecks. The active stage also
          highlights automatically during a live trace.
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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

      <section className="mx-auto w-full max-w-7xl border-t border-[#2b2b30] px-4 py-14">
        <h2 className="mb-1 text-lg font-extrabold tracking-tight text-[#fafafa]">Core Concepts</h2>
        <p className="mb-7 text-xs text-[#71717a]">The building blocks behind every web request</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CONCEPT_CARDS.map((concept, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -1, scale: 1.02, transition: { duration: 0.15 } }}
              className="rounded-xl border border-[#2b2b30] bg-[#18181b] p-5 shadow-sm transition-colors hover:border-[#3a3a40] hover:bg-[#232326]"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-[#2b2b30] bg-[#111113] text-blue-500">
                <span className="text-xl">{idx === 0 ? '🌐' : idx === 1 ? '🛣️' : idx === 2 ? '⚡' : idx === 3 ? '🗄️' : idx === 4 ? '🔒' : '🖥️'}</span>
              </div>
              <h3 className="mb-2 text-sm font-semibold text-[#fafafa]">{concept.title}</h3>
              <p className="text-[11px] leading-relaxed text-[#a1a1aa]">{concept.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <DetailPanel
        step={selectedStep !== null ? requestFlowSteps[selectedStep] : null}
        onClose={() => setSelectedStep(null)}
        darkMode={true}
      />
    </PageShell>
  );
};
