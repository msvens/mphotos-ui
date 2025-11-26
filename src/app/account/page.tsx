'use client';

import { useState } from 'react';
import { useMPContext } from '@/context/MPContext';
import { Login } from '@/components/account/Login';
import { Profile } from '@/components/account/Profile';
import { Logout } from '@/components/account/Logout';
import { GoogleDrive } from '@/components/account/GoogleDrive';
import { UxConfig } from '@/components/account/UxConfig';
import { PageSpacing } from '@/components/layout/PageSpacing';
import { SideMenu, MenuItem } from '@/components/SideMenu';

const PROFILE = "profile";
const DRIVE = "drive";
const UXCONFIG = "uxconfig";
const LOGOUT = "logout";

const MenuItems: MenuItem[] = [
  { id: PROFILE, name: "Profile" },
  { id: DRIVE, name: "Google Drive" },
  { id: UXCONFIG, name: "UX Config" },
  { id: LOGOUT, name: "Logout" },
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
    <>
      <PageSpacing />
      <div className="flex flex-col sm:flex-row">
        <SideMenu
          items={MenuItems}
          activeItem={activeSection}
          onItemChange={setActiveSection}
        />

        {/* Right Side Content */}
        <div className="flex-1 pl-4 pr-8">
          {activeSection === PROFILE && <Profile />}
          {activeSection === DRIVE && <GoogleDrive />}
          {activeSection === UXCONFIG && <UxConfig />}
          {activeSection === LOGOUT && <Logout />}
        </div>
      </div>
    </>
  );
} 