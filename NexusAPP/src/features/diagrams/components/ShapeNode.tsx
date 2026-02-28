import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Lock as LockIcon } from '@mui/icons-material';
import type { ShapeType, ElementStyleDto } from '@/types/api.types';

export interface ShapeNodeData {
  label?: string;
  shapeType: ShapeType;
  style: ElementStyleDto;
  size: { width: number; height: number };
  isLocked: boolean;
}

const HANDLE_STYLE = { background: '#555', width: 8, height: 8 };

function renderShape(shapeType: ShapeType, width: number, height: number, style: ElementStyleDto) {
  const fill = style.fillColor ?? '#FFFFFF';
  const stroke = style.strokeColor ?? '#000000';
  const sw = style.strokeWidth ?? 2;
  const sw2 = sw / 2;

  switch (shapeType) {
    case 'Circle':
      return (
        <svg width={width} height={height} style={{ overflow: 'visible' }}>
          <circle
            cx={width / 2}
            cy={height / 2}
            r={Math.min(width, height) / 2 - sw2}
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
          />
        </svg>
      );

    case 'Diamond': {
      const pts = `${width / 2},${sw2} ${width - sw2},${height / 2} ${width / 2},${height - sw2} ${sw2},${height / 2}`;
      return (
        <svg width={width} height={height} style={{ overflow: 'visible' }}>
          <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} />
        </svg>
      );
    }

    case 'Triangle': {
      const pts = `${width / 2},${sw2} ${width - sw2},${height - sw2} ${sw2},${height - sw2}`;
      return (
        <svg width={width} height={height} style={{ overflow: 'visible' }}>
          <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} />
        </svg>
      );
    }

    case 'Ellipse':
      return (
        <svg width={width} height={height} style={{ overflow: 'visible' }}>
          <ellipse
            cx={width / 2}
            cy={height / 2}
            rx={width / 2 - sw2}
            ry={height / 2 - sw2}
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
          />
        </svg>
      );

    case 'Hexagon': {
      const hh = height / 2;
      const q = width / 4;
      const pts = `${q},${sw2} ${width - q},${sw2} ${width - sw2},${hh} ${width - q},${height - sw2} ${q},${height - sw2} ${sw2},${hh}`;
      return (
        <svg width={width} height={height} style={{ overflow: 'visible' }}>
          <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} />
        </svg>
      );
    }

    // ── UML shapes ────────────────────────────────────────────────────────────

    case 'Actor': {
      // Stick figure — head occupies top ~25%, label placed below via ShapeNode
      const hw = width / 2;
      const figH = height * 0.78; // stick figure draws in top 78% of height
      const headR = Math.min(width * 0.18, figH * 0.2);
      const headCy = headR + sw2;
      const bodyTop = headCy + headR;
      const bodyBot = figH * 0.65;
      const armY = bodyTop + (bodyBot - bodyTop) * 0.38;
      const spread = Math.min(width * 0.28, 20);
      return (
        <svg width={width} height={height} style={{ overflow: 'visible' }}>
          <circle cx={hw} cy={headCy} r={headR} fill={fill} stroke={stroke} strokeWidth={sw} />
          <line x1={hw} y1={bodyTop} x2={hw} y2={bodyBot} stroke={stroke} strokeWidth={sw} />
          <line x1={hw - spread} y1={armY} x2={hw + spread} y2={armY} stroke={stroke} strokeWidth={sw} />
          <line x1={hw} y1={bodyBot} x2={hw - spread} y2={figH - sw2} stroke={stroke} strokeWidth={sw} />
          <line x1={hw} y1={bodyBot} x2={hw + spread} y2={figH - sw2} stroke={stroke} strokeWidth={sw} />
        </svg>
      );
    }

    case 'Note': {
      const fold = Math.min(width * 0.22, height * 0.28, 18);
      const bodyPts = [
        `${sw2},${sw2}`,
        `${width - fold - sw2},${sw2}`,
        `${width - sw2},${fold + sw2}`,
        `${width - sw2},${height - sw2}`,
        `${sw2},${height - sw2}`,
      ].join(' ');
      const foldPts = [
        `${width - fold - sw2},${sw2}`,
        `${width - sw2},${fold + sw2}`,
        `${width - fold - sw2},${fold + sw2}`,
      ].join(' ');
      return (
        <svg width={width} height={height} style={{ overflow: 'visible' }}>
          <polygon points={bodyPts} fill={fill} stroke={stroke} strokeWidth={sw} />
          <polygon points={foldPts} fill={stroke} stroke={stroke} strokeWidth={sw * 0.5} />
        </svg>
      );
    }

    // ── Network shapes ────────────────────────────────────────────────────────

    case 'Cloud':
      // Cloud drawn in a 100×65 viewBox; preserveAspectRatio="none" stretches to fill w×h
      // vectorEffect keeps stroke width in screen pixels regardless of scaling
      return (
        <svg
          width={width}
          height={height}
          viewBox="0 0 100 65"
          preserveAspectRatio="none"
          style={{ overflow: 'visible' }}
        >
          <path
            d="M 10,55 A 15,18 0 0,1 14,24 A 22,22 0 0,1 46,10 A 20,20 0 0,1 80,18 A 15,15 0 0,1 92,40 A 12,12 0 0,1 88,55 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      );

    case 'Database': {
      const eh = Math.min(height * 0.2, 16); // ellipse half-height
      const rx = (width - sw) / 2;
      const cx = width / 2;
      return (
        <svg width={width} height={height} style={{ overflow: 'visible' }}>
          {/* Body fill (no stroke on sides) */}
          <rect x={sw2} y={eh} width={width - sw} height={height - 2 * eh} fill={fill} stroke="none" />
          {/* Bottom cap fill */}
          <ellipse cx={cx} cy={height - eh} rx={rx} ry={eh} fill={fill} stroke="none" />
          {/* Side border lines */}
          <line x1={sw2} y1={eh} x2={sw2} y2={height - eh} stroke={stroke} strokeWidth={sw} />
          <line x1={width - sw2} y1={eh} x2={width - sw2} y2={height - eh} stroke={stroke} strokeWidth={sw} />
          {/* Bottom arc border (lower half only) */}
          <path
            d={`M ${sw2},${height - eh} A ${rx},${eh} 0 0 0 ${width - sw2},${height - eh}`}
            fill="none"
            stroke={stroke}
            strokeWidth={sw}
          />
          {/* Top ellipse (drawn last to cover the body/top seam) */}
          <ellipse cx={cx} cy={eh} rx={rx} ry={eh} fill={fill} stroke={stroke} strokeWidth={sw} />
        </svg>
      );
    }

    // ── ER shapes ─────────────────────────────────────────────────────────────

    case 'WeakEntity': {
      const inset = Math.max(sw + 3, 6);
      return (
        <svg width={width} height={height} style={{ overflow: 'visible' }}>
          <rect x={sw2} y={sw2} width={width - sw} height={height - sw} rx={2} fill={fill} stroke={stroke} strokeWidth={sw} />
          <rect x={inset} y={inset} width={width - 2 * inset} height={height - 2 * inset} rx={1} fill="none" stroke={stroke} strokeWidth={sw} />
        </svg>
      );
    }

    case 'Rectangle':
    default:
      return (
        <svg width={width} height={height} style={{ overflow: 'visible' }}>
          <rect
            x={sw2}
            y={sw2}
            width={width - sw}
            height={height - sw}
            rx={4}
            ry={4}
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
          />
        </svg>
      );
  }
}

export const ShapeNode = memo(({ data, selected }: NodeProps<ShapeNodeData>) => {
  const { label, shapeType, style, size, isLocked } = data;
  const width = size?.width ?? 120;
  const height = size?.height ?? 60;
  const fontSize = style?.fontSize ?? 14;
  const fontFamily = style?.fontFamily ?? 'Arial';

  // Actor labels go below the stick figure; all others are centred
  const isActor = shapeType === 'Actor';
  const labelTop = isActor ? height * 0.8 : 0;
  const labelHeight = isActor ? height * 0.2 : height;

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        outline: selected ? '2px solid #1976d2' : 'none',
        outlineOffset: 2,
        borderRadius: 4,
      }}
    >
      {/* Shape SVG */}
      {renderShape(shapeType, width, height, style)}

      {/* Label */}
      {label && (
        <div
          style={{
            position: 'absolute',
            top: labelTop,
            left: 0,
            width,
            height: labelHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            fontSize,
            fontFamily,
            color: '#000000',
            padding: 4,
            textAlign: 'center',
            wordBreak: 'break-word',
            lineHeight: 1.2,
          }}
        >
          {label}
        </div>
      )}

      {/* Lock icon */}
      {isLocked && (
        <div
          style={{
            position: 'absolute',
            top: 2,
            right: 2,
            pointerEvents: 'none',
            opacity: 0.6,
          }}
        >
          <LockIcon style={{ fontSize: 12 }} />
        </div>
      )}

      {/* Handles — all source; connectionMode="loose" on canvas allows any-to-any */}
      <Handle type="source" id="top" position={Position.Top} style={HANDLE_STYLE} />
      <Handle type="source" id="right" position={Position.Right} style={HANDLE_STYLE} />
      <Handle type="source" id="bottom" position={Position.Bottom} style={HANDLE_STYLE} />
      <Handle type="source" id="left" position={Position.Left} style={HANDLE_STYLE} />
    </div>
  );
});

ShapeNode.displayName = 'ShapeNode';
