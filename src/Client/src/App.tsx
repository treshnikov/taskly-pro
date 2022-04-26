import React, { useState } from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import { Login } from './pages/Login';
import { NavBar } from './components/NavBar';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { AuthContext } from './context/AuthContext';
import { useAuth } from './hooks/auth.hook';
import { useRoutes } from './routes';

function App() {
  const { jwt, login, logout } = useAuth()
  const isAuthenticated = !!jwt
  const routes = useRoutes(isAuthenticated)

    return (
      <div className="App">
        <AuthContext.Provider value={{ jwt, login, logout, isAuthenticated}}>
        <Router>
          {routes}
        </Router>
        </AuthContext.Provider>
      </div >
    );
  
}

export default App;
