import React, { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Routes, Route, Link } from 'react-router-dom';
import Home from '@/pages/Home';
import PostDetail from '@/pages/PostDetail';
import NotFound from '@/pages/NotFound';
import About from '@/pages/About';
import SmoothCursor from '@/components/SmoothCursor';
import ClickSpark from '@/components/ClickSpark';
import MusicToggleButton from '@/components/MusicToggleButton';

function getInitialTheme() {
  try {
    const savedTheme = window.localStorage.getItem('vox-diurna-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
  } catch {
    // Use the system preference when storage is unavailable.
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const themeToggleRef = useRef(null);
  const themeTransitioningRef = useRef(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem('vox-diurna-theme', theme);
    } catch {
      // The selected theme still applies for the current visit.
    }
  }, [theme]);

  function toggleTheme() {
    if (themeTransitioningRef.current) return;

    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    const root = document.documentElement;
    const button = themeToggleRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const startViewTransition = document.startViewTransition;

    const applyTheme = () => {
      root.dataset.theme = nextTheme;
      setTheme(nextTheme);
      try {
        window.localStorage.setItem('vox-diurna-theme', nextTheme);
      } catch {
        // The selected theme still applies for the current visit.
      }
    };

    if (!button || reducedMotion || typeof startViewTransition !== 'function') {
      applyTheme();
      return;
    }

    const duration = 450;
    const { left, top, width, height } = button.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const maxRadius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y),
    );
    const toX = (point) => `${(point / viewportWidth) * 100}%`;
    const toY = (point) => `${(point / viewportHeight) * 100}%`;
    const radius = (value) => `${(value / (Math.hypot(viewportWidth, viewportHeight) / Math.SQRT2)) * 100}%`;
    const point = `${toX(x)} ${toY(y)}`;
    const clipPaths = [
      `circle(0% at ${point})`,
      `circle(${radius(maxRadius)} at ${point})`,
    ];

    root.dataset.themeTransition = 'active';
    root.style.setProperty('--theme-transition-duration', `${duration}ms`);
    root.style.setProperty('--theme-transition-clip-from', clipPaths[0]);
    themeTransitioningRef.current = true;

    let animation;
    let transition;
    const cleanup = () => {
      themeTransitioningRef.current = false;
      delete root.dataset.themeTransition;
      root.style.removeProperty('--theme-transition-duration');
      root.style.removeProperty('--theme-transition-clip-from');
      animation?.cancel();
    };

    try {
      transition = startViewTransition.call(document, () => {
        flushSync(applyTheme);
      });
    } catch {
      cleanup();
      applyTheme();
      return;
    }

    transition.finished.finally(cleanup).catch(() => {});
    transition.ready
      .then(() => {
        animation = root.animate(
          { clipPath: clipPaths },
          {
            duration,
            easing: 'ease-in-out',
            fill: 'forwards',
            pseudoElement: '::view-transition-new(root)',
          },
        );
      })
      .catch(cleanup);
  }

  return (
    <ClickSpark
      sparkColor="var(--color-accent)"
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      <>
        <SmoothCursor />
        <a className="skip-link" href="#main-content">Skip to content</a>
        <main id="main-content" tabIndex="-1">
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
              <Link to="/" className="footer-brand">Blog</Link>
              <Link to="/about" className="footer-text">About</Link>
            </div>

            <div className="footer-credits">
              <MusicToggleButton />
              <button
                ref={themeToggleRef}
                className="footer-theme-toggle"
                type="button"
                onClick={toggleTheme}
                aria-pressed={theme === 'dark'}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.4 15.3A8.5 8.5 0 0 1 8.7 3.6 8.5 8.5 0 1 0 20.4 15.3Z" />
                  </svg>
                )}
              </button>
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
    </ClickSpark>
  );
}
