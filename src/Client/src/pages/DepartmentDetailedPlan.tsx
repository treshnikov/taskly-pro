import HotTable, { HotColumn } from "@handsontable/react";
import { CellChange, ChangeSource } from "handsontable/common";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { dateAsShortStrWithShortYear } from "../common/dateFormatter";
import { ProjectNameRenderer } from "../components/DepartmentPlan/Renderers/ProjectNameRenderer";
import { useHttp } from "../hooks/http.hook";
import { DepartmentPlanFlatUserRecordVm, DepartmentPlanFlatRecordVmHelper, DepartmentPlanUserRecordVm, DepartmentPlanFlatProjectRecordVm } from "../models/DepartmentPlan/DepartmentPlanClasses";

const initData: DepartmentPlanFlatUserRecordVm[] = [{
    id: '',
    userName: '',
    userPosition: '',
    project: '',
    hours: '0',
    __children: [
        { id: '', userPosition: '', project: '', hours: '0' }
    ],
}]

export const DepartmentDetailedPlan: React.FunctionComponent = () => {
    const departmentId = useParams<{ id?: string, name?: string }>()!.id
    const departmentName = useParams<{ id?: string, name?: string }>()!.name

    const { request } = useHttp()
    const { t } = useTranslation();

    const [flatPlan, setFlatPlan] = useState<DepartmentPlanFlatUserRecordVm[]>(initData)
    const [headers, setHeaders] = useState<string[]>([])
    const hotTableRef = useRef<HotTable>(null);
    const staticHeaders = ["Id", "User", "Position", "Hours", "Project"]
    const columnWidths = [50, 280, 50, 50, 330]

    useEffect(() => {
        //todo pass start and end date
        request<DepartmentPlanUserRecordVm[]>(`/api/v1/departments/${departmentId}/2022-01-01/2022-12-31/plan`, 'GET').then(plan => {
            // build headers
            let headers: string[] = [...staticHeaders]
            const weekCount = (plan.length > 0 && plan[0].projects.length > 0)
                ? plan[0].projects[0].plans.length
                : 0
            headers = headers.concat(Array.from(Array(weekCount).keys()).map(i => {
                const dt = new Date(plan[0].projects[0].plans[i].weekStart)
                return dateAsShortStrWithShortYear(dt)
            }
            ))

            setHeaders(headers)

            // build flat plan
            const flatPlan = DepartmentPlanFlatRecordVmHelper.buildFlatPlan(plan)
            setFlatPlan(flatPlan)
        })
    }, [])

    useEffect(() => {
        if (flatPlan && flatPlan.length > 0 && hotTableRef && hotTableRef.current && hotTableRef.current.hotInstance) {
            hotTableRef.current.hotInstance.loadData(flatPlan)
            const plugin = hotTableRef.current.hotInstance.getPlugin('nestedRows') as any
            plugin.collapsingUI.collapseAll()
        }
    }, [flatPlan])

    return (
        <div className='page-container'>
            <h3>{departmentName}</h3>
            <HotTable
                id="projectDetailsTable"
                ref={hotTableRef}
                data={flatPlan}
                colHeaders={(idx: number) => {
                    if (idx < staticHeaders.length) {
                        return headers[idx]
                    }

                    return "<div style='font-size:10px;'>" + headers[idx] + "</div>"
                }}

                colWidths={columnWidths}
                viewportColumnRenderingOffset={headers.length}
                fixedColumnsLeft={3}
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

                        const weekId = changes[0][1]
                        const newValue = changes[0][3]

                        // find and update changed record
                        let record: DepartmentPlanFlatProjectRecordVm = { id: '', hours: '', project: '', userPosition: '', userName: '' }
                        const found = flatPlan.some(u => u.__children.some(p => {
                            record = p
                            return p.id === rowId
                        }))

                        if (found) {
                            record[weekId] = newValue

                            // recalc hours and update view
                            DepartmentPlanFlatRecordVmHelper.recalcHours(flatPlan)
                        }
                    }

                    //return false
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