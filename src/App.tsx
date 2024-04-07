import { ThemeProvider } from '@emotion/react';
import { PaletteMode, responsiveFontSizes, createTheme, ThemeOptions, CssBaseline} from '@mui/material';
import { useState, useMemo } from 'react';
import './App.css'
import getDesignTokens from './theme/theme';
import ToggleLightMode from './components/ToggleLightMode';

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
              <ThemeProvider theme={theme}> {/*Para aplicar o tema*/}
                  <CssBaseline> {/*Para aplicar o tema escuro no plano de fundo*/}
                      <ToggleLightMode colorMode={colorMode} mode={mode} /> {/*Botão para mudar o tema*/}
                  </CssBaseline>
              </ThemeProvider>
          </>
      );
}

export default App