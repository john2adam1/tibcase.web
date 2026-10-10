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
  constructor(message, { status = 0, code = '', data = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

function extractErrorCode(data) {
  if (!data) return '';
  if (typeof data.error === 'string') return data.error;
  if (data.error?.code) return data.error.code;
  if (typeof data.code === 'string') return data.code;
  return '';
}

export function isSessionNotActiveError(err) {
  const code = err?.code || '';
  const message = String(err?.message || '');
  return code === 'session_not_active'
    || message.includes('session_not_active')
    || (err?.status === 409 && (code === 'session_not_active' || message.includes('session_not_active')));
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

  const headers = {
    'Accept': 'application/json',
    'Accept-Language': lang,
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Handle JSON body
  if (options.body && !(options.body instanceof FormData) && typeof options.body === 'object') {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  try {
    let res = await fetch(path, { ...options, headers });

    // Auto-refresh on 401 if refresh token is present (bypass for auth endpoints)
    if (res.status === 401 && getRefreshToken() && path !== '/auth/token/refresh' && !path.startsWith('/mobile/auth/')) {
      try {
        await refreshTokens();
        // Retry original request with newly acquired token
        headers['Authorization'] = `Bearer ${getToken()}`;
        res = await fetch(path, { ...options, headers });
      } catch (refreshErr) {
        console.warn(`Session refresh failed for [${path}]:`, refreshErr.message);
        throw refreshErr;
      }
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401 && !getRefreshToken() && !path.startsWith('/mobile/auth/')) {
          if (onUnauthorizedCallback) onUnauthorizedCallback();
        }
        const errorText = data?.error?.details || data?.error?.message || (typeof data?.error === 'string' ? data.error : null) || data?.message || `Xatolik: ${res.status}`;
        throw new ApiError(errorText, {
          status: res.status,
          code: extractErrorCode(data),
          data,
        });
      }
      return data;
    } else {
      const text = await res.text();
      let parsed = null;
      try { parsed = text ? JSON.parse(text) : null; } catch {}
      if (!res.ok) {
        if (res.status === 401 && !getRefreshToken() && !path.startsWith('/mobile/auth/')) {
          if (onUnauthorizedCallback) onUnauthorizedCallback();
        }
        const errorText = parsed?.error?.details || parsed?.error?.message || (typeof parsed?.error === 'string' ? parsed.error : null) || parsed?.message || text || `Xatolik: ${res.status}`;
        throw new ApiError(errorText, {
          status: res.status,
          code: extractErrorCode(parsed) || (text.includes('session_not_active') ? 'session_not_active' : ''),
          data: parsed,
        });
      }
      return parsed !== null ? parsed : text;
    }
  } catch (err) {
    console.error(`API Error [${path}]:`, err.message);
    throw err;
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
  }
  return [];
}

// WebSocket brauzerda Vercel rewrite orqali o'tmaydi, shuning uchun to'g'ridan-to'g'ri backendga ulanadi.
const API_ORIGIN = import.meta.env.VITE_API_BASE || 'https://prod.tibstation.uz';

export const api = {

  // ===================== AUTHENTICATION =====================

  /** Google orqali kirish (1 bosqichli) */
  loginWithGoogle: async (idToken, referralCode = '') => {
    const payload = { id_token: idToken };
    if (referralCode && typeof referralCode === 'string' && referralCode.trim()) {
      payload.referral_code = referralCode.trim();
    }
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
  sendOtp: async (identifier, type = 'email') => {
    return await request('/mobile/auth/user/otp/send', {
      method: 'POST',
      body: { identifier, type },
    });
  },

  /** Confirm OTP code (type must be 'email' or 'telegram') */
  confirmOtp: async (identifier, confirmationCode, referralCode = '', type = 'email') => {
    return await request('/mobile/auth/user/otp/confirm', {
      method: 'POST',
      body: { confirmation_code: confirmationCode, identifier, referral_code: referralCode, type },
    });
  },

  // ===================== USER PROFILE =====================

  /** Get levels list */
  getLevels: async () => {
    try {
      const res = await request('/mobile/level');
      return extractList(res);
    } catch {
      const res = await request('/web/level');
      return extractList(res);
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

  /** Get user activity stats */
  getUserActivity: async (type = 'day', params = {}) => {
    const query = new URLSearchParams({ type });
    if (params.date) query.set('date', params.date);
    if (params.from) query.set('from', params.from);
    if (params.to) query.set('to', params.to);
    return await request(`/mobile/user/activity?${query.toString()}`);
  },

  /** Post user activity */
  postUserActivity: async (activity) => {
    return await request('/mobile/user/activity', {
      method: 'POST',
      body: { activity },
    });
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

  /** Remove FCM token (logout) */
  removeDevice: async (fcmToken) => {
    return await request('/mobile/user/device', {
      method: 'DELETE',
      body: { fcm_token: fcmToken },
    });
  },

  // ===================== REFERRAL =====================

  /** Get referral info */
  getReferral: async () => {
    return await request('/mobile/referral');
  },

  // ===================== CATEGORIES =====================

  /** Get all categories */
  getCategories: async (audience) => {
    const query = new URLSearchParams({ limit: 100, page: 1 });
    if (audience) query.set('audience', audience);
    return extractList(await request(`/mobile/category?${query.toString()}`));
  },

  /** Get single category by ID */
  getCategoryById: async (id) => {
    return await request(`/mobile/category/${id}`);
  },

  // ===================== TOPICS =====================

  /** Get topics */
  getTopics: async (categoryId, limit = 100, page = 1) => {
    const query = new URLSearchParams({ limit, page });
    if (categoryId) query.set('category_id', categoryId);
    const res = await request(`/mobile/topic?${query.toString()}`);
    return extractList(res);
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
    if (params.limit) query.set('limit', params.limit);
    if (params.page) query.set('page', params.page);

    const res = await request(`/mobile/case?${query.toString()}`);
    return extractList(res);
  },

  /** Get case detail */
  getCaseDetail: async (id) => {
    return await request(`/mobile/case/${id}`);
  },

  /** Get random case */
  getRandomCase: async ({ categoryId, difficulty } = {}) => {
    const query = new URLSearchParams();
    if (categoryId && categoryId !== 'random') query.set('category_id', categoryId);
    if (difficulty) query.set('difficulty', difficulty);
    const qs = query.toString();
    return await request(`/mobile/case/random${qs ? `?${qs}` : ''}`);
  },

  // ===================== FAVORITES =====================

  /** Get favorites list */
  getFavorites: async (limit = 50, page = 1) => {
    const res = await request(`/mobile/favorite?limit=${limit}&page=${page}`);
    return extractList(res);
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

  /** Start simulation session */
  startSimulation: async (caseId, durationMinutes) => {
    const body = { case_id: caseId };
    if (durationMinutes) body.duration_minutes = durationMinutes;
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
  finishSimulation: async (sessionId, reason = 'manual') => {
    return await request(`/mobile/simulation/${sessionId}/finish`, {
      method: 'PUT',
      body: { reason },
    });
  },

  /** WebSocket URL for live vitals */
  getSimulationWsUrl: (sessionId, wsPath) => {
    const path = wsPath || `/mobile/simulation/${sessionId}/ws`;
    const base = /^wss?:/.test(path) ? '' : API_ORIGIN.replace(/^http/, 'ws').replace(/\/$/, '');
    return `${base}${path}?token=${encodeURIComponent(getToken() || '')}`;
  },

  // ===================== DEBRIEFING =====================

  /** Get debrief report */
  getDebrief: async (sessionId) => {
    return await request(`/mobile/debrief/${sessionId}`);
  },

  /** Debrief fonda tayyorlanadi (tayyor bo'lguncha 400) - tayyor bo'lguncha qayta so'raydi. */
  waitForDebrief: async (sessionId, attempts = 10, delayMs = 2000) => {
    for (let i = 0; i < attempts; i += 1) {
      try {
        return await request(`/mobile/debrief/${sessionId}`);
      } catch (err) {
        if (i === attempts - 1) throw err;
        await new Promise((r) => setTimeout(r, delayMs));
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

  /** Get all tariffs */
  getTariffs: async (duration) => {
    const query = duration ? `?duration=${duration}` : '';
    const res = await request(`/mobile/tariff${query}`);
    if (Array.isArray(res)) return res;
    if (res && typeof res === 'object') {
      if (Array.isArray(res.tariffs)) return res.tariffs;
      if (Array.isArray(res.items)) return res.items;
      if (Array.isArray(res.data)) return res.data;
      for (const k of Object.keys(res)) {
        if (Array.isArray(res[k])) return res[k];
      }
    }
    return [];
  },

  /** Get tariff by ID */
  getTariffById: async (id) => {
    return await request(`/mobile/tariff/${id}`);
  },

  // ===================== SUBSCRIPTION =====================

  /** Subscribe to a tariff */
  subscribe: async (tariffId, coinsUsed = 0, provider = 'click') => {
    return await request('/mobile/subscription', {
      method: 'POST',
      body: { tariff_id: tariffId, coins_used: coinsUsed, provider },
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
    return res.banners || res.data || [];
  },

  /** Get banner by ID */
  getBannerById: async (id) => {
    return await request(`/mobile/banner/${id}`);
  },

  // ===================== ABOUT =====================

  /** Get about info */
  getAbout: async () => {
    const res = await request('/mobile/about');
    return res.abouts || res.data || [];
  },

  /** Get about by ID */
  getAboutById: async (id) => {
    return await request(`/mobile/about/${id}`);
  },

  // ===================== FAQ =====================

  /** Get FAQs */
  getFaqs: async () => {
    const res = await request('/mobile/faq');
    return res.faqs || res.data || [];
  },

  /** Get FAQ by ID */
  getFaqById: async (id) => {
    return await request(`/mobile/faq/${id}`);
  },

  // ===================== CONTACTS =====================

  /** Get contacts */
  getContacts: async () => {
    const res = await request('/mobile/contact');
    return res.contacts || res.data || [];
  },

  /** Get contact by ID */
  getContactById: async (id) => {
    return await request(`/mobile/contact/${id}`);
  },

  // ===================== APP ROUTES =====================

  /** Get app routes */
  getAppRoutes: async () => {
    const res = await request('/mobile/app-route');
    return res.app_routes || res.data || [];
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
};
