import { Box } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { UserVm } from "../models/UserVm";
import { DataGrid, GridColDef, GridEventListener, GridEvents, GridRowModel, GridRowParams, MuiEvent } from '@mui/x-data-grid';

export const Users: React.FunctionComponent = () => {
  const { request } = useContext(AuthContext)
  const [users, setUsers] = useState<UserVm[]>([])

  useEffect(() => {
    async function populateUsers() {
      const json = await request("/api/v1/auth/users")
      setUsers(json)
    }
    populateUsers()
  }, [request])

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      minWidth: 150
    },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 250,
      editable: true,
    },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 250,
      editable: true,
    }
  ];

  const handleRowEditStart = (params: GridRowParams, event: MuiEvent<React.SyntheticEvent>) => {
    //event.defaultMuiPrevented = true;
    //console.log("handleRowEditStart", params, event)
  };

  const handleRowEditStop: GridEventListener<GridEvents.rowEditStop> = (params, event) => {
    //event.defaultMuiPrevented = true;
    //console.log("handleRowEditStop", params, event)
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    //console.log("processRowUpdate", newRow)
    return { ...newRow, isNew: false };
  };

  return (
    <div>
      <Box>
        <div style={{ width: '100%' }}>
          <DataGrid
            autoHeight
            rows={users}
            columns={columns}
            density='compact'
            pageSize={100}
            rowsPerPageOptions={[25, 50, 100]}
            editMode='row'
            onRowEditStart={handleRowEditStart}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
          />
        </div>
      </Box>
    </div>
  )
}
