import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import HotTable, { HotColumn } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import { useTranslation } from 'react-i18next';
import { useHttp } from '../hooks/http.hook';
import { useParams } from 'react-router-dom';
import { ProjectDetailedInfoVm, ProjectDetailedInfoVmHelper } from "../models/ProjectDetails/ProjectDetailedInfoVm";
import { DepartmentsCellRenderer } from "../components/ProjectDetails/DepartmentsCellRenderer"
import { GanttCellRenderer } from '../components/ProjectDetails/GanttCellRenderer';
import { dateAsShortStrFromNumber } from '../common/dateFormatter';
import { ProjectDetailsToolBar } from '../components/ProjectDetails/ProjectDetailsToolBar';
import { useAppDispatch, useAppSelector } from "../hooks/redux.hook";
import { updateProjectDetailsInfo } from '../redux/projectDetailsSlice';

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

  const defaultColWidths = [5, 300, 150, 70, 310, 100, 100]
  const defaultHeaders = useMemo(() => ['', t('task'), t('comment'), t('estimationH'), t('units'), t('start'), t('end')], [t])
  const [headers, setHeaders] = useState<string[]>(defaultHeaders)
  const [tableHeight, setTableHeight] = useState<number>(3500)

  useEffect(() => {
    async function requestDetails() {
      let data = await request<ProjectDetailedInfoVm>("/api/v1/projects/" + projectId)
      //populateDemoTasks(data)
      ProjectDetailedInfoVmHelper.init(data)
      dispatch(updateProjectDetailsInfo(data))
      setHeaders([...defaultHeaders, dateAsShortStrFromNumber(data.taskMinDate) + " - " + dateAsShortStrFromNumber(data.taskMaxDate)])
    }
    requestDetails()
  }, [request, projectId, defaultHeaders, dispatch])

  useLayoutEffect(() => {
    setTableHeight(window.innerHeight - 145)
  }, [])

  const scrollToTheLastRow = useCallback(() => {
    if (hotTableRef && hotTableRef.current && hotTableRef.current.hotInstance) {
      const rowsCount = hotTableRef.current.hotInstance.countRows()
      hotTableRef.current.hotInstance.scrollViewportTo(rowsCount - 1)
    }

  }, [hotTableRef])

  return (
    <div className='page-container'>
      <ProjectDetailsToolBar scrollToTheLastRowFunc={scrollToTheLastRow}></ProjectDetailsToolBar>
      <div style={{ overflowX: 'auto', height: tableHeight }} onClickCapture={e => { e.stopPropagation() }}>
        <HotTable
          id="projectDetailsTable"
          ref={hotTableRef}
          columnSorting={true}
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
            columns: [0]
          }}
          afterSelection={(row: number, column: number, row2: number, column2: number, preventScrolling: { value: boolean }, selectionLayerLevel: number) => {
            preventScrolling.value = true
          }}

          licenseKey='non-commercial-and-evaluation'
        >
          <HotColumn hiddenColumns data={"id"} editor={false} type={"text"} />
          <HotColumn data={"description"} wordWrap={false} type={"text"} className="ellipsis-text" />
          <HotColumn data={"comment"} wordWrap={false} className="ellipsis-text" type={"text"} />

          <HotColumn data={"totalHours"} type={"text"} className='htCenter' />
          <HotColumn data={"unitEstimations"} readOnly >
            <DepartmentsCellRenderer showDetails={showDetails} hot-renderer></DepartmentsCellRenderer>
          </HotColumn>
          <HotColumn data={"startAsStr"} type={"text"} />
          <HotColumn data={"endAsStr"} type={"text"} />
          <HotColumn data={"unitEstimations"} key={"ganttColumn"} width={getGanttWidth(ganttChartZoomLevel, projectInfo)} readOnly>
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