import React, { useEffect, useState } from 'react'
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import { useTranslation } from 'react-i18next';
import { useHttp } from '../hooks/http.hook';
import { UserVm } from '../models/Users/UserVm';
registerAllModules();

export const Users: React.FunctionComponent = () => {
  const { request } = useHttp()
  const [users, setUsers] = useState<UserVm[]>([])
  const { t } = useTranslation();

  useEffect(() => {
    async function populateUsers() {
      const json = await request<UserVm[]>("/api/v1/users")
      setUsers(json)
    }
    populateUsers()
  }, [request])

  const headers = ['ID', t('name'), t('email'), t('position'), t('department')]
  const hiddenColumns = { columns: [0] }
  const columns = [
    { data: "id", editor: false },
    { data: "name", editor: false },
    { data: "email", editor: false },
    { data: "position", editor: false },
    {
      data: 'department',
      type: 'dropdown',
      strict: true,
      editor: false,
      source: ['IT']
    }
  ]
  const colWidths = [100, 250, 220, 300, 400]

  return (
    <div className='page-container'>
      <h3>{t('users')}</h3>
      <HotTable
        //fixedRowsTop={0}
        columnSorting={true}
        data={users}
        colHeaders={headers}
        columns={columns}
        colWidths={colWidths}
        wordWrap={false}
        rowHeaders={true}
        fillHandle={false}
        stretchH="all"
        hiddenColumns={hiddenColumns}
        licenseKey='non-commercial-and-evaluation'
      />
    </div>
  )
}
