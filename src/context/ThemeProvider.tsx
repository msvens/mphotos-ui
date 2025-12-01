'use client';

import { useEffect } from 'react';
import { useMPContext } from './MPContext';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { uxConfig } = useMPContext();

  useEffect(() => {
    const htmlElement = document.documentElement;

    if (uxConfig.colorTheme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [uxConfig.colorTheme]);

  return <>{children}</>;
}