import { createContext, useContext, useEffect, useState } from 'react';
import { authService, guestsService } from '@/lib/api/services';

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
  verifyTime: string;
}

export interface UXConfig {
  photoStreamAlbumId: string;
  photoGridCols: number;
  photoItemsLoad: number; // DEPRECATED: No longer used, kept for backwards compatibility with old configs
  photoGridSpacing: number;
  showBio: boolean;
  photoBackgroundColor: string;
  photoBorders: "none" | "all" | "left-right";
  colorTheme: "light" | "dark";
  denseTopBar: boolean;
  denseBottomBar: boolean;
  windowFullScreen: boolean;
}

export interface MPContextType {
  isUser: boolean;
  isGuest: boolean;
  user: User;
  guest?: Guest;
  uxConfig: UXConfig;
  isLoading: boolean;
  login: (password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  refreshGuest: () => Promise<void>;
}

const defaultUXConfig: UXConfig = {
  photoStreamAlbumId: '',
  photoGridCols: 3,
  photoItemsLoad: 30,
  photoGridSpacing: 1,
  showBio: true,
  photoBackgroundColor: '#121212',  // Match dark theme background
  photoBorders: 'none',
  colorTheme: 'dark',
  denseTopBar: false,
  denseBottomBar: false,
  windowFullScreen: false,
};

const defaultUser: User = {
  name: '',
  bio: '',
  pic: '',
};

export const MPContext = createContext<MPContextType>({
  isUser: false,
  isGuest: false,
  user: defaultUser,
  uxConfig: defaultUXConfig,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  refreshAuth: async () => {},
  refreshGuest: async () => {},
});

export const useMPContext = () => useContext(MPContext);

export const MPContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contextValue, setContextValue] = useState<MPContextType>({
    isUser: false,
    isGuest: false,
    user: defaultUser,
    uxConfig: defaultUXConfig,
    isLoading: true,
    login: async () => {},
    logout: async () => {},
    refreshAuth: async () => {},
    refreshGuest: async () => {},
  });

  const refreshAuth = async () => {
    try {
      const isLoggedIn = await authService.isLoggedIn();
      
      // Always fetch public user information (for Bio component)
      const userUrl = '/api/user';
      const userResponse = await fetch(userUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      const userData = await userResponse.json();
      const publicUser = userData.data || defaultUser;
      
      // Always fetch user config (both logged in and guest users need UX config)
      let config = defaultUXConfig;
      try {
        const configUrl = '/api/user/config';
        const configResponse = await fetch(configUrl, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });
        
        const configText = await configResponse.text();
        const configData = JSON.parse(configText);
        
        if (configData.data) {
          // Merge server config with defaults to ensure all properties exist
          // Only merge properties that are not undefined from server
          const serverConfig = configData.data;
          config = { ...defaultUXConfig };
          
          // Only override defaults with server values that are not undefined
          if (serverConfig.photoStreamAlbumId !== undefined) config.photoStreamAlbumId = serverConfig.photoStreamAlbumId;
          if (serverConfig.photoGridCols !== undefined) config.photoGridCols = serverConfig.photoGridCols;
          if (serverConfig.photoItemsLoad !== undefined) config.photoItemsLoad = serverConfig.photoItemsLoad;
          if (serverConfig.photoGridSpacing !== undefined) config.photoGridSpacing = serverConfig.photoGridSpacing;
          if (serverConfig.showBio !== undefined) config.showBio = serverConfig.showBio;
          if (serverConfig.photoBackgroundColor !== undefined) config.photoBackgroundColor = serverConfig.photoBackgroundColor;
          if (serverConfig.photoBorders !== undefined) config.photoBorders = serverConfig.photoBorders;
          if (serverConfig.colorTheme !== undefined) config.colorTheme = serverConfig.colorTheme;
          if (serverConfig.denseTopBar !== undefined) config.denseTopBar = serverConfig.denseTopBar;
          if (serverConfig.denseBottomBar !== undefined) config.denseBottomBar = serverConfig.denseBottomBar;
          if (serverConfig.windowFullScreen !== undefined) config.windowFullScreen = serverConfig.windowFullScreen;
        }
      } catch {
        // Use default config if server config fails
        config = defaultUXConfig;
      }
      
      if (isLoggedIn) {
        setContextValue(prev => {
          // Ensure we preserve the complete merged config
          const newValue = {
            ...prev,
            uxConfig: config, // This should be the complete merged config
            user: publicUser,
            isUser: true,
            isLoading: false, // Set loading to false here
          };
          return newValue;
        });
      } else {
        // Not logged in - still use the config but set isUser to false
        setContextValue(prev => {
          // Ensure we preserve the complete merged config
          const newValue = {
            ...prev,
            uxConfig: config, // This should be the complete merged config
            user: publicUser,
            isUser: false,
            isLoading: false, // Set loading to false here
          };
          return newValue;
        });
      }
    } catch (error) {
      console.error('Error refreshing auth:', error);
      // On error, use default config but still try to show public user info
      setContextValue(prev => ({
        ...prev,
        user: defaultUser,
        uxConfig: defaultUXConfig,
        isUser: false,
      }));
    }
  };

  const login = async (password: string) => {
    try {
      await authService.login(password);
      await refreshAuth();
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      // Logout successful - clear user data and set isUser to false
      setContextValue(prev => ({
        ...prev,
        user: defaultUser,
        isUser: false,
      }));
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, we should clear the local state
      setContextValue(prev => ({
        ...prev,
        user: defaultUser,
        isUser: false,
      }));
    }
  };

  const refreshGuest = async () => {
    try {
      const isGuestUser = await guestsService.isGuest();

      if (isGuestUser) {
        // Fetch guest information
        const guestData = await guestsService.getGuest();
        setContextValue(prev => ({
          ...prev,
          isGuest: true,
          guest: guestData,
        }));
      } else {
        // Not a guest - clear guest state
        setContextValue(prev => ({
          ...prev,
          isGuest: false,
          guest: undefined,
        }));
      }
    } catch (error) {
      console.error('Error refreshing guest:', error);
      // On error, set isGuest to false
      setContextValue(prev => ({
        ...prev,
        isGuest: false,
        guest: undefined,
      }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Initial load - check authentication first
        await refreshAuth();
        // Also check for guest authentication
        await refreshGuest();
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

  const contextValueWithMethods: MPContextType = {
    ...contextValue,
    login,
    logout,
    refreshAuth,
    refreshGuest,
  };

  return (
    <MPContext.Provider value={contextValueWithMethods}>
      {children}
    </MPContext.Provider>
  );
}; 