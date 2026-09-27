import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Award,
  CheckCircle2,
  Clock,
  FileText,
  Heart,
  HelpCircle,
  MessageSquare,
  Microscope,
  Pill,
  Radio,
  Send,
  ShieldAlert,
  Stethoscope,
  Volume2,
  VolumeX,
  XCircle,
  Zap
} from 'lucide-react';
import { playActionSuccess, playAlarmBeep, playHeartBeep } from '../audio';

export default function SimulationRoom({
  caseItem,
  onExitSimulation,
  onFinishSimulation,
}) {
  // Simulation vitals & state
  const [healthPercent, setHealthPercent] = useState(88);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [visualState, setVisualState] = useState('Pain'); // 'Idle' | 'Pain' | 'Unconscious' | 'Recovery' | 'Dead'
  const [skinColor, setSkinColor] = useState('pale'); // 'normal' | 'pale' | 'cyanotic' | 'flushed'

  // Dynamic Patient Vitals
  const [vitals, setVitals] = useState({
    hr: 112,
    bpSys: 155,
    bpDia: 95,
    spo2: 92,
    rr: 24,
    temp: 36.9,
    gcs: 15
  });

  // Action Tabs: 'anamnez' | 'exam' | 'diagnostics' | 'treatment' | 'diagnosis'
  const [activeTab, setActiveTab] = useState('anamnez');

  // Logs & Dialogues
  const [messages, setMessages] = useState([
    {
      sender: 'patient',
      text: "Doktor, ko'kragim qisilib, chap qo'limga qattiq og'riq beryapti... Nafas olishim qiyinlashyapti!",
      time: '00:01'
    }
  ]);
  const [customQuestion, setCustomQuestion] = useState('');
  const [actionLog, setActionLog] = useState([
    { text: "Bemor shoshilinch qabul bo'limiga yotqizildi", type: 'info', time: '00:00' }
  ]);

  // Audio monitor control
  const [soundActive, setSoundActive] = useState(true);

  // Canvas ECG reference
  const canvasRef = useRef(null);

  // Heartbeat sound & ECG animation effect
  useEffect(() => {
    let animId;
    let step = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Interval for cardiac pulse beeping
    const intervalMs = Math.max(400, Math.floor(60000 / vitals.hr));
    const soundTimer = setInterval(() => {
      if (soundActive) {
        if (vitals.hr > 130 || vitals.spo2 < 88) {
          playAlarmBeep();
        } else {
          playHeartBeep(880, 0.07);
        }
      }
    }, intervalMs);

    // ECG wave drawing loop
    const points = [];
    const width = canvas.width || 600;
    const height = canvas.height || 140;

    const render = () => {
      step++;
      ctx.fillStyle = 'rgba(6, 11, 20, 0.2)';
      ctx.fillRect(0, 0, width, height);

      // Grid background
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // ECG wave calculation
      const x = (step * 3) % width;
      const phase = (step % 40);
      let y = height / 2;

      if (phase === 10) y -= 10; // P wave
      else if (phase === 14) y += 8; // Q dip
      else if (phase === 16) y -= 55; // R peak
      else if (phase === 18) y += 20; // S dip
      else if (phase === 24) y -= 16; // T wave
      else y += (Math.random() - 0.5) * 2; // baseline flutter

      points.push({ x, y });
      if (points.length > width / 3) points.shift();

      // Draw ECG trace
      ctx.strokeStyle = vitals.spo2 < 88 ? '#ef4444' : '#22c55e';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = vitals.spo2 < 88 ? 'rgba(239, 68, 68, 0.8)' : 'rgba(34, 197, 94, 0.8)';
      ctx.shadowBlur = 8;
      ctx.beginPath();

      for (let i = 0; i < points.length; i++) {
        if (i === 0) ctx.moveTo(points[i].x, points[i].y);
        else {
          // Break line when wrap around
          if (points[i].x < points[i - 1].x) {
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
          } else {
            ctx.lineTo(points[i].x, points[i].y);
          }
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(soundTimer);
    };
  }, [vitals.hr, vitals.spo2, soundActive]);

  const handleFinish = (reason) => {
    onFinishSimulation({
      caseId: caseItem?.id,
      score: healthPercent >= 80 ? 94 : 70,
      xp: 60,
      coins: 2,
      health: healthPercent,
      reason
    });
  };

  // Countdown Timer Effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinish('time_expired');
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const addLog = (text, type = 'info') => {
    const elapsed = 300 - timeLeft;
    const timeStr = formatTime(elapsed);
    setActionLog(prev => [{ text, type, time: timeStr }, ...prev]);
  };

  // Anamnez Question Handler
  const handleAskQuestion = (questionText) => {
    if (!questionText.trim()) return;
    const elapsed = 300 - timeLeft;
    const timeStr = formatTime(elapsed);

    setMessages(prev => [...prev, { sender: 'doctor', text: questionText, time: timeStr }]);
    setCustomQuestion('');

    // Generate responsive clinical answer
    setTimeout(() => {
      let answer = "Ha doktor, taxminan 40 daqiqa avval to'satdan og'riq boshlandi...";
      const q = questionText.toLowerCase();

      if (q.includes('davomiylik') || q.includes('qachon') || q.includes('boshlandi')) {
        answer = "Taxminan 40-45 daqiqa bo'ldi. Avval bunaqa kuchli bo'lmagandi.";
      } else if (q.includes('dori') || q.includes('nitro') || q.includes('ichdingiz')) {
        answer = "Nitroglikerin tabletkasi ichdim til ostiga, lekin umuman ta'sir qilmadi, og'riq qolmadi.";
      } else if (q.includes('allergiya') || q.includes('allergik')) {
        answer = "Hech qanday dori vositalariga allergiyam yo'q.";
      } else if (q.includes('bosim') || q.includes('gipertoniya') || q.includes('bosimingiz')) {
        answer = "Ha, qon bosimim oshib turadi, odatda 140/90 bo'ladi.";
      } else if (q.includes('shakar') || q.includes('diabet')) {
        answer = "Yo'q, qandli diabetim yo'q deb aytishgan.";
      }

      setMessages(prev => [...prev, { sender: 'patient', text: answer, time: formatTime(300 - timeLeft) }]);
      addLog(`Bemorga savol berildi: "${questionText}"`, 'info');
    }, 450);
  };

  // Physical Examination Trigger
  const handlePerformExam = (examType) => {
    playActionSuccess();
    if (examType === 'heart') {
      addLog("Yurak auskultatsiyasi: Tonlar bo'g'iqlashgan, ritmik. Patologik shovqinlar eshitilmadi.", 'exam');
      setVitals(prev => ({ ...prev, bpSys: prev.bpSys - 2 }));
    } else if (examType === 'lungs') {
      addLog("O'pka auskultatsiyasi: Vezikulyar nafas, pastki bo'limlarda nam xirillashlar yo'q.", 'exam');
    } else if (examType === 'palpation') {
      addLog("Ko'krak qafasi palpatsiyasi: Paypaslaganda og'riq kuchaymaydi (Vertebrogen sabab inkor qilindi).", 'exam');
    } else if (examType === 'pupils') {
      addLog("Qorachiqlar ko'rigi: D=S, yorug'likka reaksiyasi saqlangan, simmetrik.", 'exam');
    }
  };

  // Laboratory / Instrumental Test Trigger
  const handlePerformDiagnostic = (testType) => {
    playActionSuccess();
    if (testType === 'ecg') {
      addLog("12 tarmoqli EKG tahlili: V1-V4 tarmoqlarda ST segmenti elevatsiyasi (2.5 mm). O'tkir old devor miokard infarkti belgilari!", 'warning');
      setHealthPercent(prev => Math.min(100, prev + 4));
    } else if (testType === 'troponin') {
      addLog("Troponin-I ekspress tahlili: Ijobiy (+) 3.8 ng/ml (Miokard nekrozi tasdiqlandi).", 'warning');
    } else if (testType === 'glucose') {
      addLog("Qon glyukozasi ekspress: 5.6 mmol/l (Me'yorda).", 'info');
    } else if (testType === 'xray') {
      addLog("Ko'krak qafasi rentgenogrammasi: O'pka to'qimalari shishsiz, pnevmotoraks yo'q.", 'info');
    }
  };

  // Treatment / Medication Trigger
  const handleAdministerTreatment = (treatmentType) => {
    playActionSuccess();
    if (treatmentType === 'oxygen') {
      addLog("Kislorod ingalyatsiyasi (burun kanyulasi orqali 4 l/min) boshlandi.", 'success');
      setVitals(prev => ({ ...prev, spo2: 98, rr: 18, hr: prev.hr - 6 }));
      setSkinColor('normal');
      setHealthPercent(prev => Math.min(100, prev + 10));
    } else if (treatmentType === 'aspirin') {
      addLog("Aspirin 300 mg (chaynab yutish uchun) berildi. Trombotsitlar agregatsiyasi bloklandi.", 'success');
      setHealthPercent(prev => Math.min(100, prev + 12));
    } else if (treatmentType === 'nitro') {
      if (vitals.bpSys < 100) {
        addLog("Diqqat! Gipotensiyada Nitroglikerin berish xavfli! Qon bosimi yanada pasaydi.", 'critical');
        setVitals(prev => ({ ...prev, bpSys: prev.bpSys - 20, hr: prev.hr + 10 }));
        setHealthPercent(prev => Math.max(10, prev - 15));
      } else {
        addLog("Nitroglikerin 0.5 mg til ostiga berildi. Koronar tomirlar kengaytirildi.", 'success');
        setVitals(prev => ({ ...prev, bpSys: 130, bpDia: 85, hr: prev.hr - 8 }));
        setVisualState('Recovery');
        setHealthPercent(prev => Math.min(100, prev + 8));
      }
    } else if (treatmentType === 'heparin') {
      addLog("Geparin 5000 XB v/i bolyus yuborildi. Antikoagulyant terapiya boshlandi.", 'success');
      setHealthPercent(prev => Math.min(100, prev + 10));
    } else if (treatmentType === 'morphine') {
      addLog("Morfin 2-4 mg v/i sekin yuborildi. Kuchli og'riq sindromi bartaraf etildi.", 'success');
      setVisualState('Recovery');
      setVitals(prev => ({ ...prev, hr: 82, rr: 16 }));
      setHealthPercent(prev => Math.min(100, prev + 10));
    }
  };

  // Submit Final Diagnosis
  const handleConfirmDiagnosis = (diagnosisName) => {
    addLog(`Yakuniy klinik tashxis qo'yildi: ${diagnosisName}`, 'success');
    handleFinish('completed');
  };

  const diffColor = vitals.hr > 120 || vitals.hr < 50 ? '#ef4444' : '#22c55e';
  const spo2Color = vitals.spo2 < 90 ? '#ef4444' : vitals.spo2 < 95 ? '#f59e0b' : '#06b6d4';

  return (
    <div style={{ maxWidth: 1380, margin: '0 auto', padding: '20px 20px 80px' }}>
      {/* Top Session Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 20,
        padding: '12px 18px',
        borderRadius: 14,
        background: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid rgba(56, 189, 248, 0.2)',
      }}>
        {/* Back button & Case title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={onExitSimulation}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            <ArrowLeft size={16} />
            <span>Chiqish</span>
          </button>

          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase' }}>
              Simulyatsiya Xonasi • {caseItem?.category_name || "Kardiologiya"}
            </div>
            <h2 style={{ fontSize: '1.15rem', color: '#fff' }}>
              {caseItem?.title || "Shoshilinch Koronar Sindrom"}
            </h2>
          </div>
        </div>

        {/* Timer & Health Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {/* Health Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Bemor Salomatligi:
            </span>
            <div style={{
              width: 140,
              height: 12,
              borderRadius: 99,
              background: 'rgba(255, 255, 255, 0.08)',
              overflow: 'hidden',
              position: 'relative',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <div style={{
                width: `${healthPercent}%`,
                height: '100%',
                background: healthPercent > 70 ? 'linear-gradient(90deg, #10b981, #06b6d4)' : healthPercent > 40 ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : '#ef4444',
                transition: 'width 0.4s ease',
              }} />
            </div>
            <span style={{
              fontWeight: 800,
              fontSize: '0.9rem',
              color: healthPercent > 70 ? '#34d399' : healthPercent > 40 ? '#fbbf24' : '#f87171'
            }}>
              {healthPercent}%
            </span>
          </div>

          {/* Time Remaining */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            borderRadius: 10,
            background: timeLeft < 60 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(6, 182, 212, 0.12)',
            border: timeLeft < 60 ? '1px solid #ef4444' : '1px solid rgba(6, 182, 212, 0.3)',
            color: timeLeft < 60 ? '#f87171' : 'var(--accent-cyan)',
            fontWeight: 800,
            fontSize: '1rem',
          }}>
            <Clock size={16} />
            <span>{formatTime(timeLeft)}</span>
          </div>

          {/* Finish Button */}
          <button
            onClick={() => handleFinish('doctor_decision')}
            className="btn-primary"
            style={{
              padding: '8px 16px',
              fontSize: '0.88rem',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
            }}
          >
            <CheckCircle2 size={16} />
            <span>Yakunlash & Debriefing</span>
          </button>
        </div>
      </div>

      {/* Main Simulation Viewport (Monitor + Actions) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: 20,
      }}>
        {/* Left Column: Realistic Cardiac Monitor & Patient Visualizer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Cardiac Defibrillator / ICU Monitor Frame */}
          <div className="glass-panel" style={{
            background: '#050a12',
            border: '2px solid #1e293b',
            borderRadius: 18,
            padding: 20,
            boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.8), 0 10px 30px rgba(0, 0, 0, 0.5)',
            position: 'relative',
          }}>
            {/* Monitor Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: 10,
              marginBottom: 14,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#22c55e',
                  boxShadow: '0 0 8px #22c55e',
                }} />
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  letterSpacing: '0.08em',
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                }}>
                  MONITOR II • LEADS: ACTIVE • 25 mm/s
                </span>
              </div>

              {/* Sound Toggle */}
              <button
                onClick={() => setSoundActive(!soundActive)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.78rem',
                  color: soundActive ? '#22c55e' : '#64748b',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {soundActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
                <span>{soundActive ? 'BEEP ON' : 'MUTED'}</span>
              </button>
            </div>

            {/* Canvas ECG Wave */}
            <div style={{
              height: 140,
              borderRadius: 10,
              overflow: 'hidden',
              background: '#040810',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              marginBottom: 16,
              position: 'relative',
            }}>
              <canvas
                ref={canvasRef}
                width={680}
                height={140}
                style={{ width: '100%', height: '100%', display: 'block' }}
              />
              <div style={{
                position: 'absolute',
                top: 8,
                left: 10,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: '#22c55e',
                fontWeight: 700,
              }}>
                EKG (Lead II)
              </div>
            </div>

            {/* Vitals Numeric Grid (TZ 5.2) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 12,
            }}>
              {/* HR */}
              <div style={{
                background: 'rgba(34, 197, 94, 0.06)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                borderRadius: 12,
                padding: '12px 14px',
              }}>
                <div style={{ fontSize: '0.75rem', color: '#22c55e', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  HR (Puls)
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  fontFamily: 'var(--font-mono)',
                  color: diffColor,
                  lineHeight: 1.1,
                }}>
                  {vitals.hr}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>bpm (60-90)</div>
              </div>

              {/* BP */}
              <div style={{
                background: 'rgba(244, 63, 94, 0.06)',
                border: '1px solid rgba(244, 63, 94, 0.2)',
                borderRadius: 12,
                padding: '12px 14px',
              }}>
                <div style={{ fontSize: '0.75rem', color: '#f43f5e', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  BP (Bosim)
                </div>
                <div style={{
                  fontSize: '1.6rem',
                  fontWeight: 900,
                  fontFamily: 'var(--font-mono)',
                  color: '#f43f5e',
                  lineHeight: 1.2,
                }}>
                  {vitals.bpSys}/{vitals.bpDia}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>mmHg (120/80)</div>
              </div>

              {/* SpO2 */}
              <div style={{
                background: 'rgba(6, 182, 212, 0.06)',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                borderRadius: 12,
                padding: '12px 14px',
              }}>
                <div style={{ fontSize: '0.75rem', color: '#06b6d4', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  SpO2 (%)
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 900,
                  fontFamily: 'var(--font-mono)',
                  color: spo2Color,
                  lineHeight: 1.1,
                }}>
                  {vitals.spo2}%
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Saturatsiya (95-100)</div>
              </div>

              {/* RR & Temp & GCS */}
              <div style={{
                background: 'rgba(245, 158, 11, 0.06)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: 12,
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 600 }}>RR:</span>
                  <span style={{ fontSize: '0.85rem', color: '#fff', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{vitals.rr}/min</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 600 }}>T:</span>
                  <span style={{ fontSize: '0.85rem', color: '#fff', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{vitals.temp}°C</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 600 }}>GCS:</span>
                  <span style={{ fontSize: '0.85rem', color: '#fff', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{vitals.gcs}/15</span>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Visual Status & Demographic Card (TZ 5.3) */}
          <div className="glass-panel" style={{
            padding: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
          }}>
            {/* Visual Avatar State */}
            <div style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: visualState === 'Pain'
                ? 'rgba(239, 68, 68, 0.2)'
                : visualState === 'Recovery'
                ? 'rgba(16, 185, 129, 0.2)'
                : 'rgba(6, 182, 212, 0.15)',
              border: `2px solid ${visualState === 'Pain' ? '#ef4444' : visualState === 'Recovery' ? '#10b981' : '#06b6d4'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
            }}>
              {visualState === 'Pain' ? '😣' : visualState === 'Recovery' ? '😌' : visualState === 'Unconscious' ? '😵' : '😐'}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>
                  Bemor: {caseItem?.patient_gender === 'female' ? 'Ayol' : 'Erkak'}, {caseItem?.patient_age || 45} yosh
                </span>
                <span className={`badge ${visualState === 'Pain' ? 'badge-rose' : 'badge-emerald'}`}>
                  {visualState === 'Pain' ? 'Kuchli Og\'riq' : 'Barqaror'}
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 6 }}>
                Teri holati: <strong style={{ color: '#fff' }}>{skinColor === 'pale' ? "Oqargan, sovuq ter bosgan" : "Normal rangda"}</strong>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Boshlang'ich shikoyat: {caseItem?.subtitle || "Ko'krak sohasidagi bosuvchi og'riq"}
              </div>
            </div>
          </div>

          {/* Action Log Feed */}
          <div className="glass-panel" style={{
            padding: 16,
            flex: 1,
            maxHeight: 180,
            overflowY: 'auto',
          }}>
            <div style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: 10,
              letterSpacing: '0.04em',
            }}>
              Klinik Harakatlar Tarixi:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {actionLog.map((log, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                    fontSize: '0.8rem',
                    color: log.type === 'critical' ? '#f87171' : log.type === 'success' ? '#34d399' : log.type === 'warning' ? '#fbbf24' : 'var(--text-secondary)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    [{log.time}]
                  </span>
                  <span>{log.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Clinical Action Deck */}
        <div className="glass-panel" style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Action Tabs Navigation */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(10, 16, 30, 0.6)',
          }}>
            {[
              { id: 'anamnez', label: '1. Muloqot', icon: MessageSquare },
              { id: 'exam', label: "2. Ko'rik", icon: Stethoscope },
              { id: 'diagnostics', label: '3. Tahlillar', icon: Microscope },
              { id: 'treatment', label: '4. Muolaja', icon: Pill },
              { id: 'diagnosis', label: '5. Tashxis', icon: Award },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    padding: '12px 6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: isActive ? '#38bdf8' : 'var(--text-secondary)',
                    background: isActive ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                    borderBottom: isActive ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                  }}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Action Tab Content Area */}
          <div style={{ padding: 20, flex: 1, overflowY: 'auto' }}>
            {/* TAB 1: ANAMNEZ / CHAT */}
            {activeTab === 'anamnez' && (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  marginBottom: 12,
                }}>
                  Bemor bilan muloqot qiling va shikoyatlarini aniqlashtiring:
                </div>

                {/* Chat message bubbles */}
                <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  marginBottom: 16,
                  maxHeight: 280,
                  overflowY: 'auto',
                }}>
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      style={{
                        alignSelf: m.sender === 'doctor' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        padding: '10px 14px',
                        borderRadius: 14,
                        fontSize: '0.88rem',
                        background: m.sender === 'doctor' ? 'linear-gradient(135deg, #0284c7, #0369a1)' : 'rgba(255, 255, 255, 0.08)',
                        color: '#fff',
                        border: m.sender === 'doctor' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div style={{ fontSize: '0.7rem', color: m.sender === 'doctor' ? '#bae6fd' : '#94a3b8', marginBottom: 2 }}>
                        {m.sender === 'doctor' ? 'Siz (Shifokor)' : 'Bemor'} • {m.time}
                      </div>
                      <div>{m.text}</div>
                    </div>
                  ))}
                </div>

                {/* Preset Clinical Questions */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                  marginBottom: 14,
                }}>
                  {[
                    "Og'riq qachon va qanday boshlandi?",
                    "Nitroglikerin yoki boshqa dori qabul qildingizmi?",
                    "Dori vositalariga allergiyangiz bormi?",
                    "Qon bosimingiz odatda nechchi bo'ladi?",
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAskQuestion(preset)}
                      style={{
                        fontSize: '0.78rem',
                        padding: '6px 12px',
                        borderRadius: 99,
                        background: 'rgba(6, 182, 212, 0.1)',
                        border: '1px solid rgba(6, 182, 212, 0.25)',
                        color: 'var(--accent-cyan)',
                        textAlign: 'left',
                      }}
                    >
                      + {preset}
                    </button>
                  ))}
                </div>

                {/* Custom Question input */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    placeholder="Bemorga boshqa savolingiz bormi..."
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion(customQuestion)}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: 'rgba(10, 16, 30, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      fontSize: '0.88rem',
                    }}
                  />
                  <button
                    onClick={() => handleAskQuestion(customQuestion)}
                    className="btn-primary"
                    style={{ padding: '0 16px' }}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: PHYSICAL EXAMINATION */}
            {activeTab === 'exam' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Bemor ustida fizik ko'rik muolajalarini bajaring:
                </div>

                {[
                  { id: 'heart', title: 'Yurak Auskultatsiyasi', desc: "Yurak tonlari, ritm va shovqinlarni tinglash (Fonendoskop)", icon: Heart },
                  { id: 'lungs', title: "O'pka Auskultatsiyasi", desc: "Nafas xarakteri va nam xirillashlar bor-yo'qligini tekshirish", icon: Activity },
                  { id: 'palpation', title: "Ko'krak Qafasi Palpatsiyasi", desc: "Qovurg'alararo sohani paypaslash va mahalliy og'riqni aniqlash", icon: Stethoscope },
                  { id: 'pupils', title: 'Qorachiqlar va Nevrologik Holat', desc: "Yorug'likka reaksiya, GCS shkalasi bo'yicha baholash", icon: HelpCircle },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      style={{
                        padding: '14px 16px',
                        borderRadius: 12,
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 38,
                          height: 38,
                          borderRadius: 8,
                          background: 'rgba(6, 182, 212, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--accent-cyan)',
                        }}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{item.title}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePerformExam(item.id)}
                        className="btn-secondary"
                        style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                      >
                        Tekshirish
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 3: DIAGNOSTICS & LABS */}
            {activeTab === 'diagnostics' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Zarur instrumental va laboratoriya testlariga buyurtma bering:
                </div>

                {[
                  { id: 'ecg', title: '12 Tarmoqli EKG Yozib Olish', desc: 'ST segmenti, T tishi va patologik Q tishlarini baholash', priority: 'Zudlik bilan' },
                  { id: 'troponin', title: 'Troponin-I Ekspress Test', desc: 'Miokard nekrozi miqdoriy ko\'rsatkichi', priority: 'Yuqori' },
                  { id: 'glucose', title: 'Ekspress Qon Glyukozasi', desc: 'Gipoglikemiya yoki diabetik holatni inkor qilish', priority: 'Standart' },
                  { id: 'xray', title: "Ko'krak Qafasi Rentgenografiyasi", desc: 'Aorta anevrizmasi yoki pnevmotoraksni tekshirish', priority: 'Ikkilamchi' },
                ].map(item => (
                  <div
                    key={item.id}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 12,
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{item.title}</span>
                        <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>{item.priority}</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                    </div>

                    <button
                      onClick={() => handlePerformDiagnostic(item.id)}
                      className="btn-secondary"
                      style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                    >
                      Buyurtma berish
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: TREATMENT & MEDS */}
            {activeTab === 'treatment' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Protokol bo'yicha shoshilinch dori vositalarini buyuring:
                </div>

                {[
                  { id: 'oxygen', title: 'Kislorod Terapiyasi (O2)', desc: '2-4 l/min burun kanyulasi orqali (Gipoksiyada)', type: 'Shoshilinch' },
                  { id: 'aspirin', title: 'Aspirin 300 mg (PO)', desc: 'Chaynab yutish uchun (Trombotsitlar agregatsiyasiga qarshi)', type: 'Protokol' },
                  { id: 'nitro', title: 'Nitroglikerin 0.5 mg (SL)', desc: 'Til ostiga (Qon bosimi > 100 bo\'lsa)', type: 'Vazodilatator' },
                  { id: 'heparin', title: 'Geparin 5000 XB (V/I)', desc: 'Antikoagulyant bolyus inyeksiyasi', type: 'Antikoagulyant' },
                  { id: 'morphine', title: 'Morfin 2-4 mg (V/I)', desc: 'Qattiq bardosh berib bo\'lmas og\'riqni to\'xtatish', type: 'Analgetik' },
                ].map(item => (
                  <div
                    key={item.id}
                    style={{
                      padding: '14px 16px',
                      borderRadius: 12,
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{item.title}</span>
                        <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>{item.type}</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                    </div>

                    <button
                      onClick={() => handleAdministerTreatment(item.id)}
                      className="btn-primary"
                      style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                    >
                      Yuborish
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: FINAL DIAGNOSIS */}
            {activeTab === 'diagnosis' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  Tekshiruv va ko'rik natijalari asosida yakuniy klinik tashxisni tanlang:
                </div>

                {[
                  {
                    id: 'stemi',
                    name: "O'tkir Koronar Sindrom: ST ko'tarilishi bilan Miokard Infarkti (STEMI)",
                    correct: true,
                    plan: "Zudlik bilan rentgenovaskulyar operatsion xonaga (ChKB / Stentlash) yuborish."
                  },
                  {
                    id: 'nstemi',
                    name: "Nostabil Stenokardiya / ST ko'tarilmagan infarkt",
                    correct: false,
                    plan: "Terapevtik monitoring."
                  },
                  {
                    id: 'pericarditis',
                    name: "O'tkir Perikardit",
                    correct: false,
                    plan: "Yallig'lanishga qarshi terapiya."
                  },
                  {
                    id: 'gerd',
                    name: "Gastroezofageal Reflyuks Kasalligi (GERD)",
                    correct: false,
                    plan: "Antatsidlar buyurish."
                  }
                ].map(diag => (
                  <div
                    key={diag.id}
                    className="glass-panel"
                    style={{
                      padding: 16,
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#fff' }}>
                      {diag.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Taktika: {diag.plan}
                    </div>
                    <button
                      onClick={() => handleConfirmDiagnosis(diag.name)}
                      className="btn-primary"
                      style={{ alignSelf: 'flex-start', marginTop: 4, padding: '8px 16px', fontSize: '0.85rem' }}
                    >
                      Tashxisni Tasdiqlash
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
