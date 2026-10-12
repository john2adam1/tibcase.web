import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  BookOpen,
  Heart,
  Wind,
  Brain,
  Baby,
  Siren,
  Bone,
  Droplet,
  Stethoscope,
  Scissors,
  Pill,
  Eye,
  Check,
  Inbox,
} from 'lucide-react';
import { api } from '../api';
import { useTranslation } from '../i18n.jsx';

// Department -> icon. Matched by keywords in the category name (any language).
const ICON_RULES = [
  [/kardio|cardio|yurak|сердц|кардио/i, Heart],
  [/pulmo|opka|o'pka|лёгк|легк|пульмон|nafas/i, Wind],
  [/nevro|neuro|miya|невро/i, Brain],
  [/pediat|bola|педиат|детск/i, Baby],
  [/reanim|shoshilinch|emergency|реаним|неотлож/i, Siren],
  [/ortoped|travma|suyak|bone|травм|ортопед/i, Bone],
  [/endokrin|diabet|эндокрин/i, Droplet],
  [/jarroh|surg|хирург/i, Scissors],
  [/farm|pharm|dori|фарм/i, Pill],
  [/oftalm|ko'z|глаз|офтальм/i, Eye],
];

function pickIcon(name) {
  const hit = ICON_RULES.find(([re]) => re.test(name || ''));
  return hit ? hit[1] : Stethoscope;
}

function DeptIcon({ name, ...props }) {
  return React.createElement(pickIcon(name), props);
}

const ml = (v) => {
  if (v && typeof v === 'object') return v.uz || v.ru || v.en || '';
  return v ?? '';
};

const ZIGZAG = [0, 56, 0, -56];

export default function RoadmapView({ category, onSelectNode, onBack }) {
  const { t, lang } = useTranslation();
  const [topics, setTopics] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const categoryId = category?.id;

  useEffect(() => {
    let isMounted = true;
    async function load() {
      // Kategoriya yo'q bo'lsa (masalan, sahifa yangilanganda) cheksiz "yuklanmoqda" holatida qolmasin
      if (!categoryId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      // Mavzular yiqilsa ham keyslar ko'rinaversin (ular "boshqa" bo'limga tushadi); faqat keyslar yiqilsa xato ko'rsatiladi.
      const [topicsRes, casesRes] = await Promise.allSettled([
        api.getTopics(categoryId),
        api.getAllCases({ category_id: categoryId }),
      ]);
      if (!isMounted) return;
      if (topicsRes.status === 'fulfilled') setTopics(topicsRes.value || []);
      else console.error('Topics load error:', topicsRes.reason);
      if (casesRes.status === 'fulfilled') {
        setCases(casesRes.value || []);
      } else {
        console.error('Cases load error:', casesRes.reason);
        setError(casesRes.reason?.message || t('common.error', 'Xatolik yuz berdi'));
      }
      setLoading(false);
    }
    load();
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, reloadKey, lang]);

  const categoryName = String(ml(category?.title || category?.name) || '');
  const categoryTitle = categoryName
    ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
    : t('roadmap.category', 'Kategoriya');
  const isHeart = pickIcon(categoryName) === Heart;

  const isDone = (c) => c.status === 'completed' || c.status === 'passed';
  const completedCount = cases.filter(isDone).length;

  // One section per topic, containing exactly the cases created for that topic.
  const sections = useMemo(() => {
    const list = topics
      .map((top, idx) => ({
        id: top.id,
        title: String(ml(top.name) || `${idx + 1}-${t('roadmap.topic', 'mavzu')}`),
        cases: cases.filter((c) => c.topic_id === top.id),
      }))
      .filter((s) => s.cases.length > 0);

    // Cases whose topic isn't in the list still must be reachable.
    const knownIds = new Set(topics.map((x) => x.id));
    const orphans = cases.filter((c) => !knownIds.has(c.topic_id));
    if (orphans.length > 0) {
      list.push({ id: 'other', title: String(ml(orphans[0].topic_name) || categoryTitle), cases: orphans });
    }
    return list;
  }, [topics, cases, categoryTitle, t]);

  return (
    <div style={{
      width: '100%',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px 16px 100px 16px',
      background: '#FFFDF9',
      boxSizing: 'border-box',
    }}>
      <div style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 4px 18px', gap: 12 }}>
          <button
            onClick={onBack}
            title={t('common.back', 'Orqaga')}
            style={{
              width: 44, height: 44, borderRadius: '50%', background: '#FFFFFF', border: '1px solid #E2E8F0',
              boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#0F172A', flexShrink: 0,
            }}
          >
            <ChevronLeft size={24} strokeWidth={2.4} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
            <DeptIcon name={categoryName} size={24} color="#EA580C" />
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#EA580C', margin: 0 }}>{categoryTitle}</h2>
          </div>

          <div style={{
            background: '#FFEDD5', border: '1px solid #FDBA74', borderRadius: 99,
            padding: '4px 12px', fontSize: 13, fontWeight: 700, color: '#EA580C',
          }}>
            {completedCount}/{cases.length}
          </div>
        </div>

        {loading && (
          <div aria-busy="true" aria-label={t('roadmap.loading', 'Mavzular yuklanmoqda...')} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ height: 84, borderRadius: 18, background: '#FFEDD5', animation: 'pulse 1.5s infinite' }} />
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transform: `translateX(${ZIGZAG[i]}px)` }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#F1F5F9', animation: 'pulse 1.5s infinite' }} />
                <div style={{ width: 110, height: 12, borderRadius: 6, background: '#F1F5F9', animation: 'pulse 1.5s infinite' }} />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 18, padding: '28px 20px',
            textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#B91C1C' }}>{error}</div>
            <button
              type="button"
              onClick={() => setReloadKey((k) => k + 1)}
              style={{
                padding: '9px 20px', borderRadius: 10, border: '1px solid #FCA5A5', background: '#FFFFFF',
                color: '#B91C1C', fontWeight: 700, fontSize: 13, cursor: 'pointer',
              }}
            >
              {t('common.retry', 'Qayta urinish')}
            </button>
          </div>
        )}

        {!loading && !error && sections.length === 0 && (
          <div style={{
            background: '#FFFFFF', borderRadius: 18, border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)',
            padding: '36px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          }}>
            <Inbox size={44} color="#94A3B8" />
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>
              {t('roadmap.emptyTitle', "Ushbu bo'limda hali keyslar mavjud emas")}
            </div>
          </div>
        )}

        {!loading && sections.map((section, sIdx) => (
          <section key={section.id} style={{ marginBottom: 40 }}>
            {/* Topic container */}
            <div style={{
              background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
              borderRadius: 18, boxShadow: 'var(--shadow-sm)', padding: '22px 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              marginBottom: 28, color: '#FFFFFF',
            }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, color: '#FED7AA', textTransform: 'uppercase', marginBottom: 4 }}>
                  {sIdx + 1}. {t('roadmap.section', 'SECTION')} · {section.cases.filter(isDone).length}/{section.cases.length} case
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', wordBreak: 'break-word' }}>
                  {section.title.toUpperCase()}
                </div>
              </div>
              <div style={{
                width: 48, height: 48, borderRadius: 16, background: 'rgba(255,255,255,0.25)', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <BookOpen size={24} color="#FFFFFF" strokeWidth={2.4} />
              </div>
            </div>

            {/* Case nodes: one icon per case */}
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {section.cases.length > 1 && (
                <div style={{
                  position: 'absolute', top: 36, bottom: 36, left: '50%', width: 0,
                  borderLeft: '6px dotted #E2E8F0', transform: 'translateX(-3px)', zIndex: 0,
                }} />
              )}

              {section.cases.map((c, i) => {
                const done = isDone(c);
                const subtitle = ml(c.subtitle);
                return (
                  <button
                    key={c.id}
                    id={`roadmap-case-${c.id}`}
                    type="button"
                    onClick={() => onSelectNode(c)}
                    style={{
                      position: 'relative', zIndex: 1, background: 'transparent', border: 'none', cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                      marginBottom: i === section.cases.length - 1 ? 0 : 28,
                      transform: `translateX(${ZIGZAG[i % ZIGZAG.length]}px)`,
                      maxWidth: 240, padding: 0, fontFamily: 'inherit',
                    }}
                  >
                    {i === 0 && !done && (
                      <span style={{
                        background: '#EA580C', color: '#FFF', borderRadius: 99, padding: '3px 12px',
                        fontSize: 11, fontWeight: 700, letterSpacing: 0.8,
                      }}>
                        START
                      </span>
                    )}
                    <span style={{
                      width: 72, height: 72, borderRadius: '50%',
                      background: done ? '#16A34A' : 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                      border: '4px solid #FFEDD5', boxShadow: 'var(--shadow-sm)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {done
                        ? <Check size={30} color="#FFF" strokeWidth={3} />
                        : <DeptIcon name={categoryName} size={30} color="#FFF" fill={isHeart ? '#FFF' : 'none'} />}
                    </span>
                    <span style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', lineHeight: 1.25 }}>
                        {ml(c.title)}
                      </span>
                      {subtitle && (
                        <span style={{ fontSize: 12, fontWeight: 500, color: '#64748B', lineHeight: 1.3 }}>
                          {subtitle}
                        </span>
                      )}
                      {c.difficulty && (() => {
                        const d = String(c.difficulty).toLowerCase();
                        const hard = d.includes('hard') || d.includes('qiyin');
                        const easy = d.includes('easy') || d.includes('oson');
                        return (
                          <span style={{
                            alignSelf: 'center', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                            background: hard ? '#FEE2E2' : easy ? '#DCFCE7' : '#FEF3C7',
                            color: hard ? '#B91C1C' : easy ? '#15803D' : '#B45309',
                          }}>
                            {hard ? t('modal.hard', 'Qiyin') : easy ? t('modal.easy', 'Oson') : t('modal.medium', "O'rta")}
                          </span>
                        );
                      })()}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
