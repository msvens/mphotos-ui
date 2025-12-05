'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { camerasService } from '@/lib/api/services';
import { PageSpacing } from '@/components/layout/PageSpacing';

export default function CameraPage() {
  const router = useRouter();

  useEffect(() => {
    // Fetch cameras and redirect to the first one
    camerasService.getCameras()
      .then((cameras) => {
        if (cameras.length > 0) {
          router.push(`/camera/${cameras[0].id}`);
        }
      })
      .catch((e) => {
        console.error('Error fetching cameras:', e);
      });
  }, [router]);

  return (
    <>
      <PageSpacing />
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    </>
  );
}