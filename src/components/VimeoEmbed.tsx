import React from 'react';

const VimeoEmbed: React.FC<{ id: string; title?: string }> = ({ id, title }) => (
  <div style={{ position: 'relative', paddingTop: '56.25%' }}>
    <iframe
      src={`https://player.vimeo.com/video/${id}?badge=0&autopause=0&player_id=0&app_id=58479`}
      title={title ?? 'Vimeo video'}
      allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
      allowFullScreen
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
    />
  </div>
);

export default VimeoEmbed;
