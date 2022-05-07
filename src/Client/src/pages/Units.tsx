import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import { Button, Container, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { AuthContext } from '../context/AuthContext';
import { useContext, useEffect, useState } from 'react';

interface RenderTree {
    id: string;
    name: string;
    children?: readonly RenderTree[];
}

const initData: RenderTree = {
    id: 'root',
    name: '...'
};

export default function Units() {
    const { request } = useContext(AuthContext)
    const [units, setUnits] = useState<RenderTree>(initData)
    const [expanded, setExpanded] = useState<string[]>([])
    const { t } = useTranslation();

    useEffect(() => {

        async function fetchUnits() {
            const units = await request("/api/v1/units")
            setUnits(units)
        }

        fetchUnits()
    }, [request])

    const renderTree = (nodes: RenderTree) => (
        <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
            {Array.isArray(nodes.children)
                ? nodes.children.map((node) => renderTree(node))
                : null}
        </TreeItem>
    );
    const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
        setExpanded(nodeIds);
    };

    const expandAll = () => {
        let neweExpanded: string[] = []

        function trace(current: RenderTree, neweExpanded: string[]) {
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
