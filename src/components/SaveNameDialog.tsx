import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function SaveNameDialog() {
  const { showNameDialog, setShowNameDialog, currentPlan, saveCurrentPlan } = useAppStore();
  const [name, setName] = useState(currentPlan.name);

  if (!showNameDialog) return null;

  const handleSave = () => {
    const n = name.trim() || `方案 ${new Date().toLocaleString('zh-CN')}`;
    saveCurrentPlan(n);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setShowNameDialog(false)}
      />
      <div className="relative brass-plate w-[420px] p-6 animate-float-up">
        <div className="absolute -top-3 -left-3 w-5 h-5 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #ecc062, #c89b3c 50%, #865b22)',
            boxShadow: '0 0 8px rgba(200,155,60,0.3)',
          }}
        />
        <div className="absolute -top-3 -right-3 w-5 h-5 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #ecc062, #c89b3c 50%, #865b22)',
            boxShadow: '0 0 8px rgba(200,155,60,0.3)',
          }}
        />
        <button
          onClick={() => setShowNameDialog(false)}
          className="absolute top-3 right-3 w-7 h-7 rounded flex items-center justify-center text-coal-400 hover:text-brass-300 hover:bg-coal-600/50 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="font-display text-xl font-bold text-brass-300 mb-1">保存方案</h2>
        <p className="font-mono text-[11px] text-coal-400 uppercase tracking-widest mb-6">
          ARCHIVE YOUR MASTERPIECE
        </p>

        <label className="block mb-2 font-mono text-xs text-coal-300 uppercase tracking-wider">
          方案名称
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
          className="w-full bg-coal-800/80 border-2 border-coal-500 rounded px-4 py-3 font-mono text-brass-200
            focus:border-brass-400 focus:outline-none focus:ring-2 focus:ring-brass-400/30
            placeholder-coal-500 transition-all"
          placeholder="为这个调度方案起个名字..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
          }}
        />

        <div className="mt-6 flex justify-end gap-3">
          <button className="metal-button" onClick={() => setShowNameDialog(false)}>
            取消
          </button>
          <button className="metal-button primary" onClick={handleSave}>
            <div className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              <span>确认归档</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
