import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import HotTable, { HotColumn } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import { useTranslation } from 'react-i18next';
import { useHttp } from '../hooks/http.hook';
import { useParams } from 'react-router-dom';
import { ProjectDetailedInfoVm, ProjectDetailedInfoVmHelper } from "../models/ProjectDetails/ProjectDetailedInfoVm";
import { DepartmentsCellRenderer } from "../components/ProjectDetails/Renderers/DepartmentsCellRenderer"
import { GanttCellRenderer } from '../components/ProjectDetails/Renderers/GanttCellRenderer';
import { dateAsShortStrFromNumber } from '../common/dateFormatter';
import { ProjectDetailsToolBar } from '../components/ProjectDetails/ProjectDetailsToolBar';
import { useAppDispatch, useAppSelector } from "../hooks/redux.hook";
import { onRowSelected, onTaskAttributeChanged, onTasksMoved, updateProjectDetailsInfo } from '../redux/projectDetailsSlice';
import { CellChange, ChangeSource } from 'handsontable/common';

registerAllModules();

export const ProjectDetails: React.FunctionComponent = () => {
  const projectId = useParams<{ id?: string }>()!.id
  const { request } = useHttp()
  const { t } = useTranslation();
  const dispatch = useAppDispatch()
  const hotTableRef = useRef<HotTable>(null);

  const projectInfo = useAppSelector(state => state.projectDetailsReducer.project)

  const ganttChartZoomLevel = useAppSelector(state => state.projectDetailsReducer.ganttChartZoomLevel)
  const showDetails = useAppSelector(state => state.projectDetailsReducer.showDetails)
  const hiddenColumns = useAppSelector(state => state.projectDetailsReducer.hiddenColumns)

  const defaultColWidths = [5, 300, 150, 70, 310, 100, 100]
  const defaultHeaders = useMemo(() => ['', t('task'), t('comment'), t('estimationH'), t('departments'), t('start'), t('end')], [t])
  const [headers, setHeaders] = useState<string[]>(defaultHeaders)
  const [tableHeight, setTableHeight] = useState<number>(3500)

  useEffect(() => {
    async function requestDetails() {
      let data = await request<ProjectDetailedInfoVm>("/api/v1/projects/" + projectId)
      ProjectDetailedInfoVmHelper.init(data)
      dispatch(updateProjectDetailsInfo(data))
      setHeaders([...defaultHeaders, dateAsShortStrFromNumber(data.taskMinDate) + " - " + dateAsShortStrFromNumber(data.taskMaxDate)])
    }
    requestDetails()

  }, [request, projectId, defaultHeaders, dispatch])

  const scrollToRow = useCallback((rowIdx: number) => {
    if (hotTableRef && hotTableRef.current && hotTableRef.current.hotInstance) {
      hotTableRef.current.hotInstance.selectCell(rowIdx, 1)
      hotTableRef.current.hotInstance.scrollViewportTo(rowIdx)
    }
  }, [hotTableRef])

  return (
    <div className='page-container'>
      <ProjectDetailsToolBar scrollToTheLastRowFunc={scrollToRow}></ProjectDetailsToolBar>

      <div id="hotContainer" style={{ overflowX: 'auto', height: tableHeight }} >
        <HotTable
          id="projectDetailsTable"
          ref={hotTableRef}
          columnSorting={false}
          rowHeaders={true}
          renderAllRows={true}
          manualRowMove={true}
          viewportColumnRenderingOffset={headers.length}
          fixedColumnsLeft={defaultHeaders.length - 2}
          data={projectInfo.tasks}
          colWidths={defaultColWidths}
          colHeaders={headers}
          wordWrap={true}
          fillHandle={false}
          manualColumnResize={true}
          hiddenColumns={{
            columns: hiddenColumns
          }}

          afterSelection={(row: number, column: number, row2: number, column2: number, preventScrolling: { value: boolean }, selectionLayerLevel: number) => {
            preventScrolling.value = true
          }}
          beforeChange={(changes: CellChange[], source: ChangeSource) => {
            dispatch(onTaskAttributeChanged(changes))
            return false
          }}
          beforeRowMove={(movedRows: number[], finalIndex: number, dropIndex: number | undefined, movePossible: boolean) => {
            dispatch(onTasksMoved({ movedRows, finalIndex }))
            scrollToRow(finalIndex)
            return false
          }}
          afterSelectionEnd={(row: number, column: number, row2: number, column2: number, selectionLayerLevel: number) => {
            dispatch(onRowSelected(row))
          }}
          afterDeselect={() => {
            // to allow capturing selectedRowIdx for dialog windows
            setTimeout(() => {
              dispatch(onRowSelected(-1))
            }, 200);
          }}
          afterRender={(isForced: boolean) => {
            setTimeout(() => {
              const tableHeight = document.querySelector<HTMLElement>(".htCore")?.offsetHeight
              setTableHeight(50 + (tableHeight as number))
            }, 500);
          }}
          outsideClickDeselects={true}
          licenseKey='non-commercial-and-evaluation'
        >
          <HotColumn data={"id"} editor={false} type={"text"} />
          <HotColumn data={"description"} wordWrap={false} type={"text"} className="ellipsis-text" />
          <HotColumn data={"comment"} wordWrap={false} className="ellipsis-text" type={"text"} />
          <HotColumn data={"totalHours"} type={"text"} className='htCenter' readOnly={true} />
          <HotColumn data={"departmentEstimations"} readOnly >
            <DepartmentsCellRenderer showDetails={showDetails} hot-renderer></DepartmentsCellRenderer>
          </HotColumn>
          <HotColumn data={"startAsStr"} type={"text"} />
          <HotColumn data={"endAsStr"} type={"text"} />
          <HotColumn data={"departmentEstimations"} key={"ganttColumn"} width={getGanttWidth(ganttChartZoomLevel, projectInfo)} readOnly>
            <GanttCellRenderer width={getGanttWidth(ganttChartZoomLevel, projectInfo)} startDate={new Date(projectInfo.taskMinDate)} tasks={projectInfo.tasks} hot-renderer></GanttCellRenderer>
          </HotColumn>
        </HotTable>
      </div>
    </div>
  )
}

const getGanttWidth = (ganttChartZoomLevel: number, proj: ProjectDetailedInfoVm): number => {
  return ganttChartZoomLevel * (new Date(proj.taskMaxDate).getTime() - new Date(proj.taskMinDate).getTime()) / (1000 * 3600 * 24)
}