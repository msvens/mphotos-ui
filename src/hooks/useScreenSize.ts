'use client';

import { useEffect, useState } from 'react';

export interface ScreenSize {
  isMobile: boolean;
  isPortrait: boolean;
}

// Match Tailwind CSS sm breakpoint (640px)
// Reference: https://tailwindcss.com/docs/responsive-design
const MOBILE_BREAKPOINT = 640;

export function useScreenSize(): ScreenSize {
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    isMobile: false,
    isPortrait: false,
  });

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setScreenSize({
        isMobile: width < MOBILE_BREAKPOINT, // < 600px = mobile
        isPortrait: height > width,           // orientation: portrait
      });
    };

    // Initial check
    updateScreenSize();

    // Listen for resize and orientation changes
    window.addEventListener('resize', updateScreenSize);
    window.addEventListener('orientationchange', updateScreenSize);

    return () => {
      window.removeEventListener('resize', updateScreenSize);
      window.removeEventListener('orientationchange', updateScreenSize);
    };
  }, []);

  return screenSize;
}