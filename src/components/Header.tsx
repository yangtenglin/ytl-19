import { Train, Save, FolderOpen, RotateCcw, Award } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function Header() {
  const {
    currentPlan,
    validation,
    setPlanDrawerOpen,
    setShowNameDialog,
    resetCurrentPlan,
  } = useAppStore();

  const gradeColors: Record<string, string> = {
    S: 'text-brass-300 text-shadow-brass',
    A: 'text-patina-400',
    B: 'text-brass-400',
    C: 'text-yellow-400',
    D: 'text-orange-400',
    F: 'text-rust-400',
  };

  return (
    <header className="h-16 flex-shrink-0 border-b-2 border-coal-600 bg-metal-brush relative">
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: 'repeating-linear-gradient(90deg, transparent 0, transparent 40px, rgba(200,155,60,0.06) 40px, rgba(200,155,60,0.06) 41px)'
      }} />
      <div className="h-full px-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #ecc062, #c89b3c 50%, #865b22)',
              boxShadow: '0 0 16px rgba(200,155,60,0.4), inset 0 -2px 4px rgba(0,0,0,0.4), inset 0 2px 2px rgba(255,255,255,0.3)',
            }}
          >
            <Train className="w-5 h-5 text-coal-800" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-black tracking-wide text-brass-300 text-shadow-brass leading-none">
              月台调度员
            </h1>
            <p className="text-[10px] font-mono text-coal-300 tracking-[0.2em] uppercase mt-0.5">
              Platform Dispatcher
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="parchment-panel px-4 py-2 flex items-center gap-3">
            <div className="text-xs font-mono text-coal-300 uppercase tracking-wider">当前方案</div>
            <div className="font-mono text-sm text-brass-200 font-medium max-w-[180px] truncate">
              {currentPlan.name}
            </div>
            <div className="h-6 w-px bg-coal-500" />
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-brass-400" />
              <span className={`font-display text-xl font-black ${gradeColors[validation.grade]}`}>
                {validation.grade}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="metal-button" onClick={() => setShowNameDialog(true)}>
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                <span>保存方案</span>
              </div>
            </button>
            <button className="metal-button" onClick={() => setPlanDrawerOpen(true)}>
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                <span>方案库</span>
              </div>
            </button>
            <button className="metal-button danger" onClick={resetCurrentPlan}>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                <span>重置</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
