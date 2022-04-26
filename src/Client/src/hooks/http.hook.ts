import { useState, useCallback } from 'react'

export const useHttp = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    const request = useCallback(async (url: string, method: string = 'GET', body: any = undefined, headers: any = null) => {
        setLoading(true)
        try {
            if (!headers) {
                headers = {}
            }

            if (body) {
                body = JSON.stringify(body)
                headers['Content-Type'] = 'application/json'
            }

            const response = await fetch(url, { method, body, headers })
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Error occured.')
            }

            setLoading(false)

            return data
        } catch (e) {
            setLoading(false)
            setError((e as Error).message)
            throw e
        }
    }, [])

    const clearError = useCallback(() => setError(''), [])

    return { loading, request, error, clearError }
}
