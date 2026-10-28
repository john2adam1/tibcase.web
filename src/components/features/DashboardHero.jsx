import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, ChevronRight, Coins, Layers, Library, ExternalLink } from 'lucide-react';
import { api, peekTopicTotal, walletSpendable } from '../../api';
import { useTranslation } from '../../i18n.jsx';
import Skeleton from '../common/Skeleton.jsx';
import { CategoryCover, formatTitle, getCategoryMeta } from '../../views/CategoriesView.jsx';
import ClinicalFlashcard from '../flashcards/ClinicalFlashcard.jsx';

function Stat({ icon: Icon, value, label, onClick, loading = false }) {
  return (
    <button type="button" className="ui-card ui-card-press ui-stat" onClick={onClick}>
      <Icon size={24} color="var(--accent)" strokeWidth={2} />
      {loading ? (
        <Skeleton width={48} height="var(--stat-skel-h)" radius={8} style={{ margin: '4px 0' }} />
      ) : (
        <b>{value}</b>
      )}
      <span>{label}</span>
    </button>
  );
}

export function HomeBanner({ banners = [] }) {
  const { t } = useTranslation();
  const [slide, setSlide] = useState(0);
  const count = banners?.length || 0;

  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(() => setSlide((p) => (p + 1) % count), 6000);
    return () => clearInterval(timer);
  }, [count]);

  const banner = count > 0 ? banners[slide % count] : null;

  if (!banner) return null;

  return (
    <div
      className="ui-card"
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: 260,
        padding: 32,
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-premium)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        gap: 6,
        background: banner.image_url ? `linear-gradient(0deg, rgba(17,24,39,.75), rgba(17,24,39,.15)), url(${banner.image_url}) center/cover` : 'var(--text-primary)',
        color: '#fff',
        border: 'none',
      }}
    >
      <h2 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em' }}>{banner.title}</h2>
      {banner.description && <p style={{ fontSize: 16, opacity: 0.9, maxWidth: 520, lineHeight: 1.5 }}>{banner.description}</p>}
      {banner.link_url && (
        <a href={banner.link_url} target="_blank" rel="noreferrer" style={{ color: '#fff', fontSize: 14, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
          {t('common.more', 'Batafsil')} <ExternalLink size={13} />
        </a>
      )}
      {count > 1 && (
        <div style={{ position: 'absolute', top: 14, right: 16, display: 'flex', gap: 5 }}>
          {banners.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} aria-label={`Banner ${i + 1}`} style={{ width: i === slide ? 16 : 6, height: 6, borderRadius: 99, border: 'none', padding: 0, cursor: 'pointer', background: i === slide ? '#fff' : 'rgba(255,255,255,.5)' }} />
          ))}
        </div>
      )}
    </div>
  );
}

function categoryCoverSrc(cat) {
  return cat?.icon_url || cat?.image_url || cat?.icon || cat?.cover_image_url || '';
}

export function HomeCategoryCarousel({
  categories = [],
  onSelectCategory,
  onViewAll,
}) {
  const { t } = useTranslation();
  const trackRef = useRef(null);
  const pausedRef = useRef(false);
  const [items, setItems] = useState(categories);

  useEffect(() => {
    if (categories?.length) setItems(categories);
  }, [categories]);

  useEffect(() => {
    let live = true;
    api.getCategories()
      .then((data) => {
        if (live && Array.isArray(data) && data.length) setItems(data);
      })
      .catch(() => {});
    return () => { live = false; };
  }, []);

  useEffect(() => {
    if (!items || items.length <= 1) return undefined;
    const el = trackRef.current;
    if (!el) return undefined;
    const timer = setInterval(() => {
      if (pausedRef.current) return;
      const card = el.querySelector('.home-cat-card');
      if (!card) return;
      const step = card.offsetWidth + 12;
      const max = el.scrollWidth - el.clientWidth;
      const next = el.scrollLeft + step;
      if (next >= max - 4) el.scrollTo({ left: 0, behavior: 'smooth' });
      else el.scrollTo({ left: next, behavior: 'smooth' });
    }, 4000);
    return () => clearInterval(timer);
  }, [items]);

  return (
    <section className="home-cat-section">
      <div className="home-cat-head">
        <h2>{t('home.statDepartments', "Bo'limlar")}</h2>
        <button type="button" className="home-cat-all" onClick={onViewAll}>
          {t('home.departmentsAll', "Barchasini ko'rish")}
          <ChevronRight size={16} />
        </button>
      </div>

      {items.length > 0 && (
        <div
          ref={trackRef}
          className="home-cat-carousel no-scrollbar"
          onPointerEnter={() => { pausedRef.current = true; }}
          onPointerLeave={() => { pausedRef.current = false; }}
        >
          {items.map((cat) => {
            const meta = getCategoryMeta(cat);
            const title = formatTitle(cat.name);
            return (
              <div
                key={cat.id}
                role="button"
                tabIndex={0}
                className="home-cat-card ui-card ui-card-press"
                onClick={() => onSelectCategory?.({ ...cat, title, emoji: meta.emoji })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectCategory?.({ ...cat, title, emoji: meta.emoji });
                  }
                }}
              >
                <CategoryCover
                  src={categoryCoverSrc(cat)}
                  alt={title}
                  emoji={meta.emoji}
                  iconBg={meta.iconBg}
                  height={108}
                />
                <div className="home-cat-card-body">
                  <div style={{ minWidth: 0 }}>
                    <h3>{title}</h3>
                  </div>
                  <span className="home-cat-card-arrow">
                    <ChevronRight size={16} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export function HomeFlashcardCarousel({ onViewAll, streak }) {
  const { t } = useTranslation();
  const trackRef = useRef(null);
  const pausedRef = useRef(false);
  const [items, setItems] = useState([]);
  const [flippedId, setFlippedId] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let live = true;
    api.getImportantFlashcards(12)
      .then((list) => {
        if (live && Array.isArray(list)) setItems(list);
      })
      .catch(() => {});
    return () => { live = false; };
  }, []);

  useEffect(() => {
    pausedRef.current = Boolean(flippedId);
  }, [flippedId]);

  useEffect(() => {
    if (!items || items.length <= 1) return undefined;
    const el = trackRef.current;
    if (!el) return undefined;
    const timer = setInterval(() => {
      if (pausedRef.current) return;
      const card = el.querySelector('.home-fc-slide');
      if (!card) return;
      const step = card.offsetWidth + 12;
      const max = el.scrollWidth - el.clientWidth;
      const next = el.scrollLeft + step;
      if (next >= max - 4) el.scrollTo({ left: 0, behavior: 'smooth' });
      else el.scrollTo({ left: next, behavior: 'smooth' });
    }, 5000);
    return () => clearInterval(timer);
  }, [items]);

  const rate = async (card, rating) => {
    if (!card?.id || busyId) return;
    setBusyId(card.id);
    try {
      await api.reviewFlashcard(card.id, rating);
      setItems((prev) => prev.filter((c) => c.id !== card.id));
      setFlippedId(null);
    } catch (err) {
      throw err;
    } finally {
      setBusyId(null);
    }
  };

  if (!items.length) return null;

  return (
    <section className="home-cat-section">
      <div className="home-cat-head">
        <h2>{t('nav.flashcards', 'Fleshkartalar')}</h2>
        <button type="button" className="home-cat-all" onClick={onViewAll}>
          {t('home.departmentsAll', "Barchasini ko'rish")}
          <ChevronRight size={16} />
        </button>
      </div>
      <div
        ref={trackRef}
        className="home-cat-carousel no-scrollbar"
        onPointerEnter={() => { pausedRef.current = true; }}
        onPointerLeave={() => { if (!flippedId) pausedRef.current = false; }}
      >
        {items.map((card, i) => (
          <div key={card.id} className="home-fc-slide">
            <ClinicalFlashcard
              card={card}
              index={i}
              total={items.length}
              streak={streak}
              compact
              showMeta={false}
              busy={busyId === card.id}
              onRate={(rating) => rate(card, rating)}
              onFlipChange={(open) => {
                setFlippedId((prev) => (open ? card.id : (prev === card.id ? null : prev)));
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function DashboardHero({
  user,
  wallet,
  categories = [],
  topicsCount,
  flashcardStats,
  onOpenClinics,
  onOpenStore,
  onOpenFlashcards,
}) {
  const { t } = useTranslation();
  const coinValue = wallet?.has_subscription
    ? t('profile.unlimited', 'Cheksiz')
    : (wallet ? walletSpendable(wallet) : (user?.coins ?? 0));
  const flashTotal = flashcardStats == null
    ? null
    : (Number(flashcardStats.total) || 0);
  const [topics, setTopics] = useState(() => {
    if (typeof topicsCount === 'number') return topicsCount;
    const cached = peekTopicTotal();
    return typeof cached === 'number' ? cached : null;
  });

  useEffect(() => {
    if (typeof topicsCount === 'number') setTopics(topicsCount);
  }, [topicsCount]);

  useEffect(() => {
    let isMounted = true;
    api.getTopicTotal()
      .then((n) => {
        if (isMounted && typeof n === 'number') setTopics(n);
      })
      .catch(() => {
        if (isMounted) setTopics((prev) => (typeof prev === 'number' ? prev : 0));
      });
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="ui-stats">
      <Stat icon={Layers} value={categories?.length ?? 0} label={t('home.statDepartments', "Bo'limlar")} onClick={onOpenClinics} />
      <Stat
        icon={BookOpen}
        value={topics ?? 0}
        loading={topics == null}
        label={t('home.statTopics', 'Mavzular')}
        onClick={onOpenClinics}
      />
      <Stat
        icon={Library}
        value={flashTotal ?? 0}
        loading={flashTotal == null}
        label={t('home.statFlashcards', 'Fleshkartalar')}
        onClick={onOpenFlashcards}
      />
      <Stat icon={Coins} value={coinValue} label={t('nav.coins', 'Tangalar')} onClick={onOpenStore} />
    </div>
  );
}
