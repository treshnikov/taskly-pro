import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter as Router } from "react-router-dom";
import { useApp } from './hooks/app.hook';
import { ToastContainer } from 'react-toastify';
import { Backdrop, CircularProgress, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { useAppRoutes } from './components/Routes';
import { AppContext } from './context/AppContext';
import { useAppSelector } from './hooks/redux.hook';
import { useEffect, useState } from 'react';

function App() {
  const { setEnLang, setRuLang } = useApp()
  const routes = useAppRoutes({})
  const requestsInProgress = useAppSelector(state => state.appReducer.requestsInProgress)

  return (
    <div className="App">
      <ThemeProvider theme={createTheme({
        palette: {
          primary: { main: '#3178c6' },
        }
      })}>
        <CssBaseline />
        <AppContext.Provider value={{ setEnLang, setRuLang }}>
          <Router>
            {routes}
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

      <Backdrop sx={{ backgroundColor: 'rgba(248, 248, 249, 0.3)', color: 'silver', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={requestsInProgress !== 0}>
        <CircularProgress color="inherit" />
      </Backdrop>

    </div>
  );

}

export default App;

