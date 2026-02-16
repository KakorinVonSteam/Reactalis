export enum ProvinceType {
  Land = 'Land',
  Sea = 'Sea',
}

export enum TerrainType {
  Plains = 'Plains',
  Forest = 'Forest',
  Hills = 'Hills',
  Mountains = 'Mountains',
  Desert = 'Desert',
  Coastline = 'Coastline', // For sea
  Ocean = 'Ocean', // For sea
}

export interface Pop {
  size: number;
  culture: string;
  religion: string;
  militancy: number;
}

export interface Province {
  id: number;
  name: string;
  type: ProvinceType;
  terrain: TerrainType;
  ownerId: number | null; // Country ID
  controllerId: number | null; // Country ID
  pop?: Pop;
  path: string; // SVG Path data
  center: [number, number];
  neighbors: number[];
}

export interface Country {
  id: number;
  name: string;
  color: string;
  capitalId: number;
  culture: string;
  religion: string;
  manpower: number;
  gold: number;
}

export interface GameDate {
  day: number;
  month: number;
  year: number;
}

export interface GameState {
  date: GameDate;
  paused: boolean;
  speed: number;
  view: 'menu' | 'lobby' | 'game';
  selectedProvinceId: number | null;
  selectedCountryId: number | null; // For lobby/player
  playerCountryId: number | null;
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
