const RECORDER_MIME_CANDIDATES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
  'audio/ogg;codecs=opus',
  'audio/ogg',
];

let activePlayback = null;
let playbackListener = null;

function notifyPlayback(isPlaying) {
  if (playbackListener) playbackListener(isPlaying);
}

/** Subscribe to "patient is speaking" changes. Returns an unsubscribe fn. */
export function onPlaybackChange(fn) {
  playbackListener = fn;
  return () => {
    if (playbackListener === fn) playbackListener = null;
  };
}

export function pickRecorderMime() {
  if (typeof MediaRecorder === 'undefined') return '';
  return RECORDER_MIME_CANDIDATES.find((mime) => MediaRecorder.isTypeSupported(mime)) || '';
}

export function blobToRawBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = String(reader.result || '');
      const comma = dataUrl.indexOf(',');
      resolve(comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl);
    };
    reader.onerror = () => reject(new Error('Audio o‘qib bo‘lmadi'));
    reader.readAsDataURL(blob);
  });
}

export function stopPlayback() {
  if (activePlayback) {
    try {
      activePlayback.pause();
      activePlayback.src = '';
    } catch {
      // ignore
    }
    activePlayback = null;
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  notifyPlayback(false);
}

export function playBase64Audio(base64, mime = 'audio/wav') {
  if (!base64) return Promise.resolve();
  stopPlayback();
  const audio = new Audio(`data:${mime};base64,${base64}`);
  activePlayback = audio;
  audio.onplay = () => notifyPlayback(true);
  audio.onended = () => {
    if (activePlayback === audio) activePlayback = null;
    notifyPlayback(false);
  };
  audio.onerror = () => notifyPlayback(false);
  return audio.play().catch(() => notifyPlayback(false));
}

export async function startMicRecorder() {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    throw new Error('Mikrofon ushbu brauzerda qo‘llab-quvvatlanmaydi');
  }
  if (typeof MediaRecorder === 'undefined') {
    throw new Error('Audio yozish ushbu brauzerda qo‘llab-quvvatlanmaydi');
  }

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mimeType = pickRecorderMime();
  const recorder = mimeType
    ? new MediaRecorder(stream, { mimeType })
    : new MediaRecorder(stream);
  const chunks = [];

  recorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  recorder.start();

  return {
    mimeType: recorder.mimeType || mimeType || 'audio/webm',
    stop: () => new Promise((resolve, reject) => {
      recorder.onerror = () => reject(new Error('Audio yozishda xatolik'));
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        try {
          const blob = new Blob(chunks, { type: recorder.mimeType || mimeType || 'audio/webm' });
          const audio_base64 = await blobToRawBase64(blob);
          resolve({
            audio_base64,
            audio_mime: blob.type || recorder.mimeType || 'audio/webm',
          });
        } catch (err) {
          reject(err);
        }
      };
      if (recorder.state !== 'inactive') {
        recorder.stop();
      }
    }),
  };
}
