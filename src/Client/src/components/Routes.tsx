import React from 'react'
import {
  Routes,
  Route
} from "react-router-dom";
import { NavBar } from './NavBar';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login'
import { Register } from '../pages/Register'
import { Users } from '../pages/Users';
import { Settings } from '../pages/Settings';

export const useRoutes: React.FunctionComponent<boolean> = (isAuthenticated: boolean) => {

  if (isAuthenticated) {
    return (
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    )
  }

  return (
    <div className="App">
      <Routes>
        <Route path="*" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div >
  )
}
