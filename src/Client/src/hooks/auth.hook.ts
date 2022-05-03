import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'

const storageName = 'taskly-user-data'

export const useAuth = () => {
    const [jwt, setJwt] = useState<string>('')

    const checkIsAuthenticated = (): boolean => {
        const storage = localStorage.getItem(storageName)
        if (!storage) {
            return false
        }

        const data = JSON.parse(storage)
        if (!data || !data.jwt) {
            return false
        }

        // todo verify token
        setJwt(data.jwt)
        return true
    }

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => { return checkIsAuthenticated() })

    const logout = () => {
        setJwt('')
        localStorage.removeItem(storageName)
        setIsAuthenticated(false)
    }

    const request = useCallback(async (input: RequestInfo, init?: RequestInit) => {
        if (!init) {
            init = {}
            init.headers = {}
            init.headers = { Authorization: `Bearer ${jwt}` }
        }

        let response
        try {
            response = await fetch(input, init)
        } catch (ex) {
            const err = ex as Error;
            if (err) {
                toast.error(err.message);
            }
            throw (ex)
        }

        const json = await response.json()

        if (response.status === 401 || response.status === 403) {
            // It's supposed that the client shouldn't send requests that bring it to the 401|403 states.
            // Nevertheless, if the client got this it might mean that the token has expired or the client requests a resource that requires higher privileges which means the login procedure must be repeated  
            logout()
        }

        if (response.ok) {
            return json;
        }

        // handle error message from server's custom exceptions
        let errorText = response.statusText
        if (json.hasOwnProperty("Error")) {
            errorText += ": " + json.Error
        }
        toast.error(errorText);

        throw new Error(errorText)
    }, [jwt])

    const login = async (data: FormData) => {
        const json = await request("/api/v1/auth/token",
            {
                method: 'post',
                body: data,
            });

        setJwt(json.jwt)
        localStorage.setItem(storageName, JSON.stringify({ jwt: json.jwt }))
        setIsAuthenticated(true)
    }

    useEffect(() => {
    }, [jwt])

    return { login, logout, request, isAuthenticated }
}