'use client';

import { Album } from '@/lib/api/types';
import { Dialog } from '../Dialog';

export interface AlbumDeleteDialogProps {
  open: boolean;
  album?: Album;
  onClose: (album?: Album) => void;
}

export function AlbumDeleteDialog({ open, album, onClose }: AlbumDeleteDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={() => onClose(undefined)}
      onOk={() => onClose(album)}
      title="Delete Album"
      text="Deleting an album will not remove the associated images"
      okText="DELETE"
      closeText="CANCEL"
    />
  );
}