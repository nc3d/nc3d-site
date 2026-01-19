import React from 'react';

const CompanyStatement: React.FC = () => {
  return (
    // CHANGED: 
    // 1. Replaced 'p-6' with 'px-6 py-4' (Tightens top/bottom, keeps left alignment)
    // 2. Replaced 'mt-10' with 'mt-4' (Pulls the whole box up closer to the slideshow)
    <div className="px-6 py-4 bg-[#606060] text-gray-300 text-base mt-4 text-left rounded-lg shadow-lg">
      <p>
        Founded in 1988, NC3D is a pioneer in the field of 3D design visualization. Based in Portland, Oregon, our studio specializes in transforming complex ideas into compelling visual narratives that engage and inspire. From marketing campaigns to construction planning and community involvement, we excel at bridging the gap between design and understanding. Our expertise spans 3D animation, visual simulation, video production, and real-time visualization.  The NC3D are experienced collaborators for architects, urban designers, and transportation professionals seeking to connect with diverse audiences on critical projects.
      </p>
    </div>
  );
};

export default CompanyStatement;