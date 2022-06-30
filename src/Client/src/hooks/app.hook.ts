import { createTheme, Theme } from '@mui/material';
import { enUS, ruRU } from 'handsontable/i18n';
import { useCallback, useState } from 'react'
import i18n from '../i18n';

const themeEn = createTheme({}, enUS);

const themeRu = createTheme({}, ruRU);

export const useApp = () => {
    const [, setTheme] = useState<Theme>(themeEn)

    const setEnLang = useCallback(() => {
        localStorage.setItem('lang', 'en')
        i18n.changeLanguage('en');
        setTheme(themeEn)
    }, [])

    const setRuLang = useCallback(() => {
        localStorage.setItem('lang', 'ru')
        i18n.changeLanguage('ru');
        setTheme(themeRu)
    }, [])

    const initLanguage = useCallback(() => {
        const lang = localStorage.getItem('lang')

        if (!lang || lang === 'en') {
            setEnLang()
        }

        if (lang === 'ru') {
            setRuLang()
        }
    }, [])

    return { initLanguage, setEnLang, setRuLang }
}