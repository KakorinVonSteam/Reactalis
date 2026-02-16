import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { GameState, Province, Country, ProvinceType } from './types';
import { MAP_WIDTH, MAP_HEIGHT } from './constants';
import { generateWorld, formatDate } from './utils';
import { TopBar } from './components/TopBar';
import { ProvinceView } from './components/ProvinceView';
import { LobbyPanel } from './components/LobbyPanel';
import { Play, Settings, XCircle } from 'lucide-react';

const START_DATE = { day: 11, month: 10, year: 1444 }; // Nov 11, 1444 (Month is 0-indexed in JS usually, but here I use 0=Jan so 10=Nov)

const App: React.FC = () => {
  // Game Data State (Memoized to prevent regeneration on rerender)
  const { provinces, countries } = useMemo(() => generateWorld(), []);

  // View State
  const [gameState, setGameState] = useState<GameState>({
    date: { ...START_DATE },
    paused: true,
    speed: 1,
    view: 'menu',
    selectedProvinceId: null,
    selectedCountryId: null,
    playerCountryId: null,
  });

  // Camera State - Start focused on Europe (approx 900, 250)
  const [transform, setTransform] = useState({ x: -MAP_WIDTH / 4, y: -MAP_HEIGHT / 6, k: 0.8 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  // --- Game Loop ---
  useEffect(() => {
    if (gameState.paused || gameState.view !== 'game') return;

    const intervalMs = 1000 / gameState.speed;
    const tick = setInterval(() => {
      setGameState(prev => {
        let { day, month, year } = prev.date;
        day++;
        if (day > 30) { // Simplified 30 day months
          day = 1;
          month++;
          if (month > 11) {
            month = 0;
            year++;
          }
        }
        return { ...prev, date: { day, month, year } };
      });
    }, intervalMs);

    return () => clearInterval(tick);
  }, [gameState.paused, gameState.speed, gameState.view]);

  // --- Interactions ---

  const handleStartGame = () => {
    if (gameState.selectedCountryId !== null) {
      setGameState(prev => ({ 
        ...prev, 
        view: 'game', 
        playerCountryId: prev.selectedCountryId,
        paused: true 
      }));
    }
  };

  const handleProvinceClick = (provinceId: number) => {
    if (gameState.view === 'game') {
      setGameState(prev => ({ ...prev, selectedProvinceId: provinceId }));
    } else if (gameState.view === 'lobby') {
      const prov = provinces[provinceId];
      if (prov.ownerId !== null) {
        setGameState(prev => ({ ...prev, selectedCountryId: prov.ownerId }));
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    const scaleFactor = 1.1;
    const direction = e.deltaY > 0 ? 1 / scaleFactor : scaleFactor;
    setTransform(prev => {
       const newK = Math.max(0.2, Math.min(5, prev.k * direction));
       return { ...prev, k: newK };
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    setTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // --- Render Helpers ---

  const getProvinceColor = (p: Province) => {
    // Mode: Terrain vs Political
    // In Lobby: Political.
    // In Game: Political (Standard).
    
    // Sea
    if (p.type === ProvinceType.Sea) {
        return "#1e3a8a"; // Dark blue
    }
    
    // Land
    if (p.ownerId !== null) {
        const owner = countries.find(c => c.id === p.ownerId);
        return owner ? owner.color : '#57534e';
    }
    return '#57534e'; // Wasteland grey
  };

  const selectedProvince = gameState.selectedProvinceId !== null ? provinces[gameState.selectedProvinceId] : null;
  const ownerOfSelected = selectedProvince?.ownerId !== null && selectedProvince?.ownerId !== undefined ? countries.find(c => c.id === selectedProvince.ownerId) : undefined;
  const controllerOfSelected = selectedProvince?.controllerId !== null && selectedProvince?.controllerId !== undefined ? countries.find(c => c.id === selectedProvince.controllerId) : undefined;
  
  const playerCountry = countries.find(c => c.id === gameState.playerCountryId);
  const lobbyCountry = countries.find(c => c.id === gameState.selectedCountryId);

  // --- Views ---

  if (gameState.view === 'menu') {
    return (
      <div className="relative w-screen h-screen bg-stone-900 flex items-center justify-center overflow-hidden">
        {/* Background blurry map */}
        <div className="absolute inset-0 opacity-30 blur-sm pointer-events-none scale-110">
            <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} className="w-full h-full bg-[#0f172a]">
                {provinces.map(p => (
                    <path key={p.id} d={p.path} fill={p.type === ProvinceType.Sea ? '#1e3a8a' : '#334155'} stroke="#000" strokeWidth="1" />
                ))}
            </svg>
        </div>
        
        <div className="relative z-10 flex flex-col items-center gap-8 bg-stone-900/80 p-16 rounded-xl border-4 border-double border-amber-600 shadow-2xl backdrop-blur-md">
            <h1 className="text-6xl text-amber-500 font-bold serif tracking-wider drop-shadow-lg text-center leading-tight">
                EUROPA <br/><span className="text-amber-100">REACTALIS</span>
            </h1>
            <div className="w-full h-px bg-amber-600/50"></div>
            <div className="flex flex-col gap-4 w-64">
                <button 
                    onClick={() => setGameState(prev => ({ ...prev, view: 'lobby' }))}
                    className="flex items-center justify-center gap-3 py-3 px-6 bg-amber-800 hover:bg-amber-700 text-amber-50 rounded border border-amber-600 shadow transition-all active:scale-95"
                >
                    <Play size={20} /> <span className="serif font-bold text-lg">Single Player</span>
                </button>
                <button 
                    className="flex items-center justify-center gap-3 py-3 px-6 bg-stone-800 hover:bg-stone-700 text-stone-400 rounded border border-stone-600 shadow transition-all cursor-not-allowed opacity-70"
                >
                    <Settings size={20} /> <span className="serif font-bold text-lg">Options</span>
                </button>
                <button 
                    className="flex items-center justify-center gap-3 py-3 px-6 bg-stone-800 hover:bg-red-900/50 text-stone-400 hover:text-red-300 rounded border border-stone-600 shadow transition-all"
                >
                    <XCircle size={20} /> <span className="serif font-bold text-lg">Quit</span>
                </button>
            </div>
            <span className="text-stone-500 text-xs mt-4">v1.0.0 - Checksum: R34CT</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen bg-[#0f172a] overflow-hidden select-none">
        {/* Game Top Bar */}
        {gameState.view === 'game' && (
            <TopBar 
                date={gameState.date}
                paused={gameState.paused}
                speed={gameState.speed}
                onTogglePause={() => setGameState(prev => ({ ...prev, paused: !prev.paused }))}
                onSpeedChange={(s) => setGameState(prev => ({ ...prev, speed: s }))}
                playerCountry={playerCountry}
            />
        )}

        {/* Lobby Overlay */}
        {gameState.view === 'lobby' && (
             <div className="absolute top-0 left-0 right-0 h-14 bg-stone-900/90 border-b border-amber-600/30 flex items-center px-6 z-40 backdrop-blur pointer-events-none">
                <span className="serif text-2xl text-amber-500 font-bold drop-shadow">Select a Nation</span>
             </div>
        )}

        {/* The Map */}
        <div 
            ref={mapRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
        >
            <div 
                style={{ 
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`,
                    transformOrigin: '0 0',
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                }}
                className="w-[2000px] h-[1000px]"
            >
                <svg width={MAP_WIDTH} height={MAP_HEIGHT} className="bg-[#0f172a] shadow-2xl">
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                    {provinces.map(province => {
                        const isSelected = gameState.selectedProvinceId === province.id;
                        const isHoverable = gameState.view !== 'menu';
                        const fillColor = getProvinceColor(province);

                        // Highlight country in lobby
                        let stroke = '#1e293b';
                        let strokeWidth = 1;
                        let opacity = 1;

                        if (gameState.view === 'lobby') {
                            if (province.ownerId !== null && province.ownerId === gameState.selectedCountryId) {
                                stroke = '#fbbf24'; // bright amber
                                strokeWidth = 3;
                            } else if (province.type === ProvinceType.Land) {
                                opacity = 0.8;
                            }
                        }

                        if (isSelected) {
                            stroke = '#fff';
                            strokeWidth = 3;
                        }

                        return (
                            <path
                                key={province.id}
                                d={province.path}
                                fill={fillColor}
                                stroke={stroke}
                                strokeWidth={strokeWidth}
                                opacity={opacity}
                                className={`transition-opacity duration-300 outline-none ${isHoverable ? 'hover:brightness-110' : ''}`}
                                onClick={() => handleProvinceClick(province.id)}
                            />
                        );
                    })}
                </svg>
            </div>
        </div>

        {/* Map Overlays UI */}
        
        {/* Lobby Sidebar */}
        {gameState.view === 'lobby' && (
            <LobbyPanel 
                selectedCountry={lobbyCountry || null}
                provinces={provinces}
                onPlay={handleStartGame}
            />
        )}

        {/* Back button in lobby */}
        {gameState.view === 'lobby' && (
            <button 
                onClick={() => setGameState(prev => ({ ...prev, view: 'menu' }))}
                className="absolute bottom-6 right-6 z-50 bg-stone-800 text-stone-300 px-6 py-2 rounded border border-stone-600 hover:bg-stone-700"
            >
                Back to Menu
            </button>
        )}

        {/* Province View in Game */}
        {gameState.view === 'game' && selectedProvince && (
            <ProvinceView 
                province={selectedProvince}
                owner={ownerOfSelected}
                controller={controllerOfSelected}
                onClose={() => setGameState(prev => ({ ...prev, selectedProvinceId: null }))}
            />
        )}
    </div>
  );
};

export default App;
