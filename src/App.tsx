import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components';
import { Home, Learn, About, SystemDesign } from './pages';
import './style-new.css';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={`${darkMode ? 'dark' : 'light'} min-h-screen flex flex-col`}>
      <Router>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className={`flex-grow flex flex-col ${darkMode ? 'bg-slate-950' : 'bg-slate-900'}`}>
          <Routes>
            <Route path="/" element={<Home darkMode={darkMode} />} />
            <Route path="/learn" element={<Learn darkMode={darkMode} />} />
            <Route path="/system-design" element={<SystemDesign />} />
            <Route path="/about" element={<About darkMode={darkMode} />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className={`py-6 px-4 border-t ${darkMode ? 'bg-slate-900 border-slate-800 text-gray-500' : 'bg-gray-100 border-gray-250 text-gray-600'} text-center text-xs font-mono`}>
          <div className="max-w-6xl mx-auto">
            <p>RequestFlow © 2026 | Visualize how the internet works end-to-end</p>
          </div>
        </footer>
      </Router>
    </div>
  );
}

export default App;
