import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { useTranslation } from '../i18n.jsx';
import DashboardHero, { HomeBanner, HomeCategoryCarousel } from '../components/features/DashboardHero.jsx';
import KeysConfigModal from '../components/modals/KeysConfigModal.jsx';

export default function HomeView({
  user,
  categories = [],
  banners = [],
  topicsCount,
  userLimit,
  onStartSimulation,
  onOpenClinics,
  onOpenStore,
  onSelectCategory,
}) {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="ui-page">
      <DashboardHero
        user={user}
        categories={categories}
        topicsCount={topicsCount}
        onOpenClinics={onOpenClinics}
        onOpenStore={onOpenStore}
      />

      <section className="ui-card" style={{ padding: 16 }}>
        <button id="btn-open-simulation-modal" className="ui-btn ui-btn-primary ui-btn-block" onClick={() => setModalOpen(true)}>
          <Play size={18} fill="#fff" />
          {t('home.startSimulation')}
        </button>
      </section>

      <HomeCategoryCarousel
        categories={categories}
        onSelectCategory={onSelectCategory}
        onViewAll={onOpenClinics}
      />

      <HomeBanner banners={banners} />

      <KeysConfigModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        categories={categories}
        onStart={(payload) => {
          setModalOpen(false);
          onStartSimulation?.(payload);
        }}
      />
    </div>
  );
}
