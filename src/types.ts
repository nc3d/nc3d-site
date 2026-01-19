import React from 'react';

export type BlogPost = {
  id: string;
  title: string;
  date: string;               // YYYY-MM-DD
  summary: string;            // short blurb (list + post)
  imageUrl?: string;          // thumbnail path for list + (optionally) post
  vimeoId?: string;           // optional Vimeo video
  content?: React.ReactNode;  // optional rich JSX block
  showImageInPost?: boolean;  // hide image on the post page if false
  fullDescription?: React.ReactNode; // long-only content (post page)
  tags?: string[];            // NEW: tags for list/post SEO

  
};

export interface Slide {
  url: string;
  caption: string;
  tags?: string[]; // <--- Add this line (the ? means it's optional)
}
