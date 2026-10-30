import React, { useEffect, useRef, useState } from 'react';
import {
  api,
  getToken,
  getRefreshToken,
  getStoredUser,
  setToken,
  setRefreshToken,
  setStoredUser,
  setOnUnauthorized,
  isSessionNotActiveError,
  isInsufficientCoinsError,
  registerStoredFcmDevice,
} from './api';
// Views
import { autoEnablePush, onForegroundPush } from './utils/push';
import LandingPage from './views/LandingPage';
import HomeView from './views/HomeView';
import CategoriesView from './views/CategoriesView';
import RoadmapView from './views/RoadmapView';
import CaseSimulationRoom from './views/CaseSimulationRoom';
import Leaderboard from './views/Leaderboard';
import ProfileView from './views/ProfileView';
import NotificationsView from './views/NotificationsView.jsx';
import StoreTariffs from './views/StoreTariffs';
import PracticeView from './views/PracticeView.jsx';
import FlashcardsView from './views/FlashcardsView.jsx';
import KnowledgeMapView from './views/KnowledgeMapView.jsx';

// Layout
import BottomNavBar from './components/layout/BottomNavBar';
import Sidebar from './components/layout/Sidebar.jsx';
import TabletHeader from './components/layout/TabletHeader.jsx';
import PushBanner from './components/common/PushBanner.jsx';

// Modals
import AuthModal from './components/modals/AuthModal';
import LogoutConfirmModal from './components/modals/LogoutConfirmModal';
import ProfileModal from './components/modals/ProfileModal';
import QuickGuideModal from './components/modals/QuickGuideModal';
import DebriefModal from './components/modals/DebriefModal';

import {
  ChevronRight,
  X,
} from 'lucide-react';
import { useTranslation } from './i18n.jsx';
import { SiteCredit } from './brand.jsx';

export default function App() {
  const { lang, setLang, t } = useTranslation();

  // Authentication status: safely check both localStorage flag AND actual token availability
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const hasFlag = localStorage.getItem('tibcase_authenticated') === 'true';
    const hasToken = Boolean(getToken() || getRefreshToken());
    if (hasFlag && !hasToken) {
      localStorage.removeItem('tibcase_authenticated');
      return false;
    }
    return hasFlag && hasToken;
  });

  // Returning, already signed-in users first see the landing page with a "Kabinet" button
  // (no OTP needed). Inside the Telegram Mini App we skip the landing and open the app directly.
  const [showLandingGate, setShowLandingGate] = useState(() => !window.Telegram?.WebApp?.initData);

  const [currentView, setCurrentView] = useState('cases'); // 'cases' | 'simulation' | 'store' | 'leaderboard'
  const [activeMode, setActiveMode] = useState('clinical'); // 'clinical' | 'citizen'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsBackView, setNotificationsBackView] = useState('cases');

  // Initialize Telegram Web App SDK & closing confirmation
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      try {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        if (typeof tg.enableClosingConfirmation === 'function') {
          tg.enableClosingConfirmation();
        }
      } catch (err) {
        console.warn('Telegram WebApp initialization error:', err);
      }
    }
  }, []);

  // Telegram Native BackButton integration for in-app navigation
  useEffect(() => {
    const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : null;
    // BackButton needs Bot API 6.1+ and a real Telegram session
    if (!tg?.initData || !tg.isVersionAtLeast?.('6.1')) return;

    const handleTelegramBack = () => {
      if (sidebarOpen) {
        setSidebarOpen(false);
        return;
      }
      if (currentView === 'roadmap') {
        setCurrentView('clinics');
      } else if (currentView === 'clinics') {
        setCurrentView('cases');
      } else if (currentView === 'simulation') {
        setCurrentView('cases');
      } else if (currentView === 'notifications') {
        setCurrentView(notificationsBackView || 'cases');
      } else if (['practice', 'flashcards', 'knowledge_map'].includes(currentView)) {
        setCurrentView('cases');
      } else if (['leaderboard', 'store', 'tariffs'].includes(currentView)) {
        setCurrentView('profile');
      } else if (currentView === 'profile') {
        setCurrentView('cases');
      } else {
        setCurrentView('cases');
      }
    };

    if (currentView !== 'cases' || sidebarOpen) {
      tg.BackButton.show();
      tg.BackButton.onClick(handleTelegramBack);
    } else {
      tg.BackButton.hide();
    }

    return () => {
      tg.BackButton.offClick(handleTelegramBack);
    };
  }, [currentView, sidebarOpen, notificationsBackView]);

  // Foreground push: refresh the in-app notification list when a message arrives
  useEffect(() => {
    if (!isAuthenticated) return;
    let unsub = () => {};
    let cancelled = false;
    autoEnablePush();
    onForegroundPush(() => {
      api.getNotifications().then((res) => setNotifications(res?.notifications || res?.items || [])).catch(() => {});
    }).then((u) => { if (cancelled) u(); else unsub = u; }).catch(() => {});
    return () => { cancelled = true; unsub(); };
  }, [isAuthenticated]);

  // Listen for unauthorized/expired session events from api client
  useEffect(() => {
    setOnUnauthorized(() => {
      console.warn('Session expired or invalidated -> resetting authentication state');
      setIsAuthenticated(false);
      localStorage.removeItem('tibcase_authenticated');
      setToken(null);
      setRefreshToken(null);
      setStoredUser(null);
      setUser(null);
      setActiveCase(null);
      setProfileModalOpen(false);
      setLogoutConfirmOpen(false);
    });
  }, []);

  // Data states (initialize user from stored user to prevent empty flickering)
  const [user, setUser] = useState(() => {
    return getStoredUser();
  });
  const [categories, setCategories] = useState([]);
  const [topicTotal, setTopicTotal] = useState(null);
  const [cases, setCases] = useState([]);
  const [tariffs, setTariffs] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [abouts, setAbouts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [userLimit, setUserLimit] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [flashcardStats, setFlashcardStats] = useState(null);
  const [practiceConfig, setPracticeConfig] = useState(null);

  // Active Simulation states
  const [activeCase, setActiveCase] = useState(null);
  const [selectedDetailCase, setSelectedDetailCase] = useState(null);
  const [debriefData, setDebriefData] = useState(null);

  // Roadmap & Case Flow states
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showQuickGuide, setShowQuickGuide] = useState(false);

  // Modals (restore pending OTP modal if user recently navigated to Telegram bot to get code)
  const [authModalOpen, setAuthModalOpen] = useState(() => {
    try {
      const raw = localStorage.getItem('tibcase_auth_pending') || sessionStorage.getItem('tibcase_auth_pending');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.step === 'otp' && parsed?.identifier && (!parsed.timestamp || Date.now() - parsed.timestamp < 10 * 60 * 1000)) {
          return true;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [limitModal, setLimitModal] = useState(null);
  const [storeInitialTab, setStoreInitialTab] = useState('all');
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const handleLangChange = (newLang) => {
    setLang(newLang);
    const msg = newLang === 'uz' ? "Til o'zgartirildi: O'ZBEKCHA" : (newLang === 'ru' ? "Язык изменен: РУССКИЙ" : "Language changed: ENGLISH");
    showToast(msg);
  };

  const getTodayDateStr = () => {
    return new Date().toLocaleDateString('en-CA'); // 'YYYY-MM-DD'
  };

  const handleRefreshLimit = async () => {
    if (isAuthenticated) {
      try {
        const [fresh, freshWallet] = await Promise.all([
          api.getUserLimit().catch(() => null),
          api.getPracticeWallet().catch(() => null),
        ]);
        if (fresh) setUserLimit(fresh);
        if (freshWallet) setWallet(freshWallet);
        return fresh;
      } catch (err) {
        console.warn('Refresh limit error:', err);
      }
    }
    return null;
  };

  const refreshWallet = () => {
    api.getPracticeWallet().then((w) => { if (w) setWallet(w); }).catch(() => {});
    api.getFlashcardStats().then((s) => { if (s) setFlashcardStats(s); }).catch(() => {});
  };

  const openStoreForCoins = () => {
    setStoreInitialTab('coins');
    setCurrentView('store');
  };

  const openPractice = (config = null) => {
    setPracticeConfig(config);
    setCurrentView('practice');
  };

  // Initial Data Fetch
  useEffect(() => {
    let isMounted = true;

    async function loadAllData() {
      if (!isAuthenticated) return;

      try {
        const warn = (name, fallback) => (err) => {
          console.warn(`[load:${name}] failed`, { status: err?.status, message: err?.message });
          return fallback;
        };
        api.getTopicTotal()
          .then((n) => { if (isMounted && typeof n === 'number') setTopicTotal(n); })
          .catch(warn('topics', null));

        const [
          profileData,
          catsData,
          casesData,
          limitData,
          tariffsData,
          faqsData,
          aboutsData,
          contactsData,
          bannersData,
          notifData,
          walletData,
          flashStats,
        ] = await Promise.all([
          api.getUserProfile().catch(warn('profile', null)),
          api.getCategories().catch(warn('categories', [])),
          api.getCases().catch(warn('cases', [])),
          api.getUserLimit().catch(warn('limit', null)),
          api.getTariffs().catch(warn('tariffs', [])),
          api.getFaqs().catch(warn('faqs', [])),
          api.getAbout().catch(warn('about', [])),
          api.getContacts().catch(warn('contacts', [])),
          api.getBanners().catch(warn('banners', [])),
          api.getNotifications().catch(warn('notifications', { count: 0, notifications: [] })),
          api.getPracticeWallet().catch(warn('wallet', null)),
          api.getFlashcardStats().catch(warn('flashcards', null)),
        ]);

        if (isMounted) {
          if (profileData) {
            setUser(profileData);
            setStoredUser(profileData);
          } else {
            // If profile failed and tokens are missing, reset auth
            if (!getToken() && !getRefreshToken()) {
              setIsAuthenticated(false);
              localStorage.removeItem('tibcase_authenticated');
              return;
            }
          }
          if (catsData && catsData.length) setCategories(catsData);
          if (casesData && casesData.length) setCases(casesData);
          if (limitData) {
            setUserLimit(limitData);
            localStorage.setItem('tibcase_last_limit_date', getTodayDateStr());
          }
          if (tariffsData && tariffsData.length) setTariffs(tariffsData);
          if (faqsData && faqsData.length) setFaqs(faqsData);
          if (aboutsData && aboutsData.length) setAbouts(aboutsData);
          if (contactsData && contactsData.length) setContacts(contactsData);
          if (bannersData && bannersData.length) setBanners(bannersData);
          if (notifData) setNotifications(notifData?.notifications || notifData?.items || []);
          if (walletData) setWallet(walletData);
          setFlashcardStats(flashStats || { total: 0 });
        }
      } catch (err) {
        console.warn('Data load handled:', err.message);
      }
    }

    loadAllData();

    return () => { isMounted = false; };
  }, [lang, isAuthenticated]);

  // Automatic Daily Limit & Midnight Rollover Synchronization
  useEffect(() => {
    const syncLimitAndWallet = async () => {
      if (!isAuthenticated) return;
      const [freshLimit, freshWallet] = await Promise.all([
        api.getUserLimit().catch(() => null),
        api.getPracticeWallet().catch(() => null),
      ]);
      if (freshLimit) setUserLimit(freshLimit);
      if (freshWallet) setWallet(freshWallet);
      localStorage.setItem('tibcase_last_limit_date', getTodayDateStr());
    };

    const checkAndSyncLimit = async ({ force = false } = {}) => {
      const today = getTodayDateStr();
      const lastChecked = localStorage.getItem('tibcase_last_limit_date');
      if (force || !lastChecked || lastChecked !== today) {
        await syncLimitAndWallet();
      }
    };

    checkAndSyncLimit();

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        checkAndSyncLimit({ force: true });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);
    const interval = setInterval(checkAndSyncLimit, 60000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  // Auth Handlers
  const handleLoginSuccess = async (loggedInUser) => {
    setUser(loggedInUser);
    setStoredUser(loggedInUser);
    setIsAuthenticated(true);
    setShowLandingGate(false);
    localStorage.setItem('tibcase_authenticated', 'true');
    setCurrentView('cases');
    showToast(`${t('auth.welcomeBackUser', 'Xush kelibsiz')}, ${loggedInUser.name || ''}!`);

    // Refresh full profile & daily limit from API
    try {
      const [freshProfile, freshLimit, freshWallet] = await Promise.all([
        api.getUserProfile().catch(() => null),
        api.getUserLimit().catch(() => null),
        api.getPracticeWallet().catch(() => null),
      ]);
      if (freshProfile) {
        setUser(freshProfile);
        setStoredUser(freshProfile);
      }
      if (freshLimit) {
        setUserLimit(freshLimit);
        localStorage.setItem('tibcase_last_limit_date', getTodayDateStr());
      }
      if (freshWallet) setWallet(freshWallet);
    } catch { /* use whatever came from login */ }

    registerStoredFcmDevice();
    autoEnablePush();
  };

  const handleLogout = () => {
    setLogoutConfirmOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('tibcase_authenticated');
    setToken(null);
    setRefreshToken(null);
    setStoredUser(null);
    setUser(null);
    setActiveCase(null);
    setProfileModalOpen(false);
    setLogoutConfirmOpen(false);
    showToast(t('settings.logOut') + ' ✓');
  };

  // Simulation Triggers
  // Starts a real backend session. Returns true only when the session was created.
  const startBackendSession = async (caseItem, { useCoins = false } = {}) => {
    if (!caseItem?.id) {
      showToast(t('common.error', "Xatolik yuz berdi"));
      return false;
    }
    try {
      const session = await api.startSimulation(caseItem.id, { useCoins });
      if (!session?.session_id) throw new Error('session_id missing');
      setActiveCase({
        ...caseItem,
        sessionId: session.session_id,
        health_percent: session.health_percent,
        initial_vitals: session.initial_vitals,
        ws_url: session.ws_url,
        time_limit_seconds: session.time_limit_seconds || 0,
        max_attempts: session.max_attempts ?? caseItem.max_attempts,
        attempts_used: session.attempts_used ?? 0,
        startedAt: Date.now(),
      });
      api.getUserLimit().then(lim => { if (lim) setUserLimit(lim); }).catch(() => {});
      return true;
    } catch (err) {
      if (isInsufficientCoinsError(err)) {
        const userCoins = user?.coins || 0;
        setLimitModal({
          type: 'out_of_coins',
          caseItem,
          userCoins,
          coinsPer1k: userLimit?.coins_per_1k_tokens,
        });
        showToast(t('sim.insufficientCoins', 'Tangalar yetarli emas'));
        return false;
      }
      showToast(err?.message || t('common.error', "Xatolik yuz berdi"));
      return false;
    }
  };

  const playedCaseIdsRef = useRef(new Set());

  // Free Tier Limit & Coins Gatekeeper
  const checkLimitAndStartCase = async (caseItem, { skipGuide = false } = {}) => {
    if (!skipGuide) playedCaseIdsRef.current = new Set();
    const startedId = (caseItem || selectedDetailCase)?.id;
    if (startedId) playedCaseIdsRef.current.add(String(startedId));
    const target = caseItem || selectedDetailCase;
    if (!target) return;

    // Check if day has rolled over
    const today = getTodayDateStr();
    const lastChecked = localStorage.getItem('tibcase_last_limit_date');
    let effectiveLimit = userLimit;

    if (!lastChecked || lastChecked !== today) {
      localStorage.setItem('tibcase_last_limit_date', today);
      if (isAuthenticated) {
        try {
          const fresh = await api.getUserLimit();
          if (fresh) {
            effectiveLimit = fresh;
            setUserLimit(fresh);
          }
        } catch { /* continue with current */ }
      }
    }

    const hasSub = Boolean(user?.has_subscription || effectiveLimit?.has_subscription);
    const remaining = effectiveLimit?.remaining ?? 0;

    const launchSimulation = async (sessionTarget) => {
      const ok = await startBackendSession(sessionTarget);
      if (ok && !skipGuide) setShowQuickGuide(true);
    };

    // 1. If user has active Premium subscription -> Play unlimited!
    if (hasSub) {
      launchSimulation(target);
      return;
    }

    // 2. If user has free daily attempts remaining -> Play for free!
    if (remaining > 0) {
      launchSimulation(target);
      return;
    }

    // 3. Free daily limit exhausted — coins billed per AI usage, no upfront case price.
    const userCoins = user?.coins || 0;
    const coinsPer1k = effectiveLimit?.coins_per_1k_tokens;
    if (userCoins > 0 && skipGuide) {
      // Keyingi keys: tasdiqlash oynasisiz, to'g'ridan-to'g'ri tanga hisobidan davom etadi.
      startBackendSession(target, { useCoins: true }).then((ok) => {
        if (!ok) return;
        api.getUserProfile().then((p) => { if (p) { setUser(p); setStoredUser(p); } }).catch(() => {});
      });
      return;
    }
    if (userCoins > 0) {
      setLimitModal({
        type: 'spend_coins',
        caseItem: target,
        userCoins,
        coinsPer1k,
        skipGuide,
      });
    } else {
      setLimitModal({
        type: 'out_of_coins',
        caseItem: target,
        userCoins,
        coinsPer1k,
        skipGuide,
      });
    }
  };

  const handleNextCase = async (fromCase) => {
    const source = fromCase || activeCase || selectedDetailCase;
    const topicId = source?.topic_id;
    const excludeId = source?.id || source?._id;
    if (!topicId) {
      showToast(t('sim.noNextCase', 'Keyingi keys topilmadi'));
      return;
    }
    try {
      const played = playedCaseIdsRef.current;
      if (excludeId) played.add(String(excludeId));
      let targetCase = null;
      for (let i = 0; i < 8; i += 1) {
        const randomRes = await api.getRandomCase({ topicId, excludeId });
        const candidate = randomRes?.data || randomRes || null;
        if (candidate?.id && !played.has(String(candidate.id))) {
          targetCase = candidate;
          break;
        }
      }
      if (!targetCase) {
        showToast(t('sim.topicFinished', 'Bu mavzudagi keyslar tugadi'));
        return;
      }
      setDebriefData(null);
      setSelectedDetailCase(targetCase);
      checkLimitAndStartCase(targetCase, { skipGuide: true });
    } catch (err) {
      showToast(err?.message || t('sim.noNextCase', 'Keyingi keys topilmadi'));
    }
  };

  const handleStartSimulationFromHome = async ({ categoryId, topicId, difficulty } = {}) => {
    try {
      showToast(t('sim.preparingCase', 'Klinik keys tayyorlanmoqda...'));
      const randomRes = await api.getRandomCase({ categoryId, topicId, difficulty });
      const targetCase = randomRes?.data || randomRes || null;

      if (!targetCase) {
        showToast(t('common.error', "Xatolik yuz berdi"));
        return;
      }
      checkLimitAndStartCase(targetCase);
    } catch (err) {
      showToast(err?.status === 404
        ? t('sim.caseNotFound', 'Bu tanlovda klinik keys topilmadi')
        : (err?.message || t('common.error', "Xatolik yuz berdi")));
    }
  };

  const handleFinishSimulation = async (result) => {
    const sessionId = activeCase?.sessionId;
    const hasRealSession = Boolean(sessionId);
    const skipFinishApi = Boolean(result?.skipFinishApi || result?.sessionEnded);
    const skipDebriefWait = Boolean(result?.skipDebriefWait);

    try {
      if (!skipDebriefWait) {
        showToast(t('sim.finishingSim', 'Simulyatsiya yakunlanmoqda...'));
      }

      let finishResult = result?.finish_result || null;
      try {
        if (!skipFinishApi && hasRealSession) {
          finishResult = await api.finishSimulation(sessionId, result?.reason || 'manual');
        }
      } catch (err) {
        if (isSessionNotActiveError(err) && hasRealSession) {
          try {
            const sim = await api.getSimulation(sessionId);
            finishResult = finishResult || {
              session_id: sessionId,
              final_score: sim?.final_score,
              xp_earned: sim?.xp_earned,
              coins_earned: sim?.coins_earned,
              debrief_ready: true,
            };
          } catch {
            // already ended — continue to scores
          }
        } else if (!isSessionNotActiveError(err)) {
          console.warn('finishSimulation API error (continuing):', err.message);
        }
      }

      let sessionRec = null;
      if (hasRealSession) {
        try { sessionRec = await api.getSimulation(sessionId); } catch { /* optional */ }
      }
      const pick = (key, extra) => {
        const vals = [sessionRec?.[key], finishResult?.[key], extra]
          .filter((v) => typeof v === 'number');
        return vals.find((v) => v > 0) ?? vals[0] ?? 0;
      };
      const earnedXp = pick('xp_earned', result?.xp);
      const earnedCoins = pick('coins_earned', result?.coins);
      const usageTokens = [result?.tokens_used, finishResult?.tokens_used, sessionRec?.tokens_used]
        .find((v) => typeof v === 'number') ?? 0;
      const usageCoins = [result?.coins_spent, finishResult?.coins_spent, sessionRec?.coins_spent]
        .find((v) => typeof v === 'number') ?? 0;

      if (!result?.silent) {
        setDebriefData({
          final_score: pick('final_score', result?.score),
          xp_earned: earnedXp,
          coins_earned: earnedCoins,
          tokens_used: usageTokens,
          coins_spent: usageCoins,
          reason: result?.reason,
        });
      }

      // 6. Backenddan yangi profil va limit olish (haqiqiy qiymatlarni sinxronlash)
      try {
        const [freshProfile, freshLimit] = await Promise.all([
          api.getUserProfile().catch(() => null),
          api.getUserLimit().catch(() => null),
        ]);
        if (freshProfile) {
          setUser(freshProfile);
          setStoredUser(freshProfile);
        }
        if (freshLimit) {
          setUserLimit(freshLimit);
        }
        refreshWallet();
      } catch {
        // profile refresh failed — keep current values
      }

    } catch (err) {
      console.error('handleFinishSimulation error:', err);
      showToast(err?.message || t('common.error', "Xatolik yuz berdi"));
      setDebriefData({
        final_score: 0,
        xp_earned: 0,
        coins_earned: 0,
        tokens_used: 0,
        coins_spent: 0,
      });
    }
  };


  // 1. PUBLIC LANDING PAGE (If NOT authenticated)
  if (!isAuthenticated || showLandingGate) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <LandingPage
          onOpenLogin={() => (isAuthenticated ? setShowLandingGate(false) : setAuthModalOpen(true))}
          isAuthenticated={isAuthenticated}
          onLangChange={handleLangChange}
          lang={lang}
        />

        {/* Login / Auth Modal */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* Toast Notification */}
        {toast && (
          <div style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'rgba(15, 23, 42, 0.95)',
            border: '1px solid var(--accent-cyan)',
            borderRadius: 12,
            padding: '12px 20px',
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: 600,
            boxShadow: 'var(--shadow-sm)',
            zIndex: 2000,
            animation: 'fadeIn 0.25s ease-out',
          }}>
            {toast}
          </div>
        )}
      </div>
    );
  }

  // 2. AUTHENTICATED WORKSPACE (When logged in)
  return (
    <div className="app-workspace-layout" style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* 1. Desktop Persistent Sidebar (>= 1024px) & Tablet/Mobile Drawer (< 1024px) */}
      <Sidebar
        currentView={currentView}
        setCurrentView={(id) => {
          if (id === 'practice') setPracticeConfig({ mode: 'case', setup: true });
          setCurrentView(id);
        }}
        user={user}
        onOpenProfile={() => setCurrentView('profile')}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* 2. Main Content Wrapper */}
      <div className={`app-main-content-wrapper ${currentView === 'simulation' ? 'simulation-mode' : ''}`}>
        {/* Tablet & Mobile Header (Visible on screens < 1024px, hidden during simulation for maximum screen real estate) */}
        {currentView !== 'simulation' && (
          <TabletHeader
            currentView={currentView}
            user={user}
            onGoHome={() => setCurrentView('cases')}
            onOpenProfile={() => setCurrentView('profile')}
            onOpenNotifications={() => {
              if (currentView !== 'notifications') setNotificationsBackView(currentView);
              setCurrentView('notifications');
            }}
            unreadCount={notifications.filter(n => !n.is_read).length}
          />
        )}

        {currentView !== 'simulation' && <PushBanner />}

        {/* Internal Views */}
        <main>
          {/* Dashboard Home View with Greeting, Hero Banner Slider, and 4 Stat Cards */}
          {currentView === 'cases' && (
            <HomeView
              user={user}
              wallet={wallet}
              categories={categories}
              banners={banners}
              topicsCount={topicTotal}
              userLimit={userLimit}
              flashcardStats={flashcardStats}
              onStartPractice={(cfg) => openPractice(cfg || { mode: 'case', setup: true })}
              onOpenClinics={() => setCurrentView('clinics')}
              onOpenStore={() => setCurrentView('store')}
              onOpenFlashcards={() => setCurrentView('flashcards')}
              onOpenKnowledgeMap={() => setCurrentView('knowledge_map')}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setCurrentView('roadmap');
              }}
            />
          )}

        {/* Live Interactive Case Simulation Room with Real Hospital Monitor */}
        {currentView === 'simulation' && (
          <CaseSimulationRoom
            key={activeCase?.sessionId || 'sim'}
            caseItem={activeCase || cases[0]}
            onExitSimulation={() => setCurrentView('cases')}
            onFinishCase={handleFinishSimulation}
            onNextCase={() => handleNextCase(activeCase)}
            onToast={showToast}
            onInsufficientCoins={() => {
              showToast(t('sim.insufficientCoins', 'Tangalar yetarli emas'));
              setStoreInitialTab('coins');
              api.getUserProfile().then((p) => { if (p) { setUser(p); setStoredUser(p); } }).catch(() => {});
            }}
          />
        )}

        {/* Tariffs & Store View */}
        {(currentView === 'store' || currentView === 'tariffs') && (
          <StoreTariffs
            tariffs={tariffs}
            user={user}
            userLimit={userLimit}
            wallet={wallet}
            onUserUpdate={setUser}
            onBack={() => setCurrentView('profile')}
            initialTab={storeInitialTab}
          />
        )}

        {/* Leaderboard View */}
        {currentView === 'leaderboard' && (
          <Leaderboard user={user} onBack={() => setCurrentView('profile')} />
        )}

        {/* Profile & Settings View (Figma mobile design) */}
        {currentView === 'profile' && (
          <ProfileView
            user={user}
            wallet={wallet}
            userLimit={userLimit}
            tariffs={tariffs}
            onRefreshLimit={handleRefreshLimit}
            onUserUpdate={setUser}
            onOpenStore={(tab) => {
              setStoreInitialTab(tab || 'all');
              setCurrentView('store');
            }}
            onNavigate={(view) => {
              setCurrentView(view);
            }}
            lang={lang}
            onLangChange={handleLangChange}
            onLogout={handleLogout}
          />
        )}

        {/* Clinics / Cases Hub View (Bo'limlar) */}
        {currentView === 'clinics' && (
          <CategoriesView
            categories={categories}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setCurrentView('roadmap');
            }}
            onBack={() => setCurrentView('cases')}
          />
        )}

        {/* Category Roadmap View (Duolingo-style segmented nodes from API) */}
        {currentView === 'roadmap' && (
          <RoadmapView
            category={selectedCategory || categories[0]}
            onStartPractice={openPractice}
            onBack={() => setCurrentView('clinics')}
          />
        )}

        {/* --- New Profile Inner Views --- */}
        {currentView === 'notifications' && (
          <NotificationsView
            onBack={() => setCurrentView(notificationsBackView || 'cases')}
            onRefreshNotifications={async () => {
              try {
                const res = await api.getNotifications();
                if (res) setNotifications(res?.notifications || res?.items || []);
              } catch { /* silent */ }
            }}
          />
        )}
        {currentView === 'practice' && (
          <PracticeView
            key={JSON.stringify(practiceConfig) || 'practice'}
            categories={categories}
            initialConfig={practiceConfig}
            onBack={() => { setPracticeConfig(null); setCurrentView('cases'); }}
            onToast={showToast}
            onInsufficientCoins={openStoreForCoins}
            onOpenFlashcards={() => setCurrentView('flashcards')}
            onWalletRefresh={refreshWallet}
          />
        )}

        {currentView === 'flashcards' && (
          <FlashcardsView
            categories={categories}
            onBack={() => setCurrentView('cases')}
            onToast={showToast}
            onInsufficientCoins={openStoreForCoins}
          />
        )}

        {currentView === 'knowledge_map' && (
          <KnowledgeMapView
            onBack={() => setCurrentView('cases')}
            onToast={showToast}
            onInsufficientCoins={openStoreForCoins}
            onStartPractice={(cfg) => openPractice(cfg)}
            onOpenFlashcards={() => setCurrentView('flashcards')}
          />
        )}
      </main>

      <footer className="app-workspace-footer">
        <SiteCredit />
      </footer>
    </div>

      {/* Modals */}

      {debriefData && (
        <DebriefModal
          debriefData={debriefData}
          onClose={async () => {
            const endedForCoins = debriefData?.reason === 'insufficient_coins';
            setDebriefData(null);
            if (endedForCoins) {
              setStoreInitialTab('coins');
              setCurrentView('store');
            }
            // Profil va limitni backend dan yangilash
            try {
              const [freshProfile, freshLimit] = await Promise.all([
                api.getUserProfile().catch(() => null),
                api.getUserLimit().catch(() => null),
              ]);
              if (freshProfile) { setUser(freshProfile); setStoredUser(freshProfile); }
              if (freshLimit) setUserLimit(freshLimit);
            } catch { /* lokal qiymatlar saqlanadi */ }
          }}
          onRetryCase={() => {
            setDebriefData(null);
            if (activeCase) checkLimitAndStartCase(activeCase);
          }}
          onNextCase={() => handleNextCase(activeCase)}
        />
      )}

      {profileModalOpen && (
        <ProfileModal
          user={user}
          onClose={() => setProfileModalOpen(false)}
          onLogout={handleLogout}
          onOpenStore={() => {
            setProfileModalOpen(false);
            setCurrentView('store');
          }}
          faqs={faqs}
          contacts={contacts}
          abouts={abouts}
        />
      )}

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        onConfirm={handleConfirmLogout}
        user={user}
      />

      {/* Quick Guide Modal */}
      {showQuickGuide && (
        <QuickGuideModal
          onProceed={() => {
            setShowQuickGuide(false);
            setCurrentView('simulation');
          }}
        />
      )}

      {/* Free Tier Exhausted / Coins Gatekeeper Modal */}
      {limitModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 16,
          boxSizing: 'border-box',
          fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
          animation: 'fadeIn 0.2s ease-out',
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: 18,
            border: '1px solid #E2E8F0',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25), 0 6px 0 #E2E8F0',
            maxWidth: 480,
            width: '100%',
            padding: '28px 24px',
            position: 'relative',
            boxSizing: 'border-box',
          }}>
            {/* Close button */}
            <button
              onClick={() => setLimitModal(null)}
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#F1F5F9',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748B',
              }}
            >
              <X size={18} />
            </button>

            {limitModal.type === 'spend_coins' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: 18,
                    background: '#FEF3C7',
                    border: '1px solid #FDE68A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '26px',
                  }}>
                    🪙
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '19px', fontWeight: 700, color: '#0F172A' }}>
                      {t('limitModal.continueWithCoins', 'Tanga orqali davom etish')}
                    </h3>
                    <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: '#64748B', fontWeight: 600 }}>
                      {t('limitModal.freeLimitExhausted', 'Bugungi bepul urinishlar limiti tugagan')}
                    </p>
                  </div>
                </div>

                <div style={{
                  background: '#F8FAFC',
                  borderRadius: 18,
                  border: '1px solid #E2E8F0',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <span style={{ color: '#64748B', fontWeight: 600 }}>{t('limitModal.selectedCase', 'Tanlangan keys:')}</span>
                    <span style={{ color: '#0F172A', fontWeight: 700, maxWidth: 240, textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {limitModal.caseItem?.title || t('case.title', 'Klinik keys')}
                    </span>
                  </div>
                  <div style={{ width: '100%', height: 1, background: '#E2E8F0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <span style={{ color: '#64748B', fontWeight: 600 }}>{t('limitModal.yourBalance', 'Sizning balansingiz:')}</span>
                    <span style={{ color: '#16A34A', fontWeight: 700 }}>
                      🪙 {limitModal.userCoins} {t('nav.coins', 'tanga')}
                    </span>
                  </div>
                  {typeof limitModal.coinsPer1k === 'number' && limitModal.coinsPer1k > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                      <span style={{ color: '#64748B', fontWeight: 600 }}>{t('limitModal.rateLabel', 'Tarif:')}</span>
                      <span style={{ color: '#475569', fontWeight: 700 }}>
                        {limitModal.coinsPer1k} / 1k token
                      </span>
                    </div>
                  )}
                </div>

                <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                  {t('limitModal.continueWithCoinsDesc', "AI ishlatganicha tanga yechiladi. Balans 0 bo'lsa sessiya to'xtaydi. Cheksiz kirish uchun Premium obuna ham mumkin.")}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
                  <button
                    id="btn-spend-coins-confirm"
                    onClick={() => {
                      const target = limitModal.caseItem;
                      if (!(limitModal.userCoins > 0)) {
                        setLimitModal(null);
                        setStoreInitialTab('coins');
                        setCurrentView('store');
                        return;
                      }
                      setLimitModal(null);
                      startBackendSession(target, { useCoins: true }).then((ok) => {
                        if (!ok) return;
                        if (!limitModal?.skipGuide) setShowQuickGuide(true);
                        api.getUserProfile().then(p => { if (p) { setUser(p); setStoredUser(p); } }).catch(() => {});
                      });
                    }}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: 16,
                      background: '#16A34A',
                      border: '1px solid #15803D',
                      boxShadow: 'var(--shadow-sm)',
                      color: '#FFFFFF',
                      fontSize: '15px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <span>🪙 {limitModal.userCoins > 0
                      ? t('limitModal.startWithCoins', 'Tanga hisobidan boshlash')
                      : t('limitModal.buyCoins', 'Tanga sotib olish')}</span>
                  </button>
                </div>
              </div>
            ) : (
              // CASE B: User does NOT have enough coins (Out of coins & free attempts)
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: 18,
                    background: '#FEE2E2',
                    border: '1px solid #FECACA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '26px',
                  }}>
                    🔒
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '19px', fontWeight: 700, color: '#0F172A' }}>
                      {t('limitModal.outOfLimitAndCoins', 'Bepul limit va tangalar tugadi')}
                    </h3>
                    <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: '#DC2626', fontWeight: 700 }}>
                      {t('limitModal.needCoinsOrPremium', 'Keysni ochish uchun Premium yoki tanga kerak')}
                    </p>
                  </div>
                </div>

                <div style={{
                  background: '#FEF2F2',
                  borderRadius: 18,
                  border: '1px solid #FECACA',
                  padding: '14px 16px',
                  fontSize: '13px',
                  color: '#991B1B',
                  lineHeight: 1.5,
                }}>
                  {t('limitModal.outOfCoinsMessage', 'Bugungi bepul urinishlar limitingiz tugagan.')} {t('limitModal.youHave', 'Sizda hozir:')} <strong>🪙 {limitModal.userCoins} {t('nav.coins', 'tanga')}</strong>. {t('limitModal.needCoinsForAi', "Davom etish uchun tanga yoki Premium kerak.")}
                </div>

                {/* Recommendations */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {t('limitModal.recommendedSolutions', 'Tavsiya etiladigan yechimlar:')}
                  </div>

                  <div
                    id="recommend-premium-card"
                    onClick={() => {
                      setLimitModal(null);
                      setCurrentView('store');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: 16,
                      background: '#FFFFFF',
                      border: '1px solid #22C55E',
                      boxShadow: 'var(--shadow-sm)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        background: '#DCFCE7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#16A34A',
                        fontWeight: 700,
                      }}>
                        👑
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                          {t('limitModal.buyPremium', 'Premium Obuna xarid qilish')}
                        </div>
                        <div style={{ fontSize: '12px', color: '#16A34A', fontWeight: 700 }}>
                          {t('limitModal.unlimitedAllCases', 'Barcha keyslarga 100% cheksiz kirish')}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={18} color="#16A34A" />
                  </div>

                  <div
                    id="recommend-coins-card"
                    onClick={() => {
                      setLimitModal(null);
                      setCurrentView('store');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: 16,
                      background: '#FFFBEB',
                      border: '1px solid #FDE68A',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        background: '#FEF3C7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#D97706',
                        fontWeight: 700,
                      }}>
                        🪙
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                          {t('limitModal.buyCoins', 'Tanga paketi sotib olish')}
                        </div>
                        <div style={{ fontSize: '12px', color: '#B45309', fontWeight: 600 }}>
                          {t('limitModal.coinPackages', '50, 150 yoki 500 tanga paketlari')}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={18} color="#D97706" />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button
                    onClick={() => setLimitModal(null)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: 16,
                      background: '#F1F5F9',
                      border: '1px solid #CBD5E1',
                      color: '#475569',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {t('common.close', 'Yopish')}
                  </button>

                  <button
                    id="btn-goto-tariffs-primary"
                    onClick={() => {
                      setLimitModal(null);
                      setCurrentView('store');
                    }}
                    style={{
                      flex: 2,
                      padding: '12px',
                      borderRadius: 16,
                      background: '#16A34A',
                      border: '1px solid #15803D',
                      boxShadow: 'var(--shadow-sm)',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <span>{t('limitModal.viewTariffs', "Tariflarni ko'rish")}</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid var(--accent-cyan)',
          borderRadius: 12,
          padding: '12px 20px',
          color: '#fff',
          fontSize: '0.9rem',
          fontWeight: 600,
          boxShadow: 'var(--shadow-sm)',
          zIndex: 2000,
          animation: 'fadeIn 0.25s ease-out',
        }}>
          {toast}
        </div>
      )}

      {/* Bottom Navigation Bar matching Figma mobile design (hidden during simulation) */}
      {currentView !== 'simulation' && (
        <BottomNavBar
          currentView={currentView}
          onSelectView={(view) => {
            setCurrentView(view);
          }}
        />
      )}
    </div>
  );
}
