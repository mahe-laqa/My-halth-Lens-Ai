import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const dim = size === 'sm' ? 24 : size === 'md' ? 32 : 48;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex-shrink-0">
        <svg
          width={dim}
          height={dim}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Lens Circle */}
          <circle 
            cx="18" 
            cy="18" 
            r="14" 
            className="stroke-brand-600" 
            strokeWidth="3.5" 
            strokeLinecap="round"
          />
          
          {/* Handle */}
          <path 
            d="M29 29L36 36" 
            className="stroke-brand-800" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />

          {/* Medical Cross (Floating Inside) */}
          <path 
            d="M18 12V24M12 18H24" 
            className="stroke-brand-400" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          
          {/* Sparkle/Accent Detail for Charm */}
          <circle cx="28" cy="10" r="2" className="fill-accent" />
        </svg>
      </div>
      <div className="flex flex-col justify-center">
        <h1 className={`font-bold tracking-tight text-slate-800 leading-none ${size === 'lg' ? 'text-2xl' : 'text-xl'}`}>
          MyHealth<span className="text-brand-600">Lens</span>
        </h1>
      </div>
    </div>
  );
};