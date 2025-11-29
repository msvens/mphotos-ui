'use client';

import { useState, useRef } from 'react';
import { Camera } from '@/lib/api/types';
import { camerasService } from '@/lib/api/services';
import { Dialog } from '@/components/Dialog';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';

interface CameraImageDialogProps {
  camera: Camera;
  open: boolean;
  onClose: () => void;
  onUpdate: (camera: Camera) => void;
}

export function CameraImageDialog({ camera, open, onClose, onUpdate }: CameraImageDialogProps) {
  const [url, setUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [updating, setUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!url && !selectedFile) {
      alert('Please provide either a URL or choose a file');
      return;
    }

    setUpdating(true);
    try {
      let updated: Camera;
      if (selectedFile) {
        updated = await camerasService.uploadCameraImage(camera.id, selectedFile);
      } else {
        updated = await camerasService.updateCameraImageUrl(camera.id, url);
      }
      onUpdate(updated);
      setUrl('');
      setSelectedFile(null);
      onClose();
    } catch (error) {
      console.error('Error updating camera image:', error);
      alert('Failed to update camera image: ' + error);
    } finally {
      setUpdating(false);
    }
  };

  const filesText = selectedFile ? selectedFile.name : 'selected files';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Image URL"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Choose Image for this Camera
        </p>

        {/* URL Input */}
        <TextField
          label="Url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          fullWidth
        />

        {/* File Input */}
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-full px-4 py-3 pr-40 border border-gray-300 dark:border-gray-600 rounded bg-transparent text-gray-900 dark:text-white text-sm">
            {filesText}
          </div>
          <button
            onClick={handleChooseFile}
            disabled={updating}
            className="absolute right-2 top-2 px-3 py-1 text-sm text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            CHOOSE FILE
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4">
          <Button onClick={onClose} variant="outlined" disabled={updating}>
            CANCEL
          </Button>
          <Button onClick={handleSubmit} disabled={updating}>
            {updating ? 'UPDATING...' : 'OK'}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}