import React from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import type { BlogPost } from '../types';

// Helper
const hasSrc = (s?: string) => typeof s === 'string' && s.trim().length > 0;

// Thumbnail with Vimeo poster fallback
const SmartThumbnail: React.FC<{ post: BlogPost }> = ({ post }) => {
  const initial =
    (hasSrc(post.imageUrl) && post.imageUrl) ||
    (post.vimeoId ? `https://vumbnail.com/${post.vimeoId}.jpg` : null);

  const [src, setSrc] = React.useState<string | null>(initial);
  const triedFallback = React.useRef(false);

  if (!src) return null;

  return (
    <img
      src={src}
      alt={post.title}
      className="w-40 h-28 object-cover rounded-lg shadow-md flex-shrink-0"
      loading="lazy"
      onError={() => {
        if (!triedFallback.current && post.vimeoId) {
          triedFallback.current = true;
          setSrc(`https://vumbnail.com/${post.vimeoId}.jpg`);
        } else {
          setSrc(null); // hide broken image
        }
      }}
    />
  );
};

const BlogListPage: React.FC = () => {
  const posts = Array.isArray(blogPosts) ? blogPosts : [];

  if (posts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10 text-gray-300">
        <h1 className="text-3xl font-bold text-white mb-6">Blog and Projects</h1>
        <p className="text-gray-400">No posts yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-gray-300">
      <h1 className="text-3xl font-bold text-white mb-6">Blog and Projects</h1>
      <ul className="space-y-8">
        {posts.map((p) => (
          <li
            key={p.id}
            className="flex gap-5 items-start rounded-lg border border-gray-700 p-5 hover:bg-gray-800/40"
          >
            {/* Thumbnail on the left */}
            <Link
              to={`/blog/${encodeURIComponent(p.id)}`}
              className="block flex-shrink-0"
            >
              <SmartThumbnail post={p} />
            </Link>

            {/* Text on the right */}
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-white">
                <Link
                  to={`/blog/${encodeURIComponent(p.id)}`}
                  className="hover:underline"
                >
                  {p.title}
                </Link>
              </h2>
              <p className="text-sm text-gray-500 mb-2">{p.date}</p>
              {p.summary && (
                <p className="mb-3 leading-relaxed text-gray-300">{p.summary}</p>
              )}
              <Link
                to={`/blog/${encodeURIComponent(p.id)}`}
                className="text-blue-400 hover:underline"
              >
                Read more →
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogListPage;
