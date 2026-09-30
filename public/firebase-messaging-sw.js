/* Firebase Cloud Messaging service worker. Config arrives via query string. */
importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.2/firebase-messaging-compat.js');

const p = new URL(self.location.href).searchParams;
firebase.initializeApp({
  apiKey: p.get('apiKey'),
  authDomain: p.get('authDomain'),
  projectId: p.get('projectId'),
  storageBucket: p.get('storageBucket'),
  messagingSenderId: p.get('messagingSenderId'),
  appId: p.get('appId'),
});

const messaging = firebase.messaging();
// Notification payloads are shown automatically by FCM; only handle data-only messages here.
messaging.onBackgroundMessage((payload) => {
  if (payload.notification) return;
  const d = payload.data || {};
  self.registration.showNotification(d.title || 'TibCase', { body: d.body || d.message || '', icon: '/favicon.svg' });
});
