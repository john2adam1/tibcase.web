import React, { useEffect, useMemo, useState } from 'react';
import { api, localizeText } from '../../api';
import { useTranslation } from '../../i18n.jsx';
import Skeleton from '../common/Skeleton.jsx';

const MONO = "var(--font-mono, 'JetBrains Mono', monospace)";

function Label({ children }) {
  return (
    <div style={{
      fontFamily: MONO, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em',
      textTransform: 'uppercase', color: 'var(--ink-3)',
    }}>
      {children}
    </div>
  );
}

function actionLabel(step, t) {
  if (step.action === 'deck') return t('flash.orderDeck', 'Fleshkarta to‘plami');
  if (step.action === 'test') return t('practice.modeTest', 'Test');
  return t('practice.modeCase', 'Keys');
}

/**
 * Home tepasidagi "Bugungi mashq": takrorlanadigan kartalar va eng zaif mavzu.
 * Faqat bepul GET'lar: flashcard stats (props) + GET /mobile/roadmap.
 */
export default function TodayPractice({
  flashcardStats,
  onStartPractice,
  onOpenFlashcards,
  onOpenKnowledgeMap,
}) {
  const { t } = useTranslation();
  const [roadmap, setRoadmap] = useState(undefined); // undefined = yuklanmoqda, null = xato

  useEffect(() => {
    let alive = true;
    api.getRoadmap()
      .then((r) => { if (alive) setRoadmap(r || null); })
      .catch(() => { if (alive) setRoadmap(null); });
    return () => { alive = false; };
  }, []);

  const due = flashcardStats?.due_today ?? flashcardStats?.due_now ?? 0;

  const weakest = useMemo(() => {
    const nodes = Array.isArray(roadmap?.map) ? roadmap.map : [];
    return nodes
      .filter((n) => n.level === 'weak')
      .sort((a, b) => (a.mastery ?? 0) - (b.mastery ?? 0))[0] || null;
  }, [roadmap]);

  const nextStep = useMemo(() => {
    const path = Array.isArray(roadmap?.path) ? [...roadmap.path] : [];
    // takrorlash yuqorida alohida ko'rsatiladi — bu yerda boshqa qadam
    return path
      .filter((s) => s.action !== 'flashcard_review')
      .sort((a, b) => (a.order || 0) - (b.order || 0))[0] || null;
  }, [roadmap]);

  const practiceWeak = () => {
    if (!weakest) return;
    onStartPractice?.({
      mode: 'case',
      category_id: weakest.category_id,
      topic_ids: weakest.topic_id ? [weakest.topic_id] : [],
      difficulty: 'medium',
    });
  };

  const runNext = () => {
    if (!nextStep) return;
    if (nextStep.action === 'flashcard_review') { onOpenFlashcards?.(); return; }
    if (nextStep.action === 'test' || nextStep.action === 'case') {
      onStartPractice?.({
        mode: nextStep.action === 'test' ? 'test' : 'case',
        category_id: nextStep.category_id,
        topic_ids: nextStep.topic_id ? [nextStep.topic_id] : [],
        difficulty: nextStep.difficulty || 'medium',
        count: nextStep.count || 10,
      });
      return;
    }
    // 'deck' tanga yechadi — Home'dan avtomatik buyurtma qilmaymiz
    onOpenKnowledgeMap?.();
  };

  const loading = roadmap === undefined;
  const hasWeakOrNext = Boolean(weakest || nextStep);

  return (
    <section id="today-practice" className="ui-card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--ink)' }}>
        {t('today.title', 'Bugungi mashq')}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
        {/* Takrorlash */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderTop: '1px solid var(--line)', paddingTop: 10 }}>
          <div style={{ minWidth: 0 }}>
            <Label>{t('today.due', 'Takrorlash kerak')}</Label>
            {due > 0 ? (
              <div style={{ marginTop: 4 }}>
                <span style={{ fontFamily: MONO, fontSize: 26, fontWeight: 600, color: 'var(--ink)' }}>{due}</span>
                <span style={{ marginLeft: 6, fontSize: 13, fontWeight: 600, color: 'var(--ink-3)' }}>{t('today.cards', 'karta')}</span>
              </div>
            ) : (
              <div style={{ marginTop: 4, fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>
                {t('today.allDone', 'Bugun takrorlash kerak karta yo‘q')}
              </div>
            )}
          </div>
          {due > 0 && (
            <button type="button" className="ui-btn ui-btn-primary" id="btn-today-review" onClick={onOpenFlashcards}>
              {t('today.review', 'Takrorlash')}
            </button>
          )}
        </div>

        {/* Eng zaif mavzu / keyingi qadam */}
        {(loading || hasWeakOrNext || due === 0) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderTop: '1px solid var(--line)', paddingTop: 10 }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <Label>{weakest ? t('today.weakest', 'Eng zaif mavzu') : t('today.next', 'Keyingi qadam')}</Label>
            {loading ? (
              <Skeleton width={140} height={18} radius={6} style={{ marginTop: 8 }} />
            ) : weakest ? (
              <div style={{ marginTop: 4, fontWeight: 700, fontSize: 14, color: 'var(--ink)', lineHeight: 1.35 }}>
                {localizeText(weakest.topic_name)}
                <span style={{
                  marginLeft: 8, fontFamily: MONO, fontSize: 12, fontWeight: 600,
                  color: 'var(--on-red)', background: 'var(--tint-red)', border: '1px solid var(--tint-red-border)',
                  borderRadius: 6, padding: '1px 6px',
                }}>
                  {weakest.mastery ?? 0}%
                </span>
              </div>
            ) : nextStep ? (
              <div style={{ marginTop: 4, fontWeight: 700, fontSize: 14, color: 'var(--ink)', lineHeight: 1.35 }}>
                {actionLabel(nextStep, t)}
                {nextStep.topic_name ? ` · ${localizeText(nextStep.topic_name)}` : ''}
              </div>
            ) : (
              <div style={{ marginTop: 4, fontSize: 13, fontWeight: 600, color: 'var(--ink-2)', lineHeight: 1.4 }}>
                {t('today.empty', 'Birinchi keys yoki testni yeching — zaif mavzular shu yerda chiqadi.')}
              </div>
            )}
          </div>
          {!loading && hasWeakOrNext && (
            <button
              type="button"
              className={due > 0 ? 'ui-btn' : 'ui-btn ui-btn-primary'}
              id="btn-today-weak"
              onClick={weakest ? practiceWeak : runNext}
            >
              {t('today.start', 'Boshlash')}
            </button>
          )}
        </div>
        )}
      </div>
    </section>
  );
}
