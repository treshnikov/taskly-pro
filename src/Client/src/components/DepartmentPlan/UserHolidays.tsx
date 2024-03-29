import { Table, TableCell, TableHead } from "@mui/material"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { CalendarDayType, DayInfoVm } from "../../models/DepartmentPlan/DepartmentPlanClasses"
import { VACATION_BACKGROUND_COLOR, HOLIDAY_COLOR, VACATION_COLOR, MATERNITY_LEAVE_DAY_BACKGROUND_COLOR } from "./DepartmentPlanConst"
import { UserHolidaysLegend } from "./UserHolidaysLegend"

export type UserHolidaysProps = {
    start: number
    end: number
    days: DayInfoVm[]
}

export const UserHolidays: React.FunctionComponent<UserHolidaysProps> = (props) => {
    const { t } = useTranslation();
    const [years, setYears] = useState<number[]>([])

    const daysInLine = 6 * 7 - 5
    const days = t('week-days').split(',')
    const months = t('months').split(',')

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

    }, [props.days])

    const getThStyle = (day: number) => {
        return {
            color: day === 5 || day === 6
                ? "red"
                : "black",
        }
    }

    const tableStyle = {
        fontSize: "13px",
    }

    const getCellBackgroundStyle = (date: Date) => {
        const dayInfo = props.days.find(d => d.date === date.getTime())
        const isHoliday = dayInfo && dayInfo.dayType === CalendarDayType.Holiday
        const isVacation = dayInfo && dayInfo.dayType === CalendarDayType.Vacation
        const isMaternityLeave = dayInfo && dayInfo.dayType === CalendarDayType.MaternityLeave

        return {
            color:
                isHoliday
                    ? HOLIDAY_COLOR
                    : isVacation || isMaternityLeave
                        ? VACATION_COLOR
                        : '',
            background: isVacation
                ? VACATION_BACKGROUND_COLOR
                : isMaternityLeave 
                    ? MATERNITY_LEAVE_DAY_BACKGROUND_COLOR
                    : '',
            textAlign: "center" as const,
            fontWeight: isHoliday || isVacation ? "bold" : '',
        }
    }

    return <>
        {
            years.map(year =>
                <div key={year + "_scope"}>
                    <h3>{year}</h3>
                    <Table style={tableStyle} cellPadding={1} cellSpacing={0}>
                        <TableHead>
                            <tr>
                                <TableCell></TableCell>
                                {[...Array(daysInLine).keys()].map((w, wIdx) =>
                                    <th key={year + "_" + wIdx + "_th"}
                                        style={getThStyle(wIdx % 7)}>
                                        {days[wIdx % 7]}
                                    </th>
                                )}
                            </tr>
                        </TableHead>
                        <tbody key={year + "_tbody"}>
                            {
                                months.map((month, monthIdx) => {
                                    let date = new Date(Date.UTC(year, monthIdx, 1))
                                    return (
                                        <tr key={year + "_" + monthIdx + "_tr"}>
                                            <td style={tableStyle} key={year + "_" + monthIdx + "_tr_monthName"}>{month}</td>
                                            {
                                                [...Array(daysInLine).keys()].map((d, dIdx) => {
                                                    const dayOfWeek = (dIdx + 1) % 7

                                                    let dateToDisplay = ''
                                                    let styles = {}

                                                    if (date.getMonth() === monthIdx && date.getDay() === dayOfWeek) {
                                                        dateToDisplay = date.getDate().toString()
                                                        styles = getCellBackgroundStyle(date)
                                                        date.setDate(date.getDate() + 1)
                                                    }

                                                    if (dateToDisplay === '') {
                                                        return <td style={tableStyle} key={year + "_" + monthIdx + "_" + dIdx + "_td"}> </td>
                                                    }

                                                    return (
                                                        <td
                                                            style={styles}
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
                    </Table>
                    <UserHolidaysLegend/>
                </div>
            )
        }
    </>

}