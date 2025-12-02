'use client';

import { use, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PhotoMetadata } from '@/lib/api/types';
import { photosService } from '@/lib/api/services';
import { CropPage } from '@/components/photodeck/CropPage';
import { PageSpacing } from '@/components/layout/PageSpacing';

interface AlbumPhotoCropPageProps {
  params: Promise<{
    id: string;
    photoId: string;
  }>;
}

export default function AlbumPhotoCropPage({ params }: AlbumPhotoCropPageProps) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const code = searchParams.get('code') || '';
  const [photo, setPhoto] = useState<PhotoMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        setIsLoading(true);
        const photoData = await photosService.getPhoto(resolvedParams.photoId);
        setPhoto(photoData);
      } catch (error) {
        console.error('Error fetching photo:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhoto();
  }, [resolvedParams.photoId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white">Photo not found</div>
      </div>
    );
  }

  const backUrl = `/album/${resolvedParams.id}/${resolvedParams.photoId}${code ? `?code=${code}` : ''}`;

  return (
    <>
      <PageSpacing height="no_spacing" />
      <CropPage photo={photo} backUrl={backUrl} />
    </>
  );
}