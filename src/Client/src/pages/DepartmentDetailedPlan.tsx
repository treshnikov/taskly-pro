import HotTable, { HotColumn } from "@handsontable/react";
import { CellChange, CellValue, ChangeSource, RangeType } from "handsontable/common";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { dateAsShortStrWithShortYear } from "../common/dateFormatter";
import { useHttp } from "../hooks/http.hook";
import { DepartmentUserPlan, DepartmentPlanUserRecordVm } from "../models/DepartmentPlan/DepartmentPlanClasses";
import { DepartmentPlanHelper } from "../models/DepartmentPlan/DepartmentPlanHelper";
import moment from "moment";
import { DepartmentPlanToolbar } from "../components/DepartmentPlan/DepartmentPlanToolbar";
import { useAppDispatch, useAppSelector } from "../hooks/redux.hook";
import { WeekPlanCellRenderer } from "../components/DepartmentPlan/Renderers/WeekPlanCellRenderer";
import { ProjectNameCellRenderer } from "../components/DepartmentPlan/Renderers/ProjectNameCellRenderer";
import { ServicesStorageHelper } from "../common/servicesStorageHelper";
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
    const navigate = useNavigate()

    // workaround for passing a navigate function to ProjectNameCellRenderer that cannot be extended by adding new props without changing the source code of the component
    ServicesStorageHelper.navigateFunction = (arg: string) => { navigate(arg) }

    // unfortunately, we must store the state locally because passing such an amount of records to redux causes low performance even the records will be frozen
    const [plan, setPlan] = useState<DepartmentUserPlan[]>(initPlan)
    const [headers, setHeaders] = useState<string[]>(['', '', '', '', ''])

    const dispatch = useAppDispatch()
    const startDate = useAppSelector(state => state.departmentPlanReducer.startDate)
    const endDate = useAppSelector(state => state.departmentPlanReducer.endDate)
    const hiddenRows = useAppSelector(state => state.departmentPlanReducer.hiddenRows)

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

            // hide rows with empty estimation by default
            dispatch(setHiddenRows(DepartmentPlanHelper.getProjectRows(flatPlan, (i => !i.hours))))
            setPlan(flatPlan)
        })
    }, [startDate, endDate, departmentId])

    useEffect(() => {
        if (plan && plan.length > 0 && hotTableRef && hotTableRef.current && hotTableRef.current.hotInstance) {
            hotTableRef.current.hotInstance.loadData(plan)
            const plugin = hotTableRef.current.hotInstance.getPlugin('nestedRows') as any
            plugin.collapsingUI.collapseAll()
        }
    }, [plan])

    return (
        <div
            className='page-container'>
            <DepartmentPlanToolbar
                hotTableRef={hotTableRef}
                departmentName={departmentName as string}
                departmentId={departmentId as string}
                plan={plan}
            ></DepartmentPlanToolbar>
            <div
                style={{ marginTop: "8em" }}>
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

                    afterDocumentKeyDown={(event: KeyboardEvent): void => {
                        if (event.key === 'Delete' || event.key === 'Backspace') {
                            DepartmentPlanHelper.recalcHours(plan)
                            if (hotTableRef && hotTableRef.current && hotTableRef.current.hotInstance) {
                                hotTableRef.current.hotInstance.render()
                            }
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
                        const newValue = changes[0][3] ? changes[0][3] : 0
                        return DepartmentPlanHelper.onPlanChanged(plan, projectId, weekId as string, newValue)
                    }}

                    outsideClickDeselects={true}
                    licenseKey='non-commercial-and-evaluation'
                >
                    <HotColumn
                        data={"id"}
                        wordWrap={false}
                        readOnly
                        type={"text"}
                    />
                    <HotColumn
                        data={"userName"}
                        wordWrap={false}
                        readOnly
                        type={"text"}
                    />
                    <HotColumn
                        data={"userPosition"}
                        wordWrap={false}
                        readOnly
                        type={"text"}
                    />
                    <HotColumn
                        data={"hours"}
                        type={"text"}
                        readOnly
                    />
                    <HotColumn
                        data={"project"}
                        type={"text"}
                        readOnly
                        renderer={ProjectNameCellRenderer}
                    />
                    {
                        headers.slice(staticHeaders.length).map((header, idx) => {
                            return (
                                <HotColumn
                                    key={"depPlanWeek" + idx}
                                    data={"week" + (idx + 1).toString()}
                                    type={"text"}
                                    renderer={WeekPlanCellRenderer}
                                >
                                </HotColumn>)
                        })
                    }
                </HotTable>
            </div>
        </div>)
}
