import { createContext } from 'react'

type LoginFunc = (data: FormData) => void;
type LogoutFunc = () => void;
type RequestFunc =  (input: RequestInfo, init?: RequestInit) => any
const loginMock = (data: FormData) => { }
const logoutMock = () => { }
const requestMock = (input: RequestInfo, init?: RequestInit) => {return {}}

class AuthContextClass {
  request: RequestFunc = requestMock
  login: LoginFunc = loginMock;
  logout: LogoutFunc = logoutMock;
  isAuthenticated: Boolean = false;
}

const context = new AuthContextClass();
export const AuthContext: React.Context<AuthContextClass> = createContext<AuthContextClass>(context)
