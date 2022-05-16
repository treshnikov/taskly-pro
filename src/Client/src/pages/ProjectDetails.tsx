import React, { useLayoutEffect, useState } from 'react'
import HotTable, { HotColumn } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import { useTranslation } from 'react-i18next';
import { useHttp } from '../hooks/http.hook';
import { useParams } from 'react-router-dom';
import { ProjectDetailedInfoVm } from "../models/ProjectDetailedInfoVm";
import { ProjectTaskVm } from "../models/ProjectTaskVm";
import { ProjectTaskUnitEstimationVm } from "../models/ProjectTaskUnitEstimationVm";
import { DepartmentsCellRenderer } from "../components/ProjectDetails/DepartmentsCellRenderer"
import { WeekCellRenderer } from '../components/ProjectDetails/WeekCellRenderer';
import { Stack } from '@mui/material';
import { DateCellRenderer } from '../components/ProjectDetails/DateCellRenderer';

registerAllModules();

export const ProjectDetails: React.FunctionComponent = () => {
  const projectId = useParams<{ id?: string }>()!.id
  const { request } = useHttp()
  const { t } = useTranslation();

  const staticHeaders = ['', t('task'), t('start'), t('end'), t('units')]
  
  const [tasks, setTasks] = useState<ProjectTaskVm[]>([])
  const [headers, setHeaders] = useState<string[]>(staticHeaders)
  const [colWidths, setColWidths] = useState<number[]>([25, 350, 100, 100, 310])
  const [firstMonday, setFirstMonday] = useState<Date>(new Date())

  useLayoutEffect(() => {
    let projectInfo = new ProjectDetailedInfoVm()
    async function requestDetails() {
      projectInfo = await request<ProjectDetailedInfoVm>("/api/v1/projects/" + projectId)

      let newTasks = projectInfo.tasks

      const testTask = new ProjectTaskVm()
      testTask.description = "Монтажные и пусконаладочные работы схемы управления разъединителями ОРУ-110 кВ"
      testTask.start = new Date(2022, 3, 5, 0, 0, 0, 0)
      testTask.end = new Date(2022, 4, 8, 0, 0, 0, 0)

      const testEstimation1 = new ProjectTaskUnitEstimationVm()
      testEstimation1.id = "asdfasdfsdf"
      testEstimation1.unitName = "Отдел программирования РСУ"
      testEstimation1.chiefSpecialistHours = 120
      testEstimation1.leadEngineerHours = 40
      testEstimation1.engineerOfTheSecondCategoryHours = 90
      testEstimation1.engineerOfTheFirstCategoryHours = 40
      testEstimation1.engineerOfTheThirdCategoryHours = 120
      testEstimation1.techniclaWriterHours = 900

      const testEstimation2 = new ProjectTaskUnitEstimationVm()
      testEstimation2.id = "dfgsdfg"
      testEstimation2.unitName = "Отдел программирования СУПП"
      testEstimation2.chiefSpecialistHours = 800

      const testEstimation3 = new ProjectTaskUnitEstimationVm()
      testEstimation3.id = "iuthoi3hti2hpi"
      testEstimation3.unitName = "Отдел программирования с очень длинным именем"
      testEstimation3.engineerOfTheThirdCategoryHours = 16

      testTask.estimations = [testEstimation1, testEstimation2, testEstimation3]

      newTasks = [...newTasks, testTask]
      projectInfo.tasks = newTasks
      ProjectDetailedInfoVm.init(projectInfo)
      setFirstMonday(projectInfo.weeks[0]?.monday)

      setTasks(newTasks)
    }

    requestDetails().then(arg => {
      const weekHeaders = projectInfo.weeks.map((i, idx) => {
        return i.monday.toLocaleDateString()
      })
      const weekColsWidths = projectInfo.weeks.map(i => 80)

      setHeaders(h => [...h, ...weekHeaders])
      setColWidths(c => [...c, ...weekColsWidths])
    })
  }, [request, projectId])


  const [tableHeight, setTableHeight] = useState<number>(500)
  useLayoutEffect(() => {
    setTableHeight(window.innerHeight - 145)
  }, [])

  return (
    <div className='page-container'>
      <h3>Project #{projectId}</h3>
      <div style={{ width: "100%" }}>
        <Stack spacing={1}>
        </Stack>
      </div>
      <div style={{ overflowX: 'auto', height: tableHeight }}>
        <HotTable
          renderAllRows={true}
          viewportColumnRenderingOffset={headers.length}
          fixedColumnsLeft={staticHeaders.length}
          data={tasks}
          colWidths={colWidths}
          colHeaders={headers}
          wordWrap={true}
          fillHandle={false}
          hiddenColumns={{
            columns: [0]
          }}
          licenseKey='non-commercial-and-evaluation'
        >
          <HotColumn hiddenColumns data={"id"} editor={false} type={"text"} />
          <HotColumn data={"description"} type={"text"} />
          {/* <HotColumn data={"start"} type={"date"} dateFormat='DD.MM.YYYY' correctFormat={true} defaultDate='01.01.2022' />
          <HotColumn data={"end"} type={"date"} dateFormat='DD.MM.YYYY' correctFormat={true} defaultDate='01.01.2022' /> */}
          <HotColumn data={"start"} readOnly >
            <DateCellRenderer hot-renderer></DateCellRenderer>
          </HotColumn>
          <HotColumn data={"end"} readOnly >
            <DateCellRenderer hot-renderer></DateCellRenderer>
          </HotColumn>
          <HotColumn data={"estimations"} readOnly >
            <DepartmentsCellRenderer hot-renderer></DepartmentsCellRenderer>
          </HotColumn>
          {
            headers.slice(staticHeaders.length).map((i, idx) => {
              return (
                <HotColumn data={"estimations"} key={"weekColumn" + idx} readOnly >
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
