import { createContext } from 'react'

type LoginFunc = (jwtToken: string) => void;
type LogoutFunc = () => void;
const loginMock = (jwtToken: string) => { }
const logoutMock = () => { }

class AuthContextClass {
  jwt: string = '';
  login: LoginFunc = loginMock;
  logout: LogoutFunc = logoutMock;
  isAuthenticated: Boolean = false;
}

const context = new AuthContextClass();
export const AuthContext: React.Context<AuthContextClass> = createContext<AuthContextClass>(context)
