'use client';

import { PhotoMetadata } from '@/lib/api/types';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { photosService } from '@/lib/api/services';

export interface PhotoGridProps {
  photos: PhotoMetadata[];
  columns?: number;
  spacing?: number;
  linkTo: string;
  onLoadMore?: () => Promise<void>;
  isLoading?: boolean;
  hasMore?: boolean;
  dimPhoto?: (photo: PhotoMetadata) => boolean;
  renderBottomIcon?: (photo: PhotoMetadata) => React.ReactNode;
  onBottomIconClick?: (photo: PhotoMetadata, e: React.MouseEvent) => void;
}

export function PhotoGrid({
  photos,
  columns = 3,
  spacing = 4,
  linkTo,
  onLoadMore,
  isLoading = false,
  hasMore = false,
  dimPhoto,
  renderBottomIcon,
  onBottomIconClick,
}: PhotoGridProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  // Infinite scroll handling
  useEffect(() => {
    if (!onLoadMore || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          console.log('Loading more photos due to intersection');
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [onLoadMore, isLoading, hasMore]);

  if (photos.length === 0 && !isLoading) {
    return (
      <div className="w-full py-8 text-center text-gray-500">
        No photos available
      </div>
    );
  }

  return (
    <div className="w-full flex-grow">
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: `${spacing * 0.1}rem`,
          width: '100%',
          minWidth: '100%'
        }}
      >
        {photos.map((photo) => {
          const isDimmed = dimPhoto?.(photo);
          return (
            <Link
              key={photo.id}
              href={`${linkTo}/${photo.id}`}
              className="block overflow-hidden group w-full relative"
            >
              <div className="aspect-square w-full relative">
                <img
                  src={photosService.getPhotoThumbUrl(photo.id)}
                  alt={photo.title || photo.fileName}
                  className={`w-full h-full object-cover
                    ${isDimmed ? 'opacity-25' : 'opacity-100'}
                    group-hover:scale-105 transition-all duration-300 ease-in-out`}
                  loading="lazy"
                />
                {renderBottomIcon && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 z-10"
                    onClick={(e) => {
                      e.preventDefault();
                      onBottomIconClick?.(photo, e);
                    }}
                  >
                    <div className="w-full bg-black/50 flex justify-end items-center p-2">
                      {renderBottomIcon(photo)}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
      
      {/* Loading indicator and observer target */}
      {(isLoading || hasMore) && (
        <div
          ref={observerTarget}
          className="flex justify-center items-center"
        >
          {isLoading ? (
            <div className="animate-pulse text-gray-400">Loading...</div>
          ) : (
            <div className="h-4" /> // Spacer for intersection observer
          )}
        </div>
      )}
    </div>
  );
} 