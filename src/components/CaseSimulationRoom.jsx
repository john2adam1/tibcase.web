import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Lightbulb,
  CheckCircle2,
  Paperclip,
  Send,
  ArrowRight,
  User,
  Heart,
  Thermometer,
  Activity,
  Wind,
  X,
  Sparkles,
  FileText,
  AlertTriangle,
  Award,
  Stethoscope,
  FlaskConical,
  Users,
  BriefcaseMedical,
  RotateCcw
} from 'lucide-react';
import ClinicalHintModal from './ClinicalHintModal';

export default function CaseSimulationRoom({
  caseItem,
  onExitSimulation,
  onFinishCase
}) {
  // Stages: 'decision' | 'intervention' | 'monitoring' | 'discharge'
  const [activeStage, setActiveStage] = useState('decision');

  // Status: 'stable' | 'unstable' | 'critical' | 'recovered'
  const [patientStatus, setPatientStatus] = useState('unstable');

  // Vitals
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

  // Mentor guidance toast ("HOCAN DİYOR Kİ")
  const [mentorToast, setMentorToast] = useState({
    visible: true,
    text: "This medication is not typically used for this presentation. What is the primary goal of treatment in this situation?"
  });

  // Clinical Hint modal
  const [hintModalOpen, setHintModalOpen] = useState(false);

  // Left Paperclip drawer (Medical records / Attachments)
  const [recordsDrawerOpen, setRecordsDrawerOpen] = useState(false);
  const [paperclipAlert, setPaperclipAlert] = useState(true);

  // Action Category Picker Tray: null | 'exam' | 'tests' | 'consultation' | 'treatment'
  const [actionCategory, setActionCategory] = useState(null);

  // Chat / Actions log
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'patient',
      text: caseItem?.chief_complaint || "26-year-old female presents 10 minutes after eating a peanut-containing dessert with generalized itching, urticaria, throat tightness, and shortness of breath. She can only speak in short sentences and has lip swelling. What would you like to do?",
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

  // Clinical options list for each medical category
  const categoryOptions = {
    exam: [
      { id: 'ex-1', label: 'Check Airway & Stridor', desc: 'Inspect oral cavity, uvula and vocal cords' },
      { id: 'ex-2', label: 'Lung Auscultation', desc: 'Bilateral wheezing / bronchospasm check' },
      { id: 'ex-3', label: 'Skin Inspection', desc: 'Check for generalized urticaria, rash, angioedema' },
      { id: 'ex-4', label: 'Pupillary Reflex & GCS', desc: 'Assess consciousness & neurological baseline' }
    ],
    tests: [
      { id: 'ts-1', label: '12-Lead ECG Monitor', desc: 'Monitor rhythm, tachycardia or ischemia' },
      { id: 'ts-2', label: 'Arterial Blood Gas (ABG)', desc: 'Assess PaO2, PaCO2, pH and lactate' },
      { id: 'ts-3', label: 'Complete Blood Count (CBC)', desc: 'Baseline hematocrit, leukocytosis' },
      { id: 'ts-4', label: 'Blood Glucose & Serum Tryptase', desc: 'Confirm mast cell degranulation marker' }
    ],
    consultation: [
      { id: 'co-1', label: 'Ask about Peanut Allergy history', desc: '"Do you have known severe food or drug allergies?"' },
      { id: 'co-2', label: 'Ask if Carrying EpiPen', desc: '"Do you carry an epinephrine auto-injector?"' },
      { id: 'co-3', label: 'Ask about Asthma or Cardiac history', desc: '"Do you have asthma or heart disease?"' }
    ],
    treatment: [
      { id: 'tr-1', label: 'Epinephrine (Adrenaline) 0.5 mg IM', desc: 'First-line life saving drug into anterolateral thigh', correct: true },
      { id: 'tr-2', label: 'High-flow Oxygen via Non-Rebreather 15 L/min', desc: 'Target SpO2 > 94-96%', correct: true },
      { id: 'tr-3', label: 'IV Normal Saline Bolus (1000 mL)', desc: 'Combat distributive shock and hypotension', correct: true },
      { id: 'tr-4', label: 'Diphenhydramine 50 mg IV + Methylprednisolone', desc: 'Second-line antihistamine and corticosteroid', correct: true },
      { id: 'tr-5', label: 'Paracetamol 500 mg PO', desc: 'Oral antipyretic/analgesic', correct: false }
    ]
  };

  // Submit clinical action
  const handlePerformAction = (actionText) => {
    if (!actionText.trim()) return;

    const userText = actionText.trim();
    setInputText('');
    setActionCategory(null);
    setQuestionsCount(prev => prev + 1);

    const isParacetamol = userText.toLowerCase().includes('paratsetamol') || userText.toLowerCase().includes('paracetamol');
    const isEpi = userText.toLowerCase().includes('epinephrine') || userText.toLowerCase().includes('adrenaline') || userText.toLowerCase().includes('adrenalin');
    const isOxygen = userText.toLowerCase().includes('oxygen') || userText.toLowerCase().includes('kislorod');

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
        badge: '↓ Yanlış seçim'
      };
      systemReply = "Paracetamol 500 mg PO administered. Patient continues to report severe throat tightness and shortness of breath.\n\n\"My throat still feels tight, and it's hard to catch my breath,\" she rasps. Skin rash is worsening.";
      setPatientStatus('unstable');
      setPaperclipAlert(true);
      setMentorToast({
        visible: true,
        text: "This medication is not typically used for this presentation. What is the primary goal of treatment in this situation?"
      });
      setVitals(v => ({ ...v, hr: 132, bp: '84/50', spo2: 90 }));
    } else if (isEpi) {
      evaluation = {
        type: 'correct',
        badge: '↑ Toʻgʻri tanlov'
      };
      systemReply = "Epinephrine (Adrenaline) 0.5 mg administered IM into anterolateral thigh. Within 2 minutes, bronchospasm decreases, respiratory effort eases, and blood pressure begins to climb.";
      setPatientStatus('stable');
      setActiveStage('intervention');
      setPaperclipAlert(false);
      setMentorToast({
        visible: true,
        text: "Ajoyib qaror! Epinefrin anafilaktik shokda birinchi navbatdagi hayotni saqlovchi dori vositasidir."
      });
      setVitals(v => ({ ...v, hr: 110, bp: '105/68', spo2: 96, rr: 20 }));
    } else if (isOxygen) {
      evaluation = {
        type: 'correct',
        badge: '↑ Toʻgʻri tanlov'
      };
      systemReply = "High-flow O2 (15 L/min) administered via non-rebreather mask. SpO2 improves from 92% to 98%.";
      setVitals(v => ({ ...v, spo2: 98, rr: 22 }));
    } else {
      evaluation = {
        type: 'neutral',
        badge: 'Amaliyot bajarildi'
      };
      systemReply = `Tekshiruv/muolaja amalga oshirildi: ${userText}. Bemor monitor nazoratida ushlab turilibdi.`;
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
      minHeight: '100%',
      background: '#F8FAFC',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '12px 16px 90px 16px',
      boxSizing: 'border-box',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      position: 'relative',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 480,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        gap: 12,
      }}>

        {/* 1. TOP HEADER BAR: Back + Case Title & Subtitle + Hint Lightbulb */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 0',
        }}>
          {/* Back button */}
          <button
            id="btn-exit-simulation"
            onClick={onExitSimulation}
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '2px solid #E2E8F0',
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

          {/* Center Info: Title + Timer + Questions count */}
          <div style={{ textAlign: 'center', flex: 1, padding: '0 8px' }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: 800,
              color: '#0F172A',
              margin: '0 0 3px 0',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {caseItem?.title || 'Emergency Medicine Case #013'}
            </h2>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              fontSize: '12px',
              fontWeight: 600,
              color: '#64748B',
            }}>
              <span>⏱ {formatTimer(secondsElapsed)}</span>
              <span>❓ {questionsCount} questions</span>
            </div>
          </div>

          {/* Lightbulb Clinical Hint Button */}
          <button
            id="btn-clinical-hint"
            onClick={() => setHintModalOpen(true)}
            title="Clinical Hint"
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '2px solid #E2E8F0',
              boxShadow: '0 2px 0 #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#F59E0B',
            }}
          >
            <Lightbulb size={22} fill="#FDE047" color="#D97706" />
          </button>
        </div>

        {/* 2. PHASE TABS BAR: Clinical Decision, Intervention, Monitoring, Discharge */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 6,
          alignItems: 'center',
          padding: '4px 0',
        }}>
          {[
            { id: 'decision', label: 'Clinical Decision' },
            { id: 'intervention', label: 'Intervention' },
            { id: 'monitoring', label: 'Monitoring' },
            { id: 'discharge', label: 'Discharge' }
          ].map((phase, idx) => {
            const isActive = activeStage === phase.id;
            return (
              <div
                key={phase.id}
                onClick={() => {
                  if (phase.id === 'discharge') handleFinishSimulation();
                  else setActiveStage(phase.id);
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                {/* Top blue line */}
                <div style={{
                  height: 4,
                  borderRadius: 99,
                  background: isActive ? '#0284C7' : '#E2E8F0',
                  boxShadow: isActive ? '0 0 8px rgba(2, 132, 199, 0.4)' : 'none',
                }} />
                <span style={{
                  fontSize: '11px',
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? '#0284C7' : '#94A3B8',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {phase.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* 3. PATIENT STATUS BANNER: STABLE vs UNSTABLE with Vitals */}
        <div style={{
          background: patientStatus === 'stable' ? '#0284C7' : '#EA580C',
          borderRadius: 22,
          padding: '12px 16px',
          color: '#FFFFFF',
          boxShadow: patientStatus === 'stable'
            ? '0 6px 18px rgba(2, 132, 199, 0.25)'
            : '0 6px 18px rgba(234, 88, 12, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          transition: 'background 0.3s ease',
        }}>
          <div style={{
            fontSize: '13px',
            fontWeight: 900,
            letterSpacing: '0.8px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#FFFFFF',
              boxShadow: '0 0 6px #FFFFFF',
            }} />
            <span>PATIENT STATUS: {patientStatus.toUpperCase()}</span>
          </div>

          {/* 5 Vitals Badges */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 6,
          }}>
            <span style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '3px 8px', borderRadius: 8, fontSize: '11px', fontWeight: 700 }}>
              ❤️ {vitals.hr} bpm
            </span>
            <span style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '3px 8px', borderRadius: 8, fontSize: '11px', fontWeight: 700 }}>
              🌡️ {vitals.temp}°C
            </span>
            <span style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '3px 8px', borderRadius: 8, fontSize: '11px', fontWeight: 700 }}>
              🩺 {vitals.bp}
            </span>
            <span style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '3px 8px', borderRadius: 8, fontSize: '11px', fontWeight: 700 }}>
              🫁 {vitals.rr}/min
            </span>
            <span style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '3px 8px', borderRadius: 8, fontSize: '11px', fontWeight: 700 }}>
              🧬 {vitals.spo2}%
            </span>
          </div>
        </div>

        {/* 4. AI MENTOR TOAST: "HOCAN DİYOR Kİ" */}
        {mentorToast.visible && (
          <div style={{
            background: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)',
            border: '1.5px solid rgba(129, 140, 248, 0.3)',
            borderRadius: 22,
            padding: '14px 16px',
            color: '#FFFFFF',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            position: 'relative',
            animation: 'fadeIn 0.25s ease-out',
          }}>
            {/* Mentor Photo Avatar */}
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              overflow: 'hidden',
              flexShrink: 0,
              border: '2px solid #818CF8',
              boxShadow: '0 0 12px rgba(129, 140, 248, 0.4)',
            }}>
              <img
                src="/doctor_mentor.jpg"
                alt="Mentor"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '11px',
                fontWeight: 900,
                letterSpacing: '0.8px',
                color: '#818CF8',
                marginBottom: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#818CF8' }} />
                <span>HOCAN DİYOR Kİ</span>
              </div>
              <p style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#E2E8F0',
                margin: 0,
                lineHeight: 1.45,
              }}>
                {mentorToast.text}
              </p>
            </div>

            {/* Close toast button */}
            <button
              onClick={() => setMentorToast({ ...mentorToast, visible: false })}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: 2,
              }}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* 5. MAIN CHAT & CLINICAL ACTION AREA */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          minHeight: 260,
          maxHeight: '44vh',
          overflowY: 'auto',
          padding: '6px 2px',
        }}>
          {/* Start banner card: Doctor get ready! */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 24,
            border: '2px solid #E2E8F0',
            boxShadow: '0 4px 0 #E2E8F0',
            padding: '24px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}>
            <div style={{
              width: 58,
              height: 58,
              borderRadius: '50%',
              background: '#DCFCE7',
              border: '2.5px solid #86EFAC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#16A34A',
              boxShadow: '0 0 16px rgba(34, 197, 94, 0.3)',
            }}>
              <CheckCircle2 size={32} strokeWidth={2.5} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: 0 }}>
              Doctor, get ready!
            </h3>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#94A3B8', margin: 0 }}>
              Case is about to begin...
            </p>
          </div>

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
                    borderRadius: '20px 20px 4px 20px',
                    padding: '12px 18px',
                    fontSize: '14px',
                    fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                  }}>
                    {msg.text}
                  </div>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#FDE047',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}>
                    <img src="/student_avatar.jpg" alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                    <div style={{ width: 22, height: 22, borderRadius: '50%', overflow: 'hidden' }}>
                      <img src="/doctor_mentor.jpg" alt="Mentor" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span style={{
                      background: msg.evaluation.type === 'wrong' ? '#FEE2E2' : '#DCFCE7',
                      color: msg.evaluation.type === 'wrong' ? '#EF4444' : '#16A34A',
                      fontSize: '12px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 8,
                      border: msg.evaluation.type === 'wrong' ? '1px solid #FECACA' : '1px solid #86EFAC',
                    }}>
                      {msg.evaluation.badge}
                    </span>
                  </div>
                )}

                <div style={{
                  background: '#FFFFFF',
                  borderRadius: '4px 22px 22px 22px',
                  border: '2px solid #E2E8F0',
                  boxShadow: '0 3px 0 #E2E8F0',
                  padding: '16px 18px',
                  color: '#1E293B',
                  fontSize: '14px',
                  fontWeight: 600,
                  lineHeight: 1.5,
                  whiteSpace: 'pre-line',
                }}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={chatBottomRef} />
        </div>

        {/* 6. ACTION CATEGORY OPTIONS TRAY (When category pill is clicked) */}
        {actionCategory && (
          <div style={{
            background: '#FFFFFF',
            borderRadius: 22,
            border: '2px solid #E2E8F0',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            animation: 'fadeIn 0.2s ease-out',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 6,
              borderBottom: '1px solid #F1F5F9',
            }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase' }}>
                Select {actionCategory}
              </span>
              <button
                onClick={() => setActionCategory(null)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 180, overflowY: 'auto' }}>
              {(categoryOptions[actionCategory] || []).map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handlePerformAction(opt.label)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '8px 12px',
                    borderRadius: 12,
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#EFF6FF'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#F8FAFC'; }}
                >
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                    {opt.label}
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748B', marginTop: 1 }}>
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 7. FOUR CLAYMORPHIC ACTION PILLS: Examination, Tests, Consultation, Treatment */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8,
        }}>
          {/* Examination */}
          <button
            id="btn-action-exam"
            onClick={() => setActionCategory(actionCategory === 'exam' ? null : 'exam')}
            style={{
              padding: '12px 6px',
              borderRadius: 18,
              background: '#F5F3FF',
              border: actionCategory === 'exam' ? '2px solid #8B5CF6' : '1.5px solid #DDD6FE',
              boxShadow: actionCategory === 'exam' ? '0 4px 12px rgba(139, 92, 246, 0.3)' : '0 2px 0 #DDD6FE',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: '#8B5CF6',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Stethoscope size={18} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#6D28D9' }}>
              Examination
            </span>
          </button>

          {/* Tests */}
          <button
            id="btn-action-tests"
            onClick={() => setActionCategory(actionCategory === 'tests' ? null : 'tests')}
            style={{
              padding: '12px 6px',
              borderRadius: 18,
              background: '#F0F9FF',
              border: actionCategory === 'tests' ? '2px solid #0EA5E9' : '1.5px solid #BAE6FD',
              boxShadow: actionCategory === 'tests' ? '0 4px 12px rgba(14, 165, 233, 0.3)' : '0 2px 0 #BAE6FD',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: '#0EA5E9',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <FlaskConical size={18} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#0369A1' }}>
              Tests
            </span>
          </button>

          {/* Consultation */}
          <button
            id="btn-action-consultation"
            onClick={() => setActionCategory(actionCategory === 'consultation' ? null : 'consultation')}
            style={{
              padding: '12px 6px',
              borderRadius: 18,
              background: '#F0FDF4',
              border: actionCategory === 'consultation' ? '2px solid #10B981' : '1.5px solid #A7F3D0',
              boxShadow: actionCategory === 'consultation' ? '0 4px 12px rgba(16, 185, 129, 0.3)' : '0 2px 0 #A7F3D0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: '#10B981',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Users size={18} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#047857' }}>
              Consultation
            </span>
          </button>

          {/* Treatment */}
          <button
            id="btn-action-treatment"
            onClick={() => setActionCategory(actionCategory === 'treatment' ? null : 'treatment')}
            style={{
              padding: '12px 6px',
              borderRadius: 18,
              background: '#FFF7ED',
              border: actionCategory === 'treatment' ? '2px solid #F97316' : '1.5px solid #FED7AA',
              boxShadow: actionCategory === 'treatment' ? '0 4px 12px rgba(249, 115, 22, 0.3)' : '0 2px 0 #FED7AA',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: '#F97316',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <BriefcaseMedical size={18} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#C2410C' }}>
              Treatment
            </span>
          </button>
        </div>

        {/* 8. BOTTOM INPUT BAR: Text field + Send green circle */}
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
          }}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your response here..."
            style={{
              flex: 1,
              padding: '16px 20px',
              borderRadius: 99,
              background: '#FFFFFF',
              border: '2px solid #E2E8F0',
              boxShadow: '0 3px 0 #E2E8F0',
              fontSize: '14px',
              fontWeight: 600,
              color: '#0F172A',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />

          <button
            type="submit"
            id="btn-send-action"
            style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
              border: '2px solid #15803D',
              boxShadow: '0 4px 0 #15803D, 0 6px 16px rgba(34, 197, 94, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <ArrowRight size={22} strokeWidth={2.6} />
          </button>
        </form>

        {/* 9. LEFT FLOATING PAPERCLIP TAB (Medical Records / Attachments) */}
        <div style={{
          position: 'fixed',
          left: 0,
          top: '45%',
          transform: 'translateY(-50%)',
          zIndex: 80,
        }}>
          <button
            onClick={() => setRecordsDrawerOpen(true)}
            title="Attached Medical Records"
            style={{
              width: 48,
              height: 64,
              borderRadius: '0 20px 20px 0',
              background: paperclipAlert ? '#EF4444' : '#2563EB',
              border: 'none',
              boxShadow: paperclipAlert ? '0 0 18px rgba(239, 68, 68, 0.5)' : '0 0 18px rgba(37, 99, 235, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <Paperclip size={24} strokeWidth={2.4} />
          </button>
        </div>

      </div>

      {/* 10. CLINICAL HINT MODAL */}
      <ClinicalHintModal
        isOpen={hintModalOpen}
        onClose={() => setHintModalOpen(false)}
        hintText="Consider what immediate, life-saving interventions are critical in a rapidly deteriorating patient with suspected anaphylaxis. Epinephrine is the primary drug of choice."
      />

      {/* 11. MEDICAL RECORDS / ATTACHMENTS DRAWER */}
      {recordsDrawerOpen && (
        <div
          onClick={() => setRecordsDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(4px)',
            zIndex: 120,
            display: 'flex',
            justifyContent: 'flex-start',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 360,
              height: '100%',
              background: '#FFFFFF',
              padding: '24px 20px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              boxShadow: '10px 0 30px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Patient Attachments 📎
              </h3>
              <button
                onClick={() => setRecordsDrawerOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
              {/* Record 1 */}
              <div style={{ padding: 14, borderRadius: 16, background: '#F8FAFC', border: '1.5px solid #E2E8F0' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>12-Lead ECG</div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: 3 }}>Sinus tachycardia at 128 bpm. No acute ST-elevation or ischemic changes.</div>
              </div>

              {/* Record 2 */}
              <div style={{ padding: 14, borderRadius: 16, background: '#F8FAFC', border: '1.5px solid #E2E8F0' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>Known Allergies</div>
                <div style={{ fontSize: '12px', color: '#EF4444', fontWeight: 700, marginTop: 3 }}>Peanut / Tree Nuts (severe)</div>
              </div>

              {/* Record 3 */}
              <div style={{ padding: 14, borderRadius: 16, background: '#F8FAFC', border: '1.5px solid #E2E8F0' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>Laboratory Status</div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: 3 }}>Serum tryptase & CBC samples sent to stat laboratory.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 12. CASE COMPLETED DEBRIEFING SCREEN */}
      {isFinished && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.75)',
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
            background: '#FFFFFF',
            borderRadius: 32,
            border: '2px solid #E2E8F0',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
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
              <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', margin: '0 0 4px 0' }}>
                Case Successfully Completed!
              </h2>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#64748B', margin: 0 }}>
                {caseItem?.title || 'Emergency Medicine Case #013'}
              </p>
            </div>

            {/* Score & Rewards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 10,
              width: '100%',
            }}>
              <div style={{ padding: '12px 8px', borderRadius: 16, background: '#F8FAFC', border: '1.5px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B' }}>SCORE</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#16A34A' }}>{finalScore}%</div>
              </div>
              <div style={{ padding: '12px 8px', borderRadius: 16, background: '#F8FAFC', border: '1.5px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B' }}>EARNED XP</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#D97706' }}>+250</div>
              </div>
              <div style={{ padding: '12px 8px', borderRadius: 16, background: '#F8FAFC', border: '1.5px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B' }}>TIME</div>
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
              <strong>Clinical Pearls:</strong> Anafilaktik shok holatida har daqiqa g'animat. Epinefrin (Adrenalin) kechiktirilmasdan sonning old-yon qismiga mushak ichiga kiritilishi shart.
            </div>

            {/* Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%', marginTop: 8 }}>
              <button
                onClick={() => {
                  setIsFinished(false);
                  setMessages([messages[0]]);
                  setVitals({ hr: 129, temp: 36.8, bp: '88/54', rr: 26, spo2: 92 });
                }}
                style={{
                  padding: '14px',
                  borderRadius: 16,
                  background: '#F1F5F9',
                  border: '1.5px solid #CBD5E1',
                  color: '#475569',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <RotateCcw size={16} />
                <span>Qaytadan</span>
              </button>

              <button
                onClick={onExitSimulation}
                style={{
                  padding: '14px',
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                  border: '2px solid #15803D',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
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
