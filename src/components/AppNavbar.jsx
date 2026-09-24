import React, { useState } from 'react';
import {
  Activity,
  Award,
  Building2,
  ChevronDown,
  Coins,
  Flame,
  Globe,
  HeartPulse,
  LogOut,
  Menu,
  Shield,
  Stethoscope,
  User,
  Volume2,
  VolumeX,
  X,
  Zap,
  Sparkles
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
}) {
  const [soundOn, setSoundOn] = useState(getSoundEnabled());
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  // The 5 menu items from the bottom navigation
  const navItems = [
    { id: 'cases', label: 'Home', subtitle: 'Klinik keyslar katalogi', icon: Building2 },
    { id: 'simulation', label: 'Simulation', subtitle: 'Interaktiv simulyatsiya', icon: HeartPulse, badge: activeCase ? 'Faol' : null },
    { id: 'clinics', label: 'Clinics', subtitle: 'Bo\'limlar & Klinika', icon: Stethoscope },
    { id: 'leaderboard', label: 'Ranking', subtitle: 'Peshqadamlar reytingi', icon: Award },
    { id: 'profile', label: 'Profile', subtitle: 'Mening profilim & Sozlamalar', icon: User },
  ];

  const handleSelectNav = (id) => {
    if (id === 'profile' && onOpenProfile) {
      onOpenProfile();
    } else {
      setCurrentView(id);
    }
    setDrawerOpen(false);
  };

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(6, 11, 20, 0.94)',
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
          height: 70,
        }}>
          {/* Brand Logo (Left) */}
          <div
            onClick={() => handleSelectNav('cases')}
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

          {/* Right Section: Stats, Quick Tools, and Hamburger Menu Button */}
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
                onClick={() => handleSelectNav('store')}
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
                cursor: 'pointer',
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
                  gap: 6,
                  padding: '6px 10px',
                  borderRadius: 8,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Globe size={15} />
                <span>{lang ? lang.toUpperCase() : 'UZ'}</span>
                <ChevronDown size={14} />
              </button>

              {langMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  background: '#0d1527',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: 10,
                  padding: 4,
                  minWidth: 120,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  zIndex: 60,
                }}>
                  {[
                    { code: 'uz', label: "O'zbekcha" },
                    { code: 'ru', label: "Русский" },
                    { code: 'en', label: "English" }
                  ].map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        if (onLangChange) onLangChange(item.code);
                        setLangMenuOpen(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: lang === item.code ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                        background: lang === item.code ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
                        borderRadius: 6,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Avatar Pill */}
            <button
              onClick={() => handleSelectNav('profile')}
              title="Profilga o'tish"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '5px 10px',
                borderRadius: 10,
                background: currentView === 'profile'
                  ? 'rgba(34, 197, 94, 0.18)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: currentView === 'profile'
                  ? '1.5px solid #22c55e'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: '#FDE047',
                border: '1.5px solid #FEF08A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#854D0E',
                fontSize: '0.75rem',
                fontWeight: 800,
                overflow: 'hidden',
              }}>
                <img
                  src="/student_avatar.jpg"
                  alt="avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <span className="profile-name-text">
                {user?.name?.split(' ')[0] || 'John'}
              </span>
            </button>

            {/* HAMBURGER MENU BUTTON (Prominent for Laptop, Tablet, Desktop) */}
            <button
              id="btn-hamburger-menu"
              onClick={() => setDrawerOpen(true)}
              title="Menyu"
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1.5px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(6, 182, 212, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              <Menu size={22} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* HAMBURGER MENU DRAWER (Laptop, Tablet, Mobile)            */}
      {/* ========================================================= */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(4, 9, 20, 0.7)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 100,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div
            className="drawer-slide-in"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 360,
              height: '100%',
              background: '#0d1627',
              borderLeft: '1px solid rgba(56, 189, 248, 0.2)',
              boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.6)',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              padding: '24px 20px',
            }}
          >
            {/* Drawer Header: User Profile Summary & Close */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 20,
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: 16,
            }}>
              <div
                onClick={() => handleSelectNav('profile')}
                style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: '#FDE047',
                  border: '2px solid #FEF08A',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <img
                    src="/student_avatar.jpg"
                    alt="avatar"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>
                    {user?.name || 'John'}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                    {user?.specialty || 'Medical Student'}
                  </div>
                </div>
              </div>

              {/* Close Drawer Button */}
              <button
                onClick={() => setDrawerOpen(false)}
                title="Yopish"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation Menu Items (5 items from bottom bar) */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              flex: 1,
              overflowY: 'auto',
            }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 800,
                color: 'var(--text-muted)',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                padding: '4px 8px',
              }}>
                Asosiy Menyu
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;

                return (
                  <button
                    key={item.id}
                    id={`drawer-item-${item.id}`}
                    onClick={() => handleSelectNav(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '12px 16px',
                      borderRadius: 14,
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.12))'
                        : 'transparent',
                      border: isActive
                        ? '1.5px solid rgba(34, 197, 94, 0.4)'
                        : '1px solid transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {/* Icon container */}
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: isActive ? '#DCFCE7' : 'rgba(255, 255, 255, 0.05)',
                      border: isActive ? '1.5px solid #86EFAC' : '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isActive ? '#16A34A' : 'var(--text-muted)',
                      flexShrink: 0,
                    }}>
                      <Icon size={20} strokeWidth={2.4} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        color: isActive ? '#4ade80' : '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                        <span>{item.label}</span>
                        {item.badge && (
                          <span style={{
                            background: '#f43f5e',
                            color: '#fff',
                            fontSize: '10px',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: 99,
                          }}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>
                        {item.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* Extra item: Store & Tariffs */}
              <button
                onClick={() => handleSelectNav('store')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '12px 16px',
                  borderRadius: 14,
                  background: currentView === 'store'
                    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.12))'
                    : 'transparent',
                  border: currentView === 'store'
                    ? '1.5px solid rgba(139, 92, 246, 0.4)'
                    : '1px solid transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginTop: 6,
                }}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: 'rgba(139, 92, 246, 0.15)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#c084fc',
                  flexShrink: 0,
                }}>
                  <Sparkles size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
                    Tariflar & Do'kon
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: 2 }}>
                    Premium & tangalar xaridi
                  </div>
                </div>
              </button>
            </div>

            {/* Drawer Footer: Logout */}
            {onLogout && (
              <div style={{
                paddingTop: 16,
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                marginTop: 12,
              }}>
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    onLogout();
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 12,
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: '#f87171',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <LogOut size={18} />
                  <span>Tizimdan chiqish</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
