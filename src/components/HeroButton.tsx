import React from 'react';
import './HeroButton.css';

interface HeroButtonProps {
  children: React.ReactNode;
}

const HeroButton: React.FC<HeroButtonProps> = ({ children }) => {
  return (
    <button className="hero-button mt-4 border-2 border-white text-white opacity-70">
      {children}
    </button>
  );
};

export default HeroButton;

