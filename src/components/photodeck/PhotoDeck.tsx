import { PhotoMetadata } from '@/lib/api/types';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { photosService, userService } from '@/lib/api/services';
import { ArrowsPointingInIcon, ArrowsPointingOutIcon, FaceSmileIcon, BookOpenIcon, ArchiveBoxIcon, PencilIcon, TrashIcon, ArrowPathRoundedSquareIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { IconButton } from '@/components/IconButton';
import { PhotoEditDialog } from '@/components/photo/PhotoEditDialog';
import { Dialog } from '@/components/Dialog';
import { useMPContext } from '@/context/MPContext';
import { useToast } from '@/context/ToastContext';
import { colorScheme, alpha } from '@/lib/colors';
import { modelToId } from '@/lib/utils';
import { PhotoLikes } from './PhotoLikes';
import { PhotoComments } from './PhotoComments';

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

const IMAGE_CLASSES = "w-auto h-auto max-h-[calc(100vh-200px)] object-contain transition-all duration-300";

export function PhotoDeck({
  photos,
  startPhotoId,
  urlPrefix,
  searchQuery,
  editControls = false,
  windowFullScreen,
  onUpdatePhoto,
  onDeletePhoto,
}: PhotoDeckProps) {
  const router = useRouter();
  const { uxConfig, refreshAuth } = useMPContext();
  const toast = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [nextImageId, setNextImageId] = useState<string | null>(null);
  const [isInPhotostream, setIsInPhotostream] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  const handleProfilePic = async () => {
    if (!currentPhoto) return;

    try {
      const thumbUrl = photosService.getPhotoThumbUrl(currentPhoto.id);
      await userService.updateUserPic(thumbUrl);
      await refreshAuth();
      toast.success('Profile picture updated');
    } catch (error) {
      console.error('Error setting profile picture:', error);
      toast.error('Failed to update profile picture');
    }
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

  const handleCropRotate = () => {
    if (!currentPhoto) return;
    // Navigate to crop page
    router.push(`${urlPrefix}${currentPhoto.id}/crop${searchQuery || ''}`);
  };

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!currentPhoto) return;

    try {
      await photosService.deletePhoto(currentPhoto.id, true);
      toast.success('Photo deleted');

      // Call parent callback if provided
      if (onDeletePhoto) {
        onDeletePhoto(currentPhoto);
      }

      // Navigate to next or previous photo, staying in the same area
      if (photos.length > 1) {
        // Try next photo first, fall back to previous
        const newIndex = currentIndex < photos.length - 1 ? currentIndex + 1 : currentIndex - 1;
        const targetPhoto = photos[newIndex];

        // Navigate to the target photo and refresh to get updated data
        router.push(`${urlPrefix}${targetPhoto.id}${searchQuery || ''}`);
        router.refresh(); // Force Next.js to refetch server data
      } else {
        // Last photo in the list, go back to photo list
        router.push(urlPrefix);
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Failed to delete photo');
    }
  };

  if (!currentPhoto) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-gray-400">No photos available</div>
      </div>
    );
  }

  // Get color scheme for photo background
  const cs = colorScheme(uxConfig.photoBackgroundColor);

  // Fullscreen mode - photo takes up entire browser window (not system fullscreen)
  if (showFullscreen) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ backgroundColor: cs.backgroundColor }}
      >
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
            className="text-white"
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
            className="text-white"
          />
        </div>

        {/* Fullscreen Toggle - Fullscreen Mode */}
        <div className="fixed right-4 top-4 z-10">
          <IconButton
            icon={ArrowsPointingInIcon}
            onClick={handleFullscreen}
            title="Exit fullscreen"
            className="text-white"
          />
        </div>

        {/* Photo Display - Fullscreen Mode */}
        <div
          className="w-full h-full flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
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

  // Determine padding based on photo borders setting
  const photoBorders = uxConfig.photoBorders;
  const getPadding = () => {
    switch (photoBorders) {
      case 'none':
        return { paddingLeft: '0', paddingRight: '0', paddingTop: '0', paddingBottom: '0' };
      case 'left-right':
        return { paddingLeft: '5rem', paddingRight: '5rem', paddingTop: '0', paddingBottom: '0' };
      case 'all':
        return { paddingLeft: '5rem', paddingRight: '5rem', paddingTop: '2rem', paddingBottom: '2rem' };
      default:
        return { paddingLeft: '5rem', paddingRight: '5rem', paddingTop: '0', paddingBottom: '0' };
    }
  };

  const padding = getPadding();
  const hasVerticalControls = photoBorders !== 'none';

  return (
    <div className="flex flex-col min-h-[calc(100vh-48px)]">
      {/* Photo Display with Background Color - Full Width */}
      <div
        className="relative flex items-center justify-center"
        style={{
          backgroundColor: cs.backgroundColor,
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          ...padding,
          minHeight: 'calc(100vh - 200px)',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Navigation Controls */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2">
          <IconButton
            icon={ChevronLeftIcon}
            onClick={() => navigateToPhoto(currentIndex - 1)}
            disabled={currentIndex === 0}
            size="nav"
            background={alpha(cs.backgroundColor, 0.5)}
            className={cs.color === '#ffffff' ? 'text-white' : 'text-gray-900'}
          />
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2">
          <IconButton
            icon={ChevronRightIcon}
            onClick={() => navigateToPhoto(currentIndex + 1)}
            disabled={currentIndex === photos.length - 1}
            size="nav"
            background={alpha(cs.backgroundColor, 0.5)}
            className={cs.color === '#ffffff' ? 'text-white' : 'text-gray-900'}
          />
        </div>

        {/* Edit Controls */}
        {editControls && (
          <div
            className={`absolute ${hasVerticalControls ? 'left-4 top-4 flex-col' : 'left-4 top-4 flex-row'} flex gap-2 p-2 z-10`}
          >
            <IconButton
              icon={FaceSmileIcon}
              onClick={handleProfilePic}
              title="Set as profile picture"
              tooltipPlacement={hasVerticalControls ? "bottom-right" : "bottom"}
              background={alpha(cs.backgroundColor, 0.5)}
              className={cs.color === '#ffffff' ? 'text-white' : 'text-gray-900'}
            />
            <IconButton
              icon={isInPhotostream ? BookOpenIcon : ArchiveBoxIcon}
              onClick={handlePhotostreamToggle}
              title={isInPhotostream ? "Remove from photostream" : "Add to photostream"}
              tooltipPlacement={hasVerticalControls ? "bottom-right" : "bottom"}
              background={alpha(cs.backgroundColor, 0.5)}
              className={cs.color === '#ffffff' ? 'text-white' : 'text-gray-900'}
            />
            <IconButton
              icon={PencilIcon}
              onClick={handleEdit}
              title="Edit photo metadata"
              tooltipPlacement={hasVerticalControls ? "bottom-right" : "bottom"}
              background={alpha(cs.backgroundColor, 0.5)}
              className={cs.color === '#ffffff' ? 'text-white' : 'text-gray-900'}
            />
            <IconButton
              icon={ArrowPathRoundedSquareIcon}
              onClick={handleCropRotate}
              title="Crop/rotate photo"
              tooltipPlacement={hasVerticalControls ? "bottom-right" : "bottom"}
              background={alpha(cs.backgroundColor, 0.5)}
              className={cs.color === '#ffffff' ? 'text-white' : 'text-gray-900'}
            />
            <IconButton
              icon={TrashIcon}
              onClick={handleDelete}
              title="Delete photo"
              tooltipPlacement={hasVerticalControls ? "bottom-right" : "bottom"}
              background={alpha(cs.backgroundColor, 0.5)}
              className={cs.color === '#ffffff' ? 'text-white' : 'text-gray-900'}
            />
          </div>
        )}

        {/* Fullscreen Control */}
        <div className="absolute right-4 top-4 z-10 p-2">
          <IconButton
            icon={windowFullScreen ? (showFullscreen ? ArrowsPointingInIcon : ArrowsPointingOutIcon) : ArrowsPointingOutIcon}
            onClick={handleFullscreen}
            title={windowFullScreen ? (showFullscreen ? "Exit fullscreen" : "Enter fullscreen") : "Enter fullscreen"}
            tooltipPlacement="bottom-left"
            background={alpha(cs.backgroundColor, 0.5)}
            className={cs.color === '#ffffff' ? 'text-white' : 'text-gray-900'}
          />
        </div>
        <div className="relative w-full flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={`current-${currentPhoto.id}`}
            src={photosService.getPhotoUrl(currentPhoto.id)}
            alt={currentPhoto.title || currentPhoto.fileName}
            className={IMAGE_CLASSES}
            style={{ opacity: 1 }}
          />

          {nextImageId && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={`next-${nextImageId}`}
                src={photosService.getPhotoUrl(nextImageId)}
                alt=""
                className={IMAGE_CLASSES}
                style={{ opacity: 0 }}
                onLoad={handleNextImageLoad}
              />
            </>
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
              <PhotoLikes photoId={currentPhoto.id} />

              {/* Comment Section */}
              <PhotoComments photoId={currentPhoto.id} />
            </div>

            {/* Right Column - Photo Details */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                {currentPhoto.title || 'Untitled'}
              </h3>
              <div className="text-sm text-gray-900 dark:text-white space-y-1">
                {/* Date */}
                {currentPhoto.originalDate && (
                  <div>Taken on {new Date(currentPhoto.originalDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}.</div>
                )}

                {/* Camera */}
                {currentPhoto.cameraModel && (
                  <div>
                    Camera: <Link
                      href={`/camera/${modelToId(currentPhoto.cameraModel)}`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {currentPhoto.cameraModel}
                    </Link>
                  </div>
                )}

                {/* Lens */}
                {currentPhoto.lensModel && (
                  <div>Lens: {currentPhoto.lensModel}</div>
                )}

                {/* Settings/Exposure Info */}
                {(currentPhoto.fNumber || currentPhoto.iso || currentPhoto.exposure) && (
                  <div>
                    Settings: {[
                      currentPhoto.fNumber && `f${currentPhoto.fNumber}`,
                      currentPhoto.iso && `iso${currentPhoto.iso}`,
                      currentPhoto.exposure && currentPhoto.exposure
                    ].filter(Boolean).join(', ')}.
                  </div>
                )}
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

      {/* Delete Confirmation Dialog */}
      {editControls && (
        <Dialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onOk={handleDeleteConfirm}
          title="Delete Photo?"
          text="By removing the photo all associated image data will be deleted"
          okText="DELETE"
          closeText="CANCEL"
        />
      )}
    </div>
  );
}
