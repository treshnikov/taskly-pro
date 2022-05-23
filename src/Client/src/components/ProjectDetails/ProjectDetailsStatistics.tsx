import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Stack } from "@mui/material"
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hook";
import { DepartmentsPlan } from "../../models/ProjectDetails/DepartmentsPlan";
import { toggleShowStatistics } from "../../redux/projectDetailsSlice";
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js'
import { ProjectTaskUnitEstimationVmHelper } from "../../models/ProjectDetails/ProjectTaskUnitEstimationVm";
Chart.register(ArcElement);

class Datasets {
    data: number[] = []
    backgroundColor: string[] = []
}

class ChartData {
    labels: string[] = []
    datasets: Datasets[] = [new Datasets()]
    hoverOffset: number = 4
}

export const ProjectDetailsStatistics: React.FunctionComponent = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch()
    const showStatistics = useAppSelector(state => state.projectDetailsReducer.showStatistics)
    const project = useAppSelector(state => state.projectDetailsReducer.project)
    const [plan, setPlan] = useState<DepartmentsPlan>(new DepartmentsPlan())
    const [chartData, setChartData] = useState<ChartData>(new ChartData())

    const options = {
        cutoutPercentage: 80,
        layout: { padding: 0 },
        legend: {
            display: true
        },
        maintainAspectRatio: false,
        responsive: true,
    };

    const sortFunc = useCallback((a: string, b: string) => {
        const h1 = plan.records.get(a) as number
        const h2 = plan.records.get(b) as number

        return (h1 && h2 && h1 > h2 ? -1 : 1);
    }, [plan.records])

    useEffect(() => {
        if (project.tasks?.length === 0) {
            return
        }
        const newPlan = new DepartmentsPlan()
        DepartmentsPlan.init(newPlan, project)
        setPlan(newPlan)
    }, [project])

    useEffect(() => {
        const newChartData = new ChartData()
        Array.from(plan.records.keys()).sort(sortFunc).forEach(p => {
            const depName = p
            const hours = plan.records.get(depName) as number

            newChartData.labels.push(depName)
            newChartData.datasets[0].data.push(hours)
            newChartData.datasets[0].backgroundColor.push(ProjectTaskUnitEstimationVmHelper.getColor(depName))
        });
        setChartData(newChartData)
    }, [plan, sortFunc])

    return (
        <div>
            <Dialog
                fullWidth={true}
                maxWidth="md"
                open={showStatistics}
                onClose={e => dispatch(toggleShowStatistics())}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {project.shortName}
                </DialogTitle>
                <Divider></Divider>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={7}>
                            {t('total-planned-hours')}: {project.totalHours}{t('hour')}
                            <ul>
                                {
                                    Array.from(plan.records.keys()).sort(sortFunc).map(i => {
                                        const hours = plan.records.get(i) as number

                                        if (hours === 0) { 
                                            return <></>
                                        }

                                        const percent = (100 * hours / project.totalHours).toFixed(2)
                                        const color = ProjectTaskUnitEstimationVmHelper.getColor(i)
                                        return (
                                            <li key={project.id + i}>
                                                <Stack direction="row">
                                                    <span style={{
                                                        backgroundColor: color,
                                                        verticalAlign: "top",
                                                        height: "10px",
                                                        width: "20px",
                                                        marginLeft: "-2px",
                                                        marginTop: "5px",
                                                        marginRight: "2px"
                                                    }}>
                                                    </span>
                                                    <div style={{ display: "inline" }}>
                                                        {i}: {hours}{t('hour')} <p style={{ display: "inline", color: "silver" }}>{percent}%</p>
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
                                data={chartData} options={options}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={e => dispatch(toggleShowStatistics())}>
                        {t('close')}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}