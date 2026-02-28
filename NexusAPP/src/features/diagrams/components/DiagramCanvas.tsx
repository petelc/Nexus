import { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
  ConnectionMode,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
  type NodeTypes,
  type EdgeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import type { ShapeType } from '@/types/api.types';
import { ShapeNode, type ShapeNodeData } from './ShapeNode';
import { ArrowEdge, DoubleArrowEdge, LineEdge, BezierEdge, type DiagramEdgeData } from './DiagramEdge';

// Define outside the component to prevent "new object" warning
const nodeTypes: NodeTypes = {
  // General
  Rectangle: ShapeNode,
  Circle: ShapeNode,
  Diamond: ShapeNode,
  Triangle: ShapeNode,
  Ellipse: ShapeNode,
  Hexagon: ShapeNode,
  // UML
  Actor: ShapeNode,
  Note: ShapeNode,
  // Network
  Cloud: ShapeNode,
  Database: ShapeNode,
  // ER
  WeakEntity: ShapeNode,
  // Fallback
  Custom: ShapeNode,
};

const edgeTypes: EdgeTypes = {
  Arrow: ArrowEdge,
  DoubleArrow: DoubleArrowEdge,
  Line: LineEdge,
  Bezier: BezierEdge,
};

interface DiagramCanvasInnerProps {
  nodes: Node<ShapeNodeData>[];
  edges: Edge<DiagramEdgeData>[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (params: Connection) => void;
  onNodeClick?: (node: Node<ShapeNodeData>) => void;
  onEdgeClick?: (edge: Edge<DiagramEdgeData>) => void;
  onPaneClick?: () => void;
  onDrop?: (shapeType: ShapeType, position: { x: number; y: number }) => void;
  readonly?: boolean;
}

function DiagramCanvasInner({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onEdgeClick,
  onPaneClick,
  onDrop,
  readonly = false,
}: DiagramCanvasInnerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onNodeClick?.(node as Node<ShapeNodeData>);
    },
    [onNodeClick]
  );

  const handleEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      onEdgeClick?.(edge as Edge<DiagramEdgeData>);
    },
    [onEdgeClick]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const shapeType = event.dataTransfer.getData('application/reactflow-shape') as ShapeType;
      if (!shapeType) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      onDrop?.(shapeType, position);
    },
    [screenToFlowPosition, onDrop]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '100%' }} onDrop={handleDrop} onDragOver={handleDragOver}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        connectionMode={ConnectionMode.Loose}
        nodesDraggable={!readonly}
        nodesConnectable={!readonly}
        elementsSelectable={!readonly}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

// Wrap with ReactFlowProvider so useReactFlow() works
export interface DiagramCanvasProps {
  nodes: Node<ShapeNodeData>[];
  edges: Edge<DiagramEdgeData>[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (params: Connection) => void;
  onNodeClick?: (node: Node<ShapeNodeData>) => void;
  onEdgeClick?: (edge: Edge<DiagramEdgeData>) => void;
  onPaneClick?: () => void;
  onDrop?: (shapeType: ShapeType, position: { x: number; y: number }) => void;
  readonly?: boolean;
}

export const DiagramCanvas = (props: DiagramCanvasProps) => (
  <ReactFlowProvider>
    <DiagramCanvasInner {...props} />
  </ReactFlowProvider>
);
