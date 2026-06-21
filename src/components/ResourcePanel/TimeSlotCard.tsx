import { useState } from 'react';
import type { DepartureTime } from '../../types';
import { Clock, Zap, AlertCircle, Coffee } from 'lucide-react';

interface Props {
  departure: DepartureTime;
  isActive: boolean;
}

const urgencyConfig = {
  紧急: {
    icon: Zap,
    color: 'text-rust-400',
    bg: 'bg-rust-500/20',
    border: 'border-rust-500/40',
  },
  正常: {
    icon: Clock,
    color: 'text-brass-400',
    bg: 'bg-brass-500/15',
    border: 'border-brass-500/30',
  },
  宽松: {
    icon: Coffee,
    color: 'text-patina-400',
    bg: 'bg-patina-500/15',
    border: 'border-patina-500/30',
  },
};

export default function TimeSlotCard({ departure, isActive }: Props) {
  const [dragging, setDragging] = useState(false);
  const cfg = urgencyConfig[departure.urgency];
  const Icon = cfg.icon;

  const handleDragStart = (e: React.DragEvent) => {
    setDragging(true);
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ type: 'departure', data: departure }),
    );
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={() => setDragging(false)}
      className={`drag-card rivet-border p-3 transition-all ${
        isActive
          ? 'bg-brass-500/15 border-brass-500/50 ring-2 ring-brass-400/30'
          : 'bg-coal-600/60 hover:bg-coal-600'
      } ${dragging ? 'dragging' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 border ${cfg.bg} ${cfg.border}`}
        >
          <Icon className={`w-6 h-6 ${cfg.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display font-black text-2xl text-brass-200 leading-none mb-1 text-shadow-brass">
            {departure.label}
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <span className={`px-2 py-0.5 rounded ${cfg.bg} ${cfg.color} font-medium`}>
              {departure.urgency}
            </span>
            <span className="text-coal-400">
              {departure.hoursFromNow}h 后发车
            </span>
          </div>
          {isActive && (
            <div className="flex items-center gap-1 mt-1 text-[10px] font-mono text-brass-300">
              <AlertCircle className="w-3 h-3" />
              当前生效
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
