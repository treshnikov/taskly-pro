import { Card, Button, CardActions, CardContent, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { UserVm } from '../models/UserVm';
import { t } from 'i18next';

export const Home: React.FunctionComponent = () => {
  const { request } = useContext(AuthContext)
  const [user, setUser] = useState<UserVm>(new UserVm());
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUser = async () => {
      const u = await request("/api/v1/auth/user")
      setUser(u as UserVm)
    } 
    fetchUser()
  })

  return (
    <Grid
      container
      padding={1}
      direction="row"
      alignItems="flex-start"
    >

      <Card sx={{ width: 275, margin: 1 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {t('page') as string}
          </Typography>
          <Typography variant="h5" component="div">
            {t('home') as string}
          </Typography>
          <Typography variant="body2">
            Hello, user {user.name}!<br />
            Your email is {user.email}.
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant='contained' onClick={e => { navigate("/") }}>{t('home') as string}</Button>
        </CardActions>
      </Card>

      <Card sx={{ width: 275, margin: 1 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {t('page') as string}
          </Typography>
          <Typography variant="h5" component="div">
            {t('users') as string}
          </Typography>
          <Typography variant="body2">
            Navigate to this page to see all registered users.
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant='contained' onClick={e => { navigate("/users") }}>{t('users') as string}</Button>
        </CardActions>
      </Card>

      <Card sx={{ width: 275, margin: 1 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {t('page') as string}
          </Typography>
          <Typography variant="h5" component="div">
            {t('settings') as string}
          </Typography>
          <Typography variant="body2">
            Navigate to the setting page.<br />&nbsp;
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant='contained' onClick={e => { navigate("/settings") }}>{t('settings') as string}</Button>
        </CardActions>
      </Card>
    </Grid>
  )
}
