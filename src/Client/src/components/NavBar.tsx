import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands } from '@fortawesome/fontawesome-svg-core/import.macro'
import React from 'react'
import { t } from 'i18next'
import { useTranslation } from 'react-i18next'

export const NavBar: React.FunctionComponent = () => {
  const { t, i18n } = useTranslation();

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light">
    <div className="container-fluid">
      <a className="navbar-brand" href="#"><FontAwesomeIcon icon={regular('comment')} /> Taskly</a>
      <div>
        <ul className="navbar-nav me-auto mb-2 mb-md-0">
          <li className="nav-item">
            <a className="nav-link" href="#">{t("signin")}</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">{t("register")}</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  )
}
