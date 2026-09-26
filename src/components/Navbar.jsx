import React, { useState } from 'react';
import {
  Activity,
  Award,
  BookOpen,
  ChevronDown,
  Coins,
  Flame,
  Globe,
  Menu,
  ShieldCheck,
  Stethoscope,
  User,
  Volume2,
  VolumeX,
  X,
  Zap
} from 'lucide-react';
import { getSoundEnabled, setSoundEnabled } from '../audio';

export default function Navbar({
  currentView,
  setCurrentView,
  user,
  limit,
  activeCase,
  onOpenAuth,
  onOpenProfile,
  lang,
  onLangChange
}) {
  const [soundOn, setSoundOn] = useState(getSoundEnabled());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const navItems = [
    { id: 'home', label: 'Bosh sahifa', icon: Activity },
    { id: 'cases', label: 'Klinik Keyslar', icon: BookOpen },
    { id: 'simulation', label: 'Simulyatsiya', icon: Stethoscope, badge: activeCase ? 'Jonli' : null },
    { id: 'store', label: 'Tariflar & Tangalar', icon: Coins },
    { id: 'leaderboard', label: 'Reyting', icon: Award },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(6, 11, 20, 0.88)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(56, 189, 248, 0.12)',
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
        {/* Brand Logo */}
        <div
          onClick={() => setCurrentView('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(6, 182, 212, 0.45)',
          }}>
            <Activity className="heart-pulse" size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.35rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                background: 'linear-gradient(90deg, #f8fafc, #38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                TibCase
              </span>
              <span style={{
                background: 'rgba(6, 182, 212, 0.15)',
                color: 'var(--accent-cyan)',
                border: '1px solid rgba(6, 182, 212, 0.35)',
                padding: '1px 6px',
                borderRadius: 6,
                fontSize: '0.65rem',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}>
                AI Sim
              </span>
            </div>
            <div style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.02em',
            }}>
              Klinik Qaror Simulyatori
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
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
                  padding: '8px 14px',
                  borderRadius: 10,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: isActive ? '#38bdf8' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(6, 182, 212, 0.25)' : '1px solid transparent',
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
                    animation: 'gentleBlink 1.2s infinite'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Section: Stats & Action Widgets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Stats Bar (Desktop) */}
          <div className="stats-bar" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '4px 10px',
            borderRadius: 99,
          }}>
            {/* Coins */}
            <div
              onClick={() => setCurrentView('store')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#fbbf24',
              }}
              title="Tangalar balansi"
            >
              <Coins size={16} color="#fbbf24" />
              <span>{user?.coins ?? 0}</span>
            </div>

            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />

            {/* Streak */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#f97316',
              }}
              title="Kunlik ketma-ketlik (Streak)"
            >
              <Flame size={16} color="#f97316" />
              <span>{user?.streak_count ?? 0}</span>
            </div>

            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />

            {/* Level / XP */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#34d399',
              }}
              title="Foydalanuvchi darajasi"
            >
              <Zap size={15} color="#34d399" />
              <span>Lvl {user?.level ?? 1}</span>
            </div>

            {limit && (
              <>
                <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)',
                  }}
                  title="Kunlik urinish kvotasi"
                >
                  <ShieldCheck size={15} color="var(--accent-cyan)" />
                  <span>{limit.remaining ?? 42}/{limit.total ?? 50}</span>
                </div>
              </>
            )}
          </div>

          {/* Sound Synthesizer Toggle */}
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
              <Globe size={15} />
              <span>{lang?.toUpperCase() || 'UZ'}</span>
              <ChevronDown size={14} />
            </button>
            {langMenuOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: 42,
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

          {/* User Profile or Login */}
          <button
            onClick={onOpenProfile}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(6,182,212,0.12), rgba(37,99,235,0.12))',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              color: 'var(--text-primary)',
              fontSize: '0.88rem',
              fontWeight: 600,
            }}
          >
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}>
              {user?.name ? user.name[0] : 'D'}
            </div>
            <span className="profile-name-text">
              {user?.name?.split(' ')[0] || 'Shifokor'}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              padding: 8,
              color: 'var(--text-primary)',
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          padding: '16px 0 20px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
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
                  padding: '12px 16px',
                  borderRadius: 10,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: isActive ? '#38bdf8' : 'var(--text-secondary)',
                  background: isActive ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                }}
              >
                <Icon size={20} color={isActive ? '#38bdf8' : 'var(--text-muted)'} />
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{
                    background: 'var(--accent-rose)',
                    color: '#fff',
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: 99,
                    marginLeft: 'auto'
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
