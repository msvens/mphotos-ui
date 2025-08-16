'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { PhotoMetadata } from '@/lib/api/types';
import { photosService } from '@/lib/api/services';

interface PhotoContextType {
  photos: PhotoMetadata[];
  isLoading: boolean;
  error: string | null;
}

const PhotoContext = createContext<PhotoContextType>({
  photos: [],
  isLoading: true,
  error: null,
});

export const usePhotoContext = () => useContext(PhotoContext);

export default function PhotoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [photos, setPhotos] = useState<PhotoMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setIsLoading(true);
        const response = await photosService.getPhotos();
        setPhotos(response);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch photos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  return (
    <PhotoContext.Provider value={{ photos, isLoading, error }}>
      <div className="w-full">
        {children}
      </div>
    </PhotoContext.Provider>
  );
} 