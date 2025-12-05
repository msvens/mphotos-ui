import { Guest, AuthUser, ApiResponse, GuestReaction, GuestLike, PhotoComment } from '../types';

export interface RegisterGuestParams {
  name: string;
  email: string;
}

export interface UpdateGuestParams {
  name: string;
  email: string;
}

export interface GuestsService {
  registerGuest(params: RegisterGuestParams): Promise<Guest>;
  verifyGuest(code: string): Promise<Guest>;
  updateGuest(params: UpdateGuestParams): Promise<Guest>;
  getGuest(): Promise<Guest>;
  isGuest(): Promise<boolean>;
  logoutGuest(): Promise<AuthUser>;
  getPhotoLikes(photoId: string): Promise<GuestReaction[]>;
  getGuestLike(photoId: string): Promise<boolean>;
  getGuestLikes(): Promise<string[]>;
  likePhoto(photoId: string): Promise<string>;
  unlikePhoto(photoId: string): Promise<string>;
  getPhotoComments(photoId: string): Promise<PhotoComment[]>;
  commentPhoto(photoId: string, comment: string): Promise<PhotoComment>;
}

const API_BASE = 'http://localhost:8060/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json() as ApiResponse<T>;
    const errorMessage = errorData.error?.message || response.statusText;
    throw new Error(`${response.status}: ${errorMessage}`);
  }
  const data = await response.json() as ApiResponse<T>;
  if (data.error) {
    throw new Error(`${data.error.status}: ${data.error.message}`);
  }
  if (!data.data) {
    throw new Error('No data in response');
  }
  return data.data;
}

export const guestsService: GuestsService = {
  async registerGuest(params: RegisterGuestParams): Promise<Guest> {
    const response = await fetch(`${API_BASE}/guest`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(params),
    });
    return handleResponse<Guest>(response);
  },

  async verifyGuest(code: string): Promise<Guest> {
    const response = await fetch(`${API_BASE}/guest/verify?code=${code}`, {
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse<Guest>(response);
  },

  async updateGuest(params: UpdateGuestParams): Promise<Guest> {
    const response = await fetch(`${API_BASE}/guest/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(params),
    });
    return handleResponse<Guest>(response);
  },

  async getGuest(): Promise<Guest> {
    const response = await fetch(`${API_BASE}/guest`, {
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse<Guest>(response);
  },

  async isGuest(): Promise<boolean> {
    const response = await fetch(`${API_BASE}/guest/is`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await handleResponse<AuthUser>(response);
    return data.authenticated;
  },

  async logoutGuest(): Promise<AuthUser> {
    const response = await fetch(`${API_BASE}/guest/logout`, {
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse<AuthUser>(response);
  },

  async getPhotoLikes(photoId: string): Promise<GuestReaction[]> {
    const response = await fetch(`${API_BASE}/likes/${photoId}`, {
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse<GuestReaction[]>(response);
  },

  async getGuestLike(photoId: string): Promise<boolean> {
    const response = await fetch(`${API_BASE}/guest/likes/${photoId}`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await handleResponse<GuestLike>(response);
    return data.like;
  },

  async getGuestLikes(): Promise<string[]> {
    const response = await fetch(`${API_BASE}/guest/likes`, {
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse<string[]>(response);
  },

  async likePhoto(photoId: string): Promise<string> {
    const response = await fetch(`${API_BASE}/likes/${photoId}/like`, {
      method: 'PUT',
      credentials: 'include',
    });
    return handleResponse<string>(response);
  },

  async unlikePhoto(photoId: string): Promise<string> {
    const response = await fetch(`${API_BASE}/likes/${photoId}/unlike`, {
      method: 'PUT',
      credentials: 'include',
    });
    return handleResponse<string>(response);
  },

  async getPhotoComments(photoId: string): Promise<PhotoComment[]> {
    const response = await fetch(`${API_BASE}/comments/${photoId}`, {
      method: 'GET',
      credentials: 'include',
    });
    return handleResponse<PhotoComment[]>(response);
  },

  async commentPhoto(photoId: string, comment: string): Promise<PhotoComment> {
    const response = await fetch(`${API_BASE}/comments/${photoId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ body: comment }),
    });
    return handleResponse<PhotoComment>(response);
  },
};
