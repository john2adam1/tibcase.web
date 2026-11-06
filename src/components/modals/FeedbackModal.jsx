import React, { useEffect, useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { api, formatApiError } from '../../api';
import { useTranslation } from '../../i18n.jsx';

const MAX_MESSAGE = 2000;

const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? `web-${__APP_VERSION__}` : 'web';

export default function FeedbackModal({ isOpen, onClose, context = '', onSent }) {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setMessage('');
    setError('');
    setSending(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape' && !sending) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose, sending]);

  if (!isOpen) return null;

  const trimmed = message.trim();

  const handleSubmit = async () => {
    if (sending) return;
    if (!trimmed) {
      setError(t('feedback.needInput', 'Fikringizni yozing'));
      return;
    }
    setSending(true);
    setError('');
    try {
      const payload = { kind: 'general', message: trimmed, app_version: APP_VERSION };
      if (context) payload.context = context;
      await api.sendFeedback(payload);
      onSent?.(t('feedback.thanks', 'Fikringiz uchun rahmat!'));
      onClose();
    } catch (err) {
      setError(formatApiError(err, t) || t('feedback.error', "Yuborib bo'lmadi. Qayta urinib ko'ring."));
      setSending(false);
    }
  };

  return (
    <div
      id="feedback-backdrop"
      onClick={(e) => { if (e.target.id === 'feedback-backdrop' && !sending) onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        animation: 'fadeIn 0.18s ease-out',
      }}
    >
      <div
        className="responsive-modal-card"
        style={{
          width: '100%',
          maxWidth: 460,
          maxHeight: '92dvh',
          overflowY: 'auto',
          boxSizing: 'border-box',
          background: 'var(--surface)',
          borderRadius: 18,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px var(--line)',
          padding: '24px 22px 22px',
          position: 'relative',
          animation: 'modalScale 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <button
          id="btn-close-feedback"
          onClick={onClose}
          disabled={sending}
          aria-label={t('common.close', 'Yopish')}
          style={{
            position: 'absolute', top: 16, right: 16, width: 34, height: 34, borderRadius: 12,
            background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--ink-3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}
        >
          <X size={18} strokeWidth={2.4} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6, paddingRight: 40 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14, background: 'var(--tint-green)', color: '#16A34A',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <MessageSquare size={22} strokeWidth={2.2} />
          </div>
          <h3 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.3px' }}>
            {t('feedback.title', 'Fikringiz biz uchun muhim')}
          </h3>
        </div>
        <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.5 }}>
          {t('feedback.subtitle', 'Nima yoqqanini va nimani yaxshilashimiz kerakligini yozing.')}
        </p>

        <textarea
          id="feedback-message"
          value={message}
          maxLength={MAX_MESSAGE}
          rows={6}
          autoFocus
          onChange={(e) => { setMessage(e.target.value); if (error) setError(''); }}
          placeholder={t('feedback.messagePlaceholder', 'Fikringizni shu yerga yozing...')}
          style={{
            width: '100%', boxSizing: 'border-box', resize: 'vertical', padding: '12px 14px',
            borderRadius: 14, border: '1px solid var(--line)', background: 'var(--surface-2)', color: 'var(--ink)',
            fontSize: 14, lineHeight: 1.5, fontFamily: 'inherit', outline: 'none',
          }}
        />
        <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--ink-4)', marginTop: 4 }}>
          {message.length}/{MAX_MESSAGE}
        </div>

        {error && (
          <div
            role="alert"
            style={{
              marginTop: 10, padding: '10px 12px', borderRadius: 12, background: 'var(--tint-red-soft)',
              border: '1px solid var(--tint-red-border)', color: 'var(--on-red)', fontSize: 13, fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button
            id="btn-feedback-cancel"
            onClick={onClose}
            disabled={sending}
            style={{
              flex: 1, padding: '13px 16px', borderRadius: 16, background: 'var(--surface-3)',
              border: '1px solid var(--line)', color: 'var(--ink-2)', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}
          >
            {t('feedback.cancel', 'Bekor qilish')}
          </button>
          <button
            id="btn-feedback-send"
            onClick={handleSubmit}
            disabled={sending}
            style={{
              flex: 1.5, padding: '13px 16px', borderRadius: 16, background: '#16A34A',
              border: '1px solid #15803D', color: '#FFFFFF', fontSize: 14, fontWeight: 700,
              cursor: sending ? 'default' : 'pointer', opacity: sending ? 0.7 : 1,
            }}
          >
            {sending ? t('feedback.sending', 'Yuborilmoqda...') : t('feedback.send', 'Yuborish')}
          </button>
        </div>
      </div>
    </div>
  );
}
