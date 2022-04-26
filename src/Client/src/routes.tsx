import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import { NavBar } from './components/NavBar';
import { Home } from './pages/Home';
import { Login } from './pages/Login'
import { Register } from './pages/Register'

export const useRoutes: React.FunctionComponent<boolean> = (isAuthenticated: boolean) => {
  if (isAuthenticated) {
    return (
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    )
  }

  return (
    <div className="App">
      <Routes>
        <Route index element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
  </div >
    )
}
