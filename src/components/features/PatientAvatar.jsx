import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../i18n.jsx';

const STATE_STYLES = {
  critical: { color: '#EF4444', ecg: '#FF5555', border: 'rgba(239,68,68,0.45)', bar: 'linear-gradient(90deg, #DC2626, #F87171)' },
  unstable: { color: '#F59E0B', ecg: '#38BDF8', border: 'rgba(245,158,11,0.4)', bar: 'linear-gradient(90deg, #D97706, #FBBF24)' },
  improving: { color: '#22C55E', ecg: '#22FF99', border: 'rgba(34,197,94,0.4)', bar: 'linear-gradient(90deg, #16A34A, #4ADE80)' },
  stable: { color: '#22C55E', ecg: '#22FF99', border: 'rgba(34,197,94,0.4)', bar: 'linear-gradient(90deg, #16A34A, #4ADE80)' },
};

function normalizeState(state) {
  if (state === 'deteriorating') return 'critical';
  return STATE_STYLES[state] ? state : 'unstable';
}

function skinFor(hp) {
  if (hp <= 0) return '#9CA3AF';
  if (hp > 70) return '#E2B98F';
  if (hp > 40) return '#D9A9A0';
  return '#B9A9A9';
}

/** Animated patient bust: breathing, blinking, talking mouth, distress reactions. */
function PatientFigure({ gender, state, hp, speaking, thinking, hit, healed }) {
  const dead = hp <= 0;
  const critical = state === 'critical' && !dead;
  const skin = skinFor(hp);
  const female = gender === 'female';
  const hair = female ? '#5B3A29' : '#3B2A20';
  const breathDuration = critical ? '0.8s' : state === 'unstable' ? '1.6s' : '3s';

  return (
    <svg
      viewBox="0 0 120 130"
      width="100%"
      height="100%"
      aria-hidden="true"
      style={{
        overflow: 'visible',
        animation: hit ? 'pa-hit 0.6s ease' : healed ? 'pa-heal 0.8s ease' : 'none',
        transformOrigin: '50% 80%',
      }}
    >
      {/* Shoulders / chest (breathing) */}
      <g style={{
        transformOrigin: '60px 125px',
        animation: dead ? 'none' : `pa-breath ${breathDuration} ease-in-out infinite`,
      }}>
        <path d="M14 130 C14 100 34 92 60 92 C86 92 106 100 106 130 Z" fill={female ? '#F472B6' : '#38BDF8'} />
        <path d="M46 92 L60 112 L74 92 Z" fill="#F8FAFC" />
      </g>

      {/* Neck */}
      <rect x="50" y="78" width="20" height="18" rx="6" fill={skin} />

      {/* Head group (slight sway / distress) */}
      <g style={{
        transformOrigin: '60px 80px',
        animation: dead ? 'none' : critical ? 'pa-sway-fast 0.9s ease-in-out infinite' : 'pa-sway 4s ease-in-out infinite',
      }}>
        {/* Hair back */}
        {female && <path d="M26 56 C22 90 30 96 36 96 L36 50 Z M94 56 C98 90 90 96 84 96 L84 50 Z" fill={hair} />}
        {/* Ears */}
        <circle cx="29" cy="58" r="6" fill={skin} />
        <circle cx="91" cy="58" r="6" fill={skin} />
        {/* Face */}
        <ellipse cx="60" cy="56" rx="31" ry="34" fill={skin} />
        {/* Hair top */}
        <path
          d={female
            ? 'M28 52 C26 26 44 16 60 16 C78 16 94 26 92 52 C84 40 70 34 60 34 C50 34 36 40 28 52 Z'
            : 'M30 48 C28 26 44 18 60 18 C76 18 92 26 90 48 C84 38 72 32 60 32 C48 32 36 38 30 48 Z'}
          fill={hair}
        />

        {/* Eyebrows */}
        <path d={critical ? 'M38 44 L52 48' : 'M38 46 L52 45'} stroke={hair} strokeWidth="3" strokeLinecap="round" />
        <path d={critical ? 'M82 44 L68 48' : 'M82 46 L68 45'} stroke={hair} strokeWidth="3" strokeLinecap="round" />

        {/* Eyes */}
        {dead ? (
          <g stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round">
            <path d="M40 54 L50 62 M50 54 L40 62" />
            <path d="M70 54 L80 62 M80 54 L70 62" />
          </g>
        ) : (
          <g style={{
            transformOrigin: '60px 58px',
            animation: hp > 0 && !critical ? 'pa-blink 4.5s infinite' : 'pa-blink 2.4s infinite',
          }}>
            <ellipse cx="45" cy="58" rx="5" ry={critical ? 4 : 5.5} fill="#fff" />
            <ellipse cx="75" cy="58" rx="5" ry={critical ? 4 : 5.5} fill="#fff" />
            <circle cx={thinking ? 47 : 45} cy="58.5" r="2.6" fill="#1F2937" />
            <circle cx={thinking ? 77 : 75} cy="58.5" r="2.6" fill="#1F2937" />
          </g>
        )}

        {/* Nose */}
        <path d="M60 60 C58 68 56 70 60 71" stroke="rgba(0,0,0,0.22)" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Mouth */}
        {dead ? (
          <path d="M50 84 L70 84" stroke="#374151" strokeWidth="3" strokeLinecap="round" />
        ) : speaking ? (
          <ellipse
            cx="60" cy="84" rx="8" ry="5" fill="#7F1D1D"
            style={{ transformOrigin: '60px 84px', animation: 'pa-talk 0.32s ease-in-out infinite' }}
          />
        ) : critical ? (
          <path d="M50 88 Q60 80 70 88" stroke="#7F1D1D" strokeWidth="3" fill="none" strokeLinecap="round" />
        ) : state === 'unstable' ? (
          <path d="M51 85 L69 85" stroke="#7F1D1D" strokeWidth="3" strokeLinecap="round" />
        ) : (
          <path d="M50 82 Q60 91 70 82" stroke="#7F1D1D" strokeWidth="3" fill="none" strokeLinecap="round" />
        )}

        {/* Sweat drops when critical */}
        {critical && (
          <g fill="#7DD3FC">
            <path d="M88 38 q-4 7 0 10 q4 -3 0 -10 z" style={{ animation: 'pa-drip 1.4s ease-in infinite' }} />
            <path d="M32 40 q-4 7 0 10 q4 -3 0 -10 z" style={{ animation: 'pa-drip 1.4s ease-in 0.6s infinite' }} />
          </g>
        )}
      </g>
    </svg>
  );
}

function VitalCell({ label, value, unit, color }) {
  return (
    <div style={{ textAlign: 'center', padding: '8px 2px', minWidth: 0 }}>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.8px', color: 'rgba(255,255,255,0.45)' }}>{label}</div>
      <div
        key={value}
        style={{
          fontSize: 'clamp(15px, 4.6vw, 20px)', fontWeight: 800, color, lineHeight: 1.15,
          animation: 'pa-flash 1.2s ease',
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', minHeight: 11 }}>{unit}</div>
    </div>
  );
}

export default function PatientAvatar({
  healthPercent = 0,
  visualState = 'unstable',
  patientAge = null,
  patientGender = null,
  vitals = {},
  speaking = false,
  thinking = false,
}) {
  const { t } = useTranslation();
  const ecgRef = useRef(null);
  const prevHpRef = useRef(healthPercent);
  const [reaction, setReaction] = useState(null); // 'hit' | 'healed'

  const state = normalizeState(visualState);
  const style = STATE_STYLES[state];
  const hp = Math.max(0, Math.min(100, Number(healthPercent) || 0));
  const dead = hp <= 0;
  const hr = Number(vitals?.hr) > 0 ? Number(vitals.hr) : null;

  const stateLabels = {
    critical: t('sim.state.critical', 'KRITIK'),
    unstable: t('sim.state.unstable', 'BESAROR'),
    improving: t('sim.state.improving', 'YAXSHILANMOQDA'),
    stable: t('sim.state.stable', 'BARQAROR'),
  };
  const label = dead ? t('sim.state.dead', 'HAYOT BELGILARI YO‘Q') : stateLabels[state];

  // React to health changes
  useEffect(() => {
    if (hp === prevHpRef.current) return undefined;
    const next = hp < prevHpRef.current ? 'hit' : 'healed';
    prevHpRef.current = hp;
    setReaction(next);
    const timer = setTimeout(() => setReaction(null), 900);
    return () => clearTimeout(timer);
  }, [hp]);

  // ECG trace
  useEffect(() => {
    const canvas = ecgRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const midY = H / 2;
    const beatLen = Math.max(24, Math.floor(1800 / (hr || 75)));
    let raf;
    let x = 0;
    let prevY = midY;
    let phase = 0;

    ctx.fillStyle = '#080C14';
    ctx.fillRect(0, 0, W, H);

    const draw = () => {
      ctx.fillStyle = 'rgba(8, 12, 20, 0.22)';
      ctx.fillRect(x, 0, 14, H);

      let y = midY;
      if (!dead) {
        phase = (phase + 1) % beatLen;
        if (phase === 6) y = midY - 5;
        else if (phase === 11) y = midY + 4;
        else if (phase === 13) y = midY - (state === 'critical' ? 14 : 24);
        else if (phase === 15) y = midY + 10;
        else if (phase === 20) y = midY - 8;
        y += (Math.random() - 0.5) * (state === 'critical' ? 2.2 : 0.8);
      }

      ctx.beginPath();
      ctx.strokeStyle = style.ecg;
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.shadowColor = style.ecg;
      ctx.shadowBlur = 6;
      ctx.moveTo(x === 0 ? 0 : x - 2, prevY);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.shadowBlur = 0;

      prevY = y;
      x = (x + 2) % W;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [hr, state, dead, style.ecg]);

  const spo2Color = vitals?.spo2 != null && vitals.spo2 < 90 ? '#F87171' : '#22D3EE';
  const hrColor = hr && (hr > 120 || hr < 50) ? '#F87171' : '#4ADE80';
  const demographics = [
    patientAge ? `${patientAge} ${t('sim.yearsShort', 'yosh')}` : null,
    patientGender ? (patientGender === 'female' ? t('sim.female', 'Ayol') : t('sim.male', 'Erkak')) : null,
  ].filter(Boolean).join(' • ');

  return (
    <div style={{
      width: '100%',
      background: 'linear-gradient(180deg, #0B1220 0%, #060A12 100%)',
      borderRadius: 20,
      border: `1.5px solid ${style.border}`,
      boxShadow: '0 10px 30px rgba(2, 6, 23, 0.35)',
      overflow: 'hidden',
      boxSizing: 'border-box',
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
    }}>
      {/* Status row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '10px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <span style={{
            width: 9, height: 9, borderRadius: '50%', background: style.color, flexShrink: 0,
            boxShadow: `0 0 10px ${style.color}`, animation: 'pa-dot 1.2s ease-in-out infinite',
          }} />
          <span style={{
            fontSize: 11, fontWeight: 800, letterSpacing: '1.2px', color: style.color,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {label}
          </span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>
          {demographics}
        </span>
      </div>

      {/* Body: figure + ECG */}
      <div style={{ display: 'flex', gap: 12, padding: '0 14px 10px 14px', alignItems: 'center' }}>
        <div style={{
          width: 96, height: 104, flexShrink: 0, position: 'relative',
          borderRadius: 16, background: `radial-gradient(circle at 50% 40%, ${style.color}26 0%, transparent 72%)`,
        }}>
          <PatientFigure
            gender={patientGender}
            state={state}
            hp={hp}
            speaking={speaking}
            thinking={thinking}
            hit={reaction === 'hit'}
            healed={reaction === 'healed'}
          />
          {speaking && (
            <div style={{ position: 'absolute', right: -2, top: 2, display: 'flex', gap: 2, alignItems: 'flex-end', height: 14 }}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{
                  width: 3, background: '#38BDF8', borderRadius: 2, height: '100%',
                  transformOrigin: 'bottom', animation: `pa-wave 0.7s ease-in-out ${i * 0.15}s infinite`,
                }} />
              ))}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            position: 'relative', height: 62, borderRadius: 12, overflow: 'hidden',
            background: '#080C14', border: `1px solid ${style.border}`,
          }}>
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }} />
            <canvas ref={ecgRef} width={320} height={62} style={{ width: '100%', height: '100%', display: 'block', position: 'relative' }} />
          </div>

          {/* Health bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1px', color: 'rgba(255,255,255,0.4)' }}>
                {t('sim.patientCondition', 'BEMOR HOLATI')}
              </span>
              <span style={{ fontSize: 11, fontWeight: 800, color: style.color }}>{hp}%</span>
            </div>
            <div style={{ height: 7, borderRadius: 99, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${hp}%`, borderRadius: 99, background: style.bar,
                transition: 'width 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Vitals */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.25)',
      }}>
        <VitalCell label="SpO₂" value={vitals?.spo2 != null ? `${vitals.spo2}` : '--'} unit="%" color={spo2Color} />
        <VitalCell label={t('sim.vitalHr', 'PULS')} value={hr ? `${hr}` : '--'} unit="bpm" color={hrColor} />
        <VitalCell label={t('sim.vitalBp', 'QON BOSIMI')} value={vitals?.bp ?? '--'} unit="mmHg" color="#22D3EE" />
        <VitalCell label={t('sim.vitalRr', 'NAFAS')} value={vitals?.rr != null ? `${vitals.rr}` : '--'} unit="/min" color="#A78BFA" />
      </div>

      <style>{`
        @keyframes pa-breath { 0%,100% { transform: scale(1); } 50% { transform: scale(1.035) translateY(-1px); } }
        @keyframes pa-sway { 0%,100% { transform: rotate(-1.2deg); } 50% { transform: rotate(1.2deg); } }
        @keyframes pa-sway-fast { 0%,100% { transform: rotate(-2.5deg) translateY(0); } 50% { transform: rotate(2.5deg) translateY(1px); } }
        @keyframes pa-blink { 0%, 92%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.08); } }
        @keyframes pa-talk { 0%,100% { transform: scaleY(0.35); } 50% { transform: scaleY(1.15); } }
        @keyframes pa-drip { 0% { transform: translateY(-4px); opacity: 0; } 30% { opacity: 1; } 100% { transform: translateY(14px); opacity: 0; } }
        @keyframes pa-hit { 0%,100% { transform: translateX(0); } 15% { transform: translateX(-6px) rotate(-3deg); } 40% { transform: translateX(6px) rotate(3deg); } 65% { transform: translateX(-4px); } 85% { transform: translateX(3px); } }
        @keyframes pa-heal { 0% { transform: scale(1); filter: brightness(1); } 40% { transform: scale(1.06); filter: brightness(1.25); } 100% { transform: scale(1); filter: brightness(1); } }
        @keyframes pa-dot { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
        @keyframes pa-wave { 0%,100% { transform: scaleY(0.3); } 50% { transform: scaleY(1); } }
        @keyframes pa-flash { 0% { opacity: 0.3; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) { svg * { animation: none !important; } }
      `}</style>
    </div>
  );
}
