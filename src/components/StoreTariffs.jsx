import React, { useState } from 'react';
import {
  AlertTriangle,
  Award,
  Check,
  CheckCircle2,
  Coins,
  CreditCard,
  Gift,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react';
import { api } from '../api';
import { useTranslation } from '../i18n.jsx';

export default function StoreTariffs({
  tariffs = [],
  user,
  onUserUpdate,
}) {
  const { t } = useTranslation();
  const [promocode, setPromocode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoResult, setPromoResult] = useState(null);
  const [selectedTariff, setSelectedTariff] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const handleRedeemPromo = async (e) => {
    e.preventDefault();
    if (!promocode.trim()) return;

    setPromoLoading(true);
    setPromoResult(null);

    try {
      const res = await api.redeemPromocode(promocode.trim());
      const coinsAdded = res.coins_added ?? 10;
      setPromoResult({
        success: true,
        message: `Muvaffaqiyatli! Hamyoningizga +${coinsAdded} ta Tanga qo'shildi.`
      });
      if (onUserUpdate) {
        onUserUpdate(prev => ({ ...prev, coins: (prev.coins || 0) + coinsAdded }));
      }
      setPromocode('');
    } catch (err) {
      setPromoResult({
        success: false,
        message: err.message || "Promokod yaroqsiz yoki avval ishlatilgan"
      });
    } finally {
      setPromoLoading(false);
    }
  };

  const handleBuy = (tariff) => {
    setSelectedTariff(tariff);
    setPaymentModalOpen(true);
  };

  const handleSimulatePayment = async (gateway) => {
    if (!selectedTariff) return;
    try {
      const result = await api.subscribe(selectedTariff.id, 0);
      setPaymentModalOpen(false);
      if (onUserUpdate && selectedTariff) {
        const addedCoins = selectedTariff.coins || 0;
        onUserUpdate(prev => ({
          ...prev,
          coins: (prev.coins || 0) + addedCoins,
          has_subscription: true
        }));
      }
    } catch (err) {
      alert(err.message || 'Payment failed');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
  };

  const items = tariffs;

  return (
    <div style={{
      width: '100%',
      minHeight: '85vh',
      background: '#F8FAFC',
      padding: '32px 16px 100px 16px',
      boxSizing: 'border-box',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: '#FEF3C7',
            border: '1.5px solid #FDE68A',
            color: '#D97706',
            fontSize: '12px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '5px 14px',
            borderRadius: 99,
            marginBottom: 10,
          }}>
            <Coins size={14} />
            <span>{t('store.badge')}</span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', margin: '4px 0 6px 0' }}>
            {t('store.title')}
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px', maxWidth: 560, margin: '0 auto' }}>
            {t('store.subtitle')}
          </p>
        </div>

        {/* Promocode Redemption Banner */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 24,
          border: '1.5px solid #E2E8F0',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
          padding: '22px 24px',
          marginBottom: 32,
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Gift size={20} color="#D97706" />
                <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  {t('store.promoTitle')}
                </h3>
              </div>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                {t('store.promoSubtitle')}
              </p>
            </div>

            <form onSubmit={handleRedeemPromo} style={{ display: 'flex', gap: 10, flex: 1, minWidth: 260, maxWidth: 420 }}>
              <input
                type="text"
                placeholder="Masalan: TIB2026"
                value={promocode}
                onChange={(e) => setPromocode(e.target.value.toUpperCase())}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 14,
                  background: '#F8FAFC',
                  border: '1.5px solid #CBD5E1',
                  color: '#0F172A',
                  fontSize: '13.5px',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={promoLoading || !promocode.trim()}
                style={{
                  padding: '12px 18px',
                  borderRadius: 14,
                  fontSize: '13.5px',
                  fontWeight: 800,
                  background: '#16A34A',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)',
                }}
              >
                {promoLoading ? "..." : t('store.activate')}
              </button>
            </form>
          </div>

          {promoResult && (
            <div style={{
              marginTop: 14,
              padding: '10px 14px',
              borderRadius: 12,
              fontSize: '13px',
              fontWeight: 700,
              background: promoResult.success ? '#DCFCE7' : '#FEE2E2',
              border: `1px solid ${promoResult.success ? '#86EFAC' : '#FECACA'}`,
              color: promoResult.success ? '#166534' : '#DC2626',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              {promoResult.success ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
              <span>{promoResult.message}</span>
            </div>
          )}
        </div>

        {/* Tariffs Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 18,
          marginBottom: 40,
        }}>
          {items.map((tariff) => (
            <div
              key={tariff.id}
              style={{
                background: '#FFFFFF',
                borderRadius: 26,
                border: tariff.is_popular ? '2px solid #86EFAC' : '1.5px solid #E2E8F0',
                boxShadow: tariff.is_popular ? '0 10px 30px rgba(34, 197, 94, 0.15)' : '0 4px 16px rgba(0, 0, 0, 0.03)',
                padding: '26px 22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              {tariff.is_popular && (
                <div style={{
                  position: 'absolute',
                  top: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 900,
                  padding: '4px 14px',
                  borderRadius: 99,
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.35)',
                }}>
                  {t('store.popular')}
                </div>
              )}

              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: '0 0 6px 0' }}>
                  {tariff.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 16 }}>
                  <span style={{ fontSize: '24px', fontWeight: 900, color: '#16A34A' }}>
                    {formatPrice(tariff.price)}
                  </span>
                  <span style={{ fontSize: '13px', color: '#64748B' }}>
                    / {tariff.period}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  borderTop: '1px solid #F1F5F9',
                  paddingTop: 16,
                  marginBottom: 20,
                }}>
                  {tariff.features.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: '#DCFCE7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#16A34A',
                        flexShrink: 0,
                      }}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleBuy(tariff)}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 16,
                  background: tariff.is_popular ? 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)' : '#F1F5F9',
                  border: tariff.is_popular ? 'none' : '1.5px solid #CBD5E1',
                  color: tariff.is_popular ? '#FFFFFF' : '#0F172A',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: tariff.is_popular ? '0 6px 18px rgba(34, 197, 94, 0.35)' : 'none',
                }}
              >
                {t('store.selectAndConnect')}
              </button>
            </div>
          ))}
        </div>

      </div>

      {/* Payment simulation modal */}
      {paymentModalOpen && (
        <div
          onClick={() => setPaymentModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(6px)',
            zIndex: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 400,
              background: '#FFFFFF',
              borderRadius: 26,
              border: '2px solid #E2E8F0',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.15)',
              padding: '24px 20px',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: '0 0 6px 0' }}>
              {t('store.paymentTitle')}
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 20px 0' }}>
              {selectedTariff?.name} — {formatPrice(selectedTariff?.price || 0)}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Payme', 'Click', 'Uzum Bank'].map((paySystem) => (
                <button
                  key={paySystem}
                  onClick={() => handleSimulatePayment(paySystem)}
                  style={{
                    padding: '14px',
                    borderRadius: 14,
                    background: '#F8FAFC',
                    border: '1.5px solid #E2E8F0',
                    fontSize: '14px',
                    fontWeight: 800,
                    color: '#0F172A',
                    cursor: 'pointer',
                  }}
                >
                  {paySystem} {t('store.payVia')}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
