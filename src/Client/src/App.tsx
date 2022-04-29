import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter as Router } from "react-router-dom";
import { AuthContext } from './context/AuthContext';
import { useAuth } from './hooks/auth.hook';
import { useRoutes } from './routes';
import { ToastContainer } from 'react-toastify';

function App() {
  const { jwt, login, logout, isAuthenticated } = useAuth()
  const routes = useRoutes(isAuthenticated)

  return (
    <div className="App">
      <AuthContext.Provider value={{ jwt, login, logout, isAuthenticated }}>
        <Router>
          {routes}
        </Router>
      </AuthContext.Provider>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

    </div >
  );

}

export default App;
