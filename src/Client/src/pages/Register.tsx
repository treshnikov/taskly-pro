import React, { SyntheticEvent, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRequest } from '../hooks/request.hook';

export const Register: React.FunctionComponent = () => {
  const { t } = useTranslation();

  const [name, setName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const navigate = useNavigate()
  const { request } = useRequest()

  const registerHandler = async (e: SyntheticEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("Name", name);
    data.append("Email", email);
    data.append("Password", password);

    await request("/api/v1/auth/register",
      {
        method: 'post',
        body: data
      });
    toast.success(t('user_has_been_registered_successfully'))
    navigate('/login')
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
              <input type="email" className="form-control" id='inputEmail' placeholder="Email" required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <label htmlFor="inputEmail">{t("email")}</label>
            </div>

            <div className="form-floating">
              <input type="password" className="form-control" id='inputPassword' placeholder="Password" required
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <label htmlFor="inputPassword">{t("password")}</label>
            </div>

            <div>
              <button className="w-100 btn btn-lg btn-primary"
                type='submit'
                onClick={registerHandler}
              >{t("register")}</button>
              <Link to='/login'>{t("signin")}</Link>
            </div>
          </form>


        </main>
      </div>
      <div className='col-md-3'></div>
    </div>
  )
}
