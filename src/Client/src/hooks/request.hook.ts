import { useCallback } from "react"
import { toast } from "react-toastify"

export const useRequest = () => {
    const request = useCallback(async (input: RequestInfo, init?: RequestInit) => {
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
    }, [])

    return { request }
}
