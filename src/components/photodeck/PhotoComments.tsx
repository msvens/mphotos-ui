'use client';

import { useEffect, useState } from 'react';
import { guestsService } from '@/lib/api/services';
import { PhotoComment } from '@/lib/api/types';
import { useMPContext } from '@/context/MPContext';
import { RegisterGuestDialog } from '@/components/guest/RegisterGuestDialog';

interface PhotoCommentsProps {
  photoId: string;
}

export function PhotoComments({ photoId }: PhotoCommentsProps) {
  const { isGuest, refreshGuest, isLoading: isContextLoading } = useMPContext();
  const [comments, setComments] = useState<PhotoComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(true);

  // Load comments for the photo - wait for context to be ready
  useEffect(() => {
    if (!photoId || isContextLoading) return;

    const loadComments = async () => {
      setIsLoadingComments(true);
      try {
        const commentsData = await guestsService.getPhotoComments(photoId);
        setComments(commentsData);
      } catch (error) {
        console.error('Error loading comments:', error);
        setComments([]);
      } finally {
        setIsLoadingComments(false);
      }
    };

    loadComments();
  }, [photoId, isContextLoading]);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;

    // If not a guest, show registration dialog
    if (!isGuest) {
      setShowRegisterDialog(true);
      return;
    }

    setIsPosting(true);
    try {
      const postedComment = await guestsService.commentPhoto(photoId, newComment);
      setComments([...comments, postedComment]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleRegisterClose = async (success?: boolean) => {
    setShowRegisterDialog(false);
    if (success) {
      // Refresh guest state after successful registration
      await refreshGuest();
    }
  };

  const formatDate = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      {/* Comment Input */}
      <div className="mt-6 flex items-center space-x-2 p-1 border border-gray-300 dark:border-gray-600 rounded">
        <textarea
          className="flex-1 bg-transparent text-sm outline-none resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 py-1 px-1"
          placeholder="Add comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={1}
        />
        <button
          onClick={handlePostComment}
          disabled={isPosting || !newComment.trim()}
          className="px-3 py-1 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Post
        </button>
      </div>

      {/* Comments List */}
      <div className="mt-4 space-y-4">
        {isLoadingComments ? (
          <div className="text-sm text-gray-400">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-sm text-gray-400">No comments yet. Be the first to comment!</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="mr-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {comment.name}, {formatDate(comment.time)}
              </div>
              <div className="text-sm text-gray-900 dark:text-white mt-1">
                {comment.body}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Guest Registration Dialog */}
      <RegisterGuestDialog
        open={showRegisterDialog}
        onClose={handleRegisterClose}
      />
    </>
  );
}