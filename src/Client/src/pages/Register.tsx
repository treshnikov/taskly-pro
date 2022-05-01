import React, { SyntheticEvent, useState } from 'react'
import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
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
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4">
          {t("welcome")}
        </Typography>
        <Box component="form" onSubmit={registerHandler} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label={t('name')}
            name="name"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label={t('email')}
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label={t('password')}
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button
            size='large'
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {t("register")}
          </Button>
          <Grid container>
            <Grid item xs>
            </Grid>
            <Grid item>
              <Link to='/login'>{t("signin")}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}



// <div className='row'>
// <div className='col-md-3'></div>
// <div className='col-md-6'>
//   <main className="form-signin">
//     <form>
//       <h2 className="h3 fw-normal">{t("welcome")}</h2>

//       <div className="form-floating">
//         <input type="text" className="form-control" id='inputLogin' placeholder="Name" required
//           value={name}
//           onChange={e => setName(e.target.value)}
//         />
//         <label htmlFor="inputLogin">{t("name")}</label>
//       </div>

//       <div className="form-floating">
//         <input type="email" className="form-control" id='inputEmail' placeholder="Email" required
//           value={email}
//           onChange={e => setEmail(e.target.value)}
//         />
//         <label htmlFor="inputEmail">{t("email")}</label>
//       </div>

//       <div className="form-floating">
//         <input type="password" className="form-control" id='inputPassword' placeholder="Password" required
//           value={password}
//           onChange={e => setPassword(e.target.value)}
//         />
//         <label htmlFor="inputPassword">{t("password")}</label>
//       </div>

//       <div>
//         <button className="w-100 btn btn-lg btn-primary"
//           type='submit'
//           onClick={registerHandler}
//         >{t("register")}</button>
//         <Link to='/login'>{t("signin")}</Link>
//       </div>
//     </form>


//   </main>
// </div>
// <div className='col-md-3'></div>
// </div>