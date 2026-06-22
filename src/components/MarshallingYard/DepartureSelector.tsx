import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Clock, X, Zap, Coffee } from 'lucide-react';
import type { DepartureTime } from '../../types';

const urgencyConfig = {
  紧急: {
    icon: Zap,
    color: 'text-rust-400',
    bg: 'bg-rust-500/25',
    border: 'border-rust-500/50',
    glow: 'shadow-[0_0_20px_rgba(176,65,62,0.4)]',
  },
  正常: {
    icon: Clock,
    color: 'text-brass-400',
    bg: 'bg-brass-500/20',
    border: 'border-brass-500/50',
    glow: 'shadow-[0_0_16px_rgba(200,155,60,0.3)]',
  },
  宽松: {
    icon: Coffee,
    color: 'text-patina-400',
    bg: 'bg-patina-500/20',
    border: 'border-patina-500/50',
    glow: 'shadow-[0_0_16px_rgba(74,124,107,0.3)]',
  },
};

export default function DepartureSelector() {
  const { currentPlan, setDeparture } = useAppStore();
  const [dragOver, setDragOver] = useState(false);
  const departure = currentPlan.departure;

  return (
    <div className="p-4 border-b border-coal-600/60">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-brass-400" />
          <span className="font-mono text-xs uppercase tracking-widest text-coal-400">
            发车时刻
          </span>
        </div>

        <div
          className={`drop-target flex-1 h-16 rounded-lg border-2 border-dashed transition-all duration-200 flex items-center ${
            dragOver
              ? 'drag-over border-brass-400 bg-brass-500/10'
              : departure
              ? `border-solid ${urgencyConfig[departure.urgency].border} ${urgencyConfig[departure.urgency].bg} ${urgencyConfig[departure.urgency].glow}`
              : 'border-coal-500/60 bg-coal-700/30 hover:border-coal-400/60'
          }`}
          onDragEnter={(e) => {
            if (e.dataTransfer.types.includes('application/x-departure')) {
              setDragOver(true);
            }
          }}
          onDragLeave={() => setDragOver(false)}
          onDragOver={(e) => {
            if (e.dataTransfer.types.includes('application/x-departure')) {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'copy';
            }
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragOver(false);
            const raw = e.dataTransfer.getData('application/x-departure');
            if (!raw) return;
            try {
              const dep = JSON.parse(raw) as DepartureTime;
              setDeparture(dep);
            } catch {}
          }}
        >
          {departure ? (
            <div className="flex items-center gap-4 px-5 w-full">
              {(() => {
                const cfg = urgencyConfig[departure.urgency];
                const Icon = cfg.icon;
                return (
                  <>
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${cfg.bg} border ${cfg.border}`}
                    >
                      <Icon className={`w-6 h-6 ${cfg.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-display font-black text-3xl text-brass-200 leading-none text-shadow-brass">
                        {departure.label}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-mono">
                        <span className={`px-2 py-0.5 rounded ${cfg.bg} ${cfg.color} font-medium`}>
                          {departure.urgency}
                        </span>
                        <span className="text-coal-400">
                          {departure.hoursFromNow} 小时后发车
                        </span>
                      </div>
                    </div>
                    <button
                      className="w-8 h-8 rounded flex items-center justify-center text-coal-400 hover:text-rust-400 hover:bg-rust-500/20 transition-all"
                      onClick={() => setDeparture(null)}
                      title="清除发车时刻"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="w-full text-center font-mono text-xs text-coal-500">
              拖入发车时刻卡片 · 或从左侧「发车时刻」面板选择
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
