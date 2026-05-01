import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getPostDetail } from '@/lib/api';
import LocalizedDate from '@/components/LocalizedDate';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';


export default function PostDetail() {
  const { slug, id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        const data = await getPostDetail(slug, id);
        if (!data) {
          navigate('/not-found');
          return;
        }
        setPost(data);
        document.title = `${data.title} — Vox Diurna`;
        
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', data.excerpt || `Read ${data.title} on Vox Diurna by Shishir Khatri, Nepali entrepreneur and backend developer.`);
        }
        
        document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${data.title} — Vox Diurna`);
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) {
          ogDesc.setAttribute('content', data.excerpt || `Read ${data.title} on Vox Diurna`);
        }
        document.querySelector('meta[property="og:url"]')?.setAttribute('content', `https://blog.shishirkhatri.com.np/blog/${slug}/${id}`);
        
        const schema = {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": data.title,
          "description": data.excerpt,
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
  }, [slug, id, navigate]);

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

  if (!post) return null;

  return (
    <article className="post-page" id="post-article">
      <Link to="/" className="post-back">
        <span className="arrow">←</span>
        <span>Back Home</span>
      </Link>

      <header className="post-header">
        <span className="post-category-tag">{post.category}</span>
        <h1 className="post-page-title">{post.title}</h1>
        <p className="post-page-excerpt">{post.excerpt}</p>
        <div className="post-page-meta">
          <LocalizedDate dateStr={post.date} />
          <span className="divider"></span>
          <span>{post.readingTime}</span>
        </div>
      </header>

      <div className="post-body">
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
          {post.content || ""}
        </ReactMarkdown>
      </div>
    </article>
  );
}
