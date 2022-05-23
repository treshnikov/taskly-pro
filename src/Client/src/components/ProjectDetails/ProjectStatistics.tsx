import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle, Divider, Grid, Stack, useMediaQuery, useTheme } from "@mui/material"
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hook";
import { DepartmentsPlan } from "../../models/ProjectDetails/DepartmentsPlan";
import { toggleShowStatistics } from "../../redux/projectDetailsSlice";
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement } from 'chart.js'
Chart.register(ArcElement);

export const ProjectStatistics: React.FunctionComponent = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch()
    const showStatistics = useAppSelector(state => state.projectDetailsReducer.showStatistics)
    const project = useAppSelector(state => state.projectDetailsReducer.project)
    const [plan, setPlan] = useState<DepartmentsPlan>(new DepartmentsPlan())
    const theme = useTheme();

    const data = {
        labels: [
            'Red',
            'Blue',
            'Yellow'
        ],
        datasets: [{
            label: 'My First Dataset',
            data: [300, 50, 100],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
        }]
    };

    const options = {
        //animation: false,
        cutoutPercentage: 80,
        layout: { padding: 0 },
        legend: {
            display: true
        },
        maintainAspectRatio: false,
        responsive: true,
        tooltips: {
            backgroundColor: theme.palette.background.paper,
            bodyFontColor: theme.palette.text.secondary,
            borderColor: theme.palette.divider,
            borderWidth: 1,
            enabled: true,
            footerFontColor: theme.palette.text.secondary,
            intersect: false,
            mode: 'index',
            titleFontColor: theme.palette.text.primary
        },
    };



    useEffect(() => {
        if (project.tasks?.length === 0) {
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
                onClose={e => dispatch(toggleShowStatistics())}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {project.name}
                </DialogTitle>
                <Divider></Divider>
                <DialogContent style={{ height: "500px" }}>
                    <Grid container>
                        <Grid item xs={6}>
                            {t('total-planned-hours')}: {project.totalHours}{t('hour')}
                            <ul>
                                {
                                    Array.from(plan.records.keys()).sort((a, b) => {

                                        const h1 = plan.records.get(a)
                                        const h2 = plan.records.get(b)

                                        return (h1 && h2 && h1 > h2 ? -1 : 1)

                                    }
                                    ).map(i => {
                                        return (
                                            <li key={project.id + i}>
                                                <Stack direction="row">
                                                    <span style={{
                                                        backgroundColor: "green",
                                                        display: "inline-block",
                                                        verticalAlign: "top",
                                                        height: "10px",
                                                        width: "20px",
                                                        marginLeft: "-2px",
                                                        marginTop: "5px",
                                                        marginRight: "2px"
                                                    }}>
                                                    </span>
                                                    <div>
                                                        {i}: {plan.records.get(i)}{t('hour')}
                                                    </div>
                                                </Stack>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </Grid>
                        <Grid item xs={6}>
                            <Doughnut
                                data={data} options={options}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={e => dispatch(toggleShowStatistics())} autoFocus>
                        {t('close')}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}