import React, { useState, useEffect, useRef } from 'react';
import { Slide } from '../types';

interface SlideshowProps {
  images: Slide[];
  onSlideChange?: (tags: string[]) => void;
}

const Slideshow: React.FC<SlideshowProps> = ({ images, onSlideChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCurrentIndex(0);
    setPrevIndex(0);
  }, [images]);

  // Notify parent of tags for the current slide
  useEffect(() => {
    if (images.length > 0 && onSlideChange) {
      onSlideChange(images[currentIndex % images.length]?.tags || []);
    }
  }, [currentIndex, images, onSlideChange]);

  // Auto-play Logic (4 Second Interval)
  useEffect(() => {
    if (isPlaying && images.length > 1) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 4000); 
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentIndex, images]);

  const nextSlide = () => {
    setPrevIndex(currentIndex);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setPrevIndex(currentIndex);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full max-w-screen-xl aspect-video bg-[#606060] rounded-lg flex items-center justify-center text-gray-400">
        No images found for this category.
      </div>
    );
  }

  const safeCurrentIndex = currentIndex % images.length;
  const safePrevIndex = prevIndex % images.length;

  const currentSlide = images[safeCurrentIndex];
  const previousSlide = images[safePrevIndex];
  
  const formattedCaption = currentSlide?.caption 
    ? currentSlide.caption.replaceAll(': ', '  |  ') 
    : currentSlide?.title || "";

  return (
    <div className="w-full bg-[#565656] flex flex-col items-center">
      <div className="relative w-full max-w-screen-xl aspect-video overflow-hidden group bg-black rounded-lg shadow-lg">
        
        {/* Previous Image (Background) */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={previousSlide?.url} 
            alt="" 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Current Image (Fade-in Overlay) */}
        <div key={currentSlide?.url} className="absolute inset-0 w-full h-full animate-fade-in">
          <img 
            src={currentSlide?.url} 
            alt={currentSlide?.caption || ""} 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Play/Pause Button */}
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/40 hover:bg-black/60 text-white w-12 h-12 rounded-full z-30 transition-opacity opacity-0 group-hover:opacity-100 flex items-center justify-center backdrop-blur-sm font-bold"
        >
          {isPlaying ? <span className="text-sm tracking-tighter">II</span> : <span className="text-xl ml-1">{">"}</span>}
        </button>

        {images.length > 1 && (
          <>
            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 p-4 rounded-full text-white z-20 transition-opacity opacity-0 group-hover:opacity-100">
              &#10094;
            </button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 p-4 rounded-full text-white z-20 transition-opacity opacity-0 group-hover:opacity-100">
              &#10095;
            </button>
          </>
        )}
      </div>

      <div className="w-full max-w-screen-xl px-4 md:px-0">
        <div className="px-6 py-4 bg-[#606060] text-gray-300 text-base mt-4 text-left rounded-lg shadow-lg min-h-[50px]">
          <p className="leading-relaxed">{formattedCaption}</p>
        </div>
      </div>
    </div>
  );
};

export default Slideshow;