import React, { useEffect } from 'react'
import { registerAllModules } from 'handsontable/registry';
import { useTranslation } from 'react-i18next';
import { useHttp } from '../hooks/http.hook';
import { useParams } from 'react-router-dom';


registerAllModules();

export const ProjectDetails: React.FunctionComponent = () => {
  const projectId = useParams<{ id?: string }>()!.id

  const { request } = useHttp()
  const { t } = useTranslation();

  useEffect(() => {
    async function requestDetails() {
      //const json = await request("/api/v1/projects")
    }
    requestDetails()
  }, [request])

  return (
    <div className='page-container'>
      <h3>Project #{projectId}</h3>
    </div>
  )
}
