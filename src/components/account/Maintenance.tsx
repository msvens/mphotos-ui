'use client';

import { useState, useEffect } from 'react';
import { photosService } from '@/lib/api/services';
import { Button } from '@/components/Button';
import { Dialog } from '@/components/Dialog';

export function Maintenance() {
  const [photoCount, setPhotoCount] = useState<number>(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch photo count
  useEffect(() => {
    photosService.getPhotos()
      .then((photoList) => setPhotoCount(photoList.length))
      .catch((e) => console.error('Error fetching photo count:', e));
  }, []);

  const handleDeleteAll = async () => {
    setDeleting(true);
    try {
      const result = await photosService.deletePhotos(true);
      alert(`Successfully deleted ${result.length} photos`);
      setPhotoCount(0);
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting photos:', error);
      alert('Failed to delete photos: ' + error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Delete All Photos Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Delete All Photos
        </h3>
        <p className="text-sm text-gray-900 dark:text-white">
          <strong>Warning!</strong> This action removes all photos from the service and deletes all physical copies from the server. This operation cannot be undone.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Total photos in service: <strong>{photoCount}</strong>
        </p>
        <Button
          onClick={() => setOpenDeleteDialog(true)}
          variant="outlined"
          color="error"
          disabled={photoCount === 0}
        >
          DELETE ALL PHOTOS
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => !deleting && setOpenDeleteDialog(false)}
        title="Delete All Photos?"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-900 dark:text-white">
            Are you sure you want to delete all <strong>{photoCount}</strong> photos? This will remove all image data from the server and cannot be undone.
          </p>
          <div className="flex justify-end gap-4">
            <Button
              onClick={() => setOpenDeleteDialog(false)}
              variant="outlined"
              disabled={deleting}
            >
              CANCEL
            </Button>
            <Button
              onClick={handleDeleteAll}
              color="error"
              disabled={deleting}
            >
              {deleting ? 'DELETING...' : 'DELETE ALL'}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}