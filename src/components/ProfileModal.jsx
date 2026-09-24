import React from 'react';
import ProfileView from './ProfileView';
import { X } from 'lucide-react';

export default function ProfileModal({
  user,
  onClose,
  onLogout,
  onOpenStore,
  onUserUpdate,
  lang,
  onLangChange
}) {
  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 500,
          maxHeight: '92vh',
          overflowY: 'auto',
          borderRadius: 32,
          position: 'relative',
          background: '#F8FAFC',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35)',
        }}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          title="Close"
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            width: 36,
            height: 36,
            borderRadius: 12,
            background: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 2px 0 #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748B',
            cursor: 'pointer',
            zIndex: 30,
          }}
        >
          <X size={18} strokeWidth={2.4} />
        </button>

        <ProfileView
          user={user}
          onUserUpdate={onUserUpdate}
          onOpenStore={onOpenStore}
          onNavigate={(view) => {
            onClose();
          }}
          lang={lang}
          onLangChange={onLangChange}
          onLogout={onLogout}
        />
      </div>
    </div>
  );
}
