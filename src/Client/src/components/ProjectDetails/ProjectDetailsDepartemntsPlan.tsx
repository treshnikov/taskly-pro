import { Accordion, AccordionDetails, AccordionSummary, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hook";
import { IProjectTaskVm, ProjectTaskVm, ProjectTaskVmHelper } from "../../models/ProjectDetails/ProjectTaskVm";
import { changeTask, toggleShowDepartmentsPlan } from "../../redux/projectDetailsSlice";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const ProjectDetailsDepartemntsPlan: React.FunctionComponent = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch()
    const selectedRowIdx = useAppSelector(state => state.projectDetailsReducer.selectedRowIdx)
    const showDepartmentsPlan = useAppSelector(state => state.projectDetailsReducer.showDepartmentsPlan)
    const project = useAppSelector(state => state.projectDetailsReducer.project)

    const [task, setTask] = useState<IProjectTaskVm>(new ProjectTaskVm())

    useEffect(() => {
        if (selectedRowIdx < 0) {
            return
        }

        if (selectedRowIdx >= 0 && project.tasks.length > selectedRowIdx) {
            // copy task and publish changes only after form close to prevent unnecessary re renders
            setTask({ ...project.tasks[selectedRowIdx] })
        }

    }, [selectedRowIdx, project.tasks])

    const updateLocalTask = (unitId: string, userPositionId: string, hoursAsStr: string) => {
        const hours = Number(hoursAsStr)
        if (isNaN(hours)){
            return
        }
        
        // todo
        const taskClone = JSON.parse(JSON.stringify(task)) as IProjectTaskVm

        const estIdx = taskClone.unitEstimations.findIndex(e => e.unitId === unitId)
        if (estIdx === -1) {
            return
        }

        const recordIdx = taskClone.unitEstimations[estIdx]
            ?.estimations.findIndex(e => e.userPositionId === userPositionId)
        if (recordIdx === -1) {
            return
        }

        taskClone.unitEstimations[estIdx].estimations[recordIdx].hours = hours
        ProjectTaskVmHelper.recalcTotalHours(taskClone)
        setTask(taskClone)

    }

    const onClose = () => {
        dispatch(toggleShowDepartmentsPlan())
        dispatch(changeTask({task: task}))
    }

    return (
        <div>
            <Dialog
                scroll="paper"
                fullWidth={true}
                maxWidth="lg"
                open={showDepartmentsPlan}
                onClose={e => onClose()}
                aria-labelledby="_showDepartmentsPlan"
            >
                <DialogTitle id="_showDepartmentsPlan">
                    {task.description} {task.totalHours}{t('hour')}
                </DialogTitle>
                <Divider></Divider>
                <DialogContent>
                    {
                        task.unitEstimations.map((i, idx) => {
                            return (
                                <Accordion key={task.id + "est" + idx}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls={"panel-content" + idx}
                                        id={"panelheader-content" + idx}
                                    >
                                        <Typography>{i.unitShortName === '' ? i.unitName : i.unitShortName}: {i.totalHours}{t('hour')}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Stack direction="row" spacing={2}>
                                            {
                                                i.estimations.map((e, eidx) => {
                                                    return (
                                                        <span style={{ maxWidth: "300px" }} key={i.id + e.userPositionId}>
                                                            <div style={{ height: "48px", fontSize: "14px" }}>{e.userPositionName}:</div>
                                                            <TextField style={{ fontSize: "14px" }} variant="standard" value={e.hours}
                                                                onChange={ev => {
                                                                    updateLocalTask(i.unitId, e.userPositionId, ev.target.value)
                                                                }} />
                                                        </span>
                                                    )
                                                })
                                            }
                                        </Stack>
                                    </AccordionDetails>
                                </Accordion>

                            )
                        })
                    }


                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={e => onClose()}>
                        {t('close')}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}