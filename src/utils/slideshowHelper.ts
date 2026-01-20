import { Slide } from '../types';
import rawData from '../data/imageData.json';

// Cast JSON
const allSlides = rawData as Slide[];

// 1. Prepare the list (Filter & Fix Paths) - BUT DO NOT SHUFFLE YET
export const slideshowImages: Slide[] = allSlides
  .filter((slide) => {
    return slide.display === 'homepage' || slide.display === 'portfolio';
  })
  .map((slide) => ({
    ...slide,
    url: `/slides/${slide.url}`,
  }));

// 2. Export the Shuffle Function so the Component can use it
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  let currentIndex = newArray.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[currentIndex],
      newArray[randomIndex],
    ];
  }

  return newArray;
}

export const preloadImages = (images: Slide[]) => {
  images.forEach((slide) => {
    const img = new Image();
    img.src = slide.url;
  });
};