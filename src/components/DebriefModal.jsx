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
  Zap,
  ArrowRight,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';

export default function DebriefModal({
  debriefData,
  onClose,
  onRetryCase,
}) {
  if (!debriefData) return null;

  const score = debriefData.final_score ?? 0;
  const xp = debriefData.xp_earned ?? 0;
  const coins = debriefData.coins_earned ?? 0;
  const isSuccess = score >= 75;

  const handleShare = async () => {
    const text = `TibCase simulyatorida klinik keysni ${score}% aniqlik bilan yechdim va +${xp} XP to'pladim!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TibCase AI Debriefing Natijasi',
          text,
          url: window.location.origin,
        });
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard?.writeText(`${text}\n${window.location.origin}`);
      alert('Natija nusxalandi!');
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
    >
      <div
        className="responsive-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 620,
          maxHeight: '92vh',
          overflowY: 'auto',
          borderRadius: 32,
          background: '#FFFFFF',
          border: '2px solid #E2E8F0',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
          padding: '28px 24px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
          boxSizing: 'border-box',
        }}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          title="Yopish"
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            width: 36,
            height: 36,
            borderRadius: 12,
            background: '#F1F5F9',
            border: '1.5px solid #E2E8F0',
            color: '#64748B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            zIndex: 10,
          }}
        >
          <X size={18} strokeWidth={2.4} />
        </button>

        {/* Header Badge & Title */}
        <div style={{ textAlign: 'center', paddingTop: 6, paddingRight: 36 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            borderRadius: 99,
            background: isSuccess ? '#F0FDF4' : '#FEF2F2',
            border: `1.5px solid ${isSuccess ? '#BBF7D0' : '#FECACA'}`,
            color: isSuccess ? '#15803D' : '#DC2626',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: 10,
          }}>
            <Sparkles size={15} />
            <span>AI Klinik Debriefing Hisoboti</span>
          </div>

          <h2 style={{
            fontSize: '22px',
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.02em',
            margin: '0 0 6px 0',
            lineHeight: 1.3,
          }}>
            {isSuccess ? "Bemor muvaffaqiyatli saqlab qolindi! 🎉" : "Klinik qiyinchilik kuzatildi ⚠️"}
          </h2>
          <p style={{
            color: '#64748B',
            fontSize: '13px',
            fontWeight: 600,
            margin: 0,
            lineHeight: 1.4,
          }}>
            Xalqaro AHA (American Heart Association) va ESC klinik protokollari asosidagi tahlil
          </p>
        </div>

        {/* 3 Metric Claymorphic Cards */}
        <div
          className="debrief-stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
          }}
        >
          {/* Score Card */}
          <div style={{
            background: isSuccess ? '#F0FDF4' : '#FEF3C7',
            border: `2px solid ${isSuccess ? '#BBF7D0' : '#FDE68A'}`,
            boxShadow: `0 3px 0 ${isSuccess ? '#BBF7D0' : '#FDE68A'}`,
            borderRadius: 20,
            padding: '16px 12px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Klinik Aniqlik
            </div>
            <div style={{
              fontSize: '28px',
              fontWeight: 900,
              color: isSuccess ? '#15803D' : '#D97706',
              margin: '2px 0',
              lineHeight: 1.1,
            }}>
              {score}%
            </div>
            <div style={{
              fontSize: '11px',
              fontWeight: 700,
              color: isSuccess ? '#16A34A' : '#B45309',
            }}>
              {score >= 90 ? "A'lo natija" : score >= 75 ? "Qoniqarli" : "Xatolar mavjud"}
            </div>
          </div>

          {/* XP Card */}
          <div style={{
            background: '#F0F9FF',
            border: '2px solid #BAE6FD',
            boxShadow: '0 3px 0 #BAE6FD',
            borderRadius: 20,
            padding: '16px 12px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              To'plangan XP
            </div>
            <div style={{
              fontSize: '26px',
              fontWeight: 900,
              color: '#0284C7',
              margin: '2px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              lineHeight: 1.1,
            }}>
              <Zap size={22} color="#0284C7" fill="#0284C7" />
              <span>+{xp}</span>
            </div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#0369A1' }}>
              Tajriba ochkosi
            </div>
          </div>

          {/* Coins Card */}
          <div style={{
            background: '#FEFCE8',
            border: '2px solid #FEF08A',
            boxShadow: '0 3px 0 #FEF08A',
            borderRadius: 20,
            padding: '16px 12px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              Mukofot Tangalar
            </div>
            <div style={{
              fontSize: '26px',
              fontWeight: 900,
              color: '#D97706',
              margin: '2px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              lineHeight: 1.1,
            }}>
              <span>🪙</span>
              <span>+{coins}</span>
            </div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#B45309' }}>
              Hamyonga qo'shildi
            </div>
          </div>
        </div>

        {/* Detailed AI Breakdown Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          
          {/* Correct Steps */}
          {debriefData.correct_steps && debriefData.correct_steps.length > 0 && (
            <div style={{
              background: '#F0FDF4',
              border: '1.5px solid #BBF7D0',
              boxShadow: '0 2px 0 #BBF7D0',
              borderRadius: 20,
              padding: '16px 18px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: '#15803D',
                fontWeight: 800,
                fontSize: '14px',
                marginBottom: 10,
              }}>
                <CheckCircle2 size={18} strokeWidth={2.4} />
                <span>To'g'ri va o'z vaqtida bajarilgan harakatlar:</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {debriefData.correct_steps.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '13px', color: '#166534', fontWeight: 600, lineHeight: 1.4 }}>
                    <span style={{ color: '#22C55E', fontWeight: 800, marginTop: 1 }}>•</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Incorrect / Missed Steps */}
          {debriefData.incorrect_steps && debriefData.incorrect_steps.length > 0 && (
            <div style={{
              background: '#FEF2F2',
              border: '1.5px solid #FECACA',
              boxShadow: '0 2px 0 #FECACA',
              borderRadius: 20,
              padding: '16px 18px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: '#DC2626',
                fontWeight: 800,
                fontSize: '14px',
                marginBottom: 10,
              }}>
                <XCircle size={18} strokeWidth={2.4} />
                <span>Kechiktirilgan yoki xato qadamlar:</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {debriefData.incorrect_steps.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '13px', color: '#991B1B', fontWeight: 600, lineHeight: 1.4 }}>
                    <span style={{ color: '#EF4444', fontWeight: 800, marginTop: 1 }}>•</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weak Topics */}
          {debriefData.weak_topics && debriefData.weak_topics.length > 0 && (
            <div style={{
              background: '#FFFBEB',
              border: '1.5px solid #FDE68A',
              boxShadow: '0 2px 0 #FDE68A',
              borderRadius: 20,
              padding: '16px 18px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: '#B45309',
                fontWeight: 800,
                fontSize: '14px',
                marginBottom: 10,
              }}>
                <AlertTriangle size={18} strokeWidth={2.4} />
                <span>Rivojlantirish kerak bo'lgan mavzular (Weak Topics):</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {debriefData.weak_topics.map((topic, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: '#FFFFFF',
                      border: '1.5px solid #FCD34D',
                      borderRadius: 12,
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#92400E',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Clinical Protocol / Guidelines Note */}
          {debriefData.guideline_notes && (
            <div style={{
              background: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              boxShadow: '0 2px 0 #E2E8F0',
              borderRadius: 20,
              padding: '16px 18px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: '#0F172A',
                fontWeight: 800,
                fontSize: '14px',
                marginBottom: 6,
              }}>
                <Stethoscope size={18} color="#2563EB" strokeWidth={2.2} />
                <span>Klinik protokol va tavsiyalar:</span>
              </div>
              <p style={{
                margin: 0,
                fontSize: '13px',
                color: '#475569',
                fontWeight: 500,
                lineHeight: 1.5,
              }}>
                {debriefData.guideline_notes}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: onRetryCase ? '1fr 1fr auto' : '1fr auto',
          gap: 10,
          marginTop: 6,
        }}>
          {onRetryCase && (
            <button
              onClick={onRetryCase}
              style={{
                padding: '14px',
                borderRadius: 16,
                background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                border: '1.5px solid #16A34A',
                boxShadow: '0 4px 0 #15803D, 0 8px 16px rgba(34, 197, 94, 0.25)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <RotateCcw size={16} strokeWidth={2.4} />
              Qayta urinish
            </button>
          )}

          <button
            onClick={onClose}
            style={{
              padding: '14px',
              borderRadius: 16,
              background: '#FFFFFF',
              border: '2px solid #E2E8F0',
              boxShadow: '0 3px 0 #E2E8F0',
              color: '#0F172A',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            Tushundim
          </button>

          <button
            onClick={handleShare}
            title="Natijani ulashish"
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              background: '#F1F5F9',
              border: '1.5px solid #E2E8F0',
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Share2 size={18} strokeWidth={2.2} />
          </button>
        </div>

      </div>
    </div>
  );
}
