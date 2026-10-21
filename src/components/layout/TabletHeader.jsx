import React from 'react';
import { Bell, ChevronLeft } from 'lucide-react';
import ProfileChip from '../common/ProfileChip.jsx';

export default function TabletHeader({
  currentView = 'cases',
  user,
  onGoHome,
  onOpenProfile,
  onOpenNotifications,
  unreadCount = 0,
}) {
  const isHome = currentView === 'cases';

  return (
    <header
      className="tablet-mobile-header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        height: 56,
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        boxSizing: 'border-box',
      }}
    >
      {isHome ? (
        <div className="tm-header-menu" style={{ minWidth: 0 }}>
          <ProfileChip user={user} onClick={onOpenProfile} />
        </div>
      ) : (
        <button
          id="btn-header-back-home"
          className="ui-icon-btn tm-header-menu"
          onClick={onGoHome}
          aria-label="Asosiy"
          style={{ border: 'none' }}
        >
          <ChevronLeft size={24} strokeWidth={2} />
        </button>
      )}

      <button
        type="button"
        className="tm-header-logo"
        onClick={onGoHome}
        aria-label="Asosiy"
        style={{
          display: 'flex',
          alignItems: 'center',
          userSelect: 'none',
          border: 'none',
          background: 'transparent',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        <img src="/logo-full.svg" alt="TibStation" style={{ height: 26, width: 'auto', display: 'block' }} />
      </button>

      <button id="btn-open-notifications" className="ui-icon-btn" onClick={onOpenNotifications} aria-label="Notifications" style={{ border: 'none' }}>
        <Bell size={22} strokeWidth={2.6} />
        {unreadCount > 0 && (
          <span style={{ position: 'absolute', top: 10, right: 11, width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)', border: '1px solid #fff', boxSizing: 'content-box' }} />
        )}
      </button>
    </header>
  );
}
