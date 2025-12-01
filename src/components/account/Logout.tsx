'use client';

import { useMPContext } from '@/context/MPContext';
import { Button } from "@/components/Button";

export function Logout() {
  const { user, logout } = useMPContext();

  const handleLogout = async () => {
    try {
      await logout();
      // Context will automatically update the UI
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-light mb-4">Logout</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Log out {user.name}. By logging out you will no longer be able to upload pictures, etc.
        </p>
      </div>

      <div className="text-center">
        <Button
          onClick={handleLogout}
          color="warning"
          variant="outlined"
          className="h-12 px-8"
        >
          LOGOUT NOW
        </Button>
      </div>
    </div>
  );
}
