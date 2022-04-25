import React from 'react'

export const Register: React.FunctionComponent = () => {
  return (
        <div className='row'>
          <div className='col-md-4'></div>
          <div className='col-md-4'>
            <main className="form-signin">
              <form>
                <h1 className="h3 mb-3 fw-normal">Welcome to TasklyPro</h1>

                <div className="form-floating">
                  <input type="text" className="form-control" id='inputLogin' placeholder="Name" required />
                  <label htmlFor="inputLogin">Name</label>
                </div>
                <div className="form-floating">
                  <input type="password" className="form-control" id='inputPassword' placeholder="Password" required />
                  <label htmlFor="inputPassword">Password</label>
                </div>

                <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
              </form>
            </main>
            <div className='col-md-4'></div>
          </div>
        </div>
  )
}
