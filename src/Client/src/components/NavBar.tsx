import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro'
import React from 'react'
import { t } from 'i18next'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export const NavBar: React.FunctionComponent = () => {
  const { t, i18n } = useTranslation();

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light">
    <div className="container-fluid">
      <Link className="navbar-brand" to=""><FontAwesomeIcon icon={regular('comment')} /> Taskly</Link>
      <div>
        <ul className="navbar-nav me-auto mb-2 mb-md-0">
          <li className="nav-item">
            <Link className="nav-link" to="login">{t("signin")}</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="register">{t("register")}</Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  )
}
