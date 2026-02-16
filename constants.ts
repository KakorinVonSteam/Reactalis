import { TerrainType } from './types';

export const MAP_WIDTH = 2000;
export const MAP_HEIGHT = 1000; // Adjusted for 2:1 Aspect Ratio standard for world maps
export const NUM_PROVINCES = 800; // Increased density for better definition

export const CULTURES = ["Francien", "Castilian", "English", "Turkish", "Persian", "Austrian", "Muscovite", "Ming", "Japanese", "Highland", "Bedouin", "Thai"];
export const RELIGIONS = ["Catholic", "Orthodox", "Sunni", "Shia", "Confucian", "Shinto", "Tengri", "Protestant", "Hindu", "Theravada"];
export const SEA_NAMES = ["Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Mediterranean Sea", "Baltic Sea", "Caribbean Sea", "South China Sea", "Arctic Ocean"];

export const TERRAIN_COLORS: Record<TerrainType, string> = {
  [TerrainType.Plains]: "#86efac",
  [TerrainType.Forest]: "#166534",
  [TerrainType.Hills]: "#fde047",
  [TerrainType.Mountains]: "#78716c",
  [TerrainType.Desert]: "#fdba74",
  [TerrainType.Coastline]: "#60a5fa",
  [TerrainType.Ocean]: "#3b82f6",
};

// Simplified polygons roughly representing continents [x, y]
// Scale: 0-2000 (Width), 0-1000 (Height)
export const WORLD_SHAPES: Record<string, [number, number][]> = {
  NorthAmerica: [
    [100, 100], [450, 50], [600, 100], [550, 300], [350, 400], [250, 300], [100, 250]
  ],
  SouthAmerica: [
    [400, 450], [600, 480], [650, 600], [550, 850], [450, 800], [380, 550]
  ],
  Europe: [
    [850, 150], [1000, 100], [1100, 150], [1100, 300], [950, 320], [850, 280]
  ],
  Africa: [
    [850, 350], [1150, 350], [1250, 500], [1100, 800], [950, 800], [800, 500]
  ],
  Asia: [
    [1150, 100], [1600, 100], [1800, 200], [1700, 500], [1400, 600], [1250, 450], [1150, 300]
  ],
  Australia: [
    [1500, 700], [1700, 700], [1750, 850], [1500, 850]
  ]
};

// Approximate centers for historical nations
export const HISTORICAL_STARTS: Record<string, [number, number]> = {
  "Ottomans": [1120, 310], // Anatolia
  "France": [910, 240],    // West Europe
  "Castile": [860, 290],   // Iberia
  "England": [890, 190],   // British Isles
  "Austria": [980, 230],   // Central Europe
  "Muscovy": [1150, 180],  // Russia
  "Poland": [1050, 220],   // East Europe
  "Mamluks": [1100, 400],  // Egypt
  "Ming": [1550, 350],     // China
  "Timurids": [1280, 320], // Persia
  "Ayutthaya": [1480, 500], // SE Asia
  "Vijayanagar": [1350, 520], // India
  "Inca": [450, 650],      // Peru
  "Aztec": [250, 350]      // Mexico
};