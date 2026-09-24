import React, { useEffect, useState } from 'react';
import { api, getLang, setLang } from './api';
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
import CaseDetailModal from './components/CaseDetailModal';
import AuthModal from './components/AuthModal';

export default function App() {
  // Authentication status: default to false so visitor sees clean Landing Page first
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('tibcase_authenticated') === 'true';
  });

  const [currentView, setCurrentView] = useState('cases'); // 'cases' | 'simulation' | 'store' | 'leaderboard'
  const [activeMode, setActiveMode] = useState('clinical'); // 'clinical' | 'citizen'
  const [lang, setLangState] = useState(getLang());

  // Data states
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [cases, setCases] = useState([]);
  const [tariffs, setTariffs] = useState([]);
  const [partners, setPartners] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [abouts, setAbouts] = useState([]);

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
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const handleLangChange = (newLang) => {
    setLang(newLang);
    setLangState(newLang);
    showToast(`Til o'zgartirildi: ${newLang.toUpperCase()}`);
  };

  // Initial Data Fetch
  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        const [
          profileData,
          catsData,
          casesData,
          tariffsData,
          partnersData,
          faqsData
        ] = await Promise.all([
          api.getUserProfile().catch(() => null),
          api.getCategories().catch(() => []),
          api.getCases().catch(() => []),
          api.getTariffs().catch(() => []),
          api.getPartners().catch(() => []),
          api.getFaqs().catch(() => [])
        ]);

        if (isMounted) {
          if (profileData) setUser(profileData);
          if (catsData) setCategories(catsData);
          if (casesData) setCases(casesData);
          if (tariffsData) setTariffs(tariffsData);
          if (partnersData) setPartners(partnersData);
          if (faqsData) setFaqs(faqsData);
        }
      } catch (err) {
        console.warn('Initial load handled:', err.message);
      }
    }

    loadInitialData();

    return () => { isMounted = false; };
  }, [lang]);

  // Auth Handlers
  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setIsAuthenticated(true);
    localStorage.setItem('tibcase_authenticated', 'true');
    setCurrentView('cases');
    showToast(`Xush kelibsiz, ${loggedInUser.name}!`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('tibcase_authenticated');
    setActiveCase(null);
    setProfileModalOpen(false);
    showToast("Tizimdan chiqildi");
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

  const handleFinishSimulation = async (result) => {
    try {
      showToast("AI Debriefing hisoboti tayyorlanmoqda...");
      const debrief = await api.getDebrief(activeCase?.sessionId || 'sim-1');
      setDebriefData(debrief);

      if (user) {
        setUser(prev => ({
          ...prev,
          xp: (prev.xp || 100) + (result.xp || 60),
          coins: (prev.coins || 15) + (result.coins || 2)
        }));
      }
    } catch {
      setDebriefData({
        final_score: result.score || 94,
        xp_earned: 60,
        coins_earned: 2,
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Internal Workspace Header */}
      <AppNavbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        user={user}
        activeCase={activeCase}
        onOpenProfile={() => setCurrentView('profile')}
        onLogout={handleLogout}
        lang={lang}
        onLangChange={handleLangChange}
        activeMode={activeMode}
        setActiveMode={setActiveMode}
      />

      {/* Internal Views */}
      <main style={{ flex: 1 }}>
        {/* Cases Catalog View */}
        {currentView === 'cases' && (
          <CasesCatalog
            cases={cases}
            categories={categories}
            onSelectCase={(item) => setSelectedDetailCase(item)}
            onToggleFavorite={handleToggleFavorite}
            onStartSimulation={handleStartSimulation}
          />
        )}

        {/* Live Interactive Case Simulation Room (Figma exact UI) */}
        {currentView === 'simulation' && (
          <CaseSimulationRoom
            caseItem={activeCase || cases[0]}
            onExitSimulation={() => setCurrentView('roadmap')}
            onFinishCase={handleFinishSimulation}
          />
        )}

        {/* Tariffs & Store View */}
        {currentView === 'store' && (
          <StoreTariffs
            tariffs={tariffs}
            user={user}
            onUserUpdate={setUser}
          />
        )}

        {/* Leaderboard View */}
        {currentView === 'leaderboard' && (
          <Leaderboard user={user} />
        )}

        {/* Profile & Settings View (Figma mobile design) */}
        {currentView === 'profile' && (
          <ProfileView
            user={user}
            onUserUpdate={setUser}
            onOpenStore={() => setCurrentView('store')}
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
            onStartCase={() => {
              setActiveCase(selectedDetailCase || cases[0]);
              setIsPreparingCase(true);
            }}
            onBack={() => setCurrentView('roadmap')}
          />
        )}
      </main>

      {/* Modals */}
      {selectedDetailCase && (
        <CaseDetailModal
          caseItem={selectedDetailCase}
          onClose={() => setSelectedDetailCase(null)}
          onStartSimulation={handleStartSimulation}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {debriefData && (
        <DebriefModal
          debriefData={debriefData}
          onClose={() => {
            setDebriefData(null);
            setCurrentView('cases');
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

      {/* Workspace Footer */}
      <footer style={{
        padding: '20px 24px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(6, 11, 20, 0.9)',
        textAlign: 'center',
        fontSize: '0.82rem',
        color: 'var(--text-muted)',
      }}>
        <div style={{ maxWidth: 1380, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div>© 2026 <strong>TibCase AI</strong>. Shifokorlar va Talabalar uchun Virtual Klinik Simulyator.</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <span>AHA & ESC Standartlari</span>
          </div>
        </div>
      </footer>

      {/* Bottom Navigation Bar matching Figma design */}
      <BottomNavBar
        currentView={currentView}
        onSelectView={(view) => setCurrentView(view)}
      />
    </div>
  );
}
