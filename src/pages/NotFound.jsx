import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="not-found-page">
      <span className="not-found-code">404</span>
      <h1>Page not found</h1>
      <p>The page you’re looking for doesn’t exist or may have moved.</p>
      <Link to="/" className="lead-read-link">
        <span aria-hidden="true">←</span> Return to the journal
      </Link>
    </div>
  );
}
