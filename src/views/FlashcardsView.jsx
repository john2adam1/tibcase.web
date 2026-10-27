import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  RefreshCw,
  Plus,
  Layers,
  Trash2,
} from 'lucide-react';
import { api, formatApiError, isInsufficientCoinsError, localizeText } from '../api';
import { useTranslation } from '../i18n.jsx';
import { formatTitle } from './CategoriesView.jsx';

const RATINGS = [
  { id: 'again', color: '#DC2626', bg: '#FEE2E2' },
  { id: 'hard', color: '#D97706', bg: '#FEF3C7' },
  { id: 'good', color: '#16A34A', bg: '#DCFCE7' },
  { id: 'easy', color: '#2563EB', bg: '#DBEAFE' },
];

function clip(text, n = 140) {
  const s = String(text || '').trim();
  if (s.length <= n) return s;
  return `${s.slice(0, n).trim()}…`;
}

export default function FlashcardsView({
  categories = [],
  initialDeckId = '',
  onBack,
  onToast,
  onInsufficientCoins,
}) {
  const { t } = useTranslation();
  const [tab, setTab] = useState('all');
  const [allCards, setAllCards] = useState([]);
  const [dueCards, setDueCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewQueue, setReviewQueue] = useState(null);
  const [stats, setStats] = useState(null);
  const [decks, setDecks] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [orderOpen, setOrderOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [topics, setTopics] = useState([]);
  const [topicText, setTopicText] = useState('');
  const [count, setCount] = useState(10);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  const fail = (err) => {
    if (isInsufficientCoinsError(err)) {
      onInsufficientCoins?.();
      return;
    }
    const msg = formatApiError(err, t);
    setError(msg);
    onToast?.(msg);
  };

  const loadDue = async (deckId) => {
    try {
      const res = await api.getFlashcardDue(50, deckId || initialDeckId || undefined);
      const list = Array.isArray(res?.cards) ? res.cards : [];
      setDueCards(list);
      setIndex(0);
      setFlipped(false);
      return list;
    } catch (err) {
      fail(err);
      return [];
    }
  };

  const loadAll = async () => {
    try {
      const list = await api.getAllFlashcards();
      setAllCards(Array.isArray(list) ? list : []);
    } catch (err) {
      fail(err);
    }
  };

  const loadMeta = async () => {
    try {
      const [st, dk] = await Promise.all([
        api.getFlashcardStats().catch(() => null),
        api.getFlashcardDecks().catch(() => []),
      ]);
      if (st) setStats(st);
      setDecks(Array.isArray(dk) ? dk : []);
    } catch {
      /* ignore */
    }
  };

  const reload = async () => {
    setBusy(true);
    await Promise.all([loadAll(), loadDue(), loadMeta()]);
    setBusy(false);
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!categoryId) {
      setTopics([]);
      return undefined;
    }
    let live = true;
    api.getTopics(categoryId)
      .then((list) => { if (live) setTopics(Array.isArray(list) ? list : []); })
      .catch(() => { if (live) setTopics([]); });
    return () => { live = false; };
  }, [categoryId]);

  const dueIds = useMemo(() => new Set(dueCards.map((c) => c?.id).filter(Boolean)), [dueCards]);
  const reviewing = reviewQueue || (tab === 'due' ? dueCards : null);
  const card = reviewing?.[index];

  const handleReview = async (rating) => {
    if (!card?.id || busy) return;
    setBusy(true);
    try {
      await api.reviewFlashcard(card.id, rating);
      const source = reviewQueue || dueCards;
      const next = source.filter((_, i) => i !== index);
      if (reviewQueue) {
        setReviewQueue(next.length ? next : null);
      } else {
        setDueCards(next);
      }
      setIndex(0);
      setFlipped(false);
      loadMeta();
      loadAll();
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const handleOrderDeck = async () => {
    setBusy(true);
    try {
      const payload = topicText.trim()
        ? { topic_text: topicText.trim(), count: Number(count) || 10 }
        : { category_id: categoryId, topic_id: topicId || undefined, count: Number(count) || 10 };
      const res = await api.orderFlashcardDeck(payload);
      onToast?.(t('flash.created', '{n} ta karta yaratildi').replace('{n}', String(res?.created ?? 0)));
      setOrderOpen(false);
      setTab('all');
      await reload();
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const handleCreateCard = async () => {
    if (!front.trim() || !back.trim()) return;
    setBusy(true);
    try {
      await api.createFlashcard({ front: front.trim(), back: back.trim() });
      setFront('');
      setBack('');
      setManualOpen(false);
      onToast?.(t('flash.added', 'Karta qo‘shildi'));
      await reload();
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteDeck = async (id) => {
    if (!id) return;
    setBusy(true);
    try {
      await api.deleteFlashcardDeck(id);
      await reload();
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const intervalLabel = (rating) => {
    const days = card?.next_intervals?.[rating];
    if (days == null) return '';
    if (Number(days) === 0) return '10m';
    return `${days}d`;
  };

  const ratingLabel = (id) => {
    if (id === 'again') return t('flash.again', 'Qayta');
    if (id === 'hard') return t('flash.hard', 'Qiyin');
    if (id === 'good') return t('flash.good', 'Yaxshi');
    return t('flash.easy', 'Oson');
  };

  const openReview = (item) => {
    setReviewQueue([item]);
    setIndex(0);
    setFlipped(false);
  };

  const tabs = [
    { id: 'all', label: t('flash.all', 'Kartalar') },
    { id: 'due', label: t('flash.due', 'Takrorlash') },
    { id: 'decks', label: t('flash.decks', "To'plamlar") },
  ];

  return (
    <div className="ui-page" style={{ paddingBottom: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <button className="ui-icon-btn" onClick={onBack} aria-label={t('common.back', 'Orqaga')} style={{ border: 'none' }}>
          <ChevronLeft size={22} />
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: 20 }}>{t('flash.title', 'Fleshkartalar')}</h2>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>
            {allCards.length} · {t('flash.statsDue', 'Bugun')}: {stats?.due_today ?? stats?.due_now ?? dueCards.length}
            {typeof stats?.streak_count === 'number' ? ` · 🔥 ${stats.streak_count}` : ''}
          </div>
        </div>
        <button className="ui-icon-btn" onClick={reload} style={{ border: 'none' }}>
          <RefreshCw size={18} className={busy ? 'animate-spin' : ''} />
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            className="ui-btn"
            onClick={() => { setTab(item.id); setReviewQueue(null); setFlipped(false); setIndex(0); }}
            style={{ flex: 1, background: tab === item.id ? 'var(--accent)' : '#F1F5F9', color: tab === item.id ? '#fff' : '#334155', border: 'none' }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ marginBottom: 12, padding: '10px 12px', borderRadius: 12, background: '#FEF2F2', color: '#B91C1C', fontSize: 13, fontWeight: 600 }}>
          {error}
        </div>
      )}

      {card && (reviewQueue || tab === 'due') && (
        <>
          {reviewQueue && (
            <button
              type="button"
              className="ui-btn"
              style={{ marginBottom: 10 }}
              onClick={() => { setReviewQueue(null); setFlipped(false); }}
            >
              {t('common.back', 'Ro‘yxatga qaytish')}
            </button>
          )}
          <button
            type="button"
            className="fc-flip"
            onClick={() => setFlipped((v) => !v)}
            style={{ width: '100%', border: 'none', background: 'transparent', padding: 0, cursor: 'pointer' }}
          >
            <div className={`fc-inner${flipped ? ' flipped' : ''}`}>
              <div className="fc-face ui-card" style={{ padding: 24, minHeight: 220 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', marginBottom: 10 }}>{t('flash.front', 'Savol')}</div>
                <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.45, whiteSpace: 'pre-wrap' }}>{card.front}</div>
                <div style={{ marginTop: 16, fontSize: 12, color: '#64748B' }}>{t('flash.flip', 'Javobni ko‘rish uchun bosing')}</div>
              </div>
              <div className="fc-face fc-back ui-card" style={{ padding: 24, minHeight: 220 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#94A3B8', marginBottom: 10 }}>{t('flash.back', 'Javob')}</div>
                <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{card.back}</div>
                {Array.isArray(card.sources) && card.sources.length > 0 && (
                  <div style={{ marginTop: 12, fontSize: 12, color: '#64748B' }}>
                    {card.sources.map((s, i) => (
                      <div key={s.source_id || i}>{localizeText(s.title) || s.title}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </button>
          {flipped && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 14 }}>
              {RATINGS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  disabled={busy}
                  onClick={() => handleReview(r.id)}
                  style={{
                    padding: '12px 6px',
                    borderRadius: 14,
                    border: 'none',
                    background: r.bg,
                    color: r.color,
                    fontWeight: 800,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {ratingLabel(r.id)}
                  <div style={{ fontSize: 11, fontWeight: 700 }}>{intervalLabel(r.id)}</div>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'all' && !reviewQueue && (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button className="ui-btn ui-btn-primary" onClick={() => setOrderOpen(true)}>
              <Plus size={15} /> {t('flash.orderDeck', 'AI to‘plam')}
            </button>
            <button className="ui-btn" onClick={() => setManualOpen(true)}>
              {t('flash.manualAdd', 'Qo‘lda karta')}
            </button>
          </div>
          {busy && allCards.length === 0 ? (
            <section className="ui-card" style={{ padding: 24, textAlign: 'center' }}>
              <RefreshCw size={28} className="animate-spin" color="#94A3B8" />
            </section>
          ) : allCards.length === 0 ? (
            <section className="ui-card" style={{ padding: 24, textAlign: 'center' }}>
              <Layers size={28} color="#94A3B8" />
              <p style={{ marginTop: 10, fontWeight: 700 }}>{t('flash.emptyAll', 'Hali fleshkarta yo‘q')}</p>
            </section>
          ) : (
            <div className="ui-grid fc-grid">
              {allCards.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="ui-card ui-card-press fc-grid-card"
                  onClick={() => openReview(item)}
                >
                  <div className="fc-grid-kicker">
                    {dueIds.has(item.id) ? t('flash.dueBadge', 'Takrorlash') : t('flash.front', 'Savol')}
                  </div>
                  <div className="fc-grid-text">{clip(item.front, 160)}</div>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'due' && !card && (
        <section className="ui-card" style={{ padding: 24, textAlign: 'center' }}>
          <Layers size={28} color="#94A3B8" />
          <p style={{ marginTop: 10, fontWeight: 700 }}>{t('flash.empty', 'Bugungi takrorlash tugadi')}</p>
        </section>
      )}

      {tab === 'decks' && !reviewQueue && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="ui-btn ui-btn-primary" onClick={() => setOrderOpen(true)}>
              <Plus size={15} /> {t('flash.orderDeck', 'AI to‘plam')}
            </button>
            <button className="ui-btn" onClick={() => setManualOpen(true)}>
              {t('flash.manualAdd', 'Qo‘lda karta')}
            </button>
          </div>
          {decks.map((deck) => (
            <div key={deck.id} className="ui-card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800 }}>
                  {deck.kind === 'mistakes' ? t('flash.mistakes', 'Xatolarim') : (localizeText(deck.name) || deck.name || 'Deck')}
                </div>
                <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>
                  {deck.card_count || 0} · due {deck.due_count || 0}
                </div>
              </div>
              <button className="ui-btn" onClick={() => { setTab('due'); loadDue(deck.id); }}>{t('flash.due', 'Takrorlash')}</button>
              {deck.kind !== 'mistakes' && (
                <button className="ui-icon-btn" onClick={() => handleDeleteDeck(deck.id)} style={{ border: 'none', color: '#DC2626' }}>
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {orderOpen && (
        <section className="ui-card" style={{ padding: 16, marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <strong>{t('flash.orderDeck', 'AI to‘plam buyurtma')}</strong>
          <input className="ui-select" value={topicText} onChange={(e) => setTopicText(e.target.value)} placeholder={t('practice.topicTextPh', 'Erkin mavzu')} />
          <select className="ui-select" value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setTopicId(''); }}>
            <option value="">{t('modal.randomOption')}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{formatTitle(cat.name || cat.title)}</option>
            ))}
          </select>
          {categoryId && (
            <select className="ui-select" value={topicId} onChange={(e) => setTopicId(e.target.value)}>
              <option value="">{t('modal.randomTopic')}</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>{formatTitle(topic.title || topic.name)}</option>
              ))}
            </select>
          )}
          <input className="ui-select" type="number" min={5} max={30} value={count} onChange={(e) => setCount(e.target.value)} />
          <button className="ui-btn ui-btn-primary" disabled={busy} onClick={handleOrderDeck}>{t('modal.startBtn', 'Boshlash')}</button>
          <button className="ui-btn" onClick={() => setOrderOpen(false)}>{t('auth.logoutCancelBtn', 'Bekor qilish')}</button>
        </section>
      )}

      {manualOpen && (
        <section className="ui-card" style={{ padding: 16, marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <textarea className="ui-select" rows={3} value={front} onChange={(e) => setFront(e.target.value)} placeholder={t('flash.front', 'Savol')} />
          <textarea className="ui-select" rows={3} value={back} onChange={(e) => setBack(e.target.value)} placeholder={t('flash.back', 'Javob')} />
          <button className="ui-btn ui-btn-primary" disabled={busy} onClick={handleCreateCard}>{t('flash.manualAdd', 'Qo‘shish')}</button>
          <button className="ui-btn" onClick={() => setManualOpen(false)}>{t('auth.logoutCancelBtn', 'Bekor qilish')}</button>
        </section>
      )}
    </div>
  );
}
