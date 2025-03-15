'use client';

import { useMPContext } from '@/context/MPContext';
import { useEffect, useState } from 'react';
import { photosService } from '@/lib/api/services';
import { PhotoMetadata } from '@/lib/api/types';
import { PhotoGrid } from '@/components/PhotoGrid';
import { Bio } from '@/components/Bio';
import { Switch } from '@/components/Switch';
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';
import { Section } from '@/components/Section';

export default function Home() {
  const { isUser, uxConfig, isLoading } = useMPContext();
  const [photos, setPhotos] = useState<PhotoMetadata[]>([]);
  const [photostreamPhotos, setPhotostreamPhotos] = useState<PhotoMetadata[]>([]);
  const [showPhotostream, setShowPhotostream] = useState(false);

  useEffect(() => {
    async function fetchPhotos() {
      if (isLoading) return;
      
      try {
        // Always fetch photostream photos for dimming logic
        if (uxConfig.photoStreamAlbumId) {
          const streamPhotos = await photosService.getAlbumPhotos(uxConfig.photoStreamAlbumId);
          setPhotostreamPhotos(streamPhotos);
        }

        if (isUser && !showPhotostream) {
          // Show all photos for logged-in user when not in photostream mode
          const allPhotos = await photosService.getPhotos();
          setPhotos(allPhotos);
        } else if (uxConfig.photoStreamAlbumId) {
          // Show photostream photos
          setPhotos(photostreamPhotos);
        }
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    }

    fetchPhotos();
  }, [isLoading, uxConfig.photoStreamAlbumId, isUser, showPhotostream]);

  // Create a Set of photostream photo IDs for efficient lookup
  const photostreamPhotoIds = new Set(photostreamPhotos.map(p => p.id));

  const handleIconClick = async (photo: PhotoMetadata) => {
    const isInPhotostream = photostreamPhotoIds.has(photo.id);
    alert(isInPhotostream ? 'Unlocked' : 'Locked');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-[1024px] mx-auto">
      {uxConfig.showBio && (
        <Section showDivider>
          <Bio />
        </Section>
      )}
      
      {isUser && (
        <Section>
          <div className="flex justify-center">
            <Switch
              checked={showPhotostream}
              onChange={setShowPhotostream}
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
            // Only dim photos when viewing all photos (not in photostream mode)
            // and when the photo is not in the photostream
            return !showPhotostream && isUser && !photostreamPhotoIds.has(photo.id);
          }}
          renderBottomIcon={isUser ? (photo) => {
            const isInPhotostream = photostreamPhotoIds.has(photo.id);
            return isInPhotostream ? (
              <LockOpenIcon className="w-6 h-6 text-white" />
            ) : (
              <LockClosedIcon className="w-6 h-6 text-white" />
            );
          } : undefined}
          onBottomIconClick={handleIconClick}
        />
      </Section>
    </div>
  );
}
