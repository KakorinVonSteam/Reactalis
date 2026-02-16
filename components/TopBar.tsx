import React from 'react';
import { GameDate, Country } from '../types';
import { formatDate } from '../utils';
import { Pause, Play, FastForward, Coins, User } from 'lucide-react';

interface TopBarProps {
  date: GameDate;
  paused: boolean;
  speed: number;
  onTogglePause: () => void;
  onSpeedChange: (speed: number) => void;
  playerCountry?: Country;
}

export const TopBar: React.FC<TopBarProps> = ({ date, paused, speed, onTogglePause, onSpeedChange, playerCountry }) => {
  return (
    <div className="absolute top-0 left-0 right-0 h-14 bg-stone-900/90 border-b-2 border-amber-600/50 flex items-center justify-between px-6 z-40 backdrop-blur-md shadow-lg">
      
      {/* Player Info (Left) */}
      <div className="flex items-center gap-6">
        {playerCountry && (
           <div className="flex items-center gap-3">
              <div className="w-8 h-6 border border-amber-500/50 shadow-sm" style={{ backgroundColor: playerCountry.color }}></div>
              <div className="flex flex-col">
                 <span className="serif font-bold text-amber-100 leading-none">{playerCountry.name}</span>
                 <div className="flex gap-3 text-xs text-stone-400 mt-1">
                    <span className="flex items-center gap-1"><Coins size={10} className="text-yellow-500"/> {playerCountry.gold}</span>
                    <span className="flex items-center gap-1"><User size={10} className="text-blue-400"/> {playerCountry.manpower}</span>
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* Date & Controls (Right/Center) */}
      <div className="flex items-center gap-4 bg-stone-800/80 px-4 py-1 rounded-full border border-stone-700">
        <div className="flex gap-1 mr-2">
             {[1, 2, 3, 4, 5].map(s => (
                 <button 
                    key={s}
                    onClick={() => onSpeedChange(s)}
                    className={`h-2 w-2 rounded-full transition-all ${speed >= s ? 'bg-amber-500' : 'bg-stone-600'}`}
                 />
             ))}
        </div>
        
        <button 
            onClick={onTogglePause}
            className={`p-1.5 rounded-full transition-all ${paused ? 'bg-red-900/50 text-red-400 hover:bg-red-900' : 'bg-green-900/50 text-green-400 hover:bg-green-900'}`}
        >
            {paused ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
        </button>

        <div className="w-px h-6 bg-stone-600 mx-2"></div>

        <span className="font-mono text-amber-50 text-lg w-32 text-center select-none">
            {formatDate(date.day, date.month, date.year)}
        </span>
      </div>
    </div>
  );
};
