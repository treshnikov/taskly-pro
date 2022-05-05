import { createContext } from 'react'

type SetLangFunc = () => void;
const setLangMock = () => { };

class AppContextClass {
  setEnLang: SetLangFunc = setLangMock
  setRuLang: SetLangFunc = setLangMock
}

const context = new AppContextClass();
export const AppContext: React.Context<AppContextClass> = createContext<AppContextClass>(context)
