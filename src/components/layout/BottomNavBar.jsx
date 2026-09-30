import React from 'react';
import { Home, LayoutGrid, User } from 'lucide-react';
import { useTranslation } from '../../i18n.jsx';

export default function BottomNavBar({ currentView, onSelectView }) {
  const { t } = useTranslation();

  const tabs = [
    { id: 'cases', label: t('nav.home', 'Asosiy'), icon: Home },
    { id: 'clinics', label: t('nav.category', "Bo'limlar"), icon: LayoutGrid },
    { id: 'profile', label: t('nav.profile', 'Profil'), icon: User },
  ];

  return (
    <nav
      className="bottom-nav-mobile"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 50,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 520, display: 'flex' }}>
        {tabs.map((tab) => {
          const isActive = currentView === tab.id || (tab.id === 'cases' && currentView === 'home');
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`mobile-nav-${tab.id}`}
              onClick={() => onSelectView(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              style={{
                flex: 1,
                minHeight: 56,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: isActive ? 'var(--accent)' : 'var(--text-muted)',
              }}
            >
              <Icon size={22} strokeWidth={isActive ? 2.4 : 1.8} />
              <span style={{ fontSize: 11, fontWeight: isActive ? 700 : 500 }}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
