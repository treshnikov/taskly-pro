import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Stack } from "@mui/material"
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hook";
import { toggleShowDepartmentsPlan } from "../../redux/projectDetailsSlice";

export const ProjectDetailsDepartemntsPlan: React.FunctionComponent = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch()
    const selectedRowIdx = useAppSelector(state => state.projectDetailsReducer.selectedRowIdx)
    const showDepartmentsPlan = useAppSelector(state => state.projectDetailsReducer.showDepartmentsPlan)
    const project = useAppSelector(state => state.projectDetailsReducer.project)
    const [taskName, setTaskName] = useState<string>('') 

    useEffect(() => {
        if (selectedRowIdx < 0) {
            return
        }

        setTaskName((selectedRowIdx >= 0 && project.tasks.length > selectedRowIdx ? project.tasks[selectedRowIdx].description : ''))
    }, [selectedRowIdx])

    return (
        <div>
            <Dialog
                fullWidth={true}
                maxWidth="md"
                open={showDepartmentsPlan}
                onClose={e => dispatch(toggleShowDepartmentsPlan())}
                aria-labelledby="_showDepartmentsPlan"
            >
                <DialogTitle id="_showDepartmentsPlan">
                    {taskName}
                </DialogTitle>
                <Divider></Divider>
                <DialogContent>
                    <Grid container>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={e => dispatch(toggleShowDepartmentsPlan())} autoFocus>
                        {t('close')}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}