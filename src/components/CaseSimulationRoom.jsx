import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Award,
  Send,
  Flag
} from 'lucide-react';
import HospitalMonitor from './HospitalMonitor';
import PatientAvatar from './PatientAvatar';
import ClinicalHintModal from './ClinicalHintModal';
import { useTranslation } from '../i18n.jsx';

export default function CaseSimulationRoom({
  caseItem,
  onExitSimulation,
  onFinishCase
}) {
  const { t, lang } = useTranslation();

  // Patient Status: 'stable' | 'unstable' | 'critical' | 'improving' | 'deteriorating'
  const [patientStatus, setPatientStatus] = useState('unstable');

  // health_percent — backenddan keladi (POST /mobile/simulation/start → health_percent)
  // va POST /mobile/simulation/{id}/event → health_percent yangilanadi
  const [healthPercent, setHealthPercent] = useState(72);

  // Avatar animatsiyasini har xabar yuborganda trigger qilish
  const [avatarAnimate, setAvatarAnimate] = useState(false);

  // Real-time Vitals connected directly to the Hospital ICU Monitor
  const [vitals, setVitals] = useState({
    hr: 129,
    temp: 36.8,
    bp: '88/54',
    rr: 26,
    spo2: 92
  });

  // Timer & Questions count
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [questionsCount, setQuestionsCount] = useState(0);

  // Clinical Hint modal
  const [hintModalOpen, setHintModalOpen] = useState(false);

  // Chat / Actions log
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'patient',
      text: caseItem?.chief_complaint || (
        lang === 'ru'
          ? "26-летняя пациентка доставлена в ОРИТ через 10 минут после десерта с арахисом. Жалобы: зуд, генерализованная крапивница, отек горла и одышка. Речь затруднена, губы отечны. Ваши экстренные действия?"
          : (lang === 'en'
            ? "26-year-old female presents to the ICU 10 minutes after eating a peanut dessert with generalized itching, urticaria, throat tightness, and severe shortness of breath. She can only speak in short phrases. What is your immediate clinical management?"
            : "26 yoshli ayol bemor. Yer yong'oqli desert iste'mol qilgandan 10 daqiqa o'tib, butun tanada qichishish, eshakemi (urtikariya), tomoq qisishi va nafas qisishi shikoyati bilan reanimatsiya palatasiga keltirildi. Gapirishi qiyinlashgan, lablarida shish bor. Qanday tezkor chora ko'rasiz?")
      ),
      time: '00:00'
    }
  ]);

  // Debrief / Completion screen
  const [isFinished, setIsFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(88);

  const chatBottomRef = useRef(null);

  // Timer interval
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTimer = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  // Submit clinical action / order
  const handlePerformAction = (actionText) => {
    if (!actionText || !actionText.trim()) return;

    // Avatar animatsiyasini trigger qil
    setAvatarAnimate(true);
    setTimeout(() => setAvatarAnimate(false), 100);

    const userText = actionText.trim();
    setInputText('');
    setQuestionsCount(prev => prev + 1);

    const lower = userText.toLowerCase();
    const isParacetamol = lower.includes('paratsetamol') || lower.includes('paracetamol') || lower.includes('парацетамол');
    const isEpi = lower.includes('epinephrine') || lower.includes('adrenaline') || lower.includes('adrenalin') || lower.includes('эпинефрин') || lower.includes('адреналин');
    const isOxygen = lower.includes('oxygen') || lower.includes('kislorod') || lower.includes('кислород');
    const isSaline = lower.includes('saline') || lower.includes('fizraster') || lower.includes('0.9%') || lower.includes('infuziya') || lower.includes('физраствор');

    // Add user message
    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      time: formatTimer(secondsElapsed)
    };

    let evaluation = null;
    let systemReply = null;

    if (isParacetamol) {
      evaluation = {
        type: 'wrong',
        badge: lang === 'ru' ? '↓ Неверное назначение' : (lang === 'en' ? '↓ Incorrect choice' : '↓ Notoʻgʻri koʻrsatma')
      };
      systemReply = lang === 'ru'
        ? "Парацетамол введен. Однако отек гортани и удушье нарастают!\n\n\"Дышать еще тяжелее, в горле ком...\" — еле слышно хрипит пациентка. Тахикардия усиливается, артериальное давление падает."
        : (lang === 'en'
          ? "Paracetamol administered. Throat tightness and respiratory distress are worsening rapidly!\n\n\"I can't catch my breath, my throat is closing up...\" she gasps. Blood pressure is dropping."
          : "Paratsetamol berildi. Biroq bemorning tomoq qisishi va nafas siqilishi kuchaymoqda!\n\n\"Nafas olishim yanada qiyinlashmoqda, tomog'im bo'g'ilyapti...\" - deb arang shivirladi. Yurak urishi tezlashdi va qon bosimi tushib ketmoqda.");
      setPatientStatus('critical');
      setHealthPercent(prev => Math.max(0, prev - 22));
      setVitals({ hr: 142, temp: 36.9, bp: '78/48', rr: 30, spo2: 88 });
    } else if (isEpi) {
      evaluation = {
        type: 'correct',
        badge: lang === 'ru' ? '↑ Отличное решение' : (lang === 'en' ? '↑ Excellent choice' : '↑ Ajoyib klinik qaror')
      };
      systemReply = lang === 'ru'
        ? "Эпинефрин (Адреналин) 0.5 мг немедленно введен внутримышечно в передне-боковую часть бедра!\n\nВ течение 2 минут бронхоспазм уменьшился, отек гортани спал. Пациентка дышит свободно, АД стабилизировалось."
        : (lang === 'en'
          ? "Epinephrine 0.5 mg administered IM into the anterolateral thigh!\n\nWithin 2 minutes, bronchospasm relieves and stridor improves. Blood pressure climbs toward normal."
          : "Epinefrin (Adrenalin) 0.5 mg zudlik bilan sonning old-yon qismiga mushak ichiga (IM) kiritildi!\n\n2 daqiqa ichida bronxospazm pasaydi, laringo-edema kamaydi. Bemor erkin nafas ola boshladi, qon bosimi ko'tarildi.");
      setPatientStatus('improving');
      setHealthPercent(prev => Math.min(100, prev + 25));
      setVitals({ hr: 98, temp: 36.8, bp: '115/75', rr: 18, spo2: 98 });
      setTimeout(() => setPatientStatus('stable'), 2500);
    } else if (isOxygen) {
      evaluation = {
        type: 'correct',
        badge: lang === 'ru' ? '↑ Верное действие' : (lang === 'en' ? '↑ Correct action' : '↑ Toʻgʻri chora')
      };
      systemReply = lang === 'ru'
        ? "Высокопоточный кислород 15 л/мин подключен через маску с резервуаром. SpO2 вырос с 92% до 97%."
        : (lang === 'en'
          ? "High-flow O2 at 15 L/min started via non-rebreather mask. SpO2 improved from 92% to 97%."
          : "Rezervuar niqob orqali 15 L/min yuqori oqimli O2 kislorod ingalyatsiyasi ulandi. SpO2 ko'rsatkichi 92% dan 97% gacha yaxshilandi.");
      setHealthPercent(prev => Math.min(100, prev + 8));
      setVitals(v => ({ ...v, spo2: 97, rr: 20 }));
    } else if (isSaline) {
      evaluation = {
        type: 'correct',
        badge: lang === 'ru' ? '↑ Верное действие' : (lang === 'en' ? '↑ Correct action' : '↑ Toʻgʻri chora')
      };
      systemReply = lang === 'ru'
        ? "Внутривенно болюсно введен 1000 мл 0.9% раствора NaCl. Гемодинамика стабилизируется."
        : (lang === 'en'
          ? "1000 mL 0.9% Normal Saline bolus started. Hemodynamics stabilizing."
          : "Vena ichiga 1000 ml 0.9% NaCl fiziologik eritmasi tezkor oqim bilan yuborildi. Qon bosimi barqarorlashmoqda.");
      setHealthPercent(prev => Math.min(100, prev + 6));
      setVitals(v => ({ ...v, bp: '105/65', hr: 110 }));
    } else {
      evaluation = {
        type: 'neutral',
        badge: lang === 'ru' ? 'Назначение принято' : (lang === 'en' ? 'Order processed' : 'Buyruq qabul qilindi')
      };
      systemReply = lang === 'ru'
        ? `Назначение выполнено: "${userText}". Пациент находится под непрерывным мониторингом ОРИТ.`
        : (lang === 'en'
          ? `Action performed: "${userText}". Patient remains on ICU telemetry.`
          : `Buyruq bajarildi: "${userText}". Bemor ICU monitor nazoratida ushlab turilibdi.`);
    }

    const replyMsg = {
      id: `sys-${Date.now()}`,
      sender: 'system',
      text: systemReply,
      evaluation,
      time: formatTimer(secondsElapsed + 1)
    };

    setMessages(prev => [...prev, userMsg, replyMsg]);
  };

  const handleFinishSimulation = () => {
    setIsFinished(true);
    if (onFinishCase) {
      onFinishCase({
        score: finalScore,
        xp: 250,
        coins: 10,
        time: formatTimer(secondsElapsed)
      });
    }
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '90vh',
      background: '#F8FAFC',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '16px 16px 90px 16px',
      boxSizing: 'border-box',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      position: 'relative',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 580,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        gap: 12,
      }}>

        {/* 1. TOP HEADER BAR: Back + Case Info + Finish button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 0',
          gap: 10,
        }}>
          {/* Back button */}
          <button
            id="btn-exit-simulation"
            onClick={onExitSimulation}
            style={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#0F172A',
              flexShrink: 0,
            }}
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>

          {/* Center Info: Title + Timer + Questions count */}
          <div style={{ textAlign: 'center', flex: 1, overflow: 'hidden' }}>
            <h2 style={{
              fontSize: '15px',
              fontWeight: 800,
              color: '#0F172A',
              margin: '0 0 2px 0',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {caseItem?.title || t('sim.headerCase')}
            </h2>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              fontSize: '11px',
              fontWeight: 700,
              color: '#64748B',
            }}>
              <span>⏱ {formatTimer(secondsElapsed)}</span>
              <span>💬 {questionsCount} {t('sim.actionsCount')}</span>
            </div>
          </div>

          {/* Clinical Hint & Finish Case Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <button
              id="btn-clinical-hint"
              onClick={() => setHintModalOpen(true)}
              title={t('sim.hintTitle')}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#FEF3C7',
                border: '1.5px solid #FDE68A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#D97706',
              }}
            >
              <Lightbulb size={18} fill="#FDE047" color="#D97706" />
            </button>

            <button
              id="btn-finish-case"
              onClick={handleFinishSimulation}
              title={t('sim.finishBtn')}
              style={{
                padding: '8px 14px',
                borderRadius: 99,
                background: '#FEE2E2',
                border: '1.5px solid #FECACA',
                color: '#DC2626',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <Flag size={13} />
              <span>{t('sim.finishBtn')}</span>
            </button>
          </div>
        </div>

        {/* 2. PATIENT AVATAR — bemor holati, ECG animatsiya va vitals */}
        <PatientAvatar
          healthPercent={healthPercent}
          visualState={patientStatus}
          patientAge={caseItem?.patient_age || 45}
          patientGender={caseItem?.patient_gender || 'male'}
          vitals={vitals}
          animateChange={avatarAnimate}
        />

        {/* 4. CLINICAL CONVERSATION & CASE TIMELINE */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          minHeight: 280,
          maxHeight: '46vh',
          overflowY: 'auto',
          padding: '8px 2px',
        }}>
          {/* Messages list */}
          {messages.map((msg) => {
            if (msg.sender === 'user') {
              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: 'flex-end',
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 8,
                    maxWidth: '85%',
                  }}
                >
                  <div style={{
                    background: '#2563EB',
                    color: '#FFFFFF',
                    borderRadius: '18px 18px 4px 18px',
                    padding: '12px 16px',
                    fontSize: '14px',
                    fontWeight: 600,
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
                    lineHeight: 1.45,
                  }}>
                    {msg.text}
                  </div>
                </div>
              );
            }

            // System / Patient response
            return (
              <div
                key={msg.id}
                style={{
                  alignSelf: 'flex-start',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  maxWidth: '92%',
                }}
              >
                {/* Decision evaluation badge if present */}
                {msg.evaluation && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      background: msg.evaluation.type === 'wrong' ? '#FEE2E2' : '#DCFCE7',
                      color: msg.evaluation.type === 'wrong' ? '#DC2626' : '#16A34A',
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: 99,
                      border: msg.evaluation.type === 'wrong' ? '1px solid #FECACA' : '1px solid #86EFAC',
                    }}>
                      {msg.evaluation.badge}
                    </span>
                  </div>
                )}

                <div style={{
                  background: '#FFFFFF',
                  borderRadius: '4px 20px 20px 20px',
                  border: '1.5px solid #E2E8F0',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                  padding: '15px 18px',
                  color: '#1E293B',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: 1.55,
                  whiteSpace: 'pre-line',
                }}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={chatBottomRef} />
        </div>

        {/* 4. DOCTOR'S CLINICAL ORDER INPUT BAR */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePerformAction(inputText);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            marginTop: 4,
          }}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t('sim.orderPlaceholder')}
            style={{
              flex: 1,
              padding: '14px 18px',
              borderRadius: 99,
              background: '#FFFFFF',
              border: '1.5px solid #CBD5E1',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)',
              fontSize: '14px',
              fontWeight: 500,
              color: '#0F172A',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />

          <button
            type="submit"
            id="btn-send-action"
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
              border: 'none',
              boxShadow: '0 6px 18px rgba(34, 197, 94, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <ArrowRight size={20} strokeWidth={2.6} />
          </button>
        </form>

        {/* Quick action helper chips for convenience */}
        <div
          className="mobile-quick-actions no-scrollbar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            flexWrap: 'wrap',
            justifyContent: 'center',
            paddingTop: 4,
          }}
        >
          {[
            lang === 'ru' ? "Эпинефрин 0.5 мг в/м" : (lang === 'en' ? "Epinephrine 0.5 mg IM" : "Epinefrin 0.5 mg IM"),
            lang === 'ru' ? "Кислород 15 л/мин" : (lang === 'en' ? "High-flow O2 (15 L/min)" : "Yuqori oqimli O2 kislorod"),
            lang === 'ru' ? "0.9% NaCl 1000 мл в/в" : (lang === 'en' ? "0.9% NaCl 1000 mL IV" : "0.9% NaCl 1000 ml IV"),
            lang === 'ru' ? "Парацетамол 500 мг" : (lang === 'en' ? "Paracetamol 500 mg" : "Paratsetamol 500 mg")
          ].map((quickText, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePerformAction(quickText)}
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                borderRadius: 99,
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#475569',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#16A34A';
                e.currentTarget.style.borderColor = '#86EFAC';
                e.currentTarget.style.background = '#DCFCE7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#475569';
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.background = '#FFFFFF';
              }}
            >
              + {quickText}
            </button>
          ))}
        </div>

      </div>

      {/* 5. CLINICAL HINT MODAL */}
      <ClinicalHintModal
        isOpen={hintModalOpen}
        onClose={() => setHintModalOpen(false)}
        hintText={t('sim.hintDefault')}
      />

      {/* 6. CASE COMPLETED DEBRIEFING SCREEN */}
      {isFinished && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(8px)',
          zIndex: 130,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}>
          <div
            className="responsive-modal-card"
            style={{
              width: '100%',
              maxWidth: 440,
              background: '#FFFFFF',
              borderRadius: 30,
              border: '2px solid #E2E8F0',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
              padding: '28px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 16,
            }}
          >
            {/* Trophy Gold Badge */}
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: '#FEF3C7',
              border: '2px solid #FDE68A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D97706',
            }}>
              <Award size={40} strokeWidth={2.4} />
            </div>

            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', margin: '0 0 4px 0' }}>
                {t('sim.caseCompleted')}
              </h2>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', margin: 0 }}>
                {caseItem?.title || t('sim.headerCase')}
              </p>
            </div>

            {/* Score & Rewards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 10,
              width: '100%',
            }}>
              <div style={{ padding: '12px 8px', borderRadius: 18, background: '#DCFCE7', border: '1.5px solid #86EFAC' }}>
                <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#166534' }}>{t('sim.score')}</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#16A34A' }}>{finalScore}%</div>
              </div>
              <div style={{ padding: '12px 8px', borderRadius: 18, background: '#FEF3C7', border: '1.5px solid #FDE68A' }}>
                <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#92400E' }}>{t('sim.xp')}</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#D97706' }}>+250</div>
              </div>
              <div style={{ padding: '12px 8px', borderRadius: 18, background: '#EFF6FF', border: '1.5px solid #BFDBFE' }}>
                <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#1E40AF' }}>{t('sim.time')}</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#2563EB' }}>{formatTimer(secondsElapsed)}</div>
              </div>
            </div>

            {/* Key Clinical Learning Point */}
            <div style={{
              background: '#F0FDF4',
              border: '1.5px solid #86EFAC',
              borderRadius: 18,
              padding: '14px 16px',
              textAlign: 'left',
              fontSize: '13px',
              color: '#166534',
              lineHeight: 1.5,
            }}>
              <strong>{t('sim.clinicalPearlTitle')}</strong> {t('sim.pearlDefault')}
            </div>

            {/* Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%', marginTop: 8 }}>
              <button
                onClick={() => {
                  setIsFinished(false);
                  setMessages([messages[0]]);
                  setVitals({ hr: 129, temp: 36.8, bp: '88/54', rr: 26, spo2: 92 });
                  setHealthPercent(72);
                  setPatientStatus('unstable');
                }}
                style={{
                  padding: '12px',
                  borderRadius: 16,
                  background: '#F1F5F9',
                  border: '1.5px solid #CBD5E1',
                  color: '#475569',
                  fontWeight: 800,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <RotateCcw size={15} />
                <span>{t('sim.retry')}</span>
              </button>

              <button
                onClick={onExitSimulation}
                style={{
                  padding: '12px',
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                  border: 'none',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  boxShadow: '0 6px 18px rgba(34, 197, 94, 0.35)',
                }}
              >
                {t('sim.continue')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
