import HotTable, { HotColumn } from "@handsontable/react";
import { CellChange, CellValue, ChangeSource, RangeType } from "handsontable/common";
import { RefObject, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useHttp } from "../../hooks/http.hook";
import { DepartmentUserPlan } from "../../models/DepartmentPlan/DepartmentPlanClasses";
import { DepartmentPlanHelper } from "../../models/DepartmentPlan/DepartmentPlanHelper";
import { useAppDispatch, useAppSelector } from "../../hooks/redux.hook";
import { WeekPlanCellRenderer } from "../../components/DepartmentPlan/Renderers/WeekPlanCellRenderer";
import { ProjectNameCellRenderer } from "../../components/DepartmentPlan/Renderers/ProjectNameCellRenderer";
import { ServicesStorageHelper } from "../../common/servicesStorageHelper";
import { setHiddenRows } from "../../redux/departmentPlanSlice";
import React from "react";

export type ScheduleTableProps = {
    departmentId: string,
    departmentName: string,
    plan: DepartmentUserPlan[]
}

export const ScheduleTable: React.FunctionComponent<ScheduleTableProps> = ({ departmentId, departmentName, plan }) => {
    const { t } = useTranslation();
    const staticHeaders = ["Id", "tooltip", "weeksAvailabilityMap", t('name'), t('position'), t('rate'), t('hours'), t('project')]
    const columnWidths = [50, 50, 50, 240, 50, 50, 50, 330]

    // hidden columns contain information that the renderer requires to display data:
    // - record id - for example, p110 or u20 - 'p' for nested rows with project information and 'u' for user rows
    // - tooltip - a tooltip which is set as a title for the div that displays the name of the project in a nested row
    // - weeks availability map - for example, 111101000000111 - 1 when the week is included in some project task period and 0 in the other case
    const hiddenColumns = [0, 1, 2]

    const navigate = useNavigate()

    const [headers, setHeaders] = useState<string[]>(['', '', '', '', ''])

    // workaround for passing a navigate function to ProjectNameCellRenderer that cannot be extended by adding new props without changing the source code of the component
    ServicesStorageHelper.navigateFunction = (arg: string) => { navigate(arg) }

    const dispatch = useAppDispatch()
    const hiddenRows = useAppSelector(state => state.departmentPlanReducer.hiddenRows)

    const hotTableRef = useRef<HotTable>(null);

    useEffect(() => {

        console.log('new plan', plan)

        let headers: string[] = [...staticHeaders]

        const weekCount = 52
        headers = headers.concat(Array.from(Array(weekCount).keys()).map(i => {
            return 'week' + i

            //const dt = new Date(plan[0].projects[0].plans[i].weekStart)
            //return dateAsShortStrWithShortYear(dt)
        }
        ))

        setHeaders(headers)

        // hide rows with empty estimation by default
        dispatch(setHiddenRows(DepartmentPlanHelper.getProjectRows(plan, (i => !i.hours))))

        if (plan && plan.length > 0 && hotTableRef && hotTableRef.current && hotTableRef.current.hotInstance) {
            hotTableRef.current.hotInstance.loadData(plan)
            const plugin = hotTableRef.current.hotInstance.getPlugin('nestedRows') as any
            plugin.collapsingUI.collapseAll()

            console.log('collapsed')
        }
    }, [plan])

    console.log('render handosntable')

    return (
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
            hiddenColumns={{ columns: hiddenColumns }}
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

            afterUndo={(action: any): void => {
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
                data={"tooltip"}
                type={"text"} />
            <HotColumn
                data={"weeksAvailabilityMap"}
                type={"text"} />

            <HotColumn
                data={"userName"}
                wordWrap={false}
                readOnly
                type={"text"}
            />
            <HotColumn
                data={"userPosition"}
                className='htCenter'
                wordWrap={false}
                readOnly
                type={"text"}
            />
            <HotColumn
                data={"rate"}
                className='htCenter'
                wordWrap={false}
                readOnly
                type={"text"}
            />
            <HotColumn
                data={"hours"}
                type={"text"}
                className='htCenter'
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
    )
}

export const MemorizedScheduleTable = React.memo(ScheduleTable, (prevProps: ScheduleTableProps, nextProps: ScheduleTableProps) => {
    const res = !(nextProps.plan.length > prevProps.plan.length)
    if (!res) {
        console.log('RENDER', prevProps, nextProps)
    }

    console.log('x = ', res)
    return res
  });
  