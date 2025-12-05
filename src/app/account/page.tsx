'use client';

import { useState } from 'react';
import { useMPContext } from '@/context/MPContext';
import { Login } from '@/components/account/Login';
import { Profile } from '@/components/account/Profile';
import { Logout } from '@/components/account/Logout';
import { GoogleDrive } from '@/components/account/GoogleDrive';
import { LocalDrive } from '@/components/account/LocalDrive';
import { UxConfig } from '@/components/account/UxConfig';
import { Maintenance } from '@/components/account/Maintenance';
import { PageSpacing } from '@/components/layout/PageSpacing';
import { SideMenu, MenuItem } from '@/components/SideMenu';

const PROFILE = "profile";
const GOOGLE_DRIVE = "googledrive";
const LOCAL_DRIVE = "localdrive";
const UXCONFIG = "uxconfig";
const MAINTENANCE = "maintenance";
const LOGOUT = "logout";

const MenuItems: MenuItem[] = [
  { id: PROFILE, name: "Profile" },
  { id: GOOGLE_DRIVE, name: "Google Drive" },
  { id: LOCAL_DRIVE, name: "Local Drive" },
  { id: UXCONFIG, name: "UX Config" },
  { id: MAINTENANCE, name: "Maintenance" },
  { id: LOGOUT, name: "Logout" },
];

export default function Account() {
  const { isUser, isLoading } = useMPContext();
  const [activeSection, setActiveSection] = useState(PROFILE);

  return (
    <>
      <PageSpacing />

      {/* Show loading state */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      )}

      {/* Show login form when not authenticated */}
      {!isLoading && !isUser && <Login />}

      {/* Show authenticated account interface with navigation */}
      {!isLoading && isUser && (
        <div className="flex flex-col sm:flex-row">
          <SideMenu
            items={MenuItems}
            activeItem={activeSection}
            onItemChange={setActiveSection}
          />

          {/* Right Side Content */}
          <div className="flex-1 pl-4 pr-8">
            {activeSection === PROFILE && <Profile />}
            {activeSection === GOOGLE_DRIVE && <GoogleDrive />}
            {activeSection === LOCAL_DRIVE && <LocalDrive />}
            {activeSection === UXCONFIG && <UxConfig />}
            {activeSection === MAINTENANCE && <Maintenance />}
            {activeSection === LOGOUT && <Logout />}
          </div>
        </div>
      )}
    </>
  );
} 