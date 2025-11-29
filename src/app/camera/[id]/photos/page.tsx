'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { camerasService, photosService, albumsService } from '@/lib/api/services';
import { Camera, PhotoMetadata } from '@/lib/api/types';
import { PhotoGrid } from '@/components/PhotoGrid';
import { PageSpacing } from '@/components/layout/PageSpacing';
import { useMPContext } from '@/context/MPContext';

export default function CameraPhotosPage() {
  const params = useParams();
  const cameraId = params.id as string;
  const { uxConfig, isUser } = useMPContext();

  const [camera, setCamera] = useState<Camera | null>(null);
  const [photos, setPhotos] = useState<PhotoMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all cameras and find the one with matching ID
        const cameras = await camerasService.getCameras();
        const cam = cameras.find(c => c.id === cameraId);

        if (!cam) {
          setLoading(false);
          return;
        }

        setCamera(cam);

        // Fetch ALL photos (client-side filtering)
        let photoList;
        if (isUser) {
          // Admin: fetch all photos
          photoList = await photosService.getPhotos();
        } else if (uxConfig.photoStreamAlbumId) {
          // Guest: fetch only photostream album photos
          photoList = await albumsService.getAlbumPhotos(uxConfig.photoStreamAlbumId);
        } else {
          // No photos available for guest without photostream
          setPhotos([]);
          setLoading(false);
          return;
        }

        // Client-side filter by camera model
        const filtered = photoList.photos.filter(p => p.cameraModel === cam.model);
        setPhotos(filtered);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching camera photos:', error);
        setLoading(false);
      }
    }

    fetchData();
  }, [cameraId, isUser, uxConfig.photoStreamAlbumId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!camera) {
    return (
      <>
        <PageSpacing />
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Camera not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageSpacing />
      <div className="max-w-[1024px] mx-auto">
        {/* Photo Grid */}
        {photos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No photos found for this camera</p>
          </div>
        ) : (
          <PhotoGrid
            photos={photos}
            columns={uxConfig.photoGridCols}
            spacing={uxConfig.photoGridSpacing}
            linkTo="/photo"
          />
        )}
      </div>
    </>
  );
}
