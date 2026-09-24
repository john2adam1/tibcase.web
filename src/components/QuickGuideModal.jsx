import React, { useState } from 'react';
import {
  Stethoscope,
  Info,
  User,
  Package,
  ChevronRight
} from 'lucide-react';

export default function QuickGuideModal({
  onProceed,
  onSkip
}) {
  const [step, setStep] = useState(1);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#0B1528',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      color: '#FFFFFF',
      overflowY: 'auto',
    }}>
      {/* Top Header */}
      <div style={{
        padding: '24px 20px 16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1.5px solid #22C55E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#22C55E',
          }}>
            <Stethoscope size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>
              Quick Guide
            </h2>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '2px 0 0 0' }}>
              See how to diagnose a patient
            </p>
          </div>
        </div>

        {/* Skip button with green glowing circle */}
        <button
          id="btn-skip-guide"
          onClick={onSkip || onProceed}
          style={{
            padding: '8px 18px',
            borderRadius: 99,
            background: 'transparent',
            border: '2px solid #22C55E',
            color: '#22C55E',
            fontSize: '14px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 0 16px rgba(34, 197, 94, 0.35)',
            transition: 'all 0.15s ease',
          }}
        >
          Skip
        </button>
      </div>

      {/* Main Interactive Guide Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 16px 40px 16px',
        maxWidth: 500,
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
        gap: 18,
      }}>
        {/* Patient Status: STABLE (Orange Banner) */}
        <div style={{
          width: '100%',
          background: '#EA580C',
          borderRadius: 24,
          padding: '18px 20px',
          boxShadow: '0 8px 20px rgba(234, 88, 12, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          boxSizing: 'border-box',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '14px', fontWeight: 800 }}>
            <Info size={16} />
            <span>Patient Status: STABLE</span>
          </div>

          {/* Vitals Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <span style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '4px 10px',
              borderRadius: 8,
              fontSize: '12px',
              fontWeight: 700,
            }}>
              🫁 98%
            </span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '4px 10px',
              borderRadius: 8,
              fontSize: '12px',
              fontWeight: 700,
            }}>
              🩺 120/75
            </span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '4px 10px',
              borderRadius: 8,
              fontSize: '12px',
              fontWeight: 700,
            }}>
              🌡️ 36.8°C
            </span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '4px 10px',
              borderRadius: 8,
              fontSize: '12px',
              fontWeight: 700,
            }}>
              💨 18/min
            </span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '4px 10px',
              borderRadius: 8,
              fontSize: '12px',
              fontWeight: 700,
            }}>
              ❤️ 80 bpm
            </span>
          </div>
        </div>

        {/* Chat / Simulation Demonstration Card */}
        <div style={{
          width: '100%',
          background: '#F8FAFC',
          borderRadius: 24,
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          boxSizing: 'border-box',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        }}>
          {/* Patient Dialogue Bubble */}
          <div style={{
            alignSelf: 'flex-start',
            maxWidth: '85%',
            background: '#FFFFFF',
            borderRadius: '18px 18px 18px 4px',
            padding: '12px 16px',
            color: '#1E293B',
            fontSize: '14px',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            border: '1px solid #E2E8F0',
          }}>
            ...noticed I feel dizzy when I stand up quickly.
          </div>

          {/* Doctor Dialogue Bubble (Blue) */}
          <div style={{
            alignSelf: 'flex-end',
            display: 'flex',
            alignItems: 'flex-end',
            gap: 8,
            maxWidth: '90%',
          }}>
            <div style={{
              background: '#2563EB',
              color: '#FFFFFF',
              borderRadius: '18px 18px 4px 18px',
              padding: '14px 16px',
              fontSize: '13px',
              fontWeight: 600,
              lineHeight: 1.5,
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
            }}>
              I'd like to order some blood tests - complete blood count, biochemistry, TSH and CRP. Let's start with pain relief and antiemetic medication if needed.
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

          {/* System/Lab Report Bubble (Slate) */}
          <div style={{
            alignSelf: 'flex-start',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            maxWidth: '90%',
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: '#E0E7FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4338CA',
              flexShrink: 0,
              marginTop: 4,
            }}>
              <Package size={16} />
            </div>
            <div style={{
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              borderRadius: '4px 18px 18px 18px',
              padding: '12px 14px',
              fontSize: '13px',
              color: '#334155',
              fontWeight: 600,
              lineHeight: 1.5,
            }}>
              Blood tests have been ordered. CBC, biochemistry, TSH and CRP results will be available shortly. Pain relief and antiemetic have been administered.
            </div>
          </div>
        </div>

        {/* Enter Case Simulation CTA */}
        <button
          id="btn-proceed-simulation"
          onClick={onProceed}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 20,
            background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
            border: '2px solid #15803D',
            boxShadow: '0 4px 0 #15803D, 0 10px 24px rgba(34, 197, 94, 0.4)',
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginTop: 'auto',
          }}
        >
          <span>Continue to Simulation</span>
          <ChevronRight size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* Bottom Progress Bar with Slider Thumb Indicator */}
      <div style={{
        padding: '16px 24px 28px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 480,
          height: 6,
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: 99,
          position: 'relative',
        }}>
          {/* Green filled track */}
          <div style={{
            width: '70%',
            height: '100%',
            background: '#22C55E',
            borderRadius: 99,
            boxShadow: '0 0 10px rgba(34, 197, 94, 0.6)',
          }} />

          {/* White slider thumb indicator */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '70%',
            transform: 'translate(-50%, -50%)',
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: '#FFFFFF',
            boxShadow: '0 0 10px #22C55E',
          }} />
        </div>
      </div>
    </div>
  );
}
