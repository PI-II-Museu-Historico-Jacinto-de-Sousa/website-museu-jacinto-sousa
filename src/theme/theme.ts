import { PaletteMode} from "@mui/material";
import createTheme from "@mui/material/styles/createTheme";

const getDesignTokens = (mode: PaletteMode) => {
  // ... lógica para definir cores e estilos de acordo com o modo
  const theme = createTheme({
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
          onTertiaryContainer: {
            main: "#1F1C00",
          },
          error: {
            main: "#BA1A1A",
          },
          onError: {
            main: "#FFFFFF",
          },
          errorContainer: {
            main: "#FFDAD6",
          },
          onErrorContainer: {
            main: "#410002",
          },
          Background: {
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
          Background: {
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
    }
  });
  return {
    ...theme,
    typography: {
      pxToRem: (size: number) => `${size / 16}rem`, // Definir função pxToRem
      fontFamily: ['Roboto', 'Robot Serif'].join(','),
      displayLarge: {
        fontFamily: "Roboto Serif",
        fontSize: '57px',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: '64px', /* 112.281% */
        letterSpacing: '-0.25px',
      },
      displayMedium: {
        fontFamily: "Roboto Serif",
        fontSize: '45px',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: '52px',
      },
      displaySmall: {
        fontFamily: "Roboto Serif",
        fontSize: '36px',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: '44px',
      },
      headlineLarge: {
        fontFamily: 'Roboto',
        fontSize: '32px',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: '40px', 
      },
      headlineMedium: {
        fontFamily: 'Roboto',
        fontSize: '28px',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: '36px',
      },
      headlineSmall: {
        fontFamily: 'Roboto',
        fontSize: '24px',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: '32px', 
      },
      titleLarge: {
        fontFamily: 'Roboto',
        fontSize: '22px',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: '28px',
      },
      titleMedium: {
        fontFamily: 'Roboto',
        fontSize: '16px',
        fontStyle: 'normal',
        fontWeight: '500',
        lineHeight: '24px', /* 150% */
        letterspacing: '0.15px',
      },
      titleSmall: {
        fontFamily: 'Roboto',
        fontSize: '14px',
        fontStyle: 'normal',
        fontWeight: '500',
        lineHeight: '20px',
        letterspacing: '0.1px',
      },
      labelLarge: {
        fontFamily: 'Roboto',
        fontSize: '14px',
        fontStyle: 'normal',
        fontWeight: '500',
        lineHeight: '20px',
        letterspacing: '0.1px',
      },
      labelMedium: {
        fontFamily: 'Roboto',
        fontSize: '12px',
        fontStyle: 'normal',
        fontWeight: '500',
        lineHeight: '16px',
        letterspacing: '0.5px',
      },
      labelSmall: {
        fontFamily: 'Roboto',
        fontSize: '11px',
        fontStyle: 'normal',
        fontWeight: '500',
        lineHeight: '16px',
        letterspacing: '0.5px',
      },
      bodyLarge: {
        fontFamily: 'Roboto',
        fontSize: '16px',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: '24px',
        letterspacing: '0.5px',
      },
      bodyMedium: {
        fontFamily: 'Roboto',
        fontSize: '14px',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: '20px',
        letterspacing: '0.25px',
      },
      bodySmall: {
        fontFamily: 'Roboto',
        fontSize: '12px',
        fontStyle: 'normal',
        fontWeight: '400',
        lineHeight: '16px',
        letterspacing: '0.4px',
      },
    },
    
  };
};

//adicionar todas as variantes de texto nas três interfaces
declare module '@mui/material/styles' {
  interface TypographyVariants {
    displayLarge: React.CSSProperties;
    displayMedium: React.CSSProperties;
    displaySmall: React.CSSProperties;
    headlineLarge: React.CSSProperties;
    headlineMedium: React.CSSProperties;
    headlineSmall: React.CSSProperties;
    titleLarge: React.CSSProperties;
    titleMedium: React.CSSProperties;
    titleSmall: React.CSSProperties;
    tabelLarge: React.CSSProperties;
    labelMedium: React.CSSProperties;
    labelSmall: React.CSSProperties;
    bodyLarge: React.CSSProperties;
    bodyMedium: React.CSSProperties;
    bodySmall: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    displayLarge?: React.CSSProperties;
    displayMedium?: React.CSSProperties;
    displaySmall?: React.CSSProperties;
    headlineLarge?: React.CSSProperties;
    headlineMedium?: React.CSSProperties;
    headlineSmall?: React.CSSProperties;
    titleLarge?: React.CSSProperties;
    titleMedium?: React.CSSProperties;
    titleSmall?: React.CSSProperties;
    labelLarge?: React.CSSProperties;
    labelMedium?: React.CSSProperties;
    labelSmall?: React.CSSProperties;
    bodyLarge?: React.CSSProperties;
    bodyMedium?: React.CSSProperties;
    bodySmall?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    displayLarge: true;
    displayMedium: true;
    displaySmall: true;
    headlineLarge: true;
    headlineMedium: true;
    headlineSmall: true;
    titleLarge: true;
    titleMedium: true;
    titleSmall: true;
    labelLarge: true;
    labelMedium: true;
    labelSmall: true;
    bodyLarge: true;
    bodyMedium: true;
    bodySmall: true;
  }
}

declare module '@mui/material/styles/createPalette' {
  interface Palette {
    primaryContainer: PaletteColor;
    onPrimaryContainer: PaletteColor;
    secondaryContainer: PaletteColor;
    onSecondaryContainer: PaletteColor;
    tertiary: PaletteColor;
    tertiaryContainer: PaletteColor;
    Background: PaletteColor;
    onBackground: PaletteColor;
    onTertiary: PaletteColor;
    onTertiaryContainer: PaletteColor;
    errorContainer: PaletteColor;
    onError: PaletteColor;
    onErrorContainer: PaletteColor;
    surfaceTint: PaletteColor;
    surfaceVariant: PaletteColor;
    outline: PaletteColor;
    outlineVariant: PaletteColor;
    shadow: PaletteColor;
    scrim: PaletteColor;
    inverseSurface: PaletteColor;
    inverseOnSurface: PaletteColor;
    inversePrimary: PaletteColor;
    primaryFixed: PaletteColor;
    onPrimary: PaletteColor;
    onPrimaryFixed: PaletteColor;
    primaryFixedDim: PaletteColor;
    onPrimaryFixedVariant: PaletteColor;
    secondaryFixed: PaletteColor;
    onSecondary: PaletteColor;
    onSecondaryFixed: PaletteColor;
    secondaryFixedDim: PaletteColor;
    onSecondaryFixedVariant: PaletteColor;
    tertiaryFixed: PaletteColor;
    onTertiaryFixed: PaletteColor;
    tertiaryFixedDim: PaletteColor;
    onTertiaryFixedVariant: PaletteColor;
    surface: PaletteColor;
    onSurface: PaletteColor;
    onSurfaceVariant: PaletteColor;
    surfaceDim: PaletteColor;
    surfaceBright: PaletteColor;
    surfaceContainerLowest: PaletteColor;
    surfaceContainerLow: PaletteColor;
    surfaceContainer: PaletteColor;
    surfaceContainerHigh: PaletteColor;
    surfaceContainerHighest: PaletteColor;
  }
  interface PaletteOptions {
    primaryContainer?: PaletteColorOptions;
    onPrimaryContainer?: PaletteColorOptions;
    Background?: PaletteColorOptions;
    onBackground?: PaletteColorOptions;
    secondaryContainer?: PaletteColorOptions;
    onSecondaryContainer?: PaletteColorOptions;
    tertiaryContainer?: PaletteColorOptions;
    onTertiaryContainer?: PaletteColorOptions;
    errorContainer?: PaletteColorOptions;
    onError?: PaletteColorOptions;
    onErrorContainer?: PaletteColorOptions;
    surface?: PaletteColorOptions;
    surfaceTint?: PaletteColorOptions;
    surfaceVariant?: PaletteColorOptions;
    outline?: PaletteColorOptions;
    outlineVariant?: PaletteColorOptions;
    shadow?: PaletteColorOptions;
    scrim?: PaletteColorOptions;
    inverseSurface?: PaletteColorOptions;
    inverseOnSurface?: PaletteColorOptions;
    inversePrimary?: PaletteColorOptions;
    primaryFixed?: PaletteColorOptions;
    onPrimary?: PaletteColorOptions;
    onPrimaryFixed?: PaletteColorOptions;
    primaryFixedDim?: PaletteColorOptions;
    onPrimaryFixedVariant?: PaletteColorOptions;
    secondaryFixed?: PaletteColorOptions;
    onSecondary?: PaletteColorOptions;
    onSecondaryFixed?: PaletteColorOptions;
    secondaryFixedDim?: PaletteColorOptions;
    onSecondaryFixedVariant?: PaletteColorOptions;
    tertiary?: PaletteColorOptions;
    onTertiary?: PaletteColorOptions;
    tertiaryFixed?: PaletteColorOptions;
    onTertiaryFixed?: PaletteColorOptions;
    tertiaryFixedDim?: PaletteColorOptions;
    onTertiaryFixedVariant?: PaletteColorOptions;
    surfaceDim?: PaletteColorOptions;
    onSurface?: PaletteColorOptions;
    onSurfaceVariant?: PaletteColorOptions;
    surfaceBright?: PaletteColorOptions;
    surfaceContainerLowest?: PaletteColorOptions;
    surfaceContainerLow?: PaletteColorOptions;
    surfaceContainer?: PaletteColorOptions;
    surfaceContainerHigh?: PaletteColorOptions;
    surfaceContainerHighest?: PaletteColorOptions;
  }
}

export default getDesignTokens;