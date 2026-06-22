import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '@/lib/api';
import LocalizedDate from '@/components/LocalizedDate';
import EmptyState from '@/components/EmptyState';
import Select from '@/components/Select';

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const isPostWithinLastWeek = (dateStr) => {
  const postDate = new Date(dateStr);
  if (isNaN(postDate.getTime())) return false;
  return (new Date() - postDate) <= ONE_WEEK_MS;
};

const categoryIcons = {
  Architecture: "◈",
  Culture: "◉",
  Science: "◎",
  Design: "◇",
  Music: "♪",
  Technology: "⬡",
  Art: "△",
};

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await getAllPosts();
        setPosts(data || []);
        document.title = "Vox Diurna — Words that matter, daily.";
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(posts.map(p => p.category).filter(Boolean));
    return ['All', ...Array.from(set).sort()];
  }, [posts]);

  const isFiltering = query.trim().length > 0 || category !== 'All';

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...posts]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .filter(post => {
        if (category !== 'All' && post.category !== category) return false;
        if (!q) return true;
        const haystack = [
          post.title,
          post.excerpt,
          post.category,
          post.content,
        ].filter(Boolean).join(' ').toLowerCase();
        return haystack.includes(q);
      });
  }, [posts, query, category]);

  const renderPostCard = (post, index, offset = 0) => (
    <Link
      key={post.slug}
      to={`/blog/${post.slug}/${post.id}`}
      className="post-card animate-reveal"
      id={`post-${post.slug}`}
      style={{ animationDelay: `${(offset + index) * 0.1}s` }}
    >
      <div className="post-card-image">
        <span className="placeholder-icon">
          {categoryIcons[post.category] || "◈"}
        </span>
        <span className="post-card-category">{post.category}</span>
      </div>
      <div className="post-card-body">
        <span className="post-card-date">
          <LocalizedDate dateStr={post.date} />
        </span>
        <h3 className="post-card-title">{post.title}</h3>
        <p className="post-card-excerpt">{post.excerpt}</p>
      </div>
      <div className="post-card-footer">
        <span className="post-card-reading-time">
          {post.readingTime}
        </span>
        <span className="post-card-arrow">→</span>
      </div>
    </Link>
  );

  const renderControls = () => (
    <section className="post-controls" aria-label="Filter posts">
      <div className="post-controls-search">
        <svg className="post-controls-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="search"
          className="post-controls-input"
          placeholder="Search posts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search posts"
        />
      </div>
      <Select
        value={category}
        onChange={setCategory}
        options={categories}
        label="Filter by category"
      />
    </section>
  );

  if (loading) {
    return (
      <div className="homepage-wrapper">
        <header className="page-header">
          <h1 className="page-header-title">
            Vox <span className="accent">Diurna</span>
          </h1>
          <p className="page-header-subtitle">Daily Voice — A collection of curated thoughts.</p>
        </header>
        <section className="section">
          <div className="posts-grid">
            {[1, 2, 3].map((n) => (
              <div key={n} className="skeleton-card">
                {/* Image / header zone */}
                <div className="skeleton-card-image">
                  <div className="skeleton skeleton-icon"></div>
                  <div className="skeleton skeleton-category"></div>
                </div>
                {/* Body zone */}
                <div className="skeleton-card-body">
                  <div className="skeleton skeleton-date"></div>
                  <div className="skeleton skeleton-title"></div>
                  <div className="skeleton skeleton-title line2"></div>
                  <div className="skeleton skeleton-excerpt"></div>
                  <div className="skeleton skeleton-excerpt line2"></div>
                </div>
                {/* Footer zone */}
                <div className="skeleton-card-footer">
                  <div className="skeleton skeleton-reading-time"></div>
                  <div className="skeleton skeleton-arrow"></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="homepage-wrapper">
        <header className="page-header">
          <h1 className="page-header-title">
            Vox <span className="accent">Diurna</span>
          </h1>
          <p className="page-header-subtitle">Daily Voice — A collection of curated thoughts.</p>
        </header>
        <EmptyState />
      </div>
    );
  }

  const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
  const isFeatured = (post) => post.featured === true;
  const featuredPosts = sortedPosts.filter(post => isFeatured(post) && isPostWithinLastWeek(post.date));
  const regularPosts = sortedPosts.filter(post => !isFeatured(post) || !isPostWithinLastWeek(post.date));

  return (
    <div className="homepage-wrapper">
      <header className="page-header">
        <h1 className="page-header-title">
          Vox <span className="accent">Diurna</span>
        </h1>
        <p className="page-header-subtitle">Daily Voice — A collection of curated thoughts.</p>
      </header>

      {renderControls()}

      {isFiltering ? (
        <section className="section" id="posts-section">
          <div className="featured-header">
            <h2>{filteredPosts.length} {filteredPosts.length === 1 ? 'Result' : 'Results'}</h2>
            {(query.trim() || category !== 'All') && (
              <button
                type="button"
                className="post-controls-clear"
                onClick={() => { setQuery(''); setCategory('All'); }}
              >
                Clear filters
              </button>
            )}
          </div>
          {filteredPosts.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="posts-grid">
              {filteredPosts.map((post, index) => renderPostCard(post, index))}
            </div>
          )}
        </section>
      ) : (
        <>
          {featuredPosts.length > 0 && (
            <section className="featured-section animate-reveal">
              <div className="featured-header">
                <span className="featured-badge">Featured</span>
                <h2>Top Posts</h2>
              </div>
              <div className="posts-grid">
                {featuredPosts.map((post, index) => (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}/${post.id}`}
                    className="post-card animate-reveal"
                    id={`post-featured-${post.slug}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="post-card-image">
                      <span className="placeholder-icon">
                        {categoryIcons[post.category] || "◈"}
                      </span>
                      <span className="post-card-category">{post.category}</span>
                    </div>
                    <div className="post-card-body">
                      <span className="post-card-date">
                        <LocalizedDate dateStr={post.date} />
                      </span>
                      <h3 className="post-card-title">{post.title}</h3>
                      <p className="post-card-excerpt">{post.excerpt}</p>
                    </div>
                    <div className="post-card-footer">
                      <span className="post-card-reading-time">
                        {post.readingTime}
                      </span>
                      <span className="post-card-arrow">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="section" id="posts-section">
            {featuredPosts.length > 0 && (
              <div className="featured-header">
                <h2>Recent Posts</h2>
              </div>
            )}
            <div className="posts-grid">
              {regularPosts.map((post, index) => (
                <Link
                  key={post.slug}
                  to={`/blog/${post.slug}/${post.id}`}
                  className="post-card animate-reveal"
                  id={`post-${post.slug}`}
                  style={{ animationDelay: `${(featuredPosts.length + index) * 0.1}s` }}
                >
                  <div className="post-card-image">
                    <span className="placeholder-icon">
                      {categoryIcons[post.category] || "◈"}
                    </span>
                    <span className="post-card-category">{post.category}</span>
                  </div>
                  <div className="post-card-body">
                    <span className="post-card-date">
                      <LocalizedDate dateStr={post.date} />
                    </span>
                    <h3 className="post-card-title">{post.title}</h3>
                    <p className="post-card-excerpt">{post.excerpt}</p>
                  </div>
                  <div className="post-card-footer">
                    <span className="post-card-reading-time">
                      {post.readingTime}
                    </span>
                    <span className="post-card-arrow">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
