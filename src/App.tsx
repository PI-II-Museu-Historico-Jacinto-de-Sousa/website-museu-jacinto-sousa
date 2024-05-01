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
import SnippetMaps from './components/SnippetMaps/SnippetMaps';

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
            <SnippetMaps URL="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.7683535114555!2d-39.013285085532314!3d-4.971648897769986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7aef39332e0fc39%3A0xd69d26b774a16276!2sMuseu%20Jacinto%20de%20Sousa!5e0!3m2!1spt-BR!2sbr!4v1650815010175!5m2!1spt-BR!2sbr">
              
            </SnippetMaps>
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
