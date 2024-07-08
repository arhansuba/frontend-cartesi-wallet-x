import React from 'react';
import './Button.css';

interface HeroButtonProps {
  children: React.ReactNode;
}

const Button: React.FC<HeroButtonProps> = ({ children }) => {
  return (
    <button className="button-button mt-4 border-2 border-white text-white opacity-70">
      {children}
    </button>
  );
};

export default Button;

