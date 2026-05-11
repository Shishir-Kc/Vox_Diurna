import './SkeletonList.css';

export default function SkeletonList({ count = 5 }) {
  return (
    <div className="skeleton-list-container">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton-list-item" style={{ animationDelay: `${i * 0.1}s` }}>
          <div className="skeleton-list-image skeleton" />
          <div className="skeleton-list-content">
            <div className="skeleton skeleton-list-meta">
              <div className="skeleton skeleton-list-tag" />
              <div className="skeleton skeleton-list-date" />
            </div>
            <div className="skeleton skeleton-list-title" />
            <div className="skeleton skeleton-list-title skeleton-list-title-sm" />
            <div className="skeleton skeleton-list-excerpt" />
            <div className="skeleton skeleton-list-excerpt skeleton-list-excerpt-sm" />
          </div>
        </div>
      ))}
    </div>
  );
}
