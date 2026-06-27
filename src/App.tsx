import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components';
import { Home, Learn, About, SystemDesign } from './pages';
import { Radio, ExternalLink } from 'lucide-react';
import './style-new.css';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={`${darkMode ? 'dark' : 'light'} min-h-screen flex flex-col overflow-x-hidden bg-[#09090b]`}>
      <Router>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="flex-1 flex flex-col bg-[#09090b]">
          <Routes>
            <Route path="/" element={<Home darkMode={darkMode} />} />
            <Route path="/learn" element={<Learn darkMode={darkMode} />} />
            <Route path="/system-design" element={<SystemDesign />} />
            <Route path="/about" element={<About darkMode={darkMode} />} />
          </Routes>
        </main>

        <footer className="mt-auto border-t border-[#2b2b30] bg-[#09090b]">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#2b2b30] bg-[#18181b] text-blue-500">
                  <Radio size={12} />
                </div>
                <span className="text-sm font-semibold text-[#a1a1aa]">
                  Request<span className="text-[#fafafa]">Flow</span>
                </span>
                <span className="text-xs text-[#71717a]">·</span>
                <span className="font-mono text-xs text-[#71717a]">© 2026</span>
              </div>

              <p className="hidden font-mono text-xs text-[#71717a] sm:block">
                Internal developer platform for understanding request lifecycles.
              </p>

              <div className="flex items-center gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-[#a1a1aa] transition-colors hover:text-[#fafafa]"
                >
                  <ExternalLink size={12} />
                  GitHub
                </a>
                <span className="text-[#71717a]">·</span>
                <a href="/learn" className="text-xs text-[#a1a1aa] transition-colors hover:text-[#fafafa]">
                  Learn
                </a>
                <span className="text-[#71717a]">·</span>
                <a href="/about" className="text-xs text-[#a1a1aa] transition-colors hover:text-[#fafafa]">
                  About
                </a>
              </div>
            </div>
          </div>
        </footer>
      </Router>
    </div>
  );
}

export default App;
