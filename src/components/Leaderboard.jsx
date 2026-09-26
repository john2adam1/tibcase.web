import React, { useEffect, useState } from 'react';
import {
  Award,
  Crown,
  Flame,
  Medal,
  Sparkles,
  Trophy,
  User,
  Zap,
  ArrowLeft
} from 'lucide-react';
import { api } from '../api';
import { useTranslation } from '../i18n.jsx';

export default function Leaderboard({ user, onBack }) {
  const { t } = useTranslation();
  const [filterType, setFilterType] = useState('total');
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.getUserRating(filterType)
      .then(res => {
        if (mounted) setLeaderboard(res);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [filterType]);

  const items = leaderboard?.items || [];
  const me = leaderboard?.me || null;

  if (loading) {
    return (
      <div style={{
        width: '100%', minHeight: '85vh', background: '#F8FAFC',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        <div style={{ textAlign: 'center', color: '#94A3B8' }}>
          <Trophy size={40} style={{ marginBottom: 12, opacity: 0.5 }} />
          <p style={{ fontWeight: 700 }}>{t('lead.title')}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100%',
      minHeight: '85vh',
      background: '#F8FAFC',
      padding: '32px 16px 100px 16px',
      boxSizing: 'border-box',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        {/* Header with Back button */}
        <div style={{ position: 'relative', textAlign: 'center', marginBottom: 28 }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 14,
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                color: '#475569',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F1F5F9';
                e.currentTarget.style.color = '#0F172A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.color = '#475569';
              }}
            >
              <ArrowLeft size={16} />
              <span>{t('cat.back', 'Orqaga')}</span>
            </button>
          )}

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#FEF3C7',
            border: '1.5px solid #FDE68A',
            color: '#D97706',
            fontSize: '12px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '5px 14px',
            borderRadius: 99,
            marginBottom: 10,
          }}>
            <Trophy size={14} />
            <span>{t('lead.badge')}</span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', margin: '4px 0 6px 0' }}>
            {t('lead.title')}
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>
            {t('lead.subtitle')}
          </p>
        </div>

        {/* Filter Tabs matching Profile style */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 28,
        }}>
          <div style={{
            display: 'inline-flex',
            background: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            borderRadius: 99,
            padding: 4,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
          }}>
            {[
              { id: 'day', label: t('lead.today') },
              { id: 'week', label: t('lead.thisWeek') },
              { id: 'month', label: t('lead.thisMonth') },
              { id: 'total', label: t('lead.allTime') },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 99,
                  fontSize: '13px',
                  fontWeight: 800,
                  background: filterType === f.id ? '#16A34A' : 'transparent',
                  color: filterType === f.id ? '#FFFFFF' : '#64748B',
                  boxShadow: filterType === f.id ? '0 4px 12px rgba(22, 163, 74, 0.3)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Top 3 Podium Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 14,
          marginBottom: 28,
          alignItems: 'flex-end',
        }}>
          {/* Silver (Rank 2) */}
          {items[1] && (
            <div style={{
              background: '#FFFFFF',
              borderRadius: 24,
              border: '1.5px solid #E2E8F0',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
              padding: '20px 14px',
              textAlign: 'center',
              order: 1,
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 4 }}>🥈</div>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                margin: '0 auto 10px',
                background: '#E2E8F0',
                border: '2px solid #CBD5E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#475569',
                fontWeight: 900,
              }}>
                {items[1].name.charAt(0)}
              </div>
              <div style={{ fontWeight: 800, fontSize: '14px', color: '#0F172A', marginBottom: 2 }}>{items[1].name}</div>
              <div style={{
                fontSize: '16px',
                fontWeight: 900,
                color: '#16A34A',
              }}>
                {items[1].activity} {t('lead.casesSolved')}
              </div>
            </div>
          )}

          {/* Gold (Rank 1) */}
          {items[0] && (
            <div style={{
              background: '#FFFFFF',
              borderRadius: 26,
              border: '2px solid #FDE68A',
              boxShadow: '0 8px 24px rgba(245, 158, 11, 0.15)',
              padding: '26px 16px',
              textAlign: 'center',
              order: 2,
              transform: 'translateY(-10px)',
            }}>
              <div style={{ fontSize: '2.2rem', marginBottom: 4 }}>👑</div>
              <div style={{
                width: 58,
                height: 58,
                borderRadius: '50%',
                margin: '0 auto 10px',
                background: '#FEF08A',
                border: '2.5px solid #FACC15',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#B45309',
                fontWeight: 900,
                fontSize: '18px',
              }}>
                {items[0].name.charAt(0)}
              </div>
              <div style={{ fontWeight: 900, fontSize: '15px', color: '#0F172A', marginBottom: 2 }}>{items[0].name}</div>
              <div style={{
                fontSize: '18px',
                fontWeight: 900,
                color: '#D97706',
              }}>
                {items[0].activity} {t('lead.casesSolved')}
              </div>
            </div>
          )}

          {/* Bronze (Rank 3) */}
          {items[2] && (
            <div style={{
              background: '#FFFFFF',
              borderRadius: 24,
              border: '1.5px solid #E2E8F0',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
              padding: '20px 14px',
              textAlign: 'center',
              order: 3,
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 4 }}>🥉</div>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                margin: '0 auto 10px',
                background: '#FFEDD5',
                border: '2px solid #FDBA74',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C2410C',
                fontWeight: 900,
              }}>
                {items[2].name.charAt(0)}
              </div>
              <div style={{ fontWeight: 800, fontSize: '14px', color: '#0F172A', marginBottom: 2 }}>{items[2].name}</div>
              <div style={{
                fontSize: '16px',
                fontWeight: 900,
                color: '#16A34A',
              }}>
                {items[2].activity} {t('lead.casesSolved')}
              </div>
            </div>
          )}
        </div>

        {me && (
        <div style={{
          background: '#DCFCE7',
          border: '1.5px solid #86EFAC',
          borderRadius: 20,
          padding: '14px 20px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: '#16A34A',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '14px',
            }}>
              #{me.rank}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '14.5px', color: '#166534' }}>
                {me.name} {t('lead.you')}
              </div>
              <div style={{ fontSize: '12px', color: '#15803D' }}>
                {me.activity} {t('lead.casesSolved')}
              </div>
            </div>
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: 900,
            color: '#166534',
          }}>
            #{me.rank}
          </div>
        </div>
        )}

        {/* Rankings Table/List */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 24,
          border: '1.5px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
          overflow: 'hidden',
        }}>
          {items.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                borderBottom: idx < items.length - 1 ? '1px solid #F1F5F9' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{
                  fontSize: '14px',
                  fontWeight: 800,
                  color: item.rank <= 3 ? '#D97706' : '#94A3B8',
                  minWidth: 24,
                }}>
                  #{item.rank}
                </span>

                <div>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: '#0F172A' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    {item.activity} {t('lead.casesSolved')}
                  </div>
                </div>
              </div>

              <div style={{
                fontSize: '14px',
                fontWeight: 900,
                color: item.is_me ? '#166534' : '#16A34A',
              }}>
                {item.activity}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
