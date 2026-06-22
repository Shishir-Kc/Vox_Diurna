import React, { useEffect, useRef, useState } from 'react';

export default function Select({ value, onChange, options, label }) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(value);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      setHighlighted(value);
      const selectedItem = listRef.current?.querySelector(`[data-value="${value}"]`);
      selectedItem?.focus();
    }
  }, [open, value]);

  function handleSelect(option) {
    onChange(option);
    setOpen(false);
    buttonRef.current?.focus();
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (open) {
        handleSelect(highlighted);
      } else {
        setOpen(true);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      const idx = options.indexOf(highlighted);
      const next = options[Math.min(idx + 1, options.length - 1)];
      if (next) setHighlighted(next);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      const idx = options.indexOf(highlighted);
      const prev = options[Math.max(idx - 1, 0)];
      if (prev) setHighlighted(prev);
    } else if (e.key === 'Home') {
      e.preventDefault();
      if (open) setHighlighted(options[0]);
    } else if (e.key === 'End') {
      e.preventDefault();
      if (open) setHighlighted(options[options.length - 1]);
    }
  }

  return (
    <div className="custom-select" ref={containerRef} aria-expanded={open} aria-haspopup="listbox">
      <button
        ref={buttonRef}
        type="button"
        className={`custom-select-trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen(!open)}
        onKeyDown={handleKeyDown}
        aria-label={label}
      >
        <span className="custom-select-value">{value}</span>
        <svg className="custom-select-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <ul className="custom-select-options" role="listbox" ref={listRef} aria-label={label}>
          {options.map((option) => (
            <li
              key={option}
              role="option"
              data-value={option}
              tabIndex={-1}
              className={`custom-select-option ${option === value ? 'selected' : ''} ${option === highlighted ? 'highlighted' : ''}`}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => setHighlighted(option)}
              aria-selected={option === value}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
