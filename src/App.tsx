import { ThemeProvider } from '@emotion/react';
import { PaletteMode, responsiveFontSizes, createTheme, ThemeOptions, CssBaseline, Typography} from '@mui/material';
import { useState, useMemo } from 'react';
import './App.css'
import getDesignTokens from './theme/theme';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
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

                   
                        <Routes>
                      <Route path="/" element={<Home/>}/>

                      </Routes>
                      <ScrollToTop/>
                 
                        
                  </CssBaseline>
              </ThemeProvider>
              </BrowserRouter>
          </>
      );
      
}


export default App