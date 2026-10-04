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
        padding: '20px 12px calc(20px + env(safe-area-inset-bottom, 0px))',
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px' }}>
          <div onClick={() => handleNavClick('cases')} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <img src="/logo.svg" alt="TibStation AI" width={32} height={32} style={{ borderRadius: 8, display: 'block' }} />
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>TibStation <span style={{ color: 'var(--accent)' }}>AI</span></span>
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

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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
                  minHeight: 54,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '0 18px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--accent-soft)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 16,
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Icon size={22} strokeWidth={isActive ? 2.3 : 1.8} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <button
        id="btn-sidebar-logout"
        onClick={() => { if (onLogout) onLogout(); onClose(); }}
        style={{
          width: '100%', minHeight: 54, display: 'flex', alignItems: 'center', gap: 14, padding: '0 18px',
          borderRadius: 'var(--radius-md)', background: 'transparent', color: 'var(--text-muted)',
          fontWeight: 500, fontSize: 15, border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <LogOut size={20} strokeWidth={1.8} />
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
