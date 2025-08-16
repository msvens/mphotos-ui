export interface PhotoMetadata {
  id: string;
  fileName: string;
  fileType: string;
  camera: string;
  lens: string;
  taken: string;
  uploaded: string;
  iso: number;
  exposure: string;
  aperture: string;
  focal: string;
  flash: string;
  width: number;
  height: number;
  title: string;
  description: string;
  keywords: string[];
  albums: string[];
  isPrivate: boolean;
}

export interface Camera {
  name: string;
  manufacturer: string;
  model: string;
  introduced: string;
  discontinued: string;
  type: string;
  mount: string;
  format: string;
  pixels: string;
  description: string;
  image: string;
}

export interface Album {
  name: string;
  title: string;
  description: string;
  created: string;
  updated: string;
  coverPic: string;
  photos: string[];
}

export interface User {
  name: string;
  email: string;
  bio: string;
  image: string;
  driveFolderId?: string;
  driveFolderName?: string;
}

export interface Guest {
  email: string;
  name: string;
  verified: boolean;
  time: string;
}

export interface Config {
  columns: number;
  spacing: number;
  photoPath: string;
  thumbPath: string;
  drivePath: string;
  driveConfigured: boolean;
}

export interface ApiError {
  status: number;
  message: string;
}

export type ApiResponse<T> = {
  data?: T;
  error?: ApiError;
} 