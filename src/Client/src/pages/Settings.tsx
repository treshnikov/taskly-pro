import { Card, Button, CardActions, CardContent, Container, CardHeader, Divider, Grid } from '@mui/material';
import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { useHttp } from '../hooks/http.hook';

export const Settings: React.FunctionComponent = () => {
  // it's important to use useTranslation hook to re-render the current component when lang changing  
  const { t } = useTranslation()
  const { setEnLang, setRuLang } = useContext(AppContext)
  const { request } = useHttp()

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
              {t('change-lang')}<br/>&nbsp;
            </CardContent>
            <CardActions>
              <Button variant='contained' onClick={e => { setEnLang() }}>EN</Button>
              <Button variant='contained' onClick={e => { setRuLang() }}>RU</Button>
            </CardActions>
          </Card>

        </Grid>

        <Grid item xs={4}>
          <Card className='settings-card'>
            <CardHeader title={t('import')} />
            <CardContent>
              {t('import-users-and-units-records')}
            </CardContent>
            <CardActions>
              <Button variant='contained' onClick={async e => {

                await request("/api/v1/admin/import",
                  {
                    method: 'post',
                  });

              }}>{t('import')}</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid> 
    </div>
  )
}
