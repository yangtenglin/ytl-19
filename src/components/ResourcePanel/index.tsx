import { useState } from 'react';
import { Train, Package, Clock } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { CARRIAGES, CARGOS, DEPARTURE_TIMES } from '../../data/mockData';
import CarriageCard from './CarriageCard';
import CargoCard from './CargoCard';
import TimeSlotCard from './TimeSlotCard';
import type { ResourceTab } from '../../types';

export default function ResourcePanel() {
  const { activeResourceTab, setActiveResourceTab, currentPlan } = useAppStore();
  const [hoverTab, setHoverTab] = useState<ResourceTab | null>(null);

  const usedCargoIds = new Set(
    currentPlan.marshalling.flatMap((mc) => mc.cargos.map((c) => c.id)),
  );

  const tabs: Array<{ id: ResourceTab; label: string; icon: typeof Train; count: number }> = [
    { id: 'carriages', label: '车厢', icon: Train, count: CARRIAGES.length },
    { id: 'cargos', label: '货物', icon: Package, count: CARGOS.length - usedCargoIds.size },
    { id: 'departures', label: '发车时刻', icon: Clock, count: DEPARTURE_TIMES.length },
  ];

  return (
    <aside className="w-[290px] h-full flex flex-col bg-coal-700/80 border-r-2 border-coal-600 backdrop-blur-sm">
      <div className="flex border-b-2 border-coal-600 bg-metal-brush">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeResourceTab === tab.id;
          const isHover = hoverTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`flex-1 py-3 px-2 flex flex-col items-center gap-1 transition-all duration-200 relative ${
                isActive ? 'bg-coal-700' : 'hover:bg-coal-600/40'
              }`}
              onClick={() => setActiveResourceTab(tab.id)}
              onMouseEnter={() => setHoverTab(tab.id)}
              onMouseLeave={() => setHoverTab(null)}
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-brass-400' : isHover ? 'text-brass-300' : 'text-coal-300'
                }`}
              />
              <div className="flex items-center gap-1">
                <span
                  className={`text-[11px] font-mono font-medium tracking-wide ${
                    isActive ? 'text-brass-300' : 'text-coal-300'
                  }`}
                >
                  {tab.label}
                </span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-brass-500/30 text-brass-200'
                      : 'bg-coal-600 text-coal-300'
                  }`}
                >
                  {tab.count}
                </span>
              </div>
              {isActive && (
                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-brass-400 to-transparent" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-2.5">
        {activeResourceTab === 'carriages' && (
          <>
            <div className="font-mono text-[10px] uppercase text-coal-400 tracking-widest px-1 mb-1">
              拖入右侧编组区 →
            </div>
            {CARRIAGES.map((c) => (
              <CarriageCard key={c.id} carriage={c} />
            ))}
          </>
        )}
        {activeResourceTab === 'cargos' && (
          <>
            <div className="font-mono text-[10px] uppercase text-coal-400 tracking-widest px-1 mb-1">
              拖入车厢内装载 →
            </div>
            {CARGOS.filter((c) => !usedCargoIds.has(c.id)).map((c) => (
              <CargoCard key={c.id} cargo={c} />
            ))}
            {usedCargoIds.size === CARGOS.length && (
              <div className="parchment-panel p-4 text-center mt-4">
                <Package className="w-8 h-8 text-coal-500 mx-auto mb-2" />
                <div className="font-mono text-xs text-coal-400">所有货物已装载完毕</div>
              </div>
            )}
          </>
        )}
        {activeResourceTab === 'departures' && (
          <>
            <div className="font-mono text-[10px] uppercase text-coal-400 tracking-widest px-1 mb-1">
              拖入顶部时刻栏 →
            </div>
            {DEPARTURE_TIMES.map((d) => (
              <TimeSlotCard
                key={d.id}
                departure={d}
                isActive={currentPlan.departure?.id === d.id}
              />
            ))}
          </>
        )}
      </div>
    </aside>
  );
}
