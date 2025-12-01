'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import { useSearchParams } from 'next/navigation';
import { Album, PhotoMetadata } from '@/lib/api/types';
import { albumsService, photosService } from '@/lib/api/services';
import { useMPContext } from '@/context/MPContext';
import { PhotoGrid } from '@/components/PhotoGrid';
import { PageSpacing } from '@/components/layout/PageSpacing';
import { Section } from '@/components/Section';
import { ChevronLeftIcon, ChevronRightIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface AlbumPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AlbumPage({ params }: AlbumPageProps) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const code = searchParams.get('code') || '';

  const { isUser, uxConfig } = useMPContext();
  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<PhotoMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [orderUpdated, setOrderUpdated] = useState(false);

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

  const movePhoto = (index: number, up: boolean) => {
    if (photos.length < 2) return;

    const newPhotos = [...photos];
    if (up && index === 0) {
      // Move first to end
      const first = newPhotos.shift()!;
      newPhotos.push(first);
    } else if (!up && index === photos.length - 1) {
      // Move last to start
      const last = newPhotos.pop()!;
      newPhotos.unshift(last);
    } else {
      // Swap with neighbor
      const swapIdx = up ? index - 1 : index + 1;
      const temp = newPhotos[swapIdx];
      newPhotos[swapIdx] = newPhotos[index];
      newPhotos[index] = temp;
    }

    setPhotos(newPhotos);
    setOrderUpdated(true);
  };

  const handleSaveOrdering = async () => {
    if (!album) return;

    try {
      await albumsService.updateAlbumOrder(album, { length: photos.length, photos });
      // Refresh photos to get server state
      const photosData = await albumsService.getAlbumPhotos(resolvedParams.id, code || undefined);
      setPhotos(photosData.photos);
      setOrderUpdated(false);
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Failed to save ordering');
    }
  };

  const handleSetCover = async (photo: PhotoMetadata) => {
    if (!album) return;

    try {
      const coverPic = photosService.getLandscapeUrl(photo.fileName);
      const updatedAlbum = await albumsService.updateAlbum({
        ...album,
        coverPic,
      });
      setAlbum(updatedAlbum);
    } catch (error) {
      console.error('Error setting cover:', error);
    }
  };

  if (isLoading) {
    return (
      <>
        <PageSpacing />
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-gray-400">Loading album...</div>
        </div>
      </>
    );
  }

  if (!album) {
    return (
      <>
        <PageSpacing />
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-gray-400">Album not found</div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageSpacing />
      <div className="max-w-[1024px] mx-auto">
        {/* Album Header */}
        <Section>
          <h1 className="text-2xl font-light text-gray-900 dark:text-white">{album.name}</h1>
          {isUser && photos.length > 1 && (
            <button
              onClick={handleSaveOrdering}
              disabled={!orderUpdated}
              className={`mt-2 px-3 py-1 text-sm border border-gray-500 rounded
                ${orderUpdated
                  ? 'text-white hover:bg-gray-700 cursor-pointer'
                  : 'text-gray-500 cursor-not-allowed'
                }`}
            >
              Save Ordering
            </button>
          )}
        </Section>

        {/* Photo Grid */}
        <Section>
          {photos.length === 0 ? (
            <p className="text-gray-400">Add photos to this album</p>
          ) : (
            <PhotoGrid
              photos={photos}
              columns={uxConfig.photoGridCols}
              spacing={uxConfig.photoGridSpacing}
              linkTo={`/album/${resolvedParams.id}`}
              renderBottomIcon={isUser ? (photo) => {
                const index = photos.findIndex(p => p.id === photo.id);
                const isCover = album.coverPic === photosService.getLandscapeUrl(photo.fileName);

                return (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        movePhoto(index, true);
                      }}
                      className="p-1 hover:bg-white/20 rounded"
                      title="Move left"
                    >
                      <ChevronLeftIcon className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        movePhoto(index, false);
                      }}
                      className="p-1 hover:bg-white/20 rounded"
                      title="Move right"
                    >
                      <ChevronRightIcon className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSetCover(photo);
                      }}
                      className="p-1 hover:bg-white/20 rounded"
                      title="Set as album cover"
                    >
                      <PhotoIcon className={`w-5 h-5 ${isCover ? 'text-blue-400' : 'text-white'}`} />
                    </button>
                  </div>
                );
              } : undefined}
            />
          )}
        </Section>
      </div>
    </>
  );
}