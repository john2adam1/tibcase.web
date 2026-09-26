// TibCase Web API Type Definitions — Strictly generated from API_MOBILE.md / Swagger

export type LanguageCode = 'uz' | 'ru' | 'en';

export interface UserCheckReq {
  identifier: string;
}

export interface UserCheckRes {
  has_account: boolean;
}

export interface SendOtpReq {
  identifier: string;
  type: 'email' | 'telegram';
}

export interface ConfirmOtpReq {
  confirmation_code: string;
  identifier: string;
  referral_code?: string;
  type: 'email' | 'telegram';
}

export interface GoogleLoginReq {
  id_token: string;
  referral_code?: string;
}

export interface AuthTokensRes {
  access_token: string;
  id: string;
  refresh_token: string;
  role: string;
}

/** Swagger definition: models.TokenRes */
export type TokenRes = AuthTokensRes;

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone_number?: string;
  image_url?: string;
  level: number;
  xp: number;
  coins: number;
  streak_count: number;
  specialization?: string;
  language?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserLimitRes {
  has_subscription: boolean;
  remaining: number;
  total: number;
  used: number;
}

export interface ActivityStatItem {
  date?: string;
  activity?: number;
  xp?: number;
  simulations_count?: number;
  [key: string]: any;
}

export interface UserActivityRes {
  items: ActivityStatItem[];
  total: number;
  type: string;
  user_id: string;
}

export interface RatingUserItem {
  id?: string;
  user_id?: string;
  name?: string;
  image_url?: string;
  xp?: number;
  level?: number;
  rank?: number;
  coins?: number;
  specialization?: string;
}

export interface LeaderboardRes {
  items: RatingUserItem[];
  limit: number;
  me?: RatingUserItem;
  type: 'day' | 'week' | 'month' | 'year' | 'total';
}

export interface CategoryMobileRes {
  id: string;
  name: string;
  audience?: string;
  cases_count?: number;
  icon_url?: string;
  order_num?: number;
}

export interface TopicMobileRes {
  id: string;
  name: string;
  category_id?: string;
  cases_count?: number;
  order_num?: number;
}

export interface CaseMobileRes {
  id: string;
  title: string;
  subtitle?: string;
  chief_complaint?: string;
  difficulty: 'easy' | 'medium' | 'hard' | string;
  expected_duration_minutes?: number;
  patient_age?: number;
  patient_gender?: string;
  cover_image_url?: string;
  is_favorite?: boolean;
  status?: 'new' | 'active' | 'completed' | 'failed' | 'abandoned' | string;
  category_id?: string;
  category_name?: string;
  topic_id?: string;
  topic_name?: string;
}

export interface CaseVitals {
  hr?: number;
  bp_sys?: number;
  bp_dia?: number;
  spo2?: number;
  rr?: number;
  temp?: number;
  rhythm?: string;
  [key: string]: any;
}

export interface SimulationStartRes {
  session_id: string;
  case_id: string;
  health_percent: number;
  initial_vitals?: CaseVitals;
  time_limit_seconds?: number;
  visual_state?: string;
  ws_url?: string;
}

export interface SimulationSessionRes {
  id: string;
  case_id: string;
  case_title?: string;
  user_id?: string;
  health_percent?: number;
  status?: string;
  coins_earned?: number;
  xp_earned?: number;
  final_score?: number;
  started_at?: string;
  ended_at?: string;
}

export interface SimulationEventRes {
  health_delta?: number;
  health_percent?: number;
  is_correct?: boolean;
  response?: Record<string, any>;
}

export interface SimulationFinishRes {
  session_id: string;
  final_score: number;
  coins_earned: number;
  xp_earned: number;
  debrief_ready: boolean;
}

export interface DebriefReportRes {
  session_id: string;
  final_score: number;
  coins_earned: number;
  xp_earned: number;
  correct_steps?: string[];
  incorrect_steps?: string[];
  weak_topics?: string[];
  guideline_notes?: string;
  created_at?: string;
}

export interface TariffRes {
  id: string;
  name: string;
  description?: string;
  duration?: number;
  kind?: string;
  price?: number;
  coins?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PromoCodeRes {
  id?: string;
  code?: string;
  discount_percent?: number;
  coins_added?: number;
  used_at?: string;
  created_at?: string;
}

export interface StudyPlanRes {
  is_enabled: boolean;
  remind_minutes_before: number;
  remind_time: string;
  user_id: string;
}

export interface UserNotificationRes {
  id: string;
  title: string;
  message?: string;
  is_read?: boolean;
  created_at?: string;
}

export interface BannerMobileRes {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  link_url?: string;
  order_num?: number;
  created_at?: string;
  updated_at?: string;
}

export interface AboutMobileRes {
  id: string;
  title: string;
  description?: string;
  link_url?: string;
  order_num?: number;
  created_at?: string;
  updated_at?: string;
}

export interface FaqMobileRes {
  id: string;
  question: string;
  answer: string;
  order_num?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ContactRes {
  id: string;
  name: string;
  phone_number?: string;
  link_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AppRouteRes {
  id: string;
  call_center?: string;
  support_url?: string;
  buy_course?: boolean;
  app_links?: Record<string, any>;
  app_version?: Record<string, any>;
  payment_min_version?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PartnerMobileRes {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  link_url?: string;
  order_num?: number;
}
