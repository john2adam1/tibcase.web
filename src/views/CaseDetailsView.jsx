import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  BarChart2,
  Clock,
  Award,
  Play,
  FileText,
  Bookmark,
} from 'lucide-react';
import { useTranslation } from '../i18n.jsx';

export default function CaseDetailsView({
  caseItem,
  onStartCase,
  onToggleFavorite,
  onBack
}) {
  const { t } = useTranslation();
  const [anamnesisExpanded, setAnamnesisExpanded] = useState(true);
  const [isFavorite, setIsFavorite] = useState(Boolean(caseItem?.is_favorite));

  useEffect(() => {
    setIsFavorite(Boolean(caseItem?.is_favorite));
  }, [caseItem?.is_favorite, caseItem?.id]);

  if (!caseItem) return null;

  const handleFavoriteClick = async () => {
    const targetId = caseItem?.id || caseItem?._id;
    if (!targetId) return;
    const next = !isFavorite;
    setIsFavorite(next);
    if (onToggleFavorite) {
      try {
        const res = await onToggleFavorite(targetId);
        if (typeof res === 'boolean') {
          setIsFavorite(res);
        }
      } catch {
        setIsFavorite(!next);
      }
    }
  };

  const getDifficultyLabel = (diff) => {
    if (!diff) return null;
    const d = String(diff).toLowerCase();
    if (d.includes('easy') || d.includes('oson') || d.includes('легк')) return t('modal.easy', 'Oson');
    if (d.includes('medium') || d.includes('orta') || d.includes("o'rta") || d.includes('средн')) return t('modal.medium', "O'rta");
    if (d.includes('hard') || d.includes('qiyin') || d.includes('сложн')) return t('modal.hard', 'Qiyin');
    return diff.charAt(0).toUpperCase() + diff.slice(1);
  };

  const displayTitle = caseItem.title || '';
  const displayCategory = caseItem.category_name || '';
  const displayDifficulty = getDifficultyLabel(caseItem.difficulty);
  const displayDuration = caseItem.expected_duration_minutes
    ? `${caseItem.expected_duration_minutes} ${t('fav.min', 'daq')}`
    : null;
  const displayAnamnesis = caseItem.chief_complaint || caseItem.subtitle || '';

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
        position: 'relative',
        gap: 16,
      }}>
        {/* Header: Back Button + Title + Bookmark Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          padding: '8px 4px',
        }}>
          {onBack ? (
            <button
              onClick={onBack}
              title="Orqaga"
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#0F172A',
                flexShrink: 0,
              }}
            >
              <ChevronLeft size={24} strokeWidth={2.4} />
            </button>
          ) : <div style={{ width: 44 }} />}

          <h1 style={{
            flex: 1,
            fontSize: '19px',
            fontWeight: 700,
            color: '#0F172A',
            margin: 0,
            textAlign: 'center',
            padding: '0 8px',
          }}>
            {t('case.detailsTitle', 'Klinik Keys')}
          </h1>

          {/* Bookmark Button in Header */}
          <button
            id="btn-save-case-header"
            onClick={handleFavoriteClick}
            title={isFavorite ? t('case.removeSaved', "Saqlangan keyslardan o'chirish") : t('case.saveAction', "Keysni saqlab olish")}
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: isFavorite ? '#FEF3C7' : '#FFFFFF',
              border: isFavorite ? '1px solid #F59E0B' : '1px solid #E2E8F0',
              boxShadow: isFavorite ? '0 4px 12px rgba(245, 158, 11, 0.25)' : '0 2px 0 #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: isFavorite ? '#D97706' : '#64748B',
              flexShrink: 0,
              transition: 'all 0.18s ease',
            }}
          >
            <Bookmark size={20} fill={isFavorite ? '#D97706' : 'none'} strokeWidth={2.4} />
          </button>
        </div>

        {/* Badges: Category & Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {displayCategory && (
            <span style={{
              background: '#FFEDD5',
              border: '1px solid #FED7AA',
              color: '#EA580C',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.5px',
              padding: '4px 10px',
              borderRadius: 8,
              textTransform: 'uppercase',
            }}>
              {displayCategory}
            </span>
          )}
        </div>

        {/* Case Title and ID */}
        <div>
          <h2 style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#0F172A',
            letterSpacing: '-0.02em',
            margin: 0,
            lineHeight: 1.3,
          }}>
            {displayTitle}
          </h2>
        </div>

        {/* Stat Cards Grid: Difficulty, Duration, Topic */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: 12,
        }}>
          {displayDifficulty && (
            <div style={{
              background: '#FFFFFF',
              borderRadius: 16,
              border: '1px solid #E2E8F0',
              boxShadow: 'var(--shadow-sm)',
              padding: '16px 8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 6,
            }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#FFEDD5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EA580C',
              }}>
                <BarChart2 size={18} strokeWidth={2.4} />
              </div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.5px' }}>
                {t('case.difficulty', 'QIYINCHILIK')}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                {displayDifficulty}
              </div>
            </div>
          )}

          {displayDuration && (
            <div style={{
              background: '#FFFFFF',
              borderRadius: 16,
              border: '1px solid #E2E8F0',
              boxShadow: 'var(--shadow-sm)',
              padding: '16px 8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 6,
            }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#DBEAFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563EB',
              }}>
                <Clock size={18} strokeWidth={2.4} />
              </div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.5px' }}>
                {t('case.duration', 'DAVOMIYLIK')}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                {displayDuration}
              </div>
            </div>
          )}

          {caseItem.topic_name && (
            <div style={{
              background: '#FFFFFF',
              borderRadius: 16,
              border: '1px solid #E2E8F0',
              boxShadow: 'var(--shadow-sm)',
              padding: '16px 8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 6,
            }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#DCFCE7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#16A34A',
              }}>
                <Award size={18} strokeWidth={2.4} />
              </div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.5px' }}>
                {t('case.topic', 'MAVZU')}
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#16A34A' }}>
                {caseItem.topic_name}
              </div>
            </div>
          )}
        </div>

        {/* Anamnesis / Chief Complaint Card */}
        {displayAnamnesis && (
          <div style={{
            background: '#FFFFFF',
            borderRadius: 18,
            border: '1px solid #E2E8F0',
            boxShadow: 'var(--shadow-sm)',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            <div
              onClick={() => setAnamnesisExpanded(!anamnesisExpanded)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={18} color="#64748B" />
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                  {t('case.anamnesis', 'Bemor Shikoyati (Anamnez)')}
                </span>
              </div>
              {anamnesisExpanded ? <ChevronUp size={20} color="#64748B" /> : <ChevronDown size={20} color="#64748B" />}
            </div>

            {anamnesisExpanded && (
              <div style={{
                borderLeft: '3.5px solid #22C55E',
                paddingLeft: 12,
                fontSize: '13px',
                fontWeight: 500,
                lineHeight: 1.6,
                color: '#334155',
              }}>
                {displayAnamnesis}
              </div>
            )}
          </div>
        )}

        {/* Start Case Button */}
        <button
          id="btn-start-case"
          onClick={onStartCase}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 16,
            background: '#16A34A',
            border: '1px solid #15803D',
            boxShadow: 'var(--shadow-sm)',
            color: '#FFFFFF',
            fontSize: '17px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            cursor: 'pointer',
            marginTop: 8,
            transition: 'all 0.15s ease',
          }}
        >
          <div style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Play size={12} fill="#16A34A" color="#16A34A" style={{ marginLeft: 2 }} />
          </div>
          <span>{t('case.startSimulation', 'Simulyatsiyani Boshlash')}</span>
        </button>

        {/* Bookmark / Save Action Button */}
        <button
          id="btn-save-case-action"
          onClick={handleFavoriteClick}
          style={{
            width: '100%',
            padding: '13px 18px',
            borderRadius: 18,
            background: isFavorite ? '#FEF3C7' : '#FFFFFF',
            border: isFavorite ? '1px solid #F59E0B' : '1px solid #E2E8F0',
            boxShadow: 'var(--shadow-sm)',
            color: isFavorite ? '#B45309' : '#334155',
            fontSize: '15px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <Bookmark size={18} fill={isFavorite ? '#D97706' : 'none'} strokeWidth={2.4} />
          <span>{isFavorite ? t('case.savedAction', "Saqlangan keyslarda saqlangan ✓") : t('case.saveAction', "Keysni saqlab olish")}</span>
        </button>
      </div>
    </div>
  );
}
