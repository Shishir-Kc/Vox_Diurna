import React from 'react';

export default function Select({ value, onChange, options, label }) {
  return (
    <label className="category-control">
      <span className="category-control-label">Category</span>
      <span className="category-select-wrap">
        <select
          className="category-select"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label={label}
        >
          {options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <svg className="category-select-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </label>
  );
}
