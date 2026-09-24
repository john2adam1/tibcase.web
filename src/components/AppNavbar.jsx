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
import { useTranslation } from '../i18n.jsx';

export default function AppNavbar({
  currentView,
  setCurrentView,
  user,
  userLimit,
  activeCase,
  onOpenProfile,
  onLogout,
  onLangChange,
}) {
  const { t, lang, setLang } = useTranslation();
  const [soundOn, setSoundOn] = useState(getSoundEnabled());
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  // Nav menu items translated
  const navItems = [
    { id: 'cases', label: t('nav.home'), subtitle: 'Klinik keyslar katalogi', icon: Building2 },
    { id: 'clinics', label: t('nav.category'), subtitle: "Bo'limlar & Kategoriyalar", icon: Stethoscope },
    { id: 'leaderboard', label: t('nav.ranking'), subtitle: 'Peshqadamlar reytingi', icon: Award },
    { id: 'profile', label: t('nav.profile'), subtitle: 'Mening profilim & Sozlamalar', icon: User },
  ];

  const handleSelectNav = (id) => {
    if (id === 'profile' && onOpenProfile) {
      onOpenProfile();
    } else {
      setCurrentView(id);
    }
    setDrawerOpen(false);
  };

  const handleSelectLanguage = (code) => {
    setLang(code);
    if (onLangChange) onLangChange(code);
    setLangMenuOpen(false);
  };

  return (
    <>
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: '#FFFFFF',
        borderBottom: '1.5px solid #E2E8F0',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
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
              background: 'linear-gradient(135deg, #0284C7, #2563EB)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
            }}>
              <Activity className="heart-pulse" size={22} color="#ffffff" />
            </div>
            <div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.3rem',
                fontWeight: 800,
                color: '#0F172A',
              }}>
                TibCase
              </span>
              <span style={{
                marginLeft: 6,
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                color: '#2563EB',
                padding: '2px 7px',
                borderRadius: 99,
                fontSize: '0.65rem',
                fontWeight: 800,
              }}>
                {t('nav.pro', 'PRO')}
              </span>
            </div>
          </div>

          {/* Right Section: Stats, Quick Tools, and Hamburger Menu Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* User Stats Pill */}
            <div className="stats-bar" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              padding: '5px 14px',
              borderRadius: 99,
            }}>
              <div
                onClick={() => handleSelectNav('store')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  color: '#D97706',
                  cursor: 'pointer',
                }}
                title={t('nav.coins')}
              >
                <Coins size={15} color="#D97706" />
                <span>{user?.coins ?? 15}</span>
              </div>

              <div style={{ width: 1, height: 14, background: '#CBD5E1' }} />

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  color: '#EA580C',
                }}
                title={t('nav.streak')}
              >
                <Flame size={15} color="#EA580C" />
                <span>{user?.streak_count ?? 5}</span>
              </div>

              <div style={{ width: 1, height: 14, background: '#CBD5E1' }} />

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  color: '#16A34A',
                }}
                title={t('nav.level')}
              >
                <Zap size={14} color="#16A34A" />
                <span>Lvl {user?.level ?? 1}</span>
              </div>

              <div style={{ width: 1, height: 14, background: '#CBD5E1' }} />

              {/* Free Tier Limit / PRO badge */}
              <div
                onClick={() => handleSelectNav('store')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: (user?.has_subscription || userLimit?.has_subscription) 
                    ? '#16A34A' 
                    : ((userLimit?.remaining ?? 3) > 0 ? '#0284C7' : '#DC2626'),
                  cursor: 'pointer',
                }}
                title={user?.has_subscription || userLimit?.has_subscription ? "Cheksiz PRO obuna faol" : `Kunlik bepul limit: ${userLimit?.remaining ?? 3}/${userLimit?.total ?? 3}`}
              >
                <Shield size={14} />
                <span>
                  {(user?.has_subscription || userLimit?.has_subscription) 
                    ? 'PRO' 
                    : `${userLimit?.remaining ?? 3}/${userLimit?.total ?? 3} Limit`}
                </span>
              </div>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              title={soundOn ? t('nav.soundOn') : t('nav.soundOff')}
              style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                color: soundOn ? '#0284C7' : '#94A3B8',
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
                  padding: '7px 12px',
                  borderRadius: 12,
                  background: '#F8FAFC',
                  border: '1.5px solid #E2E8F0',
                  color: '#0F172A',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Globe size={15} color="#64748B" />
                <span>{lang ? lang.toUpperCase() : 'UZ'}</span>
                <ChevronDown size={14} color="#64748B" />
              </button>

              {langMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  background: '#FFFFFF',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: 14,
                  padding: 6,
                  minWidth: 130,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  zIndex: 60,
                }}>
                  {[
                    { code: 'uz', label: "O'zbekcha" },
                    { code: 'ru', label: "Русский" },
                    { code: 'en', label: "English" }
                  ].map((item) => (
                    <button
                      key={item.code}
                      onClick={() => handleSelectLanguage(item.code)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: lang === item.code ? '#16A34A' : '#0F172A',
                        background: lang === item.code ? '#DCFCE7' : 'transparent',
                        borderRadius: 8,
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

            {/* Profile Avatar Button */}
            <button
              onClick={() => handleSelectNav('profile')}
              title={t('nav.profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '5px 12px',
                borderRadius: 12,
                background: currentView === 'profile' ? '#DCFCE7' : '#F8FAFC',
                border: currentView === 'profile' ? '1.5px solid #86EFAC' : '1.5px solid #E2E8F0',
                color: '#0F172A',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#FEF08A',
                border: '1.5px solid #FDE047',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
                {user?.name?.split(' ')[0] || 'Dr. Akmal'}
              </span>
            </button>

            {/* HAMBURGER MENU BUTTON */}
            <button
              id="btn-hamburger-menu"
              onClick={() => setDrawerOpen(true)}
              title={t('nav.menu')}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                color: '#0F172A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#EFF6FF';
                e.currentTarget.style.borderColor = '#BFDBFE';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#F8FAFC';
                e.currentTarget.style.borderColor = '#E2E8F0';
              }}
            >
              <Menu size={22} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* HAMBURGER MENU DRAWER (Unified White Claymorphic Design)   */}
      {/* ========================================================= */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(6px)',
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
              background: '#FFFFFF',
              borderLeft: '1.5px solid #E2E8F0',
              boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.08)',
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
              borderBottom: '1.5px solid #F1F5F9',
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
                  background: '#FEF08A',
                  border: '2px solid #FDE68A',
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
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                    {user?.name || 'Dr. Akmal Karimov'}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>
                    {user?.specialty || t('profile.student')}
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
                  background: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation Menu List */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              flex: 1,
              overflowY: 'auto',
            }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#94A3B8',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                marginBottom: 4,
              }}>
                {t('nav.mainPages')}
              </div>

              {navItems.map((item) => {
                const isActive = currentView === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    id={`drawer-nav-${item.id}`}
                    onClick={() => handleSelectNav(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '14px 16px',
                      borderRadius: 18,
                      background: isActive ? '#DCFCE7' : '#F8FAFC',
                      border: isActive ? '1.5px solid #86EFAC' : '1.5px solid #E2E8F0',
                      color: isActive ? '#16A34A' : '#0F172A',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      boxShadow: isActive ? '0 4px 14px rgba(34, 197, 94, 0.2)' : 'none',
                    }}
                  >
                    <div style={{
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      background: isActive ? '#16A34A' : '#FFFFFF',
                      border: isActive ? 'none' : '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isActive ? '#FFFFFF' : '#64748B',
                      flexShrink: 0,
                    }}>
                      <Icon size={18} strokeWidth={2.4} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14.5px', fontWeight: 800 }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: 1 }}>
                        {item.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Drawer Actions: Logout */}
            <div style={{
              paddingTop: 16,
              borderTop: '1.5px solid #F1F5F9',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}>
              {onLogout && (
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    onLogout();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '12px',
                    borderRadius: 16,
                    background: '#FEE2E2',
                    border: '1.5px solid #FECACA',
                    color: '#DC2626',
                    fontSize: '13.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  <LogOut size={16} />
                  <span>{t('nav.logout')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
