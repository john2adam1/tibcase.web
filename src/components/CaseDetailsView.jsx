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
  User
} from 'lucide-react';

export default function CaseDetailsView({
  caseItem,
  onStartCase,
  onBack
}) {
  const [anamnesisExpanded, setAnamnesisExpanded] = useState(true);

  if (!caseItem) return null;

  const displayTitle = caseItem.title || '';
  const displayCategory = caseItem.category_name || '';
  const displayDifficulty = caseItem.difficulty
    ? (caseItem.difficulty.charAt(0).toUpperCase() + caseItem.difficulty.slice(1))
    : null;
  const displayDuration = caseItem.expected_duration_minutes
    ? `${caseItem.expected_duration_minutes} min`
    : null;
  const displayGender = caseItem.patient_gender
    ? (caseItem.patient_gender === 'female' ? 'Ayol' : 'Erkak')
    : null;
  const displayAge = caseItem.patient_age ? `${caseItem.patient_age} yosh` : null;
  const displayAnamnesis = caseItem.chief_complaint || caseItem.subtitle || '';

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
          {onBack && (
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
          )}

          <h1 style={{
            flex: 1,
            fontSize: '20px',
            fontWeight: 800,
            color: '#0F172A',
            margin: 0,
            textAlign: 'center',
            paddingRight: onBack ? 44 : 0,
          }}>
            Klinik Keys Tafsilotlari
          </h1>
        </div>

        {/* Badges: Category & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {displayCategory && (
            <span style={{
              background: '#FFEDD5',
              border: '1.5px solid #FED7AA',
              color: '#EA580C',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.5px',
              padding: '4px 10px',
              borderRadius: 8,
              textTransform: 'uppercase',
            }}>
              {displayCategory}
            </span>
          )}
          {caseItem.status && (
            <span style={{
              background: '#F1F5F9',
              border: '1.5px solid #E2E8F0',
              color: '#475569',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.5px',
              padding: '4px 10px',
              borderRadius: 8,
              textTransform: 'uppercase',
            }}>
              {caseItem.status}
            </span>
          )}
        </div>

        {/* Case Title and ID */}
        <div>
          <h2 style={{
            fontSize: '22px',
            fontWeight: 900,
            color: '#0F172A',
            letterSpacing: '-0.02em',
            margin: '0 0 6px 0',
            lineHeight: 1.3,
          }}>
            {displayTitle}
          </h2>
          {caseItem.id && (
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#94A3B8' }}>
              Case ID: #{String(caseItem.id).slice(0, 8)}
            </div>
          )}
        </div>

        {/* Stat Cards Grid: Difficulty, Duration, Topic */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: 12,
        }}>
          {displayDifficulty && (
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
                QIYINCHILIK
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                {displayDifficulty}
              </div>
            </div>
          )}

          {displayDuration && (
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
                DAVOMIYLIK
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                {displayDuration}
              </div>
            </div>
          )}

          {caseItem.topic_name && (
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
                MAVZU
              </div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#16A34A' }}>
                {caseItem.topic_name}
              </div>
            </div>
          )}
        </div>

        {/* Patient Demographics (Rendered only if gender or age exists in API) */}
        {(displayGender || displayAge) && (
          <div style={{
            background: '#FFFFFF',
            borderRadius: 24,
            border: '2px solid #E2E8F0',
            boxShadow: '0 4px 0 #E2E8F0',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: '#F1F5F9',
              border: '2px solid #CBD5E1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#475569',
            }}>
              <User size={24} />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>
                Bemor demografiyasi
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginTop: 2 }}>
                {[displayGender, displayAge].filter(Boolean).join(', ')}
              </div>
            </div>
          </div>
        )}

        {/* Anamnesis / Chief Complaint Card */}
        {displayAnamnesis && (
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
                  Bemor Shikoyati (Anamnez)
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
                {displayAnamnesis}
              </div>
            )}
          </div>
        )}

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
          <span>Simulyatsiyani Boshlash</span>
        </button>
      </div>
    </div>
  );
}
