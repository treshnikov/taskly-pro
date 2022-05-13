import React, { useEffect, useLayoutEffect, useState } from 'react'
import { registerAllModules } from 'handsontable/registry';
import { useTranslation } from 'react-i18next';
import { useHttp } from '../hooks/http.hook';
import { useParams } from 'react-router-dom';
import HotTable, { HotColumn } from '@handsontable/react';
import { ProjectDetailedInfoVm } from "../models/ProjectDetailedInfoVm";
import { ProjectTaskVm } from "../models/ProjectTaskVm";
import { ProjectTaskUnitEstimationVm } from "../models/ProjectTaskUnitEstimationVm";
import { DepartmentsCellRenderer } from "../components/ProjectDetails/DepartmentsCellRenderer"
import { WeekCellRenderer } from '../components/ProjectDetails/WeekCellRenderer';

registerAllModules();

export const ProjectDetails: React.FunctionComponent = () => {
  const projectId = useParams<{ id?: string }>()!.id
  const { request } = useHttp()
  const { t } = useTranslation();

  const [tasks, setTasks] = useState<ProjectTaskVm[]>([])
  const [headers, setHeaders] = useState<string[]>(['', t('task'), t('start'), t('end'), t('units')])
  const [colWidths, setColWidths] = useState<number[]>([25, 350, 90, 90, 310])

  useEffect(() => {
    async function requestDetails() {
      const json = await request("/api/v1/projects/" + projectId)
      const info = (json as ProjectDetailedInfoVm)
      let newTasks = info.tasks

      const testTask = new ProjectTaskVm()
      testTask.description = "Монтажные и пусконаладочные работы схемы управления разъединителями ОРУ-110 кВ"

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
      info.tasks = newTasks
      ProjectDetailedInfoVm.init(info)

      setTasks(newTasks)
    }
    requestDetails()

    const startDate = new Date(2022, 0, 3)
    const weeksCount = 52

    const weekHeaders = Array.from(Array(weeksCount).keys()).map((i, idx) => {
      const date = new Date(startDate)
      date.setDate(date.getDate() + idx * 7)
      return `${date.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2 })}.${(1 + date.getMonth()).toLocaleString('en-US', { minimumIntegerDigits: 2 })}.${date.getFullYear()}`
    })
    const weekColsWidths = Array.from(Array(weeksCount).keys()).map(i => 80)
  
    setHeaders([...headers, ...weekHeaders])
    setColWidths([...colWidths, ...weekColsWidths])

  }, [request, projectId])


  const [tableHeight, setTableHeight] = useState<number>(500)
  useLayoutEffect(() => {
    setTableHeight(window.innerHeight - 145)
  })

  return (
    <div className='page-container'>
      <h3>Project #{projectId}</h3>
      <div style={{ overflowX: 'auto', height: tableHeight }}>
        <HotTable
          renderAllRows={true}
          viewportColumnRenderingOffset={headers.length}
          fixedColumnsLeft={5}
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
          <HotColumn data={"start"} type={"date"} dateFormat='DD.MM.YYYY' correctFormat={true} defaultDate='01.01.2022' />
          <HotColumn data={"end"} type={"date"} dateFormat='DD.MM.YYYY' correctFormat={true} defaultDate='01.01.2022' />
          <HotColumn data={"estimations"} readOnly >
            <DepartmentsCellRenderer hot-renderer></DepartmentsCellRenderer>
          </HotColumn>
          {
            headers.slice(4).map((i, idx) => {
              return (
                <HotColumn data={"estimations"} key={"weekColumn" + idx} readOnly >
                  <WeekCellRenderer hot-renderer></WeekCellRenderer>
                </HotColumn>
              )
            })
          }
        </HotTable>
      </div>
    </div>
  )
}
