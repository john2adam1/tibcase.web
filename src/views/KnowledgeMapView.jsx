import React, { useEffect, useState } from 'react';
import { ChevronLeft, RefreshCw, Sparkles } from 'lucide-react';
import { api, formatApiError, isInsufficientCoinsError, localizeText } from '../api';
import { useTranslation } from '../i18n.jsx';

const LEVEL_STYLE = {
  strong: { bg: '#DCFCE7', color: '#166534' },
  medium: { bg: '#FEF3C7', color: '#92400E' },
  weak: { bg: '#FEE2E2', color: '#991B1B' },
  learning: { bg: '#DBEAFE', color: '#1D4ED8' },
  unexplored: { bg: '#F1F5F9', color: '#475569' },
};

function actionLabel(step, t) {
  if (step.action === 'flashcard_review') return t('flash.due', 'Takrorlash');
  if (step.action === 'deck') return t('flash.orderDeck', 'Fleshkarta to‘plami');
  if (step.action === 'test') return t('practice.modeTest', 'Test');
  return t('practice.modeCase', 'Case');
}

export default function KnowledgeMapView({
  onBack,
  onToast,
  onInsufficientCoins,
  onStartPractice,
  onOpenFlashcards,
}) {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setData(await api.getRoadmap());
    } catch (err) {
      setError(formatApiError(err, t));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setError('');
    try {
      const fresh = await api.refreshRoadmap();
      setData(fresh);
    } catch (err) {
      if (isInsufficientCoinsError(err)) onInsufficientCoins?.();
      else {
        const msg = formatApiError(err, t);
        setError(msg);
        onToast?.(msg);
      }
    } finally {
      setRefreshing(false);
    }
  };

  const runStep = async (step) => {
    if (step.action === 'flashcard_review') {
      onOpenFlashcards?.();
      return;
    }
    if (step.action === 'deck') {
      try {
        await api.orderFlashcardDeck({
          category_id: step.category_id,
          topic_id: step.topic_id,
          count: step.count || 10,
        });
        onOpenFlashcards?.();
      } catch (err) {
        if (isInsufficientCoinsError(err)) onInsufficientCoins?.();
        else onToast?.(formatApiError(err, t));
      }
      return;
    }
    onStartPractice?.({
      mode: step.action === 'test' ? 'test' : 'case',
      category_id: step.category_id,
      topic_ids: step.topic_id ? [step.topic_id] : [],
      difficulty: step.difficulty || 'medium',
      count: step.count || 10,
    });
  };

  const map = Array.isArray(data?.map) ? data.map : [];
  const path = Array.isArray(data?.path) ? [...data.path].sort((a, b) => (a.order || 0) - (b.order || 0)) : [];

  return (
    <div className="ui-page" style={{ paddingBottom: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <button className="ui-icon-btn" onClick={onBack} aria-label={t('common.back', 'Orqaga')} style={{ border: 'none' }}>
          <ChevronLeft size={22} />
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: 20 }}>{t('map.title', 'Bilim xaritasi')}</h2>
          {data && (
            <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>
              {t('map.strong', 'Kuchli')} {data.strong_count || 0} · {t('map.weak', 'Zaif')} {data.weak_count || 0} · {t('map.unexplored', 'O‘rganilmagan')} {data.unexplored_count || 0}
            </div>
          )}
        </div>
        <button className="ui-btn" onClick={handleRefresh} disabled={refreshing}>
          <Sparkles size={15} />
          {refreshing ? t('map.refreshing', 'AI yozmoqda…') : t('map.refresh', 'AI izoh')}
        </button>
      </div>

      {error && (
        <div style={{ marginBottom: 12, padding: '10px 12px', borderRadius: 12, background: '#FEF2F2', color: '#B91C1C', fontSize: 13, fontWeight: 600 }}>
          {error}
        </div>
      )}

      {loading ? (
        <section className="ui-card" style={{ padding: 28, textAlign: 'center' }}>
          <RefreshCw className="animate-spin" />
        </section>
      ) : (
        <>
          {data?.summary && (
            <section className="ui-card" style={{ padding: 16, marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#64748B', marginBottom: 6 }}>{t('map.summary', 'Xulosa')}</div>
              <p style={{ margin: 0, lineHeight: 1.5 }}>{data.summary}</p>
            </section>
          )}

          <h3 style={{ fontSize: 16, margin: '0 0 10px' }}>{t('map.path', 'O‘qish yo‘li')}</h3>
          {path.length === 0 && (
            <p style={{ color: '#64748B', fontWeight: 600 }}>{t('map.empty', 'Avval keys yoki test yeching')}</p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
            {path.map((step) => (
              <div key={`${step.order}-${step.action}`} className="ui-card" style={{ padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 800 }}>{step.order}. {actionLabel(step, t)} {localizeText(step.topic_name) || step.topic_name || ''}</div>
                    {step.reason && <p style={{ margin: '6px 0 0', fontSize: 13, color: '#475569' }}>{step.reason}</p>}
                  </div>
                  <button className="ui-btn ui-btn-primary" onClick={() => runStep(step)}>
                    {t('map.startStep', 'Boshlash')}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: 16, margin: '0 0 10px' }}>{t('map.grid', 'Mavzular')}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
            {map.map((node) => {
              const style = LEVEL_STYLE[node.level] || LEVEL_STYLE.unexplored;
              return (
                <button
                  key={`${node.category_id}-${node.topic_id}`}
                  type="button"
                  onClick={() => onStartPractice?.({
                    mode: 'case',
                    category_id: node.category_id,
                    topic_ids: node.topic_id ? [node.topic_id] : [],
                    difficulty: 'medium',
                  })}
                  style={{
                    textAlign: 'left',
                    border: 'none',
                    borderRadius: 16,
                    padding: 12,
                    background: style.bg,
                    color: style.color,
                    cursor: 'pointer',
                    minHeight: 92,
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 800, opacity: 0.8 }}>{localizeText(node.category_name)}</div>
                  <div style={{ fontWeight: 800, marginTop: 4 }}>{localizeText(node.topic_name)}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, marginTop: 6 }}>
                    {t(`map.${node.level}`, node.level)} · {node.mastery ?? 0}%
                    {node.cards_due ? ` · ${node.cards_due}` : ''}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
