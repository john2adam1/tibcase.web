import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { api, resolveMediaUrl } from '../api';
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
  useEffect(() => { setFailed(false); }, [url]);
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
  onSelectCategory,
  onBack,
}) {
  const { t, lang } = useTranslation();
  const [categories, setCategories] = useState(initialCategories);
  const [categoriesLoading, setCategoriesLoading] = useState(!initialCategories || initialCategories.length === 0);
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function loadApiCategories() {
      try {
        if (!initialCategories?.length) setCategoriesLoading(true);
        setLoadError('');
        const data = await api.getCategories();
        if (isMounted) setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Categories load error:', err);
        if (isMounted) setLoadError(err?.message || 'Xatolik yuz berdi');
      } finally {
        if (isMounted) setCategoriesLoading(false);
      }
    }
    loadApiCategories();
    return () => { isMounted = false; };
  }, [reloadKey, lang]);

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

  return (
    <div className="ui-page" style={{ paddingBottom: 40 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
              {t('home.statDepartments', "Bo'limlar")}
            </h1>
            <p className="ui-subtitle" style={{ fontSize: 13, margin: '2px 0 0' }}>
              {t('casesHub.categoriesSubtitle', "O'zingiz qiziqqan yo'nalishni tanlang va amaliyotni boshlang")}
            </p>
          </div>
        </div>
      </div>

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

      {!categoriesLoading && loadError && renderError(loadError)}

      {!categoriesLoading && !loadError && categories.length === 0 && (
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
  );
}
