import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  Lightbulb,
  ArrowRight,
  Award,
  Flag,
  Mic,
  Square,
  Volume2,
  VolumeX,
  Clock,
  MessageSquare,
} from 'lucide-react';
import PatientAvatar from '../components/features/PatientAvatar';
import ClinicalHintModal from '../components/modals/ClinicalHintModal';
import { useTranslation } from '../i18n.jsx';
import { api, isSessionNotActiveError } from '../api';
import { onPlaybackChange, playBase64Audio, speakText, startMicRecorder, stopPlayback } from '../utils/audioRecord';

const PATIENT_VOICE_KEY = 'tibcase_patient_voice';

function isRealSessionId(sessionId) {
  return Boolean(sessionId);
}

function healthToStatus(percent) {
  if (percent <= 0) return 'critical';
  if (percent < 40) return 'critical';
  if (percent < 70) return 'unstable';
  return 'improving';
}

function mergeVitals(prev, raw) {
  if (!raw || typeof raw !== 'object') return prev;
  const hr = raw.hr ?? raw.heart_rate;
  const spo2 = raw.spo2;
  const rr = raw.rr;
  const temp = raw.temp ?? raw.temperature;
  const bp = raw.bp
    || ((raw.bp_sys != null && raw.bp_dia != null) ? `${raw.bp_sys}/${raw.bp_dia}` : undefined);
  return {
    ...prev,
    ...(hr != null ? { hr } : {}),
    ...(spo2 != null ? { spo2 } : {}),
    ...(rr != null ? { rr } : {}),
    ...(temp != null ? { temp } : {}),
    ...(bp != null ? { bp } : {}),
  };
}

function defaultVitalsFromCase(caseItem) {
  const initial = caseItem?.initial_vitals;
  return mergeVitals(
    {},
    initial,
  );
}

export default function CaseSimulationRoom({
  caseItem,
  onExitSimulation,
  onFinishCase
}) {
  const { t } = useTranslation();
  const sessionId = caseItem?.sessionId;

  const [patientStatus, setPatientStatus] = useState(
    healthToStatus(caseItem?.health_percent ?? 0)
  );
  const [healthPercent, setHealthPercent] = useState(caseItem?.health_percent ?? 0);
  const [speaking, setSpeaking] = useState(false);
  const [patientVoiceOn, setPatientVoiceOn] = useState(() => {
    try { return localStorage.getItem(PATIENT_VOICE_KEY) !== 'off'; } catch { return true; }
  });
  const [vitals, setVitals] = useState(() => defaultVitalsFromCase(caseItem));
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [questionsCount, setQuestionsCount] = useState(0);
  const [hintModalOpen, setHintModalOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [eventType, setEventType] = useState('question');
  const [sending, setSending] = useState(false);
  const [recording, setRecording] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [errorBanner, setErrorBanner] = useState('');
  const [messages, setMessages] = useState(() => (
    caseItem?.chief_complaint
      ? [{ id: 'init-1', sender: 'patient', text: caseItem.chief_complaint, time: '00:00' }]
      : []
  ));

  const [isFinished, setIsFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);
  const [earnedCoins, setEarnedCoins] = useState(0);

  const chatBottomRef = useRef(null);
  const recorderRef = useRef(null);
  const secondsRef = useRef(0);
  const voiceEnabledRef = useRef(true);
  const sessionEndedRef = useRef(false);
  const sendingRef = useRef(false);

  useEffect(() => {
    secondsRef.current = secondsElapsed;
  }, [secondsElapsed]);

  // Patient speaks only if backend voice setting AND the user's own toggle are on
  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled && patientVoiceOn;
  }, [voiceEnabled, patientVoiceOn]);

  // Lock page scroll while the room is open (only the chat scrolls)
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    const unsubscribe = onPlaybackChange(setSpeaking);
    return () => {
      unsubscribe();
      stopPlayback();
    };
  }, []);

  const togglePatientVoice = () => {
    const next = !patientVoiceOn;
    setPatientVoiceOn(next);
    try { localStorage.setItem(PATIENT_VOICE_KEY, next ? 'on' : 'off'); } catch { /* ignore */ }
    if (!next) {
      stopPlayback();
      return;
    }
    // Turning voice on: read the patient's complaint (or latest patient line) aloud;
    // later replies keep being voiced because voiceEnabledRef follows this toggle.
    const lastPatient = [...messages].reverse().find((m) => m.sender !== 'user' && m.text);
    if (lastPatient?.audioBase64) playBase64Audio(lastPatient.audioBase64, lastPatient.audioMime || 'audio/wav');
    else if (lastPatient?.text) speakText(lastPatient.text);
  };

  useEffect(() => {
    sessionEndedRef.current = sessionEnded;
  }, [sessionEnded]);

  useEffect(() => {
    if (typeof caseItem?.health_percent === 'number') {
      setHealthPercent(caseItem.health_percent);
      setPatientStatus(healthToStatus(caseItem.health_percent));
    }
    if (caseItem?.initial_vitals) {
      setVitals((prev) => mergeVitals(prev, caseItem.initial_vitals));
    }
  }, [caseItem?.health_percent, caseItem?.initial_vitals]);

  useEffect(() => {
    api.getVoiceSetting()
      .then((res) => setVoiceEnabled(res?.enabled !== false))
      .catch(() => setVoiceEnabled(true));
  }, []);

  // Real-time vitals / health over WebSocket (same as user-panel.html)
  const wsUrlPath = caseItem?.ws_url;
  useEffect(() => {
    if (!isRealSessionId(sessionId) || sessionEnded) return undefined;
    let ws;
    try {
      ws = new WebSocket(api.getSimulationWsUrl(sessionId, wsUrlPath));
      ws.onmessage = (ev) => {
        let data;
        try { data = JSON.parse(ev.data); } catch { return; }
        if (typeof data.health_percent === 'number') {
          setHealthPercent(data.health_percent);
          setPatientStatus(healthToStatus(data.health_percent));
        }
        if (data.vitals) setVitals((prev) => mergeVitals(prev, data.vitals));
      };
    } catch { /* live vitals are optional */ }
    return () => { try { ws?.close(); } catch { /* noop */ } };
  }, [sessionId, sessionEnded, wsUrlPath]);

  // Wall-clock timer: immune to throttled background tabs and re-renders
  const [startedAt] = useState(() => caseItem?.startedAt || Date.now());
  const timeLimit = Number(caseItem?.time_limit_seconds) || 0;
  useEffect(() => {
    if (sessionEnded) return undefined;
    const tick = () => setSecondsElapsed(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)));
    const timer = setInterval(tick, 1000);
    document.addEventListener('visibilitychange', tick);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [sessionEnded, startedAt]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTimer = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const playReplyAudio = useCallback((audioBase64, audioMime, fallbackText) => {
    if (!voiceEnabledRef.current) return;
    if (audioBase64) {
      playBase64Audio(audioBase64, audioMime || 'audio/wav');
      return;
    }
    if (fallbackText) speakText(fallbackText);
  }, []);

  const handleReplay = (msg) => {
    if (!msg?.audioBase64) return;
    playBase64Audio(msg.audioBase64, msg.audioMime || 'audio/wav');
  };

  const completeSession = useCallback((finishResult, extra = {}) => {
    if (sessionEndedRef.current && !extra.force) return;
    sessionEndedRef.current = true;
    setSessionEnded(true);
    setIsFinished(true);
    setRecording(false);

    const score = finishResult?.final_score ?? extra.score ?? 0;
    const xp = finishResult?.xp_earned ?? extra.xp ?? 0;
    const coins = finishResult?.coins_earned ?? extra.coins ?? 0;
    setFinalScore(score);
    setEarnedXp(xp);
    setEarnedCoins(coins);

    if (onFinishCase) {
      onFinishCase({
        reason: extra.reason || 'manual',
        skipFinishApi: Boolean(extra.skipFinishApi),
        sessionEnded: Boolean(extra.sessionEnded),
        finish_result: finishResult || null,
        score,
        xp,
        coins,
        time: formatTimer(secondsRef.current),
      });
    }
  }, [onFinishCase]);

  // Time limit from backend: auto-finish with reason "timeout"
  useEffect(() => {
    if (timeLimit > 0 && secondsElapsed >= timeLimit && !sessionEndedRef.current) {
      completeSession(null, { reason: 'timeout' });
    }
  }, [secondsElapsed, timeLimit, completeSession]);

  const applyEventResult = useCallback((data, { userMsgId, userAudio } = {}) => {
    const response = data?.response || {};
    const transcript = response.transcript;
    const errorText = response.transcribe_error || response.patient_reply_error || response.feedback_error;
    const replyText = response.patient_reply || response.feedback || errorText || '';
    const replyAudio = response.reply_audio_base64;
    const replyMime = response.reply_audio_mime || 'audio/wav';

    if (typeof data.health_percent === 'number') {
      setHealthPercent(data.health_percent);
      setPatientStatus(healthToStatus(data.health_percent));
    }
    setVitals((prev) => mergeVitals(prev, response.vitals || data.vitals));

    if (userMsgId && (transcript || userAudio)) {
      setMessages((prev) => prev.map((msg) => {
        if (msg.id !== userMsgId) return msg;
        return {
          ...msg,
          text: transcript
            ? `${t('sim.youSaid', 'Siz aytdingiz')}: ${transcript}`
            : msg.text,
          audioBase64: userAudio?.audio_base64 || msg.audioBase64,
          audioMime: userAudio?.audio_mime || msg.audioMime,
        };
      }));
    }

    if (!replyText && !replyAudio) {
      console.warn('[simulation] empty event response', data);
    }
    if (replyText || replyAudio || data?.is_correct !== undefined) {
      const evaluation = data.is_correct === true
        ? { type: 'correct', badge: t('sim.correctBadge', 'To‘g‘ri qaror') }
        : data.is_correct === false
          ? { type: 'wrong', badge: t('sim.wrongBadge', 'Noto‘g‘ri ko‘rsatma') }
          : null;

      setMessages((prev) => [...prev, {
        id: `sys-${Date.now()}`,
        sender: 'system',
        text: replyText || (data.is_correct ? t('sim.accepted', 'Qabul qilindi') : t('sim.noReply', "Javob kelmadi, boshqacha ifodalab ko'ring")),
        evaluation,
        audioBase64: replyAudio || '',
        audioMime: replyMime,
        time: formatTimer(secondsRef.current),
      }]);

      if (!errorText || replyAudio) {
        playReplyAudio(replyAudio, replyMime, errorText ? '' : replyText);
      }
    }

    if (data.session_ended) {
      completeSession(data.finish_result, { skipFinishApi: true, sessionEnded: true });
    }
  }, [completeSession, playReplyAudio, t]);

  const sendEvent = useCallback(async ({ text, audio, type = 'question' }) => {
    if (sessionEndedRef.current || sendingRef.current) return;
    if (!isRealSessionId(sessionId)) {
      setErrorBanner(t('sim.noSession', 'Sessiya topilmadi. Simulyatsiyani qaytadan boshlang.'));
      return;
    }

    setErrorBanner('');
    sendingRef.current = true;
    setSending(true);
    setQuestionsCount((prev) => prev + 1);

    const userMsgId = `usr-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      text: text || t('sim.voiceMessage', 'Ovozli xabar'),
      audioBase64: audio?.audio_base64 || '',
      audioMime: audio?.audio_mime || '',
      time: formatTimer(secondsRef.current),
    };
    setMessages((prev) => [...prev, userMsg]);

    const payload = audio?.audio_base64
      ? { audio_base64: audio.audio_base64, audio_mime: audio.audio_mime || 'audio/webm' }
      : { text };

    try {
      const data = await api.sendSimulationEvent(sessionId, payload, type);
      applyEventResult(data, { userMsgId, userAudio: audio });
    } catch (err) {
      if (isSessionNotActiveError(err)) {
        setErrorBanner(t('sim.alreadyEnded', 'Sessiya allaqachon yakunlangan'));
        completeSession(null, { skipFinishApi: true, sessionEnded: true });
      } else {
        const message = err?.code === 'session_not_found'
          ? t('sim.sessionNotFound', 'Sessiya topilmadi')
          : (err.message || t('sim.sendError', 'Xabar yuborilmadi'));
        setErrorBanner(message);
        setMessages((prev) => [...prev, {
          id: `err-${Date.now()}`,
          sender: 'system',
          text: message,
          time: formatTimer(secondsRef.current),
        }]);
      }
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  }, [applyEventResult, completeSession, sessionId, t]);

  const handlePerformAction = (actionText, type = 'question') => {
    if (!actionText || !actionText.trim() || sessionEnded || sending) return;
    setInputText('');
    sendEvent({ text: actionText.trim(), type });
  };

  const toggleRecording = async () => {
    if (sessionEnded || sending) return;

    if (recording && recorderRef.current) {
      setRecording(false);
      try {
        const audio = await recorderRef.current.stop();
        recorderRef.current = null;
        if (audio?.audio_base64) {
          await sendEvent({ audio, type: 'question' });
        }
      } catch (err) {
        setErrorBanner(err.message || t('sim.micError', 'Mikrofon xatosi'));
      }
      return;
    }

    try {
      recorderRef.current = await startMicRecorder();
      setRecording(true);
      setErrorBanner('');
    } catch (err) {
      const denied = err?.name === 'NotAllowedError' || /permission|denied/i.test(err?.message || '');
      setErrorBanner(denied
        ? t('sim.micDenied', 'Mikrofon ruxsati berilmadi')
        : (err.message || t('sim.micError', 'Mikrofon xatosi')));
    }
  };

  const handleFinishSimulation = () => {
    if (sessionEndedRef.current) {
      completeSession(null, { skipFinishApi: true, sessionEnded: true, force: true });
      return;
    }
    completeSession(null, { skipFinishApi: false, sessionEnded: false, force: true });
  };

  const inputsLocked = sessionEnded || sending;
  const inputBlocked = inputsLocked || recording;

  const iconButton = (extra = {}) => ({
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: '1px solid #E2E8F0',
    background: '#FFFFFF',
    color: '#0F172A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    padding: 0,
    ...extra,
  });

  const replayButton = (msg, dark = false) => (
    <button
      type="button"
      onClick={() => handleReplay(msg)}
      aria-label={t('sim.replay', 'Qayta eshitish')}
      title={t('sim.replay', 'Qayta eshitish')}
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        border: 'none',
        background: dark ? 'rgba(255,255,255,0.22)' : '#F1F5F9',
        color: dark ? '#FFFFFF' : '#334155',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        padding: 0,
      }}
    >
      <Volume2 size={15} />
    </button>
  );

  return (
    <div className="sim-root">
      <div className="sim-col">

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            id="btn-exit-simulation"
            onClick={onExitSimulation}
            aria-label={t('common.back', 'Orqaga')}
            style={iconButton()}
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{
              fontSize: 15, fontWeight: 700, color: '#0F172A', margin: 0,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {caseItem?.title || t('sim.headerCase')}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, fontWeight: 700, color: '#64748B', marginTop: 2 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Clock size={12} /> {formatTimer(timeLimit > 0 ? Math.max(0, timeLimit - secondsElapsed) : secondsElapsed)}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <MessageSquare size={12} /> {questionsCount}
              </span>
            </div>
          </div>

          {voiceEnabled && (
            <button
              id="btn-toggle-patient-voice"
              type="button"
              onClick={togglePatientVoice}
              aria-pressed={patientVoiceOn}
              aria-label={patientVoiceOn ? t('sim.voiceOff', 'Bemor ovozini o‘chirish') : t('sim.voiceOn', 'Bemor ovozini yoqish')}
              title={patientVoiceOn ? t('sim.voiceOff', 'Bemor ovozini o‘chirish') : t('sim.voiceOn', 'Bemor ovozini yoqish')}
              style={iconButton(patientVoiceOn
                ? { background: '#DCFCE7', border: '1px solid #86EFAC', color: '#16A34A' }
                : { background: '#F1F5F9', color: '#94A3B8' })}
            >
              {patientVoiceOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          )}

          <button
            id="btn-clinical-hint"
            onClick={() => setHintModalOpen(true)}
            aria-label={t('sim.hintTitle')}
            title={t('sim.hintTitle')}
            style={iconButton({ background: '#FEF3C7', border: '1px solid #FDE68A', color: '#D97706' })}
          >
            <Lightbulb size={18} />
          </button>

          <button
            id="btn-finish-case"
            onClick={handleFinishSimulation}
            disabled={sessionEnded}
            aria-label={t('sim.finishBtn')}
            title={t('sim.finishBtn')}
            style={{
              height: 40,
              padding: '0 12px',
              borderRadius: 99,
              background: '#FEE2E2',
              border: '1px solid #FECACA',
              color: '#DC2626',
              fontSize: 12,
              fontWeight: 700,
              cursor: sessionEnded ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              flexShrink: 0,
              opacity: sessionEnded ? 0.55 : 1,
            }}
          >
            <Flag size={14} />
            <span>{t('sim.finishBtn')}</span>
          </button>
        </div>

        <PatientAvatar
          healthPercent={healthPercent}
          visualState={patientStatus}
          patientAge={caseItem?.patient_age}
          patientGender={caseItem?.patient_gender}
          vitals={vitals}
          speaking={speaking}
          thinking={sending}
        />

        {errorBanner && (
          <div role="alert" style={{
            background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C',
            borderRadius: 14, padding: '10px 14px', fontSize: 13, fontWeight: 600,
          }}>
            {errorBanner}
          </div>
        )}

        {/* Conversation */}
        <div className="sim-chat" style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '4px 2px' }}>
          {messages.length === 0 && (
            <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: 13, fontWeight: 600, margin: '24px 0' }}>
              {t('sim.emptyHint', 'Bemorga savol bering yoki klinik buyruq yozing')}
            </p>
          )}

          {messages.map((msg) => {
            if (msg.sender === 'user') {
              return (
                <div key={msg.id} style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'flex-end', gap: 6, maxWidth: '86%' }}>
                  <div style={{
                    background: '#2563EB', color: '#FFFFFF', borderRadius: '18px 18px 4px 18px',
                    padding: '10px 14px', fontSize: 14, fontWeight: 600, lineHeight: 1.45,
                    boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <span style={{ wordBreak: 'break-word' }}>{msg.text}</span>
                    {msg.audioBase64 && replayButton(msg, true)}
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} style={{ alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', gap: 5, maxWidth: '92%' }}>
                {msg.evaluation && (
                  <span style={{
                    alignSelf: 'flex-start',
                    background: msg.evaluation.type === 'wrong' ? '#FEE2E2' : '#DCFCE7',
                    color: msg.evaluation.type === 'wrong' ? '#DC2626' : '#16A34A',
                    fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
                    border: msg.evaluation.type === 'wrong' ? '1px solid #FECACA' : '1px solid #86EFAC',
                  }}>
                    {msg.evaluation.badge}
                  </span>
                )}
                <div style={{
                  background: '#FFFFFF', borderRadius: '4px 18px 18px 18px', border: '1px solid #E2E8F0',
                  padding: '10px 14px', color: '#1E293B', fontSize: 14, fontWeight: 500, lineHeight: 1.5,
                  whiteSpace: 'pre-line', display: 'flex', alignItems: 'flex-start', gap: 8,
                }}>
                  <span style={{ flex: 1, wordBreak: 'break-word' }}>{msg.text}</span>
                  {msg.audioBase64 && replayButton(msg)}
                </div>
              </div>
            );
          })}

          {sending && (
            <div aria-live="polite" style={{
              alignSelf: 'flex-start', background: '#FFFFFF', border: '1px solid #E2E8F0',
              borderRadius: '4px 18px 18px 18px', padding: '12px 16px', display: 'flex', gap: 5,
            }}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{
                  width: 7, height: 7, borderRadius: '50%', background: '#94A3B8',
                  animation: `sim-typing 1s ease-in-out ${i * 0.18}s infinite`,
                }} />
              ))}
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Event type (backend: question | exam | lab | imaging | medication | procedure) */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 6 }}>
          {[
            ['question', t('sim.type.question', 'Savol')],
            ['exam', t('sim.type.exam', "Ko'rik")],
            ['lab', t('sim.type.lab', 'Tahlil')],
            ['imaging', t('sim.type.imaging', 'Instrumental')],
            ['medication', t('sim.type.medication', 'Dori')],
            ['procedure', t('sim.type.procedure', 'Protsedura')],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setEventType(value)}
              className={`ui-chip${eventType === value ? ' active' : ''}`}
              style={{
                flexShrink: 0, padding: '6px 12px', borderRadius: 999, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                border: `1px solid ${eventType === value ? '#16A34A' : '#E2E8F0'}`,
                background: eventType === value ? '#16A34A' : '#FFFFFF',
                color: eventType === value ? '#FFFFFF' : '#334155',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePerformAction(inputText, eventType);
          }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}
        >
          <button
            type="button"
            onClick={toggleRecording}
            disabled={inputsLocked && !recording}
            aria-label={recording ? t('sim.stopRecord', 'Yozishni to‘xtatish') : t('sim.record', 'Ovozli yozish')}
            title={recording ? t('sim.stopRecord', 'Yozishni to‘xtatish') : t('sim.record', 'Ovozli yozish')}
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: recording ? '#DC2626' : '#FFFFFF',
              border: recording ? 'none' : '1px solid #CBD5E1',
              color: recording ? '#FFFFFF' : '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: (inputsLocked && !recording) ? 'not-allowed' : 'pointer',
              flexShrink: 0,
              padding: 0,
              opacity: (inputsLocked && !recording) ? 0.5 : 1,
              animation: recording ? 'sim-rec 1.2s ease-in-out infinite' : 'none',
            }}
          >
            {recording ? <Square size={16} fill="#fff" /> : <Mic size={20} />}
          </button>

          <input
            type="text"
            value={inputText}
            disabled={inputBlocked}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={recording ? t('sim.recording', 'Yozilmoqda...') : t('sim.orderPlaceholder')}
            style={{
              flex: 1,
              minWidth: 0,
              height: 48,
              padding: '0 18px',
              borderRadius: 99,
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              fontSize: 14,
              fontWeight: 500,
              color: '#0F172A',
              outline: 'none',
              boxSizing: 'border-box',
              opacity: inputBlocked ? 0.7 : 1,
            }}
          />

          <button
            type="submit"
            id="btn-send-action"
            aria-label={t('common.send', 'Yuborish')}
            disabled={inputBlocked || !inputText.trim()}
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: '#16A34A',
              border: 'none',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: (inputBlocked || !inputText.trim()) ? 'not-allowed' : 'pointer',
              flexShrink: 0,
              padding: 0,
              opacity: (inputBlocked || !inputText.trim()) ? 0.5 : 1,
            }}
          >
            <ArrowRight size={20} strokeWidth={2.6} />
          </button>
        </form>
      </div>

      <ClinicalHintModal
        isOpen={hintModalOpen}
        onClose={() => setHintModalOpen(false)}
        hintText={t('sim.hintDefault')}
      />

      {isFinished && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(8px)', zIndex: 130, display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: 16,
        }}>
          <div
            className="responsive-modal-card"
            style={{
              width: '100%', maxWidth: 420, background: '#FFFFFF', borderRadius: 18,
              border: '1px solid #E2E8F0', boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
              padding: '26px 20px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', textAlign: 'center', gap: 16, boxSizing: 'border-box',
            }}
          >
            <div style={{
              width: 68, height: 68, borderRadius: '50%', background: '#FEF3C7',
              border: '1px solid #FDE68A', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#D97706',
            }}>
              <Award size={36} strokeWidth={2.4} />
            </div>

            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0F172A', margin: '0 0 4px 0' }}>
                {t('sim.caseCompleted')}
              </h2>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#64748B', margin: 0 }}>
                {caseItem?.title || t('sim.headerCase')}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, width: '100%' }}>
              <div style={{ padding: '12px 6px', borderRadius: 16, background: '#DCFCE7', border: '1px solid #86EFAC' }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: '#166534' }}>{t('sim.score')}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#16A34A' }}>{finalScore}%</div>
              </div>
              <div style={{ padding: '12px 6px', borderRadius: 16, background: '#FEF3C7', border: '1px solid #FDE68A' }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: '#92400E' }}>{t('sim.xp')}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#D97706' }}>+{earnedXp}</div>
              </div>
              <div style={{ padding: '12px 6px', borderRadius: 16, background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                <div style={{ fontSize: 10.5, fontWeight: 700, color: '#1E40AF' }}>{t('sim.coins', 'COIN')}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#2563EB' }}>+{earnedCoins}</div>
              </div>
            </div>

            <button
              onClick={onExitSimulation}
              style={{
                width: '100%', minHeight: 48, borderRadius: 16,
                background: '#16A34A', border: 'none', color: '#FFFFFF',
                fontWeight: 700, fontSize: 14, cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
              }}
            >
              {t('sim.continue')}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes sim-typing { 0%,100% { transform: translateY(0); opacity: 0.4; } 50% { transform: translateY(-4px); opacity: 1; } }
        @keyframes sim-rec { 0%,100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.5); } 50% { box-shadow: 0 0 0 10px rgba(220,38,38,0); } }
      `}</style>
    </div>
  );
}
