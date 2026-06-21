import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import DepartureSelector from './DepartureSelector';
import TrainTrack from './TrainTrack';
import type { Carriage, Cargo, DepartureTime, DraggableType } from '../../types';

interface DropPayload {
  type: DraggableType;
  data: Carriage | Cargo | DepartureTime;
}

function parsePayload(e: React.DragEvent): DropPayload | null {
  try {
    const raw = e.dataTransfer.getData('application/json');
    return raw ? (JSON.parse(raw) as DropPayload) : null;
  } catch {
    return null;
  }
}

export default function MarshallingYard() {
  const { currentPlan, addCarriage, setDeparture } = useAppStore();
  const [yardDragOver, setYardDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    const p = parsePayload(e);
    if (!p) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = p.type === 'carriage' ? 'copy' : 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setYardDragOver(false);
    const p = parsePayload(e);
    if (!p) return;
    if (p.type === 'carriage') {
      addCarriage(p.data as Carriage);
    } else if (p.type === 'departure') {
      setDeparture(p.data as DepartureTime);
    }
  };

  return (
    <section className="flex-1 h-full flex flex-col bg-gradient-to-b from-coal-700/30 to-coal-800/50 overflow-hidden">
      <DepartureSelector />

      <div
        className={`flex-1 flex flex-col relative overflow-hidden transition-colors duration-200 ${
          yardDragOver ? 'bg-brass-500/5' : ''
        }`}
        onDragEnter={(e) => {
          if (parsePayload(e)?.type === 'carriage') setYardDragOver(true);
        }}
        onDragLeave={(e) => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          const x = e.clientX,
            y = e.clientY;
          if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
            setYardDragOver(false);
          }
        }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {currentPlan.marshalling.length === 0 ? (
          <EmptyYardHint dragHint={yardDragOver} />
        ) : (
          <TrainTrack />
        )}
      </div>
    </section>
  );
}

function EmptyYardHint({ dragHint }: { dragHint: boolean }) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div
        className={`parchment-panel max-w-md w-full p-10 text-center transition-all duration-300 ${
          dragHint ? 'ring-2 ring-brass-400/60 scale-[1.02] border-brass-400/40' : ''
        }`}
      >
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              background:
                'radial-gradient(circle, rgba(200,155,60,0.15) 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute inset-2 rounded-full flex items-center justify-center text-5xl"
            style={{
              background:
                'radial-gradient(circle at 30% 30%, #ecc062, #c89b3c 50%, #865b22)',
              boxShadow:
                '0 0 32px rgba(200,155,60,0.35), inset 0 -4px 8px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3)',
            }}
          >
            🚂
          </div>
        </div>
        <h2 className="font-display text-2xl font-bold text-brass-300 mb-3 tracking-wide">
          {dragHint ? '松开车厢开始编组！' : '编组月台已就绪'}
        </h2>
        <p className="font-mono text-xs text-coal-400 leading-relaxed mb-6">
          从左侧「车厢」面板拖拽一节车厢到此区域
          <br />
          然后挂载货物、设定发车时刻
          <br />
          追求最低罚分完成完美调度
        </p>
        <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-coal-500 uppercase tracking-widest">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rust-500" /> 超重
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-500" /> 错站
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-500" /> 延误
          </span>
        </div>
      </div>
    </div>
  );
}
