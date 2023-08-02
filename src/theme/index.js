import {
  createTheme as createMuiTheme,
  responsiveFontSizes,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import { LoadingScreen } from "components/index";
import { LayoutContext } from "contexts/index";
import "@fontsource/montserrat";
import merge from "lodash/merge";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { THEMES } from "../constants/theme";
import { darkShadows, lightShadows } from "./shadows";

const baseOptions = {
  direction: "ltr",
  components: {
    MuiAvatar: {
      styleOverrides: {
        fallback: {
          height: "75%",
          width: "75%",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          "&:hover": {
            backgroundColor: "transparent",
          },
          backgroundColor: "#0D539B",
          fontFamily: "Roboto, sans-serif",
          color: "white",
          borderRadius: "8px",
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#ffffff",
          "&$checked": {
            color: "#ffffff",
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            height: "30px",
            borderRadius: "2px",
            marginTop: "-3%",
            fontSize: "12px",
            backgroundColor: "#162A3C",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "12px",
          color: "#ffffff", // Set the text color for the InputLabel
          fontWeight: "300",
        },
      },
    },

    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: {
          variant: "h6",
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          overflow: "hidden",
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: "auto",
          marginRight: "16px",
        },
      },
    },
  },
  typography: {
    button: {
      fontWeight: 400,
      fontSize: "12px",
    },
    fontFamily: "Montserrat, sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: "3.5rem",
      color: "#ffffff", // Set h1 color to black (#000000)
    },
    h2: {
      fontWeight: 600,
      fontSize: "3rem",
      color: "#000000", // Set h2 color to black (#000000)
    },
    h3: {
      fontWeight: 600,
      fontSize: "2.25rem",
      color: "#000000", // Set h3 color to black (#000000)
    },
    h4: {
      fontWeight: 600,
      fontSize: "2rem",
      color: "#000000", // Set h4 color to black (#000000)
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.5rem",
      color: "#ffffff", // Set h5 color to black (#000000)
    },
    h6: {
      fontWeight: 500,
      fontSize: "1rem",
      color: "#717F8B", // Set h6 color to black (#000000)
    },
    overline: {
      fontWeight: 600,
    },
    body2: {
      color: "#717F8B",
      fontSize: "12px",
    },
  },
};

const themesOptions = {
  [THEMES.LIGHT]: {
    components: {
      MuiInputBase: {
        styleOverrides: {
          input: {
            "&::placeholder": {
              opacity: 0.86,
              color: "#000000", // Set input placeholder color to black (#000000)
            },
            "&:focus": {
              borderColor: "transparent",
            },
          },
        },
      },
    },
    palette: {
      action: {
        active: "#000000", // Set action color to black (#000000)
      },
      background: {
        default: "#122433",
        secondary: "#162A3C",
        paper: "#000000",
      },
      error: {
        contrastText: "#ff0000", // Set error contrast text color to black (#000000)
        main: "#ff0000", // Set error main color to black (#000000)
      },
      mode: "light",
      primary: {
        contrastText: "#000000", // Set primary contrast text color to black (#000000)
        main: "#000000", // Set primary main color to black (#000000)
      },
      success: {
        contrastText: "#000000", // Set success contrast text color to black (#000000)
        main: "#000000", // Set success main color to black (#000000)
      },
      text: {
        primary: "#ffffff", // Set primary text color to black (#000000)
        secondary: "#000000", // Set secondary text color to black (#000000)
      },
      warning: {
        contrastText: "#000000", // Set warning contrast text color to black (#000000)
        main: "#000000", // Set warning main color to black (#000000)
      },
    },
    shadows: lightShadows,
  },
  [THEMES.DARK]: {
    components: {
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: "1px solid rgba(145, 158, 171, 0.24)",
          },
        },
      },
    },
    palette: {
      background: {
        default: "#000000", // Set default background color to black (#000000)
        paper: "#000000", // Set paper background color to black (#000000)
      },
      button: {
        default: "#000000", // Set button default color to black (#000000)
      },
      divider: "rgba(0, 0, 0, 0.24)", // Set divider color to black (#000000) with 0.24 opacity
      error: {
        contrastText: "#000000", // Set error contrast text color to black (#000000)
        main: "#000000", // Set error main color to black (#000000)
      },
      mode: "dark",
      primary: {
        contrastText: "#000000", // Set primary contrast text color to black (#000000)
        main: "#000000", // Set primary main color to black (#000000)
      },
      success: {
        contrastText: "#000000", // Set success contrast text color to black (#000000)
        main: "#000000", // Set success main color to black (#000000)
      },
      text: {
        primary: "#000000", // Set primary text color to black (#000000)
        secondary: "#000000", // Set secondary text color to black (#000000)
      },
      warning: {
        contrastText: "#000000", // Set warning contrast text color to black (#000000)
        main: "#000000", // Set warning main color to black (#000000)
      },
    },
    shadows: darkShadows,
  },
  [THEMES.NATURE]: {
    components: {
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: "1px solid rgba(145, 158, 171, 0.24)",
          },
        },
      },
    },
    palette: {
      background: {
        default: "#000000", // Set default background color to black (#000000)
        paper: "#000000", // Set paper background color to black (#000000)
      },
      divider: "rgba(0, 0, 0, 0.24)", // Set divider color to black (#000000) with 0.24 opacity
      error: {
        contrastText: "#000000", // Set error contrast text color to black (#000000)
        main: "#000000", // Set error main color to black (#000000)
      },
      mode: "dark",
      primary: {
        contrastText: "#000000", // Set primary contrast text color to black (#000000)
        main: "#000000", // Set primary main color to black (#000000)
      },
      success: {
        contrastText: "#000000", // Set success contrast text color to black (#000000)
        main: "#000000", // Set success main color to black (#000000)
      },
      text: {
        primary: "#000000", // Set primary text color to black (#000000)
        secondary: "#000000", // Set secondary text color to black (#000000)
      },
      warning: {
        contrastText: "#000000", // Set warning contrast text color to black (#000000)
        main: "#000000", // Set warning main color to black (#000000)
      },
    },
    shadows: darkShadows,
  },
};

export const createTheme = (config = {}) => {
  let themeOptions = themesOptions[config.theme];

  if (!themeOptions) {
    console.warn(new Error(`The theme ${config.theme} is not valid`));
    themeOptions = themesOptions[THEMES.LIGHT];
  }

  let theme = createMuiTheme(
    merge(
      {},
      baseOptions,
      themeOptions,
      {
        ...(config.roundedCorners && {
          shape: {
            borderRadius: 16,
          },
        }),
      },
      {
        direction: config.direction,
      }
    )
  );

  if (config.responsiveFontSizes) {
    theme = responsiveFontSizes(theme);
  }

  return theme;
};

export const ThemeProvider = ({ children }) => {
  const [appTheme, changeAppTheme] = useState();
  const layoutContext = useContext(LayoutContext);
  useEffect(() => {
    if (layoutContext !== undefined)
      if (layoutContext.currentTheme !== undefined)
        changeAppTheme(createTheme(layoutContext.currentTheme));
  }, [layoutContext]);
  if (appTheme === undefined)
    return <LoadingScreen loadingText="loading theme" />;
  return <MuiThemeProvider theme={appTheme}>{children}</MuiThemeProvider>;
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
