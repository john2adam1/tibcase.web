import React from 'react';
import {
  Building2,
  HeartPulse,
  Stethoscope,
  Award,
  User
} from 'lucide-react';

export default function BottomNavBar({
  currentView,
  onSelectView,
}) {
  const tabs = [
    { id: 'cases', label: 'Home', icon: Building2 },
    { id: 'simulation', label: 'Simulation', icon: HeartPulse },
    { id: 'clinics', label: 'Clinics', icon: Stethoscope },
    { id: 'leaderboard', label: 'Ranking', icon: Award },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 74,
      background: '#FFFFFF',
      borderTop: '1.5px solid #E2E8F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.04)',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{
        width: '100%',
        maxWidth: 480,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 8px',
      }}>
        {tabs.map((tab) => {
          const isActive = currentView === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              id={`nav-item-${tab.id}`}
              onClick={() => onSelectView(tab.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 8px',
                transition: 'all 0.15s ease',
                flex: 1,
              }}
            >
              {/* If active, wrap icon in circular green pill */}
              {isActive ? (
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: '#DCFCE7',
                  border: '2px solid #86EFAC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 12px rgba(34, 197, 94, 0.3)',
                  transition: 'transform 0.15s ease',
                  transform: 'scale(1.05)',
                }}>
                  <Icon size={20} color="#16A34A" strokeWidth={2.4} />
                </div>
              ) : (
                <div style={{
                  width: 42,
                  height: 42,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={22} color="#94A3B8" strokeWidth={2} />
                </div>
              )}

              {/* Label */}
              <span style={{
                fontSize: '11px',
                fontWeight: isActive ? 800 : 600,
                color: isActive ? '#16A34A' : '#94A3B8',
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
