import { api } from '../api';

const env = import.meta.env;
const cfg = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};
const VAPID = env.VITE_FIREBASE_VAPID_KEY;

export const isPushConfigured = () => !!(cfg.apiKey && cfg.projectId && cfg.messagingSenderId && cfg.appId && VAPID);

/** Returns '' when push can work, otherwise a human-readable reason. */
export function pushUnsupportedReason() {
  if (!isPushConfigured()) return 'Firebase sozlanmagan (.env dagi VITE_FIREBASE_* qiymatlari yo\'q)';
  if (window.Telegram?.WebApp?.initData) return 'Telegram ichidagi oynada web-push ishlamaydi. Saytni brauzerda (Chrome/Safari) oching';
  if (!('serviceWorker' in navigator) || !('Notification' in window)) return 'Bu brauzer push bildirishnomani qo\'llamaydi';
  return '';
}

/** Reject with a readable error instead of hanging forever (SW install / FCM token calls can stall). */
function withTimeout(promise, ms, message) {
  let timer;
  const timeout = new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(message)), ms); });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

/** Resolves once the given registration has an ACTIVE worker (rejects if install fails). */
function waitForActiveWorker(registration) {
  return new Promise((resolve, reject) => {
    const sw = registration.active || registration.waiting || registration.installing;
    if (!sw) return reject(new Error('Service worker topilmadi'));
    if (sw.state === 'activated') return resolve(registration);
    sw.addEventListener('statechange', () => {
      if (sw.state === 'activated') resolve(registration);
      else if (sw.state === 'redundant') reject(new Error('Service worker o\'rnatilmadi (firebase-messaging-sw.js yuklanmadi yoki gstatic.com bloklangan)'));
    });
  });
}

/** Ask permission, get FCM token, register it on the backend. Returns the token. */
export async function enablePush() {
  const reason = pushUnsupportedReason();
  if (reason) throw new Error(reason);

  const perm = await Notification.requestPermission();
  if (perm !== 'granted') throw new Error('Bildirishnomaga ruxsat berilmadi (brauzer sozlamalarida yoqing)');

  const [{ initializeApp, getApps }, { getMessaging, getToken }] = await withTimeout(Promise.all([
    import('firebase/app'),
    import('firebase/messaging'),
  ]), 15000, 'Firebase kutubxonasi yuklanmadi');
  const app = getApps()[0] || initializeApp(cfg);
  const qs = new URLSearchParams(Object.entries(cfg).filter(([, v]) => v)).toString();
  const registration = await navigator.serviceWorker.register(`/firebase-messaging-sw.js?${qs}`);
  await withTimeout(waitForActiveWorker(registration), 15000, 'Service worker faollashmadi (firebase-messaging-sw.js ni tekshiring)');
  const token = await withTimeout(
    getToken(getMessaging(app), { vapidKey: VAPID, serviceWorkerRegistration: registration }),
    20000,
    'FCM token olinmadi (Firebase sozlamalari, VAPID kalit yoki tarmoqni tekshiring)'
  );
  if (!token) throw new Error('FCM token olinmadi');

  await api.registerDevice(token, 'web');
  localStorage.setItem('fcm_token', token);
  return token;
}

/** Silently re-register on login if permission was already granted. */
export async function autoEnablePush() {
  if (pushUnsupportedReason() || Notification.permission !== 'granted') return;
  try { await enablePush(); } catch (e) { console.warn('Push auto-enable skipped:', e.message); }
}

/** Foreground messages: call cb(payload). Returns unsubscribe. */
export async function onForegroundPush(cb) {
  if (pushUnsupportedReason() || Notification.permission !== 'granted') return () => {};
  const [{ initializeApp, getApps }, { getMessaging, onMessage }] = await Promise.all([
    import('firebase/app'),
    import('firebase/messaging'),
  ]);
  const app = getApps()[0] || initializeApp(cfg);
  return onMessage(getMessaging(app), cb);
}
