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

registerAllModules();

export const ProjectDetails: React.FunctionComponent = () => {
  const projectId = useParams<{ id?: string }>()!.id
  const [tasks, setTasks] = useState<ProjectTaskVm[]>()

  const { request } = useHttp()
  const { t } = useTranslation();

  useEffect(() => {
    async function requestDetails() {
      const json = await request("/api/v1/projects/" + projectId)
      const newTasks = (json as ProjectDetailedInfoVm).tasks

      const testTask = new ProjectTaskVm()
      testTask.description = "Отдел программирования РСУ"

      const testEstimation1 = new ProjectTaskUnitEstimationVm()
      testEstimation1.unitName = "Отдел программирования РСУ"
      testEstimation1.id = "123123"
      const testEstimation2 = new ProjectTaskUnitEstimationVm()
      testEstimation2.id = "1123123"
      testEstimation2.unitName = "Отдел программирования СУПП"
      const testEstimation3 = new ProjectTaskUnitEstimationVm()
      testEstimation3.id = "12399"
      testEstimation3.unitName = "Отдел программирования с очень длинным именем"

      testTask.estimations = [testEstimation1, testEstimation2, testEstimation3]

      setTasks([...newTasks, testTask])
    }
    requestDetails()
  }, [request, projectId])

  const startDate = new Date(2022, 0, 3)
  const weeksCount = 52

  let headers = ['', t('task'), t('start'), t('end'), t('units')]
  let colWidths = [25, 350, 90, 90, 250]

  const weekHeaders = Array.from(Array(weeksCount).keys()).map((i, idx) => {
    const date = startDate
    date.setDate(date.getDate() + idx * 7)
    return `${date.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2 })}.${(1 + date.getMonth()).toLocaleString('en-US', { minimumIntegerDigits: 2 })}.${date.getFullYear()}`
  })
  const weekColsWidths = Array.from(Array(weeksCount).keys()).map(i => 80)

  headers = [...headers, ...weekHeaders]
  colWidths = [...colWidths, ...weekColsWidths]

  const [tableHeight, setTableHeight] = useState<number>(500)
  useLayoutEffect(() => {
    console.log(document.getElementsByClassName("wtSpreader")[0]["scrollHeight"])

    setTableHeight(window.innerHeight - 145)
  })

  return (
    <div className='page-container'>
      <h3>Project #{projectId}</h3>
      <div style={{ overflowX: 'auto', height: tableHeight }}>
        <HotTable
          renderAllRows={true}
          viewportColumnRenderingOffset={colWidths.length}
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
          <HotColumn data={"estimations"} readOnly>
            <DepartmentsCellRenderer hot-renderer></DepartmentsCellRenderer>
          </HotColumn>
          {
            Array.from(Array(weeksCount).keys()).map((i, idx) => {
              return (
                <HotColumn header type={"text"} key={"weekColumn" + idx} />
              )
            })
          }
        </HotTable>
      </div>
    </div>
  )
}
