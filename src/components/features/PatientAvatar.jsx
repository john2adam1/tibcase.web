import React, { useEffect, useRef, useState, useCallback } from 'react';

export default function PatientAvatar({
  healthPercent = 75,
  visualState = 'unstable',
  patientAge = 45,
  patientGender = 'male',
  vitals = { hr: 90, spo2: 95, bp: '88/54', rr: 26, temp: 36.8 },
  animateChange = false,
}) {
  const ecgRef = useRef(null);
  const [shake, setShake] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [deltaDir, setDeltaDir] = useState(null);
  const [heartBeat, setHeartBeat] = useState(false);
  const [changedVitals, setChangedVitals] = useState({});
  const prevRef = useRef(healthPercent);
  const prevVitalsRef = useRef(vitals);

  // HP animatsiyasi
  useEffect(() => {
    if (healthPercent !== prevRef.current) {
      const dir = healthPercent > prevRef.current ? 'up' : 'down';
      setDeltaDir(dir);
      if (dir === 'down') { setShake(true); setTimeout(() => setShake(false), 700); }
      else { setPulse(true); setTimeout(() => setPulse(false), 800); }
      setTimeout(() => setDeltaDir(null), 1600);
      prevRef.current = healthPercent;
    }
  }, [healthPercent]);

  // Vitals o'zgarganda highlight
  useEffect(() => {
    const prev = prevVitalsRef.current;
    const changed = {};
    if (prev.hr !== vitals.hr) changed.hr = true;
    if (prev.spo2 !== vitals.spo2) changed.spo2 = true;
    if (prev.bp !== vitals.bp) changed.bp = true;
    if (prev.rr !== vitals.rr) changed.rr = true;
    if (Object.keys(changed).length > 0) {
      setChangedVitals(changed);
      setTimeout(() => setChangedVitals({}), 1800);
    }
    prevVitalsRef.current = vitals;
  }, [vitals]);

  // Yurak urishi animatsiyasi
  useEffect(() => {
    const hr = vitals?.hr || 75;
    const interval = Math.max(300, Math.round(60000 / hr));
    const timer = setInterval(() => {
      setHeartBeat(true);
      setTimeout(() => setHeartBeat(false), 180);
    }, interval);
    return () => clearInterval(timer);
  }, [vitals?.hr]);

  // ECG canvas
  useEffect(() => {
    const canvas = ecgRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let x = 0;
    let prevY = canvas.height / 2;
    let beatPhase = 0;

    const isCritical = visualState === 'critical' || visualState === 'deteriorating';
    const isStable = visualState === 'stable' || visualState === 'improving';
    const ecgColor = isCritical ? '#FF4444' : isStable ? '#00FF88' : '#00CCFF';
    const hr = vitals?.hr || 80;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      const midY = H / 2;
      const beatLen = Math.max(22, Math.floor(1800 / hr));

      // Trail effect — past yozuvni siz o'chirib emas, xira qiling
      ctx.fillStyle = 'rgba(8, 12, 20, 0.18)';
      ctx.fillRect(x, 0, 16, H);

      let targetY = midY;
      beatPhase = (beatPhase + 1) % beatLen;

      if (beatPhase === 6)  targetY = midY - 5;
      else if (beatPhase === 8) targetY = midY;
      else if (beatPhase === 11) targetY = midY + 4;
      else if (beatPhase === 13) targetY = midY - (isCritical ? 16 : 28);
      else if (beatPhase === 15) targetY = midY + 12;
      else if (beatPhase === 20) targetY = midY - 9;
      else if (beatPhase === 24) targetY = midY;

      targetY += (Math.random() - 0.5) * (isCritical ? 2.5 : 1.0);

      // Glow line
      ctx.beginPath();
      ctx.strokeStyle = ecgColor + '44';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.moveTo(x === 0 ? 0 : x - 2, prevY);
      ctx.lineTo(x, targetY);
      ctx.stroke();

      // Sharp line on top
      ctx.beginPath();
      ctx.strokeStyle = ecgColor;
      ctx.lineWidth = 1.8;
      ctx.shadowColor = ecgColor;
      ctx.shadowBlur = 8;
      ctx.lineCap = 'round';
      ctx.moveTo(x === 0 ? 0 : x - 2, prevY);
      ctx.lineTo(x, targetY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      prevY = targetY;
      x = (x + 2) % W;
      raf = requestAnimationFrame(draw);
    };

    ctx.fillStyle = '#080C14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [vitals?.hr, visualState]);

  const cfg = getConfig(visualState);
  const hp = Math.max(0, Math.min(100, healthPercent));
  const skinTone = hp > 70 ? '#C8A878' : hp > 40 ? '#C09090' : '#909090';

  const breathAnim = shake
    ? 'patientShake 0.6s ease'
    : pulse
    ? 'patientPulse 0.7s ease'
    : visualState === 'critical'
    ? 'patientBreath 0.7s ease-in-out infinite'
    : visualState === 'improving' || visualState === 'stable'
    ? 'patientBreath 3s ease-in-out infinite'
    : 'patientBreath 1.6s ease-in-out infinite';

  return (
    <div style={{
      width: '100%',
      background: 'linear-gradient(180deg, #0A0F1A 0%, #060A12 100%)',
      borderRadius: 22,
      border: `1.5px solid ${cfg.borderColor}`,
      boxShadow: `0 12px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05), 0 0 0 1px rgba(255,255,255,0.03)`,
      overflow: 'hidden',
      boxSizing: 'border-box',
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
      position: 'relative',
    }}>

      {/* Subtle scanline overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
      }} />

      {/* ─── TOP STATUS BAR ─── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 16px',
        background: 'rgba(0,0,0,0.3)',
        borderBottom: `1px solid ${cfg.borderColor}44`,
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 9, height: 9, borderRadius: '50%',
            background: cfg.dotColor,
            boxShadow: `0 0 10px ${cfg.dotColor}, 0 0 20px ${cfg.dotColor}60`,
            display: 'inline-block',
            animation: 'dotBlink 1s ease-in-out infinite',
            flexShrink: 0,
          }} />
          <span style={{ fontSize: '11px', fontWeight: 800, color: cfg.dotColor, letterSpacing: '1.5px' }}>
            {cfg.stateLabel}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>
            {patientAge}y &bull; {patientGender === 'female' ? 'Ayol' : 'Erkak'}
          </span>
          <div style={{
            background: `${cfg.dotColor}18`,
            border: `1px solid ${cfg.dotColor}50`,
            borderRadius: 8,
            padding: '2px 10px',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>HP</span>
            <span style={{ fontSize: '16px', fontWeight: 900, color: cfg.hpColor, letterSpacing: '-0.5px' }}>
              {hp}%
            </span>
            {deltaDir && (
              <span style={{
                fontSize: '14px', fontWeight: 900,
                color: deltaDir === 'up' ? '#00FF88' : '#FF4444',
                animation: 'fadeSlide 1.5s ease forwards',
              }}>
                {deltaDir === 'up' ? '↑' : '↓'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ─── MAIN BODY: Avatar left, ECG+badges right ─── */}
      <div style={{
        display: 'flex', alignItems: 'stretch', gap: 0,
        position: 'relative', zIndex: 1,
      }}>

        {/* ── PATIENT FIGURE (left column) ── */}
        <div style={{
          width: 130,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center',
          padding: '14px 8px 10px 14px',
          borderRight: `1px solid ${cfg.borderColor}30`,
          flexShrink: 0,
          position: 'relative',
        }}>
          {/* Glow aura behind figure */}
          <div style={{
            position: 'absolute',
            width: 90, height: 90,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${cfg.dotColor}25 0%, transparent 70%)`,
            animation: 'auraPulse 2s ease-in-out infinite',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -55%)',
          }} />

          <div style={{ animation: breathAnim, position: 'relative', zIndex: 1 }}>
            <PatientFigureSVG
              gender={patientGender}
              state={visualState}
              skinTone={skinTone}
              hp={hp}
              heartBeat={heartBeat}
            />
          </div>

          {/* Skin / condition label */}
          <div style={{
            marginTop: 6,
            fontSize: '9px',
            color: hp > 70 ? '#86EFAC' : hp > 40 ? '#FBBF24' : '#F87171',
            fontWeight: 700, letterSpacing: '0.4px',
            textAlign: 'center',
          }}>
            {hp > 70 ? '✦ Normal' : hp > 40 ? '⚡ Pale' : '⚠ Ashen'}
          </div>
        </div>

        {/* ── RIGHT COLUMN: ECG + SpO2/HR ── */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          padding: '12px 14px 10px 12px', gap: 8,
        }}>
          {/* ECG */}
          <div style={{
            background: '#080C14',
            borderRadius: 12,
            border: `1px solid ${cfg.ecgBorder}`,
            position: 'relative', overflow: 'hidden',
            height: 70,
            boxShadow: `inset 0 0 20px rgba(0,0,0,0.5), 0 0 12px ${cfg.glowColor}20`,
          }}>
            {/* Grid overlay */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              backgroundImage: `linear-gradient(${cfg.ecgGrid} 1px, transparent 1px),
                                linear-gradient(90deg, ${cfg.ecgGrid} 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
            }} />
            <canvas
              ref={ecgRef}
              width={320} height={70}
              style={{ width: '100%', height: '100%', display: 'block', position: 'relative', zIndex: 1 }}
            />
          </div>

          {/* SpO2 + HR badges */}
          <div style={{ display: 'flex', gap: 8 }}>
            {/* SpO2 */}
            <VitalBadge
              label="SpO₂"
              value={`${vitals?.spo2 ?? 95}%`}
              color="#22D3EE"
              glow="#22D3EE"
              changed={changedVitals.spo2}
              bg="rgba(34,211,238,0.08)"
              border="rgba(34,211,238,0.25)"
            />
            {/* HR with heartbeat */}
            <VitalBadge
              label="HR"
              value={`${vitals?.hr ?? 90}`}
              unit="bpm"
              color={vitals?.hr > 120 ? '#FF6B6B' : vitals?.hr < 60 ? '#60A5FA' : '#22C55E'}
              glow={vitals?.hr > 120 ? '#FF6B6B' : '#22C55E'}
              changed={changedVitals.hr}
              bg="rgba(34,197,94,0.08)"
              border="rgba(34,197,94,0.25)"
              heartBeat={heartBeat}
            />
          </div>
        </div>
      </div>

      {/* ─── HP HEALTH BAR ─── */}
      <div style={{ padding: '2px 16px 8px 16px', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 5,
        }}>
          <span style={{ fontSize: '8.5px', color: 'rgba(255,255,255,0.3)', fontWeight: 700, letterSpacing: '1px' }}>
            BEMOR HOLATI
          </span>
          <span style={{ fontSize: '8.5px', color: cfg.hpColor, fontWeight: 800 }}>{hp}%</span>
        </div>
        {/* Bar track */}
        <div style={{
          width: '100%', height: 7, background: 'rgba(255,255,255,0.07)',
          borderRadius: 99, overflow: 'visible', position: 'relative',
        }}>
          {/* Animated fill */}
          <div style={{
            height: '100%', width: `${hp}%`,
            background: cfg.barGradient,
            borderRadius: 99,
            transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
            position: 'relative',
            boxShadow: `0 0 12px ${cfg.glowColor}80`,
          }}>
            {/* Moving shimmer */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 99,
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
              animation: 'shimmerBar 2s linear infinite',
              backgroundSize: '200% 100%',
            }} />
          </div>
          {/* Glow dot at edge */}
          {hp > 2 && (
            <div style={{
              position: 'absolute', top: '50%', left: `${hp}%`,
              transform: 'translate(-50%, -50%)',
              width: 11, height: 11, borderRadius: '50%',
              background: cfg.hpColor,
              boxShadow: `0 0 10px ${cfg.glowColor}, 0 0 20px ${cfg.glowColor}80`,
              transition: 'left 1s cubic-bezier(0.4,0,0.2,1)',
              zIndex: 2,
            }} />
          )}
        </div>
      </div>

      {/* ─── BOTTOM VITALS ROW ─── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        borderTop: `1px solid ${cfg.borderColor}30`,
        position: 'relative', zIndex: 1,
      }}>
        <BigVitalCell
          icon="♥"
          label="Yurak Urishi"
          value={`${vitals?.hr ?? 90}`}
          unit="bpm"
          color={vitals?.hr > 120 ? '#FF6B6B' : vitals?.hr < 60 ? '#60A5FA' : '#22C55E'}
          changed={changedVitals.hr}
          isLast={false}
          heartBeat={heartBeat}
          borderColor={cfg.borderColor}
        />
        <BigVitalCell
          icon="〜"
          label="Qon Bosimi"
          value={vitals?.bp ?? '120/80'}
          unit="mmHg"
          color="#22D3EE"
          changed={changedVitals.bp}
          isLast={false}
          borderColor={cfg.borderColor}
        />
        <BigVitalCell
          icon="≋"
          label="Nafas olish"
          value={`${vitals?.rr ?? 18}`}
          unit="/min"
          color="#A78BFA"
          changed={changedVitals.rr}
          isLast={true}
          borderColor={cfg.borderColor}
        />
      </div>

      <style>{`
        @keyframes patientBreath {
          0%, 100% { transform: translateY(0) scale(1); filter: drop-shadow(0 0 0px transparent); }
          50% { transform: translateY(-3px) scale(1.03); filter: drop-shadow(0 6px 12px rgba(0,0,0,0.4)); }
        }
        @keyframes patientShake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          10% { transform: translateX(-7px) rotate(-3deg); }
          30% { transform: translateX(7px) rotate(3deg); }
          50% { transform: translateX(-5px) rotate(-2deg); }
          70% { transform: translateX(5px) rotate(2deg); }
          90% { transform: translateX(-2px); }
        }
        @keyframes patientPulse {
          0% { transform: scale(1); filter: brightness(1); }
          35% { transform: scale(1.1); filter: brightness(1.3) drop-shadow(0 0 16px lime); }
          100% { transform: scale(1); filter: brightness(1); }
        }
        @keyframes dotBlink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.8); }
        }
        @keyframes auraPulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -55%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -55%) scale(1.15); }
        }
        @keyframes fadeSlide {
          0% { opacity: 0; transform: translateY(5px); }
          20% { opacity: 1; transform: translateY(-3px); }
          80% { opacity: 0.9; transform: translateY(-6px); }
          100% { opacity: 0; transform: translateY(-12px); }
        }
        @keyframes shimmerBar {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes vitalFlash {
          0% { background: rgba(255,255,100,0.25); transform: scale(1.04); }
          50% { background: rgba(255,255,100,0.12); transform: scale(1.02); }
          100% { background: transparent; transform: scale(1); }
        }
        @keyframes heartBeatAnim {
          0% { transform: scale(1); }
          30% { transform: scale(1.35); }
          60% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        @keyframes numberCountUp {
          from { opacity: 0.4; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 480px) {
          .vital-cell-responsive {
            padding: 8px 6px !important;
          }
          .vital-cell-responsive .vital-val {
            font-size: 16px !important;
          }
          .vital-cell-responsive .vital-lbl {
            font-size: 7.5px !important;
          }
          .vital-badge-responsive {
            padding: 4px 6px !important;
          }
          .vital-badge-responsive .vital-val {
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}

// ─── VitalBadge (SpO2, HR small) ──────────────────────────────────────────────
function VitalBadge({ label, value, unit, color, glow, changed, bg, border, heartBeat }) {
  return (
    <div
      className="vital-badge-responsive"
      style={{
        flex: 1,
        background: changed ? `${glow}22` : bg,
        border: `1px solid ${changed ? glow : border}`,
        borderRadius: 10,
        padding: '5px 10px',
        transition: 'all 0.4s ease',
        boxShadow: changed ? `0 0 14px ${glow}50` : 'none',
        animation: changed ? 'vitalFlash 1.5s ease' : 'none',
      }}
    >
      <div style={{ fontSize: '8px', color: color, fontWeight: 800, letterSpacing: '0.5px', opacity: 0.7 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        {heartBeat !== undefined && (
          <span style={{
            fontSize: '10px', color,
            display: 'inline-block',
            animation: heartBeat ? 'heartBeatAnim 0.3s ease' : 'none',
          }}>♥</span>
        )}
        <span
          className="vital-val"
          style={{
            fontSize: '20px', fontWeight: 900, color,
            textShadow: changed ? `0 0 12px ${glow}` : 'none',
            animation: changed ? 'numberCountUp 0.4s ease' : 'none',
            transition: 'text-shadow 0.5s ease',
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {unit && <span style={{ fontSize: '9px', color, opacity: 0.6, fontWeight: 700 }}>{unit}</span>}
      </div>
    </div>
  );
}

// ─── BigVitalCell (bottom row) ────────────────────────────────────────────────
function BigVitalCell({ icon, label, value, unit, color, changed, isLast, heartBeat, borderColor }) {
  return (
    <div
      className="vital-cell-responsive"
      style={{
        padding: '10px 14px',
        borderRight: isLast ? 'none' : `1px solid ${borderColor}25`,
        background: changed ? `${color}10` : 'transparent',
        transition: 'background 0.5s ease',
        animation: changed ? 'vitalFlash 1.6s ease' : 'none',
        boxShadow: changed ? `inset 0 0 20px ${color}15` : 'none',
      }}
    >
      {/* Icon + label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
        <span style={{
          fontSize: '13px', color,
          display: 'inline-block',
          animation: heartBeat && icon === '♥' ? 'heartBeatAnim 0.3s ease' : 'none',
          filter: changed ? `drop-shadow(0 0 4px ${color})` : 'none',
        }}>
          {icon}
        </span>
        <span
          className="vital-lbl"
          style={{
            fontSize: '8.5px', color: 'rgba(255,255,255,0.35)',
            fontWeight: 700, letterSpacing: '0.4px',
          }}
        >
          {label}
        </span>
      </div>
      {/* Value */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        <span
          className="vital-val"
          style={{
            fontSize: '20px', fontWeight: 900, color,
            textShadow: changed ? `0 0 16px ${color}` : 'none',
            animation: changed ? 'numberCountUp 0.4s ease' : 'none',
            transition: 'all 0.5s ease',
            letterSpacing: '-0.5px',
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: '9px', color, opacity: 0.55, fontWeight: 700 }}>{unit}</span>
        )}
      </div>
      {/* Changed indicator bar */}
      {changed && (
        <div style={{
          marginTop: 4, height: 2, borderRadius: 99,
          background: color,
          boxShadow: `0 0 8px ${color}`,
          animation: 'shimmerBar 1s linear',
        }} />
      )}
    </div>
  );
}

// ─── Config ───────────────────────────────────────────────────────────────────
function getConfig(state) {
  switch (state) {
    case 'stable': case 'improving':
      return {
        borderColor: '#166534', dotColor: '#00FF88', hpColor: '#4ADE80',
        glowColor: '#22C55E', ecgBorder: 'rgba(34,197,94,0.3)',
        ecgGrid: 'rgba(34,197,94,0.04)',
        barGradient: 'linear-gradient(90deg, #166534, #22C55E, #86EFAC)',
        stateLabel: state === 'improving' ? '↑ YAXSHILANMOQDA' : '● BARQAROR',
      };
    case 'critical': case 'deteriorating':
      return {
        borderColor: '#7F1D1D', dotColor: '#FF4444', hpColor: '#F87171',
        glowColor: '#EF4444', ecgBorder: 'rgba(239,68,68,0.35)',
        ecgGrid: 'rgba(239,68,68,0.04)',
        barGradient: 'linear-gradient(90deg, #450A0A, #EF4444, #FCA5A5)',
        stateLabel: state === 'deteriorating' ? '↓ YOMONLASHMOQDA' : '⚠ KRITIK',
      };
    default:
      return {
        borderColor: '#78350F', dotColor: '#F59E0B', hpColor: '#FCD34D',
        glowColor: '#F59E0B', ecgBorder: 'rgba(245,158,11,0.3)',
        ecgGrid: 'rgba(245,158,11,0.04)',
        barGradient: 'linear-gradient(90deg, #78350F, #F59E0B, #FDE68A)',
        stateLabel: '⚡ BEQAROR',
      };
  }
}

// ─── Patient SVG Figure ───────────────────────────────────────────────────────
function PatientFigureSVG({ gender, state, skinTone, hp, heartBeat }) {
  const isCritical = state === 'critical' || state === 'deteriorating';
  const isStable = state === 'stable' || state === 'improving';
  const eyeOpen = !isCritical;
  const tiltAngle = isCritical ? -12 : 0;
  const tilt = `rotate(${tiltAngle}, 50, 28)`;

  const chestColor = isCritical ? '#EF4444' : isStable ? '#22C55E' : '#F59E0B';
  const bodyTop = isCritical ? '#3A1515' : isStable ? '#0F2A1F' : '#2A1F0A';
  const bodyBot = isCritical ? '#1A0808' : isStable ? '#061A12' : '#180F03';

  return (
    <svg width="90" height="104" viewBox="0 0 90 104" fill="none">
      <defs>
        <radialGradient id="bodyG" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor={bodyTop} />
          <stop offset="100%" stopColor={bodyBot} />
        </radialGradient>
        <radialGradient id="headG" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor={skinTone} />
          <stop offset="80%" stopColor={skinTone} stopOpacity="0.75" />
        </radialGradient>
        <radialGradient id="shineG" cx="30%" cy="20%" r="70%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="figGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Shadow under figure */}
      <ellipse cx="45" cy="100" rx="28" ry="4" fill="rgba(0,0,0,0.5)" />

      {/* Torso */}
      <rect x="20" y="55" width="50" height="38" rx="13" fill="url(#bodyG)" />
      {/* Torso highlight */}
      <rect x="20" y="55" width="50" height="38" rx="13" fill="url(#shineG)" />
      {/* Torso panel line */}
      <rect x="30" y="63" width="30" height="22" rx="7" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />

      {/* Chest light (heart indicator) */}
      <circle
        cx="45" cy="74" r="7"
        fill={chestColor}
        opacity="0.9"
        filter="url(#figGlow)"
        style={{
          animation: heartBeat ? 'heartBeatAnim 0.3s ease' : 'none',
        }}
      />
      <circle cx="45" cy="74" r="3.5" fill="rgba(255,255,255,0.45)" />
      {/* Outer ring glow */}
      <circle cx="45" cy="74" r="9" fill="none" stroke={chestColor} strokeWidth="1.5" opacity="0.35" />

      {/* Arms */}
      <rect x="7" y="57" width="15" height="26" rx="8" fill="url(#bodyG)" />
      <rect x="68" y="57" width="15" height="26" rx="8" fill="url(#bodyG)" />
      {/* Arm highlights */}
      <rect x="9" y="59" width="9" height="12" rx="5" fill="rgba(255,255,255,0.05)" />
      <rect x="72" y="59" width="9" height="12" rx="5" fill="rgba(255,255,255,0.05)" />

      {/* Neck */}
      <rect x="37" y="46" width="16" height="12" rx="5" fill={skinTone} opacity="0.8" />

      {/* HEAD */}
      <ellipse cx="45" cy="30" rx="20" ry="19" fill="url(#headG)" transform={tilt} />
      {/* Head highlight */}
      <ellipse cx="40" cy="22" rx="10" ry="8" fill="rgba(255,255,255,0.1)" transform={tilt} />

      {/* Hair */}
      {gender === 'female' ? (
        <>
          <ellipse cx="45" cy="13" rx="20" ry="9" fill="#6B3A2A" transform={tilt} />
          <ellipse cx="26" cy="28" rx="6.5" ry="12" fill="#6B3A2A" transform={tilt} />
          <ellipse cx="64" cy="28" rx="6.5" ry="12" fill="#6B3A2A" transform={tilt} />
        </>
      ) : (
        <>
          <ellipse cx="45" cy="13" rx="18" ry="8" fill="#1A1208" transform={tilt} />
          <ellipse cx="28" cy="20" rx="5" ry="8" fill="#1A1208" transform={tilt} />
        </>
      )}

      {/* Ears */}
      <ellipse cx="25" cy="30" rx="4" ry="5.5" fill={skinTone} opacity="0.8" transform={tilt} />
      <ellipse cx="65" cy="30" rx="4" ry="5.5" fill={skinTone} opacity="0.8" transform={tilt} />

      {/* Eyebrows */}
      {isCritical ? (
        <>
          <path d="M33 21 Q37 19 41 21" stroke="rgba(0,0,0,0.5)" strokeWidth="2" fill="none" strokeLinecap="round" transform={tilt} />
          <path d="M49 21 Q53 19 57 21" stroke="rgba(0,0,0,0.5)" strokeWidth="2" fill="none" strokeLinecap="round" transform={tilt} />
        </>
      ) : (
        <>
          <path d="M33 20 Q37 18 41 20" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" fill="none" strokeLinecap="round" transform={tilt} />
          <path d="M49 20 Q53 18 57 20" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" fill="none" strokeLinecap="round" transform={tilt} />
        </>
      )}

      {/* Eyes */}
      {eyeOpen ? (
        <>
          <ellipse cx="37" cy="28" rx="4" ry="4.5" fill="#0F172A" transform={tilt} />
          <ellipse cx="53" cy="28" rx="4" ry="4.5" fill="#0F172A" transform={tilt} />
          {/* Iris */}
          <ellipse cx="37" cy="28.5" rx="2.5" ry="3" fill={isStable ? '#2563EB' : isCritical ? '#7C3AED' : '#1D4ED8'} opacity="0.7" transform={tilt} />
          <ellipse cx="53" cy="28.5" rx="2.5" ry="3" fill={isStable ? '#2563EB' : isCritical ? '#7C3AED' : '#1D4ED8'} opacity="0.7" transform={tilt} />
          {/* Shine */}
          <circle cx="38.5" cy="26.5" r="1.3" fill="white" opacity="0.75" transform={tilt} />
          <circle cx="54.5" cy="26.5" r="1.3" fill="white" opacity="0.75" transform={tilt} />
        </>
      ) : (
        <>
          {/* Closed/squinting eyes */}
          <path d="M33 28 Q37 25 41 28" stroke="#555" strokeWidth="2" fill="rgba(0,0,0,0.2)" strokeLinecap="round" transform={tilt} />
          <path d="M49 28 Q53 25 57 28" stroke="#555" strokeWidth="2" fill="rgba(0,0,0,0.2)" strokeLinecap="round" transform={tilt} />
        </>
      )}

      {/* Nose */}
      <path d="M43 33 Q45 36 47 33" stroke={skinTone} strokeWidth="1.2" fill="none" opacity="0.6" strokeLinecap="round" transform={tilt} />

      {/* Mouth */}
      {isStable ? (
        <path d="M38 39 Q45 44 52 39" stroke={skinTone} strokeWidth="2" fill="none" strokeLinecap="round" transform={tilt} />
      ) : isCritical ? (
        <path d="M38 42 Q45 38 52 42" stroke="#888" strokeWidth="2" fill="none" strokeLinecap="round" transform={tilt} />
      ) : (
        <path d="M40 40.5 Q45 42 50 40.5" stroke="#999" strokeWidth="1.5" fill="none" strokeLinecap="round" transform={tilt} />
      )}

      {/* Critical: sweat drops */}
      {isCritical && (
        <>
          <ellipse cx="64" cy="20" rx="2" ry="3" fill="#BFDBFE" opacity="0.6" />
          <ellipse cx="66" cy="27" rx="1.5" ry="2.2" fill="#BFDBFE" opacity="0.4" />
        </>
      )}

      {/* Stable: sparkles */}
      {isStable && hp > 75 && (
        <>
          <text x="64" y="16" fontSize="11" fill="#FDE047" opacity="0.85">✦</text>
          <text x="20" y="22" fontSize="8" fill="#86EFAC" opacity="0.7">✦</text>
        </>
      )}

      {/* Critical alert icon */}
      {isCritical && (
        <g transform="translate(58, 6)">
          <polygon points="12,0 24,20 0,20" fill="#F59E0B" opacity="0.9" />
          <text x="12" y="16" textAnchor="middle" fontSize="11" fill="#1A1A1A" fontWeight="900">!</text>
        </g>
      )}
    </svg>
  );
}
