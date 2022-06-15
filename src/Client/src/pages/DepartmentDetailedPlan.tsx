import HotTable, { HotColumn } from "@handsontable/react";
import { Button, Checkbox, FormControlLabel, FormGroup, Grid, Menu, MenuItem, Stack, TextField, Typography } from "@mui/material";
import Handsontable from "handsontable";
import { CellChange, CellValue, ChangeSource, RangeType } from "handsontable/common";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { dateAsShortStrWithShortYear, dateTorequestStr } from "../common/dateFormatter";
import { getColor } from "../common/getColor";
import { useHttp } from "../hooks/http.hook";
import { DepartmentUserPlan as DepartmentUserPlan, DepartmentPlanFlatRecordVmHelper, DepartmentPlanUserRecordVm, DepartmentProjectPlan } from "../models/DepartmentPlan/DepartmentPlanClasses";
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { DatePicker } from "@mui/lab";
import moment from "moment";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { useAppDispatch, useAppSelector } from "../hooks/redux.hook";
import { updatePlan, onPlanChanged } from "../redux/departmentPlanSlice";

export const DepartmentDetailedPlan: React.FunctionComponent = () => {
    const departmentId = useParams<{ id?: string, name?: string }>()!.id
    const departmentName = useParams<{ id?: string, name?: string }>()!.name

    const dispatch = useAppDispatch()
    const plan = useAppSelector(state => state.departmentPlanReducer.plan)

    const { request } = useHttp()
    const { t } = useTranslation();

    const staticHeaders = ["Id", t('name'), t('position'), t('hours'), t('project')]
    const columnWidths = [50, 280, 50, 50, 330]
    const hotTableRef = useRef<HotTable>(null);

    const [headers, setHeaders] = useState<string[]>(['', '', '', '', ''])
    const [hiddenRows, setHiddenRows] = useState<number[]>([])
    const [startDate, setStartDate] = useState<Date>(new Date(new Date().getFullYear(), 0, 1))
    const [endDate, setEndDate] = useState<Date>(new Date(new Date().getFullYear(), 11, 31))

    // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    // const open = Boolean(anchorEl)
    // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    //     setAnchorEl(event.currentTarget);
    // }
    // const handleClose = () => {
    //     setAnchorEl(null)
    // }

    const getRowsWithEmtyPlans = (plan: DepartmentUserPlan[]): number[] => {
        let hiddenRows: number[] = [];
        let idx = 0;
        for (let i = 0; i < plan.length; i++) {
            idx++;
            for (let j = 0; j < plan[i].__children.length; j++) {
                if (!plan[i].__children[j].hours) {
                    hiddenRows.push(idx);
                }
                idx++;
            }
        }
        return hiddenRows;
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

    const onBeforePlanChange = (plan: DepartmentUserPlan[], projectId: string, weekId: string, hours: string): boolean => {
        // prevent editing cells with summary info
        if (projectId[0] === 'u') {
            return false
        }

        // extract week start
        // const weekIdx = parseInt(weekId.replace("week", ""))
        // let dt = startDate
        // while (dt.getDay() !== 1) {
        //     dt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() - 1)
        // }
        // dt.setDate(dt.getDate() + 7 * (weekIdx - 1))
        // const dtAsStr = dateTorequestStr(dt)

        dispatch(onPlanChanged({ projectId: projectId, weekId: weekId, hours: hours }))
        //request("/api/v1/departments/plan/" + departmentId + "/" + record.projectId + "/" + record.userId + "/" + dtAsStr + "/" + hours, "POST", {})

        return false
    }

    const weekPlanCellRenderer = (instance: Handsontable.Core, td: HTMLTableCellElement, row: number, col: number, prop: string | number, value: any, cellProperties: Handsontable.CellProperties): void => {
        Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);

        const rowId = instance.getDataAtCell(row, 0);

        // rows with user name contain summary info that should not be editable
        if (rowId[0] === 'u') {
            cellProperties.readOnly = true;
            td.style.fontStyle = 'italic';

            const valueAsFloat = parseFloat(value)
            if (!isNaN(valueAsFloat)) {
                td.style.fontWeight = '500'
                if (valueAsFloat === 40) {
                    td.style.background = '-webkit-linear-gradient(bottom, #ecffebaa 100%, white 100%)'
                }
                else {
                    if (valueAsFloat > 40) {
                        td.style.background = '-webkit-linear-gradient(bottom, #ffcccc88 100%, white 100%)'
                    }
                    else {
                        td.style.background = '-webkit-linear-gradient(bottom, #ffffe0aa 100%, white 100%)'
                    }
                }
            }
            else {
                td.style.background = '-webkit-linear-gradient(bottom, #f8f8f8 100%, white 100%)'
            }

        }
    }

    const projectCellRenderer = (instance: Handsontable.Core, td: HTMLTableCellElement, row: number, col: number, prop: string | number, value: any, cellProperties: Handsontable.CellProperties): void => {
        Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);

        const rowId = instance.getDataAtCell(row, 0);

        const color = getColor(value)
        if (rowId[0] === 'p') {
            td.style.background = '-webkit-linear-gradient(left, ' + color + '88 8px, white 8px)'
            td.style.paddingLeft = '10px'
        }
    }

    useEffect(() => {
        //todo pass start and end date
        request<DepartmentPlanUserRecordVm[]>(`/api/v1/departments/${departmentId}/${moment(startDate).format("YYYY-MM-DD")}/${moment(endDate).format("YYYY-MM-DD")}/plan`, 'GET').then(depPlan => {
            let headers: string[] = [...staticHeaders]
            const weekCount = (depPlan.length > 0 && depPlan[0].projects.length > 0)
                ? depPlan[0].projects[0].plans.length
                : 0
            headers = headers.concat(Array.from(Array(weekCount).keys()).map(i => {
                const dt = new Date(depPlan[0].projects[0].plans[i].weekStart)
                return dateAsShortStrWithShortYear(dt)
            }
            ))

            setHeaders(headers)

            const flatPlan = DepartmentPlanFlatRecordVmHelper.buildFlatPlan(depPlan)
            DepartmentPlanFlatRecordVmHelper.freezePlan(flatPlan)

            setHiddenRows(getRowsWithEmtyPlans(flatPlan))
            dispatch(updatePlan(flatPlan))
        })
    }, [startDate, endDate])

    useEffect(() => {
        if (plan && plan.length > 0 && hotTableRef && hotTableRef.current && hotTableRef.current.hotInstance) {
            //hotTableRef.current.hotInstance.render()
            hotTableRef.current.hotInstance.loadData(plan)
            //const plugin = hotTableRef.current.hotInstance.getPlugin('nestedRows') as any
            //plugin.collapsingUI.collapseAll()
        }
    }, [plan])

    return (
        <div className='page-container'>
            <div style={{ position: "fixed", top: "5em", left: "1em" }}>
                <Grid container>
                    <Grid item xs={12}>
                        <Stack direction={"row"} spacing={1} alignItems={"center"}>
                            <Typography variant='h6' style={{ maxWidth: "200px", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{departmentName}</Typography>

                            <DatePicker
                                views={['day']}
                                label={t('start')}
                                inputFormat="yyyy-MM-DD"
                                value={startDate}
                                onChange={(newValue) => { if (newValue) { setStartDate(newValue) } }}
                                renderInput={(params) => <TextField size="small" {...params} />}
                            />
                            <DatePicker
                                views={['day']}
                                label={t('end')}
                                inputFormat="yyyy-MM-DD"
                                value={endDate}
                                onChange={(newValue) => { if (newValue) { setEndDate(newValue) } }}
                                renderInput={(params) => <TextField size="small" {...params} />}
                            />

                            <Button variant="contained" size="small" startIcon={<SaveAltIcon />}
                                onClick={e => { }}>
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

                            {/* <Button
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                                variant="contained"
                                size="small"
                            >
                                ...
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem >Profile</MenuItem>
                                <MenuItem >My account</MenuItem>
                                <MenuItem >Logout</MenuItem>
                            </Menu> */}

                            <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox checked={hiddenRows.length > 0}
                                        onChange={e => { setHiddenRows(!e.target.checked ? [] : getRowsWithEmtyPlans(plan)) }}
                                    />}
                                    label={t('hide-project-with-no-estimation')} />
                            </FormGroup>
                        </Stack>
                    </Grid>
                </Grid>
            </div>
            <div style={{ marginTop: "8em" }}>
                <HotTable
                    id="projectDetailsTable"
                    ref={hotTableRef}
                    data={plan}
                    colHeaders={(idx: number) => {
                        if (idx < staticHeaders.length) {
                            return headers[idx]
                        }

                        return "<div style='font-size:10px;'>" + headers[idx] + "</div>"
                    }}

                    colWidths={columnWidths}
                    viewportColumnRenderingOffset={headers.length}
                    fixedColumnsLeft={staticHeaders.length}
                    hiddenColumns={{ columns: [0] }}
                    hiddenRows={{ rows: hiddenRows }}
                    maxCols={headers.length}
                    renderAllRows={true}
                    columnSorting={false}
                    rowHeaders={true}
                    nestedRows={true}
                    manualRowMove={false}
                    manualColumnMove={false}
                    wordWrap={true}
                    fillHandle={false}
                    manualColumnResize={true}

                    beforePaste={(data: CellValue[][], coords: RangeType[]): boolean => {
                        // DepartmentPlanFlatRecordVmHelper.recalcHours(plan)
                        // dispatch(updatePlan(plan))

                        // if (hotTableRef && hotTableRef.current && hotTableRef.current.hotInstance) {
                        //     hotTableRef.current.hotInstance.render()
                        // }

                        return false
                    }}

                    afterSelection={(row: number, column: number, row2: number, column2: number, preventScrolling: { value: boolean }, selectionLayerLevel: number) => {
                        preventScrolling.value = true
                    }}

                    beforeChange={(changes: CellChange[], source: ChangeSource) => {
                        if (!hotTableRef || !hotTableRef.current || !hotTableRef.current.hotInstance) {
                            return
                        }

                        const projectId = hotTableRef.current.hotInstance.getDataAtCell(changes[0][0], 0)
                        const weekId = changes[0][1]
                        const newValue = changes[0][3]

                        return onBeforePlanChange(plan, projectId, weekId as string, newValue)
                    }}

                    outsideClickDeselects={true}
                    licenseKey='non-commercial-and-evaluation'
                >
                    <HotColumn data={"id"} wordWrap={false} readOnly type={"text"} />
                    <HotColumn data={"userName"} wordWrap={false} readOnly type={"text"} />
                    <HotColumn data={"userPosition"} wordWrap={false} readOnly type={"text"} />
                    <HotColumn data={"hours"} type={"text"} readOnly />
                    <HotColumn data={"project"} type={"text"} readOnly >
                        {/* <ProjectNameRenderer hot-renderer></ProjectNameRenderer> */}
                    </HotColumn>
                    {
                        headers.slice(staticHeaders.length).map((header, idx) => {
                            return (
                                <HotColumn key={"depPlanWeek" + idx} data={"week" + (idx + 1).toString()} type={"text"}
                                    renderer={weekPlanCellRenderer}
                                >
                                </HotColumn>)
                        })
                    }
                </HotTable>
            </div>
        </div>)
}
