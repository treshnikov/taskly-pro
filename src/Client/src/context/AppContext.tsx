import { createContext } from 'react'

class AppContextClass {
  setEnLang: () => void = () => { }
  setRuLang: () => void = () => { }
}

const context = new AppContextClass();
export const AppContext: React.Context<AppContextClass> = createContext<AppContextClass>(context)
