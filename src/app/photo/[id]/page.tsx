'use client';

import { PhotoDeck } from '@/components/photodeck/PhotoDeck';
import { usePhotoContext } from '../layout';
import { useMPContext } from '@/context/MPContext';
import { use } from 'react';
import { PageSpacing } from '@/components/layout/PageSpacing';

interface PhotoPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function PhotoPage({ params, searchParams }: PhotoPageProps) {
  const { photos, isLoading, error } = usePhotoContext();
  const { isUser } = useMPContext();
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);
  const searchQuery = resolvedSearchParams.q ? `?q=${resolvedSearchParams.q}` : '';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-gray-400">Loading photos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <>
      <PageSpacing height="no_spacing" />
      <PhotoDeck
        photos={photos}
        startPhotoId={resolvedParams.id}
        urlPrefix="/photo/"
        searchQuery={searchQuery}
        editControls={isUser}
      />
    </>
  );
} 