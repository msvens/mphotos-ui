'use client';

import { useMPContext } from '@/context/MPContext';

type PageSpacingHeight = 'default' | 'no_spacing' | string;

interface PageSpacingProps {
  // Height can be 'default' (96px), 'no_spacing' (navbar height), or any arbitrary value
  height?: PageSpacingHeight;
  // Optional className for additional styling
  className?: string;
}

export function PageSpacing({ height = 'default', className = "" }: PageSpacingProps) {
  const { uxConfig } = useMPContext();
  const isDense = uxConfig.denseTopBar;
  const navbarHeight = isDense ? '40px' : '48px'; // h-10 vs h-12

  const getHeight = () => {
    switch (height) {
      case 'default':
        return '96px';
      case 'no_spacing':
        return navbarHeight; // Dynamic based on dense mode
      default:
        return height;
    }
  };

  return <div style={{ height: getHeight() }} className={className} />;
} 