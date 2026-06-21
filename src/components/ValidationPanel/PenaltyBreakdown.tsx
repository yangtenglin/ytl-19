import type { ValidationResult } from '../../types';
import { AlertTriangle, MapPin, Clock } from 'lucide-react';

interface Props {
  validation: ValidationResult;
}

interface ItemProps {
  icon: typeof AlertTriangle;
  label: string;
  value: number;
  color: string;
  count: number;
  maxBar?: number;
}

export default function PenaltyBreakdown({ validation }: Props) {
  const items: ItemProps[] = [
    {
      icon: AlertTriangle,
      label: '超重罚分',
      value: validation.overweightPenalty,
      color: 'rust',
      count: validation.overloadedCarriages.length,
      maxBar: 100,
    },
    {
      icon: MapPin,
      label: '错站罚分',
      value: validation.misroutePenalty,
      color: 'yellow',
      count: validation.misroutedCargos.length,
      maxBar: 100,
    },
    {
      icon: Clock,
      label: '延误罚分',
      value: validation.delayPenalty,
      color: 'orange',
      count: validation.delayedCargos.length,
      maxBar: 120,
    },
  ];

  const colorMap: Record<string, { bar: string; text: string; bg: string; icon: string }> = {
    rust: {
      bar: 'bg-gradient-to-r from-rust-600 to-rust-400',
      text: 'text-rust-400',
      bg: 'bg-rust-500/20',
      icon: 'text-rust-400',
    },
    yellow: {
      bar: 'bg-gradient-to-r from-yellow-600 to-yellow-400',
      text: 'text-yellow-400',
      bg: 'bg-yellow-500/20',
      icon: 'text-yellow-400',
    },
    orange: {
      bar: 'bg-gradient-to-r from-orange-600 to-orange-400',
      text: 'text-orange-400',
      bg: 'bg-orange-500/20',
      icon: 'text-orange-400',
    },
  };

  return (
    <div className="brass-plate p-4 space-y-4">
      <h3 className="font-mono text-[11px] uppercase tracking-widest text-brass-400 font-bold border-b border-brass-500/20 pb-2">
        罚分明细
      </h3>

      <div className="space-y-3">
        {items.map((it) => {
          const c = colorMap[it.color];
          const Icon = it.icon;
          const barPct = it.maxBar ? Math.min(100, (it.value / it.maxBar) * 100) : 0;
          return (
            <div key={it.label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded flex items-center justify-center ${c.bg}`}>
                    <Icon className={`w-3.5 h-3.5 ${c.icon}`} />
                  </span>
                  <span className="font-mono text-[11px] text-coal-300">
                    {it.label}
                  </span>
                  {it.count > 0 && (
                    <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${c.bg} ${c.text} font-bold`}>
                      ×{it.count}
                    </span>
                  )}
                </div>
                <span className={`font-mono text-sm font-black ${c.text}`}>
                  {it.value}
                </span>
              </div>
              <div className="progress-track">
                <div
                  className={`progress-fill ${c.bar}`}
                  style={{ width: `${barPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-brass-500/20 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-widest text-coal-400 font-bold">
          合计罚分
        </span>
        <span
          className={`font-display text-2xl font-black ${
            validation.totalPenalty === 0
              ? 'text-brass-300'
              : validation.totalPenalty < 80
              ? 'text-yellow-400'
              : 'text-rust-400'
          }`}
        >
          {validation.totalPenalty}
        </span>
      </div>
    </div>
  );
}
