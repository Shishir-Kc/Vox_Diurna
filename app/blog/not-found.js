import Link from "next/link";

export default function NotFound() {
  return (
    <article className="post-page" id="post-article">
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
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <div className="icon-pulse"></div>
        </div>
        <h2 className="empty-state-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Post Not Found</h2>
        <p className="empty-state-description" style={{ fontSize: '1rem' }}>
          The post you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem' }}>
          <Link
            href="/"
            className="post-back"
            style={{ textDecoration: 'none', gap: '0.5rem', alignItems: 'center' }}
          >
            <span className="arrow" style={{ display: 'inline-flex', transform: 'translateY(-1px)' }}>←</span>
            <span>Back to Journal</span>
          </Link>
        </div>
        <div className="empty-state-decoration">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </article>
  );
}
