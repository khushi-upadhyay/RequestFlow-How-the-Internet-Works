import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components';
import { Home, Learn, About } from './pages';
import './style-new.css';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={darkMode ? 'dark' : 'light'}>
      <Router>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className={`flex-1 ${darkMode ? 'bg-slate-950' : 'bg-white'}`}>
          <Routes>
            <Route path="/" element={<Home darkMode={darkMode} />} />
            <Route path="/learn" element={<Learn darkMode={darkMode} />} />
            <Route path="/about" element={<About darkMode={darkMode} />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <footer className={`py-8 px-4 border-t ${darkMode ? 'bg-slate-900 border-slate-800 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
          <div className="max-w-6xl mx-auto text-center text-sm">
            <p>RequestFlow © 2024 | Visualize how the internet works</p>
          </div>
        </footer>
      </Router>
    </div>
  );
}

export default App;
