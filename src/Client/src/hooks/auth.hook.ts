import { useState, useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'

const storageName = 'taskly-user-data'

export const useAuth = () => {
    const [jwt, setJwt] = useState<string>('')
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

    const login = useCallback((jwtToken: string) => {
        setJwt(jwtToken)
        localStorage.setItem(storageName, JSON.stringify({ jwt: jwtToken }))
        setIsAuthenticated(true)
    }, [])

    const logout = useCallback(() => {
        setJwt('')
        localStorage.removeItem(storageName)
        setIsAuthenticated(false)
    }, [])

    const request = async (input: RequestInfo, init?: RequestInit) => {
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
        if (response.ok) {
            return json;
        }

        let errorText = response.statusText

        // handle error message
        if (json.hasOwnProperty("Error")) {
            errorText += ": " + json.Error
        }

        toast.error(errorText);
        throw new Error(errorText)
    }


    useEffect(() => {
        const storage = localStorage.getItem(storageName)
        if (!storage) {
            return
        }

        const data = JSON.parse(storage)
        if (data && data.jwt) {
            login(data.jwt)
        }
    }, [login])

    return { login, logout, request, jwt, isAuthenticated }
}