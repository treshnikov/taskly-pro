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
        // calculate years to show
        setYears([2022])
    }, [])

    return <>
        {
            years.map(year =>
                <table>
                    <thead>
                        <th></th>
                        {[...Array(daysInLine).keys()].map((w, wIdx) =>
                            <th>
                                {days[wIdx % 7]}
                            </th>
                        )}
                    </thead>
                    <tbody>
                        {
                            months.map((month, monthIdx) => {
                                let date = new Date(year, monthIdx, 1)
                                return (
                                    <tr>
                                        <td>{month}</td>
                                        {
                                            [...Array(daysInLine).keys()].map((d, dIdx) => {
                                                const dayOfWeek = (dIdx + 1) % 7

                                                let dateToDisplay = ''

                                                if (date.getMonth() === monthIdx && date.getDay() === dayOfWeek) {
                                                    dateToDisplay = date.getDate().toString()
                                                    date.setDate(date.getDate() + 1);
                                                }

                                                return (
                                                    <td>
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
            )
        }
    </>

}