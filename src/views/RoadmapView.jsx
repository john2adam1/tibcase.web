import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
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
  Inbox,
} from 'lucide-react';
import { api, resolveMediaUrl } from '../api';
import { useTranslation } from '../i18n.jsx';
import KeysConfigModal from '../components/modals/KeysConfigModal.jsx';
import Skeleton from '../components/common/Skeleton.jsx';

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

export default function RoadmapView({ category, onStartPractice, onBack }) {
  const { t, lang } = useTranslation();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [configTopic, setConfigTopic] = useState(null);

  const categoryId = category?.id;

  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (!categoryId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const list = await api.getTopics(categoryId);
        if (isMounted) setTopics(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error('Topics load error:', err);
        if (isMounted) setError(err?.message || t('common.error', 'Xatolik yuz berdi'));
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, reloadKey, lang]);

  const categoryName = String(ml(category?.title || category?.name) || '');
  const categoryTitle = categoryName
    ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
    : t('roadmap.category', 'Kategoriya');
  const categoryImage = resolveMediaUrl(category?.icon_url || category?.image_url);
  const isHeart = pickIcon(categoryName) === Heart;

  const topicNodes = useMemo(() => {
    const list = [...topics];
    list.sort((a, b) => (a.order_num ?? 0) - (b.order_num ?? 0));
    return list.map((top, idx) => ({
      ...top,
      title: String(ml(top.name) || `${idx + 1}-${t('roadmap.topic', 'mavzu')}`),
    }));
  }, [topics, t]);

  return (
    <div className="ui-page" style={{ paddingBottom: 40, alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: 480, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
            {onBack && (
              <button
                className="ui-icon-btn page-inline-back"
                onClick={onBack}
                title={t('common.back', 'Orqaga')}
                aria-label={t('common.back', 'Orqaga')}
              >
                <ChevronLeft size={22} />
              </button>
            )}
            {categoryImage ? (
              <img
                src={categoryImage}
                alt={categoryTitle}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  objectFit: 'cover',
                  flexShrink: 0,
                  border: '1px solid var(--accent-border)',
                  background: 'var(--accent-soft)',
                }}
              />
            ) : (
              <DeptIcon name={categoryName} size={24} color="var(--accent)" />
            )}
            <h1 className="ui-title" style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>
              {categoryTitle}
            </h1>
          </div>

          <span className="ui-chip" style={{ fontSize: 13, fontWeight: 700, padding: '4px 12px' }}>
            {loading ? '…' : topicNodes.length}
          </span>
        </div>

        {loading && (
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 12 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 28 }}>
                <Skeleton width={72} height={72} radius="50%" />
                <Skeleton width={120} height={14} />
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

        {!loading && !error && topicNodes.length === 0 && (
          <div style={{
            background: '#FFFFFF', borderRadius: 18, border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)',
            padding: '36px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          }}>
            <Inbox size={44} color="#94A3B8" />
            <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>
              {t('roadmap.emptyTitle', "Ushbu bo'limda hozircha mavzular mavjud emas")}
            </div>
          </div>
        )}

        {!loading && !error && topicNodes.length > 0 && (
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {topicNodes.length > 1 && (
              <div style={{
                position: 'absolute', top: 36, bottom: 36, left: '50%', width: 0,
                borderLeft: '6px dotted var(--accent-border)', transform: 'translateX(-3px)', zIndex: 0,
              }} />
            )}

            {topicNodes.map((topic, i) => (
              <button
                key={topic.id}
                id={`roadmap-topic-${topic.id}`}
                type="button"
                onClick={() => setConfigTopic(topic)}
                style={{
                  position: 'relative', zIndex: 1, background: 'transparent', border: 'none', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  marginBottom: i === topicNodes.length - 1 ? 0 : 28,
                  transform: `translateX(${ZIGZAG[i % ZIGZAG.length]}px)`,
                  maxWidth: 240, padding: 0, fontFamily: 'inherit',
                }}
              >
                {i === 0 && (
                  <span style={{
                    background: 'var(--accent)', color: '#FFF', borderRadius: 99, padding: '3px 12px',
                    fontSize: 11, fontWeight: 700, letterSpacing: 0.8,
                  }}>
                    {t('roadmap.start', 'START')}
                  </span>
                )}
                <span style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #22C55E 0%, var(--accent) 100%)',
                  border: '4px solid var(--accent-soft)',
                  boxShadow: '0 8px 20px rgba(22, 163, 74, 0.28)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <DeptIcon name={categoryName} size={30} color="#FFF" fill={isHeart ? '#FFF' : 'none'} />
                </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', lineHeight: 1.25, textAlign: 'center' }}>
                  {topic.title}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <KeysConfigModal
        open={Boolean(configTopic)}
        onClose={() => setConfigTopic(null)}
        lockedCategory={category}
        lockedTopic={configTopic}
        onStart={(payload) => {
          setConfigTopic(null);
          onStartPractice?.({
            mode: payload.mode === 'test' ? 'test' : 'case',
            category_id: payload.categoryId || undefined,
            topic_ids: payload.topicId ? [payload.topicId] : [],
            difficulty: payload.difficulty || undefined,
            count: payload.count,
            start: true,
          });
        }}
      />
    </div>
  );
}
