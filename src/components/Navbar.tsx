import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Menu, X, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className={`sticky top-0 z-50 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'} border-b`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RF</span>
            </div>
            <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              RequestFlow
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              Home
            </Link>
            <Link to="/learn" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              Learn
            </Link>
            <Link to="/system-design" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              System Design
            </Link>
            <Link to="/about" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
              About
            </Link>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Globe size={20} />
            </a>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-gray-100'}`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className={`md:hidden pb-4 space-y-2 ${darkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
            <Link to="/" className="block px-4 py-2 rounded">Home</Link>
            <Link to="/learn" className="block px-4 py-2 rounded">Learn</Link>
            <Link to="/system-design" className="block px-4 py-2 rounded">System Design</Link>
            <Link to="/about" className="block px-4 py-2 rounded">About</Link>
          </div>
        )}
      </div>
    </nav>
  );
};
