'use client';

import { use, useEffect, useState } from 'react';
import { PhotoMetadata } from '@/lib/api/types';
import { photosService } from '@/lib/api/services';
import { CropPage } from '@/components/photodeck/CropPage';
import { PageSpacing } from '@/components/layout/PageSpacing';

interface PhotoCropPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PhotoCropPage({ params }: PhotoCropPageProps) {
  const resolvedParams = use(params);
  const [photo, setPhoto] = useState<PhotoMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        setIsLoading(true);
        const photoData = await photosService.getPhoto(resolvedParams.id);
        setPhoto(photoData);
      } catch (error) {
        console.error('Error fetching photo:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhoto();
  }, [resolvedParams.id]);

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

  return (
    <>
      <PageSpacing height="no_spacing" />
      <CropPage photo={photo} backUrl={`/photo/${resolvedParams.id}`} />
    </>
  );
}