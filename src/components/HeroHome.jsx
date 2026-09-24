import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  HeartPulse,
  Play,
  RotateCw,
  Shield,
  Sparkles,
  Stethoscope,
  Users,
  Zap
} from 'lucide-react';

export default function HeroHome({
  categories = [],
  banners = [],
  partners = [],
  onStartQuickSimulation,
  onLaunchRandomCase,
  onViewCatalog,
  onOpenStore,
  activeMode,
  setActiveMode,
}) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '');
  const [difficulty, setDifficulty] = useState('easy');
  const [duration, setDuration] = useState('5');
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  const handleLaunch = () => {
    onStartQuickSimulation({
      categoryId: selectedCategory || categories[0]?.id,
      difficulty,
      durationMinutes: parseInt(duration, 10)
    });
  };

  return (
    <div style={{ maxWidth: 1380, margin: '0 auto', padding: '32px 20px 80px' }}>
      {/* Mode Selector Segmented Pill */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 36,
      }}>
        <div style={{
          display: 'inline-flex',
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          borderRadius: 99,
          padding: 4,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}>
          <button
            onClick={() => setActiveMode('clinical')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 22px',
              borderRadius: 99,
              fontSize: '0.92rem',
              fontWeight: 700,
              background: activeMode === 'clinical'
                ? 'linear-gradient(135deg, #06b6d4, #0284c7)'
                : 'transparent',
              color: activeMode === 'clinical' ? '#ffffff' : 'var(--text-secondary)',
              boxShadow: activeMode === 'clinical' ? '0 4px 14px rgba(6,182,212,0.35)' : 'none',
            }}
          >
            <Stethoscope size={18} />
            <span>Klinik Rejim (Shifokorlar)</span>
          </button>

          <button
            onClick={() => setActiveMode('citizen')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 22px',
              borderRadius: 99,
              fontSize: '0.92rem',
              fontWeight: 700,
              background: activeMode === 'citizen'
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'transparent',
              color: activeMode === 'citizen' ? '#ffffff' : 'var(--text-secondary)',
              boxShadow: activeMode === 'citizen' ? '0 4px 14px rgba(16,185,129,0.35)' : 'none',
            }}
          >
            <Shield size={18} />
            <span>Aholi Rejimi (Birinchi Yordam)</span>
          </button>
        </div>
      </div>

      {/* Main Hero Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 32,
        alignItems: 'center',
        marginBottom: 60,
      }}>
        {/* Left Column: Vision & Pitch */}
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            borderRadius: 99,
            background: 'rgba(6, 182, 212, 0.12)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            color: 'var(--accent-cyan)',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: 20,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <Sparkles size={16} />
            <span>Gemini AI + Xalqaro Tibbiy Protokollar</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
            lineHeight: 1.15,
            marginBottom: 20,
            fontWeight: 800,
            letterSpacing: '-0.03em',
          }}>
            Virtual Bemor va{' '}
            <span style={{
              background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #34d399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Klinik Qaror
            </span>{' '}
            Simulyatori
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: 32,
            maxWidth: 580,
          }}>
            Real fiziologik o'zgaruvchan vitallar (EKG, Puls, Bosim, SpO2), AI bemor bilan jonli muloqot hamda har bir harakatning darhol debriefing tahlili.
          </p>

          {/* Quick Stats Badges */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 32,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 16px',
              borderRadius: 14,
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              <HeartPulse size={22} color="#06b6d4" />
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>100%</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dinamik Fiziologiya</div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 16px',
              borderRadius: 14,
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              <Award size={22} color="#10b981" />
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>AHA & ERC</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Xalqaro Standartlar</div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 16px',
              borderRadius: 14,
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              <Zap size={22} color="#fbbf24" />
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>AI Debriefing</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Xatolar Tahlili</div>
              </div>
            </div>
          </div>

          {/* Action triggers */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            <button
              onClick={onViewCatalog}
              className="btn-primary"
              style={{ fontSize: '1rem', padding: '14px 28px' }}
            >
              <span>Barcha Keyslar Katalogi</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={onLaunchRandomCase}
              className="btn-secondary"
              style={{ fontSize: '1rem', padding: '14px 24px' }}
            >
              <RotateCw size={18} />
              <span>Omadingizni Sinab Ko'ring</span>
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Simulation Launcher Widget (TZ 4.1 B) */}
        <div className="glass-panel" style={{
          padding: 28,
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, rgba(17, 27, 49, 0.85) 0%, rgba(10, 17, 32, 0.95) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(6, 182, 212, 0.15)',
        }}>
          {/* Glowing top line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #10b981)',
          }} />

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(6, 182, 212, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)',
              }}>
                <Play size={18} />
              </div>
              <h3 style={{ fontSize: '1.25rem' }}>Tezkor Simulyatsiya</h3>
            </div>
            <span className="badge badge-cyan">Jonli Tayyor</span>
          </div>

          <p style={{
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            marginBottom: 20,
          }}>
            Bo'lim, qiyinlik va vaqtni tanlang va bir tugma bilan virtual bemor qabuliga kiring:
          </p>

          {/* Form Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Section / Category Dropdown */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                1. Tibbiy Bo'lim
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                }}
              >
                {categories.length > 0 ? (
                  categories.map(cat => (
                    <option key={cat.id} value={cat.id} style={{ background: '#0e172a' }}>
                      {cat.name} ({cat.cases_count ?? 1} keys)
                    </option>
                  ))
                ) : (
                  <option value="kardio" style={{ background: '#0e172a' }}>Kardiologiya (O'tkir koronar sindrom)</option>
                )}
              </select>
            </div>

            {/* Difficulty Selector */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                2. Qiyinlik Darajasi
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 8,
              }}>
                {[
                  { id: 'easy', label: 'Oson', color: '#10b981' },
                  { id: 'medium', label: "O'rta", color: '#f59e0b' },
                  { id: 'hard', label: 'Qiyin', color: '#ef4444' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDifficulty(item.id)}
                    style={{
                      padding: '10px 4px',
                      borderRadius: 8,
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      background: difficulty === item.id ? `rgba(${item.id === 'easy' ? '16, 185, 129' : item.id === 'medium' ? '245, 158, 11' : '239, 68, 68'}, 0.2)` : 'rgba(255,255,255,0.04)',
                      border: difficulty === item.id ? `1px solid ${item.color}` : '1px solid rgba(255,255,255,0.08)',
                      color: difficulty === item.id ? item.color : 'var(--text-secondary)',
                      textAlign: 'center',
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Selector */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                3. Ajratilgan Vaqt
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 8,
              }}>
                {[
                  { val: '5', label: '5 daqiqa (Ekspress)' },
                  { val: '10', label: '10 daqiqa (Standart)' },
                  { val: '15', label: '15 daqiqa (Chuqur)' }
                ].map(item => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setDuration(item.val)}
                    style={{
                      padding: '10px 4px',
                      borderRadius: 8,
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      background: duration === item.val ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255,255,255,0.04)',
                      border: duration === item.val ? '1px solid var(--accent-cyan)' : '1px solid rgba(255,255,255,0.08)',
                      color: duration === item.val ? '#38bdf8' : 'var(--text-secondary)',
                      textAlign: 'center',
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Launch CTA */}
            <button
              onClick={handleLaunch}
              className="btn-primary"
              style={{
                marginTop: 10,
                padding: '14px',
                fontSize: '1.05rem',
                width: '100%',
              }}
            >
              <Play size={20} fill="#fff" />
              <span>Simulyatsiyani Boshlash</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Banners Carousel (TZ 4.1 C) */}
      {banners.length > 0 && (
        <div style={{ marginBottom: 60 }}>
          <div className="glass-panel" style={{
            padding: 24,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            flexWrap: 'wrap',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(37, 99, 235, 0.12) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
          }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <span className="badge badge-amber" style={{ marginBottom: 10 }}>Maxsus Taklif</span>
              <h3 style={{ fontSize: '1.4rem', marginBottom: 8 }}>
                {banners[activeBannerIdx]?.title || "Hamkor kurslari bilan MedicAI Premium tekin!"}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: 14 }}>
                {banners[activeBannerIdx]?.description || "Hamkor o'quv markazlarimiz kurslarini xarid qiling va MedicAI platformasiga 1 oylik to'liq Premium obunaga ega bo'ling!"}
              </p>
              <button
                onClick={onOpenStore}
                className="btn-secondary"
                style={{ fontSize: '0.88rem', padding: '8px 16px' }}
              >
                <span>Batafsil ma'lumot</span>
                <ExternalLink size={14} />
              </button>
            </div>

            {banners[activeBannerIdx]?.image_url && (
              <div style={{
                width: 140,
                height: 100,
                borderRadius: 12,
                overflow: 'hidden',
                background: '#0e172a',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <img
                  src={banners[activeBannerIdx].image_url}
                  alt={banners[activeBannerIdx].title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Educational Partners Section (TZ 2.1 / API /mobile/partner) */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 4 }}>Rasmiy Hamkorlarimiz</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Tibbiyot oliygohlari, klinikalar va o'quv platformalari
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
        }}>
          {partners.map(p => (
            <div
              key={p.id}
              className="glass-panel"
              style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: 'var(--accent-cyan)',
                fontSize: '1.1rem',
              }}>
                {p.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>{p.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Ta'lim hamkori</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
