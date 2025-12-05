'use client';

import { useState, useEffect } from 'react';
import { useMPContext } from '@/context/MPContext';
import { userService } from '@/lib/api/services/user';
import { useToast } from '@/context/ToastContext';
import { Divider } from "@/components/Divider";
import { Button } from "@/components/Button";
import { ProfileIcon } from "@/components/ProfileIcon";

export function Profile() {
  const { user, refreshAuth } = useMPContext();
  const toast = useToast();
  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState(user.bio || '');
  const [pic, setPic] = useState(user.pic || '');
  const [picError, setPicError] = useState(false);

  // Check if current profile picture is valid
  useEffect(() => {
    if (user.pic) {
      const img = new Image();
      img.onload = () => setPicError(false);
      img.onerror = () => setPicError(true);
      img.src = user.pic;
    } else {
      setPicError(false);
    }
  }, [user.pic]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(event.target.value);
  };
  const handlePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPic(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      await userService.updateUser(name, bio, pic);
      await refreshAuth(); // Refresh user data in context
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-light mb-4">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">Edit your profile information</p>
      </div>

      <Divider />

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
            Profile Picture
          </label>
          <input
            type="text"
            value={pic}
            onChange={handlePicChange}
            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Profile picture URL"
          />

          {/* Warning if current picture is broken */}
          {picError && (
            <div className="mt-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">
                ⚠️ Your profile picture is broken or the photo has been deleted
              </p>
            </div>
          )}

          {/* Preview current picture */}
          <div className="mt-3 flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Current picture:</span>
            {user.pic && !picError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.pic}
                alt="Profile preview"
                onError={() => setPicError(true)}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <ProfileIcon className="w-16 h-16 text-gray-400 dark:text-gray-500" />
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={handleBioChange}
            rows={4}
            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Tell us about yourself"
          />
        </div>

        <Button
          onClick={handleSubmit}
          className="h-12 px-8"
        >
          UPDATE PROFILE
        </Button>
      </div>
    </div>
  );
}
