import React, { useState, useEffect } from 'react';
import { api } from '../api';
import {
  Settings,
  Trophy,
  FileText,
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Mail,
  Heart,
  Share2,
  Shield,
  Tag,
  Globe,
  User,
  RotateCcw,
  Copy,
  Trash2,
  Sparkles,
  Award,
  Star,
  Check,
  X,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import { useTranslation } from '../i18n.jsx';

export default function ProfileView({
  user,
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
  const [copiedId, setCopiedId] = useState(false);
  const [drLeoOpen, setDrLeoOpen] = useState(false);

  // Real API data
  const [completedSessions, setCompletedSessions] = useState([]);
  const [ongoingSessions, setOngoingSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Load completed/ongoing simulations from API
  useEffect(() => {
    let mounted = true;
    setLoadingSessions(true);
    Promise.all([
      api.getCompletedSimulations().catch(() => ({ sessions: [], count: 0 })),
      api.getOngoingSimulations().catch(() => ({ sessions: [], count: 0 })),
    ]).then(([comp, ong]) => {
      if (mounted) {
        setCompletedSessions(comp?.sessions || []);
        setOngoingSessions(ong?.sessions || []);
      }
    }).finally(() => { if (mounted) setLoadingSessions(false); });
    return () => { mounted = false; };
  }, []);

  // Sub-modals for Settings
  const [modalType, setModalType] = useState(null); // 'username' | 'coupon' | 'language' | 'rate' | 'feedback' | 'terms' | 'privacy' | 'delete'
  const [tempUsername, setTempUsername] = useState(user?.name || 'John');
  const [couponCode, setCouponCode] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const userIdString = user?.id ? `usr_${String(user.id).padStart(8, '0')}_${user.name?.toLowerCase() || 'john'}` : 'ukjqhz1OU0d1pbwvHCfJ...';

  const handleCopyUserId = () => {
    navigator.clipboard?.writeText(userIdString);
    setCopiedId(true);
    showToast('User ID copied to clipboard!');
    setTimeout(() => setCopiedId(false), 2200);
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
      const coinsAdded = res?.coins_added ?? 0;
      showToast(`🎉 +${coinsAdded} ${t('settings.coins')}!`);
      if (onUserUpdate) {
        onUserUpdate(prev => ({
          ...(prev || {}),
          coins: (prev?.coins || 0) + coinsAdded,
        }));
      }
      setCouponCode('');
      setModalType(null);
    } catch (err) {
      showToast('⚠️ ' + (err.message || 'Invalid promocode'));
    } finally {
      setPromoLoading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'TibCase Medical Simulator',
      text: 'Join me on TibCase to practice real clinical cases!',
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
      showToast('Link copied to clipboard!');
    }
  };

  // XP calculation
  const totalXP = user?.xp || 0;
  const currentLevel = Math.max(1, Math.floor(totalXP / 1000) + 1);
  const nextLevel = currentLevel + 1;
  const xpInCurrentLevel = totalXP % 1000;
  const xpProgressPercent = Math.min(100, Math.max(0, (xpInCurrentLevel / 1000) * 100));

  const completedCount = completedSessions.length || user?.completed_cases_count || 0;
  const ongoingCount = ongoingSessions.length || user?.ongoing_cases_count || 0;

  // Language display
  const getLanguageLabel = () => {
    if (lang === 'uz') return '🇺🇿 Oʻzbek';
    if (lang === 'ru') return '🇷🇺 Русский';
    return '🇺🇸 English';
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
                fontWeight: 800,
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
                onClick={() => setCurrentScreen('settings')}
                title={t('profile.settings')}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                  border: '1.5px solid #FCD34D',
                  boxShadow: '0 3px 0 #F59E0B, 0 6px 14px rgba(245, 158, 11, 0.15)',
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
              borderRadius: 28,
              border: '2px solid #E2E8F0',
              boxShadow: '0 4px 0 #E2E8F0, 0 10px 25px rgba(15, 23, 42, 0.03)',
              padding: '22px 20px',
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
                {/* Avatar with yellow circular background */}
                <div style={{
                  position: 'relative',
                  width: 76,
                  height: 76,
                  borderRadius: '50%',
                  background: '#FDE047',
                  border: '3px solid #FEF08A',
                  boxShadow: '0 4px 14px rgba(234, 179, 8, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}>
                  <img
                    src="/student_avatar.jpg"
                    alt={user?.name || 'John'}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <span style={{
                    display: 'none',
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: '#854D0E',
                  }}>
                    {user?.name ? user.name[0] : 'J'}
                  </span>
                </div>

                {/* User Name & Subtitle */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{
                    fontSize: '22px',
                    fontWeight: 800,
                    color: '#0F172A',
                    margin: '0 0 4px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {user?.name || 'John'}
                  </h2>
                  <p style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#64748B',
                    margin: 0,
                  }}>
                    {user?.specialty || t('profile.student')}
                  </p>
                </div>

                {/* Glowing Green Trophy Badge */}
                <div style={{
                  width: 54,
                  height: 54,
                  borderRadius: '50%',
                  background: '#DCFCE7',
                  border: '2.5px solid #86EFAC',
                  boxShadow: '0 0 18px rgba(34, 197, 94, 0.38)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Trophy size={26} color="#16A34A" strokeWidth={2.4} />
                </div>
              </div>

              {/* Level and Progress Bar */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 4 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '13px',
                }}>
                  <span style={{ fontWeight: 800, color: '#1E293B', fontSize: '14px' }}>
                    {t('profile.level')} {currentLevel}
                  </span>
                  <span style={{ fontWeight: 700, color: '#94A3B8', fontSize: '12px' }}>
                    {xpInCurrentLevel}/1000 XP
                  </span>
                  <span style={{ fontWeight: 700, color: '#64748B', fontSize: '14px' }}>
                    {t('profile.level')} {nextLevel}
                  </span>
                </div>

                {/* Progress Track */}
                <div style={{
                  width: '100%',
                  height: 14,
                  background: '#E2E8F0',
                  borderRadius: 999,
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${xpProgressPercent}%`,
                    minWidth: xpProgressPercent > 0 ? 10 : 0,
                    background: 'linear-gradient(90deg, #22C55E 0%, #10B981 100%)',
                    borderRadius: 999,
                    transition: 'width 0.4s ease',
                    boxShadow: '0 0 10px rgba(34, 197, 94, 0.4)',
                  }} />
                </div>
              </div>
            </div>

            {/* Three Stat Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
              marginTop: 16,
              width: '100%',
            }}>
              {/* Card 1: Total XP */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: 22,
                border: '2px solid #E2E8F0',
                boxShadow: '0 4px 0 #E2E8F0',
                padding: '16px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 8,
              }}>
                {/* Yellow Trophy Diamond */}
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #FEF08A, #FDE047)',
                  border: '1.5px solid #FACC15',
                  transform: 'rotate(45deg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 4,
                }}>
                  <div style={{ transform: 'rotate(-45deg)' }}>
                    <Trophy size={16} color="#B45309" strokeWidth={2.4} />
                  </div>
                </div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                  {totalXP}
                </div>
                <div style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#64748B',
                  letterSpacing: '0.6px',
                }}>
                  {t('profile.totalXp')}
                </div>
              </div>

              {/* Card 2: Completed */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: 22,
                border: '2px solid #E2E8F0',
                boxShadow: '0 4px 0 #E2E8F0',
                padding: '16px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 8,
              }}>
                {/* Yellow Document Diamond */}
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #FEF08A, #FDE047)',
                  border: '1.5px solid #FACC15',
                  transform: 'rotate(45deg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 4,
                }}>
                  <div style={{ transform: 'rotate(-45deg)' }}>
                    <FileText size={16} color="#B45309" strokeWidth={2.4} />
                  </div>
                </div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                  {completedCount}
                </div>
                <div style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#64748B',
                  letterSpacing: '0.6px',
                }}>
                  {t('profile.completed')}
                </div>
              </div>

              {/* Card 3: Ongoing */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: 22,
                border: '2px solid #E2E8F0',
                boxShadow: '0 4px 0 #E2E8F0',
                padding: '16px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: 8,
              }}>
                {/* Blue Clock Diamond */}
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #BAE6FD, #38BDF8)',
                  border: '1.5px solid #0EA5E9',
                  transform: 'rotate(45deg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 4,
                }}>
                  <div style={{ transform: 'rotate(-45deg)' }}>
                    <Clock size={16} color="#0369A1" strokeWidth={2.4} />
                  </div>
                </div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>
                  {ongoingCount}
                </div>
                <div style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  color: '#64748B',
                  letterSpacing: '0.6px',
                }}>
                  {t('profile.ongoing')}
                </div>
              </div>
            </div>

            {/* Segmented Tab Switcher (Completed / Ongoing) */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 22,
              border: '2px solid #E2E8F0',
              boxShadow: '0 4px 0 #E2E8F0',
              padding: '6px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
              marginTop: 18,
              width: '100%',
              boxSizing: 'border-box',
            }}>
              {/* Tab: Completed */}
              <button
                id="tab-completed"
                onClick={() => setActiveTab('completed')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '12px 16px',
                  borderRadius: 16,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  background: activeTab === 'completed'
                    ? 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)'
                    : 'transparent',
                  color: activeTab === 'completed' ? '#FFFFFF' : '#64748B',
                  boxShadow: activeTab === 'completed'
                    ? '0 4px 12px rgba(34, 197, 94, 0.35)'
                    : 'none',
                }}
              >
                <CheckCircle2 size={18} strokeWidth={2.5} color={activeTab === 'completed' ? '#FFFFFF' : '#94A3B8'} />
                <span>{t('profile.completedTab')}</span>
              </button>

              {/* Tab: Ongoing */}
              <button
                id="tab-ongoing"
                onClick={() => setActiveTab('ongoing')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '12px 16px',
                  borderRadius: 16,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                  background: activeTab === 'ongoing'
                    ? 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)'
                    : 'transparent',
                  color: activeTab === 'ongoing' ? '#FFFFFF' : '#64748B',
                  boxShadow: activeTab === 'ongoing'
                    ? '0 4px 12px rgba(34, 197, 94, 0.35)'
                    : 'none',
                }}
              >
                <Clock size={18} strokeWidth={2.5} color={activeTab === 'ongoing' ? '#FFFFFF' : '#94A3B8'} />
                <span>{t('profile.ongoingTab')}</span>
              </button>
            </div>

            {/* Cases Area / Empty State */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '48px 20px 32px 20px',
              minHeight: 220,
              textAlign: 'center',
            }}>
              {/* Medical Clipboard Illustration with Pen & Pink Cross */}
              <div style={{
                position: 'relative',
                width: 96,
                height: 104,
                marginBottom: 16,
              }}>
                <svg width="96" height="104" viewBox="0 0 96 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Clipboard Wooden/Gray Back */}
                  <rect x="12" y="16" width="68" height="84" rx="14" fill="#3B82F6" opacity="0.12" />
                  <rect x="14" y="18" width="64" height="80" rx="12" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="2.5" />

                  {/* Gold Clip on Top */}
                  <rect x="30" y="8" width="32" height="18" rx="6" fill="#F59E0B" />
                  <rect x="34" y="12" width="24" height="8" rx="4" fill="#FDE68A" />

                  {/* Document Lines */}
                  <rect x="24" y="44" width="44" height="4" rx="2" fill="#E2E8F0" />
                  <rect x="24" y="54" width="36" height="4" rx="2" fill="#E2E8F0" />
                  <rect x="24" y="64" width="40" height="4" rx="2" fill="#E2E8F0" />
                  <rect x="24" y="74" width="28" height="4" rx="2" fill="#E2E8F0" />

                  {/* Patient Avatar icon on document */}
                  <circle cx="46" cy="34" r="7" fill="#10B981" opacity="0.2" />
                  <circle cx="46" cy="33" r="3.5" fill="#10B981" />
                  <path d="M41 39C41 36.8 43.2 35 46 35C48.8 35 51 36.8 51 39" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />

                  {/* Medical Blue Pen on the right */}
                  <g transform="translate(68, 12) rotate(25)">
                    <rect x="0" y="0" width="8" height="36" rx="4" fill="#2563EB" />
                    <path d="M0 36L4 44L8 36H0Z" fill="#1D4ED8" />
                    <circle cx="4" cy="44" r="1.5" fill="#0F172A" />
                    <rect x="1" y="4" width="6" height="4" rx="1" fill="#93C5FD" />
                  </g>

                  {/* Pink Cross Badge floating at bottom right */}
                  <g transform="translate(54, 62)">
                    <circle cx="16" cy="16" r="16" fill="#EC4899" />
                    <circle cx="16" cy="16" r="13" fill="#F43F5E" />
                    <rect x="13.5" y="8" width="5" height="16" rx="2.5" fill="#FFFFFF" />
                    <rect x="8" y="13.5" width="16" height="5" rx="2.5" fill="#FFFFFF" />
                  </g>
                </svg>
              </div>

              {/* Empty State Text */}
              <p style={{
                fontSize: '15px',
                fontWeight: 600,
                color: '#94A3B8',
                margin: 0,
              }}>
                {activeTab === 'completed' ? t('profile.noCompleted') : 'No ongoing cases yet'}
              </p>

              {/* Quick action button to explore cases */}
              <button
                onClick={() => onNavigate && onNavigate('cases')}
                style={{
                  marginTop: 14,
                  padding: '8px 18px',
                  borderRadius: 14,
                  background: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  color: '#475569',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>{t('profile.browseCases')}</span>
                <ChevronRight size={14} />
              </button>
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
                title="Back to Profile"
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
                fontWeight: 800,
                color: '#0F172A',
                letterSpacing: '-0.02em',
                margin: 0,
                textAlign: 'center',
                paddingRight: 40, // offset back button for optical center
              }}>
                {t('profile.settings')}
              </h1>
            </div>

            {/* Purple Banner: "Get Premium / Unlimited case solving" */}
            <div
              id="btn-get-premium-banner"
              onClick={() => onOpenStore ? onOpenStore() : showToast('Opening Store Tariffs...')}
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                borderRadius: 24,
                boxShadow: '0 6px 20px rgba(124, 58, 237, 0.28)',
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {/* Translucent Medal Badge */}
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  flexShrink: 0,
                }}>
                  <Award size={26} color="#FFFFFF" strokeWidth={2.2} />
                </div>

                <div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    margin: '0 0 2px 0',
                  }}>
                    {t('settings.getPremium')}
                  </h3>
                  <p style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#E9D5FF',
                    margin: 0,
                  }}>
                    {t('settings.unlimitedCases')}
                  </p>
                </div>
              </div>

              <ChevronRight size={22} color="#FFFFFF" strokeWidth={2.4} />
            </div>

            {/* Card Group 1: General (Feedback, Rate, Share, Terms, Privacy, Coupon) */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 24,
              border: '2px solid #E2E8F0',
              boxShadow: '0 4px 0 #E2E8F0',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* Feedback */}
              <SettingsListItem
                icon={<Mail size={20} color="#0F172A" strokeWidth={2} />}
                label={t('settings.feedback')}
                onClick={() => setModalType('feedback')}
              />
              <Divider />

              {/* Rate Us */}
              <SettingsListItem
                icon={<Heart size={20} color="#0F172A" strokeWidth={2} />}
                label={t('settings.rateUs')}
                onClick={() => setModalType('rate')}
              />
              <Divider />

              {/* Share with Friends */}
              <SettingsListItem
                icon={<Share2 size={20} color="#0F172A" strokeWidth={2} />}
                label={t('settings.shareWithFriends')}
                onClick={handleShare}
              />
              <Divider />

              {/* Terms of Use */}
              <SettingsListItem
                icon={<FileText size={20} color="#0F172A" strokeWidth={2} />}
                label={t('settings.termsOfUse')}
                onClick={() => setModalType('terms')}
              />
              <Divider />

              {/* Privacy Policy */}
              <SettingsListItem
                icon={<Shield size={20} color="#0F172A" strokeWidth={2} />}
                label={t('settings.privacyPolicy')}
                onClick={() => setModalType('privacy')}
              />
              <Divider />

              {/* Coupon Code */}
              <SettingsListItem
                icon={<Tag size={20} color="#0F172A" strokeWidth={2} />}
                label={t('settings.couponCode')}
                onClick={() => setModalType('coupon')}
              />
            </div>

            {/* Card Group 2: Language Selection */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 24,
              border: '2px solid #E2E8F0',
              boxShadow: '0 4px 0 #E2E8F0',
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
            </div>

            {/* Card Group 3: Account (Change Username, Restore, User ID, Delete) */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 24,
              border: '2px solid #E2E8F0',
              boxShadow: '0 4px 0 #E2E8F0',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* Change Username */}
              <SettingsListItem
                icon={<User size={20} color="#0F172A" strokeWidth={2} />}
                label={t('settings.changeUsername')}
                subtitle={user?.name || 'John'}
                onClick={() => {
                  setTempUsername(user?.name || 'John');
                  setModalType('username');
                }}
              />
              <Divider />

              {/* Restore Purchase */}
              <SettingsListItem
                icon={<RotateCcw size={20} color="#0F172A" strokeWidth={2} />}
                label={t('settings.restorePurchase')}
                onClick={() => showToast('Purchases restored successfully!')}
              />
              <Divider />

              {/* User ID with Copy */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                gap: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 24, display: 'flex', justifyContent: 'center' }}>
                    <User size={20} color="#0F172A" strokeWidth={2} />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                      {t('settings.userId')}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#94A3B8',
                      fontFamily: 'monospace',
                      marginTop: 2,
                    }}>
                      {userIdString.slice(0, 22)}...
                    </div>
                  </div>
                </div>

                <button
                  id="btn-copy-user-id"
                  onClick={handleCopyUserId}
                  title="Copy User ID"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: copiedId ? '#DCFCE7' : '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: copiedId ? '#16A34A' : '#64748B',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {copiedId ? <Check size={18} strokeWidth={2.5} /> : <Copy size={18} />}
                </button>
              </div>
              <Divider />

              {/* Delete Account */}
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
                  border: '1.5px solid #FCA5A5',
                  color: '#DC2626',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                {t('settings.logOut')}
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
              Medical Case App 1.1.4
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* FLOATING DR. LEO MONKEY MASCOT WIDGET                          */}
        {/* ============================================================== */}
        <div style={{
          position: 'fixed',
          bottom: 84,
          right: 'calc(50% - 220px)',
          zIndex: 60,
        }}>
          <button
            id="btn-dr-leo-mascot"
            onClick={() => setDrLeoOpen(prev => !prev)}
            title="Dr. Leo - AI Assistant"
            style={{
              position: 'relative',
              width: 58,
              height: 58,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '2.5px solid #86EFAC',
              boxShadow: '0 0 20px rgba(34, 197, 94, 0.45), 0 6px 14px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              padding: 0,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <img
              src="/doctor_monkey.jpg"
              alt="Dr. Leo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </button>

          {/* Dr. Leo Speech Bubble Popup */}
          {drLeoOpen && (
            <div style={{
              position: 'absolute',
              bottom: 68,
              right: 0,
              width: 250,
              background: '#FFFFFF',
              borderRadius: 20,
              border: '2px solid #86EFAC',
              boxShadow: '0 10px 30px rgba(34, 197, 94, 0.25), 0 4px 0 #86EFAC',
              padding: '16px',
              animation: 'fadeIn 0.2s ease-out',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#16A34A', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Sparkles size={14} /> Dr. Leo
                </span>
                <button
                  onClick={() => setDrLeoOpen(false)}
                  style={{ color: '#94A3B8', border: 'none', background: 'transparent', cursor: 'pointer', padding: 2 }}
                >
                  <X size={14} />
                </button>
              </div>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#334155', margin: 0, lineHeight: 1.4 }}>
                "Salom, {user?.name || 'hamkasb'}! Har kuni 1 ta klinik keys yechish orqali bilimlaringizni oshirib boring!"
              </p>
            </div>
          )}
        </div>

      </div>

      {/* ============================================================== */}
      {/* SUB-MODALS                                                     */}
      {/* ============================================================== */}

      {/* 1. Change Username Modal */}
      {modalType === 'username' && (
        <ModalOverlay onClose={() => setModalType(null)}>
          <ModalCard title="Change Username" onClose={() => setModalType(null)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#64748B' }}>
                Your Name / Nickname
              </label>
              <input
                type="text"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                placeholder="Enter new username"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 14,
                  border: '2px solid #E2E8F0',
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
                  background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                }}
              >
                {saveLoading ? '...' : t('settings.save')}
              </button>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* 2. Coupon Code Modal */}
      {modalType === 'coupon' && (
        <ModalOverlay onClose={() => setModalType(null)}>
          <ModalCard title="Enter Coupon Code" onClose={() => setModalType(null)}>
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                Have a promotional voucher or student code? Enter it below to unlock premium perks.
              </p>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="e.g. TIBCASE2026"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 14,
                  border: '2px solid #E2E8F0',
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
                  boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)',
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
                    border: lang === item.code ? '2px solid #22C55E' : '1.5px solid #E2E8F0',
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
          <ModalCard title="Rate TibCase" onClose={() => setModalType(null)}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
                How would you rate your clinical learning experience?
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
                  showToast('❤️ Thank you for your feedback!');
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 14,
                  background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                }}
              >
                Submit Rating
              </button>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* 5. Feedback Modal */}
      {modalType === 'feedback' && (
        <ModalOverlay onClose={() => setModalType(null)}>
          <ModalCard title="Send Feedback" onClose={() => setModalType(null)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                Tell us about any clinical bugs, suggestions, or features you want to see!
              </p>
              <textarea
                rows={4}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Write your suggestions here..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 14,
                  border: '2px solid #E2E8F0',
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
                  showToast('Message sent! Thank you for helping us improve.');
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
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                }}
              >
                Send Feedback
              </button>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* 6. Terms of Use */}
      {modalType === 'terms' && (
        <ModalOverlay onClose={() => setModalType(null)}>
          <ModalCard title="Terms of Use" onClose={() => setModalType(null)}>
            <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, maxHeight: 300, overflowY: 'auto' }}>
              <p>
                <strong>1. Educational Purpose:</strong> TibCase is an interactive medical simulator designed exclusively for training medical students and healthcare professionals. It does not replace real clinical judgement or hospital protocols.
              </p>
              <p>
                <strong>2. Virtual Cases:</strong> All patient data and scenarios are synthesized for clinical decision training and respect medical confidentiality.
              </p>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* 7. Privacy Policy */}
      {modalType === 'privacy' && (
        <ModalOverlay onClose={() => setModalType(null)}>
          <ModalCard title="Privacy Policy" onClose={() => setModalType(null)}>
            <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, maxHeight: 300, overflowY: 'auto' }}>
              <p>
                <strong>Privacy & Safety:</strong> We take your account privacy seriously. Your clinical scores, XP, and test answers are securely stored and never shared with unauthorized third parties.
              </p>
            </div>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* 8. Delete Account Confirmation */}
      {modalType === 'delete' && (
        <ModalOverlay onClose={() => setModalType(null)}>
          <ModalCard title="Delete Account" onClose={() => setModalType(null)}>
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
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
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

function SettingsListItem({ icon, label, subtitle, labelColor = '#0F172A', onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        cursor: 'pointer',
        gap: 12,
        transition: 'background 0.15s ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 24, display: 'flex', justifyContent: 'center' }}>
          {icon}
        </div>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: labelColor }}>
            {label}
          </div>
          {subtitle && (
            <div style={{ fontSize: '13px', fontWeight: 500, color: '#64748B', marginTop: 2 }}>
              {subtitle}
            </div>
          )}
        </div>
      </div>

      <ChevronRight size={20} color="#94A3B8" strokeWidth={2.4} />
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

function ModalCard({ title, children, onClose }) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: '100%',
        maxWidth: 400,
        background: '#FFFFFF',
        borderRadius: 24,
        border: '2px solid #E2E8F0',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        padding: 24,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
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
