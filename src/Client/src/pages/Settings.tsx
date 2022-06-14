import { Card, Button, CardActions, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { useHttp } from '../hooks/http.hook';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

export const Settings: React.FunctionComponent = () => {
  // it's important to use useTranslation hook to re-render the current component when lang changing  
  const { t } = useTranslation()
  const { setEnLang, setRuLang } = useContext(AppContext)
  const { request } = useHttp()
  const navigate = useNavigate()

  return (

    <div className='page-container'>
      <Grid
        container
        spacing={2}
        padding={2}
        direction="row"
        alignItems="flex-start">

        <Grid item xs={3}>
          <Card className='settings-card'>
            <CardHeader title={t('language') as string} />
            <CardContent>
              {t('change-lang')}<br />&nbsp;<br />&nbsp;
            </CardContent>
            <CardActions>
              <Button variant='contained' onClick={e => { setEnLang() }}>EN</Button>
              <Button variant='contained' onClick={e => { setRuLang() }}>RU</Button>
            </CardActions>
          </Card>

        </Grid>

        <Grid item xs={3}>
          <Card className="settings-card">
            <CardHeader title={t('users') as string} />
            <CardContent>
              {t('users-welcome')}<br />&nbsp;<br />&nbsp;
            </CardContent>
            <CardActions>
              <Button variant='contained' onClick={e => { navigate("/users") }}>{t('users') as string}</Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={3}>
          <Card className="settings-card">
            <CardHeader title={t('departments') as string} />
            <CardContent>
              {t('departments-welcome')}<br />&nbsp;<br />&nbsp;
            </CardContent>
            <CardActions>
              <Button variant='contained' onClick={e => { navigate("/departments") }}>{t('departments') as string}</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Grid
        container
        spacing={2}
        padding={2}
        direction="row"
        alignItems="flex-start">

        <Grid item xs={5}>
          <Card className='settings-card'>
            <CardHeader title={t('departments-to-plan') as string} />
            <CardContent>
              {t('select-departments-for-work-planning')}<br />&nbsp;
            </CardContent>
            <CardActions>
              <Button variant='contained' onClick={e => { navigate("/departmentsSettings") }}>{t('open')}</Button>
            </CardActions>
          </Card>

        </Grid>

        <Grid item xs={4}>
          <Card className='settings-card'>
            <CardHeader title={t('import')} />
            <CardContent>
              {t('import-users-and-departments-records')}<br />&nbsp;
            </CardContent>
            <CardActions>
              <Button variant='contained' onClick={async e => {

                await request<{ msg: string }>("/api/v1/admin/import", 'POST');

              }}>{t('import')}</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </div >
  )
}
