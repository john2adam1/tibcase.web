import React from 'react';
import {
  Home,
  LayoutGrid,
  User,
  LogOut,
  X,
} from 'lucide-react';
import { useTranslation } from '../../i18n.jsx';

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
        width: 280,
        height: '100dvh',
        background: 'var(--bg-card)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '28px 16px calc(24px + env(safe-area-inset-bottom, 0px))',
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px', minHeight: 48 }}>
          <div onClick={() => handleNavClick('cases')} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <img src="/logo-full.svg" alt="TibStation" style={{ height: 42, width: 'auto', maxWidth: 215, display: 'block', objectFit: 'contain' }} />
          </div>
          <button
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close menu"
            style={{ display: 'none', background: 'var(--bg-muted)', border: 'none', borderRadius: '50%', width: 36, height: 36, alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

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
                  minHeight: 60,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '0 24px',
                  borderRadius: 24,
                  background: isActive ? 'var(--accent)' : 'transparent',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  boxShadow: isActive ? '0 12px 24px -8px rgba(22, 163, 74, 0.45)' : 'none',
                  transform: isActive ? 'scale(1.02)' : 'none',
                  fontWeight: 800,
                  fontSize: 17,
                  letterSpacing: '-0.01em',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Icon size={24} strokeWidth={2.2} color={isActive ? '#FFFFFF' : 'var(--text-muted)'} />
                <span>{item.label}</span>
                {isActive && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#FFFFFF' }} />}
              </button>
            );
          })}
        </nav>
      </div>

      <button
        id="btn-sidebar-logout"
        onClick={() => { if (onLogout) onLogout(); onClose(); }}
        style={{
          width: '100%', minHeight: 60, display: 'flex', alignItems: 'center', gap: 16, padding: '0 24px',
          borderRadius: 24, background: 'transparent', color: 'var(--text-secondary)',
          fontWeight: 800, fontSize: 17, border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <LogOut size={24} strokeWidth={2.2} />
        <span>{t('profile.logout', 'Tizimdan chiqish')}</span>
      </button>
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
            background: 'rgba(17, 24, 39, 0.4)',
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
