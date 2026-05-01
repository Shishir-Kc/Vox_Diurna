import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="empty-state-container animate-reveal">
      <div className="empty-state-content">
        <div className="empty-state-icon">
          <div className="icon-pulse"></div>
          <h1 style={{
            fontSize: '6rem',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            background: 'linear-gradient(180deg, #fff 0%, #555 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            opacity: 0.8,
            marginBottom: '0.5rem'
          }}>404</h1>
        </div>
        <h2 className="empty-state-title" style={{ marginBottom: '1rem' }}>Page Not Found</h2>
        <p className="empty-state-description">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="post-back">
          <span className="arrow">←</span>
          <span>Back Home</span>
        </Link>
        <div className="empty-state-decoration" style={{ marginTop: '2rem' }}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}
