import { useState } from 'react';
import type { Cargo } from '../../types';
import { MapPin, Clock } from 'lucide-react';

interface Props {
  cargo: Cargo;
}

const stationColor: Record<string, string> = {
  北京: 'bg-rust-500/30 text-rust-300 border-rust-500/40',
  上海: 'bg-patina-500/30 text-patina-400 border-patina-500/40',
  广州: 'bg-brass-500/30 text-brass-300 border-brass-500/40',
  成都: 'text-orange-300',
  武汉: 'text-cyan-300',
  深圳: 'text-purple-300',
};

export default function CargoCard({ cargo }: Props) {
  const [dragging, setDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setDragging(true);
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ type: 'cargo', data: cargo }),
    );
  };

  const isUrgent = cargo.deadline <= 4;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={() => setDragging(false)}
      className={`drag-card rivet-border p-2.5 bg-coal-600/60 hover:bg-coal-600 ${
        dragging ? 'dragging' : ''
      } ${isUrgent ? 'border-rust-500/50' : ''}`}
    >
      <div className="flex items-start gap-2.5">
        <div
          className={`w-10 h-10 rounded-md flex items-center justify-center text-xl flex-shrink-0 border ${
            isUrgent
              ? 'bg-rust-500/20 border-rust-500/40 animate-led-blink'
              : 'bg-coal-700/80 border-coal-500/40'
          }`}
        >
          {cargo.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-mono font-medium text-[13px] text-coal-100 mb-1 flex items-center gap-1.5">
            <span className="truncate">{cargo.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-coal-700 text-brass-300 font-bold flex-shrink-0">
              {cargo.weight}t
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
            <span
              className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded border ${
                stationColor[cargo.destination] || 'text-coal-300'
              } bg-coal-700/60 border-coal-500/40`}
            >
              <MapPin className="w-3 h-3" />
              {cargo.destination}
            </span>
            <span
              className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded ${
                isUrgent
                  ? 'bg-rust-500/30 text-rust-200'
                  : 'bg-coal-700/60 text-coal-300'
              }`}
            >
              <Clock className="w-3 h-3" />
              {cargo.deadline}h
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
