'use client';

import { useState, useEffect } from 'react';
import { driveService } from '@/lib/api/services';
import { userService } from '@/lib/api/services';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { useMPContext } from '@/context/MPContext';
import { Dialog } from '@/components/Dialog';
import { Job, JobState } from '@/lib/api/types';

const AUTH_URL = '/api/drive/auth?redir=' + encodeURIComponent('/account');

export function GoogleDrive() {
  const { user, refreshAuth } = useMPContext();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [folderName, setFolderName] = useState('');
  const [folderId, setFolderId] = useState('');
  const [openDownloadDialog, setOpenDownloadDialog] = useState(false);
  const [numPhotos, setNumPhotos] = useState(0);
  const [job, setJob] = useState<Job | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Check authentication status
  useEffect(() => {
    driveService.isAuthenticated()
      .then(setAuthenticated)
      .catch((e) => {
        console.error('Error checking auth:', e);
        setAuthenticated(false);
      });
  }, []);

  // Load user's drive folder info
  useEffect(() => {
    if (user.driveFolderId) setFolderId(user.driveFolderId);
    if (user.driveFolderName) setFolderName(user.driveFolderName);
  }, [user]);

  // Poll job status when downloading
  useEffect(() => {
    if (!job || !isDownloading) return;

    const interval = setInterval(async () => {
      try {
        const updatedJob = await driveService.getJobStatus(job.id);
        setJob(updatedJob);

        if (updatedJob.state === JobState.FINISHED) {
          setIsDownloading(false);
        } else if (updatedJob.state === JobState.ABORTED) {
          setIsDownloading(false);
          alert('Job aborted: ' + (updatedJob.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error checking job status:', error);
        setIsDownloading(false);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [job, isDownloading]);

  const handleSetFolder = async () => {
    try {
      await userService.updateUserGDrive(folderName);
      await refreshAuth();
    } catch (error) {
      alert('Error setting folder: ' + error);
    }
  };

  const handleOpenDownloadDialog = async () => {
    try {
      const driveFiles = await driveService.checkDrive();
      setNumPhotos(driveFiles.length);
      setJob(null);
      setOpenDownloadDialog(true);
    } catch (error) {
      console.error('Error checking drive:', error);
    }
  };

  const handleStartDownload = async () => {
    try {
      const newJob = await driveService.scheduleAddPhotosJob();
      if (newJob.state === JobState.STARTED || newJob.state === JobState.SCHEDULED) {
        setJob(newJob);
        setIsDownloading(true);
      } else {
        alert('Unexpected job state: ' + newJob.state);
      }
    } catch (error) {
      console.error('Error starting download:', error);
      alert('Error starting download: ' + error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDownloadDialog(false);
    setJob(null);
    setIsDownloading(false);
  };

  const handleAuthToggle = async () => {
    if (authenticated) {
      // Disconnect
      try {
        await driveService.disconnectDrive();
        setAuthenticated(false);
      } catch (error) {
        console.error('Error disconnecting:', error);
        alert('Error disconnecting: ' + error);
      }
    } else {
      // Connect - redirect to auth URL
      window.location.href = AUTH_URL;
    }
  };

  return (
    <div className="space-y-6">
      {/* Authentication Section */}
      <div>
        <p className="text-sm text-gray-900 dark:text-white mb-4">
          Connected to Google: <strong>{authenticated === null ? 'Loading...' : String(authenticated)}</strong>
        </p>
        <Button
          onClick={handleAuthToggle}
          variant="outlined"
          disabled={authenticated === null}
        >
          {authenticated === null ? 'LOADING...' : authenticated ? 'DISCONNECT' : 'CONNECT'}
        </Button>
      </div>

      {/* Set Drive Folder Section */}
      <div className="space-y-4">
        <p className="text-sm text-gray-900 dark:text-white">
          Set the new Google photo folder by changed the folder name. If you have multiple folders with the same name on your google drive the first returned will be picked
        </p>
        <TextField
          label="Folder Name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          fullWidth
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Drive Id: {folderId}
        </p>
        <Button onClick={handleSetFolder} variant="outlined">
          SET DRIVE FOLDER
        </Button>
      </div>

      {/* Download Photos Section */}
      <div className="space-y-4">
        <p className="text-sm text-gray-900 dark:text-white">
          Upload photos. This will download any photos from your google drive folder that are missing in the service.
        </p>
        <Button onClick={handleOpenDownloadDialog}>
          DOWNLOAD PHOTOS
        </Button>
      </div>

      {/* Download Dialog */}
      <Dialog
        open={openDownloadDialog}
        onClose={handleCloseDialog}
        title={job ? "Download Progress" : "Download Photos From Your Drive Folder"}
      >
        {job ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-900 dark:text-white">
              Processing {job.numProcessed} of {job.numFiles} photos
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${job.percent}%` }}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleCloseDialog} disabled={isDownloading}>
                OK
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-900 dark:text-white">
              There are currently {numPhotos} photos to download from your drive folder
            </p>
            <div className="flex justify-end gap-4">
              <Button onClick={handleCloseDialog} variant="outlined">
                CANCEL
              </Button>
              <Button onClick={handleStartDownload} disabled={numPhotos === 0}>
                OK
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}