import { useTheme } from "@emotion/react";
import { styled, Theme } from "@mui/material/styles";
import Iframe from "react-iframe";

const isValidURL = (string: string) => {
  try {
    new URL(string);
  } catch (_) {
    return false;
  }
  return true;
};

const SnippetMaps = ({URL}: {URL: string} ) => {
  const theme = useTheme()
  return (
    <LocalizacaoMuseu
        url={isValidURL(URL) ? URL : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.073013292073!2d-46.633073685021!3d-23.548943467073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce5b8b1b4f3b3d%3A0x3b3d5b3b3b3b3b3b!2sMuseu%20de%20Arte%20de%20S%C3%A3o%20Paulo%20Assis%20Chateaubriand!5e0!3m2!1spt-BR!2sbr!4v1634560000000!5m2!1spt-BR!2sbr" }
    />
  );
};

const LocalizacaoMuseu = styled(Iframe)(({ theme }: { theme: Theme }) => ({
  display: 'flex',
  width: 570,
  height: 360,
  padding: theme.spacing(2),
  alignItems: 'flex-start',
  gap: 7.5,
  [theme.breakpoints.down('sm')]: {
    width: 300,
    height: 200,
  },
}))

export default SnippetMaps;