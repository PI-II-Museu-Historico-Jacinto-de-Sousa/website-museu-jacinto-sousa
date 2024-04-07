import { Switch, useTheme } from "@mui/material";

const ToggleLightMode = ({ toggle }: { toggle: () => void }) => {
    const theme = useTheme()
    return (<>
        <Switch onChange={toggle} />
        <p>{theme.palette.mode}</p></>
    );
}

export default ToggleLightMode;