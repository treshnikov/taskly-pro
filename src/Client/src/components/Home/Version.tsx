import { useEffect, useState } from "react"
import { useHttp } from "../../hooks/http.hook";

export const Version: React.FunctionComponent = () => {
    const { request } = useHttp()
    const [version, setVersion] = useState<string>("")
    const versionStyle = {
        position: 'fixed',
        bottom: 1,
        right: 1,
        fontSize: 'small',
        color: 'grey'
    } as React.CSSProperties

    useEffect(() => {
        async function fetchVersion() {
            const data = await fetch("/version")
            const ver = await data.text()
            setVersion(ver)
        }
        fetchVersion()
    }, [request])

    return <div style={versionStyle}>{version}</div>
}