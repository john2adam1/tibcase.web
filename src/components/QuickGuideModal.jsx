import React from 'react';
import {
  Stethoscope,
  Info,
  User,
  Package,
  ChevronRight,
  Activity,
  Heart,
  Lightbulb,
  Sparkles,
  FlaskConical
} from 'lucide-react';

export default function QuickGuideModal({
  onProceed,
  onSkip
}) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#F8FAFC',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      color: '#0F172A',
      overflowY: 'auto',
    }}>
      {/* Top Header */}
      <div style={{
        padding: '20px 20px 16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#FFFFFF',
        borderBottom: '2px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: '#DCFCE7',
            border: '1.5px solid #86EFAC',
            boxShadow: '0 3px 0 #86EFAC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#15803D',
            flexShrink: 0,
          }}>
            <Stethoscope size={22} strokeWidth={2.4} />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              Tezkor Qo'llanma
            </h2>
            <p style={{ fontSize: '13px', color: '#64748B', fontWeight: 600, margin: '2px 0 0 0' }}>
              Bemorga tashxis qo'yish va simulyatsiyadan foydalanish
            </p>
          </div>
        </div>

        {/* Skip button with Claymorphic styling */}
        <button
          id="btn-skip-guide"
          onClick={onSkip || onProceed}
          style={{
            padding: '8px 16px',
            borderRadius: 16,
            background: '#FFFFFF',
            border: '2px solid #E2E8F0',
            boxShadow: '0 3px 0 #E2E8F0',
            color: '#64748B',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(2px)';
            e.currentTarget.style.boxShadow = '0 1px 0 #E2E8F0';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 3px 0 #E2E8F0';
          }}
        >
          O'tkazib yuborish
        </button>
      </div>

      {/* Main Interactive Guide Area */}
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
        gap: 16,
      }}>
        {/* Patient Status: STABLE (Terracotta/Orange Claymorphic Banner) */}
        <div style={{
          width: '100%',
          background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
          borderRadius: 24,
          padding: '16px 18px',
          border: '2px solid #C2410C',
          boxShadow: '0 5px 0 #C2410C, 0 12px 24px rgba(234, 88, 12, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          boxSizing: 'border-box',
          color: '#FFFFFF',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px', fontWeight: 800 }}>
            <Activity size={17} strokeWidth={2.4} />
            <span>BEMOR HOLATI: BARQAROR</span>
          </div>

          {/* Vitals Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span style={{
              background: 'rgba(255, 255, 255, 0.22)',
              backdropFilter: 'blur(4px)',
              padding: '5px 10px',
              borderRadius: 10,
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              🫁 SpO2 98%
            </span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.22)',
              backdropFilter: 'blur(4px)',
              padding: '5px 10px',
              borderRadius: 10,
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              🩺 120/75 mm.sim.ust
            </span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.22)',
              backdropFilter: 'blur(4px)',
              padding: '5px 10px',
              borderRadius: 10,
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              🌡️ 36.8°C
            </span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.22)',
              backdropFilter: 'blur(4px)',
              padding: '5px 10px',
              borderRadius: 10,
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              💨 18 / daq
            </span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.22)',
              backdropFilter: 'blur(4px)',
              padding: '5px 10px',
              borderRadius: 10,
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              ❤️ 80 ur/daq
            </span>
          </div>
        </div>

        {/* Chat / Simulation Demonstration Card */}
        <div style={{
          width: '100%',
          background: '#FFFFFF',
          borderRadius: 24,
          border: '2px solid #E2E8F0',
          boxShadow: '0 4px 0 #E2E8F0, 0 10px 25px rgba(0, 0, 0, 0.04)',
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          boxSizing: 'border-box',
        }}>
          {/* Patient Dialogue Bubble */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 4,
            maxWidth: '88%',
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
              👤 Bemor
            </span>
            <div style={{
              background: '#F8FAFC',
              borderRadius: '18px 18px 18px 4px',
              padding: '12px 16px',
              color: '#1E293B',
              fontSize: '13px',
              fontWeight: 600,
              border: '1.5px solid #E2E8F0',
              lineHeight: 1.45,
            }}>
              "...tez o'rnimdan turganimda to'satdan boshim aylanib ketdi, ko'nglim ayniyapti va ko'kragimda biroz og'irlik sezilyapti."
            </div>
          </div>

          {/* Doctor Dialogue Bubble (Blue) */}
          <div style={{
            alignSelf: 'flex-end',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 4,
            maxWidth: '90%',
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563EB', display: 'flex', alignItems: 'center', gap: 4 }}>
              👨‍⚕️ Siz (Shifokor)
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 8,
            }}>
              <div style={{
                background: '#2563EB',
                color: '#FFFFFF',
                borderRadius: '18px 18px 4px 18px',
                padding: '14px 16px',
                fontSize: '13px',
                fontWeight: 600,
                lineHeight: 1.5,
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
              }}>
                Qon tahlillarini buyuramiz: umumiy qon tahlili, biokimyo, TSH va C-reaktiv oqsil. Bemorga og'riqsizlantiruvchi va qusishga qarshi dori berilsin.
              </div>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#DCFCE7',
                border: '2px solid #86EFAC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#16A34A',
                flexShrink: 0,
              }}>
                <User size={16} />
              </div>
            </div>
          </div>

          {/* System/Lab Report Bubble (Slate/Indigo) */}
          <div style={{
            alignSelf: 'flex-start',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 4,
            maxWidth: '92%',
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#4338CA', display: 'flex', alignItems: 'center', gap: 4 }}>
              🧪 Tahlilxona va Hamshira
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
            }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: '#EEF2FF',
                border: '1.5px solid #C7D2FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4338CA',
                flexShrink: 0,
                marginTop: 2,
              }}>
                <FlaskConical size={16} />
              </div>
              <div style={{
                background: '#F8FAFC',
                border: '1.5px solid #CBD5E1',
                borderRadius: '4px 18px 18px 18px',
                padding: '12px 14px',
                fontSize: '13px',
                color: '#334155',
                fontWeight: 600,
                lineHeight: 1.5,
              }}>
                Laboratoriya buyurtmasi qabul qilindi. UQT, biokimyo va EKG tekshiruvlari boshlandi. Buyurilgan preparatlar bemorga yuborildi.
              </div>
            </div>
          </div>
        </div>

        {/* Informative Tip Box */}
        <div style={{
          width: '100%',
          background: '#F0FDF4',
          border: '1.5px solid #BBF7D0',
          borderRadius: 18,
          padding: '12px 16px',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          fontSize: '12px',
          color: '#166534',
          lineHeight: 1.45,
          fontWeight: 600,
        }}>
          <Lightbulb size={18} color="#16A34A" style={{ flexShrink: 0, marginTop: 1 }} />
          <span>
            <strong>Maslahat:</strong> Har bir qadamda bemorning hayotiy ko'rsatkichlari (vital signs) o'zgarishini kuzatib boring va xalqaro klinik protokollar asosida to'g'ri qaror qabul qiling.
          </span>
        </div>

        {/* Enter Case Simulation CTA Button */}
        <button
          id="btn-proceed-simulation"
          onClick={onProceed}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 20,
            background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
            border: '2px solid #15803D',
            boxShadow: '0 4px 0 #15803D, 0 10px 24px rgba(34, 197, 94, 0.35)',
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginTop: 4,
            transition: 'all 0.15s ease',
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(2px)';
            e.currentTarget.style.boxShadow = '0 2px 0 #15803D';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 0 #15803D, 0 10px 24px rgba(34, 197, 94, 0.35)';
          }}
        >
          <span>Simulyatsiyani boshlash</span>
          <ChevronRight size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* Bottom Progress Bar */}
      <div style={{
        padding: '12px 24px 24px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 480,
          height: 8,
          background: '#E2E8F0',
          borderRadius: 99,
          position: 'relative',
        }}>
          {/* Green filled track */}
          <div style={{
            width: '75%',
            height: '100%',
            background: 'linear-gradient(90deg, #22C55E, #16A34A)',
            borderRadius: 99,
          }} />

          {/* White slider thumb indicator */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '75%',
            transform: 'translate(-50%, -50%)',
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#FFFFFF',
            border: '2px solid #16A34A',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
          }} />
        </div>
      </div>
    </div>
  );
}
