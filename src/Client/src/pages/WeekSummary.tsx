import { useEffect, useState } from "react"
import { dateAsShortStrFromNumber, dateToRequestStr } from "../common/dateFormatter"
import { WeekSummaryToolbar } from "../components/WeekSummary/WeekSummaryToolbar"
import { useHttp } from "../hooks/http.hook"
import { WeekSummaryReportVm } from "../models/Reports/WeekSummaryClasses"
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import zIndex from "@mui/material/styles/zIndex"

export const WeekSummary: React.FunctionComponent = () => {
    const { request } = useHttp()
    const [week, setWeek] = useState<Date>()
    const [reportData, setReportData] = useState<WeekSummaryReportVm>()

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

        request<WeekSummaryReportVm>(`/api/v1/reports/week-summary/${dateToRequestStr(week)}`,
            "GET", null, [{ name: 'Content-Type', value: 'application/json' }])
            .then(data => {
                setReportData(data)
            })
    }, [week])

    if (!week || !reportData) {
        return <></>
    }

    return <div className='page-container'>
        <WeekSummaryToolbar week={week} setWeek={setWeek} />
        <div
            style={{ marginTop: "8em" }}>
            {
                reportData.departments.map(dep => <Accordion key={dep.name}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography variant="h6">
                            {dep.name}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={300}>
                                            <b>User</b>
                                        </TableCell>
                                        <TableCell width={100}>
                                            <b>Rate</b>
                                        </TableCell>
                                        <TableCell>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        dep.users.map(u => <TableRow key={u.name}>
                                            <TableCell>{u.name}</TableCell>
                                            <TableCell>{u.rate}</TableCell>
                                            <TableCell>
                                                {
                                                    u.plans.length > 0 ?
                                                        (
                                                            <Table size="small">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell>
                                                                            <b>Task</b>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <b>Estimation</b>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <b>Tasks dates</b>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <tbody>
                                                                    {
                                                                        u.plans.map(p => <TableRow key={u.name + p.taskName}>
                                                                            <TableCell width={400} >{p.taskName}</TableCell>
                                                                            <TableCell width={100}>{p.hours}</TableCell>
                                                                            <TableCell width={200}>{dateAsShortStrFromNumber(p.taskStart)} - {dateAsShortStrFromNumber(p.taskEnd)}</TableCell>
                                                                        </TableRow>
                                                                        )
                                                                    }

                                                                </tbody>
                                                            </Table>
                                                        ) : (<></>)
                                                }
                                            </TableCell>
                                        </TableRow>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </AccordionDetails>
                </Accordion>
                )
            }
        </div>
    </div>
}