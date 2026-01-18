import React from 'react';
import { BlogPost } from '../types';

export const blogPosts: BlogPost[] = [
  {
    id: 'city-of-possibility',
    title: 'City of Possibility',
    date: '2025-10-20',
    summary:
      "A look at Portland's future urban design and community, narrated by Randy Gragg.",
    imageUrl: '/images/city-of-possibility.jpg',
    vimeoId: '1073975857',
    showImageInPost: false, // thumbnail shows in list, hidden on post page
    fullDescription: (
      <>
        <p>
          <strong>City of Possibility</strong> This video presents an 3D animated tour of seven transformative projects in Portland, Oregon's central city, including the OMSI redevelopment, the Portland Art Museum expansion, the new earthquake-ready Burnside Bridge, the Broadway Corridor, the Albina Vision Trust's restorative justice project, and the Lloyd Center redevelopment.  
        </p>
        <p>
         NC3D integrated 3D CAD models from each design team into the Portland City Model. Using Unreal Engine, the team then rendered the entire nine-minute animation overnight in a single take on just one PC.
        </p>
      </>
    ),
  },
];
