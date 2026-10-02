import React, { useEffect, useState } from 'react';
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
  registerStoredFcmDevice,
} from './api';
// Views
import { autoEnablePush, onForegroundPush } from './utils/push';
import LandingPage from './views/LandingPage';
import HomeView from './views/HomeView';
import CategoriesView from './views/CategoriesView';
import RoadmapView from './views/RoadmapView';
import CaseDetailsView from './views/CaseDetailsView';
import CaseSimulationRoom from './views/CaseSimulationRoom';
import Leaderboard from './views/Leaderboard';
import ProfileView from './views/ProfileView';
import FavoritesView from './views/FavoritesView.jsx';
import ActivityView from './views/ActivityView.jsx';
import NotificationsView from './views/NotificationsView.jsx';
import StudyPlanView from './views/StudyPlanView.jsx';
import StoreTariffs from './views/StoreTariffs';

// Layout
import BottomNavBar from './components/layout/BottomNavBar';
import Sidebar from './components/layout/Sidebar.jsx';
import TabletHeader from './components/layout/TabletHeader.jsx';

// Modals
import AuthModal from './components/modals/AuthModal';
import LogoutConfirmModal from './components/modals/LogoutConfirmModal';
import ProfileModal from './components/modals/ProfileModal';
import QuickGuideModal from './components/modals/QuickGuideModal';
import DebriefModal from './components/modals/DebriefModal';

// Common UI
import PreparingCaseLoader from './components/common/PreparingCaseLoader';

import {
  Crown,
  ChevronRight,
  X,
} from 'lucide-react';
import { useTranslation } from './i18n.jsx';

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

  const [currentView, setCurrentView] = useState('cases'); // 'cases' | 'simulation' | 'store' | 'leaderboard'
  const [activeMode, setActiveMode] = useState('clinical'); // 'clinical' | 'citizen'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [caseDetailBackView, setCaseDetailBackView] = useState('roadmap');

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
      if (currentView === 'case-details') {
        setCurrentView(caseDetailBackView || 'roadmap');
      } else if (currentView === 'roadmap') {
        setCurrentView('clinics');
      } else if (currentView === 'clinics') {
        setCurrentView('cases');
      } else if (currentView === 'simulation') {
        setCurrentView('cases');
      } else if (['favorites', 'activity', 'notifications', 'study_plan', 'leaderboard', 'store', 'tariffs'].includes(currentView)) {
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
  }, [currentView, sidebarOpen]);

  // Foreground push: refresh the in-app notification list when a message arrives
  useEffect(() => {
    if (!isAuthenticated) return;
    let unsub = () => {};
    let cancelled = false;
    autoEnablePush();
    onForegroundPush(() => {
      api.getNotifications().then((res) => setNotifications(res?.notifications || [])).catch(() => {});
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
  const [cases, setCases] = useState([]);
  const [tariffs, setTariffs] = useState([]);
  const [partners, setPartners] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [abouts, setAbouts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [userLimit, setUserLimit] = useState(null);

  // Active Simulation states
  const [activeCase, setActiveCase] = useState(null);
  const [selectedDetailCase, setSelectedDetailCase] = useState(null);
  const [debriefData, setDebriefData] = useState(null);

  // Roadmap & Case Flow states
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedRoadmapNode, setSelectedRoadmapNode] = useState(null);
  const [isPreparingCase, setIsPreparingCase] = useState(false);
  const [showQuickGuide, setShowQuickGuide] = useState(false);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
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
        const fresh = await api.getUserLimit();
        if (fresh) setUserLimit(fresh);
        return fresh;
      } catch (err) {
        console.warn('Refresh limit error:', err);
      }
    }
    return null;
  };

  // Initial Data Fetch
  useEffect(() => {
    let isMounted = true;

    async function loadAllData() {
      if (!isAuthenticated) return;

      try {
        const [
          profileData,
          catsData,
          casesData,
          limitData,
          tariffsData,
          partnersData,
          faqsData,
          aboutsData,
          contactsData,
          bannersData,
          notifData
        ] = await Promise.all([
          api.getUserProfile().catch(() => null),
          api.getCategories().catch(() => []),
          api.getCases().catch(() => []),
          api.getUserLimit().catch(() => null),
          api.getTariffs().catch(() => []),
          api.getPartners().catch(() => []),
          api.getFaqs().catch(() => []),
          api.getAbout().catch(() => []),
          api.getContacts().catch(() => []),
          api.getBanners().catch(() => []),
          api.getNotifications().catch(() => ({ count: 0, notifications: [] })),
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
          if (partnersData && partnersData.length) setPartners(partnersData);
          if (faqsData && faqsData.length) setFaqs(faqsData);
          if (aboutsData && aboutsData.length) setAbouts(aboutsData);
          if (contactsData && contactsData.length) setContacts(contactsData);
          if (bannersData && bannersData.length) setBanners(bannersData);
          if (notifData) setNotifications(notifData?.notifications || []);
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
    const checkAndSyncLimit = async () => {
      const today = getTodayDateStr();
      const lastChecked = localStorage.getItem('tibcase_last_limit_date');

      if (!lastChecked || lastChecked !== today) {
        localStorage.setItem('tibcase_last_limit_date', today);
        if (isAuthenticated) {
          try {
            const freshLimit = await api.getUserLimit();
            if (freshLimit) setUserLimit(freshLimit);
          } catch { /* keep existing */ }
        }
      } else if (isAuthenticated && !userLimit) {
        // If logged in and limit state is empty, fetch it
        api.getUserLimit().then(lim => {
          if (lim) setUserLimit(lim);
        }).catch(() => {});
      }
    };

    checkAndSyncLimit();

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        checkAndSyncLimit();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);
    const interval = setInterval(checkAndSyncLimit, 60000); // 1 minute ticker to catch midnight rollover

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      clearInterval(interval);
    };
  }, [isAuthenticated, userLimit]);

  // Auth Handlers
  const handleLoginSuccess = async (loggedInUser) => {
    setUser(loggedInUser);
    setStoredUser(loggedInUser);
    setIsAuthenticated(true);
    localStorage.setItem('tibcase_authenticated', 'true');
    setCurrentView('cases');
    showToast(`Xush kelibsiz, ${loggedInUser.name || ''}!`);

    // Refresh full profile & daily limit from API
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
        localStorage.setItem('tibcase_last_limit_date', getTodayDateStr());
      }
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
  const startBackendSession = async (caseItem) => {
    if (!caseItem?.id) {
      showToast(t('common.error', "Xatolik yuz berdi"));
      return false;
    }
    try {
      const session = await api.startSimulation(caseItem.id);
      if (!session?.session_id) throw new Error('session_id missing');
      setActiveCase({
        ...caseItem,
        sessionId: session.session_id,
        health_percent: session.health_percent,
        initial_vitals: session.initial_vitals,
        time_limit_seconds: session.time_limit_seconds || 0,
        startedAt: Date.now(),
      });
      // Sync limit/profile from backend instead of guessing locally
      api.getUserLimit().then(lim => { if (lim) setUserLimit(lim); }).catch(() => {});
      return true;
    } catch (err) {
      showToast(err?.message || t('common.error', "Xatolik yuz berdi"));
      return false;
    }
  };

  const handleStartSimulation = async (caseItem) => {
    const ok = await startBackendSession(caseItem);
    if (ok) setCurrentView('simulation');
  };

  // Free Tier Limit & Coins Gatekeeper
  const checkLimitAndStartCase = async (caseItem) => {
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
      if (ok) setIsPreparingCase(true);
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

    // 3. Free daily limit is exhausted (0 remaining) -> Check coins!
    const caseCost = target.coins_price || target.coins || target.coin_cost || 0;
    const userCoins = user?.coins || 0;

    if (userCoins >= caseCost) {
      setLimitModal({
        type: 'spend_coins',
        caseItem: target,
        caseCost,
        userCoins,
      });
    } else {
      setLimitModal({
        type: 'out_of_coins',
        caseItem: target,
        caseCost,
        userCoins,
      });
    }
  };

  const handleStartSimulationFromHome = async ({ categoryId }) => {
    try {
      showToast("Klinik keys tayyorlanmoqda...");
      let targetCase = null;

      if (categoryId && categoryId !== 'random') {
        const catCases = await api.getCases({ category_id: categoryId });
        if (catCases && catCases.length > 0) {
          targetCase = catCases[Math.floor(Math.random() * catCases.length)];
        }
      }

      if (!targetCase) {
        const randomRes = await api.getRandomCase();
        targetCase = randomRes?.data || randomRes || null;
      }

      if (!targetCase) {
        showToast(t('common.error', "Xatolik yuz berdi"));
        return;
      }
      checkLimitAndStartCase(targetCase);
    } catch (err) {
      showToast(err?.message || t('common.error', "Xatolik yuz berdi"));
    }
  };

  const handleFinishSimulation = async (result) => {
    const sessionId = activeCase?.sessionId;
    const hasRealSession = Boolean(sessionId);
    const skipFinishApi = Boolean(result?.skipFinishApi || result?.sessionEnded);

    try {
      showToast("Simulyatsiya yakunlanmoqda...");

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
            // already ended — continue to debrief
          }
        } else if (!isSessionNotActiveError(err)) {
          console.warn('finishSimulation API error (continuing):', err.message);
        }
      }

      // 2. AI Debriefing hisobotini olish
      showToast("AI Debriefing hisoboti tayyorlanmoqda...");
      let debrief = null;
      if (hasRealSession) {
        try {
          debrief = await api.getDebrief(sessionId);
        } catch (err) {
          console.warn('getDebrief API error:', err.message);
        }
      }

      // 3. Faqat backenddan kelgan qiymatlar
      // The debrief can be generated before rewards are booked, so also read the
      // final session record and use the first source that reports a positive value.
      let sessionRec = null;
      if (hasRealSession) {
        try { sessionRec = await api.getSimulation(sessionId); } catch { /* optional */ }
      }
      const pick = (key) => {
        const vals = [sessionRec?.[key], finishResult?.[key], debrief?.[key]].filter((v) => typeof v === 'number');
        return vals.find((v) => v > 0) ?? vals[0] ?? 0;
      };
      const earnedXp = pick('xp_earned');
      const earnedCoins = pick('coins_earned');
      console.info('[simulation] rewards', { session: sessionRec && { xp: sessionRec.xp_earned, coins: sessionRec.coins_earned, status: sessionRec.status }, finish: finishResult && { xp: finishResult.xp_earned, coins: finishResult.coins_earned }, debrief: debrief && { xp: debrief.xp_earned, coins: debrief.coins_earned } });

      setDebriefData({
        correct_steps: [],
        incorrect_steps: [],
        weak_topics: [],
        guideline_notes: '',
        ...(debrief || {}),
        final_score: debrief?.final_score ?? sessionRec?.final_score ?? finishResult?.final_score ?? 0,
        xp_earned: earnedXp,
        coins_earned: earnedCoins,
      });

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
        correct_steps: [],
        incorrect_steps: [],
        weak_topics: [],
        guideline_notes: ""
      });
    }
  };


  const handleToggleFavorite = async (caseId) => {
    if (!caseId) return;
    try {
      const res = await api.toggleFavorite(String(caseId));
      const isFav = res?.is_favorite ?? res?.data?.is_favorite;
      setCases(prev => prev.map(c => (String(c.id) === String(caseId) || String(c._id) === String(caseId))
        ? { ...c, is_favorite: isFav !== undefined ? isFav : !c.is_favorite }
        : c
      ));
      setSelectedDetailCase(prev => {
        if (prev && (String(prev.id) === String(caseId) || String(prev._id) === String(caseId))) {
          return { ...prev, is_favorite: isFav !== undefined ? isFav : !prev.is_favorite };
        }
        return prev;
      });
      showToast(isFav ? t('fav.added', "Keys saqlanganlarga qo'shildi") : t('fav.removed', "Keys saqlanganlardan olib tashlandi"));
      return isFav;
    } catch (err) {
      console.error('Toggle favorite error:', err);
      showToast(t('common.error', "Xatolik yuz berdi"));
    }
  };


  // 1. PUBLIC LANDING PAGE (If NOT authenticated)
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <LandingPage
          onOpenLogin={() => setAuthModalOpen(true)}
          partners={partners}
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
            zIndex: 100,
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
    <div className="app-workspace-layout" style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      {/* 1. Desktop Persistent Sidebar (>= 1024px) & Tablet/Mobile Drawer (< 1024px) */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
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
            onToggleSidebar={() => setSidebarOpen(true)}
            onOpenNotifications={() => setCurrentView('notifications')}
            unreadCount={notifications.filter(n => !n.is_read).length}
          />
        )}

        {/* Internal Views */}
        <main style={{ flex: 1, width: '100%' }}>
          {/* Dashboard Home View with Greeting, Hero Banner Slider, and 3 Stat Cards */}
          {currentView === 'cases' && (
            <HomeView
              user={user}
              categories={categories}
              banners={banners}
              userLimit={userLimit}
              onStartSimulation={handleStartSimulationFromHome}
              onOpenClinics={() => setCurrentView('clinics')}
              onOpenStore={() => setCurrentView('store')}
              onOpenLeaderboard={() => setCurrentView('leaderboard')}
            />
          )}

        {/* Live Interactive Case Simulation Room with Real Hospital Monitor */}
        {currentView === 'simulation' && (
          <CaseSimulationRoom
            caseItem={activeCase || cases[0]}
            onExitSimulation={() => setCurrentView('cases')}
            onFinishCase={handleFinishSimulation}
          />
        )}

        {/* Tariffs & Store View */}
        {(currentView === 'store' || currentView === 'tariffs') && (
          <StoreTariffs
            tariffs={tariffs}
            user={user}
            userLimit={userLimit}
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
            userLimit={userLimit}
            onRefreshLimit={handleRefreshLimit}
            onUserUpdate={setUser}
            onOpenStore={(tab) => {
              setStoreInitialTab(tab || 'all');
              setCurrentView('store');
            }}
            onNavigate={(view) => setCurrentView(view)}
            lang={lang}
            onLangChange={handleLangChange}
            onLogout={handleLogout}
          />
        )}

        {/* Clinics / All Categories View (Only real API categories) */}
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
            onSelectNode={(caseItem) => {
              setCaseDetailBackView('roadmap');
              setSelectedDetailCase(caseItem);
              setSelectedRoadmapNode(caseItem);
              setCurrentView('case-details');
            }}
            onBack={() => setCurrentView('clinics')}
          />
        )}

        {/* Case Details View (Real API case data) */}
        {currentView === 'case-details' && (
          <CaseDetailsView
            caseItem={selectedDetailCase || cases[0]}
            onStartCase={() => checkLimitAndStartCase(selectedDetailCase || cases[0])}
            onBack={() => setCurrentView(caseDetailBackView || 'roadmap')}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {/* --- New Profile Inner Views --- */}
        {currentView === 'favorites' && (
          <FavoritesView 
            onBack={() => setCurrentView('profile')}
            onSelectCase={(c) => {
              setCaseDetailBackView('favorites');
              setSelectedDetailCase({ ...c, is_favorite: true });
              setCurrentView('case-details');
            }}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
        {currentView === 'activity' && (
          <ActivityView onBack={() => setCurrentView('profile')} />
        )}
        {currentView === 'notifications' && (
          <NotificationsView
            onBack={() => setCurrentView('profile')}
            onRefreshNotifications={async () => {
              try {
                const res = await api.getNotifications();
                if (res) setNotifications(res?.notifications || []);
              } catch { /* silent */ }
            }}
          />
        )}
        {currentView === 'study_plan' && (
          <StudyPlanView onBack={() => setCurrentView('profile')} />
        )}
      </main>

      {/* Workspace Footer */}
      <footer style={{
        marginTop: 40,
        padding: '24px 0 10px 0',
        borderTop: '1px solid #E2E8F0',
        background: 'transparent',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: '#64748B',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div>© 2026 <strong>TibCase AI</strong>. Shifokorlar va Talabalar uchun Virtual Klinik Simulyator.</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <span style={{ color: '#16A34A', fontWeight: 700 }}>AHA & ESC Standartlari</span>
          </div>
        </div>
      </footer>
    </div>

      {/* Modals */}

      {debriefData && (
        <DebriefModal
          debriefData={debriefData}
          onClose={async () => {
            setDebriefData(null);
            setCurrentView('cases');
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
            if (activeCase) handleStartSimulation(activeCase);
          }}
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

      {/* Toast Notification */}
      {/* Preparing Case Loading Screen (Screenshot 4) */}
      {isPreparingCase && (
        <PreparingCaseLoader
          duration={2000}
          onFinish={() => {
            setIsPreparingCase(false);
            setShowQuickGuide(true);
          }}
        />
      )}

      {/* Quick Guide Modal (Screenshot 5) */}
      {showQuickGuide && (
        <QuickGuideModal
          onProceed={() => {
            setShowQuickGuide(false);
            setCurrentView('simulation');
          }}
          onSkip={() => {
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
              // CASE A: User has enough coins to spend on this case
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
                      Tanga orqali davom etish
                    </h3>
                    <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: '#64748B', fontWeight: 600 }}>
                      Bugungi bepul urinishlar limiti tugagan (0/3)
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
                    <span style={{ color: '#64748B', fontWeight: 600 }}>Tanlangan keys:</span>
                    <span style={{ color: '#0F172A', fontWeight: 700, maxWidth: 240, textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {limitModal.caseItem?.title || 'Klinik keys'}
                    </span>
                  </div>
                  <div style={{ width: '100%', height: 1, background: '#E2E8F0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
                    <span style={{ color: '#64748B', fontWeight: 600 }}>Keys narxi:</span>
                    <span style={{ color: '#D97706', fontWeight: 700 }}>
                      🪙 {limitModal.caseCost} tanga
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <span style={{ color: '#64748B', fontWeight: 600 }}>Sizning balansingiz:</span>
                    <span style={{ color: '#16A34A', fontWeight: 700 }}>
                      🪙 {limitModal.userCoins} tanga (qoladi: {limitModal.userCoins - limitModal.caseCost})
                    </span>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                  Ushbu keysni hisobingizdagi tangalarni sarflab yechishingiz yoki cheksiz keyslar uchun Premium obunaga o'tishingiz mumkin.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
                  <button
                    id="btn-spend-coins-confirm"
                    onClick={() => {
                      const cost = limitModal.caseCost;
                      const target = limitModal.caseItem;
                      setLimitModal(null);
                      startBackendSession(target).then((ok) => {
                        if (!ok) return;
                        setIsPreparingCase(true);
                        api.getUserProfile().then(p => { if (p) { setUser(p); setStoredUser(p); } }).catch(() => {});
                        showToast(`🪙 ${cost} tanga sarflandi. Simulyatsiya boshlandi!`);
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
                    <span>🪙 {limitModal.caseCost} Tanga sarflab boshlash</span>
                  </button>

                  <button
                    id="btn-open-tariffs-from-limit"
                    onClick={() => {
                      setLimitModal(null);
                      setCurrentView('store');
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: 16,
                      background: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      color: '#2563EB',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <Crown size={16} />
                    <span>👑 Cheksiz kirish (Premium Obunalar)</span>
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
                      Bepul limit va tangalar tugadi
                    </h3>
                    <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: '#DC2626', fontWeight: 700 }}>
                      Keysni ochish uchun Premium yoki tanga kerak
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
                  Bugungi bepul <strong>3 ta urinish</strong> limitingiz tugagan. Ushbu keys narxi <strong>🪙 {limitModal.caseCost} tanga</strong>, sizda esa hozir <strong>🪙 {limitModal.userCoins} tanga</strong> mavjud.
                </div>

                {/* Recommendations */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Tavsiya etiladigan yechimlar:
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
                          Premium Obuna xarid qilish
                        </div>
                        <div style={{ fontSize: '12px', color: '#16A34A', fontWeight: 700 }}>
                          Barcha keyslarga 100% cheksiz kirish
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
                          Tanga paketi sotib olish
                        </div>
                        <div style={{ fontSize: '12px', color: '#B45309', fontWeight: 600 }}>
                          50, 150 yoki 500 tanga paketlari
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
                    Yopish
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
                    <span>Tariflarni ko'rish</span>
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
          zIndex: 100,
          animation: 'fadeIn 0.25s ease-out',
        }}>
          {toast}
        </div>
      )}

      {/* Bottom Navigation Bar matching Figma mobile design (hidden during simulation) */}
      {currentView !== 'simulation' && (
        <BottomNavBar
          currentView={currentView}
          onSelectView={(view) => setCurrentView(view)}
        />
      )}
    </div>
  );
}
