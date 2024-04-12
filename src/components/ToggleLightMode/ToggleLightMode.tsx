import { IconButton, PaletteMode } from "@mui/material";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';


const ToggleLightMode = ({ colorMode, mode }: { colorMode: { toggleColorMode: () => void; }, mode: PaletteMode }) => {
    return (
        <>
            <IconButton onClick={colorMode.toggleColorMode}>
                {mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
        </>
    )
}

export default ToggleLightMode;