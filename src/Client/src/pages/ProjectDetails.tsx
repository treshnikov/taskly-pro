import React, { useEffect, useState } from 'react'
import { registerAllModules } from 'handsontable/registry';
import { useTranslation } from 'react-i18next';
import { useHttp } from '../hooks/http.hook';
import { useParams } from 'react-router-dom';
import HotTable, { HotColumn } from '@handsontable/react';
import { ProjectDetailedInfoVm, ProjectTaskVm } from '../models/ProjectShortInfoVm';

registerAllModules();

export const ProjectDetails: React.FunctionComponent = () => {
  const projectId = useParams<{ id?: string }>()!.id
  const [tasks, setTasks] = useState<ProjectTaskVm[]>()

  const { request } = useHttp()
  const { t } = useTranslation();

  useEffect(() => {
    async function requestDetails() {
      const json = await request("/api/v1/projects/" + projectId)
      setTasks((json as ProjectDetailedInfoVm).tasks)
    }
    requestDetails()
  }, [request, projectId])

  const startDate = new Date(2022, 0, 3)
  let headers = ['', t('task'), t('start'), t('end'), t('units')]
  const weekHeaders = Array.from(Array(52).keys()).map(i => {
    const date = startDate
    date.setDate(date.getDate() + i * 7)
    return `${date.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2 })}.${(1 + date.getMonth()).toLocaleString('en-US', { minimumIntegerDigits: 2 })}.${date.getFullYear()}`
  })
  headers = [...headers, ...weekHeaders]

  let headerWidths = [25, 350, 100, 100, 150]
  const weekHeaderWidths = Array.from(Array(52).keys()).map(i => 80)
  headerWidths = [...headerWidths, ...weekHeaderWidths]

  return (
    <div className='page-container'>
      <h3>Project #{projectId}</h3>
      <div style={{overflowX: 'auto', height: 'auto'}}>
        <HotTable
          width={'100%'}
          fixedColumnsLeft={5}
          columnSorting={true}
          manualColumnResize={true}
          data={tasks}
          colWidths={headerWidths}
          colHeaders={headers}
          rowHeaders={true}
          fillHandle={false}
          hiddenColumns={{
            columns: [0]
          }}
          //manualColumnResize={true}
          //afterChange={(changes: CellChange[] | null, source: ChangeSource) => { console.log("afterChange", changes) }}
          licenseKey='non-commercial-and-evaluation'
        >
          <HotColumn hiddenColumns data={"id"} editor={false} type={"text"} />
          <HotColumn data={"description"} type={"text"} />
          <HotColumn data={"start"} type={"date"} />
          <HotColumn data={"end"} type={"date"} />
          <HotColumn type={"text"} />
          {
            Array.from(Array(52).keys()).map((i, idx) => {
              return (
                <HotColumn header type={"text"} />
              )
            })
          }
        </HotTable>
      </div>

      <br />
      {JSON.stringify(tasks, null, 2)}
    </div>
  )
}
