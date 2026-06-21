import type { ValidationResult } from '../../types';

interface Props {
  validation: ValidationResult;
}

export default function StatusLeds({ validation }: Props) {
  const weightOk = validation.overloadedCarriages.length === 0;
  const routeOk = validation.misroutedCargos.length === 0;
  const delayOk = validation.delayedCargos.length === 0;

  const getLedClass = (ok: boolean, hasData: boolean) => {
    if (!hasData) return 'led-off';
    if (ok) return 'led-green';
    return 'led-red animate-led-blink';
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5" title="载重状态">
        <span className={getLedClass(weightOk, validation.totalMaxWeight > 0)} />
        <span className="text-[10px] font-mono text-coal-400 uppercase tracking-wider">
          载重
        </span>
      </div>
      <div className="flex items-center gap-1.5" title="路线状态">
        <span className={getLedClass(routeOk, validation.usedCapacity > 0)} />
        <span className="text-[10px] font-mono text-coal-400 uppercase tracking-wider">
          路线
        </span>
      </div>
      <div className="flex items-center gap-1.5" title="时限状态">
        <span className={getLedClass(delayOk, !!(validation.delayedCargos.length || validation.usedCapacity > 0))} />
        <span className="text-[10px] font-mono text-coal-400 uppercase tracking-wider">
          时限
        </span>
      </div>
    </div>
  );
}
