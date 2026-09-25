import React from 'react';
import {
  Home,
  LayoutGrid,
  TrendingUp,
  User
} from 'lucide-react';
import { useTranslation } from '../i18n.jsx';

export default function BottomNavBar({
  currentView,
  onSelectView,
}) {
  const { t } = useTranslation();

  const tabs = [
    { id: 'cases', label: t('nav.home', 'Asosiy'), icon: Home },
    { id: 'clinics', label: t('nav.category', 'Barcha kurslar'), icon: LayoutGrid },
    { id: 'leaderboard', label: t('nav.ranking', 'Reyting'), icon: TrendingUp },
    { id: 'profile', label: t('nav.profile', 'Profil'), icon: User },
  ];

  return (
    <nav className="bottom-nav-mobile" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 70,
      background: '#FFFFFF',
      borderTop: '1.5px solid #E2E8F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 520,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 8px',
      }}>
        {tabs.map((tab) => {
          const isActive = currentView === tab.id || (tab.id === 'cases' && currentView === 'home');
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              id={`mobile-nav-${tab.id}`}
              onClick={() => onSelectView(tab.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 6px',
                transition: 'all 0.15s ease',
                flex: 1,
              }}
            >
              {isActive ? (
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: '#FEE2E2',
                  border: '1.5px solid #FECACA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 12px rgba(220, 38, 38, 0.25)',
                  transition: 'transform 0.15s ease',
                  transform: 'scale(1.04)',
                }}>
                  <Icon size={19} color="#DC2626" strokeWidth={2.4} />
                </div>
              ) : (
                <div style={{
                  width: 38,
                  height: 38,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={20} color="#94A3B8" strokeWidth={2} />
                </div>
              )}

              <span style={{
                fontSize: '11px',
                fontWeight: isActive ? 800 : 600,
                color: isActive ? '#DC2626' : '#94A3B8',
                letterSpacing: '-0.01em',
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

