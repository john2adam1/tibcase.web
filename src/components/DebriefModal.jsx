import React from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  Coins,
  RotateCcw,
  Share2,
  Sparkles,
  X,
  XCircle,
  Zap
} from 'lucide-react';

export default function DebriefModal({
  debriefData,
  onClose,
  onRetryCase,
}) {
  if (!debriefData) return null;

  const score = debriefData.final_score ?? 92;
  const xp = debriefData.xp_earned ?? 60;
  const coins = debriefData.coins_earned ?? 2;

  const isSuccess = score >= 75;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 680,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 28,
          position: 'relative',
          background: 'linear-gradient(180deg, #0e172a 0%, #070d18 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'rgba(255, 255, 255, 0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header Badge */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            borderRadius: 99,
            background: isSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
            border: `1px solid ${isSuccess ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
            color: isSuccess ? '#34d399' : '#fb7185',
            fontSize: '0.82rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: 12,
          }}>
            <Sparkles size={16} />
            <span>AI Klinik Debriefing Hisoboti</span>
          </div>

          <h2 style={{ fontSize: '1.8rem', marginBottom: 6 }}>
            {isSuccess ? "Bemor Muvaffaqiyatli Saqlab Qolindi!" : "Klinik Qiyinchilik Kuzatildi"}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Xalqaro AHA (American Heart Association) va ESC protokollari asosida tahlil
          </p>
        </div>

        {/* Score & Rewards Banner */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          marginBottom: 24,
        }}>
          {/* Score */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 14,
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Klinik Aniqlik
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: 900,
              fontFamily: 'var(--font-heading)',
              color: isSuccess ? '#34d399' : '#fbbf24',
            }}>
              {score}%
            </div>
            <div style={{ fontSize: '0.75rem', color: isSuccess ? '#10b981' : '#f59e0b' }}>
              {score >= 90 ? "A'lo daraja" : score >= 75 ? "Qoniqarli" : "Kritik xatolar"}
            </div>
          </div>

          {/* XP */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 14,
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              To'plangan XP
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: 900,
              fontFamily: 'var(--font-heading)',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}>
              <Zap size={22} color="#38bdf8" />
              <span>+{xp}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Tajriba ochkosi
            </div>
          </div>

          {/* Coins */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 14,
            padding: '16px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Mukofot Tangalar
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: 900,
              fontFamily: 'var(--font-heading)',
              color: '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}>
              <Coins size={22} color="#fbbf24" />
              <span>+{coins}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Hamyonga qo'shildi
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          {/* Correct Steps */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: 12,
            padding: 16,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              color: '#34d399',
              fontWeight: 700,
              fontSize: '0.9rem',
              marginBottom: 10,
            }}>
              <CheckCircle2 size={18} />
              <span>To'g'ri va O'z Vaqtida Bajarilgan Harakatlar:</span>
            </div>
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(debriefData.correct_steps || []).map((step, idx) => (
                <li key={idx} style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>
                  {step}
                </li>
              ))}
            </ul>
          </div>

          {/* Incorrect / Missed Steps */}
          {debriefData.incorrect_steps?.length > 0 && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.05)',
              border: '1px solid rgba(244, 63, 94, 0.2)',
              borderRadius: 12,
              padding: 16,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: '#fb7185',
                fontWeight: 700,
                fontSize: '0.9rem',
                marginBottom: 10,
              }}>
                <XCircle size={18} />
                <span>Kechiktirilgan yoki Xato Qadamlar:</span>
              </div>
              <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {debriefData.incorrect_steps.map((step, idx) => (
                  <li key={idx} style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Weak Topics */}
          {debriefData.weak_topics?.length > 0 && (
            <div style={{
              background: 'rgba(245, 158, 11, 0.05)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: 12,
              padding: 16,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: '#fbbf24',
                fontWeight: 700,
                fontSize: '0.9rem',
                marginBottom: 8,
              }}>
                <AlertTriangle size={18} />
                <span>Rivojlantirish Kerak Bo'lgan Mavzular (Weak Topics):</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {debriefData.weak_topics.map((t, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.8rem',
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#fef3c7',
                      padding: '4px 10px',
                      borderRadius: 6,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Guideline Notes */}
          {debriefData.guideline_notes && (
            <div style={{
              background: 'rgba(6, 182, 212, 0.05)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              borderRadius: 12,
              padding: 16,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: 'var(--accent-cyan)',
                fontWeight: 700,
                fontSize: '0.9rem',
                marginBottom: 6,
              }}>
                <BookOpen size={18} />
                <span>Xalqaro Klinik Protokol Xulosasi:</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                {debriefData.guideline_notes}
              </p>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          paddingTop: 16,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <button
            onClick={onRetryCase}
            className="btn-secondary"
            style={{ padding: '10px 18px', fontSize: '0.9rem' }}
          >
            <RotateCcw size={16} />
            <span>Qayta urinish</span>
          </button>

          <button
            onClick={onClose}
            className="btn-primary"
            style={{ padding: '10px 24px', fontSize: '0.9rem' }}
          >
            <span>Katalogga qaytish</span>
          </button>
        </div>
      </div>
    </div>
  );
}
