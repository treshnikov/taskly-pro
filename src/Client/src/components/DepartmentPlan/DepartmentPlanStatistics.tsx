import HotTable, { HotColumn } from "@handsontable/react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Stack } from "@mui/material"
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { dateAsShortStr, dateToRequestStr } from "../../common/dateFormatter";
import { useHttp } from "../../hooks/http.hook";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hook";
import { DepartmentUserPlan } from "../../models/DepartmentPlan/DepartmentPlanClasses";
import { toggleShowStatistics } from "../../redux/departmentPlanSlice";

export type DepartmentPlanStatisticsProps = {
    departmentId: string
    start: Date
    end: Date
    departmentName: string
    plan: DepartmentUserPlan[]
}

interface DepartmentStatisticsVm {
    projects: ProjectStatisticsVm[]
}

interface ProjectStatisticsVm {
    id: number
    name: string
    plannedTaskHoursForDepartment: number
    plannedTaskHoursByDepartment: number
}

export const DepartmentPlanStatistics: React.FunctionComponent<DepartmentPlanStatisticsProps> = (props) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch()
    const showStatistics = useAppSelector(state => state.departmentPlanReducer.showStatistics)
    const { request } = useHttp()

    const [projectStatistics, setProjectStatistics] = useState<ProjectStatisticsVm[]>([])
    const [hoursInWeeks, setHoursInWeeks] = useState<number>(0)
    //const [totalHoursForDepartment, setTotalHoursForDepartment] = useState<number>(0)
    //const [totalHoursByDepartment, setTotalHoursByDepartment] = useState<number>(0)

    const onClose = () => {
        dispatch(toggleShowStatistics())
    }

    useEffect(() => {
        if (!showStatistics) {
            return
        }

        request(`/api/v1/departments/${props.departmentId}/${dateToRequestStr(props.start)}/${dateToRequestStr(props.end)}/statistics`,
            "GET",
            null,
            [{ name: 'Content-Type', value: 'application/json' }])
            .then(data => setProjectStatistics((data as DepartmentStatisticsVm).projects))


        calcPlannedHours()
    }, [showStatistics])

    const getEmployeeNumber = (): number => {
        return props.plan?.map(i => i.rate)?.reduce((p, c) => { return p + c })
    }

    const calcPlannedHours = () => {
        let mondaysCount = 0
        const dt = props.start
        while (dt < props.end) {
            if (dt.getDay() === 1) {
                mondaysCount += 1
            }

            dt.setDate(dt.getDate() + 1)
        }

        setHoursInWeeks(mondaysCount * 8 * 5 * getEmployeeNumber())
    }

    if (projectStatistics.length === 0) {
        return <></>
    }

    return (
        <div>
            <Dialog
                scroll="paper"
                maxWidth="lg"
                PaperProps={{ style: { minHeight: "90%", maxHeight: "90%", minWidth: "90%", maxWidth: "90%" } }}
                open={showStatistics}
                onClose={e => onClose()}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle
                    id="responsive-dialog-title">
                    {props.departmentName}. {t('statistics')}
                </DialogTitle>
                <Divider />
                <DialogContent
                    style={{ overflowX: "hidden" }}>
                    <div>
                        <h4>
                            {t('statistics')}
                        </h4>
                        <ul>
                            <li>
                                Период: {dateAsShortStr(props.start)} - {dateAsShortStr(props.end)}
                            </li>
                            <li>
                                Доступное время для планирования: {getEmployeeNumber()} человек / {hoursInWeeks} {t('hour')}
                            </li>
                            <li>
                                Согласно плану проектов, необходимо спланировать: {
                                    projectStatistics.map(i => i.plannedTaskHoursForDepartment)?.reduce((p, c) => { return p + c })
                                } {t('hour')}
                            </li>
                            <li>
                                Суммарное время запланированное на отдел: {
                                    projectStatistics.map(i => i.plannedTaskHoursByDepartment)?.reduce((p, c) => { return p + c })
                                } {t('hour')}
                            </li>
                        </ul>
                        <h4>
                            Детализация по проектам
                        </h4>
                        <HotTable
                            style={{ width: "80%" }}
                            columnSorting={true}
                            data={projectStatistics}
                            colHeaders={["Id", t('project'), t('project-plan-time'), t('department-plan-time')]}
                            fillHandle={false}
                            manualRowMove={false}
                            manualColumnMove={false}
                            wordWrap={true}
                            manualColumnResize={true}
                            licenseKey='non-commercial-and-evaluation'
                        >
                            <HotColumn data={"id"} className='htCenter' readOnly type={"text"} />
                            <HotColumn data={"name"} readOnly type={"text"} />
                            <HotColumn data={"plannedTaskHoursForDepartment"} className='htCenter' readOnly type={"text"} />
                            <HotColumn data={"plannedTaskHoursByDepartment"} className='htCenter' readOnly type={"text"} />
                        </HotTable>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        size='small'
                        variant="contained"
                        onClick={e => onClose()}>
                        {t('close')}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

