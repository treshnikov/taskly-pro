import { Card, Button, CardActions, CardContent, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React from 'react'
import { t } from 'i18next';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import SettingsIcon from '@mui/icons-material/Settings';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

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
        <Grid
          item
          xs={3}>
          <Card
            className="home-card">
            <CardContent>
              <Typography
                variant="h5"
                component="div">
                <ArticleOutlinedIcon />&nbsp;{t('projects') as string}
              </Typography>
              <Typography
                variant="body2">
                <>{t('projects-welcome')}</><br />&nbsp;
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size='small'
                variant='contained'
                onClick={e => { navigate("/projects") }}>
                {t('projects') as string}
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={3}>
          <Card
            className="home-card">
            <CardContent>
              <Typography
                variant="h5"
                component="div">
                <AccountTreeIcon />&nbsp;{t('department-plans') as string}
              </Typography>
              <Typography
                variant="body2">
                <>{t('department-plans-welcome')}</><br />&nbsp;
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size='small'
                variant='contained'
                onClick={e => { navigate("/departmentPlans") }}>{t('plans') as string}
              </Button>
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
      </Grid>

      <Grid
        container
        spacing={2}
        padding={2}
        direction="row"
        alignItems="flex-start"
      >
        <Grid
          item
          xs={3}>
          <Card
            className="home-card">
            <CardContent>
              <Typography
                variant="h5"
                component="div">
                <SettingsIcon />&nbsp;{t('settings') as string}
              </Typography>
              <Typography
                variant="body2">
                <>
                  {t('settings-welcome')}<br />&nbsp;
                </>
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant='contained'
                size='small'
                onClick={e => { navigate("/settings") }}>{t('settings') as string}
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid
          item
          xs={3}>
        </Grid>
      </Grid>
    </div>
  )
}
