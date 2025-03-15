import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api/client';

export interface User {
  name: string;
  bio: string;
  pic: string;
  driveFolderId?: string;
  driveFolderName?: string;
}

export interface Guest {
  email: string;
  name: string;
  verified: boolean;
  time: string;
}

export interface UXConfig {
  photoStreamAlbumId: string;
  photoGridCols: number;
  photoItemsLoad: number;
  photoGridSpacing: number;
  showBio: boolean;
  photoBackgroundColor: string;
  photoBorders: "none" | "all" | "left-right";
  colorTheme: "light" | "dark";
  denseTopBar: boolean;
  denseBottomBar: boolean;
}

export interface MPContextType {
  isUser: boolean;
  user: User;
  guest?: Guest;
  uxConfig: UXConfig;
  isLoading: boolean;
}

const defaultUXConfig: UXConfig = {
  photoStreamAlbumId: '',
  photoGridCols: 3,
  photoItemsLoad: 30,
  photoGridSpacing: 1,
  showBio: true,
  photoBackgroundColor: '#000000',
  photoBorders: 'none',
  colorTheme: 'dark',
  denseTopBar: false,
  denseBottomBar: false,
};

const defaultUser: User = {
  name: '',
  bio: '',
  pic: '',
};

export const MPContext = createContext<MPContextType>({
  isUser: false,
  user: defaultUser,
  uxConfig: defaultUXConfig,
  isLoading: true,
});

export const useMPContext = () => useContext(MPContext);

export const MPContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contextValue, setContextValue] = useState<MPContextType>({
    isUser: false,
    user: defaultUser,
    uxConfig: defaultUXConfig,
    isLoading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user config
        const configUrl = new URL('/api/user/config', 'http://localhost:8060').toString();
        const configResponse = await fetch(configUrl, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });
        
        const configText = await configResponse.text();
        const configData = JSON.parse(configText);
        const config = configData.data;

        // Fetch user info
        const userUrl = new URL('/api/user', 'http://localhost:8060').toString();
        const userResponse = await fetch(userUrl, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });

        const userData = await userResponse.json();
        
        setContextValue(prev => ({
          ...prev,
          uxConfig: config,
          isLoading: false,
          user: userData.data || defaultUser,
          isUser: !!userData.data,
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
        setContextValue(prev => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    fetchData();
  }, []);

  return (
    <MPContext.Provider value={contextValue}>
      {children}
    </MPContext.Provider>
  );
}; 