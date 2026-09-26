import React, { useEffect, useState } from 'react';
import {
  api,
  getLang,
  setLang,
  getToken,
  getRefreshToken,
  getStoredUser,
  setToken,
  setRefreshToken,
  setStoredUser,
  setOnUnauthorized
} from './api';
import LandingPage from './components/LandingPage';
import AppNavbar from './components/AppNavbar';
import CasesCatalog from './components/CasesCatalog';
import SimulationRoom from './components/SimulationRoom';
import CaseSimulationRoom from './components/CaseSimulationRoom';
import DebriefModal from './components/DebriefModal';
import StoreTariffs from './components/StoreTariffs';
import Leaderboard from './components/Leaderboard';
import ProfileModal from './components/ProfileModal';
import ProfileView from './components/ProfileView';
import BottomNavBar from './components/BottomNavBar';
import CategoriesView from './components/CategoriesView';
import RoadmapView from './components/RoadmapView';
import CaseDetailsView from './components/CaseDetailsView';
import PreparingCaseLoader from './components/PreparingCaseLoader';
import QuickGuideModal from './components/QuickGuideModal';
import AuthModal from './components/AuthModal';
import LogoutConfirmModal from './components/LogoutConfirmModal';
import HomeView from './components/HomeView';
import FavoritesView from './components/FavoritesView.jsx';
import ActivityView from './components/ActivityView.jsx';
import NotificationsView from './components/NotificationsView.jsx';
import StudyPlanView from './components/StudyPlanView.jsx';
import AiReportsView from './components/AiReportsView.jsx';
import Sidebar from './components/Sidebar.jsx';
import TabletHeader from './components/TabletHeader.jsx';

import { Crown, Coins, Lock, ShieldAlert, Sparkles, ChevronRight, X } from 'lucide-react';
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

  // Initialize Telegram Web App SDK
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      try {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
      } catch (err) {
        console.warn('Telegram WebApp initialization error:', err);
      }
    }
  }, []);

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

  // Initial Data Fetch
  useEffect(() => {
    let isMounted = true;

    async function loadAllData() {
      // Only fetch protected endpoints if authenticated
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
          bannersData
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
          if (limitData) setUserLimit(limitData);
          if (tariffsData && tariffsData.length) setTariffs(tariffsData);
          if (partnersData && partnersData.length) setPartners(partnersData);
          if (faqsData && faqsData.length) setFaqs(faqsData);
          if (aboutsData && aboutsData.length) setAbouts(aboutsData);
          if (contactsData && contactsData.length) setContacts(contactsData);
          if (bannersData && bannersData.length) setBanners(bannersData);
        }
      } catch (err) {
        console.warn('Data load handled:', err.message);
      }
    }

    loadAllData();

    return () => { isMounted = false; };
  }, [lang, isAuthenticated]);

  // Auth Handlers
  const handleLoginSuccess = async (loggedInUser) => {
    setUser(loggedInUser);
    setStoredUser(loggedInUser);
    setIsAuthenticated(true);
    localStorage.setItem('tibcase_authenticated', 'true');
    setCurrentView('cases');
    showToast(`Xush kelibsiz, ${loggedInUser.name || ''}!`);

    // Refresh full profile from API
    try {
      const freshProfile = await api.getUserProfile();
      if (freshProfile) {
        setUser(freshProfile);
        setStoredUser(freshProfile);
      }
    } catch { /* use whatever came from login */ }
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
  const handleStartSimulation = async (caseItem) => {
    try {
      showToast("Simulyatsiya xonasi ochilmoqda...");
      const session = await api.startSimulation(caseItem.id);
      setActiveCase({
        ...caseItem,
        sessionId: session?.session_id || 'sim-' + Date.now()
      });
      setCurrentView('simulation');
    } catch {
      setActiveCase({
        ...caseItem,
        sessionId: 'sim-' + Date.now()
      });
      setCurrentView('simulation');
    }
  };

  // Free Tier Limit & Coins Gatekeeper
  const checkLimitAndStartCase = (caseItem) => {
    const target = caseItem || selectedDetailCase || cases[0];
    if (!target) return;

    const hasSub = user?.has_subscription || userLimit?.has_subscription;
    const remaining = userLimit ? (userLimit.remaining ?? 3) : 3;

    // 1. If user has active Premium subscription -> Play unlimited!
    if (hasSub) {
      setActiveCase(target);
      setIsPreparingCase(true);
      return;
    }

    // 2. If user has free daily attempts remaining -> Play for free!
    if (remaining > 0) {
      setUserLimit(prev => ({
        ...(prev || {}),
        remaining: Math.max(0, (prev?.remaining ?? 3) - 1),
        used: (prev?.used ?? 0) + 1,
      }));
      setActiveCase(target);
      setIsPreparingCase(true);
      return;
    }

    // 3. Free daily limit is exhausted (0 remaining) -> Check coins!
    const caseCost = target.coins_price || target.coins || target.coin_cost || 5;
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

  const handleStartSimulationFromHome = async ({ categoryId, difficulty, duration }) => {
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
        targetCase = randomRes?.data || randomRes || (cases && cases.length > 0 ? cases[Math.floor(Math.random() * cases.length)] : null);
      }

      checkLimitAndStartCase(targetCase || cases[0]);
    } catch (err) {
      console.warn("Case launch fallback:", err);
      checkLimitAndStartCase(cases[0]);
    }
  };

  const handleFinishSimulation = async (result) => {
    const sessionId = activeCase?.sessionId || 'sim-1';

    try {
      showToast("Simulyatsiya yakunlanmoqda...");

      // 1. Sessiyani backendda yakunlash (PUT /mobile/simulation/{id}/finish)
      let finishResult = null;
      try {
        finishResult = await api.finishSimulation(sessionId, 'completed');
      } catch (err) {
        console.warn('finishSimulation API error (continuing):', err.message);
      }

      // 2. AI Debriefing hisobotini olish
      showToast("AI Debriefing hisoboti tayyorlanmoqda...");
      let debrief = null;
      try {
        debrief = await api.getDebrief(sessionId);
      } catch (err) {
        console.warn('getDebrief API error:', err.message);
      }

      // 3. Backenddan kelgan haqiqiy XP va Coins qiymatlarini aniqlash
      const earnedXp = debrief?.xp_earned ?? finishResult?.xp_earned ?? result?.xp ?? 0;
      const earnedCoins = debrief?.coins_earned ?? finishResult?.coins_earned ?? result?.coins ?? 0;

      // 4. Debrief data ni set qilish
      if (debrief) {
        setDebriefData(debrief);
      } else {
        // Backend javob bermagan bo'lsa, lokal natijalar ishlatiladi
        setDebriefData({
          final_score: finishResult?.final_score ?? result?.score ?? 0,
          xp_earned: earnedXp,
          coins_earned: earnedCoins,
          correct_steps: [
            "Bemorga zudlik bilan O2 kislorod ingalyatsiyasi boshlandi",
            "12 tarmoqli EKG olindi va ST ko'tarilishi aniqlandi",
            "Aspirin 300 mg chaynab yutish uchun berildi"
          ],
          incorrect_steps: [
            "Gipotenziyada Nitroglikerin berish xavfi inobatga olinishi lozim edi"
          ],
          weak_topics: ["Miokard infarktida gipotenziya protokoli"],
          guideline_notes: "AHA va ESC 2023 ko'rsatmalariga muvofiq STEMI da zudlik bilan perkutan koronar aralashuv (ChKB) tayyorgarligi ko'rilishi lozim."
        });
      }

      // 5. User profilini lokal yangilash (tezkor ko'rsatish uchun)
      if (user && (earnedXp > 0 || earnedCoins > 0)) {
        setUser(prev => ({
          ...prev,
          xp: (prev?.xp || 0) + earnedXp,
          coins: (prev?.coins || 0) + earnedCoins
        }));
      }

      // 6. Backenddan yangi profil olish (haqiqiy qiymatlarni sinxronlash)
      try {
        const freshProfile = await api.getUserProfile();
        if (freshProfile) {
          setUser(freshProfile);
          setStoredUser(freshProfile);
        }
      } catch {
        // Lokal yangilangan qiymatlarni localStorage ga saqlash
        if (user) {
          setStoredUser({
            ...user,
            xp: (user?.xp || 0) + earnedXp,
            coins: (user?.coins || 0) + earnedCoins
          });
        }
      }

    } catch (err) {
      console.error('handleFinishSimulation error:', err);
      // Fallback — backend ishlamasa ham UX buzilmasin
      setDebriefData({
        final_score: result?.score ?? 0,
        xp_earned: result?.xp ?? 0,
        coins_earned: result?.coins ?? 0,
        correct_steps: [],
        incorrect_steps: [],
        weak_topics: [],
        guideline_notes: ""
      });
    }
  };


  const handleToggleFavorite = async (caseId) => {
    try {
      await api.toggleFavorite(caseId);
      setCases(prev => prev.map(c => c.id === caseId ? { ...c, is_favorite: !c.is_favorite } : c));
      showToast("Sevimlilar ro'yxati yangilandi");
    } catch {
      setCases(prev => prev.map(c => c.id === caseId ? { ...c, is_favorite: !c.is_favorite } : c));
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
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 16px rgba(6, 182, 212, 0.3)',
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
            unreadCount={1}
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
            onBack={() => setCurrentView('roadmap')}
          />
        )}

        {/* --- New Profile Inner Views --- */}
        {currentView === 'favorites' && (
          <FavoritesView 
            onBack={() => setCurrentView('profile')}
            onSelectCase={(c) => {
              setSelectedDetailCase(c);
              setCurrentView('case-details');
            }}
          />
        )}
        {currentView === 'activity' && (
          <ActivityView onBack={() => setCurrentView('profile')} />
        )}
        {currentView === 'notifications' && (
          <NotificationsView onBack={() => setCurrentView('profile')} />
        )}
        {currentView === 'study_plan' && (
          <StudyPlanView onBack={() => setCurrentView('profile')} />
        )}
        {currentView === 'ai_reports' && (
          <AiReportsView
            onBack={() => setCurrentView('profile')}
            onViewDebrief={(debrief) => setDebriefData(debrief)}
          />
        )}
      </main>

      {/* Workspace Footer */}
      <footer style={{
        marginTop: 40,
        padding: '24px 0 10px 0',
        borderTop: '1.5px solid #E2E8F0',
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
            borderRadius: 28,
            border: '2px solid #E2E8F0',
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
                    border: '2px solid #FDE68A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '26px',
                  }}>
                    🪙
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '19px', fontWeight: 900, color: '#0F172A' }}>
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
                  border: '1.5px solid #E2E8F0',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <span style={{ color: '#64748B', fontWeight: 600 }}>Tanlangan keys:</span>
                    <span style={{ color: '#0F172A', fontWeight: 800, maxWidth: 240, textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {limitModal.caseItem?.title || 'Klinik keys'}
                    </span>
                  </div>
                  <div style={{ width: '100%', height: 1, background: '#E2E8F0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }}>
                    <span style={{ color: '#64748B', fontWeight: 600 }}>Keys narxi:</span>
                    <span style={{ color: '#D97706', fontWeight: 900 }}>
                      🪙 {limitModal.caseCost} tanga
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <span style={{ color: '#64748B', fontWeight: 600 }}>Sizning balansingiz:</span>
                    <span style={{ color: '#16A34A', fontWeight: 800 }}>
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
                      setUser(prev => ({
                        ...(prev || {}),
                        coins: Math.max(0, (prev?.coins || 0) - cost),
                      }));
                      const target = limitModal.caseItem;
                      setLimitModal(null);
                      setActiveCase(target);
                      setIsPreparingCase(true);
                      showToast(`🪙 ${cost} tanga sarflandi. Simulyatsiya boshlandi!`);
                    }}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: 16,
                      background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                      border: '2px solid #15803D',
                      boxShadow: '0 4px 0 #15803D, 0 8px 20px rgba(34, 197, 94, 0.3)',
                      color: '#FFFFFF',
                      fontSize: '15px',
                      fontWeight: 800,
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
                      border: '1.5px solid #BFDBFE',
                      color: '#2563EB',
                      fontSize: '14px',
                      fontWeight: 800,
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
                    border: '2px solid #FECACA',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '26px',
                  }}>
                    🔒
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '19px', fontWeight: 900, color: '#0F172A' }}>
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
                  border: '1.5px solid #FECACA',
                  padding: '14px 16px',
                  fontSize: '13px',
                  color: '#991B1B',
                  lineHeight: 1.5,
                }}>
                  Bugungi bepul <strong>3 ta urinish</strong> limitingiz tugagan. Ushbu keys narxi <strong>🪙 {limitModal.caseCost} tanga</strong>, sizda esa hozir <strong>🪙 {limitModal.userCoins} tanga</strong> mavjud.
                </div>

                {/* Recommendations */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
                      border: '2px solid #22C55E',
                      boxShadow: '0 3px 0 #16A34A',
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
                        fontWeight: 900,
                      }}>
                        👑
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
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
                      border: '1.5px solid #FDE68A',
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
                        fontWeight: 900,
                      }}>
                        🪙
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
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
                      border: '1.5px solid #CBD5E1',
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
                      background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                      border: '2px solid #15803D',
                      boxShadow: '0 4px 0 #15803D',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: 800,
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
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 16px rgba(6, 182, 212, 0.3)',
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
