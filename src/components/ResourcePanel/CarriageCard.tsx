import { useState } from 'react';
import type { Carriage } from '../../types';

interface Props {
  carriage: Carriage;
}

export default function CarriageCard({ carriage }: Props) {
  const [dragging, setDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setDragging(true);
    e.dataTransfer.effectAllowed = 'copy';
    const payload = JSON.stringify(carriage);
    e.dataTransfer.setData('application/x-carriage', payload);
    e.dataTransfer.setData('text/plain', payload);
    const img = e.currentTarget;
    if (img) e.dataTransfer.setDragImage(img as HTMLElement, 60, 30);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={() => setDragging(false)}
      className={`drag-card rivet-border p-3 bg-coal-600/60 hover:bg-coal-600 ${
        dragging ? 'dragging' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 border-2 border-black/30"
          style={{
            background: `linear-gradient(180deg, ${carriage.color}dd 0%, ${carriage.color}99 100%)`,
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.4)',
          }}
        >
          {carriage.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-mono font-bold text-sm text-brass-200 mb-1">
            {carriage.type}
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] font-mono">
            <div className="text-coal-400">
              容量 <span className="text-coal-200">{carriage.capacity}</span>
            </div>
            <div className="text-coal-400">
              载重 <span className="text-coal-200">{carriage.maxWeight}t</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
