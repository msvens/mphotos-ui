import { PhotoMetadata } from '@/lib/api/types';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { photosService } from '@/lib/api/services';
import { ArrowsPointingInIcon, ArrowsPointingOutIcon, FaceSmileIcon, BookOpenIcon, ArchiveBoxIcon, PencilIcon, TrashIcon, ArrowPathRoundedSquareIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { IconButton } from '@/components/IconButton';
import { PhotoEditDialog } from '@/components/photo/PhotoEditDialog';
import { useMPContext } from '@/context/MPContext';
import { useToast } from '@/context/ToastContext';

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
  windowFullScreen?: boolean;
  onClearSearchQuery?: (photoId: string) => void;
  onUpdatePhoto?: (p: PhotoMetadata) => void;
  onDeletePhoto?: (p: PhotoMetadata) => void;
}

const IMAGE_CLASSES = "w-auto h-auto max-h-[calc(100vh-150px)] object-contain transition-all duration-300";

export function PhotoDeck({
  photos,
  startPhotoId,
  urlPrefix,
  searchQuery,
  editControls = false,
  windowFullScreen,
  onUpdatePhoto,
}: PhotoDeckProps) {
  const router = useRouter();
  const { uxConfig } = useMPContext();
  const toast = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [nextImageId, setNextImageId] = useState<string | null>(null);
  const [isInPhotostream, setIsInPhotostream] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

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

  const handleFullscreen = () => {
    if (windowFullScreen) {
      // Use browser fullscreen API
      try {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().then(() => {
          }).catch(() => {
            // Fallback to local fullscreen if browser fullscreen fails
            setShowFullscreen(true);
          });
        } else {
          document.exitFullscreen().then(() => {
          }).catch(() => {
          });
        }
      } catch {
        // Fallback to local fullscreen
        setShowFullscreen(!showFullscreen);
      }
    } else {
      // Use local fullscreen mode
      setShowFullscreen(!showFullscreen);
    }
  };

  // Listen for fullscreen changes when using browser fullscreen API
  useEffect(() => {
    if (!windowFullScreen) return;

    const handleFullscreenChange = () => {
      setShowFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [windowFullScreen]);

  // Check if current photo is in photostream album
  useEffect(() => {
    if (!currentPhoto || !uxConfig.photoStreamAlbumId) return;

    const checkPhotostream = async () => {
      try {
        const photoAlbums = await photosService.getPhotoAlbums(currentPhoto.id);
        const inPhotostream = photoAlbums.some(album => album.id === uxConfig.photoStreamAlbumId);
        setIsInPhotostream(inPhotostream);
      } catch (error) {
        console.error('Error checking photostream:', error);
        setIsInPhotostream(false);
      }
    };

    checkPhotostream();
  }, [currentPhoto, uxConfig.photoStreamAlbumId]);

  const handlePhotostreamToggle = async () => {
    if (!currentPhoto || !uxConfig.photoStreamAlbumId) {
      toast.error('Photostream album not configured');
      return;
    }

    try {
      // Get current albums
      const photoAlbums = await photosService.getPhotoAlbums(currentPhoto.id);
      const albumIds = photoAlbums.map(a => a.id);

      let newAlbumIds: string[];
      if (isInPhotostream) {
        // Remove from photostream
        newAlbumIds = albumIds.filter(id => id !== uxConfig.photoStreamAlbumId);
        toast.success('Removed from photostream');
      } else {
        // Add to photostream
        newAlbumIds = [...albumIds, uxConfig.photoStreamAlbumId];
        toast.success('Added to photostream');
      }

      // Update photo albums
      await photosService.setPhotoAlbums(currentPhoto.id, newAlbumIds);
      setIsInPhotostream(!isInPhotostream);
    } catch (error) {
      console.error('Error toggling photostream:', error);
      toast.error('Failed to update photostream');
    }
  };

  const handleProfilePic = () => {
    alert('Set as profile picture');
  };

  const handleEdit = () => {
    setShowEditDialog(true);
  };

  const handleEditClose = (updatedPhoto?: PhotoMetadata) => {
    setShowEditDialog(false);
    if (updatedPhoto && onUpdatePhoto) {
      onUpdatePhoto(updatedPhoto);
    }
  };

  const handleDelete = () => {
    alert('Delete photo');
  };

  if (!currentPhoto) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-gray-400">No photos available</div>
      </div>
    );
  }

  // Fullscreen mode - photo takes up entire browser window (not system fullscreen)
  if (showFullscreen) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        {/* Navigation Controls - Fullscreen Mode */}
        <div className="fixed left-4 top-1/2 -translate-y-1/2 z-10">
          <IconButton
            icon={ChevronLeftIcon}
            onClick={() => {
              const newIndex = currentIndex - 1;
              if (newIndex >= 0) {
                setCurrentIndex(newIndex);
              }
            }}
            disabled={currentIndex === 0}
            size="nav"
          />
        </div>
        <div className="fixed right-4 top-1/2 -translate-y-1/2 z-10">
          <IconButton
            icon={ChevronRightIcon}
            onClick={() => {
              const newIndex = currentIndex + 1;
              if (newIndex < photos.length) {
                setCurrentIndex(newIndex);
              }
            }}
            disabled={currentIndex === photos.length - 1}
            size="nav"
          />
        </div>

        {/* Fullscreen Toggle - Fullscreen Mode */}
        <div className="fixed right-4 top-4 z-10">
          <IconButton
            icon={ArrowsPointingInIcon}
            onClick={handleFullscreen}
            title="Exit fullscreen"
          />
        </div>

        {/* Photo Display - Fullscreen Mode */}
        <div 
          className="w-full h-full flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            key={`fullscreen-${currentPhoto.id}`}
            src={photosService.getPhotoUrl(currentPhoto.id)}
            alt={currentPhoto.title || currentPhoto.fileName}
            className="max-w-full max-h-full w-auto h-auto object-contain"
            style={{ opacity: 1 }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-48px)]">
      {/* Navigation Controls */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-10">
        <IconButton
          icon={ChevronLeftIcon}
          onClick={() => navigateToPhoto(currentIndex - 1)}
          disabled={currentIndex === 0}
          size="nav"
        />
      </div>
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-10">
        <IconButton
          icon={ChevronRightIcon}
          onClick={() => navigateToPhoto(currentIndex + 1)}
          disabled={currentIndex === photos.length - 1}
          size="nav"
        />
      </div>

      {/* Edit Controls */}
      {editControls && (
        <div className="fixed left-4 top-20 flex flex-col gap-2">
          <IconButton
            icon={FaceSmileIcon}
            onClick={handleProfilePic}
            title="Set as profile picture"
            tooltipPlacement="bottom-right"
          />
          <IconButton
            icon={isInPhotostream ? BookOpenIcon : ArchiveBoxIcon}
            onClick={handlePhotostreamToggle}
            title={isInPhotostream ? "Remove from photostream" : "Add to photostream"}
            tooltipPlacement="bottom-right"
          />
          <IconButton
            icon={PencilIcon}
            onClick={handleEdit}
            title="Edit photo metadata"
            tooltipPlacement="bottom-right"
          />
          <IconButton
            icon={ArrowPathRoundedSquareIcon}
            onClick={() => alert('Crop/Rotate photo')}
            title="Crop/rotate photo"
            tooltipPlacement="bottom-right"
          />
          <IconButton
            icon={TrashIcon}
            onClick={handleDelete}
            title="Delete photo"
            tooltipPlacement="bottom-right"
          />
        </div>
      )}

      {/* Fullscreen Control */}
      <div className="fixed right-4 top-20 z-10">
        <IconButton
          icon={windowFullScreen ? (showFullscreen ? ArrowsPointingInIcon : ArrowsPointingOutIcon) : ArrowsPointingOutIcon}
          onClick={handleFullscreen}
          title={windowFullScreen ? (showFullscreen ? "Exit fullscreen" : "Enter fullscreen") : "Enter fullscreen"}
          tooltipPlacement="bottom-left"
        />
      </div>

      {/* Photo Display */}
      <div 
        className="flex items-center justify-center px-16 pt-8 pb-2"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full flex items-center justify-center">
          <img
            key={`current-${currentPhoto.id}`}
            src={photosService.getPhotoUrl(currentPhoto.id)}
            alt={currentPhoto.title || currentPhoto.fileName}
            className={IMAGE_CLASSES}
            style={{ opacity: 1 }}
          />

          {nextImageId && (
            <img
              key={`next-${nextImageId}`}
              src={photosService.getPhotoUrl(nextImageId)}
              alt=""
              className={IMAGE_CLASSES}
              style={{ opacity: 0 }}
              onLoad={handleNextImageLoad}
            />
          )}
        </div>
      </div>

      {/* Photo Info Section */}
      <div className="w-full px-16 mt-2 mb-auto">
        <div className="max-w-4xl mx-auto">
          {/* Photo Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column - Social Features */}
            <div className="space-y-4">
              {/* Like Section */}
              <div className="flex items-center space-x-3">
                <div className="cursor-pointer hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white hover:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="text-sm text-white">be the first one to like this</span>
              </div>

              {/* Comment Section */}
              <div className="relative">
                <input 
                  type="text"
                  className="w-full px-3 py-2 pr-20 border border-gray-300 rounded bg-transparent focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm text-white placeholder-gray-400"
                  placeholder="Share your thoughts..."
                />
                <button className="absolute right-1 top-1 px-3 py-1 text-white hover:text-gray-200 transition-colors">
                  POST
                </button>
              </div>
            </div>

            {/* Right Column - Photo Details */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">Sunset at Golden Gate Bridge</h3>
              <div className="text-sm text-white space-y-1">
                <div>Canon EOS R5</div>
                <div>RF 24-70mm f/2.8L IS USM</div>
                <div>35mm • f/8 • ISO 100 • 1/125s</div>
                <div>March 15, 2024</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Photo Dialog */}
      {editControls && (
        <PhotoEditDialog
          open={showEditDialog}
          photo={currentPhoto}
          onClose={handleEditClose}
        />
      )}
    </div>
  );
}
