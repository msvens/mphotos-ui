'use client';

import { useState, useEffect } from 'react';
import { Camera } from '@/lib/api/types';
import { camerasService } from '@/lib/api/services';
import { useMPContext } from '@/context/MPContext';
import { IconButton } from '@/components/IconButton';
import { PencilIcon, PhotoIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { UpdateCameraDialog } from './UpdateCameraDialog';
import { CameraImageDialog } from './CameraImageDialog';

interface CameraDetailProps {
  camera: Camera;
  onUpdate: (camera: Camera) => void;
}

export function CameraDetail({ camera, onUpdate }: CameraDetailProps) {
  const { isUser } = useMPContext();
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)'); // Tailwind's 'sm' breakpoint
    setIsLargeScreen(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsLargeScreen(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const cameraImageUrl = camerasService.getCameraImageUrl(camera, isLargeScreen ? '512' : '192');

  // Helper to format camera spec values for display
  const formatValue = (key: string, value: unknown): string => {
    if (value === null || value === undefined || value === '') return '';

    switch (key) {
      case 'digitalZoom':
      case 'raw':
      case 'manualFocus':
      case 'aperturePriority':
      case 'shutterPriority':
      case 'builtInFlash':
      case 'externalFlash':
      case 'videoCapture':
      case 'gps':
        return value ? 'Yes' : 'No';
      case 'year':
        return value === 0 ? '' : value.toString();
      case 'effectivePixels':
        return value === 0 ? '' : `${(value as number) / 1000000}M`;
      case 'totalPixels':
        return value === 0 ? '' : `${(value as number) / 1000000}M`;
      case 'cropFactor':
        return value === 0 ? '' : value.toString();
      case 'opticalZoom':
        return value === 0 ? '' : `${value}x`;
      case 'focusRange':
        return value === 0 ? '' : `${value} cm`;
      case 'macroFocusRange':
        return value === 0 ? '' : `${value} cm`;
      default:
        return value.toString();
    }
  };

  // Get display name for camera spec keys
  const getDisplayName = (key: string): string => {
    const nameMap: Record<string, string> = {
      model: 'Model',
      make: 'Make',
      year: 'Year',
      effectivePixels: 'Effective Pixels',
      totalPixels: 'Total Pixels',
      sensorSize: 'Sensor Size',
      sensorType: 'Sensor Type',
      sensorResolution: 'Sensor Resolution',
      imageResolution: 'Image Resolution',
      cropFactor: 'Crop Factor',
      opticalZoom: 'Optical Zoom',
      digitalZoom: 'Digital Zoom',
      iso: 'ISO',
      raw: 'Supports Raw',
      manualFocus: 'Manual Focus',
      focusRange: 'Focus Range',
      macroFocusRange: 'Macro Focus Range',
      focalLengthEquiv: 'Focal Length Equiv',
      aperturePriority: 'Aperture Priority',
      maxAperture: 'Max Aperture',
      maxApertureEquiv: 'Max Aperture Equiv',
      metering: 'Metering',
      exposureComp: 'Exposure Comp',
      shutterPriority: 'Shutter Priority',
      minShutterSpeed: 'Min Shutter Speed',
      maxShutterSpeed: 'Max Shutter Speed',
      builtInFlash: 'Built In Flash',
      externalFlash: 'External Flash',
      viewFinder: 'View Finder',
      videoCapture: 'Video Capture',
      maxVideoResolution: 'Max Video Resolution',
      gps: 'GPS',
    };
    return nameMap[key] || key;
  };

  // Get all camera properties except id and image
  const cameraSpecs = Object.keys(camera)
    .filter(key => key !== 'id' && key !== 'image')
    .map(key => ({
      key,
      displayName: getDisplayName(key),
      value: formatValue(key, camera[key as keyof Camera])
    }))
    .filter(spec => spec.value !== ''); // Only show non-empty values

  return (
    <div className="space-y-6">
      {/* Camera Image */}
      <div className="flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cameraImageUrl}
          alt={camera.model}
          className="max-w-full h-auto max-h-96 rounded-lg"
        />
      </div>

      {/* Photos Link */}
      <div className="flex justify-center">
        <Link
          href={`/camera/${camera.id}/photos`}
          className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-200 underline"
        >
          Photos
        </Link>
      </div>

      {/* Edit Buttons (Admin Only) */}
      {isUser && (
        <div className="flex justify-center gap-2">
          <IconButton
            icon={PhotoIcon}
            onClick={() => setShowImageDialog(true)}
            title="Edit Camera Image"
          />
          <IconButton
            icon={PencilIcon}
            onClick={() => setShowUpdateDialog(true)}
            title="Edit Camera Spec"
          />
        </div>
      )}

      {/* Camera Specs Table */}
      <div className="max-w-2xl mx-auto">
        <table className="w-full text-sm">
          <tbody>
            {cameraSpecs.map((spec) => (
              <tr
                key={spec.key}
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <td className="py-2 pr-4 text-gray-600 dark:text-gray-400">
                  {spec.displayName}
                </td>
                <td className="py-2 text-gray-900 dark:text-white">
                  {spec.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dialogs */}
      {isUser && (
        <>
          <UpdateCameraDialog
            camera={camera}
            open={showUpdateDialog}
            onClose={() => setShowUpdateDialog(false)}
            onUpdate={onUpdate}
          />
          <CameraImageDialog
            camera={camera}
            open={showImageDialog}
            onClose={() => setShowImageDialog(false)}
            onUpdate={onUpdate}
          />
        </>
      )}
    </div>
  );
}