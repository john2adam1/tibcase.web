import { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { enablePush, isPushConfigured, pushUnsupportedReason } from '../../utils/push';
import { useTranslation } from '../../i18n.jsx';

const DISMISS_KEY = 'push_banner_dismissed';

/** Banner asking to enable notifications. Only for browsers where permission is still undecided. */
export default function PushBanner() {
  const { t } = useTranslation();
  const [permission, setPermission] = useState(() =>
    typeof Notification === 'undefined' ? 'unsupported' : Notification.permission
  );
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISS_KEY) === '1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (permission !== 'default' || dismissed || !isPushConfigured() || pushUnsupportedReason()) return null;

  const handleEnable = async () => {
    setLoading(true);
    setError('');
    try {
      await enablePush();
      setPermission('granted');
    } catch (err) {
      setError(err.message || t('push.failed', 'Yoqilmadi'));
      setPermission(typeof Notification === 'undefined' ? 'unsupported' : Notification.permission);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1');
    setDismissed(true);
  };

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
        margin: '16px 16px 0', padding: '14px 20px',
        background: 'var(--accent-soft, #F0FDF4)', border: '1px solid #BBF7D0',
        borderRadius: 24, animation: 'pageIn 0.4s ease both',
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 16, background: 'var(--accent)', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Bell size={22} strokeWidth={2.4} />
      </div>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>{t('push.title', 'Bildirishnomalarni yoqing')}</div>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#475569', marginTop: 2 }}>
          {error || t('push.desc', "Yangi keyslar, kunlik vazifalar va muhim eslatmalarni o'tkazib yubormang.")}
        </div>
      </div>
      <button
        type="button"
        onClick={handleEnable}
        disabled={loading}
        style={{
          padding: '12px 24px', borderRadius: 16, border: 'none', background: 'var(--accent)', color: '#fff',
          fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', cursor: loading ? 'default' : 'pointer',
          boxShadow: '0 8px 20px -6px rgba(22,163,74,0.5)', opacity: loading ? 0.6 : 1, whiteSpace: 'nowrap',
        }}
      >
        {loading ? t('push.loading', 'YUKLANMOQDA...') : t('push.enable', 'YOQISH')}
      </button>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label={t('common.close', 'Yopish')}
        style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 4, display: 'flex' }}
      >
        <X size={18} />
      </button>
    </div>
  );
}
