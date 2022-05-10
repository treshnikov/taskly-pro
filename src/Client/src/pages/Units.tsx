import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import { Button, Container, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useEffect, useState } from 'react';
import { UnitUserVm } from '../models/UnitUserVm';
import { useHttp } from '../hooks/http.hook';

export default function Units() {
    const { request } = useHttp()
    const [units, setUnits] = useState<UnitUserVm>({
        id: 'root',
        name: '...',
        type: 0
    })
    const [expanded, setExpanded] = useState<string[]>([])
    const { t } = useTranslation();

    useEffect(() => {

        async function fetchUnits() {
            const units = await request("/api/v1/units")
            setUnits(units)
        }

        fetchUnits()
    }, [request])

    const renderTree = (node: UnitUserVm) => (
        <TreeItem key={node.id} nodeId={node.id} label={
            <Typography sx={node.type === 0 ? { fontWeight: "bold" } : {m: 0}}>{node.name}</Typography>
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

        function trace(current: UnitUserVm, neweExpanded: string[]) {
            if (!current)
                return

            neweExpanded.push(current.id)
            if (!current.children)
                return

            current.children.forEach(c => {
                trace(c, neweExpanded)
            });
        }

        trace(units, neweExpanded)
        setExpanded(neweExpanded)
    }

    return (
        <Container>
            <h3>{t('units')}</h3>
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
                {renderTree(units)}
            </TreeView>
        </Container>
    );
}
