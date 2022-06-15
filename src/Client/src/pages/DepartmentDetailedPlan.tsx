import HotTable, { HotColumn } from "@handsontable/react";
import Handsontable from "handsontable";
import { CellChange, CellValue, ChangeSource, RangeType } from "handsontable/common";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { dateAsShortStrWithShortYear, dateTorequestStr } from "../common/dateFormatter";
import { getColor } from "../common/getColor";
import { useHttp } from "../hooks/http.hook";
import { DepartmentUserPlan as DepartmentUserPlan, DepartmentPlanHelper, DepartmentPlanUserRecordVm, DepartmentProjectPlan } from "../models/DepartmentPlan/DepartmentPlanClasses";
import moment from "moment";
import { DepartmentPlanToolbar } from "../components/DepartmentPlan/DepartmentPlanToolbar";
import { useAppDispatch, useAppSelector } from "../hooks/redux.hook";
import { setHiddenRows } from "../redux/departmentPlanSlice";

const initPlan: DepartmentUserPlan[] = [{
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

    const staticHeaders = ["Id", t('name'), t('position'), t('hours'), t('project')]
    const columnWidths = [50, 280, 50, 50, 330]
    const hotTableRef = useRef<HotTable>(null);

    // unfortunately, we must store the state locally because passing such amount of records to redux causes low performance
    const [plan, setPlan] = useState<DepartmentUserPlan[]>(initPlan)
    const [headers, setHeaders] = useState<string[]>(['', '', '', '', ''])

    const dispatch = useAppDispatch()
    const startDate = useAppSelector(state => state.departmentPlanReducer.startDate)
    const endDate = useAppSelector(state => state.departmentPlanReducer.endDate)
    const hiddenRows = useAppSelector(state => state.departmentPlanReducer.hiddenRows)

    const onPlanChanged = (plan: DepartmentUserPlan[], projectId: string, weekId: string, hours: string): boolean => {
        // prevent editing cells with summary info
        if (projectId[0] === 'u') {
            return false
        }

        // find and update changed record
        let record: DepartmentProjectPlan = { id: '', hours: '', project: '', userPosition: '', userName: '', userId: '', projectId: 0 }
        const found = plan.some(u => u.__children.some(p => {
            record = p
            return p.id === projectId
        }))

        if (found) {
            // send changes to the server

            // extract week start
            const weekIdx = parseInt(weekId.replace("week", ""))
            let dt = new Date(startDate)
            while (dt.getDay() !== 1) {
                dt = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() - 1)
            }
            dt.setDate(dt.getDate() + 7 * (weekIdx - 1))
            const dtAsStr = dateTorequestStr(dt)

            record[weekId] = hours
            DepartmentPlanHelper.recalcHours(plan, record.userId)

            //request("/api/v1/departments/plan/" + departmentId + "/" + record.projectId + "/" + record.userId + "/" + dtAsStr + "/" + hours, "POST", {})

            return true
        }

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

            const flatPlan = DepartmentPlanHelper.buildFlatPlan(depPlan)
            dispatch(setHiddenRows(DepartmentPlanHelper.getRowsWithEmtyPlans(flatPlan)))
            setPlan(flatPlan)
        })
    }, [startDate, endDate])

    useEffect(() => {
        if (plan && plan.length > 0 && hotTableRef && hotTableRef.current && hotTableRef.current.hotInstance) {
            hotTableRef.current.hotInstance.loadData(plan)
            const plugin = hotTableRef.current.hotInstance.getPlugin('nestedRows') as any
            plugin.collapsingUI.collapseAll()
        }
    }, [plan])

    return (
        <div className='page-container'>
            <DepartmentPlanToolbar hotTableRef={hotTableRef} departmentName={departmentName as string}></DepartmentPlanToolbar>
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

                    afterPaste={(data: CellValue[][], coords: RangeType[]): void => {
                        DepartmentPlanHelper.recalcHours(plan)
                        if (hotTableRef && hotTableRef.current && hotTableRef.current.hotInstance) {
                            hotTableRef.current.hotInstance.render()
                        }
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
