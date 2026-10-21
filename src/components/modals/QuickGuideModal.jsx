import React from 'react';
import {
  ChevronRight,
  Activity,
  Clock,
  Mic,
  ArrowRight,
} from 'lucide-react';
import { useTranslation } from '../../i18n.jsx';

export default function QuickGuideModal({
  onProceed,
}) {
  const { t } = useTranslation();
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--bg-main)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      color: '#0F172A',
      overflowY: 'auto',
    }}>
      <div style={{
        padding: '20px 20px 16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: 700,
          color: '#0F172A',
          margin: 0,
          letterSpacing: '-0.02em',
          textAlign: 'center',
        }}>
          {t('guide.title', "Tezkor Qo'llanma")}
        </h2>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 16px 36px 16px',
        maxWidth: 500,
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        gap: 14,
      }}>
        {/* Patient status */}
        <div style={{
          width: '100%',
          background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
          borderRadius: 18,
          padding: '16px 18px',
          border: '1px solid #C2410C',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          boxSizing: 'border-box',
          color: '#FFFFFF',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px', fontWeight: 700 }}>
            <Activity size={17} strokeWidth={2.4} />
            <span>{t('guide.patientStatus', 'BEMOR HOLATI: BARQAROR')}</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['🫁 SpO2 98%', '🩺 120/75', '🌡️ 36.8°C', '❤️ 80/daq'].map((v) => (
              <span key={v} style={{
                background: 'rgba(255, 255, 255, 0.22)',
                padding: '5px 10px',
                borderRadius: 10,
                fontSize: '12px',
                fontWeight: 700,
              }}>
                {v}
              </span>
            ))}
          </div>
        </div>

        {/* Chat mock: attempts + time + one user answer + AI reply + input */}
        <div style={{
          width: '100%',
          background: '#FFFFFF',
          borderRadius: 18,
          border: '1px solid #E2E8F0',
          boxShadow: 'var(--shadow-sm)',
          padding: '14px 14px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          boxSizing: 'border-box',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 12,
            fontWeight: 700,
            color: '#64748B',
          }}>
            <span style={{
              display: 'inline-flex',
              padding: '2px 8px',
              borderRadius: 99,
              background: '#EEF2FF',
              color: '#3730A3',
              fontSize: 12,
              fontWeight: 800,
              fontVariantNumeric: 'tabular-nums',
            }}>
              4/5
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Clock size={12} /> 12:40
            </span>
          </div>

          <div style={{ alignSelf: 'flex-end', maxWidth: '88%' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textAlign: 'right', marginBottom: 4 }}>
              {t('guide.youLabel', 'Siz')}
            </div>
            <div style={{
              background: '#2563EB',
              color: '#FFFFFF',
              borderRadius: '18px 18px 4px 18px',
              padding: '10px 14px',
              fontSize: 13,
              fontWeight: 600,
              lineHeight: 1.45,
            }}>
              {t('guide.youSpeech', 'Tashxis: o‘tkir koronar sindrom. Aspirin, EKG, PCI.')}
            </div>
          </div>

          <div style={{ alignSelf: 'flex-start', maxWidth: '90%' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#4F46E5', marginBottom: 4 }}>
              {t('guide.aiLabel', 'AI')}
            </div>
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '4px 18px 18px 18px',
              padding: '10px 14px',
              fontSize: 13,
              fontWeight: 500,
              color: '#334155',
              lineHeight: 1.45,
            }}>
              {t('guide.aiSpeech', "To‘g‘ri. Tashxis o‘tkir koronar sindromga mos. Aspirin, EKG va shoshilinch PCI asosli.")}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0F172A',
              flexShrink: 0,
            }}>
              <Mic size={18} />
            </div>
            <div style={{
              flex: 1,
              height: 40,
              borderRadius: 99,
              border: '1px solid #CBD5E1',
              background: '#F8FAFC',
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              fontSize: 13,
              fontWeight: 500,
              color: '#94A3B8',
            }}>
              {t('guide.inputPlaceholder', 'Tashxis va davolash rejasini yozing...')}
            </div>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#16A34A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              flexShrink: 0,
            }}>
              <ArrowRight size={18} strokeWidth={2.6} />
            </div>
          </div>
        </div>

        <p style={{
          width: '100%',
          margin: 0,
          fontSize: 12,
          fontWeight: 600,
          color: '#64748B',
          lineHeight: 1.45,
          textAlign: 'center',
        }}>
          {t('guide.tipDesc', "To‘liq javob yozing. Har yuborish 1 urinish. AI javobingizni to‘g‘ri yoki xato deb tahlil qiladi.")}
        </p>

        <button
          id="btn-proceed-simulation"
          onClick={onProceed}
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
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginTop: 4,
          }}
        >
          <span>{t('guide.startSimulation', 'Simulyatsiyani boshlash')}</span>
          <ChevronRight size={20} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
