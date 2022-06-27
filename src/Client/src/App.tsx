import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router } from "react-router-dom";
import { useApp } from './hooks/app.hook';
import { ToastContainer } from 'react-toastify';
import { Backdrop, CircularProgress, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { useAppRoutes } from './components/Routes';
import { AppContext } from './context/AppContext';
import { useAppSelector } from './hooks/redux.hook';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/lab';
import { useEffect, useLayoutEffect } from 'react';
import { checkboxClasses } from '@mui/material/Checkbox';

function App() {
  const { initLanguage, setEnLang, setRuLang } = useApp()
  const routes = useAppRoutes({})
  const requestsInProgress = useAppSelector(state => state.appReducer.requestsInProgress)
  const defaultTheme = createTheme({
    palette: {
      primary: { main: '#E9E9E9' },
    },
    typography: {
      button: {
        boxShadow: '',
        border: "0.2px solid #ccc",
        color: "#333",
        textTransform: "none"
      }
    },
    components: {
      MuiButton:{
        styleOverrides: {
          root: {
            color: "#333",
            [`&.${checkboxClasses.checked}`]: {
              color: '#333',
            },
          }
        }
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: "grey",
            [`&.${checkboxClasses.checked}`]: {
              color: 'grey',
            },
          }
        }
      }
    }
  })

  useEffect(() => {
    initLanguage()
  }, [])

  return (
    <div className="App">
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <AppContext.Provider value={{ setEnLang, setRuLang }}>
          <Router>
            <LocalizationProvider dateAdapter={AdapterMoment} >
              {routes}
            </LocalizationProvider>
          </Router>
        </AppContext.Provider>
      </ThemeProvider>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover />

      <Backdrop sx={{ backgroundColor: 'rgba(248, 248, 249, 0.3)', color: 'silver', zIndex: 999999 }}
        open={requestsInProgress !== 0}>
        <CircularProgress color="inherit" />
      </Backdrop>

    </div>
  );

}

export default App;

