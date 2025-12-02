'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { PhotoMetadata } from '@/lib/api/types';
import { photosService } from '@/lib/api/services';
import { useRotateImage } from '@/hooks/useRotateImage';
import { useMPContext } from '@/context/MPContext';
import { useToast } from '@/context/ToastContext';
import { IconButton } from '@/components/IconButton';
import { colorScheme, alpha } from '@/lib/colors';
import {
  ArrowUturnLeftIcon,
  EyeIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import {
  CropPortrait,
  CropLandscape,
  CropSquare,
  CropFree,
  Rotate90DegreesRight,
  Rotate5DegreesRight,
} from './CropIcons';

interface CropPageProps {
  photo: PhotoMetadata;
  backUrl: string;
}

// Aspect ratios
const LANDSCAPE = 1200 / 628;  // ~1.91:1
const SQUARE = 1;               // 1:1
const PORTRAIT = 1080 / 1350;   // 0.8:1

const IMAGE_CLASSES = "w-auto h-auto max-h-[calc(100vh-200px)] object-contain transition-all duration-300";

export function CropPage({ photo, backUrl }: CropPageProps) {
  const router = useRouter();
  const { uxConfig } = useMPContext();
  const toast = useToast();
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const imgSrc = photosService.getPhotoUrl(photo.id);
  const rotatedImage = useRotateImage(imgSrc, rotation);

  const handleAspectChange = (newAspect: number | undefined) => {
    setAspect(newAspect);

    // Initialize a centered crop box when aspect ratio is selected
    if (newAspect && imgRef.current) {
      const { width, height } = imgRef.current;
      let cropWidth: number;
      let cropHeight: number;

      // Calculate crop dimensions based on aspect ratio
      if (newAspect > 1) {
        // Landscape - width is longer
        cropWidth = Math.min(width * 0.8, height * newAspect * 0.8);
        cropHeight = cropWidth / newAspect;
      } else {
        // Portrait or square - height is longer or equal
        cropHeight = Math.min(height * 0.8, width / newAspect * 0.8);
        cropWidth = cropHeight * newAspect;
      }

      // Center the crop
      const x = (width - cropWidth) / 2;
      const y = (height - cropHeight) / 2;

      setCrop({
        unit: 'px',
        x,
        y,
        width: cropWidth,
        height: cropHeight,
      });
    }
  };

  const handleRotate = (degrees: number) => {
    setRotation((prev) => (prev + degrees) % 360);
  };

  const handleRestore = () => {
    setCrop(undefined);
    setCompletedCrop(undefined);
    setRotation(0);
    setAspect(undefined);
    setShowPreview(false);
    setPreviewUrl('');
  };

  const getEditParams = () => {
    if (!imgRef.current) return null;

    const params = {
      rotation,
      x: 0,
      y: 0,
      width: imgRef.current.naturalWidth,
      height: imgRef.current.naturalHeight,
    };

    if (completedCrop) {
      params.x = Math.floor(completedCrop.x);
      params.y = Math.floor(completedCrop.y);
      params.width = Math.floor(completedCrop.width);
      params.height = Math.floor(completedCrop.height);
    }

    return params;
  };

  const handlePreview = () => {
    const params = getEditParams();
    if (!params) return;

    const url = new URL(window.location.origin + `/api/photos/${photo.id}/edit/preview`);
    url.searchParams.set('rotation', params.rotation.toString());
    url.searchParams.set('x', params.x.toString());
    url.searchParams.set('y', params.y.toString());
    url.searchParams.set('width', params.width.toString());
    url.searchParams.set('height', params.height.toString());

    setPreviewUrl(url.toString());
    setShowPreview(true);
  };

  const handleSave = async () => {
    const params = getEditParams();
    if (!params) {
      toast.error('No edit parameters');
      return;
    }

    try {
      setSaving(true);
      await photosService.editPhoto(photo.id, params);
      toast.success('Photo saved successfully');
      router.push(backUrl);
      router.refresh(); // Force refresh to show updated image
    } catch (error) {
      console.error('Error saving photo edits:', error);
      toast.error('Failed to save photo edits');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    router.push(backUrl);
  };

  const displayImage = rotation !== 0 && rotatedImage ? rotatedImage.src : imgSrc;

  // Get color scheme for photo background
  const cs = colorScheme(uxConfig.photoBackgroundColor);

  // Determine padding based on photo borders setting
  const photoBorders = uxConfig.photoBorders;
  const getPadding = () => {
    switch (photoBorders) {
      case 'none':
        return { paddingLeft: '0', paddingRight: '0', paddingTop: '0', paddingBottom: '0' };
      case 'left-right':
        return { paddingLeft: '5rem', paddingRight: '5rem', paddingTop: '0', paddingBottom: '0' };
      case 'all':
        return { paddingLeft: '5rem', paddingRight: '5rem', paddingTop: '2rem', paddingBottom: '2rem' };
      default:
        return { paddingLeft: '5rem', paddingRight: '5rem', paddingTop: '0', paddingBottom: '0' };
    }
  };

  const padding = getPadding();
  const hasVerticalControls = photoBorders !== 'none';

  // Preview Mode - fullscreen
  if (showPreview) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-48px)]">
        <div
          className="relative flex items-center justify-center"
          style={{
            backgroundColor: cs.backgroundColor,
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            ...padding,
            minHeight: 'calc(100vh - 200px)',
          }}
        >
          <div className="absolute right-4 top-4 z-10 p-2">
            <IconButton
              icon={XMarkIcon}
              onClick={() => setShowPreview(false)}
              title="Close preview"
              tooltipPlacement="bottom-left"
              background={alpha(cs.backgroundColor, 0.5)}
              className={cs.color === '#ffffff' ? 'text-white' : 'text-gray-900'}
            />
          </div>
          <div className="relative w-full flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Preview"
              className={IMAGE_CLASSES}
            />
          </div>
        </div>
      </div>
    );
  }

  // Main crop/rotate interface
  return (
    <div className="flex flex-col min-h-[calc(100vh-48px)]">
      {/* Photo Display with Background Color - Full Width */}
      <div
        className="relative flex items-center justify-center"
        style={{
          backgroundColor: cs.backgroundColor,
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          ...padding,
          minHeight: 'calc(100vh - 200px)',
        }}
      >
        {/* Crop/Rotate Controls - Left Side */}
        <div
          className={`absolute ${hasVerticalControls ? 'left-4 top-4 flex-col' : 'left-4 top-4 flex-row'} flex gap-2 p-2 z-10`}
        >
          <IconButton
            icon={CropPortrait}
            onClick={() => handleAspectChange(PORTRAIT)}
            title="Portrait crop"
            tooltipPlacement={hasVerticalControls ? "bottom-right" : "bottom"}
            background={alpha(cs.backgroundColor, 0.5)}
            className={cs.color === '#ffffff' ? 'text-white' : 'text-gray-900'}
          />
          <IconButton
            icon={CropLandscape}
            onClick={() => handleAspectChange(LANDSCAPE)}
            title="Landscape crop"
            tooltipPlacement={hasVerticalControls ? "bottom-right" : "bottom"}
            background={alpha(cs.backgroundColor, 0.5)}
            className={cs.color === '#ffffff' ? 'text-white' : 'text-gray-900'}
          />
          <IconButton
            icon={CropSquare}
            onClick={() => handleAspectChange(SQUARE)}
            title="Square crop"
            tooltipPlacement={hasVerticalControls ? "bottom-right" : "bottom"}
            background={alpha(cs.backgroundColor, 0.5)}
            className={cs.color === '#ffffff' ? 'text-white' : 'text-gray-900'}
          />
          <IconButton
            icon={CropFree}
            onClick={() => handleAspectChange(undefined)}
            title="Free crop"
            tooltipPlacement={hasVerticalControls ? "bottom-right" : "bottom"}
            background={alpha(cs.backgroundColor, 0.5)}
            className={cs.color === '#ffffff' ? 'text-white' : 'text-gray-900'}
          />
          <div className="h-px bg-white/30 my-1" />
          <IconButton
            icon={Rotate90DegreesRight}
            onClick={() => handleRotate(90)}
            title="Rotate 90°"
            tooltipPlacement={hasVerticalControls ? "bottom-right" : "bottom"}
            background={alpha(cs.backgroundColor, 0.5)}
            className={cs.color === '#ffffff' ? 'text-white' : 'text-gray-900'}
          />
          <IconButton
            icon={Rotate5DegreesRight}
            onClick={() => handleRotate(5)}
            title="Rotate 5°"
            tooltipPlacement={hasVerticalControls ? "bottom-right" : "bottom"}
            background={alpha(cs.backgroundColor, 0.5)}
            className={cs.color === '#ffffff' ? 'text-white' : 'text-gray-900'}
          />
          <div className="h-px bg-white/30 my-1" />
          <IconButton
            icon={ArrowUturnLeftIcon}
            onClick={handleRestore}
            title="Restore original"
            tooltipPlacement={hasVerticalControls ? "bottom-right" : "bottom"}
            background={alpha(cs.backgroundColor, 0.5)}
            className={cs.color === '#ffffff' ? 'text-white' : 'text-gray-900'}
          />
          <IconButton
            icon={EyeIcon}
            onClick={handlePreview}
            title="Preview"
            tooltipPlacement={hasVerticalControls ? "bottom-right" : "bottom"}
            background={alpha(cs.backgroundColor, 0.5)}
            className={cs.color === '#ffffff' ? 'text-white' : 'text-gray-900'}
          />
          <div className="h-px bg-white/30 my-1" />
          <IconButton
            icon={ArrowDownTrayIcon}
            onClick={handleSave}
            title="Save"
            tooltipPlacement={hasVerticalControls ? "bottom-right" : "bottom"}
            background={alpha(cs.backgroundColor, 0.5)}
            className={cs.color === '#ffffff' ? 'text-white' : 'text-gray-900'}
            disabled={saving}
          />
        </div>

        {/* Close Button - Top Right */}
        <div className="absolute right-4 top-4 z-10 p-2">
          <IconButton
            icon={XMarkIcon}
            onClick={handleClose}
            title="Close"
            tooltipPlacement="bottom-left"
            background={alpha(cs.backgroundColor, 0.5)}
            className={cs.color === '#ffffff' ? 'text-white' : 'text-gray-900'}
          />
        </div>

        {/* Image with Crop */}
        <div className="relative w-full flex items-center justify-center">
          <ReactCrop
            crop={crop}
            onChange={setCrop}
            onComplete={setCompletedCrop}
            aspect={aspect}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={displayImage}
              alt={photo.title || photo.fileName}
              className={IMAGE_CLASSES}
            />
          </ReactCrop>
        </div>
      </div>
    </div>
  );
}
