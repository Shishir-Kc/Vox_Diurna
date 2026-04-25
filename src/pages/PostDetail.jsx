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
      <article className="post-page">
        <div className="skeleton" style={{ width: '150px', height: '20px', marginBottom: '2rem' }}></div>
        <header className="post-header">
          <div className="skeleton" style={{ width: '80px', height: '24px', marginBottom: '1rem' }}></div>
          <div className="skeleton" style={{ width: '100%', height: '50px', marginBottom: '1rem' }}></div>
          <div className="skeleton" style={{ width: '90%', height: '50px', marginBottom: '1rem' }}></div>
          <div className="skeleton" style={{ width: '60%', height: '20px', marginTop: '2rem' }}></div>
        </header>
      </article>
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
