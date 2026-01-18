import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import VimeoEmbed from '../components/VimeoEmbed';

const hasSrc = (s?: string) => typeof s === 'string' && s.trim().length > 0;

function getRouteId(): string | undefined {
  const params = useParams();
  const raw =
    (params.id as string | undefined) ??
    (params.slug as string | undefined) ??
    (params.postId as string | undefined);
  return raw ? decodeURIComponent(raw) : undefined;
}

const BlogPostPage: React.FC = () => {
  const routeId = getRouteId();
  const post = routeId
    ? blogPosts.find((p) => String(p.id).toLowerCase() === routeId.toLowerCase())
    : undefined;

  if (!post) {
    return (
      <div className="text-center text-gray-300 p-8">
        <h2 className="text-2xl font-semibold mb-4">Post not found</h2>
        <p className="mb-4 text-gray-400">
          {routeId ? `No post with id “${routeId}”.` : 'Missing route id.'}
        </p>
        <Link to="/blog" className="text-blue-400 hover:underline">
          ← Back to Blog and Projects
        </Link>
      </div>
    );
  }

  // Native head tags (React 19)
  const canonical = `https://www.yoursite.com/blog/${post.id}`; // set your domain
  const ogImage = post.imageUrl
    ? `https://www.yoursite.com${post.imageUrl}`
    : post.vimeoId
    ? `https://vumbnail.com/${post.vimeoId}.jpg`
    : undefined;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    author: { '@type': 'Organization', name: 'Newlands & Company, Inc.' },
    mainEntityOfPage: canonical,
    image: ogImage ? [ogImage] : undefined,
    keywords: post.tags?.join(', '),
  };

  return (
    <>
      <title>{post.title} | Newlands & Company, Inc.</title>
      <meta name="description" content={post.summary} />
      <link rel="canonical" href={canonical} />
      <meta name="keywords" content={post.tags?.join(', ') ?? ''} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.summary} />
      <meta property="og:url" content={canonical} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      <div className="max-w-4xl mx-auto px-6 py-10 text-gray-300">
        <Link to="/blog" className="text-blue-400 hover:underline">
          ← Back to Blog and Projects
        </Link>

        <h1 className="text-4xl font-bold text-white mt-4 mb-2">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-2">{post.date}</p>

        {post.tags?.length ? (
          <ul className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((t) => (
              <li key={t} className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                {t}
              </li>
            ))}
          </ul>
        ) : null}

        {hasSrc(post.imageUrl) && (post.showImageInPost ?? true) && (
          <figure className="mb-6">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="rounded-lg shadow-lg w-full object-cover"
              loading="lazy"
            />
            {/* If you keep a caption for the image itself, render it here: */}
            {/* <figcaption className="mt-2 text-sm text-gray-400">Image caption...</figcaption> */}
          </figure>
        )}

        {post.summary && <p className="mb-6 leading-relaxed">{post.summary}</p>}

        {post.vimeoId && (
          <div className="mb-10">
            <VimeoEmbed id={post.vimeoId} title={post.title} />
          </div>
        )}

        {post.fullDescription && (
          <div className="prose prose-invert max-w-none">{post.fullDescription}</div>
        )}

        {post.content && <div className="prose prose-invert max-w-none">{post.content}</div>}
      </div>
    </>
  );
};

export default BlogPostPage;
