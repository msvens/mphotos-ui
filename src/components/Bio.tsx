'use client';

import { useMPContext } from '@/context/MPContext';
import { Button } from './Button';
import { useEffect, useState } from 'react';

function getImageSize(isLarge: boolean) {
  return isLarge ? 'w-32 h-32' : 'w-16 h-16';
}

export function Bio() {
  const { isUser, user } = useMPContext();
  const [isLargeDisplay, setIsLargeDisplay] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsLargeDisplay(window.innerWidth >= 640); // sm breakpoint
    }
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!user) return null;

  return (
    <div className="w-full mx-auto">
      <div className="flex flex-wrap items-center justify-center gap-8">
        {user.pic && (
          <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.pic}
              alt={user.name}
              className={`rounded-full object-cover ${getImageSize(isLargeDisplay)}`}
            />
          </div>
        )}
        <div className="text-left">
          <h2 className="text-lg font-semibold mb-3">{user.name}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">{user.bio}</p>
        </div>
        {isUser && (
          <div className="flex items-center">
            <Button variant="outlined" href="/account">Account</Button>
          </div>
        )}
      </div>
    </div>
  );
} 