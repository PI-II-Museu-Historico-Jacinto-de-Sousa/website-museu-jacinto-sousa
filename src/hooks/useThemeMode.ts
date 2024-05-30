import { useState, useEffect } from 'react';
import { PaletteMode } from '@mui/material';

const useThemeMode = () => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem('mode') as PaletteMode;
    return savedMode || 'light'; // Default to 'light' theme if no saved theme
  });

  useEffect(() => {
    localStorage.setItem('mode', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return { mode, setMode, toggleMode };
};

export default useThemeMode;
