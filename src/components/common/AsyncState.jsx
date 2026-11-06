import React from 'react';
import { AlertCircle, Inbox, RefreshCw } from 'lucide-react';
import { useTranslation } from '../../i18n.jsx';

const centered = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  gap: 10,
  padding: '48px 20px',
  color: 'var(--ink-3)',
  fontSize: 14,
  fontWeight: 600,
};

/**
 * Unified loading / error / empty wrapper.
 * Renders children only when data is ready and not empty.
 */
export default function AsyncState({ loading, error, empty, emptyText, onRetry, children }) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div style={centered} role="status" aria-live="polite">
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          border: '4px solid var(--line)', borderTopColor: '#22C55E',
          animation: 'async-spin 0.8s linear infinite',
        }} />
        <span>{t('common.loading', 'Yuklanmoqda...')}</span>
        <style>{'@keyframes async-spin { to { transform: rotate(360deg); } }'}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={centered} role="alert">
        <AlertCircle size={32} color="var(--on-red)" />
        <span style={{ color: 'var(--on-red)' }}>{error.message || t('common.error', 'Xatolik yuz berdi')}</span>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            style={{
              minHeight: 44, padding: '0 18px', borderRadius: 14, border: '1px solid var(--line)',
              background: 'var(--surface)', color: 'var(--ink)', fontWeight: 700, fontSize: 14,
              display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer',
            }}
          >
            <RefreshCw size={15} /> {t('common.retry', 'Qayta urinish')}
          </button>
        )}
      </div>
    );
  }

  if (empty) {
    return (
      <div style={centered}>
        <Inbox size={32} color="var(--ink-4)" />
        <span>{emptyText || t('common.empty', "Ma'lumot topilmadi")}</span>
      </div>
    );
  }

  return <>{children}</>;
}
