import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle, AlertCircle, Clock, Play } from 'lucide-react';
import { PageShell } from '../components';

interface LearnProps {
  darkMode: boolean;
}

const STEPS = [
  {
    id: 'dns',
    title: 'DNS Resolution',
    subtitle: 'Translating a domain into an IP address',
    latency: 50,
    summary:
      'Your browser asks a resolver where the server lives. If the answer is cached, the request moves immediately. If not, the resolver walks the DNS hierarchy.',
    facts: ['Caching reduces repeated lookups', 'TTL controls cache freshness', 'Resolver choice impacts latency'],
    tips: ['Explain recursive vs iterative lookups', 'Mention browser, OS, and ISP caches', 'Talk about TTL and propagation'],
  },
  {
    id: 'tcp',
    title: 'TCP Handshake',
    subtitle: 'Establishing a reliable connection',
    latency: 40,
    summary:
      'Client and server exchange a short handshake so both sides agree on sequence numbers and start communicating reliably.',
    facts: ['SYN, SYN-ACK, ACK', 'Reliable and ordered delivery', 'QUIC avoids some handshake overhead'],
    tips: ['Explain the 3-way handshake', 'Compare TCP with UDP', 'Mention retry and retransmission'],
  },
  {
    id: 'tls',
    title: 'TLS Handshake',
    subtitle: 'Setting up encrypted transport',
    latency: 70,
    summary:
      'TLS negotiates encryption settings, verifies the server certificate, and derives session keys so outsiders cannot read the traffic.',
    facts: ['Certificates prove identity', 'TLS 1.3 reduces round trips', 'Forward secrecy protects old sessions'],
    tips: ['Explain symmetric vs asymmetric crypto', 'Describe certificate trust chains', 'Mention HTTPS and HSTS'],
  },
  {
    id: 'cdn',
    title: 'CDN Edge Cache',
    subtitle: 'Serving content from a nearby edge',
    latency: 12,
    summary:
      'A CDN stores copies of static assets closer to the user so pages and media load faster without overloading origin servers.',
    facts: ['Cuts latency and origin load', 'Cache hit vs miss matters', 'Edge nodes are geographically distributed'],
    tips: ['Explain invalidation strategies', 'Talk about cache headers', 'Describe stale content tradeoffs'],
  },
  {
    id: 'lb',
    title: 'Load Balancer',
    subtitle: 'Spreading requests across servers',
    latency: 5,
    summary:
      'A load balancer routes requests to healthy backends so no single server becomes a bottleneck.',
    facts: ['Round robin is common', 'Health checks remove bad nodes', 'Sticky sessions can create uneven load'],
    tips: ['Compare L4 and L7 balancing', 'Explain session affinity', 'Mention auto-scaling'],
  },
  {
    id: 'cache',
    title: 'Application Cache',
    subtitle: 'Using Redis for hot data',
    latency: 2,
    summary:
      'The app checks memory first before going to the database. This keeps frequently used data fast and lowers database pressure.',
    facts: ['Redis is in-memory', 'TTL prevents stale data', 'Cache-aside is a common pattern'],
    tips: ['Explain cache invalidation', 'Mention eviction policies', 'Discuss when not to cache'],
  },
  {
    id: 'db',
    title: 'Database Query',
    subtitle: 'Reading durable data',
    latency: 150,
    summary:
      'The database uses indexes and execution plans to fetch durable data efficiently, then returns the result to the application server.',
    facts: ['B-tree indexes speed lookup', 'ACID guarantees correctness', 'Connection pooling reduces overhead'],
    tips: ['Explain indexes and joins', 'Discuss SQL vs NoSQL', 'Mention the N+1 problem'],
  },
  {
    id: 'render',
    title: 'Browser Rendering',
    subtitle: 'Turning markup into pixels',
    latency: 200,
    summary:
      'The browser builds the DOM, applies styles, lays out elements, and paints the final pixels that users see.',
    facts: ['Layout and paint are distinct', 'Blocking JS slows render', 'Web Vitals measure user impact'],
    tips: ['Explain the rendering pipeline', 'Define reflow vs repaint', 'Talk about async and defer'],
  },
];

export const Learn: React.FC<LearnProps> = () => {
  const [activeStep, setActiveStep] = useState<string | null>('dns');
  const totalLatency = useMemo(() => STEPS.reduce((sum, step) => sum + step.latency, 0), []);

  return (
    <PageShell fullBleed className="bg-[#09090b] text-slate-200" contentClassName="py-10 sm:py-14">
      <section className="mx-auto w-full max-w-7xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[#2b2b30] bg-[#111113] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-blue-400">
            Interactive guide
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#fafafa] sm:text-5xl md:text-6xl">
            How the Internet Works
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#a1a1aa]">
            A clean, step-by-step explanation of the request lifecycle. Each section focuses on what happens,
            why it matters, and how to explain it clearly in interviews.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-[#2b2b30] bg-[#18181b] p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between text-xs text-[#71717a]">
            <span className="font-semibold uppercase tracking-widest">Total request time</span>
            <span className="font-mono">{Math.round(totalLatency)}ms</span>
          </div>
          <div className="flex gap-1 overflow-hidden rounded-full bg-[#111113] p-1">
            {STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`h-3.5 flex-1 rounded-full transition-colors ${
                  activeStep === step.id ? 'bg-blue-500' : 'bg-[#2b2b30] hover:bg-[#3a3a40]'
                }`}
                title={step.title}
              />
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
                  activeStep === step.id
                    ? 'border-blue-500/20 bg-blue-500/10 text-blue-400'
                    : 'border-[#2b2b30] bg-[#111113] text-[#a1a1aa] hover:bg-[#232326]'
                }`}
              >
                {step.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12">
        <div className="space-y-4">
          {STEPS.map((step, idx) => {
            const isOpen = activeStep === step.id;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.03 }}
                className="overflow-hidden rounded-2xl border border-[#2b2b30] bg-[#18181b] shadow-sm"
              >
                <button
                  onClick={() => setActiveStep(isOpen ? null : step.id)}
                  className="flex w-full items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-[#232326]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#2b2b30] bg-[#111113] text-sm font-bold text-blue-500">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-semibold text-[#fafafa]">{step.title}</h2>
                      <span className="rounded-full border border-[#2b2b30] bg-[#111113] px-2 py-0.5 font-mono text-[10px] text-[#a1a1aa]">
                        ~{step.latency}ms
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-[#71717a]">{step.subtitle}</p>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-[#71717a] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-[#2b2b30]"
                    >
                      <div className="space-y-6 px-6 py-6">
                        <div className="rounded-xl border border-[#2b2b30] bg-[#111113] p-4">
                          <p className="text-sm leading-relaxed text-[#e4e4e7]">{step.summary}</p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="rounded-xl border border-[#2b2b30] bg-[#111113] p-4">
                            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#71717a]">
                              <CheckCircle size={14} className="text-blue-500" />
                              Key Facts
                            </div>
                            <ul className="space-y-2">
                              {step.facts.map((fact) => (
                                <li key={fact} className="flex items-start gap-2 text-sm text-[#a1a1aa]">
                                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                                  <span>{fact}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="rounded-xl border border-[#2b2b30] bg-[#111113] p-4">
                            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#71717a]">
                              <AlertCircle size={14} className="text-amber-500" />
                              Interview Tips
                            </div>
                            <ul className="space-y-2">
                              {step.tips.map((tip) => (
                                <li key={tip} className="flex items-start gap-2 text-sm text-[#a1a1aa]">
                                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl border-t border-[#2b2b30] px-4 py-14">
        <h2 className="mb-2 text-center text-2xl font-extrabold tracking-tight text-[#fafafa]">
          Complete Request Timeline
        </h2>
        <p className="mb-10 text-center text-sm text-[#71717a]">
          A full web request completes in under a second. Here is the relative weight of each stage.
        </p>

        <div className="mx-auto flex max-w-3xl flex-col gap-3">
          {STEPS.map((step) => {
            const pct = (step.latency / totalLatency) * 100;
            return (
              <div key={step.id} className="flex items-center gap-4">
                <div className="w-28 shrink-0 text-right text-[11px] font-medium text-[#71717a] sm:w-36">
                  {step.title}
                </div>
                <div className="h-4 flex-1 overflow-hidden rounded-full bg-[#111113] border border-[#2b2b30]">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                </div>
                <div className="w-14 shrink-0 font-mono text-[11px] text-[#a1a1aa]">{step.latency}ms</div>
              </div>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
};
