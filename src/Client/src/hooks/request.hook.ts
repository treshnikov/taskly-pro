import { useCallback } from "react"
import { toast } from "react-toastify"

export const useRequest = () => {
    const request = useCallback(async (input: RequestInfo, init?: RequestInit) => {
        const response = await fetch(input, init)
        const json = await response.json()

        if (!response.ok) {
            let errorText = response.statusText
            if (json.hasOwnProperty("Error")) {
                errorText += ": " + json.Error
            }
            toast.error(errorText);

            throw new Error(errorText)
        }

        return json;

    }, [])

    return {request}
}
