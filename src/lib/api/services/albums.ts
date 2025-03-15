import { Album, PhotoMetadata } from '../types';
import { API_ENDPOINTS } from '../config';
import { api } from '../client';

export interface AlbumsService {
  getAlbums(): Promise<Album[]>;
  getAlbum(name: string): Promise<Album>;
  createAlbum(album: Partial<Album>): Promise<Album>;
  updateAlbum(name: string, album: Partial<Album>): Promise<Album>;
  deleteAlbum(name: string): Promise<void>;
  getAlbumPhotos(name: string): Promise<PhotoMetadata[]>;
  updateAlbumPhotos(name: string, photoIds: string[]): Promise<Album>;
  setAlbumCover(name: string, photoId: string): Promise<Album>;
  getAlbumCoverUrl(name: string): string;
}

export const albumsService: AlbumsService = {
  async getAlbums() {
    return api.get<Album[]>(API_ENDPOINTS.albums);
  },

  async getAlbum(name: string) {
    return api.get<Album>(API_ENDPOINTS.album(name));
  },

  async createAlbum(album: Partial<Album>) {
    return api.post<Album>(API_ENDPOINTS.albums, album);
  },

  async updateAlbum(name: string, album: Partial<Album>) {
    return api.put<Album>(API_ENDPOINTS.album(name), album);
  },

  async deleteAlbum(name: string) {
    return api.delete(API_ENDPOINTS.album(name));
  },

  async getAlbumPhotos(name: string) {
    return api.get<PhotoMetadata[]>(API_ENDPOINTS.albumPhotos(name));
  },

  async updateAlbumPhotos(name: string, photoIds: string[]) {
    return api.put<Album>(API_ENDPOINTS.albumPhotos(name), { photos: photoIds });
  },

  async setAlbumCover(name: string, photoId: string) {
    return api.put<Album>(API_ENDPOINTS.albumCover(name), { coverPic: photoId });
  },

  getAlbumCoverUrl(name: string) {
    return API_ENDPOINTS.albumCover(name);
  },
}; 