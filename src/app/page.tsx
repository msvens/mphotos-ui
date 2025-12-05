'use client';

import { useMPContext } from '@/context/MPContext';
import { useEffect, useState } from 'react';
import { photosService, albumsService } from '@/lib/api/services';
import { PhotoMetadata } from '@/lib/api/types';
import { PhotoGrid } from '@/components/PhotoGrid';
import { Bio } from '@/components/Bio';
import { Switch } from '@/components/Switch';
import { BookOpenIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';
import { Section } from '@/components/Section';
import { PageSpacing } from '@/components/layout/PageSpacing';

export default function Home() {
  const { isUser, uxConfig, isLoading } = useMPContext();
  const [photos, setPhotos] = useState<PhotoMetadata[]>([]);
  const [photostreamPhotos, setPhotostreamPhotos] = useState<PhotoMetadata[]>([]);
  const [showPhotostream, setShowPhotostream] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchPhotos() {
      if (isLoading) return;

      try {
        if (uxConfig.photoStreamAlbumId) {
          // Fetch photostream photos
          const streamPhotoList = await albumsService.getAlbumPhotos(uxConfig.photoStreamAlbumId);
          setPhotostreamPhotos(streamPhotoList.photos);

          // Default view: show photostream
          setPhotos(streamPhotoList.photos);
        } else {
          // Fallback to all photos if no photostream album is configured
          const allPhotoList = await photosService.getPhotos();
          setPhotos(allPhotoList.photos);
        }
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    }

    fetchPhotos();
  }, [isLoading, uxConfig.photoStreamAlbumId]);

  // Fetch all photos when admin toggles to show all
  useEffect(() => {
    async function loadAllPhotos() {
      if (isUser && !showPhotostream && uxConfig.photoStreamAlbumId) {
        try {
          const photoList = await photosService.getPhotos();
          setPhotos(photoList.photos);
        } catch (error) {
          console.error('Error fetching all photos:', error);
          setPhotos(photostreamPhotos || []);
        }
      } else if (showPhotostream) {
        // When switching back to photostream
        setPhotos(photostreamPhotos || []);
      }
    }

    loadAllPhotos();
  }, [isUser, showPhotostream, uxConfig.photoStreamAlbumId, photostreamPhotos]);

  // Create a Set of photostream photo IDs for efficient lookup
  const photostreamPhotoIds = new Set((photostreamPhotos || []).map(p => p.id));

  const handleIconClick = async (photo: PhotoMetadata) => {
    if (!uxConfig.photoStreamAlbumId) {
      console.error('Photostream album not configured');
      return;
    }

    const isInPhotostream = photostreamPhotoIds.has(photo.id);

    try {
      // Get current albums for this photo
      const photoAlbums = await photosService.getPhotoAlbums(photo.id);
      const albumIds = photoAlbums.map(a => a.id);

      let newAlbumIds: string[];
      if (isInPhotostream) {
        // Remove from photostream
        newAlbumIds = albumIds.filter(id => id !== uxConfig.photoStreamAlbumId);
      } else {
        // Add to photostream
        newAlbumIds = [...albumIds, uxConfig.photoStreamAlbumId];
      }

      // Update photo albums
      await photosService.setPhotoAlbums(photo.id, newAlbumIds);

      // Update local state
      if (isInPhotostream) {
        // Remove from photostream list
        setPhotostreamPhotos(prev => prev.filter(p => p.id !== photo.id));
      } else {
        // Add to photostream list
        setPhotostreamPhotos(prev => [...prev, photo]);
      }
    } catch (error) {
      console.error('Error toggling photostream:', error);
    }
  };

  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <>
      <PageSpacing />
      <div className="max-w-[1024px] mx-auto">
        {uxConfig.showBio && (
          <Section showDivider>
            <Bio />
          </Section>
        )}

        {isUser && uxConfig.photoStreamAlbumId && (
          <Section>
            <div className="flex justify-center">
              <Switch
                checked={showPhotostream}
                onChange={(checked) => setShowPhotostream(checked)}
                label="Show Photostream"
              />
            </div>
          </Section>
        )}

        <Section>
          <PhotoGrid
            photos={photos}
            columns={uxConfig.photoGridCols}
            spacing={uxConfig.photoGridSpacing}
            linkTo="/photo"
            dimPhoto={(photo) => {
              // Only dim photos for admin users when viewing all photos
              // and when the photo is not in the photostream
              return isUser && !showPhotostream && !photostreamPhotoIds.has(photo.id);
            }}
            renderBottomIcon={isUser ? (photo) => {
              // Admin-only: Show photostream icons
              const isInPhotostream = photostreamPhotoIds.has(photo.id);
              return isInPhotostream ? (
                <BookOpenIcon className="w-6 h-6 text-white" />
              ) : (
                <ArchiveBoxIcon className="w-6 h-6 text-white" />
              );
            } : undefined}
            onBottomIconClick={handleIconClick}
          />
        </Section>
      </div>
    </>
  );
}