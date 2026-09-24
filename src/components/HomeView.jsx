import React, { useState } from 'react';
import {
  Sparkles,
  Activity,
  Heart,
  ChevronRight,
  Clock,
  CheckCircle2,
  Stethoscope,
  X,
  Zap,
  Play
} from 'lucide-react';

export default function HomeView({
  user,
  categories = [],
  onStartSimulation,
  onOpenClinics
}) {
  const [modalOpen, setModalOpen] = useState(false);

  // Modal configuration states matching Screenshot 5
  const [selectedCategory, setSelectedCategory] = useState('random');
  const [difficulty, setDifficulty] = useState("O'rta"); // 'Oson' | "O'rta" | 'Qiyin'
  const [duration, setDuration] = useState('10 daqiqa'); // '5 daqiqa' | '10 daqiqa' | '15 daqiqa'

  const handleLaunch = () => {
    setModalOpen(false);
    if (onStartSimulation) {
      onStartSimulation({
        categoryId: selectedCategory === 'random' ? null : selectedCategory,
        difficulty,
        duration
      });
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '85vh',
      background: '#F8FAFC',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '24px 16px 100px 16px',
      boxSizing: 'border-box',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{
        width: '100%',
        maxWidth: 620,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
      }}>

        {/* AI Chatbot-Style Header Welcome */}
        <div style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          marginTop: 12,
        }}>
          {/* Glowing AI Stethoscope Icon */}
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0284C7 0%, #2563EB 100%)',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
          }}>
            <Stethoscope size={32} strokeWidth={2.4} />
          </div>

          <h1 style={{
            fontSize: '26px',
            fontWeight: 900,
            color: '#0F172A',
            margin: '8px 0 0 0',
            letterSpacing: '-0.5px',
          }}>
            Salom, Dr. {user?.name || 'Hamkasb'}! 👋
          </h1>
          <p style={{
            fontSize: '14.5px',
            color: '#64748B',
            margin: 0,
            maxWidth: 440,
            lineHeight: 1.5,
          }}>
            Virtual reanimatsiya palatasiga xush kelibsiz. Real bemorlar holatini boshqaring va klinik mahoratingizni oshiring.
          </p>
        </div>

        {/* Main Central Interactive Card (AI Assistant / Simulation Trigger) */}
        <div style={{
          width: '100%',
          background: '#FFFFFF',
          borderRadius: 28,
          border: '2px solid #E2E8F0',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04), 0 4px 0 #E2E8F0',
          padding: '28px 24px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 20,
        }}>
          {/* Mode Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            padding: '6px 14px',
            borderRadius: 99,
            fontSize: '12px',
            fontWeight: 800,
            color: '#2563EB',
          }}>
            <Sparkles size={14} />
            <span>AI Klinik Simulyatsiya Dvigateli</span>
          </div>

          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 900,
              color: '#0F172A',
              margin: '0 0 6px 0',
            }}>
              Yangi Simulyatsiyani Boshlash
            </h2>
            <p style={{
              fontSize: '13.5px',
              color: '#64748B',
              margin: 0,
              lineHeight: 1.5,
              maxWidth: 460,
            }}>
              Sun'iy intellekt bemor ko'rsatkichlarini real vaqtda modellashtiradi: EKG monitor, qon bosimi va SpO2 o'zgarishlari sizning qaroringizga bog'liq.
            </p>
          </div>

          {/* Central Prominent Start Simulation Button */}
          <button
            id="btn-open-simulation-modal"
            onClick={() => setModalOpen(true)}
            style={{
              width: '100%',
              maxWidth: 420,
              height: 56,
              borderRadius: 99,
              background: 'linear-gradient(90deg, #38BDF8 0%, #2563EB 100%)',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 26px rgba(37, 99, 235, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
            }}
          >
            <Play size={20} fill="#FFFFFF" />
            <span>Simulyatsiyani Boshlash</span>
            <ChevronRight size={20} strokeWidth={2.6} />
          </button>
        </div>

        {/* 3 Minimal Feature Highlights */}
        <div style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
        }}>
          {/* 1. Real ICU Monitor */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 20,
            border: '1.5px solid #E2E8F0',
            padding: '16px 12px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#DCFCE7',
              color: '#16A34A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Activity size={18} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>
              Real ICU Monitor
            </span>
            <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>
              Jonli EKG to'lqini
            </span>
          </div>

          {/* 2. Clinical Cases */}
          <div
            onClick={onOpenClinics}
            style={{
              background: '#FFFFFF',
              borderRadius: 20,
              border: '1.5px solid #E2E8F0',
              padding: '16px 12px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#EFF6FF',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Stethoscope size={18} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>
              Klinik Bo'limlar
            </span>
            <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>
              API dan yangilanadi
            </span>
          </div>

          {/* 3. AHA/ESC Guidelines */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 20,
            border: '1.5px solid #E2E8F0',
            padding: '16px 12px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#FEF3C7',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <CheckCircle2 size={18} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>
              Xalqaro Protokol
            </span>
            <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>
              AHA & ESC 2024
            </span>
          </div>
        </div>

      </div>

      {/* 5-RASMDAGIDEK MODAL (Simulation Configuration Modal) */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 11, 20, 0.8)',
            backdropFilter: 'blur(6px)',
            zIndex: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 440,
              background: '#0B1320',
              borderRadius: 26,
              border: '2px solid #1E2D42',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
              padding: '22px 20px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            {/* CARD 1: Case Bo'limini Tanlang */}
            <div style={{
              background: '#0F1B2D',
              border: '1.5px solid #1E2D42',
              borderRadius: 18,
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{
                  fontSize: '12.5px',
                  fontWeight: 900,
                  color: '#94A3B8',
                  letterSpacing: '0.6px',
                }}>
                  1. CASE BO'LIMINI TANLANG
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#38BDF8',
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  padding: '3px 10px',
                  borderRadius: 99,
                }}>
                  Clinical Mode
                </span>
              </div>

              {/* Dropdown with Random + API categories */}
              <div style={{ position: 'relative', width: '100%' }}>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: 12,
                    background: '#070D18',
                    border: '1.5px solid #20334E',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: 700,
                    outline: 'none',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                    appearance: 'none',
                  }}
                >
                  <option value="random">— Istalgan bo'lim (Random) —</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name || cat.title}
                    </option>
                  ))}
                </select>
                <div style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: '#94A3B8',
                  fontSize: '12px',
                  fontWeight: 900,
                }}>
                  ↕
                </div>
              </div>
            </div>

            {/* CARD 2: Qiyinchilik Darajasini Tanlang */}
            <div style={{
              background: '#0F1B2D',
              border: '1.5px solid #1E2D42',
              borderRadius: 18,
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              <div style={{
                fontSize: '12.5px',
                fontWeight: 900,
                color: '#94A3B8',
                letterSpacing: '0.6px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <Clock size={14} color="#94A3B8" />
                <span>2. QIYINCHILIK DARAJASINI TANLANG</span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 8,
              }}>
                {['Oson', "O'rta", 'Qiyin'].map((level) => {
                  const isSelected = difficulty === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setDifficulty(level)}
                      style={{
                        padding: '14px 8px',
                        borderRadius: 14,
                        background: isSelected ? '#1A1813' : '#070D18',
                        border: isSelected ? '1.5px solid #F59E0B' : '1.5px solid #20334E',
                        color: isSelected ? '#FBBF24' : '#E2E8F0',
                        fontSize: '14px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CARD 3: Davomiylik (Duration) ni Tanlang */}
            <div style={{
              background: '#0F1B2D',
              border: '1.5px solid #1E2D42',
              borderRadius: 18,
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              <div style={{
                fontSize: '12.5px',
                fontWeight: 900,
                color: '#94A3B8',
                letterSpacing: '0.6px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <span style={{ fontSize: '13px' }}>⏱</span>
                <span>3. DAVOMIYLIK (DURATION) NI TANLANG</span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 8,
              }}>
                {['5 daqiqa', '10 daqiqa', '15 daqiqa'].map((dur) => {
                  const isSelected = duration === dur;
                  return (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setDuration(dur)}
                      style={{
                        padding: '14px 8px',
                        borderRadius: 14,
                        background: isSelected ? '#1A1813' : '#070D18',
                        border: isSelected ? '1.5px solid #F59E0B' : '1.5px solid #20334E',
                        color: isSelected ? '#FBBF24' : '#E2E8F0',
                        fontSize: '13.5px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {dur}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SUBMIT BUTTON: ✨ Boshlash > */}
            <button
              id="btn-start-case-modal"
              onClick={handleLaunch}
              style={{
                width: '100%',
                height: 54,
                borderRadius: 99,
                background: 'linear-gradient(90deg, #38BDF8 0%, #2563EB 100%)',
                border: 'none',
                color: '#04152D',
                fontSize: '16px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                boxShadow: '0 6px 20px rgba(56, 189, 248, 0.4)',
                marginTop: 4,
              }}
            >
              <Sparkles size={18} fill="#04152D" />
              <span>Boshlash &gt;</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
