import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCrosshair } from '@/contexts/CrosshairContext';
import { useToast } from '@/hooks/use-toast';
import type { PixelData } from '@/contexts/CrosshairContext';

type SymmetryMode = 'none' | 'horizontal' | 'vertical' | 'both' | 'diagonal' | 'all';

export const PixelEditor: React.FC = () => {
  const [gridSize, setGridSize] = useState(32);
  const [currentColor, setCurrentColor] = useState('#00ffff');
  const [symmetryMode, setSymmetryMode] = useState<SymmetryMode>('none');
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [pixelData, setPixelData] = useState<PixelData[][]>(() => 
    Array(gridSize).fill(null).map(() => Array(gridSize).fill({ color: '#00ffff', active: false }))
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [isRightClick, setIsRightClick] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { updateCrosshair, saveCrosshair } = useCrosshair();
  const { toast } = useToast();

  // Konstante Canvas-Größe, variable Pixel-Größe
  const canvasSize = 400; // Feste Canvas-Größe
  const pixelSize = canvasSize / gridSize; // Variable Pixel-Größe

  // Initialize grid when size changes - OHNE FARBE ZU ÜBERSCHREIBEN
  useEffect(() => {
    setPixelData(prevData => {
      // Wenn es schon Daten gibt, versuche sie zu erhalten
      if (prevData && prevData.length > 0) {
        const newData = Array(gridSize).fill(null).map(() => 
          Array(gridSize).fill({ color: currentColor, active: false })
        );
        
        // Kopiere existierende Daten soweit möglich
        for (let y = 0; y < Math.min(gridSize, prevData.length); y++) {
          for (let x = 0; x < Math.min(gridSize, prevData[y].length); x++) {
            if (prevData[y] && prevData[y][x]) {
              newData[y][x] = { ...prevData[y][x] };
            }
          }
        }
        return newData;
      } else {
        // Neue Daten erstellen
        return Array(gridSize).fill(null).map(() => 
          Array(gridSize).fill({ color: currentColor, active: false })
        );
      }
    });
  }, [gridSize]); // currentColor entfernt!

  const drawGrid = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Draw pixels
    pixelData.forEach((row, y) => {
      row.forEach((pixel, x) => {
        if (pixel.active) {
          ctx.fillStyle = pixel.color;
          ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
      });
    });

    // Draw grid lines - KORRIGIERT FÜR ALLE LINIEN
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    
    // Vertikale Linien
    for (let i = 0; i <= gridSize; i++) {
      const x = i * pixelSize;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasSize);
      ctx.stroke();
    }
    
    // Horizontale Linien
    for (let i = 0; i <= gridSize; i++) {
      const y = i * pixelSize;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasSize, y);
      ctx.stroke();
    }

    // Draw center lines
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    const centerLine = canvasSize / 2;
    
    // Vertical center line
    ctx.beginPath();
    ctx.moveTo(centerLine, 0);
    ctx.lineTo(centerLine, canvasSize);
    ctx.stroke();
    
    // Horizontal center line
    ctx.beginPath();
    ctx.moveTo(0, centerLine);
    ctx.lineTo(canvasSize, centerLine);
    ctx.stroke();

    // Draw diagonal lines for diagonal symmetry
    if (symmetryMode === 'diagonal' || symmetryMode === 'all') {
      ctx.strokeStyle = '#ff6b35';
      ctx.lineWidth = 1;
      
      // Main diagonal
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(canvasSize, canvasSize);
      ctx.stroke();
      
      // Anti-diagonal
      ctx.beginPath();
      ctx.moveTo(canvasSize, 0);
      ctx.lineTo(0, canvasSize);
      ctx.stroke();
    }
  }, [pixelData, gridSize, canvasSize, pixelSize, symmetryMode]);

  useEffect(() => {
    drawGrid();
  }, [drawGrid]);

  const applyPixelChange = useCallback((x: number, y: number, isErasing: boolean = false) => {
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return;

    setPixelData(prevPixelData => {
      const newPixelData = prevPixelData.map(row => row.map(pixel => ({ ...pixel })));
      
      // Original position
      if (isErasing) {
        newPixelData[y][x] = { color: currentColor, active: false };
      } else {
        newPixelData[y][x] = { color: currentColor, active: true };
      }
      
      // Apply symmetry
      if (symmetryMode !== 'none') {
        const center = (gridSize - 1) / 2;
        
        // Horizontal symmetry
        if (symmetryMode === 'horizontal' || symmetryMode === 'both' || symmetryMode === 'all') {
          const mirrorX = Math.round(2 * center - x);
          if (mirrorX >= 0 && mirrorX < gridSize && mirrorX !== x) {
            if (isErasing) {
              newPixelData[y][mirrorX] = { color: currentColor, active: false };
            } else {
              newPixelData[y][mirrorX] = { color: currentColor, active: true };
            }
          }
        }
        
        // Vertical symmetry
        if (symmetryMode === 'vertical' || symmetryMode === 'both' || symmetryMode === 'all') {
          const mirrorY = Math.round(2 * center - y);
          if (mirrorY >= 0 && mirrorY < gridSize && mirrorY !== y) {
            if (isErasing) {
              newPixelData[mirrorY][x] = { color: currentColor, active: false };
            } else {
              newPixelData[mirrorY][x] = { color: currentColor, active: true };
            }
          }
        }
        
        // Both horizontal and vertical symmetry
        if (symmetryMode === 'both' || symmetryMode === 'all') {
          const mirrorX = Math.round(2 * center - x);
          const mirrorY = Math.round(2 * center - y);
          if (mirrorX >= 0 && mirrorX < gridSize && mirrorY >= 0 && mirrorY < gridSize && 
              (mirrorX !== x || mirrorY !== y)) {
            if (isErasing) {
              newPixelData[mirrorY][mirrorX] = { color: currentColor, active: false };
            } else {
              newPixelData[mirrorY][mirrorX] = { color: currentColor, active: true };
            }
          }
        }
        
        // Diagonal symmetry
        if (symmetryMode === 'diagonal' || symmetryMode === 'all') {
          if (y !== x && y < gridSize && x < gridSize) {
            if (isErasing) {
              newPixelData[x][y] = { color: currentColor, active: false };
            } else {
              newPixelData[x][y] = { color: currentColor, active: true };
            }
          }
          
          const antiX = gridSize - 1 - y;
          const antiY = gridSize - 1 - x;
          if (antiX >= 0 && antiX < gridSize && antiY >= 0 && antiY < gridSize && 
              (antiX !== x || antiY !== y)) {
            if (isErasing) {
              newPixelData[antiY][antiX] = { color: currentColor, active: false };
            } else {
              newPixelData[antiY][antiX] = { color: currentColor, active: true };
            }
          }
        }
        
        // All symmetries (8-way)
        if (symmetryMode === 'all') {
          const mirrorX = Math.round(2 * center - x);
          const mirrorY = Math.round(2 * center - y);
          
          // Additional symmetric points
          if (mirrorY >= 0 && mirrorY < gridSize && x >= 0 && x < gridSize && mirrorY !== x) {
            if (isErasing) {
              newPixelData[x][mirrorY] = { color: currentColor, active: false };
            } else {
              newPixelData[x][mirrorY] = { color: currentColor, active: true };
            }
          }
          if (mirrorX >= 0 && mirrorX < gridSize && y >= 0 && y < gridSize && mirrorX !== y) {
            if (isErasing) {
              newPixelData[mirrorX][y] = { color: currentColor, active: false };
            } else {
              newPixelData[mirrorX][y] = { color: currentColor, active: true };
            }
          }
          if (mirrorX >= 0 && mirrorX < gridSize && mirrorY >= 0 && mirrorY < gridSize && 
              mirrorX !== mirrorY) {
            if (isErasing) {
              newPixelData[mirrorY][mirrorX] = { color: currentColor, active: false };
            } else {
              newPixelData[mirrorY][mirrorX] = { color: currentColor, active: true };
            }
          }
          
          const antiMirrorX = gridSize - 1 - mirrorY;
          const antiMirrorY = gridSize - 1 - mirrorX;
          if (antiMirrorX >= 0 && antiMirrorX < gridSize && antiMirrorY >= 0 && antiMirrorY < gridSize &&
              (antiMirrorX !== x || antiMirrorY !== y)) {
            if (isErasing) {
              newPixelData[antiMirrorY][antiMirrorX] = { color: currentColor, active: false };
            } else {
              newPixelData[antiMirrorY][antiMirrorX] = { color: currentColor, active: true };
            }
          }
        }
      }
      
      return newPixelData;
    });
  }, [gridSize, symmetryMode, currentColor]);

  const getPixelCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / pixelSize);
    const y = Math.floor((e.clientY - rect.top) / pixelSize);
    
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const coords = getPixelCoordinates(e);
    if (!coords) return;

    const isRightButton = e.button === 2;
    setIsDrawing(true);
    setIsRightClick(isRightButton);
    
    const shouldErase = isRightButton || tool === 'eraser';
    applyPixelChange(coords.x, coords.y, shouldErase);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const coords = getPixelCoordinates(e);
    if (!coords) return;

    const shouldErase = isRightClick || tool === 'eraser';
    applyPixelChange(coords.x, coords.y, shouldErase);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setIsRightClick(false);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent right-click context menu
  };

  const clearCanvas = () => {
    setPixelData(Array(gridSize).fill(null).map(() => 
      Array(gridSize).fill({ color: currentColor, active: false })
    ));
  };

  const savePixelCrosshair = () => {
    console.log('Saving pixel crosshair with data:', pixelData);
    
    const newCrosshair = {
      id: `pixel-${Date.now()}`,
      name: `Pixel Crosshair ${new Date().toLocaleTimeString()}`,
      type: 'custom' as const,
      size: gridSize,
      thickness: 1,
      color: currentColor,
      outlineColor: '#000000',
      gap: 0,
      outline: false,
      opacity: 1,
      customPixelData: pixelData, // Neue Struktur für mehrfarbige Pixel
    };

    console.log('Crosshair to save:', newCrosshair);
    saveCrosshair(newCrosshair);
    updateCrosshair(newCrosshair);
    
    toast({
      title: "Pixel Crosshair gespeichert!",
      description: `"${newCrosshair.name}" wurde zur Bibliothek hinzugefügt und aktiviert.`,
    });
  };

  const symmetryOptions = [
    { value: 'none', label: 'Keine Symmetrie' },
    { value: 'horizontal', label: 'Horizontal (Links/Rechts)' },
    { value: 'vertical', label: 'Vertikal (Oben/Unten)' },
    { value: 'both', label: '4-Wege (Kreuz)' },
    { value: 'diagonal', label: 'Diagonal' },
    { value: 'all', label: '8-Wege (Alle)' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-orbitron font-bold text-gaming-accent mb-2">
          Pixel Canvas Editor
        </h2>
        <p className="text-muted-foreground">
          Erstelle pixel-perfekte Custom Crosshairs im Raster-Editor
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-center">
            <div className="border-2 border-gaming-accent/20 rounded-lg p-4 bg-gaming-card/20">
              <canvas
                ref={canvasRef}
                width={canvasSize}
                height={canvasSize}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onContextMenu={handleContextMenu}
                className="crosshair-canvas cursor-crosshair border border-gaming-accent/10"
                style={{ 
                  imageRendering: 'pixelated',
                  userSelect: 'none'
                }}
              />
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button
              onClick={clearCanvas}
              variant="outline"
              className="border-gaming-orange text-gaming-orange hover:bg-gaming-orange hover:text-gaming-bg"
            >
              Löschen
            </Button>
            <Button
              onClick={savePixelCrosshair}
              className="bg-gaming-accent text-gaming-bg hover:bg-gaming-accent/80"
            >
              Speichern & Aktivieren
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Grid Size */}
          <div className="space-y-2">
            <Label className="text-gaming-accent">Grid Größe</Label>
            <select
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              className="w-full bg-gaming-card border border-gaming-accent/20 rounded px-3 py-2 text-white"
            >
              <option value={16}>16x16</option>
              <option value={24}>24x24</option>
              <option value={32}>32x32</option>
              <option value={48}>48x48</option>
              <option value={64}>64x64</option>
            </select>
          </div>

          {/* Symmetry Mode */}
          <div className="space-y-2">
            <Label className="text-gaming-accent">Symmetrie Modus</Label>
            <Select value={symmetryMode} onValueChange={(value: SymmetryMode) => setSymmetryMode(value)}>
              <SelectTrigger className="bg-gaming-card border-gaming-accent/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gaming-card border-gaming-accent/20">
                {symmetryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tools */}
          <div className="space-y-2">
            <Label className="text-gaming-accent">Werkzeug</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={tool === 'brush' ? 'default' : 'outline'}
                onClick={() => setTool('brush')}
                className={tool === 'brush' 
                  ? "bg-gaming-accent text-gaming-bg" 
                  : "border-gaming-accent text-gaming-accent hover:bg-gaming-accent hover:text-gaming-bg"
                }
              >
                Pinsel
              </Button>
              <Button
                variant={tool === 'eraser' ? 'default' : 'outline'}
                onClick={() => setTool('eraser')}
                className={tool === 'eraser' 
                  ? "bg-gaming-orange text-gaming-bg" 
                  : "border-gaming-orange text-gaming-orange hover:bg-gaming-orange hover:text-gaming-bg"
                }
              >
                Radierer
              </Button>
            </div>
          </div>

          {/* Color */}
          <div className="space-y-2">
            <Label className="text-gaming-accent">Farbe</Label>
            <div className="flex space-x-2">
              <Input
                type="color"
                value={currentColor}
                onChange={(e) => setCurrentColor(e.target.value)}
                className="w-16 h-10 p-1 bg-gaming-card border-gaming-accent/20"
              />
              <Input
                type="text"
                value={currentColor}
                onChange={(e) => setCurrentColor(e.target.value)}
                className="flex-1 bg-gaming-card border-gaming-accent/20"
              />
            </div>
          </div>

          {/* Color Presets */}
          <div className="space-y-2">
            <Label className="text-gaming-accent">Schnellfarben</Label>
            <div className="grid grid-cols-4 gap-2">
              {[
                '#00ffff', '#ff0000', '#00ff00', '#ffff00',
                '#ff00ff', '#ffffff', '#ff6b35', '#8b5cf6'
              ].map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded border-2 border-gaming-accent/20 hover:border-gaming-accent transition-colors"
                  style={{ backgroundColor: color }}
                  onClick={() => setCurrentColor(color)}
                />
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="p-4 bg-gaming-accent/10 rounded-lg border border-gaming-accent/20">
            <p className="text-sm text-gaming-accent font-semibold mb-2">Tipps:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Linke Maustaste: Zeichnen</li>
              <li>• Rechte Maustaste: Löschen</li>
              <li>• Maus gedrückt halten zum schnellen Zeichnen</li>
              <li>• Cyan Linien zeigen Symmetrie-Achsen</li>
              <li>• Orange Linien zeigen Diagonal-Symmetrie</li>
              <li>• Symmetrie spiegelt an den Zentrumslinien</li>
              <li>• Farben bleiben beim Farbwechsel erhalten</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
