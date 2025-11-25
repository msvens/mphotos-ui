'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import { useSearchParams } from 'next/navigation';
import { Album, PhotoMetadata } from '@/lib/api/types';
import { albumsService } from '@/lib/api/services';
import { useMPContext } from '@/context/MPContext';
import { PhotoDeck } from '@/components/photodeck/PhotoDeck';
import { PageSpacing } from '@/components/layout/PageSpacing';

interface AlbumPhotoPageProps {
  params: Promise<{
    id: string;
    photoId: string;
  }>;
}

export default function AlbumPhotoPage({ params }: AlbumPhotoPageProps) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const code = searchParams.get('code') || '';

  const { isUser, uxConfig } = useMPContext();
  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<PhotoMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlbumData = async () => {
      try {
        setIsLoading(true);
        const [albumData, photosData] = await Promise.all([
          albumsService.getAlbum(resolvedParams.id),
          albumsService.getAlbumPhotos(resolvedParams.id, code || undefined),
        ]);
        setAlbum(albumData);
        setPhotos(photosData.photos);
      } catch (error) {
        console.error('Error fetching album:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbumData();
  }, [resolvedParams.id, code]);

  const handleUpdatePhoto = (updatedPhoto: PhotoMetadata) => {
    setPhotos(prev => prev.map(p => p.id === updatedPhoto.id ? updatedPhoto : p));
  };

  const handleDeletePhoto = (deletedPhoto: PhotoMetadata) => {
    setPhotos(prev => prev.filter(p => p.id !== deletedPhoto.id));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!album || photos.length === 0) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-gray-400">Album or photos not found</div>
      </div>
    );
  }

  return (
    <>
      <PageSpacing height="no_spacing" />
      <PhotoDeck
        photos={photos}
        startPhotoId={resolvedParams.photoId}
        urlPrefix={`/album/${resolvedParams.id}/`}
        editControls={isUser}
        windowFullScreen={uxConfig.windowFullScreen}
        onUpdatePhoto={handleUpdatePhoto}
        onDeletePhoto={handleDeletePhoto}
      />
    </>
  );
}