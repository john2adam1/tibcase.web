import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, Brain, ListChecks, Layers, Map, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '../i18n.jsx';

const LANGUAGES = [
  { code: 'uz', short: 'UZ' },
  { code: 'ru', short: 'RU' },
  { code: 'en', short: 'EN' },
];

const FC_RATINGS = [
  { id: 'again', color: '#DC2626', bg: '#FEE2E2' },
  { id: 'hard', color: '#D97706', bg: '#FEF3C7' },
  { id: 'good', color: '#16A34A', bg: '#DCFCE7' },
  { id: 'easy', color: '#2563EB', bg: '#DBEAFE' },
];

const SLIDE_IDS = ['case', 'test', 'card'];

const SAMPLE = {
  uz: {
    case: {
      topic: 'Kardiologiya',
      patient: 'Holat',
      you: 'Siz',
      ai: 'AI',
      complaint: 'Ko‘kragim chap tomonida siqilyapti — 40 daqiqa oldin boshlandi. Chap qo‘limga tarqaladi, terlayapman, ko‘nglim ayniyapti.',
      prompt: 'Tashxis va rejangizni yozing...',
      hint: 'AI javobni baholaydi. Xato fleshkartaga tushadi.',
      aiBadge: 'Ball 30 · qisman',
      explain: 'Inferior STEMI. ST ko‘tarilishi va nurlanuvchi og‘riq reperfuziyani talab qiladi: aspirin va darhol PCI. Bu xato «Xatolarim» to‘plamiga tushadi.',
      tryAgain: 'Yana yozish',
    },
    test: {
      topic: 'Kardiologiya',
      hint: 'Variantni tanlang. Noto‘g‘ri javob ham fleshkartaga aylanadi.',
      question: 'Chap qo‘lga nurlanuvchi ko‘krak og‘rig‘i, terlash va ST ko‘tarilishi. Birinchi qadam?',
      options: [
        { key: 'A', text: 'Nitroglitserin va kuzatuv' },
        { key: 'B', text: 'Aspirin va darhol PCI' },
        { key: 'C', text: 'Antibiotik va dam olish' },
        { key: 'D', text: 'Faqat EKG ni takrorlash' },
      ],
      correct: 'B',
      badgeRight: 'Ball 100 · to‘g‘ri',
      badgeWrong: 'Ball 0 · xato',
      explainRight: 'To‘g‘ri. STEMI da reperfuziya kechiktirilmasin: aspirin va darhol PCI.',
      explainWrong: 'To‘g‘ri javob — B. STEMI da nitroglitserin yetarli emas: aspirin va darhol PCI. Xato «Xatolarim» to‘plamiga tushadi.',
      tryAgain: 'Yana yechish',
    },
    card: {
      topic: 'Xatolarim',
      frontLabel: 'Savol',
      backLabel: 'Javob',
      front: 'STEMI da birinchi reperfuziya qadami nima?',
      back: 'Aspirin + darhol PCI (primary). Nitroglitserin yoki kuzatuv yetarli emas.',
      flip: 'Javobni ko‘rish uchun kartani bosing',
      ways: 'Xatodan avtomatik · Qo‘lda · AI bilan mavzu',
      rated: 'Saqlanadi. Keyingi takrorlash shu bahoga qarab rejalashtiriladi — takrorlash bepul.',
      tryAgain: 'Yana ochish',
    },
  },
  ru: {
    case: {
      topic: 'Кардиология',
      patient: 'Случай',
      you: 'Вы',
      ai: 'ИИ',
      complaint: 'Давит в левой стороне груди — началось 40 минут назад. Отдаёт в левую руку, потею, тошнит.',
      prompt: 'Диагноз и план лечения...',
      hint: 'ИИ оценит ответ. Ошибка станет карточкой.',
      aiBadge: 'Балл 30 · частично',
      explain: 'Нижний STEMI. Подъём ST и иррадиирующая боль требуют реперфузии: аспирин и срочное ЧКВ. Ошибка попадёт в колоду «Мои ошибки».',
      tryAgain: 'Написать снова',
    },
    test: {
      topic: 'Кардиология',
      hint: 'Выберите вариант. Неверный ответ тоже станет карточкой.',
      question: 'Боль в груди с иррадиацией в левую руку, пот и подъём ST. Первый шаг?',
      options: [
        { key: 'A', text: 'Нитроглицерин и наблюдение' },
        { key: 'B', text: 'Аспирин и срочное ЧКВ' },
        { key: 'C', text: 'Антибиотик и покой' },
        { key: 'D', text: 'Только повторить ЭКГ' },
      ],
      correct: 'B',
      badgeRight: 'Балл 100 · верно',
      badgeWrong: 'Балл 0 · ошибка',
      explainRight: 'Верно. При STEMI реперфузию не откладывают: аспирин и срочное ЧКВ.',
      explainWrong: 'Верный ответ — B. Нитроглицерина недостаточно: аспирин и срочное ЧКВ. Ошибка попадёт в «Мои ошибки».',
      tryAgain: 'Решить снова',
    },
    card: {
      topic: 'Мои ошибки',
      frontLabel: 'Вопрос',
      backLabel: 'Ответ',
      front: 'Первый шаг реперфузии при STEMI?',
      back: 'Аспирин + срочное ЧКВ (primary). Нитроглицерина или наблюдения недостаточно.',
      flip: 'Нажмите карточку, чтобы увидеть ответ',
      ways: 'Из ошибки · Вручную · Тема через ИИ',
      rated: 'Сохранено. Следующий повтор зависит от оценки — повтор бесплатный.',
      tryAgain: 'Открыть снова',
    },
  },
  en: {
    case: {
      topic: 'Cardiology',
      patient: 'Case',
      you: 'You',
      ai: 'AI',
      complaint: 'Tightness on the left side of my chest — started 40 minutes ago. It radiates to my left arm, I am sweating and nauseous.',
      prompt: 'Write diagnosis and plan...',
      hint: 'AI scores your answer. Mistakes become flashcards.',
      aiBadge: 'Score 30 · partial',
      explain: 'Inferior STEMI. ST elevation with radiating pain needs reperfusion: aspirin and immediate PCI. This miss is saved to the “My mistakes” deck.',
      tryAgain: 'Write again',
    },
    test: {
      topic: 'Cardiology',
      hint: 'Pick an option. A wrong answer also becomes a flashcard.',
      question: 'Chest pain radiating to the left arm, sweating, and ST elevation. First step?',
      options: [
        { key: 'A', text: 'Nitroglycerin and observation' },
        { key: 'B', text: 'Aspirin and immediate PCI' },
        { key: 'C', text: 'Antibiotics and rest' },
        { key: 'D', text: 'Repeat the ECG only' },
      ],
      correct: 'B',
      badgeRight: 'Score 100 · correct',
      badgeWrong: 'Score 0 · miss',
      explainRight: 'Correct. Do not delay reperfusion in STEMI: aspirin and immediate PCI.',
      explainWrong: 'Correct answer is B. Nitroglycerin is not enough: aspirin and immediate PCI. The miss goes to “My mistakes”.',
      tryAgain: 'Try again',
    },
    card: {
      topic: 'My mistakes',
      frontLabel: 'Front',
      backLabel: 'Back',
      front: 'First reperfusion step in STEMI?',
      back: 'Aspirin + immediate PCI (primary). Nitroglycerin or observation is not enough.',
      flip: 'Tap the card to see the answer',
      ways: 'From a miss · By hand · AI topic deck',
      rated: 'Saved. The next review depends on this rating — reviews are free.',
      tryAgain: 'Flip again',
    },
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
  const [slide, setSlide] = useState(0);
  const [draft, setDraft] = useState('');
  const [sent, setSent] = useState('');
  const [testPick, setTestPick] = useState('');
  const [fcFlipped, setFcFlipped] = useState(false);
  const [fcRated, setFcRated] = useState('');
  const pausedRef = useRef(false);

  const demoTab = SLIDE_IDS[slide];

  const resetDemo = () => {
    setDraft('');
    setSent('');
    setTestPick('');
    setFcFlipped(false);
    setFcRated('');
  };

  useEffect(() => {
    setSampleLang(currentLang);
    resetDemo();
  }, [currentLang]);

  const interacting = Boolean(sent || testPick || fcFlipped);

  useEffect(() => {
    if (interacting) return undefined;
    const timer = setInterval(() => {
      if (pausedRef.current) return;
      setSlide((prev) => (prev + 1) % SLIDE_IDS.length);
    }, 9000);
    return () => clearInterval(timer);
  }, [interacting]);

  const handleSelectLang = (newCode) => {
    if (onLangChange) onLangChange(newCode);
    else setLang(newCode);
  };

  const goSlide = (next) => {
    setSlide((next + SLIDE_IDS.length) % SLIDE_IDS.length);
  };

  const pack = SAMPLE[sampleLang] || SAMPLE.uz;
  const sample = pack.case;
  const test = pack.test;
  const card = pack.card;

  const handleSend = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sent) return;
    setSent(text);
    setDraft('');
  };

  const slides = [
    {
      id: 'case',
      title: t('landing.demo.case', 'Keys'),
      lead: t('landing.demo.caseLead', 'Bemor holatini o‘qing — tashxis va rejangizni yozing.'),
    },
    {
      id: 'test',
      title: t('landing.demo.test', 'Test'),
      lead: t('landing.demo.testLead', 'Variantni tanlang. Xato ham fleshkartaga tushadi.'),
    },
    {
      id: 'card',
      title: t('landing.demo.card', 'Karta'),
      lead: t('landing.demo.cardLead', 'Kartani oching va Qayta / Qiyin / Yaxshi / Oson belgilang — takrorlash bepul.'),
    },
  ];

  const current = slides[slide];

  const features = [
    {
      icon: Brain,
      title: t('landing.feat.caseTitle', 'Klinik keys'),
      desc: t('landing.feat.caseDesc', 'Bemor holatini o‘qib tashxis va reja yozasiz. AI 0–100 ball qo‘yadi, xato fleshkartaga tushadi.'),
    },
    {
      icon: ListChecks,
      title: t('landing.feat.testTitle', 'Test yechish'),
      desc: t('landing.feat.testDesc', 'Variantli savollar. Bo‘limdan yoki o‘z mavzuingizdan. Noto‘g‘ri javob ham kartaga aylanadi.'),
    },
    {
      icon: Layers,
      title: t('landing.feat.flashTitle', 'Fleshkartalar'),
      desc: t('landing.feat.flashDesc', 'Xato avtomatik «Xatolarim»ga tushadi. Qo‘lda yoki AI bilan ham yarating. Ochib Qayta / Qiyin / Yaxshi / Oson deng — takrorlash bepul.'),
    },
    {
      icon: Map,
      title: t('landing.feat.mapTitle', 'Bilim xaritasi'),
      desc: t('landing.feat.mapDesc', 'Qaysi mavzu kuchli, qaysi zaif — xaritada ko‘ring va keyingi mashqni tanlang.'),
    },
  ];

  const steps = [
    { n: '01', title: t('landing.steps.s1Title', 'Keys yoki test'), desc: t('landing.steps.s1Desc', 'Tashxis yozing yoki variant tanlang. Kunlik bepul tanga bilan boshlang.') },
    { n: '02', title: t('landing.steps.s2Title', 'Kartani oching'), desc: t('landing.steps.s2Desc', 'Xato avtomatik kartaga aylanadi. Ochib baholang — har kuni takrorlash bepul.') },
    { n: '03', title: t('landing.steps.s3Title', 'Xaritani kuzating'), desc: t('landing.steps.s3Desc', 'Bilim xaritasi zaif mavzularni ko‘rsatadi — keyingi qadam aniq.') },
  ];

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

      <main className="landing-hero-section landing-hero-section--solo">
        <div className="landing-rings" aria-hidden />
        <div className="landing-hero-copy">
          <p className="landing-kicker">
            {t('landing.hero.kicker', 'Keys · Test · Fleshkartalar')}
          </p>
          <h1>
            {t('landing.hero.titleLine1', 'Klinik amaliyot —')}
            {' '}
            <span>{t('landing.hero.titleAccent', 'AI mashq bilan.')}</span>
          </h1>
          <p className="landing-hero-desc">
            {t('landing.hero.desc', 'Keys yozasiz yoki test yechasiz. Xato fleshkartaga aylanadi — ochasiz, baholaysiz, bepul takrorlaysiz.')}
          </p>
          <div className="landing-cta-row">
            <button type="button" className="landing-primary-btn" onClick={onOpenLogin}>
              {isAuthenticated
                ? t('landing.hero.ctaCabinet', 'Kabinetga kirish')
                : t('landing.hero.cta', 'Bepul boshlang')}
            </button>
          </div>
          {!isAuthenticated && (
            <p className="landing-hint">{t('landing.hero.hint', "Ro'yxatdan o'tish bepul. Har kuni bepul tanga beriladi.")}</p>
          )}
        </div>
      </main>

      <div className="landing-section-rule" aria-hidden="true" />

      <section
        className="landing-demo-section"
        id="ll-sample"
        onPointerEnter={() => { pausedRef.current = true; }}
        onPointerLeave={() => { pausedRef.current = interacting; }}
      >
        <div className="landing-demo-head">
          <div>
            <p className="landing-demo-kicker">{t('landing.demo.try', 'Namunani sinab ko‘ring')}</p>
            <h2 className="landing-demo-title">{current.title}</h2>
            <p className="landing-demo-lead">{current.lead}</p>
          </div>
          <div className="landing-demo-tools">
            <div className="landing-lang-pills landing-lang-pills--sm" role="group" aria-label="Sample language">
              {LANGUAGES.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  className={`landing-lang-pill${sampleLang === item.code ? ' is-active' : ''}`}
                  onClick={() => {
                    setSampleLang(item.code);
                    resetDemo();
                  }}
                >
                  {item.short}
                </button>
              ))}
            </div>
            <div className="landing-demo-arrows">
              <button type="button" aria-label={t('common.prev', 'Oldingi')} onClick={() => goSlide(slide - 1)}>
                <ChevronLeft size={20} />
              </button>
              <button type="button" aria-label={t('common.next', 'Keyingi')} onClick={() => goSlide(slide + 1)}>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="landing-demo-card">
          <div className="landing-sample-top">
            <span className="landing-sample-topic">
              <span className="landing-sample-dot" />
              {demoTab === 'test' ? test.topic : demoTab === 'card' ? card.topic : sample.topic}
            </span>
          </div>

          {demoTab === 'case' && (
            <>
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
                    <textarea
                      rows={4}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder={sample.prompt}
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
                  <button type="button" className="landing-try-again" onClick={resetDemo}>
                    {sample.tryAgain}
                  </button>
                  <button type="button" className="landing-primary-btn" onClick={onOpenLogin}>
                    {t('landing.hero.cta', 'Bepul boshlang')}
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}

          {demoTab === 'test' && (
            <>
              <p className="landing-test-q">{test.question}</p>
              <div className="landing-test-opts">
                {test.options.map((opt) => {
                  const revealed = Boolean(testPick);
                  const selected = testPick === opt.key;
                  const isCorrect = opt.key === test.correct;
                  const cls = [
                    'landing-test-opt',
                    selected ? 'is-selected' : '',
                    revealed && isCorrect ? 'is-correct' : '',
                    revealed && selected && !isCorrect ? 'is-wrong' : '',
                  ].filter(Boolean).join(' ');
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      className={cls}
                      disabled={revealed}
                      onClick={() => setTestPick(opt.key)}
                    >
                      <b>{opt.key}</b>
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {!testPick ? (
                <div className="landing-ai-hint">
                  <ListChecks size={14} strokeWidth={2.4} />
                  <span>{test.hint}</span>
                </div>
              ) : (
                <>
                  <div className="landing-bubble landing-bubble--ai" style={{ maxWidth: '100%' }}>
                    <span className="landing-bubble-role">
                      AI
                      <span className="landing-ai-chip">
                        <Sparkles size={11} strokeWidth={2.4} />
                        {testPick === test.correct ? test.badgeRight : test.badgeWrong}
                      </span>
                    </span>
                    <div className="landing-bubble-body">
                      {testPick === test.correct ? test.explainRight : test.explainWrong}
                    </div>
                  </div>
                  <div className="landing-explain-cta">
                    <button type="button" className="landing-try-again" onClick={resetDemo}>
                      {test.tryAgain}
                    </button>
                    <button type="button" className="landing-primary-btn" onClick={onOpenLogin}>
                      {t('landing.hero.cta', 'Bepul boshlang')}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {demoTab === 'card' && (
            <>
              <button
                type="button"
                className={`landing-fc${fcFlipped ? ' is-flipped' : ''}`}
                onClick={() => { if (!fcRated) setFcFlipped((v) => !v); }}
              >
                <span className="landing-fc-kicker">
                  {fcFlipped ? card.backLabel : card.frontLabel}
                </span>
                <span className="landing-fc-text">{fcFlipped ? card.back : card.front}</span>
                {!fcFlipped && <span className="landing-fc-flip">{card.flip}</span>}
              </button>

              {fcFlipped && !fcRated && (
                <div className="landing-fc-ratings">
                  {FC_RATINGS.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      style={{ background: r.bg, color: r.color }}
                      onClick={() => setFcRated(r.id)}
                    >
                      {r.id === 'again'
                        ? t('flash.again', 'Qayta')
                        : r.id === 'hard'
                          ? t('flash.hard', 'Qiyin')
                          : r.id === 'good'
                            ? t('flash.good', 'Yaxshi')
                            : t('flash.easy', 'Oson')}
                    </button>
                  ))}
                </div>
              )}

              {fcRated ? (
                <>
                  <p className="landing-fc-note">{card.rated}</p>
                  <div className="landing-explain-cta">
                    <button type="button" className="landing-try-again" onClick={resetDemo}>
                      {card.tryAgain}
                    </button>
                    <button type="button" className="landing-primary-btn" onClick={onOpenLogin}>
                      {t('landing.hero.cta', 'Bepul boshlang')}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </>
              ) : (
                <p className="landing-fc-ways">{card.ways}</p>
              )}
            </>
          )}
        </div>

        <div className="landing-demo-dots" aria-label={t('landing.demo.aria', 'Namuna')}>
          {slides.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              className={`landing-demo-dot${slide === idx ? ' is-active' : ''}`}
              onClick={() => setSlide(idx)}
            >
              {item.title}
            </button>
          ))}
        </div>
      </section>

      <section className="landing-below">
        <div className="landing-feat-grid landing-feat-grid--4">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="landing-feat-card">
                <div className="landing-feat-icon">
                  <Icon size={20} strokeWidth={2.2} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </article>
            );
          })}
        </div>

        <div className="landing-steps">
          {steps.map((item) => (
            <div key={item.n} className="landing-step">
              <span className="landing-step-n">{item.n}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">{t('gen.copyright')}</footer>
    </div>
  );
}
