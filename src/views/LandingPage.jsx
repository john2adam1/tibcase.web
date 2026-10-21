import React, { useState, useEffect } from 'react';
import { ArrowRight, Mic, Sparkles } from 'lucide-react';
import { useTranslation } from '../i18n.jsx';

const LANGUAGES = [
  { code: 'uz', short: 'UZ' },
  { code: 'ru', short: 'RU' },
  { code: 'en', short: 'EN' },
];

const SAMPLE = {
  uz: {
    topic: 'Kardiologiya · Namuna keys',
    status: 'Beqaror',
    vitals: [
      { k: 'HR', v: '88' },
      { k: 'BP', v: '148/92' },
      { k: 'SpO₂', v: '96%' },
    ],
    patient: 'Bemor',
    you: 'Siz',
    ai: 'AI',
    complaint: 'Ko‘kragim chap tomonida siqilyapti — 40 daqiqa oldin boshlandi. Chap qo‘limga tarqaladi, terlayapman, ko‘nglim ayniyapti.',
    prompt: 'Tashxis va rejangizni yozing...',
    hint: 'Har bir javobingizni AI tahlil qiladi.',
    aiBadge: 'AI tahlil',
    explain: 'Inferior STEMI. ST ko‘tarilishi va nurlanuvchi og‘riq reperfuziyani talab qiladi: aspirin va darhol PCI. To‘liq simulyatsiyada bemor bilan muloqot qilasiz va AI har bir qadamingizni baholaydi.',
    tryAgain: 'Yana yozish',
    more: 'To‘liq simulyatsiyani boshlang.',
  },
  ru: {
    topic: 'Кардиология · Образец кейса',
    status: 'Нестабилен',
    vitals: [
      { k: 'HR', v: '88' },
      { k: 'АД', v: '148/92' },
      { k: 'SpO₂', v: '96%' },
    ],
    patient: 'Пациент',
    you: 'Вы',
    ai: 'ИИ',
    complaint: 'Давит в левой стороне груди — началось 40 минут назад. Отдаёт в левую руку, потею, тошнит.',
    prompt: 'Диагноз и план лечения...',
    hint: 'Каждый ваш ответ анализирует ИИ.',
    aiBadge: 'Разбор ИИ',
    explain: 'Нижний STEMI. Подъём ST и иррадиирующая боль требуют реперфузии: аспирин и срочное ЧКВ. В полной симуляции вы общаетесь с пациентом, а ИИ оценивает каждый шаг.',
    tryAgain: 'Написать снова',
    more: 'Начните полную симуляцию.',
  },
  en: {
    topic: 'Cardiology · Sample case',
    status: 'Unstable',
    vitals: [
      { k: 'HR', v: '88' },
      { k: 'BP', v: '148/92' },
      { k: 'SpO₂', v: '96%' },
    ],
    patient: 'Patient',
    you: 'You',
    ai: 'AI',
    complaint: 'Tightness on the left side of my chest — started 40 minutes ago. It radiates to my left arm, I am sweating and nauseous.',
    prompt: 'Write diagnosis and plan...',
    hint: 'AI analyzes every answer you write.',
    aiBadge: 'AI analysis',
    explain: 'Inferior STEMI. ST elevation with radiating pain needs reperfusion: aspirin and immediate PCI. In the full simulation you talk with the patient and AI scores each step.',
    tryAgain: 'Write again',
    more: 'Start the full simulation.',
  },
};

export default function LandingPage({
  onOpenLogin,
  isAuthenticated = false,
  onLangChange,
  lang: propLang,
}) {
  const { lang: ctxLang, setLang, t } = useTranslation();
  const currentLang = ctxLang || propLang || 'uz';

  const [sampleLang, setSampleLang] = useState(currentLang);
  const [draft, setDraft] = useState('');
  const [sent, setSent] = useState('');

  useEffect(() => {
    setSampleLang(currentLang);
    setDraft('');
    setSent('');
  }, [currentLang]);

  const handleSelectLang = (newCode) => {
    if (onLangChange) onLangChange(newCode);
    else setLang(newCode);
  };

  const sample = SAMPLE[sampleLang] || SAMPLE.uz;

  const scrollToSample = () => {
    document.getElementById('ll-sample')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleSend = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sent) return;
    setSent(text);
    setDraft('');
  };

  const handleReset = () => {
    setSent('');
    setDraft('');
  };

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-header-inner">
          <img src="/logo-full.svg" alt="TibStation" className="landing-logo" />

          <div className="landing-header-actions">
            <div className="landing-lang-pills" role="group" aria-label="Language">
              {LANGUAGES.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  className={`landing-lang-pill${currentLang === item.code ? ' is-active' : ''}`}
                  onClick={() => handleSelectLang(item.code)}
                >
                  {item.short}
                </button>
              ))}
            </div>

            <button type="button" className="landing-primary-btn landing-header-cta" onClick={onOpenLogin}>
              {isAuthenticated
                ? t('landing.hero.ctaCabinet', 'Kabinetga kirish')
                : t('landing.nav.start', 'Bepul boshlash')}
            </button>
          </div>
        </div>
      </header>

      <main className="landing-hero-section">
        <div className="landing-rings" aria-hidden />

        <div className="landing-hero-copy">
          <p className="landing-kicker">
            {t('landing.hero.kicker', 'Klinik simulyator · Shifokorlar · Talabalar')}
          </p>
          <h1>
            {t('landing.hero.titleLine1', 'Klinik keys tahlili —')}
            {' '}
            <span>{t('landing.hero.titleAccent', 'AI bilan.')}</span>
          </h1>
          <p className="landing-hero-desc">
            {t('landing.hero.desc', 'Virtual bemor. Darhol AI bahosi.')}
          </p>

          <div className="landing-cta-row">
            <button type="button" className="landing-primary-btn" onClick={onOpenLogin}>
              {isAuthenticated
                ? t('landing.hero.ctaCabinet', 'Kabinetga kirish')
                : t('landing.hero.cta', 'Bepul boshlang')}
            </button>
            <button type="button" className="landing-ghost-btn" onClick={scrollToSample}>
              <span className="landing-ghost-dot" />
              {t('landing.hero.ctaSample', 'Namuna keysni ko‘rish')}
            </button>
          </div>
          {!isAuthenticated && (
            <p className="landing-hint">{t('landing.hero.hint', "Ro'yxatdan o'tish bepul.")}</p>
          )}
        </div>

        <div className="landing-sample-card" id="ll-sample">
          <div className="landing-sample-top">
            <span className="landing-sample-topic">
              <span className="landing-sample-dot" />
              {sample.topic}
            </span>
            <div className="landing-lang-pills landing-lang-pills--sm" role="group" aria-label="Sample language">
              {LANGUAGES.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  className={`landing-lang-pill${sampleLang === item.code ? ' is-active' : ''}`}
                  onClick={() => {
                    setSampleLang(item.code);
                    setDraft('');
                    setSent('');
                  }}
                >
                  {item.short}
                </button>
              ))}
            </div>
          </div>

          <div className="landing-sample-vitals" aria-hidden>
            {sample.vitals.map((item) => (
              <span key={item.k}>
                <b>{item.k}</b> {item.v}
              </span>
            ))}
            <span className="landing-sample-status">{sample.status}</span>
          </div>

          <div className="landing-sample-chat">
            <div className="landing-bubble landing-bubble--patient">
              <span className="landing-bubble-role">{sample.patient}</span>
              <div className="landing-bubble-body">{sample.complaint}</div>
            </div>

            {sent && (
              <>
                <div className="landing-bubble landing-bubble--you">
                  <span className="landing-bubble-role">{sample.you}</span>
                  <div className="landing-bubble-body">{sent}</div>
                </div>
                <div className="landing-bubble landing-bubble--ai">
                  <span className="landing-bubble-role">
                    {sample.ai}
                    <span className="landing-ai-chip">
                      <Sparkles size={11} strokeWidth={2.4} />
                      {sample.aiBadge}
                    </span>
                  </span>
                  <div className="landing-bubble-body">{sample.explain}</div>
                </div>
              </>
            )}
          </div>

          {!sent ? (
            <>
              <div className="landing-ai-hint">
                <Sparkles size={14} strokeWidth={2.4} />
                <span>{sample.hint}</span>
              </div>
              <form className="landing-sample-composer" onSubmit={handleSend}>
                <span className="landing-sample-mic" aria-hidden>
                  <Mic size={18} />
                </span>
                <textarea
                  rows={1}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={sample.prompt}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                />
                <button
                  type="button"
                  aria-label={t('common.send', 'Yuborish')}
                  disabled={!draft.trim()}
                  onClick={handleSend}
                >
                  <ArrowRight size={18} strokeWidth={2.6} />
                </button>
              </form>
            </>
          ) : (
            <div className="landing-explain-cta">
              <button type="button" className="landing-try-again" onClick={handleReset}>
                {sample.tryAgain}
              </button>
              <button type="button" className="landing-primary-btn" onClick={onOpenLogin}>
                {t('landing.hero.cta', 'Bepul boshlang')}
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="landing-footer">{t('gen.copyright')}</footer>
    </div>
  );
}
