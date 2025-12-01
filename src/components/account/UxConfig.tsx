
'use client';

import { useEffect, useState } from 'react';
import { useMPContext, UXConfig } from '@/context/MPContext';
import { Album } from '@/lib/api/types';
import { albumsService } from '@/lib/api/services';
import { userService } from '@/lib/api/services/user';
import { TextField } from '@/components/TextField';
import { Select } from '@/components/Select';
import { RadioGroup } from '@/components/RadioGroup';
import { ToggleSwitch } from '@/components/ToggleSwitch';
import { Button } from '@/components/Button';
import { useToast } from '@/context/ToastContext';

// Color constants matching the old implementation
const Colors = {
  White: '#ffffff',
  Light: '#fafafa',
  Grey: '#bdbdbd',
  Dark: '#303030',
  Black: '#121212',  // Match dark theme background
};

const gridSpacings = [
  { value: '0', label: 'None' },
  { value: '5', label: 'Thin' },
  { value: '10', label: 'Normal' },
  { value: '15', label: 'Thick' },
];

export function UxConfig() {
  const { uxConfig, refreshAuth } = useMPContext();
  const toast = useToast();

  const [albums, setAlbums] = useState<Album[]>([]);
  const [cols, setCols] = useState<number>(4);
  const [loadItems, setLoadItems] = useState<number>(12);
  const [gridSpacing, setGridSpacing] = useState<number>(0);
  const [showBio, setShowBio] = useState<boolean>(false);
  const [photoBackground, setPhotoBackground] = useState<string>(Colors.Dark);
  const [photoBorders, setPhotoBorders] = useState<'all' | 'none' | 'left-right'>('none');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [denseTopBar, setDenseTopBar] = useState<boolean>(false);
  const [denseBottomBar, setDenseBottomBar] = useState<boolean>(false);
  const [albumId, setAlbumId] = useState<string>('');

  // Initialize form from context
  useEffect(() => {
    setCols(uxConfig.photoGridCols);
    setLoadItems(uxConfig.photoItemsLoad);
    setGridSpacing(uxConfig.photoGridSpacing);
    setShowBio(uxConfig.showBio);
    setPhotoBackground(uxConfig.photoBackgroundColor);
    setTheme(uxConfig.colorTheme);
    setDenseTopBar(uxConfig.denseTopBar);
    setDenseBottomBar(uxConfig.denseBottomBar);
    setPhotoBorders(uxConfig.photoBorders);
    setAlbumId(uxConfig.photoStreamAlbumId);
  }, [uxConfig]);

  // Fetch albums for photostream dropdown
  useEffect(() => {
    albumsService.getAlbums()
      .then(setAlbums)
      .catch(e => console.error('Error fetching albums:', e));
  }, []);

  const handleUpdate = async () => {
    try {
      const config: UXConfig = {
        photoGridCols: cols,
        photoGridSpacing: gridSpacing,
        photoItemsLoad: loadItems,
        showBio: showBio,
        photoBackgroundColor: photoBackground,
        colorTheme: theme,
        denseTopBar: denseTopBar,
        denseBottomBar: denseBottomBar,
        photoBorders: photoBorders,
        photoStreamAlbumId: albumId,
        windowFullScreen: uxConfig.windowFullScreen, // Preserve existing value
      };
      await userService.updateUserConfig(config);
      await refreshAuth(); // Reload config in context
      toast.success('Configuration saved successfully');
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Failed to save configuration');
    }
  };

  // Build album options for Select
  const albumOptions = albums.map(a => ({ value: a.id, label: a.name }));

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Grid Columns */}
      <TextField
        id="cols"
        label="Grid Columns"
        value={cols.toString()}
        onChange={(e) => setCols(Number(e.target.value) || 1)}
        type="number"
        fullWidth
      />

      {/* Grid Spacing */}
      <Select
        id="gridSpacing"
        label="Grid Spacing"
        value={gridSpacing.toString()}
        onChange={(val) => setGridSpacing(Number(val))}
        options={gridSpacings}
        fullWidth
      />

      {/* Photostream Album */}
      <Select
        id="photoStreamAlbum"
        label="Photostream Album"
        value={albumId}
        onChange={setAlbumId}
        options={albumOptions}
        placeholder="Select an album..."
        fullWidth
      />

      {/* Toggle Switches Row */}
      <div className="grid grid-cols-3 gap-4 py-4">
        <ToggleSwitch
          checked={showBio}
          onChange={setShowBio}
          label="Show Bio"
        />
        <ToggleSwitch
          checked={denseTopBar}
          onChange={setDenseTopBar}
          label="Dense Topbar"
        />
        <ToggleSwitch
          checked={denseBottomBar}
          onChange={setDenseBottomBar}
          label="Dense Bottombar"
        />
      </div>

      {/* Radio Groups Row */}
      <div className="grid grid-cols-3 gap-8 py-4">
        {/* Photo Background */}
        <RadioGroup
          label="Photo Background"
          value={photoBackground}
          onChange={setPhotoBackground}
          options={[
            { value: Colors.White, label: 'White' },
            { value: Colors.Light, label: 'Light' },
            { value: Colors.Grey, label: 'Grey' },
            { value: Colors.Dark, label: 'Dark' },
            { value: Colors.Black, label: 'Black' },
          ]}
        />

        {/* Photo Borders */}
        <RadioGroup
          label="Photo Borders"
          value={photoBorders}
          onChange={(v) => setPhotoBorders(v as 'none' | 'left-right' | 'all')}
          options={[
            { value: 'none', label: 'None' },
            { value: 'left-right', label: 'Left-Right' },
            { value: 'all', label: 'All' },
          ]}
        />

        {/* Site Theme */}
        <RadioGroup
          label="Site Theme"
          value={theme}
          onChange={(v) => setTheme(v as 'light' | 'dark')}
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
          ]}
        />
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <Button
          onClick={handleUpdate}
        >
          SAVE CONFIG
        </Button>
      </div>
    </div>
  );
}