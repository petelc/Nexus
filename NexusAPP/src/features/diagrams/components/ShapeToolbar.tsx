import { Paper, Typography, Box, Divider, Tooltip } from '@mui/material';
import type { ShapeType, ConnectionType, DiagramType } from '@/types/api.types';

interface ShapeConfig {
  type: ShapeType;
  label: string;
  icon: React.ReactNode;
}

// ── Shape icons ───────────────────────────────────────────────────────────────

function RectIcon() {
  return (
    <svg width={32} height={22} viewBox="0 0 32 22">
      <rect x={2} y={2} width={28} height={18} rx={3} fill="#e3f2fd" stroke="#1976d2" strokeWidth={2} />
    </svg>
  );
}

function CircleIcon() {
  return (
    <svg width={28} height={28} viewBox="0 0 28 28">
      <circle cx={14} cy={14} r={11} fill="#e8f5e9" stroke="#388e3c" strokeWidth={2} />
    </svg>
  );
}

function DiamondIcon() {
  return (
    <svg width={28} height={28} viewBox="0 0 28 28">
      <polygon points="14,2 26,14 14,26 2,14" fill="#fff3e0" stroke="#f57c00" strokeWidth={2} />
    </svg>
  );
}

function TriangleIcon() {
  return (
    <svg width={28} height={28} viewBox="0 0 28 28">
      <polygon points="14,2 26,26 2,26" fill="#fce4ec" stroke="#c62828" strokeWidth={2} />
    </svg>
  );
}

function EllipseIcon() {
  return (
    <svg width={34} height={22} viewBox="0 0 34 22">
      <ellipse cx={17} cy={11} rx={15} ry={9} fill="#ede7f6" stroke="#6a1b9a" strokeWidth={2} />
    </svg>
  );
}

function HexagonIcon() {
  return (
    <svg width={30} height={28} viewBox="0 0 30 28">
      <polygon points="7,2 23,2 29,14 23,26 7,26 1,14" fill="#e0f7fa" stroke="#00838f" strokeWidth={2} />
    </svg>
  );
}

function ActorIcon() {
  return (
    <svg width={22} height={30} viewBox="0 0 22 30">
      <circle cx={11} cy={5} r={4} fill="#e8eaf6" stroke="#3949ab" strokeWidth={1.5} />
      <line x1={11} y1={9} x2={11} y2={20} stroke="#3949ab" strokeWidth={1.5} />
      <line x1={4} y1={13} x2={18} y2={13} stroke="#3949ab" strokeWidth={1.5} />
      <line x1={11} y1={20} x2={5} y2={28} stroke="#3949ab" strokeWidth={1.5} />
      <line x1={11} y1={20} x2={17} y2={28} stroke="#3949ab" strokeWidth={1.5} />
    </svg>
  );
}

function NoteIcon() {
  return (
    <svg width={30} height={26} viewBox="0 0 30 26">
      <polygon points="2,2 22,2 28,8 28,24 2,24" fill="#fff9c4" stroke="#f9a825" strokeWidth={1.5} />
      <polygon points="22,2 28,8 22,8" fill="#f9a825" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg width={34} height={22} viewBox="0 0 34 22">
      <path
        d="M 3,18 A 6,7 0 0,1 5,7 A 9,9 0 0,1 18,3 A 8,8 0 0,1 31,9 A 5,5 0 0,1 30,18 Z"
        fill="#e1f5fe"
        stroke="#0277bd"
        strokeWidth={1.5}
      />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg width={22} height={30} viewBox="0 0 22 30">
      <rect x={1} y={6} width={20} height={18} fill="#e8f5e9" stroke="none" />
      <ellipse cx={11} cy={6} rx={10} ry={4} fill="#e8f5e9" stroke="#388e3c" strokeWidth={1.5} />
      <line x1={1} y1={6} x2={1} y2={24} stroke="#388e3c" strokeWidth={1.5} />
      <line x1={21} y1={6} x2={21} y2={24} stroke="#388e3c" strokeWidth={1.5} />
      <path d="M 1,24 A 10,4 0 0 0 21,24" fill="#e8f5e9" stroke="#388e3c" strokeWidth={1.5} />
    </svg>
  );
}

function WeakEntityIcon() {
  return (
    <svg width={32} height={22} viewBox="0 0 32 22">
      <rect x={1} y={1} width={30} height={20} rx={2} fill="#fce4ec" stroke="#c62828" strokeWidth={1.5} />
      <rect x={4} y={4} width={24} height={14} rx={1} fill="none" stroke="#c62828" strokeWidth={1.5} />
    </svg>
  );
}

// ── Shape palettes ────────────────────────────────────────────────────────────

const COMMON_SHAPES: ShapeConfig[] = [
  { type: 'Rectangle', label: 'Rectangle', icon: <RectIcon /> },
  { type: 'Circle', label: 'Circle', icon: <CircleIcon /> },
  { type: 'Diamond', label: 'Diamond', icon: <DiamondIcon /> },
  { type: 'Triangle', label: 'Triangle', icon: <TriangleIcon /> },
  { type: 'Ellipse', label: 'Ellipse', icon: <EllipseIcon /> },
  { type: 'Hexagon', label: 'Hexagon', icon: <HexagonIcon /> },
];

const UML_SHAPES: ShapeConfig[] = [
  { type: 'Actor', label: 'Actor', icon: <ActorIcon /> },
  { type: 'Note', label: 'Note', icon: <NoteIcon /> },
  { type: 'Rectangle', label: 'Class', icon: <RectIcon /> },
  { type: 'Ellipse', label: 'Use Case', icon: <EllipseIcon /> },
  { type: 'Diamond', label: 'Decision', icon: <DiamondIcon /> },
];

const NETWORK_SHAPES: ShapeConfig[] = [
  { type: 'Cloud', label: 'Cloud', icon: <CloudIcon /> },
  { type: 'Database', label: 'Database', icon: <DatabaseIcon /> },
  { type: 'Rectangle', label: 'Server', icon: <RectIcon /> },
  { type: 'Circle', label: 'Node', icon: <CircleIcon /> },
  { type: 'Hexagon', label: 'Switch', icon: <HexagonIcon /> },
];

const ER_SHAPES: ShapeConfig[] = [
  { type: 'Rectangle', label: 'Entity', icon: <RectIcon /> },
  { type: 'WeakEntity', label: 'Weak Entity', icon: <WeakEntityIcon /> },
  { type: 'Diamond', label: 'Relationship', icon: <DiamondIcon /> },
  { type: 'Ellipse', label: 'Attribute', icon: <EllipseIcon /> },
];

function getShapesForType(diagramType?: DiagramType): ShapeConfig[] {
  switch (diagramType) {
    case 'UmlDiagram': return UML_SHAPES;
    case 'NetworkDiagram': return NETWORK_SHAPES;
    case 'ErDiagram': return ER_SHAPES;
    default: return COMMON_SHAPES; // Flowchart, Custom, undefined
  }
}

// ── Connection icons ──────────────────────────────────────────────────────────

interface ConnectionConfig {
  type: ConnectionType;
  label: string;
  icon: React.ReactNode;
  tooltip: string;
}

const CONNECTIONS: ConnectionConfig[] = [
  {
    type: 'Arrow',
    label: 'Arrow',
    tooltip: 'Straight line with arrowhead',
    icon: (
      <svg width={32} height={12} viewBox="0 0 32 12">
        <line x1={2} y1={6} x2={24} y2={6} stroke="currentColor" strokeWidth={2} />
        <polygon points="24,2 32,6 24,10" fill="currentColor" />
      </svg>
    ),
  },
  {
    type: 'DoubleArrow',
    label: 'Double',
    tooltip: 'Straight line with arrowheads at both ends',
    icon: (
      <svg width={32} height={12} viewBox="0 0 32 12">
        <polygon points="8,2 0,6 8,10" fill="currentColor" />
        <line x1={8} y1={6} x2={24} y2={6} stroke="currentColor" strokeWidth={2} />
        <polygon points="24,2 32,6 24,10" fill="currentColor" />
      </svg>
    ),
  },
  {
    type: 'Line',
    label: 'Line',
    tooltip: 'Straight line, no arrowhead',
    icon: (
      <svg width={32} height={12} viewBox="0 0 32 12">
        <line x1={2} y1={6} x2={30} y2={6} stroke="currentColor" strokeWidth={2} />
      </svg>
    ),
  },
  {
    type: 'Bezier',
    label: 'Bezier',
    tooltip: 'Curved line — select it to drag the control point',
    icon: (
      <svg width={32} height={16} viewBox="0 0 32 16">
        <path d="M 2,14 Q 16,0 30,14" fill="none" stroke="currentColor" strokeWidth={2} />
        <polygon points="24,10 32,14 26,7" fill="currentColor" />
      </svg>
    ),
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

interface ShapeToolbarProps {
  onAddShape?: (shapeType: ShapeType) => void;
  selectedEdgeType?: ConnectionType;
  onEdgeTypeChange?: (type: ConnectionType) => void;
  diagramType?: DiagramType;
}

export const ShapeToolbar = ({
  onAddShape,
  selectedEdgeType = 'Arrow',
  onEdgeTypeChange,
  diagramType,
}: ShapeToolbarProps) => {
  const shapes = getShapesForType(diagramType);

  const handleDragStart = (e: React.DragEvent, shapeType: ShapeType) => {
    e.dataTransfer.setData('application/reactflow-shape', shapeType);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Paper
      elevation={2}
      sx={{
        width: 160,
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        overflowY: 'auto',
        flexShrink: 0,
      }}
    >
      <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ px: 0.5, pt: 0.5 }}>
        SHAPES
      </Typography>

      {shapes.map(({ type, label, icon }) => (
        <Tooltip key={type} title={`Drag or click to add ${label}`} placement="right">
          <Box
            draggable
            onDragStart={(e) => handleDragStart(e, type)}
            onClick={() => onAddShape?.(type)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 1,
              py: 0.75,
              borderRadius: 1,
              cursor: 'grab',
              userSelect: 'none',
              '&:hover': { backgroundColor: 'action.hover' },
              '&:active': { cursor: 'grabbing' },
            }}
          >
            <Box
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36 }}
              style={{ pointerEvents: 'none' }}
            >
              {icon}
            </Box>
            <Typography variant="caption">{label}</Typography>
          </Box>
        </Tooltip>
      ))}

      <Divider sx={{ my: 1 }} />

      <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ px: 0.5 }}>
        CONNECTOR
      </Typography>
      <Typography variant="caption" color="text.disabled" sx={{ px: 0.5, fontSize: '0.6rem', lineHeight: 1.2 }}>
        Select type before drawing
      </Typography>

      {CONNECTIONS.map(({ type, label, icon, tooltip }) => {
        const isSelected = selectedEdgeType === type;
        return (
          <Tooltip key={type} title={tooltip} placement="right">
            <Box
              onClick={() => onEdgeTypeChange?.(type)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 1,
                py: 0.5,
                borderRadius: 1,
                cursor: 'pointer',
                userSelect: 'none',
                border: '1px solid',
                borderColor: isSelected ? 'primary.main' : 'transparent',
                bgcolor: isSelected ? 'primary.50' : 'transparent',
                color: isSelected ? 'primary.main' : 'text.secondary',
                '&:hover': {
                  bgcolor: isSelected ? 'primary.100' : 'action.hover',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36 }}>
                {icon}
              </Box>
              <Typography variant="caption">{label}</Typography>
            </Box>
          </Tooltip>
        );
      })}
    </Paper>
  );
};
