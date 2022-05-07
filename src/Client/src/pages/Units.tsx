import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import { Container } from '@mui/material';
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
    const [data, setData] = useState<RenderTree>(initData)

    useEffect(() => {

        async function fetchUnits() {
            const units = await request("/api/v1/units")
            setData(units)
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

    const { t } = useTranslation();

    return (
        <Container>
            <h3>{t('units')}</h3>
            <TreeView
                aria-label="rich object"
                defaultCollapseIcon={<ChevronRightIcon />}
                defaultExpanded={['root']}
                defaultExpandIcon={<ExpandMoreIcon />}
                sx={{ flexGrow: 1, overflowY: 'auto' }}
            >
                {renderTree(data)}
            </TreeView>
        </Container>
    );
}
