import {
  Paper,
  Typography,
  Box,
  TextField,
  Slider,
  IconButton,
  Tooltip,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import type { Node, Edge } from 'reactflow';
import type { ShapeNodeData } from './ShapeNode';
import type { DiagramEdgeData } from './DiagramEdge';

interface PropertiesPanelProps {
  selectedNode: Node<ShapeNodeData> | null;
  selectedEdge: Edge<DiagramEdgeData> | null;
  onNodeChange: (nodeId: string, changes: Partial<ShapeNodeData>) => void;
  onEdgeChange: (edgeId: string, changes: Partial<DiagramEdgeData>) => void;
  onDeleteNode: (nodeId: string) => void;
  onDeleteEdge: (edgeId: string) => void;
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
      <Typography variant="caption" sx={{ minWidth: 70, color: 'text.secondary' }}>
        {label}
      </Typography>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: 32, height: 24, padding: 0, border: 'none', cursor: 'pointer', borderRadius: 4 }}
      />
      <Typography variant="caption" color="text.secondary">
        {value}
      </Typography>
    </Box>
  );
}

export const PropertiesPanel = ({
  selectedNode,
  selectedEdge,
  onNodeChange,
  onEdgeChange,
  onDeleteNode,
  onDeleteEdge,
}: PropertiesPanelProps) => {
  if (!selectedNode && !selectedEdge) {
    return (
      <Paper
        elevation={2}
        sx={{
          width: 240,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: 'text.disabled',
        }}
      >
        <Typography variant="body2" textAlign="center">
          Select a shape or connection to edit its properties
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        width: 240,
        p: 1.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        overflowY: 'auto',
        flexShrink: 0,
      }}
    >
      {selectedNode && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" fontWeight={700}>
              Shape: {selectedNode.data.shapeType}
            </Typography>
            <Tooltip title="Delete shape">
              <IconButton size="small" color="error" onClick={() => onDeleteNode(selectedNode.id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Divider sx={{ mb: 1 }} />

          {/* Label */}
          <TextField
            label="Label"
            size="small"
            fullWidth
            value={selectedNode.data.label ?? ''}
            onChange={(e) => onNodeChange(selectedNode.id, { label: e.target.value })}
            sx={{ mb: 1 }}
          />

          {/* Fill color */}
          <ColorField
            label="Fill"
            value={selectedNode.data.style?.fillColor ?? '#FFFFFF'}
            onChange={(v) =>
              onNodeChange(selectedNode.id, {
                style: { ...selectedNode.data.style, fillColor: v },
              })
            }
          />

          {/* Stroke color */}
          <ColorField
            label="Stroke"
            value={selectedNode.data.style?.strokeColor ?? '#000000'}
            onChange={(v) =>
              onNodeChange(selectedNode.id, {
                style: { ...selectedNode.data.style, strokeColor: v },
              })
            }
          />

          {/* Stroke width */}
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Stroke Width: {selectedNode.data.style?.strokeWidth ?? 2}px
            </Typography>
            <Slider
              size="small"
              min={1}
              max={10}
              value={selectedNode.data.style?.strokeWidth ?? 2}
              onChange={(_, v) =>
                onNodeChange(selectedNode.id, {
                  style: { ...selectedNode.data.style, strokeWidth: v as number },
                })
              }
            />
          </Box>

          {/* Font size */}
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Font Size: {selectedNode.data.style?.fontSize ?? 14}px
            </Typography>
            <Slider
              size="small"
              min={8}
              max={36}
              value={selectedNode.data.style?.fontSize ?? 14}
              onChange={(_, v) =>
                onNodeChange(selectedNode.id, {
                  style: { ...selectedNode.data.style, fontSize: v as number },
                })
              }
            />
          </Box>

          {/* Lock */}
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={selectedNode.data.isLocked ?? false}
                onChange={(e) => onNodeChange(selectedNode.id, { isLocked: e.target.checked })}
              />
            }
            label={<Typography variant="caption">Locked</Typography>}
          />
        </>
      )}

      {selectedEdge && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" fontWeight={700}>
              Connection
            </Typography>
            <Tooltip title="Delete connection">
              <IconButton size="small" color="error" onClick={() => onDeleteEdge(selectedEdge.id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Divider sx={{ mb: 1 }} />

          {/* Label */}
          <TextField
            label="Label"
            size="small"
            fullWidth
            value={selectedEdge.data?.label ?? ''}
            onChange={(e) =>
              onEdgeChange(selectedEdge.id, { label: e.target.value })
            }
            sx={{ mb: 1 }}
          />

          {/* Stroke color */}
          <ColorField
            label="Color"
            value={selectedEdge.data?.style?.strokeColor ?? '#000000'}
            onChange={(v) =>
              onEdgeChange(selectedEdge.id, {
                style: {
                  strokeColor: v,
                  strokeWidth: selectedEdge.data?.style?.strokeWidth ?? 2,
                  strokeDashArray: selectedEdge.data?.style?.strokeDashArray,
                },
              })
            }
          />

          {/* Stroke width */}
          <Box sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Width: {selectedEdge.data?.style?.strokeWidth ?? 2}px
            </Typography>
            <Slider
              size="small"
              min={1}
              max={10}
              value={selectedEdge.data?.style?.strokeWidth ?? 2}
              onChange={(_, v) =>
                onEdgeChange(selectedEdge.id, {
                  style: {
                    strokeColor: selectedEdge.data?.style?.strokeColor ?? '#000000',
                    strokeWidth: v as number,
                    strokeDashArray: selectedEdge.data?.style?.strokeDashArray,
                  },
                })
              }
            />
          </Box>

          {/* Dashed toggle */}
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={!!selectedEdge.data?.style?.strokeDashArray}
                onChange={(e) =>
                  onEdgeChange(selectedEdge.id, {
                    style: {
                      strokeColor: selectedEdge.data?.style?.strokeColor ?? '#000000',
                      strokeWidth: selectedEdge.data?.style?.strokeWidth ?? 2,
                      strokeDashArray: e.target.checked ? '6 3' : undefined,
                    },
                  })
                }
              />
            }
            label={<Typography variant="caption">Dashed</Typography>}
          />
        </>
      )}
    </Paper>
  );
};
