import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Briefcase, ExternalLink } from 'lucide-react';

interface AboutProps {
  darkMode: boolean;
}

export const About: React.FC<AboutProps> = ({ darkMode }) => {
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
      {/* Hero */}
      <section className={`py-16 px-4 ${darkMode ? 'bg-gradient-to-b from-slate-900 to-slate-950' : 'bg-gradient-to-b from-blue-50 to-white'}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className={`text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              About RequestFlow
            </h1>
            <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              RequestFlow is an interactive educational platform designed to demystify how the internet works. By visualizing the complete lifecycle of a web request through DNS resolution, TCP/TLS handshakes, CDN delivery, load balancing, caching, databases, and browser rendering, we help students and developers understand modern web architecture fundamentals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-12">
          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Our Vision
            </h2>
            <p className={`leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Computer Science education often teaches networking in isolation. RequestFlow bridges that gap by showing how DNS, TCP, TLS, CDN, load balancers, caching, databases, and rendering work together in a real-world web request. Our goal is to produce graduates and interview candidates who truly understand web architecture instead of memorizing isolated concepts.
            </p>
          </motion.div>

          {/* Target Audience */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Target Audience
            </h2>
            <ul className={`space-y-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {[
                'Computer Science students learning networking fundamentals',
                'Interview candidates preparing for system design rounds',
                'Self-taught developers wanting to fill knowledge gaps',
                'Tech enthusiasts curious about how the internet works',
                'Educators teaching networking, distributed systems, or web development',
              ].map((audience, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-3"
                >
                  <span className="text-blue-500 font-bold mt-1">✓</span>
                  <span>{audience}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Interactive Visualization',
                  description: 'Watch request flow through animated diagrams that show each step in the journey.',
                },
                {
                  title: 'Latency Simulator',
                  description: 'Adjust network conditions to see how they affect total response time.',
                },
                {
                  title: 'Interview Questions',
                  description: 'Each step includes relevant interview questions with difficulty levels.',
                },
                {
                  title: 'Learn Mode',
                  description: 'Deep-dive articles on DNS, TCP/IP, HTTPS, CDN, load balancing, caching, databases.',
                },
                {
                  title: 'Real-World Examples',
                  description: 'Concrete examples showing how major companies handle web requests.',
                },
                {
                  title: 'Mobile Responsive',
                  description: 'Learn on desktop, tablet, or mobile with fully responsive design.',
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-4 rounded-lg ${darkMode ? 'bg-slate-900 border border-slate-700' : 'bg-gray-50 border border-gray-200'}`}
                >
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {feature.title}
                  </h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Technology Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Built With
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                'React 18',
                'TypeScript',
                'Vite',
                'Tailwind CSS',
                'Framer Motion',
                'React Flow',
                'React Router',
                'Lucide Icons',
              ].map((tech, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-3 rounded-lg text-center font-medium ${
                    darkMode
                      ? 'bg-slate-900 border border-slate-700 text-gray-300'
                      : 'bg-gray-100 border border-gray-200 text-gray-700'
                  }`}
                >
                  {tech}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* How to Use */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              How to Use RequestFlow
            </h2>
            <ol className={`space-y-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {[
                'Enter a URL in the hero section (or keep the default google.com)',
                'Click "Trace Request" to watch the animation of the request journey',
                'Click on any step to pause and see detailed information',
                'Use the simulator to adjust network conditions and see latency changes',
                'Visit the Learn page for deep dives into each concept',
                'Review interview questions for system design preparation',
              ].map((step, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-3"
                >
                  <span className={`font-bold flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full ${
                    darkMode
                      ? 'bg-slate-800 text-blue-400'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </motion.li>
              ))}
            </ol>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className={`py-16 px-4 mt-16 ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Ready to Understand Web Architecture?
            </h2>
            <div className="flex gap-4 justify-center">
              <a
                href="/"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg transition-shadow inline-flex items-center gap-2"
              >
                <ExternalLink size={20} />
                Start Learning
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`px-6 py-3 font-semibold rounded-lg inline-flex items-center gap-2 ${
                  darkMode
                    ? 'bg-slate-800 hover:bg-slate-700 text-white'
                    : 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-200'
                }`}
              >
                <Globe size={20} />
                View on GitHub
              </a>
            </div>

            {/* Credits */}
            <div className={`mt-12 pt-8 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                Built with ❤️ for the developer community
              </p>
              <div className="flex gap-4 justify-center">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg ${darkMode ? 'text-gray-500 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Globe size={20} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg ${darkMode ? 'text-gray-500 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Briefcase size={20} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
