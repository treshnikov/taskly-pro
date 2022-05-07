import { Card, Button, CardActions, CardContent, Grid, Typography, Container } from '@mui/material';
import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

export const Settings: React.FunctionComponent = () => {
  const { setEnLang, setRuLang } = useContext(AppContext)

  // it's important to use useTranslation hook to re-render the current component when lang changing  
  const { t } = useTranslation()

  return (
    <Container>
      <Grid
        container
        padding={1}
        direction="row"
        alignItems="flex-start"
      >
        <Card sx={{ width: 275, margin: 1 }}>
          <CardContent>
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
            <Button variant='contained' onClick={e => { setEnLang() }}>EN</Button>
            <Button variant='contained' onClick={e => { setRuLang() }}>RU</Button>
          </CardActions>
        </Card>
      </Grid>
    </Container>
  )
}
