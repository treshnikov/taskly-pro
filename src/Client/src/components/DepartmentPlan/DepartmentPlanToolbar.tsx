import { DatePicker } from "@mui/lab"
import { Button, Grid, Menu, MenuItem, Stack, TextField, Typography } from "@mui/material"
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { useTranslation } from "react-i18next";
import { useHttp } from "../../hooks/http.hook";
import { RefObject, useState } from "react";
import HotTable from "@handsontable/react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hook";
import { setEndDate, setHiddenRows, setStartDate } from "../../redux/departmentPlanSlice";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { DepartmentUserPlan } from "../../models/DepartmentPlan/DepartmentPlanClasses";
import { DepartmentPlanHelper } from "../../models/DepartmentPlan/DepartmentPlanHelper";

export const DepartmentPlanToolbar: React.FunctionComponent<{ hotTableRef: RefObject<HotTable>, departmentName: string, departmentId: string, plan: DepartmentUserPlan[] }> = ({ hotTableRef, departmentName, departmentId, plan }) => {
    const { request } = useHttp()
    const { t } = useTranslation()

    const dispatch = useAppDispatch()
    const startDate = useAppSelector(state => state.departmentPlanReducer.startDate)
    const endDate = useAppSelector(state => state.departmentPlanReducer.endDate)

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
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
                        renderInput={(params) => <TextField size="small" {...params} />}
                    />
                    <DatePicker
                        views={['day']}
                        label={t('end')}
                        inputFormat="yyyy-MM-DD"
                        value={endDate}
                        onChange={(newValue) => { if (newValue) { dispatch(setEndDate(new Date(newValue))) } }}
                        renderInput={(params) => <TextField size="small" {...params} />}
                    />

                    <Button variant="contained" size="small" startIcon={<SaveAltIcon />}
                        onClick={async e => {
                            if (!hotTableRef || !hotTableRef.current || !hotTableRef.current.hotInstance) {
                                return
                            }
                            const plugin = hotTableRef.current.hotInstance.getPlugin('nestedRows') as any
                            const collapsedRows: number[] = plugin.collapsingUI.collapsedRows as number[]
                            const data = DepartmentPlanHelper.preparePlanFToSendToServer(plan, new Date(startDate))

                            // using hooks causes render and the table renders all its rows expanded 
                            // even if they were collapsed before render which brings us to a need to save and restore collapsed rows
                            await request("/api/v1/departments/plan", "POST",
                                { departmentId: departmentId, data: data },
                                [{ name: 'Content-Type', value: 'application/json' }])

                            plugin.collapsingUI.collapseMultipleChildren(collapsedRows)
                        }}>
                        {t('save')}
                    </Button>

                    <Button variant="contained" size="small" startIcon={<AddBoxIcon />}
                        onClick={e => { expandAllRows() }}>
                        {t('expand')}
                    </Button>
                    <Button variant="contained" size="small" startIcon={<IndeterminateCheckBoxIcon />}
                        onClick={e => { collapseAllRows() }}>
                        {t('collapse')}
                    </Button>

                    <Button
                        startIcon={<MoreHorizIcon />}
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        variant="contained"
                        size="small"
                    >
                        &nbsp;
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={e => {
                            dispatch(setHiddenRows([]))
                            //handleClose()
                        }}>{t('show-project-with-no-estimation')}</MenuItem>

                        <MenuItem onClick={e => {
                            dispatch(setHiddenRows(DepartmentPlanHelper.getRowsWithEmtyPlans(plan)))
                            //handleClose()
                        }} >{t('hide-project-with-no-estimation')}</MenuItem>
                    </Menu>
                </Stack>
            </Grid>
        </Grid>
    </div>

}