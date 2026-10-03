import React, { useEffect, useRef } from 'react';
import { useTranslation } from '../../i18n.jsx';

export default function PreparingCaseLoader({ onFinish, duration = 2000 }) {
  const { t } = useTranslation();
  const finishRef = useRef(onFinish);
  useEffect(() => {
    finishRef.current = onFinish;
  });

  useEffect(() => {
    const timer = setTimeout(() => finishRef.current?.(), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--bg-main)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        zIndex: 100,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          background: 'var(--accent-soft)',
          border: '1px solid var(--accent-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse 1.6s ease-in-out infinite',
        }}
      >
        <img src="/logo.svg" alt="" width={44} height={44} style={{ borderRadius: 12, display: 'block' }} />
      </div>
      <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)' }}>
        {t('case.preparing', 'Keys tayyorlanmoqda...')}
      </span>
    </div>
  );
}
