import { Card, Button, CardActions, CardContent, Container, CardHeader, Divider } from '@mui/material';
import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/auth.hook';

export const Settings: React.FunctionComponent = () => {
  // it's important to use useTranslation hook to re-render the current component when lang changing  
  const { t } = useTranslation()
  const { setEnLang, setRuLang } = useContext(AppContext)
  const { request } = useAuth()

  return (

    <Container>

      <Card
        sx={{ marginTop: 1 }}>
        <CardHeader
          title={t('language') as string}
        />
        <Divider />
        <CardContent>
          {t('change-lang')}
        </CardContent>
        <Divider />
        <CardActions>
          <Button variant='contained' onClick={e => { setEnLang() }}>EN</Button>
          <Button variant='contained' onClick={e => { setRuLang() }}>RU</Button>
        </CardActions>
      </Card>

      <Card
        sx={{ marginTop: 1 }}>
        <CardHeader
          title={t('import')}
        />
        <Divider />
        <CardContent>
          {t('import-users-and-units-records')}
        </CardContent>
        <Divider />
        <CardActions>
          <Button variant='contained' onClick={async e => {

            await request("/api/v1/users/import",
              {
                method: 'post',
              });

          }}>{t('import')}</Button>
        </CardActions>
      </Card>

    </Container>
  )
}
