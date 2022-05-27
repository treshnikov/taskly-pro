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
import { Departments } from '../pages/Departments';
import { DepartmentSettings } from './Settings/DepartmentSettings';

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
          <Route path="/departments" element={<Departments />} />
          <Route path="/departmentsSettings" element={<DepartmentSettings />} />
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
