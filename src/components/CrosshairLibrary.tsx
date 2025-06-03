
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCrosshair } from '@/contexts/CrosshairContext';
import { CrosshairPreview } from './CrosshairPreview';
import { useToast } from '@/hooks/use-toast';
import { Eye, X, Search } from 'lucide-react';

export const CrosshairLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { savedCrosshairs, loadCrosshair, deleteCrosshair, currentCrosshair } = useCrosshair();
  const { toast } = useToast();

  const categories = [
    { value: 'all', label: 'Alle' },
    { value: 'valorant', label: 'Valorant' },
    { value: 'custom', label: 'Custom' },
    { value: 'pixel', label: 'Pixel Art' },
  ];

  const filteredCrosshairs = savedCrosshairs.filter(crosshair => {
    const matchesSearch = crosshair.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'valorant' && crosshair.valorantCode) ||
      (selectedCategory === 'custom' && crosshair.id.startsWith('custom-')) ||
      (selectedCategory === 'pixel' && crosshair.type === 'custom');
    
    return matchesSearch && matchesCategory;
  });

  const handleLoad = (crosshair: any) => {
    loadCrosshair(crosshair.id);
    toast({
      title: "Crosshair geladen!",
      description: `"${crosshair.name}" ist jetzt aktiv.`,
    });
  };

  const handleDelete = (crosshair: any) => {
    if (crosshair.id === 'default') {
      toast({
        title: "Fehler",
        description: "Das Standard-Crosshair kann nicht gelöscht werden.",
        variant: "destructive",
      });
      return;
    }

    deleteCrosshair(crosshair.id);
    toast({
      title: "Crosshair gelöscht",
      description: `"${crosshair.name}" wurde aus der Bibliothek entfernt.`,
    });
  };

  const exportCrosshair = (crosshair: any) => {
    const exportData = JSON.stringify(crosshair, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${crosshair.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export erfolgreich",
      description: `"${crosshair.name}" wurde als JSON-Datei heruntergeladen.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-orbitron font-bold text-gaming-accent mb-2">
          Crosshair Bibliothek
        </h2>
        <p className="text-muted-foreground">
          Verwalte deine gespeicherten Crosshairs und lade deine Favoriten
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gaming-accent w-4 h-4" />
          <Input
            placeholder="Crosshairs durchsuchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gaming-card border-gaming-accent/20 focus:border-gaming-accent"
          />
        </div>
        
        <div className="flex space-x-2">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
              className={
                selectedCategory === category.value
                  ? "bg-gaming-accent text-gaming-bg"
                  : "border-gaming-accent text-gaming-accent hover:bg-gaming-accent hover:text-gaming-bg"
              }
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Crosshair Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCrosshairs.map((crosshair) => (
          <Card key={crosshair.id} className="gaming-gradient border-gaming-accent/20 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gaming-accent truncate">
                {crosshair.name}
              </h3>
              <div className="flex space-x-1">
                {crosshair.valorantCode && (
                  <Badge variant="secondary" className="bg-valorant-red/20 text-valorant-red text-xs">
                    Valorant
                  </Badge>
                )}
                {crosshair.type === 'custom' && (
                  <Badge variant="secondary" className="bg-gaming-purple/20 text-gaming-purple text-xs">
                    Pixel
                  </Badge>
                )}
                {currentCrosshair.id === crosshair.id && (
                  <Badge className="bg-gaming-green/20 text-gaming-green text-xs">
                    Aktiv
                  </Badge>
                )}
              </div>
            </div>

            <div className="bg-gaming-bg/30 rounded-lg p-6 flex items-center justify-center mb-4 min-h-[120px]">
              <CrosshairPreview crosshair={crosshair} size={60} />
            </div>

            <div className="space-y-2 text-sm text-muted-foreground mb-4">
              <p><span className="text-gaming-accent">Typ:</span> {crosshair.type}</p>
              <p><span className="text-gaming-accent">Größe:</span> {crosshair.size}px</p>
              <p><span className="text-gaming-accent">Farbe:</span> {crosshair.color}</p>
            </div>

            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={() => handleLoad(crosshair)}
                disabled={currentCrosshair.id === crosshair.id}
                className="flex-1 bg-gaming-accent text-gaming-bg hover:bg-gaming-accent/80 disabled:opacity-50"
              >
                <Eye className="w-4 h-4 mr-1" />
                Laden
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => exportCrosshair(crosshair)}
                className="border-gaming-accent text-gaming-accent hover:bg-gaming-accent hover:text-gaming-bg"
              >
                Export
              </Button>
              
              {crosshair.id !== 'default' && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(crosshair)}
                  className="border-gaming-orange text-gaming-orange hover:bg-gaming-orange hover:text-gaming-bg"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredCrosshairs.length === 0 && (
        <Card className="gaming-gradient border-gaming-accent/20 p-8 text-center">
          <p className="text-muted-foreground mb-4">
            Keine Crosshairs gefunden.
          </p>
          <p className="text-sm text-muted-foreground">
            Erstelle neue Crosshairs im Standard- oder Pixel-Editor, oder importiere Valorant Codes.
          </p>
        </Card>
      )}

      {/* Library Stats */}
      <Card className="gaming-gradient border-gaming-accent/20 p-6">
        <h3 className="text-lg font-orbitron font-bold text-gaming-accent mb-4">
          Bibliothek Statistiken
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gaming-accent">{savedCrosshairs.length}</p>
            <p className="text-sm text-muted-foreground">Gesamt</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-valorant-red">
              {savedCrosshairs.filter(c => c.valorantCode).length}
            </p>
            <p className="text-sm text-muted-foreground">Valorant</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gaming-purple">
              {savedCrosshairs.filter(c => c.type === 'custom').length}
            </p>
            <p className="text-sm text-muted-foreground">Pixel Art</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gaming-green">
              {savedCrosshairs.filter(c => c.id.startsWith('custom-')).length}
            </p>
            <p className="text-sm text-muted-foreground">Custom</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
