'use client';

import { useEffect, useState } from 'react';

export default function LocalizedDate({ dateStr }) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    if (!dateStr) return;
    
    // Ensure the date string is treated as UTC if it doesn't have an offset
    // Backend uses datetime.utcnow() which usually lacks the 'Z' suffix in string representation
    const utcDateStr = dateStr.endsWith('Z') || dateStr.includes('+') 
      ? dateStr 
      : `${dateStr}Z`;
      
    const date = new Date(utcDateStr);
    
    // Check if valid date
    if (isNaN(date.getTime())) {
      setFormattedDate(dateStr); // Fallback to raw string
      return;
    }

    setFormattedDate(date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }));
  }, [dateStr]);

  // Return a placeholder or the formatted date
  return <span className="localized-date">{formattedDate || '...'}</span>;
}
