import { useState, useEffect, useCallback } from 'react';
import { PhotoMetadata } from '@/lib/api/types';
import { photosService } from '@/lib/api/services/photos';
import { useMPContext } from '@/context/MPContext';

export function usePhotos() {
  const [photos, setPhotos] = useState<PhotoMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { isUser, uxConfig, isLoading: isConfigLoading } = useMPContext();

  const loadPhotos = useCallback(async () => {
    // Don't try to load photos until we have the config
    if (isConfigLoading) {
      return;
    }

    try {
      setIsLoading(true);
      console.log('Loading photos, isUser:', isUser, 'photoStreamAlbumId:', uxConfig.photoStreamAlbumId);
      
      let newPhotos: PhotoMetadata[];
      if (isUser) {
        newPhotos = await photosService.getPhotos();
      } else {
        if (!uxConfig.photoStreamAlbumId) {
          console.error('No photostream album ID configured');
          setHasMore(false);
          return;
        }
        newPhotos = await photosService.getAlbumPhotos(uxConfig.photoStreamAlbumId);
      }
      
      console.log('Received photos:', newPhotos);
      
      // Filter out duplicates
      const uniqueNewPhotos = newPhotos.filter(
        (newPhoto) => !photos.some((existingPhoto) => existingPhoto.id === newPhoto.id)
      );
      console.log('Unique new photos:', uniqueNewPhotos);
      
      setPhotos((prev) => [...prev, ...uniqueNewPhotos]);
      setHasMore(uniqueNewPhotos.length > 0);
    } catch (error) {
      console.error('Error loading photos:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [photos, isUser, uxConfig.photoStreamAlbumId, isConfigLoading]);

  const refresh = useCallback(async () => {
    console.log('Refreshing photos');
    setPhotos([]);
    setHasMore(true);
    await loadPhotos();
  }, [loadPhotos]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  return {
    photos,
    isLoading: isLoading || isConfigLoading,
    hasMore,
    loadMore: loadPhotos,
    refresh,
  };
} 