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
  Play
} from 'lucide-react';

export default function HomeView({
  user,
  categories = [],
  onStartSimulation,
  onOpenClinics
}) {
  const [modalOpen, setModalOpen] = useState(false);

  // Modal configuration states
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
      padding: '32px 16px 100px 16px',
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
          gap: 10,
        }}>
          {/* Glowing Green Stethoscope Avatar Badge */}
          <div style={{
            width: 68,
            height: 68,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
            boxShadow: '0 8px 24px rgba(34, 197, 94, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
          }}>
            <Stethoscope size={34} strokeWidth={2.4} />
          </div>

          <h1 style={{
            fontSize: '26px',
            fontWeight: 900,
            color: '#0F172A',
            margin: '6px 0 0 0',
            letterSpacing: '-0.5px',
          }}>
            Salom, Dr. {user?.name?.split(' ')[0] || 'Akmal'}! 👋
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
          border: '1.5px solid #E2E8F0',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
          padding: '30px 24px',
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
            background: '#DCFCE7',
            border: '1.5px solid #86EFAC',
            padding: '6px 14px',
            borderRadius: 99,
            fontSize: '12px',
            fontWeight: 800,
            color: '#16A34A',
          }}>
            <Sparkles size={14} />
            <span>AI Klinik Simulyatsiya Dvigateli</span>
          </div>

          <div>
            <h2 style={{
              fontSize: '21px',
              fontWeight: 900,
              color: '#0F172A',
              margin: '0 0 6px 0',
            }}>
              Yangi Simulyatsiyani Boshlash
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#64748B',
              margin: 0,
              lineHeight: 1.5,
              maxWidth: 460,
            }}>
              Bemor ko'rsatkichlari real vaqtda modellashtiriladi: EKG monitor, qon bosimi va SpO2 o'zgarishlari sizning buyruqlaringizga bog'liq.
            </p>
          </div>

          {/* Central Green Start Simulation Button */}
          <button
            id="btn-open-simulation-modal"
            onClick={() => setModalOpen(true)}
            style={{
              width: '100%',
              maxWidth: 420,
              height: 56,
              borderRadius: 99,
              background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              boxShadow: '0 8px 24px rgba(34, 197, 94, 0.35)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(34, 197, 94, 0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(34, 197, 94, 0.35)';
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
            borderRadius: 22,
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.02)',
            padding: '16px 12px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: '#DCFCE7',
              color: '#16A34A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Activity size={20} />
            </div>
            <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A' }}>
              Real ICU Monitor
            </span>
            <span style={{ fontSize: '11px', color: '#64748B' }}>
              Jonli EKG to'lqini
            </span>
          </div>

          {/* 2. Clinical Cases */}
          <div
            onClick={onOpenClinics}
            style={{
              background: '#FFFFFF',
              borderRadius: 22,
              border: '1.5px solid #E2E8F0',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.02)',
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
              width: 40,
              height: 40,
              borderRadius: 12,
              background: '#EFF6FF',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Stethoscope size={20} />
            </div>
            <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A' }}>
              Klinik Bo'limlar
            </span>
            <span style={{ fontSize: '11px', color: '#64748B' }}>
              API dan dinamik
            </span>
          </div>

          {/* 3. AHA/ESC Guidelines */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 22,
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.02)',
            padding: '16px 12px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: '#FEF3C7',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <CheckCircle2 size={20} />
            </div>
            <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A' }}>
              Xalqaro Protokol
            </span>
            <span style={{ fontSize: '11px', color: '#64748B' }}>
              AHA & ESC 2024
            </span>
          </div>
        </div>

      </div>

      {/* 5-RASMDAGIDEK MODAL (Simulation Configuration Modal - White Claymorphic) */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
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
              background: '#FFFFFF',
              borderRadius: 28,
              border: '2px solid #E2E8F0',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.15)',
              padding: '24px 20px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            {/* Modal Header with Close Button */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A' }}>
                Simulyatsiya Sozlamalari
              </div>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  background: '#F1F5F9',
                  border: 'none',
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* CARD 1: Case Bo'limini Tanlang */}
            <div style={{
              background: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              borderRadius: 20,
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
                  fontSize: '12px',
                  fontWeight: 900,
                  color: '#475569',
                  letterSpacing: '0.6px',
                }}>
                  1. CASE BO'LIMINI TANLANG
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#16A34A',
                  background: '#DCFCE7',
                  border: '1px solid #86EFAC',
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
                    borderRadius: 14,
                    background: '#FFFFFF',
                    border: '1.5px solid #CBD5E1',
                    color: '#0F172A',
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
                  color: '#64748B',
                  fontSize: '12px',
                  fontWeight: 900,
                }}>
                  ↕
                </div>
              </div>
            </div>

            {/* CARD 2: Qiyinchilik Darajasini Tanlang */}
            <div style={{
              background: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              borderRadius: 20,
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: 900,
                color: '#475569',
                letterSpacing: '0.6px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <Clock size={14} color="#64748B" />
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
                        background: isSelected ? '#16A34A' : '#FFFFFF',
                        border: isSelected ? 'none' : '1.5px solid #E2E8F0',
                        color: isSelected ? '#FFFFFF' : '#475569',
                        fontSize: '14px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 4px 14px rgba(22, 163, 74, 0.3)' : 'none',
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
              background: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              borderRadius: 20,
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              <div style={{
                fontSize: '12px',
                fontWeight: 900,
                color: '#475569',
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
                        background: isSelected ? '#16A34A' : '#FFFFFF',
                        border: isSelected ? 'none' : '1.5px solid #E2E8F0',
                        color: isSelected ? '#FFFFFF' : '#475569',
                        fontSize: '13.5px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 4px 14px rgba(22, 163, 74, 0.3)' : 'none',
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
                background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 8px 24px rgba(34, 197, 94, 0.35)',
                marginTop: 4,
              }}
            >
              <Sparkles size={18} fill="#FFFFFF" />
              <span>Boshlash &gt;</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
