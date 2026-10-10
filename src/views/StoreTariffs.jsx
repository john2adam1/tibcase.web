import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Coins,
  CreditCard,
  Gift,
  ShieldCheck,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  Clock,
  Copy,
  ExternalLink,
  X,
  Sparkles,
} from 'lucide-react';
import { api } from '../api';
import { useTranslation } from '../i18n.jsx';

/**
 * Open payment or external link safely across standard browsers and Telegram Mini App
 */
function openPaymentGatewayUrl(url) {
  if (!url) return;
  const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : null;
  if (tg && typeof tg.openLink === 'function') {
    tg.openLink(url);
    return;
  }
  const w = window.open(url, '_blank');
  if (!w) {
    window.location.href = url;
  }
}

export default function StoreTariffs({
  tariffs: initialTariffs = [],
  user,
  userLimit,
  onUserUpdate,
  onBack,
  initialTab = 'all',
}) {
  const { t, lang } = useTranslation();
  const [tariffsList, setTariffsList] = useState(initialTariffs || []);
  const [loading, setLoading] = useState(false);

  // Tab filtering: 'all' | 'subscription' | 'coin_package'
  const [activeCategory, setActiveCategory] = useState(() => {
    if (initialTab === 'coins') return 'coin_package';
    if (initialTab === 'subscriptions') return 'subscription';
    return initialTab || 'all';
  });

  const [promocode, setPromocode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoResult, setPromoResult] = useState(null);

  // Payment checkout states
  const [selectedTariff, setSelectedTariff] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentProvider, setPaymentProvider] = useState('click'); // 'click' | 'inpay'
  const [coinsToUse, setCoinsToUse] = useState('');

  // Payment link modal (for URL redirect & copy fallback)
  const [payLinkModal, setPayLinkModal] = useState({
    open: false,
    url: '',
    orderId: '',
    provider: 'click',
  });
  const [linkCopied, setLinkCopied] = useState(false);

  // Immediate success modal (e.g., just_paid = true)
  const [successModal, setSuccessModal] = useState({
    open: false,
    message: '',
  });

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
      const coinsAdded = res?.coins_added;
      setPromoResult({
        success: true,
        message: coinsAdded != null
          ? `Muvaffaqiyatli! Hamyoningizga +${coinsAdded} ta Tanga qo'shildi.`
          : "Promokod muvaffaqiyatli qo'llandi."
      });
      try {
        const fresh = await api.getUserProfile();
        if (fresh && onUserUpdate) onUserUpdate(fresh);
      } catch {
        // keep current profile
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
    setCoinsToUse('');
    setPaymentProvider('click');
    setPaymentModalOpen(true);
  };

  const handleProcessPayment = async () => {
    if (!selectedTariff) return;
    setPaymentLoading(true);

    const isCoinPkg = selectedTariff.kind === 'coin_package' || (!selectedTariff.duration && (selectedTariff.coins ?? 0) > 0);
    const parsedCoins = isCoinPkg ? 0 : Math.max(0, Math.min(Number(coinsToUse) || 0, user?.coins || 0));

    try {
      const result = await api.subscribe(selectedTariff.id, parsedCoins, paymentProvider);

      // Close checkout selector modal
      setPaymentModalOpen(false);

      // 1. Direct activation (e.g. fully paid with coins or instant backend credit)
      if (result?.just_paid) {
        const msg = isCoinPkg
          ? t('store.justPaidCoins', "Tangalar hisobga qo'shildi!")
          : t('store.justPaidSub', "To'liq tangadan to'landi — obuna faollashdi!");
        setSuccessModal({ open: true, message: msg });

        // Refresh user profile & limit
        try {
          const fresh = await api.getUserProfile();
          if (fresh && onUserUpdate) onUserUpdate(fresh);
        } catch {
          // ignore
        }
        return;
      }

      // 2. Gateway URL payment
      const payUrl = typeof result === 'string' ? result : result?.url;
      const orderId = result?.order_id || '';

      if (payUrl) {
        // If inPAY, open immediately as per user-panel pattern
        openPaymentGatewayUrl(payUrl);

        // Also open payment link dialog for quick copy or manual revisit
        setPayLinkModal({
          open: true,
          url: payUrl,
          orderId,
          provider: paymentProvider,
        });
      } else if (orderId) {
        setSuccessModal({
          open: true,
          message: `${t('store.orderCreated', 'Buyurtma yaratildi')}: #${orderId}`,
        });
      }

      // Refresh user profile in background
      try {
        const fresh = await api.getUserProfile();
        if (fresh && onUserUpdate) onUserUpdate(fresh);
      } catch {
        // ignore
      }
    } catch (err) {
      alert(err?.message || "To'lov jarayonida xatolik yuz berdi");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleCopyPayLink = async () => {
    if (!payLinkModal.url) return;
    try {
      await navigator.clipboard.writeText(payLinkModal.url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    } catch {
      // fallback copy
      const el = document.createElement('textarea');
      el.value = payLinkModal.url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('uz-UZ').format(Math.max(0, price || 0)) + " so'm";
  };

  // Filter tariffs by selected tab
  const displayedTariffs = tariffsList.filter((t) => {
    const isCoinPkg = t.kind === 'coin_package' || (!t.duration && (t.coins ?? 0) > 0);
    const isSub = t.kind === 'subscription' || (t.duration && t.duration > 0 && !t.coins);

    if (activeCategory === 'coin_package') {
      return isCoinPkg;
    }
    if (activeCategory === 'subscription') {
      return isSub;
    }
    return true; // 'all'
  });

  // Calculate remaining payment amount inside checkout modal
  const isSelectedCoinPkg = selectedTariff?.kind === 'coin_package' || (!selectedTariff?.duration && (selectedTariff?.coins ?? 0) > 0);
  const currentEnteredCoins = isSelectedCoinPkg ? 0 : Math.max(0, Math.min(Number(coinsToUse) || 0, user?.coins || 0));
  const remainingPayAmount = Math.max(0, (selectedTariff?.price || 0) - currentEnteredCoins);

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
              border: '1px solid #E2E8F0',
              color: '#0F172A',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              marginBottom: 20,
              boxShadow: 'var(--shadow-sm)',
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
            border: '1px solid #FDE68A',
            color: '#D97706',
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '5px 14px',
            borderRadius: 99,
            marginBottom: 10,
          }}>
            <Coins size={14} />
            <span>{t('store.badge', 'Tariflar va To\'lov')}</span>
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A', margin: '4px 0 6px 0', letterSpacing: '-0.02em' }}>
            {t('store.coinTariffsTitle', 'Tariflar va Obuna')}
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px', maxWidth: 560, margin: '0 auto', lineHeight: 1.5 }}>
            {t('store.coinTariffsSubtitle', 'Klinik keyslar yechish va tibbiy simulyatsiyalardan cheklovlarsiz foydalanish uchun o\'zingizga mos tarifni tanlang.')}
          </p>

          {/* User Current Balance Card */}
          <div style={{
            display: 'inline-flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 12,
            marginTop: 16,
            padding: '10px 16px',
            borderRadius: 16,
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '14px', fontWeight: 700, color: '#D97706' }}>
              <span>🪙</span>
              <span>{user?.coins ?? 0} tanga mavjud</span>
            </div>
            <div style={{ width: 1, height: 18, background: '#CBD5E1' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '14px', fontWeight: 700, color: (user?.has_subscription || userLimit?.has_subscription) ? '#15803D' : '#64748B' }}>
              <ShieldCheck size={16} color={(user?.has_subscription || userLimit?.has_subscription) ? '#16A34A' : '#94A3B8'} />
              <span>{(user?.has_subscription || userLimit?.has_subscription) ? 'PRO Obuna faol' : `Bepul tarif (${userLimit?.remaining ?? '-'}/${userLimit?.total ?? '-'} limit)`}</span>
            </div>
          </div>
        </div>

        {/* Category Tabs: Barchasi | Obuna | Tangalar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 24,
          flexWrap: 'wrap',
        }}>
          {[
            { id: 'all', label: t('store.tabAll', 'Barchasi'), icon: Sparkles },
            { id: 'subscription', label: t('store.tabSubscriptions', '👑 Premium Obuna'), icon: ShieldCheck },
            { id: 'coin_package', label: t('store.tabCoins', '🪙 Tanga paketlari'), icon: Coins },
          ].map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-store-${tab.id}`}
                onClick={() => setActiveCategory(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 18px',
                  borderRadius: 14,
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: isActive ? '1.5px solid #16A34A' : '1px solid #E2E8F0',
                  background: isActive ? '#DCFCE7' : '#FFFFFF',
                  color: isActive ? '#15803D' : '#475569',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Promocode Redemption Banner */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 18,
          border: '1px solid #E2E8F0',
          boxShadow: 'var(--shadow-sm)',
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
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  Promokod bormi?
                </h3>
              </div>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                Chegirma vaucheri yoki promokodni kiriting va bepul tangalarga ega bo'ling.
              </p>
            </div>

            <form onSubmit={handleRedeemPromo} style={{ display: 'flex', gap: 10, flex: 1, minWidth: 220, maxWidth: 420, width: '100%' }}>
              <input
                id="input-promocode"
                type="text"
                placeholder="Masalan: TIB2026"
                value={promocode}
                onChange={(e) => setPromocode(e.target.value.toUpperCase())}
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  borderRadius: 14,
                  border: '1px solid #E2E8F0',
                  fontSize: '14px',
                  fontWeight: 700,
                  outline: 'none',
                  textTransform: 'uppercase',
                  background: '#F8FAFC',
                }}
              />
              <button
                id="btn-redeem-promo"
                type="submit"
                disabled={promoLoading || !promocode.trim()}
                style={{
                  padding: '12px 20px',
                  borderRadius: 14,
                  border: '1px solid #16A34A',
                  background: '#16A34A',
                  boxShadow: 'var(--shadow-sm)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: promoLoading ? 'default' : 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {promoLoading ? "..." : t("store.activate", "Faollashtirish")}
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

        {/* Tariffs Empty State */}
        {!loading && displayedTariffs.length === 0 && (
          <div style={{
            background: '#FFFFFF',
            borderRadius: 18,
            border: '1px solid #E2E8F0',
            padding: '50px 20px',
            textAlign: 'center',
            color: '#64748B',
            marginBottom: 30,
          }}>
            <Coins size={36} style={{ marginBottom: 12, opacity: 0.5 }} />
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>
              {t('store.tariffsEmpty', 'Hozircha tariflar mavjud emas.')}
            </h3>
            <p style={{ fontSize: '13px', margin: 0 }}>
              Tez orada yangi tariflar va imtiyozlar qo'shiladi.
            </p>
          </div>
        )}

        {/* Tariffs Cards Grid */}
        {!loading && displayedTariffs.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
            marginBottom: 40,
          }}>
            {displayedTariffs.map((tariff) => {
              const isCoinPkg = tariff.kind === 'coin_package' || (!tariff.duration && (tariff.coins ?? 0) > 0);
              const isPopular = tariff.duration >= 3;

              return (
                <div
                  key={tariff.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 18,
                    border: isPopular ? '2px solid #22C55E' : '1px solid #E2E8F0',
                    boxShadow: isPopular ? '0 12px 30px rgba(34, 197, 94, 0.15), 0 4px 0 #16A34A' : '0 4px 0 #E2E8F0',
                    padding: '24px 22px',
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
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#16A34A',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 14px',
                      borderRadius: 99,
                      boxShadow: 'var(--shadow-sm)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}>
                      Eng tavsiya etilgan
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
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}>
                        {isCoinPkg ? `🪙 ${t('store.coinPackage', 'Tanga paketi')}` : t('store.unlimitedSub', '👑 Cheksiz Obuna')}
                      </span>

                      {tariff.duration > 0 && (
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={13} /> {tariff.duration} {t('store.month', 'oy')}
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '4px 0 8px 0', lineHeight: 1.3 }}>
                      {tariff.name}
                    </h3>

                    {/* Price block */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
                      <span style={{ fontSize: '26px', fontWeight: 700, color: '#0F172A' }}>
                        {formatPrice(tariff.price)}
                      </span>
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 16px 0', lineHeight: 1.5, fontWeight: 500 }}>
                      {tariff.description || (isCoinPkg ? "Klinik keyslarni ochish uchun oltin tangalar to'plami." : "Klinik simulyator uchun to'liq imtiyozlar paketi.")}
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
                            <span>+{tariff.coins} ta oltin Tanga hisobingizga qo'shiladi</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', color: '#334155', fontWeight: 600 }}>
                            <Check size={16} color="#16A34A" strokeWidth={3} />
                            <span>Kunlik limit tugaganda keyslarni mustaqil ochish</span>
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
                            <span>AI Debriefing va to'liq tibbiy xatolar tahlili</span>
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
                    id={`btn-buy-tariff-${tariff.id}`}
                    onClick={() => handleBuy(tariff)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: 16,
                      background: isPopular 
                        ? '#16A34A' 
                        : '#FFFFFF',
                      border: isPopular ? 'none' : '1px solid #E2E8F0',
                      boxShadow: isPopular ? '0 4px 0 #15803D' : '0 3px 0 #E2E8F0',
                      color: isPopular ? '#FFFFFF' : '#0F172A',
                      fontSize: '14px',
                      fontWeight: 700,
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
                    <span>{isCoinPkg ? t('store.buyCoinsBtn', 'Tangalarni sotib olish') : t('store.activateSub', 'Obunani faollashtirish')}</span>
                    <ChevronRight size={16} strokeWidth={2.4} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ============================================================
          CHECKOUT & PAYMENT PROVIDER SELECTION MODAL
          ============================================================ */}
      {paymentModalOpen && (
        <div
          onClick={() => setPaymentModalOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
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
              maxWidth: 440,
              background: '#FFFFFF',
              borderRadius: 20,
              border: '1px solid #E2E8F0',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
              padding: '24px 22px',
              textAlign: 'left',
              position: 'relative',
            }}
          >
            {/* Close Cross Button */}
            <button
              onClick={() => setPaymentModalOpen(false)}
              style={{
                position: 'absolute',
                top: 18,
                right: 18,
                background: '#F1F5F9',
                border: 'none',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748B',
              }}
            >
              <X size={16} />
            </button>

            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: '#DCFCE7',
              color: '#15803D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
            }}>
              <CreditCard size={24} strokeWidth={2.2} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>
              {t('store.choosePaymentSystem', "To'lov tizimini tanlang")}
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px 0' }}>
              Tarif: <strong style={{ color: '#0F172A' }}>{selectedTariff?.name}</strong> • Narxi: <strong style={{ color: '#16A34A' }}>{formatPrice(selectedTariff?.price || 0)}</strong>
            </p>

            {/* Optional Coins Usage (Allowed for Subscriptions) */}
            {!isSelectedCoinPkg && (
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 14,
                padding: '12px 14px',
                marginBottom: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label htmlFor="input-coins-used" style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                    {t('store.coinsUsageLabel', 'Tangalardan foydalanish (ixtiyoriy):')}
                  </label>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#D97706' }}>
                    🪙 {user?.coins ?? 0} tanga
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    id="input-coins-used"
                    type="number"
                    min={0}
                    max={user?.coins || 0}
                    placeholder="Masalan: 50"
                    value={coinsToUse}
                    onChange={(e) => setCoinsToUse(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '9px 12px',
                      borderRadius: 10,
                      border: '1px solid #CBD5E1',
                      fontSize: '13px',
                      fontWeight: 600,
                      outline: 'none',
                      background: '#FFFFFF',
                    }}
                  />
                  {user?.coins > 0 && (
                    <button
                      type="button"
                      onClick={() => setCoinsToUse(String(Math.min(user?.coins || 0, Math.floor(selectedTariff?.price || 0))))}
                      style={{
                        padding: '9px 12px',
                        borderRadius: 10,
                        border: '1px solid #CBD5E1',
                        background: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#D97706',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Barchasi
                    </button>
                  )}
                </div>
                {currentEnteredCoins > 0 && (
                  <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#16A34A', fontWeight: 600 }}>
                    {remainingPayAmount <= 0
                      ? "✓ To'liq tangalardan to'lanadi (0 so'm naqd to'lov)"
                      : `- ${formatPrice(currentEnteredCoins)} chegirma. To'lovga: ${formatPrice(remainingPayAmount)}`}
                  </p>
                )}
              </div>
            )}

            {/* Payment Providers List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
              {[
                {
                  id: 'click',
                  name: 'Click',
                  badge: 'Click Up & Web',
                  color: '#0073FF',
                  desc: 'Uzcard, Humo va Click hamyon orqali'
                },
                {
                  id: 'inpay',
                  name: 'inPAY',
                  badge: 'Tezkor to\'lov',
                  color: '#16A34A',
                  desc: 'Bank kartalari va xalqaro to\'lovlar'
                },
              ].map((prov) => {
                const isSelected = paymentProvider === prov.id;
                return (
                  <div
                    key={prov.id}
                    id={`provider-option-${prov.id}`}
                    onClick={() => setPaymentProvider(prov.id)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 14,
                      background: isSelected ? '#F0FDF4' : '#FFFFFF',
                      border: isSelected ? '2px solid #16A34A' : '1px solid #E2E8F0',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: prov.color,
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '13px',
                      }}>
                        {prov.name[0]}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                            {prov.name}
                          </span>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: 6,
                            background: '#F1F5F9',
                            color: '#64748B',
                          }}>
                            {prov.badge}
                          </span>
                        </div>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748B' }}>
                          {prov.desc}
                        </p>
                      </div>
                    </div>

                    <div style={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: isSelected ? '6px solid #16A34A' : '2px solid #CBD5E1',
                      background: '#FFFFFF',
                      boxSizing: 'border-box',
                    }} />
                  </div>
                );
              })}
            </div>

            {/* Proceed to Payment Action Button */}
            <button
              id="btn-confirm-payment"
              onClick={handleProcessPayment}
              disabled={paymentLoading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 16,
                background: '#16A34A',
                boxShadow: '0 4px 0 #15803D',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 700,
                cursor: paymentLoading ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.15s ease',
              }}
            >
              {paymentLoading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Bog'lanmoqda...</span>
                </>
              ) : remainingPayAmount <= 0 ? (
                <span>🪙 Tangalar orqali faollashtirish</span>
              ) : (
                <span>
                  💳 {formatPrice(remainingPayAmount)} · {paymentProvider === 'click' ? 'Click' : 'inPAY'} orqali to'lash
                </span>
              )}
            </button>

            <button
              onClick={() => setPaymentModalOpen(false)}
              style={{
                width: '100%',
                marginTop: 10,
                padding: '10px',
                background: 'transparent',
                border: 'none',
                color: '#64748B',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'center',
              }}
            >
              {t('common.cancel', 'Bekor qilish')}
            </button>
          </div>
        </div>
      )}

      {/* ============================================================
          PAYMENT LINK MODAL (URL & COPY ACTION)
          ============================================================ */}
      {payLinkModal.open && (
        <div
          onClick={() => setPayLinkModal({ open: false, url: '', orderId: '', provider: 'click' })}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(6px)',
            zIndex: 130,
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
              maxWidth: 440,
              background: '#FFFFFF',
              borderRadius: 20,
              border: '1px solid #E2E8F0',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
              padding: '24px 22px',
              textAlign: 'center',
              position: 'relative',
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
              <ExternalLink size={26} strokeWidth={2.2} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>
              {t('store.payLinkModalTitle', "To'lov havolasi")}
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px 0', lineHeight: 1.4 }}>
              {t('store.payLinkModalDesc', "To'lovni xavfsiz yakunlash uchun quyidagi havola orqali to'lov tizimi oynasiga o'ting:")}
            </p>

            {payLinkModal.orderId && (
              <div style={{
                display: 'inline-block',
                background: '#F1F5F9',
                padding: '4px 10px',
                borderRadius: 8,
                fontSize: '12px',
                fontWeight: 700,
                color: '#475569',
                marginBottom: 14,
              }}>
                Buyurtma: #{payLinkModal.orderId}
              </div>
            )}

            {/* Direct Link Open Button */}
            <button
              id="btn-open-payment-link"
              onClick={() => openPaymentGatewayUrl(payLinkModal.url)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 16,
                background: '#16A34A',
                boxShadow: '0 4px 0 #15803D',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginBottom: 10,
              }}
            >
              <span>{t('store.proceedToPay', "To'lovga o'tish")}</span>
              <ExternalLink size={16} />
            </button>

            {/* Copy Link Button */}
            <button
              id="btn-copy-payment-link"
              onClick={handleCopyPayLink}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 14,
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                color: linkCopied ? '#16A34A' : '#334155',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginBottom: 14,
              }}
            >
              {linkCopied ? (
                <>
                  <Check size={16} color="#16A34A" strokeWidth={2.5} />
                  <span>{t('store.linkCopied', 'Havola nusxalandi!')}</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>{t('store.copyLink', 'Havolani nusxalash')}</span>
                </>
              )}
            </button>

            <button
              onClick={() => setPayLinkModal({ open: false, url: '', orderId: '', provider: 'click' })}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                border: 'none',
                color: '#64748B',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              {t('common.cancel', 'Yopish')}
            </button>
          </div>
        </div>
      )}

      {/* ============================================================
          PAYMENT SUCCESS MODAL (DIRECT ACTIVATION)
          ============================================================ */}
      {successModal.open && (
        <div
          onClick={() => setSuccessModal({ open: false, message: '' })}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(6px)',
            zIndex: 130,
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
              borderRadius: 20,
              border: '1px solid #E2E8F0',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25)',
              padding: '28px 22px',
              textAlign: 'center',
            }}
          >
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#DCFCE7',
              color: '#16A34A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
            }}>
              <CheckCircle2 size={32} strokeWidth={2.5} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px 0' }}>
              Muvaffaqiyatli!
            </h3>
            <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              {successModal.message}
            </p>

            <button
              onClick={() => setSuccessModal({ open: false, message: '' })}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 14,
                background: '#16A34A',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Tushunarli
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
