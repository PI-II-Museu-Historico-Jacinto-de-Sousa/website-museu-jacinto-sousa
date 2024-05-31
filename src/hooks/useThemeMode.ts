import { useState, useEffect, useMemo } from 'react';
import { PaletteMode } from '@mui/material';

const useThemeMode = () => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem('mode') as PaletteMode;
    return savedMode || 'light'; // Default to 'light' theme if no saved theme
  });

  const colorMode = useMemo(() => ({
    toggleColorMode: () => {
      setMode((prevMode: PaletteMode) =>
        prevMode === 'light' ? 'dark' : 'light',
      );
    },
  }), []);

  useEffect(() => {
    localStorage.setItem('mode', mode);
  }, [mode]);

  return { mode, setMode, colorMode };
};

export default useThemeMode;
