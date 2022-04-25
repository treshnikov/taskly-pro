import React from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import { Login } from './pages/Login';
import { NavBar } from './components/NavBar';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import {Route} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <NavBar></NavBar>
      {/* <Router>
        <Switch>
          <Route path="/">
            <Home></Home>
          </Route>
          <Route path="/login">
            <Login></Login>
          </Route>
          <Route path="/register">
            <Register></Register>
          </Route>
        </Switch>
      </Router> */}

      <Login></Login>
    </div>
  );
}

export default App;
