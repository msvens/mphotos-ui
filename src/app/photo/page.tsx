'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { photosService } from '@/lib/api/services';
import { Section } from '@/components/Section';

export default function PhotosPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const redirectToFirstPhoto = async () => {
      try {
        const photos = await photosService.getPhotos();
        if (photos && photos.length > 0) {
          router.replace(`/photo/${photos[0].id}`);
        } else {
          setError('No photos available');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch photos');
      }
    };

    redirectToFirstPhoto();
  }, [router]);

  if (error) {
    return (
      <Section>
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-red-500">{error}</div>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    </Section>
  );
} 