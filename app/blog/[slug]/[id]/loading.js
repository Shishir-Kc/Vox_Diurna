export default function Loading() {
  return (
    <article className="post-page animate-reveal">
      <div className="post-back" style={{ opacity: 0.3, marginBottom: '2rem' }}>
        <span className="arrow">←</span>
        <span>Back to Journal</span>
      </div>

      <header className="post-header">
        <div className="skeleton" style={{ width: '60px', height: '24px', borderRadius: '100px', marginBottom: '1rem' }}></div>
        <div className="skeleton" style={{ width: '85%', height: '4.5rem', marginBottom: '1.5rem', borderRadius: '8px' }}></div>
        <div className="skeleton" style={{ width: '100%', height: '1.4rem', marginBottom: '0.6rem' }}></div>
        <div className="skeleton" style={{ width: '100%', height: '1.4rem', marginBottom: '0.6rem' }}></div>
        <div className="skeleton" style={{ width: '70%', height: '1.4rem', marginBottom: '2.5rem' }}></div>
        
        <div className="post-page-meta">
          <div className="skeleton" style={{ width: '180px', height: '1rem' }}></div>
        </div>
      </header>

      <div className="post-body">
        <div className="skeleton" style={{ width: '100%', height: '1.2rem', marginBottom: '1.2rem' }}></div>
        <div className="skeleton" style={{ width: '100%', height: '1.2rem', marginBottom: '1.2rem' }}></div>
        <div className="skeleton" style={{ width: '100%', height: '1.2rem', marginBottom: '1.2rem' }}></div>
        <div className="skeleton" style={{ width: '90%', height: '1.2rem', marginBottom: '2rem' }}></div>
        
        <div className="skeleton" style={{ width: '100%', height: '1.2rem', marginBottom: '1.2rem' }}></div>
        <div className="skeleton" style={{ width: '95%', height: '1.2rem', marginBottom: '1.2rem' }}></div>
        <div className="skeleton" style={{ width: '100%', height: '1.2rem', marginBottom: '1.2rem' }}></div>
        <div className="skeleton" style={{ width: '60%', height: '1.2rem', marginBottom: '1.2rem' }}></div>
      </div>
    </article>
  );
}

