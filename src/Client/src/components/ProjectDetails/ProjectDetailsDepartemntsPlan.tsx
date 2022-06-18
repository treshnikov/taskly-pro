import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, FormGroup, Stack, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hook";
import { IProjectTaskVm, ProjectTaskVm, ProjectTaskVmHelper } from "../../models/ProjectDetails/ProjectTaskVm";
import { changeTask, toggleShowDepartmentsPlan } from "../../redux/projectDetailsSlice";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type ProjectDetailsDepartemntsPlanProps = {
    afterClose: () => void
}

export const ProjectDetailsDepartemntsPlan: React.FunctionComponent<ProjectDetailsDepartemntsPlanProps> = ({ afterClose }) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch()
    const selectedRowIdx = useAppSelector(state => state.projectDetailsReducer.selectedRowIdx)
    const showDepartmentsPlan = useAppSelector(state => state.projectDetailsReducer.showDepartmentsPlan)
    const project = useAppSelector(state => state.projectDetailsReducer.project)
    const [changed, setChanged] = useState<boolean>(false)
    const [task, setTask] = useState<IProjectTaskVm>(new ProjectTaskVm())
    const [hideEmpty, setHideEmpty] = useState<boolean>(true)

    useEffect(() => {
        if (selectedRowIdx < 0) {
            return
        }

        if (selectedRowIdx >= 0 && project.tasks.length > selectedRowIdx) {
            // copy task and publish changes only after form close to prevent unnecessary re renders
            setTask({ ...project.tasks[selectedRowIdx] })
        }

    }, [selectedRowIdx, project.tasks])

    const updateLocalTask = (depId: string, userPositionId: string, hoursAsStr: string) => {
        const hours = Number(hoursAsStr)
        if (isNaN(hours)) {
            return
        }

        // todo
        const taskClone = JSON.parse(JSON.stringify(task)) as IProjectTaskVm

        const estIdx = taskClone.departmentEstimations.findIndex(e => e.departmentId === depId)
        if (estIdx === -1) {
            return
        }

        const recordIdx = taskClone.departmentEstimations[estIdx]
            ?.estimations.findIndex(e => e.userPositionId === userPositionId)
        if (recordIdx === -1) {
            return
        }

        taskClone.departmentEstimations[estIdx].estimations[recordIdx].hours = hours
        ProjectTaskVmHelper.recalcTotalHours(taskClone)
        setTask(taskClone)
        setChanged(true)
    }

    const onClose = () => {
        if (changed) {
            dispatch(changeTask({ task: task }))
        }
        dispatch(toggleShowDepartmentsPlan())
        setChanged(false)
        setTask(new ProjectTaskVm())
        afterClose()
    }

    return (
        <div>
            <Dialog
                scroll="paper"
                fullWidth={true}
                maxWidth="lg"
                PaperProps={{
                    style: {
                        minHeight: "90%",
                        maxHeight: "90%"
                    }
                }}

                open={showDepartmentsPlan}
                onClose={e => onClose()}
                aria-labelledby="_showDepartmentsPlan"
            >
                <DialogTitle id="_showDepartmentsPlan">
                    {task.description} {task.totalHours}{t('hour')}
                </DialogTitle>
                <Divider></Divider>
                <DialogContent>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox
                            value={hideEmpty}
                            checked={hideEmpty}
                            onChange={e => setHideEmpty(e.target.checked)}
                        />} label={t('hide-empty')} />
                    </FormGroup>                    {
                        task.departmentEstimations.filter(e => hideEmpty && e.totalHours === 0 ? false : true).map((i, idx) => {
                            return (
                                <Accordion key={task.id + "est" + idx}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls={"panel-content" + idx}
                                        id={"panelheader-content" + idx}
                                    >
                                        <Typography>{i.departmentShortName === '' ? i.departmentName : i.departmentShortName}: {i.totalHours}{t('hour')}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Stack direction="row" spacing={2}>
                                            {
                                                i.estimations.map((e, eidx) => {
                                                    return (
                                                        <span style={{ maxWidth: "300px" }} key={i.id + e.userPositionId}>
                                                            <div style={{ maxHeight: "60px", fontSize: "14px" }}>{e.userPositionName}:</div>
                                                            <TextField style={{ fontSize: "14px" }} variant="standard" value={e.hours}
                                                                onChange={ev => {
                                                                    updateLocalTask(i.departmentId, e.userPositionId, ev.target.value)
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