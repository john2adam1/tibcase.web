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
import { useTranslation } from '../i18n.jsx';
import DashboardHero from './DashboardHero.jsx';

export default function HomeView({
  user,
  categories = [],
  banners = [],
  userLimit,
  onStartSimulation,
  onOpenClinics,
  onOpenStore,
  onOpenLeaderboard,
}) {
  const { t, lang } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);

  // Modal configuration states
  const [selectedCategory, setSelectedCategory] = useState('random');
  const [difficulty, setDifficulty] = useState("O'rta"); // 'Oson' | "O'rta" | 'Qiyin'
  const [duration, setDuration] = useState('10 daqiqa'); // '5 daqiqa' | '10 daqiqa' | '15 daqiqa'

  const difficultyLevels = [
    { id: 'Oson', label: t('modal.easy') },
    { id: "O'rta", label: t('modal.medium') },
    { id: 'Qiyin', label: t('modal.hard') }
  ];

  const durationOptions = [
    { id: '5 daqiqa', label: t('modal.min5') },
    { id: '10 daqiqa', label: t('modal.min10') },
    { id: '15 daqiqa', label: t('modal.min15') }
  ];

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
      maxWidth: 1120,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 32,
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      {/* 1. Dashboard Hero strictly with Real API Data */}
      <DashboardHero
        user={user}
        categories={categories}
        banners={banners}
        userLimit={userLimit}
        onOpenClinics={onOpenClinics}
        onOpenStore={onOpenStore}
        onOpenLeaderboard={onOpenLeaderboard}
      />

      {/* 2. Interactive AI Clinical Simulator Launcher */}
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}>
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
            <span>{t('home.aiEngine')}</span>
          </div>

          <div>
            <h2 style={{
              fontSize: '21px',
              fontWeight: 900,
              color: '#0F172A',
              margin: '0 0 6px 0',
            }}>
              {t('home.startSimulation')}
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#64748B',
              margin: 0,
              lineHeight: 1.5,
              maxWidth: 460,
            }}>
              {t('home.startSimulationDesc')}
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
            <span>{t('home.startSimulation')}</span>
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
              {t('home.icuFeature')}
            </span>
            <span style={{ fontSize: '11px', color: '#64748B' }}>
              {t('home.icuDesc')}
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
              {t('home.deptFeature')}
            </span>
            <span style={{ fontSize: '11px', color: '#64748B' }}>
              {t('home.deptDesc')}
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
              {t('home.protocolFeature')}
            </span>
            <span style={{ fontSize: '11px', color: '#64748B' }}>
              {t('home.protocolDesc')}
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
                {t('modal.configTitle')}
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
                  {t('modal.step1')}
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
                  {t('modal.clinicalMode')}
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
                  <option value="random">{t('modal.randomOption')}</option>
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
                <span>{t('modal.step2')}</span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 8,
              }}>
                {difficultyLevels.map((lvl) => {
                  const isSelected = difficulty === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setDifficulty(lvl.id)}
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
                      {lvl.label}
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
                <span>{t('modal.step3')}</span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 8,
              }}>
                {durationOptions.map((dur) => {
                  const isSelected = duration === dur.id;
                  return (
                    <button
                      key={dur.id}
                      type="button"
                      onClick={() => setDuration(dur.id)}
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
                      {dur.label}
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
              <span>{t('modal.startBtn')}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
