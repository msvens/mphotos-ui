'use client';

import { useEffect, useState } from 'react';
import { Dialog } from '@/components/Dialog';
import { TextField } from '@/components/TextField';
import { MultiSelect, MultiSelectOption } from '@/components/MultiSelect';
import { PhotoMetadata, Album } from '@/lib/api/types';
import { photosService, albumsService } from '@/lib/api/services';
import { useToast } from '@/context/ToastContext';

export interface PhotoEditDialogProps {
  open: boolean;
  photo: PhotoMetadata;
  onClose: (updatedPhoto?: PhotoMetadata) => void;
}

export function PhotoEditDialog({ open, photo, onClose }: PhotoEditDialogProps) {
  const toast = useToast();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbumIds, setSelectedAlbumIds] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [albumChanged, setAlbumChanged] = useState(false);
  const [photoChanged, setPhotoChanged] = useState(false);

  // Fetch all albums on mount
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await albumsService.getAlbums();
        setAlbums(res);
      } catch (error) {
        console.error('Error fetching albums:', error);
      }
    };
    void fetchAlbums();
  }, []);

  // Update form fields when photo changes
  useEffect(() => {
    setTitle(photo.title || '');
    setDescription(photo.description || '');
    // Format keywords with space after commas for better readability
    const formattedKeywords = photo.keywords ? photo.keywords.replace(/,(?!\s)/g, ', ') : '';
    setKeywords(formattedKeywords);
    setSelectedAlbumIds([]);
    setPhotoChanged(false);
    setAlbumChanged(false);
  }, [photo]);

  // Fetch photo's current albums when photo or dialog opens
  useEffect(() => {
    if (!open) return;

    const fetchPhotoAlbums = async () => {
      try {
        const photoAlbums = await photosService.getPhotoAlbums(photo.id);
        // Extract just the IDs from the Album objects
        const albumIds = photoAlbums.map(album => album.id);
        setSelectedAlbumIds(albumIds);
      } catch (error) {
        console.error('Error fetching photo albums:', error);
        setSelectedAlbumIds([]);
      }
    };
    void fetchPhotoAlbums();
  }, [photo.id, open]);

  const handleUpdatePhoto = async () => {
    if (!albumChanged && !photoChanged) {
      onClose();
      return;
    }

    try {
      let updatedPhoto = photo;

      // Update albums if changed
      if (albumChanged) {
        // Only call setPhotoAlbums if there are albums selected
        // Empty array is handled by clearing albums separately
        if (selectedAlbumIds.length > 0) {
          await photosService.setPhotoAlbums(photo.id, selectedAlbumIds);
        } else {
          // Clear all albums - backend still updates but may return error for empty array
          // We catch and ignore this specific error since the update succeeds
          try {
            await photosService.setPhotoAlbums(photo.id, selectedAlbumIds);
          } catch (err) {
            // Ignore "empty slice" error - the operation still succeeds
            const errMsg = err instanceof Error ? err.message : String(err);
            if (!errMsg.includes('empty slice')) {
              throw err;
            }
          }
        }
      }

      // Update photo metadata if changed
      if (photoChanged) {
        updatedPhoto = await photosService.updatePhoto(
          photo.id,
          title,
          description,
          keywords
        );
      }

      setPhotoChanged(false);
      setAlbumChanged(false);
      toast.success('Photo updated successfully');
      onClose(updatedPhoto);
    } catch (error) {
      console.error('Error updating photo:', error);
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
      toast.error(`Failed to update photo: ${errorMessage}`);
    }
  };

  const handleAlbumChange = (newAlbumIds: string[]) => {
    setSelectedAlbumIds(newAlbumIds);
    setAlbumChanged(true);
  };

  // Convert albums to MultiSelect options
  const albumOptions: MultiSelectOption[] = albums.map((album) => ({
    value: album.id,
    label: album.name,
  }));

  const dialogText =
    'Update title, description and keywords. Observe that keywords should be comma separated';

  return (
    <Dialog
      open={open}
      onClose={() => onClose(undefined)}
      onOk={handleUpdatePhoto}
      title="Edit Photo"
      text={dialogText}
      closeOnOk={false}
      maxWidth="lg"
    >
      <TextField
        id="title"
        label="Title"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setPhotoChanged(true);
        }}
        fullWidth
        margin="dense"
      />
      <TextField
        id="keywords"
        label="Keywords"
        value={keywords}
        onChange={(e) => {
          setKeywords(e.target.value);
          setPhotoChanged(true);
        }}
        fullWidth
        margin="dense"
      />
      <TextField
        id="description"
        label="Description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          setPhotoChanged(true);
        }}
        fullWidth
        margin="dense"
        multiline
        rows={2}
      />
      <MultiSelect
        id="albums"
        label="Albums"
        value={selectedAlbumIds}
        onChange={handleAlbumChange}
        options={albumOptions}
        fullWidth
        margin="dense"
        placeholder="Select albums..."
      />
    </Dialog>
  );
}