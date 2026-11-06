import React, { useEffect } from 'react';
import {
  LogOut,
  X,
  User,
} from 'lucide-react';
import { useTranslation } from '../../i18n.jsx';

export default function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  user
}) {
  const { t } = useTranslation();

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const displayName = user?.name || user?.phone_number || user?.email || t('auth.user', 'Foydalanuvchi');
  const roleDisplay = user?.role === 'admin' ? t('auth.admin', 'Administrator') : t('auth.user', 'Foydalanuvchi');

  return (
    <div
      id="logout-confirm-backdrop"
      onClick={(e) => {
        if (e.target.id === 'logout-confirm-backdrop') onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.18s ease-out'
      }}
    >
      <div
        className="responsive-modal-card"
        style={{
          width: '100%',
          maxWidth: '430px',
          background: 'var(--surface)',
          borderRadius: 18,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px var(--line)',
          padding: '28px 24px 24px 24px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          animation: 'modalScale 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Close 'X' button */}
        <button
          id="btn-close-logout-modal"
          onClick={onClose}
          aria-label="Yopish"
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            width: 34,
            height: 34,
            borderRadius: 12,
            background: 'var(--surface-2)',
            border: '1px solid var(--line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--ink-3)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--surface-3)';
            e.currentTarget.style.color = 'var(--ink)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--surface-2)';
            e.currentTarget.style.color = 'var(--ink-3)';
          }}
        >
          <X size={18} strokeWidth={2.4} />
        </button>

        {/* Warning Icon Badge */}
        <div
          style={{
            width: 68,
            height: 68,
            borderRadius: '50%',
            background: 'var(--tint-red)',
            border: '5px solid var(--tint-red-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--on-red)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: 16
          }}
        >
          <LogOut size={30} strokeWidth={2.4} style={{ transform: 'translateX(-1px)' }} />
        </div>

        {/* Modal Title */}
        <h3
          style={{
            margin: '0 0 8px 0',
            fontSize: '21px',
            fontWeight: 700,
            color: 'var(--ink)',
            letterSpacing: '-0.3px',
          }}
        >
          {t('auth.logoutConfirmTitle', 'Tizimdan chiqishni tasdiqlang')}
        </h3>

        {/* Description */}
        <p
          style={{
            margin: '0 0 20px 0',
            fontSize: '14px',
            color: 'var(--ink-3)',
            lineHeight: 1.55,
            maxWidth: '350px'
          }}
        >
          {t('auth.logoutConfirmDesc', 'Haqiqatan ham hisobingizdan chiqmoqchimisiz? Qayta kirish uchun telefon yoki email orqali tasdiqlash kodi talab qilinadi.')}
        </p>

        {/* Current User Card */}
        <div
          style={{
            width: '100%',
            boxSizing: 'border-box',
            background: 'var(--surface-2)',
            border: '1px solid var(--line)',
            borderRadius: 18,
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 24,
            textAlign: 'left'
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'var(--line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--ink-2)',
              fontWeight: 700,
              fontSize: '16px',
              flexShrink: 0
            }}
          >
            {user?.name ? user.name[0].toUpperCase() : <User size={20} />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--ink)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {displayName}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--ink-4)', fontWeight: 500 }}>
              {roleDisplay}
            </div>
          </div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#059669',
              background: 'var(--tint-green-soft)',
              padding: '4px 8px',
              borderRadius: 8,
              border: '1px solid var(--tint-green-border)'
            }}
          >
            {t('auth.activeStatus', 'Faol')}
          </span>
        </div>

        {/* Buttons Action Container */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            gap: 12,
            alignItems: 'center'
          }}
        >
          {/* Cancel Button */}
          <button
            id="btn-cancel-logout"
            onClick={onClose}
            style={{
              flex: 1,
              padding: '13px 16px',
              borderRadius: 16,
              background: 'var(--surface-3)',
              border: '1px solid var(--line)',
              color: 'var(--ink-2)',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--line)';
              e.currentTarget.style.color = 'var(--ink)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--surface-3)';
              e.currentTarget.style.color = 'var(--ink-2)';
            }}
          >
            {t('auth.logoutCancelBtn', 'Bekor qilish')}
          </button>

          {/* Confirm Logout Button */}
          <button
            id="btn-confirm-logout-action"
            onClick={onConfirm}
            style={{
              flex: 1.25,
              padding: '13px 18px',
              borderRadius: 16,
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 10px 22px -4px rgba(220, 38, 38, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 18px -4px rgba(220, 38, 38, 0.4)';
            }}
          >
            <LogOut size={16} strokeWidth={2.4} />
            <span>{t('auth.logoutConfirmBtn', 'Ha, chiqish')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
