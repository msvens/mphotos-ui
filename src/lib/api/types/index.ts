export enum PhotoOrder {
  None = 0,
  UploadDate,
  OriginalDate,
  ManualOrder
}

export interface AffectedItems {
  numItems: number;
}

export interface PhotoMetadata {
  id: string;
  md5: string;
  source: string;
  sourceDate: string;
  uploadDate: string;
  originalDate: string;
  fileName: string;
  title: string;
  keywords: string;
  description: string;
  cameraMake: string;
  cameraModel: string;
  lensMake?: string;
  lensModel?: string;
  focalLength: string;
  focalLength35: string;
  iso: number;
  exposure: string;
  fNumber: number;
  width: number;
  height: number;
  likes: number;
}

export interface PhotoList {
  length: number;
  photos: PhotoMetadata[];
}

export interface Camera {
  id: string;
  model: string;
  make: string;
  year: number;
  effectivePixels: number;
  totalPixels: number;
  sensorSize: string;
  sensorType: string;
  sensorResolution: string;
  imageResolution: string;
  cropFactor: number;
  opticalZoom: number;
  digitalZoom: boolean;
  iso: string;
  raw: boolean;
  manualFocus: boolean;
  focusRange: number;
  macroFocusRange: number;
  focalLengthEquiv: string;
  aperturePriority: boolean;
  maxAperture: string;
  maxApertureEquiv: string;
  metering: string;
  exposureComp: string;
  shutterPriority: boolean;
  minShutterSpeed: string;
  maxShutterSpeed: string;
  builtInFlash: boolean;
  externalFlash: boolean;
  viewFinder: string;
  videoCapture: boolean;
  maxVideoResolution: string;
  gps: boolean;
  image: string;
}

export interface Album {
  id: string;
  name: string;
  description: string;
  coverPic: string;
  code: string;
  orderBy: PhotoOrder;
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

export interface AuthUser {
  authenticated: boolean;
}

export interface DriveFile {
  id: string;
  name: string;
}

export interface DriveFiles {
  length: number;
  files: DriveFile[];
}

export enum JobState {
  SCHEDULED = 'SCHEDULED',
  STARTED = 'STARTED',
  FINISHED = 'FINISHED',
  ABORTED = 'ABORTED',
}

export interface Job {
  id: string;
  state: JobState;
  percent: number;
  numFiles: number;
  numProcessed: number;
  error?: string;
} 