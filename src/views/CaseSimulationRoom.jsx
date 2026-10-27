import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ArrowRight,
  Bookmark,
  Flag,
  Mic,
  Square,
  Volume2,
  VolumeX,
  Clock,
} from 'lucide-react';
import PatientAvatar from '../components/features/PatientAvatar';
import { useTranslation } from '../i18n.jsx';
import { api, isSessionNotActiveError, isInsufficientCoinsError, isDebriefTerminalError } from '../api';
import { onPlaybackChange, speakReply, startMicRecorder, stopPlayback } from '../utils/audioRecord';

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

function isVitalPresent(value) {
  if (value === null || value === undefined || value === '') return false;
  if (typeof value === 'number' && (Number.isNaN(value) || value === 0)) return false;
  if (value === '0') return false;
  return true;
}

function mergeVitals(prev, raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return prev;
  const next = { ...prev };
  Object.entries(raw).forEach(([key, value]) => {
    if (!isVitalPresent(value) || typeof value === 'object') return;
    if (key === 'heart_rate') next.hr = value;
    else if (key === 'temperature') next.temp = value;
    else next[key] = value;
  });
  if (!isVitalPresent(next.bp) && isVitalPresent(raw.bp_sys) && isVitalPresent(raw.bp_dia)) {
    next.bp = `${raw.bp_sys}/${raw.bp_dia}`;
  }
  return next;
}

function defaultVitalsFromCase(caseItem) {
  const initial = caseItem?.initial_vitals;
  return mergeVitals(
    {},
    initial,
  );
}

function asTextList(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item : item?.text || item?.title || ''))
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
}

function formatDebriefChat(debrief, t) {
  if (!debrief || typeof debrief !== 'object') return '';
  const lines = [t('sim.aiAnalysisHeading', 'AI tahlili')];
  const correct = asTextList(debrief.correct_steps);
  const incorrect = asTextList(debrief.incorrect_steps);
  const weak = asTextList(debrief.weak_topics);
  const notes = asTextList(debrief.guideline_notes).join('\n');
  if (correct.length) {
    lines.push('', `${t('debrief.correctActions', "To'g'ri qadamlar")}:`);
    correct.forEach((step) => lines.push(`• ${step}`));
  }
  if (incorrect.length) {
    lines.push('', `${t('debrief.errors', 'Klinik xatolar')}:`);
    incorrect.forEach((step) => lines.push(`• ${step}`));
  }
  if (weak.length) {
    lines.push('', t('debrief.weakTopics', "Rivojlantirish kerak bo'lgan mavzular:"));
    weak.forEach((topic) => lines.push(`• ${topic}`));
  }
  if (notes) {
    lines.push('', t('debrief.protocolNotes', 'Klinik protokol va tavsiyalar:'));
    lines.push(notes);
  }
  return lines.length > 1 ? lines.join('\n') : '';
}

export default function CaseSimulationRoom({
  caseItem,
  onExitSimulation,
  onFinishCase,
  onNextCase,
  onInsufficientCoins,
  onToast,
}) {
  const { t, lang } = useTranslation();
  const sessionId = caseItem?.sessionId;
  const caseId = caseItem?.id || caseItem?.case_id;

  const [saved, setSaved] = useState(() => Boolean(caseItem?.is_favorite));
  const [savingFavorite, setSavingFavorite] = useState(false);

  useEffect(() => {
    setSaved(Boolean(caseItem?.is_favorite));
  }, [caseItem?.id, caseItem?.case_id, caseItem?.is_favorite]);

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
  const maxAttempts = typeof caseItem?.max_attempts === 'number' ? caseItem.max_attempts : 1;
  const [attemptsLeft, setAttemptsLeft] = useState(() => (
    typeof caseItem?.max_attempts === 'number'
      ? Math.max(0, caseItem.max_attempts - (caseItem.attempts_used || 0))
      : maxAttempts
  ));
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [recording, setRecording] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [analysisReady, setAnalysisReady] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [errorBanner, setErrorBanner] = useState('');
  const [messages, setMessages] = useState(() => (
    caseItem?.chief_complaint
      ? [{ id: 'init-1', sender: 'patient', text: caseItem.chief_complaint, time: '00:00' }]
      : []
  ));


  const chatBottomRef = useRef(null);
  const recorderRef = useRef(null);
  const secondsRef = useRef(0);
  const voiceEnabledRef = useRef(false);
  const sessionEndedRef = useRef(false);
  const sendingRef = useRef(false);
  const usageRef = useRef({ tokens_used: 0, coins_spent: 0 });
  const endSeqRef = useRef(false);
  const analysisDoneRef = useRef(false);
  const abortRef = useRef(new AbortController());

  useEffect(() => {
    const ctrl = abortRef.current;
    return () => ctrl.abort();
  }, []);

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
    const lastSpoken = [...messages].reverse().find((m) => m.sender !== 'user' && m.text && !m.loading);
    if (!lastSpoken) return;
    speakReply({
      audioBase64: lastSpoken.audioBase64,
      audioMime: lastSpoken.audioMime,
      text: lastSpoken.text,
      lang,
    });
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
      .then((res) => setVoiceEnabled(res?.enabled === true))
      .catch(() => setVoiceEnabled(false));
  }, []);

  // Real-time vitals / health over WebSocket (same as user-panel.html)
  const wsUrlPath = caseItem?.ws_url;
  useEffect(() => {
    if (!isRealSessionId(sessionId) || sessionEnded) return undefined;
    let ws;
    const closeWs = (socket) => {
      if (!socket) return;
      try { socket.close(); } catch { /* noop */ }
    };
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
    return () => {
      if (!ws) return;
      ws.onmessage = null;
      if (ws.readyState === WebSocket.CONNECTING) {
        ws.addEventListener('open', () => closeWs(ws), { once: true });
        ws.addEventListener('error', () => closeWs(ws), { once: true });
        return;
      }
      closeWs(ws);
    };
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

  const playReplyAudio = useCallback((audioBase64, audioMime, text) => {
    if (!voiceEnabledRef.current) return;
    speakReply({ audioBase64, audioMime, text, lang });
  }, [lang]);

  const emitScores = useCallback((finishResult, extra = {}) => {
    if (!onFinishCase) return;
    const merged = finishResult || extra.finish_result || null;
    onFinishCase({
      reason: extra.reason || 'manual',
      skipFinishApi: true,
      skipDebriefWait: true,
      sessionEnded: true,
      silent: (extra.reason || 'manual') !== 'insufficient_coins',
      finish_result: merged,
      score: merged?.final_score ?? extra.score ?? 0,
      xp: merged?.xp_earned ?? extra.xp ?? 0,
      coins: merged?.coins_earned ?? extra.coins ?? 0,
      tokens_used: merged?.tokens_used ?? extra.tokens_used ?? usageRef.current.tokens_used,
      coins_spent: merged?.coins_spent ?? extra.coins_spent ?? usageRef.current.coins_spent,
      time: formatTimer(secondsRef.current),
    });
  }, [onFinishCase]);

  const completeSession = useCallback((finishResult, extra = {}) => {
    if (analysisDoneRef.current) {
      emitScores(finishResult, extra);
      return;
    }
    if (endSeqRef.current) return;
    endSeqRef.current = true;
    sessionEndedRef.current = true;
    setSessionEnded(true);
    setRecording(false);

    const loadingId = 'ai-analysis-loading';
    setMessages((prev) => {
      if (prev.some((m) => m.id === loadingId || m.kind === 'debrief')) return prev;
      return [...prev, {
        id: loadingId,
        sender: 'ai',
        kind: 'debrief',
        loading: true,
        text: t('sim.aiAnalyzing', 'AI tahlil qilyapti...'),
        time: formatTimer(secondsRef.current),
      }];
    });

    (async () => {
      let finish = finishResult || null;
      let debrief = null;
      let analysisUnavailable = false;

      const finishTask = (!extra.skipFinishApi && isRealSessionId(sessionId))
        ? api.finishSimulation(sessionId, extra.reason || 'manual', { timeoutMs: 8000 })
          .then((res) => { if (res) finish = res; })
          .catch((err) => {
            if (!isSessionNotActiveError(err) && err?.name !== 'AbortError') {
              console.warn('finishSimulation:', err?.message);
            }
          })
        : Promise.resolve();

      const debriefTask = isRealSessionId(sessionId)
        ? api.waitForDebrief(sessionId, {
          signal: abortRef.current?.signal,
          delayMs: 2000,
          timeoutMs: 30000,
          deadlineMs: 50000,
        }).then((res) => { debrief = res; }).catch((err) => {
          if (isDebriefTerminalError(err)) analysisUnavailable = true;
          else console.warn('waitForDebrief:', err?.message);
        })
        : Promise.resolve();

      await Promise.all([finishTask, debriefTask]);

      const analysisText = analysisUnavailable
        ? t('sim.aiAnalysisEmpty', 'AI tahlili mavjud emas.')
        : (formatDebriefChat(debrief, t)
          || extra.eventFeedback
          || t('sim.aiAnalysisEmpty', 'AI tahlili mavjud emas.'));
      setMessages((prev) => prev.map((msg) => (
        msg.id === loadingId
          ? {
            ...msg,
            loading: false,
            text: analysisText,
            evaluation: extra.evaluation || msg.evaluation || null,
          }
          : msg
      )));
      analysisDoneRef.current = true;
      setAnalysisReady(true);
      if (analysisText && analysisText !== t('sim.aiAnalysisEmpty', 'AI tahlili mavjud emas.')) {
        playReplyAudio(extra.replyAudio, extra.replyMime, analysisText);
      }

      const merged = {
        ...(finish || {}),
        ...(debrief ? {
          final_score: debrief.final_score ?? finish?.final_score,
          xp_earned: debrief.xp_earned ?? finish?.xp_earned,
          coins_earned: debrief.coins_earned ?? finish?.coins_earned,
          tokens_used: debrief.tokens_used ?? finish?.tokens_used,
          coins_spent: debrief.coins_spent ?? finish?.coins_spent,
        } : {}),
      };

      await new Promise((resolve) => {
        const timer = setTimeout(resolve, 1200);
        abortRef.current?.signal?.addEventListener('abort', () => {
          clearTimeout(timer);
          resolve();
        }, { once: true });
      });
      if (abortRef.current?.signal?.aborted) return;

      emitScores(merged, extra);
    })();
  }, [emitScores, playReplyAudio, sessionId, t]);

  // Finish osilib qolsa ham, tayyor debriefni chatga chiqarish
  useEffect(() => {
    if (!sessionEnded || !isRealSessionId(sessionId) || analysisDoneRef.current) return undefined;
    const loading = messages.some((m) => m.id === 'ai-analysis-loading' && m.loading);
    if (!loading) return undefined;
    const timer = setTimeout(async () => {
      if (analysisDoneRef.current) return;
      try {
        const debrief = await api.getDebrief(sessionId, { timeoutMs: 30000 });
        if (analysisDoneRef.current) return;
        const text = formatDebriefChat(debrief, t)
          || t('sim.aiAnalysisEmpty', 'AI tahlili mavjud emas.');
        setMessages((prev) => prev.map((msg) => (
          msg.id === 'ai-analysis-loading'
            ? { ...msg, loading: false, text }
            : msg
        )));
        analysisDoneRef.current = true;
        setAnalysisReady(true);
        if (text !== t('sim.aiAnalysisEmpty', 'AI tahlili mavjud emas.')) {
          playReplyAudio('', '', text);
        }
      } catch {
        /* completeSession poll hali ketayotgan bo'lishi mumkin */
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [sessionEnded, sessionId, messages, t, playReplyAudio]);

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
    const analysisText = response.feedback || response.patient_reply || '';
    const replyAudio = response.reply_audio_base64;
    const replyMime = response.reply_audio_mime || 'audio/wav';
    const evaluation = data.is_correct === true
      ? { type: 'correct', badge: t('sim.correctBadge', "To'g'ri javob") }
      : data.is_correct === false
        ? { type: 'wrong', badge: t('sim.wrongBadge', "Noto'g'ri javob") }
        : null;
    const sessionClosing = Boolean(data.session_ended)
      || data.is_correct === true
      || data.attempts_left === 0;

    if (typeof data.tokens_used === 'number' || typeof data.coins_spent === 'number') {
      usageRef.current = {
        tokens_used: typeof data.tokens_used === 'number' ? data.tokens_used : usageRef.current.tokens_used,
        coins_spent: typeof data.coins_spent === 'number' ? data.coins_spent : usageRef.current.coins_spent,
      };
    }

    if (typeof data.attempts_left === 'number') {
      setAttemptsLeft(data.attempts_left);
    } else if (maxAttempts != null && !response.transcribe_error) {
      setAttemptsLeft((prev) => (typeof prev === 'number' ? Math.max(0, prev - 1) : prev));
    }

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

    if (sessionClosing) {
      completeSession(data.finish_result, {
        skipFinishApi: Boolean(data.session_ended)
          || data.is_correct === true
          || data.attempts_left === 0,
        sessionEnded: Boolean(data.session_ended),
        reason: data.session_ended ? undefined : 'manual',
        evaluation,
        replyAudio,
        replyMime,
        eventFeedback: analysisText,
      });
      return;
    }

    const replyText = analysisText || errorText || '';
    if (!replyText && !replyAudio && data?.is_correct === undefined) {
      console.warn('[simulation] empty event response', data);
      return;
    }

    setMessages((prev) => [...prev, {
      id: `sys-${Date.now()}`,
      sender: 'ai',
      text: replyText || t('sim.noReply', "Javob kelmadi, boshqacha ifodalab ko'ring"),
      evaluation,
      audioBase64: replyAudio || '',
      audioMime: replyMime,
      time: formatTimer(secondsRef.current),
    }]);

    playReplyAudio(replyAudio, replyMime, replyText);
  }, [completeSession, maxAttempts, playReplyAudio, t]);

  const sendEvent = useCallback(async ({ text, audio }) => {
    if (sessionEndedRef.current || sendingRef.current) return;
    if (attemptsLeft !== null && attemptsLeft <= 0) {
      setErrorBanner(t('sim.noAttempts', 'Urinishlar tugadi'));
      return;
    }
    if (!isRealSessionId(sessionId)) {
      setErrorBanner(t('sim.noSession', 'Sessiya topilmadi. Simulyatsiyani qaytadan boshlang.'));
      return;
    }

    setErrorBanner('');
    sendingRef.current = true;
    setSending(true);

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
      // Only `question` events count toward max_attempts on the backend.
      const data = await api.sendSimulationEvent(sessionId, payload, 'question');
      applyEventResult(data, { userMsgId, userAudio: audio });
    } catch (err) {
      if (isSessionNotActiveError(err)) {
        setErrorBanner(t('sim.alreadyEnded', 'Sessiya allaqachon yakunlangan'));
        completeSession(null, { skipFinishApi: true, sessionEnded: true });
      } else if (isInsufficientCoinsError(err)) {
        const message = t('sim.insufficientCoins', 'Tangalar yetarli emas');
        setErrorBanner(message);
        setMessages((prev) => [...prev, {
          id: `err-${Date.now()}`,
          sender: 'system',
          text: message,
          time: formatTimer(secondsRef.current),
        }]);
        onInsufficientCoins?.();
        completeSession(null, { skipFinishApi: true, sessionEnded: true, reason: 'insufficient_coins' });
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
  }, [applyEventResult, attemptsLeft, completeSession, onInsufficientCoins, sessionId, t]);

  const handlePerformAction = (actionText) => {
    if (!actionText || !actionText.trim() || sessionEnded || sending) return;
    if (attemptsLeft !== null && attemptsLeft <= 0) return;
    setInputText('');
    sendEvent({ text: actionText.trim() });
  };

  const toggleRecording = async () => {
    if (sessionEnded || sending || (attemptsLeft !== null && attemptsLeft <= 0)) return;

    if (recording && recorderRef.current) {
      setRecording(false);
      try {
        const audio = await recorderRef.current.stop();
        recorderRef.current = null;
        if (audio?.audio_base64) {
          await sendEvent({ audio });
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

  const handleToggleSave = async () => {
    if (!caseId || savingFavorite) return;
    setSavingFavorite(true);
    const next = !saved;
    setSaved(next);
    try {
      const res = await api.toggleFavorite(caseId);
      const isFav = typeof res?.is_favorite === 'boolean' ? res.is_favorite : next;
      setSaved(isFav);
      onToast?.(isFav
        ? t('fav.added', "Keys saqlanganlarga qo'shildi")
        : t('fav.removed', "Keys saqlanganlardan olib tashlandi"));
    } catch (err) {
      setSaved(!next);
      setErrorBanner(err?.message || t('common.error', 'Xatolik yuz berdi'));
    } finally {
      setSavingFavorite(false);
    }
  };

  const noAttemptsLeft = attemptsLeft !== null && attemptsLeft <= 0;
  const inputsLocked = sessionEnded || sending || noAttemptsLeft;
  const inputBlocked = inputsLocked || recording;
  const answerRows = Math.min(6, Math.max(2, (inputText.match(/\n/g) || []).length + 1));

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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, color: '#64748B', marginTop: 2, flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Clock size={12} /> {formatTimer(timeLimit > 0 ? Math.max(0, timeLimit - secondsElapsed) : secondsElapsed)}
              </span>
            </div>
          </div>

          {voiceEnabled && (
            <button
              id="btn-toggle-patient-voice"
              type="button"
              onClick={togglePatientVoice}
              aria-pressed={patientVoiceOn}
              aria-label={patientVoiceOn ? t('sim.voiceOff', "Ovozni o'chirish") : t('sim.voiceOn', 'Ovozni yoqish')}
              title={patientVoiceOn ? t('sim.voiceOff', "Ovozni o'chirish") : t('sim.voiceOn', 'Ovozni yoqish')}
              style={iconButton(patientVoiceOn
                ? { background: '#DCFCE7', border: '1px solid #86EFAC', color: '#16A34A' }
                : { background: '#F1F5F9', color: '#94A3B8' })}
            >
              {patientVoiceOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          )}

          {caseId && (
            <button
              id="btn-save-case"
              type="button"
              onClick={handleToggleSave}
              disabled={savingFavorite}
              aria-pressed={saved}
              aria-label={saved
                ? t('case.removeSaved', "Saqlangan keyslardan o'chirish")
                : t('sim.saveBtn', 'Saqlash')}
              title={saved
                ? t('case.removeSaved', "Saqlangan keyslardan o'chirish")
                : t('sim.saveBtn', 'Saqlash')}
              style={{
                height: 40,
                padding: '0 12px',
                borderRadius: 99,
                background: saved ? '#FEF3C7' : '#FFFFFF',
                border: saved ? '1px solid #FDE68A' : '1px solid #CBD5E1',
                color: saved ? '#B45309' : '#0F172A',
                fontSize: 12,
                fontWeight: 700,
                cursor: savingFavorite ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                flexShrink: 0,
                opacity: savingFavorite ? 0.7 : 1,
              }}
            >
              <Bookmark size={14} fill={saved ? '#F59E0B' : 'none'} color={saved ? '#F59E0B' : 'currentColor'} />
              <span>{saved ? t('sim.saveBtnSaved', 'Saqlangan') : t('sim.saveBtn', 'Saqlash')}</span>
            </button>
          )}

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
              {t('sim.emptyHint', "Bemor shikoyatini o'qing va to'liq tashxis javobini yozing")}
            </p>
          )}

          {messages.map((msg) => {
            if (msg.sender === 'user') {
              return (
                <div key={msg.id} style={{ alignSelf: 'flex-end', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, maxWidth: '86%' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B' }}>
                    {t('sim.youLabel', 'Siz')}
                  </span>
                  <div style={{
                    background: '#2563EB', color: '#FFFFFF', borderRadius: '18px 18px 4px 18px',
                    padding: '10px 14px', fontSize: 14, fontWeight: 600, lineHeight: 1.45,
                    boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'flex-start', gap: 8,
                  }}>
                    <span style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}>{msg.text}</span>
                  </div>
                </div>
              );
            }

            const isPatient = msg.sender === 'patient';
            const isAi = msg.sender === 'ai';
            return (
              <div key={msg.id} style={{ alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', gap: 5, maxWidth: '92%' }}>
                {(isPatient || isAi) && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: isPatient ? '#0F766E' : '#4F46E5' }}>
                    {isPatient ? t('sim.patientLabel', 'Bemor') : t('sim.aiLabel', 'AI')}
                  </span>
                )}
                {msg.evaluation && !msg.loading && (
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
                  background: msg.loading ? '#EEF2FF' : '#FFFFFF',
                  borderRadius: '4px 18px 18px 18px',
                  border: msg.loading ? '1px solid #C7D2FE' : '1px solid #E2E8F0',
                  padding: '10px 14px',
                  color: msg.loading ? '#4338CA' : '#1E293B',
                  fontSize: 14,
                  fontWeight: msg.loading ? 600 : 500,
                  lineHeight: 1.5,
                  whiteSpace: 'pre-line',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 8,
                }}>
                  {msg.loading && (
                    <span aria-hidden style={{ display: 'flex', gap: 4, paddingTop: 6, flexShrink: 0 }}>
                      {[0, 1, 2].map((i) => (
                        <span key={i} style={{
                          width: 6, height: 6, borderRadius: '50%', background: '#6366F1',
                          animation: `sim-typing 1s ease-in-out ${i * 0.18}s infinite`,
                        }} />
                      ))}
                    </span>
                  )}
                  <span style={{ flex: 1, wordBreak: 'break-word' }}>{msg.text}</span>
                </div>
              </div>
            );
          })}

          {sending && !sessionEnded && (
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

        {sessionEnded && analysisReady && onNextCase ? (
          <button
            type="button"
            id="btn-next-case"
            disabled={loadingNext}
            onClick={async () => {
              setLoadingNext(true);
              try { await onNextCase(); } finally { setLoadingNext(false); }
            }}
            style={{
              width: '100%',
              height: 52,
              borderRadius: 18,
              background: '#16A34A',
              border: 'none',
              boxShadow: 'var(--shadow-sm)',
              color: '#FFFFFF',
              fontSize: 15,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: loadingNext ? 'wait' : 'pointer',
              opacity: loadingNext ? 0.7 : 1,
              fontFamily: 'inherit',
            }}
          >
            {t('debrief.nextCase', 'Keyingisi')}
            <ArrowRight size={20} strokeWidth={2.6} />
          </button>
        ) : (<>
        {/* Input: full diagnosis answer (counts as one attempt) */}
        <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', padding: '0 4px' }}>
          {t('sim.taskHint', 'To‘liq tashxis va davolash rejangizni yozing. Har bir yuborish 1 urinish.')}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePerformAction(inputText);
          }}
          style={{ display: 'flex', alignItems: 'flex-end', gap: 8, width: '100%' }}
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

          <textarea
            value={inputText}
            disabled={inputBlocked}
            rows={answerRows}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter' || e.shiftKey || e.nativeEvent.isComposing) return;
              e.preventDefault();
              if (!inputBlocked && inputText.trim()) handlePerformAction(inputText);
            }}
            placeholder={recording
              ? t('sim.recording', 'Yozilmoqda...')
              : noAttemptsLeft
                ? t('sim.noAttempts', 'Urinishlar tugadi')
                : t('sim.orderPlaceholder', 'Tashxis, asoslash va davolash rejasini yozing...')}
            style={{
              flex: 1,
              minWidth: 0,
              minHeight: 48,
              maxHeight: 160,
              padding: '12px 16px',
              borderRadius: 18,
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              fontSize: 14,
              fontWeight: 500,
              color: '#0F172A',
              outline: 'none',
              boxSizing: 'border-box',
              resize: 'none',
              lineHeight: 1.45,
              fontFamily: 'inherit',
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
        </>)}
      </div>

      <style>{`
        @keyframes sim-typing { 0%,100% { transform: translateY(0); opacity: 0.4; } 50% { transform: translateY(-4px); opacity: 1; } }
        @keyframes sim-rec { 0%,100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.5); } 50% { box-shadow: 0 0 0 10px rgba(220,38,38,0); } }
      `}</style>
    </div>
  );
}
