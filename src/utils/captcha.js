const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || import.meta.env.VITE_CAPTCHA_SITE_KEY || '';
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

let scriptPromise = null;

export function isCaptchaConfigured() {
  return Boolean(SITE_KEY);
}

function loadTurnstile() {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-turnstile]');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.turnstile));
      existing.addEventListener('error', () => reject(new Error('captcha_failed')));
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.dataset.turnstile = '1';
    script.onload = () => resolve(window.turnstile);
    script.onerror = () => reject(new Error('captcha_failed'));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/** Invisible Turnstile token. Site-key yo'q bo'lsa bo'sh qator. */
export async function getCaptchaToken() {
  if (!SITE_KEY) return '';
  const turnstile = await loadTurnstile();
  if (!turnstile?.render) return '';
  return new Promise((resolve, reject) => {
    const holder = document.createElement('div');
    holder.style.cssText = 'position:fixed;left:-9999px;bottom:0;width:1px;height:1px;overflow:hidden;';
    document.body.appendChild(holder);
    let widgetId;
    const cleanup = () => {
      try { if (widgetId != null) turnstile.remove(widgetId); } catch { /* noop */ }
      holder.remove();
    };
    try {
      widgetId = turnstile.render(holder, {
        sitekey: SITE_KEY,
        size: 'invisible',
        callback: (token) => {
          cleanup();
          resolve(token || '');
        },
        'error-callback': () => {
          cleanup();
          reject(new Error('captcha_failed'));
        },
        'expired-callback': () => {
          cleanup();
          reject(new Error('captcha_failed'));
        },
      });
      if (typeof turnstile.execute === 'function') {
        turnstile.execute(widgetId);
      }
    } catch (err) {
      cleanup();
      reject(err);
    }
  });
}

export async function getCaptchaTokenSafe() {
  try {
    return await getCaptchaToken();
  } catch {
    return '';
  }
}
