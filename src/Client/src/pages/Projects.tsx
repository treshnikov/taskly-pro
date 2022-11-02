import React, { useEffect, useState } from 'react'
import { HotColumn, HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import { useTranslation } from 'react-i18next';
import { useHttp } from '../hooks/http.hook';
import { Box, Button, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ProjectShortInfoVm } from '../models/Projects/ProjectShortInfoVm';
import { CellChange, ChangeSource } from 'handsontable/common';


registerAllModules();

const OpenProjectDetailsButtonRenderer = (props: any) => {
  const { value } = props
  const { t } = useTranslation();
  const navigate = useNavigate()

  return (
    <Button
      variant='text'
      size='small'
      style={{ marginLeft: "5px", marginTop: "5px" }}
      onClick={e => { navigate("/projects/" + value) }}>
      {t('open')}
    </Button>
  );
}

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
      p.name?.toLocaleLowerCase().includes(textLowerCase) ||
      p.shortName?.toLocaleLowerCase().includes(textLowerCase) ||
      p.сustomer?.toLocaleLowerCase().includes(textLowerCase) ||
      p.projectManager?.toLocaleLowerCase().includes(textLowerCase) ||
      p.chiefEngineer?.toLocaleLowerCase().includes(textLowerCase) ||
      p.id.toString().toLocaleLowerCase().includes(textLowerCase))

    setfilteredProjects(res)
  }

  useEffect(() => {
    async function populateProjects() {
      let data = await request<ProjectShortInfoVm[]>("/api/v1/projects")
      data.forEach(e => {
        ProjectShortInfoVm.init(e)
      });
      setProjects(data)
      setfilteredProjects(data)
    }
    populateProjects()
  }, [request])

  const headers = ['', 'ID', t('name'), t('short-name'), t('customer'), t('company'),
    t('is-opened'), t('external'), t('project-manager'), t('chief-engineer'),
    t('start'), t('end'), t('close-date'), t('contract')]

  return (
    <div
      className='page-container'>
      <h3>
        {t('projects')}
      </h3>
      <Box
        sx={{ mb: 1 }}>
        <TextField
          size='small'
          autoFocus
          onChange={e => filterProjects(e.target.value)}
          fullWidth
          placeholder={t('project-search')}
        />
      </Box>
      <HotTable
        columnSorting={true}
        data={filteredProjects}
        colHeaders={headers}
        colWidths={[20, 25, 250]}
        fillHandle={false}
        stretchH="all"
        manualColumnResize={true}
        beforeChange={(changes: CellChange[], source: ChangeSource): boolean => { return false }}
        licenseKey='non-commercial-and-evaluation'
      >
        <HotColumn width={55} data={"id"} readOnly>
          <OpenProjectDetailsButtonRenderer hot-renderer />
        </HotColumn>
        <HotColumn data={"id"} editor={false} type={"text"} />
        <HotColumn data={"name"} editor={false} type={"text"} />
        <HotColumn data={"shortName"} editor={false} type={"text"} />
        <HotColumn data={"customer"} editor={false} type={"text"} />
        <HotColumn data={"company"} editor={false} type={"text"} />
        <HotColumn data={"isOpened"} editor={false} type={'checkbox'} className='htCenter' readOnly />
        <HotColumn data={"isExternal"} editor={false} type={'checkbox'} className='htCenter' readOnly />
        <HotColumn data={"projectManager"} editor={false} type={"text"} />
        <HotColumn data={"chiefEngineer"} editor={false} type={"text"} />
        <HotColumn data={"startAsStr"} editor={false} type={"text"} />
        <HotColumn data={"endAsStr"} editor={false} type={"text"} />
        <HotColumn data={"closeDateAsStr"} editor={false} type={"text"} />
        <HotColumn data={"contract"} editor={false} type={"text"} />

      </HotTable>
    </div>
  )
}
