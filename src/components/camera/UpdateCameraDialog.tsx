'use client';

import { useState, useEffect } from 'react';
import { Camera } from '@/lib/api/types';
import { camerasService } from '@/lib/api/services';
import { Dialog } from '@/components/Dialog';
import { Button } from '@/components/Button';
import { Select } from '@/components/Select';
import { TextField } from '@/components/TextField';

interface UpdateCameraDialogProps {
  camera: Camera;
  open: boolean;
  onClose: () => void;
  onUpdate: (camera: Camera) => void;
}

export function UpdateCameraDialog({ camera, open, onClose, onUpdate }: UpdateCameraDialogProps) {
  const [formData, setFormData] = useState<Camera>(camera);
  const [updating, setUpdating] = useState(false);

  // Update form data when camera prop changes
  useEffect(() => {
    setFormData(camera);
  }, [camera]);

  const handleChange = (key: keyof Camera, value: string) => {
    setFormData(prev => {
      const newData = { ...prev };

      // Handle different types
      if (key === 'year' || key === 'effectivePixels' || key === 'totalPixels') {
        newData[key] = parseInt(value) || 0;
      } else if (key === 'cropFactor' || key === 'opticalZoom' || key === 'focusRange' || key === 'macroFocusRange') {
        newData[key] = parseFloat(value) || 0;
      } else if (key === 'digitalZoom' || key === 'raw' || key === 'manualFocus' || key === 'aperturePriority' ||
                 key === 'shutterPriority' || key === 'builtInFlash' || key === 'externalFlash' ||
                 key === 'videoCapture' || key === 'gps') {
        newData[key] = value === 'true';
      } else {
        (newData as Record<string, unknown>)[key] = value;
      }

      return newData;
    });
  };

  const handleSubmit = async () => {
    setUpdating(true);
    try {
      const updated = await camerasService.updateCamera(camera.id, formData);
      onUpdate(updated);
      onClose();
    } catch (error) {
      console.error('Error updating camera:', error);
      alert('Failed to update camera: ' + error);
    } finally {
      setUpdating(false);
    }
  };

  // Get display name for form fields
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

  // Get all editable fields (all except id, image, make, model)
  const editableFields = Object.keys(formData)
    .filter(key => key !== 'id' && key !== 'image' && key !== 'make' && key !== 'model') as Array<keyof Camera>;

  const readOnlyFields = ['make', 'model'] as Array<keyof Camera>;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Update Camera"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">Update Camera Spec</p>

        {/* Read-only fields */}
        <div className="space-y-3">
          {readOnlyFields.map(key => (
            <div key={key} className="grid grid-cols-[160px_1fr] gap-4 items-center border-b border-gray-200 dark:border-gray-700 py-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {getDisplayName(key)}
              </span>
              <span className="text-sm text-gray-900 dark:text-white">
                {formData[key] as string}
              </span>
            </div>
          ))}
        </div>

        {/* Editable fields */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {editableFields.map(key => {
            const value = formData[key];
            const isBoolean = typeof value === 'boolean';

            return (
              <div key={key} className="border-b border-gray-200 dark:border-gray-700 py-2">
                {isBoolean ? (
                  <Select
                    label={getDisplayName(key)}
                    value={value.toString()}
                    onChange={(val) => handleChange(key, val)}
                    options={[
                      { value: 'false', label: 'No' },
                      { value: 'true', label: 'Yes' }
                    ]}
                    fullWidth
                  />
                ) : (
                  <TextField
                    label={getDisplayName(key)}
                    value={value?.toString() || ''}
                    onChange={(e) => handleChange(key, e.target.value)}
                    fullWidth
                  />
                )}
              </div>
            );
          })}
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