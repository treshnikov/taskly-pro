import { useEffect, useState } from "react"
import { CalendarDayType, DayInfoVm } from "../../models/DepartmentPlan/DepartmentPlanClasses"
import { HOLIDAY_COLOR } from "./DepartmentPlanConst"

export type UserHolidaysProps = {
    start: number
    end: number
    days: DayInfoVm[]
}

export const UserHolidays: React.FunctionComponent<UserHolidaysProps> = (props) => {
    const [years, setYears] = useState<number[]>([])

    const daysInLine = 6 * 7 - 5
    const days = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]
    const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
    const [holidays, setHolidays] = useState<Set<Date>>(new Set<Date>())

    useEffect(() => {
        // extract years
        const startDate = new Date(props.start)
        const endDate = new Date(props.end)
        let dt = startDate
        let years: Set<number> = new Set<number>()
        while (dt < endDate) {
            years.add(dt.getFullYear())
            dt.setDate(dt.getDate() + 1)
        }
        setYears([...years])

        setHolidays(new Set<Date>(
                props.days.filter(i => i.dayType === CalendarDayType.Holiday).map(i => new Date(i.date))))

        console.log(holidays)
    }, [props.days])

    const getCellBackground = (date: Date): string => {
        if (holidays.has(date)) {

            console.log(date, "выходной")
            return HOLIDAY_COLOR
        }

        console.log(date, "не выходной")

        return ''
    }

    return <>
        {
            years.map(year =>
                <div key={year + "_scope"}>
                    <h3>{year}</h3>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                {[...Array(daysInLine).keys()].map((w, wIdx) =>
                                    <th key={year + "_" + wIdx + "_th"}>
                                        {days[wIdx % 7]}
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                months.map((month, monthIdx) => {
                                    let date = new Date(year, monthIdx, 1)
                                    return (
                                        <tr key={year + "_" + monthIdx + "_tr"}>
                                            <td key={year + "_" + monthIdx + "_tr_monthName"}>{month}</td>
                                            {
                                                [...Array(daysInLine).keys()].map((d, dIdx) => {
                                                    const dayOfWeek = (dIdx + 1) % 7

                                                    let dateToDisplay = ''

                                                    if (date.getMonth() === monthIdx && date.getDay() === dayOfWeek) {
                                                        dateToDisplay = date.getDate().toString()
                                                        date.setDate(date.getDate() + 1)
                                                    }

                                                    if (dateToDisplay === '') {
                                                        return <td></td>
                                                    }

                                                    return (
                                                        <td
                                                            style={{ background: getCellBackground(date) }}
                                                            key={year + "_" + monthIdx + "_" + dIdx + "_td"}>
                                                            {
                                                                dateToDisplay
                                                            }
                                                        </td>
                                                    )
                                                }
                                                )
                                            }
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            )
        }
    </>

}