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
        url={isValidURL(URL) ? URL : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.7683535114555!2d-39.013285085532314!3d-4.971648897769986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7aef39332e0fc39%3A0xd69d26b774a16276!2sMuseu%20Jacinto%20de%20Sousa!5e0!3m2!1spt-BR!2sbr!4v1650815010175!5m2!1spt-BR!2sbr"}
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