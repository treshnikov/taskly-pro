import { Card, Button, CardActions, CardContent, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React from 'react'
import { t } from 'i18next';
import PeopleIcon from '@mui/icons-material/People';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SettingsIcon from '@mui/icons-material/Settings';

export const Home: React.FunctionComponent = () => {
  const navigate = useNavigate()

  return (
    <div className='page-container'>
      <Grid
        container
        spacing={2}
        padding={2}
        direction="row"
        alignItems="flex-start"
      >
        <Grid item xs={3}>
          <Card className="home-card">
            <CardContent>
              <Typography variant="h5" component="div">
                <PeopleIcon />&nbsp;{t('projects') as string}
              </Typography>
              <Typography variant="body2">
                <>{t('projects-welcome')}</><br />&nbsp;
              </Typography>
            </CardContent>
            <CardActions>
              <Button variant='contained' onClick={e => { navigate("/projects") }}>{t('projects') as string}</Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={3}>
          <Card className="home-card">
            <CardContent>
              <Typography variant="h5" component="div">
                <PeopleIcon />&nbsp;{t('users') as string}
              </Typography>
              <Typography variant="body2">
                <>{t('users-welcome')}</><br />&nbsp;
              </Typography>
            </CardContent>
            <CardActions>
              <Button variant='contained' onClick={e => { navigate("/users") }}>{t('users') as string}</Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={3}>
          <Card className="home-card">
            <CardContent>
              <Typography variant="h5" component="div">
                <AccountTreeIcon />&nbsp;{t('units') as string}
              </Typography>
              <Typography variant="body2">
                <>{t('units-welcome')}</><br />&nbsp;
              </Typography>
            </CardContent>
            <CardActions>
              <Button variant='contained' onClick={e => { navigate("/units") }}>{t('units') as string}</Button>
            </CardActions>
          </Card>
        </Grid>

      </Grid>

      <Grid
        container
        spacing={2}
        padding={2}
        direction="row"
        alignItems="flex-start"
      >
        <Grid item xs={3}>
          <Card className="home-card">
            <CardContent>
              <Typography variant="h5" component="div">
                <SettingsIcon />&nbsp;{t('settings') as string}
              </Typography>
              <Typography variant="body2">
                <>
                  {t('settings-welcome')}<br />&nbsp;
                </>
              </Typography>
            </CardContent>
            <CardActions>
              <Button variant='contained' onClick={e => { navigate("/settings") }}>{t('settings') as string}</Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={3}>
        </Grid>

      </Grid>
    </div>
  )
}
