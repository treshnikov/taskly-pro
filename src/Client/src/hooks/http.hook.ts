import { toast } from 'react-toastify'
import { useDispatch } from "react-redux"
import { onSignin, onSignout  } from "../redux/authSlice"
import { useCallback } from 'react'
import { useAppSelector } from './redux.hook'
import { hideLoadingScreen, showLoadingScreen } from '../redux/appSlice'

export const useHttp = () => {
    const dispatch = useDispatch();
    const jwt = useAppSelector(state => state.authReducer.jwt)
    
    const login = async (data: FormData) => {
        const json = await request<{jwt: string}>("/api/v1/auth/token",
            {
                method: 'post',
                body: data,
            });

        dispatch(onSignin(json.jwt))
    }

    const logout = () => {
        dispatch(onSignout())
    }

    const request = useCallback(async<T> (input: RequestInfo, init?: RequestInit) => {
        if (!init) {
            init = {}
        }
        init.headers = { Authorization: `Bearer ${jwt}` }

        let response
        try {
            dispatch(showLoadingScreen())
            response = await fetch(input, init)
            dispatch(hideLoadingScreen())
        } catch (ex) {
            dispatch(hideLoadingScreen())
            const err = ex as Error;
            if (err) {
                toast.error(err.message);
            }
            throw (ex)
        }

        if (response.status === 401 || response.status === 403) {
            // It's supposed that the client shouldn't send requests that bring it to the 401|403 states.
            // Nevertheless, if the client got this it might mean that the token has expired or the client requests a resource that requires higher privileges which means the login procedure must be repeated  
            dispatch(onSignout())
        }

        if (response.status === 404)
        {
            toast.error(response.statusText);
            throw new Error(response.statusText)    
        }

        const json = await response.json()

        if (response.ok) {
            return json as T;
        }

        // handle error message from server's custom exceptions
        let errorText = response.statusText
        if (json.hasOwnProperty("Error")) {
            errorText += ": " + json.Error
        }
        toast.error(errorText);

        throw new Error(errorText)
    }, [dispatch, jwt])

    return { login, logout, request }
}