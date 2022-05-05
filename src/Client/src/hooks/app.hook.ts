import { createTheme, Theme } from '@mui/material';
import { enUS, ruRU } from '@mui/x-data-grid';
import { useCallback, useState } from 'react'
import i18n from '../i18n';

const themeEn = createTheme({
    palette: {
        primary: { main: '#1976d2' },
    },
}, enUS);

const themeRu = createTheme({
    palette: {
        primary: { main: '#1976d2' },
    },
}, ruRU);

export const useApp = () => {
    const [, setTheme] = useState<Theme>(themeEn)

    const setEnLang = useCallback(() => {
        i18n.changeLanguage('en'); 
        setTheme(themeEn)
    }, [])

    const setRuLang = useCallback(() => {
        i18n.changeLanguage('ru'); 
        setTheme(themeRu)
    }, [])

    return { setEnLang, setRuLang }
}