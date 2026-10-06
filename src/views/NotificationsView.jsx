import React, { useState, useEffect } from 'react';
import { ChevronLeft, Bell, CheckCircle2, BellOff, Check } from 'lucide-react';
import { api } from '../api';
import { useTranslation } from '../i18n.jsx';

export default function NotificationsView({ onBack, onRefreshNotifications }) {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);
  const [toast, setToast] = useState(null);
  const [loadError, setLoadError] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setLoadError('');
      const res = await api.getNotifications();
      const list = Array.isArray(res?.notifications) ? res.notifications : (Array.isArray(res?.items) ? res.items : []);
      setNotifications(list);
    } catch (err) {
      console.error('Failed to load notifications', err);
      setLoadError(err?.message || 'Xatolik');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      if (onRefreshNotifications) onRefreshNotifications();
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.is_read);
    if (unread.length === 0) return;
    setMarkingAll(true);
    try {
      await Promise.all(unread.map(n => api.markNotificationRead(n.id).catch(() => null)));
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      if (onRefreshNotifications) onRefreshNotifications();
      showToast(t('notifications.allMarkedRead', "Barchasi o'qildi ✓"));
    } catch (err) {
      console.error('Failed to mark all as read', err);
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now - date;
      const diffMin = Math.floor(diffMs / 60000);
      const diffHour = Math.floor(diffMs / 3600000);
      const diffDay = Math.floor(diffMs / 86400000);

      if (diffMin < 1) return t('notifications.justNow', 'Hozirgina');
      if (diffMin < 60) return `${diffMin} ${t('notifications.minutesAgo', 'daqiqa oldin')}`;
      if (diffHour < 24) return `${diffHour} ${t('notifications.hoursAgo', 'soat oldin')}`;
      if (diffDay < 7) return `${diffDay} ${t('notifications.daysAgo', 'kun oldin')}`;
      return date.toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#F8FAFC',
      padding: '24px 20px',
      overflowY: 'auto',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 12,
      }}>
        <button
          onClick={onBack}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#0F172A',
            boxShadow: 'var(--shadow-sm)',
            flexShrink: 0,
          }}
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>

        <h1 style={{
          flex: 1,
          fontSize: '20px',
          fontWeight: 700,
          color: '#0F172A',
          margin: 0,
          textAlign: 'center',
        }}>
          {t('profile.notifications', 'Bildirishnomalar')}
          {unreadCount > 0 && (
            <span style={{
              display: 'inline-block',
              marginLeft: 8,
              fontSize: '12px',
              fontWeight: 700,
              background: '#DC2626',
              color: '#FFFFFF',
              borderRadius: 10,
              padding: '2px 8px',
              verticalAlign: 'middle',
            }}>
              {unreadCount}
            </span>
          )}
        </h1>

        {/* Mark All Read Button */}
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: '#F0FDF4',
              border: '1px solid #86EFAC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: markingAll ? 'not-allowed' : 'pointer',
              color: '#16A34A',
              boxShadow: 'var(--shadow-sm)',
              flexShrink: 0,
              opacity: markingAll ? 0.6 : 1,
            }}
            title={t('notifications.markAllRead', "Barchasini o'qildi deb belgilash")}
          >
            <Check size={20} strokeWidth={3} />
          </button>
        )}

        {/* Spacer when no unread to keep title centered */}
        {unreadCount === 0 && <div style={{ width: 40, flexShrink: 0 }} />}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', color: '#94A3B8', marginTop: 60 }}>
          <div style={{
            width: 40, height: 40, border: '4px solid #E2E8F0', borderTopColor: '#3B82F6',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px auto',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
          {t('notifications.loading', 'Yuklanmoqda...')}
        </div>
      ) : loadError ? (
        <div style={{ textAlign: 'center', marginTop: 60, padding: '0 20px', color: '#B91C1C' }}>
          <p style={{ fontWeight: 700, margin: '0 0 8px' }}>{t('common.error', 'Xatolik yuz berdi')}</p>
          <p style={{ fontSize: 13, margin: '0 0 16px', color: '#64748B' }}>{loadError}</p>
          <button type="button" className="ui-btn" onClick={fetchNotifications}>{t('common.retry', 'Qayta urinish')}</button>
        </div>
      ) : notifications.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 80,
          textAlign: 'center',
          padding: '0 20px',
        }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 18,
            background: '#F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
            boxShadow: 'var(--shadow-sm)',
          }}>
            <BellOff size={36} color="#94A3B8" strokeWidth={1.8} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0' }}>
            {t('notifications.emptyTitle', 'Hozircha bildirishnomalar yo\'q')}
          </h3>
          <p style={{ fontSize: '14px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
            {t('notifications.emptyDesc', "O'quv rejasi eslatmalari va tizim xabarlari shu yerda paydo bo'ladi")}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.is_read && handleMarkAsRead(n.id)}
              style={{
                background: n.is_read ? '#FFFFFF' : '#F0FDF4',
                borderRadius: 16,
                border: '2px solid',
                borderColor: n.is_read ? '#E2E8F0' : '#86EFAC',
                padding: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 14,
                boxShadow: n.is_read ? '0 4px 0 #E2E8F0' : '0 4px 0 #86EFAC',
                transition: 'all 0.2s ease',
                cursor: n.is_read ? 'default' : 'pointer',
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: n.is_read ? '#F1F5F9' : '#DCFCE7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {n.is_read ? (
                  <CheckCircle2 size={20} color="#94A3B8" strokeWidth={2} />
                ) : (
                  <Bell size={20} color="#16A34A" strokeWidth={2} />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  color: n.is_read ? '#475569' : '#0F172A',
                  margin: '0 0 4px 0',
                  lineHeight: 1.3,
                }}>
                  {n.title}
                </h4>
                {n.message && (
                  <p style={{
                    fontSize: '13px',
                    color: '#475569',
                    margin: '0 0 8px 0',
                    lineHeight: 1.45,
                    wordBreak: 'break-word',
                  }}>
                    {n.message}
                  </p>
                )}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: '11px',
                  color: '#94A3B8',
                  fontWeight: 600,
                }}>
                  <span>{formatDate(n.created_at || n.updated_at)}</span>
                  {!n.is_read && (
                    <span style={{
                      background: '#DCFCE7',
                      color: '#16A34A',
                      padding: '2px 8px',
                      borderRadius: 6,
                      fontWeight: 700,
                      fontSize: '10px',
                    }}>
                      {t('notifications.new', 'Yangi')}
                    </span>
                  )}
                </div>
              </div>

              {!n.is_read && (
                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#16A34A',
                  flexShrink: 0,
                  marginTop: 6,
                  boxShadow: 'var(--shadow-sm)',
                }} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 100,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#0F172A',
          color: '#FFFFFF',
          padding: '12px 24px',
          borderRadius: 16,
          fontSize: '14px',
          fontWeight: 700,
          boxShadow: 'var(--shadow-sm)',
          zIndex: 9999,
          animation: 'fadeIn 0.3s ease',
        }}>
          {toast}
          <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); }}`}</style>
        </div>
      )}
    </div>
  );
}
