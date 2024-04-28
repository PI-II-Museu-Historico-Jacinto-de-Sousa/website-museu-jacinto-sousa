import { ThemeProvider } from '@emotion/react';
import { CssBaseline, PaletteMode, ThemeOptions, createTheme, responsiveFontSizes } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/pt-br';
import { useMemo, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CriarItemAcervo from './pages/CriarItemAcervo';
import Home from './pages/Home';
import getDesignTokens from './theme/theme';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

function App() {

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
  return (
    <>
      <BrowserRouter>
        <ThemeProvider theme={theme}> {/*Para aplicar o tema*/}
          <CssBaseline>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'pt-br'}> {/*Contexto para localizacao de componentes material*/}
              <main style={{ flexGrow: 1 }}> {/*Conteúdo principal renderizado em uma rota*/}
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/acervo/criar-item" element={<CriarItemAcervo />} />
                </Routes>
              </main>
              <ScrollToTop />
              <Footer />
            </LocalizationProvider>
          </CssBaseline>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );

}


export default App
