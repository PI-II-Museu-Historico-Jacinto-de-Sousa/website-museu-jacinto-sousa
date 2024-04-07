import { CssBaseline, PaletteMode, ThemeProvider, createTheme, IconButton, ThemeOptions, responsiveFontSizes} from '@mui/material'
import { useMemo, useState } from 'react'
import './App.css'
import getDesignTokens from './theme/theme'
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

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
          <IconButton onClick={colorMode.toggleColorMode}>
            {mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </CssBaseline>
      </ThemeProvider>
    </>
  )
}

export default App