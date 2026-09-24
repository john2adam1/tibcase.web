import React, { useState, useEffect } from 'react';
import { ChevronLeft, Activity as ActivityIcon, CalendarDays, TrendingUp } from 'lucide-react';
import { api } from '../api';

export default function ActivityView({ onBack }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('day'); // day, week, month

  useEffect(() => {
    fetchActivity(filter);
  }, [filter]);

  const fetchActivity = async (type) => {
    try {
      setLoading(true);
      const res = await api.getUserActivity(type);
      setActivities(res.items || []);
    } catch (err) {
      console.error('Failed to load activity', err);
    } finally {
      setLoading(false);
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
          Faollik
        </h1>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        background: '#E2E8F0',
        borderRadius: 16,
        padding: 4,
        marginBottom: 24,
      }}>
        {[
          { id: 'day', label: 'Kunlik' },
          { id: 'week', label: 'Haftalik' },
          { id: 'month', label: 'Oylik' }
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 12,
              border: 'none',
              background: filter === f.id ? '#FFFFFF' : 'transparent',
              color: filter === f.id ? '#0F172A' : '#64748B',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: filter === f.id ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#94A3B8', marginTop: 40 }}>Loading...</div>
      ) : activities.length === 0 ? (
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
            <ActivityIcon size={32} color="#94A3B8" strokeWidth={2} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0' }}>
            Hozircha bo'sh
          </h3>
          <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
            Ushbu davr uchun faollik mavjud emas
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {activities.map((a, i) => (
            <div
              key={i}
              style={{
                background: '#FFFFFF',
                borderRadius: 20,
                border: '2px solid #E2E8F0',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                boxShadow: '0 4px 0 #E2E8F0',
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: '#FEF08A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <TrendingUp size={20} color="#CA8A04" strokeWidth={2.5} />
              </div>

              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
                  {a.activity} XP
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
                  <CalendarDays size={14} />
                  {new Date(a.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
