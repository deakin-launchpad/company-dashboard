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
          color: "#ffffff",
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
      color: "#ffffff",
    },
    h2: {
      fontWeight: 600,
      fontSize: "3rem",
      color: "#000000",
    },
    h3: {
      fontWeight: 600,
      fontSize: "2.25rem",
      color: "#000000",
    },
    h4: {
      fontWeight: 600,
      fontSize: "2rem",
      color: "#000000",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.5rem",
      color: "#ffffff",
    },
    h6: {
      fontWeight: 500,
      fontSize: "1rem",
      color: "#717F8B",
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
              color: "#000000",
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
        active: "#000000",
      },
      background: {
        default: "#122433",
        secondary: "#162A3C",
        paper: "#000000",
      },
      error: {
        contrastText: "#ff0000",
        main: "#ff0000",
      },
      mode: "light",
      primary: {
        contrastText: "#000000",
        main: "#000000",
      },
      success: {
        contrastText: "#000000",
        main: "#000000",
      },
      text: {
        primary: "#ffffff",
        secondary: "#000000",
      },
      warning: {
        contrastText: "#000000",
        main: "#000000",
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
        default: "#171c24",
        paper: "#222b36",
      },
      button: {
        default: "#0D539B",
      },
      divider: "rgba(145, 158, 171, 0.24)",
      error: {
        contrastText: "#ffffff",
        main: "#f44336",
      },
      mode: "dark",
      primary: {
        contrastText: "#ffffff",
        main: "#688eff",
      },
      success: {
        contrastText: "#ffffff",
        main: "#4caf50",
      },
      text: {
        primary: "#ffffff",
        secondary: "#717F8B",
      },
      warning: {
        contrastText: "#ffffff",
        main: "#ff9800",
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
        default: "#1c2531",
        paper: "#293142",
      },
      divider: "rgba(145, 158, 171, 0.24)",
      error: {
        contrastText: "#ffffff",
        main: "#f44336",
      },
      mode: "dark",
      primary: {
        contrastText: "#ffffff",
        main: "#01ab56",
      },
      success: {
        contrastText: "#ffffff",
        main: "#4caf50",
      },
      text: {
        primary: "#ffffff",
        secondary: "#919eab",
      },
      warning: {
        contrastText: "#ffffff",
        main: "#ff9800",
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

/*Orginal 

 <FieldArray name="directors">
            {({ remove, insert }) => (
              <Box>
                {touched.directors && touched.directors.length > 0 ? (
                  touched.directors.map((friend, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 1,
                      }}
                    >
                      <Field
                        as={TextField}
                        label={`Directors Email ${index + 1}`}
                        name={`directors.${index}`}
                        type="text"
                        variant="outlined"
                        error={touched.directors && Boolean(errors.directors)}
                        helperText={touched.directors && errors.directors}
                      />
                      <Field
                        as={TextField}
                        label={`Share amount`}
                        name={`directorAmountOfShares.${index}`}
                        type="text"
                        variant="outlined"
                        error={
                          touched.directorAmountOfShares &&
                          Boolean(errors.directorAmountOfShares)
                        }
                        helperText={
                          touched.directorAmountOfShares &&
                          errors.directorAmountOfShares
                        }
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        <Button
                          sx={{ height: 24 }}
                          variant="contained"
                          onClick={() => remove(index)}
                        >
                          -
                        </Button>
                        <Button
                          sx={{ height: 24 }}
                          variant="contained"
                          onClick={() => insert(index + 1, "")}
                        >
                          +
                        </Button>
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Button
                    sx={{ mt: 1, width: 135 }}
                    variant="contained"
                    onClick={() => insert("")}
                  >
                    Add a Director
                  </Button>
                )}
              </Box>
            )}
          </FieldArray>

*/
