import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Handshake,
  Lock,
  Cloud,
  GitBranch,
  Zap,
  Database,
  Monitor,
  ChevronRight,
  ChevronDown,
  Clock,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Wifi,
  Server,
  HardDrive
} from 'lucide-react';

interface LearnProps {
  darkMode: boolean;
}

// ─── Visual Diagram Components ───────────────────────────────────────────────

const DNSDiagram: React.FC = () => {
  const [step, setStep] = useState(0);
  const steps = [
    { label: 'You type\ngoogle.com', icon: Monitor, color: '#3b82f6', pos: { x: 40, y: 50 } },
    { label: 'DNS Resolver\n(like 8.8.8.8)', icon: Globe, color: '#06b6d4', pos: { x: 250, y: 50 } },
    { label: 'Root\nNameserver', icon: Server, color: '#8b5cf6', pos: { x: 460, y: 20 } },
    { label: 'TLD Server\n(.com)', icon: Server, color: '#8b5cf6', pos: { x: 460, y: 80 } },
    { label: 'Returns IP\n142.250.185.46', icon: CheckCircle, color: '#10b981', pos: { x: 40, y: 50 } },
  ];

  React.useEffect(() => {
    const timer = setInterval(() => setStep(s => (s + 1) % 5), 1800);
    return () => clearInterval(timer);
  }, []);

  const arrowColor = step <= 2 ? '#3b82f6' : '#10b981';

  return (
    <div className="w-full rounded-xl bg-slate-900/60 border border-slate-800 p-5 flex flex-col gap-3">
      <div className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">Live DNS Resolution Flow</div>
      <div className="flex items-center gap-3 flex-wrap">
        {/* Browser */}
        <div className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${step >= 0 ? 'opacity-100' : 'opacity-30'}`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${step === 0 || step === 4 ? 'bg-blue-500/20 border-blue-500 shadow-lg shadow-blue-500/30' : 'bg-slate-800 border-slate-700'}`}>
            <Monitor size={22} className="text-blue-400" />
          </div>
          <span className="text-[10px] text-gray-400 text-center leading-tight">Your<br/>Browser</span>
        </div>

        {/* Arrow 1 */}
        <div className="flex flex-col items-center gap-1">
          <motion.div
            animate={{ x: step === 1 ? [0, 8, 0] : 0 }}
            transition={{ repeat: step === 1 ? Infinity : 0, duration: 0.6 }}
          >
            <ArrowRight size={18} className={step === 1 ? 'text-cyan-400' : 'text-slate-600'} />
          </motion.div>
          <span className="text-[9px] text-gray-600">SYN query</span>
        </div>

        {/* DNS Resolver */}
        <div className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${step >= 1 && step <= 3 ? 'opacity-100' : 'opacity-40'}`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${step >= 1 && step <= 3 ? 'bg-cyan-500/20 border-cyan-500 shadow-lg shadow-cyan-500/30' : 'bg-slate-800 border-slate-700'}`}>
            <Globe size={22} className="text-cyan-400" />
          </div>
          <span className="text-[10px] text-gray-400 text-center leading-tight">DNS<br/>Resolver</span>
          <span className="text-[9px] font-mono text-gray-600">8.8.8.8</span>
        </div>

        {/* Arrow 2 */}
        <div className="flex flex-col items-center gap-1">
          <motion.div animate={{ x: step === 2 ? [0, 8, 0] : 0 }} transition={{ repeat: step === 2 ? Infinity : 0, duration: 0.6 }}>
            <ArrowRight size={18} className={step === 2 ? 'text-purple-400' : 'text-slate-600'} />
          </motion.div>
          <span className="text-[9px] text-gray-600">recursive</span>
        </div>

        {/* Root + TLD */}
        <div className="flex flex-col gap-2">
          {['Root Server', '.com TLD'].map((label, i) => (
            <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-300 ${step === 2 + i ? 'bg-purple-500/20 border-purple-500' : 'bg-slate-800/60 border-slate-700'}`}>
              <Server size={14} className={step === 2 + i ? 'text-purple-400' : 'text-slate-500'} />
              <span className="text-[10px] text-gray-400">{label}</span>
            </div>
          ))}
        </div>

        {/* Return arrow */}
        <div className="flex flex-col items-center gap-1">
          <motion.div animate={{ x: step === 4 ? [0, -8, 0] : 0 }} transition={{ repeat: step === 4 ? Infinity : 0, duration: 0.6 }}>
            <ArrowRight size={18} className={`rotate-180 ${step === 4 ? 'text-emerald-400' : 'text-slate-600'}`} />
          </motion.div>
          <span className="text-[9px] text-gray-600">IP address</span>
        </div>

        {/* IP result */}
        <div className={`px-3 py-2 rounded-lg border transition-all duration-300 ${step === 4 ? 'bg-emerald-500/20 border-emerald-500' : 'bg-slate-800/40 border-slate-700'}`}>
          <div className="text-[10px] text-gray-400">Result</div>
          <div className="text-[11px] font-mono text-emerald-400">142.250.185.46</div>
        </div>
      </div>

      {/* Step label */}
      <div className="flex gap-2 items-center">
        {['Query sent', 'Resolver checks', 'Asks root/TLD', 'Gets answer', 'IP returned!'].map((s, i) => (
          <div key={i} className={`flex-1 py-1 px-2 rounded text-center text-[9px] transition-all duration-300 font-medium ${step === i ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'text-gray-600'}`}>
            {s}
          </div>
        ))}
      </div>
    </div>
  );
};

const TCPDiagram: React.FC = () => {
  const [tick, setTick] = useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setTick(s => (s + 1) % 3), 1200);
    return () => clearInterval(t);
  }, []);

  const packets = [
    { label: 'SYN', from: 'client', color: '#3b82f6', emoji: '👋', desc: '"Can we talk?"' },
    { label: 'SYN-ACK', from: 'server', color: '#10b981', emoji: '✅', desc: '"Yes! Ready!"' },
    { label: 'ACK', from: 'client', color: '#f59e0b', emoji: '🤝', desc: '"Great, let\'s go!"' },
  ];

  return (
    <div className="w-full rounded-xl bg-slate-900/60 border border-slate-800 p-5">
      <div className="text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-4">TCP 3-Way Handshake</div>
      <div className="flex gap-4 items-start">
        {/* Client column */}
        <div className="flex flex-col items-center gap-1.5 w-20">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center">
            <Monitor size={22} className="text-blue-400" />
          </div>
          <span className="text-[10px] text-gray-400">Client</span>
        </div>

        {/* Timeline */}
        <div className="flex-1 flex flex-col gap-2">
          {packets.map((p, i) => (
            <motion.div
              key={i}
              animate={{ opacity: tick >= i ? 1 : 0.25, x: tick >= i ? 0 : (p.from === 'client' ? -20 : 20) }}
              transition={{ duration: 0.4 }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${tick >= i ? 'border-opacity-50' : 'border-slate-700 bg-slate-900/40'}`}
              style={{ borderColor: tick >= i ? p.color + '60' : undefined, background: tick >= i ? p.color + '15' : undefined }}
            >
              <span className="text-lg">{p.emoji}</span>
              <div>
                <span className="text-xs font-bold font-mono" style={{ color: p.color }}>{p.label}</span>
                <span className="text-[10px] text-gray-400 ml-2">{p.desc}</span>
              </div>
              <div className="ml-auto">
                {p.from === 'client' ? (
                  <ArrowRight size={14} style={{ color: p.color }} />
                ) : (
                  <ArrowRight size={14} className="rotate-180" style={{ color: p.color }} />
                )}
              </div>
            </motion.div>
          ))}
          {tick === 2 && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="px-3 py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-center">
              <span className="text-[11px] text-emerald-400 font-semibold">🎉 Connection Established! Data can now flow.</span>
            </motion.div>
          )}
        </div>

        {/* Server column */}
        <div className="flex flex-col items-center gap-1.5 w-20">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
            <Server size={22} className="text-emerald-400" />
          </div>
          <span className="text-[10px] text-gray-400">Server</span>
        </div>
      </div>
    </div>
  );
};

const TLSDiagram: React.FC = () => {
  const [phase, setPhase] = useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setPhase(s => (s + 1) % 4), 1500);
    return () => clearInterval(t);
  }, []);

  const phases = [
    { icon: '🔑', label: 'Client Hello', desc: 'Browser offers cipher suites & TLS version', color: '#3b82f6' },
    { icon: '📜', label: 'Server Hello + Cert', desc: 'Server picks cipher, sends SSL certificate', color: '#8b5cf6' },
    { icon: '🔐', label: 'Key Exchange', desc: 'Both sides derive shared secret key', color: '#f59e0b' },
    { icon: '🛡️', label: 'Encrypted!', desc: 'All traffic now encrypted with AES-256', color: '#10b981' },
  ];

  return (
    <div className="w-full rounded-xl bg-slate-900/60 border border-slate-800 p-5">
      <div className="text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-4">TLS Handshake Phases</div>
      <div className="grid grid-cols-4 gap-2">
        {phases.map((p, i) => (
          <motion.div
            key={i}
            animate={{ scale: phase === i ? 1.04 : 1, opacity: phase >= i ? 1 : 0.35 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-2 p-3 rounded-lg border text-center"
            style={{
              borderColor: phase >= i ? p.color + '50' : '#1e293b',
              background: phase === i ? p.color + '20' : 'rgba(15,23,42,0.5)'
            }}
          >
            <span className="text-2xl">{p.icon}</span>
            <span className="text-[10px] font-bold" style={{ color: phase >= i ? p.color : '#475569' }}>{p.label}</span>
            <span className="text-[9px] text-gray-500 leading-tight">{p.desc}</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 text-center">
        <span className="text-[10px] text-gray-500">Think of it like: </span>
        <span className="text-[10px] text-gray-300">passing a locked box through an insecure room, then both sides use the same key 🗝️</span>
      </div>
    </div>
  );
};

const CDNDiagram: React.FC = () => {
  const [showEdge, setShowEdge] = useState(false);
  React.useEffect(() => {
    const t = setInterval(() => setShowEdge(s => !s), 2000);
    return () => clearInterval(t);
  }, []);

  const edges = [
    { city: 'Mumbai', lat: '12ms', flag: '🇮🇳' },
    { city: 'London', lat: '8ms', flag: '🇬🇧' },
    { city: 'New York', lat: '11ms', flag: '🇺🇸' },
  ];

  return (
    <div className="w-full rounded-xl bg-slate-900/60 border border-slate-800 p-5">
      <div className="text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-4">CDN Edge Caching</div>
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center">
            <Monitor size={20} className="text-blue-400" />
          </div>
          <span className="text-[10px] text-gray-400">User</span>
        </div>

        <ArrowRight size={16} className="text-slate-600" />

        <div className="flex flex-col gap-2">
          {edges.map((e, i) => (
            <motion.div
              key={i}
              animate={{ scale: showEdge && i === 0 ? 1.06 : 1, borderColor: showEdge && i === 0 ? '#06b6d4' : '#1e293b' }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-900/40"
            >
              <span>{e.flag}</span>
              <span className="text-[10px] text-gray-300">{e.city} Edge</span>
              <span className="ml-auto text-[10px] font-mono text-emerald-400">{e.lat}</span>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col items-center">
          <div className="flex flex-col gap-1 items-center">
            <AnimatePresence mode="wait">
              {showEdge ? (
                <motion.div key="hit" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-[10px] text-emerald-400 font-semibold">
                  ⚡ Cache HIT — No origin needed!
                </motion.div>
              ) : (
                <motion.div key="miss" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-[10px] text-amber-400 font-semibold">
                  🔄 Cache MISS — Fetching origin...
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <ArrowRight size={16} className="text-slate-600" />

        <div className="flex flex-col items-center gap-1 opacity-60">
          <div className="w-12 h-12 rounded-xl bg-slate-700 border border-slate-600 flex items-center justify-center">
            <Database size={20} className="text-slate-400" />
          </div>
          <span className="text-[10px] text-gray-500">Origin<br/>Server</span>
        </div>
      </div>
    </div>
  );
};

const LoadBalancerDiagram: React.FC = () => {
  const [active, setActive] = useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % 3), 1000);
    return () => clearInterval(t);
  }, []);

  const servers = [
    { id: 1, load: 32, color: '#10b981' },
    { id: 2, load: 67, color: '#f59e0b' },
    { id: 3, load: 18, color: '#10b981' },
  ];

  return (
    <div className="w-full rounded-xl bg-slate-900/60 border border-slate-800 p-5">
      <div className="text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-4">Load Balancer → App Servers</div>
      <div className="flex items-center gap-4">
        {/* LB Node */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-14 h-14 rounded-xl bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center">
            <GitBranch size={24} className="text-purple-400" />
          </div>
          <span className="text-[10px] text-gray-400">Load<br/>Balancer</span>
        </div>

        {/* Distribution arrows + servers */}
        <div className="flex-1 flex flex-col gap-2">
          {servers.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <motion.div animate={{ width: active === i ? 32 : 16 }} className="h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full" />
              <div className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 ${active === i ? 'border-purple-500/50 bg-purple-500/15' : 'border-slate-700 bg-slate-900/40'}`}>
                <Server size={14} className={active === i ? 'text-purple-400' : 'text-slate-500'} />
                <span className="text-[10px] text-gray-400">App Server #{s.id}</span>
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${s.load}%`, backgroundColor: s.color }} />
                  </div>
                  <span className="text-[9px] font-mono text-gray-500">{s.load}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 text-center text-[10px] text-gray-500">
        Algorithm: <span className="text-blue-400 font-semibold">Round Robin</span> — each request goes to next server in sequence
      </div>
    </div>
  );
};

const CacheDiagram: React.FC = () => {
  const [lookup, setLookup] = useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setLookup(s => (s + 1) % 3), 1400);
    return () => clearInterval(t);
  }, []);

  const layers = [
    { label: 'L1: CPU Cache', time: '< 1ns', icon: '⚡', color: '#10b981' },
    { label: 'L2: Redis Cache', time: '0.5ms', icon: '🔴', color: '#f43f5e' },
    { label: 'L3: PostgreSQL DB', time: '150ms', icon: '🗄️', color: '#f59e0b' },
  ];

  return (
    <div className="w-full rounded-xl bg-slate-900/60 border border-slate-800 p-5">
      <div className="text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-4">Cache Lookup Hierarchy</div>
      <div className="flex flex-col gap-2">
        {layers.map((l, i) => (
          <motion.div
            key={i}
            animate={{ scale: lookup === i ? 1.02 : 1, opacity: lookup < i ? 0.4 : 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg border"
            style={{ borderColor: lookup === i ? l.color + '60' : '#1e293b', background: lookup === i ? l.color + '15' : 'rgba(15,23,42,0.5)' }}
          >
            <span className="text-xl">{l.icon}</span>
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-200">{l.label}</div>
              <div className="text-[10px] text-gray-500">
                {lookup > i ? '✓ Cache HIT here!' : lookup === i ? '🔍 Checking...' : 'Cache MISS → try next'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold font-mono" style={{ color: l.color }}>{l.time}</div>
              <div className="text-[9px] text-gray-600">avg latency</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const DatabaseDiagram: React.FC = () => {
  const [queryPhase, setQueryPhase] = useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setQueryPhase(s => (s + 1) % 4), 1200);
    return () => clearInterval(t);
  }, []);

  const phases = [
    { label: 'Query received', code: "SELECT * FROM users WHERE id=42", color: '#3b82f6' },
    { label: 'Index lookup', code: 'B-Tree index: O(log n) → row 42', color: '#8b5cf6' },
    { label: 'Read from disk', code: 'Fetch page 0x4A3F from storage', color: '#f59e0b' },
    { label: 'Return result', code: '{ id: 42, name: "Alice", ... }', color: '#10b981' },
  ];

  return (
    <div className="w-full rounded-xl bg-slate-900/60 border border-slate-800 p-5">
      <div className="text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-4">Database Query Execution</div>
      <div className="flex flex-col gap-2">
        {phases.map((p, i) => (
          <motion.div
            key={i}
            animate={{ x: queryPhase === i ? 4 : 0, opacity: queryPhase >= i ? 1 : 0.3 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-3 px-3 py-2.5 rounded-lg border"
            style={{ borderColor: queryPhase >= i ? p.color + '40' : '#1e293b', background: queryPhase >= i ? p.color + '10' : 'transparent' }}
          >
            <span className="text-xs font-bold w-5 text-center" style={{ color: p.color }}>{i + 1}.</span>
            <div className="flex-1">
              <div className="text-[10px] font-semibold text-gray-300">{p.label}</div>
              <code className="text-[9px] font-mono" style={{ color: queryPhase >= i ? p.color : '#475569' }}>{p.code}</code>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const BrowserRenderDiagram: React.FC = () => {
  const [renderStep, setRenderStep] = useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setRenderStep(s => (s + 1) % 5), 1100);
    return () => clearInterval(t);
  }, []);

  const steps = [
    { label: 'HTML → DOM', icon: '📄', color: '#3b82f6' },
    { label: 'CSS → CSSOM', icon: '🎨', color: '#8b5cf6' },
    { label: 'DOM + CSSOM → Render Tree', icon: '🌲', color: '#06b6d4' },
    { label: 'Layout (reflow)', icon: '📐', color: '#f59e0b' },
    { label: 'Paint & Composite', icon: '🖼️', color: '#10b981' },
  ];

  return (
    <div className="w-full rounded-xl bg-slate-900/60 border border-slate-800 p-5">
      <div className="text-[11px] font-mono text-gray-400 uppercase tracking-widest mb-4">Browser Critical Render Path</div>
      <div className="flex items-center gap-1 flex-wrap">
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <motion.div
              animate={{ scale: renderStep === i ? 1.1 : 1, opacity: renderStep >= i ? 1 : 0.3 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg border text-center"
              style={{ borderColor: renderStep >= i ? s.color + '50' : '#1e293b', background: renderStep === i ? s.color + '20' : 'transparent' }}
            >
              <span className="text-lg">{s.icon}</span>
              <span className="text-[9px] font-medium" style={{ color: renderStep >= i ? s.color : '#475569' }}>{s.label}</span>
            </motion.div>
            {i < steps.length - 1 && <ArrowRight size={12} className="text-slate-600 shrink-0" />}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-gray-500 text-center">
        💡 JavaScript blocks this pipeline — that's why async/defer loading matters!
      </div>
    </div>
  );
};

// ─── Step Configuration ──────────────────────────────────────────────────────

const STEPS = [
  {
    id: 'dns',
    icon: Globe,
    emoji: '🌐',
    color: '#06b6d4',
    bg: 'from-cyan-500/10 to-blue-500/5',
    border: 'border-cyan-500/30',
    title: 'DNS Resolution',
    subtitle: 'Translating a name to an address',
    analogy: '📞 Like looking up a phone number in a phonebook — you know the name, you need the number.',
    layman: 'When you type "google.com", your computer doesn\'t understand names — it needs a number (IP address) to route the request. DNS is the phone book of the internet.',
    latency: '50ms',
    diagram: <DNSDiagram />,
    keyFacts: ['DNS records are cached (TTL)', 'Multiple levels: Root → TLD → Auth', 'Can use HTTPS for privacy (DoH)', '8.8.8.8 = Google DNS, 1.1.1.1 = Cloudflare'],
    interviewTips: ['Explain recursive vs iterative', 'Talk about TTL & propagation delays', 'Mention DNS caching at browser, OS, and ISP levels'],
  },
  {
    id: 'tcp',
    icon: Handshake,
    emoji: '🤝',
    color: '#94a3b8',
    bg: 'from-slate-500/10 to-slate-600/5',
    border: 'border-slate-500/30',
    title: 'TCP Handshake',
    subtitle: '3 packets to establish a connection',
    analogy: '📞 Like confirming with someone on the phone before starting a call — both sides agree to talk.',
    layman: 'Before sending any data, your computer and the server do a 3-step "hello" to confirm they\'re both ready. This makes data delivery reliable and ordered.',
    latency: '40ms',
    diagram: <TCPDiagram />,
    keyFacts: ['SYN → SYN-ACK → ACK', 'Establishes sequence numbers', 'TCP = reliable, UDP = fast but unreliable', 'QUIC (HTTP/3) avoids handshake delays'],
    interviewTips: ['SYN flood attack explanation', 'TCP vs UDP tradeoffs', 'Why HTTP/3 uses QUIC (no handshake overhead)'],
  },
  {
    id: 'tls',
    icon: Lock,
    emoji: '🔒',
    color: '#c084fc',
    bg: 'from-purple-500/10 to-violet-500/5',
    border: 'border-purple-500/30',
    title: 'TLS Handshake',
    subtitle: 'Encrypting the connection',
    analogy: '📦 Like putting your message in a box with a lock — only the person with the key can open it.',
    layman: 'TLS makes sure nobody can read your data in transit. The browser and server agree on a secret encryption key so all communication is scrambled to outsiders.',
    latency: '70ms',
    diagram: <TLSDiagram />,
    keyFacts: ['TLS 1.3 = fastest, most secure', 'Uses asymmetric keys to share symmetric key', 'Certificate = proof of identity (CA signed)', 'Perfect Forward Secrecy (PFS) protects old sessions'],
    interviewTips: ['Explain asymmetric vs symmetric encryption', 'How certificate chains work', 'What "HTTPS" means vs HTTP'],
  },
  {
    id: 'cdn',
    icon: Cloud,
    emoji: '☁️',
    color: '#818cf8',
    bg: 'from-indigo-500/10 to-blue-500/5',
    border: 'border-indigo-500/30',
    title: 'CDN Edge Cache',
    subtitle: 'Serving content from nearby servers',
    analogy: '🏪 Like a convenience store near your house vs driving across town to the warehouse every time.',
    layman: 'Instead of everyone fetching content from one far-away server, CDNs store copies of files at data centers around the world. You get data from the nearest one.',
    latency: '12ms (cache hit)',
    diagram: <CDNDiagram />,
    keyFacts: ['Reduces origin server load by 80-95%', 'Cache-Control headers control what\'s stored', 'Cache HIT vs MISS determines latency', 'Cloudflare, Fastly, Akamai are popular CDNs'],
    interviewTips: ['Explain cache invalidation strategies', 'CDN for static vs dynamic content', 'Trade-off: stale content vs performance'],
  },
  {
    id: 'lb',
    icon: GitBranch,
    emoji: '⚖️',
    color: '#f472b6',
    bg: 'from-pink-500/10 to-rose-500/5',
    border: 'border-pink-500/30',
    title: 'Load Balancer',
    subtitle: 'Distributing traffic across servers',
    analogy: '🏪 Like a supermarket that opens multiple checkout lanes so nobody waits too long.',
    layman: 'A load balancer sits in front of multiple servers and decides which one handles each request. This prevents one server from getting overwhelmed.',
    latency: '2ms',
    diagram: <LoadBalancerDiagram />,
    keyFacts: ['Algorithms: Round Robin, Least Connections, IP Hash', 'Layer 4 (TCP) vs Layer 7 (HTTP) load balancing', 'Health checks remove unhealthy servers automatically', 'AWS ALB, Nginx, HAProxy are common choices'],
    interviewTips: ['L4 vs L7 load balancing differences', 'Sticky sessions and why they\'re problematic', 'Auto-scaling with load balancers'],
  },
  {
    id: 'cache',
    icon: Zap,
    emoji: '⚡',
    color: '#fb923c',
    bg: 'from-orange-500/10 to-amber-500/5',
    border: 'border-orange-500/30',
    title: 'Application Cache',
    subtitle: 'Redis — blazing fast data lookup',
    analogy: '📝 Like sticky notes on your desk vs going to the filing cabinet — cached answers are instant.',
    layman: 'Instead of querying the database for the same data repeatedly, the app stores hot results in Redis (in-memory). Redis answers in 0.5ms vs 150ms for database.',
    latency: '0.5ms',
    diagram: <CacheDiagram />,
    keyFacts: ['Redis = in-memory key-value store', 'TTL-based expiry prevents stale data', 'Cache-aside pattern is most common', 'Reduces DB load by 90%+ for read-heavy apps'],
    interviewTips: ['Cache eviction policies (LRU, LFU)', 'Cache stampede / thundering herd problem', 'When NOT to cache (real-time financial data)'],
  },
  {
    id: 'db',
    icon: Database,
    emoji: '🗄️',
    color: '#fbbf24',
    bg: 'from-amber-500/10 to-yellow-500/5',
    border: 'border-amber-500/30',
    title: 'Database Query',
    subtitle: 'Persistent data storage',
    analogy: '📚 Like a library — organized so you can quickly find any book using the catalog (index).',
    layman: 'The database is where all permanent data lives. Indexes make lookups fast — instead of scanning every row, they jump straight to the right location.',
    latency: '150ms',
    diagram: <DatabaseDiagram />,
    keyFacts: ['B-Tree indexes: O(log n) lookup', 'ACID transactions guarantee consistency', 'Connection pooling reuses connections', 'Read replicas scale reads horizontally'],
    interviewTips: ['When to use SQL vs NoSQL', 'Index types and tradeoffs', 'N+1 query problem and how to solve it'],
  },
  {
    id: 'render',
    icon: Monitor,
    emoji: '🖥️',
    color: '#34d399',
    bg: 'from-emerald-500/10 to-green-500/5',
    border: 'border-emerald-500/30',
    title: 'Browser Rendering',
    subtitle: 'Turning HTML into pixels',
    analogy: '🏗️ Like building a house — first the blueprint (HTML), then materials (CSS), then construction (render, paint).',
    layman: 'Once the browser receives HTML, it builds a model of the page (DOM), applies styles (CSSOM), figures out layout, and finally draws pixels on screen.',
    latency: '~16ms per frame',
    diagram: <BrowserRenderDiagram />,
    keyFacts: ['60fps = 16ms per frame budget', 'Blocking JS delays render', 'CSS is render-blocking too', 'GPU compositing avoids expensive repaints'],
    interviewTips: ['Difference between repaint and reflow', 'How to optimize CLS and LCP (Web Vitals)', 'Why async/defer matters for JS'],
  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export const Learn: React.FC<LearnProps> = ({ darkMode }) => {
  const [activeStep, setActiveStep] = useState<string | null>(null);

  const totalLatency = STEPS.reduce((sum, s) => {
    const n = parseFloat(s.latency);
    return sum + (isNaN(n) ? 20 : n);
  }, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero */}
      <section className="py-16 px-4 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-900">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-6">
              <Wifi size={12} /> Visual Learning Mode
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              How the Internet Works
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              8 steps. Visual diagrams. Real examples. Understand what happens in the
              <span className="text-cyan-400 font-semibold"> ~350ms</span> between typing a URL and seeing a page.
            </p>

            {/* Latency timeline bar */}
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-1 mb-2">
                {STEPS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setActiveStep(activeStep === s.id ? null : s.id)}
                    className="flex-1 group relative"
                    title={s.title}
                  >
                    <div
                      className="h-3 rounded-sm transition-all duration-200 group-hover:opacity-90 group-hover:scale-y-125"
                      style={{ backgroundColor: s.color }}
                    />
                    <div className="text-[8px] text-gray-500 mt-0.5 text-center truncate">{s.emoji}</div>
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-gray-600 font-mono">
                <span>0ms</span>
                <span>Total: ~{Math.round(totalLatency)}ms</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="max-w-5xl mx-auto px-4 py-12 space-y-6">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isOpen = activeStep === step.id;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
              className={`rounded-2xl border overflow-hidden transition-all duration-300 ${isOpen ? step.border : 'border-slate-800'}`}
              style={{ background: isOpen ? `linear-gradient(135deg, rgba(15,23,42,0.9), rgba(15,23,42,0.7))` : 'rgba(15,23,42,0.6)' }}
            >
              {/* Header — always visible */}
              <button
                onClick={() => setActiveStep(isOpen ? null : step.id)}
                className="w-full text-left px-6 py-5 flex items-center gap-4 hover:bg-white/5 transition-colors duration-200"
              >
                {/* Step number */}
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ backgroundColor: step.color + '25', color: step.color, border: `1.5px solid ${step.color}50` }}>
                  {idx + 1}
                </span>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: step.color + '20', border: `1.5px solid ${step.color}40` }}>
                  <Icon size={22} style={{ color: step.color }} />
                </div>

                {/* Title area */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-gray-100">{step.title}</h2>
                    <span className="text-xs px-2 py-0.5 rounded-full font-mono"
                      style={{ backgroundColor: step.color + '20', color: step.color }}>
                      ~{step.latency}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-0.5">{step.subtitle}</p>
                </div>

                {/* Expand icon */}
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
                  <ChevronDown size={18} className="text-gray-500" />
                </motion.div>
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 space-y-6 border-t border-slate-800/80">
                      {/* Analogy callout */}
                      <div className="mt-5 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-sm text-amber-300 flex gap-2 items-start">
                        <span className="text-lg shrink-0">💡</span>
                        <div>
                          <span className="font-semibold">Analogy: </span>
                          {step.analogy}
                        </div>
                      </div>

                      {/* In plain English */}
                      <div className="px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700/60">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">In Plain English</div>
                        <p className="text-sm text-gray-300 leading-relaxed">{step.layman}</p>
                      </div>

                      {/* Live Diagram */}
                      {step.diagram}

                      {/* Key Facts + Interview Tips */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="px-4 py-4 rounded-xl bg-slate-900/60 border border-slate-800">
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle size={14} style={{ color: step.color }} />
                            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Key Facts</span>
                          </div>
                          <ul className="space-y-2">
                            {step.keyFacts.map((fact, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                                <span className="shrink-0 mt-0.5" style={{ color: step.color }}>›</span>
                                {fact}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="px-4 py-4 rounded-xl bg-slate-900/60 border border-slate-800">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertCircle size={14} className="text-amber-400" />
                            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Interview Tips</span>
                          </div>
                          <ul className="space-y-2">
                            {step.interviewTips.map((tip, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                                <span className="shrink-0 mt-0.5 text-amber-400">›</span>
                                {tip}
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
      </section>

      {/* Full timeline summary */}
      <section className="max-w-5xl mx-auto px-4 py-12 border-t border-slate-900">
        <h2 className="text-2xl font-bold text-center mb-2">Complete Request Timeline</h2>
        <p className="text-center text-gray-400 text-sm mb-8">A full web request completes in under 400ms. Here's where the time goes:</p>
        <div className="space-y-3">
          {STEPS.map((s, i) => {
            const latencyNum = parseFloat(s.latency) || 20;
            const pct = (latencyNum / totalLatency) * 100;
            return (
              <div key={s.id} className="flex items-center gap-4">
                <div className="w-28 text-right text-xs text-gray-400 shrink-0">{s.title}</div>
                <div className="flex-1 h-6 bg-slate-900 rounded-full overflow-hidden relative">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                </div>
                <div className="w-16 text-xs font-mono text-gray-400 shrink-0">{s.latency}</div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
