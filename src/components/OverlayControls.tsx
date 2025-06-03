
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

interface OverlayControlsProps {
  overlayVisible: boolean;
  onToggleOverlay: () => void;
}

export const OverlayControls: React.FC<OverlayControlsProps> = ({
  overlayVisible,
  onToggleOverlay,
}) => {
  return (
    <Card className="gaming-gradient border-gaming-accent/20 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h3 className="text-xl font-orbitron font-bold text-gaming-accent">
            Overlay Steuerung
          </h3>
          <p className="text-muted-foreground text-sm">
            Aktiviere das Crosshair Overlay für Gaming
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="overlay-toggle"
              checked={overlayVisible}
              onCheckedChange={onToggleOverlay}
              className="data-[state=checked]:bg-gaming-accent"
            />
            <Label 
              htmlFor="overlay-toggle" 
              className="text-sm font-medium cursor-pointer"
            >
              Overlay {overlayVisible ? 'An' : 'Aus'}
            </Label>
          </div>
          
          <Button
            onClick={onToggleOverlay}
            variant={overlayVisible ? "default" : "outline"}
            className={
              overlayVisible 
                ? "bg-gaming-accent text-gaming-bg hover:bg-gaming-accent/80" 
                : "border-gaming-accent text-gaming-accent hover:bg-gaming-accent hover:text-gaming-bg"
            }
          >
            {overlayVisible ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {overlayVisible ? 'Deaktivieren' : 'Aktivieren'}
          </Button>
        </div>
      </div>
      
      {overlayVisible && (
        <div className="mt-4 p-4 bg-gaming-accent/10 rounded-lg border border-gaming-accent/20">
          <p className="text-sm text-gaming-accent">
            ✓ Overlay aktiv - Crosshair wird über allen Anwendungen angezeigt
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Drücke F6 um das Overlay schnell ein-/auszuschalten
          </p>
        </div>
      )}
    </Card>
  );
};
