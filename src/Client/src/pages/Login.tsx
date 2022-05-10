import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import React, { SyntheticEvent, useContext, useState } from 'react'
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { useAuth } from '../hooks/auth.hook';

export const Login: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const { setEnLang, setRuLang } = useContext(AppContext)

  const loginHanler = async (e: SyntheticEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("Email", email);
    data.append("Password", password);

    login(data)
    navigate('/')
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
        <Box component="form" onSubmit={loginHanler} noValidate sx={{ mt: 1 }}>
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
            {t("signin")}
          </Button>
          <Grid container spacing={0}>
            <Grid item xs={2} >
              <Link onClick={e => setEnLang()} to={''}>EN&nbsp;</Link>
              <Link onClick={e => setRuLang()} to={''}>RU&nbsp;</Link>
            </Grid>
            <Grid item xs={10} style={{textAlign: "right"}}>
              <Link to='/register'>{t("register")}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}