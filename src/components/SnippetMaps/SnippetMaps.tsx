
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
  return (
    <LocalizacaoMuseu
        url={isValidURL(URL) ? URL : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3974.821148276373!2d-39.014886525425894!3d-4.9693763507430075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7be9fbc1dcba093%3A0x5ff17d1b7352a1ff!2sMuseu%20Hist%C3%B3rico%20Jacinto%20de%20Sousa!5e0!3m2!1spt-BR!2sbr!4v1715726991967!5m2!1spt-BR!2sbr"}
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


