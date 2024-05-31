import { useState, useEffect, useMemo } from 'react';
import { PaletteMode } from '@mui/material';

const useThemeMode = () => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem('mode') as PaletteMode;
    return savedMode || 'light'; // Default to 'light' theme if no saved theme
  });
  const savedColorMode = useMemo(() => ({
    toggleColorMode: () => {
      setMode((prevMode: PaletteMode) =>
        prevMode === 'light' ? 'dark' : 'light',
      );
    },
  }), []);

  const [colorMode, setColorMode] = useState(savedColorMode || '{}'); // Default to 'light' theme if no saved theme

  useEffect(() => {
    localStorage.setItem('mode', mode);
    localStorage.setItem('colorMode', JSON.stringify(colorMode));
  }, [mode, colorMode]);

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };



  return { mode, setMode, toggleMode, colorMode, setColorMode };
};

export default useThemeMode;
