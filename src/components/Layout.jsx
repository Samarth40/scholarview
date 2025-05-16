import React from 'react';
import { Doodle } from './icons';

/**
 * Header component with logo and sign-in button
 */
export const Header = () => {
  return (
    <div className="flex justify-between items-center mb-12">
      <div className="flex items-center gap-3">
        <div className="neo-container bg-[#fed823] text-black w-10 h-10 flex items-center justify-center font-bold text-xl">S</div>
        <div className="font-black text-xl tracking-tight">ScholarView</div>
      </div>
      <button className="neo-button bg-[#fe5d97] font-bold tracking-tight">Sign in</button>
    </div>
  );
};

/**
 * Hero component with main title and description
 */
export const Hero = () => {
  return (
    <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
      <div className="relative w-full">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black py-8 px-4 neo-container bg-[#fed823] w-full transform rotate-0 tracking-tight leading-tight">
          Academic Paper<br />Explorer
        </h1>
        <div className="absolute -top-5 -right-5 transform rotate-12">
          <Doodle type="arrow" />
        </div>
      </div>
      <p className="text-base md:text-lg mb-10 max-w-2xl font-medium">
        Discover, filter, and organize academic research with our powerful search tools. 
        Explore papers by citation count, publication date, or research area.
      </p>
    </div>
  );
};

/**
 * Footer component
 */
export const Footer = () => {
  return (
    <footer className="neo-container bg-[#4b91ff] text-black w-full py-12 mt-auto transform -rotate-1">
      <div className="max-w-6xl mx-auto text-center px-4">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="neo-container bg-white text-black w-10 h-10 flex items-center justify-center font-bold transform rotate-12">S</div>
            <div className="text-xl font-black">ScholarView</div>
          </div>
          <p className="max-w-lg mx-auto text-sm font-medium">
            Explore and discover academic research papers with our powerful filtering and sorting tools.
            Find the most relevant papers for your research needs.
          </p>
        </div>
        <div className="border-t border-black pt-6 text-sm font-bold">
          <p>© 2023 ScholarView. Styled with Neobrutalism design.</p>
        </div>
      </div>
    </footer>
  );
};

/**
 * Background decorations component
 */
export const BackgroundDecorations = () => {
  return (
    <>
      <div className="absolute top-24 right-10 rotate-12 opacity-50">
        <Doodle type="stars" />
      </div>
      <div className="absolute bottom-16 left-10 -rotate-12 opacity-50">
        <Doodle type="zigzag" />
      </div>
      <div className="absolute top-1/2 right-16 opacity-50">
        <Doodle type="circles" />
      </div>
    </>
  );
}; 