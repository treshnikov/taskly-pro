import HotTable, { HotColumn } from "@handsontable/react";
import { Button, Checkbox, FormControlLabel, FormGroup, Grid, Stack, Typography } from "@mui/material";
import Handsontable from "handsontable";
import { CellChange, ChangeSource } from "handsontable/common";
import Core from "handsontable/core";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { dateAsShortStrWithShortYear } from "../common/dateFormatter";
import { getColor } from "../common/getColor";
import { ProjectNameRenderer } from "../components/DepartmentPlan/Renderers/ProjectNameRenderer";
import { useHttp } from "../hooks/http.hook";
import { DepartmentUserPlan as DepartmentUserPlan, DepartmentPlanFlatRecordVmHelper, DepartmentPlanUserRecordVm, DepartmentProjectPlan } from "../models/DepartmentPlan/DepartmentPlanClasses";
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import AddBoxIcon from '@mui/icons-material/AddBox';

const initData: DepartmentUserPlan[] = [{
    id: '',
    userName: '',
    userPosition: '',
    project: '',
    hours: '',
    __children: [],
}]

export const DepartmentDetailedPlan: React.FunctionComponent = () => {
    const departmentId = useParams<{ id?: string, name?: string }>()!.id
    const departmentName = useParams<{ id?: string, name?: string }>()!.name

    const { request } = useHttp()
    const { t } = useTranslation();

    const staticHeaders = ["Id", "User", "Position", "Hours", "Project"]
    const columnWidths = [50, 280, 50, 50, 330]
    const hotTableRef = useRef<HotTable>(null);

    // unfortunately, we must store the state locally because passing such amount of records to redux causes low performance
    const [plan, setPlan] = useState<DepartmentUserPlan[]>(initData)
    const [headers, setHeaders] = useState<string[]>(['', '', '', '', ''])
    const [hiddenRows, setHiddenRows] = useState<number[]>([])

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

    const onPlanChanged = (plan: DepartmentUserPlan[], projectId: string, weekId: string, hours: string): boolean => {
        // prevent editing cells with summary info
        if (projectId[0] === 'u') {
            return false
        }

        // find and update changed record
        let record: DepartmentProjectPlan = { id: '', hours: '', project: '', userPosition: '', userName: '' }
        const found = plan.some(u => u.__children.some(p => {
            record = p
            return p.id === projectId
        }))

        if (found) {
            record[weekId] = hours
            DepartmentPlanFlatRecordVmHelper.recalcHours(plan)
        }

        return true
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
                    td.style.background = '-webkit-linear-gradient(bottom, #ecffeb 20%, white 20%)'
                }
                else {
                    if (valueAsFloat > 40) {
                        td.style.background = '-webkit-linear-gradient(bottom, #ffcccc 20%, white 20%)'
                    }
                    else {
                        td.style.background = '-webkit-linear-gradient(bottom, #ffffe0 20%, white 20%)'
                    }
                }
            }
            else {
                td.style.background = '-webkit-linear-gradient(bottom, #f8f8f8 20%, white 20%)'
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
        request<DepartmentPlanUserRecordVm[]>(`/api/v1/departments/${departmentId}/2022-01-01/2022-12-31/plan`, 'GET').then(depPlan => {
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
            setHiddenRows(getRowsWithEmtyPlans(flatPlan))
            setPlan(flatPlan)
        })
    }, [])

    useEffect(() => {
        if (plan && plan.length > 0 && hotTableRef && hotTableRef.current && hotTableRef.current.hotInstance) {
            hotTableRef.current.hotInstance.loadData(plan)
            const plugin = hotTableRef.current.hotInstance.getPlugin('nestedRows') as any
            plugin.collapsingUI.collapseAll()
        }
    }, [plan])

    return (
        <div className='page-container'>
            <div style={{ position: "fixed", left: "1em", top: "4em" }}>
                <Grid container>
                    <Grid item md={11}>
                        <Stack direction={"row"} spacing={1}>
                            <Button size="small" variant="contained" startIcon={<AddBoxIcon />}
                                onClick={e => { expandAllRows() }}>
                                {t('expand')}
                            </Button>
                            <Button size="small" variant="contained" startIcon={<IndeterminateCheckBoxIcon />}
                                onClick={e => { collapseAllRows() }}>
                                {t('collapse')}
                            </Button>
                            <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox checked={hiddenRows.length > 0}
                                        onChange={e => { setHiddenRows(!e.target.checked ? [] : getRowsWithEmtyPlans(plan)) }}
                                    />}
                                    label={t('hide-project-with-no-estimation')} />
                            </FormGroup>
                        </Stack>
                    </Grid>
                    <Grid item md={1} style={{ textAlign: "right" }} paddingTop={0} paddingBottom={1}>
                        <Stack direction="row" paddingTop={1} paddingBottom={1} justifyContent="flex-end" >
                            <Typography variant='h6' style={{ whiteSpace: "nowrap" }}>{departmentName}</Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </div>
            <div style={{ paddingTop: "3.5em" }}>
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
                    renderAllRows={true}
                    columnSorting={false}
                    rowHeaders={true}
                    nestedRows={true}
                    manualRowMove={false}
                    manualColumnMove={false}
                    wordWrap={true}
                    fillHandle={false}
                    manualColumnResize={true}

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

                        return onPlanChanged(plan, projectId, weekId as string, newValue)
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
