import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  BarChart2,
  Clock,
  Award,
  Play,
  FileText,
  Activity,
  Heart,
  Thermometer,
  Wind
} from 'lucide-react';

export default function CaseDetailsView({
  caseItem = {
    id: 'emer-013',
    case_number: '013',
    case_id_code: '#EMER_E_013',
    category: 'EMERGENCY MEDICINE',
    urgency: 'URGENT',
    title: 'Emergency Medicine Case #013',
    difficulty: 'Easy',
    duration: '10 min',
    reward_xp: '+250 XP',
    patient_gender: 'Female',
    patient_age: 26,
    vitals: {
      bp: '88/54',
      hr: '128 bpm',
      rr: '26 /dk',
      spo2: '92 %',
      temp: '36.8 °C'
    },
    anamnesis: '26-year-old female presents 10 minutes after eating a peanut-containing dessert with generalized itching, urticaria, throat tightness, and shortness of breath. She can only speak in short sentences and has lip swelling.'
  },
  onStartCase,
  onBack
}) {
  const [anamnesisExpanded, setAnamnesisExpanded] = useState(true);

  return (
    <div style={{
      width: '100%',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px 16px 100px 16px',
      background: '#F8FAFC',
      boxSizing: 'border-box',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{
        width: '100%',
        maxWidth: 480,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        gap: 16,
      }}>
        {/* Header: Back Button + Title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          padding: '8px 4px',
        }}>
          <button
            onClick={onBack}
            title="Orqaga"
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '2px solid #E2E8F0',
              boxShadow: '0 2px 0 #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#0F172A',
            }}
          >
            <ChevronLeft size={24} strokeWidth={2.4} />
          </button>

          <h1 style={{
            flex: 1,
            fontSize: '20px',
            fontWeight: 800,
            color: '#0F172A',
            margin: 0,
            textAlign: 'center',
            paddingRight: 44,
          }}>
            Case Details
          </h1>
        </div>

        {/* Badges: Category & Urgency */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
          <span style={{
            background: '#FFEDD5',
            border: '1.5px solid #FED7AA',
            color: '#EA580C',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.5px',
            padding: '4px 10px',
            borderRadius: 8,
          }}>
            {caseItem.category || 'EMERGENCY MEDICINE'}
          </span>
          <span style={{
            background: '#FEE2E2',
            border: '1.5px solid #FECACA',
            color: '#EF4444',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.5px',
            padding: '4px 10px',
            borderRadius: 8,
          }}>
            {caseItem.urgency || 'URGENT'}
          </span>
        </div>

        {/* Case Title and Code */}
        <div>
          <h2 style={{
            fontSize: '26px',
            fontWeight: 900,
            color: '#0F172A',
            letterSpacing: '-0.02em',
            margin: '0 0 6px 0',
            lineHeight: 1.25,
          }}>
            {caseItem.title || 'Emergency Medicine Case #013'}
          </h2>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#94A3B8' }}>
            Case ID: {caseItem.case_id_code || '#EMER_E_013'}
          </div>
        </div>

        {/* 3 Stat Cards Grid: Difficulty, Duration, Reward */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
        }}>
          {/* Difficulty */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 20,
            border: '2px solid #E2E8F0',
            boxShadow: '0 4px 0 #E2E8F0',
            padding: '16px 8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 6,
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#FFEDD5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#EA580C',
            }}>
              <BarChart2 size={18} strokeWidth={2.4} />
            </div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.5px' }}>
              DIFFICULTY
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
              {caseItem.difficulty || 'Easy'}
            </div>
          </div>

          {/* Duration */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 20,
            border: '2px solid #E2E8F0',
            boxShadow: '0 4px 0 #E2E8F0',
            padding: '16px 8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 6,
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#DBEAFE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2563EB',
            }}>
              <Clock size={18} strokeWidth={2.4} />
            </div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.5px' }}>
              DURATION
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
              {caseItem.duration || '10 min'}
            </div>
          </div>

          {/* Reward */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 20,
            border: '2px solid #E2E8F0',
            boxShadow: '0 4px 0 #E2E8F0',
            padding: '16px 8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 6,
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#DCFCE7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#16A34A',
            }}>
              <Award size={18} strokeWidth={2.4} />
            </div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.5px' }}>
              REWARD
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#16A34A' }}>
              {caseItem.reward_xp || '+250 XP'}
            </div>
          </div>
        </div>

        {/* Patient Info Card (Female, 26 years old + Vitals) */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 24,
          border: '2px solid #E2E8F0',
          boxShadow: '0 4px 0 #E2E8F0',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}>
          <h3 style={{
            fontSize: '17px',
            fontWeight: 800,
            color: '#0F172A',
            margin: 0,
            textAlign: 'center',
          }}>
            {caseItem.patient_gender || 'Female'}, {caseItem.patient_age || 26} years old
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Patient Avatar with glowing ring */}
            <div style={{
              position: 'relative',
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#FEF08A',
              border: '2.5px solid #FACC15',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: '28px',
            }}>
              <span>👧</span>
              {/* Online Green Badge */}
              <div style={{
                position: 'absolute',
                bottom: 2,
                right: 2,
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: '#22C55E',
                border: '2.5px solid #FFFFFF',
              }} />
            </div>

            {/* 5 Vitals Badges Grid */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              flex: 1,
            }}>
              {/* BP */}
              <span style={{
                background: '#DBEAFE',
                color: '#1D4ED8',
                fontSize: '12px',
                fontWeight: 700,
                padding: '5px 10px',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}>
                🩺 {caseItem.vitals?.bp || '88/54'}
              </span>

              {/* HR */}
              <span style={{
                background: '#FEE2E2',
                color: '#B91C1C',
                fontSize: '12px',
                fontWeight: 700,
                padding: '5px 10px',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}>
                ❤️ {caseItem.vitals?.hr || '128 bpm'}
              </span>

              {/* RR */}
              <span style={{
                background: '#CCFBF1',
                color: '#0F766E',
                fontSize: '12px',
                fontWeight: 700,
                padding: '5px 10px',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}>
                🫁 {caseItem.vitals?.rr || '26 /dk'}
              </span>

              {/* SpO2 */}
              <span style={{
                background: '#EDE9FE',
                color: '#6D28D9',
                fontSize: '12px',
                fontWeight: 700,
                padding: '5px 10px',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}>
                🧬 {caseItem.vitals?.spo2 || '92 %'}
              </span>

              {/* Temp */}
              <span style={{
                background: '#FFEDD5',
                color: '#C2410C',
                fontSize: '12px',
                fontWeight: 700,
                padding: '5px 10px',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}>
                🌡️ {caseItem.vitals?.temp || '36.8 °C'}
              </span>
            </div>
          </div>
        </div>

        {/* Anamnesis (Complaint History) Card */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 24,
          border: '2px solid #E2E8F0',
          boxShadow: '0 4px 0 #E2E8F0',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          <div
            onClick={() => setAnamnesisExpanded(!anamnesisExpanded)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={18} color="#64748B" />
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                Anamnesis (Complaint History)
              </span>
            </div>
            {anamnesisExpanded ? <ChevronUp size={20} color="#64748B" /> : <ChevronDown size={20} color="#64748B" />}
          </div>

          {anamnesisExpanded && (
            <div style={{
              borderLeft: '3.5px solid #22C55E',
              paddingLeft: 12,
              fontSize: '13px',
              fontWeight: 500,
              lineHeight: 1.6,
              color: '#334155',
            }}>
              {caseItem.anamnesis}
            </div>
          )}
        </div>

        {/* Start Case Button */}
        <button
          id="btn-start-case"
          onClick={onStartCase}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 20,
            background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
            border: '2px solid #15803D',
            boxShadow: '0 5px 0 #15803D, 0 10px 24px rgba(34, 197, 94, 0.4)',
            color: '#FFFFFF',
            fontSize: '17px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            cursor: 'pointer',
            marginTop: 8,
            transition: 'all 0.15s ease',
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(2px)';
            e.currentTarget.style.boxShadow = '0 3px 0 #15803D';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 5px 0 #15803D, 0 10px 24px rgba(34, 197, 94, 0.4)';
          }}
        >
          <div style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Play size={12} fill="#16A34A" color="#16A34A" style={{ marginLeft: 2 }} />
          </div>
          <span>Start Case</span>
        </button>
      </div>
    </div>
  );
}
