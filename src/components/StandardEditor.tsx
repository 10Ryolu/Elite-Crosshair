
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCrosshair } from '@/contexts/CrosshairContext';
import { useToast } from '@/hooks/use-toast';

export const StandardEditor: React.FC = () => {
  const { currentCrosshair, updateCrosshair, saveCrosshair } = useCrosshair();
  const { toast } = useToast();

  const handleSave = () => {
    const newCrosshair = {
      ...currentCrosshair,
      id: `custom-${Date.now()}`,
      name: `Custom ${currentCrosshair.type} ${Date.now()}`,
    };
    saveCrosshair(newCrosshair);
    toast({
      title: "Gespeichert!",
      description: `Crosshair "${newCrosshair.name}" wurde zur Bibliothek hinzugefügt.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-orbitron font-bold text-gaming-accent mb-2">
          Standard Crosshair Editor
        </h2>
        <p className="text-muted-foreground">
          Erstelle und bearbeite Crosshairs mit präzisen Parametern
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Crosshair Type */}
        <div className="space-y-2">
          <Label className="text-gaming-accent">Crosshair Typ</Label>
          <Select
            value={currentCrosshair.type}
            onValueChange={(value: any) => updateCrosshair({ type: value })}
          >
            <SelectTrigger className="bg-gaming-card border-gaming-accent/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gaming-card border-gaming-accent/20">
              <SelectItem value="cross">Kreuz</SelectItem>
              <SelectItem value="dot">Punkt</SelectItem>
              <SelectItem value="circle">Kreis</SelectItem>
              <SelectItem value="square">Quadrat</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Size */}
        <div className="space-y-2">
          <Label className="text-gaming-accent">
            Größe: {currentCrosshair.size}px
          </Label>
          <Slider
            value={[currentCrosshair.size]}
            onValueChange={([value]) => updateCrosshair({ size: value })}
            min={4}
            max={50}
            step={1}
            className="w-full"
          />
        </div>

        {/* Thickness */}
        <div className="space-y-2">
          <Label className="text-gaming-accent">
            Dicke: {currentCrosshair.thickness}px
          </Label>
          <Slider
            value={[currentCrosshair.thickness]}
            onValueChange={([value]) => updateCrosshair({ thickness: value })}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
        </div>

        {/* Gap */}
        <div className="space-y-2">
          <Label className="text-gaming-accent">
            Gap: {currentCrosshair.gap}px
          </Label>
          <Slider
            value={[currentCrosshair.gap]}
            onValueChange={([value]) => updateCrosshair({ gap: value })}
            min={0}
            max={20}
            step={1}
            className="w-full"
          />
        </div>

        {/* Color */}
        <div className="space-y-2">
          <Label className="text-gaming-accent">Farbe</Label>
          <div className="flex space-x-2">
            <Input
              type="color"
              value={currentCrosshair.color}
              onChange={(e) => updateCrosshair({ color: e.target.value })}
              className="w-16 h-10 p-1 bg-gaming-card border-gaming-accent/20"
            />
            <Input
              type="text"
              value={currentCrosshair.color}
              onChange={(e) => updateCrosshair({ color: e.target.value })}
              className="flex-1 bg-gaming-card border-gaming-accent/20"
              placeholder="#00ffff"
            />
          </div>
        </div>

        {/* Outline Color */}
        <div className="space-y-2">
          <Label className="text-gaming-accent">Outline Farbe</Label>
          <div className="flex space-x-2">
            <Input
              type="color"
              value={currentCrosshair.outlineColor}
              onChange={(e) => updateCrosshair({ outlineColor: e.target.value })}
              className="w-16 h-10 p-1 bg-gaming-card border-gaming-accent/20"
            />
            <Input
              type="text"
              value={currentCrosshair.outlineColor}
              onChange={(e) => updateCrosshair({ outlineColor: e.target.value })}
              className="flex-1 bg-gaming-card border-gaming-accent/20"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Outline Toggle */}
        <div className="flex items-center space-x-2">
          <Switch
            id="outline"
            checked={currentCrosshair.outline}
            onCheckedChange={(checked) => updateCrosshair({ outline: checked })}
          />
          <Label htmlFor="outline" className="text-gaming-accent cursor-pointer">
            Outline aktivieren
          </Label>
        </div>

        {/* Opacity */}
        <div className="space-y-2">
          <Label className="text-gaming-accent">
            Transparenz: {Math.round(currentCrosshair.opacity * 100)}%
          </Label>
          <Slider
            value={[currentCrosshair.opacity]}
            onValueChange={([value]) => updateCrosshair({ opacity: value })}
            min={0.1}
            max={1}
            step={0.1}
            className="w-full"
          />
        </div>
      </div>

      {/* Color Presets */}
      <div className="space-y-4">
        <Label className="text-gaming-accent">Farbvorlagen</Label>
        <div className="grid grid-cols-6 gap-2">
          {[
            '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
            '#ffffff', '#000000', '#ff6b35', '#8b5cf6', '#10b981', '#f59e0b'
          ].map((color) => (
            <button
              key={color}
              className="w-10 h-10 rounded border-2 border-gaming-accent/20 hover:border-gaming-accent transition-colors"
              style={{ backgroundColor: color }}
              onClick={() => updateCrosshair({ color })}
            />
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-gaming-accent text-gaming-bg hover:bg-gaming-accent/80"
        >
          In Bibliothek speichern
        </Button>
      </div>
    </div>
  );
};
