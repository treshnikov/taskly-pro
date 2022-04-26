import { useState, useCallback, useEffect } from 'react'

const storageName = 'taskly-user-data'

export const useAuth = () => {
    const [jwt, setJwt] = useState<string>('')

    const login = useCallback((jwtToken: string) => {
        setJwt(jwtToken)
        localStorage.setItem(storageName, JSON.stringify({ jwt: jwtToken }))
    }, [])

    const logout = useCallback(() => {
        setJwt('')
        localStorage.removeItem(storageName)
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

    return { login, logout, jwt: jwt }
}