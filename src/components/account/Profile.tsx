'use client';

import { useState } from 'react';
import { useMPContext } from '@/context/MPContext';
import { Divider } from "@/components/Divider";
import { Button } from "@/components/Button";

export function Profile() {
  const { user, isUser } = useMPContext();
  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState(user.bio || '');
  const [pic, setPic] = useState(user.pic || '');

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBio(event.target.value);
  };
  const handlePicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPic(event.target.value);
  };

  const handleSubmit = () => {
    // TODO: Implement profile update
    console.log('Update profile:', { name, bio, pic });
  };

  return (
    <div className="space-y-8">
      {/* Debug Info */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <p className="text-blue-600 text-sm">
          <strong>Debug Info:</strong> isUser = {isUser.toString()}
        </p>
      </div>

      <div className="text-center">
        <h1 className="text-2xl font-light mb-4">Profile</h1>
        <p className="text-mui-text-secondary">Edit your profile information!</p>
        <p className="text-blue-600 text-sm">
          <strong>Debug Info:</strong> isUser = {isUser.toString()}
        </p>
      </div>

      <Divider />

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-mui-text-primary">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="w-full p-3 rounded-lg border border-mui-divider bg-transparent text-mui-text-primary placeholder-mui-text-secondary focus:outline-none focus:ring-2 focus:ring-mui-primary focus:border-transparent"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-mui-text-primary">
            Profile Picture
          </label>
          <input
            type="text"
            value={pic}
            onChange={handlePicChange}
            className="w-full p-3 rounded-lg border border-mui-divider bg-transparent text-mui-text-primary placeholder-mui-text-secondary focus:outline-none focus:ring-2 focus:ring-mui-primary focus:border-transparent"
            placeholder="Profile picture URL"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-mui-text-primary">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={handleBioChange}
            rows={4}
            className="w-full p-3 rounded-lg border border-mui-divider bg-transparent text-mui-text-primary placeholder-mui-text-secondary focus:outline-none focus:ring-2 focus:ring-mui-primary focus:border-transparent"
            placeholder="Tell us about yourself"
          />
        </div>

        <Button 
          onClick={handleSubmit}
          color="primary" 
          variant="contained"
          className="h-12 px-8"
        >
          Update Profile
        </Button>
      </div>
    </div>
  );
}
