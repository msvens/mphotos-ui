'use client';

import { useState } from 'react';
import { Album, PhotoOrder } from '@/lib/api/types';
import { Dialog } from '../Dialog';
import { TextField } from '../TextField';
import { Select } from '../Select';

export interface AlbumAddDialogProps {
  open: boolean;
  onClose: (album?: Partial<Album>) => void;
}

export function AlbumAddDialog({ open, onClose }: AlbumAddDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [orderBy, setOrderBy] = useState<PhotoOrder>(PhotoOrder.None);

  const handleOk = () => {
    onClose({
      name,
      description,
      code,
      orderBy,
      coverPic: '',
    });
    // Reset form
    setName('');
    setDescription('');
    setCode('');
    setOrderBy(PhotoOrder.None);
  };

  const handleClose = () => {
    onClose(undefined);
    // Reset form
    setName('');
    setDescription('');
    setCode('');
    setOrderBy(PhotoOrder.None);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      onOk={handleOk}
      title="Add Album"
      text="Create album. You can later add photos to it"
      closeOnOk={false}
      okText="ADD"
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
        value={orderBy.toString()}
        onChange={(val) => setOrderBy(parseInt(val) as PhotoOrder)}
        options={[
          { value: PhotoOrder.None.toString(), label: 'None' },
          { value: PhotoOrder.OriginalDate.toString(), label: 'Original Date' },
          { value: PhotoOrder.UploadDate.toString(), label: 'Upload Date' },
          { value: PhotoOrder.ManualOrder.toString(), label: 'Manual' },
        ]}
        fullWidth
        margin="dense"
      />
    </Dialog>
  );
}