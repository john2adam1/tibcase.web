import React, { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from '../../i18n.jsx';

const STATE_STYLES = {
  critical: { color: '#EF4444', ecg: '#FF5555', border: 'rgba(239,68,68,0.45)', bar: 'linear-gradient(90deg, #DC2626, #F87171)' },
  unstable: { color: '#F59E0B', ecg: '#38BDF8', border: 'rgba(245,158,11,0.4)', bar: 'linear-gradient(90deg, #D97706, #FBBF24)' },
  improving: { color: '#22C55E', ecg: '#22FF99', border: 'rgba(34,197,94,0.4)', bar: 'linear-gradient(90deg, #16A34A, #4ADE80)' },
  stable: { color: '#22C55E', ecg: '#22FF99', border: 'rgba(34,197,94,0.4)', bar: 'linear-gradient(90deg, #16A34A, #4ADE80)' },
};

const SKIP_VITAL_KEYS = new Set(['bp_sys', 'bp_dia', 'heart_rate', 'temperature']);
const PAIN_KEYS = ['pain', 'pain_score', 'nrs'];

function normalizeState(state) {
  if (state === 'deteriorating') return 'critical';
  return STATE_STYLES[state] ? state : 'unstable';
}

function hasValue(value) {
  if (value === null || value === undefined || value === '') return false;
  if (typeof value === 'number' && (Number.isNaN(value) || value === 0)) return false;
  if (value === '0') return false;
  return true;
}

function formatVitalValue(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Number.isInteger(value) ? String(value) : String(Math.round(value * 10) / 10);
  }
  return String(value);
}

function pickPain(vitals) {
  for (const key of PAIN_KEYS) {
    if (hasValue(vitals?.[key])) return vitals[key];
  }
  return null;
}

function VitalCell({ label, value, unit, color }) {
  return (
    <div style={{ textAlign: 'center', padding: '5px 2px 6px', minWidth: 0 }}>
      <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.7px', color: 'rgba(255,255,255,0.45)' }}>{label}</div>
      <div style={{ fontSize: 'clamp(13px, 3.4vw, 16px)', fontWeight: 800, color, lineHeight: 1.1 }}>
        {value}
      </div>
      {unit ? (
        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)' }}>{unit}</div>
      ) : null}
    </div>
  );
}

function buildVitalCells({ vitals, patientAge, patientGender, t }) {
  const cells = [];
  const used = new Set();

  if (hasValue(patientAge)) {
    cells.push({
      key: 'age',
      label: t('sim.vitalAge', 'YOSH'),
      value: formatVitalValue(patientAge),
      unit: t('sim.yearsShort', 'yosh'),
      color: '#E2E8F0',
    });
  }

  if (hasValue(patientGender)) {
    cells.push({
      key: 'gender',
      label: t('sim.vitalGender', 'JINS'),
      value: patientGender === 'female' ? t('sim.female', 'Ayol') : t('sim.male', 'Erkak'),
      color: '#E2E8F0',
    });
  }

  const known = [
    {
      key: 'spo2',
      label: 'SpO₂',
      unit: '%',
      color: (v) => (Number(v) < 90 ? '#F87171' : '#22D3EE'),
    },
    {
      key: 'hr',
      label: t('sim.vitalHr', 'PULS'),
      unit: 'bpm',
      color: (v) => {
        const n = Number(v);
        return n && (n > 120 || n < 50) ? '#F87171' : '#4ADE80';
      },
    },
    {
      key: 'bp',
      label: t('sim.vitalBp', 'QON BOSIMI'),
      unit: 'mmHg',
      color: '#22D3EE',
    },
    {
      key: 'rr',
      label: t('sim.vitalRr', 'NAFAS'),
      unit: '/min',
      color: '#A78BFA',
    },
    {
      key: 'temp',
      label: t('sim.vitalTemp', 'HARORAT'),
      unit: '°C',
      color: '#FBBF24',
    },
    {
      key: 'gcs',
      label: t('sim.vitalGcs', 'GCS'),
      color: '#E2E8F0',
    },
    {
      key: 'rhythm',
      label: t('sim.vitalRhythm', 'RITM'),
      color: '#67E8F9',
    },
  ];

  known.forEach((spec) => {
    const value = vitals?.[spec.key];
    if (!hasValue(value)) return;
    used.add(spec.key);
    cells.push({
      key: spec.key,
      label: spec.label,
      value: formatVitalValue(value),
      unit: spec.unit,
      color: typeof spec.color === 'function' ? spec.color(value) : spec.color,
    });
  });

  const pain = pickPain(vitals);
  if (hasValue(pain)) {
    PAIN_KEYS.forEach((key) => used.add(key));
    const painStr = formatVitalValue(pain);
    cells.push({
      key: 'pain',
      label: t('sim.vitalPain', "OG'RIQ"),
      value: painStr,
      unit: /\/\s*\d+/.test(painStr) ? '' : '/10',
      color: Number(pain) >= 7 ? '#F87171' : '#FB923C',
    });
  }

  Object.entries(vitals || {}).forEach(([key, value]) => {
    if (used.has(key) || SKIP_VITAL_KEYS.has(key) || PAIN_KEYS.includes(key)) return;
    if (!hasValue(value) || typeof value === 'object') return;
    used.add(key);
    cells.push({
      key,
      label: String(key).replace(/_/g, ' ').toUpperCase(),
      value: formatVitalValue(value),
      color: '#E2E8F0',
    });
  });

  return cells;
}

export default function PatientAvatar({
  healthPercent = 0,
  visualState = 'unstable',
  patientAge = null,
  patientGender = null,
  vitals = {},
}) {
  const { t } = useTranslation();
  const ecgRef = useRef(null);

  const state = normalizeState(visualState);
  const style = STATE_STYLES[state];
  const hp = Math.max(0, Math.min(100, Number(healthPercent) || 0));
  const dead = hp <= 0;
  const hr = hasValue(vitals?.hr) ? Number(vitals.hr) : null;
  const cells = useMemo(
    () => buildVitalCells({ vitals, patientAge, patientGender, t }),
    [vitals, patientAge, patientGender, t],
  );

  const stateLabels = {
    critical: t('sim.state.critical', 'KRITIK'),
    unstable: t('sim.state.unstable', 'BESAROR'),
    improving: t('sim.state.improving', 'YAXSHILANMOQDA'),
    stable: t('sim.state.stable', 'BARQAROR'),
  };
  const label = dead ? t('sim.state.dead', 'HAYOT BELGILARI YO‘Q') : stateLabels[state];

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
        if (phase === 6) y = midY - 3;
        else if (phase === 11) y = midY + 2;
        else if (phase === 13) y = midY - (state === 'critical' ? 8 : 13);
        else if (phase === 15) y = midY + 6;
        else if (phase === 20) y = midY - 4;
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

  return (
    <div style={{
      width: '100%',
      background: 'linear-gradient(180deg, #0B1220 0%, #060A12 100%)',
      borderRadius: 14,
      border: `1px solid ${style.border}`,
      boxShadow: '0 6px 18px rgba(2, 6, 23, 0.28)',
      overflow: 'hidden',
      boxSizing: 'border-box',
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px 4px' }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%', background: style.color, flexShrink: 0,
          boxShadow: `0 0 8px ${style.color}`,
        }} />
        <span style={{
          fontSize: 10, fontWeight: 800, letterSpacing: '1px', color: style.color,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
        }}>
          {label}
        </span>
        <span style={{ fontSize: 10, fontWeight: 800, color: style.color, flexShrink: 0 }}>{hp}%</span>
      </div>

      <div style={{ padding: '0 10px 6px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', width: `${hp}%`, borderRadius: 99, background: style.bar,
            transition: 'width 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
          }} />
        </div>
        <div style={{
          position: 'relative', height: 36, borderRadius: 8, overflow: 'hidden',
          background: '#080C14', border: `1px solid ${style.border}`,
        }}>
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '14px 14px',
          }} />
          <canvas ref={ecgRef} width={320} height={36} style={{ width: '100%', height: '100%', display: 'block', position: 'relative' }} />
        </div>
      </div>

      {cells.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(cells.length, 4)}, minmax(0, 1fr))`,
          borderTop: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(0,0,0,0.25)',
        }}>
          {cells.map((cell) => (
            <VitalCell key={cell.key} label={cell.label} value={cell.value} unit={cell.unit} color={cell.color} />
          ))}
        </div>
      )}
    </div>
  );
}
