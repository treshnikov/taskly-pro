import React, { SyntheticEvent, useContext, useState } from 'react'
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const Login: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
  const [name, setName] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const loginHanler = async (e: SyntheticEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("Name", name);
    data.append("Password", password);

    const jwt = await fetch("/api/v1/auth/token",
      {
        method: 'post',
        body: data,
      });

    const jwtText = await jwt.text();

    // save jwt token to storage
    auth.login(jwtText)

    navigate('/')
  }

  return (
    <div className='row'>
      <div className='col-md-3'></div>
      <div className='col-md-6'>
        <main className="form-signin">
          <form>
            <h2 className="h3 fw-normal">{t("welcome")}</h2>

            <div className="form-floating">
              <input type="text" className="form-control" id='inputLogin' placeholder="Name" required
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <label htmlFor="inputLogin">{t("name")}</label>
            </div>

            <div className="form-floating">
              <input type="password" className="form-control" id='inputPassword' placeholder="Password" required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <label htmlFor="inputPassword">{t("password")}</label>
            </div>

            <div>
              <button className="w-100 btn btn-lg btn-primary" type="submit"
                onClick={loginHanler}
              >{t("signin")}</button>
              <Link to='/register'>{t("register")}</Link>
            </div>

          </form>
        </main>
      </div>
      <div className='col-md-3'></div>
    </div>
  )
}
