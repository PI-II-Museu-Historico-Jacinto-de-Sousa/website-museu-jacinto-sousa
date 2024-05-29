import { ThemeProvider } from "@emotion/react";
import { PaletteMode, responsiveFontSizes, createTheme, ThemeOptions, CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState, useMemo } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer/Footer";
import NavBar from "./components/NavBar/NavBar";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import getDesignTokens from "./theme/theme";

const Root = ({ children }: { children?: React.ReactNode }) => {
  const [mode, setMode] = useState<PaletteMode>('light'); //estado do tema escolhido

  const colorMode = useMemo( //função para mudar o tema, passada para o componente ToggleLightMode
    () => ({
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === 'light' ? 'dark' : 'light',
        );
      },
    }),
    [],
  );

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
