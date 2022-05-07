import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import { Container, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface RenderTree {
    id: string;
    name: string;
    children?: readonly RenderTree[];
}

const data: RenderTree = {
    id: 'root',
    name: 'Parent',
    children: [
        {
            id: '1',
            name: 'Child - 1',
        },
        {
            id: '3',
            name: 'Child - 3',
            children: [
                {
                    id: '4',
                    name: 'Child - 4',
                },
            ],
        },
    ],
};

export default function Units() {
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
                sx={{ height: 110, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
            >
                {renderTree(data)}
            </TreeView>
        </Container>
    );
}
