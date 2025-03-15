import { PhotoMetadata } from '../types';
import { API_ENDPOINTS } from '../config';
import { api } from '../client';

export interface PhotosService {
  getPhotos(): Promise<PhotoMetadata[]>;
  getAlbumPhotos(albumId: string): Promise<PhotoMetadata[]>;
  getPhoto(id: string): Promise<PhotoMetadata>;
  updatePhotoMetadata(id: string, metadata: Partial<PhotoMetadata>): Promise<PhotoMetadata>;
  uploadPhoto(file: File): Promise<PhotoMetadata>;
  deletePhoto(id: string): Promise<void>;
  getPhotoUrl(id: string): string;
  getPhotoThumbUrl(id: string): string;
  getPhotoResizeUrl(id: string): string;
}

interface PhotoList {
  length: number;
  photos: PhotoMetadata[];
}

export const photosService: PhotosService = {
  async getPhotos() {
    try {
      const response = await api.get<PhotoList>(API_ENDPOINTS.photos);
      return response.photos;
    } catch (error) {
      console.error('Error fetching photos:', error);
      return [];
    }
  },

  async getAlbumPhotos(albumId: string) {
    try {
      const endpoint = API_ENDPOINTS.albumPhotos(albumId);
      const response = await api.get<PhotoList>(endpoint);
      return response.photos;
    } catch (error) {
      console.error('Error fetching album photos:', error);
      return [];
    }
  },

  async getPhoto(id: string) {
    return api.get<PhotoMetadata>(API_ENDPOINTS.photo(id));
  },

  async updatePhotoMetadata(id: string, metadata: Partial<PhotoMetadata>) {
    return api.put<PhotoMetadata>(API_ENDPOINTS.photoMetadata(id), metadata);
  },

  async uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('image', file, file.name);
    formData.append('sourceId', file.name);
    formData.append('sourceDate', new Date(file.lastModified).toISOString());
    return api.post<PhotoMetadata>(API_ENDPOINTS.photos, formData);
  },

  async deletePhoto(id: string) {
    return api.delete(API_ENDPOINTS.photo(id));
  },

  getPhotoUrl(id: string) {
    return API_ENDPOINTS.photoFile(id);
  },

  getPhotoThumbUrl(id: string) {
    return API_ENDPOINTS.photoThumb(id);
  },

  getPhotoResizeUrl(id: string) {
    return API_ENDPOINTS.photoResize(id);
  },
}; 