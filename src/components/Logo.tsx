import React from 'react';

export const Logo = ({ size = 64, className = "", onClick }: { size?: number, className?: string, onClick?: () => void }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="DR圈 logo" className={className} onClick={onClick}>
      <defs>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="7" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <g id="totem">
          <circle cx="512" cy="512" r="344" fill="none" stroke="currentColor" strokeWidth="58"/>
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M372 322
               H512
               C650 322 748 402 748 512
               C748 622 650 702 512 702
               H372
               C360 702 350 692 350 680
               V344
               C350 332 360 322 372 322
               Z
               M430 390
               V634
               H510
               C610 634 678 585 678 512
               C678 439 610 390 510 390
               H430
               Z"
          />
          <circle cx="512" cy="512" r="70" fill="currentColor"/>
          <circle cx="322" cy="676" r="39" fill="currentColor"/>
          <circle cx="678" cy="330" r="39" fill="currentColor"/>
        </g>
      </defs>
      <rect width="1024" height="1024" fill="#000"/>
      <use href="#totem" color="#00F2EA" transform="translate(-24 -10)" opacity="0.95" filter="url(#softGlow)"/>
      <use href="#totem" color="#FF174F" transform="translate(24 10)" opacity="0.95" filter="url(#softGlow)"/>
      <use href="#totem" color="#FFFFFF"/>
    </svg>
  );
};
