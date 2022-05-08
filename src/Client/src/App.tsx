import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter as Router } from "react-router-dom";
import { AuthContext } from './context/AuthContext';
import { useAuth } from './hooks/auth.hook';
import { useApp } from './hooks/app.hook';
import { ToastContainer } from 'react-toastify';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { useRoutes } from './components/Routes';
import { AppContext } from './context/AppContext';

function App() {
  const { login, logout, isAuthenticated, request } = useAuth()
  const { setEnLang, setRuLang } = useApp()
  const routes = useRoutes(isAuthenticated)

  return (
    <div className="App">
      <ThemeProvider theme={createTheme({
        palette: {
          primary: { main: '#3178c6' },
        }
      })}>
        <CssBaseline />
        <AppContext.Provider value={{ setEnLang, setRuLang }}>
          <AuthContext.Provider value={{ login, logout, isAuthenticated, request }}>
            <Router>
              {routes}
            </Router>
          </AuthContext.Provider>
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

