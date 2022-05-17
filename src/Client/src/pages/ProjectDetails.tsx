import React, { useEffect, useLayoutEffect, useState } from 'react'
import HotTable, { HotColumn } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import { useTranslation } from 'react-i18next';
import { useHttp } from '../hooks/http.hook';
import { useParams } from 'react-router-dom';
import { ProjectDetailedInfoVm } from "../models/ProjectDetailedInfoVm";
import { DepartmentsCellRenderer } from "../components/ProjectDetails/DepartmentsCellRenderer"
import { WeekCellRenderer } from '../components/ProjectDetails/WeekCellRenderer';
import { Stack } from '@mui/material';
import { DateCellRenderer } from '../components/ProjectDetails/DateCellRenderer';
import { ProjectTaskVm } from '../models/ProjectTaskVm';
import { ProjectTaskUnitEstimationVm } from '../models/ProjectTaskUnitEstimationVm';

registerAllModules();

export const ProjectDetails: React.FunctionComponent = () => {
  const projectId = useParams<{ id?: string }>()!.id
  const { request } = useHttp()
  const { t } = useTranslation();

  const staticHeaders = ['', t('task'), t('comment'), t('units'), t('start'), t('end')]

  const [projectInfo, setProjectInfo] = useState<ProjectDetailedInfoVm>(new ProjectDetailedInfoVm())
  const [headers, setHeaders] = useState<string[]>(staticHeaders)
  const [colWidths, setColWidths] = useState<number[]>([5, 300, 150, 310, 100, 100])
  const [firstMonday, setFirstMonday] = useState<Date>(new Date())
  const [tableHeight, setTableHeight] = useState<number>(500)

  useEffect(() => {
    async function requestDetails() {
      let data = await request<ProjectDetailedInfoVm>("/api/v1/projects/" + projectId)
      //populateDemoTasks(data)
      ProjectDetailedInfoVm.init(data)
      setProjectInfo(data)
    }
    requestDetails()
  }, [request, projectId])

  useEffect(() => {
    const weekHeaders = projectInfo.weeks.map((i, idx) => {
      return i.monday.toLocaleDateString()
    })
    const weekColsWidths = projectInfo.weeks.map(i => 80)

    setFirstMonday(projectInfo.weeks[0]?.monday)
    setHeaders(h => [...h, ...weekHeaders])
    setColWidths(c => [...c, ...weekColsWidths])
  }, [projectInfo])

  useLayoutEffect(() => {
    setTableHeight(window.innerHeight - 145)
  }, [])

  return (
    <div className='page-container'>
      <h3>{projectInfo.shortName + " [" + projectInfo.start.toLocaleDateString() + " - " + projectInfo.end.toLocaleDateString() + "]"}</h3>
      <div style={{ width: "100%" }}>
        <Stack spacing={1}>
        </Stack>
      </div>
      <div style={{ overflowX: 'auto', height: tableHeight }} onClickCapture ={e => {e.stopPropagation()}}>
        <HotTable
          columnSorting={true}
          rowHeaders={true}
          renderAllRows={true}
          viewportColumnRenderingOffset={headers.length}
          fixedColumnsLeft={staticHeaders.length - 2}
          data={projectInfo.tasks}
          colWidths={colWidths}
          colHeaders={headers}
          wordWrap={true}
          fillHandle={false}
          rowHeights={45}
          hiddenColumns={{
            columns: [0]
          }}
          afterSelection={(row: number, column: number, row2: number, column2: number, preventScrolling: { value: boolean }, selectionLayerLevel: number) => {
            preventScrolling.value = true
          }}
          licenseKey='non-commercial-and-evaluation'
        >
          <HotColumn hiddenColumns data={"id"} editor={false} type={"text"} />
          <HotColumn data={"description"} type={"text"} />
          <HotColumn data={"comment"} wordWrap={false} type={"text"} />

          <HotColumn data={"unitEstimations"} readOnly >
            <DepartmentsCellRenderer hot-renderer></DepartmentsCellRenderer>
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
          {
            headers.slice(staticHeaders.length).map((i, idx) => {
              return (
                <HotColumn data={"unitEstimations"} key={"weekColumn" + idx} readOnly >
                  <WeekCellRenderer firstMonday={firstMonday} hot-renderer></WeekCellRenderer>
                </HotColumn>
              )
            })
          }
        </HotTable>
      </div>
    </div>
  )
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
    {userPositionId: '1', userPositionIdent: 'И1', hours: 80},
    {userPositionId: '2', userPositionIdent: 'И2', hours: 240},
    {userPositionId: '3', userPositionIdent: 'И3', hours: 360},
  ]

  const testEstimation2 = new ProjectTaskUnitEstimationVm()
  testEstimation2.id = "dfgsdfg"
  testEstimation2.unitName = "Отдел программирования СУПП"
  testEstimation2.estimations = [
    {userPositionId: '4', userPositionIdent: 'ГС', hours: 180},
  ]

  const testEstimation3 = new ProjectTaskUnitEstimationVm()
  testEstimation3.id = "iuthoi3hti2hpi"
  testEstimation3.unitName = "Отдел программирования с очень длинным именем"
  testEstimation3.estimations = [
    {userPositionId: '5', userPositionIdent: 'DB', hours: 40},
  ]

  testTask.unitEstimations = [testEstimation1, testEstimation2, testEstimation3]

  newTasks = [...newTasks, testTask]
  projectInfo.tasks = newTasks
}

