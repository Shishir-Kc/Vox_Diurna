import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '@/lib/api';
import LocalizedDate from '@/components/LocalizedDate';
import EmptyState from '@/components/EmptyState';

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const isPostWithinLastWeek = (dateStr) => {
  const postDate = new Date(dateStr);
  return !Number.isNaN(postDate.getTime()) && new Date() - postDate <= ONE_WEEK_MS;
};

function cleanExcerpt(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\s*#{1,6}\s*/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/[*_~`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function displayTitle(value) {
  if (typeof value !== 'string') return '';
  return value.replaceAll('_', ' ').replace(/\s+/g, ' ').trim();
}

function PostExcerpt({ children, className = '' }) {
  const excerpt = cleanExcerpt(children);
  if (!excerpt) return null;
  return <p className={className}>{excerpt}</p>;
}

function PostMeta({ post }) {
  return (
    <div className="story-meta">
      {post.category && <span className="story-category">{post.category}</span>}
      {post.date && <LocalizedDate dateStr={post.date} />}
      {post.readingTime && <span>{post.readingTime}</span>}
    </div>
  );
}

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await getAllPosts();
        setPosts(data || []);
        document.title = 'Blog';
      } catch (error) {
        console.error('Failed to load posts:', error);
        setLoadFailed(true);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  const visiblePosts = useMemo(
    () => posts.filter((post) => post.category?.trim().toLowerCase() !== 'draft'),
    [posts],
  );
  const sortedPosts = useMemo(
    () => [...visiblePosts].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [visiblePosts],
  );

  const recentFeatured = sortedPosts.find(
    (post) => post.featured === true && isPostWithinLastWeek(post.date),
  );
  const leadPost = recentFeatured || sortedPosts[0];
  const storyPosts = sortedPosts.filter((post) => post !== leadPost);

  const renderStories = (items) => (
    <div className="stories-grid">
      {items.map((post) => (
        <Link
          key={post.id || post.slug}
          to={`/blog/${post.slug}/${post.id}`}
          className="story-card"
          id={`post-${post.slug}`}
        >
          <PostMeta post={post} />
          <h3 className="story-title">{displayTitle(post.title)}</h3>
          <PostExcerpt className="story-excerpt">{post.excerpt}</PostExcerpt>
          <span className="story-read-link" aria-hidden="true">Continue reading</span>
        </Link>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="homepage-wrapper">
        <section className="lead-skeleton" aria-label="Loading stories">
          <div className="skeleton lead-skeleton-image" />
          <div className="lead-skeleton-copy">
            <div className="skeleton skeleton-line short" />
            <div className="skeleton skeleton-line title" />
            <div className="skeleton skeleton-line title second" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line medium" />
          </div>
        </section>
        <div className="stories-grid" aria-hidden="true">
          {[1, 2, 3, 4].map((item) => <div className="story-skeleton" key={item} />)}
        </div>
      </div>
    );
  }

  if (!visiblePosts.length) {
    return (
      <div className="homepage-wrapper">
        <EmptyState
          title={loadFailed ? 'The journal could not load' : 'No published stories yet'}
          description={loadFailed ? 'Refresh the page in a moment to try again.' : 'New writing will appear here when it is published.'}
          headingLevel="h1"
        />
      </div>
    );
  }

  return (
    <div className="homepage-wrapper">
      {leadPost && (
        <section className="lead-story" aria-label="Featured story">
          <Link
            className="lead-image"
            to={`/blog/${leadPost.slug}/${leadPost.id}`}
            aria-label={`Read ${displayTitle(leadPost.title)}`}
          >
            {leadPost.image ? (
              <img src={leadPost.image} alt="" fetchPriority="high" />
            ) : (
              <span className="lead-cover" aria-hidden="true">
                <span className="lead-cover-initial">{displayTitle(leadPost.title).charAt(0)}</span>
              </span>
            )}
          </Link>
          <div className="lead-copy">
            <PostMeta post={leadPost} />
            <h1 className="lead-title">
              <Link
                className="lead-title-link"
                to={`/blog/${leadPost.slug}/${leadPost.id}`}
                aria-label={`Continue reading ${displayTitle(leadPost.title)}`}
              >
                {displayTitle(leadPost.title)}
              </Link>
            </h1>
            <PostExcerpt className="lead-excerpt">{leadPost.excerpt}</PostExcerpt>
            <Link className="lead-read-link" to={`/blog/${leadPost.slug}/${leadPost.id}`}>
              Continue reading
            </Link>
          </div>
        </section>
      )}

      <section className="stories-section" id="posts-section">
        <div className="stories-heading">
          <h2>Recents</h2>
        </div>

        {storyPosts.length ? renderStories(storyPosts) : (
          <p className="no-more-stories">There are no more stories here yet.</p>
        )}
      </section>
    </div>
  );
}
