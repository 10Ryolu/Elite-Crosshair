import React from 'react';
import type { CrosshairConfig } from '@/contexts/CrosshairContext';

interface CrosshairPreviewProps {
  crosshair: CrosshairConfig;
  size?: number;
  className?: string;
}

export const CrosshairPreview: React.FC<CrosshairPreviewProps> = ({ 
  crosshair, 
  size = 100,
  className = ""
}) => {
  const renderCrosshair = () => {
    const centerX = size / 2;
    const centerY = size / 2;
    
    // Für Custom/Pixel Crosshairs
    if (crosshair.type === 'custom' && crosshair.customPixelData) {
      console.log('Rendering custom crosshair with pixel data:', crosshair.customPixelData);
      const gridSize = crosshair.customPixelData.length;
      const pixelSize = size / gridSize;
      
      return (
        <svg width={size} height={size} className="overflow-visible">
          {crosshair.customPixelData.map((row, y) =>
            row.map((pixel, x) => {
              if (!pixel.active) return null;
              return (
                <rect
                  key={`${x}-${y}`}
                  x={x * pixelSize}
                  y={y * pixelSize}
                  width={pixelSize}
                  height={pixelSize}
                  fill={pixel.color}
                  opacity={crosshair.opacity}
                />
              );
            })
          )}
        </svg>
      );
    }

    // Fallback für alte customPixels Format
    if (crosshair.type === 'custom' && crosshair.customPixels) {
      const gridSize = crosshair.customPixels.length;
      const pixelSize = size / gridSize;
      
      return (
        <svg width={size} height={size} className="overflow-visible">
          {crosshair.customPixels.map((row, y) =>
            row.map((pixel, x) => {
              if (!pixel) return null;
              return (
                <rect
                  key={`${x}-${y}`}
                  x={x * pixelSize}
                  y={y * pixelSize}
                  width={pixelSize}
                  height={pixelSize}
                  fill={crosshair.color}
                  opacity={crosshair.opacity}
                />
              );
            })
          )}
        </svg>
      );
    }
    
    // Standard Crosshair Rendering - KORRIGIERT für Symmetrie
    const crosshairSize = (crosshair.size / 2); // Halbe Größe für symmetrische Darstellung
    const thickness = crosshair.thickness;
    const gap = crosshair.gap;
    const outlineWidth = crosshair.outline ? 1 : 0;

    switch (crosshair.type) {
      case 'cross':
        return (
          <svg width={size} height={size} className="overflow-visible">
            {crosshair.outline && (
              <g>
                {/* Outline - Horizontal */}
                <rect
                  x={centerX - crosshairSize - outlineWidth}
                  y={centerY - thickness/2 - outlineWidth}
                  width={crosshairSize - gap}
                  height={thickness + 2*outlineWidth}
                  fill={crosshair.outlineColor}
                  opacity={crosshair.opacity}
                />
                <rect
                  x={centerX + gap + outlineWidth}
                  y={centerY - thickness/2 - outlineWidth}
                  width={crosshairSize - gap}
                  height={thickness + 2*outlineWidth}
                  fill={crosshair.outlineColor}
                  opacity={crosshair.opacity}
                />
                {/* Outline - Vertical */}
                <rect
                  x={centerX - thickness/2 - outlineWidth}
                  y={centerY - crosshairSize - outlineWidth}
                  width={thickness + 2*outlineWidth}
                  height={crosshairSize - gap}
                  fill={crosshair.outlineColor}
                  opacity={crosshair.opacity}
                />
                <rect
                  x={centerX - thickness/2 - outlineWidth}
                  y={centerY + gap + outlineWidth}
                  width={thickness + 2*outlineWidth}
                  height={crosshairSize - gap}
                  fill={crosshair.outlineColor}
                  opacity={crosshair.opacity}
                />
              </g>
            )}
            <g>
              {/* Main Cross - Horizontal */}
              <rect
                x={centerX - crosshairSize}
                y={centerY - thickness/2}
                width={crosshairSize - gap}
                height={thickness}
                fill={crosshair.color}
                opacity={crosshair.opacity}
              />
              <rect
                x={centerX + gap}
                y={centerY - thickness/2}
                width={crosshairSize - gap}
                height={thickness}
                fill={crosshair.color}
                opacity={crosshair.opacity}
              />
              {/* Main Cross - Vertical */}
              <rect
                x={centerX - thickness/2}
                y={centerY - crosshairSize}
                width={thickness}
                height={crosshairSize - gap}
                fill={crosshair.color}
                opacity={crosshair.opacity}
              />
              <rect
                x={centerX - thickness/2}
                y={centerY + gap}
                width={thickness}
                height={crosshairSize - gap}
                fill={crosshair.color}
                opacity={crosshair.opacity}
              />
            </g>
          </svg>
        );
        
      case 'dot':
        const dotRadius = crosshair.size / 2;
        return (
          <svg width={size} height={size} className="overflow-visible">
            {crosshair.outline && (
              <circle
                cx={centerX}
                cy={centerY}
                r={dotRadius + outlineWidth}
                fill={crosshair.outlineColor}
                opacity={crosshair.opacity}
              />
            )}
            <circle
              cx={centerX}
              cy={centerY}
              r={dotRadius}
              fill={crosshair.color}
              opacity={crosshair.opacity}
            />
          </svg>
        );
        
      case 'circle':
        const circleRadius = crosshair.size / 2;
        return (
          <svg width={size} height={size} className="overflow-visible">
            {crosshair.outline && (
              <circle
                cx={centerX}
                cy={centerY}
                r={circleRadius + outlineWidth}
                fill="none"
                stroke={crosshair.outlineColor}
                strokeWidth={crosshair.thickness + 2*outlineWidth}
                opacity={crosshair.opacity}
              />
            )}
            <circle
              cx={centerX}
              cy={centerY}
              r={circleRadius}
              fill="none"
              stroke={crosshair.color}
              strokeWidth={crosshair.thickness}
              opacity={crosshair.opacity}
            />
          </svg>
        );
        
      case 'square':
        const squareSize = crosshair.size;
        return (
          <svg width={size} height={size} className="overflow-visible">
            {crosshair.outline && (
              <rect
                x={centerX - squareSize/2 - outlineWidth}
                y={centerY - squareSize/2 - outlineWidth}
                width={squareSize + 2*outlineWidth}
                height={squareSize + 2*outlineWidth}
                fill="none"
                stroke={crosshair.outlineColor}
                strokeWidth={crosshair.thickness + 2*outlineWidth}
                opacity={crosshair.opacity}
              />
            )}
            <rect
              x={centerX - squareSize/2}
              y={centerY - squareSize/2}
              width={squareSize}
              height={squareSize}
              fill="none"
              stroke={crosshair.color}
              strokeWidth={crosshair.thickness}
              opacity={crosshair.opacity}
            />
          </svg>
        );
        
      default:
        return null;
    }
  };

  return (
    <div 
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {renderCrosshair()}
    </div>
  );
};
