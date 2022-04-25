import React from 'react'
import { useTranslation } from "react-i18next";

export const Login: React.FunctionComponent = () => {
  const { t, i18n } = useTranslation();

  return (
        <div className='row'>
          <div className='col-md-3'></div>
          <div className='col-md-6'>
            <main className="form-signin">
              <form>
                <h2 className="h3 fw-normal">{t("welcome")}</h2>

                <div className="form-floating">
                  <input type="text" className="form-control" id='inputLogin' placeholder="Name" required />
                  <label htmlFor="inputLogin">{t("name")}</label>
                </div>
                <div className="form-floating">
                  <input type="password" className="form-control" id='inputPassword' placeholder="Password" required />
                  <label htmlFor="inputPassword">{t("password")}</label>
                </div>

                <button className="w-100 btn btn-lg btn-primary" type="submit">{t("signin")}</button>
              </form>
            </main>
          </div>
          <div className='col-md-3'></div>
        </div>
  )
}
