import React from 'react'
import { Routes, Route } from "react-router-dom";
import { NavBar } from './NavBar';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login'
import { Register } from '../pages/Register'
import { Users } from '../pages/Users';
import { Settings } from '../pages/Settings';
import { Projects } from '../pages/Projects';
import { ProjectDetails } from '../pages/ProjectDetails';
import { useAppSelector } from '../hooks/redux.hook';
import { Units } from '../pages/Units';

export const useAppRoutes: React.FunctionComponent = () => {
  const isAuthenticated = useAppSelector(state => state.authReducer.isAuthenticated)

  if (isAuthenticated) {
    return (
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/users" element={<Users />} />
          <Route path="/units" element={<Units showUnitEnabledFlag={false} />} />
          <Route path="/unitsSettings" element={<Units showUnitEnabledFlag={true} />} />
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
