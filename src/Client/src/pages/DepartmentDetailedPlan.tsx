import HotTable, { HotColumn } from "@handsontable/react";
import { CellChange, ChangeSource } from "handsontable/common";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { dateAsShortStrWithShortYear } from "../common/dateFormatter";
import { ProjectNameRenderer } from "../components/DepartmentPlan/Renderers/ProjectNameRenderer";
import { useHttp } from "../hooks/http.hook";
import { DepartmentPlanFlatUserRecordVm, DepartmentPlanFlatRecordVmHelper, DepartmentPlanUserRecordVm } from "../models/DepartmentPlan/DepartmentPlanClasses";

const initData: DepartmentPlanFlatUserRecordVm[] = [{
    userName: '',
    userPosition: null,
    project: null,
    __children: [
        { userPosition: '', project: '' }
    ],
}]

export const DepartmentDetailedPlan: React.FunctionComponent = () => {
    const departmentId = useParams<{ id?: string }>()!.id
    const { request } = useHttp()
    const { t } = useTranslation();

    const [flatPlan, setFlatPlan] = useState<DepartmentPlanFlatUserRecordVm[]>(initData)
    const [headers, setHeaders] = useState<string[]>([])
    const hotTableRef = useRef<HotTable>(null);

    useEffect(() => {
        //todo pass start and end date
        request<DepartmentPlanUserRecordVm[]>(`/api/v1/departments/${departmentId}/2022-01-01/2022-12-31/plan`, 'GET').then(plan => {
            // build headers
            let headers: string[] = ["User", "Position", "Project"]
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
            DepartmentDetailedPlan {departmentId}
            <br />
            <HotTable
                id="projectDetailsTable"
                ref={hotTableRef}
                data={flatPlan}
                colHeaders={(idx: number) => {
                    if (idx < 3) {
                        return headers[idx]
                    }

                    return "<div style='font-size:10px;'>" + headers[idx] + "</div>"
                }}

                colWidths={[280, 50, 330]}
                viewportColumnRenderingOffset={headers.length}
                fixedColumnsLeft={3}
                renderAllRows={true}
                columnSorting={false}
                rowHeaders={true}
                nestedRows={true}
                contextMenu={true}
                manualRowMove={true}
                wordWrap={true}
                fillHandle={false}
                manualColumnResize={true}

                afterSelection={(row: number, column: number, row2: number, column2: number, preventScrolling: { value: boolean }, selectionLayerLevel: number) => {
                    preventScrolling.value = true
                }}

                beforeChange={(changes: CellChange[], source: ChangeSource) => {
                    //dispatch(onTaskAttributeChanged(changes))
                    return false
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
                <HotColumn data={"userName"} wordWrap={false} type={"text"} />
                <HotColumn data={"userPosition"} wordWrap={false} type={"text"} />
                <HotColumn data={"project"} readOnly >
                    <ProjectNameRenderer hot-renderer></ProjectNameRenderer>
                </HotColumn>
                {
                    headers.slice(3).map((header, idx) => {
                        return (
                            <HotColumn key={"depPlanWeek" + idx} data={"week" + (idx + 1).toString()} type={"text"} >
                            </HotColumn>)
                    })
                }


            </HotTable>
        </div>)
}