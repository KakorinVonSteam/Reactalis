import React from 'react';
import { Province, ProvinceType, Country } from '../types';
import { X, Anchor, Users, Shield, Sword, Crown, MapPin } from 'lucide-react';

interface ProvinceViewProps {
  province: Province;
  owner?: Country;
  controller?: Country;
  onClose: () => void;
}

export const ProvinceView: React.FC<ProvinceViewProps> = ({ province, owner, controller, onClose }) => {
  return (
    <div className="absolute bottom-4 left-4 w-80 bg-stone-900/95 border-2 border-amber-600/50 rounded-lg shadow-2xl text-stone-200 overflow-hidden backdrop-blur-sm animate-slide-up z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-800 to-stone-900 p-3 border-b border-amber-600/30 flex justify-between items-center">
        <h3 className="serif text-lg font-bold text-amber-500 truncate">{province.name}</h3>
        <button onClick={onClose} className="hover:bg-stone-700 p-1 rounded transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="flex flex-col h-full">
        {/* Province Type Indicator */}
        <div className="p-4 bg-stone-900/50 flex items-center justify-center border-b border-stone-800">
          {province.type === ProvinceType.Sea ? (
            <div className="flex items-center gap-2 text-blue-400">
              <Anchor size={24} />
              <span className="text-sm font-semibold tracking-wider uppercase">Sea Province</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-400">
              <MapPin size={24} />
              <span className="text-sm font-semibold tracking-wider uppercase">{province.terrain}</span>
            </div>
          )}
        </div>

        {/* Content Tabs */}
        <div className="p-4 space-y-4">
          {province.type === ProvinceType.Land && province.pop ? (
            <>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-400 flex items-center gap-2"><Crown size={14}/> Owner</span>
                  <div className="flex items-center gap-2">
                    {owner ? (
                        <>
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: owner.color }}></div>
                            <span className="font-bold text-amber-100">{owner.name}</span>
                        </>
                    ) : (
                        <span className="text-stone-500 italic">Uncolonized</span>
                    )}
                  </div>
                </div>

                 <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-400 flex items-center gap-2"><Shield size={14}/> Controller</span>
                  <div className="flex items-center gap-2">
                    {controller ? (
                        <>
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: controller.color }}></div>
                            <span className="font-bold text-amber-100">{controller.name}</span>
                        </>
                    ) : (
                        <span className="text-stone-500 italic">-</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="h-px bg-stone-700 my-2" />

              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-stone-800 p-2 rounded border border-stone-700">
                    <span className="text-xs text-stone-500 uppercase block mb-1">Population</span>
                    <div className="flex items-center gap-2 text-amber-100 font-mono">
                        <Users size={14} />
                        {province.pop.size.toLocaleString()}
                    </div>
                 </div>
                 <div className="bg-stone-800 p-2 rounded border border-stone-700">
                    <span className="text-xs text-stone-500 uppercase block mb-1">Militancy</span>
                    <div className="flex items-center gap-2 text-red-400 font-mono">
                        <Sword size={14} />
                        {province.pop.militancy}%
                    </div>
                 </div>
              </div>

              <div className="space-y-1 text-sm pt-2">
                 <div className="flex justify-between">
                    <span className="text-stone-400">Culture</span>
                    <span>{province.pop.culture}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-stone-400">Religion</span>
                    <span>{province.pop.religion}</span>
                 </div>
              </div>
            </>
          ) : (
            <div className="text-center text-stone-500 py-6 italic text-sm">
              Naval operations only. No population data available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
