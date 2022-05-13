import React, { useEffect, useState } from 'react'
import { registerAllModules } from 'handsontable/registry';
import { useTranslation } from 'react-i18next';
import { useHttp } from '../hooks/http.hook';
import { useParams } from 'react-router-dom';
import HotTable, { HotColumn } from '@handsontable/react';
import { ProjectDetailedInfoVm, ProjectTaskUnitEstimationVm, ProjectTaskVm } from '../models/ProjectShortInfoVm';
import { green } from '@mui/material/colors';
import { Stack } from '@mui/material';

registerAllModules();

const DepartmentsCellRenderer = (props: any) => {
  const { value } = props
  const estimations = value as ProjectTaskUnitEstimationVm[]
  const { t } = useTranslation();
  const departmentElementFlagStyle =
  {
    backgroundColor: '#' + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6),
    height: "5px",
    width: "30px",
    marginLeft: "-3px",
    marginTop: "3px"
  }
  const departmentElementTextStyle = 
  {
    whiteSpace: 'nowrap'
  }

  const departmentElementStyle = {
    width: "100%"
  }

  return (
    <>
      {
        estimations?.map((i, idx) => {
          return (
            <Stack direction="row" key={i.id} style={departmentElementStyle}>
              <div style={departmentElementFlagStyle}></div>
              <div style={{whiteSpace: "nowrap"}}>{i.unitName + " " + ProjectTaskUnitEstimationVm.getTotalHours(i)}</div>
            </Stack>
          )
        })
      }
    </>
  );
}


export const ProjectDetails: React.FunctionComponent = () => {
  const projectId = useParams<{ id?: string }>()!.id
  const [tasks, setTasks] = useState<ProjectTaskVm[]>()

  const { request } = useHttp()
  const { t } = useTranslation();

  useEffect(() => {
    async function requestDetails() {
      const json = await request("/api/v1/projects/" + projectId)
      const newTasks = (json as ProjectDetailedInfoVm).tasks
      setTasks(newTasks)
    }
    requestDetails()
  }, [request, projectId])

  const startDate = new Date(2022, 0, 3)
  const weeksCount = 52

  let headers = ['', t('task'), t('start'), t('end'), t('units')]
  let colWidths = [25, 350, 90, 90, 150]

  const weekHeaders = Array.from(Array(weeksCount).keys()).map((i, idx) => {
    const date = startDate
    date.setDate(date.getDate() + idx * 7)
    return `${date.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2 })}.${(1 + date.getMonth()).toLocaleString('en-US', { minimumIntegerDigits: 2 })}.${date.getFullYear()}`
  })
  const weekColsWidths = Array.from(Array(weeksCount).keys()).map(i => 80)

  headers = [...headers, ...weekHeaders]
  colWidths = [...colWidths, ...weekColsWidths]

  return (
    <div className='page-container'>
      <h3>Project #{projectId}</h3>
      <div style={{ overflowX: 'auto', height: '800px' }}>
        <HotTable
          renderAllRows={true}
          viewportColumnRenderingOffset={colWidths.length}
          autoRowSize={true}
          fixedColumnsLeft={5}
          data={tasks}
          colWidths={colWidths}
          colHeaders={headers}
          wordWrap={true}
          fillHandle={false}
          hiddenColumns={{
            columns: [0]
          }}
          //afterChange={(changes: CellChange[] | null, source: ChangeSource) => { console.log("afterChange", changes) }}
          licenseKey='non-commercial-and-evaluation'
        >
          <HotColumn hiddenColumns data={"id"} editor={false} type={"text"} />
          <HotColumn data={"description"} type={"text"} />
          <HotColumn data={"start"} type={"date"} />
          <HotColumn data={"end"} type={"date"} />
          <HotColumn data={"estimations"} >
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
