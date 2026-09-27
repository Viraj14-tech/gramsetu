import React from 'react';

interface CivicEmblemProps {
  className?: string;
  size?: number;
}

export const CivicEmblem: React.FC<CivicEmblemProps> = ({ className = '', size = 44 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Gram Panchayat Civic Emblem"
    >
      {/* Outer Civic Shield Ring */}
      <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
      <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2" strokeOpacity="0.4" />

      {/* Stylized Rural Grain / Wreath Arcs */}
      <path
        d="M16 44C12 36 13 24 20 17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M48 44C52 36 51 24 44 17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Central Civic Pillar / Panchayat Dome */}
      <path
        d="M24 26L32 16L40 26H24Z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <rect x="26" y="26" width="3" height="12" fill="currentColor" />
      <rect x="30.5" y="26" width="3" height="12" fill="currentColor" />
      <rect x="35" y="26" width="3" height="12" fill="currentColor" />

      {/* Base Pedestal & Dharma Wheel Motif */}
      <path d="M21 39H43" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="32" cy="45" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="32" cy="45" r="1.2" fill="currentColor" />
      <path d="M23 45H26M38 45H41" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M20 51H44" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
};
