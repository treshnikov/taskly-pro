import React, { useEffect, useState } from 'react'
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import { useTranslation } from 'react-i18next';
import { useHttp } from '../hooks/http.hook';
import { ProjectShortInfoVm } from "../models/ProjectShortInfoVm";
import { Box, TextField } from '@mui/material';

registerAllModules();

export const Projects: React.FunctionComponent = () => {
  const { request } = useHttp()
  const [projects, setProjects] = useState<ProjectShortInfoVm[]>([])
  const [filteredProjects, setfilteredProjects] = useState<ProjectShortInfoVm[]>([])
  const { t } = useTranslation();

  const filterProjects = (text: string) => {
    if (text === '') {
      setfilteredProjects(projects)
      return
    }

    const textLowerCase = text.toLocaleLowerCase()
    const res = projects.filter(p =>
      p.name.toLocaleLowerCase().includes(textLowerCase) ||
      p.projectManager?.toLocaleLowerCase().includes(textLowerCase) ||
      p.chiefEngineer?.toLocaleLowerCase().includes(textLowerCase) ||
      p.id.toString().toLocaleLowerCase().includes(textLowerCase))

    setfilteredProjects(res)
  }

  useEffect(() => {
    async function populateProjects() {
      const json = await request("/api/v1/projects")
      setProjects(json)
      setfilteredProjects(json)
    }
    populateProjects()
  }, [request])

  const headers = ['ID', t('name'), t('short-name'), t('company'),
    t('is-opened'), t('project-manager'), t('chief-engineer'),
    t('start'), t('end'), t('close-date'), t('customer'), t('contract')]

  const columns = [
    { data: "id", editor: false, type: "text" },
    { data: "name", editor: false, type: "text" },
    { data: "shortName", editor: false, type: "text" },
    { data: "customer", editor: false, type: "text" },
    { data: "company", editor: false, type: "text" },
    { data: "isOpened", editor: false, type: 'checkbox', className: 'htCenter', readOnly: true },
    { data: "projectManager", editor: false, type: "text" },
    { data: "chiefEngineer", editor: false, type: "text" },
    { data: "start", editor: false, type: "text" },
    { data: "end", editor: false, type: "text" },
    { data: "closeDate", editor: false, type: "text" },
    { data: "contract", editor: false, type: "text" }
  ]
  const colWidths = [25, 250]

  return (
    <div className='page-container'>
      <h3>{t('projects')}</h3>
      <Box sx={{ mb: 1 }}>
        <TextField
          onChange={e => filterProjects(e.target.value)}
          fullWidth
          placeholder={t('project-search')}
        />
      </Box>
      <HotTable
        fixedRowsTop={0}
        columnSorting={true}
        data={filteredProjects}
        colHeaders={headers}
        columns={columns}
        colWidths={colWidths}
        //wordWrap={false}
        rowHeaders={true}
        fillHandle={false}
        stretchH="all"
        //hiddenColumns={hiddenColumns}
        //manualColumnResize={true}
        //afterChange={(changes: CellChange[] | null, source: ChangeSource) => { console.log("afterChange", changes) }}
        licenseKey='non-commercial-and-evaluation'
      />
    </div>
  )
}
