import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostDetail } from "@/lib/api";
import LocalizedDate from "@/components/LocalizedDate";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ 
    slug: post.slug,
    id: String(post.id)
  }));
}

export async function generateMetadata({ params }) {
  const { slug, id } = await params;
  const post = await getPostDetail(slug, id);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} — Vox Diurna`,
    description: post.excerpt,
  };
}

export default async function BlogPost({ params }) {
  const { slug, id } = await params;
  const post = await getPostDetail(slug, id);

  if (!post) {
    notFound();
  }

  // Basic markdown-like parser for code snippets
  const renderContent = (content) => {
    if (!content) return null;
    
    // Split by triple backticks for code blocks
    const sections = content.split(/(```[\s\S]*?```)/g);
    
    return sections.map((section, idx) => {
      if (section.startsWith('```') && section.endsWith('```')) {
        const code = section.slice(3, -3).trim();
        return (
          <pre key={idx}>
            <code>{code}</code>
          </pre>
        );
      }
      
      // For non-code sections, handle paragraphs and inline code
      return section.split('\n\n').map((para, pIdx) => {
        if (!para.trim()) return null;
        
        // Handle inline code (single backticks)
        const parts = para.split(/(`[^`]+`)/g);
        
        return (
          <p key={`${idx}-${pIdx}`}>
            {parts.map((part, kIdx) => {
              if (part.startsWith('`') && part.endsWith('`')) {
                return (
                  <code key={kIdx}>{part.slice(1, -1)}</code>
                );
              }
              return part;
            })}
          </p>
        );
      });
    });
  };

  return (
    <article className="post-page" id="post-article">
      <Link href="/" className="post-back">
        <span className="arrow">←</span>
        <span>Back to Journal</span>
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
        {renderContent(post.content)}
      </div>
    </article>
  );
}
