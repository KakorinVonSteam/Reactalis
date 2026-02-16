import * as d3 from 'd3';
import { Country, Province, ProvinceType, TerrainType, Pop } from './types';
import { CULTURES, RELIGIONS, SEA_NAMES, MAP_WIDTH, MAP_HEIGHT, NUM_PROVINCES, WORLD_SHAPES, HISTORICAL_STARTS } from './constants';

// Helper to format date
export const formatDate = (day: number, month: number, year: number): string => {
    const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];
    return `${day}, ${monthNames[month]}, ${year}`;
};

// Check if a point is inside any of the continent polygons
const isPointOnLand = (point: [number, number]): boolean => {
    return Object.values(WORLD_SHAPES).some(polygon => d3.polygonContains(polygon, point));
};

// Procedural Map Generation
export const generateWorld = (): { provinces: Province[], countries: Country[] } => {
    // 1. Generate Points (Uniform distribution for consistent Voronoi cells)
    // We add some relaxation or use rejection sampling to make shapes nicer, 
    // but standard random + Lloyd's relaxation (simulated by uniform distribution) is okay.
    const points: [number, number][] = Array.from({ length: NUM_PROVINCES }, () => [
        Math.random() * MAP_WIDTH,
        Math.random() * MAP_HEIGHT
    ]);

    // 2. Voronoi Diagram
    const delaunay = d3.Delaunay.from(points);
    const voronoi = delaunay.voronoi([0, 0, MAP_WIDTH, MAP_HEIGHT]);

    const provinces: Province[] = [];
    const countries: Country[] = [];

    // 3. Create Provinces
    for (let i = 0; i < points.length; i++) {
        const center = points[i];
        
        // Determine Land vs Sea using the Polygons
        const isLand = isPointOnLand(center);
        const type = isLand ? ProvinceType.Land : ProvinceType.Sea;

        // Determine Terrain
        // Noise function for localized terrain variation within landmasses
        const noise = (x: number, y: number) => Math.sin(x * 0.005) + Math.cos(y * 0.005);
        const nVal = noise(center[0], center[1]);

        let terrain = TerrainType.Plains;
        if (type === ProvinceType.Sea) {
            // Simple logic: if close to land, coastline, else ocean
            // Approximation: check distance to nearest land polygon edge? 
            // Simpler: Just random noise for Sea vs Coastline visual
            terrain = Math.random() > 0.3 ? TerrainType.Ocean : TerrainType.Coastline;
        } else {
            if (nVal > 1.2) terrain = TerrainType.Mountains;
            else if (nVal > 0.5) terrain = TerrainType.Hills;
            else if (nVal < -0.5) terrain = TerrainType.Forest;
            else if (center[1] > MAP_HEIGHT * 0.3 && center[1] < MAP_HEIGHT * 0.5 && center[0] > 900 && center[0] < 1300) terrain = TerrainType.Desert; // Sahara-ish
            else terrain = TerrainType.Plains;
        }

        const path = voronoi.renderCell(i);
        
        // Basic Pop
        let pop: Pop | undefined;
        if (type === ProvinceType.Land) {
            pop = {
                size: Math.floor(Math.random() * 20000) + 1000,
                culture: CULTURES[Math.floor(Math.random() * CULTURES.length)],
                religion: RELIGIONS[Math.floor(Math.random() * RELIGIONS.length)],
                militancy: Math.floor(Math.random() * 10),
            };
        }

        // Neighbors
        const neighbors = Array.from(voronoi.neighbors(i)) as number[];

        let name = `Province ${i}`;
        if (type === ProvinceType.Sea) {
            name = SEA_NAMES[Math.floor(Math.random() * SEA_NAMES.length)];
        }

        provinces.push({
            id: i,
            name,
            type,
            terrain,
            ownerId: null,
            controllerId: null,
            pop,
            path,
            center,
            neighbors
        });
    }

    // 4. Generate Countries (Historical Placement)
    const countryData = [
        { name: "Ottomans", color: "#86efac" },
        { name: "France", color: "#3b82f6" },
        { name: "Castile", color: "#facc15" },
        { name: "England", color: "#ef4444" },
        { name: "Austria", color: "#ffffff" },
        { name: "Muscovy", color: "#16a34a" },
        { name: "Poland", color: "#db2777" },
        { name: "Mamluks", color: "#a855f7" },
        { name: "Ming", color: "#f97316" },
        { name: "Timurids", color: "#6366f1" },
        { name: "Ayutthaya", color: "#14b8a6" },
        { name: "Vijayanagar", color: "#f472b6" },
        { name: "Inca", color: "#fb923c" },
        { name: "Aztec", color: "#4ade80" }
    ];

    let countryId = 0;
    const usedProvIds = new Set<number>();

    countryData.forEach((cData) => {
        // Find closest land province to historical start
        const startPos = HISTORICAL_STARTS[cData.name];
        if (!startPos) return;

        let bestProv: Province | null = null;
        let minDist = Infinity;

        provinces.forEach(p => {
            if (p.type === ProvinceType.Land && !usedProvIds.has(p.id)) {
                const dist = Math.hypot(p.center[0] - startPos[0], p.center[1] - startPos[1]);
                if (dist < minDist) {
                    minDist = dist;
                    bestProv = p;
                }
            }
        });

        if (bestProv) {
            const startProv = bestProv as Province;
            const country: Country = {
                id: countryId,
                name: cData.name,
                color: cData.color,
                capitalId: startProv.id,
                culture: startProv.pop?.culture || "Unknown",
                religion: startProv.pop?.religion || "Unknown",
                manpower: 10000 + Math.floor(Math.random() * 10000),
                gold: 50 + Math.floor(Math.random() * 100),
            };
            countries.push(country);

            // Expand territory
            const queue = [startProv.id];
            const size = 5 + Math.floor(Math.random() * 8); 
            let currentSize = 0;
            const visitedInExpansion = new Set<number>();

            while(queue.length > 0 && currentSize < size) {
                const pid = queue.shift()!;
                if (usedProvIds.has(pid)) continue;

                const prov = provinces[pid];
                if (prov.type !== ProvinceType.Land) continue;

                usedProvIds.add(pid);
                prov.ownerId = countryId;
                prov.controllerId = countryId;
                // Rename based on owner for flavor
                prov.name = `${cData.name} ${currentSize + 1}`; 
                currentSize++;

                // Add neighbors
                for (const nid of prov.neighbors) {
                    if (!visitedInExpansion.has(nid)) {
                        visitedInExpansion.add(nid);
                        queue.push(nid);
                    }
                }
            }
            countryId++;
        }
    });

    // Assign unowned land names
    provinces.forEach(p => {
        if (p.type === ProvinceType.Land && p.ownerId === null) {
            p.name = "Wasteland";
        }
    });

    return { provinces, countries };
};
