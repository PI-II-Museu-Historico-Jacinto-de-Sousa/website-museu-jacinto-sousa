import { PaletteMode} from "@mui/material";

const getDesignTokens = (mode: PaletteMode) => {
  // ... lógica para definir cores e estilos de acordo com o modo
  return {
    palette: {
      mode,
    ...(mode === "light"
      ? {
          primary: {
            main: '#8D4D2D'
          },
          secondary: {
            main: '#765749'
          },
          tertiary: {
            main: '#655F31'
          },
          error: {
            main: '#BA1A1A'
          },
          background: {
            main: '#FFF8F6'
          },
          outline: {
            main: '#85736C'
          },
        }
      : {
        primary: {
          main: '#FFB693'
        },
        secondary: {
          main: '#E6BEAC'
        },
        tertiary: {
          main: '#D0C890'
        },
        error: {
          main: '#FFB4AB'
        },
        background: {
          main: '#1A120E'
        },
        surface: {
          main: '#FFF8F6'
        },
      }),
    },
    typography: {
      fontFamily: ['Roboto', 'sans-serif'].join(','),
      headline: {
        fontSize: '32px',
      },
      body: {
        fontSize: '24px',
      },
      label: {
        fontSize: '20px'
      },
    },
    
  };
};

export default getDesignTokens