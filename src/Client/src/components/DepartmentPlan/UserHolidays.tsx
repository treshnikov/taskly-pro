import { LocalizationProvider, StaticDatePicker } from "@mui/lab"
import { TextField, TextFieldProps } from "@mui/material"
import { JSXElementConstructor, ReactElement, useEffect, useState } from "react"

export type UserHolidaysProps = {
    start: Date
    end: Date
}

export const UserHolidays: React.FunctionComponent<UserHolidaysProps> = (props) => {
    const [years, setYears] = useState<number[]>([])

    const daysInLine = 6 * 7 - 5
    const days = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"]
    const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]

    useEffect(() => {
        // extract years
        let dt = props.start
        let years: Set<number> = new Set<number>()
        while (dt < props.end) {
            years.add(dt.getFullYear())
            dt.setDate(dt.getDate() + 1)
        }

        // calculate years to show
        setYears([...years])
    }, [])

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

                                                    return (
                                                        <td key={year + "_" + monthIdx + "_" + dIdx + "_td"}>
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