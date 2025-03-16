import { PhotoMetadata } from '@/lib/api/types';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { photosService } from '@/lib/api/services';

interface TouchState {
  xStart: number;
  xPos: number;
  yStart: number;
  yPos: number;
}

interface PhotoDeckProps {
  photos: PhotoMetadata[];
  startPhotoId?: string;
  urlPrefix: string;
  searchQuery?: string;
  editControls?: boolean;
  onClearSearchQuery?: (photoId: string) => void;
  onUpdatePhoto?: (p: PhotoMetadata) => void;
  onDeletePhoto?: (p: PhotoMetadata) => void;
}

const NAV_BUTTON_CLASSES = "w-12 h-12 flex items-center justify-center text-6xl font-bold \
  bg-transparent text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed \
  active:bg-white/20 active:scale-90 transition-all duration-150";

const IMAGE_CLASSES = "max-h-[80vh] w-auto object-contain absolute transition-opacity duration-300";

export function PhotoDeck({
  photos,
  startPhotoId,
  urlPrefix,
  searchQuery,
  editControls = false,
  onClearSearchQuery,
  onUpdatePhoto,
  onDeletePhoto,
}: PhotoDeckProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [nextImageId, setNextImageId] = useState<string | null>(null);

  const touch: TouchState = { xStart: -1, xPos: -1, yStart: -1, yPos: -1 };

  useEffect(() => {
    if (startPhotoId && photos.length > 0) {
      const index = photos.findIndex(photo => photo.id === startPhotoId);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [startPhotoId, photos]);

  const currentPhoto = photos[currentIndex];

  const navigateToPhoto = (index: number) => {
    if (index >= 0 && index < photos.length) {
      const newPhoto = photos[index];
      setNextImageId(newPhoto.id);
      router.push(`${urlPrefix}${newPhoto.id}${searchQuery || ''}`);
    }
  };

  const handleNextImageLoad = () => {
    if (nextImageId) {
      const index = photos.findIndex(photo => photo.id === nextImageId);
      if (index !== -1) {
        setCurrentIndex(index);
        setNextImageId(null);
      }
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (showFullscreen || event.touches.length > 1) return;
    const { clientX, clientY } = event.touches[0];
    touch.xStart = touch.xPos = clientX;
    touch.yStart = touch.yPos = clientY;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (showFullscreen || event.touches.length > 1) return;
    touch.xPos = event.touches[0].clientX;
    touch.yPos = event.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (showFullscreen) return;

    const deltaX = touch.xStart - touch.xPos;
    const deltaY = touch.yStart - touch.yPos;
    
    touch.xStart = touch.yStart = touch.xPos = touch.yPos = -1;

    if (Math.abs(deltaX) > 30 && Math.abs(deltaY) < 40) {
      navigateToPhoto(currentIndex + (deltaX < 0 ? -1 : 1));
    }
  };

  if (!currentPhoto) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-gray-400">No photos available</div>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full flex items-center justify-center min-h-[80vh]">
        <div className="fixed left-4 top-1/2 -translate-y-1/2 z-10">
          <button
            onClick={() => navigateToPhoto(currentIndex - 1)}
            disabled={currentIndex === 0}
            className={NAV_BUTTON_CLASSES}
            style={{ lineHeight: '1' }}
          >
            ‹
          </button>
        </div>
        <div className="fixed right-4 top-1/2 -translate-y-1/2 z-10">
          <button
            onClick={() => navigateToPhoto(currentIndex + 1)}
            disabled={currentIndex === photos.length - 1}
            className={NAV_BUTTON_CLASSES}
            style={{ lineHeight: '1' }}
          >
            ›
          </button>
        </div>

        <div 
          className="w-full px-24 flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              key={`current-${currentPhoto.id}`}
              src={photosService.getPhotoUrl(currentPhoto.id)}
              alt={currentPhoto.title || currentPhoto.fileName}
              className={IMAGE_CLASSES}
              style={{ opacity: 1, zIndex: 1 }}
            />
            
            {nextImageId && (
              <img
                key={`next-${nextImageId}`}
                src={photosService.getPhotoUrl(nextImageId)}
                alt=""
                className={IMAGE_CLASSES}
                style={{ opacity: 0, zIndex: 0 }}
                onLoad={handleNextImageLoad}
              />
            )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl px-4 mt-4">
        <h2 className="text-xl font-light">{currentPhoto.title || currentPhoto.fileName}</h2>
        {currentPhoto.description && (
          <p className="text-gray-500 mt-2">{currentPhoto.description}</p>
        )}
      </div>
    </>
  );
} 