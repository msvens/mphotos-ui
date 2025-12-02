import { useEffect, useRef, useState } from 'react';

export interface RotatedImage {
  src: string;
  width: number;
  height: number;
}

const PI = Math.PI;
const sin = Math.sin;
const cos = Math.cos;
const abs = Math.abs;

let canvas: HTMLCanvasElement | null = null;
let canvasCtx2D: CanvasRenderingContext2D | null = null;

function getRotatedImage(image: HTMLImageElement | null, rotation: number): RotatedImage | null {
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvasCtx2D = canvas.getContext('2d');
  }

  if (!image || !canvasCtx2D) {
    return null;
  }

  const imageWidth = image.naturalWidth;
  const imageHeight = image.naturalHeight;
  const degree = rotation % 360;

  // No rotation needed
  if (degree === 0) {
    return {
      src: image.src,
      width: imageWidth,
      height: imageHeight,
    };
  }

  // Calculate new canvas dimensions after rotation
  const angle = (degree * PI) / 180;
  const sinAngle = abs(sin(angle));
  const cosAngle = abs(cos(angle));

  const canvasWidth = imageWidth * cosAngle + imageHeight * sinAngle;
  const canvasHeight = imageWidth * sinAngle + imageHeight * cosAngle;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // Clear canvas and reset transform
  canvasCtx2D.clearRect(0, 0, canvasWidth, canvasHeight);
  canvasCtx2D.setTransform(1, 0, 0, 1, 0, 0);

  // Rotate image using canvas transform
  canvasCtx2D.translate(canvasWidth / 2, canvasHeight / 2);
  canvasCtx2D.rotate(angle);
  canvasCtx2D.drawImage(
    image,
    -imageWidth / 2,
    -imageHeight / 2,
    imageWidth,
    imageHeight
  );

  // Reset transform
  canvasCtx2D.setTransform(1, 0, 0, 1, 0, 0);

  return {
    src: canvas.toDataURL('image/png'),
    width: Math.floor(canvasWidth),
    height: Math.floor(canvasHeight),
  };
}

export function useRotateImage(imgSrc: string, rotation: number): RotatedImage | null {
  const [rotatedImage, setRotatedImage] = useState<RotatedImage | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imgSrc;

    img.onload = () => {
      imgRef.current = img;
      const rotated = getRotatedImage(img, rotation);
      setRotatedImage(rotated);
    };

    img.onerror = () => {
      console.error('Failed to load image for rotation');
      setRotatedImage(null);
    };

    return () => {
      imgRef.current = null;
    };
  }, [imgSrc, rotation]);

  return rotatedImage;
}
