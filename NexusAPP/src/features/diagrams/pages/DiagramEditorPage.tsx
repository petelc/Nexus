import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Save as SaveIcon,
  Close as CloseIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
  MarkerType,
} from 'reactflow';
import {
  useGetDiagramByIdQuery,
  useUpdateDiagramMutation,
  useAddElementMutation,
  useUpdateElementMutation,
  useDeleteElementMutation,
  useAddConnectionMutation,
  useUpdateConnectionMutation,
  useDeleteConnectionMutation,
} from '@api/diagramsApi';
import { DiagramCanvas } from '../components/DiagramCanvas';
import { ShapeToolbar } from '../components/ShapeToolbar';
import { PropertiesPanel } from '../components/PropertiesPanel';
import type { ShapeNodeData } from '../components/ShapeNode';
import type { DiagramEdgeData } from '../components/DiagramEdge';
import type {
  DiagramElementDto,
  DiagramConnectionDto,
  ShapeType,
  ConnectionType,
  AddElementRequest,
  UpdateElementRequest,
  AddConnectionRequest,
  UpdateConnectionRequest,
} from '@/types/api.types';
import { buildRoute } from '@routes/routePaths';

// --- Converters ---

function elementToNode(el: DiagramElementDto): Node<ShapeNodeData> {
  return {
    id: el.elementId,
    type: el.shapeType,
    position: { x: el.position.x, y: el.position.y },
    width: el.size.width,
    height: el.size.height,
    data: {
      label: el.text,
      shapeType: el.shapeType,
      style: el.style,
      size: el.size,
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

// --- Meta tracking ---
type NodeMeta = { isNew: true } | { isNew: false; elementId: string };
type EdgeMeta = { isNew: true } | { isNew: false; connectionId: string };

export const DiagramEditorPage = () => {
  const { diagramId } = useParams<{ diagramId: string }>();
  const navigate = useNavigate();

  const { data: diagram, isLoading, isError } = useGetDiagramByIdQuery(diagramId ?? '');

  const [updateDiagram] = useUpdateDiagramMutation();
  const [addElement] = useAddElementMutation();
  const [updateElement] = useUpdateElementMutation();
  const [deleteElement] = useDeleteElementMutation();
  const [addConnection] = useAddConnectionMutation();
  const [updateConnection] = useUpdateConnectionMutation();
  const [deleteConnection] = useDeleteConnectionMutation();

  // --- ReactFlow state (owned here, passed as controlled props to canvas) ---
  const [nodes, setNodes, onNodesChange] = useNodesState<ShapeNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<DiagramEdgeData>([]);

  // --- UI state ---
  const [title, setTitle] = useState('');
  const [isTitleChanged, setIsTitleChanged] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node<ShapeNodeData> | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge<DiagramEdgeData> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [savedOnce, setSavedOnce] = useState(false);
  const [defaultEdgeType, setDefaultEdgeType] = useState<ConnectionType>('Arrow');
  // Ref so handleConnect always has the latest value without being recreated
  const defaultEdgeTypeRef = useRef<ConnectionType>('Arrow');

  // --- Meta refs (track which nodes/edges are new vs saved) ---
  const nodeMeta = useRef<Map<string, NodeMeta>>(new Map());
  const edgeMeta = useRef<Map<string, EdgeMeta>>(new Map());
  const originalElementIds = useRef<Set<string>>(new Set());
  const originalConnectionIds = useRef<Set<string>>(new Set());

  // --- Initialize state from loaded diagram (useEffect, NOT during render) ---
  useEffect(() => {
    if (!diagram) return;

    setTitle(diagram.title);

    const initialNodes = diagram.elements.map(elementToNode);
    const initialEdges = diagram.connections.map(connectionToEdge);

    setNodes(initialNodes);
    setEdges(initialEdges);

    // Build meta maps
    const newNodeMeta = new Map<string, NodeMeta>();
    const newOriginalElementIds = new Set<string>();
    diagram.elements.forEach((el) => {
      newNodeMeta.set(el.elementId, { isNew: false, elementId: el.elementId });
      newOriginalElementIds.add(el.elementId);
    });

    const newEdgeMeta = new Map<string, EdgeMeta>();
    const newOriginalConnectionIds = new Set<string>();
    diagram.connections.forEach((conn) => {
      newEdgeMeta.set(conn.connectionId, { isNew: false, connectionId: conn.connectionId });
      newOriginalConnectionIds.add(conn.connectionId);
    });

    nodeMeta.current = newNodeMeta;
    edgeMeta.current = newEdgeMeta;
    originalElementIds.current = newOriginalElementIds;
    originalConnectionIds.current = newOriginalConnectionIds;

    setIsDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagram?.diagramId]); // Only re-init when the diagram ID changes

  // --- Canvas change handlers ---

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
      setIsDirty(true);
    },
    [onNodesChange]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChange(changes);
      setIsDirty(true);
    },
    [onEdgesChange]
  );

  const handleEdgeTypeChange = useCallback((type: ConnectionType) => {
    defaultEdgeTypeRef.current = type;
    setDefaultEdgeType(type);
  }, []);

  const handleConnect = useCallback(
    (params: Connection) => {
      const edgeType = defaultEdgeTypeRef.current;
      const newEdgeId = `edge-${Date.now()}`;
      edgeMeta.current.set(newEdgeId, { isNew: true });

      const newEdge: Edge<DiagramEdgeData> = {
        ...params,
        id: newEdgeId,
        type: edgeType,
        data: { style: { strokeColor: '#000000', strokeWidth: 2 } },
        markerEnd: edgeType !== 'Line' ? { type: MarkerType.ArrowClosed } : undefined,
        markerStart: edgeType === 'DoubleArrow' ? { type: MarkerType.ArrowClosed } : undefined,
      } as Edge<DiagramEdgeData>;

      setEdges((eds) => addEdge(newEdge, eds));
      setIsDirty(true);
    },
    [setEdges]
  );

  const handleNodeClick = useCallback((node: Node<ShapeNodeData>) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  }, []);

  const handleEdgeClick = useCallback((edge: Edge<DiagramEdgeData>) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  }, []);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);

  // Handle drop from ShapeToolbar
  const handleDrop = useCallback(
    (shapeType: ShapeType, position: { x: number; y: number }) => {
      const newId = `node-${Date.now()}`;
      nodeMeta.current.set(newId, { isNew: true });

      const newNode: Node<ShapeNodeData> = {
        id: newId,
        type: shapeType,
        position,
        data: {
          shapeType,
          label: shapeType,
          style: {
            fillColor: '#FFFFFF',
            strokeColor: '#000000',
            strokeWidth: 2,
            fontSize: 14,
            fontFamily: 'Arial',
            opacity: 1,
            rotation: 0,
          },
          size: { width: 120, height: 60 },
          isLocked: false,
        },
        width: 120,
        height: 60,
      };

      setNodes((nds) => [...nds, newNode]);
      setIsDirty(true);
    },
    [setNodes]
  );

  // Handle click-to-add shape from toolbar
  const handleAddShape = useCallback(
    (shapeType: ShapeType) => {
      handleDrop(shapeType, { x: 200 + Math.random() * 200, y: 200 + Math.random() * 200 });
    },
    [handleDrop]
  );

  // --- Properties panel handlers ---

  const handleNodeChange = useCallback((nodeId: string, changes: Partial<ShapeNodeData>) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...changes } } : n
      )
    );
    setSelectedNode((prev) =>
      prev?.id === nodeId ? { ...prev, data: { ...prev.data, ...changes } } : prev
    );
    setIsDirty(true);
  }, [setNodes]);

  const handleEdgeChange = useCallback((edgeId: string, changes: Partial<DiagramEdgeData>) => {
    setEdges((prev) =>
      prev.map((e) =>
        e.id === edgeId ? { ...e, data: { ...e.data, ...changes } as DiagramEdgeData } : e
      )
    );
    setSelectedEdge((prev) =>
      prev?.id === edgeId
        ? { ...prev, data: { ...prev.data, ...changes } as DiagramEdgeData }
        : prev
    );
    setIsDirty(true);
  }, [setEdges]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setEdges((prev) => prev.filter((e) => e.source !== nodeId && e.target !== nodeId));
    setSelectedNode(null);
    setIsDirty(true);
  }, [setNodes, setEdges]);

  const handleDeleteEdge = useCallback((edgeId: string) => {
    setEdges((prev) => prev.filter((e) => e.id !== edgeId));
    setSelectedEdge(null);
    setIsDirty(true);
  }, [setEdges]);

  // --- Save ---

  const handleSave = async () => {
    if (!diagramId) return;
    setIsSaving(true);
    setSaveError(null);

    try {
      // 1. Update diagram title if changed
      if (isTitleChanged) {
        await updateDiagram({ id: diagramId, data: { title } }).unwrap();
        setIsTitleChanged(false);
      }

      // Capture nodes/edges from the render-time closure.
      // handleSave is not memoized so it always closes over the latest state.
      const currentNodes = nodes;
      const currentEdges = edges;

      // 2. Identify removed elements/connections.
      // originalElementIds stores API UUIDs; node.id may be a local temp ID.
      // Build the set of API UUIDs still on the canvas by looking through nodeMeta.
      const currentApiElementIds = new Set<string>();
      for (const node of currentNodes) {
        const meta = nodeMeta.current.get(node.id);
        if (meta && !meta.isNew) currentApiElementIds.add(meta.elementId);
      }

      const currentApiConnectionIds = new Set<string>();
      for (const edge of currentEdges) {
        const meta = edgeMeta.current.get(edge.id);
        if (meta && !meta.isNew) currentApiConnectionIds.add(meta.connectionId);
      }

      const removedElementIds = [...originalElementIds.current].filter((id) => !currentApiElementIds.has(id));
      const removedConnectionIds = [...originalConnectionIds.current].filter((id) => !currentApiConnectionIds.has(id));

      // 3. Delete removed items
      for (const elementId of removedElementIds) {
        await deleteElement({ diagramId, elementId }).unwrap();
        originalElementIds.current.delete(elementId);
      }
      for (const connectionId of removedConnectionIds) {
        await deleteConnection({ diagramId, connectionId }).unwrap();
        originalConnectionIds.current.delete(connectionId);
      }

      // 4. Create/update elements; build localId → apiId map
      const idMap = new Map<string, string>();

      for (const node of currentNodes) {
        const meta = nodeMeta.current.get(node.id);
        const position = { x: node.position.x, y: node.position.y };
        const size = node.data.size ?? { width: 120, height: 60 };

        if (!meta || meta.isNew) {
          const request: AddElementRequest = {
            shapeType: node.data.shapeType,
            position,
            size,
            text: node.data.label,
            style: node.data.style,
            zIndex: (node.zIndex as number | undefined) ?? 0,
          };
          const created = await addElement({ diagramId, data: request }).unwrap();
          idMap.set(node.id, created.elementId);
          nodeMeta.current.set(node.id, { isNew: false, elementId: created.elementId });
          originalElementIds.current.add(created.elementId);
        } else {
          const request: UpdateElementRequest = {
            position,
            size,
            text: node.data.label,
            style: node.data.style,
            zIndex: (node.zIndex as number | undefined) ?? 0,
            isLocked: node.data.isLocked,
          };
          await updateElement({ diagramId, elementId: meta.elementId, data: request }).unwrap();
          idMap.set(node.id, meta.elementId);
        }
      }

      // 5. Create/update connections
      for (const edge of currentEdges) {
        const meta = edgeMeta.current.get(edge.id);
        const sourceId = idMap.get(edge.source) ?? edge.source;
        const targetId = idMap.get(edge.target) ?? edge.target;

        if (!meta || meta.isNew) {
          const request: AddConnectionRequest = {
            sourceElementId: sourceId,
            targetElementId: targetId,
            connectionType: (edge.type as AddConnectionRequest['connectionType']) ?? 'Arrow',
            label: edge.data?.label,
            style: edge.data?.style,
          };
          const created = await addConnection({ diagramId, data: request }).unwrap();
          edgeMeta.current.set(edge.id, { isNew: false, connectionId: created.connectionId });
          originalConnectionIds.current.add(created.connectionId);
        } else {
          const request: UpdateConnectionRequest = {
            label: edge.data?.label,
            style: edge.data?.style,
          };
          await updateConnection({ diagramId, connectionId: meta.connectionId, data: request }).unwrap();
        }
      }

      setIsDirty(false);
      setSavedOnce(true);
    } catch (_err) {
      setSaveError('Save failed. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 64px)',
        overflow: 'hidden',
      }}
    >
      {/* Editor Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: 2,
          py: 1,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
          flexShrink: 0,
        }}
      >
        <TextField
          size="small"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setIsTitleChanged(true);
            setIsDirty(true);
          }}
          sx={{ width: 300 }}
        />

        {isDirty && (
          <Chip label="Unsaved changes" size="small" color="warning" variant="outlined" />
        )}
        {savedOnce && !isDirty && (
          <Chip label="Saved" size="small" color="success" icon={<CheckIcon />} variant="outlined" />
        )}

        {saveError && (
          <Typography variant="caption" color="error">
            {saveError}
          </Typography>
        )}

        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Tooltip title="Close editor">
            <Button
              variant="outlined"
              size="small"
              startIcon={<CloseIcon />}
              onClick={() => navigate(buildRoute.diagramDetail(diagram.diagramId))}
            >
              Close
            </Button>
          </Tooltip>
          <Button
            variant="contained"
            size="small"
            startIcon={isSaving ? <CircularProgress size={14} color="inherit" /> : <SaveIcon />}
            onClick={handleSave}
            disabled={isSaving || !isDirty}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </Box>
      </Box>

      {/* Editor Body */}
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <ShapeToolbar
          onAddShape={handleAddShape}
          selectedEdgeType={defaultEdgeType}
          onEdgeTypeChange={handleEdgeTypeChange}
          diagramType={diagram.diagramType}
        />

        <Box sx={{ flexGrow: 1, position: 'relative' }}>
          <DiagramCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={handleConnect}
            onNodeClick={handleNodeClick}
            onEdgeClick={handleEdgeClick}
            onPaneClick={handlePaneClick}
            onDrop={handleDrop}
            readonly={false}
          />
        </Box>

        <PropertiesPanel
          selectedNode={selectedNode}
          selectedEdge={selectedEdge}
          onNodeChange={handleNodeChange}
          onEdgeChange={handleEdgeChange}
          onDeleteNode={handleDeleteNode}
          onDeleteEdge={handleDeleteEdge}
        />
      </Box>
    </Box>
  );
};
