import React from 'react';
import { Check, X } from 'lucide-react';
import { useTranslation } from '../../i18n.jsx';

const MONO = "var(--font-mono, 'JetBrains Mono', monospace)";

function Row({ label, children }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '112px 1fr', gap: 12,
      padding: '9px 0', borderTop: '1px solid var(--line)', alignItems: 'start',
    }}>
      <div style={{
        fontFamily: MONO, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em',
        textTransform: 'uppercase', color: 'var(--ink-3)', paddingTop: 2,
      }}>
        {label}
      </div>
      <div style={{ minWidth: 0, fontSize: 13.5, lineHeight: 1.5, color: 'var(--ink)', wordBreak: 'break-word' }}>
        {children}
      </div>
    </div>
  );
}

function StepList({ items, kind }) {
  const ok = kind === 'ok';
  const Icon = ok ? Check : X;
  const color = ok ? 'var(--on-green)' : 'var(--on-red)';
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((text, i) => (
        <li key={`${kind}-${i}`} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <Icon size={14} strokeWidth={3} color={color} style={{ flexShrink: 0, marginTop: 4 }} />
          <span>{text}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Case yakunidagi strukturalangan klinik hisobot.
 * Rang faqat holat uchun: yashil — to'g'ri, qizil — xato, amber — zaif.
 * `report`: { score, correct[], incorrect[], weak[], notes, patient, complaint, answer }
 */
export default function ClinicalReport({ report }) {
  const { t } = useTranslation();
  if (!report) return null;
  const {
    score, correct = [], incorrect = [], weak = [], notes = '', patient = '', complaint = '', answer = '',
  } = report;
  const hasScore = typeof score === 'number';
  const good = hasScore && score >= 75;
  const scoreColor = good ? 'var(--on-green)' : 'var(--on-red)';
  const scoreLabel = score >= 90
    ? t('debrief.excellent', "A'lo natija")
    : score >= 75
      ? t('debrief.satisfactory', 'Qoniqarli')
      : t('debrief.hasErrors', 'Xatolar mavjud');

  return (
    <div style={{ width: '100%', minWidth: 0 }}>
      <div style={{
        fontFamily: MONO, fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 6,
      }}>
        {t('report.title', 'Klinik hisobot')}
      </div>

      {patient && <Row label={t('report.patient', 'Bemor')}>{patient}</Row>}
      {complaint && <Row label={t('report.complaint', 'Shikoyat')}>{complaint}</Row>}
      {answer && <Row label={t('report.answer', 'Javobingiz')}>{answer}</Row>}

      {hasScore && (
        <Row label={t('report.score', 'Ball')}>
          <span style={{ fontFamily: MONO, fontSize: 20, fontWeight: 600, color: scoreColor }}>{score}%</span>
          <span style={{ marginLeft: 10, fontSize: 12.5, fontWeight: 700, color: scoreColor }}>{scoreLabel}</span>
        </Row>
      )}

      {correct.length > 0 && (
        <Row label={t('debrief.correctActions', "To'g'ri qadamlar")}>
          <StepList items={correct} kind="ok" />
        </Row>
      )}
      {incorrect.length > 0 && (
        <Row label={t('debrief.errors', 'Klinik xatolar')}>
          <StepList items={incorrect} kind="err" />
        </Row>
      )}
      {weak.length > 0 && (
        <Row label={t('report.weak', 'Zaif mavzular')}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {weak.map((topic, i) => (
              <span key={`weak-${i}`} style={{
                background: 'var(--tint-amber-soft)', border: '1px solid var(--tint-amber-border)',
                color: 'var(--on-amber)', borderRadius: 8, padding: '2px 8px', fontSize: 12.5, fontWeight: 600,
              }}>
                {topic}
              </span>
            ))}
          </div>
        </Row>
      )}
      {notes && (
        <Row label={t('report.protocol', 'Protokol')}>
          <span style={{ whiteSpace: 'pre-line', color: 'var(--ink-2)' }}>{notes}</span>
        </Row>
      )}
    </div>
  );
}
