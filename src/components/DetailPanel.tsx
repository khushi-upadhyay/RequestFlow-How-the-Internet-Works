import React from 'react';
import type { RequestStep } from '../types/flow';
import { X, AlertCircle, HelpCircle, Compass, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DetailPanelProps {
  step: RequestStep | null;
  onClose: () => void;
  darkMode: boolean;
}

const METAPHORS: {
  [key: string]: {
    emoji: string;
    title: string;
    analogy: string;
    howItWorks: string;
    example: string;
  };
} = {
  '1-dns': {
    emoji: '📞',
    title: 'The Phone Address Book',
    analogy: "Like searching for a friend's name in your phone contacts to find their dialable number, your browser looks up a domain name to find its actual server address.",
    howItWorks: "Computers route data using number codes called IP addresses (e.g. 142.250.185.46). Since domain names (google.com) are easier for humans, DNS translates names into numbers.",
    example: "You type 'google.com' → Your browser asks the DNS phonebook: 'What is Google's number?' → DNS replies: 'Dial 142.250.185.46!'",
  },
  '2-tcp-handshake': {
    emoji: '🤝',
    title: 'The Secret Handshake',
    analogy: "Before speaking, the browser and server establish a mutual agreement to communicate reliably. They perform a 3-way handshake to verify both sides can hear each other.",
    howItWorks: "To ensure no files are lost or jumbled, they agree on a connection plan: 1. Client waves (SYN), 2. Server waves back (SYN-ACK), 3. Client acknowledges (ACK). Now they are synced.",
    example: "Like placing a phone call: 'Hello?' → 'Hey! I hear you!' → 'Awesome, here is what I wanted to say...'",
  },
  '3-tls-handshake': {
    emoji: '🔐',
    title: 'The Locked Briefcase',
    analogy: "To prevent thieves on the road from reading your mail, the browser and server seal all messages inside a briefcase that only their shared secret keys can open.",
    howItWorks: "This establishes HTTPS security. They negotiate cipher algorithms, verify the server's identity card (certificate), and generate a secure password together.",
    example: "You send the server a locked box. The server inserts a secret key, locks it, and sends it back. Now, only you two have the password.",
  },
  '4-cdn': {
    emoji: '🏪',
    title: 'The Corner Convenience Store',
    analogy: "Instead of ordering soda directly from the factory across the ocean, you walk to the local corner store. CDNs copy static files to edge servers near you for fast retrieval.",
    howItWorks: "Content Delivery Networks cache images, videos, and scripts. If a user requests a file, the edge server closest to them handles it, saving network trip times.",
    example: "Streaming a movie from a Netflix server in your city instead of fetching it from their headquarters in California.",
  },
  '5-load-balancer': {
    emoji: '🚦',
    title: 'The Traffic Cop',
    analogy: "If a store gets crowded, a manager directs visitors to empty registers. The Load Balancer stands at the gates and routes traffic to empty servers so nothing crashes.",
    howItWorks: "Distributes thousands of incoming queries across multiple application instances, checking server health and balancing the computational workload.",
    example: "Directing checkout queues: customer 1 goes to register A, customer 2 to register B, and customer 3 to C to avoid bottlenecks.",
  },
  '6-application-server': {
    emoji: '🍳',
    title: 'The Master Chef',
    analogy: "This is the active kitchen of the website. The server takes your order (request), executes code (prepares ingredients), and cooks up the response page.",
    howItWorks: "The core business logic runs here (Node.js, Python, etc.). It acts as the coordinator, validating requests, checking databases, and arranging final JSON responses.",
    example: "A travel site taking your inputs, matching flight times, scoring prices, and laying out list structures.",
  },
  '7-cache': {
    emoji: '📝',
    title: "The Chef's Sticky Note",
    analogy: "Retrieving records from deep database storage is slow. The chef writes frequent, popular answers on a sticky note (RAM memory) to read them instantly.",
    howItWorks: "Redis or Memcached stores data in-memory for microsecond lookup speeds. When a query arrives, the server checks the cache first to skip slow disk queries.",
    example: "Writing 'Today's Special' on a note near the register instead of walking to the back warehouse to check the catalog files.",
  },
  '8-database': {
    emoji: '🗄️',
    title: 'The Archive Filing Cabinets',
    analogy: "This is the massive persistent storehouse in the basement. It holds all customer accounts and transaction folders securely on disk for the long term.",
    howItWorks: "Relational database engines parse SQL queries, scan indexes, retrieve persistent tables, and return structured datasets back to the application server.",
    example: "Searching the bank vaults for bank statements dating back 5 years to verify a client's transactions.",
  },
  '9-response-generation': {
    emoji: '📦',
    title: 'Plating & Packaging',
    analogy: "Once the chef prepares your meal, they plate it beautifully, box it up, write the shipping labels (headers), and hand it to the delivery courier.",
    howItWorks: "The server serializes the raw database records into standard data streams (like JSON files), stamps headers (Status 200, Content-Type), and transmits the payload.",
    example: "Packaging a custom toy order into a box, sealing it, and sticking a mailing address label on top.",
  },
  '10-browser-render': {
    emoji: '🧱',
    title: 'Assembling the Lego Set',
    analogy: "Your browser receives a box of flat instructions (HTML, CSS) and components (JS). It follows the handbook to construct layout trees and paint the final webpage.",
    howItWorks: "Parses HTML into a DOM tree, merges stylesheets, resolves positions (Reflow), and paints colored pixels to draw the interactive interface on your screen.",
    example: "Following an instruction booklet step-by-step to build a detailed castle model on your table.",
  },
};

export const DetailPanel: React.FC<DetailPanelProps> = ({ step, onClose, darkMode }) => {
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
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.93, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.93, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative max-h-[90vh] text-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{metaphor.emoji}</span>
              <div>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider font-mono">
                  Journey Step: {step.name}
                </span>
                <h2 className="text-lg font-extrabold text-white leading-tight">
                  {step.name} ({step.latency}ms)
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              title="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 overflow-y-auto flex-1">

            {/* COLUMN 1: Layman Explanation */}
            <div className="p-6 md:p-8 space-y-6 bg-slate-900/40">
              <div className="p-5 rounded-xl bg-gradient-to-br from-blue-900/30 to-indigo-900/20 border border-blue-800/40">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{metaphor.emoji}</span>
                  <h3 className="font-bold text-blue-400 text-sm">{metaphor.title}</h3>
                </div>
                <p className="text-xs text-blue-200 leading-relaxed italic">
                  "{metaphor.analogy}"
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass size={14} className="text-cyan-400" />
                  In Plain English
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">{metaphor.howItWorks}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Play size={14} className="text-emerald-400" />
                  Real-World Story
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed p-3.5 rounded-lg bg-slate-950/40 border border-slate-800/50">
                  {metaphor.example}
                </p>
              </div>
            </div>

            {/* COLUMN 2: Tech Specs & Q&A */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider font-mono">Powered By</span>
                  <div className="flex flex-wrap gap-1">
                    {step.technologies && step.technologies.length > 0 ? (
                      step.technologies.map((tech) => (
                        <span key={tech} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                          {tech}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">Default Protocols</span>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider font-mono">Category</span>
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-indigo-950/60 text-indigo-400 border border-indigo-900/40">
                      {step.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle size={14} className="text-rose-500" />
                  Why is this step slow?
                </h4>
                <ul className="space-y-1.5">
                  {step.bottlenecks.map((b, idx) => (
                    <li key={idx} className="text-xs text-gray-400 flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold font-mono shrink-0">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle size={14} className="text-amber-500" />
                  Interview Preparation
                </h4>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {step.interviewQuestions.map((q, idx) => (
                    <details key={idx} className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/80 group">
                      <summary className="cursor-pointer font-bold text-[11px] text-gray-300 hover:text-white transition-colors list-none flex justify-between items-center gap-2">
                        <span>{q.question}</span>
                        <span className="text-gray-500 shrink-0">▼</span>
                      </summary>
                      <p className="mt-2 text-xs text-gray-400 leading-relaxed pl-2 border-l-2 border-slate-700">
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
