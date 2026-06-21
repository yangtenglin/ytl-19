import { useAppStore } from '../../store/useAppStore';
import StatusLeds from './StatusLeds';
import ProgressBars from './ProgressBars';
import PenaltyGauge from './PenaltyGauge';
import PenaltyBreakdown from './PenaltyBreakdown';
import CargoIssueList from './CargoIssueList';
import { Activity } from 'lucide-react';

export default function ValidationPanel() {
  const { validation, currentPlan } = useAppStore();
  const hasAnyIssue =
    validation.overloadedCarriages.length > 0 ||
    validation.misroutedCargos.length > 0 ||
    validation.delayedCargos.length > 0;

  return (
    <aside className="w-[340px] h-full flex flex-col bg-coal-700/80 border-l-2 border-coal-600 backdrop-blur-sm overflow-hidden">
      <div className="h-14 border-b-2 border-coal-600 bg-metal-brush flex items-center justify-between px-5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-brass-400" />
          <span className="font-mono text-sm uppercase tracking-widest text-brass-300 font-bold">
            实时校验
          </span>
        </div>
        <StatusLeds validation={validation} />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
        <PenaltyGauge validation={validation} />
        <ProgressBars validation={validation} />
        <PenaltyBreakdown validation={validation} />
        {hasAnyIssue && (
          <CargoIssueList
            validation={validation}
            marshalling={currentPlan.marshalling}
          />
        )}
        {!hasAnyIssue && validation.totalPenalty === 0 && currentPlan.marshalling.length > 0 && (
          <PerfectBadge />
        )}
      </div>
    </aside>
  );
}

function PerfectBadge() {
  return (
    <div className="brass-plate p-6 text-center animate-float-up">
      <div
        className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, #ffe07a, #c89b3c 50%, #865b22)',
          boxShadow:
            '0 0 32px rgba(200,155,60,0.6), inset 0 -3px 6px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.4)',
        }}
      >
        🏆
      </div>
      <div className="font-display text-2xl font-black text-brass-300 mb-1 text-shadow-brass tracking-wide">
        PERFECT SCORE
      </div>
      <div className="font-mono text-xs text-coal-300 uppercase tracking-widest">
        完美调度 · 零罚分
      </div>
    </div>
  );
}
