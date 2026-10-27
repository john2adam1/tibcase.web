import React from 'react';
import { Brain, Layers, Map } from 'lucide-react';
import { useTranslation } from '../i18n.jsx';
import DashboardHero, { HomeBanner, HomeCategoryCarousel, HomeFlashcardCarousel } from '../components/features/DashboardHero.jsx';

export default function HomeView({
  user,
  wallet,
  categories = [],
  banners = [],
  topicsCount,
  flashcardStats,
  onStartPractice,
  onOpenClinics,
  onOpenStore,
  onOpenFlashcards,
  onOpenKnowledgeMap,
  onSelectCategory,
}) {
  const { t } = useTranslation();
  const due = flashcardStats?.due_today ?? flashcardStats?.due_now ?? 0;
  const freeLeft = wallet?.free_coins_left;
  const paid = wallet?.coins ?? user?.coins ?? 0;

  return (
    <div className="ui-page">
      <DashboardHero
        user={user}
        wallet={wallet}
        categories={categories}
        topicsCount={topicsCount}
        flashcardStats={flashcardStats}
        onOpenClinics={onOpenClinics}
        onOpenStore={onOpenStore}
        onOpenFlashcards={onOpenFlashcards}
      />

      {wallet && !wallet.has_subscription && typeof freeLeft === 'number' && (
        <section className="ui-card" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#64748B' }}>{t('home.walletFree', 'Bugungi bepul tanga')}</div>
            <div style={{ fontWeight: 800 }}>{freeLeft} / {wallet.daily_free_coins ?? freeLeft}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#64748B' }}>{t('home.walletPaid', 'Balans')}</div>
            <div style={{ fontWeight: 800 }}>🪙 {paid}</div>
          </div>
        </section>
      )}

      <section className="ui-card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button id="btn-open-practice" className="ui-btn ui-btn-primary ui-btn-block" onClick={onStartPractice}>
          <Brain size={18} />
          {t('home.startPractice', 'AI mashq')}
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="ui-btn" style={{ flex: 1 }} onClick={onOpenFlashcards}>
            <Layers size={16} />
            {t('nav.flashcards', 'Fleshkartalar')}
            {due > 0 ? ` (${due})` : ''}
          </button>
          <button className="ui-btn" style={{ flex: 1 }} onClick={onOpenKnowledgeMap}>
            <Map size={16} />
            {t('nav.roadmap', 'Xarita')}
          </button>
        </div>
      </section>

      <HomeFlashcardCarousel onViewAll={onOpenFlashcards} />

      <HomeCategoryCarousel
        categories={categories}
        onSelectCategory={onSelectCategory}
        onViewAll={onOpenClinics}
      />

      <HomeBanner banners={banners} />
    </div>
  );
}
