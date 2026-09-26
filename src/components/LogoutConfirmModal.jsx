import React, { useEffect } from 'react';
import { LogOut, X, AlertTriangle, User } from 'lucide-react';
import { useTranslation } from '../i18n';

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

  const displayName = user?.name || user?.phone_number || user?.email || 'Foydalanuvchi';
  const roleDisplay = user?.role === 'admin' ? 'Administrator' : 'Foydalanuvchi';

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
          background: '#FFFFFF',
          borderRadius: 26,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(226, 232, 240, 0.8)',
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
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748B',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#F1F5F9';
            e.currentTarget.style.color = '#0F172A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#F8FAFC';
            e.currentTarget.style.color = '#64748B';
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
            background: '#FEE2E2',
            border: '5px solid #FEF2F2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#DC2626',
            boxShadow: '0 10px 20px -5px rgba(239, 68, 68, 0.25)',
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
            fontWeight: 800,
            color: '#0F172A',
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
            color: '#64748B',
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
            background: '#F8FAFC',
            border: '1.5px solid #E2E8F0',
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
              background: '#E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#475569',
              fontWeight: 800,
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
                color: '#1E293B',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {displayName}
            </div>
            <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>
              {roleDisplay}
            </div>
          </div>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#059669',
              background: '#ECFDF5',
              padding: '4px 8px',
              borderRadius: 8,
              border: '1px solid #A7F3D0'
            }}
          >
            Faol
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
              background: '#F1F5F9',
              border: '1.5px solid #E2E8F0',
              color: '#475569',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#E2E8F0';
              e.currentTarget.style.color = '#1E293B';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#F1F5F9';
              e.currentTarget.style.color = '#475569';
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
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 8px 18px -4px rgba(220, 38, 38, 0.4)',
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
