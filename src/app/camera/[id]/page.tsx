'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { camerasService } from '@/lib/api/services';
import { Camera } from '@/lib/api/types';
import { SideMenu, MenuItem } from '@/components/SideMenu';
import { PageSpacing } from '@/components/layout/PageSpacing';
import { CameraDetail } from '@/components/camera/CameraDetail';

export default function CameraDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cameraId = params.id as string;

  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    camerasService.getCameras()
      .then((cams) => {
        setCameras(cams);
        // Find the camera with the ID from the URL
        const camera = cams.find(c => c.id === cameraId);
        if (camera) {
          setSelectedCamera(camera);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error('Error fetching cameras:', e);
        setLoading(false);
      });
  }, [cameraId]);

  const menuItems: MenuItem[] = cameras.map(cam => ({
    id: cam.id,
    name: cam.model
  }));

  const handleCameraChange = (newCameraId: string) => {
    // Navigate to the new camera's page
    router.push(`/camera/${newCameraId}`);
  };

  const handleCameraUpdate = (updatedCamera: Camera) => {
    // Update camera in the list
    setCameras(prev => prev.map(c => c.id === updatedCamera.id ? updatedCamera : c));
    setSelectedCamera(updatedCamera);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!selectedCamera) {
    return (
      <>
        <PageSpacing />
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Camera not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageSpacing />
      <div className="flex flex-col sm:flex-row">
        <SideMenu
          items={menuItems}
          activeItem={selectedCamera.id}
          onItemChange={handleCameraChange}
        />

        {/* Right Side Content */}
        <div className="flex-1 pl-4 pr-8">
          <CameraDetail
            camera={selectedCamera}
            onUpdate={handleCameraUpdate}
          />
        </div>
      </div>
    </>
  );
}