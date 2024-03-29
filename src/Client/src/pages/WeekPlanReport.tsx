import { useEffect, useState } from "react"
import { dateAsShortStrFromNumber, dateToRequestStr } from "../common/dateFormatter"
import { WeekPlanReportToolbar } from "../components/WeekPlanReport/WeekPlanReportToolbar"
import { useHttp } from "../hooks/http.hook"
import { WeekPlanReportVm } from "../models/Reports/WeekPlanReportClasses"
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom";

export const WeekPlanReport: React.FunctionComponent = () => {
    const { request } = useHttp()
    const { t } = useTranslation();
    const navigate = useNavigate()
    const [week, setWeek] = useState<Date>()
    const [reportData, setReportData] = useState<WeekPlanReportVm>()

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

        request<WeekPlanReportVm>(`/api/v1/reports/week-plan/${dateToRequestStr(week)}`,
            "GET", null, [{ name: 'Content-Type', value: 'application/json' }])
            .then(data => {
                setReportData(data)
            })
    }, [week])

    const tdStyle = {
        border: "none"
    }

    if (!week || !reportData) {
        return <></>
    }

    return <div className='page-container'>
        <WeekPlanReportToolbar week={week} setWeek={setWeek} />
        <div
            style={{ marginTop: "8em" }}>
            {
                reportData.departments.map((dep, depIdx) => <Accordion key={"dep_" + depIdx}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography variant="h6">
                            {dep.name}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={300}>
                                            <b>{t('employee')}</b>
                                        </TableCell>
                                        <TableCell width={100}>
                                            <b>{t('rate')}</b>
                                        </TableCell>
                                        <TableCell>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell style={tdStyle} width={600}>
                                                            <b>{t('task')}</b>
                                                        </TableCell>
                                                        <TableCell style={tdStyle} width={100}>
                                                            <b>{t('hours')}</b>
                                                        </TableCell>
                                                        <TableCell style={tdStyle} width={200}>
                                                            <b>{t('task-period')}</b>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                            </Table>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        dep.users.map((u, uIdx) => <TableRow key={"u" + depIdx + "_" + uIdx}>
                                            <TableCell>{u.name}</TableCell>
                                            <TableCell>{u.rate}</TableCell>
                                            <TableCell>
                                                {
                                                    u.plans.length > 0 ?
                                                        (
                                                            <Table size="small">
                                                                <tbody>
                                                                    {
                                                                        u.plans.map((p, pIdx) => <TableRow key={"p" + depIdx + "_" + uIdx + "_" + pIdx}>
                                                                            <TableCell width={600} style={tdStyle}>
                                                                                <div
                                                                                    title={p.taskName}
                                                                                    style={{ display: "flex", flexDirection: "row", width: "inherit", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                                                    <div
                                                                                        style={{ cursor: "pointer" }}
                                                                                        onClick={() => { navigate(`/projects/${p.projectId}`) }}>
                                                                                        {p.projectId}
                                                                                    </div>
                                                                                    <div>
                                                                                        {p.projectName}
                                                                                    </div>
                                                                                    <div>
                                                                                        {
                                                                                            p.isVacation ? <>{t('vacation')}</> : <>&nbsp;{p.taskName}</>
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell width={100} style={tdStyle}>{p.hours}</TableCell>
                                                                            <TableCell width={200} style={tdStyle}>
                                                                                <div style={{ color: p.taskIsOutdated ? "red" : "black" }}>
                                                                                    {dateAsShortStrFromNumber(p.taskStart)} - {dateAsShortStrFromNumber(p.taskEnd)}
                                                                                </div>
                                                                            </TableCell>
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