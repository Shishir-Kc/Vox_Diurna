import React from 'react';

export default function EmptyState({
  title = 'No stories yet',
  description = 'New writing will appear here as soon as it is published.',
  headingLevel = 'h2',
}) {
  const Heading = headingLevel === 'h1' ? 'h1' : 'h2';

  return (
    <div className="empty-state-container">
      <div className="empty-state-content">
        <Heading className="empty-state-title">{title}</Heading>
        <p className="empty-state-description">{description}</p>
      </div>
    </div>
  );
}
