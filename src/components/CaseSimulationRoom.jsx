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
import ClinicalHintModal from './ClinicalHintModal';

export default function CaseSimulationRoom({
  caseItem,
  onExitSimulation,
  onFinishCase
}) {
  // Patient Status: 'stable' | 'unstable' | 'critical'
  const [patientStatus, setPatientStatus] = useState('unstable');

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
      text: caseItem?.chief_complaint || "26 yoshli ayol bemor. Yer yong'oqli desert iste'mol qilgandan 10 daqiqa o'tib, butun tanada qichishish, eshakemi (urtikariya), tomoq qisishi va nafas qisishi shikoyati bilan reanimatsiya palatasiga keltirildi. Gapirishi qiyinlashgan, lablarida shish bor. Qanday tezkor chora ko'rasiz?",
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

    const userText = actionText.trim();
    setInputText('');
    setQuestionsCount(prev => prev + 1);

    const lower = userText.toLowerCase();
    const isParacetamol = lower.includes('paratsetamol') || lower.includes('paracetamol');
    const isEpi = lower.includes('epinephrine') || lower.includes('adrenaline') || lower.includes('adrenalin');
    const isOxygen = lower.includes('oxygen') || lower.includes('kislorod');
    const isSaline = lower.includes('saline') || lower.includes('fizraster') || lower.includes('0.9%') || lower.includes('infuziya');

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
        badge: '↓ Notoʻgʻri koʻrsatma'
      };
      systemReply = "Paratsetamol berildi. Biroq bemorning tomoq qisishi va nafas siqilishi kuchaymoqda!\n\n\"Nafas olishim yanada qiyinlashmoqda, tomog'im bo'g'ilyapti...\" - deb arang shivirladi. Yurak urishi tezlashdi va qon bosimi tushib ketmoqda.";
      setPatientStatus('critical');
      setVitals({ hr: 142, temp: 36.9, bp: '78/48', rr: 30, spo2: 88 });
    } else if (isEpi) {
      evaluation = {
        type: 'correct',
        badge: '↑ Ajoyib klinik qaror'
      };
      systemReply = "Epinefrin (Adrenalin) 0.5 mg zudlik bilan sonning old-yon qismiga mushak ichiga (IM) kiritildi!\n\n2 daqiqa ichida bronxospazm pasaydi, laringo-edema kamaydi. Bemor erkin nafas ola boshladi, qon bosimi ko'tarildi.";
      setPatientStatus('stable');
      setVitals({ hr: 98, temp: 36.8, bp: '115/75', rr: 18, spo2: 98 });
    } else if (isOxygen) {
      evaluation = {
        type: 'correct',
        badge: '↑ Toʻgʻri chora'
      };
      systemReply = "Rezervuar niqob orqali 15 L/min yuqori oqimli O2 kislorod ingalyatsiyasi ulandi. SpO2 ko'rsatkichi 92% dan 97% gacha yaxshilandi.";
      setVitals(v => ({ ...v, spo2: 97, rr: 20 }));
    } else if (isSaline) {
      evaluation = {
        type: 'correct',
        badge: '↑ Toʻgʻri chora'
      };
      systemReply = "Vena ichiga 1000 ml 0.9% NaCl fiziologik eritmasi tezkor oqim bilan yuborildi. Qon bosimi barqarorlashmoqda.";
      setVitals(v => ({ ...v, bp: '105/65', hr: 110 }));
    } else {
      evaluation = {
        type: 'neutral',
        badge: 'Buyruq qabul qilindi'
      };
      systemReply = `Buyruq bajarildi: "${userText}". Bemor ICU monitor nazoratida ushlab turilibdi.`;
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
      minHeight: '100vh',
      background: '#0B1320',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '12px 16px 80px 16px',
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
              background: '#131E30',
              border: '1.5px solid #20334E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#94A3B8',
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
              color: '#FFFFFF',
              margin: '0 0 2px 0',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {caseItem?.title || 'Klinik Simulyatsiya Keysi'}
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
              <span>💬 {questionsCount} ta harakat</span>
            </div>
          </div>

          {/* Clinical Hint & Finish Case Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <button
              id="btn-clinical-hint"
              onClick={() => setHintModalOpen(true)}
              title="Klinik maslahat"
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#131E30',
                border: '1.5px solid #20334E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#F59E0B',
              }}
            >
              <Lightbulb size={18} fill="#FDE047" color="#D97706" />
            </button>

            <button
              id="btn-finish-case"
              onClick={handleFinishSimulation}
              title="Keysni yakunlash"
              style={{
                padding: '8px 14px',
                borderRadius: 99,
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                border: '1px solid #B91C1C',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
              }}
            >
              <Flag size={13} />
              <span>Yakunlash</span>
            </button>
          </div>
        </div>

        {/* 2. REAL HOSPITAL ICU / CARDIAC MONITOR APPARATUS */}
        <HospitalMonitor vitals={vitals} status={patientStatus} />

        {/* 3. CLINICAL CONVERSATION & CASE TIMELINE */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          minHeight: 280,
          maxHeight: '46vh',
          overflowY: 'auto',
          padding: '8px 4px',
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
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
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
                      background: msg.evaluation.type === 'wrong' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                      color: msg.evaluation.type === 'wrong' ? '#F87171' : '#4ADE80',
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: 99,
                      border: msg.evaluation.type === 'wrong' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(34, 197, 94, 0.3)',
                    }}>
                      {msg.evaluation.badge}
                    </span>
                  </div>
                )}

                <div style={{
                  background: '#131E30',
                  borderRadius: '4px 18px 18px 18px',
                  border: '1px solid #20334E',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                  padding: '14px 18px',
                  color: '#E2E8F0',
                  fontSize: '13.5px',
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
            placeholder="Tibbiy buyruq yoki dori vositasini yozing..."
            style={{
              flex: 1,
              padding: '14px 18px',
              borderRadius: 99,
              background: '#131E30',
              border: '1.5px solid #20334E',
              fontSize: '14px',
              fontWeight: 500,
              color: '#FFFFFF',
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
              background: 'linear-gradient(135deg, #0284C7 0%, #2563EB 100%)',
              border: 'none',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          flexWrap: 'wrap',
          justifyContent: 'center',
          paddingTop: 4,
        }}>
          {[
            "Epinefrin 0.5 mg IM",
            "Yuqori oqimli O2 kislorod",
            "0.9% NaCl 1000 ml IV",
            "Paratsetamol 500 mg"
          ].map((quickText, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePerformAction(quickText)}
              style={{
                background: '#131E30',
                border: '1px solid #20334E',
                borderRadius: 99,
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#94A3B8',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#38BDF8';
                e.currentTarget.style.borderColor = '#0284C7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#94A3B8';
                e.currentTarget.style.borderColor = '#20334E';
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
        hintText="Anafilaktik shok holatida zudlik bilan hayotni saqlovchi dori vositasini o'ylang. Epinefrin (Adrenalin) kechiktirilmasdan sonning old-yon tomoniga mushak ichiga kiritilishi birinchi darajali oltin standart hisoblanadi."
      />

      {/* 6. CASE COMPLETED DEBRIEFING SCREEN */}
      {isFinished && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(11, 19, 32, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 130,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}>
          <div style={{
            width: '100%',
            maxWidth: 440,
            background: '#131E30',
            borderRadius: 30,
            border: '2px solid #20334E',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 16,
          }}>
            {/* Trophy Gold Badge */}
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FEF08A, #FDE047)',
              border: '3px solid #FACC15',
              boxShadow: '0 0 25px rgba(234, 179, 8, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#B45309',
            }}>
              <Award size={40} strokeWidth={2.4} />
            </div>

            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', margin: '0 0 4px 0' }}>
                Keys Muvaffaqiyatli Yakunlandi!
              </h2>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#94A3B8', margin: 0 }}>
                {caseItem?.title || 'Klinik Keys'}
              </p>
            </div>

            {/* Score & Rewards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 10,
              width: '100%',
            }}>
              <div style={{ padding: '12px 8px', borderRadius: 16, background: '#0B1320', border: '1px solid #20334E' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B' }}>NATIJA</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#4ADE80' }}>{finalScore}%</div>
              </div>
              <div style={{ padding: '12px 8px', borderRadius: 16, background: '#0B1320', border: '1px solid #20334E' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B' }}>XP</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#FBBF24' }}>+250</div>
              </div>
              <div style={{ padding: '12px 8px', borderRadius: 16, background: '#0B1320', border: '1px solid #20334E' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B' }}>VAQT</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#38BDF8' }}>{formatTimer(secondsElapsed)}</div>
              </div>
            </div>

            {/* Key Clinical Learning Point */}
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: 18,
              padding: '14px 16px',
              textAlign: 'left',
              fontSize: '12.5px',
              color: '#86EFAC',
              lineHeight: 1.5,
            }}>
              <strong>Klinik Xulosa:</strong> Anafilaktik shok holatida har daqiqa g'animat. Epinefrin (Adrenalin) kechiktirilmasdan sonning old-yon qismiga mushak ichiga kiritilishi shart.
            </div>

            {/* Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%', marginTop: 8 }}>
              <button
                onClick={() => {
                  setIsFinished(false);
                  setMessages([messages[0]]);
                  setVitals({ hr: 129, temp: 36.8, bp: '88/54', rr: 26, spo2: 92 });
                  setPatientStatus('unstable');
                }}
                style={{
                  padding: '12px',
                  borderRadius: 16,
                  background: '#1E293B',
                  border: '1px solid #334155',
                  color: '#CBD5E1',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <RotateCcw size={15} />
                <span>Qaytadan</span>
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
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)',
                }}
              >
                Davom etish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
