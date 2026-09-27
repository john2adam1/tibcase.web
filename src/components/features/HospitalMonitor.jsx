import React, { useEffect, useRef } from 'react';
import { Heart, Activity } from 'lucide-react';

export default function HospitalMonitor({
  vitals = {
    hr: 82,
    spo2: 98,
    bp: '120/80',
    rr: 18,
    temp: 36.8
  },
  status = 'stable' // 'stable' | 'unstable' | 'critical'
}) {
  const canvasRef = useRef(null);

  // Animated ECG Line on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let x = 0;

    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;

    // Clear background
    ctx.fillStyle = '#050B14';
    ctx.fillRect(0, 0, width, height);

    // Draw subtle monitor grid
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.08)';
    ctx.lineWidth = 1;
    for (let gx = 0; gx < width; gx += 20) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, height);
      ctx.stroke();
    }
    for (let gy = 0; gy < height; gy += 20) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(width, gy);
      ctx.stroke();
    }

    let prevY = midY;
    let beatPhase = 0;

    const draw = () => {
      // Clear a small vertical slice ahead of the drawing point
      ctx.fillStyle = '#050B14';
      ctx.fillRect(x, 0, 12, height);

      // Re-draw subtle grid on cleared slice
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.06)';
      ctx.lineWidth = 1;
      if (x % 20 < 2) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Generate ECG P-Q-R-S-T wave pattern
      let targetY = midY;
      const beatLength = Math.max(30, Math.floor(1800 / (vitals.hr || 80)));

      beatPhase = (beatPhase + 1) % beatLength;

      if (beatPhase === 10) targetY = midY - 6; // P wave
      else if (beatPhase === 12) targetY = midY;
      else if (beatPhase === 15) targetY = midY + 4; // Q
      else if (beatPhase === 17) targetY = midY - 26; // R peak!
      else if (beatPhase === 19) targetY = midY + 10; // S
      else if (beatPhase === 24) targetY = midY - 9; // T wave
      else if (beatPhase === 27) targetY = midY;

      // Add tiny physiological noise
      targetY += (Math.random() - 0.5) * 1.5;

      // Draw ECG line in hospital neon green
      ctx.beginPath();
      ctx.strokeStyle = status === 'critical' ? '#EF4444' : '#22C55E';
      ctx.lineWidth = 2.2;
      ctx.shadowColor = status === 'critical' ? '#EF4444' : '#22C55E';
      ctx.shadowBlur = 6;
      ctx.lineCap = 'round';
      ctx.moveTo(x === 0 ? 0 : x - 2, prevY);
      ctx.lineTo(x, targetY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      prevY = targetY;
      x = (x + 2) % width;

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [vitals.hr, status]);

  return (
    <div style={{
      width: '100%',
      background: 'linear-gradient(180deg, #090E17 0%, #03060C 100%)',
      borderRadius: 22,
      border: '2px solid #1E293B',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
      padding: '12px 14px',
      color: '#FFFFFF',
      fontFamily: "'JetBrains Mono', monospace, sans-serif",
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}>
      {/* Top Monitor Status Line */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11px',
        fontWeight: 700,
        color: '#64748B',
        letterSpacing: '0.8px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: 6,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: status === 'critical' ? '#EF4444' : (status === 'unstable' ? '#F59E0B' : '#22C55E'),
            boxShadow: `0 0 8px ${status === 'critical' ? '#EF4444' : (status === 'unstable' ? '#F59E0B' : '#22C55E')}`,
          }} />
          <span style={{ color: '#E2E8F0' }}>LEAD II • ECG NORMAL FILTER</span>
        </div>

        <span style={{
          color: status === 'critical' ? '#F87171' : (status === 'unstable' ? '#FBBF24' : '#4ADE80'),
          fontWeight: 800,
        }}>
          {status.toUpperCase()}
        </span>
      </div>

      {/* Main Screen: ECG Wave Canvas on Left, Big LED Displays on Right */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        height: 84,
      }}>
        {/* ECG Wave Canvas */}
        <div style={{
          flex: 1,
          height: '100%',
          borderRadius: 12,
          overflow: 'hidden',
          background: '#050B14',
          border: '1px solid rgba(34, 197, 94, 0.2)',
          position: 'relative',
        }}>
          <canvas
            ref={canvasRef}
            width={240}
            height={84}
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
          <span style={{
            position: 'absolute',
            top: 4,
            left: 6,
            fontSize: '9px',
            fontWeight: 800,
            color: '#22C55E',
          }}>
            II 1mV
          </span>
        </div>

        {/* Primary Numbers: Heart Rate & SpO2 */}
        <div style={{ display: 'flex', gap: 10 }}>
          {/* HR */}
          <div style={{
            background: 'rgba(34, 197, 94, 0.08)',
            border: '1px solid rgba(34, 197, 94, 0.25)',
            borderRadius: 12,
            padding: '6px 10px',
            minWidth: 64,
            textAlign: 'right',
          }}>
            <div style={{ fontSize: '9px', fontWeight: 800, color: '#4ADE80', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Heart size={10} fill="#4ADE80" className="heart-pulse" />
              <span>HR</span>
            </div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#22C55E', lineHeight: 1, marginTop: 4 }}>
              {vitals.hr || 80}
            </div>
            <div style={{ fontSize: '9px', color: '#86EFAC', marginTop: 2 }}>bpm</div>
          </div>

          {/* SpO2 */}
          <div style={{
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            borderRadius: 12,
            padding: '6px 10px',
            minWidth: 64,
            textAlign: 'right',
          }}>
            <div style={{ fontSize: '9px', fontWeight: 800, color: '#38BDF8', textAlign: 'left' }}>
              SpO2 %
            </div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#06B6D4', lineHeight: 1, marginTop: 4 }}>
              {vitals.spo2 || 98}
            </div>
            <div style={{ fontSize: '9px', color: '#7DD3FC', marginTop: 2 }}>%</div>
          </div>
        </div>
      </div>

      {/* Bottom Readouts Row: NIBP, RESP, TEMP */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr 1fr',
        gap: 8,
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: 8,
      }}>
        {/* NIBP */}
        <div style={{
          background: 'rgba(234, 179, 8, 0.08)',
          border: '1px solid rgba(234, 179, 8, 0.2)',
          borderRadius: 10,
          padding: '4px 8px',
        }}>
          <div style={{ fontSize: '9px', fontWeight: 800, color: '#FACC15' }}>NIBP mmHg</div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#EAB308', marginTop: 2 }}>
            {vitals.bp || '120/80'}
          </div>
        </div>

        {/* RESP */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 10,
          padding: '4px 8px',
        }}>
          <div style={{ fontSize: '9px', fontWeight: 800, color: '#94A3B8' }}>RESP /min</div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#F8FAFC', marginTop: 2 }}>
            {vitals.rr || 18}
          </div>
        </div>

        {/* TEMP */}
        <div style={{
          background: 'rgba(249, 115, 22, 0.08)',
          border: '1px solid rgba(249, 115, 22, 0.2)',
          borderRadius: 10,
          padding: '4px 8px',
        }}>
          <div style={{ fontSize: '9px', fontWeight: 800, color: '#FB923C' }}>TEMP °C</div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#F97316', marginTop: 2 }}>
            {vitals.temp || 36.8}
          </div>
        </div>
      </div>
    </div>
  );
}
