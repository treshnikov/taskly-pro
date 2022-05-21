import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter as Router } from "react-router-dom";
import { useApp } from './hooks/app.hook';
import { ToastContainer } from 'react-toastify';
import { Backdrop, CircularProgress, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { useAppRoutes } from './components/Routes';
import { AppContext } from './context/AppContext';
import { useAppSelector } from './hooks/redux.hook';

function App() {
  const { setEnLang, setRuLang } = useApp()
  const routes = useAppRoutes({})
  const showLoadingScreen = useAppSelector(state => state.appReducer.showLoadingScreen)

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

      <Backdrop sx={{ color: 'rgb(248, 248, 249)', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showLoadingScreen}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );

}

export default App;

