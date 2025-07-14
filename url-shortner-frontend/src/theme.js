import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
      contrastText: "#fff",
    },
    secondary: {
      main: "#9c27b0",
    },
    background: {
      default: "#f5f7fa",
      paper: "#fff",
    },
    text: {
      primary: "#212121",
      secondary: "#555",
    },
  },
  typography: {
    fontFamily: `'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif`,
    h5: {
      fontWeight: 700,
      letterSpacing: "0.02em",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(25, 118, 210, 0.2)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        },
      },
    },
  },
});

export default theme;
