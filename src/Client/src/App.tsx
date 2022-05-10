import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter as Router } from "react-router-dom";
import { useApp } from './hooks/app.hook';
import { ToastContainer } from 'react-toastify';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { useAppRoutes } from './components/Routes';
import { AppContext } from './context/AppContext';

function App() {
  const { setEnLang, setRuLang } = useApp()
  const routes = useAppRoutes({})

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
    </div>
  );

}

export default App;

