import { ThemeProvider } from "@emotion/react";
import { responsiveFontSizes, createTheme, ThemeOptions, CssBaseline } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { useState, useMemo } from "react";
import { Outlet } from "react-router-dom";
import getDesignTokens from "./theme/theme";
import useThemeMode from "./hooks/useThemeMode";

const Footer = React.lazy(() => import("./components/Footer/Footer"));
const NavBar = React.lazy(() => import("./components/NavBar/NavBar"));
const ScrollToTop = React.lazy(() => import("./components/ScrollToTop/ScrollToTop"));

const Root = ({ children }: { children?: React.ReactNode }) => {
  const { mode, colorMode } = useThemeMode(); //função para mudar o tema, passada para o componente ToggleLightMode

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
