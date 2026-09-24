import React, { useEffect } from 'react';

export default function PreparingCaseLoader({
  onFinish,
  duration = 2000
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onFinish]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'radial-gradient(circle at center, #FFF4E6 0%, #FFF8EF 60%, #FFFFFF 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      {/* Central Glowing Circle with 3D Ambulance */}
      <div style={{
        position: 'relative',
        width: 170,
        height: 170,
        borderRadius: '50%',
        background: '#FFFFFF',
        boxShadow: '0 0 70px rgba(251, 146, 60, 0.4), 0 10px 30px rgba(0, 0, 0, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 28,
        animation: 'pulse 2s infinite',
      }}>
        {/* Soft Glowing Aura */}
        <div style={{
          position: 'absolute',
          inset: -14,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(251, 146, 60, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          fontSize: '70px',
          filter: 'drop-shadow(0 10px 14px rgba(0,0,0,0.15))',
        }}>
          🚑
        </div>
      </div>

      {/* Preparing Case Label with Pulsating Dot */}
      <div style={{
        background: 'rgba(255, 237, 213, 0.65)',
        border: '1.5px solid #FED7AA',
        borderRadius: 99,
        padding: '8px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <div style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#EA580C',
          boxShadow: '0 0 8px #EA580C',
        }} />
        <span style={{
          fontSize: '15px',
          fontWeight: 800,
          color: '#EA580C',
          letterSpacing: '-0.01em',
        }}>
          Preparing case...
        </span>
      </div>
    </div>
  );
}
