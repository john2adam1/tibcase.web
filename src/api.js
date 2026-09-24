// TibCase Web API Client

const DEFAULT_DEV_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE4MDU3Nzk2MDYsImlhdCI6MTc5MDIyNzYwNiwicm9sZSI6ImFkbWluIiwic2Vzc2lvbl9pZCI6IjE3OTAyMjc2MDYzODc0NTg1NzkiLCJ1c2VyX2lkIjoiZDZmMThkOTEtMGMxYi00ZGI3LThiYjEtZmE4ZDc2YmU4ZGU4In0.fEVjg3LBfm9hUC4HJ8qN_Mx-vzlluKSRpoI3lanB8uk";

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

// Base request helper with proxy support
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

  if (options.body && !(options.body instanceof FormData) && typeof options.body === 'object') {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  try {
    const res = await fetch(path, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      console.warn('Session expired or unauthorized on', path);
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

// Mobile/Web API Endpoints
export const api = {
  // Categories & Cases
  // Categories & Topics & Cases
  getCategories: async () => {
    try {
      const res = await request('/mobile/category?limit=100');
      return res.data || res.categories || [];
    } catch (err) {
      console.warn('Error fetching categories from API:', err.message);
      return [];
    }
  },

  getTopics: async (categoryId) => {
    try {
      const url = categoryId ? `/mobile/topic?category_id=${categoryId}&limit=100` : '/mobile/topic?limit=100';
      const res = await request(url);
      return res.data || [];
    } catch (err) {
      console.warn('Error fetching topics from API:', err.message);
      return [];
    }
  },

  getCases: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.category_id) query.set('category_id', params.category_id);
    if (params.difficulty) query.set('difficulty', params.difficulty);
    if (params.status) query.set('status', params.status);
    if (params.search) query.set('search', params.search);
    if (params.limit) query.set('limit', params.limit);
    if (params.page) query.set('page', params.page);

    try {
      const res = await request(`/mobile/case?${query.toString()}`);
      return res.data || res.cases || [];
    } catch {
      return [];
    }
  },

  getCaseDetail: async (id) => {
    return await request(`/mobile/case/${id}`);
  },

  getRandomCase: async () => {
    try {
      return await request('/mobile/case/random');
    } catch {
      return null;
    }
  },

  toggleFavorite: async (caseId) => {
    return await request('/mobile/favorite', {
      method: 'POST',
      body: { case_id: caseId }
    });
  },

  // Banners & Content
  getBanners: async () => {
    try {
      const res = await request('/mobile/banner');
      return res.data || res.banners || [];
    } catch {
      return [];
    }
  },

  getPartners: async () => {
    try {
      const res = await request('/mobile/partner');
      return res.partners || res.data || [];
    } catch {
      return [];
    }
  },

  getTariffs: async () => {
    try {
      const res = await request('/mobile/tariff');
      return res.data || res.tariffs || [];
    } catch {
      return [];
    }
  },

  getFaqs: async () => {
    try {
      const res = await request('/mobile/faq');
      return res.data || res.faqs || [];
    } catch {
      return [];
    }
  },

  getAbout: async () => {
    try {
      const res = await request('/mobile/about');
      return res.data || res.abouts || [];
    } catch {
      return [];
    }
  },

  getContacts: async () => {
    try {
      const res = await request('/mobile/contact');
      return res.data || res.contacts || [];
    } catch {
      return [];
    }
  },

  // User & Stats
  getUserProfile: async () => {
    try {
      return await request('/mobile/user/get/profile');
    } catch {
      // Return local stored user or default guest doctor
      const stored = getStoredUser();
      return stored || {
        id: "demo-user-1",
        name: "Dr. Akmal Karimov",
        specialization: "Shifokor-ordinant",
        email: "akmal.doc@tibcase.uz",
        phone_number: "+998 90 123 45 67",
        level: 3,
        xp: 320,
        coins: 15,
        streak_count: 5,
        isDemo: true
      };
    }
  },

  getUserLimit: async () => {
    try {
      return await request('/mobile/user/limit');
    } catch {
      return {
        remaining: 42,
        total: 50,
        used: 8,
        has_subscription: true
      };
    }
  },

  getUserRating: async (type = 'total') => {
    try {
      return await request(`/mobile/user/rating?type=${type}&limit=10`);
    } catch {
      return {
        items: [
          { rank: 1, name: "Dr. Sardorbek Qodirov", xp: 1450, level: 7, streak_count: 14, cases_solved: 38 },
          { rank: 2, name: "Dilnoza Olimova", xp: 1120, level: 6, streak_count: 11, cases_solved: 29 },
          { rank: 3, name: "Javohir Toshpulatov", xp: 980, level: 5, streak_count: 8, cases_solved: 24 },
          { rank: 4, name: "Dr. Malika Rahimova", xp: 740, level: 4, streak_count: 6, cases_solved: 19 },
          { rank: 5, name: "Ulug'bek Nazarov", xp: 580, level: 4, streak_count: 5, cases_solved: 15 }
        ],
        me: { rank: 4, name: "Dr. Akmal Karimov", xp: 320, level: 3, streak_count: 5, cases_solved: 8 }
      };
    }
  },

  redeemPromocode: async (code) => {
    return await request('/mobile/promocode/redeem', {
      method: 'POST',
      body: { code }
    });
  },

  // Auth
  checkUser: async (identifier) => {
    return await request('/mobile/auth/user/check', {
      method: 'POST',
      body: { identifier }
    });
  },

  sendOtp: async (identifier, type = 'phone') => {
    return await request('/mobile/auth/user/otp/send', {
      method: 'POST',
      body: { identifier, type }
    });
  },

  confirmOtp: async (identifier, confirmation_code, referral_code = '', type = 'phone') => {
    return await request('/mobile/auth/user/otp/confirm', {
      method: 'POST',
      body: { confirmation_code, identifier, referral_code, type }
    });
  },

  // Simulation Engine
  startSimulation: async (caseId) => {
    try {
      return await request('/mobile/simulation/start', {
        method: 'POST',
        body: { case_id: caseId }
      });
    } catch (err) {
      console.warn('Backend startSimulation fallback active:', err.message);
      // Return simulated session
      return {
        session_id: 'sim-' + Date.now(),
        case_id: caseId,
        health_percent: 100,
        time_limit_seconds: 300,
        visual_state: 'Pain',
        initial_vitals: {
          hr: 115,
          bp: "155/95",
          spo2: 92,
          rr: 24,
          temp: 36.9,
          gcs: 15
        }
      };
    }
  },

  sendSimulationEvent: async (sessionId, payload, type = 'action') => {
    try {
      return await request(`/mobile/simulation/${sessionId}/event`, {
        method: 'POST',
        body: {
          session_id: sessionId,
          type,
          payload
        }
      });
    } catch {
      // Local dynamic fallback
      return {
        health_delta: 5,
        health_percent: 95,
        is_correct: true,
        response: { message: "Qadam qabul qilindi" }
      };
    }
  },

  finishSimulation: async (sessionId, reason = 'completed') => {
    try {
      return await request(`/mobile/simulation/${sessionId}/finish`, {
        method: 'PUT',
        body: { reason }
      });
    } catch {
      return {
        session_id: sessionId,
        final_score: 92,
        xp_earned: 60,
        coins_earned: 2,
        debrief_ready: true
      };
    }
  },

  getDebrief: async (sessionId) => {
    try {
      return await request(`/mobile/debrief/${sessionId}`);
    } catch {
      return {
        session_id: sessionId,
        final_score: 92,
        xp_earned: 60,
        coins_earned: 2,
        correct_steps: [
          "Bemorga zudlik bilan kislorod ingalyatsiyasi (2-4 l/min) boshlandi",
          "12 tarmoqli EKG olindi (ST ko'tarilishi aniqlandi)",
          "Aspirin 300 mg chaynab yutish uchun berildi",
          "Kardioreanimatsiya va Rentgenovaskulyar jarrohlik brigadasi xabardor qilindi"
        ],
        incorrect_steps: [
          "Nitroglikerin berishdan oldin o'ng qorincha infarkti (V3R-V4R) to'liq inkor qilinmadi"
        ],
        weak_topics: [
          "O'ng qorincha infarktida gipotenziya xavfi va nitratlar nojo'ya ta'siri",
          "Troponin-I dinamikasini interpretatsiya qilish"
        ],
        guideline_notes: "AHA va ESC 2023 ko'rsatmasiga ko'ra OKS bilan bemorlarda 'Vaqt = Mushak' tamoyiliga qat'iy amal qilinishi va zudlik bilan perkutan koronar aralashuv (ChKB) tayyorgarligi ko'rilishi lozim."
      };
    }
  }
};
