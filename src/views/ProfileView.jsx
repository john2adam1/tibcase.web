import React, { useState, useEffect } from 'react';
import UserAvatar from '../components/common/UserAvatar';
import { api } from '../api';
import {
  Settings,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Share2,
  Tag,
  Globe,
  Copy,
  Trash2,
  Sparkles,
  Award,
  Star,
  Check,
  X,
  MessageCircle,
  AlertCircle,
  Coins,
  ShieldAlert,
  ShieldCheck,
  Activity as ActivityIcon,
  Bell,
  Info,
  LogOut,
  CalendarDays,
  Bookmark,
  Phone,
  ExternalLink,
  HelpCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Zap,
} from 'lucide-react';
import { useTranslation } from '../i18n.jsx';

export default function ProfileView({
  user,
  userLimit,
  onRefreshLimit,
  onUserUpdate,
  onOpenStore,
  onNavigate,
  onLangChange,
  onLogout
}) {
  const { t, lang: appLang, setLang } = useTranslation();
  const lang = appLang || 'uz';
  const [currentScreen, setCurrentScreen] = useState('profile'); // 'profile' | 'settings'
  const [activeTab, setActiveTab] = useState('completed'); // 'completed' | 'ongoing'
  const [levelsList, setLevelsList] = useState([]);
  const [loadingLevels, setLoadingLevels] = useState(false);
  const [localLimit, setLocalLimit] = useState(userLimit || null);

  useEffect(() => {
    if (userLimit) {
      setLocalLimit(userLimit);
    }
  }, [userLimit]);

  // Real API data
  const [completedSessions, setCompletedSessions] = useState([]);
  const [ongoingSessions, setOngoingSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Load completed/ongoing simulations, levels and real daily limit from API
  useEffect(() => {
    let mounted = true;
    setLoadingSessions(true);
    setLoadingLevels(true);
    Promise.all([
      api.getCompletedSimulations().catch(() => ({ sessions: [], count: 0 })),
      api.getOngoingSimulations().catch(() => ({ sessions: [], count: 0 })),
      api.getUserLimit().catch(() => null),
      api.getLevels().catch(() => []),
    ]).then(([comp, ong, freshLimit, freshLevels]) => {
      if (mounted) {
        setCompletedSessions(comp?.sessions || []);
        setOngoingSessions(ong?.sessions || []);
        if (Array.isArray(freshLevels) && freshLevels.length > 0) {
          setLevelsList(freshLevels);
        }
        if (freshLimit) {
          setLocalLimit(freshLimit);
          if (onRefreshLimit) onRefreshLimit();
        }
      }
    }).finally(() => {
      if (mounted) {
        setLoadingSessions(false);
        setLoadingLevels(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  // Sub-modals for Settings
  const [modalType, setModalType] = useState(null); // 'profile_info' | 'about' | 'username' | 'coupon' | 'referral' | 'language' | 'rate' | 'feedback' | 'terms' | 'privacy' | 'delete' | 'levels_guide'
  const [tempUsername, setTempUsername] = useState(user?.name || '');
  const [couponCode, setCouponCode] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [toastMessage, setToastMessage] = useState(null);

  // 1. Profile Info State & Handlers
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone_number: user?.phone_number || '',
    email: user?.email || '',
    language: user?.language || 'uz',
    specialization: user?.specialization || 'student',
    imageFile: null,
    imagePreview: user?.image_url || '',
  });

  const handleOpenProfileInfo = async () => {
    setProfileForm({
      name: user?.name || '',
      phone_number: user?.phone_number || '',
      email: user?.email || '',
      language: user?.language || 'uz',
      specialization: user?.specialization || 'student',
      imageFile: null,
      imagePreview: user?.image_url || '',
    });
    setModalType('profile_info');
    try {
      const fresh = await api.getUserProfile();
      if (fresh) {
        setProfileForm({
          name: fresh.name || '',
          phone_number: fresh.phone_number || '',
          email: fresh.email || '',
          language: fresh.language || 'uz',
          specialization: fresh.specialization || 'student',
          imageFile: null,
          imagePreview: fresh.image_url || '',
        });
        if (onUserUpdate) onUserUpdate(fresh);
      }
    } catch {
      // Keep existing data
    }
  };

  const handleSaveProfileInfo = async (e) => {
    if (e) e.preventDefault();
    setSaveLoading(true);
    try {
      await api.updateUserProfile({
        name: profileForm.name,
        phone_number: profileForm.phone_number,
        email: profileForm.email,
        language: profileForm.language,
        image: profileForm.imageFile,
      });
      showToast('✅ ' + t('pm.profileSaved'));
      const fresh = await api.getUserProfile().catch(() => null);
      if (fresh && onUserUpdate) {
        onUserUpdate(fresh);
      } else if (onUserUpdate) {
        onUserUpdate(prev => ({
          ...(prev || {}),
          ...profileForm,
          image_url: profileForm.imagePreview || prev?.image_url,
        }));
      }
      setModalType(null);
    } catch (err) {
      showToast("⚠️ " + (err.message || t('pm.saveError')));
    } finally {
      setSaveLoading(false);
    }
  };


  // 3. About App State & Handlers
  const [aboutLoading, setAboutLoading] = useState(false);
  const [aboutList, setAboutList] = useState([]);
  const [appRoute, setAppRoute] = useState(null);
  const [contactList, setContactList] = useState([]);
  const [faqList, setFaqList] = useState([]);
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Referral (GET /mobile/referral)
  const [referral, setReferral] = useState(null);
  const [referralLoading, setReferralLoading] = useState(false);
  const [referralError, setReferralError] = useState('');
  const [copiedReferral, setCopiedReferral] = useState(false);

  const handleOpenReferral = async () => {
    setModalType('referral');
    setReferralLoading(true);
    setReferralError('');
    try {
      const res = await api.getReferral();
      setReferral(res || null);
    } catch (err) {
      setReferralError(err?.message || t('common.error', 'Xatolik yuz berdi'));
    } finally {
      setReferralLoading(false);
    }
  };

  const handleCopyReferral = async () => {
    if (!referral?.referral_code) return;
    try {
      await navigator.clipboard.writeText(referral.referral_code);
      setCopiedReferral(true);
      setTimeout(() => setCopiedReferral(false), 2000);
    } catch {
      showToast(referral.referral_code);
    }
  };

  const handleShareReferral = async () => {
    if (!referral?.referral_code) return;
    const text = `TibStation AI: ${t('settings.referral', "Do'stlarni taklif qilish")} — ${referral.referral_code}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'TibStation AI', text, url: window.location.origin });
      } catch {
        // user cancelled
      }
    } else {
      handleCopyReferral();
    }
  };

  const handleOpenAbout = () => {
    setModalType('about');
    setAboutLoading(true);
    Promise.all([
      api.getAbout().catch(() => []),
      api.getAppRoutes().catch(() => null),
      api.getContacts().catch(() => []),
      api.getFaqs().catch(() => []),
    ]).then(([abouts, routes, contacts, faqs]) => {
      setAboutList(Array.isArray(abouts) ? abouts : (abouts?.abouts || []));
      const routeData = routes && typeof routes === 'object' ? (routes.app_routes?.[0] || routes) : null;
      setAppRoute(routeData);
      setContactList(Array.isArray(contacts) ? contacts : (contacts?.contacts || []));
      setFaqList(Array.isArray(faqs) ? faqs : (faqs?.faqs || []));
    }).finally(() => {
      setAboutLoading(false);
    });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveUsername = async () => {
    if (!tempUsername.trim()) return;
    setSaveLoading(true);
    try {
      await api.updateUserProfile({ name: tempUsername.trim() });
      if (onUserUpdate) {
        onUserUpdate(prev => ({ ...(prev || {}), name: tempUsername.trim() }));
      }
      setModalType(null);
      showToast(t('settings.save') + ' ✓');
    } catch (err) {
      showToast(err.message || 'Error');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setPromoLoading(true);
    try {
      const res = await api.redeemPromocode(couponCode.trim());
      const coinsAdded = res?.coins_added;
      showToast(coinsAdded != null ? `🎉 +${coinsAdded} ${t('settings.coins')}!` : '🎉');
      try {
        const fresh = await api.getUserProfile();
        if (fresh && onUserUpdate) onUserUpdate(fresh);
      } catch {
        // keep current profile
      }
      setCouponCode('');
      setModalType(null);
    } catch (err) {
      showToast('⚠️ ' + (err.message || t('pm.invalidPromo')));
    } finally {
      setPromoLoading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'TibStation AI Medical Simulator',
      text: t('pm.shareText'),
      url: window.location.origin
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard?.writeText(window.location.origin);
      showToast(t('pm.linkCopied'));
    }
  };

  // XP & Level calculations strictly reflecting live API data
  const totalXP = user?.xp || 0;
  const userLevelNum = Number(user?.level) || 1;

  // Level from API response if present
  const currentLevelObj = levelsList.find(l => Number(l.level_number) === userLevelNum) || null;
  const nextLevelObj = levelsList.find(l => Number(l.level_number) === (userLevelNum + 1)) || null;

  let currMinXp = 0;
  let nextTargetXp = 1000;
  let xpSpan = 1000;
  let xpInCurrentLevel = totalXP % 1000;
  let xpRemaining = 1000 - xpInCurrentLevel;
  let xpProgressPercent = Math.min(100, Math.max(0, (xpInCurrentLevel / 1000) * 100));

  if (currentLevelObj && nextLevelObj) {
    currMinXp = currentLevelObj.required_xp || 0;
    nextTargetXp = nextLevelObj.required_xp || (currMinXp + 1000);
    xpSpan = Math.max(1, nextTargetXp - currMinXp);
    xpInCurrentLevel = Math.max(0, totalXP - currMinXp);
    xpRemaining = Math.max(0, nextTargetXp - totalXP);
    xpProgressPercent = Math.min(100, Math.max(0, (xpInCurrentLevel / xpSpan) * 100));
  }

  const completedCount = completedSessions.length || user?.completed_cases_count || 0;
  const ongoingCount = ongoingSessions.length || user?.ongoing_cases_count || 0;

  // Language display
  const getLanguageLabel = () => {
    if (lang === 'uz') return '🇺🇿 Oʻzbek';
    if (lang === 'ru') return '🇷🇺 Русский';
    return '🇺🇸 English';
  };

  const getTranslatedLevelTitle = (lvl) => {
    if (!lvl) return '';
    if (typeof lvl.title === 'object' && lvl.title !== null) {
      return lvl.title[lang] || lvl.title.uz || lvl.title.ru || lvl.title.en || '';
    }
    const slug = (lvl.slug || '').toLowerCase();
    const raw = (typeof lvl.title === 'string' ? lvl.title : '').toLowerCase();
    if (slug === 'beginner' || raw.includes('boshlang')) return t('level.beginner', lvl.title || "Boshlang'ich");
    if (slug === 'student' || raw.includes('talab') || raw.includes('студент')) return t('level.student', lvl.title || 'Talaba');
    if (slug === 'intern' || raw.includes('intern') || raw.includes('интерн')) return t('level.intern', lvl.title || 'Intern');
    if (slug === 'resident' || raw.includes('rezident') || raw.includes('ординат')) return t('level.resident', lvl.title || 'Rezident');
    if (slug === 'doctor' || raw.includes('shifokor') || raw.includes('врач')) return t('level.doctor', lvl.title || 'Shifokor');
    if (slug === 'specialist' || raw.includes('mutaxassis') || raw.includes('специалист')) return t('level.specialist', lvl.title || 'Mutaxassis');
    if (slug === 'expert' || raw.includes('ekspert') || raw.includes('эксперт')) return t('level.expert', lvl.title || 'Ekspert');
    if (slug === 'master' || slug === 'professor' || raw.includes('professor') || raw.includes('профессор')) return t('level.master', lvl.title || 'Professor');
    return lvl.title || '';
  };

  const getTranslatedSpecialization = (spec) => {
    if (!spec) return '';
    const s = String(spec).toLowerCase().trim();
    if (s === 'student' || s === 'talaba' || s.includes('студент')) return t('profile.student', 'Tibbiyot talabasi');
    if (s === 'doctor' || s === 'shifokor' || s.includes('врач')) return t('profile.doctor', 'Shifokor');
    if (s === 'resident' || s === 'rezident' || s.includes('ординатор')) return t('profile.resident', 'Rezident');
    if (s === 'intern' || s.includes('интерн')) return t('profile.intern', 'Intern');
    return spec;
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px 16px 100px 16px',
      boxSizing: 'border-box',
      background: '#F8FAFC',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      {/* Container simulating the sleek mobile/app column */}
      <div style={{
        width: '100%',
        maxWidth: 480,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}>

        {/* ============================================================== */}
        {/* VIEW 1: PROFILE SCREEN                                         */}
        {/* ============================================================== */}
        {currentScreen === 'profile' && (
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>

            {/* Header: Title + Settings Button */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              padding: '8px 4px 18px 4px',
            }}>
              <div style={{ width: 44 }} /> {/* placeholder for centering */}

              <h1 style={{
                fontSize: '26px',
                fontWeight: 700,
                color: '#0F172A',
                letterSpacing: '-0.02em',
                margin: 0,
                textAlign: 'center',
              }}>
                {t('profile.title')}
              </h1>

              {/* Gold Settings Gear Button */}
              <button
                id="btn-settings-toggle"
                onClick={() => {
                  const el = document.getElementById('profile-settings-group');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    setCurrentScreen('settings');
                  }
                }}
                title={t('profile.settings')}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                  border: '1px solid #FCD34D',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(2px)';
                  e.currentTarget.style.boxShadow = '0 1px 0 #F59E0B';
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 3px 0 #F59E0B, 0 6px 14px rgba(245, 158, 11, 0.15)';
                }}
              >
                <Settings size={22} color="#D97706" strokeWidth={2.4} />
              </button>
            </div>

            {/* Profile Main Card */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid #E2E8F0',
              boxShadow: 'var(--shadow-soft)',
              padding: '32px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              width: '100%',
              boxSizing: 'border-box',
            }}>
              {/* Avatar + Name + Trophy Badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
              }}>
                <UserAvatar name={user?.name} src={user?.image_url} size={96} />

                  {/* User Name & Subtitle */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{
                    fontSize: '22px',
                    fontWeight: 700,
                    color: '#0F172A',
                    margin: '0 0 4px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {user?.name || ''}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    {currentLevelObj && (
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#16A34A',
                        background: '#DCFCE7',
                        padding: '2px 8px',
                        borderRadius: 8,
                        border: '1px solid #86EFAC',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        <Zap size={12} /> {getTranslatedLevelTitle(currentLevelObj)}
                      </span>
                    )}
                    {user?.specialization && (
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B' }}>
                        {getTranslatedSpecialization(user.specialization)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Glowing Green Trophy / Badge */}
                <div
                  onClick={() => levelsList.length > 0 && setModalType('levels_guide')}
                  title={levelsList.length > 0 ? t('profile.levelsTableTitle', 'Klinik Darajalar Tizimi') : ''}
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: '50%',
                    background: '#DCFCE7',
                    border: '2.5px solid #86EFAC',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    cursor: levelsList.length > 0 ? 'pointer' : 'default',
                    overflow: 'hidden',
                    transition: 'transform 0.15s ease',
                  }}
                  onMouseEnter={(e) => { if (levelsList.length > 0) e.currentTarget.style.transform = 'scale(1.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  {currentLevelObj?.badge_image_url ? (
                    <img
                      src={currentLevelObj.badge_image_url}
                      alt={getTranslatedLevelTitle(currentLevelObj) || 'Badge'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Trophy size={26} color="#16A34A" strokeWidth={2.4} />
                  )}
                </div>
              </div>

              {/* Level and Progress Bar strictly with live API values */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 6 }}>
                
                {/* Level Numbers & Titles Row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 8,
                }}>
                  {/* Current Level Info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '14.5px' }}>
                        {t('profile.level')} {user?.level ?? 1}{currentLevelObj ? `: ${getTranslatedLevelTitle(currentLevelObj)}` : ''}
                      </span>
                    </div>
                    {currentLevelObj?.slug && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#0284C7',
                          background: '#E0F2FE',
                          padding: '1px 7px',
                          borderRadius: 6,
                          border: '1px solid #BAE6FD',
                          fontFamily: 'monospace',
                        }}>
                          #{currentLevelObj.slug}
                        </span>
                        {currentLevelObj.required_xp > 0 && (
                          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B' }}>
                            • {currentLevelObj.required_xp} XP
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Target Next Level Info */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, textAlign: 'right' }}>
                    <span style={{ fontWeight: 700, color: '#64748B', fontSize: '13.5px' }}>
                      {nextLevelObj 
                        ? `${t('profile.level')} ${nextLevelObj.level_number}${nextLevelObj ? `: ${getTranslatedLevelTitle(nextLevelObj)}` : ''}`
                        : `${t('profile.level')} ${(user?.level ?? 1) + 1}`}
                    </span>
                    {nextLevelObj?.slug && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        {nextLevelObj.required_xp > 0 && (
                          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B' }}>
                            {nextLevelObj.required_xp} XP •
                          </span>
                        )}
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#64748B',
                          background: '#F1F5F9',
                          padding: '1px 7px',
                          borderRadius: 6,
                          border: '1px solid #E2E8F0',
                          fontFamily: 'monospace',
                        }}>
                          #{nextLevelObj.slug}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Track */}
                <div style={{
                  width: '100%',
                  height: 14,
                  background: '#E2E8F0',
                  borderRadius: 999,
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${xpProgressPercent}%`,
                    minWidth: xpProgressPercent > 0 ? 10 : 0,
                    background: 'linear-gradient(90deg, #22C55E 0%, #10B981 100%)',
                    borderRadius: 999,
                    transition: 'width 0.4s ease',
                    boxShadow: 'var(--shadow-sm)',
                  }} />
                </div>

                {/* Stats Bar underneath */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  paddingTop: 1,
                  flexWrap: 'wrap',
                  gap: 6,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 700, color: '#16A34A' }}>
                      {totalXP} XP
                    </span>
                    {nextTargetXp > 0 && (
                      <>
                        <span style={{ color: '#94A3B8' }}>/</span>
                        <span style={{ fontWeight: 700, color: '#64748B' }}>
                          {nextTargetXp} XP ({Math.round(xpProgressPercent)}%)
                        </span>
                      </>
                    )}
                  </div>

                  {xpRemaining > 0 && (
                    <span style={{
                      fontWeight: 700,
                      color: '#D97706',
                      background: '#FEF3C7',
                      padding: '2px 8px',
                      borderRadius: 8,
                      border: '1px solid #FDE68A',
                      fontSize: '11px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <Zap size={12} color="#D97706" />
                      +{xpRemaining} XP {t('profile.xpRemaining', 'keyingi darajagacha')}
                    </span>
                  )}
                </div>

                {/* Clickable link to open all levels modal only if API returned levels */}
                {levelsList.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setModalType('levels_guide')}
                    style={{
                      alignSelf: 'center',
                      marginTop: 3,
                      background: 'transparent',
                      border: 'none',
                      color: '#0284C7',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '3px 8px',
                      borderRadius: 8,
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#F0F9FF'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <Award size={14} />
                    <span>{t('profile.allLevels', 'Barcha darajalar jadvalini ko‘rish')} &gt;</span>
                  </button>
                )}
              </div>
            </div>

            {/* Info / Coins / Limits Top Info */}
            <div style={{
              display: 'flex',
              gap: 12,
              marginTop: 16,
              width: '100%',
            }}>
              {/* Tangalar card — clickable to buy coins */}
              <div
                onClick={() => onOpenStore && onOpenStore('coins')}
                title={t('pm.buyCoinsTitle')}
                style={{
                  flex: 1,
                  background: '#FFFFFF',
                  borderRadius: 18,
                  border: '1px solid #E2E8F0',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 0 #E2E8F0, 0 10px 20px rgba(245, 158, 11, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 0 #E2E8F0';
                }}
              >
                <div style={{ width: 42, height: 42, borderRadius: 12, background: '#FEF9C3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Coins size={24} color="#CA8A04" strokeWidth={2.4} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748B', marginBottom: 2 }}>
                    {t('profile.coins', 'Tangalar')}
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>{user?.coins || 0}</div>
                </div>
              </div>

              {/* Daily Limit Card (Strictly bound to API models.UserLimitStatusRes) */}
              {(() => {
                const isSub = Boolean(user?.has_subscription || localLimit?.has_subscription);
                const rem = localLimit?.remaining ?? 0;
                const tot = localLimit?.total ?? 0;
                const isExhausted = !isSub && rem === 0;

                return (
                  <div
                    id="profile-daily-limit-card"
                    onClick={() => {
                      if (isExhausted && onOpenStore) {
                        onOpenStore('coins');
                      }
                    }}
                    style={{
                      flex: 1,
                      background: isSub ? '#F0FDF4' : (rem > 0 ? '#FFFFFF' : '#FEF2F2'),
                      borderRadius: 18,
                      border: isSub ? '1px solid #86EFAC' : (rem > 0 ? '1px solid #E2E8F0' : '1px solid #FECACA'),
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      boxShadow: isSub ? '0 4px 0 #86EFAC' : (rem > 0 ? '0 4px 0 #E2E8F0' : '0 4px 0 #FCA5A5'),
                      cursor: isExhausted ? 'pointer' : 'default',
                      transition: 'all 0.15s ease',
                      minWidth: 0,
                    }}
                    title={isSub ? "Cheksiz PRO obuna faol" : `Kunlik bepul limit: ${rem}/${tot}`}
                  >
                    <div style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: isSub ? '#DCFCE7' : (rem > 0 ? '#DBEAFE' : '#FEE2E2'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {isSub ? (
                        <ShieldCheck size={24} color="#16A34A" strokeWidth={2.4} />
                      ) : (
                        <ShieldAlert size={24} color={rem > 0 ? "#2563EB" : "#DC2626"} strokeWidth={2.4} />
                      )}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748B', marginBottom: 2 }}>
                        {t('profile.dailyLimit', 'Kunlik limit')}
                      </div>
                      <div style={{
                        fontSize: isSub ? '17px' : '20px',
                        fontWeight: 700,
                        color: isSub ? '#16A34A' : (rem > 0 ? '#0F172A' : '#DC2626'),
                        lineHeight: 1.1
                      }}>
                        {isSub ? t('profile.unlimited', 'Cheksiz') : `${rem}/${tot}`}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: isSub ? '#15803D' : (rem > 0 ? '#64748B' : '#DC2626'),
                        marginTop: 2,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {isSub ? t('profile.proActive', 'PRO faol') : (rem > 0 ? `${rem} ${t('profile.remainingAttempts', 'ta qoldi')}` : t('profile.limitExhausted', 'Tugagan'))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Dedicated "Tanga sotib olish" Container */}
            <div
              id="btn-buy-coins-profile"
              onClick={() => onOpenStore && onOpenStore('coins')}
              style={{
                marginTop: 14,
                width: '100%',
                background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
                borderRadius: 18,
                border: '1px solid #FDE68A',
                boxShadow: 'var(--shadow-sm)',
                padding: '16px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxSizing: 'border-box',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 0 #F59E0B, 0 14px 28px rgba(245, 158, 11, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 0 #F59E0B, 0 10px 20px rgba(245, 158, 11, 0.12)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 46,
                  height: 46,
                  borderRadius: 15,
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: 'var(--shadow-sm)',
                  fontSize: '22px',
                  flexShrink: 0,
                }}>
                  🪙
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '15.5px', fontWeight: 700, color: '#92400E' }}>
                      {t('profile.coinTariffs', 'Tanga sotib olish')}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      background: '#FDE68A',
                      color: '#B45309',
                      padding: '2px 8px',
                      borderRadius: 99,
                      border: '1px solid #FCD34D',
                    }}>
                      {t('profile.popular', 'Ommabop')}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#B45309', fontWeight: 600, marginTop: 2 }}>
                    {t('profile.buyCoinsDesc', 'Klinik keyslar va simulyatsiyalar uchun tanga paketlari')}
                  </div>
                </div>
              </div>

              <div style={{
                width: 34,
                height: 34,
                borderRadius: 12,
                background: '#FFFFFF',
                border: '1px solid #FDE68A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D97706',
                flexShrink: 0,
              }}>
                <ChevronRight size={19} strokeWidth={2.5} />
              </div>
            </div>

            {/* Menu List */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 18,
              border: '1px solid #E2E8F0',
              boxShadow: 'var(--shadow-sm)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              marginTop: 18,
              marginBottom: 24,
            }}>
              <SettingsListItem
                icon={<Bookmark size={20} color="#0F172A" strokeWidth={2} />}
                label={t('fav.title', 'Saqlangan keyslar')}
                onClick={() => onNavigate && onNavigate('favorites')}
              />
              <Divider />
              <SettingsListItem
                icon={<ActivityIcon size={20} color="#0F172A" strokeWidth={2} />}
                label={t('settings.activity', 'Faollik')}
                onClick={() => onNavigate && onNavigate('activity')}
              />
              <Divider />
              <SettingsListItem
                icon={<Trophy size={20} color="#0F172A" strokeWidth={2} />}
                label={t('settings.rating', 'Reyting')}
                onClick={() => onNavigate && onNavigate('leaderboard')}
              />
              <Divider />
              <SettingsListItem
                icon={<CalendarDays size={20} color="#0F172A" strokeWidth={2} />}
                label={t('settings.studyPlan', "O'quv rejasi")}
                onClick={() => onNavigate && onNavigate('study_plan')}
              />
              <Divider />
              <SettingsListItem
                icon={<Bell size={20} color="#0F172A" strokeWidth={2} />}
                label={t('settings.notifications', 'Bildirishnomalar')}
                onClick={() => onNavigate && onNavigate('notifications')}
              />
              <Divider />
              <SettingsListItem
                icon={<Coins size={20} color="#D97706" strokeWidth={2} />}
                label={t('profile.coinTariffs', 'Tanga sotib olish')}
                onClick={() => onOpenStore && onOpenStore('coins')}
              />
              <Divider />
              <SettingsListItem
                icon={<Tag size={20} color="#0F172A" strokeWidth={2} />}
                label={t('settings.couponCode', 'Promokod')}
                onClick={() => setModalType('coupon')}
              />
              <Divider />
              <SettingsListItem
                icon={<Share2 size={20} color="#0F172A" strokeWidth={2} />}
                label={t('settings.referral', "Do'stlarni taklif qilish")}
                onClick={handleOpenReferral}
              />
            </div>

            {/* Settings Group 1: Ma'lumot, Qurilmalar, Ilova haqida */}
            <div id="profile-settings-group" style={{
              background: '#FFFFFF',
              borderRadius: 18,
              border: '1px solid #E2E8F0',
              boxShadow: 'var(--shadow-sm)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              marginBottom: 16,
            }}>
              <SettingsListItem
                icon={<Info size={20} color="#0F172A" strokeWidth={2} />}
                label={t('settings.info', "Ma'lumot")}
                subtitle={t('settings.infoDesc', "Profil va shaxsiy ma'lumotlar")}
                onClick={handleOpenProfileInfo}
              />
              <Divider />
              <SettingsListItem
                icon={<Info size={20} color="#0F172A" strokeWidth={2} />}
                label={t('settings.about', "Ilova haqida")}
                subtitle={t('settings.aboutDesc', "Versiya, FAQ va kontaktlar")}
                onClick={handleOpenAbout}
              />
            </div>

            {/* Settings Group 2: Language, Delete Account */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 18,
              border: '1px solid #E2E8F0',
              boxShadow: 'var(--shadow-sm)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              marginBottom: 16,
            }}>
              <SettingsListItem
                icon={<Globe size={20} color="#0F172A" strokeWidth={2} />}
                label={t('profile.language', "Language")}
                subtitle={getLanguageLabel()}
                onClick={() => setModalType('language')}
              />
              <Divider />
              <SettingsListItem
                icon={<Trash2 size={20} color="#EF4444" strokeWidth={2} />}
                label={t('settings.deleteAccount', "Delete Account")}
                labelColor="#EF4444"
                onClick={() => setModalType('delete')}
              />
            </div>

            {/* Logout button */}
            {onLogout && (
              <button
                id="btn-profile-logout"
                onClick={onLogout}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 18,
                  background: '#FEE2E2',
                  border: '1px solid #FCA5A5',
                  color: '#DC2626',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  marginBottom: 16,
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#FECACA'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#FEE2E2'; }}
              >
                <LogOut size={18} />
                {t('settings.logOut', 'Chiqish')}
              </button>
            )}

            {/* Footer App Version */}
            <div style={{
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: 600,
              color: '#94A3B8',
              paddingBottom: 36,
            }}>
              Medical Case App
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: SETTINGS SCREEN                                        */}
        {/* ============================================================== */}
        {currentScreen === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 16 }}>

            {/* Header: Back Arrow + Title */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              padding: '8px 4px 12px 4px',
            }}>
              <button
                id="btn-back-to-profile"
                onClick={() => setCurrentScreen('profile')}
                title={t('pm.backToProfile')}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#0F172A',
                }}
              >
                <ChevronLeft size={28} strokeWidth={2.4} />
              </button>

              <h1 style={{
                flex: 1,
                fontSize: '24px',
                fontWeight: 700,
                color: '#0F172A',
                letterSpacing: '-0.02em',
                margin: 0,
                textAlign: 'center',
                paddingRight: 40, // offset back button for optical center
              }}>
                {t('profile.settings')}
              </h1>
            </div>

            {/* Settings Menu List */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 18,
              border: '1px solid #E2E8F0',
              boxShadow: 'var(--shadow-sm)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              marginTop: 6,
            }}>
              <SettingsListItem
                icon={<Info size={20} color="#0F172A" strokeWidth={2} />}
                label={t('settings.info', "Ma'lumot")}
                subtitle={t('settings.infoDesc', "Profil va shaxsiy ma'lumotlar")}
                onClick={handleOpenProfileInfo}
              />
              <Divider />
              <SettingsListItem
                icon={<Info size={20} color="#0F172A" strokeWidth={2} />}
                label={t('settings.about', "Ilova haqida")}
                subtitle={t('settings.aboutDesc', "Versiya, FAQ va kontaktlar")}
                onClick={handleOpenAbout}
              />
            </div>

            <div style={{
              background: '#FFFFFF',
              borderRadius: 18,
              border: '1px solid #E2E8F0',
              boxShadow: 'var(--shadow-sm)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <SettingsListItem
                icon={<Globe size={20} color="#0F172A" strokeWidth={2} />}
                label={t('profile.language')}
                subtitle={getLanguageLabel()}
                onClick={() => setModalType('language')}
              />
              <Divider />
              <SettingsListItem
                icon={<Trash2 size={20} color="#EF4444" strokeWidth={2} />}
                label={t('settings.deleteAccount')}
                labelColor="#EF4444"
                onClick={() => setModalType('delete')}
              />
            </div>

            {/* Logout button */}
            {onLogout && (
              <button
                onClick={onLogout}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: 18,
                  background: '#FEE2E2',
                  border: '1px solid #FCA5A5',
                  color: '#DC2626',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <LogOut size={18} />
                {t('settings.logOut', 'Chiqish')}
              </button>
            )}

            {/* Footer App Version */}
            <div style={{
              textAlign: 'center',
              fontSize: '12px',
              fontWeight: 600,
              color: '#94A3B8',
              padding: '12px 0 24px 0',
            }}>
              Medical Case App
            </div>
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* SUB-MODALS                                                     */}
      {/* ============================================================== */}

      {/* 0A. Profile Info Modal */}
      {modalType === 'profile_info' && (
        <ModalOverlay onClose={() => setModalType(null)}>
          <ModalCard title={t('settings.info', "Ma'lumotlarim va Profil")} onClose={() => setModalType(null)} maxWidth={460}>
            <form onSubmit={handleSaveProfileInfo} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <UserAvatar name={profileForm.name || user?.name} src={profileForm.imagePreview} size={84} />
                <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', cursor: 'pointer' }}>
                  {profileForm.imagePreview ? t('profile.changePhoto', "Rasmni almashtirish") : t('profile.uploadPhoto', "Rasm yuklash")}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = '';
                      if (!file) return;
                      if (file.size > 5 * 1024 * 1024) {
                        showToast('⚠️ ' + t('pm.imgTooBig'));
                        return;
                      }
                      setProfileForm((prev) => ({ ...prev, imageFile: file, imagePreview: URL.createObjectURL(file) }));
                    }}
                  />
                </label>
              </div>

              {/* Readonly Badges Strip */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 8,
                padding: '10px 12px',
                background: '#F8FAFC',
                borderRadius: 16,
                border: '1px solid #E2E8F0',
                textAlign: 'center',
              }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>{t('profile.level', 'Daraja')}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>⭐ {user?.level || 1}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>XP</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>⚡ {user?.xp || 0}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>{t('profile.coins', 'Tangalar')}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#F59E0B' }}>🪙 {user?.coins || 0}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>{t('nav.streak', 'Streak')}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#EA580C' }}>🔥 {user?.streak_count || 0}d</div>
                </div>
              </div>

              {/* Ism Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                  {t('settings.yourName', 'Ism va familiya')}
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={t('pm.namePh')}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 14,
                    border: '1px solid #E2E8F0',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0F172A',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Telefon Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                  {t('auth.phoneLabel', 'Telefon raqam')}
                </label>
                <input
                  type="tel"
                  value={profileForm.phone_number}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, phone_number: e.target.value }))}
                  placeholder="+998901234567"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 14,
                    border: '1px solid #E2E8F0',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0F172A',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Email Field */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                  {t('auth.emailLabel', 'Elektron pochta (Email)')}
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="namuna@domain.uz"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 14,
                    border: '1px solid #E2E8F0',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0F172A',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Til Select */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                  {t('profile.language', 'Ilova tili')}
                </label>
                <select
                  value={profileForm.language}
                  onChange={(e) => {
                    const nextLang = e.target.value;
                    setProfileForm(prev => ({ ...prev, language: nextLang }));
                    if (setLang) setLang(nextLang);
                    if (onLangChange) onLangChange(nextLang);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 14,
                    border: '1px solid #E2E8F0',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0F172A',
                    boxSizing: 'border-box',
                    outline: 'none',
                    background: '#FFFFFF',
                  }}
                >
                  <option value="uz">🇺🇿 Oʻzbekcha</option>
                  <option value="ru">🇷🇺 Русский</option>
                  <option value="en">🇺🇸 English</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={saveLoading}
                style={{
                  width: '100%',
                  marginTop: 6,
                  padding: '14px',
                  borderRadius: 16,
                  background: '#16A34A',
                  border: '1px solid #16A34A',
                  boxShadow: 'var(--shadow-sm)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '15px',
                  cursor: saveLoading ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                {saveLoading ? <RefreshCw size={18} className="animate-spin" /> : <Check size={18} strokeWidth={3} />}
                {saveLoading ? t('studyPlan.saving', 'Saqlanmoqda...') : t('profile.saveChanges', "O'zgarishlarni saqlash")}
              </button>
            </form>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* 0C. About App Modal */}
      {modalType === 'about' && (
        <ModalOverlay onClose={() => setModalType(null)}>
          <ModalCard title={t('pm.aboutTitle')} onClose={() => setModalType(null)} maxWidth={480}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Brand Header */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '16px 12px',
                background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                borderRadius: 16,
                border: '1px solid #BBF7D0',
              }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 18,
                  background: '#16A34A',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)',
                  marginBottom: 10,
                }}>
                  <Sparkles size={28} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>
                  TibStation AI Medical Simulator
                </h3>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '3px 10px',
                  borderRadius: 16,
                  background: '#FFFFFF',
                  border: '1px solid #86EFAC',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#15803D',
                  marginBottom: 6,
                }}>
                  {appRoute?.app_version?.android ? `Versiya: ${appRoute.app_version.android}` : ''}
                </div>
                <p style={{ fontSize: '13px', color: '#475569', margin: 0, maxWidth: 320 }}>
                  Tibbiyot talabalari va amaliyotchi shifokorlar uchun interaktiv klinik vaziyatlar simulyatori.
                </p>
              </div>

              {/* Loading State */}
              {aboutLoading && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 20, color: '#16A34A' }}>
                  <RefreshCw size={24} className="animate-spin" />
                </div>
              )}

              {/* Biz haqimizda items from API */}
              {!aboutLoading && aboutList.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                    Biz haqimizda
                  </h4>
                  {aboutList.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      style={{
                        padding: '14px',
                        background: '#F8FAFC',
                        borderRadius: 16,
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px 0' }}>
                        {item.title}
                      </h5>
                      <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                        {item.description}
                      </p>
                      {item.link_url && (
                        <a
                          href={item.link_url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            marginTop: 8,
                            fontSize: '12px',
                            fontWeight: 700,
                            color: '#2563EB',
                            textDecoration: 'none',
                          }}
                        >
                          Batafsil <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Support & Call Center */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  Aloqa va Qo'llab-quvvatlash
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {appRoute?.call_center && (
                  <a
                    href={`tel:${appRoute.call_center}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      padding: '12px',
                      borderRadius: 14,
                      background: '#F0FDF4',
                      border: '1px solid #BBF7D0',
                      color: '#15803D',
                      fontWeight: 700,
                      fontSize: '13px',
                      textDecoration: 'none',
                    }}
                  >
                    <Phone size={16} />
                    Call-center
                  </a>
                  )}

                  {appRoute?.support_url && (
                  <a
                    href={appRoute.support_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      padding: '12px',
                      borderRadius: 14,
                      background: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      color: '#2563EB',
                      fontWeight: 700,
                      fontSize: '13px',
                      textDecoration: 'none',
                    }}
                  >
                    <MessageCircle size={16} />
                    Yordam
                  </a>
                  )}
                </div>

                {/* Additional contacts list if available */}
                {contactList.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                    {contactList.map((c, cIdx) => (
                      <div
                        key={c.id || cIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          background: '#F8FAFC',
                          borderRadius: 12,
                          border: '1px solid #E2E8F0',
                          fontSize: '13px',
                        }}
                      >
                        <span style={{ fontWeight: 700, color: '#0F172A' }}>{c.name}</span>
                        {c.phone_number && (
                          <a href={`tel:${c.phone_number}`} style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>
                            {c.phone_number}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* FAQ Accordion */}
              {faqList.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <HelpCircle size={16} color="#2563EB" /> Tez-tez beriladigan savollar
                  </h4>
                  {faqList.map((faq, fIdx) => (
                    <div
                      key={faq.id || fIdx}
                      onClick={() => setExpandedFaq(expandedFaq === fIdx ? null : fIdx)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 14,
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                          {faq.question}
                        </span>
                        {expandedFaq === fIdx ? <ChevronUp size={16} color="#64748B" /> : <ChevronDown size={16} color="#64748B" />}
                      </div>
                      {expandedFaq === fIdx && (
                        <p style={{ fontSize: '13px', color: '#475569', marginTop: 8, marginBottom: 0, lineHeight: 1.5 }}>
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* 1. Change Username Modal */}
      {modalType === 'username' && (
        <ModalOverlay onClose={() => setModalType(null)}>
          <ModalCard title={t('pm.usernameTitle')} onClose={() => setModalType(null)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#64748B' }}>
                {t('pm.usernameLabel')}
              </label>
              <input
                type="text"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                placeholder={t('pm.usernamePh')}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 14,
                  border: '1px solid #E2E8F0',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#0F172A',
                  boxSizing: 'border-box',
                }}
              />
              <button
                onClick={handleSaveUsername}
                style={{
                  padding: '12px',
                  borderRadius: 14,
                  background: '#16A34A',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {saveLoading ? '...' : t('settings.save')}
              </button>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* Referral Modal */}
      {modalType === 'referral' && (
        <ModalOverlay onClose={() => setModalType(null)}>
          <ModalCard title={t('settings.referral', "Do'stlarni taklif qilish")} onClose={() => setModalType(null)}>
            {referralLoading ? (
              <p style={{ textAlign: 'center', color: '#64748B', fontSize: '14px', margin: 0 }}>...</p>
            ) : referralError ? (
              <p style={{ textAlign: 'center', color: '#DC2626', fontSize: '14px', fontWeight: 600, margin: 0 }}>{referralError}</p>
            ) : referral ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {(referral.referrer_reward != null || referral.referred_reward != null) && (
                  <p style={{ fontSize: '13px', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
                    {referral.referrer_reward != null && `Har bir taklif uchun siz +${referral.referrer_reward} tanga olasiz. `}
                    {referral.referred_reward != null && `Taklif qilingan do'stingiz +${referral.referred_reward} tanga oladi.`}
                  </p>
                )}

                <div style={{
                  padding: '14px',
                  borderRadius: 16,
                  background: '#F0FDF4',
                  border: '2px dashed #86EFAC',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', marginBottom: 4 }}>
                    {t('auth.referralLabel', 'Taklif kodi')}
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '0.12em', color: '#15803D', wordBreak: 'break-all' }}>
                    {referral.referral_code || '--'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={handleCopyReferral}
                    disabled={!referral.referral_code}
                    style={{
                      flex: 1, minHeight: 48, borderRadius: 14, border: '1px solid #E2E8F0', background: '#FFFFFF',
                      color: '#0F172A', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}
                  >
                    <Copy size={15} /> {copiedReferral ? 'Nusxalandi!' : 'Nusxa olish'}
                  </button>
                  <button
                    type="button"
                    onClick={handleShareReferral}
                    disabled={!referral.referral_code}
                    style={{
                      flex: 1, minHeight: 48, borderRadius: 14, border: 'none',
                      background: '#16A34A', color: '#fff',
                      fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}
                  >
                    <Share2 size={15} /> Ulashish
                  </button>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1, padding: 12, borderRadius: 14, background: '#F8FAFC', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A' }}>{referral.invited_count ?? 0}</div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>{t('pm.invited')}</div>
                  </div>
                  <div style={{ flex: 1, padding: 12, borderRadius: 14, background: '#FFFBEB', border: '1px solid #FDE68A', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 700, color: '#B45309' }}>{referral.total_coins_earned ?? 0}</div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>{t('pm.coinsEarned')}</div>
                  </div>
                </div>

                {Array.isArray(referral.invited) && referral.invited.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto' }}>
                    {referral.invited.map((item, idx) => (
                      <div key={idx} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
                        padding: '10px 12px', borderRadius: 12, background: '#FFFFFF', border: '1px solid #E2E8F0',
                      }}>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                          {item.joined_at && (
                            <div style={{ fontSize: '11px', color: '#94A3B8' }}>{new Date(item.joined_at).toLocaleDateString()}</div>
                          )}
                        </div>
                        {item.coins_given != null && (
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#B45309', flexShrink: 0 }}>+{item.coins_given}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '13px', margin: 0 }}>
                    Hozircha hech kim taklif qilinmagan
                  </p>
                )}
              </div>
            ) : null}
          </ModalCard>
        </ModalOverlay>
      )}

      {/* 2. Coupon Code Modal */}
      {modalType === 'coupon' && (
        <ModalOverlay onClose={() => setModalType(null)}>
          <ModalCard title={t('pm.couponTitle')} onClose={() => setModalType(null)}>
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                {t('pm.couponDesc')}
              </p>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder={t('pm.couponPh')}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 14,
                  border: '1px solid #E2E8F0',
                  fontSize: '15px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#0F172A',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '12px',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {promoLoading ? '...' : t('store.activate')}
              </button>
            </form>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* 3. Language Selection Modal */}
      {modalType === 'language' && (
        <ModalOverlay onClose={() => setModalType(null)}>
          <ModalCard title={t('profile.selectLanguage')} onClose={() => setModalType(null)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { code: 'uz', flag: '🇺🇿', label: 'Oʻzbekcha' },
                { code: 'ru', flag: '🇷🇺', label: 'Русский' },
                { code: 'en', flag: '🇺🇸', label: 'English' }
              ].map((item) => (
                <button
                  key={item.code}
                  onClick={() => {
                    setLang(item.code);
                    if (onLangChange) onLangChange(item.code);
                    setModalType(null);
                    showToast(item.code === 'uz' ? "Til o'zgartirildi: O'ZBEKCHA" : (item.code === 'ru' ? "Язык изменен: РУССКИЙ" : `Language changed to ${item.label}`));
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderRadius: 16,
                    border: lang === item.code ? '1px solid #22C55E' : '1px solid #E2E8F0',
                    background: lang === item.code ? '#F0FDF4' : '#FFFFFF',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '15px',
                    color: '#0F172A',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: '20px' }}>{item.flag}</span>
                    <span>{item.label}</span>
                  </span>
                  {lang === item.code && <Check size={20} color="#16A34A" strokeWidth={3} />}
                </button>
              ))}
            </div>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* 4. Rate Us Modal */}
      {modalType === 'rate' && (
        <ModalOverlay onClose={() => setModalType(null)}>
          <ModalCard title={t('pm.rateTitle')} onClose={() => setModalType(null)}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
                {t('pm.rateQuestion')}
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setUserRating(star)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                  >
                    <Star
                      size={32}
                      color="#F59E0B"
                      fill={star <= userRating ? '#F59E0B' : 'transparent'}
                      strokeWidth={2}
                    />
                  </button>
                ))}
              </div>
              <button
                onClick={() => {
                  setModalType(null);
                  showToast('❤️ ' + t('pm.rateThanks'));
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 14,
                  background: '#16A34A',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {t('pm.rateSubmit')}
              </button>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* 5. Feedback Modal */}
      {modalType === 'feedback' && (
        <ModalOverlay onClose={() => setModalType(null)}>
          <ModalCard title={t('pm.feedbackTitle')} onClose={() => setModalType(null)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                {t('pm.feedbackDesc')}
              </p>
              <textarea
                rows={4}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder={t('pm.feedbackPh')}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 14,
                  border: '1px solid #E2E8F0',
                  fontSize: '14px',
                  color: '#0F172A',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  resize: 'none',
                }}
              />
              <button
                onClick={() => {
                  if (!feedbackText.trim()) return;
                  setModalType(null);
                  setFeedbackText('');
                  showToast(t('pm.feedbackSent'));
                }}
                style={{
                  padding: '12px',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                {t('pm.feedbackTitle')}
              </button>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* 6. Terms of Use */}
      {modalType === 'terms' && (
        <ModalOverlay onClose={() => setModalType(null)}>
          <ModalCard title={t('pm.termsTitle')} onClose={() => setModalType(null)}>
            <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, maxHeight: 300, overflowY: 'auto' }}>
              <p>
                <strong>{t('pm.terms1h')}</strong> {t('pm.terms1')}
              </p>
              <p>
                <strong>{t('pm.terms2h')}</strong> {t('pm.terms2')}
              </p>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* 7. Privacy Policy */}
      {modalType === 'privacy' && (
        <ModalOverlay onClose={() => setModalType(null)}>
          <ModalCard title={t('pm.privacyTitle')} onClose={() => setModalType(null)}>
            <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, maxHeight: 300, overflowY: 'auto' }}>
              <p>
                <strong>{t('pm.privacyH')}</strong> {t('pm.privacy')}
              </p>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* 8. Delete Account Confirmation */}
      {modalType === 'delete' && (
        <ModalOverlay onClose={() => setModalType(null)}>
          <ModalCard title={t('pm.deleteTitle')} onClose={() => setModalType(null)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'center' }}>
              <div style={{ color: '#EF4444', display: 'flex', justifyContent: 'center' }}>
                <AlertCircle size={44} />
              </div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#334155', margin: 0 }}>
                {t('settings.deleteWarning')}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
                <button
                  onClick={() => setModalType(null)}
                  style={{
                    padding: '12px',
                    borderRadius: 14,
                    background: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    color: '#475569',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {t('settings.cancel')}
                </button>
                <button
                  onClick={async () => {
                    setDeleteLoading(true);
                    try {
                      await api.deleteProfile();
                    } catch { /* ignore */ }
                    setDeleteLoading(false);
                    setModalType(null);
                    if (onLogout) onLogout();
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: 14,
                    background: '#EF4444',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {deleteLoading ? '...' : t('settings.deleteBtn')}
                </button>
              </div>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* 9. Levels Guide Modal (Strictly API data) */}
      {modalType === 'levels_guide' && (
        <ModalOverlay onClose={() => setModalType(null)}>
          <ModalCard title={t('profile.levelsTableTitle', 'Klinik Darajalar Tizimi')} onClose={() => setModalType(null)} maxWidth={480}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: '65vh', overflowY: 'auto', paddingRight: 4 }}>
              {loadingLevels ? (
                <div style={{ textAlign: 'center', padding: '30px 16px', color: '#16A34A', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                  <RefreshCw size={24} className="animate-spin" />
                  <span style={{ fontSize: '13px', fontWeight: 700 }}>{t('pm.levelsLoading')}</span>
                </div>
              ) : levelsList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px 16px', color: '#64748B' }}>
                  <Award size={36} style={{ opacity: 0.4, marginBottom: 10 }} />
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '15px', color: '#0F172A' }}>
                    {t('pm.levelsEmpty')}
                  </p>
                  <p style={{ margin: '6px 0 0 0', fontSize: '13px' }}>
                    API orqali hozircha darajalar ro'yxati taqdim etilmagan.
                  </p>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 6px 0', lineHeight: 1.5 }}>
                    Klinik keyslar yechish va debriefing tahlillaridan yuqori ball olish orqali XP to'plang va yangi darajalarga erishing:
                  </p>

                  {levelsList.map((lvl) => {
                    const isCurrent = Number(lvl.level_number) === Number(user?.level || 1);
                    const isPassed = totalXP >= (lvl.required_xp || 0);

                    return (
                      <div
                        key={lvl.id || lvl.level_number}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 14px',
                          borderRadius: 16,
                          background: isCurrent ? '#F0FDF4' : '#F8FAFC',
                          border: isCurrent ? '1px solid #22C55E' : '1px solid #E2E8F0',
                          boxShadow: isCurrent ? '0 4px 12px rgba(34, 197, 94, 0.15)' : 'none',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 38,
                            height: 38,
                            borderRadius: 12,
                            background: isCurrent ? '#22C55E' : (isPassed ? '#DCFCE7' : '#E2E8F0'),
                            color: isCurrent ? '#FFFFFF' : (isPassed ? '#16A34A' : '#64748B'),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '14px',
                            flexShrink: 0,
                          }}>
                            {lvl.level_number}
                          </div>

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>
                                {getTranslatedLevelTitle(lvl) || `${t('profile.level')} ${lvl.level_number}`}
                              </span>
                              {isCurrent && (
                                <span style={{
                                  fontSize: '10px',
                                  fontWeight: 700,
                                  color: '#15803D',
                                  background: '#DCFCE7',
                                  padding: '2px 6px',
                                  borderRadius: 6,
                                  border: '1px solid #86EFAC',
                                }}>
                                  {t('profile.currentLevelBadge', 'Sizda')}
                                </span>
                              )}
                            </div>
                            {lvl.slug && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                                <span style={{
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  color: '#0284C7',
                                  fontFamily: 'monospace',
                                }}>
                                  #{lvl.slug}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{
                            fontSize: '13px',
                            fontWeight: 700,
                            color: isPassed ? '#16A34A' : '#64748B',
                          }}>
                            {lvl.required_xp || 0} XP
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          background: '#0F172A',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: 14,
          fontSize: '13px',
          fontWeight: 700,
          boxShadow: 'var(--shadow-sm)',
          zIndex: 999,
          animation: 'fadeIn 0.2s ease-out',
        }}>
          {toastMessage}
        </div>
      )}

    </div>
  );
}

// -------------------------------------------------------------
// Helper subcomponents for clean Settings rows
// -------------------------------------------------------------

function SettingsListItem({ icon, label, subtitle, labelColor = 'var(--text-primary)', onClick }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick?.(); }}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 52, padding: '10px 16px', cursor: 'pointer', gap: 12 }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-muted)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
        <div style={{ width: 24, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: labelColor }}>{label}</div>
          {subtitle && <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</div>}
        </div>
      </div>
      <ChevronRight size={18} color="var(--text-muted)" strokeWidth={2} />
    </div>
  );
}

function Divider() {
  return (
    <div style={{ height: 1, background: '#F1F5F9', marginLeft: 58 }} />
  );
}

function ModalOverlay({ children, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        zIndex: 900,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      {children}
    </div>
  );
}

function ModalCard({ title, children, onClose, maxWidth = 420 }) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: '100%',
        maxWidth,
        maxHeight: '88vh',
        overflowY: 'auto',
        background: '#FFFFFF',
        borderRadius: 18,
        border: '1px solid #E2E8F0',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        padding: '22px 20px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: 0 }}>
          {title}
        </h3>
        <button
          onClick={onClose}
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: '#F1F5F9',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748B',
          }}
        >
          <X size={18} />
        </button>
      </div>

      {children}
    </div>
  );
}
