import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostDetail } from "@/lib/api";
import LocalizedDate from "@/components/LocalizedDate";
import { marked } from "marked";

export const runtime = "edge";

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

  const htmlContent = marked.parse(post.content || "");

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

      <div 
        className="post-body"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </article>
  );
}
