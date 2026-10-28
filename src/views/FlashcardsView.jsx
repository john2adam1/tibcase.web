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
import ClinicalFlashcard from '../components/flashcards/ClinicalFlashcard.jsx';

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
  const [sessionTotal, setSessionTotal] = useState(0);
  const [sessionPos, setSessionPos] = useState(0);
  const [busyId, setBusyId] = useState(null);
  const [stats, setStats] = useState(null);
  const [decks, setDecks] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [createMode, setCreateMode] = useState('manual');
  const [aiSource, setAiSource] = useState('catalog');
  const [openDeck, setOpenDeck] = useState(null);
  const [deckCards, setDeckCards] = useState([]);
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
      setSessionTotal(list.length);
      setSessionPos(0);
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

  const reviewing = tab === 'due' ? dueCards : null;
  const card = reviewing?.[index];

  const handleReview = async (rating) => {
    if (!card?.id || busy) return;
    setBusy(true);
    try {
      await api.reviewFlashcard(card.id, rating);
      setDueCards((source) => source.filter((_, i) => i !== index));
      setIndex(0);
      setSessionPos((pos) => pos + 1);
      loadMeta();
    } catch (err) {
      fail(err);
      throw err;
    } finally {
      setBusy(false);
    }
  };

  const handleGridRate = async (item, rating) => {
    if (!item?.id || busyId) return;
    setBusyId(item.id);
    try {
      await api.reviewFlashcard(item.id, rating);
      setDueCards((list) => list.filter((c) => c.id !== item.id));
      loadMeta();
    } catch (err) {
      fail(err);
      throw err;
    } finally {
      setBusyId(null);
    }
  };

  const handleOrderDeck = async () => {
    const free = aiSource === 'free' && topicText.trim().length >= 3;
    const catalog = aiSource === 'catalog' && categoryId;
    if (!free && !catalog) return;
    setBusy(true);
    try {
      const payload = free
        ? { topic_text: topicText.trim(), count: Number(count) || 10 }
        : { category_id: categoryId, topic_id: topicId || undefined, count: Number(count) || 10 };
      const res = await api.orderFlashcardDeck(payload);
      onToast?.(t('flash.created', '{n} ta karta yaratildi').replace('{n}', String(res?.created ?? 0)));
      setTab('decks');
      setOpenDeck(null);
      await reload();
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const openDeckCards = async (deck) => {
    if (!deck?.id) return;
    setOpenDeck(deck);
    setBusy(true);
    try {
      const res = await api.getFlashcardCards({ deck_id: deck.id, limit: 100 });
      setDeckCards(Array.isArray(res?.cards) ? res.cards : []);
    } catch (err) {
      fail(err);
      setDeckCards([]);
    } finally {
      setBusy(false);
    }
  };

  const deckTitle = (deck) => {
    if (deck?.kind === 'mistakes') return t('flash.mistakes', 'Xatolarim');
    return localizeText(deck?.name) || deck?.name || t('flash.decks', "To'plam");
  };

  const deckKindLabel = (deck) => {
    if (deck?.kind === 'mistakes') return t('flash.deckFromPractice', 'Keys / test');
    if (deck?.kind === 'topic') return t('flash.deckTopic', 'Mavzu');
    if (deck?.kind === 'manual') return t('flash.deckManual', "Qo'lda");
    return '';
  };

  const sortedDecks = useMemo(() => {
    const rank = (kind) => (kind === 'mistakes' ? 0 : kind === 'topic' ? 1 : 2);
    return [...decks].sort((a, b) => rank(a?.kind) - rank(b?.kind));
  }, [decks]);

  const handleCreateCard = async () => {
    if (!front.trim() || !back.trim()) return;
    setBusy(true);
    try {
      await api.createFlashcard({ front: front.trim(), back: back.trim() });
      setFront('');
      setBack('');
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
      if (openDeck?.id === id) {
        setOpenDeck(null);
        setDeckCards([]);
      }
      await reload();
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const renderCardGrid = (list) => (
    <div className="ui-grid fc-grid">
      {list.map((item) => (
        <ClinicalFlashcard
          key={item.id}
          card={item}
          compact
          showMeta={false}
          advanceOnRate={false}
          busy={busyId === item.id}
          onRate={(rating) => handleGridRate(item, rating)}
        />
      ))}
    </div>
  );

  const tabs = [
    { id: 'all', label: t('flash.all', 'Kartalar') },
    { id: 'create', label: t('flash.create', 'Yaratish') },
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

      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            className="ui-btn"
            onClick={() => {
              setTab(item.id);
              setIndex(0);
              setOpenDeck(null);
            }}
            style={{ flex: 1, background: tab === item.id ? 'var(--accent)' : '#F1F5F9', color: tab === item.id ? '#fff' : '#334155', border: 'none', padding: '10px 8px', fontSize: 13 }}
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

      {tab === 'due' && card && (
        <ClinicalFlashcard
          card={card}
          index={Math.min(sessionPos, Math.max(sessionTotal - 1, 0))}
          total={sessionTotal || reviewing.length || 1}
          streak={stats?.streak_count}
          busy={busy}
          onRate={handleReview}
        />
      )}

      {tab === 'create' && (
        <section className="ui-card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { id: 'manual', label: t('flash.createManual', "Qo'lda") },
              { id: 'ai', label: t('flash.createAi', 'AI') },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                className="ui-btn"
                onClick={() => setCreateMode(item.id)}
                style={{ flex: 1, background: createMode === item.id ? 'var(--accent)' : '#F1F5F9', color: createMode === item.id ? '#fff' : '#334155', border: 'none' }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {createMode === 'manual' ? (
            <>
              <p style={{ margin: 0, fontSize: 13, color: '#64748B', fontWeight: 600 }}>
                {t('flash.createHint', 'Savol va javobni yozib, o‘z kartangizni qo‘shing')}
              </p>
              <textarea className="ui-select" rows={4} value={front} onChange={(e) => setFront(e.target.value)} placeholder={t('flash.front', 'Savol')} style={{ minHeight: 96, height: 'auto', padding: '12px 14px' }} />
              <textarea className="ui-select" rows={4} value={back} onChange={(e) => setBack(e.target.value)} placeholder={t('flash.back', 'Javob')} style={{ minHeight: 96, height: 'auto', padding: '12px 14px' }} />
              <button className="ui-btn ui-btn-primary" disabled={busy || !front.trim() || !back.trim()} onClick={handleCreateCard}>
                {t('flash.manualAdd', 'Qo‘shish')}
              </button>
            </>
          ) : (
            <>
              <p style={{ margin: 0, fontSize: 13, color: '#64748B', fontWeight: 600 }}>
                {t('flash.createAiHint', 'Mavzu bo‘yicha AI kartalar yaratadi (tanga yechiladi)')}
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="ui-btn" onClick={() => setAiSource('catalog')} style={{ flex: 1, background: aiSource === 'catalog' ? '#0F172A' : '#F1F5F9', color: aiSource === 'catalog' ? '#fff' : '#334155', border: 'none' }}>
                  {t('practice.catalogTopic', 'Bo‘lim / mavzu')}
                </button>
                <button type="button" className="ui-btn" onClick={() => setAiSource('free')} style={{ flex: 1, background: aiSource === 'free' ? '#0F172A' : '#F1F5F9', color: aiSource === 'free' ? '#fff' : '#334155', border: 'none' }}>
                  {t('practice.freeTopic', 'Erkin mavzu')}
                </button>
              </div>
              {aiSource === 'free' ? (
                <textarea
                  className="ui-select"
                  rows={3}
                  value={topicText}
                  onChange={(e) => setTopicText(e.target.value)}
                  placeholder={t('practice.topicTextPh', 'Erkin mavzu')}
                  style={{ minHeight: 80, height: 'auto', padding: '12px 14px' }}
                />
              ) : (
                <>
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
                </>
              )}
              <input className="ui-select" type="number" min={5} max={30} value={count} onChange={(e) => setCount(e.target.value)} />
              <button
                className="ui-btn ui-btn-primary"
                disabled={busy || (aiSource === 'free' ? topicText.trim().length < 3 : !categoryId)}
                onClick={handleOrderDeck}
              >
                <Plus size={15} /> {t('flash.orderDeck', 'AI to‘plam')}
              </button>
            </>
          )}
        </section>
      )}

      {tab === 'all' && (
        <>
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
            renderCardGrid(allCards)
          )}
        </>
      )}

      {tab === 'due' && !card && (
        <section className="ui-card" style={{ padding: 24, textAlign: 'center' }}>
          <Layers size={28} color="#94A3B8" />
          <p style={{ marginTop: 10, fontWeight: 700 }}>{t('flash.empty', 'Bugungi takrorlash tugadi')}</p>
        </section>
      )}

      {tab === 'decks' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {openDeck ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button type="button" className="ui-btn" onClick={() => { setOpenDeck(null); setDeckCards([]); }}>
                  {t('common.back', "Ro'yxatga qaytish")}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800 }}>{deckTitle(openDeck)}</div>
                  <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>{deckKindLabel(openDeck)}</div>
                </div>
                <button className="ui-btn" onClick={() => { setTab('due'); loadDue(openDeck.id); }}>{t('flash.due', 'Takrorlash')}</button>
              </div>
              {busy && deckCards.length === 0 ? (
                <section className="ui-card" style={{ padding: 24, textAlign: 'center' }}>
                  <RefreshCw size={28} className="animate-spin" color="#94A3B8" />
                </section>
              ) : deckCards.length === 0 ? (
                <section className="ui-card" style={{ padding: 24, textAlign: 'center' }}>
                  <p style={{ margin: 0, fontWeight: 700 }}>{t('flash.emptyAll', 'Hali fleshkarta yo‘q')}</p>
                </section>
              ) : (
                renderCardGrid(deckCards)
              )}
            </>
          ) : (
            <>
              <p style={{ margin: 0, fontSize: 13, color: '#64748B', fontWeight: 600 }}>
                {t('flash.decksHint', 'Keys va testdagi xatolar hamda mavzu kartalari shu yerda.')}
              </p>
              {sortedDecks.length === 0 ? (
                <section className="ui-card" style={{ padding: 24, textAlign: 'center' }}>
                  <Layers size={28} color="#94A3B8" />
                  <p style={{ marginTop: 10, fontWeight: 700 }}>{t('flash.decksEmpty', 'Hali to‘plam yo‘q. Keys yoki test ishlang.')}</p>
                </section>
              ) : sortedDecks.map((deck) => (
                <div key={deck.id} className="ui-card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => openDeckCards(deck)}
                    style={{ flex: 1, minWidth: 0, textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
                  >
                    <div style={{ fontWeight: 800 }}>{deckTitle(deck)}</div>
                    <div style={{ fontSize: 12, color: '#64748B', fontWeight: 700 }}>
                      {deckKindLabel(deck)}
                      {deckKindLabel(deck) ? ' · ' : ''}
                      {deck.card_count || 0} · {t('flash.statsDue', 'Bugun')} {deck.due_count || 0}
                    </div>
                  </button>
                  <button className="ui-btn" onClick={() => { setTab('due'); loadDue(deck.id); }}>{t('flash.due', 'Takrorlash')}</button>
                  {deck.kind !== 'mistakes' && (
                    <button className="ui-icon-btn" onClick={() => handleDeleteDeck(deck.id)} style={{ border: 'none', color: '#DC2626' }}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      )}

    </div>
  );
}
