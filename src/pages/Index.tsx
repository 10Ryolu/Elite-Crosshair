
import { useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CrosshairImport } from '@/components/CrosshairImport';
import { StandardEditor } from '@/components/StandardEditor';
import { PixelEditor } from '@/components/PixelEditor';
import { CrosshairLibrary } from '@/components/CrosshairLibrary';
import { OverlayControls } from '@/components/OverlayControls';
import { CrosshairPreview } from '@/components/CrosshairPreview';
import { CrosshairProvider, useCrosshair } from '@/contexts/CrosshairContext';
import { Eye, EyeOff } from 'lucide-react';

const MainApp = () => {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);
  const { currentCrosshair } = useCrosshair();

  const toggleOverlay = useCallback(() => {
    setOverlayVisible(prev => !prev);
  }, []);

  const toggleUI = useCallback(() => {
    setUiVisible(prev => !prev);
  }, []);

  // Simulate global hotkeys (F6 for overlay, F9 for UI)
  useState(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F6') {
        e.preventDefault();
        toggleOverlay();
      } else if (e.key === 'F9') {
        e.preventDefault();
        toggleUI();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="min-h-screen bg-gaming-bg relative">
      {/* Overlay */}
      {overlayVisible && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="pointer-events-none">
            <CrosshairPreview 
              crosshair={currentCrosshair} 
              size={64}
              className="scale-150"
            />
          </div>
        </div>
      )}

      {/* UI Toggle Button (always visible) */}
      <div className="fixed top-4 right-4 z-40">
        <Button
          onClick={toggleUI}
          variant="outline"
          size="sm"
          className="bg-gaming-card border-gaming-accent text-gaming-accent hover:bg-gaming-accent hover:text-gaming-bg"
        >
          {uiVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
      </div>

      {/* Main UI */}
      {uiVisible && (
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-orbitron font-bold bg-gradient-to-r from-gaming-accent to-gaming-orange bg-clip-text text-transparent neon-text">
              CROSSHAIR OVERLAY PRO
            </h1>
            <p className="text-muted-foreground text-lg">
              Professional Crosshair Overlay für Gaming • F6: Overlay • F9: UI Toggle
            </p>
          </div>

          {/* Overlay Controls */}
          <OverlayControls 
            overlayVisible={overlayVisible}
            onToggleOverlay={toggleOverlay}
          />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Editor Tabs */}
            <div className="lg:col-span-2">
              <Card className="gaming-gradient border-gaming-accent/20">
                <Tabs defaultValue="import" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-gaming-card/50">
                    <TabsTrigger 
                      value="import" 
                      className="data-[state=active]:bg-gaming-accent data-[state=active]:text-gaming-bg"
                    >
                      Valorant Import
                    </TabsTrigger>
                    <TabsTrigger 
                      value="standard"
                      className="data-[state=active]:bg-gaming-accent data-[state=active]:text-gaming-bg"
                    >
                      Standard Editor
                    </TabsTrigger>
                    <TabsTrigger 
                      value="pixel"
                      className="data-[state=active]:bg-gaming-accent data-[state=active]:text-gaming-bg"
                    >
                      Pixel Editor
                    </TabsTrigger>
                    <TabsTrigger 
                      value="library"
                      className="data-[state=active]:bg-gaming-accent data-[state=active]:text-gaming-bg"
                    >
                      Bibliothek
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="import" className="p-6">
                    <CrosshairImport />
                  </TabsContent>
                  
                  <TabsContent value="standard" className="p-6">
                    <StandardEditor />
                  </TabsContent>
                  
                  <TabsContent value="pixel" className="p-6">
                    <PixelEditor />
                  </TabsContent>
                  
                  <TabsContent value="library" className="p-6">
                    <CrosshairLibrary />
                  </TabsContent>
                </Tabs>
              </Card>
            </div>

            {/* Live Preview Panel */}
            <div className="space-y-6">
              <Card className="gaming-gradient border-gaming-accent/20 p-6">
                <h3 className="text-xl font-orbitron font-bold mb-4 text-gaming-accent">
                  Live Vorschau
                </h3>
                <div className="bg-gaming-bg/50 rounded-lg p-8 flex items-center justify-center min-h-[200px] border border-gaming-accent/20">
                  <CrosshairPreview crosshair={currentCrosshair} size={64} />
                </div>
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <p><span className="text-gaming-accent">Typ:</span> {currentCrosshair.type}</p>
                  <p><span className="text-gaming-accent">Größe:</span> {currentCrosshair.size}</p>
                  <p><span className="text-gaming-accent">Farbe:</span> {currentCrosshair.color}</p>
                </div>
              </Card>

              {/* Hotkey Info */}
              <Card className="gaming-gradient border-gaming-accent/20 p-6">
                <h3 className="text-lg font-orbitron font-bold mb-4 text-gaming-accent">
                  Hotkeys
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Overlay Toggle:</span>
                    <kbd className="px-2 py-1 bg-gaming-card border border-gaming-accent/20 rounded text-gaming-accent">
                      F6
                    </kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>UI Toggle:</span>
                    <kbd className="px-2 py-1 bg-gaming-card border border-gaming-accent/20 rounded text-gaming-accent">
                      F9
                    </kbd>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Index = () => {
  return (
    <CrosshairProvider>
      <MainApp />
    </CrosshairProvider>
  );
};

export default Index;
