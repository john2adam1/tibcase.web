import React from 'react';
import { Menu, Bell, Activity } from 'lucide-react';
import { useTranslation } from '../i18n.jsx';

export default function TabletHeader({
  onToggleSidebar,
  onOpenNotifications,
  unreadCount = 1,
}) {
  const { t } = useTranslation();

  return (
    <header
      className="tablet-mobile-header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        height: 64,
        background: '#FFFFFF',
        borderBottom: '1.5px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        boxSizing: 'border-box',
      }}
    >
      {/* Left: Hamburger menu icon */}
      <button
        id="btn-toggle-tablet-sidebar"
        onClick={onToggleSidebar}
        aria-label="Open navigation menu"
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#0F172A',
          transition: 'all 0.15s ease',
        }}
      >
        <Menu size={22} strokeWidth={2.4} />
      </button>

      {/* Center: TibCase Brand */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        userSelect: 'none',
      }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: 'linear-gradient(135deg, #C8102E, #DC2626)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(200, 16, 46, 0.25)',
        }}>
          <Activity className="heart-pulse" size={17} color="#FFFFFF" strokeWidth={2.4} />
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
          <span style={{
            color: '#C8102E',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '1.25rem',
            fontWeight: 900,
            letterSpacing: '-0.5px',
          }}>
            Tib
          </span>
          <span style={{
            color: '#0F172A',
            fontFamily: "'Outfit', sans-serif",
            fontSize: '1.25rem',
            fontWeight: 900,
            letterSpacing: '-0.5px',
          }}>
            Case
          </span>
        </div>
      </div>

      {/* Right: Notification Bell with red badge */}
      <button
        id="btn-open-notifications"
        onClick={onOpenNotifications}
        aria-label="Notifications"
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#475569',
          position: 'relative',
          transition: 'all 0.15s ease',
        }}
      >
        <Bell size={20} strokeWidth={2.2} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#DC2626',
            boxShadow: '0 0 8px rgba(220, 38, 38, 0.6)',
          }} />
        )}
      </button>
    </header>
  );
}
