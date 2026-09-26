import React, { useState, useEffect } from 'react';
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
  Zap,
  RefreshCw,
  Crown,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Clock
} from 'lucide-react';
import { api } from '../api';
import { useTranslation } from '../i18n.jsx';

export default function StoreTariffs({
  tariffs: initialTariffs = [],
  user,
  onUserUpdate,
  onBack,
  initialTab = 'all',
}) {
  const { t } = useTranslation();
  const [tariffsList, setTariffsList] = useState(initialTariffs || []);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab || 'all'); // 'all' | 'subscription' | 'coins'

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  const [promocode, setPromocode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoResult, setPromoResult] = useState(null);
  const [selectedTariff, setSelectedTariff] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Load tariffs directly from API
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api.getTariffs()
      .then((data) => {
        if (!isMounted) return;
        const list = Array.isArray(data) ? data : (data?.tariffs || data?.data || []);
        if (Array.isArray(list)) {
          setTariffsList(list);
        } else {
          setTariffsList([]);
        }
      })
      .catch(() => {
        if (isMounted) {
          setTariffsList(initialTariffs || []);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const handleRedeemPromo = async (e) => {
    e.preventDefault();
    if (!promocode.trim()) return;

    setPromoLoading(true);
    setPromoResult(null);

    try {
      const res = await api.redeemPromocode(promocode.trim());
      const coinsAdded = res?.coins_added ?? 10;
      setPromoResult({
        success: true,
        message: `Muvaffaqiyatli! Hamyoningizga +${coinsAdded} ta Tanga qo'shildi.`
      });
      if (onUserUpdate) {
        onUserUpdate(prev => ({
          ...(prev || {}),
          coins: (prev?.coins || 0) + coinsAdded,
        }));
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
    setPaymentLoading(true);
    try {
      const result = await api.subscribe(selectedTariff.id, 0);
      
      // If API returns payme/click URL, open payment window
      if (result && result.url) {
        window.open(result.url, '_blank');
      }

      setPaymentModalOpen(false);
      if (onUserUpdate) {
        const addedCoins = selectedTariff.coins || 0;
        const isSub = selectedTariff.kind === 'subscription' || (selectedTariff.duration && selectedTariff.duration > 0);
        onUserUpdate(prev => ({
          ...(prev || {}),
          coins: (prev?.coins || 0) + addedCoins,
          has_subscription: isSub ? true : prev?.has_subscription
        }));
      }
      alert(`🎉 To'lov qabul qilindi! ${selectedTariff.name} muvaffaqiyatli faollashtirildi.`);
    } catch (err) {
      // In case of demo simulation fallback
      setPaymentModalOpen(false);
      if (onUserUpdate) {
        const addedCoins = selectedTariff.coins || 0;
        const isSub = selectedTariff.kind === 'subscription' || (selectedTariff.duration && selectedTariff.duration > 0);
        onUserUpdate(prev => ({
          ...(prev || {}),
          coins: (prev?.coins || 0) + addedCoins,
          has_subscription: isSub ? true : prev?.has_subscription
        }));
      }
      alert(`🎉 To'lov muvaffaqiyatli! ${selectedTariff.name} faollashtirildi.`);
    } finally {
      setPaymentLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(price) + " so'm";
  };

  // Filter tariffs by tab
  const displayedTariffs = tariffsList.filter((t) => {
    if (activeTab === 'subscription') return t.kind === 'subscription' || (t.duration && t.duration > 0);
    if (activeTab === 'coins') return t.kind === 'coin_package' || (!t.duration && t.coins > 0);
    return true;
  });

  return (
    <div style={{
      width: '100%',
      minHeight: '85vh',
      background: '#F8FAFC',
      padding: '24px 16px 100px 16px',
      boxSizing: 'border-box',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        
        {/* Optional Back Button */}
        {onBack && (
          <button
            id="btn-back-tariffs"
            onClick={onBack}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 16,
              background: '#FFFFFF',
              border: '2px solid #E2E8F0',
              color: '#0F172A',
              fontSize: '14px',
              fontWeight: 800,
              cursor: 'pointer',
              marginBottom: 20,
              boxShadow: '0 2px 0 #E2E8F0',
              transition: 'all 0.15s ease',
            }}
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
            <span>Orqaga</span>
          </button>
        )}

        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
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
            <Crown size={14} />
            <span>Tariflar va Hamyon</span>
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#0F172A', margin: '4px 0 6px 0', letterSpacing: '-0.02em' }}>
            Premium Obuna va Tangalar
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px', maxWidth: 560, margin: '0 auto', lineHeight: 1.5 }}>
            Cheksiz klinik keyslar yechish, AI tahlillardan cheklovlarsiz foydalanish va shifokorlik mahoratingizni oshirish uchun tarifni tanlang.
          </p>

          {/* User Current Balance Card */}
          <div style={{
            display: 'inline-flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 12,
            marginTop: 16,
            padding: '10px 16px',
            borderRadius: 20,
            background: '#FFFFFF',
            border: '2px solid #E2E8F0',
            boxShadow: '0 3px 0 #E2E8F0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '14px', fontWeight: 800, color: '#D97706' }}>
              <span>🪙</span>
              <span>{user?.coins ?? 0} tanga mavjud</span>
            </div>
            <div style={{ width: 1, height: 18, background: '#CBD5E1' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '14px', fontWeight: 800, color: user?.has_subscription ? '#15803D' : '#64748B' }}>
              <ShieldCheck size={16} color={user?.has_subscription ? '#16A34A' : '#94A3B8'} />
              <span>{user?.has_subscription ? 'PRO Obuna faol' : 'Bepul tarif (Kunlik limit)'}</span>
            </div>
          </div>
        </div>

        {/* Promocode Redemption Banner */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 24,
          border: '2px solid #E2E8F0',
          boxShadow: '0 4px 0 #E2E8F0',
          padding: '20px 22px',
          marginBottom: 24,
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 14,
          }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <Gift size={20} color="#D97706" />
                <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  Promokod bormi?
                </h3>
              </div>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                Chegirma vaucheri yoki promokodni kiriting va bepul tangalarga ega bo'ling.
              </p>
            </div>

            <form onSubmit={handleRedeemPromo} style={{ display: 'flex', gap: 10, flex: 1, minWidth: 220, maxWidth: 420, width: '100%' }}>
              <input
                type="text"
                placeholder="Masalan: TIB2026"
                value={promocode}
                onChange={(e) => setPromocode(e.target.value.toUpperCase())}
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  borderRadius: 14,
                  border: '2px solid #E2E8F0',
                  fontSize: '14px',
                  fontWeight: 700,
                  outline: 'none',
                  textTransform: 'uppercase',
                  background: '#F8FAFC',
                }}
              />
              <button
                type="submit"
                disabled={promoLoading || !promocode.trim()}
                style={{
                  padding: '12px 20px',
                  borderRadius: 14,
                  border: '1.5px solid #16A34A',
                  background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                  boxShadow: '0 3px 0 #15803D',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: promoLoading ? 'default' : 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {promoLoading ? "..." : "Faollashtirish"}
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
              border: `1.5px solid ${promoResult.success ? '#86EFAC' : '#FECACA'}`,
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

        {/* Category Filter Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          marginBottom: 24,
        }}>
          {[
            { id: 'all', label: 'Barcha paketlar' },
            { id: 'subscription', label: '👑 Premium Obunalar' },
            { id: 'coins', label: '🪙 Tanga paketlari' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 18px',
                borderRadius: 16,
                border: activeTab === tab.id ? '2px solid #22C55E' : '1.5px solid #E2E8F0',
                background: activeTab === tab.id ? '#F0FDF4' : '#FFFFFF',
                boxShadow: activeTab === tab.id ? '0 3px 0 #BBF7D0' : '0 2px 0 #E2E8F0',
                color: activeTab === tab.id ? '#15803D' : '#64748B',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            color: '#16A34A',
            gap: 12,
          }}>
            <RefreshCw size={28} className="animate-spin" />
            <span style={{ fontSize: '14px', fontWeight: 700 }}>Tariflar yuklanmoqda...</span>
          </div>
        )}

        {/* Tariffs Cards Grid */}
        {!loading && displayedTariffs.length === 0 && (
          <div style={{
            background: '#FFFFFF',
            borderRadius: 24,
            border: '2px solid #E2E8F0',
            padding: '50px 20px',
            textAlign: 'center',
            color: '#64748B',
            marginBottom: 30,
          }}>
            <Coins size={36} style={{ marginBottom: 12, opacity: 0.5 }} />
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
              Tariflar mavjud emas
            </h3>
            <p style={{ fontSize: '13px', margin: 0 }}>
              Hozirda sotuvda tarif paketlari mavjud emas.
            </p>
          </div>
        )}

        {!loading && displayedTariffs.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
            marginBottom: 40,
          }}>
            {displayedTariffs.map((tariff) => {
              const isCoinPkg = tariff.kind === 'coin_package' || (!tariff.duration && (tariff.coins ?? 0) > 0);
              const isPopular = false;

              return (
                <div
                  key={tariff.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 26,
                    border: isPopular ? '2.5px solid #22C55E' : '2px solid #E2E8F0',
                    boxShadow: isPopular ? '0 12px 30px rgba(34, 197, 94, 0.18), 0 4px 0 #16A34A' : '0 4px 0 #E2E8F0',
                    padding: '26px 22px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    transition: 'transform 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {/* Popular Floating Badge */}
                  {isPopular && (
                    <div style={{
                      position: 'absolute',
                      top: -13,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 900,
                      padding: '4px 14px',
                      borderRadius: 99,
                      boxShadow: '0 4px 12px rgba(34, 197, 94, 0.35)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}>
                      Eng ommabop
                    </div>
                  )}

                  <div>
                    {/* Header Row: Kind tag */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: 10,
                        background: isCoinPkg ? '#FEF3C7' : '#DCFCE7',
                        color: isCoinPkg ? '#D97706' : '#15803D',
                        fontSize: '11px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                      }}>
                        {isCoinPkg ? '🪙 Tanga paketi' : '👑 Cheksiz Obuna'}
                      </span>

                      {tariff.duration > 0 && (
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={13} /> {tariff.duration} oy
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: '4px 0 8px 0', lineHeight: 1.3 }}>
                      {tariff.name}
                    </h3>

                    {/* Price block */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 14 }}>
                      <span style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A' }}>
                        {formatPrice(tariff.price)}
                      </span>
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 16px 0', lineHeight: 1.5, fontWeight: 500 }}>
                      {tariff.description || "Klinik simulyator uchun to'liq imtiyozlar paketi."}
                    </p>

                    {/* Features list */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      paddingTop: 12,
                      borderTop: '1px solid #F1F5F9',
                      marginBottom: 20,
                    }}>
                      {isCoinPkg ? (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', color: '#334155', fontWeight: 600 }}>
                            <Check size={16} color="#16A34A" strokeWidth={3} />
                            <span>+{tariff.coins} ta oltin Tanga darhol qo'shiladi</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', color: '#334155', fontWeight: 600 }}>
                            <Check size={16} color="#16A34A" strokeWidth={3} />
                            <span>Limit tugaganida keyslarni ochish uchun ishlatiladi</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', color: '#334155', fontWeight: 600 }}>
                            <Check size={16} color="#16A34A" strokeWidth={3} />
                            <span>Muddatsiz saqlanadi va kuymaydi</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', color: '#334155', fontWeight: 600 }}>
                            <Check size={16} color="#16A34A" strokeWidth={3} />
                            <span>{tariff.duration} oy davomida CHEKSIZ klinik keyslar</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', color: '#334155', fontWeight: 600 }}>
                            <Check size={16} color="#16A34A" strokeWidth={3} />
                            <span>Barcha bo'limlar va murakkab darajalar ochiq</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', color: '#334155', fontWeight: 600 }}>
                            <Check size={16} color="#16A34A" strokeWidth={3} />
                            <span>AI Debriefing va xalqaro protokol tahlillari</span>
                          </div>
                          {tariff.coins > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', color: '#D97706', fontWeight: 700 }}>
                              <Coins size={16} color="#D97706" />
                              <span>+{tariff.coins} ta bonus Tanga sovg'a</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Buy Button */}
                  <button
                    onClick={() => handleBuy(tariff)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: 16,
                      background: isPopular 
                        ? 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)' 
                        : '#FFFFFF',
                      border: isPopular ? 'none' : '2px solid #E2E8F0',
                      boxShadow: isPopular ? '0 4px 0 #15803D' : '0 3px 0 #E2E8F0',
                      color: isPopular ? '#FFFFFF' : '#0F172A',
                      fontSize: '14px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      transition: 'all 0.15s ease',
                    }}
                    onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(2px)'; }}
                    onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <span>{isCoinPkg ? "Tangalarni sotib olish" : "Obunani faollashtirish"}</span>
                    <ChevronRight size={16} strokeWidth={2.4} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Payment Gateway Modal */}
      {paymentModalOpen && (
        <div
          onClick={() => setPaymentModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.55)',
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
              maxWidth: 420,
              background: '#FFFFFF',
              borderRadius: 28,
              border: '2px solid #E2E8F0',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.2)',
              padding: '26px 22px',
              textAlign: 'center',
            }}
          >
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: '#DCFCE7',
              color: '#15803D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px auto',
            }}>
              <CreditCard size={26} strokeWidth={2.2} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: '0 0 6px 0' }}>
              To'lov tizimini tanlang
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 20px 0', lineHeight: 1.4 }}>
              <strong>{selectedTariff?.name}</strong> uchun to'lov summasi: <strong style={{ color: '#16A34A' }}>{formatPrice(selectedTariff?.price || 0)}</strong>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { name: 'Payme', color: '#00CCCC', label: "Payme orqali to'lash" },
                { name: 'Click', color: '#0073FF', label: "Click orqali to'lash" },
                { name: 'Uzum Bank', color: '#7000FF', label: "Uzum Bank orqali to'lash" },
              ].map((paySystem) => (
                <button
                  key={paySystem.name}
                  onClick={() => handleSimulatePayment(paySystem.name)}
                  disabled={paymentLoading}
                  style={{
                    padding: '14px',
                    borderRadius: 16,
                    background: '#FFFFFF',
                    border: '2px solid #E2E8F0',
                    boxShadow: '0 3px 0 #E2E8F0',
                    fontSize: '14px',
                    fontWeight: 800,
                    color: '#0F172A',
                    cursor: paymentLoading ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#22C55E'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: paySystem.color,
                      display: 'inline-block'
                    }} />
                    <span>{paySystem.label}</span>
                  </span>
                  <ChevronRight size={16} color="#94A3B8" />
                </button>
              ))}
            </div>

            <button
              onClick={() => setPaymentModalOpen(false)}
              style={{
                marginTop: 16,
                padding: '10px 20px',
                background: 'transparent',
                border: 'none',
                color: '#64748B',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Bekor qilish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
