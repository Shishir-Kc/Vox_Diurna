import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="empty-state-container">
      <div className="empty-state-content">
        <h1 className="empty-state-title">404 — Page Not Found</h1>
        <p className="empty-state-description">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="post-back">
          <span className="arrow">←</span>
          <span>Back Home</span>
        </Link>
      </div>
    </div>
  );
}
