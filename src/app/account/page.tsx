'use client';

import { useState } from 'react';
import { useMPContext } from '@/context/MPContext';
import { Login } from '@/components/account/Login';
import { Profile } from '@/components/account/Profile';
import { Logout } from '@/components/account/Logout';
import { GoogleDrive } from '@/components/account/GoogleDrive';
import { UxConfig } from '@/components/account/UxConfig';
import { Divider } from "@/components/Divider";

const PROFILE = "profile";
const DRIVE = "drive";
const UXCONFIG = "uxconfig";
const LOGOUT = "logout";

const MenuItems = [
  { id: PROFILE, name: "Profile", href: `/account/${PROFILE}` },
  { id: DRIVE, name: "Google Drive", href: `/account/${DRIVE}` },
  { id: UXCONFIG, name: "UX Config", href: `/account/${UXCONFIG}` },
  { id: LOGOUT, name: "Logout", href: `/account/${LOGOUT}` },
];

export default function Account() {
  const { isUser, isLoading } = useMPContext();
  const [activeSection, setActiveSection] = useState(PROFILE);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mui-text-primary mx-auto mb-4"></div>
          <p className="text-mui-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form when not authenticated
  if (!isUser) {
    return <Login />;
  }

  // Show authenticated account interface with navigation
  return (
    <div className="flex gap-8">
      {/* Left Side Navigation Menu */}
      <div className="w-64 flex-shrink-0">
        <div className="sticky top-24">
          <div className="bg-mui-background-paper border border-mui-divider rounded-lg p-4">
            <h2 className="text-lg font-medium mb-4 text-mui-text-primary">Account Settings</h2>
            <nav className="space-y-2">
              {MenuItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-mui-primary text-white'
                        : 'text-mui-text-secondary hover:text-mui-text-primary hover:bg-mui-background-hover'
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Right Side Content */}
      <div className="flex-1">
        {activeSection === PROFILE && <Profile />}
        {activeSection === DRIVE && <GoogleDrive />}
        {activeSection === UXCONFIG && <UxConfig />}
        {activeSection === LOGOUT && <Logout />}
      </div>
    </div>
  );
} 