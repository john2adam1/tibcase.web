import React, { useState } from 'react';
import { Play, X } from 'lucide-react';
import { useTranslation } from '../i18n.jsx';
import DashboardHero from '../components/features/DashboardHero.jsx';

export default function HomeView({
  user,
  categories = [],
  banners = [],
  userLimit,
  onStartSimulation,
  onOpenClinics,
  onOpenStore,
  onOpenLeaderboard,
}) {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('random');

  const handleLaunch = () => {
    setModalOpen(false);
    onStartSimulation?.({ categoryId: selectedCategory === 'random' ? null : selectedCategory });
  };

  return (
    <div className="ui-page">
      <DashboardHero
        user={user}
        categories={categories}
        banners={banners}
        userLimit={userLimit}
        onOpenClinics={onOpenClinics}
        onOpenStore={onOpenStore}
        onOpenLeaderboard={onOpenLeaderboard}
      />

      <section className="ui-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>{t('home.startSimulation')}</h2>
          <p className="ui-subtitle" style={{ marginTop: 4 }}>{t('home.startSimulationDesc')}</p>
        </div>
        <button id="btn-open-simulation-modal" className="ui-btn ui-btn-primary ui-btn-block" onClick={() => setModalOpen(true)}>
          <Play size={18} fill="#fff" />
          {t('home.startSimulation')}
        </button>
      </section>

      {modalOpen && (
        <div
          className="ui-modal-overlay"
          onClick={() => setModalOpen(false)}
        >
          <div className="ui-card ui-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>{t('modal.configTitle')}</h3>
              <button className="ui-icon-btn" onClick={() => setModalOpen(false)} aria-label="Close" style={{ border: 'none' }}>
                <X size={20} />
              </button>
            </div>

            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span className="ui-label">{t('modal.step1')}</span>
              <select className="ui-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="random">{t('modal.randomOption')}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name || cat.title}</option>
                ))}
              </select>
            </label>

            <button id="btn-start-case-modal" className="ui-btn ui-btn-primary ui-btn-block" onClick={handleLaunch}>
              {t('modal.startBtn')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
