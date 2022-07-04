import { toast } from 'react-toastify'
import { useDispatch } from "react-redux"
import { onSignin, onSignout } from "../redux/authSlice"
import { useCallback } from 'react'
import { useAppSelector } from './redux.hook'
import { onRequestCompleted, onRequestStarted } from '../redux/appSlice'
import { useTranslation } from 'react-i18next'

export const useHttp = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch()
    const jwt = useAppSelector(state => state.authReducer.jwt)

    const login = async (data: FormData) => {
        const json = await request<{ jwt: string }>("/api/v1/auth/token", 'POST', data, [])
        dispatch(onSignin(json.jwt))
    }

    const logout = () => {
        dispatch(onSignout())
    }

    const request = useCallback(async<T>(address: string,
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
        body: any = null,
        headers: { name: string, value: string }[] = [],
        showSpinner: boolean = true,
        showToasts: boolean = true) => {

        const preparedHeaders = new Headers()
        preparedHeaders.append("Authorization", `Bearer ${jwt}`)
        headers?.forEach(e => {
            preparedHeaders.append(e.name, e.value)
        })

        let response
        try {
            if (showSpinner) {
                dispatch(onRequestStarted())
            }

            const preparedBody = body instanceof FormData
                ? body
                : JSON.stringify(body)

            response = method === "GET"
                ? await fetch(address, { method: method, headers: preparedHeaders })
                : await fetch(address, { method: method, headers: preparedHeaders, body: preparedBody })

        } catch (ex) {
            const err = ex as Error
            if (err && showToasts) {
                toast.error(err.message)
            }
            throw (ex)
        }
        finally {
            if (showSpinner) {
                dispatch(onRequestCompleted())
            }
        }

        if (response.status === 401 || response.status === 403) {
            if (showToasts) {
                toast.error(t('insufficient-privileges'))
            }

            // It's supposed that the client shouldn't send requests that bring it to the 401|403 states.
            // Nevertheless, if the client got this it might mean that the token has expired or the client requests a resource that requires higher privileges which means the login procedure must be repeated  
            dispatch(onSignout())
        }

        if (response.status === 404) {
            if (showToasts) {
                toast.error(response.statusText)
            }

            throw new Error(response.statusText)
        }

        const json = await response.json()

        if (response.ok) {
            return json as T
        }

        // handle error message from server's custom exceptions
        let errorText = response.statusText
        if (json.hasOwnProperty("Error")) {
            errorText += ": " + json.Error
        }

        if (showToasts) {
            toast.error(errorText)
        }
        throw new Error(errorText)
    }, [dispatch, jwt])

    return { login, logout, request }
}