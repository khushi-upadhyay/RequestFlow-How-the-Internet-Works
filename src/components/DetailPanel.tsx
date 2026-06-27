import React from 'react';
import type { RequestStep } from '../types/flow';
import { X, AlertCircle, HelpCircle, Compass, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DetailPanelProps {
  step: RequestStep | null;
  onClose: () => void;
  darkMode: boolean;
}

const METAPHORS: Record<
  string,
  {
    emoji: string;
    title: string;
    analogy: string;
    howItWorks: string;
    example: string;
  }
> = {
  '1-dns': {
    emoji: '📞',
    title: 'The Phone Address Book',
    analogy:
      "Like searching for a friend's name in your contacts to find their dialable number, your browser looks up a domain name to find its server address.",
    howItWorks:
      'Computers route data using IP addresses. DNS translates human-readable names into those numbers so the network can route requests correctly.',
    example: "You type 'google.com' and DNS returns the IP address the browser should connect to.",
  },
  '2-tcp-handshake': {
    emoji: '🤝',
    title: 'The Secret Handshake',
    analogy:
      'Before speaking, the browser and server confirm they can both hear each other and agree on a connection.',
    howItWorks:
      'The 3-way handshake establishes sequence numbers and confirms both sides are ready to exchange data reliably.',
    example: "Think of it like a quick phone call: 'Hello?' -> 'I hear you.' -> 'Great, let's talk.'",
  },
  '3-tls-handshake': {
    emoji: '🔐',
    title: 'The Locked Briefcase',
    analogy:
      'The browser and server agree on a shared way to lock the conversation so outsiders cannot read it.',
    howItWorks:
      'TLS negotiates encryption, verifies the server certificate, and creates secure session keys.',
    example: 'Like sending a sealed envelope that only the intended recipient can open.',
  },
  '4-cdn': {
    emoji: '🏪',
    title: 'The Corner Store',
    analogy:
      'Instead of going to a central warehouse every time, you grab common items from a nearby store.',
    howItWorks:
      'CDNs cache static content on edge servers closer to users to reduce latency and origin load.',
    example: 'A video or image is served from a nearby edge rather than a faraway origin.',
  },
  '5-load-balancer': {
    emoji: '🚦',
    title: 'The Traffic Cop',
    analogy:
      'A load balancer directs visitors to whichever lane is currently open so no single server gets jammed.',
    howItWorks:
      'It distributes incoming traffic across multiple servers using a balancing algorithm and health checks.',
    example: 'Requests are spread across several backends rather than piling onto one machine.',
  },
  '6-application-server': {
    emoji: '🍳',
    title: 'The Working Kitchen',
    analogy:
      'This is where the actual business logic happens, just like a kitchen prepares the order after it is taken.',
    howItWorks:
      'The app server validates requests, runs business logic, queries databases, and formats the response.',
    example: 'A flight search request becomes filtered, ranked results before being sent back.',
  },
  '7-cache': {
    emoji: '📝',
    title: "The Sticky Note",
    analogy:
      'Frequently used answers are kept nearby so you do not have to walk back to the filing cabinet every time.',
    howItWorks:
      'Redis or another in-memory cache serves hot data faster than the database can read it from disk.',
    example: 'Repeat lookups return instantly from cache instead of hitting storage repeatedly.',
  },
  '8-database': {
    emoji: '🗄️',
    title: 'The Archive',
    analogy:
      'The database is the long-term storage room where information lives until it is needed again.',
    howItWorks:
      'The database parses the query, uses indexes when available, and returns durable data to the server.',
    example: 'A SELECT query finds the right record without scanning every row when indexed properly.',
  },
  '9-response-generation': {
    emoji: '📦',
    title: 'Packaging the Result',
    analogy:
      'After the work is done, the server packages the result into a format the browser understands.',
    howItWorks:
      'The server serializes data, sets headers, and sends the response payload over HTTP.',
    example: 'JSON is assembled and returned with the right content type and status code.',
  },
  '10-browser-render': {
    emoji: '🧱',
    title: 'Assembling the Page',
    analogy:
      'The browser turns raw assets into pixels by building a structure and then painting it.',
    howItWorks:
      'The browser builds the DOM, applies styles, calculates layout, and paints the final interface.',
    example: 'HTML and CSS become a rendered page the user can see and interact with.',
  },
};

export const DetailPanel: React.FC<DetailPanelProps> = ({ step, onClose }) => {
  if (!step) return null;

  const metaphor = METAPHORS[step.id] || {
    emoji: '⚙️',
    title: 'System Process',
    analogy: 'A standard networking operation.',
    howItWorks: step.description,
    example: 'Executing default system logic.',
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.98, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.98, opacity: 0, y: 12 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[#2b2b30] bg-[#18181b] text-[#e4e4e7] shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-[#2b2b30] bg-[#111113] p-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{metaphor.emoji}</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  Journey Step
                </p>
                <h2 className="text-lg font-extrabold text-[#fafafa]">
                  {step.name} ({step.latency}ms)
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2b2b30] bg-[#18181b] text-[#a1a1aa] transition-colors hover:bg-[#232326] hover:text-[#fafafa]"
              title="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid flex-1 grid-cols-1 divide-y divide-[#2b2b30] overflow-y-auto md:grid-cols-2 md:divide-x md:divide-y-0">
            <div className="space-y-6 bg-[#18181b] p-6 md:p-8">
              <div className="rounded-xl border border-[#2b2b30] bg-[#111113] p-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xl">{metaphor.emoji}</span>
                  <h3 className="text-sm font-semibold text-[#fafafa]">{metaphor.title}</h3>
                </div>
                <p className="text-xs leading-relaxed text-[#a1a1aa]">{metaphor.analogy}</p>
              </div>

              <div className="space-y-2">
                <h4 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#71717a]">
                  <Compass size={14} className="text-blue-400" />
                  In Plain English
                </h4>
                <p className="text-sm leading-relaxed text-[#e4e4e7]">{metaphor.howItWorks}</p>
              </div>

              <div className="space-y-2">
                <h4 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#71717a]">
                  <Play size={14} className="text-blue-400" />
                  Real-World Story
                </h4>
                <p className="rounded-xl border border-[#2b2b30] bg-[#111113] p-3.5 text-xs leading-relaxed text-[#a1a1aa]">
                  {metaphor.example}
                </p>
              </div>
            </div>

            <div className="space-y-6 bg-[#18181b] p-6 md:p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717a]">
                    Powered By
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {step.technologies && step.technologies.length > 0 ? (
                      step.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded border border-[#2b2b30] bg-[#111113] px-2 py-0.5 text-[10px] text-[#e4e4e7]"
                        >
                          {tech}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-[#a1a1aa]">Default Protocols</span>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717a]">
                    Category
                  </span>
                  <div>
                    <span className="inline-flex rounded border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-400">
                      {step.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#71717a]">
                  <AlertCircle size={14} className="text-amber-500" />
                  Why is this step slow?
                </h4>
                <ul className="space-y-1.5">
                  {step.bottlenecks.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-xs text-[#a1a1aa]">
                      <span className="shrink-0 font-bold text-amber-500">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#71717a]">
                  <HelpCircle size={14} className="text-blue-400" />
                  Interview Preparation
                </h4>
                <div className="max-h-[200px] space-y-2 overflow-y-auto pr-1">
                  {step.interviewQuestions.map((q, idx) => (
                    <details key={idx} className="group rounded-xl border border-[#2b2b30] bg-[#111113] p-2.5">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-[11px] font-bold text-[#e4e4e7] transition-colors hover:text-[#fafafa]">
                        <span>{q.question}</span>
                        <span className="shrink-0 text-[#71717a]">▾</span>
                      </summary>
                      <p className="mt-2 border-l-2 border-[#2b2b30] pl-2 text-xs leading-relaxed text-[#a1a1aa]">
                        {q.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
