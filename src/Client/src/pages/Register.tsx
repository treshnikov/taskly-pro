import React from 'react'
import { useTranslation } from 'react-i18next';

export const Register: React.FunctionComponent = () => {
  const { t } = useTranslation();

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
                  <input type="email" className="form-control" id='inputEmail' placeholder="Email" required />
                  <label htmlFor="inputEmail">{t("email")}</label>
                </div>
                <div className="form-floating">
                  <input type="password" className="form-control" id='inputPassword' placeholder="Password" required />
                  <label htmlFor="inputPassword">{t("password")}</label>
                </div>

                <button className="w-100 btn btn-lg btn-primary" type="submit">{t("register")}</button>
              </form>
            </main>
          </div>
          <div className='col-md-3'></div>
        </div>    
  )
}
