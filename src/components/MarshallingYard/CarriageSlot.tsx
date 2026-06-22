import { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { AlertTriangle, X, GripVertical, MapPin } from 'lucide-react';
import type { MarshalledCarriage, Cargo } from '../../types';
import { getCarriageUtilization } from '../../engine/validation';

interface Props {
  mc: MarshalledCarriage;
  index: number;
}

export default function CarriageSlot({ mc, index }: Props) {
  const {
    removeCarriage,
    addCargoToCarriage,
    removeCargoFromCarriage,
    validation,
  } = useAppStore();

  const [cargoDragOver, setCargoDragOver] = useState(false);
  const util = getCarriageUtilization(mc);
  const overload = validation.overloadedCarriages.find(
    (o) => o.instanceId === mc.instanceId,
  );
  const mcMisrouteIds = new Set(
    validation.misroutedCargos
      .filter((m) => mc.cargos.some((c) => c.id === m.cargoId))
      .map((m) => m.cargoId),
  );
  const mcDelayIds = new Set(
    validation.delayedCargos
      .filter((d) => mc.cargos.some((c) => c.id === d.cargoId))
      .map((d) => d.cargoId),
  );

  const weightColor = overload
    ? 'bg-gradient-to-r from-rust-500 to-rust-400'
    : util.weightRatio > 0.85
    ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
    : 'bg-gradient-to-r from-patina-500 to-patina-400';
  const capacityColor =
    util.capacityRatio > 0.9
      ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
      : 'bg-gradient-to-r from-brass-500 to-brass-400';

  const dominantStation = (() => {
    const counts: Record<string, number> = {};
    mc.cargos.forEach((c) => {
      counts[c.destination] = (counts[c.destination] || 0) + 1;
    });
    const arr = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return arr.length > 0 ? arr[0][0] : null;
  })();

  return (
    <div
      className={`relative group ${overload ? 'animate-shake' : ''}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div
        className={`relative rivet-border w-44 transition-all duration-200 ${
          overload
            ? 'ring-2 ring-rust-500/60 border-rust-500/50'
            : 'hover:ring-2 hover:ring-brass-400/30'
        }`}
        style={{
          background: `linear-gradient(180deg, ${mc.carriage.color}ee 0%, ${mc.carriage.color}aa 60%, ${mc.carriage.color}77 100%)`,
        }}
      >
        <div className="absolute inset-x-0 top-0 h-5 flex items-center justify-between px-2 bg-black/20 rounded-t-md">
          <div className="flex items-center gap-1 text-brass-200/80 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
            <GripVertical className="w-3 h-3" />
          </div>
          <div className="font-mono text-[10px] font-bold text-coal-900/70 tracking-widest uppercase">
            {mc.carriage.type} · {String(index + 1).padStart(2, '0')}
          </div>
          <button
            onClick={() => removeCarriage(mc.instanceId)}
            className="w-4 h-4 rounded flex items-center justify-center text-coal-900/50 hover:text-rust-900 hover:bg-rust-500/40 transition-all opacity-0 group-hover:opacity-100"
            title="移除车厢"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        <div
          className={`drop-target mt-5 mx-2 mb-2 min-h-[92px] rounded p-1.5 ${
            cargoDragOver
              ? 'drag-over'
              : 'bg-black/15 border border-black/20'
          }`}
          onDragEnter={(e) => {
            if (e.dataTransfer.types.includes('application/x-cargo')) {
              setCargoDragOver(true);
            }
          }}
          onDragLeave={() => setCargoDragOver(false)}
          onDragOver={(e) => {
            if (!e.dataTransfer.types.includes('application/x-cargo')) return;
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'copy';
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setCargoDragOver(false);
            const raw = e.dataTransfer.getData('application/x-cargo');
            if (!raw) return;
            try {
              const cargo = JSON.parse(raw) as Cargo;
              addCargoToCarriage(mc.instanceId, cargo);
            } catch {}
          }}
        >
          {mc.cargos.length === 0 ? (
            <div className="h-[80px] flex items-center justify-center font-mono text-[10px] text-coal-900/40 text-center leading-relaxed">
              拖入货物<br />装载到此车厢
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-1">
              {mc.cargos.map((cargo) => {
                const hasMisroute = mcMisrouteIds.has(cargo.id);
                const hasDelay = mcDelayIds.has(cargo.id);
                return (
                  <div
                    key={cargo.id}
                    className={`group/cargo relative aspect-square rounded flex items-center justify-center text-lg transition-all ${
                      hasMisroute || hasDelay
                        ? 'bg-rust-500/60 ring-1 ring-rust-300/50 animate-led-blink'
                        : 'bg-white/15 hover:bg-white/25'
                    }`}
                    title={`${cargo.name} → ${cargo.destination} (${cargo.weight}t)`}
                  >
                    <span>{cargo.emoji}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCargoFromCarriage(mc.instanceId, cargo.id);
                      }}
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rust-600 text-white text-[9px] flex items-center justify-center opacity-0 group-hover/cargo:opacity-100 transition-opacity hover:scale-110 shadow"
                    >
                      ×
                    </button>
                    {hasMisroute && (
                      <AlertTriangle className="absolute -bottom-1 -right-1 w-3 h-3 text-yellow-300 drop-shadow" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-2 pb-2 space-y-1.5">
          {dominantStation && (
            <div className="flex items-center gap-1 font-mono text-[10px] text-coal-900/60">
              <MapPin className="w-3 h-3" />
              主要目的：<span className="font-bold">{dominantStation}</span>
            </div>
          )}

          <div className="space-y-1">
            <div className="flex items-center justify-between font-mono text-[9px] text-coal-900/70">
              <span>载重</span>
              <span className="font-bold">
                {util.weight.toFixed(1)} / {mc.carriage.maxWeight}t
              </span>
            </div>
            <div className="progress-track">
              <div
                className={`progress-fill ${weightColor}`}
                style={{ width: `${Math.min(100, util.weightRatio * 100)}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between font-mono text-[9px] text-coal-900/70">
              <span>容量</span>
              <span className="font-bold">
                {util.capacityUsed} / {mc.carriage.capacity}
              </span>
            </div>
            <div className="progress-track">
              <div
                className={`progress-fill ${capacityColor}`}
                style={{ width: `${Math.min(100, util.capacityRatio * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-around mt-[-2px]">
        <SmallWheel />
        <SmallWheel />
      </div>
    </div>
  );
}

function SmallWheel() {
  return (
    <div
      className="w-5 h-5 rounded-full border border-coal-900"
      style={{
        background:
          'radial-gradient(circle, #ecc062 0%, #865b22 65%, #3d2815 100%)',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.5)',
      }}
    />
  );
}
