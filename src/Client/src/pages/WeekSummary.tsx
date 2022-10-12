import { useEffect, useState } from "react"
import { dateToRequestStr } from "../common/dateFormatter"
import { WeekSummaryToolbar } from "../components/WeekSummary/WeekSummaryToolbar"
import { useHttp } from "../hooks/http.hook"

export const WeekSummary: React.FunctionComponent = () => {
    const { request } = useHttp()
    const [week, setWeek] = useState<Date>()

    useEffect(() => {
        // get nearest monday
        let dt = new Date()
        while (dt.getDay() !== 1) {
            dt.setDate(dt.getDate() - 1)
        }
        setWeek(dt)
    }, [])


    useEffect(() => {
        if (!week) {
            return
        }

        request(`/api/v1/reports/week-summary/${dateToRequestStr(week)}`,
            "GET", null, [{ name: 'Content-Type', value: 'application/json' }])
            .then(data => {
                console.log(data)
            })
    }, [week])

    if (!week) {
        return <></>
    }

    return <div className='page-container'>
        <WeekSummaryToolbar week={week} setWeek={setWeek} />
        <div
            style={{ marginTop: "8em" }}>

        </div>
    </div>
}