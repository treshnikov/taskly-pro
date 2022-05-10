import React, { SyntheticEvent, useContext, useState } from 'react'
import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { useAuth } from '../hooks/auth.hook';

export const Register: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const { request } = useAuth()
  const [name, setName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const navigate = useNavigate()
  const { setEnLang, setRuLang } = useContext(AppContext)

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
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h3">
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

          <Grid container spacing={0}>
            <Grid item xs={2} >
              <Link onClick={e => setEnLang()} to={''}>EN&nbsp;</Link>
              <Link onClick={e => setRuLang()} to={''}>RU&nbsp;</Link>
            </Grid>
            <Grid item xs={10} style={{ textAlign: "right" }}>
              <Link to='/login'>{t("signin")}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}
