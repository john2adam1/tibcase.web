import React from 'react';
import { Menu, Bell } from 'lucide-react';

export default function TabletHeader({ onToggleSidebar, onOpenNotifications, unreadCount = 0 }) {
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
      <button id="btn-toggle-tablet-sidebar" className="ui-icon-btn" onClick={onToggleSidebar} aria-label="Menu" style={{ border: 'none' }}>
        <Menu size={22} strokeWidth={2} />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, userSelect: 'none' }}>
        <img src="/logo.svg" alt="TibStation AI" width={28} height={28} style={{ borderRadius: 8, display: 'block' }} />
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>TibStation <span style={{ color: 'var(--accent)' }}>AI</span></span>
      </div>

      <button id="btn-open-notifications" className="ui-icon-btn" onClick={onOpenNotifications} aria-label="Notifications" style={{ border: 'none' }}>
        <Bell size={21} strokeWidth={1.9} />
        {unreadCount > 0 && (
          <span style={{ position: 'absolute', top: 10, right: 11, width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)', border: '1px solid #fff', boxSizing: 'content-box' }} />
        )}
      </button>
    </header>
  );
}
