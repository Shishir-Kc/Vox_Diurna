import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Vox Diurna — Daily Voice",
  description:
    "A curated collection of thoughts on architecture, culture, design, technology, and the human experience. Vox Diurna — the daily voice that speaks through considered words.",
  keywords: ["blog", "essays", "culture", "technology", "design", "architecture"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <nav className="navbar" id="main-nav">
          <Link href="/" className="navbar-logo">
            <h1>Vox Diurna</h1>
            <span>Daily Voice</span>
          </Link>
          <ul className="navbar-links">
            <li><Link href="/">Journal</Link></li>
          </ul>
        </nav>

        <main>{children}</main>

        <footer className="footer" id="site-footer">
          <div className="footer-content">
            <div className="footer-brand-group">
              <span className="footer-brand">Vox Diurna</span>
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
      </body>
    </html>
  );
}
