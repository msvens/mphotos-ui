import { PhotoMetadata, PhotoList, AffectedItems, Album } from '../types';
import { API_ENDPOINTS } from '../config';
import { api } from '../client';

export interface PhotosService {
  getPhotos(): Promise<PhotoList>;
  getPagedPhotos(limit: number, offset: number): Promise<PhotoList>;
  getPhotosByCameraModel(cameraModel: string): Promise<PhotoList>;
  getPhoto(id: string): Promise<PhotoMetadata>;
  updatePhoto(id: string, title: string, description: string, keywords: string): Promise<PhotoMetadata>;
  uploadLocalPhoto(file: File): Promise<PhotoMetadata>;
  deletePhoto(id: string, removeFiles: boolean): Promise<PhotoMetadata>;
  deletePhotos(removeFiles: boolean): Promise<PhotoList>;
  setPhotoAlbums(photoId: string, albumIds: string[]): Promise<AffectedItems>;
  getPhotoAlbums(photoId: string): Promise<Album[]>;
  getThumbUrlId(id: string): string;
  getLandscapeUrl(fileName: string): string;
  getPortraitUrl(fileName: string): string;
  getSquareUrl(fileName: string): string;
  getResizeUrl(fileName: string): string;
  getOriginalUrl(fileName: string): string;
  getPhotoThumbUrl(id: string): string;
  getPhotoResizeUrl(id: string): string;
  getPhotoUrl(id: string): string;
}

export const photosService: PhotosService = {
  async getPhotos() {
    return this.getPagedPhotos(0, 0);
  },

  async getPagedPhotos(limit: number, offset: number) {
    const url = offset
      ? `${API_ENDPOINTS.photos}?limit=${limit}&offset=${offset}`
      : `${API_ENDPOINTS.photos}?limit=${limit}`;
    try {
      return await api.get<PhotoList>(url);
    } catch (error) {
      console.error('Error fetching photos:', error);
      return { length: 0, photos: [] };
    }
  },

  async getPhotosByCameraModel(cameraModel: string) {
    const url = `${API_ENDPOINTS.photos}?cameraModel=${encodeURIComponent(cameraModel)}`;
    try {
      return await api.get<PhotoList>(url);
    } catch (error) {
      console.error('Error fetching photos by camera:', error);
      return { length: 0, photos: [] };
    }
  },

  async getPhoto(id: string) {
    return api.get<PhotoMetadata>(API_ENDPOINTS.photo(id));
  },

  async updatePhoto(id: string, title: string, description: string, keywords: string) {
    const data = {
      id,
      title,
      description,
      keywords: keywords.split(',').map(k => k.trim()).filter(k => k.length > 0),
    };
    return api.put<PhotoMetadata>(API_ENDPOINTS.photo(id), data);
  },

  async uploadLocalPhoto(file: File) {
    const formData = new FormData();
    formData.append('image', file, file.name);
    formData.append('sourceId', file.name);
    formData.append('sourceDate', new Date(file.lastModified).toISOString());
    return api.post<PhotoMetadata>('/api/local/upload', formData);
  },

  async deletePhoto(id: string, removeFiles: boolean) {
    return api.delete<PhotoMetadata>(API_ENDPOINTS.photo(id), { body: { removeFiles } });
  },

  async deletePhotos(removeFiles: boolean) {
    return api.delete<PhotoList>(API_ENDPOINTS.photos, { body: { removeFiles } });
  },

  async setPhotoAlbums(photoId: string, albumIds: string[]) {
    return api.put<AffectedItems>(`${API_ENDPOINTS.photo(photoId)}/albums/set`, { albumIds: albumIds });
  },

  async getPhotoAlbums(photoId: string) {
    return api.get<Album[]>(`${API_ENDPOINTS.photo(photoId)}/albums`);
  },

  getThumbUrlId(id: string) {
    return `/api/thumbs/${id}`;
  },

  getLandscapeUrl(fileName: string) {
    return `/api/landscapes/${fileName}`;
  },

  getPortraitUrl(fileName: string) {
    return `/api/portraits/${fileName}`;
  },

  getSquareUrl(fileName: string) {
    return `/api/squares/${fileName}`;
  },

  getResizeUrl(fileName: string) {
    return `/api/resizes/${fileName}`;
  },

  getOriginalUrl(fileName: string) {
    return `/api/images/${fileName}`;
  },

  getPhotoThumbUrl(id: string) {
    return API_ENDPOINTS.photoThumb(id);
  },

  getPhotoResizeUrl(id: string) {
    return API_ENDPOINTS.photoResize(id);
  },

  getPhotoUrl(id: string) {
    return API_ENDPOINTS.photoFile(id);
  },
}; 