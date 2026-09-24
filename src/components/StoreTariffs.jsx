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

export default function StoreTariffs({
  tariffs = [],
  user,
  onUserUpdate,
}) {
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

  const handleSimulatePayment = (gateway) => {
    alert(`To'lov tizimi (${gateway}) ulanmoqda... Xarid muvaffaqiyatli yakunlandi!`);
    setPaymentModalOpen(false);
    if (onUserUpdate && selectedTariff) {
      const addedCoins = selectedTariff.coins || (selectedTariff.kind === 'coin_package' ? 100 : 0);
      onUserUpdate(prev => ({
        ...prev,
        coins: prev.coins + addedCoins,
        has_subscription: true
      }));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px 80px' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          color: '#fbbf24',
          fontSize: '0.85rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: 8,
        }}>
          <Coins size={16} />
          <span>Obunalar va Tangalar Do'koni</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginBottom: 12 }}>
          Bilimingizga Sarmoya Kiriting
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 600, margin: '0 auto' }}>
          Cheksiz klinik keyslar, Gemini AI debriefing va professional xalqaro protokollarga to'liq kirish
        </p>
      </div>

      {/* Promocode Redemption Banner (TZ 4.3 B 3) */}
      <div className="glass-panel" style={{
        padding: '24px 28px',
        marginBottom: 48,
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
        }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Gift size={20} color="#fbbf24" />
              <h3 style={{ fontSize: '1.25rem' }}>Promokod Bormi?</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Hamkor kurslar yoki tadbirlardan olgan maxsus promokodingizni kiriting va bepul tangalarga ega bo'ling:
            </p>
          </div>

          <form onSubmit={handleRedeemPromo} style={{ display: 'flex', gap: 10, flex: 1, minWidth: 280, maxWidth: 440 }}>
            <input
              type="text"
              placeholder="Masalan: SHARK2026 yoki MEDVIP"
              value={promocode}
              onChange={(e) => setPromocode(e.target.value.toUpperCase())}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 10,
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontSize: '0.95rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 600,
              }}
            />
            <button
              type="submit"
              disabled={promoLoading || !promocode.trim()}
              className="btn-primary"
              style={{
                padding: '12px 20px',
                fontSize: '0.9rem',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
              }}
            >
              {promoLoading ? "Tekshirilmoqda..." : "Faollashtirish"}
            </button>
          </form>
        </div>

        {promoResult && (
          <div style={{
            marginTop: 14,
            padding: '10px 14px',
            borderRadius: 8,
            fontSize: '0.88rem',
            background: promoResult.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${promoResult.success ? '#10b981' : '#ef4444'}`,
            color: promoResult.success ? '#34d399' : '#f87171',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}>
            {promoResult.success ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            <span>{promoResult.message}</span>
          </div>
        )}
      </div>

      {/* Tariffs Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 24,
        marginBottom: 60,
      }}>
        {tariffs.map(t => {
          const isPopular = t.name?.toLowerCase().includes('premium') || t.price === 29000;
          return (
            <div
              key={t.id}
              className="glass-panel"
              style={{
                padding: 32,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                background: isPopular
                  ? 'linear-gradient(180deg, rgba(14, 28, 54, 0.9) 0%, rgba(9, 16, 31, 0.95) 100%)'
                  : 'rgba(14, 23, 42, 0.7)',
                border: isPopular
                  ? '2px solid rgba(6, 182, 212, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: isPopular ? '0 16px 40px rgba(6, 182, 212, 0.2)' : 'none',
              }}
            >
              {isPopular && (
                <div style={{
                  position: 'absolute',
                  top: -12,
                  right: 24,
                  background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  padding: '4px 12px',
                  borderRadius: 99,
                  boxShadow: '0 4px 12px rgba(6, 182, 212, 0.4)',
                }}>
                  Eng Ommabop
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <span className={`badge ${t.kind === 'coin_package' ? 'badge-amber' : 'badge-cyan'}`} style={{ marginBottom: 12 }}>
                  {t.kind === 'coin_package' ? 'Tangalar Paketi' : 'To\'liq Obuna'}
                </span>
                <h3 style={{ fontSize: '1.6rem', marginBottom: 6, textTransform: 'capitalize' }}>
                  {t.name}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                  {t.description || (t.kind === 'coin_package' ? `${t.coins || 100} ta simulyatsiya tangasi` : `${t.duration || 30} kunlik cheksiz kirish`)}
                </p>
              </div>

              {/* Price */}
              <div style={{ marginBottom: 28 }}>
                <div style={{
                  fontSize: '2.4rem',
                  fontWeight: 900,
                  fontFamily: 'var(--font-heading)',
                  color: '#fff',
                  lineHeight: 1.1,
                }}>
                  {formatPrice(t.price)}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {t.kind === 'coin_package' ? 'Bir martalik to\'lov' : 'Oylik obuna'}
                </div>
              </div>

              {/* Features list */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                marginBottom: 32,
                flex: 1,
              }}>
                {[
                  "Barcha klinik bo'limlar ochiq",
                  "Jonli EKG va fiziologik vitallar monitori",
                  "Gemini AI debriefing hisobotlari",
                  "AHA & ERC protokollari bilan solishtirish",
                  "Ovozli diktor va tovush effektlari"
                ].map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem', color: '#cbd5e1' }}>
                    <div style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#10b981',
                      flexShrink: 0,
                    }}>
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Buy button */}
              <button
                onClick={() => handleBuy(t)}
                className={isPopular ? 'btn-primary' : 'btn-secondary'}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '0.98rem',
                }}
              >
                <CreditCard size={18} />
                <span>Tanlash va To'lash</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Payment Gateway Modal */}
      {paymentModalOpen && (
        <div className="modal-overlay" onClick={() => setPaymentModalOpen(false)}>
          <div
            className="glass-panel"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 440,
              width: '100%',
              padding: 28,
              textAlign: 'center',
              background: '#0d1527',
              border: '1px solid rgba(56, 189, 248, 0.3)',
            }}
          >
            <h3 style={{ fontSize: '1.4rem', marginBottom: 8 }}>To'lov Usulini Tanlang</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 24 }}>
              Tanlangan tarif: <strong>{selectedTariff?.name}</strong> ({formatPrice(selectedTariff?.price || 0)})
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {[
                { name: 'Click Up', color: '#0073ff' },
                { name: 'Payme', color: '#00cccc' },
                { name: 'Uzum Bank', color: '#7000ff' },
              ].map(gw => (
                <button
                  key={gw.name}
                  onClick={() => handleSimulatePayment(gw.name)}
                  style={{
                    padding: '14px',
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '1rem',
                  }}
                >
                  <span>{gw.name} orqali to'lash</span>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: gw.color }} />
                </button>
              ))}
            </div>

            <button
              onClick={() => setPaymentModalOpen(false)}
              className="btn-secondary"
              style={{ width: '100%', padding: '10px' }}
            >
              Bekor qilish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
