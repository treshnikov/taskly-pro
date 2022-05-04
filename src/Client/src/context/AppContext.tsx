import { createTheme, Theme } from '@mui/material';
import { createContext } from 'react'

type SetLangFunc = (lang: string) => void;
const setLangMock = (lang: string) => { };

class AppContextClass {
  theme: Theme = createTheme()
  setLang: SetLangFunc = setLangMock
}

const context = new AppContextClass();
export const AppContext: React.Context<AppContextClass> = createContext<AppContextClass>(context)
