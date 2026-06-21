import type { ValidationResult } from '../../types';
import { Scale, Box, AlertTriangle } from 'lucide-react';

interface Props {
  validation: ValidationResult;
}

export default function ProgressBars({ validation }: Props) {
  const weightRatio =
    validation.totalMaxWeight > 0
      ? Math.min(1.5, validation.totalWeight / validation.totalMaxWeight)
      : 0;
  const capacityRatio =
    validation.totalCapacity > 0
      ? validation.usedCapacity / validation.totalCapacity
      : 0;
  const overloadPct =
    validation.totalMaxWeight > 0 && validation.totalWeight > validation.totalMaxWeight
      ? ((validation.totalWeight - validation.totalMaxWeight) / validation.totalMaxWeight) * 100
      : 0;

  const weightColor =
    overloadPct > 50
      ? 'bg-gradient-to-r from-rust-500 via-rust-400 to-orange-500'
      : overloadPct > 0
      ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
      : weightRatio > 0.85
      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
      : 'bg-gradient-to-r from-patina-400 to-patina-500';

  const capacityColor =
    capacityRatio > 0.95
      ? 'bg-gradient-to-r from-brass-400 to-brass-500'
      : capacityRatio > 0.7
      ? 'bg-gradient-to-r from-brass-500 to-brass-600'
      : 'bg-gradient-to-r from-brass-600 to-brass-700';

  return (
    <div className="brass-plate p-4 space-y-4">
      <h3 className="font-mono text-[11px] uppercase tracking-widest text-brass-400 font-bold border-b border-brass-500/20 pb-2">
        装载状态监控
      </h3>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-brass-400" />
              <span className="font-mono text-[11px] text-coal-300 uppercase">
                列车总载重
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-coal-100">
              {validation.totalWeight.toFixed(1)}
              <span className="text-coal-500 text-[10px]"> / {validation.totalMaxWeight.toFixed(0)}t</span>
            </span>
          </div>
          <div className="progress-track h-3">
            <div
              className={`progress-fill ${weightColor}`}
              style={{ width: `${Math.min(100, weightRatio * 100)}%` }}
            />
          </div>
          {overloadPct > 0 && (
            <div className="flex items-center gap-1 mt-1 font-mono text-[10px] text-rust-400">
              <AlertTriangle className="w-3 h-3" />
              <span>超出 {overloadPct.toFixed(0)}%，部分车厢已超重</span>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-brass-400" />
              <span className="font-mono text-[11px] text-coal-300 uppercase">
                容量利用率
              </span>
            </div>
            <span className="font-mono text-xs font-bold text-coal-100">
              {validation.usedCapacity}
              <span className="text-coal-500 text-[10px]"> / {validation.totalCapacity} 件</span>
              <span className="text-brass-400 ml-1.5">
                ({(capacityRatio * 100).toFixed(0)}%)
              </span>
            </span>
          </div>
          <div className="progress-track h-3">
            <div
              className={`progress-fill ${capacityColor}`}
              style={{ width: `${Math.min(100, capacityRatio * 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-brass-500/10">
        <StatCell label="车厢数" value={validation.totalCapacity > 0 ? Math.round(validation.usedCapacity > 0 ? (validation.totalMaxWeight / (validation.totalMaxWeight / 8 || 1)) : 0) : 0} suffix="节" />
        <StatCell
          label="载重效率"
          value={validation.totalMaxWeight > 0 ? Math.round((validation.totalWeight / validation.totalMaxWeight) * 100) : 0}
          suffix="%"
        />
        <StatCell
          label="单件均重"
          value={validation.usedCapacity > 0 ? (validation.totalWeight / validation.usedCapacity).toFixed(1) : '0'}
          suffix="t"
        />
      </div>
    </div>
  );
}

function StatCell({ label, value, suffix }: { label: string; value: number | string; suffix: string }) {
  return (
    <div className="bg-coal-800/50 rounded p-2 text-center">
      <div className="text-[9px] text-coal-400 uppercase tracking-wider font-mono mb-0.5">
        {label}
      </div>
      <div className="font-mono font-bold text-sm text-brass-300">
        {value}
        <span className="text-[10px] text-coal-500 ml-0.5">{suffix}</span>
      </div>
    </div>
  );
}
