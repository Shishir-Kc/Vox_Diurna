export default function Loading() {
  const featuredSkeletons = Array.from({ length: 2 });
  const recentSkeletons = Array.from({ length: 4 });

  return (
    <div className="homepage-wrapper">
      <header className="page-header">
        <h1 className="page-header-title">
          Vox <span className="accent">Diurna</span>
        </h1>
        <p className="page-header-subtitle">Daily Voice — A collection of curated thoughts.</p>
      </header>

      <section className="featured-section">
        <div className="featured-header">
          <div className="skeleton" style={{ width: '60px', height: '20px', borderRadius: '4px' }}></div>
          <div className="skeleton" style={{ width: '100px', height: '24px' }}></div>
        </div>
        <div className="posts-grid">
          {featuredSkeletons.map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton skeleton-category"></div>
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-excerpt"></div>
              <div className="skeleton skeleton-excerpt small"></div>
              <div className="skeleton skeleton-footer"></div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="featured-header">
          <div className="skeleton" style={{ width: '140px', height: '24px' }}></div>
        </div>

        <div className="posts-grid">
          {recentSkeletons.map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton skeleton-category"></div>
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-excerpt"></div>
              <div className="skeleton skeleton-excerpt small"></div>
              <div className="skeleton skeleton-footer"></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

