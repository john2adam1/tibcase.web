import React, { useState } from 'react';
import {
  Trophy,
  ArrowLeft,
  Star,
} from 'lucide-react';
import { api } from '../api';
import { useTranslation } from '../i18n.jsx';
import { useAsync } from '../hooks/useAsync';
import AsyncState from '../components/common/AsyncState';
import UserAvatar from '../components/common/UserAvatar';

const imgOf = (u) => u?.image_url || u?.image || u?.avatar_url || '';

function metrics(item, sort, t) {
  const activity = item?.activity ?? 0;
  const stars = item?.stars ?? 0;
  if (sort === 'stars') {
    return {
      primary: stars,
      primaryLabel: t('lead.stars', 'yulduz'),
      secondary: `${activity} ${t('lead.casesSolved', 'ta keys')}`,
    };
  }
  return {
    primary: activity,
    primaryLabel: t('lead.casesSolved', 'ta keys'),
    secondary: `${stars} ${t('lead.stars', 'yulduz')}`,
  };
}

export default function Leaderboard({ onBack }) {
  const { t } = useTranslation();
  const [filterType, setFilterType] = useState('total');
  const [sort, setSort] = useState('activity');
  const { data: leaderboard, error, reload } = useAsync(
    () => api.getUserRating(filterType, 10, sort),
    [filterType, sort],
  );

  const items = leaderboard?.items || [];
  const me = leaderboard?.me || null;

  if (error) {
    return (
      <div style={{
        width: '100%', minHeight: '85vh', background: 'var(--bg-main)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        <AsyncState error={error} onRetry={reload} />
      </div>
    );
  }

  const pill = (active) => ({
    padding: '8px 18px',
    borderRadius: 99,
    fontSize: '13px',
    fontWeight: 700,
    background: active ? '#16A34A' : 'transparent',
    color: active ? '#FFFFFF' : 'var(--ink-3)',
    boxShadow: active ? '0 4px 12px rgba(22, 163, 74, 0.3)' : 'none',
    transition: 'all 0.15s ease',
    border: 'none',
    cursor: 'pointer',
  });

  return (
    <div style={{
      width: '100%',
      minHeight: '85vh',
      background: 'var(--bg-main)',
      padding: '32px 16px 100px 16px',
      boxSizing: 'border-box',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
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
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                color: 'var(--ink-2)',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--surface-3)';
                e.currentTarget.style.color = 'var(--ink)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--surface)';
                e.currentTarget.style.color = 'var(--ink-2)';
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
            background: 'var(--tint-amber)',
            border: '1px solid var(--tint-amber-border)',
            color: '#D97706',
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '5px 14px',
            borderRadius: 99,
            marginBottom: 10,
          }}>
            <Trophy size={14} />
            <span>{t('lead.badge')}</span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--ink)', margin: '4px 0 6px 0' }}>
            {t('lead.title')}
          </h1>
          <p style={{ color: 'var(--ink-3)', fontSize: '14px', margin: 0 }}>
            {t('lead.subtitle')}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <div style={{
            display: 'inline-flex',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 99,
            padding: 4,
            boxShadow: 'var(--shadow-sm)',
          }}>
            {[
              { id: 'day', label: t('lead.today') },
              { id: 'week', label: t('lead.thisWeek') },
              { id: 'month', label: t('lead.thisMonth') },
              { id: 'total', label: t('lead.allTime') },
            ].map((f) => (
              <button key={f.id} onClick={() => setFilterType(f.id)} style={pill(filterType === f.id)}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 99,
            padding: 4,
            boxShadow: 'var(--shadow-sm)',
          }}>
            <button onClick={() => setSort('activity')} style={pill(sort === 'activity')}>
              {t('lead.sortActivity', 'Case soni')}
            </button>
            <button onClick={() => setSort('stars')} style={pill(sort === 'stars')}>
              {t('lead.sortStars', 'Yulduzlar')}
            </button>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 14,
          marginBottom: 28,
          alignItems: 'flex-end',
        }}>
          {items[1] && (
            <div style={{
              background: 'var(--surface)',
              borderRadius: 18,
              border: '1px solid var(--line)',
              boxShadow: 'var(--shadow-sm)',
              padding: '20px 14px',
              textAlign: 'center',
              order: 1,
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 4 }}>🥈</div>
              <UserAvatar name={items[1].name} src={imgOf(items[1])} size={48} style={{ margin: '0 auto 10px', border: '1px solid var(--line-2)', boxSizing: 'border-box' }} />
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)', marginBottom: 2 }}>{items[1].name}</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#16A34A' }}>
                {sort === 'stars' && <Star size={14} color="#D97706" fill="#D97706" style={{ marginRight: 4, verticalAlign: 'middle' }} />}
                {metrics(items[1], sort, t).primary} {metrics(items[1], sort, t).primaryLabel}
              </div>
            </div>
          )}

          {items[0] && (
            <div style={{
              background: 'var(--surface)',
              borderRadius: 18,
              border: '1px solid var(--tint-amber-border)',
              boxShadow: 'var(--shadow-sm)',
              padding: '26px 16px',
              textAlign: 'center',
              order: 2,
              transform: 'translateY(-10px)',
            }}>
              <div style={{ fontSize: '2.2rem', marginBottom: 4 }}>👑</div>
              <UserAvatar name={items[0].name} src={imgOf(items[0])} size={58} style={{ margin: '0 auto 10px', border: '2.5px solid #FACC15', boxSizing: 'border-box' }} />
              <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--ink)', marginBottom: 2 }}>{items[0].name}</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#D97706' }}>
                {sort === 'stars' && <Star size={16} color="#D97706" fill="#D97706" style={{ marginRight: 4, verticalAlign: 'middle' }} />}
                {metrics(items[0], sort, t).primary} {metrics(items[0], sort, t).primaryLabel}
              </div>
            </div>
          )}

          {items[2] && (
            <div style={{
              background: 'var(--surface)',
              borderRadius: 18,
              border: '1px solid var(--line)',
              boxShadow: 'var(--shadow-sm)',
              padding: '20px 14px',
              textAlign: 'center',
              order: 3,
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: 4 }}>🥉</div>
              <UserAvatar name={items[2].name} src={imgOf(items[2])} size={48} style={{ margin: '0 auto 10px', border: '1px solid var(--tint-orange-border)', boxSizing: 'border-box' }} />
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)', marginBottom: 2 }}>{items[2].name}</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#16A34A' }}>
                {sort === 'stars' && <Star size={14} color="#D97706" fill="#D97706" style={{ marginRight: 4, verticalAlign: 'middle' }} />}
                {metrics(items[2], sort, t).primary} {metrics(items[2], sort, t).primaryLabel}
              </div>
            </div>
          )}
        </div>

        {me && (
        <div style={{
          background: 'var(--tint-green)',
          border: '1px solid var(--tint-green-border)',
          borderRadius: 16,
          padding: '14px 20px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <UserAvatar name={me.name} src={imgOf(me)} size={34} />
            <div style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: '#16A34A',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '14px',
            }}>
              #{me.rank}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14.5px', color: 'var(--on-green)' }}>
                {me.name} {t('lead.you')}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--on-green)' }}>
                {metrics(me, sort, t).primary} {metrics(me, sort, t).primaryLabel}
                {' · '}
                {metrics(me, sort, t).secondary}
              </div>
            </div>
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--on-green)' }}>
            #{me.rank}
          </div>
        </div>
        )}

        <div style={{
          background: 'var(--surface)',
          borderRadius: 18,
          border: '1px solid var(--line)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
        }}>
          {items.map((item, idx) => {
            const m = metrics(item, sort, t);
            return (
              <div
                key={item.user_id || idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 20px',
                  borderBottom: idx < items.length - 1 ? '1px solid var(--line)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: item.rank <= 3 ? '#D97706' : 'var(--ink-4)',
                    minWidth: 24,
                  }}>
                    #{item.rank}
                  </span>

                  <UserAvatar name={item.name} src={imgOf(item)} size={36} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--ink-3)' }}>
                      {m.secondary}
                    </div>
                  </div>
                </div>

                <div style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: item.is_me ? 'var(--on-green)' : '#16A34A',
                }}>
                  {m.primary}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
