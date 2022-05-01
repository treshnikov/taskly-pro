import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import React, { SyntheticEvent, useContext, useState } from 'react'
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useRequest } from '../hooks/request.hook';

export const Login: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const { request } = useRequest()

  const loginHanler = async (e: SyntheticEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("Email", email);
    data.append("Password", password);

    const jwt = await request("/api/v1/auth/token",
      {
        method: 'post',
        body: data,
      });

    // save jwt token to storage
    auth.login(jwt.jwt)
    navigate('/')
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
          <Grid container>
            <Grid item xs>
            </Grid>
            <Grid item>
              <Link to='/register'>{t("register")}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}