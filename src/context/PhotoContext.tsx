'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { PhotoMetadata } from '@/lib/api/types';
import { photosService, albumsService } from '@/lib/api/services';
import { useMPContext } from './MPContext';

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

export function PhotoContextProvider({ children }: { children: React.ReactNode }) {
  const { isUser, uxConfig, isLoading: isConfigLoading } = useMPContext();
  const [photos, setPhotos] = useState<PhotoMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      if (isConfigLoading) return;

      try {
        setIsLoading(true);
        let photoList;

        if (isUser) {
          // Admin: fetch all photos
          photoList = await photosService.getPhotos();
        } else if (uxConfig.photoStreamAlbumId) {
          // Guest/public: fetch photostream photos
          photoList = await albumsService.getAlbumPhotos(uxConfig.photoStreamAlbumId);
        } else {
          setError('No photos available');
          setIsLoading(false);
          return;
        }

        setPhotos(photoList.photos);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch photos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, [isUser, uxConfig.photoStreamAlbumId, isConfigLoading]);

  return (
    <PhotoContext.Provider value={{ photos, isLoading, error }}>
      {children}
    </PhotoContext.Provider>
  );
}