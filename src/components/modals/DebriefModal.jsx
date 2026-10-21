import {
  ChevronRight,
  RotateCcw,
  Share2,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { useTranslation } from '../../i18n.jsx';

export default function DebriefModal({
  debriefData,
  onClose,
  onRetryCase,
  onNextCase,
}) {
  const { t } = useTranslation();
  if (!debriefData) return null;

  const score = debriefData.final_score ?? 0;
  const xp = debriefData.xp_earned ?? 0;
  const coins = debriefData.coins_earned ?? 0;
  const tokensUsed = debriefData.tokens_used ?? 0;
  const coinsSpent = debriefData.coins_spent ?? 0;
  const showUsage = tokensUsed > 0 || coinsSpent > 0;
  const isSuccess = score >= 75;

  const handleShare = async () => {
    const text = `TibStation AI simulyatorida klinik keysni ${score}% aniqlik bilan yechdim va +${xp} XP to'pladim!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TibStation AI Debriefing Natijasi',
          text,
          url: window.location.origin,
        });
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard?.writeText(`${text}\n${window.location.origin}`);
      alert(t('debrief.copiedAlert', 'Natija nusxalandi!'));
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
          border: '1px solid #E2E8F0',
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
          title={t('common.close', 'Yopish')}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            width: 36,
            height: 36,
            borderRadius: 12,
            background: '#F1F5F9',
            border: '1px solid #E2E8F0',
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
            border: `1px solid ${isSuccess ? '#BBF7D0' : '#FECACA'}`,
            color: isSuccess ? '#15803D' : '#DC2626',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: 10,
          }}>
            <Sparkles size={15} />
            <span>{t('debrief.reportTitle', 'AI Klinik Debriefing Hisoboti')}</span>
          </div>

          <h2 style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#0F172A',
            letterSpacing: '-0.02em',
            margin: '0 0 6px 0',
            lineHeight: 1.3,
          }}>
            {isSuccess ? t('debrief.successTitle', "Bemor muvaffaqiyatli saqlab qolindi! 🎉") : t('debrief.criticalTitle', "Klinik qiyinchilik kuzatildi ⚠️")}
          </h2>
          <p style={{
            color: '#64748B',
            fontSize: '13px',
            fontWeight: 600,
            margin: 0,
            lineHeight: 1.4,
          }}>
            {t('debrief.protocolDesc', "Xalqaro AHA (American Heart Association) va ESC klinik protokollari asosidagi tahlil")}
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
            border: `1px solid ${isSuccess ? '#BBF7D0' : '#FDE68A'}`,
            boxShadow: `0 3px 0 ${isSuccess ? '#BBF7D0' : '#FDE68A'}`,
            borderRadius: 16,
            padding: '16px 12px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              {t('debrief.accuracy', 'Klinik Aniqlik')}
            </div>
            <div style={{
              fontSize: '28px',
              fontWeight: 700,
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
              {score >= 90 ? t('debrief.excellent', "A'lo natija") : score >= 75 ? t('debrief.satisfactory', 'Qoniqarli') : t('debrief.hasErrors', 'Xatolar mavjud')}
            </div>
          </div>

          {/* XP Card */}
          <div style={{
            background: '#F0F9FF',
            border: '1px solid #BAE6FD',
            boxShadow: 'var(--shadow-sm)',
            borderRadius: 16,
            padding: '16px 12px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              {t('debrief.earnedXp', "To'plangan XP")}
            </div>
            <div style={{
              fontSize: '26px',
              fontWeight: 700,
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
              {t('debrief.xpDesc', 'Tajriba ochkosi')}
            </div>
          </div>

          {/* Coins Card */}
          <div style={{
            background: '#FEFCE8',
            border: '1px solid #FEF08A',
            boxShadow: 'var(--shadow-sm)',
            borderRadius: 16,
            padding: '16px 12px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              {t('debrief.rewardCoins', 'Mukofot Tangalar')}
            </div>
            <div style={{
              fontSize: '26px',
              fontWeight: 700,
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
              {t('debrief.addedToWallet', "Hamyonga qo'shildi")}
            </div>
          </div>
        </div>

        {showUsage && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 16,
            flexWrap: 'wrap',
            fontSize: 13,
            fontWeight: 700,
            color: '#475569',
          }}>
            {tokensUsed > 0 && (
              <span>{t('debrief.tokensUsed', 'Token')}: {tokensUsed}</span>
            )}
            {coinsSpent > 0 && (
              <span>🪙 {t('debrief.coinsSpent', 'Sarflangan tanga')}: {coinsSpent}</span>
            )}
          </div>
        )}

        {/* Action Buttons Row */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          marginTop: 6,
        }}>
          {onNextCase && (
            <button
              id="btn-next-case-debrief"
              onClick={onNextCase}
              style={{
                flex: '1 1 140px',
                padding: '14px',
                borderRadius: 16,
                background: '#16A34A',
                border: '1px solid #16A34A',
                boxShadow: 'var(--shadow-sm)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {t('case.nextCase', 'Keyingi')}
              <ChevronRight size={16} strokeWidth={2.4} />
            </button>
          )}
          {onRetryCase && (
            <button
              onClick={onRetryCase}
              style={{
                flex: '1 1 140px',
                padding: '14px',
                borderRadius: 16,
                background: '#FFFFFF',
                border: '1px solid #16A34A',
                boxShadow: 'var(--shadow-sm)',
                color: '#15803D',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <RotateCcw size={16} strokeWidth={2.4} />
              {t('sim.retry', 'Qayta urinish')}
            </button>
          )}

          <button
            onClick={onClose}
            style={{
              flex: '1 1 120px',
              padding: '14px',
              borderRadius: 16,
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              boxShadow: 'var(--shadow-sm)',
              color: '#0F172A',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {t('debrief.closeBtn', 'Tushundim')}
          </button>

          <button
            onClick={handleShare}
            title={t('debrief.shareResult', 'Natijani ulashish')}
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
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
