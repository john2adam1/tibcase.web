import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  Star,
  Layers,
  Sparkles,
  Inbox
} from 'lucide-react';
import { api } from '../api';

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
    <div style={{
      width: '100%',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px 16px 100px 16px',
      background: '#F8FAFC',
      boxSizing: 'border-box',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{
        width: '100%',
        maxWidth: 480,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        {/* Top Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          padding: '8px 4px 12px 4px',
        }}>
          {onBack && (
            <button
              onClick={onBack}
              title="Orqaga"
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 2px 0 #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#0F172A',
              }}
            >
              <ChevronLeft size={24} strokeWidth={2.4} />
            </button>
          )}

          <h1 style={{
            flex: 1,
            fontSize: '24px',
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.02em',
            margin: 0,
            textAlign: 'center',
            paddingRight: onBack ? 40 : 0,
          }}>
            All Categories
          </h1>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 14,
            width: '100%',
          }}>
            {[1, 2].map((i) => (
              <div
                key={i}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 24,
                  border: '2px solid #E2E8F0',
                  padding: '24px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  animation: 'pulse 1.5s infinite',
                }}
              >
                <div style={{ width: 56, height: 56, borderRadius: 16, background: '#E2E8F0' }} />
                <div style={{ width: '70%', height: 16, borderRadius: 6, background: '#E2E8F0' }} />
                <div style={{ width: '50%', height: 12, borderRadius: 6, background: '#E2E8F0' }} />
              </div>
            ))}
          </div>
        )}

        {/* Empty state: If no categories returned from API */}
        {!loading && categories.length === 0 && (
          <div style={{
            background: '#FFFFFF',
            borderRadius: 24,
            border: '2px solid #E2E8F0',
            boxShadow: '0 4px 0 #E2E8F0',
            padding: '40px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}>
            <Inbox size={48} color="#94A3B8" />
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
              Hozircha bo'limlar mavjud emas
            </div>
            <div style={{ fontSize: '13px', color: '#64748B' }}>
              API orqali yangi klinik bo'limlar qo'shilgach, bu yerda avtomatik paydo bo'ladi.
            </div>
          </div>
        )}

        {/* ONLY Real Categories from API */}
        {!loading && categories.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 14,
            width: '100%',
          }}>
            {categories.map((cat) => {
              const meta = getCategoryMeta(cat);
              const title = formatTitle(cat.name);
              const casesCount = cat.cases_count ?? 1;

              return (
                <div
                  key={cat.id}
                  id={`cat-card-${cat.id}`}
                  onClick={() => onSelectCategory({
                    ...cat,
                    title,
                    emoji: meta.emoji,
                    casesCount
                  })}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 24,
                    border: '2px solid #E2E8F0',
                    boxShadow: '0 4px 0 #E2E8F0, 0 8px 16px rgba(0, 0, 0, 0.02)',
                    padding: '18px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 0 #E2E8F0, 0 12px 24px rgba(0, 0, 0, 0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 0 #E2E8F0, 0 8px 16px rgba(0, 0, 0, 0.02)';
                  }}
                >
                  {/* Icon Container with tinted border */}
                  <div style={{
                    width: 58,
                    height: 58,
                    borderRadius: 18,
                    background: meta.iconBg,
                    border: `2px solid ${meta.iconBorder}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                    overflow: 'hidden',
                  }}>
                    {cat.icon_url ? (
                      <img
                        src={cat.icon_url}
                        alt={title}
                        style={{ width: '70%', height: '70%', objectFit: 'contain' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <span>{meta.emoji}</span>
                    )}
                  </div>

                  {/* Details */}
                  <div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: 800,
                      color: '#0F172A',
                      margin: '0 0 6px 0',
                      lineHeight: 1.25,
                    }}>
                      {title}
                    </h3>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#64748B',
                    }}>
                      <Star size={13} fill={meta.starColor} color={meta.starColor} />
                      <span>{casesCount} Cases Waiting</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
