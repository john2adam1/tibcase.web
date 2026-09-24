import React, { useState } from 'react';
import {
  Activity,
  Award,
  BookOpen,
  ChevronDown,
  Coins,
  Flame,
  Globe,
  LogOut,
  Menu,
  Shield,
  Stethoscope,
  User,
  Volume2,
  VolumeX,
  X,
  Zap
} from 'lucide-react';
import { getSoundEnabled, setSoundEnabled } from '../audio';

export default function AppNavbar({
  currentView,
  setCurrentView,
  user,
  activeCase,
  onOpenProfile,
  onLogout,
  lang,
  onLangChange,
  activeMode,
  setActiveMode
}) {
  const [soundOn, setSoundOn] = useState(getSoundEnabled());
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const navItems = [
    { id: 'cases', label: 'Klinik Keyslar', icon: BookOpen },
    { id: 'simulation', label: 'Simulyatsiya', icon: Stethoscope, badge: activeCase ? 'Faol' : null },
    { id: 'store', label: 'Tariflar & Do\'kon', icon: Coins },
    { id: 'leaderboard', label: 'Reyting', icon: Award },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(6, 11, 20, 0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(56, 189, 248, 0.15)',
      padding: '0 20px',
    }}>
      <div style={{
        maxWidth: 1380,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 72,
      }}>
        {/* Brand Logo & Mode Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            onClick={() => setCurrentView('cases')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(6, 182, 212, 0.4)',
            }}>
              <Activity className="heart-pulse" size={22} color="#ffffff" />
            </div>
            <div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.3rem',
                fontWeight: 800,
                color: '#fff',
              }}>
                TibCase
              </span>
              <span style={{
                marginLeft: 6,
                background: 'rgba(6, 182, 212, 0.15)',
                color: 'var(--accent-cyan)',
                padding: '1px 6px',
                borderRadius: 4,
                fontSize: '0.65rem',
                fontWeight: 700,
              }}>
                PRO
              </span>
            </div>
          </div>

          {/* Mode Pill (Clinical vs Citizen) */}
          <div className="desktop-nav" style={{
            display: 'flex',
            background: 'rgba(15, 23, 42, 0.7)',
            padding: 3,
            borderRadius: 99,
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <button
              onClick={() => setActiveMode('clinical')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 99,
                fontSize: '0.8rem',
                fontWeight: 700,
                background: activeMode === 'clinical' ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
                color: activeMode === 'clinical' ? '#38bdf8' : 'var(--text-muted)',
              }}
            >
              <Stethoscope size={14} />
              <span>Shifokorlar</span>
            </button>
            <button
              onClick={() => setActiveMode('citizen')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 99,
                fontSize: '0.8rem',
                fontWeight: 700,
                background: activeMode === 'citizen' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
                color: activeMode === 'citizen' ? '#34d399' : 'var(--text-muted)',
              }}
            >
              <Shield size={14} />
              <span>Birinchi Yordam</span>
            </button>
          </div>
        </div>

        {/* Workspace Main Navigation */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }} className="desktop-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  borderRadius: 10,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: isActive ? '#38bdf8' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid transparent',
                  position: 'relative',
                }}
              >
                <Icon size={18} color={isActive ? '#38bdf8' : 'var(--text-muted)'} />
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{
                    background: 'var(--accent-rose)',
                    color: '#fff',
                    fontSize: '0.65rem',
                    padding: '1px 6px',
                    borderRadius: 99,
                    fontWeight: 700,
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Section: Stats & User controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* User Stats Pill */}
          <div className="stats-bar" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '4px 12px',
            borderRadius: 99,
          }}>
            <div
              onClick={() => setCurrentView('store')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#fbbf24',
                cursor: 'pointer',
              }}
              title="Tangalar balansi"
            >
              <Coins size={15} color="#fbbf24" />
              <span>{user?.coins ?? 15}</span>
            </div>

            <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)' }} />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#f97316',
              }}
              title="Ketma-ketlik (Streak)"
            >
              <Flame size={15} color="#f97316" />
              <span>{user?.streak_count ?? 5}</span>
            </div>

            <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)' }} />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#34d399',
              }}
              title="Daraja"
            >
              <Zap size={14} color="#34d399" />
              <span>Lvl {user?.level ?? 1}</span>
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundOn ? "Monitor tovushini o'chirish" : "Monitor tovushini yoqish"}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: soundOn ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              border: soundOn ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
              color: soundOn ? 'var(--accent-cyan)' : 'var(--text-muted)',
            }}
          >
            {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Language Selector */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '6px 10px',
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: 600,
              }}
            >
              <Globe size={14} />
              <span>{lang?.toUpperCase() || 'UZ'}</span>
              <ChevronDown size={14} />
            </button>
            {langMenuOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: 40,
                background: '#0e172a',
                border: '1px solid var(--border-color)',
                borderRadius: 10,
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                minWidth: 100,
                overflow: 'hidden',
                zIndex: 60,
              }}>
                {['uz', 'ru', 'en'].map(code => (
                  <button
                    key={code}
                    onClick={() => {
                      onLangChange(code);
                      setLangMenuOpen(false);
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '8px 14px',
                      textAlign: 'left',
                      fontSize: '0.85rem',
                      color: lang === code ? '#38bdf8' : 'var(--text-primary)',
                      background: lang === code ? 'rgba(6,182,212,0.1)' : 'transparent',
                    }}
                  >
                    {code === 'uz' ? "O'zbekcha" : code === 'ru' ? "Русский" : "English"}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile Trigger */}
          <button
            onClick={onOpenProfile}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(37,99,235,0.15))',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            <div style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}>
              {user?.name ? user.name[0] : 'D'}
            </div>
            <span className="profile-name-text">
              {user?.name?.split(' ')[0] || 'Shifokor'}
            </span>
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            title="Chiqish"
            style={{
              padding: 8,
              borderRadius: 8,
              background: 'rgba(244, 63, 94, 0.1)',
              border: '1px solid rgba(244, 63, 94, 0.2)',
              color: '#fb7185',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LogOut size={16} />
          </button>

          {/* Mobile Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            style={{ padding: 6, color: '#fff' }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          padding: '14px 0 18px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setMobileMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  borderRadius: 8,
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: isActive ? '#38bdf8' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                }}
              >
                <Icon size={18} color={isActive ? '#38bdf8' : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
