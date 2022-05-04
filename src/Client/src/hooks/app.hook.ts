import { createTheme, Theme } from '@mui/material';
import { enUS, ruRU } from '@mui/x-data-grid';
import { useCallback, useState } from 'react'

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
    const [theme, setTheme] = useState<Theme>(themeEn)
    const setLang = useCallback((lang: string) => {

        switch (lang) {
            case "ru":
                setTheme(themeRu)
                break

            case "en":
                setTheme(themeEn)
                break
        }
    }, [])

    return { theme, setLang }
}