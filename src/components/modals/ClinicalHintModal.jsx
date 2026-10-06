import React from 'react';
import {
  Lightbulb,
  X,
  Check,
  Sparkles,
  Info
} from 'lucide-react';
import { useTranslation } from '../../i18n.jsx';

export default function ClinicalHintModal({
  isOpen,
  onClose,
  hintText
}) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 110,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: 0,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 480,
          background: '#FFFFFF',
          borderRadius: '32px 32px 0 0',
          padding: '24px 20px 36px 20px',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          boxSizing: 'border-box',
          animation: 'slideUp 0.25s ease-out',
        }}
      >
        {/* Drag Handle */}
        <div style={{
          width: 44,
          height: 5,
          borderRadius: 99,
          background: '#CBD5E1',
          alignSelf: 'center',
          marginBottom: 4,
        }} />

        {/* Header: Lightbulb icon + Title + Close */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FEF08A, #FDE047)',
              border: '1px solid #FACC15',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#B45309',
            }}>
              <Lightbulb size={28} fill="#B45309" strokeWidth={2} />
            </div>

            <div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#0F172A',
                margin: '0 0 2px 0',
              }}>
                {t('sim.hintTitle', 'Klinik Maslahat')}
              </h3>
              <p style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#64748B',
                margin: 0,
              }}>
                {t('sim.hintSubtitle', "Tashxisga yaqinlashishga yordam beruvchi yo'llanma")}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label={t('common.close', 'Yopish')}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#F1F5F9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748B',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* AI Powered Badge */}
        <div style={{ alignSelf: 'flex-start' }}>
          <span style={{
            background: '#FEF9C3',
            border: '1px solid #FDE047',
            color: '#B45309',
            fontSize: '12px',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: 99,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
          }}>
            <Sparkles size={13} />
            {t('sim.aiPowered', 'AI asosida')}
          </span>
        </div>

        {/* Amber Hint Card */}
        <div style={{
          background: '#FEF9C3',
          border: '1px solid #FDE047',
          borderRadius: 18,
          padding: '20px 18px',
          color: '#1E293B',
          fontSize: '15px',
          fontWeight: 600,
          lineHeight: 1.55,
          boxShadow: 'var(--shadow-sm)',
        }}>
          {hintText || t('sim.hintDefault', "Bemorning shikoyatlarini inobatga olgan holda shoshilinch tekshiruvlarni bajaring.")}
        </div>

        {/* Disclaimer */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 6,
          fontSize: '12px',
          color: '#94A3B8',
          lineHeight: 1.45,
          fontStyle: 'italic',
        }}>
          <Info size={14} style={{ marginTop: 2, flexShrink: 0 }} />
          <span>
            {t('sim.hintDisclaimer', "Ushbu maslahat joriy holat bo'yicha sun'iy intellekt tomonidan shakllantirilgan. U to'g'ridan-to'g'ri tashxisni aytmaydi, ammo klinik fikrlashga yo'naltiradi.")}
          </span>
        </div>

        {/* Understood Button */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 16,
            background: '#16A34A',
            border: '1px solid #15803D',
            boxShadow: 'var(--shadow-sm)',
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: 'pointer',
            marginTop: 4,
          }}
        >
          <Check size={20} strokeWidth={3} />
          <span>{t('sim.understood', 'Tushundim')}</span>
        </button>
      </div>
    </div>
  );
}
