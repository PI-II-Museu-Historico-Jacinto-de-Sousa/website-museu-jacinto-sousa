import { styled, Theme } from "@mui/material/styles";
import Iframe from "react-iframe";

const LocalizacaoMuseu = styled(Iframe)(({ theme }: { theme: Theme }) => ({
    display: 'flex',
    width: 570,
    height: 360,
    padding: theme.spacing(2),
    alignItems: 'flex-start',
    gap: 7.5,
}))


const SnippetMaps = ({URL}: any) => {
    return (
        <LocalizacaoMuseu 
            url={URL}
        />
    );
};

export default SnippetMaps;