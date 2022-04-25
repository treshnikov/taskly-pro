import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro'
import React from 'react'

export const NavBar: React.FunctionComponent = () => {
  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light">
    <div className="container-fluid">
      <a className="navbar-brand" href="#"><FontAwesomeIcon icon={solid('user-secret')} /> Taskly</a>
      <div>
        <ul className="navbar-nav me-auto mb-2 mb-md-0">
          <li className="nav-item">
            <a className="nav-link" href="#">Login</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Register</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  )
}
