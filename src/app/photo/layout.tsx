'use client';

import { PhotoContextProvider } from '@/context/PhotoContext';

export default function PhotoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PhotoContextProvider>
      <div className="w-full">
        {children}
      </div>
    </PhotoContextProvider>
  );
} 