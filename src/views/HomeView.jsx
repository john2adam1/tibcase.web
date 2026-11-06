import React from 'react';
import { BookOpen, Layers, ListChecks, Map, MessageSquare } from 'lucide-react';
import { useTranslation } from '../i18n.jsx';
import { dailyFreeQuota } from '../api';
import TodayPractice from '../components/features/TodayPractice.jsx';
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
  onOpenFeedback,
}) {
  const { t } = useTranslation();
  const due = flashcardStats?.due_today ?? flashcardStats?.due_now ?? 0;
  const isSub = Boolean(user?.has_subscription || wallet?.has_subscription || userLimit?.has_subscription);
  const quota = dailyFreeQuota(wallet);

  return (
    <div className="ui-page">
      <TodayPractice
        flashcardStats={flashcardStats}
        onStartPractice={onStartPractice}
        onOpenFlashcards={onOpenFlashcards}
        onOpenKnowledgeMap={onOpenKnowledgeMap}
      />

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

      <DashboardHero
        user={user}
        wallet={wallet}
        categories={categories}
        topicsCount={topicsCount}
        flashcardStats={flashcardStats}
        onOpenClinics={onOpenClinics}
        onOpenStore={onOpenStore}
        onOpenFlashcards={onOpenFlashcards}
        freeQuota={!isSub && wallet ? quota : null}
      />

      <HomeFlashcardCarousel onViewAll={onOpenFlashcards} />

      <HomeCategoryCarousel
        categories={categories}
        onSelectCategory={onSelectCategory}
        onViewAll={onOpenClinics}
      />

      <HomeBanner banners={banners} />

      {onOpenFeedback && (
        <button
          id="btn-home-feedback"
          type="button"
          onClick={onOpenFeedback}
          className="ui-card"
          style={{
            padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, width: '100%',
            textAlign: 'left', cursor: 'pointer', border: '1px solid var(--tint-green-border)', background: 'var(--tint-green-soft)',
          }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: 12, background: 'var(--tint-green)', color: '#16A34A',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <MessageSquare size={20} strokeWidth={2.2} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 800, color: 'var(--ink)' }}>{t('feedback.open', 'Fikr bildirish')}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-3)' }}>
              {t('feedback.homeDesc', 'Ilovani sinab ko‘rdingizmi? Fikringizni yozib qoldiring')}
            </div>
          </div>
        </button>
      )}
    </div>
  );
}
