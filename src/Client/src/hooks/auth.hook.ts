import { useState, useCallback, useEffect } from 'react'

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

    return { login, logout, jwt: jwt, isAuthenticated }
}