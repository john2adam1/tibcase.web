import React, { useEffect, useMemo, useState } from 'react';
import { RotateCw } from 'lucide-react';
import { localizeText } from '../../api';
import { useTranslation } from '../../i18n.jsx';

const RATINGS = [
  { id: 'hard', labelKey: 'flash.hard', fallback: 'Qiyin', tone: 'hard' },
  { id: 'good', labelKey: 'flash.good', fallback: 'Yaxshi', tone: 'good' },
  { id: 'easy', labelKey: 'flash.easy', fallback: 'Oson', tone: 'easy' },
];

const TERM_RE = /(\*\*[^*]+\*\*|\b(?:NSTEMI|STEMI|HFrEF|HFpEF|NT-proBNP|SpO2|LVEF|CABG|COPD|DOAC|NOAC|aPTT|WBC|RBC|PLT|ACS|PCI|AKI|CKD|TIA|DVT|INR|GFR|BNP|ECG|EKG|QRS|SVT)\b)/gi;

function pad(n) {
  return String(Math.max(0, Number(n) || 0)).padStart(2, '0');
}

function intervalLabel(days) {
  if (days == null || days === '') return '';
  const n = Number(days);
  if (!Number.isFinite(n)) return '';
  if (n === 0) return '10m';
  return `${n}d`;
}

function subjectOf(card, fallback) {
  return String(
    fallback
    || localizeText(card?.category_name)
    || localizeText(card?.topic_name)
    || localizeText(card?.deck_name)
    || card?.subject
    || ''
  ).trim();
}

function renderClinicalText(text) {
  const raw = String(text || '');
  if (!raw) return null;
  const re = new RegExp(TERM_RE.source, 'gi');
  const nodes = [];
  let last = 0;
  let match;
  let i = 0;
  while ((match = re.exec(raw))) {
    if (match.index > last) nodes.push(raw.slice(last, match.index));
    const token = match[0];
    const label = token.startsWith('**') ? token.slice(2, -2) : token;
    nodes.push(<strong key={`t${i++}`} className="cf-term">{label}</strong>);
    last = match.index + token.length;
  }
  if (last < raw.length) nodes.push(raw.slice(last));
  return nodes;
}

export default function ClinicalFlashcard({
  card,
  index = 0,
  total = 1,
  streak,
  subject,
  compact = false,
  busy = false,
  locked = false,
  showMeta = true,
  advanceOnRate = true,
  onRate,
  onFlipChange,
}) {
  const { t } = useTranslation();
  const [flipped, setFlipped] = useState(false);
  const [exiting, setExiting] = useState(false);
  const cardId = card?.id || `${card?.front || ''}:${index}`;

  useEffect(() => {
    setFlipped(false);
    setExiting(false);
    onFlipChange?.(false);
  }, [cardId]);

  const topic = useMemo(() => subjectOf(card, subject), [card, subject]);
  const sources = Array.isArray(card?.sources) ? card.sources : [];

  const toggle = () => {
    if (locked || busy || exiting) return;
    setFlipped((v) => {
      const next = !v;
      onFlipChange?.(next);
      return next;
    });
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  };

  const handleRate = async (rating) => {
    if (!onRate || busy || exiting || locked) return;
    if (advanceOnRate) setExiting(true);
    try {
      if (advanceOnRate) await new Promise((resolve) => window.setTimeout(resolve, 260));
      await onRate(rating);
      if (!advanceOnRate) setFlipped(true);
    } catch {
      setExiting(false);
    }
  };

  const shownFlipped = locked || flipped;

  if (!card) return null;

  return (
    <div className={`cf-root${compact ? ' is-compact' : ''}${exiting ? ' is-exit' : compact ? '' : ' is-enter'}`}>
      {showMeta && (
        <div className="cf-meta">
          <span className="cf-meta-index">{pad(index + 1)}/{pad(total)}</span>
          <span className="cf-meta-subject">{topic}</span>
          {typeof streak === 'number' && (
            <span className="cf-meta-streak" title={t('flash.streak', 'Kunlik seriya')}>
              🔥 {streak}
            </span>
          )}
        </div>
      )}

      <div className="cf-scene">
        <div
          role="button"
          tabIndex={0}
          className={`cf-flipper${shownFlipped ? ' is-flipped' : ''}`}
          onClick={toggle}
          onKeyDown={handleKey}
          aria-pressed={shownFlipped}
          aria-label={flipped ? t('flash.back', 'Javob') : t('flash.front', 'Savol')}
        >
          <article className="cf-face cf-front">
            <span className="cf-kicker">{t('flash.front', 'Savol')}</span>
            <p className="cf-text">{renderClinicalText(card.front)}</p>
            <span className="cf-hint">{t('flash.flip', "Javobni ko'rish uchun bosing")}</span>
            <span
              className="cf-flip-btn"
              onClick={(e) => { e.stopPropagation(); toggle(); }}
              aria-hidden="true"
            >
              <RotateCw size={16} />
              {t('flash.flipAction', 'Burish')}
            </span>
          </article>
          <article className="cf-face cf-back">
            <span className="cf-kicker">{t('flash.back', 'Javob')}</span>
            <p className="cf-text">{renderClinicalText(card.back)}</p>
            {sources.length > 0 && (
              <ul className="cf-sources">
                {sources.map((src, i) => (
                  <li key={src.source_id || i}>{localizeText(src.title) || src.title}</li>
                ))}
              </ul>
            )}
            {compact && shownFlipped && onRate && !locked && (
              <div className="cf-ratings is-inset" onClick={(e) => e.stopPropagation()}>
                {RATINGS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className={`cf-rate cf-rate-${r.tone}`}
                    disabled={busy || exiting}
                    onClick={() => handleRate(r.id)}
                  >
                    {t(r.labelKey, r.fallback)}
                    <span>{intervalLabel(card?.next_intervals?.[r.id])}</span>
                  </button>
                ))}
              </div>
            )}
          </article>
        </div>
      </div>

      {!compact && shownFlipped && onRate && !locked && (
        <div className="cf-ratings">
          {RATINGS.map((r) => (
            <button
              key={r.id}
              type="button"
              className={`cf-rate cf-rate-${r.tone}`}
              disabled={busy || exiting}
              onClick={() => handleRate(r.id)}
            >
              {t(r.labelKey, r.fallback)}
              <span>{intervalLabel(card?.next_intervals?.[r.id])}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
