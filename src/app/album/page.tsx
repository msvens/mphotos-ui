'use client';

import { AlbumGrid } from '@/components/album/AlbumGrid';
import { PageSpacing } from '@/components/layout/PageSpacing';

export default function Album() {
  return (
    <>
      <PageSpacing />
      <div className="max-w-[1024px] mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-light text-mui-text-primary">Photo Albums</h1>
        </div>
        <AlbumGrid />
      </div>
    </>
  );
} 