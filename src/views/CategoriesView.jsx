import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  Folder,
  Star,
  Clock,
  Activity,
  CheckCircle2,
  ChevronRight,
  Award,
  Zap,
  Coins,
  FileText,
  Play,
  Bookmark,
  Calendar,
} from 'lucide-react';
import { api, extractList, resolveMediaUrl } from '../api';
import { useTranslation } from '../i18n.jsx';
import Skeleton from '../components/common/Skeleton.jsx';

export const getCategoryMeta = (cat) => {
  const name = String(cat?.name || '').toLowerCase();
  if (name.includes('kardio') || name.includes('cardio') || name.includes('yurak')) {
    return { emoji: '❤️', iconBg: '#FEE2E2', iconBorder: '#FCA5A5', color: '#EF4444' };
  }
  if (name.includes('shoshilinch') || name.includes('emerg') || name.includes('tez yordam')) {
    return { emoji: '🚑', iconBg: '#FFEDD5', iconBorder: '#FDBA74', color: '#F97316' };
  }
  if (name.includes('ichki') || name.includes('internal') || name.includes('terapiya')) {
    return { emoji: '🩺', iconBg: '#E0F2FE', iconBorder: '#7DD3FC', color: '#0EA5E9' };
  }
  if (name.includes('neyro') || name.includes('neuro') || name.includes('asab')) {
    return { emoji: '🧠', iconBg: '#FCE7F3', iconBorder: '#F472B6', color: '#EC4899' };
  }
  if (name.includes('jarroh') || name.includes('surg') || name.includes('operatsiya')) {
    return { emoji: '🔬', iconBg: '#CCFBF1', iconBorder: '#5EEAD4', color: '#14B8A6' };
  }
  if (name.includes('pediatr') || name.includes('bola')) {
    return { emoji: '👨‍👩‍👧', iconBg: '#FEF9C3', iconBorder: '#FDE047', color: '#EAB308' };
  }
  if (name.includes('ortoped') || name.includes('travma')) {
    return { emoji: '🦴', iconBg: '#FFEDD5', iconBorder: '#FDBA74', color: '#F59E0B' };
  }
  if (name.includes('derma') || name.includes('teri')) {
    return { emoji: '🩹', iconBg: '#EDE9FE', iconBorder: '#C4B5FD', color: '#8B5CF6' };
  }
  return { emoji: '🩺', iconBg: '#DCFCE7', iconBorder: '#86EFAC', color: '#16A34A' };
};

export const formatTitle = (name) => {
  const str = String(name ?? '');
  if (!str) return 'Kategoriya';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function CategoryCover({ src, alt, emoji, iconBg, height = 120 }) {
  const [failed, setFailed] = useState(false);
  const url = resolveMediaUrl(src);
  const showImg = Boolean(url) && !failed;
  return (
    <div
      style={{
        height,
        background: showImg ? '#F1F5F9' : iconBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {showImg ? (
        <img
          src={url}
          alt={alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={() => setFailed(true)}
        />
      ) : (
        <span style={{ fontSize: 40, lineHeight: 1 }}>{emoji}</span>
      )}
    </div>
  );
}

export default function CategoriesView({
  categories: initialCategories = [],
  initialSubTab = 'categories', // 'categories' | 'favorites' | 'history'
  onSelectCategory,
  onSelectCase,
  onOpenDebrief,
  onStartCase,
  onBack,
}) {
  const { t, lang } = useTranslation();
  const [activeTab, setActiveTab] = useState(initialSubTab);

  // 1. Categories State
  const [categories, setCategories] = useState(initialCategories);
  const [categoriesLoading, setCategoriesLoading] = useState(!initialCategories || initialCategories.length === 0);

  // 2. Favorites State
  const [favoritesList, setFavoritesList] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  // 3. History State (Ongoing & Completed)
  const [ongoingSims, setOngoingSims] = useState([]);
  const [completedSims, setCompletedSims] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Real API errors per tab + retry trigger
  const [loadError, setLoadError] = useState({ categories: '', favorites: '', history: '' });
  const [reloadKey, setReloadKey] = useState(0);
  const setTabError = (tab, message) => setLoadError((prev) => ({ ...prev, [tab]: message }));

  // Subtabs definitions
  const subTabs = [
    { id: 'categories', label: t('casesHub.tabCategories', "Bo'limlar"), icon: Folder },
    { id: 'favorites', label: t('casesHub.tabFavorites', 'Sevimlilar'), icon: Star },
    { id: 'history', label: t('casesHub.tabHistory', 'Tarix'), icon: Clock },
  ];

  // GET /mobile/category -> { categories: [], count }
  useEffect(() => {
    let isMounted = true;
    async function loadApiCategories() {
      try {
        if (!initialCategories?.length) setCategoriesLoading(true);
        setTabError('categories', '');
        const data = await api.getCategories();
        if (isMounted) setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Categories load error:', err);
        if (isMounted) setTabError('categories', err?.message || 'Xatolik yuz berdi');
      } finally {
        if (isMounted) setCategoriesLoading(false);
      }
    }
    loadApiCategories();
    return () => { isMounted = false; };
  }, [reloadKey, lang]);

  // GET /mobile/favorite -> { cases: [], count }
  useEffect(() => {
    if (activeTab !== 'favorites') return;
    let isMounted = true;

    async function loadFavorites() {
      try {
        setFavoritesLoading(true);
        setTabError('favorites', '');
        const list = await api.getFavorites(50, 1);
        if (isMounted) setFavoritesList(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error('Favorites load error:', err);
        if (isMounted) setTabError('favorites', err?.message || 'Xatolik yuz berdi');
      } finally {
        if (isMounted) setFavoritesLoading(false);
      }
    }

    loadFavorites();
    return () => { isMounted = false; };
  }, [activeTab, reloadKey, lang]);

  // GET /mobile/simulation/ongoing|completed -> { sessions: [], count }
  useEffect(() => {
    if (activeTab !== 'history') return;
    let isMounted = true;

    async function loadHistory() {
      try {
        setHistoryLoading(true);
        setTabError('history', '');
        const [ongoingRes, completedRes] = await Promise.all([
          api.getOngoingSimulations(),
          api.getCompletedSimulations(),
        ]);
        if (isMounted) {
          setOngoingSims(extractList(ongoingRes));
          setCompletedSims(extractList(completedRes));
        }
      } catch (err) {
        console.error('History load error:', err);
        if (isMounted) setTabError('history', err?.message || 'Xatolik yuz berdi');
      } finally {
        if (isMounted) setHistoryLoading(false);
      }
    }

    loadHistory();
    return () => { isMounted = false; };
  }, [activeTab, reloadKey, lang]);

  const renderError = (message) => (
    <div
      style={{
        textAlign: 'center',
        padding: '32px 20px',
        background: '#FEF2F2',
        border: '1px solid #FECACA',
        borderRadius: 18,
        marginBottom: 16,
      }}
    >
      <p style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: '#B91C1C' }}>{message}</p>
      <button
        onClick={() => setReloadKey((k) => k + 1)}
        style={{
          padding: '8px 18px',
          borderRadius: 10,
          border: '1px solid #FCA5A5',
          background: '#FFFFFF',
          color: '#B91C1C',
          fontWeight: 700,
          fontSize: 13,
          cursor: 'pointer',
        }}
      >
        {t('common.retry', 'Qayta urinish')}
      </button>
    </div>
  );

  // Favorite toggle handler
  const handleToggleFavorite = async (e, c) => {
    e.stopPropagation();
    try {
      // Optimistic update
      setFavoritesList((prev) => prev.filter((item) => item.id !== c.id));
      await api.toggleFavorite(c.id);
    } catch (err) {
      console.error('Toggle favorite error:', err);
    }
  };

  const getDifficultyBadge = (diff) => {
    const d = String(diff || '').toLowerCase();
    if (d.includes('easy') || d.includes('oson')) {
      return { text: t('modal.easy', 'Oson'), bg: '#DCFCE7', color: '#15803D' };
    }
    if (d.includes('hard') || d.includes('qiyin')) {
      return { text: t('modal.hard', 'Qiyin'), bg: '#FEE2E2', color: '#B91C1C' };
    }
    return { text: t('modal.medium', "O'rta"), bg: '#FEF3C7', color: '#B45309' };
  };

  return (
    <div className="ui-page" style={{ paddingBottom: 40 }}>
      {/* Top Header & Subtabs */}
      <div style={{ marginBottom: 20 }}>
        {/* Top Back & Page Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          {onBack && (
            <button
              className="ui-icon-btn page-inline-back"
              onClick={onBack}
              title={t('cat.back', 'Orqaga')}
              aria-label={t('cat.back', 'Orqaga')}
            >
              <ChevronLeft size={22} />
            </button>
          )}
          <div>
            <h1 className="ui-title" style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>
              {t('nav.casesHub', 'Keyslar')}
            </h1>
            <p className="ui-subtitle" style={{ fontSize: 13, margin: '2px 0 0' }}>
              {activeTab === 'categories' && t('casesHub.categoriesSubtitle', "O'zingiz qiziqqan yo'nalishni tanlang va amaliyotni boshlang")}
              {activeTab === 'favorites' && t('casesHub.favoritesSubtitle', 'Saqlangan va muhim klinik keyslaringiz')}
              {activeTab === 'history' && t('casesHub.historySubtitle', "O'tgan barcha keyslar va erishilgan natijalar")}
            </p>
          </div>
        </div>

        {/* Segmented Control Subtabs */}
        <div
          role="tablist"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            background: 'var(--bg-muted, #F1F5F9)',
            borderRadius: 14,
            padding: 4,
            gap: 4,
            border: '1px solid var(--border-color, #E2E8F0)',
          }}
        >
          {subTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                id={`subtab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: isActive ? '1px solid rgba(22, 163, 74, 0.2)' : '1px solid transparent',
                  background: isActive ? '#FFFFFF' : 'transparent',
                  color: isActive ? '#16A34A' : '#64748B',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: 13,
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.06)' : 'none',
                  transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={16} strokeWidth={isActive ? 2.4 : 2} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================
          TAB 1: BO'LIMLAR (CATEGORIES)
          ============================================================ */}
      {activeTab === 'categories' && (
        <div>
          {categoriesLoading && (
            <div className="ui-grid">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    overflow: 'hidden',
                    minHeight: 180,
                    borderRadius: 18,
                    border: '1px solid #E2E8F0',
                    background: '#FFFFFF',
                  }}
                >
                  <Skeleton height={120} radius={0} />
                  <div style={{ padding: '14px 16px 16px' }}>
                    <Skeleton width="55%" height={16} style={{ marginBottom: 10 }} />
                    <Skeleton width={72} height={20} radius={12} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!categoriesLoading && loadError.categories && renderError(loadError.categories)}

          {!categoriesLoading && !loadError.categories && categories.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '48px 20px',
                background: '#FFFFFF',
                borderRadius: 18,
                border: '1px solid #E2E8F0',
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 8 }}>📁</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: '#0F172A' }}>
                {t('cat.empty', "Bo'limlar topilmadi")}
              </h3>
            </div>
          )}

          {!categoriesLoading && categories.length > 0 && (
            <div className="ui-grid">
              {categories.map((cat) => {
                const meta = getCategoryMeta(cat);
                const title = formatTitle(cat.name);
                return (
                  <div
                    key={cat.id}
                    id={`cat-card-${cat.id}`}
                    className="ui-card ui-card-press"
                    onClick={() => onSelectCategory && onSelectCategory({ ...cat, title, emoji: meta.emoji })}
                    style={{
                      padding: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      minHeight: 180,
                      borderRadius: 18,
                      border: '1px solid #E2E8F0',
                      background: '#FFFFFF',
                      boxShadow: 'var(--shadow-sm)',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    }}
                  >
                    <CategoryCover
                      src={cat.icon_url || cat.image_url}
                      alt={title}
                      emoji={meta.emoji}
                      iconBg={meta.iconBg}
                    />

                    <div style={{ padding: '14px 16px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                      <div style={{ minWidth: 0 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.25 }}>
                          {title}
                        </h3>
                      </div>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: '#F1F5F9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#64748B',
                          flexShrink: 0,
                        }}
                      >
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          TAB 2: SEVIMLILAR (FAVORITES)
          ============================================================ */}
      {activeTab === 'favorites' && (
        <div>
          {!favoritesLoading && loadError.favorites && renderError(loadError.favorites)}

          {!favoritesLoading && !loadError.favorites && favoritesList.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '48px 24px',
                background: '#FFFFFF',
                borderRadius: 20,
                border: '1px solid #E2E8F0',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 20,
                  background: '#FEF3C7',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <Star size={32} strokeWidth={2.2} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>
                {t('casesHub.noFavorites', 'Hozircha sevimlilar mavjud emas')}
              </h3>
              <p style={{ fontSize: 13, color: '#64748B', margin: 0, lineHeight: 1.5, maxWidth: 360, marginInline: 'auto' }}>
                {t('casesHub.noFavoritesDesc', "Keyslarni ko'rayotganda yulduzcha ustiga bosib saqlab qo'yishingiz mumkin")}
              </p>
            </div>
          )}

          {!favoritesLoading && favoritesList.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {favoritesList.map((cs) => {
                const badge = getDifficultyBadge(cs.difficulty);
                return (
                  <div
                    key={cs.id}
                    id={`fav-case-${cs.id}`}
                    onClick={() => onSelectCase && onSelectCase(cs)}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: 18,
                      border: '1px solid #E2E8F0',
                      padding: '16px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 14,
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 14,
                          background: '#EFF6FF',
                          border: '1px solid #BFDBFE',
                          color: '#2563EB',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 20,
                          flexShrink: 0,
                        }}
                      >
                        🩺
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {cs.title}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              padding: '2px 7px',
                              borderRadius: 6,
                              background: badge.bg,
                              color: badge.color,
                            }}
                          >
                            {badge.text}
                          </span>
                          {cs.category_name && (
                            <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>
                              • {cs.category_name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        title="Olib tashlash"
                        onClick={(e) => handleToggleFavorite(e, cs)}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: '#FEF3C7',
                          border: '1px solid #FDE68A',
                          color: '#F59E0B',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Star size={18} fill="#F59E0B" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================
          TAB 3: TARIX (HISTORY)
          ============================================================ */}
      {activeTab === 'history' && (
        <div>
          {!historyLoading && loadError.history && renderError(loadError.history)}

          {!historyLoading && !loadError.history && ongoingSims.length === 0 && completedSims.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '48px 24px',
                background: '#FFFFFF',
                borderRadius: 20,
                border: '1px solid #E2E8F0',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 20,
                  background: '#E0F2FE',
                  color: '#0284C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <Clock size={32} strokeWidth={2.2} />
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>
                {t('casesHub.noHistory', 'Simulyatsiyalar tarixi mavjud emas')}
              </h3>
              <p style={{ fontSize: 13, color: '#64748B', margin: 0, lineHeight: 1.5, maxWidth: 360, marginInline: 'auto' }}>
                {t('casesHub.noHistoryDesc', "Birinchi klinik keysingizni tanlang va bemor bilan ishlashni boshlang!")}
              </p>
            </div>
          )}

          {!historyLoading && (ongoingSims.length > 0 || completedSims.length > 0) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* 1. Ongoing Simulations */}
              {ongoingSims.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#F59E0B',
                        boxShadow: '0 0 0 3px rgba(245, 158, 11, 0.2)',
                      }}
                    />
                    <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
                      {t('casesHub.ongoing', 'Davom etayotganlar')} ({ongoingSims.length})
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {ongoingSims.map((sim) => (
                      <div
                        key={sim.id}
                        style={{
                          background: '#FFFFFF',
                          borderRadius: 18,
                          border: '1.5px solid #FDE68A',
                          padding: '16px 18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 14,
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {sim.case_title || sim.title || 'Klinik keys'}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748B' }}>
                            <span>Holat: <strong style={{ color: '#D97706' }}>{sim.status || 'Jarayonda'}</strong></span>
                            {sim.health_percent != null && (
                              <span>• Salomatlik: <strong style={{ color: '#16A34A' }}>{sim.health_percent}%</strong></span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => onStartCase && onStartCase({ id: sim.case_id, title: sim.case_title })}
                          style={{
                            padding: '8px 14px',
                            borderRadius: 10,
                            background: '#16A34A',
                            border: 'none',
                            color: '#FFFFFF',
                            fontSize: 12,
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <Play size={14} fill="#FFFFFF" />
                          <span>{t('casesHub.resume', 'Davom ettirish')}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. Completed Simulations */}
              {completedSims.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <CheckCircle2 size={16} color="#16A34A" />
                    <h3 style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
                      {t('casesHub.completed', 'Yakunlanganlar')} ({completedSims.length})
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {completedSims.map((sim) => {
                      const score = sim.final_score ?? sim.score ?? 0;
                      const scoreColor = score >= 70 ? '#15803D' : score >= 50 ? '#B45309' : '#B91C1C';
                      const scoreBg = score >= 70 ? '#DCFCE7' : score >= 50 ? '#FEF3C7' : '#FEE2E2';

                      return (
                        <div
                          key={sim.id}
                          style={{
                            background: '#FFFFFF',
                            borderRadius: 18,
                            border: '1px solid #E2E8F0',
                            padding: '16px 18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 14,
                            boxShadow: 'var(--shadow-sm)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                width: 44,
                                height: 44,
                                borderRadius: 14,
                                background: scoreBg,
                                color: scoreColor,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: 13,
                                flexShrink: 0,
                              }}
                            >
                              <span>{score}</span>
                              <span style={{ fontSize: 9, opacity: 0.8 }}>ball</span>
                            </div>

                            <div style={{ minWidth: 0, flex: 1 }}>
                              <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0F172A', margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {sim.case_title || sim.title || 'Klinik keys'}
                              </h4>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#64748B', flexWrap: 'wrap' }}>
                                {sim.xp_earned != null && (
                                  <span style={{ color: '#2563EB', fontWeight: 700 }}>+{sim.xp_earned} XP</span>
                                )}
                                {sim.coins_earned != null && (
                                  <span style={{ color: '#D97706', fontWeight: 700 }}>+{sim.coins_earned} 🪙</span>
                                )}
                                {sim.ended_at && (
                                  <span>• {new Date(sim.ended_at).toLocaleDateString()}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => onOpenDebrief && onOpenDebrief(sim.id)}
                            style={{
                              padding: '8px 12px',
                              borderRadius: 10,
                              background: '#F1F5F9',
                              border: '1px solid #CBD5E1',
                              color: '#334155',
                              fontSize: 12,
                              fontWeight: 700,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <FileText size={14} />
                            <span>{t('casesHub.viewDebrief', 'Tahlil')}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
