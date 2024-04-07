import { PaletteMode} from "@mui/material";

const getDesignTokens = (mode: PaletteMode) => {
  // ... lógica para definir cores e estilos de acordo com o modo
  return {
    palette: {
      mode,
    ...(mode === "light"
      ? {
          primary: {
            main: "#8D4D2D",
          },
          surfaceTint: {
            main: "#8D4D2D",
          },
          onPrimary: {
            main: "#FFFFFF",
          },
          primaryContainer: {
            main: "#FFDBCC",
          },
          onPrimaryContainer: {
            main: "#351000",
          },
          secondary: {
            main: "#765749",
          },
          onSecondary: {
            main:"#FFFFFF"
          },
          secondaryContainer: {
            main: "#FFDBCC",
          },
          onSecondaryContainer: {
            main: "#2C160B"
          },
          tertiary: {
            main: "#655F31"
          },
          onTertiary: {
            main: "#FFFFFF"
          },
          tertiaryContainer: {
            main: "#EDE4A9"
          },
          onTertiaryContainer: {main: 
            "#1F1C00",
          },
          error: {
            main: "#BA1A1A",
          },
          onError: {
            main: "#FFFFFF",
          },
          errorContainer: {
            maiin: "#FFDAD6",
          },
          onErrorContainer: {
            main: "#410002",
          },
          background: {
            main: "#FFF8F6",
          },
          onBackground: {
            main: "#221A16",
          },
          surface:{
            main: "#FFF8F6",
          },
          onSurface: {
            main: "#221A16",
          },
          surfaceVariant: {
            main: "#F4DED5",
          },
          onSurfaceVariant: {
            main: "#52443D",
          },
          outline: {
            main: "#85736C",
          },
          outlineVariant: {
            main: "#D7C2B9",
          },
          shadow: {
            main: "#000000",
          },
          scrim: {
            main:"#000000",
          },
          inverseSurface: {
            main: "#382E2A",
          },
          inverseOnSurface:{ 
            main:"#FFEDE6",
          },
          inversePrimary: {
            main: "#FFB693",
          },
          primaryFixed: {
            main: "#FFDBCC",
          },
          onPrimaryFixed: {
            main: "#351000",
          },
          primaryFixedDim: {
            main: "#FFB693",
          },
          onPrimaryFixedVariant: {
            main: "#703718",
          } ,
          secondaryFixed: {
            main: "#FFDBCC",
          },
          onSecondaryFixed: {
            main: "#2C160B",
          },
          secondaryFixedDim: {
            main: "#E6BEAC",
          },
          onSecondaryFixedVariant: {
            main: "#5C4033",
          },
          tertiaryFixed: {
            main: "#EDE4A9"
          },
          onTertiaryFixed: {
            main: "#1F1C00",
          },
          tertiaryFixedDim: {
            main: "#D0C890",
          },
          onTertiaryFixedVariant: { 
            main:"#4D481C",
          },
          surfaceDim: {
            main: "#E8D7D0",
          },
          surfaceBright: {
            main: "#FFF8F6",
          },
          surfaceContainerLowest:{
            main: "#FFFFFF",
          },
          surfaceContainerLow: {
            main: "#FFF1EB"
          },
          surfaceContainer: {
            main: "#FCEAE3"
          },
          surfaceContainerHigh: {
            main: "#F6E5DE",
          },
          surfaceContainerHighest: {
            main: "#F0DFD8",
          },
        }
      : {
          primary: {
            main: "#FFB693",
          },
          surfaceTint: {
            main: "#FFB693",
          },
          onPrimary: {
            main: "#542104",
          },
          primaryContainer: {
            main: "#703718",
          },
          onPrimaryContainer: {
            main: "#FFDBCC}",
          },
          secondary: {
            main: "#E6BEAC",
          },
          onSecondary: {
           main: "#432A1E",
          },
          secondaryContainer: {
            main: "#5C4033",
          },
          onSecondaryContainer: {
            main: "#FFDBCC",
          },
          tertiary: {
            main: "#D0C890",
          },
          onTertiary: {
            main: "#363107",
          },
          tertiaryContainer: {
            main: "#4D481C",
          },
          onTertiaryContainer: {
            main: "#EDE4A9",
          },
          error: {
            main: "#FFB4AB",
          },
          onError: {
            main: "#690005",
          },
          errorContainer: {
            main: "#93000A",
          },
          onErrorContainer: {
            main: "#FFDAD6",
          },
          background: {
            main: "#1A120E",
          },
          onBackground: {
            main: "#F0DFD8"
          },
          surface: {
            main: "#1A120E",
          },
          onSurface: {
            main: "#F0DFD8",
          },
          surfaceVariant: {
            main: "#52443D"
          },
          onSurfaceVariant: {
            main: "#D7C2B9",
          },
          outline: {
            main: "#A08D85",
          },
          outlineVariant: {
            main: "#52443D",
          },
          shadow: {
            main: "#000000",
          },
          scrim: {
            main: "#000000",
          },
          inverseSurface: {
            main: "#F0DFD8",
          },
          inverseOnSurface: {
            main:"#382E2A",
          },
          inversePrimary: {
            main: "#8D4D2D",
          },
          primaryFixed: {
            main: "#FFDBCC",
          },
          onPrimaryFixed: {
            main: "#351000",
          },
          primaryFixedDim: {
            main: "#FFB693",
          },
          onPrimaryFixedVariant: {
            main: "#703718",
          },
          secondaryFixed: {
            main: "#FFDBCC",
          },
          onSecondaryFixed: {
            main: "#2C160B",
          },
          secondaryFixedDim: {
            main: "#E6BEAC",
          },
          onSecondaryFixedVariant: {
            main: "#5C4033",
          },
          tertiaryFixed: {
            main: "#EDE4A9",
          },
          onTertiaryFixed: {
            main: "#1F1C00",
          },
          tertiaryFixedDim: {
            main: "#D0C890",
          },
          onTertiaryFixedVariant: {
            main: "#4D481C",
          },
          surfaceDim: {
            main: "#1A120E",
          },
          surfaceBright: {
            main: "#423732",
          },
          surfaceContainerLowest: {
            main: "#140C09",
          },
          surfaceContainerLow: {
            main: "#221A16"
          },
          surfaceContainer: {
            main: "#271E1A",
          },
          surfaceContainerHigh: {
            main: "#322824",
          },
          surfaceContainerHighest: {
            main: "#3D332E",
          }, 
      }),
    },
    typography: {
      fontFamily: ['Roboto', 'Robot Serif'].join(','),
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