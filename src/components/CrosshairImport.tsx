
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useCrosshair } from '@/contexts/CrosshairContext';
import { CrosshairPreview } from './CrosshairPreview';
import { useToast } from '@/hooks/use-toast';

export const CrosshairImport: React.FC = () => {
  const [valorantCode, setValorantCode] = useState('');
  const [crosshairName, setCrosshairName] = useState('');
  const [previewCrosshair, setPreviewCrosshair] = useState<any>(null);
  const { importValorantCode, saveCrosshair, updateCrosshair } = useCrosshair();
  const { toast } = useToast();

  const handlePreview = () => {
    if (!valorantCode.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte gib einen Valorant Crosshair Code ein.",
        variant: "destructive",
      });
      return;
    }

    console.log('Attempting to parse code:', valorantCode);
    const imported = importValorantCode(valorantCode);
    
    if (imported) {
      setPreviewCrosshair(imported);
      setCrosshairName(imported.name);
      toast({
        title: "Erfolg",
        description: "Valorant Crosshair Code erfolgreich geparst!",
      });
      console.log('Successfully imported crosshair:', imported);
    } else {
      toast({
        title: "Fehler",
        description: "Ungültiger Valorant Crosshair Code. Überprüfe das Format (z.B. 0;P;c;5;h;0;f;0;0l;4;0o;2;0a;1;0f;0;1b;0).",
        variant: "destructive",
      });
      console.error('Failed to parse Valorant code');
    }
  };

  const handleImport = () => {
    if (!previewCrosshair) {
      toast({
        title: "Fehler",
        description: "Erstelle zuerst eine Vorschau des Crosshairs.",
        variant: "destructive",
      });
      return;
    }

    const finalCrosshair = {
      ...previewCrosshair,
      name: crosshairName || previewCrosshair.name,
    };

    saveCrosshair(finalCrosshair);
    updateCrosshair(finalCrosshair);
    
    toast({
      title: "Erfolgreich importiert!",
      description: `Crosshair "${finalCrosshair.name}" wurde gespeichert und aktiviert.`,
    });

    // Reset form
    setValorantCode('');
    setCrosshairName('');
    setPreviewCrosshair(null);
  };

  // Erweiterte Beispiel-Codes basierend auf echten Valorant Crosshairs
  const exampleCodes = [
    {
      name: "TenZ Crosshair (Original)",
      code: "0;P;c;5;h;0;f;0;0l;4;0o;2;0a;1;0f;0;1b;0"
    },
    {
      name: "Shroud Style", 
      code: "0;P;c;1;s;1;P;c;5;h;0;f;0;0l;2;0o;0;0a;1;0f;0;1b;0"
    },
    {
      name: "ScreaM Classic",
      code: "0;P;c;4;h;0;f;0;0l;5;0o;0;0a;1;0f;0;1b;0"
    },
    {
      name: "Dot Crosshair",
      code: "0;P;h;0;f;0;0l;0;0o;0;0a;1;0f;0;1b;0;d;1;z;3;a;1"
    },
    {
      name: "Small Cross",
      code: "0;P;c;1;h;0;f;0;0l;2;0o;1;0a;1;0f;0;1b;0"
    },
    {
      name: "Pro Player Style",
      code: "0;P;c;5;h;0;0t;4;0l;8;0o;1;0a;1;0f;0;1t;3;1l;2;1o;5;1a;0.7;1m;0;1f;0"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-orbitron font-bold text-gaming-accent mb-2">
          Valorant Crosshair Import
        </h2>
        <p className="text-muted-foreground">
          Importiere Crosshairs direkt aus Valorant mit dem Crosshair Code
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="valorant-code" className="text-gaming-accent">
              Valorant Crosshair Code
            </Label>
            <Textarea
              id="valorant-code"
              placeholder="0;P;c;5;h;0;f;0;0l;4;0o;2;0a;1;0f;0;1b;0"
              value={valorantCode}
              onChange={(e) => setValorantCode(e.target.value)}
              className="bg-gaming-card border-gaming-accent/20 focus:border-gaming-accent font-mono text-sm"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Format: Parameter getrennt durch Semikolons (;)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="crosshair-name" className="text-gaming-accent">
              Crosshair Name (optional)
            </Label>
            <Input
              id="crosshair-name"
              placeholder="Mein Valorant Crosshair"
              value={crosshairName}
              onChange={(e) => setCrosshairName(e.target.value)}
              className="bg-gaming-card border-gaming-accent/20 focus:border-gaming-accent"
            />
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={handlePreview}
              variant="outline"
              className="flex-1 border-gaming-accent text-gaming-accent hover:bg-gaming-accent hover:text-gaming-bg"
            >
              Vorschau
            </Button>
            <Button
              onClick={handleImport}
              disabled={!previewCrosshair}
              className="flex-1 bg-gaming-accent text-gaming-bg hover:bg-gaming-accent/80 disabled:opacity-50"
            >
              Importieren
            </Button>
          </div>
        </div>

        {/* Preview Section */}
        <div className="space-y-4">
          <Card className="bg-gaming-card/50 border-gaming-accent/20 p-6">
            <h3 className="text-lg font-orbitron font-bold text-gaming-accent mb-4">
              Vorschau
            </h3>
            <div className="bg-gaming-bg/50 rounded-lg p-8 flex items-center justify-center min-h-[150px]">
              {previewCrosshair ? (
                <CrosshairPreview crosshair={previewCrosshair} size={80} />
              ) : (
                <p className="text-muted-foreground text-sm">
                  Keine Vorschau verfügbar
                </p>
              )}
            </div>
            {previewCrosshair && (
              <div className="mt-4 space-y-1 text-sm">
                <p><span className="text-gaming-accent">Name:</span> {previewCrosshair.name}</p>
                <p><span className="text-gaming-accent">Typ:</span> {previewCrosshair.type}</p>
                <p><span className="text-gaming-accent">Größe:</span> {previewCrosshair.size}</p>
                <p><span className="text-gaming-accent">Farbe:</span> {previewCrosshair.color}</p>
                {previewCrosshair.innerLines && (
                  <p><span className="text-gaming-accent">Innere Linien:</span> {previewCrosshair.innerLines.enabled ? 'An' : 'Aus'}</p>
                )}
                {previewCrosshair.outerLines && (
                  <p><span className="text-gaming-accent">Äußere Linien:</span> {previewCrosshair.outerLines.enabled ? 'An' : 'Aus'}</p>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Example Codes */}
      <Card className="bg-gaming-card/30 border-gaming-accent/20 p-6">
        <h3 className="text-lg font-orbitron font-bold text-gaming-accent mb-4">
          Beispiel Crosshair Codes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exampleCodes.map((example, index) => (
            <div
              key={index}
              className="p-4 bg-gaming-bg/30 rounded-lg border border-gaming-accent/10 hover:border-gaming-accent/30 transition-colors cursor-pointer"
              onClick={() => setValorantCode(example.code)}
            >
              <h4 className="font-semibold text-gaming-accent mb-2">{example.name}</h4>
              <code className="text-xs text-muted-foreground font-mono break-all">
                {example.code}
              </code>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Klicke auf einen Code um ihn zu verwenden. Öffne die Browser-Konsole (F12) für Debug-Informationen.
        </p>
      </Card>

      {/* Hilfe-Sektion */}
      <Card className="bg-gaming-card/30 border-gaming-accent/20 p-6">
        <h3 className="text-lg font-orbitron font-bold text-gaming-accent mb-4">
          Wie finde ich meinen Valorant Crosshair Code?
        </h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>1. Starte Valorant und gehe zu den Einstellungen</p>
          <p>2. Wähle "Crosshair" im Menü</p>
          <p>3. Scrolle nach unten und finde "Import Profile Code"</p>
          <p>4. Kopiere den angezeigten Code und füge ihn hier ein</p>
        </div>
      </Card>
    </div>
  );
};
