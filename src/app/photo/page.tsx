'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { photosService, albumsService } from '@/lib/api/services';
import { Section } from '@/components/Section';
import { useMPContext } from '@/context/MPContext';
import { PageSpacing } from '@/components/layout/PageSpacing';

export default function PhotosPage() {
  const router = useRouter();
  const { isUser, uxConfig, isLoading } = useMPContext();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const redirectToFirstPhoto = async () => {
      if (isLoading) return;

      try {
        let photoList;

        if (isUser) {
          // Admin: fetch all photos
          photoList = await photosService.getPhotos();
        } else if (uxConfig.photoStreamAlbumId) {
          // Guest/public: fetch photostream photos
          photoList = await albumsService.getAlbumPhotos(uxConfig.photoStreamAlbumId);
        } else {
          setError('No photos available');
          return;
        }

        if (photoList.photos && photoList.photos.length > 0) {
          router.replace(`/photo/${photoList.photos[0].id}`);
        } else {
          setError('No photos available');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch photos');
      }
    };

    redirectToFirstPhoto();
  }, [router, isUser, uxConfig.photoStreamAlbumId, isLoading]);

  return (
    <>
      <PageSpacing />
      {error ? (
        <Section>
          <div className="flex items-center justify-center h-[50vh]">
            <div className="text-red-500">{error}</div>
          </div>
        </Section>
      ) : (
        <Section>
          <div className="flex items-center justify-center h-[50vh]">
            <div className="animate-pulse text-gray-400">Loading...</div>
          </div>
        </Section>
      )}
    </>
  );
} 