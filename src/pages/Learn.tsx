import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { learnTopics } from '../data/requestFlow.json';

interface LearnProps {
  darkMode: boolean;
}

export const Learn: React.FC<LearnProps> = ({ darkMode }) => {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
      {/* Hero */}
      <section className={`py-12 px-4 ${darkMode ? 'bg-gradient-to-b from-slate-900 to-slate-950' : 'bg-gradient-to-b from-blue-50 to-white'}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Learn Web Architecture
            </h1>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Deep dive into networking, distributed systems, and the technologies powering modern web applications.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Topics */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-4">
          {learnTopics.map((topic, idx) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`rounded-lg overflow-hidden border transition-all ${
                expandedTopic === topic.id
                  ? darkMode
                    ? 'border-blue-500 bg-slate-800'
                    : 'border-blue-300 bg-blue-50'
                  : darkMode
                  ? 'border-slate-700 bg-slate-900'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <button
                onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                className="w-full p-6 text-left hover:opacity-80 transition-opacity flex items-start justify-between gap-4"
              >
                <div className="flex-1">
                  <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {topic.title}
                  </h2>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {topic.description}
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: expandedTopic === topic.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex-shrink-0 ${expandedTopic === topic.id ? 'text-blue-500' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}
                >
                  <ChevronDown size={24} />
                </motion.div>
              </button>

              {expandedTopic === topic.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`px-6 pb-6 pt-2 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}
                >
                  <p className={`leading-relaxed mb-6 whitespace-pre-wrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {topic.content}
                  </p>

                  {/* Key Points */}
                  <div className="mb-6">
                    <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Key Points
                    </h3>
                    <ul className="space-y-2">
                      {topic.keyPoints.map((point, i) => (
                        <li key={i} className={`flex gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <span className="text-blue-500 font-bold">→</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Related Steps */}
                  {topic.relatedSteps && topic.relatedSteps.length > 0 && (
                    <div>
                      <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Related Steps
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {topic.relatedSteps.map((stepId, i) => (
                          <span
                            key={i}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              darkMode
                                ? 'bg-slate-700 text-blue-300'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {stepId}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Interview Tips Section */}
      <section className={`py-16 px-4 mt-16 ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Interview Preparation Tips
            </h2>

            <div className="space-y-4">
              {[
                {
                  title: 'Understand the Big Picture',
                  content:
                    'Know the complete request flow from browser to database. Interviewers want to see you understand how systems work end-to-end.',
                },
                {
                  title: 'Know the Trade-offs',
                  content:
                    'Every technology has tradeoffs. TCP is reliable but slower. UDP is fast but unreliable. Be able to explain when to use each.',
                },
                {
                  title: 'Practice Estimation',
                  content:
                    'Be able to estimate latency, throughput, and resource requirements. Know rough numbers: DNS ~50ms, TCP ~40ms, Database ~150ms.',
                },
                {
                  title: 'Discuss Scaling Challenges',
                  content:
                    'How would you handle 1 million requests/sec? Discuss horizontal scaling, load balancing, caching, database optimization.',
                },
                {
                  title: 'Explain Security Concerns',
                  content:
                    'Understand HTTPS, TLS, certificate validation. Know the difference between authentication and authorization.',
                },
              ].map((tip, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-4 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-white'}`}
                >
                  <h3 className={`font-semibold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {tip.title}
                  </h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{tip.content}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
