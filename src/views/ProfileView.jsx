import React, { useState, useEffect, useRef } from 'react';
import UserAvatar from '../components/common/UserAvatar';
import { api, formatApiError, peekLevels, resolveMediaUrl, walletSpendable } from '../api';
import { openExternalUrl } from '../utils/openUrl';
import Skeleton from '../components/common/Skeleton.jsx';
import StoreTariffs from './StoreTariffs.jsx';
import {
  Trophy,
  ChevronLeft,
  ChevronRight,
  Globe,
  Trash2,
  Award,
  Star,
  Check,
  X,
  Send,
  AlertCircle,
  Coins,
  ShieldAlert,
  ShieldCheck,
  Info,
  LogOut,
  CalendarDays,
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
  wallet,
  userLimit,
  levels: levelsFromApp = [],
  onRefreshLimit,
  onUserUpdate,
  onOpenStore,
  onNavigate,
  onLangChange,
  onLogout,
  tariffs = [],
}) {
  const { t, lang: appLang, setLang } = useTranslation();
  const lang = appLang || 'uz';
  const [currentScreen, setCurrentScreen] = useState('profile'); // 'profile' | 'settings'
  const [coinsOpen, setCoinsOpen] = useState(false);
  const coinsSectionRef = useRef(null);

  const openCoinsDropdown = () => {
    setCoinsOpen(true);
    requestAnimationFrame(() => {
      coinsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  };
  const [activeTab, setActiveTab] = useState('completed'); // 'completed' | 'ongoing'
  const [levelsList, setLevelsList] = useState(() => {
    if (Array.isArray(levelsFromApp) && levelsFromApp.length) return levelsFromApp;
    const cached = peekLevels();
    return Array.isArray(cached) && cached.length ? cached : [];
  });
  const [loadingLevels, setLoadingLevels] = useState(() => !((levelsFromApp && levelsFromApp.length) || peekLevels()?.length));
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
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (Array.isArray(levelsFromApp) && levelsFromApp.length) {
      setLevelsList(levelsFromApp);
      setLoadingLevels(false);
    }
  }, [levelsFromApp]);

  // Levels must not wait on simulation history (completed is ~1s).
  useEffect(() => {
    let mounted = true;
    if (!(levelsFromApp && levelsFromApp.length)) setLoadingLevels(true);
    api.getLevels()
      .then((freshLevels) => {
        if (mounted && Array.isArray(freshLevels) && freshLevels.length > 0) {
          setLevelsList(freshLevels);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoadingLevels(false);
      });
    return () => { mounted = false; };
  }, []);

  // Load completed/ongoing simulations and real daily limit from API
  useEffect(() => {
    let mounted = true;
    setLoadingSessions(true);
    Promise.all([
      api.getCompletedSimulations().catch(() => ({ sessions: [], count: 0 })),
      api.getOngoingSimulations().catch(() => ({ sessions: [], count: 0 })),
      api.getUserLimit().catch(() => null),
    ]).then(([comp, ong, freshLimit]) => {
      if (mounted) {
        setCompletedSessions(comp?.sessions || []);
        setOngoingSessions(ong?.sessions || []);
        if (freshLimit) {
          setLocalLimit(freshLimit);
          if (onRefreshLimit) onRefreshLimit();
        }
      }
    }).finally(() => {
      if (mounted) setLoadingSessions(false);
    });
    return () => { mounted = false; };
  }, []);

  // Sub-modals for Settings
  const [modalType, setModalType] = useState(null); // 'profile_info' | 'about' | 'username' | 'coupon' | 'referral' | 'language' | 'rate' | 'terms' | 'privacy' | 'delete' | 'levels_guide'
  const [tempUsername, setTempUsername] = useState(user?.name || '');
  const [emailCode, setEmailCode] = useState('');
  const [linkBusy, setLinkBusy] = useState(false);
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

  const refreshProfile = async () => {
    const fresh = await api.getUserProfile().catch(() => null);
    if (fresh) {
      if (onUserUpdate) onUserUpdate(fresh);
      setProfileForm((prev) => ({
        ...prev,
        phone_number: fresh.phone_number || '',
        email: fresh.email || '',
        name: fresh.name || prev.name,
      }));
    }
    return fresh;
  };

  const handleLinkPhone = async () => {
    setLinkBusy(true);
    try {
      const res = await api.startPhoneLink();
      if (res?.bot_url) openExternalUrl(res.bot_url);
      const token = res?.token;
      const deadline = Date.now() + (Number(res?.expires_in) || 300) * 1000;
      showToast(t('profile.linkPhoneWait', 'Telegram botida tasdiqlang'));
      while (Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, 2000));
        const check = await api.confirmPhoneLink(token).catch(() => null);
        if (check?.status === 'confirmed') {
          await refreshProfile();
          showToast(t('profile.linked', 'Ulandi'));
          return;
        }
      }
    } catch (err) {
      showToast(formatApiError(err, t));
    } finally {
      setLinkBusy(false);
    }
  };

  const handleUnlinkPhone = async () => {
    setLinkBusy(true);
    try {
      await api.unlinkPhone();
      await refreshProfile();
      showToast(t('profile.unlinked', 'Uzildi'));
    } catch (err) {
      showToast(formatApiError(err, t));
    } finally {
      setLinkBusy(false);
    }
  };

  const handleSendEmailCode = async () => {
    if (!profileForm.email.trim()) return;
    setLinkBusy(true);
    try {
      await api.sendEmailLink(profileForm.email.trim());
      showToast(t('auth.resendSuccess'));
    } catch (err) {
      showToast(formatApiError(err, t));
    } finally {
      setLinkBusy(false);
    }
  };

  const handleConfirmEmail = async () => {
    if (!profileForm.email.trim() || !emailCode.trim()) return;
    setLinkBusy(true);
    try {
      await api.confirmEmailLink(profileForm.email.trim(), emailCode.trim());
      setEmailCode('');
      await refreshProfile();
      showToast(t('profile.linked', 'Ulandi'));
    } catch (err) {
      showToast(formatApiError(err, t));
    } finally {
      setLinkBusy(false);
    }
  };

  const handleUnlinkEmail = async () => {
    setLinkBusy(true);
    try {
      await api.unlinkEmail();
      await refreshProfile();
      showToast(t('profile.unlinked', 'Uzildi'));
    } catch (err) {
      showToast(formatApiError(err, t));
    } finally {
      setLinkBusy(false);
    }
  };

  // 3. About App State & Handlers
  const [aboutList, setAboutList] = useState([]);
  const [appRoute, setAppRoute] = useState(null);
  const [contactList, setContactList] = useState([]);
  const [faqList, setFaqList] = useState([]);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleOpenAbout = () => {
    setModalType('about');
    Promise.all([
      api.getAbout().catch(() => []),
      api.getAppRoutes().catch(() => null),
      api.getContacts().catch(() => []),
      api.getFaqs().catch(() => []),
    ]).then(([abouts, routes, contacts, faqs]) => {
      setAboutList(Array.isArray(abouts) ? abouts : []);
      setAppRoute(Array.isArray(routes) ? (routes[0] || null) : null);
      setContactList(Array.isArray(contacts) ? contacts : []);
      setFaqList(Array.isArray(faqs) ? faqs : []);
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

  // XP & Level: live catalog may skip numbers (e.g. 1, 4, 5). Next = next existing row.
  const totalXP = Number(user?.xp) || 0;
  const userLevelNum = Number(user?.level) || 1;
  const sortedLevels = Array.isArray(levelsList)
    ? [...levelsList].sort((a, b) => Number(a.level_number) - Number(b.level_number))
    : [];

  const currentLevelObj = sortedLevels.find((l) => Number(l.level_number) === userLevelNum)
    || [...sortedLevels].reverse().find((l) => totalXP >= Number(l.required_xp || 0))
    || sortedLevels[0]
    || null;
  const currentIdx = currentLevelObj
    ? sortedLevels.findIndex((l) => Number(l.level_number) === Number(currentLevelObj.level_number))
    : -1;
  const prevLevelObj = currentIdx > 0 ? sortedLevels[currentIdx - 1] : null;
  const nextLevelObj = currentIdx >= 0 ? (sortedLevels[currentIdx + 1] || null) : null;

  const currentReqXp = Number(currentLevelObj?.required_xp || 0);
  const nextReqXp = nextLevelObj != null ? Number(nextLevelObj.required_xp || 0) : null;
  // Starting rank is granted immediately (user.level=1 with XP below required_xp).
  const currMinXp = prevLevelObj ? currentReqXp : 0;
  const nextTargetXp = nextReqXp != null && nextReqXp > currMinXp
    ? nextReqXp
    : (currentReqXp > totalXP ? currentReqXp : null);
  const xpSpan = nextTargetXp != null ? Math.max(1, nextTargetXp - currMinXp) : 1;
  const xpInCurrentLevel = Math.max(0, totalXP - currMinXp);
  const xpRemaining = nextTargetXp != null ? Math.max(0, nextTargetXp - totalXP) : 0;
  const xpProgressPercent = nextTargetXp == null
    ? (currentLevelObj ? 100 : 0)
    : Math.min(100, Math.max(0, (xpInCurrentLevel / xpSpan) * 100));
  const displayLevelNum = Number(currentLevelObj?.level_number) || userLevelNum;

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
    if (slug === 'doctor' || raw.includes('doktor') || raw.includes('shifokor') || raw.includes('врач')) return t('level.doctor', lvl.title || 'Shifokor');
    if (slug === 'specialist' || raw.includes('mutaxassis') || raw.includes('специалист')) return t('level.specialist', lvl.title || 'Mutaxassis');
    if (slug === 'expert' || raw.includes('ekspert') || raw.includes('эксперт')) return t('level.expert', lvl.title || 'Ekspert');
    if (slug === 'master' || slug === 'professor' || raw.includes('professor') || raw.includes('профессор')) return t('level.master', lvl.title || 'Professor');
    return lvl.title || '';
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
      background: 'var(--bg-main)',
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

            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 4px 18px 4px',
            }}>
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
                    margin: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {user?.name || ''}
                  </h2>
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
                      src={resolveMediaUrl(currentLevelObj.badge_image_url)}
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
                    {loadingLevels && !currentLevelObj ? (
                      <Skeleton width={160} height={16} radius={8} />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '14.5px' }}>
                          {t('profile.level')} {displayLevelNum}{currentLevelObj ? `: ${getTranslatedLevelTitle(currentLevelObj)}` : ''}
                        </span>
                      </div>
                    )}
                    <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B' }}>
                      {totalXP} XP
                    </span>
                  </div>

                  {/* Target Next Level Info — only a real catalog row, never level+1 guess */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, textAlign: 'right' }}>
                    {loadingLevels && !nextLevelObj ? (
                      <Skeleton width={130} height={16} radius={8} />
                    ) : nextLevelObj ? (
                      <>
                        <span style={{ fontWeight: 700, color: '#64748B', fontSize: '13.5px' }}>
                          {t('profile.level')} {nextLevelObj.level_number}{getTranslatedLevelTitle(nextLevelObj) ? `: ${getTranslatedLevelTitle(nextLevelObj)}` : ''}
                        </span>
                        {nextTargetXp != null && (
                          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B' }}>
                            {nextTargetXp} XP
                          </span>
                        )}
                      </>
                    ) : (
                      <span style={{ fontWeight: 700, color: '#64748B', fontSize: '13.5px' }}>
                        {t('profile.maxLevel', 'Maksimal daraja')}
                      </span>
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
                    {!loadingLevels && nextTargetXp != null && (
                      <>
                        <span style={{ color: '#94A3B8' }}>/</span>
                        <span style={{ fontWeight: 700, color: '#64748B' }}>
                          {nextTargetXp} XP ({Math.round(xpProgressPercent)}%)
                        </span>
                      </>
                    )}
                  </div>

                  {!loadingLevels && xpRemaining > 0 && (
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
                onClick={openCoinsDropdown}
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
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>
                    {wallet?.has_subscription
                      ? t('profile.unlimited', 'Cheksiz')
                      : (wallet ? walletSpendable(wallet) : (user?.coins || 0))}
                  </div>
                  {wallet && !wallet.has_subscription && (
                    <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, marginTop: 4 }}>
                      {t('home.walletFree', 'Bepul')}: {wallet.free_coins_left ?? 0} · {t('home.walletPaid', 'Balans')}: {wallet.coins ?? 0}
                    </div>
                  )}
                </div>
              </div>

              {/* Daily free coins from GET /mobile/practice/wallet */}
              {(() => {
                const isSub = Boolean(user?.has_subscription || wallet?.has_subscription || localLimit?.has_subscription);
                const rem = Number(wallet?.free_coins_left ?? 0);
                const tot = Number(wallet?.daily_free_coins ?? 0);
                const isExhausted = !isSub && rem === 0;

                return (
                  <div
                    id="profile-daily-limit-card"
                    onClick={() => {
                      if (isExhausted) openCoinsDropdown();
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
                    title={isSub ? t('profile.proActive', 'PRO faol') : `${t('home.walletFree', 'Bugungi bepul tanga')}: ${rem}/${tot}`}
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
                        {isSub ? t('profile.proActive', 'PRO faol') : (rem > 0 ? `${rem} ${t('profile.remainingCoins', 'tanga qoldi')}` : t('profile.limitExhausted', 'Tugagan'))}
                      </div>
                    </div>
                  </div>
                );
              })()}
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
              {/* Highlighted: Tanga sotib olish — dropdown, not a separate page */}
              <div ref={coinsSectionRef}>
              <div
                id="btn-buy-coins-profile"
                role="button"
                tabIndex={0}
                aria-expanded={coinsOpen}
                onClick={() => setCoinsOpen((open) => !open)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCoinsOpen((open) => !open); } }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '16px 18px',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
                  borderBottom: '1px solid #FDE68A',
                  transition: 'filter 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.filter = 'brightness(0.97)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: 13, flexShrink: 0,
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                  color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Coins size={22} strokeWidth={2.2} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '15.5px', fontWeight: 800, color: '#92400E' }}>
                      {t('profile.coinTariffs', 'Tanga sotib olish')}
                    </span>
                    <span style={{
                      fontSize: '10px', fontWeight: 800, color: '#FFFFFF', background: '#EA580C',
                      padding: '2px 8px', borderRadius: 99, letterSpacing: 0.3,
                    }}>
                      {t('profile.popular', 'Ommabop')}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#B45309', fontWeight: 600, marginTop: 2 }}>
                    {t('profile.buyCoinsDesc', 'Klinik keyslar va simulyatsiyalar uchun tanga paketlari')}
                  </div>
                </div>
                <ChevronDown
                  size={20}
                  strokeWidth={2.6}
                  color="#D97706"
                  style={{ transform: coinsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', flexShrink: 0 }}
                />
              </div>
              {coinsOpen && (
                <div style={{
                  padding: '12px',
                  background: '#FFFBEB',
                  borderBottom: '1px solid #FDE68A',
                }}>
                  <StoreTariffs
                    variant="inline"
                    tariffs={tariffs}
                    user={user}
                    userLimit={userLimit}
                    wallet={wallet}
                    onUserUpdate={onUserUpdate}
                  />
                </div>
              )}
              </div>
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
            </div>

            {/* Settings Group 1: Ma'lumot, Ilova haqida */}
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
                label={t('settings.info', "Profil ma'lumoti")}
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
                label={t('settings.info', "Profil ma'lumoti")}
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
          <ModalCard title={t('settings.info', "Profil ma'lumoti")} onClose={() => setModalType(null)} maxWidth={460}>
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
                  readOnly
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
                    background: '#F8FAFC',
                  }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" className="ui-btn" disabled={linkBusy} onClick={handleLinkPhone}>
                    {t('profile.linkPhone', 'Telegram orqali ulash')}
                  </button>
                  {profileForm.phone_number && (
                    <button type="button" className="ui-btn" disabled={linkBusy} onClick={handleUnlinkPhone}>
                      {t('profile.unlink', 'Uzish')}
                    </button>
                  )}
                </div>
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
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button type="button" className="ui-btn" disabled={linkBusy} onClick={handleSendEmailCode}>
                    {t('profile.emailCode', 'Kod yuborish')}
                  </button>
                  {user?.email && (
                    <button type="button" className="ui-btn" disabled={linkBusy} onClick={handleUnlinkEmail}>
                      {t('profile.unlink', 'Uzish')}
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value)}
                  placeholder={t('profile.confirmEmail', 'Email kodi')}
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
                <button type="button" className="ui-btn ui-btn-primary" disabled={linkBusy || !emailCode.trim()} onClick={handleConfirmEmail}>
                  {t('auth.confirm', 'Tasdiqlash')}
                </button>
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
            <AboutAppBody
              t={t}
              appRoute={appRoute}
              aboutList={aboutList}
              contactList={contactList}
              faqList={faqList}
              expandedFaq={expandedFaq}
              setExpandedFaq={setExpandedFaq}
            />
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
              {levelsList.length === 0 && !loadingLevels ? (
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

                  {sortedLevels.map((lvl) => {
                    const isCurrent = Number(lvl.level_number) === displayLevelNum;
                    const isFirst = Number(lvl.level_number) === Number(sortedLevels[0]?.level_number);
                    const isPassed = isFirst || totalXP >= Number(lvl.required_xp || 0);

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

function isTelegramUrl(url) {
  return /(?:https?:\/\/)?(?:t(?:elegram)?\.me|telegram\.dog)\//i.test(String(url || ''));
}

function collectStringUrls(value, out = []) {
  if (typeof value === 'string' && /^https?:\/\//i.test(value)) out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => collectStringUrls(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => collectStringUrls(v, out));
  return out;
}

function pickTelegramUrl(appRoute, contacts = [], abouts = []) {
  const candidates = [
    appRoute?.support_url,
    ...collectStringUrls(appRoute?.app_links),
    ...(Array.isArray(contacts) ? contacts.map((c) => c.link_url) : []),
    ...(Array.isArray(abouts) ? abouts.map((a) => a.link_url) : []),
  ].filter(Boolean);
  return candidates.find(isTelegramUrl) || appRoute?.support_url || '';
}

function AboutAppBody({
  t,
  appRoute,
  aboutList = [],
  contactList = [],
  faqList = [],
  expandedFaq,
  setExpandedFaq,
}) {
  const telegramUrl = pickTelegramUrl(appRoute, contactList, aboutList);
  const telegramStyle = isTelegramUrl(telegramUrl);
  const version = appRoute?.app_version?.android || appRoute?.app_version?.ios || appRoute?.app_version?.web || '';
  const hasContacts = Boolean(appRoute?.call_center) || contactList.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '22px 16px 20px',
        background: 'linear-gradient(180deg, #ECFDF5 0%, #F0FDF4 100%)',
        borderRadius: 20,
        border: '1px solid #BBF7D0',
      }}>
        <img src="/logo-full.svg" alt="TibStation" style={{ height: 36, width: 'auto', marginBottom: 12 }} />
        <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
          TibStation AI
        </h3>
        {version ? (
          <div style={{
            display: 'inline-flex',
            padding: '3px 10px',
            borderRadius: 99,
            background: '#FFFFFF',
            border: '1px solid #BBF7D0',
            fontSize: 11,
            fontWeight: 800,
            color: '#15803D',
            marginBottom: 8,
          }}>
            {t('about.version', 'Versiya')} {version}
          </div>
        ) : null}
        <p style={{ fontSize: 13, color: '#475569', margin: 0, maxWidth: 340, lineHeight: 1.5 }}>
          {t('about.tagline', 'Tibbiyot talabalari va amaliyotchi shifokorlar uchun interaktiv klinik vaziyatlar simulyatori.')}
        </p>
      </div>

      {telegramUrl ? (
        <button
          type="button"
          id="btn-about-telegram"
          onClick={() => openExternalUrl(telegramUrl)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            width: '100%',
            padding: '12px 14px',
            border: 'none',
            borderRadius: 16,
            background: telegramStyle ? '#229ED9' : '#16A34A',
            color: '#fff',
            cursor: 'pointer',
            textAlign: 'left',
            fontFamily: 'inherit',
          }}
        >
          <span style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: 'rgba(255,255,255,.18)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Send size={18} strokeWidth={2.4} />
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 14, fontWeight: 800 }}>
              {telegramStyle ? t('about.telegram', 'Telegram') : t('about.support', 'Yordam')}
            </span>
            <span style={{ display: 'block', fontSize: 12, fontWeight: 600, opacity: 0.9 }}>
              {telegramStyle ? t('about.telegramCta', 'Telegram orqali yozing') : t('about.supportCta', "Qo'llab-quvvatlash")}
            </span>
          </span>
          <ExternalLink size={16} />
        </button>
      ) : null}

      {aboutList.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {aboutList.map((item, idx) => (
            <div
              key={item.id || idx}
              style={{
                padding: '14px 16px',
                background: '#F8FAFC',
                borderRadius: 16,
                border: '1px solid #E2E8F0',
              }}
            >
              {item.title ? (
                <h5 style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>
                  {item.title}
                </h5>
              ) : null}
              {item.description ? (
                <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.55 }}>
                  {item.description}
                </p>
              ) : null}
              {item.link_url && !isTelegramUrl(item.link_url) ? (
                <button
                  type="button"
                  onClick={() => openExternalUrl(item.link_url)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    marginTop: 10,
                    padding: 0,
                    border: 'none',
                    background: 'transparent',
                    fontSize: 12,
                    fontWeight: 800,
                    color: '#16A34A',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {t('about.more', 'Batafsil')} <ExternalLink size={12} />
                </button>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {hasContacts && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h4 style={{ fontSize: 13, fontWeight: 800, color: '#64748B', margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {t('about.contact', "Aloqa")}
          </h4>
          {appRoute?.call_center ? (
            <a
              href={`tel:${appRoute.call_center}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: 14,
                textDecoration: 'none',
                color: '#15803D',
              }}
            >
              <Phone size={16} />
              <span style={{ flex: 1, fontWeight: 800, fontSize: 13 }}>{t('about.callCenter', 'Call-center')}</span>
              <span style={{ fontWeight: 700, fontSize: 13 }}>{appRoute.call_center}</span>
            </a>
          ) : null}
          {contactList.map((c, cIdx) => (
            <div
              key={c.id || cIdx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                background: '#F8FAFC',
                borderRadius: 14,
                border: '1px solid #E2E8F0',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 13 }}>{c.name}</div>
                {c.phone_number ? (
                  <a href={`tel:${c.phone_number}`} style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none', fontSize: 12 }}>
                    {c.phone_number}
                  </a>
                ) : null}
              </div>
              {c.link_url && !isTelegramUrl(c.link_url) ? (
                <button type="button" onClick={() => openExternalUrl(c.link_url)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#16A34A' }}>
                  <ExternalLink size={16} />
                </button>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {faqList.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h4 style={{ fontSize: 13, fontWeight: 800, color: '#64748B', margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
            <HelpCircle size={14} /> {t('about.faq', 'Savollar')}
          </h4>
          {faqList.map((faq, fIdx) => {
            const open = expandedFaq === fIdx;
            return (
              <button
                key={faq.id || fIdx}
                type="button"
                onClick={() => setExpandedFaq(open ? null : fIdx)}
                style={{
                  padding: '12px 14px',
                  borderRadius: 14,
                  background: open ? '#F0FDF4' : '#F8FAFC',
                  border: open ? '1px solid #BBF7D0' : '1px solid #E2E8F0',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#0F172A' }}>{faq.question}</span>
                  {open ? <ChevronUp size={16} color="#16A34A" /> : <ChevronDown size={16} color="#94A3B8" />}
                </div>
                {open && (
                  <p style={{ fontSize: 13, color: '#475569', margin: '8px 0 0', lineHeight: 1.55 }}>
                    {faq.answer}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

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
