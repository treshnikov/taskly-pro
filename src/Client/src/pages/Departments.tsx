import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import { Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import React, { useEffect, useState } from 'react';
import { DepartmentUserVm } from '../models/Users/DepartmentUserVm';
import { useHttp } from '../hooks/http.hook';

export const Departments: React.FunctionComponent = () => {
    const { request } = useHttp()
    const [department, setDepartments] = useState<DepartmentUserVm>({
        id: 'root',
        name: '...',
        type: 0,
        includeInWorkPlan: false
    })
    const [expanded, setExpanded] = useState<string[]>([])
    const { t } = useTranslation();

    useEffect(() => {
        async function fetchDepartments() {
            const departments = await request<DepartmentUserVm>("/api/v1/departments")
            setDepartments(departments)
        }

        fetchDepartments()
    }, [request])

    useEffect(() => {
        setExpanded([department.id])
    }, [department])

    const renderTree = (node: DepartmentUserVm) => (
        <TreeItem key={node.id} nodeId={node.id} label={
            <Typography sx={node.type === 0 ? { fontWeight: "bold" } : { m: 0 }}>{node.name}</Typography>
        }>
            {Array.isArray(node.children)
                ? node.children.map((node) => renderTree(node))
                : null}
        </TreeItem>
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
