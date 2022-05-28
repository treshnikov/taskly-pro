import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import { Button, Checkbox, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import React, { useEffect, useState } from 'react';
import { DepartmentUserVm } from '../../models/Users/DepartmentUserVm';
import { useHttp } from '../../hooks/http.hook';

export const DepartmentSettings: React.FunctionComponent = () => {
    const { request } = useHttp()
    const [department, setDepartments] = useState<DepartmentUserVm>(new DepartmentUserVm())
    const [expanded, setExpanded] = useState<string[]>([])
    const { t } = useTranslation();

    useEffect(() => {
        async function fetchDepartments() {
            const departments = await request<DepartmentUserVm>("/api/v1/departments/withNoUsers")
            setDepartments(departments)
        }

        fetchDepartments()
    }, [request])

    useEffect(() => {
        setExpanded([department.id])
    }, [department])

    const setDepartmentEnabledForPlanning = async (id: string, val: boolean) => {
        console.log(JSON.stringify({ id: id, value: val }))
        await request("/api/v1/departments/updateEnableForPlanning", {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'put',
            body: JSON.stringify({ id: id, value: val })
        })
    }

    const renderTree = (node: DepartmentUserVm) => (
        <TreeItem key={node.id} nodeId={node.id} label={
            node.type === 0
                ? (<>
                    <Typography>
                        <Checkbox
                            checked={node.enabledForPlanning}
                            onClick={e => {
                                node.enabledForPlanning = !node.enabledForPlanning
                                // to force rerender
                                setDepartments({ ...department })
                                setDepartmentEnabledForPlanning(node.id, node.enabledForPlanning)
                                e.stopPropagation()
                            }}
                        /> {node.name}
                    </Typography>
                </>)
                : (<>
                    <Typography padding={1}>
                        {node.name}
                    </Typography>

                </>)
        }>
            {
                Array.isArray(node.children) && node.children.some(i => i.type === 0)
                    ? node.children.map((node) => renderTree(node))
                    : null
            }
        </TreeItem >
    );

    const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
        setExpanded(nodeIds);
    };

    const expandAll = () => {
        let neweExpanded: string[] = []

        function trace(current: DepartmentUserVm, neweExpanded: string[]) {
            if (!current)
                return

            neweExpanded.push(current.id)
            if (!current.children)
                return

            current.children.forEach(c => {
                trace(c, neweExpanded)
            });
        }

        trace(department, neweExpanded)
        setExpanded(neweExpanded)
    }

    return (
        <div className='page-container'>
            <h3>{t('departments')}</h3>
            <Stack spacing={1} paddingBottom={1} direction="row">
                <Button onClick={e => { expandAll() }} variant='contained'>{t('expand-all')}</Button>
                <Button onClick={e => { setExpanded([]) }} variant='contained'>{t('collapse-all')}</Button>
            </Stack>
            <TreeView
                aria-label="rich object"
                expanded={expanded}
                onNodeToggle={handleToggle}
                defaultCollapseIcon={<ChevronRightIcon />}
                defaultExpandIcon={<ExpandMoreIcon />}
                sx={{ flexGrow: 1, overflowY: 'auto' }}
            >
                {renderTree(department)}
            </TreeView>
        </div>
    );
}
