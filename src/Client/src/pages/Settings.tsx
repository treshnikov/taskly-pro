import { Card, Button, CardActions, CardContent, Grid, Typography } from '@mui/material';
import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

export const Settings: React.FunctionComponent = () => {
  const { setLang } = useContext(AppContext)
  // it's important to use useTranslation hook to re-render the current component when lang changing  
  const { t, i18n } = useTranslation()
  
  return (
    <div className='container'>
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
              {t('settings') as string}
            </Typography>
            <Typography variant="body2">
              <>
              {t('change-lang')}
              </>
            </Typography>
          </CardContent>
          <CardActions>
            <Button variant='contained' onClick={e => { i18n.changeLanguage('en'); setLang('en'); }}>EN</Button>
            <Button variant='contained' onClick={e => { i18n.changeLanguage('ru'); setLang('ru'); }}>RU</Button>
          </CardActions>
        </Card>

      </Grid>    </div>
  )
}
