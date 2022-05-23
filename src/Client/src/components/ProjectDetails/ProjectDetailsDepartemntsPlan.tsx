import { Accordion, AccordionDetails, AccordionSummary, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Stack, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hook";
import { IProjectTaskVm, ProjectTaskVm } from "../../models/ProjectDetails/ProjectTaskVm";
import { toggleShowDepartmentsPlan } from "../../redux/projectDetailsSlice";
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
            setTask(project.tasks[selectedRowIdx])
        }

    }, [selectedRowIdx])

    return (
        <div>
            <Dialog
                scroll="paper"
                fullWidth={true}
                maxWidth="md"
                open={showDepartmentsPlan}
                onClose={e => dispatch(toggleShowDepartmentsPlan())}
                aria-labelledby="_showDepartmentsPlan"
            >
                <DialogTitle id="_showDepartmentsPlan">
                    {task.description}
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
                                        <Typography>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                            malesuada lacus ex, sit amet blandit leo lobortis eget.
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>

                            )
                        })
                    }


                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={e => dispatch(toggleShowDepartmentsPlan())}>
                        {t('close')}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}