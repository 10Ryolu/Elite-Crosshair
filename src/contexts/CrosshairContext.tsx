
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface PixelData {
  color: string;
  active: boolean;
}

export interface CrosshairConfig {
  id: string;
  name: string;
  type: 'cross' | 'dot' | 'circle' | 'square' | 'custom';
  size: number;
  thickness: number;
  color: string;
  outlineColor: string;
  gap: number;
  outline: boolean;
  opacity: number;
  customPixels?: number[][];
  customPixelData?: PixelData[][]; // Neue Struktur für mehrfarbige Pixel
  valorantCode?: string;
  // Zusätzliche Valorant-spezifische Properties
  dotSize?: number;
  dotAlpha?: number;
  innerLines?: {
    enabled: boolean;
    alpha: number;
    length: number;
    thickness: number;
    offset: number;
    visibility: number;
    spacing: number;
    gap: number;
  };
  outerLines?: {
    enabled: boolean;
    alpha: number;
    length: number;
    thickness: number;
    offset: number;
    visibility: number;
    spacing: number;
    gap: number;
  };
}

interface CrosshairContextType {
  currentCrosshair: CrosshairConfig;
  savedCrosshairs: CrosshairConfig[];
  updateCrosshair: (updates: Partial<CrosshairConfig>) => void;
  saveCrosshair: (crosshair: CrosshairConfig) => void;
  loadCrosshair: (id: string) => void;
  deleteCrosshair: (id: string) => void;
  importValorantCode: (code: string) => CrosshairConfig | null;
}

// Valorant Farbdefinitionen
const VALORANT_COLORS: { [key: number]: [number, number, number] } = {
  0: [0, 255, 0],      // Green
  1: [0, 255, 255],    // Cyan
  2: [255, 0, 0],      // Red
  3: [255, 0, 255],    // Pink
  4: [255, 255, 0],    // Yellow
  5: [255, 255, 255],  // White
  6: [0, 0, 255],      // Blue
  7: [255, 165, 0],    // Orange
};

const VALORANT_BASE_SCALE = 2.0;

const defaultCrosshair: CrosshairConfig = {
  id: 'default',
  name: 'Default',
  type: 'cross',
  size: 12,
  thickness: 2,
  color: '#00ffff',
  outlineColor: '#000000',
  gap: 2,
  outline: true,
  opacity: 1,
};

const CrosshairContext = createContext<CrosshairContextType | undefined>(undefined);

export const useCrosshair = () => {
  const context = useContext(CrosshairContext);
  if (!context) {
    throw new Error('useCrosshair must be used within a CrosshairProvider');
  }
  return context;
};

export const CrosshairProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCrosshair, setCurrentCrosshair] = useState<CrosshairConfig>(defaultCrosshair);
  const [savedCrosshairs, setSavedCrosshairs] = useState<CrosshairConfig[]>([]);

  // Load saved crosshairs from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('crosshair-library');
      if (saved) {
        const parsedCrosshairs = JSON.parse(saved);
        setSavedCrosshairs([defaultCrosshair, ...parsedCrosshairs]);
      } else {
        setSavedCrosshairs([
          defaultCrosshair,
          {
            id: 'valorant-classic',
            name: 'Valorant Classic',
            type: 'cross',
            size: 8,
            thickness: 1,
            color: '#ffffff',
            outlineColor: '#000000',
            gap: 1,
            outline: true,
            opacity: 1,
            valorantCode: '0;P;c;5;h;0;f;0;0l;4;0o;2;0a;1;0f;0;1b;0',
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to load crosshairs from localStorage:', error);
      setSavedCrosshairs([defaultCrosshair]);
    }
  }, []);

  // Save crosshairs to localStorage whenever they change
  useEffect(() => {
    try {
      const crosshairsToSave = savedCrosshairs.filter(c => c.id !== 'default');
      localStorage.setItem('crosshair-library', JSON.stringify(crosshairsToSave));
    } catch (error) {
      console.error('Failed to save crosshairs to localStorage:', error);
    }
  }, [savedCrosshairs]);

  const updateCrosshair = useCallback((updates: Partial<CrosshairConfig>) => {
    setCurrentCrosshair(prev => ({ ...prev, ...updates }));
  }, []);

  const saveCrosshair = useCallback((crosshair: CrosshairConfig) => {
    console.log('Saving crosshair:', crosshair);
    setSavedCrosshairs(prev => {
      const existing = prev.findIndex(c => c.id === crosshair.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = crosshair;
        console.log('Updated existing crosshair');
        return updated;
      }
      console.log('Added new crosshair');
      return [...prev, crosshair];
    });
  }, []);

  const loadCrosshair = useCallback((id: string) => {
    const crosshair = savedCrosshairs.find(c => c.id === id);
    if (crosshair) {
      setCurrentCrosshair(crosshair);
    }
  }, [savedCrosshairs]);

  const deleteCrosshair = useCallback((id: string) => {
    if (id === 'default') return; // Don't delete default crosshair
    setSavedCrosshairs(prev => prev.filter(c => c.id !== id));
  }, []);

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const importValorantCode = useCallback((code: string): CrosshairConfig | null => {
    try {
      console.log('Parsing Valorant code:', code);
      
      const cleanCode = code.trim();
      const parts = cleanCode.split(';');
      const params: { [key: string]: string } = {};
      
      // Parse Parameter-Paare
      for (let i = 0; i < parts.length; i += 2) {
        if (i + 1 < parts.length) {
          const key = parts[i];
          const value = parts[i + 1];
          params[key] = value;
          console.log(`Parsed param: ${key} = ${value}`);
        }
      }

      console.log('All parsed parameters:', params);

      // Parse alle Parameter mit Defaults
      const parsedParams = {
        // Basis Parameter
        c: parseInt(params['c'] || '5'),
        u: params['u'] || 'FFFFFF',
        h: parseInt(params['h'] || '1'),
        t: parseInt(params['t'] || '0'),
        d: parseInt(params['d'] || '0'),
        b: parseInt(params['b'] || '0'),
        o: parseFloat(params['o'] || '1.0'),
        m: parseInt(params['m'] || '0'),
        
        // Dot Parameter
        da: parseFloat(params['a'] || '1.0'),
        ds: parseInt(params['z'] || '2'),
        
        // Inner lines
        ib: parseInt(params['0b'] || '1'),
        ia: parseFloat(params['0a'] || '1.0'),
        il: parseInt(params['0l'] || '6'),
        it: parseInt(params['0t'] || '2'),
        io: parseInt(params['0o'] || '3'),
        iv: parseInt(params['0v'] || '1'),
        is: parseInt(params['0s'] || '1'),
        ig: parseInt(params['0g'] || '0'),
        im: parseInt(params['0m'] || '0'),
        if: parseInt(params['0f'] || '0'),
        ie: parseInt(params['0e'] || '0'),
        
        // Outer lines
        ob: parseInt(params['1b'] || '0'),
        oa: parseFloat(params['1a'] || '0.5'),
        ol: parseInt(params['1l'] || '2'),
        ot: parseInt(params['1t'] || '2'),
        oo: parseInt(params['1o'] || '4'),
        ov: parseInt(params['1v'] || '1'),
        os: parseInt(params['1s'] || '1'),
        og: parseInt(params['1g'] || '0'),
        om: parseInt(params['1m'] || '0'),
        of: parseInt(params['1f'] || '0'),
        oe: parseInt(params['1e'] || '0'),
      };

      console.log('Processed parameters:', parsedParams);

      // Bestimme Farbe
      let crosshairColor = '#ffffff';
      if (parsedParams.c === 8) {
        crosshairColor = '#' + parsedParams.u;
      } else if (VALORANT_COLORS[parsedParams.c]) {
        const [r, g, b] = VALORANT_COLORS[parsedParams.c];
        crosshairColor = rgbToHex(r, g, b);
      }

      // Für komplexe Crosshairs immer 'custom' verwenden
      const crosshairType: 'cross' | 'dot' | 'circle' | 'square' | 'custom' = 'custom';

      // Berechne Größe basierend auf größten Elementen
      let size = 20; // Größere Basis für komplexe Crosshairs
      if (parsedParams.ob === 1) {
        size = Math.max(parsedParams.ol * VALORANT_BASE_SCALE * 2, size);
      }
      if (parsedParams.ib === 1) {
        size = Math.max(parsedParams.il * VALORANT_BASE_SCALE, size);
      }

      const newCrosshair: CrosshairConfig = {
        id: `valorant-${Date.now()}`,
        name: `Valorant Import ${new Date().toLocaleTimeString()}`,
        type: crosshairType,
        size: size,
        thickness: Math.max(parsedParams.it, parsedParams.ot, 1),
        color: crosshairColor,
        outlineColor: parsedParams.h === 1 ? '#000000' : crosshairColor,
        gap: Math.max(parsedParams.ig, parsedParams.og, parsedParams.io),
        outline: parsedParams.h === 1 || parsedParams.b === 1,
        opacity: parsedParams.o,
        valorantCode: code,
        dotSize: parsedParams.ds,
        dotAlpha: parsedParams.da,
        innerLines: {
          enabled: parsedParams.ib === 1,
          alpha: parsedParams.ia,
          length: parsedParams.il,
          thickness: parsedParams.it,
          offset: parsedParams.io,
          visibility: parsedParams.iv,
          spacing: parsedParams.is,
          gap: parsedParams.ig,
        },
        outerLines: {
          enabled: parsedParams.ob === 1,
          alpha: parsedParams.oa,
          length: parsedParams.ol,
          thickness: parsedParams.ot,
          offset: parsedParams.oo,
          visibility: parsedParams.ov,
          spacing: parsedParams.os,
          gap: parsedParams.og,
        },
      };

      console.log('Created crosshair:', newCrosshair);
      return newCrosshair;
    } catch (error) {
      console.error('Failed to parse Valorant code:', error);
      return null;
    }
  }, []);

  return (
    <CrosshairContext.Provider
      value={{
        currentCrosshair,
        savedCrosshairs,
        updateCrosshair,
        saveCrosshair,
        loadCrosshair,
        deleteCrosshair,
        importValorantCode,
      }}
    >
      {children}
    </CrosshairContext.Provider>
  );
};
