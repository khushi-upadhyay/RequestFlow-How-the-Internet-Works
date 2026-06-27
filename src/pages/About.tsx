import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Play } from 'lucide-react';
import { PageShell } from '../components';

interface AboutProps {
  darkMode: boolean;
}

export const About: React.FC<AboutProps> = () => {
  return (
    <PageShell className="bg-[#09090b] text-slate-200" contentClassName="py-10 sm:py-14">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-10"
        >
          <div className="space-y-4 text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#2b2b30] bg-[#111113] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-blue-400">
              Project overview
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#fafafa] md:text-5xl">
              About RequestFlow
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#a1a1aa] md:text-base">
              RequestFlow is an interactive sandbox for tracing how a web request moves from the browser to the
              network and back again. It is designed to feel like an internal developer platform, not a flashy demo.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              {
                step: '1',
                title: 'Trace Packets',
                desc: 'Watch traffic move across the topology from client to origin in a live trace.',
              },
              {
                step: '2',
                title: 'Inspect Headers',
                desc: 'Dig into request and response metadata through the packet inspector.',
              },
              {
                step: '3',
                title: 'Analyze Latency',
                desc: 'See how caching, server load, and network quality affect response time.',
              },
              {
                step: '4',
                title: 'Model Topologies',
                desc: 'Experiment with servers, caches, databases, and routing choices in the designer.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 rounded-xl border border-[#2b2b30] bg-[#18181b] p-5 transition-colors hover:border-[#3a3a40] hover:bg-[#232326]"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#2b2b30] bg-[#111113] font-mono text-xs font-bold text-blue-400">
                  {item.step}
                </span>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-[#fafafa]">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-[#a1a1aa]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a
              href="/"
              className="flex items-center gap-1.5 rounded-lg bg-blue-500 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-600"
            >
              <Play size={12} />
              Start Simulation
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-[#2b2b30] bg-[#111113] px-5 py-2 text-xs font-semibold text-[#e4e4e7] transition-colors hover:bg-[#232326]"
            >
              <Globe size={12} />
              GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </PageShell>
  );
};
