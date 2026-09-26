import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPostDetail } from '@/lib/api';
import LocalizedDate from '@/components/LocalizedDate';
import NotFound from '@/pages/NotFound';
import ScrollExpand from '@/components/ScrollExpand';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const displayTitle = (value) => typeof value === 'string'
  ? value.replaceAll('_', ' ').replace(/\s+/g, ' ').trim()
  : '';

export default function PostDetail() {
  const { slug, id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        const data = await getPostDetail(slug, id);
        if (!data) {
          setNotFound(true);
          return;
        }
        const title = displayTitle(data.title);
        setPost(data);
        document.title = `${title} — Blog`;
        
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', data.excerpt || `Read ${title} on Blog by Shishir Khatri, Nepali entrepreneur and backend developer.`);
        }
        
        document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${title} — Blog`);
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) {
          ogDesc.setAttribute('content', data.excerpt || `Read ${title} on Blog`);
        }
        if (data.image) document.querySelector('meta[property="og:image"]')?.setAttribute('content', data.image);
        document.querySelector('meta[property="og:url"]')?.setAttribute('content', `https://blog.shishirkhatri.com.np/blog/${slug}/${id}`);
        
        const schema = {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": title,
          "description": data.excerpt,
          ...(data.image ? { "image": data.image } : {}),
          "author": {
            "@type": "Person",
            "name": "Shishir Khatri",
            "url": "https://shishirkhatri.com.np"
          },
          "publisher": {
            "@type": "Person",
            "name": "Shishir Khatri"
          },
          "datePublished": data.date,
          "url": `https://blog.shishirkhatri.com.np/blog/${slug}/${id}`,
          "articleSection": data.category
        };
        
        let existingSchema = document.querySelector('script[type="application/ld+json"]:last-of-type');
        if (existingSchema) {
          existingSchema.remove();
        }
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      } catch (error) {
        console.error('Failed to load post:', error);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slug, id]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }

    const onHashChange = () => {
      const newHash = window.location.hash;
      if (newHash) {
        const el = document.querySelector(newHash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [post]);

  if (loading) {
    return (
      <div className="skeleton-post-page">
        {/* Back link */}
        <div className="skeleton skeleton-post-back"></div>

        {/* Header */}
        <div className="skeleton-post-header">
          <div className="skeleton skeleton-post-tag"></div>
          <div className="skeleton skeleton-post-title"></div>
          <div className="skeleton skeleton-post-title line2"></div>
          <div className="skeleton skeleton-post-excerpt"></div>
          <div className="skeleton skeleton-post-excerpt line2"></div>
          <div className="skeleton skeleton-post-excerpt line3"></div>
          <div className="skeleton-post-meta">
            <div className="skeleton skeleton-post-meta-date"></div>
            <div className="skeleton skeleton-post-meta-dot"></div>
            <div className="skeleton skeleton-post-meta-time"></div>
          </div>
        </div>

        {/* Body content lines */}
        <div className="skeleton-post-body">
          <div className="skeleton skeleton-post-line"></div>
          <div className="skeleton skeleton-post-line w-90"></div>
          <div className="skeleton skeleton-post-line w-80"></div>
          <div className="skeleton skeleton-post-line"></div>
          <div className="skeleton skeleton-post-line w-70"></div>
          <div className="skeleton skeleton-post-line h2 gap"></div>
          <div className="skeleton skeleton-post-line gap"></div>
          <div className="skeleton skeleton-post-line w-90"></div>
          <div className="skeleton skeleton-post-line w-80"></div>
          <div className="skeleton skeleton-post-line"></div>
          <div className="skeleton skeleton-post-line w-50"></div>
        </div>
      </div>
    );
  }

  if (notFound || (!loading && !post)) {
    return <NotFound />;
  }

  if (!post) return null;

  return (
    <article className="post-page" id="post-article">
      <div className={`post-hero-section${post.image ? ' post-hero-section--expand' : ''}`}>
        <Link to="/" className="post-back">
          <span className="arrow">←</span>
          <span>Back Home</span>
        </Link>

        <header className="post-header">
          {post.image && (
            <ScrollExpand
              className="post-cover-expand"
              src={post.image}
              alt={`${displayTitle(post.title)} cover`}
              title={displayTitle(post.title)}
              scrollHint="Scroll to expand"
              startWidth={56}
              startHeight={80}
              useWindowScroll
            />
          )}
          <span className="post-category-tag">{post.category}</span>
          <h1 className="post-page-title">{displayTitle(post.title)}</h1>
          <div className="post-page-excerpt">
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
              {post.excerpt}
            </ReactMarkdown>
          </div>
          <div className="post-page-meta">
            <LocalizedDate dateStr={post.date} />
            <span className="divider"></span>
            <span>{post.readingTime}</span>
          </div>
        </header>
      </div>

      <div className="post-body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings]}
        >
          {post.content || ""}
        </ReactMarkdown>
      </div>
    </article>
  );
}
