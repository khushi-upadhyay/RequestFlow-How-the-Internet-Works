import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Briefcase, ExternalLink, ShieldCheck, Cpu, Code, BookOpen, Settings } from 'lucide-react';

interface AboutProps {
  darkMode: boolean;
}

export const About: React.FC<AboutProps> = ({ darkMode }) => {
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-gray-200' : 'bg-slate-900 text-gray-200'}`}>
      
      {/* Hero Header */}
      <section className="py-16 px-6 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-900/60">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest">
              The Mission
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mt-4 mb-6 bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Demystifying the Web
            </h1>
            <p className="text-sm md:text-base leading-relaxed text-gray-400 max-w-3xl mx-auto">
              RequestFlow is an interactive sandbox designed to break down the complex journeys of internet requests. By visualizing operations like DNS lookup, TCP/TLS handshakes, load balancing, caching, databases, and page rendering, we translate technical jargon into clear, relatable concepts.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Spacious Content */}
      <section className="max-w-5xl mx-auto px-6 py-16 space-y-20">
        
        {/* 1. Vision Section (Spacious Card Layout) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="p-8 md:p-10 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-950 border border-slate-850 shadow-2xl flex flex-col md:flex-row items-center gap-8"
        >
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-extrabold text-white">Our Vision</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Traditional computer science education teaches networking, security, databases, and frontend systems in isolated silos. RequestFlow integrates them into a single, cohesive visual path. We believe seeing components collaborate in real-time builds deep architectural intuition rather than temporary memorization.
            </p>
          </div>
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
              <CompassIcon className="w-12 h-12" />
            </div>
          </div>
        </motion.div>

        {/* 2. Target Audience Grid */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-white">Who is this for?</h2>
            <p className="text-xs text-gray-400 mt-1">Providing value across different stages of software engineering</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Students & Learners',
                desc: 'Visualizing textbook definitions like the TCP handshake or DNS hierarchies to build a solid foundational baseline.',
                icon: '🎓'
              },
              {
                title: 'System Design Candidates',
                desc: 'Mastering the concepts of load balancing, multi-layer caching, DB sharding, and latency optimization metrics.',
                icon: '💼'
              },
              {
                title: 'Self-Taught Developers',
                desc: 'Connecting how backend code requests translate to actual network frame signals and browser rendering blocks.',
                icon: '🚀'
              }
            ].map((audience, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-slate-900 border border-slate-850 hover:border-slate-800 transition-colors shadow-lg space-y-3"
              >
                <div className="text-3xl">{audience.icon}</div>
                <h3 className="font-bold text-sm text-white">{audience.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{audience.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 3. Core Tech Stack (Spacious Monospace Badges) */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-white">Built With</h2>
            <p className="text-xs text-gray-400 mt-1">Leveraging modern open source software technologies</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'React 19', role: 'Component Framework', icon: Code },
              { name: 'TypeScript', role: 'Typed Logic', icon: ShieldCheck },
              { name: 'Vite', role: 'Build & Bundling', icon: Cpu },
              { name: 'Tailwind CSS', role: 'Layout Styling', icon: Settings }
            ].map((tech, idx) => {
              const TechIcon = tech.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  className="p-4 rounded-xl text-center bg-slate-900 border border-slate-850 flex flex-col items-center gap-2"
                >
                  <TechIcon size={20} className="text-blue-400" />
                  <div>
                    <h4 className="font-mono text-xs font-bold text-white">{tech.name}</h4>
                    <p className="text-[10px] text-gray-500">{tech.role}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 4. How to Use Step Cards (Clean Layout instead of raw floating numbers) */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-white">How to Use the Visualizer</h2>
            <p className="text-xs text-gray-400 mt-1">Four simple steps to start exploring request traces</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                stepNum: '1',
                title: 'Enter target domain name',
                desc: 'Type in any website hostname like google.com or a custom API endpoint URL in the visualizer input bar.'
              },
              {
                stepNum: '2',
                title: 'Click "Trace Request"',
                desc: 'Watch the SVG topology map activate. Glowing particles simulate packets transferring between servers in real-time.'
              },
              {
                stepNum: '3',
                title: 'Inspect Wireshark Grid',
                desc: 'Click on any captured packet row to view general headers, custom payloads, timing waterfalls, and hex byte dumps.'
              },
              {
                stepNum: '4',
                title: 'Tweak Simulator Conditions',
                desc: 'Slide the Network Speed, Server Load, and Cache Hit Rate to see how simulated latency and APM metrics fluctuate instantly.'
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -15 : 15 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="p-5 rounded-xl bg-slate-900 border border-slate-850 flex gap-4 items-start shadow-md hover:border-slate-800 transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-blue-950 text-blue-400 border border-blue-900/60 font-bold flex items-center justify-center flex-shrink-0 text-sm font-mono">
                  {step.stepNum}
                </span>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-white">{step.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </section>

      {/* Footer CTA */}
      <section className="py-20 px-6 bg-gradient-to-b from-slate-950 to-slate-900 border-t border-slate-900/60 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            Ready to explore?
          </h2>
          <p className="text-xs md:text-sm text-gray-400 max-w-md mx-auto">
            Run a simulation run now and watch the request packet pathways trace live on your dashboard.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold text-xs rounded-lg shadow-lg shadow-blue-500/10 flex items-center gap-1.5 transition-shadow"
            >
              <ExternalLink size={14} />
              Open Visualizer
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors border border-slate-750"
            >
              <Globe size={14} />
              GitHub Repository
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

// Helper SVG Icon
const CompassIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

