import React from 'react';
import { Country, Province } from '../types';
import { Crown, Map, BookOpen, Scroll } from 'lucide-react';

interface LobbyPanelProps {
    selectedCountry: Country | null;
    provinces: Province[];
    onPlay: () => void;
}

export const LobbyPanel: React.FC<LobbyPanelProps> = ({ selectedCountry, provinces, onPlay }) => {
    if (!selectedCountry) {
        return (
            <div className="absolute right-0 top-14 bottom-0 w-80 bg-stone-900/95 border-l border-amber-600/30 p-8 flex items-center justify-center text-stone-500 italic">
                Select a country on the map to view details.
            </div>
        );
    }

    const ownedProvincesCount = provinces.filter(p => p.ownerId === selectedCountry.id).length;

    return (
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-stone-900/95 border-l-4 border-double border-amber-700/50 shadow-2xl p-6 flex flex-col z-50">
            <h2 className="serif text-4xl text-amber-500 font-bold mb-2 border-b border-stone-700 pb-4">
                {selectedCountry.name}
            </h2>
            
            <div className="flex-1 space-y-6 overflow-y-auto py-4">
                {/* Flag/Color representation */}
                <div className="h-32 w-full rounded-lg shadow-inner border border-stone-600 relative overflow-hidden flex items-center justify-center" style={{ backgroundColor: selectedCountry.color }}>
                    <Crown size={64} className="text-black/20" />
                </div>

                <div className="space-y-4">
                     <div className="flex items-center gap-3 text-stone-300">
                        <Map size={20} className="text-amber-600" />
                        <span className="font-bold">Provinces:</span>
                        <span className="font-mono text-xl">{ownedProvincesCount}</span>
                     </div>
                     
                     <div className="flex items-center gap-3 text-stone-300">
                        <BookOpen size={20} className="text-amber-600" />
                        <span className="font-bold">Culture:</span>
                        <span>{selectedCountry.culture}</span>
                     </div>

                     <div className="flex items-center gap-3 text-stone-300">
                        <Scroll size={20} className="text-amber-600" />
                        <span className="font-bold">Religion:</span>
                        <span>{selectedCountry.religion}</span>
                     </div>
                </div>

                <div className="bg-stone-800/50 p-4 rounded text-sm text-stone-400 italic">
                    "A great nation waiting to be led to glory. Will you build a trading empire, or conquer by the sword?"
                </div>
            </div>

            <div className="pt-4 border-t border-stone-700">
                <button 
                    onClick={onPlay}
                    className="w-full bg-amber-700 hover:bg-amber-600 text-amber-50 font-bold py-4 rounded border-2 border-amber-500 shadow-lg active:scale-95 transition-all serif text-xl"
                >
                    PLAY AS {selectedCountry.name.toUpperCase()}
                </button>
            </div>
        </div>
    );
};
