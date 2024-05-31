import { ThemeProvider } from "@emotion/react";
import { responsiveFontSizes, createTheme, ThemeOptions, CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useMemo } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import NavBar from "./components/NavBar/NavBar";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import getDesignTokens from "./theme/theme";
import useThemeMode from "./hooks/useThemeMode";

const Root = ({ children }: { children?: React.ReactNode }) => {
  const { mode, colorMode } = useThemeMode(); //função para mudar o tema, passada para o componente ToggleLightMode

  console.log(mode);
  console.log(colorMode);

  const theme = useMemo(() => responsiveFontSizes(createTheme(getDesignTokens(mode) as ThemeOptions)), [mode]); //quando o modo selecionado muda, o tema é atualizado
  return (<>
    <ThemeProvider theme={theme}> {/*Para aplicar o tema*/}
      <CssBaseline>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'pt-br'}> {/*Contexto para localizacao de componentes material*/}
          <NavBar colorMode={colorMode} mode={mode} />
          <main style={{ flexGrow: 1, }}> {/*Conteúdo principal renderizado em uma rota*/}
            {children ?? <Outlet />}
          </main>
          <ScrollToTop />
          <Footer />
        </LocalizationProvider>
      </CssBaseline>
    </ThemeProvider>
  </>);
}

export default Root
