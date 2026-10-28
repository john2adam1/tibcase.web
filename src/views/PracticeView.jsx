import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  Play,
  RefreshCw,
  Flag,
  BookOpen,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Coins,
  Zap,
  Layers,
} from 'lucide-react';
import {
  api,
  formatApiError,
  isInsufficientCoinsError,
  localizeText,
  resolveMediaUrl,
} from '../api';
import { useTranslation } from '../i18n.jsx';
import { formatTitle } from './CategoriesView.jsx';

const DIFFICULTIES = [
  { id: 'easy', labelKey: 'modal.easy', fallback: 'Oson' },
  { id: 'medium', labelKey: 'modal.medium', fallback: "O'rta" },
  { id: 'hard', labelKey: 'modal.hard', fallback: 'Qiyin' },
];

function patientEntries(patient) {
  if (!patient || typeof patient !== 'object') return [];
  return Object.entries(patient).filter(([, value]) => value != null && String(value).trim() !== '');
}

function SourceBlock({ sources, note, t }) {
  const list = Array.isArray(sources) ? sources : [];
  const icon = (type) => {
    if (type === 'book') return '📖';
    if (type === 'article') return '📄';
    if (type === 'website') return '🌐';
    return '';
  };
  if (!list.length) {
    if (!note) return null;
    return <p style={{ margin: '10px 0 0', fontSize: 13, color: '#64748B' }}>{note}</p>;
  }
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 6 }}>
        {t('practice.sources', 'Foydalanilgan manbalar')} ({list.length})
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {list.map((src, i) => {
          const title = localizeText(src.title) || src.title || 'Manba';
          const locator = src.locator ? ` — ${src.locator}` : '';
          const author = src.author ? ` · ${src.author}` : '';
          const label = `${icon(src.type)} ${title}${author}${locator}`.trim();
          if (src.type === 'website' && src.url) {
            return (
              <a key={src.source_id || i} href={src.url} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: '#2563EB', fontWeight: 600 }}>
                {label}
              </a>
            );
          }
          return (
            <div key={src.source_id || i} style={{ fontSize: 13, color: '#334155', fontWeight: 600 }}>
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function verdictMeta(verdict, t) {
  if (verdict === 'correct') return { color: '#16A34A', bg: '#DCFCE7', Icon: CheckCircle2, label: t('practice.verdictCorrect', "To'g'ri") };
  if (verdict === 'partial') return { color: '#D97706', bg: '#FEF3C7', Icon: MinusCircle, label: t('practice.verdictPartial', 'Qisman') };
  return { color: '#DC2626', bg: '#FEE2E2', Icon: XCircle, label: t('practice.verdictWrong', "Noto'g'ri") };
}

function shouldAutoStart(cfg) {
  if (!cfg || cfg.setup) return false;
  return Boolean(
    cfg.start
    || String(cfg.topic_text || '').trim()
    || cfg.category_id
    || (Array.isArray(cfg.topic_ids) && cfg.topic_ids.length)
  );
}

export default function PracticeView({
  categories = [],
  initialConfig = null,
  onBack,
  onToast,
  onInsufficientCoins,
  onOpenFlashcards,
  onWalletRefresh,
}) {
  const { t } = useTranslation();
  const autoStart = shouldAutoStart(initialConfig);
  const [phase, setPhase] = useState(autoStart ? 'loading' : 'setup');
  const [mode] = useState(initialConfig?.mode === 'test' ? 'test' : 'case');
  const [source, setSource] = useState(initialConfig?.topic_text ? 'free' : 'catalog');
  const [categoryId, setCategoryId] = useState(initialConfig?.category_id || '');
  const [topicId, setTopicId] = useState(initialConfig?.topic_ids?.[0] || '');
  const [topics, setTopics] = useState([]);
  const [difficulty, setDifficulty] = useState(initialConfig?.difficulty || 'medium');
  const [count, setCount] = useState(initialConfig?.count || 10);
  const [topicText, setTopicText] = useState(initialConfig?.topic_text || '');
  const [session, setSession] = useState(null);
  const [item, setItem] = useState(null);
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState('');

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

  useEffect(() => {
    if (!autoStart) return undefined;
    startSession(initialConfig);
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fail = (err) => {
    if (isInsufficientCoinsError(err)) {
      onInsufficientCoins?.();
      return;
    }
    const msg = formatApiError(err, t);
    setError(msg);
    onToast?.(msg);
  };

  const buildPayload = (cfg) => {
    const src = cfg || {
      mode,
      source,
      category_id: categoryId,
      topic_ids: topicId ? [topicId] : [],
      difficulty,
      count,
      topic_text: topicText,
    };
    const payload = {
      mode: src.mode || 'case',
      difficulty: src.difficulty && src.difficulty !== 'random' ? src.difficulty : 'medium',
    };
    if ((src.topic_text || '').trim()) {
      payload.topic_text = String(src.topic_text).trim();
    } else {
      if (src.category_id) payload.category_id = src.category_id;
      if (src.topic_ids?.length) payload.topic_ids = src.topic_ids;
    }
    if (payload.mode === 'test') payload.count = Math.min(50, Math.max(1, Number(src.count) || 10));
    return payload;
  };

  const loadNext = async (sessionId) => {
    const next = await api.nextPracticeItem(sessionId);
    const nextItem = next?.item
      || next?.items?.find((it) => !it.answered)
      || ((next?.chief_complaint || next?.question) ? next : null);
    if (nextItem) {
      setItem(nextItem);
      setAnswer('');
      setResult(null);
      setPhase('item');
      return;
    }
    await finishNow(sessionId);
  };

  const startSession = async (cfg) => {
    setBusy(true);
    setError('');
    setPhase('loading');
    try {
      const started = await api.startPracticeSession(buildPayload(cfg));
      setSession(started);
      const first = started?.items?.find((it) => !it.answered) || started?.items?.[0];
      if (first && !first.answered) {
        setItem(first);
        setPhase('item');
      } else {
        await loadNext(started.id);
      }
      onWalletRefresh?.();
    } catch (err) {
      setPhase('setup');
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const finishNow = async (sessionId) => {
    let finished = session;
    try {
      finished = await api.finishPracticeSession(sessionId || session?.id);
    } catch {
      try { finished = await api.getPracticeSession(sessionId || session?.id); } catch { /* keep */ }
    }
    setSession(finished);
    setPhase('results');
    pollFlashcards(finished);
    onWalletRefresh?.();
  };

  const pollFlashcards = async (current) => {
    if (!current?.id || current.flashcards_status !== 'pending') return;
    for (let i = 0; i < 10; i += 1) {
      await new Promise((r) => setTimeout(r, 2500));
      try {
        const fresh = await api.getPracticeSession(current.id);
        setSession(fresh);
        if (fresh?.flashcards_status && fresh.flashcards_status !== 'pending') return;
      } catch {
        return;
      }
    }
  };

  const handleAnswer = async () => {
    if (!item?.id || busy) return;
    const value = item.kind === 'test' ? answer : answer.trim();
    if (!value) return;
    setBusy(true);
    setError('');
    try {
      const res = await api.answerPracticeItem(item.id, value);
      setResult(res?.item || res);
      if (res?.session) setSession(res.session);
      if (res?.session_finished) {
        setSession(res.session || session);
        setPhase('results');
        pollFlashcards(res.session || session);
        onWalletRefresh?.();
      }
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const handleNext = async () => {
    if (!session?.id) return;
    setBusy(true);
    setError('');
    try {
      await loadNext(session.id);
    } catch (err) {
      if (err?.code === 'practice_limit_reached' || err?.code === 'session_not_active') {
        await finishNow(session.id);
      } else {
        fail(err);
      }
    } finally {
      setBusy(false);
    }
  };

  const handleReport = async () => {
    if (!item?.id || !reportText.trim()) return;
    try {
      await api.reportPracticeItem(item.id, reportText.trim());
      setReportOpen(false);
      setReportText('');
      onToast?.(t('pm.feedbackSent', 'Xabar yuborildi'));
    } catch (err) {
      fail(err);
    }
  };

  const progressLabel = useMemo(() => {
    if (!session) return '';
    const answered = session.answered ?? 0;
    const total = session.total_items || session.generated || 0;
    if (session.mode === 'test' && total) return `${answered}/${total}`;
    return `${(item?.idx ?? answered) + (result ? 1 : 0) || answered}`;
  }, [session, item, result]);

  return (
    <div className="ui-page" style={{ paddingBottom: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <button className="ui-icon-btn" onClick={onBack} aria-label={t('common.back', 'Orqaga')} style={{ border: 'none' }}>
          <ChevronLeft size={22} />
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: 20 }}>
            {mode === 'test' ? t('practice.startTest', 'Test yechish') : t('practice.startCase', 'Keys yechish')}
          </h2>
          {session && (
            <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>
              {session.mode === 'test' ? t('practice.modeTest', 'Test') : t('practice.modeCase', 'Keys')} · {progressLabel}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: 12, padding: '10px 12px', borderRadius: 12, background: '#FEF2F2', color: '#B91C1C', fontSize: 13, fontWeight: 600 }}>
          {error}
        </div>
      )}

      {phase === 'setup' && (
        <section className="ui-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="ui-btn" onClick={() => setSource('catalog')} style={{ flex: 1, background: source === 'catalog' ? '#0F172A' : '#F1F5F9', color: source === 'catalog' ? '#fff' : '#334155', border: 'none' }}>
              {t('practice.catalogTopic', "Bo'lim / mavzu")}
            </button>
            <button type="button" className="ui-btn" onClick={() => setSource('free')} style={{ flex: 1, background: source === 'free' ? '#0F172A' : '#F1F5F9', color: source === 'free' ? '#fff' : '#334155', border: 'none' }}>
              {t('practice.freeTopic', 'Erkin mavzu')}
            </button>
          </div>

          {source === 'free' ? (
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span className="ui-label">{t('practice.topicTextHint', 'Tibbiy mavzu (3–200 belgi)')}</span>
              <textarea
                className="ui-select"
                rows={3}
                maxLength={200}
                value={topicText}
                onChange={(e) => setTopicText(e.target.value)}
                placeholder={t('practice.topicTextPh', 'Masalan: Qandli diabet 2-tur asoratlari')}
              />
            </label>
          ) : (
            <>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span className="ui-label">{t('practice.pickCategory', "Bo'lim")}</span>
                <select className="ui-select" value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setTopicId(''); }}>
                  <option value="">{t('modal.randomOption')}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{formatTitle(cat.name || cat.title)}</option>
                  ))}
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span className="ui-label">{t('practice.pickTopic', 'Mavzu')}</span>
                <select
                  className="ui-select"
                  value={topicId}
                  disabled={!categoryId}
                  onChange={(e) => setTopicId(e.target.value)}
                >
                  <option value="">{categoryId ? t('modal.randomTopic') : t('practice.pickCategoryFirst', "Avval bo'lim tanlang")}</option>
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>{formatTitle(topic.title || topic.name)}</option>
                  ))}
                </select>
              </label>
            </>
          )}

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="ui-label">{t('practice.pickDifficulty', 'Qiyinlik')}</span>
            <select className="ui-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              {DIFFICULTIES.map((d) => (
                <option key={d.id} value={d.id}>{t(d.labelKey, d.fallback)}</option>
              ))}
            </select>
          </label>

          {mode === 'test' && (
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span className="ui-label">{t('practice.count', 'Soni')}</span>
              <input className="ui-select" type="number" min={1} max={50} value={count} onChange={(e) => setCount(e.target.value)} />
            </label>
          )}

          <button
            className="ui-btn ui-btn-primary ui-btn-block"
            disabled={busy || (source === 'free' && topicText.trim().length < 3)}
            onClick={() => startSession()}
          >
            <Play size={16} fill="#fff" />
            {t('modal.startBtn', 'Boshlash')}
          </button>
        </section>
      )}

      {phase === 'loading' && (
        <section className="ui-card" style={{ padding: 28, textAlign: 'center' }}>
          <RefreshCw size={28} className="animate-spin" color="var(--accent)" />
          <p style={{ marginTop: 12, fontWeight: 700 }}>
            {mode === 'test'
              ? t('practice.generatingTest', 'AI test tayyorlamoqda…')
              : t('practice.generating', 'AI keys tayyorlamoqda…')}
          </p>
        </section>
      )}

      {phase === 'item' && item && (
        <section className="ui-card" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {item.kind === 'test' ? (
            <>
              <h3 style={{ margin: 0, fontSize: 18 }}>{item.question}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(item.options || []).map((opt) => {
                  const key = opt.key || opt.id;
                  const selected = answer === key;
                  const revealed = Boolean(result);
                  const isCorrect = result?.correct_key === key;
                  const bg = revealed && isCorrect ? '#DCFCE7' : revealed && selected ? '#FEE2E2' : selected ? '#E0F2FE' : '#F8FAFC';
                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={revealed || busy}
                      onClick={() => setAnswer(key)}
                      style={{
                        textAlign: 'left',
                        padding: '12px 14px',
                        borderRadius: 14,
                        border: `1px solid ${selected ? '#38BDF8' : '#E2E8F0'}`,
                        background: bg,
                        fontWeight: 700,
                        cursor: revealed ? 'default' : 'pointer',
                      }}
                    >
                      {key}. {opt.text}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 700, lineHeight: 1.45 }}>
                {item.chief_complaint}
              </p>
              {patientEntries(item.patient).map(([key, value]) => (
                <div key={key}>
                  <div className="ui-label" style={{ textTransform: 'uppercase' }}>{key}</div>
                  <div style={{ fontSize: 14, color: '#334155', whiteSpace: 'pre-wrap' }}>{String(value)}</div>
                </div>
              ))}
              {item.image_url && (
                <figure style={{ margin: 0 }}>
                  <img
                    src={resolveMediaUrl(item.image_url)}
                    alt={item.image_type || 'practice'}
                    style={{ width: '100%', borderRadius: 14, display: 'block' }}
                  />
                  <figcaption style={{ fontSize: 12, color: '#64748B', marginTop: 6 }}>
                    {item.image_note || t('practice.imageNote', 'AI yaratgan illyustrativ tasvir (ta’lim maqsadida), haqiqiy bemor tasviri emas.')}
                  </figcaption>
                </figure>
              )}
              {!result && (
                <textarea
                  className="ui-select"
                  rows={5}
                  maxLength={4000}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={t('practice.yourAnswer', 'Tashxis va davolashni yozing…')}
                />
              )}
            </>
          )}

          {result && (
            <div>
              {(() => {
                const meta = verdictMeta(result.verdict, t);
                const Icon = meta.Icon;
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: meta.bg, color: meta.color, padding: '10px 12px', borderRadius: 12, fontWeight: 800 }}>
                    <Icon size={18} />
                    {meta.label} · {result.score ?? 0}
                  </div>
                );
              })()}
              {(result.feedback || result.explanation) && (
                <p style={{ margin: '10px 0 0', fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  {result.feedback || result.explanation}
                </p>
              )}
              {result.correct_answer && (
                <p style={{ margin: '8px 0 0', fontSize: 13, color: '#166534' }}>
                  {t('practice.correctAnswer', "To'g'ri javob")}: {result.correct_answer}
                </p>
              )}
              <SourceBlock sources={result.sources} note={result.sources_note} t={t} />
            </div>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            {!result ? (
              <button className="ui-btn ui-btn-primary ui-btn-block" disabled={busy || !answer} onClick={handleAnswer}>
                {busy ? <RefreshCw size={16} className="animate-spin" /> : null}
                {t('practice.submit', 'Javobni yuborish')}
              </button>
            ) : (
              <button className="ui-btn ui-btn-primary ui-btn-block" disabled={busy} onClick={handleNext}>
                {busy ? <RefreshCw size={16} className="animate-spin" /> : null}
                {t('practice.next', 'Keyingisi')}
              </button>
            )}
            <button className="ui-icon-btn" onClick={() => setReportOpen((v) => !v)} title={t('practice.report', 'Shikoyat')} style={{ border: '1px solid #E2E8F0' }}>
              <Flag size={16} />
            </button>
          </div>
          {session?.mode === 'case' && (
            <button type="button" onClick={() => finishNow(session.id)} style={{ background: 'none', border: 'none', color: '#64748B', fontWeight: 700, cursor: 'pointer' }}>
              {t('practice.finish', 'Sessiyani yakunlash')}
            </button>
          )}
          {reportOpen && (
            <div>
              <textarea className="ui-select" rows={3} value={reportText} onChange={(e) => setReportText(e.target.value)} placeholder={t('practice.reportPh', 'Nima noto‘g‘ri?')} />
              <button className="ui-btn" style={{ marginTop: 8 }} onClick={handleReport}>{t('practice.report', 'Shikoyat yuborish')}</button>
            </div>
          )}
        </section>
      )}

      {phase === 'results' && session && (
        <section className="ui-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h3 style={{ margin: 0 }}>{t('practice.results', 'Natija')}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            <ResultStat icon={BookOpen} label={t('practice.score', 'Ball')} value={Math.round(session.score || 0)} />
            <ResultStat icon={Zap} label={t('practice.xp', 'XP')} value={session.xp_earned || 0} />
            <ResultStat icon={Layers} label={t('practice.tokens', 'Token')} value={session.tokens_used || 0} />
            <ResultStat icon={Coins} label={t('practice.coinsSpent', 'Sarflangan tanga')} value={session.coins_spent || 0} />
          </div>
          <p style={{ margin: 0, fontSize: 14, color: '#334155' }}>
            {session.flashcards_status === 'pending'
              ? t('practice.flashcardsPending', 'Fleshkartalar yaratilmoqda…')
              : t('practice.flashcardsCreated', '{n} ta yangi fleshkarta yaratildi').replace('{n}', String(session.flashcards_created || 0))}
          </p>
          <button className="ui-btn ui-btn-primary" onClick={() => { setSession(null); setItem(null); setResult(null); setPhase('setup'); }}>
            {t('practice.again', 'Yana mashq')}
          </button>
          <button className="ui-btn" onClick={onOpenFlashcards}>
            {t('nav.flashcards', 'Fleshkartalar')}
          </button>
        </section>
      )}
    </div>
  );
}

function ResultStat({ icon: Icon, label, value }) {
  return (
    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 14, padding: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B', fontSize: 12, fontWeight: 700 }}>
        <Icon size={14} /> {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{value}</div>
    </div>
  );
}
