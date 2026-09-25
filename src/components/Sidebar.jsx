import React from 'react';
import {
  Home,
  LayoutGrid,
  TrendingUp,
  User,
  LogOut,
  X,
  Activity,
  Stethoscope
} from 'lucide-react';
import { useTranslation } from '../i18n.jsx';

export default function Sidebar({
  currentView,
  setCurrentView,
  onOpenProfile,
  onLogout,
  isOpen = false,
  onClose = () => {},
}) {
  const { t } = useTranslation();

  const navItems = [
    {
      id: 'cases',
      label: t('nav.home', 'Asosiy'),
      icon: Home
    },
    {
      id: 'clinics',
      label: t('nav.category', "Bo'limlar"),
      icon: LayoutGrid
    },
    {
      id: 'leaderboard',
      label: t('nav.ranking', 'Reyting'),
      icon: TrendingUp
    },
    {
      id: 'profile',
      label: t('nav.profile', 'Profil'),
      icon: User
    },
  ];

  const handleNavClick = (id) => {
    if (id === 'profile' && onOpenProfile) {
      onOpenProfile();
    } else {
      setCurrentView(id);
    }
    onClose();
  };

  const sidebarContent = (
    <aside
      className="sidebar-container"
      style={{
        width: 250,
        height: '100vh',
        background: '#FFFFFF',
        borderRight: '1.5px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 16px',
        boxSizing: 'border-box',
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        userSelect: 'none',
      }}
    >
      {/* Top section: Logo + Navigation Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* Brand Logo matching TibCase */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 8px',
        }}>
          <div
            onClick={() => handleNavClick('cases')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
            }}
          >
            {/* Red Pulsing ECG Badge */}
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #C8102E, #DC2626)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(200, 16, 46, 0.3)',
            }}>
              <Activity className="heart-pulse" size={20} color="#FFFFFF" strokeWidth={2.4} />
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{
                color: '#C8102E',
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.4rem',
                fontWeight: 900,
                letterSpacing: '-0.5px',
              }}>
                Tib
              </span>
              <span style={{
                color: '#0F172A',
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.4rem',
                fontWeight: 900,
                letterSpacing: '-0.5px',
              }}>
                Case
              </span>
            </div>
          </div>

          {/* Close button for mobile drawer */}
          <button
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close menu"
            style={{
              display: 'none',
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748B',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {navItems.map((item) => {
            const isActive = currentView === item.id || (item.id === 'cases' && currentView === 'home');
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 18px',
                  borderRadius: 9999,
                  background: isActive ? '#C8102E' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#475569',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.94rem',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  boxShadow: isActive ? '0 4px 14px rgba(200, 16, 46, 0.3)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#F8FAFC';
                    e.currentTarget.style.color = '#0F172A';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#475569';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Icon
                    size={20}
                    color={isActive ? '#FFFFFF' : '#64748B'}
                    strokeWidth={isActive ? 2.4 : 2}
                  />
                  <span>{item.label}</span>
                </div>

                {/* Active white dot on right side matching screenshot */}
                {isActive && (
                  <span style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#FFFFFF',
                  }} />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Logout Button */}
      <div>
        <button
          id="btn-sidebar-logout"
          onClick={() => {
            if (onLogout) onLogout();
            onClose();
          }}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 18px',
            borderRadius: 14,
            background: 'transparent',
            color: '#64748B',
            fontWeight: 700,
            fontSize: '0.92rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#FEF2F2';
            e.currentTarget.style.color = '#DC2626';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#64748B';
          }}
        >
          <LogOut size={20} strokeWidth={2} />
          <span>{t('profile.logout', 'Tizimdan chiqish')}</span>
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (>= 1024px) */}
      <div className="desktop-sidebar-wrapper">
        {sidebarContent}
      </div>

      {/* Tablet / Mobile Slide-Over Drawer (< 1024px) */}
      {isOpen && (
        <div
          className="mobile-sidebar-overlay"
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(4px)',
            zIndex: 999,
            display: 'flex',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: 'slideInLeft 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              height: '100%',
            }}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
