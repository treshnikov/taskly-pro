import { DatePicker } from "@mui/lab"
import { Box, Button, FormControl, Grid, InputLabel, Menu, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material"
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { useTranslation } from "react-i18next";
import { useHttp } from "../../hooks/http.hook";
import { RefObject, useEffect, useState } from "react";
import HotTable from "@handsontable/react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hook";
import { setEndDate, setHiddenRows, setStartDate } from "../../redux/departmentPlanSlice";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { DepartmentUserPlan } from "../../models/DepartmentPlan/DepartmentPlanClasses";
import { DepartmentPlanHelper } from "../../models/DepartmentPlan/DepartmentPlanHelper";
import { toast } from 'react-toastify'

type ProjectSelectItem = {
    id: string,
    name: string
}

export const DepartmentPlanToolbar: React.FunctionComponent<{ hotTableRef: RefObject<HotTable>, departmentName: string, departmentId: string, plan: DepartmentUserPlan[] }> = ({ hotTableRef, departmentName, departmentId, plan }) => {
    const { request } = useHttp()
    const { t } = useTranslation()

    const dispatch = useAppDispatch()
    const startDate = useAppSelector(state => state.departmentPlanReducer.startDate)
    const endDate = useAppSelector(state => state.departmentPlanReducer.endDate)

    const [projectFilter, setprojectFilter] = useState<string>('0');
    const [projectSelectItems, setProjectSelectItems] = useState<ProjectSelectItem[]>([])

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

    const onProjectFilterChanged = (event: SelectChangeEvent) => {
        setprojectFilter(event.target.value as string);
    };

    const isAdditionalMenuOpen = Boolean(anchorEl)
    const onAdditionalMenuButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }
    const closeAdditionalMenu = () => {
        setAnchorEl(null)
    }

    const collapseAllRows = (): void => {
        if (hotTableRef && hotTableRef.current && hotTableRef.current.hotInstance) {
            const plugin = hotTableRef.current.hotInstance.getPlugin('nestedRows') as any
            plugin.collapsingUI.collapseAll()
        }
    }

    const expandAllRows = (): void => {
        if (hotTableRef && hotTableRef.current && hotTableRef.current.hotInstance) {
            const plugin = hotTableRef.current.hotInstance.getPlugin('nestedRows') as any
            plugin.collapsingUI.expandAll()
        }
    }

    const saveChanges = async () => {
        if (!hotTableRef || !hotTableRef.current || !hotTableRef.current.hotInstance) {
            return;
        }
        const plugin = hotTableRef.current.hotInstance.getPlugin('nestedRows') as any;
        const collapsedRows: number[] = plugin.collapsingUI.collapsedRows as number[];
        const data = DepartmentPlanHelper.preparePlanFToSendToServer(plan, new Date(startDate));

        // using hooks causes render and the table renders all its rows expanded 
        // even if they were collapsed previously  
        // this fact brings us to a need to save and restore collapsed rows
        await request("/api/v1/departments/plan", "POST",
            { departmentId: departmentId, data: data },
            [{ name: 'Content-Type', value: 'application/json' }]);

        toast.success(t('changes-saved'))

        plugin.collapsingUI.collapseMultipleChildren(collapsedRows);
    };

    const showAllProjects = () => {
        if (!hotTableRef || !hotTableRef.current || !hotTableRef.current.hotInstance) {
            return;
        }
        const plugin = hotTableRef.current.hotInstance.getPlugin('nestedRows') as any;
        const collapsedRows: number[] = plugin.collapsingUI.collapsedRows as number[];

        dispatch(setHiddenRows([]))

        setTimeout(() => {
            plugin.collapsingUI.collapseMultipleChildren(collapsedRows);
            closeAdditionalMenu()
        }, 100);
    }

    const showProjectsWithEstimation = () => {
        if (!hotTableRef || !hotTableRef.current || !hotTableRef.current.hotInstance) {
            return;
        }
        const plugin = hotTableRef.current.hotInstance.getPlugin('nestedRows') as any;
        const collapsedRows: number[] = plugin.collapsingUI.collapsedRows as number[];

        dispatch(setHiddenRows(DepartmentPlanHelper.getRowsWithEmtyPlans(plan)))

        setTimeout(() => {
            plugin.collapsingUI.collapseMultipleChildren(collapsedRows);
            closeAdditionalMenu()
        }, 100);
    }

    useEffect(() => {
        // extract list of all projects bounded with the given department
        if (plan.length > 0 && plan[0].__children.length > 0) {
            const depProjects = plan[0].__children.map(i => {
                const p: ProjectSelectItem = {
                    name: i.project,
                    id: i.projectId.toString()
                }
                return p
            })

            const allProjectsItem: ProjectSelectItem = {
                id: '0',
                name: t('all-projects')
            }

            setProjectSelectItems([allProjectsItem, ...depProjects])
        }
    }, [plan])

    return <div style={{ position: "fixed", top: "5em", left: "1em" }}>
        <Grid container>
            <Grid item xs={12}>
                <Stack direction={"row"} spacing={1} alignItems={"center"}>
                    <Typography variant='h6' style={{ maxWidth: "200px", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{departmentName}</Typography>

                    <DatePicker
                        views={['day']}
                        label={t('start')}
                        inputFormat="yyyy-MM-DD"
                        value={startDate}
                        onChange={(newValue) => { if (newValue) { dispatch(setStartDate(new Date(newValue))) } }}
                        renderInput={(params) => <TextField sx={{ width: 145 }} size="small" {...params} />}
                    />
                    <DatePicker
                        views={['day']}
                        label={t('end')}
                        inputFormat="yyyy-MM-DD"
                        value={endDate}
                        onChange={(newValue) => { if (newValue) { dispatch(setEndDate(new Date(newValue))) } }}
                        renderInput={(params) => <TextField sx={{ width: 145 }} size="small" {...params} />}
                    />
                    <Box sx={{ width: 250 }}>
                        <FormControl fullWidth>
                            <InputLabel id="projectLabelId">{t('project')}</InputLabel>
                            <Select
                                size="small"
                                labelId="projectLabelId"
                                id="demo-simple-select"
                                value={projectFilter}
                                label={t('project')}
                                onChange={onProjectFilterChanged}
                            >
                                {
                                    projectSelectItems.map(i => {
                                        return (
                                            <MenuItem
                                                key={"projSelect" + i.id}
                                                value={i.id}>
                                                {i.name}
                                            </MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Box>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<SaveAltIcon />}
                        onClick={saveChanges}>
                        {t('save')}
                    </Button>

                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddBoxIcon />}
                        onClick={e => { expandAllRows() }}>
                        {t('expand')}
                    </Button>

                    <Button variant="contained" size="small" startIcon={<IndeterminateCheckBoxIcon />}
                        onClick={e => { collapseAllRows() }}>
                        {t('collapse')}
                    </Button>

                    <Button
                        startIcon={<MoreHorizIcon />}
                        aria-controls={isAdditionalMenuOpen ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={isAdditionalMenuOpen ? 'true' : undefined}
                        onClick={onAdditionalMenuButtonClick}
                        variant="contained"
                        size="small"
                    >
                        &nbsp;
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={isAdditionalMenuOpen}
                        onClose={closeAdditionalMenu}
                    >
                        <MenuItem
                            onClick={e => { showAllProjects() }}>
                            {t('show-project-with-no-estimation')}
                        </MenuItem>
                        <MenuItem
                            onClick={e => { showProjectsWithEstimation() }} >
                            {t('hide-project-with-no-estimation')}
                        </MenuItem>
                    </Menu>
                </Stack>
            </Grid>
        </Grid>
    </div>

}