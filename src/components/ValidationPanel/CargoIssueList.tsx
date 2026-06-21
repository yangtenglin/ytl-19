import { AlertTriangle, Clock, MapPin, TrendingDown, AlertOctagon } from 'lucide-react';
import type { ValidationResult, MarshalledCarriage } from '../../types';

interface Props {
  validation: ValidationResult;
  marshalling: MarshalledCarriage[];
}

export default function CargoIssueList({ validation, marshalling }: Props) {
  const overloadIssues = validation.overloadedCarriages.map((o, idx) => {
    const mc = marshalling.find((m) => m.instanceId === o.instanceId);
    const slotIdx = marshalling.findIndex((m) => m.instanceId === o.instanceId);
    return {
      id: `overload-${idx}`,
      type: 'overload' as const,
      title: `第 ${slotIdx + 1} 节 ${mc?.carriage.type || '车厢'}`,
      subtitle: `超出 ${o.overBy.toFixed(1)} 吨载重上限`,
    };
  });

  const misrouteIssues = validation.misroutedCargos.map((m, idx) => ({
    id: `misroute-${idx}`,
    type: 'misroute' as const,
    title: m.cargoName,
    subtitle: `目的：${m.expectedStation}，但当前编组方向为 ${m.actualStation}`,
  }));

  const delayIssues = validation.delayedCargos.map((d, idx) => ({
    id: `delay-${idx}`,
    type: 'delay' as const,
    title: d.cargoName,
    subtitle: `超出时限 ${d.delayedBy} 小时`,
  }));

  const all = [...overloadIssues, ...misrouteIssues, ...delayIssues];

  const typeConfig = {
    overload: {
      icon: AlertOctagon,
      iconColor: 'text-rust-400',
      iconBg: 'bg-rust-500/20',
      badgeText: '超重',
      badgeBg: 'bg-rust-500/30',
      badgeColor: 'text-rust-300',
    },
    misroute: {
      icon: MapPin,
      iconColor: 'text-yellow-400',
      iconBg: 'bg-yellow-500/20',
      badgeText: '错站',
      badgeBg: 'bg-yellow-500/30',
      badgeColor: 'text-yellow-300',
    },
    delay: {
      icon: Clock,
      iconColor: 'text-orange-400',
      iconBg: 'bg-orange-500/20',
      badgeText: '延误',
      badgeBg: 'bg-orange-500/30',
      badgeColor: 'text-orange-300',
    },
  };

  return (
    <div className="brass-plate p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-brass-500/20 pb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rust-400 animate-led-blink" />
          <h3 className="font-mono text-[11px] uppercase tracking-widest text-rust-400 font-bold">
            问题清单
          </h3>
        </div>
        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-rust-500/20 text-rust-300 font-bold">
          {all.length} 项
        </span>
      </div>

      <div className="space-y-2 max-h-[320px] overflow-y-auto scrollbar-thin pr-1">
        {all.map((issue) => {
          const cfg = typeConfig[issue.type];
          const Icon = cfg.icon;
          return (
            <div
              key={issue.id}
              className="bg-coal-800/60 border border-coal-600/60 rounded p-2.5 hover:border-coal-500/60 transition-all animate-float-up"
            >
              <div className="flex items-start gap-2.5">
                <div className={`w-7 h-7 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.iconBg}`}>
                  <Icon className={`w-4 h-4 ${cfg.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-sm text-coal-100 font-medium truncate">
                      {issue.title}
                    </span>
                    <span
                      className={`font-mono text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider ${cfg.badgeBg} ${cfg.badgeColor} font-bold flex-shrink-0`}
                    >
                      {cfg.badgeText}
                    </span>
                  </div>
                  <div className="font-mono text-[10px] text-coal-400 leading-relaxed">
                    {issue.subtitle}
                  </div>
                </div>
                <TrendingDown className={`w-3.5 h-3.5 flex-shrink-0 mt-1 ${cfg.iconColor} opacity-60`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
