import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CarriageSlot from './CarriageSlot';
import type { Carriage, Cargo, DepartureTime, DraggableType } from '../../types';

interface DropPayload {
  type: DraggableType;
  data: Carriage | Cargo | DepartureTime;
}

export default function TrainTrack() {
  const { currentPlan, addCarriage } = useAppStore();
  const [scrollOffset, setScrollOffset] = useState(0);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const marshalling = currentPlan.marshalling;

  const scroll = (dir: -1 | 1) => {
    const el = document.getElementById('train-scroll-container');
    if (el) {
      el.scrollBy({ left: dir * 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      <div className="px-6 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-coal-400">
            编组轨道
          </span>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-coal-700/60 text-brass-300">
            {marshalling.length} 节编组
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="w-8 h-8 rounded flex items-center justify-center text-coal-400 hover:text-brass-300 hover:bg-coal-600/50 transition-all"
            onClick={() => scroll(-1)}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            className="w-8 h-8 rounded flex items-center justify-center text-coal-400 hover:text-brass-300 hover:bg-coal-600/50 transition-all"
            onClick={() => scroll(1)}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center relative px-6 pb-24 overflow-hidden">
        <div
          id="train-scroll-container"
          onScroll={(e) => setScrollOffset((e.target as HTMLElement).scrollLeft)}
          className="w-full overflow-x-auto scrollbar-thin py-4"
        >
          <div className="flex items-end gap-1 min-w-max px-2 relative">
            <Locomotive />

            {marshalling.map((mc, idx) => {
              const showInsertBefore = dropIndex === idx;
              return (
                <div key={mc.instanceId} className="relative">
                  {showInsertBefore && (
                    <InsertIndicator position="before" />
                  )}
                  <CarriageSlotWrapper
                    mc={mc}
                    index={idx}
                    onHoverInsert={(side) => setDropIndex(side === 'before' ? idx : idx + 1)}
                    onLeaveInsert={() => setDropIndex(null)}
                  />
                  {idx < marshalling.length - 1 && (
                    <CarriageConnector />
                  )}
                </div>
              );
            })}

            <AppendCarriageDropZone
              onDropCarriage={(c) => addCarriage(c)}
              onHover={(h) => setDropIndex(h ? marshalling.length : null)}
              isHighlighted={dropIndex === marshalling.length}
            />
          </div>
        </div>

        <div className="absolute bottom-6 left-0 right-0 mx-6 h-4 train-track rounded-sm" />

        {scrollOffset > 0 && (
          <div className="absolute left-2 bottom-16 w-12 h-20 pointer-events-none bg-gradient-to-r from-coal-800/90 to-transparent" />
        )}
      </div>
    </div>
  );
}

function Locomotive() {
  return (
    <div className="relative mr-3 animate-float-up">
      <div
        className="w-28 h-36 rounded-t-2xl relative flex flex-col items-center justify-end pb-4"
        style={{
          background:
            'linear-gradient(180deg, #865b22 0%, #5a3c1f 40%, #3d2815 100%)',
          boxShadow:
            'inset 0 2px 0 rgba(255,255,255,0.15), inset 0 -2px 4px rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.5)',
          border: '2px solid #5a3c1f',
        }}
      >
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-10 rounded-lg border-2 border-coal-900 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-b from-sky-300 to-sky-500 relative">
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-coal-900/30 to-transparent" />
          </div>
        </div>
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-5 h-6 rounded-t"
          style={{
            background:
              'linear-gradient(180deg, #c89b3c 0%, #865b22 100%)',
            boxShadow: '0 -2px 6px rgba(200,155,60,0.3)',
          }}
        />
        <div className="flex gap-1.5 mt-2">
          <div className="w-4 h-3 rounded-sm bg-coal-900/80" />
          <div className="w-4 h-3 rounded-sm bg-coal-900/80" />
        </div>
        <div className="font-mono text-[10px] font-bold text-brass-300 tracking-widest mt-1">
          LOCO
        </div>
      </div>
      <div className="flex justify-around mt-[-2px]">
        <Wheel />
        <Wheel />
      </div>
    </div>
  );
}

function Wheel() {
  return (
    <div
      className="w-7 h-7 rounded-full border-2 border-coal-900"
      style={{
        background:
          'radial-gradient(circle, #c89b3c 0%, #865b22 60%, #3d2815 100%)',
        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.6)',
      }}
    />
  );
}

function CarriageSlotWrapper(props: {
  mc: any;
  index: number;
  onHoverInsert: (side: 'before' | 'after' | null) => void;
  onLeaveInsert: () => void;
}) {
  return (
    <div
      className="relative group"
      onDragOver={(e) => {
        try {
          const raw = e.dataTransfer.getData('application/json');
          if (!raw) return;
          const p = JSON.parse(raw);
          if (p.type === 'carriage') {
            e.preventDefault();
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const x = e.clientX - rect.left;
            props.onHoverInsert(x < rect.width / 2 ? 'before' : 'after');
          }
        } catch {}
      }}
      onDragLeave={props.onLeaveInsert}
    >
      <CarriageSlot mc={props.mc} index={props.index} />
    </div>
  );
}

function CarriageConnector() {
  return (
    <div className="w-3 h-4 flex items-center mx-[-2px] relative z-10">
      <div className="w-full h-1.5 bg-coal-600 rounded" style={{
        boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.5), inset 0 -1px 0 rgba(255,255,255,0.1)'
      }} />
    </div>
  );
}

function InsertIndicator({ position }: { position: 'before' | 'after' }) {
  return (
    <div
      className={`absolute top-0 bottom-0 w-1 bg-brass-400 rounded-full ${
        position === 'before' ? '-left-1' : '-right-1'
      } animate-pulse`}
      style={{
        boxShadow: '0 0 12px rgba(200,155,60,0.8), 0 0 24px rgba(200,155,60,0.4)',
      }}
    />
  );
}

function AppendCarriageDropZone(props: {
  onDropCarriage: (c: Carriage) => void;
  onHover: (hover: boolean) => void;
  isHighlighted: boolean;
}) {
  return (
    <div
      className={`w-4 h-32 mx-2 rounded border-2 border-dashed transition-all duration-200 flex items-center justify-center ${
        props.isHighlighted
          ? 'border-brass-400 bg-brass-500/15 scale-y-105'
          : 'border-coal-500/50 hover:border-coal-400/60'
      }`}
      onDragEnter={() => props.onHover(true)}
      onDragLeave={() => props.onHover(false)}
      onDragOver={(e) => {
        try {
          const raw = e.dataTransfer.getData('application/json');
          if (!raw) return;
          const p = JSON.parse(raw);
          if (p.type === 'carriage') e.preventDefault();
        } catch {}
      }}
      onDrop={(e) => {
        e.preventDefault();
        props.onHover(false);
        try {
          const raw = e.dataTransfer.getData('application/json');
          if (!raw) return;
          const p = JSON.parse(raw);
          if (p.type === 'carriage') props.onDropCarriage(p.data as Carriage);
        } catch {}
      }}
    >
      <span className="text-coal-500 text-lg font-bold" style={{ writingMode: 'vertical-rl' }}>
        +
      </span>
    </div>
  );
}
