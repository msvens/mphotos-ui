'use client';

import { useEffect, useState } from 'react';
import { Album, PhotoOrder } from '@/lib/api/types';
import { Dialog } from '../Dialog';
import { TextField } from '../TextField';
import { Select } from '../Select';

export interface AlbumEditDialogProps {
  open: boolean;
  album?: Album;
  onClose: (album?: Album) => void;
}

export function AlbumEditDialog({ open, album, onClose }: AlbumEditDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [orderBy, setOrderBy] = useState<PhotoOrder>(PhotoOrder.None);

  // Populate form when album changes
  useEffect(() => {
    if (album) {
      setName(album.name);
      setDescription(album.description);
      setCode(album.code);
      setOrderBy(album.orderBy);
    }
  }, [album]);

  const handleOk = () => {
    if (album) {
      onClose({
        ...album,
        name,
        description,
        code,
        orderBy,
      });
    } else {
      onClose(undefined);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => onClose(undefined)}
      onOk={handleOk}
      title="Edit Album"
      text="Change album name or description"
      closeOnOk={false}
      okText="OK"
      closeText="CANCEL"
    >
      <TextField
        id="name"
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        margin="dense"
      />
      <TextField
        id="description"
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        rows={2}
        margin="dense"
      />
      <TextField
        id="code"
        label="Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        fullWidth
        margin="dense"
      />
      <Select
        id="orderBy"
        label="Sorting"
        value={orderBy}
        onChange={(e) => setOrderBy(parseInt(e.target.value) as PhotoOrder)}
        fullWidth
        margin="dense"
      >
        <option value={PhotoOrder.None}>None</option>
        <option value={PhotoOrder.OriginalDate}>Original Date</option>
        <option value={PhotoOrder.UploadDate}>Upload Date</option>
        <option value={PhotoOrder.ManualOrder}>Manual</option>
      </Select>
    </Dialog>
  );
}