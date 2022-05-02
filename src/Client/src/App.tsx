import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter as Router } from "react-router-dom";
import { AuthContext } from './context/AuthContext';
import { useAuth } from './hooks/auth.hook';
import { useRoutes } from './routes';
import { ToastContainer } from 'react-toastify';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';

function App() {
  const { jwt, login, logout, isAuthenticated, request } = useAuth()
  const routes = useRoutes(isAuthenticated)
  const theme = createTheme();
  
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <AuthContext.Provider value={{ jwt, login, logout, isAuthenticated, request }}>
          <Router>
            {routes}
          </Router>
        </AuthContext.Provider>
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
