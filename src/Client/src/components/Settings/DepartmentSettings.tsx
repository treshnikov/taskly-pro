import { Button, Checkbox, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { DepartmentUserVm } from '../../models/Users/DepartmentUserVm';
import { useHttp } from '../../hooks/http.hook';

export const DepartmentSettings: React.FunctionComponent = () => {
    const { request } = useHttp()
    const [department, setDepartments] = useState<DepartmentUserVm>(new DepartmentUserVm())
    const { t } = useTranslation();

    useEffect(() => {
        async function fetchDepartments() {
            const departments = await request<DepartmentUserVm>("/api/v1/departments/withNoUsers")
            setDepartments(departments)
        }

        fetchDepartments()
    }, [request])

    const setDepartmentIncludeInWorkPlan = async (id: string, val: boolean) => {
        await request("/api/v1/departments/updateEnableForPlanning", "PUT",
            { id: id, value: val }, [{ name: 'Content-Type', value: 'application/json' }])
    }

    const renderTree = (node: DepartmentUserVm, level: number) => (
        <div key={node.id} style={{display: "flex", flexDirection: "column"}}>
        {
                node.type === 0
                    ? (<>
                        <Typography marginLeft={2*level}>
                            <Checkbox
                                checked={node.includeInWorkPlan}
                                onClick={e => {
                                    node.includeInWorkPlan = !node.includeInWorkPlan
                                    // to force rerender
                                    setDepartments({ ...department })
                                    setDepartmentIncludeInWorkPlan(node.id, node.includeInWorkPlan)
                                    //e.stopPropagation()
                                }}
                            /> {node.name}
                        </Typography>
                    </>)
                    : (<>
                        <Typography
                            padding={1}>
                            {node.name}
                        </Typography>

                    </>)
            }

            {
                Array.isArray(node.children) && node.children.some(i => i.type === 0)
                    ? node.children.map((node) => renderTree(node, level + 1))
                    : null
            }
        </div >
    );

    return (
        <div
            className='page-container'>
            <h3>
                {t('departments')}
            </h3>
            <Stack
                spacing={1}
                paddingBottom={1}
                direction="row">
            </Stack>
            {renderTree(department, 0)}
        </div>
    );
}
