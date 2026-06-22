import { useState, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CarriageSlot from './CarriageSlot';
import type { Carriage, MarshalledCarriage } from '../../types';

const CARRIAGE_MIME = 'application/x-carriage';
const REORDER_MIME = 'application/x-reorder';

export default function TrainTrack() {
  const { currentPlan, addCarriage, reorderCarriage } = useAppStore();
  const [scrollOffset, setScrollOffset] = useState(0);
  const [activeDropIdx, setActiveDropIdx] = useState<number | null>(null);
  const [draggingInstanceId, setDraggingInstanceId] = useState<string | null>(null);

  const marshalling = currentPlan.marshalling;

  const scroll = (dir: -1 | 1) => {
    const el = document.getElementById('train-scroll-container');
    if (el) {
      el.scrollBy({ left: dir * 300, behavior: 'smooth' });
    }
  };

  const parseCarriage = (e: React.DragEvent): Carriage | null => {
    const raw = e.dataTransfer.getData(CARRIAGE_MIME);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Carriage;
    } catch {
      return null;
    }
  };
  const parseReorder = (e: React.DragEvent): string | null => {
    const raw = e.dataTransfer.getData(REORDER_MIME);
    return raw || null;
  };

  const handleDropAt = useCallback(
    (e: React.DragEvent, insertIdx: number) => {
      e.preventDefault();
      e.stopPropagation();
      setActiveDropIdx(null);

      const newCarriage = parseCarriage(e);
      if (newCarriage) {
        addCarriage(newCarriage, insertIdx);
        return;
      }
      const instId = parseReorder(e);
      if (instId) {
        const fromIdx = marshalling.findIndex((m) => m.instanceId === instId);
        if (fromIdx === -1) return;
        let target = insertIdx;
        if (fromIdx < target) target--;
        if (fromIdx !== target) reorderCarriage(fromIdx, target);
      }
    },
    [addCarriage, reorderCarriage, marshalling],
  );

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
          <div className="flex items-end gap-0 min-w-max px-2 relative">
            <Locomotive />

            {marshalling.map((mc, idx) => (
              <div key={mc.instanceId} className="flex items-end">
                <DropZone
                  index={idx}
                  isActive={activeDropIdx === idx}
                  isReorderSource={draggingInstanceId === mc.instanceId}
                  onEnter={() => setActiveDropIdx(idx)}
                  onLeave={() =>
                    setActiveDropIdx((cur) => (cur === idx ? null : cur))
                  }
                  onDrop={(e) => handleDropAt(e, idx)}
                />
                <CarriageSlotWrapper
                  mc={mc}
                  index={idx}
                  isReordering={draggingInstanceId === mc.instanceId}
                  onReorderStart={(id) => setDraggingInstanceId(id)}
                  onReorderEnd={() => setDraggingInstanceId(null)}
                />
              </div>
            ))}

            <DropZone
              index={marshalling.length}
              isActive={activeDropIdx === marshalling.length}
              isWide
              onEnter={() => setActiveDropIdx(marshalling.length)}
              onLeave={() =>
                setActiveDropIdx((cur) => (cur === marshalling.length ? null : cur))
              }
              onDrop={(e) => handleDropAt(e, marshalling.length)}
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

/* =========================== DROP ZONE =========================== */
interface DropZoneProps {
  index: number;
  isActive: boolean;
  isWide?: boolean;
  isReorderSource?: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
}
function DropZone({
  isActive,
  isWide,
  isReorderSource,
  onEnter,
  onLeave,
  onDrop,
}: DropZoneProps) {
  return (
    <div
      className={`self-stretch flex items-center transition-all duration-200 ${
        isWide ? 'w-6 mx-1' : 'w-2'
      } ${isReorderSource ? 'opacity-30' : ''}`}
      onDragEnter={(e) => {
        if (
          e.dataTransfer.types.includes(CARRIAGE_MIME) ||
          e.dataTransfer.types.includes(REORDER_MIME)
        ) {
          e.preventDefault();
          onEnter();
        }
      }}
      onDragOver={(e) => {
        if (
          e.dataTransfer.types.includes(CARRIAGE_MIME) ||
          e.dataTransfer.types.includes(REORDER_MIME)
        ) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
        }
      }}
      onDragLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        const to = e.relatedTarget as HTMLElement | null;
        if (to && el.contains(to)) return;
        onLeave();
      }}
      onDrop={onDrop}
    >
      <div
        className={`mx-auto rounded-full transition-all duration-200 ${
          isActive
            ? 'w-1.5 h-24 bg-brass-400 animate-pulse'
            : isWide
            ? 'w-0.5 h-20 bg-coal-600/60'
            : 'w-0.5 h-10 bg-coal-600/30'
        }`}
        style={
          isActive
            ? { boxShadow: '0 0 12px rgba(200,155,60,0.9), 0 0 24px rgba(200,155,60,0.4)' }
            : undefined
        }
      />
    </div>
  );
}

/* ======================== CARRIAGE SLOT WRAPPER ======================== */
interface SlotWrapperProps {
  mc: MarshalledCarriage;
  index: number;
  isReordering: boolean;
  onReorderStart: (id: string) => void;
  onReorderEnd: () => void;
}
function CarriageSlotWrapper({ mc, index, isReordering, onReorderStart, onReorderEnd }: SlotWrapperProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData(REORDER_MIME, mc.instanceId);
    e.dataTransfer.setData('text/plain', mc.instanceId);
    onReorderStart(mc.instanceId);
    const target = e.currentTarget as HTMLElement;
    e.dataTransfer.setDragImage(target, target.offsetWidth / 2, target.offsetHeight / 2);
  };
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onReorderEnd}
      className={`transition-all duration-200 cursor-grab active:cursor-grabbing ${
        isReordering ? 'opacity-30 scale-95' : 'hover:-translate-y-1'
      }`}
    >
      <CarriageSlot mc={mc} index={index} />
    </div>
  );
}

/* =========================== LOCOMOTIVE =========================== */
function Locomotive() {
  return (
    <div className="relative mr-3 animate-float-up flex-shrink-0">
      <div
        className="w-28 h-36 rounded-t-2xl relative flex flex-col items-center justify-end pb-4"
        style={{
          background: 'linear-gradient(180deg, #865b22 0%, #5a3c1f 40%, #3d2815 100%)',
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
            background: 'linear-gradient(180deg, #c89b3c 0%, #865b22 100%)',
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
        background: 'radial-gradient(circle, #c89b3c 0%, #865b22 60%, #3d2815 100%)',
        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.6)',
      }}
    />
  );
}
