import { useMemo } from 'react';
import type { ValidationResult } from '../../types';

interface Props {
  validation: ValidationResult;
}

const MAX_PENALTY_FOR_GAUGE = 400;

export default function PenaltyGauge({ validation }: Props) {
  const percentage = useMemo(() => {
    return Math.min(1, validation.totalPenalty / MAX_PENALTY_FOR_GAUGE);
  }, [validation.totalPenalty]);

  const strokeDasharray = 283;
  const strokeDashoffset = strokeDasharray * (1 - percentage);

  const getColor = () => {
    if (validation.totalPenalty === 0) return '#c89b3c';
    if (validation.totalPenalty < 30) return '#4a7c6b';
    if (validation.totalPenalty < 80) return '#e5a93a';
    if (validation.totalPenalty < 150) return '#f6ad55';
    if (validation.totalPenalty < 250) return '#dd6b20';
    return '#b0413e';
  };

  const gradeColors: Record<string, { text: string; glow: string }> = {
    S: { text: '#ecc062', glow: 'drop-shadow(0 0 12px rgba(236,192,98,0.7))' },
    A: { text: '#5d9783', glow: 'drop-shadow(0 0 10px rgba(93,151,131,0.6))' },
    B: { text: '#e5a93a', glow: 'drop-shadow(0 0 10px rgba(229,169,58,0.6))' },
    C: { text: '#f6ad55', glow: 'drop-shadow(0 0 10px rgba(246,173,85,0.6))' },
    D: { text: '#dd6b20', glow: 'drop-shadow(0 0 10px rgba(221,107,32,0.6))' },
    F: { text: '#b0413e', glow: 'drop-shadow(0 0 12px rgba(176,65,62,0.7))' },
  };

  const gc = gradeColors[validation.grade];

  return (
    <div className="brass-plate p-5">
      <h3 className="font-mono text-[11px] uppercase tracking-widest text-brass-400 font-bold text-center mb-4">
        综合罚分仪表
      </h3>

      <div className="relative w-full aspect-[2/1.15]">
        <svg viewBox="0 0 200 130" className="w-full h-full">
          <defs>
            <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4a7c6b" />
              <stop offset="25%" stopColor="#e5a93a" />
              <stop offset="55%" stopColor="#f6ad55" />
              <stop offset="80%" stopColor="#dd6b20" />
              <stop offset="100%" stopColor="#b0413e" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            d="M 25 110 A 75 75 0 0 1 175 110"
            fill="none"
            stroke="rgba(26,20,16,0.8)"
            strokeWidth="14"
            strokeLinecap="round"
          />

          <path
            d="M 25 110 A 75 75 0 0 1 175 110"
            fill="none"
            stroke="url(#gauge-gradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            filter="url(#glow)"
            className="transition-all duration-1000 ease-out"
            style={{ transitionDuration: '1.2s' }}
          />

          {[0, 25, 50, 75, 100].map((pct) => {
            const angle = Math.PI * (1 - pct / 100);
            const innerR = 58;
            const outerR = 70;
            const cx = 100,
              cy = 110;
            const x1 = cx + Math.cos(angle) * innerR;
            const y1 = cy - Math.sin(angle) * innerR;
            const x2 = cx + Math.cos(angle) * outerR;
            const y2 = cy - Math.sin(angle) * outerR;
            return (
              <line
                key={pct}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(200,155,60,0.5)"
                strokeWidth="1.5"
              />
            );
          })}

          {(() => {
            const angle = Math.PI * (1 - percentage);
            const cx = 100,
              cy = 110,
              r = 48;
            const nx = cx + Math.cos(angle) * r;
            const ny = cy - Math.sin(angle) * r;
            return (
              <line
                x1={cx}
                y1={cy}
                x2={nx}
                y2={ny}
                stroke={getColor()}
                strokeWidth="3"
                strokeLinecap="round"
                filter="url(#glow)"
                style={{
                  transition: 'all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transformOrigin: `${cx}px ${cy}px`,
                }}
              />
            );
          })()}

          <circle cx={100} cy={110} r={7} fill="#2a1d16" stroke="#c89b3c" strokeWidth="1.5" filter="url(#glow)" />
        </svg>

        <div className="absolute inset-x-0 bottom-1 flex flex-col items-center">
          <div
            className="font-display font-black text-6xl leading-none tracking-tight"
            style={{ color: gc.text, filter: gc.glow }}
          >
            {validation.totalPenalty}
          </div>
          <div className="font-mono text-[10px] text-coal-400 uppercase tracking-[0.3em] mt-1">
            TOTAL PENALTY
          </div>
        </div>

        <div
          className="absolute top-1 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center font-display font-black text-3xl border-2"
          style={{
            color: gc.text,
            borderColor: gc.text + '66',
            background:
              'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.05), rgba(26,20,16,0.8))',
            boxShadow: `inset 0 0 16px ${gc.text}22, 0 0 16px ${gc.text}22`,
          }}
        >
          {validation.grade}
        </div>
      </div>

      <div className="flex justify-between mt-3 px-2 font-mono text-[9px] text-coal-500 uppercase tracking-wider">
        <span>0 优秀</span>
        <span>100</span>
        <span>200</span>
        <span>300+</span>
      </div>
    </div>
  );
}
