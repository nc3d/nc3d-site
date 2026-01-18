import React from 'react';

export type SlideSEO = {
  url: string;          // absolute or root-relative (/images/...)
  title?: string;
  caption?: string;
  tags?: string[];
  alt?: string;
};

type Props = {
  slides: SlideSEO[];
  galleryName?: string;
  /** If you deploy to a subfolder or want absolute URLs in JSON-LD, pass your origin, e.g. "https://www.nc3d.com" */
  siteOrigin?: string;
};

function toAbsolute(url: string, siteOrigin?: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  const origin =
    siteOrigin ||
    (typeof window !== 'undefined' && window.location ? window.location.origin : '');
  return origin ? `${origin}${url.startsWith('/') ? url : `/${url}`}` : url;
}

const SlideshowSEO: React.FC<Props> = ({ slides, galleryName = 'Project Gallery', siteOrigin }) => {
  const images = slides
    .filter(s => s && s.url?.trim())
    .map(s => {
      const contentUrl = toAbsolute(s.url, siteOrigin);
      const caption = s.caption || s.title || s.alt;
      const name = s.title || s.alt || undefined;
      const keywords = s.tags?.length ? s.tags.join(', ') : undefined;
      return {
        '@type': 'ImageObject',
        contentUrl,
        name,
        caption,
        keywords,
      };
    });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: galleryName,
    image: images,
  };

  return (
    <>
      {/* React 19 hoists this into <head> */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      {/* Crawlable, hidden text for captions/tags */}
      <div className="sr-only">
        <h2>{galleryName} — captions and metadata</h2>
        <ul>
          {slides.map((s, i) => {
            if (!s?.url) return null;
            const bits = [
              s.title ? `Title: ${s.title}` : null,
              s.caption ? `Caption: ${s.caption}` : null,
              s.tags?.length ? `Tags: ${s.tags.join(', ')}` : null,
              s.alt ? `Alt: ${s.alt}` : null,
            ].filter(Boolean);
            return <li key={i}>{bits.join(' — ')}</li>;
          })}
        </ul>
      </div>
    </>
  );
};

export default SlideshowSEO;
