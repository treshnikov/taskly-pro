import React, { useEffect, useState } from 'react'
import { registerAllModules } from 'handsontable/registry';
import { useTranslation } from 'react-i18next';
import { useHttp } from '../hooks/http.hook';
import { useParams } from 'react-router-dom';


registerAllModules();

export const ProjectDetails: React.FunctionComponent = () => {
  const projectId = useParams<{ id?: string }>()!.id
  const [content, setContent] = useState<string>("")

  const { request } = useHttp()
  const { t } = useTranslation();

  useEffect(() => {
    async function requestDetails() {
      const json = await request("/api/v1/projects/" + projectId)
      setContent(json)
    }
    requestDetails()
  }, [request])

  return (
    <div className='page-container'>
      <h3>Project #{projectId}</h3>
      {JSON.stringify(content, null, 2)}
    </div>
  )
}
