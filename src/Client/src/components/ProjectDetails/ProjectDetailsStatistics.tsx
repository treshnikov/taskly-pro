import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Stack } from "@mui/material"
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hook";
import { DepartmentsPlan } from "../../models/ProjectDetails/DepartmentsPlan";
import { toggleShowStatistics } from "../../redux/projectDetailsSlice";
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js'
Chart.register(ArcElement);

export const ProjectDetailsStatistics: React.FunctionComponent = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch()
    const showStatistics = useAppSelector(state => state.projectDetailsReducer.showStatistics)
    const project = useAppSelector(state => state.projectDetailsReducer.project)
    const [plan, setPlan] = useState<DepartmentsPlan>(new DepartmentsPlan())

    const options = {
        cutoutPercentage: 70,
        layout: { padding: 25 },
        legend: {
            display: true
        },
        maintainAspectRatio: false,
        responsive: true,
    };

    const onClose = () => {
        dispatch(toggleShowStatistics())
    }

    const getLegendFlagStyle = (color: string) => {
        return {
            backgroundColor: color,
            verticalAlign: "top",
            height: "10px",
            width: "20px",
            marginLeft: "-2px",
            marginTop: "5px",
            marginRight: "2px"
        }
    }

    useEffect(() => {
        if (project.tasks?.length === 0) {
            setPlan(new DepartmentsPlan())
            return
        }

        const newPlan = new DepartmentsPlan()
        DepartmentsPlan.init(newPlan, project)
        setPlan(newPlan)
    }, [project])

    return (
        <div>
            <Dialog
                fullWidth={true}
                maxWidth="md"
                open={showStatistics}
                onClose={e => onClose()}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle
                    id="responsive-dialog-title">
                    {project.shortName}
                </DialogTitle>
                <Divider></Divider>
                <DialogContent>
                    <Grid
                        container>
                        <Grid
                            item
                            xs={7}>
                            {t('total-planned-hours')}: {project.totalHours}{t('hour')}
                            <ul>
                                {
                                    plan.depsToHoursRecords.map(i => {
                                        const hours = i.hours

                                        if (hours === 0) {
                                            return (<div key={project.id + i.name}></div>)
                                        }

                                        const percent = i.percent
                                        const color = i.color
                                        return (
                                            <li
                                                key={project.id + i.name}>
                                                <Stack
                                                    direction="row">
                                                    <span
                                                        style={getLegendFlagStyle(color)}>
                                                    </span>
                                                    <div
                                                        style={{ display: "inline" }}>
                                                        {i.name}: {hours}{t('hour')} <p style={{ display: "inline", color: "silver" }}>{percent}%</p>
                                                    </div>
                                                </Stack>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </Grid>
                        <Grid item xs={5}>
                            <Doughnut
                                data={plan.depsToHoursChartData} options={options}
                            />
                        </Grid>
                    </Grid>
                    <Divider></Divider>
                    <Grid container>
                        <Grid item xs={7}>
                            <ul>
                                {
                                    plan.userPositionsToHoursRecords.map(i => {
                                        const hours = i.hours

                                        if (hours === 0) {
                                            return (<div key={project.id + i.name}></div>)
                                        }

                                        const percent = i.percent
                                        const color = i.color
                                        return (
                                            <li key={project.id + i.name}>
                                                <Stack
                                                    direction="row">
                                                    <span
                                                        style={getLegendFlagStyle(color)}>
                                                    </span>

                                                    <div style={{ display: "inline" }}>
                                                        {i.name}: {hours}{t('hour')} <p style={{ display: "inline", color: "silver" }}>{percent}%</p>
                                                    </div>
                                                </Stack>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </Grid>
                        <Grid
                            item
                            xs={5}>
                            <Doughnut
                                data={plan.userPositionsToHoursChartData}
                                options={options}
                            />
                        </Grid>
                    </Grid>
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

