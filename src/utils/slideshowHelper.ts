import { Slide } from '../types';
import { imageData } from '../data/imageData';

const IMAGE_BASE_URL = 'https://www.nc3d.com/images/Discipline/';

// Create the final, processed array of slides with full URLs
export const slideshowImages: Slide[] = imageData.map((slide) => ({
  ...slide,
  url: `${IMAGE_BASE_URL}${slide.url}`,
}));


// Fisher-Yates (aka Knuth) Shuffle
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  let currentIndex = newArray.length;
  let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex],
      newArray[currentIndex],
    ];
  }

  return newArray;
}

export function preloadImages(slides: Slide[]): void {
  slides.forEach((slide) => {
    const img = new Image();
    img.src = slide.url;
  });
}
