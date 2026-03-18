import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '@/lib/api';
import LocalizedDate from '@/components/LocalizedDate';
import EmptyState from '@/components/EmptyState';

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
                <div className="skeleton skeleton-category"></div>
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-excerpt"></div>
                <div className="skeleton skeleton-excerpt small"></div>
                <div className="skeleton-footer">
                  <div className="skeleton" style={{ width: '40px', height: '12px' }}></div>
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

  const featuredPosts = posts.filter(post => post.featured === true || post.fatured === true);
  const regularPosts = posts.filter(post => post.featured !== true && post.fatured !== true);

  return (
    <div className="homepage-wrapper">
      <header className="page-header">
        <h1 className="page-header-title">
          Vox <span className="accent">Diurna</span>
        </h1>
        <p className="page-header-subtitle">Daily Voice — A collection of curated thoughts.</p>
      </header>

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
    </div>
  );
}
