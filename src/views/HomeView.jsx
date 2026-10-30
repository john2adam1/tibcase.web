import React from 'react';
import { BookOpen, Layers, ListChecks, Map } from 'lucide-react';
import { useTranslation } from '../i18n.jsx';
import { dailyFreeQuota } from '../api';
import DashboardHero, { HomeBanner, HomeCategoryCarousel, HomeFlashcardCarousel } from '../components/features/DashboardHero.jsx';

export default function HomeView({
  user,
  wallet,
  userLimit,
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
  const paid = wallet?.coins ?? user?.coins ?? 0;
  const isSub = Boolean(user?.has_subscription || wallet?.has_subscription || userLimit?.has_subscription);
  const quota = dailyFreeQuota(wallet);

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

      {!isSub && wallet && (
        <section className="ui-card" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#64748B' }}>{t('home.walletFree', 'Bugungi bepul tanga')}</div>
            <div style={{ fontWeight: 800 }}>{quota.left} / {quota.total}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#64748B' }}>{t('home.walletPaid', 'Balans')}</div>
            <div style={{ fontWeight: 800 }}>🪙 {paid}</div>
          </div>
        </section>
      )}

      <section className="ui-card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            id="btn-open-practice"
            className="ui-btn ui-btn-primary"
            style={{ flex: 1 }}
            onClick={() => onStartPractice?.({ mode: 'case', setup: true })}
          >
            <BookOpen size={16} />
            {t('home.startCase', 'Keys yechish')}
          </button>
          <button
            id="btn-open-practice-test"
            className="ui-btn ui-btn-primary"
            style={{ flex: 1 }}
            onClick={() => onStartPractice?.({ mode: 'test', setup: true })}
          >
            <ListChecks size={16} />
            {t('home.startTest', 'Test yechish')}
          </button>
        </div>
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

      <HomeFlashcardCarousel onViewAll={onOpenFlashcards} streak={flashcardStats?.streak_count} />

      <HomeCategoryCarousel
        categories={categories}
        onSelectCategory={onSelectCategory}
        onViewAll={onOpenClinics}
      />

      <HomeBanner banners={banners} />
    </div>
  );
}
