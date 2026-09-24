import React, { useEffect, useState } from 'react';
import {
  Award,
  Crown,
  Flame,
  Medal,
  Sparkles,
  Trophy,
  User,
  Zap
} from 'lucide-react';
import { api } from '../api';

export default function Leaderboard({ user }) {
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

  const items = leaderboard?.items || [
    { rank: 1, name: "Dr. Sardorbek Qodirov", xp: 1450, level: 7, streak_count: 14, cases_solved: 38 },
    { rank: 2, name: "Dilnoza Olimova", xp: 1120, level: 6, streak_count: 11, cases_solved: 29 },
    { rank: 3, name: "Javohir Toshpulatov", xp: 980, level: 5, streak_count: 8, cases_solved: 24 },
    { rank: 4, name: "Dr. Malika Rahimova", xp: 740, level: 4, streak_count: 6, cases_solved: 19 },
    { rank: 5, name: "Ulug'bek Nazarov", xp: 580, level: 4, streak_count: 5, cases_solved: 15 }
  ];

  const me = leaderboard?.me || {
    rank: 4,
    name: user?.name || "Dr. Akmal Karimov",
    xp: user?.xp || 320,
    level: user?.level || 3,
    streak_count: user?.streak_count || 5,
    cases_solved: 8
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 20px 80px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color: '#fbbf24',
          fontSize: '0.85rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: 8,
        }}>
          <Trophy size={16} />
          <span>Yetakchilar Jadvali</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', marginBottom: 8 }}>
          Klinik Reyting va Peshqadamlar
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Eng ko'p keys yechgan va yuqori diagnostik aniqlik ko'rsatgan shifokorlar
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 32,
      }}>
        <div style={{
          display: 'inline-flex',
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 12,
          padding: 4,
        }}>
          {[
            { id: 'day', label: 'Bugun' },
            { id: 'week', label: 'Shu Hafta' },
            { id: 'month', label: 'Shu Oy' },
            { id: 'total', label: 'Umumiy' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              style={{
                padding: '8px 18px',
                borderRadius: 8,
                fontSize: '0.88rem',
                fontWeight: 600,
                background: filterType === f.id ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                color: filterType === f.id ? '#38bdf8' : 'var(--text-secondary)',
                border: filterType === f.id ? '1px solid rgba(6, 182, 212, 0.35)' : '1px solid transparent',
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
        gap: 16,
        marginBottom: 32,
        alignItems: 'flex-end',
      }}>
        {/* Silver (Rank 2) */}
        {items[1] && (
          <div className="glass-panel" style={{
            padding: 20,
            textAlign: 'center',
            order: 1,
            border: '1px solid rgba(148, 163, 184, 0.3)',
          }}>
            <div style={{ fontSize: '1.8rem', marginBottom: 4 }}>🥈</div>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              margin: '0 auto 10px',
              background: 'linear-gradient(135deg, #94a3b8, #64748b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
            }}>
              {items[1].name.charAt(0)}
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 2 }}>{items[1].name}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8 }}>Lvl {items[1].level}</div>
            <div style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              color: '#38bdf8',
            }}>
              {items[1].xp} XP
            </div>
          </div>
        )}

        {/* Gold (Rank 1) */}
        {items[0] && (
          <div className="glass-panel" style={{
            padding: '28px 20px',
            textAlign: 'center',
            order: 2,
            border: '2px solid rgba(251, 191, 36, 0.6)',
            boxShadow: '0 10px 30px rgba(251, 191, 36, 0.25)',
            transform: 'translateY(-12px)',
          }}>
            <div style={{ fontSize: '2.4rem', marginBottom: 4 }}>👑</div>
            <div style={{
              width: 62,
              height: 62,
              borderRadius: '50%',
              margin: '0 auto 10px',
              background: 'linear-gradient(135deg, #fbbf24, #d97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 900,
              fontSize: '1.2rem',
              boxShadow: '0 0 16px rgba(251, 191, 36, 0.5)',
            }}>
              {items[0].name.charAt(0)}
            </div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: 2 }}>{items[0].name}</div>
            <div style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 600, marginBottom: 8 }}>
              Lvl {items[0].level} • {items[0].streak_count} kun streak 🔥
            </div>
            <div style={{
              fontSize: '1.35rem',
              fontWeight: 900,
              color: '#fbbf24',
            }}>
              {items[0].xp} XP
            </div>
          </div>
        )}

        {/* Bronze (Rank 3) */}
        {items[2] && (
          <div className="glass-panel" style={{
            padding: 20,
            textAlign: 'center',
            order: 3,
            border: '1px solid rgba(217, 119, 6, 0.3)',
          }}>
            <div style={{ fontSize: '1.8rem', marginBottom: 4 }}>🥉</div>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              margin: '0 auto 10px',
              background: 'linear-gradient(135deg, #d97706, #92400e)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
            }}>
              {items[2].name.charAt(0)}
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 2 }}>{items[2].name}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 8 }}>Lvl {items[2].level}</div>
            <div style={{
              fontSize: '1.15rem',
              fontWeight: 800,
              color: '#38bdf8',
            }}>
              {items[2].xp} XP
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard Full List */}
      <div className="glass-panel" style={{ padding: 16, marginBottom: 24 }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}>
          {items.map((row, index) => {
            const isMe = row.name === me.name;
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                  borderRadius: 12,
                  background: isMe ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                  border: isMe ? '1px solid var(--accent-cyan)' : '1px solid transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 28,
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: index === 0 ? '#fbbf24' : index === 1 ? '#94a3b8' : index === 2 ? '#d97706' : 'var(--text-muted)',
                    textAlign: 'center',
                  }}>
                    #{row.rank || index + 1}
                  </div>

                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color: '#fff',
                  }}>
                    {row.name.charAt(0)}
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: isMe ? 'var(--accent-cyan)' : '#fff' }}>
                      {row.name} {isMe && '(Siz)'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Daraja: Lvl {row.level} • Yechilgan: {row.cases_solved || 12} keys
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    color: '#38bdf8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}>
                    <Zap size={16} color="#38bdf8" />
                    <span>{row.xp} XP</span>
                  </div>
                  {row.streak_count > 0 && (
                    <div style={{ fontSize: '0.75rem', color: '#f97316', display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
                      <Flame size={12} color="#f97316" />
                      <span>{row.streak_count} kun</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
