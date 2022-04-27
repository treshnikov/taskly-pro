import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { regular } from '@fortawesome/fontawesome-svg-core/import.macro'
import React, { SyntheticEvent, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'


export const NavBar: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const {logout } = useContext(AuthContext);
  
  const logoutHandler = async (event :SyntheticEvent) =>
  {
    logout()
  }

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to=""><FontAwesomeIcon icon={regular('comment')} /> Taskly</Link>
        <div>
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item">
              <Link className="nav-link" onClick={logoutHandler} to={'/'}>{t("logout")}</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
