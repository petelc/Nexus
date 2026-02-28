import { memo, useCallback, useRef } from 'react';
import {
  getStraightPath,
  EdgeLabelRenderer,
  BaseEdge,
  type EdgeProps,
  MarkerType,
  useReactFlow,
} from 'reactflow';
import type { ConnectionStyleDto } from '@/types/api.types';

export interface DiagramEdgeData {
  label?: string;
  style?: ConnectionStyleDto;
  /** Bezier control point offset from the source-target midpoint (canvas coords) */
  cpOffset?: { x: number; y: number };
}

function EdgeLabel({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <EdgeLabelRenderer>
      <div
        style={{
          position: 'absolute',
          transform: `translate(-50%, -50%) translate(${x}px,${y}px)`,
          background: 'white',
          padding: '2px 4px',
          borderRadius: 4,
          fontSize: 12,
          pointerEvents: 'all',
          border: '1px solid #ddd',
        }}
        className="nodrag nopan"
      >
        {label}
      </div>
    </EdgeLabelRenderer>
  );
}

function getEdgeStyle(data?: DiagramEdgeData): React.CSSProperties {
  const s = data?.style;
  return {
    stroke: s?.strokeColor ?? '#000000',
    strokeWidth: s?.strokeWidth ?? 2,
    strokeDasharray: s?.strokeDashArray ?? undefined,
  };
}

export const ArrowEdge = memo((props: EdgeProps<DiagramEdgeData>) => {
  const { sourceX, sourceY, targetX, targetY, data, markerEnd } = props;
  const [edgePath, labelX, labelY] = getStraightPath({ sourceX, sourceY, targetX, targetY });

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={getEdgeStyle(data)}
        markerEnd={markerEnd ?? `url(#${MarkerType.ArrowClosed})`}
      />
      {data?.label && <EdgeLabel x={labelX} y={labelY} label={data.label} />}
    </>
  );
});
ArrowEdge.displayName = 'ArrowEdge';

export const DoubleArrowEdge = memo((props: EdgeProps<DiagramEdgeData>) => {
  const { sourceX, sourceY, targetX, targetY, data, markerEnd, markerStart } = props;
  const [edgePath, labelX, labelY] = getStraightPath({ sourceX, sourceY, targetX, targetY });

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={getEdgeStyle(data)}
        markerEnd={markerEnd ?? `url(#${MarkerType.ArrowClosed})`}
        markerStart={markerStart ?? `url(#${MarkerType.ArrowClosed})`}
      />
      {data?.label && <EdgeLabel x={labelX} y={labelY} label={data.label} />}
    </>
  );
});
DoubleArrowEdge.displayName = 'DoubleArrowEdge';

export const LineEdge = memo((props: EdgeProps<DiagramEdgeData>) => {
  const { sourceX, sourceY, targetX, targetY, data } = props;
  const [edgePath, labelX, labelY] = getStraightPath({ sourceX, sourceY, targetX, targetY });

  return (
    <>
      <BaseEdge path={edgePath} style={getEdgeStyle(data)} />
      {data?.label && <EdgeLabel x={labelX} y={labelY} label={data.label} />}
    </>
  );
});
LineEdge.displayName = 'LineEdge';

/**
 * Bezier edge with a draggable quadratic control point.
 * When the edge is selected, a blue handle appears at the curve's midpoint.
 * Drag it to reshape the curve. The offset is stored in edge data (session only).
 */
export const BezierEdge = memo((props: EdgeProps<DiagramEdgeData>) => {
  const { id, sourceX, sourceY, targetX, targetY, data, markerEnd, selected } = props;
  const { setEdges, getViewport } = useReactFlow();

  const cpOffset = data?.cpOffset ?? { x: 0, y: 0 };
  const ctrlX = (sourceX + targetX) / 2 + cpOffset.x;
  const ctrlY = (sourceY + targetY) / 2 + cpOffset.y;

  // Quadratic bezier: M source Q control target
  const path = `M ${sourceX},${sourceY} Q ${ctrlX},${ctrlY} ${targetX},${targetY}`;

  // Label at t=0.5 of quadratic bezier
  const labelX = 0.25 * sourceX + 0.5 * ctrlX + 0.25 * targetX;
  const labelY = 0.25 * sourceY + 0.5 * ctrlY + 0.25 * targetY;

  const dragState = useRef<{
    startClientX: number;
    startClientY: number;
    startOffset: { x: number; y: number };
    zoom: number;
  } | null>(null);

  const onControlMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const { zoom } = getViewport();
      dragState.current = {
        startClientX: e.clientX,
        startClientY: e.clientY,
        startOffset: { ...cpOffset },
        zoom,
      };

      const onMouseMove = (ev: MouseEvent) => {
        if (!dragState.current) return;
        const { startClientX, startClientY, startOffset, zoom: z } = dragState.current;
        const dx = (ev.clientX - startClientX) / z;
        const dy = (ev.clientY - startClientY) / z;
        setEdges((eds) =>
          eds.map((edge) =>
            edge.id === id
              ? {
                  ...edge,
                  data: {
                    ...edge.data,
                    cpOffset: { x: startOffset.x + dx, y: startOffset.y + dy },
                  } as DiagramEdgeData,
                }
              : edge
          )
        );
      };

      const onMouseUp = () => {
        dragState.current = null;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [id, cpOffset, getViewport, setEdges]
  );

  return (
    <>
      <path
        d={path}
        fill="none"
        style={getEdgeStyle(data)}
        markerEnd={markerEnd ?? `url(#${MarkerType.ArrowClosed})`}
        className="react-flow__edge-path"
      />
      {selected && (
        <circle
          cx={ctrlX}
          cy={ctrlY}
          r={6}
          fill="white"
          stroke="#1976d2"
          strokeWidth={2}
          style={{ cursor: 'crosshair' }}
          className="nodrag nopan"
          onMouseDown={onControlMouseDown}
        />
      )}
      {data?.label && <EdgeLabel x={labelX} y={labelY} label={data.label} />}
    </>
  );
});
BezierEdge.displayName = 'BezierEdge';
