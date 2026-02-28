import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import { Edit as EditIcon, PlaylistAdd as AddToCollectionIcon } from '@mui/icons-material';
import { useState, useMemo } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { AddToCollectionDialog } from '@features/collections/components/AddToCollectionDialog';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { MarkerType, type Node, type Edge } from 'reactflow';
import { useGetDiagramByIdQuery } from '@api/diagramsApi';
import { DiagramCanvas } from '../components/DiagramCanvas';
import type { DiagramElementDto, DiagramConnectionDto, DiagramType } from '@/types/api.types';
import type { ShapeNodeData } from '../components/ShapeNode';
import type { DiagramEdgeData } from '../components/DiagramEdge';
import { ROUTE_PATHS, buildRoute } from '@routes/routePaths';

dayjs.extend(relativeTime);

function formatDiagramType(type: DiagramType): string {
  switch (type) {
    case 'NetworkDiagram': return 'Network Diagram';
    case 'UmlDiagram': return 'UML Diagram';
    case 'ErDiagram': return 'ER Diagram';
    default: return type;
  }
}

function elementToNode(el: DiagramElementDto): Node<ShapeNodeData> {
  return {
    id: el.elementId,
    type: el.shapeType,
    position: { x: Number(el.position.x), y: Number(el.position.y) },
    width: Number(el.size.width),
    height: Number(el.size.height),
    data: {
      label: el.text,
      shapeType: el.shapeType as ShapeNodeData['shapeType'],
      style: el.style,
      size: { width: Number(el.size.width), height: Number(el.size.height) },
      isLocked: el.isLocked,
    },
  };
}

function connectionToEdge(conn: DiagramConnectionDto): Edge<DiagramEdgeData> {
  return {
    id: conn.connectionId,
    source: conn.sourceElementId,
    target: conn.targetElementId,
    type: conn.connectionType,
    data: { label: conn.label, style: conn.style },
    markerEnd: conn.connectionType !== 'Line' ? { type: MarkerType.ArrowClosed } : undefined,
    markerStart: conn.connectionType === 'DoubleArrow' ? { type: MarkerType.ArrowClosed } : undefined,
  };
}

const noop = () => {};

export const DiagramDetailPage = () => {
  const { diagramId } = useParams<{ diagramId: string }>();
  const { data: diagram, isLoading, isError } = useGetDiagramByIdQuery(diagramId ?? '');
  const [addToCollectionOpen, setAddToCollectionOpen] = useState(false);

  // Compute nodes/edges directly from API data — do NOT use useNodesState here.
  // useNodesState only reads its argument once on mount (when data is still loading),
  // so it would permanently hold an empty array even after the data arrives.
  const nodes = useMemo(
    () => (diagram?.elements ?? []).map(elementToNode),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [diagram?.elements]
  );
  const edges = useMemo(
    () => (diagram?.connections ?? []).map(connectionToEdge),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [diagram?.connections]
  );

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !diagram) {
    return (
      <Alert severity="error">
        Failed to load diagram. It may have been deleted or you may not have access.
      </Alert>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs>
        <Link component={RouterLink} to={ROUTE_PATHS.DASHBOARD} underline="hover" color="inherit">
          Home
        </Link>
        <Link component={RouterLink} to={ROUTE_PATHS.DIAGRAMS} underline="hover" color="inherit">
          Diagrams
        </Link>
        <Typography color="text.primary" noWrap sx={{ maxWidth: 200 }}>
          {diagram.title}
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="h4" fontWeight={700}>
              {diagram.title}
            </Typography>
            <Chip
              label={formatDiagramType(diagram.diagramType as DiagramType)}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            By {diagram.createdBy.username} · Updated {dayjs(diagram.updatedAt).fromNow()} ·{' '}
            {diagram.elements.length} elements · {diagram.connections.length} connections
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<AddToCollectionIcon />}
            onClick={() => setAddToCollectionOpen(true)}
          >
            Add to Collection
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            component={RouterLink}
            to={buildRoute.diagramEditor(diagram.diagramId)}
          >
            Edit
          </Button>
        </Box>
      </Box>

      {/* Canvas — read only, fixed height so ReactFlow always has a pixel size */}
      <Paper
        elevation={1}
        sx={{
          height: 560,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <DiagramCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={noop}
          onEdgesChange={noop}
          onConnect={noop}
          readonly={true}
        />
      </Paper>

      <AddToCollectionDialog
        open={addToCollectionOpen}
        onClose={() => setAddToCollectionOpen(false)}
        itemId={diagram.diagramId}
        itemType="Diagram"
        itemTitle={diagram.title}
      />
    </Box>
  );
};
