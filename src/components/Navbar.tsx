import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, Menu, X, Moon, Sun, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/learn', label: 'Learn' },
  { to: '/system-design', label: 'System Design' },
  { to: '/about', label: 'About' },
];

export const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav
      className={`sticky top-0 z-50 border-b transition-all duration-200 ${
        scrolled
          ? 'border-[#2b2b30] bg-[#09090b]/92 backdrop-blur-md'
          : 'border-transparent bg-[#09090b]'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2b2b30] bg-[#18181b] text-blue-400">
              <Radio size={16} />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-[#fafafa]">
              Request
              <span className="text-blue-500">Flow</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[#18181b] text-[#fafafa] border border-[#2b2b30]'
                      : 'text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#fafafa]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="hidden h-9 w-9 items-center justify-center rounded-lg border border-[#2b2b30] bg-[#18181b] text-[#a1a1aa] transition-colors hover:bg-[#232326] hover:text-[#fafafa] md:flex"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden h-9 w-9 items-center justify-center rounded-lg border border-[#2b2b30] bg-[#18181b] text-[#a1a1aa] transition-colors hover:bg-[#232326] hover:text-[#fafafa] md:flex"
              aria-label="GitHub"
            >
              <Globe size={16} />
            </a>

            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2b2b30] bg-[#18181b] text-[#a1a1aa]"
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button
                onClick={() => setMobileMenuOpen((v) => !v)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2b2b30] bg-[#18181b] text-[#a1a1aa] transition-colors hover:bg-[#232326] hover:text-[#fafafa]"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={mobileMenuOpen ? 'x' : 'menu'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="border-t border-[#2b2b30] bg-[#09090b]"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6 lg:px-8">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[#18181b] text-[#fafafa] border border-[#2b2b30]'
                        : 'text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#fafafa]'
                    }`}
                  >
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
                    {link.label}
                  </Link>
                );
              })}

              <div className="mt-1 border-t border-[#2b2b30] pt-2">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#a1a1aa] transition-colors hover:bg-[#18181b] hover:text-[#fafafa]"
                >
                  <Globe size={15} />
                  GitHub Repository
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
