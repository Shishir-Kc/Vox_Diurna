"use client";

import React from 'react';

const EmptyState = () => {
  return (
    <div className="empty-state-container animate-reveal">
      <div className="empty-state-content">
        <div className="empty-state-icon">
          <svg 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="9" y1="13" x2="15" y2="13" />
            <line x1="9" y1="17" x2="15" y2="17" />
          </svg>
          <div className="icon-pulse"></div>
        </div>
        <h2 className="empty-state-title">No Posts Found</h2>
        <p className="empty-state-description">
          The developer has not posted anything yet. 
          Check back soon for curated thoughts and stories.
        </p>
        <div className="empty-state-decoration">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
