import React, { useEffect, useLayoutEffect, useState } from 'react'
import HotTable, { HotColumn } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import { useTranslation } from 'react-i18next';
import { useHttp } from '../hooks/http.hook';
import { useParams } from 'react-router-dom';
import { ProjectDetailedInfoVm } from "../models/ProjectDetailedInfoVm";
import { DepartmentsCellRenderer } from "../components/ProjectDetails/DepartmentsCellRenderer"
import { Button, Checkbox, FormControlLabel, Grid, Stack, Typography } from '@mui/material';
import { ProjectTaskVm } from '../models/ProjectTaskVm';
import { ProjectTaskUnitEstimationVm } from '../models/ProjectTaskUnitEstimationVm';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import BarChartIcon from '@mui/icons-material/BarChart';
import { GanttCellRenderer } from '../components/ProjectDetails/GanttCellRenderer';
import { dateAsShortStr } from '../common/dateFormatter';
import { ganttZoomIn, ganttZoomOut } from '../redux/projectDetailsSlice';
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

registerAllModules();

export const ProjectDetails: React.FunctionComponent = () => {
  const projectId = useParams<{ id?: string }>()!.id
  const { request } = useHttp()
  const { t } = useTranslation();
  const dispatch = useAppDispatch()
  const ganttChartZoomLevel = useAppSelector(state => state.projectDetailsReducer.ganttChartZoomLevel)

  const staticHeaders = ['', t('task'), t('comment'), t('estimationH'), t('units'), t('start'), t('end')]

  const [projectInfo, setProjectInfo] = useState<ProjectDetailedInfoVm>(new ProjectDetailedInfoVm())
  const [headers, setHeaders] = useState<string[]>(staticHeaders)
  const [colWidths, setColWidths] = useState<number[]>([5, 300, 150, 70, 310, 100, 100])
  const [tableHeight, setTableHeight] = useState<number>(3500)
  const [showDetails, setShowDetails] = useState<boolean>(false)

  useEffect(() => {
    async function requestDetails() {
      let data = await request<ProjectDetailedInfoVm>("/api/v1/projects/" + projectId)
      //populateDemoTasks(data)
      ProjectDetailedInfoVm.init(data)
      setProjectInfo(data)
      setHeaders([...staticHeaders, dateAsShortStr(data.taskMinDate) + " - " + dateAsShortStr(data.taskMaxDate)
      ])
    }
    requestDetails()
  }, [request, projectId])

  useLayoutEffect(() => {
    setTableHeight(window.innerHeight - 145)
  }, [])

  return (
    <div className='page-container'>
      <div style={{ width: "100%" }}>

        <Grid container  >
          <Grid item xs={8} >
            <Stack direction="row" spacing={1} paddingTop={1} paddingBottom={1}>
              <Button variant='contained' size='small' startIcon={<PlaylistAddIcon />}>Add</Button>
              <Button variant='contained' size='small' startIcon={<BarChartIcon />}>Statistics</Button>
              <Button variant='contained' size='small' startIcon={<ZoomInIcon/>} onClick={e => {dispatch(ganttZoomIn())}} >Zoom in</Button>
              <Button variant='contained' size='small' startIcon={<ZoomOutIcon/>} onClick={e => {dispatch(ganttZoomOut())}} >Zoom out</Button>
              <FormControlLabel label="Show details" control={<Checkbox checked={showDetails} onChange={e => setShowDetails(e.target.checked)} size='small' />} />
            </Stack>
          </Grid>
          <Grid item xs={4} style={{ textAlign: "right" }} paddingTop={1} paddingBottom={1}>
            <Typography variant='h5'>{projectInfo.shortName}</Typography>
          </Grid>
        </Grid>


      </div>
      <div style={{ overflowX: 'auto', height: tableHeight }} onClickCapture={e => { e.stopPropagation() }}>
        <HotTable
          columnSorting={true}
          rowHeaders={true}
          renderAllRows={true}
          //autoRowSize={true}
          viewportColumnRenderingOffset={headers.length}
          fixedColumnsLeft={staticHeaders.length - 2}
          data={projectInfo.tasks}
          colWidths={colWidths}
          colHeaders={headers}
          wordWrap={true}
          fillHandle={false}
          manualColumnResize={true}
          //rowHeights={45}
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
          {/* 
            <HotColumn data={"start"} type={"date"} dateFormat='DD.MM.YYYY' correctFormat={true} defaultDate='01.01.2022' />
            <HotColumn data={"end"} type={"date"} dateFormat='DD.MM.YYYY' correctFormat={true} defaultDate='01.01.2022' /> 
          */}
          {/* <HotColumn data={"start"} readOnly >
            <DateCellRenderer hot-renderer></DateCellRenderer>
          </HotColumn>
          <HotColumn data={"end"} readOnly >
            <DateCellRenderer hot-renderer></DateCellRenderer>
          </HotColumn> */}
          <HotColumn data={"unitEstimations"} key={"ganttColumn"} width={getGanttWidth(ganttChartZoomLevel, projectInfo)} readOnly>
            <GanttCellRenderer width={getGanttWidth(ganttChartZoomLevel, projectInfo)} startDate={projectInfo.taskMinDate} hot-renderer></GanttCellRenderer>
          </HotColumn>
        </HotTable>
      </div>
    </div>
  )
}

const getGanttWidth = (ganttChartZoomLevel: number, proj: ProjectDetailedInfoVm): number => {
  return ganttChartZoomLevel * (proj.taskMaxDate.getTime() - proj.taskMinDate.getTime()) / (1000 * 3600 * 24)
}

function populateDemoTasks(projectInfo: ProjectDetailedInfoVm) {
  let newTasks = projectInfo.tasks

  const testTask = new ProjectTaskVm()
  testTask.description = "Монтажные и пусконаладочные работы схемы управления разъединителями ОРУ-110 кВ"
  testTask.start = new Date(2022, 3, 5, 0, 0, 0, 0)
  testTask.end = new Date(2022, 4, 8, 0, 0, 0, 0)

  const testEstimation1 = new ProjectTaskUnitEstimationVm()
  testEstimation1.id = "asdfasdfsdf"
  testEstimation1.unitName = "Отдел программирования РСУ"
  testEstimation1.estimations = [
    { userPositionId: '1', userPositionIdent: 'И1', hours: 80 },
    { userPositionId: '2', userPositionIdent: 'И2', hours: 240 },
    { userPositionId: '3', userPositionIdent: 'И3', hours: 360 },
  ]

  const testEstimation2 = new ProjectTaskUnitEstimationVm()
  testEstimation2.id = "dfgsdfg"
  testEstimation2.unitName = "Отдел программирования СУПП"
  testEstimation2.estimations = [
    { userPositionId: '4', userPositionIdent: 'ГС', hours: 180 },
  ]

  const testEstimation3 = new ProjectTaskUnitEstimationVm()
  testEstimation3.id = "iuthoi3hti2hpi"
  testEstimation3.unitName = "Отдел программирования с очень длинным именем"
  testEstimation3.estimations = [
    { userPositionId: '5', userPositionIdent: 'DB', hours: 40 },
  ]

  testTask.unitEstimations = [testEstimation1, testEstimation2, testEstimation3]

  newTasks = [...newTasks, testTask]
  projectInfo.tasks = newTasks
}