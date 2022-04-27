import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContext } from './context/AuthContext';
import { useAuth } from './hooks/auth.hook';
import { useRoutes } from './routes';

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
    </div >
  );

}

export default App;
