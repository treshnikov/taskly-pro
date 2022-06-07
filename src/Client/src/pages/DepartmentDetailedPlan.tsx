import HotTable, { HotColumn } from "@handsontable/react";
import { CellChange, CellValue, ChangeSource, RangeType } from "handsontable/common";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { dateAsShortStrWithShortYear } from "../common/dateFormatter";
import { ProjectNameRenderer } from "../components/DepartmentPlan/Renderers/ProjectNameRenderer";
import { useHttp } from "../hooks/http.hook";
import { DepartmentUserPlan as DepartmentUserPlan, DepartmentPlanFlatRecordVmHelper, DepartmentPlanUserRecordVm, DepartmentProjectPlan } from "../models/DepartmentPlan/DepartmentPlanClasses";

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

    // unfortunately, we must store the state locally because passing such amount of records to redux causes low performance
    const [plan, setPlan] = useState<DepartmentUserPlan[]>(initData)

    const [headers, setHeaders] = useState<string[]>([])
    const hotTableRef = useRef<HotTable>(null);
    const staticHeaders = ["Id", "User", "Position", "Hours", "Project"]
    const columnWidths = [50, 280, 50, 50, 330]

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
            setPlan(flatPlan)
        })
    }, [])

    useEffect(() => {
        if (plan && plan.length > 0 && hotTableRef && hotTableRef.current && hotTableRef.current.hotInstance) {
            hotTableRef.current.hotInstance.loadData(plan)
            // const plugin = hotTableRef.current.hotInstance.getPlugin('nestedRows') as any
            // plugin.collapsingUI.collapseAll()
        }
    }, [plan])

    return (
        <div className='page-container'>
            <h3>{departmentName}</h3>
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
                hiddenColumns={{
                    columns: [0]
                }}
                renderAllRows={true}
                columnSorting={false}
                rowHeaders={true}
                nestedRows={true}
                manualRowMove={true}
                wordWrap={true}
                fillHandle={false}
                manualColumnResize={true}

                afterSelection={(row: number, column: number, row2: number, column2: number, preventScrolling: { value: boolean }, selectionLayerLevel: number) => {
                    preventScrolling.value = true
                }}

                beforeChange={(changes: CellChange[], source: ChangeSource) => {
                    //dispatch(onTaskAttributeChanged(changes))

                    if (hotTableRef && hotTableRef.current && hotTableRef.current.hotInstance) {
                        const rowId = hotTableRef.current.hotInstance.getDataAtCell(changes[0][0], 0)
                        // prevent editing cells with summary info
                        if (rowId[0] === 'u') {
                            return false
                        }

                        // find and update changed record
                        let record: DepartmentProjectPlan = { id: '', hours: '', project: '', userPosition: '', userName: '' }
                        const found = plan.some(u => u.__children.some(p => {
                            record = p
                            return p.id === rowId
                        }))

                        if (found) {
                            const weekId = changes[0][1]
                            const newValue = changes[0][3]
                            record[weekId] = newValue

                            // recalc hours and update view
                            DepartmentPlanFlatRecordVmHelper.recalcHours(plan)
                        }
                    }
                }}

                beforeRowMove={(movedRows: number[], finalIndex: number, dropIndex: number | undefined, movePossible: boolean) => {
                    // dispatch(onTasksMoved({ movedRows, finalIndex }))
                    // scrollToRow(finalIndex)
                    return false
                }}

                afterSelectionEnd={(row: number, column: number, row2: number, column2: number, selectionLayerLevel: number) => {
                    //dispatch(onRowSelected(row))
                }}

                afterDeselect={() => {
                    // to allow capturing selectedRowIdx for dialog windows
                    // setTimeout(() => {
                    //     dispatch(onRowSelected(-1))
                    // }, 200);
                }}

                afterRender={(isForced: boolean) => {
                    // setTimeout(() => {
                    //     const tableHeight = document.querySelector<HTMLElement>(".htCore")?.offsetHeight
                    //     setTableHeight(50 + (tableHeight as number))
                    // }, 500);
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
                            <HotColumn key={"depPlanWeek" + idx} data={"week" + (idx + 1).toString()} type={"text"} >
                            </HotColumn>)
                    })
                }


            </HotTable>
        </div>)
}