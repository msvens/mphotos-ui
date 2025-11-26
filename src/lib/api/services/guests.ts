import { Guest } from '../types';

export interface GuestsService {
  // Guest management operations (to be implemented when needed)
  getGuests(): Promise<Guest[]>;
  getGuest(email: string): Promise<Guest>;
  createGuest(guest: Partial<Guest>): Promise<Guest>;
  updateGuest(email: string, guest: Partial<Guest>): Promise<Guest>;
  deleteGuest(email: string): Promise<void>;
  verifyGuest(email: string, token: string): Promise<Guest>;
}

export const guestsService: GuestsService = {
  async getGuests() {
    // TODO: Implement when backend endpoints are ready
    throw new Error('Guest functionality not yet implemented');
  },

  async getGuest() {
    // TODO: Implement when backend endpoints are ready
    throw new Error('Guest functionality not yet implemented');
  },

  async createGuest() {
    // TODO: Implement when backend endpoints are ready
    throw new Error('Guest functionality not yet implemented');
  },

  async updateGuest() {
    // TODO: Implement when backend endpoints are ready
    throw new Error('Guest functionality not yet implemented');
  },

  async deleteGuest() {
    // TODO: Implement when backend endpoints are ready
    throw new Error('Guest functionality not yet implemented');
  },

  async verifyGuest() {
    // TODO: Implement when backend endpoints are ready
    throw new Error('Guest functionality not yet implemented');
  },
};
