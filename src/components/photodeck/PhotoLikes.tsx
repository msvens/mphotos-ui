'use client';

import { useEffect, useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { guestsService } from '@/lib/api/services';
import { GuestReaction } from '@/lib/api/types';
import { useMPContext } from '@/context/MPContext';
import { RegisterGuestDialog } from '@/components/guest/RegisterGuestDialog';

interface PhotoLikesProps {
  photoId: string;
}

function getLikesText(likesPhoto: boolean, guests: GuestReaction[]): string {
  if (guests.length === 0) {
    return "Be the first to like this picture";
  }

  if (likesPhoto) {
    switch (guests.length) {
      case 1:
        return "Liked by you";
      case 2:
        return `liked by you and ${guests.length - 1} other`;
      default:
        return `liked by you and ${guests.length - 1} others`;
    }
  } else {
    switch (guests.length) {
      case 1:
        return `Liked by ${guests[0].name}`;
      case 2:
        return `liked by ${guests[0].name} and ${guests.length - 1} other`;
      default:
        return `liked by ${guests[0].name} and ${guests.length - 1} others`;
    }
  }
}

export function PhotoLikes({ photoId }: PhotoLikesProps) {
  const { isGuest, refreshGuest } = useMPContext();
  const [likesPhoto, setLikesPhoto] = useState(false);
  const [guests, setGuests] = useState<GuestReaction[]>([]);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load guest's like status
  useEffect(() => {
    if (!photoId) return;

    const loadGuestLike = async () => {
      if (isGuest) {
        try {
          const hasLiked = await guestsService.getGuestLike(photoId);
          setLikesPhoto(hasLiked);
        } catch (error) {
          console.error('Error loading guest like:', error);
          setLikesPhoto(false);
        }
      } else {
        setLikesPhoto(false);
      }
    };

    loadGuestLike();
  }, [photoId, isGuest]);

  // Load all likes for the photo
  useEffect(() => {
    if (!photoId) return;

    const loadPhotoLikes = async () => {
      try {
        const likesData = await guestsService.getPhotoLikes(photoId);
        setGuests(likesData);
      } catch (error) {
        console.error('Error loading photo likes:', error);
        setGuests([]);
      }
    };

    loadPhotoLikes();
  }, [photoId, likesPhoto]);

  const handleLikeClick = async () => {
    if (isLoading) return;

    // If not a guest, show registration dialog
    if (!isGuest) {
      setShowRegisterDialog(true);
      return;
    }

    setIsLoading(true);
    try {
      if (likesPhoto) {
        // Unlike the photo
        await guestsService.unlikePhoto(photoId);
        setLikesPhoto(false);
      } else {
        // Like the photo
        await guestsService.likePhoto(photoId);
        setLikesPhoto(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClose = async (success?: boolean) => {
    setShowRegisterDialog(false);
    if (success) {
      // Refresh guest state after successful registration
      await refreshGuest();
    }
  };

  const likesText = getLikesText(likesPhoto, guests);

  return (
    <>
      <div className="flex items-center space-x-3">
        <button
          onClick={handleLikeClick}
          disabled={isLoading}
          className="cursor-pointer hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={likesPhoto ? "Unlike photo" : "Like photo"}
        >
          {likesPhoto ? (
            <HeartIconSolid className="w-6 h-6 text-[#b5043c]" />
          ) : (
            <HeartIcon className="w-6 h-6 text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-200" />
          )}
        </button>
        <span className="text-sm text-gray-900 dark:text-white">
          {likesText}
        </span>
      </div>

      {/* Guest Registration Dialog */}
      <RegisterGuestDialog
        open={showRegisterDialog}
        onClose={handleRegisterClose}
      />
    </>
  );
}