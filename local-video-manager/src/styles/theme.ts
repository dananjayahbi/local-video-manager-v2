import { createTheme } from '@mui/material/styles';

// Create a theme instance according to requirements
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976D2', // MUI Blue for buttons, highlights, and active elements
    },
    secondary: {
      main: '#424242', // Dark Gray for secondary text, borders, and accents
    },
    background: {
      default: '#F5F5F5', // Light Gray main background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    }
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '24px',
      fontWeight: 500,
    },
    h2: {
      fontSize: '20px',
      fontWeight: 500,
    },
    h3: {
      fontSize: '16px',
      fontWeight: 500,
    },
    body1: {
      fontSize: '14px',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default theme;