import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from '@/pages/Home';
import PostDetail from '@/pages/PostDetail';
import NotFound from '@/pages/NotFound';
import About from '@/pages/About';

export default function App() {
  return (
    <>
      <nav className="navbar" id="main-nav">
        <Link to="/" className="navbar-logo">
          <h1>Vox Diurna</h1>
          <span>Daily Voice</span>
        </Link>
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog/:slug/:id" element={<PostDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="footer" id="site-footer">
        <div className="footer-content">
          <div className="footer-brand-group">
            <Link to="/" className="footer-brand">Vox Diurna</Link>
            <Link to="/about" className="footer-text">About</Link>
            <span className="footer-text">© 2026 — Words that matter, daily.</span>
          </div>
          
          <div className="footer-credits">
            <span>Made by</span>
            <a 
              href="https://github.com/Shishir-Kc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-github-link"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="github-icon">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              <span>Shishir-Kc</span>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
