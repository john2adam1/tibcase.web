import React, { useState, useEffect } from 'react';
import { ChevronLeft, Bell, CheckCircle2 } from 'lucide-react';
import { api } from '../api';

export default function NotificationsView({ onBack }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.getNotifications();
      setNotifications(res.notifications || []);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#F8FAFC',
      padding: '24px 20px',
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 24,
      }}>
        <button
          onClick={onBack}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: '#FFFFFF',
            border: '2px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#0F172A',
            boxShadow: '0 2px 0 #E2E8F0',
          }}
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>

        <h1 style={{
          flex: 1,
          fontSize: '20px',
          fontWeight: 800,
          color: '#0F172A',
          margin: 0,
          textAlign: 'center',
          paddingRight: 40,
        }}>
          Bildirishnomalar
        </h1>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#94A3B8', marginTop: 40 }}>Loading...</div>
      ) : notifications.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 60,
          textAlign: 'center'
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            background: '#F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}>
            <Bell size={32} color="#94A3B8" strokeWidth={2} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0' }}>
            Hozircha bo'sh
          </h3>
          <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
            Yangi bildirishnomalar shu yerda paydo bo'ladi
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              style={{
                background: n.is_read ? '#FFFFFF' : '#F0FDF4',
                borderRadius: 20,
                border: '2px solid',
                borderColor: n.is_read ? '#E2E8F0' : '#86EFAC',
                padding: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                boxShadow: n.is_read ? '0 4px 0 #E2E8F0' : '0 4px 0 #86EFAC',
                transition: 'all 0.2s ease',
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
                <Bell size={20} color={n.is_read ? '#64748B' : '#16A34A'} strokeWidth={2} />
              </div>

              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
                  {n.title}
                </h4>
                <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                  {n.body}
                </p>
                <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
                  {new Date(n.created_at).toLocaleString()}
                </div>
              </div>

              {!n.is_read && (
                <button
                  onClick={() => handleMarkAsRead(n.id)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: '#FFFFFF',
                    border: '2px solid #86EFAC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#16A34A',
                    cursor: 'pointer',
                  }}
                  title="O'qildi deb belgilash"
                >
                  <CheckCircle2 size={16} strokeWidth={2.5} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
