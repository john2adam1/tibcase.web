import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { api } from '../api';
import { useTranslation } from '../i18n.jsx';

const getCategoryMeta = (cat) => {
  const name = (cat?.name || '').toLowerCase();
  if (name.includes('kardio') || name.includes('cardio') || name.includes('yurak')) {
    return { emoji: '❤️', iconBg: '#FEE2E2', iconBorder: '#FCA5A5', starColor: '#EF4444' };
  }
  if (name.includes('shoshilinch') || name.includes('emerg') || name.includes('tez yordam')) {
    return { emoji: '🚑', iconBg: '#FFEDD5', iconBorder: '#FDBA74', starColor: '#F97316' };
  }
  if (name.includes('ichki') || name.includes('internal') || name.includes('terapiya')) {
    return { emoji: '🩺', iconBg: '#E0F2FE', iconBorder: '#7DD3FC', starColor: '#10B981' };
  }
  if (name.includes('neyro') || name.includes('neuro') || name.includes('asab')) {
    return { emoji: '🧠', iconBg: '#FCE7F3', iconBorder: '#F472B6', starColor: '#3B82F6' };
  }
  if (name.includes('jarroh') || name.includes('surg') || name.includes('operatsiya')) {
    return { emoji: '🔬', iconBg: '#CCFBF1', iconBorder: '#5EEAD4', starColor: '#10B981' };
  }
  if (name.includes('pediatr') || name.includes('bola')) {
    return { emoji: '👨‍👩‍👧', iconBg: '#FEF9C3', iconBorder: '#FDE047', starColor: '#EAB308' };
  }
  if (name.includes('ortoped') || name.includes('travma')) {
    return { emoji: '🦴', iconBg: '#FFEDD5', iconBorder: '#FDBA74', starColor: '#F59E0B' };
  }
  if (name.includes('derma') || name.includes('teri')) {
    return { emoji: '🩹', iconBg: '#EDE9FE', iconBorder: '#C4B5FD', starColor: '#8B5CF6' };
  }
  return { emoji: '🩺', iconBg: '#E0F2FE', iconBorder: '#BAE6FD', starColor: '#0EA5E9' };
};

const formatTitle = (name) => {
  if (!name) return 'Kategoriya';
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export default function CategoriesView({
  categories: initialCategories = [],
  onSelectCategory,
  onBack
}) {
  const { t } = useTranslation();
  const [categories, setCategories] = useState(initialCategories);
  const [loading, setLoading] = useState(!initialCategories || initialCategories.length === 0);

  // Fetch only real API categories on mount
  useEffect(() => {
    let isMounted = true;

    async function loadApiCategories() {
      try {
        setLoading(true);
        const data = await api.getCategories();
        if (isMounted) {
          setCategories(data || []);
        }
      } catch (err) {
        console.error('Categories load error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadApiCategories();

    return () => { isMounted = false; };
  }, []);

  return (
    <div className="ui-page">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {onBack && (
          <button className="ui-icon-btn" onClick={onBack} title={t('cat.back')} aria-label={t('cat.back', 'Orqaga')}>
            <ChevronLeft size={22} />
          </button>
        )}
        <div>
          <h1 className="ui-title">{t('cat.title', "Klinik Bo'limlar")}</h1>
          <p className="ui-subtitle">{t('cat.subtitle', "O'zingiz qiziqqan yo'nalishni tanlang")}</p>
        </div>
      </div>

      {loading && (
        <div className="ui-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="ui-card" style={{ padding: 16, height: 110, background: 'var(--bg-muted)', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      )}

      {!loading && categories.length === 0 && (
        <p className="ui-subtitle" style={{ textAlign: 'center', padding: 32 }}>{t('cat.empty', "Bo'limlar topilmadi")}</p>
      )}

      {!loading && categories.length > 0 && (
        <div className="ui-grid">
          {categories.map((cat) => {
            const meta = getCategoryMeta(cat);
            const title = formatTitle(cat.name);
            const casesCount = cat.cases_count ?? 1;
            return (
              <div
                key={cat.id}
                id={`cat-card-${cat.id}`}
                className="ui-card ui-card-press"
                onClick={() => onSelectCategory({ ...cat, title, emoji: meta.emoji, casesCount })}
                style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, overflow: 'hidden' }}>
                  {cat.icon_url ? (
                    <img src={cat.icon_url} alt={title} style={{ width: '70%', height: '70%', objectFit: 'contain' }} onError={(e) => { e.target.style.display = 'none'; }} />
                  ) : (
                    <span>{meta.emoji}</span>
                  )}
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.25 }}>{title}</h3>
                  <span className="ui-subtitle" style={{ fontSize: 12 }}>{casesCount} {t('cat.cases')}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
