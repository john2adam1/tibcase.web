// ============================================================
// Token & Language helpers
// ============================================================
export const getToken = () => {
  return localStorage.getItem('tibcase_token') || localStorage.getItem('access_token') || '';
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem('tibcase_token', token);
    localStorage.setItem('access_token', token);
  } else {
    localStorage.removeItem('tibcase_token');
    localStorage.removeItem('access_token');
  }
};

export const getRefreshToken = () => {
  return localStorage.getItem('tibcase_refresh_token') || localStorage.getItem('refresh_token') || '';
};

export const setRefreshToken = (token) => {
  if (token) {
    localStorage.setItem('tibcase_refresh_token', token);
    localStorage.setItem('refresh_token', token);
  } else {
    localStorage.removeItem('tibcase_refresh_token');
    localStorage.removeItem('refresh_token');
  }
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('tibcase_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user) => {
  if (user) {
    localStorage.setItem('tibcase_user', JSON.stringify(user));
    if (user.id) {
      localStorage.setItem('user_id', String(user.id));
    }
  } else {
    localStorage.removeItem('tibcase_user');
    localStorage.removeItem('user_id');
  }
};

export const getLang = () => {
  return localStorage.getItem('tibcase_lang') || 'uz';
};

export const setLang = (lang) => {
  localStorage.setItem('tibcase_lang', lang);
};

// ============================================================
// Token refresh & Unauthorized event handler
// ============================================================
let refreshPromise = null;
let onUnauthorizedCallback = null;

export const setOnUnauthorized = (cb) => {
  onUnauthorizedCallback = cb;
};

export class ApiError extends Error {
  constructor(message, { status = 0, code = '', data = null, retryAfter = 0 } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.data = data;
    this.retryAfter = Number(retryAfter) || 0;
  }
}

function extractErrorCode(data) {
  if (!data) return '';
  if (typeof data.error === 'string') return data.error;
  const slug = data.error?.slug || data.slug;
  if (typeof slug === 'string' && slug) return slug;
  if (typeof data.error?.code === 'string') return data.error.code;
  if (typeof data.code === 'string') return data.code;
  return '';
}

function errorSlug(err) {
  return String(err?.code || err?.data?.error?.slug || err?.data?.slug || '');
}

export function isSessionNotActiveError(err) {
  const code = errorSlug(err);
  const message = String(err?.message || '');
  const details = String(err?.data?.error?.details || '');
  return code === 'session_not_active'
    || message.includes('session_not_active')
    || details.includes('session_not_active')
    || details.includes('active session not found')
    || err?.status === 409;
}

export function isDebriefTerminalError(err) {
  const slug = errorSlug(err);
  return slug === 'debrief_failed' || slug === 'session_not_found';
}

function isDebriefRetryableError(err) {
  if (isDebriefTerminalError(err)) return false;
  const slug = errorSlug(err);
  if (slug === 'debrief_not_ready') return true;
  if (err?.name === 'AbortError') return true;
  if (!err?.status) return true;
  return err.status === 202 || err.status === 400;
}

export function isInsufficientCoinsError(err) {
  const code = errorSlug(err);
  const message = String(err?.message || '');
  return code === 'insufficient_coins'
    || message.includes('insufficient_coins');
}

export function isRateLimitedError(err) {
  const code = errorSlug(err);
  return err?.status === 429
    || code === 'too_many_requests'
    || code === 'otp_locked';
}

export function isTopicNotMedicalError(err) {
  return errorSlug(err) === 'topic_not_medical';
}

export function walletSpendable(wallet) {
  if (!wallet) return 0;
  return (Number(wallet.free_coins_left) || 0) + (Number(wallet.coins) || 0);
}

export function formatApiError(err, t = (_, fb) => fb) {
  if (isRateLimitedError(err)) {
    const sec = Number(err?.retryAfter) || 0;
    if (errorSlug(err) === 'otp_locked') {
      return sec
        ? t('err.otpLocked', `Kod bloklandi. ${sec} soniyadan keyin yangi kod so'rang.`)
        : t('err.otpLockedShort', "Kod bloklandi. Yangi kod so'rang.");
    }
    return sec
      ? t('err.retryAfter', `Juda ko'p so'rov. ${sec} soniyadan keyin qayta urinib ko'ring.`)
      : t('err.tooMany', "Juda ko'p so'rov. Birozdan so'ng qayta urinib ko'ring.");
  }
  if (isInsufficientCoinsError(err)) {
    return t('sim.insufficientCoins', 'Tangalar yetarli emas');
  }
  if (isTopicNotMedicalError(err)) {
    return t('practice.topicNotMedical', 'Tibbiy mavzu yozing');
  }
  const code = errorSlug(err);
  if (code === 'captcha_failed') return t('err.captcha', 'Captcha tasdiqlanmadi');
  if (code === 'identifier_taken') return t('err.identifierTaken', 'Bu telefon yoki email boshqa hisobda band');
  if (code === 'auth_method_required') return t('err.authMethodRequired', "Uzish uchun boshqa kirish usuli qolishi kerak");
  if (code === 'coin_payment_disabled') return t('err.coinPayDisabled', "Tangadan obuna to'lash o'chirilgan");
  if (code === 'practice_generation_failed') return t('practice.genFailed', "AI yaratolmadi. Qayta urinib ko'ring.");
  if (code === 'timeout') return t('err.timeout', "So'rov vaqti tugadi");
  return err?.message || t('common.error', 'Xatolik yuz berdi');
}

function parseRetryAfter(res) {
  const raw = res?.headers?.get?.('Retry-After');
  if (!raw) return 0;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : 0;
}

function filterActive(list) {
  if (!Array.isArray(list)) return [];
  return list.filter((item) => item?.is_active !== false);
}

export async function registerStoredFcmDevice() {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('fcm_token') : '';
  if (!token) return;
  try {
    await api.registerDevice(token, 'web');
  } catch (err) {
    console.warn('FCM device register skipped:', err.message);
  }
}

async function refreshTokens() {
  // If a refresh is already in flight, all concurrent callers share the EXACT same promise
  if (refreshPromise) {
    return refreshPromise;
  }

  const refresh = getRefreshToken();
  if (!refresh) {
    setToken(null);
    setRefreshToken(null);
    setStoredUser(null);
    if (onUnauthorizedCallback) onUnauthorizedCallback();
    throw new Error('No refresh token available');
  }

  refreshPromise = (async () => {
    try {
      const res = await fetch('/auth/token/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refresh }),
      });

      if (!res.ok) {
        // Refresh token itself is dead/expired -> kill session and force login
        setToken(null);
        setRefreshToken(null);
        setStoredUser(null);
        if (onUnauthorizedCallback) onUnauthorizedCallback();
        throw new Error('Token refresh rejected');
      }

      const data = await res.json();
      if (data.access_token) setToken(data.access_token);
      if (data.refresh_token) setRefreshToken(data.refresh_token);
      return data;
    } catch (err) {
      setToken(null);
      setRefreshToken(null);
      setStoredUser(null);
      if (onUnauthorizedCallback) onUnauthorizedCallback();
      throw err;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ============================================================
// Base request helper with proxy support & auto token refresh
// ============================================================
async function request(path, options = {}) {
  const token = getToken();
  const lang = getLang();
  const {
    quiet,
    timeoutMs,
    captchaToken,
    headers: extraHeaders,
    body: rawBody,
    signal: userSignal,
    ...fetchRest
  } = options;

  const headers = {
    Accept: 'application/json',
    'Accept-Language': lang,
    ...(extraHeaders || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (captchaToken) {
    headers['X-Captcha-Token'] = captchaToken;
  }

  let body = rawBody;
  if (body && !(body instanceof FormData) && typeof body === 'object') {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  let abortCtrl = null;
  let timer = null;
  let signal = userSignal;
  if (timeoutMs) {
    abortCtrl = new AbortController();
    if (userSignal) {
      if (userSignal.aborted) abortCtrl.abort();
      else userSignal.addEventListener('abort', () => abortCtrl.abort(), { once: true });
    }
    timer = setTimeout(() => abortCtrl.abort(), timeoutMs);
    signal = abortCtrl.signal;
  }

  const throwHttpError = (res, data, text = '') => {
    if (res.status === 401 && !getRefreshToken() && !path.startsWith('/mobile/auth/')) {
      if (onUnauthorizedCallback) onUnauthorizedCallback();
    }
    const errorText = data?.error?.details
      || data?.error?.message
      || (typeof data?.error === 'string' ? data.error : null)
      || data?.message
      || text
      || `Xatolik: ${res.status}`;
    throw new ApiError(errorText, {
      status: res.status,
      code: extractErrorCode(data) || (String(text).includes('session_not_active') ? 'session_not_active' : ''),
      data,
      retryAfter: parseRetryAfter(res),
    });
  };

  try {
    let res = await fetch(path, { ...fetchRest, headers, body, signal });

    if (res.status === 401 && getRefreshToken() && path !== '/auth/token/refresh' && !path.startsWith('/mobile/auth/')) {
      try {
        await refreshTokens();
        headers.Authorization = `Bearer ${getToken()}`;
        res = await fetch(path, { ...fetchRest, headers, body, signal });
      } catch (refreshErr) {
        console.warn(`Session refresh failed for [${path}]:`, refreshErr.message);
        throw refreshErr;
      }
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('text/html')) {
      throw new ApiError('API HTML qaytardi (proxy/rewrite ishlamadi)', { status: res.status });
    }
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) throwHttpError(res, data);
      return data;
    }

    const text = await res.text();
    let parsed = null;
    try { parsed = text ? JSON.parse(text) : null; } catch { /* not json */ }
    if (!res.ok) throwHttpError(res, parsed, text);
    return parsed !== null ? parsed : text;
  } catch (err) {
    if (err?.name === 'AbortError' && timeoutMs) {
      throw new ApiError("So'rov vaqti tugadi", { status: 0, code: 'timeout' });
    }
    if (err?.name !== 'AbortError' && !quiet) {
      console.error(`API Error [${path}]:`, err.message);
    }
    throw err;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

// ============================================================
// API Endpoints (all from API_MOBILE.md)
// ============================================================
// Backend javoblari turlicha o'ralgan bo'lishi mumkin (massiv yoki {categories:[]}/{data:[]}).
// user-panel.html dagi extractList bilan bir xil: birinchi massiv maydonini oladi.
export function extractList(json) {
  if (Array.isArray(json)) return json;
  if (json && typeof json === 'object') {
    for (const k of Object.keys(json)) {
      if (Array.isArray(json[k])) return json[k];
    }
    if (json.data && typeof json.data === 'object' && !Array.isArray(json.data)) {
      return extractList(json.data);
    }
  }
  return [];
}

function normalizeLevelItem(item) {
  if (!item || typeof item !== 'object') return null;
  const level_number = Number(item.level_number ?? item.level);
  const required_xp = Number(item.required_xp ?? item.xp_required ?? 0);
  if (!Number.isFinite(level_number) || level_number <= 0) return null;
  return {
    ...item,
    level_number,
    required_xp: Number.isFinite(required_xp) ? required_xp : 0,
  };
}

/** Level ro‘yxatini level_number bo‘yicha tartiblaydi. */
export function normalizeLevels(res) {
  return extractList(res)
    .map(normalizeLevelItem)
    .filter(Boolean)
    .sort((a, b) => a.level_number - b.level_number);
}

function listTotal(res) {
  if (typeof res?.total === 'number') return res.total;
  if (typeof res?.count === 'number') return res.count;
  return extractList(res).length;
}

let topicTotalCache = null;
let topicTotalInflight = null;
let levelsCache = null;
let levelsCacheLang = null;
let levelsInflight = null;

export function peekTopicTotal() {
  return topicTotalCache;
}

export function peekLevels() {
  return levelsCache;
}

// Backend baʼzan matnni {uz,ru,en} obyekt sifatida qaytaradi (admin modellari). UI esa oddiy satr kutadi.
export function localizeText(v) {
  if (v && typeof v === 'object') {
    const lang = getLang();
    return v[lang] || v.uz || v.ru || v.en || '';
  }
  return v ?? '';
}

const LOCALIZED_KEYS = ['name', 'title', 'subtitle', 'chief_complaint', 'category_name', 'topic_name', 'description'];
function localizeItem(item) {
  if (!item || typeof item !== 'object') return item;
  const out = { ...item };
  for (const k of LOCALIZED_KEYS) {
    if (out[k] && typeof out[k] === 'object') out[k] = localizeText(out[k]);
  }
  return out;
}

// WebSocket brauzerda Vercel rewrite orqali o'tmaydi, shuning uchun to'g'ridan-to'g'ri backendga ulanadi.
const API_ORIGIN = import.meta.env.VITE_API_BASE || 'https://prod.tibstation.uz';

/** Absolute URL for backend media (icon_url, cover_image_url, image_url). */
export function resolveMediaUrl(url) {
  if (typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) return trimmed;
  if (trimmed.startsWith('//')) return `${typeof window !== 'undefined' ? window.location.protocol : 'https:'}${trimmed}`;
  const origin = API_ORIGIN.replace(/\/$/, '');
  return trimmed.startsWith('/') ? `${origin}${trimmed}` : `${origin}/${trimmed}`;
}

export const api = {

  // ===================== AUTHENTICATION =====================

  /** Google orqali kirish (1 bosqichli) */
  loginWithGoogle: async (idToken) => {
    const payload = { id_token: idToken };
    return await request('/mobile/auth/google', {
      method: 'POST',
      body: payload,
    });
  },

  /** Check user exists */
  checkUser: async (identifier) => {
    return await request('/mobile/auth/user/check', {
      method: 'POST',
      body: { identifier },
    });
  },

  /** Send OTP code (type must be 'email' or 'telegram') */
  sendOtp: async (identifier, type = 'email', captchaToken) => {
    return await request('/mobile/auth/user/otp/send', {
      method: 'POST',
      body: { identifier, type },
      ...(captchaToken ? { captchaToken } : {}),
    });
  },

  /** Confirm OTP code (type must be 'email' or 'telegram') */
  confirmOtp: async (identifier, confirmationCode, type = 'email') => {
    return await request('/mobile/auth/user/otp/confirm', {
      method: 'POST',
      body: { confirmation_code: confirmationCode, identifier, type },
    });
  },

  // ===================== USER PROFILE =====================

  /** Get levels list */
  getLevels: async () => {
    const lang = getLang();
    if (levelsCache?.length && levelsCacheLang === lang) return levelsCache;
    if (levelsInflight) return levelsInflight;
    const load = async (path) => normalizeLevels(await request(path));
    levelsInflight = (async () => {
      try {
        const list = await load('/mobile/level');
        if (list.length) return list;
      } catch {
        // /web/level — admin statik jadval, mobile bo‘sh yoki 404 bo‘lsa
      }
      return load('/web/level');
    })();
    try {
      const list = await levelsInflight;
      levelsCache = list;
      levelsCacheLang = lang;
      return list;
    } finally {
      levelsInflight = null;
    }
  },

  /** Get user profile */
  getUserProfile: async () => {
    return await request('/mobile/user/get/profile');
  },

  /** Update user profile (multipart/form-data) */
  updateUserProfile: async ({ name, phone_number, email, language, image }) => {
    const formData = new FormData();
    if (name) formData.append('name', name);
    if (phone_number) formData.append('phone_number', phone_number);
    if (email) formData.append('email', email);
    if (language) formData.append('language', language);
    if (image) formData.append('image', image);

    return await request('/mobile/user/update/profile', {
      method: 'PUT',
      body: formData,
    });
  },

  /** Delete user profile */
  deleteProfile: async () => {
    return await request('/mobile/user/delete/profile', {
      method: 'DELETE',
    });
  },

  /** Get user daily limit */
  getUserLimit: async () => {
    return await request('/mobile/user/limit');
  },

  /**
   * Get user activity stats.
   * `activity` = number of FINISHED cases (counted by the backend automatically on
   * simulation finish; the client must NOT write it — POST /mobile/user/activity is not used).
   * Zero-activity days are included. Day boundaries are UTC for now (backend will move to UTC+5).
   */
  getUserActivity: async (type = 'day', params = {}) => {
    const query = new URLSearchParams({ type });
    if (params.date) query.set('date', params.date);
    if (params.from) query.set('from', params.from);
    if (params.to) query.set('to', params.to);
    return await request(`/mobile/user/activity?${query.toString()}`);
  },

  /** Get leaderboard / rating */
  getUserRating: async (type = 'total', limit = 10) => {
    return await request(`/mobile/user/rating?type=${type}&limit=${limit}`);
  },

  // ===================== DEVICE (FCM Push) =====================

  /** Register FCM token */
  registerDevice: async (fcmToken, platform = 'web') => {
    return await request('/mobile/user/device', {
      method: 'POST',
      body: { fcm_token: fcmToken, platform },
    });
  },

  // ===================== CATEGORIES =====================

  /** Get all categories (live: paginated `{ data }`; swagger: `{ categories, count }`) */
  getCategories: async () => {
    const res = await request('/mobile/category');
    const list = Array.isArray(res?.data)
      ? res.data
      : (Array.isArray(res?.categories) ? res.categories : extractList(res));
    return filterActive(list.map(localizeItem));
  },

  /** Get single category by ID */
  getCategoryById: async (id) => {
    return await request(`/mobile/category/${id}`);
  },

  // ===================== TOPICS =====================

  /** Get topics (live paginated `{ data }`; swagger `{ topics, count }`) */
  getTopics: async (categoryId, limit = 100, page = 1) => {
    const query = new URLSearchParams({ limit, page });
    if (categoryId) query.set('category_id', categoryId);
    const res = await request(`/mobile/topic?${query.toString()}`);
    const list = Array.isArray(res?.data)
      ? res.data
      : (Array.isArray(res?.topics) ? res.topics : extractList(res));
    return filterActive(list.map(localizeItem));
  },

  /** Topic catalog total (`total`/`count`; GET /case ni kutmaydi). */
  getTopicTotal: async () => {
    if (typeof topicTotalCache === 'number') return topicTotalCache;
    if (topicTotalInflight) return topicTotalInflight;
    topicTotalInflight = (async () => {
      try {
        const res = await request('/mobile/topic?limit=1&page=1');
        const n = listTotal(res);
        if (n) return n;
      } catch {
        // fallback below
      }
      const list = await api.getTopics(undefined, 100, 1).catch(() => []);
      return Array.isArray(list) ? list.length : 0;
    })();
    try {
      const n = await topicTotalInflight;
      topicTotalCache = n;
      return n;
    } finally {
      topicTotalInflight = null;
    }
  },

  /** Catalog totals for home stats (`total`/`count` from list; GET /case 400 bo'lsa fallback). */
  getCatalogCounts: async (existingCats = []) => {
    const topics = await api.getTopicTotal();
    let cases = 0;
    try {
      cases = listTotal(await request('/mobile/case?limit=1&page=1'));
    } catch {
      cases = 0;
    }
    if (!cases) {
      const cats = existingCats.length
        ? existingCats
        : await api.getCategories().catch(() => []);
      cases = cats.reduce((sum, cat) => sum + (Number(cat.cases_count) || 0), 0);
    }
    return { topics, cases };
  },

  // ===================== CASES =====================

  /** Get cases catalog */
  getCases: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.topic_id) query.set('topic_id', params.topic_id);
    if (params.category_id) query.set('category_id', params.category_id);
    if (params.difficulty) query.set('difficulty', params.difficulty);
    if (params.status) query.set('status', params.status);
    if (params.search) query.set('search', params.search);
    query.set('limit', String(params.limit || 100));
    query.set('page', String(params.page || 1));

    const res = await request(`/mobile/case?${query.toString()}`);
    const list = Array.isArray(res?.cases)
      ? res.cases
      : (Array.isArray(res?.data)
        ? res.data
        : (Array.isArray(res?.data?.cases) ? res.data.cases : extractList(res)));
    return list.map(localizeItem);
  },

  /** Barcha sahifalarni yig'ib, to'liq keyslar ro'yxatini qaytaradi (backend limitidan oshib ketganda ham kesilmaydi) */
  getAllCases: async (params = {}, pageSize = 100, maxPages = 10) => {
    const all = [];
    for (let page = 1; page <= maxPages; page += 1) {
      const chunk = await api.getCases({ ...params, limit: pageSize, page });
      all.push(...chunk);
      if (chunk.length < pageSize) break;
    }
    return all;
  },

  /** Get case detail */
  getCaseDetail: async (id) => {
    return localizeItem(await request(`/mobile/case/${id}`));
  },

  /** Get random case (endless practice: topic_id + exclude_id) */
  getRandomCase: async ({ categoryId, difficulty, topicId, excludeId } = {}) => {
    const fetchOnce = (params, quiet = false) => {
      const query = new URLSearchParams();
      if (params.categoryId && params.categoryId !== 'random') query.set('category_id', params.categoryId);
      if (params.difficulty) query.set('difficulty', params.difficulty);
      if (params.topicId) query.set('topic_id', params.topicId);
      if (params.excludeId) query.set('exclude_id', params.excludeId);
      const qs = query.toString();
      return request(`/mobile/case/random${qs ? `?${qs}` : ''}`, quiet ? { quiet: true } : {}).then(localizeItem);
    };

    try {
      return await fetchOnce({ categoryId, difficulty, topicId, excludeId }, Boolean(difficulty));
    } catch (err) {
      // Live katalogda shu qiyinlikdagi keys yo‘q — bo‘lim/mavzu bo‘yicha qayta urinadi.
      if (err?.status === 404 && difficulty) {
        return fetchOnce({ categoryId, topicId, excludeId });
      }
      throw err;
    }
  },

  // ===================== FAVORITES =====================

  /** Get favorites list */
  getFavorites: async (limit = 50, page = 1) => {
    const res = await request(`/mobile/favorite?limit=${limit}&page=${page}`);
    return extractList(res).map(localizeItem);
  },

  /** Toggle favorite */
  toggleFavorite: async (caseId) => {
    return await request('/mobile/favorite', {
      method: 'POST',
      body: { case_id: String(caseId) },
    });
  },

  // ===================== SIMULATION =====================

  /** Get completed simulations */
  getCompletedSimulations: async () => {
    return await request('/mobile/simulation/completed');
  },

  /** Get ongoing simulations */
  getOngoingSimulations: async () => {
    return await request('/mobile/simulation/ongoing');
  },

  /** Start simulation session. `{ useCoins: true }` — kunlik limit tugaganda tanga hisobidan. */
  startSimulation: async (caseId, options = {}) => {
    const durationMinutes = typeof options === 'number' ? options : options.durationMinutes;
    const useCoins = typeof options === 'object' ? options.useCoins : undefined;
    const body = { case_id: caseId };
    if (durationMinutes) body.duration_minutes = durationMinutes;
    if (useCoins) body.use_coins = true;
    return await request('/mobile/simulation/start', {
      method: 'POST',
      body,
    });
  },

  /** Get simulation detail */
  getSimulation: async (sessionId) => {
    return await request(`/mobile/simulation/${sessionId}`);
  },

  /** Send simulation event (action step) */
  sendSimulationEvent: async (sessionId, payload, type = 'question') => {
    // Backend 'question' turida {question}, boshqa turlarda {text} kutadi (audio o'zgarishsiz).
    let shaped = payload;
    if (payload && payload.text !== undefined && !payload.audio_base64) {
      shaped = type === 'question' ? { question: payload.text } : { text: payload.text };
    }
    return await request(`/mobile/simulation/${sessionId}/event`, {
      method: 'POST',
      body: { session_id: sessionId, type, payload: shaped },
    });
  },

  /** Finish simulation */
  /** reason: manual | health_zero | timeout (per Swagger) */
  finishSimulation: async (sessionId, reason = 'manual', opts = {}) => {
    const timeoutMs = opts.timeoutMs ?? 8000;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      return await request(`/mobile/simulation/${sessionId}/finish`, {
        method: 'PUT',
        body: { reason },
        signal: ctrl.signal,
      });
    } finally {
      clearTimeout(timer);
    }
  },

  /** WebSocket URL for live vitals */
  getSimulationWsUrl: (sessionId, wsPath) => {
    const path = wsPath || `/mobile/simulation/${sessionId}/ws`;
    const base = /^wss?:/.test(path) ? '' : API_ORIGIN.replace(/^http/, 'ws').replace(/\/$/, '');
    return `${base}${path}?token=${encodeURIComponent(getToken() || '')}`;
  },

  // ===================== DEBRIEFING =====================

  /** Get debrief report. Birinchi ochish generatsiya qilishi mumkin — default 30s. */
  getDebrief: async (sessionId, opts = {}) => {
    const timeoutMs = opts.timeoutMs ?? 30000;
    const ctrl = new AbortController();
    const onParentAbort = () => ctrl.abort();
    opts.signal?.addEventListener('abort', onParentAbort);
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      return await request(`/mobile/debrief/${sessionId}`, { signal: ctrl.signal });
    } finally {
      clearTimeout(timer);
      opts.signal?.removeEventListener('abort', onParentAbort);
    }
  },

  /**
   * GET /debrief poll.
   * 200 — report. 404 debrief_not_ready — kutish. 404 debrief_failed / session_not_found — to‘xtash.
   * Birinchi so‘rov 5–15 s (generatsiya) — attempt timeout 30s.
   */
  waitForDebrief: async (sessionId, attemptsOrOpts = {}, delayMs = 2000) => {
    const opts = typeof attemptsOrOpts === 'number'
      ? { attempts: attemptsOrOpts, delayMs }
      : (attemptsOrOpts || {});
    const delay = opts.delayMs ?? delayMs;
    const max = opts.attempts ?? Number.POSITIVE_INFINITY;
    const signal = opts.signal;
    const attemptTimeoutMs = opts.timeoutMs ?? 30000;
    const deadlineMs = opts.deadlineMs ?? 50000;
    const started = Date.now();
    for (let i = 0; i < max; i += 1) {
      if (signal?.aborted) return null;
      const remaining = deadlineMs - (Date.now() - started);
      if (remaining <= 0) return null;
      const attemptCtrl = new AbortController();
      const onParentAbort = () => attemptCtrl.abort();
      signal?.addEventListener('abort', onParentAbort);
      const thisTimeout = Math.max(1000, Math.min(attemptTimeoutMs, remaining));
      const attemptTimer = setTimeout(() => attemptCtrl.abort(), thisTimeout);
      try {
        return await request(`/mobile/debrief/${sessionId}`, { signal: attemptCtrl.signal, quiet: true });
      } catch (err) {
        if (signal?.aborted) return null;
        if (isDebriefTerminalError(err)) throw err;
        if (!isDebriefRetryableError(err) || i === max - 1) throw err;
        const wait = Math.min(delay, Math.max(0, deadlineMs - (Date.now() - started)));
        if (wait <= 0) return null;
        await new Promise((r) => {
          const timer = setTimeout(r, wait);
          signal?.addEventListener('abort', () => {
            clearTimeout(timer);
            r();
          }, { once: true });
        });
      } finally {
        clearTimeout(attemptTimer);
        signal?.removeEventListener('abort', onParentAbort);
      }
    }
    return null;
  },

  // ===================== SETTINGS =====================

  /** Get voice setting */
  getVoiceSetting: async () => {
    return await request('/mobile/setting/voice');
  },

  // ===================== PROMOCODES =====================

  /** Get my promocodes */
  getPromocodes: async (limit = 50, page = 1) => {
    const res = await request(`/mobile/promocode?limit=${limit}&page=${page}`);
    return res;
  },

  /** Redeem promocode */
  redeemPromocode: async (code) => {
    return await request('/mobile/promocode/redeem', {
      method: 'POST',
      body: { code },
    });
  },

  // ===================== TARIFFS =====================

  /** Get all tariffs (live paginated `{ data, total }` bo‘lishi mumkin). */
  getTariffs: async (duration) => {
    const parse = (res) => {
      if (Array.isArray(res)) return res;
      if (res && typeof res === 'object') {
        if (Array.isArray(res.tariffs)) return res.tariffs;
        if (Array.isArray(res.items)) return res.items;
        if (Array.isArray(res.data)) return res.data;
        return extractList(res);
      }
      return [];
    };
    const fetchPage = async (page, withPaging) => {
      const query = new URLSearchParams();
      if (duration) query.set('duration', String(duration));
      if (withPaging) {
        query.set('limit', '100');
        query.set('page', String(page));
      }
      const qs = query.toString();
      return request(`/mobile/tariff${qs ? `?${qs}` : ''}`);
    };
    const uniq = (list) => {
      const seen = new Set();
      return list.filter((t) => {
        const id = t?.id || `${t?.kind}-${t?.name}-${t?.price}`;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });
    };

    const collect = async (paged) => {
      const all = [];
      const pageSize = 100;
      for (let page = 1; page <= 30; page += 1) {
        const res = await fetchPage(page, paged);
        const chunk = parse(res).map(localizeItem);
        all.push(...chunk);
        if (!paged) break;
        if (res && typeof res.has_next === 'boolean') {
          if (!res.has_next) break;
          continue;
        }
        const total = listTotal(res);
        const limit = Number(res?.limit) || pageSize;
        if (chunk.length < limit || (total && all.length >= total)) break;
      }
      return all;
    };

    let list = [];
    try {
      list = await collect(true);
    } catch {
      list = [];
    }
    if (!list.length) {
      list = await collect(false);
    }
    return uniq(list);
  },

  /** Get tariff by ID */
  getTariffById: async (id) => {
    return await request(`/mobile/tariff/${id}`);
  },

  // ===================== SUBSCRIPTION =====================

  /** Subscribe to a tariff. Tangadan to'lash o'chirilgan — coins_used yuborilmaydi. */
  subscribe: async (tariffId, coinsUsedOrProvider = 'inpay', provider = 'inpay') => {
    const payProvider = typeof coinsUsedOrProvider === 'string' ? coinsUsedOrProvider : provider;
    return await request('/mobile/subscription', {
      method: 'POST',
      body: { tariff_id: tariffId, provider: payProvider },
    });
  },

  // ===================== STUDY PLAN =====================

  /** Get study plan */
  getStudyPlan: async () => {
    return await request('/mobile/study-plan');
  },

  /** Update study plan */
  updateStudyPlan: async (data) => {
    return await request('/mobile/study-plan', {
      method: 'PUT',
      body: data,
    });
  },

  // ===================== NOTIFICATIONS =====================

  /** Get user notifications */
  getNotifications: async (isRead) => {
    const query = isRead !== undefined ? `?is_read=${isRead}` : '';
    const res = await request(`/mobile/notification/user${query}`);
    const items = extractList(res);
    return {
      notifications: items,
      items,
      count: typeof res?.count === 'number' ? res.count : items.length,
      raw: res,
    };
  },

  /** Mark notification as read */
  markNotificationRead: async (id) => {
    return await request(`/mobile/notification/${id}/read`, {
      method: 'PUT',
    });
  },

  // ===================== BANNERS =====================

  /** Get all banners */
  getBanners: async () => {
    const res = await request('/mobile/banner');
    return extractList(res).map(localizeItem);
  },

  /** Get banner by ID */
  getBannerById: async (id) => {
    return await request(`/mobile/banner/${id}`);
  },

  // ===================== ABOUT =====================

  /** Get about info */
  getAbout: async () => {
    const res = await request('/mobile/about');
    return res.abouts || extractList(res);
  },

  /** Get about by ID */
  getAboutById: async (id) => {
    return await request(`/mobile/about/${id}`);
  },

  // ===================== FAQ =====================

  /** Get FAQs */
  getFaqs: async () => {
    const res = await request('/mobile/faq');
    return res.faqs || extractList(res);
  },

  /** Get FAQ by ID */
  getFaqById: async (id) => {
    return await request(`/mobile/faq/${id}`);
  },

  // ===================== CONTACTS =====================

  /** Get contacts */
  getContacts: async () => {
    const res = await request('/mobile/contact');
    return res.contacts || extractList(res);
  },

  /** Get contact by ID */
  getContactById: async (id) => {
    return await request(`/mobile/contact/${id}`);
  },

  // ===================== APP ROUTES =====================

  /** Get app routes (`support_url` — Telegram; `call_center`) */
  getAppRoutes: async () => {
    const res = await request('/mobile/app-route');
    return extractList(res);
  },

  /** Get app route by ID */
  getAppRouteById: async (id) => {
    return await request(`/mobile/app-route/${id}`);
  },

  // ===================== PARTNERS =====================

  /** Get partners */
  getPartners: async () => {
    const res = await request('/mobile/partner');
    return res.partners || res.data || [];
  },

  // ===================== PRACTICE WALLET / SESSIONS =====================

  getPracticeWallet: async () => {
    return await request('/mobile/practice/wallet');
  },

  startPracticeSession: async (payload, opts = {}) => {
    return await request('/mobile/practice/sessions', {
      method: 'POST',
      body: payload,
      timeoutMs: opts.timeoutMs ?? 60000,
    });
  },

  nextPracticeItem: async (sessionId, opts = {}) => {
    return await request(`/mobile/practice/sessions/${sessionId}/next`, {
      method: 'POST',
      timeoutMs: opts.timeoutMs ?? 60000,
      signal: opts.signal,
    });
  },

  answerPracticeItem: async (itemId, answer, opts = {}) => {
    return await request(`/mobile/practice/items/${itemId}/answer`, {
      method: 'POST',
      body: { answer },
      timeoutMs: opts.timeoutMs ?? 60000,
      signal: opts.signal,
    });
  },

  finishPracticeSession: async (sessionId) => {
    return await request(`/mobile/practice/sessions/${sessionId}/finish`, {
      method: 'POST',
    });
  },

  getPracticeSessions: async (limit = 20, page = 1) => {
    const res = await request(`/mobile/practice/sessions?limit=${limit}&page=${page}`);
    return {
      sessions: extractList(res),
      total: listTotal(res),
      raw: res,
    };
  },

  getPracticeSession: async (sessionId) => {
    return await request(`/mobile/practice/sessions/${sessionId}`);
  },

  reportPracticeItem: async (itemId, reason) => {
    return await request(`/mobile/practice/items/${itemId}/report`, {
      method: 'POST',
      body: { reason },
    });
  },

  // ===================== FLASHCARDS =====================

  getFlashcardDue: async (limit = 20, deckId) => {
    const query = new URLSearchParams({ limit: String(limit) });
    if (deckId) query.set('deck_id', deckId);
    return await request(`/mobile/flashcard/due?${query.toString()}`);
  },

  reviewFlashcard: async (cardId, rating) => {
    return await request(`/mobile/flashcard/cards/${cardId}/review`, {
      method: 'POST',
      body: { rating },
    });
  },

  getFlashcardStats: async () => {
    return await request('/mobile/flashcard/stats');
  },

  getFlashcardDecks: async () => {
    const res = await request('/mobile/flashcard/decks');
    return extractList(res);
  },

  orderFlashcardDeck: async (payload) => {
    return await request('/mobile/flashcard/decks', {
      method: 'POST',
      body: payload,
      timeoutMs: 60000,
    });
  },

  deleteFlashcardDeck: async (deckId) => {
    return await request(`/mobile/flashcard/decks/${deckId}`, { method: 'DELETE' });
  },

  getFlashcardCards: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.deck_id) query.set('deck_id', params.deck_id);
    query.set('limit', String(params.limit || 50));
    query.set('page', String(params.page || 1));
    const res = await request(`/mobile/flashcard/cards?${query.toString()}`);
    return {
      cards: extractList(res),
      total: listTotal(res),
      raw: res,
    };
  },

  getAllFlashcards: async (params = {}, pageSize = 50, maxPages = 20) => {
    const all = [];
    for (let page = 1; page <= maxPages; page += 1) {
      const res = await api.getFlashcardCards({ ...params, limit: pageSize, page });
      const chunk = Array.isArray(res?.cards) ? res.cards : [];
      all.push(...chunk);
      if (chunk.length < pageSize) break;
      if (res.total && all.length >= res.total) break;
    }
    return all;
  },

  /** Due first, then the rest — home carousel. */
  getImportantFlashcards: async (limit = 12) => {
    const dueRes = await api.getFlashcardDue(limit).catch(() => ({ cards: [] }));
    const due = [...(Array.isArray(dueRes?.cards) ? dueRes.cards : [])];
    const seen = new Set(due.map((c) => c?.id).filter(Boolean));
    if (due.length >= limit) return due.slice(0, limit);
    const rest = await api.getAllFlashcards({}, 50, 2).catch(() => []);
    for (const card of rest) {
      if (!card?.id || seen.has(card.id)) continue;
      due.push(card);
      seen.add(card.id);
      if (due.length >= limit) break;
    }
    return due;
  },

  createFlashcard: async (payload) => {
    return await request('/mobile/flashcard/cards', {
      method: 'POST',
      body: payload,
    });
  },

  updateFlashcard: async (cardId, payload) => {
    return await request(`/mobile/flashcard/cards/${cardId}`, {
      method: 'PUT',
      body: payload,
    });
  },

  deleteFlashcard: async (cardId) => {
    return await request(`/mobile/flashcard/cards/${cardId}`, { method: 'DELETE' });
  },

  // ===================== ROADMAP =====================

  getRoadmap: async () => {
    return await request('/mobile/roadmap');
  },

  refreshRoadmap: async () => {
    return await request('/mobile/roadmap/refresh', {
      method: 'POST',
      timeoutMs: 60000,
    });
  },

  // ===================== FEEDBACK =====================

  sendFeedback: async (payload) => {
    return await request('/mobile/feedback', {
      method: 'POST',
      body: payload,
    });
  },

  // ===================== TELEGRAM LOGIN (OTP'siz) =====================

  startTelegramLogin: async (captchaToken) => {
    return await request('/mobile/auth/telegram/start', {
      method: 'POST',
      ...(captchaToken ? { captchaToken } : {}),
    });
  },

  checkTelegramLogin: async (token, referralCode) => {
    const body = { token };
    if (referralCode) body.referral_code = referralCode;
    return await request('/mobile/auth/telegram/check', {
      method: 'POST',
      body,
      quiet: true,
    });
  },

  // ===================== PHONE / EMAIL LINK =====================

  startPhoneLink: async () => {
    return await request('/mobile/user/phone/start', { method: 'POST' });
  },

  confirmPhoneLink: async (token) => {
    return await request('/mobile/user/phone/confirm', {
      method: 'POST',
      body: { token },
    });
  },

  unlinkPhone: async () => {
    return await request('/mobile/user/phone', { method: 'DELETE' });
  },

  sendEmailLink: async (email) => {
    return await request('/mobile/user/email/send', {
      method: 'POST',
      body: { email },
    });
  },

  confirmEmailLink: async (email, code) => {
    return await request('/mobile/user/email/confirm', {
      method: 'POST',
      body: { email, code },
    });
  },

  unlinkEmail: async () => {
    return await request('/mobile/user/email', { method: 'DELETE' });
  },
};
