'use client';

import { useState, useRef } from 'react';
import { photosService } from '@/lib/api/services';
import { Button } from '@/components/Button';

export function LocalDrive() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
    fileName: string;
  } | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setSelectedFiles(files);
  };

  const handleChooseFiles = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    const totalFiles = selectedFiles.length;

    for (let i = 0; i < totalFiles; i++) {
      const file = selectedFiles[i];
      setUploadProgress({
        current: i + 1,
        total: totalFiles,
        fileName: file.name,
      });

      try {
        await photosService.uploadLocalPhoto(file);
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        // Continue with next file even if one fails
      }
    }

    // Reset state after upload
    setUploading(false);
    setUploadProgress(null);
    setSelectedFiles(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const filesText = selectedFiles
    ? `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} selected`
    : 'selected files';

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <p className="text-sm text-gray-900 dark:text-white">
        Upload photos from your local computer. Any folders that has already been uploaded (md5 check) will not be
        uploaded again. Observe that the md5 check happens on the server
      </p>

      {/* File Selection */}
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="w-full px-4 py-3 pr-40 border border-gray-300 dark:border-gray-600 rounded bg-transparent text-gray-900 dark:text-white text-sm">
          {filesText}
        </div>
        <button
          onClick={handleChooseFiles}
          disabled={uploading}
          className="absolute right-2 top-2 px-3 py-1 text-sm text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          CHOOSE FILES
        </button>
      </div>

      {/* Upload Button */}
      <div>
        <Button
          onClick={handleUpload}
          disabled={!selectedFiles || selectedFiles.length === 0 || uploading}
        >
          UPLOAD PHOTOS
        </Button>
      </div>

      {/* Upload Progress */}
      {uploadProgress && (
        <div className="space-y-2">
          <div className="text-sm text-gray-900 dark:text-white">
            Uploading {uploadProgress.current} of {uploadProgress.total}: {uploadProgress.fileName}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}