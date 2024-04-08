import { ThemeProvider } from '@emotion/react';
import { PaletteMode, responsiveFontSizes, createTheme, ThemeOptions, CssBaseline, Typography} from '@mui/material';
import { useState, useMemo } from 'react';
import './App.css'
import getDesignTokens from './theme/theme';
import Footer from './components/Footer';

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
                    <Footer address='R. Autran Moreno, 202 - Centro, Quixadá - CE, 63900-105' email='museujacintosousa@gmail.com' telephone='(XX) XXXXX - XXXXX' whatsapp='(XX) XXXXX - XXXXX'/>
                    </CssBaseline>
                </ThemeProvider>
            </>
        );
}

export default App