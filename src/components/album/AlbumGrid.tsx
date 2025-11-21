'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Album } from '@/lib/api/types';
import { albumsService } from '@/lib/api/services';
import { useMPContext } from '@/context/MPContext';
import { AlbumAddDialog } from './AlbumAddDialog';
import { AlbumEditDialog } from './AlbumEditDialog';
import { AlbumDeleteDialog } from './AlbumDeleteDialog';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '../Button';

function AddAlbumCard({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col bg-mui-background-paper rounded overflow-hidden">
      <img
        src="/photo-album.jpg"
        alt="Add Album"
        className="w-full h-48 object-cover"
      />
      <div className="p-4 flex-grow flex flex-col justify-between">
        <p className="text-sm text-mui-text-secondary mb-4">
          Create a new Photo album. After you can add photos to it from the photo view
        </p>
        <Button variant="text" onClick={onAdd} className="self-start">
          ADD ALBUM
        </Button>
      </div>
    </div>
  );
}

interface AlbumCardProps {
  album: Album;
  isAdmin: boolean;
  onEdit: (album: Album) => void;
  onDelete: (album: Album) => void;
}

function AlbumCard({ album, isAdmin, onEdit, onDelete }: AlbumCardProps) {
  const getCoverImage = () => {
    return album.coverPic || '/photo-album.jpg';
  };

  const getAlbumLink = () => {
    if (album.code) {
      return `/album/${album.id}?code=${encodeURIComponent(album.code)}`;
    }
    return `/album/${album.id}`;
  };

  return (
    <div className="flex flex-col bg-mui-background-paper rounded overflow-hidden">
      <Link href={getAlbumLink()} className="block">
        <img
          src={getCoverImage()}
          alt={album.name}
          className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
        />
        <div className="p-4">
          <h3 className="text-lg font-medium text-mui-text-primary mb-1">
            {album.name}
          </h3>
          <p className="text-sm text-mui-text-secondary">
            {album.description}
          </p>
        </div>
      </Link>
      {isAdmin && (
        <div className="px-4 pb-4 flex gap-2">
          <button
            onClick={() => onEdit(album)}
            className="p-2 text-mui-text-secondary hover:text-mui-text-primary transition-colors"
            aria-label="Edit Album"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(album)}
            className="p-2 text-mui-text-secondary hover:text-mui-text-primary transition-colors"
            aria-label="Delete Album"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export function AlbumGrid() {
  const { isUser } = useMPContext();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | undefined>(undefined);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Fetch albums on mount
  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const albumList = await albumsService.getAlbums();
      setAlbums(albumList);
    } catch (error) {
      console.error('Error fetching albums:', error);
      alert('Failed to fetch albums');
    }
  };

  const handleAdd = () => {
    setShowAdd(true);
  };

  const handleEdit = (album: Album) => {
    setSelectedAlbum(album);
    setShowEdit(true);
  };

  const handleDelete = (album: Album) => {
    setSelectedAlbum(album);
    setShowDelete(true);
  };

  const closeAdd = async (albumData?: Partial<Album>) => {
    if (albumData) {
      try {
        await albumsService.createAlbum(
          albumData.name || '',
          albumData.description || '',
          albumData.coverPic || ''
        );
        await fetchAlbums();
        setSelectedAlbum(undefined);
      } catch (error) {
        console.error('Error creating album:', error);
        alert('Failed to create album');
      }
    }
    setShowAdd(false);
  };

  const closeEdit = async (album?: Album) => {
    if (album) {
      try {
        await albumsService.updateAlbum(album);
        await fetchAlbums();
      } catch (error) {
        console.error('Error updating album:', error);
        alert('Failed to update album');
      }
    }
    setShowEdit(false);
  };

  const closeDelete = async (album?: Album) => {
    if (album) {
      try {
        await albumsService.deleteAlbum(album.id);
        await fetchAlbums();
        setSelectedAlbum(undefined);
      } catch (error) {
        console.error('Error deleting album:', error);
        alert('Failed to delete album');
      }
    }
    setShowDelete(false);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {isUser && <AddAlbumCard onAdd={handleAdd} />}
        {albums.map((album) => (
          <AlbumCard
            key={album.id}
            album={album}
            isAdmin={isUser}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {isUser && (
        <>
          <AlbumAddDialog open={showAdd} onClose={closeAdd} />
          <AlbumEditDialog
            open={showEdit}
            album={selectedAlbum}
            onClose={closeEdit}
          />
          <AlbumDeleteDialog
            open={showDelete}
            album={selectedAlbum}
            onClose={closeDelete}
          />
        </>
      )}
    </>
  );
}