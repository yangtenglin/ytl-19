import { useState } from 'react';
import { X, Trash2, Copy, Download, Check } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { validatePlan } from '../engine/validation';
import { exportPlan } from '../storage/planStore';

function formatTime(ts: number): string {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day} ${hh}:${mm}`;
}

export default function PlanDrawer() {
  const {
    savedPlans,
    planDrawerOpen,
    setPlanDrawerOpen,
    currentPlan,
    loadPlanById,
    deletePlanById,
    duplicatePlan,
  } = useAppStore();

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleExport = (plan: typeof currentPlan) => {
    const json = exportPlan(plan);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${plan.name}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          planDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setPlanDrawerOpen(false)}
      />
      <aside
        className={`fixed right-0 top-0 h-full w-[420px] bg-coal-700 z-50 shadow-2xl border-l-2 border-coal-600 transition-transform duration-300 ${
          planDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-16 border-b-2 border-coal-600 bg-metal-brush flex items-center justify-between px-5">
          <h2 className="font-display text-xl font-bold text-brass-300 tracking-wide">
            方案档案库
          </h2>
          <button
            className="w-9 h-9 rounded flex items-center justify-center text-coal-300 hover:text-brass-300 hover:bg-coal-600/50 transition-all"
            onClick={() => setPlanDrawerOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="h-[calc(100%-4rem)] overflow-y-auto scrollbar-thin p-4 space-y-3">
          {savedPlans.length === 0 && (
            <div className="parchment-panel p-8 text-center mt-8">
              <div className="font-mono text-xs text-coal-300 uppercase tracking-widest mb-3">
                档案库空空如也
              </div>
              <div className="text-sm text-coal-400">
                编组好列车后点击「保存方案」<br />将在此处留存你的调度杰作
              </div>
            </div>
          )}

          {savedPlans.map((plan) => {
            const v = validatePlan(plan);
            const isActive = plan.id === currentPlan.id;
            const gradeColorMap: Record<string, string> = {
              S: 'bg-brass-400 text-coal-800',
              A: 'bg-patina-500 text-coal-100',
              B: 'bg-brass-500 text-coal-800',
              C: 'bg-yellow-500 text-coal-800',
              D: 'bg-orange-500 text-coal-800',
              F: 'bg-rust-500 text-coal-100',
            };
            return (
              <div
                key={plan.id}
                className={`parchment-panel p-4 transition-all duration-200 hover:border-brass-400/50 ${
                  isActive ? 'ring-2 ring-brass-400/50 border-brass-400/40' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-display text-sm font-black ${gradeColorMap[v.grade]}`}
                      >
                        {v.grade}
                      </span>
                      <h3 className="font-mono text-brass-200 font-medium truncate">
                        {plan.name}
                      </h3>
                    </div>
                    <div className="font-mono text-[10px] text-coal-400 tracking-wide">
                      更新于 {formatTime(plan.updatedAt)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-4 text-center">
                  <div className="bg-coal-800/60 rounded p-2">
                    <div className="text-[10px] text-coal-400 uppercase">车厢</div>
                    <div className="font-mono text-sm text-brass-300 font-bold">
                      {plan.marshalling.length}
                    </div>
                  </div>
                  <div className="bg-coal-800/60 rounded p-2">
                    <div className="text-[10px] text-coal-400 uppercase">货物</div>
                    <div className="font-mono text-sm text-brass-300 font-bold">
                      {plan.marshalling.reduce((s, mc) => s + mc.cargos.length, 0)}
                    </div>
                  </div>
                  <div className="bg-coal-800/60 rounded p-2">
                    <div className="text-[10px] text-coal-400 uppercase">发车</div>
                    <div className="font-mono text-xs text-brass-300 font-bold pt-0.5">
                      {plan.departure?.label || '—'}
                    </div>
                  </div>
                  <div className="bg-coal-800/60 rounded p-2">
                    <div className="text-[10px] text-coal-400 uppercase">罚分</div>
                    <div
                      className={`font-mono text-sm font-bold ${
                        v.totalPenalty === 0
                          ? 'text-patina-400'
                          : v.totalPenalty < 80
                          ? 'text-yellow-400'
                          : 'text-rust-400'
                      }`}
                    >
                      {v.totalPenalty}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="metal-button primary flex-1 !py-1.5 !text-xs"
                    onClick={() => loadPlanById(plan.id)}
                    disabled={isActive}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>{isActive ? '当前方案' : '加载'}</span>
                    </div>
                  </button>
                  <button
                    className="metal-button !p-2 !px-3"
                    title="复制方案"
                    onClick={() => duplicatePlan(plan.id)}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    className="metal-button !p-2 !px-3"
                    title="导出 JSON"
                    onClick={() => handleExport(plan)}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  {confirmDelete === plan.id ? (
                    <button
                      className="metal-button danger !p-2 !px-3"
                      title="确认删除"
                      onClick={() => {
                        deletePlanById(plan.id);
                        setConfirmDelete(null);
                      }}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      className="metal-button danger !p-2 !px-3"
                      title="删除方案"
                      onClick={() => setConfirmDelete(plan.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
