import { IconButton, PaletteMode } from "@mui/material";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const saveDateLocalStorage = ({ colorMode, mode }: { colorMode: { toggleColorMode: () => void; }, mode: PaletteMode }) => {
    localStorage.setItem('colorMode', mode);
    colorMode.toggleColorMode();
    console.log('colorMode', mode);
}

const ToggleLightMode = ({ colorMode, mode }: { colorMode: { toggleColorMode: () => void; }, mode: PaletteMode }) => {
  saveDateLocalStorage({ colorMode, mode });
    return (
        <>
            <IconButton onClick={colorMode.toggleColorMode}>
                {mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
        </>
    )
}

export default ToggleLightMode;
