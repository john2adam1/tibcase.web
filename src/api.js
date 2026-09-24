// TibCase Web API Client — Full integration based on API_MOBILE.md

const DEFAULT_DEV_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE4MDU3Nzk2MDYsImlhdCI6MTc5MDIyNzYwNiwicm9sZSI6ImFkbWluIiwic2Vzc2lvbl9pZCI6IjE3OTAyMjc2MDYzODc0NTg1NzkiLCJ1c2VyX2lkIjoiZDZmMThkOTEtMGMxYi00ZGI3LThiYjEtZmE4ZDc2YmU4ZGU4In0.fEVjg3LBfm9hUC4HJ8qN_Mx-vzlluKSRpoI3lanB8uk";

// ============================================================
// Token & Language helpers
// ============================================================
export const getToken = () => {
  return localStorage.getItem('tibcase_token') || DEFAULT_DEV_TOKEN;
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem('tibcase_token', token);
  } else {
    localStorage.removeItem('tibcase_token');
  }
};

export const getRefreshToken = () => {
  return localStorage.getItem('tibcase_refresh_token') || '';
};

export const setRefreshToken = (token) => {
  if (token) {
    localStorage.setItem('tibcase_refresh_token', token);
  } else {
    localStorage.removeItem('tibcase_refresh_token');
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
  } else {
    localStorage.removeItem('tibcase_user');
  }
};

export const getLang = () => {
  return localStorage.getItem('tibcase_lang') || 'uz';
};

export const setLang = (lang) => {
  localStorage.setItem('tibcase_lang', lang);
};

// ============================================================
// Token refresh
// ============================================================
async function refreshTokens() {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error('No refresh token');
  
  const res = await fetch('/auth/token/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refresh }),
  });

  if (!res.ok) throw new Error('Token refresh failed');
  const data = await res.json();
  
  if (data.access_token) setToken(data.access_token);
  if (data.refresh_token) setRefreshToken(data.refresh_token);
  return data;
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

    // Auto-refresh on 401
    if (res.status === 401) {
      try {
        await refreshTokens();
        // Retry with new token
        headers['Authorization'] = `Bearer ${getToken()}`;
        res = await fetch(path, { ...options, headers });
      } catch {
        console.warn('Token refresh failed, returning 401 response');
      }
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || data?.error?.message || data?.error || `Xatolik: ${res.status}`);
      }
      return data;
    } else {
      const text = await res.text();
      if (!res.ok) throw new Error(text || `Xatolik: ${res.status}`);
      return text;
    }
  } catch (err) {
    console.error(`API Error [${path}]:`, err.message);
    throw err;
  }
}

// ============================================================
// API Endpoints (all from API_MOBILE.md)
// ============================================================
export const api = {

  // ===================== AUTHENTICATION =====================

  /** Google orqali kirish (1 bosqichli) */
  loginWithGoogle: async (idToken, referralCode = '') => {
    return await request('/mobile/auth/google', {
      method: 'POST',
      body: { id_token: idToken, referral_code: referralCode },
    });
  },

  /** Check user exists */
  checkUser: async (identifier) => {
    return await request('/mobile/auth/user/check', {
      method: 'POST',
      body: { identifier },
    });
  },

  /** Send OTP code */
  sendOtp: async (identifier, type = 'phone') => {
    return await request('/mobile/auth/user/otp/send', {
      method: 'POST',
      body: { identifier, type },
    });
  },

  /** Confirm OTP code */
  confirmOtp: async (identifier, confirmationCode, referralCode = '', type = 'phone') => {
    return await request('/mobile/auth/user/otp/confirm', {
      method: 'POST',
      body: { confirmation_code: confirmationCode, identifier, referral_code: referralCode, type },
    });
  },

  // ===================== USER PROFILE =====================

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
  getCategories: async () => {
    try {
      const res = await request('/mobile/category?limit=100');
      return res.categories || res.data || [];
    } catch (err) {
      console.warn('Error fetching categories:', err.message);
      return [];
    }
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
    return res.topics || res.data || [];
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

    try {
      const res = await request(`/mobile/case?${query.toString()}`);
      return res.cases || res.data || [];
    } catch {
      return [];
    }
  },

  /** Get case detail */
  getCaseDetail: async (id) => {
    return await request(`/mobile/case/${id}`);
  },

  /** Get random case */
  getRandomCase: async () => {
    return await request('/mobile/case/random');
  },

  // ===================== FAVORITES =====================

  /** Get favorites list */
  getFavorites: async (limit = 50, page = 1) => {
    const res = await request(`/mobile/favorite?limit=${limit}&page=${page}`);
    return res.cases || res.data || [];
  },

  /** Toggle favorite */
  toggleFavorite: async (caseId) => {
    return await request('/mobile/favorite', {
      method: 'POST',
      body: { case_id: caseId },
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
  startSimulation: async (caseId) => {
    return await request('/mobile/simulation/start', {
      method: 'POST',
      body: { case_id: caseId },
    });
  },

  /** Get simulation detail */
  getSimulation: async (sessionId) => {
    return await request(`/mobile/simulation/${sessionId}`);
  },

  /** Send simulation event (action step) */
  sendSimulationEvent: async (sessionId, payload, type = 'action') => {
    return await request(`/mobile/simulation/${sessionId}/event`, {
      method: 'POST',
      body: { session_id: sessionId, type, payload },
    });
  },

  /** Finish simulation */
  finishSimulation: async (sessionId, reason = 'completed') => {
    return await request(`/mobile/simulation/${sessionId}/finish`, {
      method: 'PUT',
      body: { reason },
    });
  },

  /** WebSocket URL for live vitals */
  getSimulationWsUrl: (sessionId) => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}/mobile/simulation/${sessionId}/ws`;
  },

  // ===================== DEBRIEFING =====================

  /** Get debrief report */
  getDebrief: async (sessionId) => {
    return await request(`/mobile/debrief/${sessionId}`);
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
    try {
      const res = await request(`/mobile/tariff${query}`);
      return res.tariffs || res.data || [];
    } catch {
      return [];
    }
  },

  /** Get tariff by ID */
  getTariffById: async (id) => {
    return await request(`/mobile/tariff/${id}`);
  },

  // ===================== SUBSCRIPTION =====================

  /** Subscribe to a tariff */
  subscribe: async (tariffId, coinsUsed = 0) => {
    return await request('/mobile/subscription', {
      method: 'POST',
      body: { tariff_id: tariffId, coins_used: coinsUsed },
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
    return res;
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
    try {
      const res = await request('/mobile/banner');
      return res.banners || res.data || [];
    } catch {
      return [];
    }
  },

  /** Get banner by ID */
  getBannerById: async (id) => {
    return await request(`/mobile/banner/${id}`);
  },

  // ===================== ABOUT =====================

  /** Get about info */
  getAbout: async () => {
    try {
      const res = await request('/mobile/about');
      return res.abouts || res.data || [];
    } catch {
      return [];
    }
  },

  /** Get about by ID */
  getAboutById: async (id) => {
    return await request(`/mobile/about/${id}`);
  },

  // ===================== FAQ =====================

  /** Get FAQs */
  getFaqs: async () => {
    try {
      const res = await request('/mobile/faq');
      return res.faqs || res.data || [];
    } catch {
      return [];
    }
  },

  /** Get FAQ by ID */
  getFaqById: async (id) => {
    return await request(`/mobile/faq/${id}`);
  },

  // ===================== CONTACTS =====================

  /** Get contacts */
  getContacts: async () => {
    try {
      const res = await request('/mobile/contact');
      return res.contacts || res.data || [];
    } catch {
      return [];
    }
  },

  /** Get contact by ID */
  getContactById: async (id) => {
    return await request(`/mobile/contact/${id}`);
  },

  // ===================== APP ROUTES =====================

  /** Get app routes */
  getAppRoutes: async () => {
    try {
      const res = await request('/mobile/app-route');
      return res.app_routes || res.data || [];
    } catch {
      return [];
    }
  },

  /** Get app route by ID */
  getAppRouteById: async (id) => {
    return await request(`/mobile/app-route/${id}`);
  },

  // ===================== PARTNERS =====================

  /** Get partners */
  getPartners: async () => {
    try {
      const res = await request('/mobile/partner');
      return res.partners || res.data || [];
    } catch {
      return [];
    }
  },
};
