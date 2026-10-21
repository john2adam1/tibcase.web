# 📱 Mobil ilova API — Frontend uchun qo'llanma

User-web / mobil ilova uchun **yagona API shartnomasi**. Swagger ro'yxati asos,
lekin javob maydonlari, xato kodlari va oqim qoidalari (ovoz, auto-finish,
urinishlar) shu yerda to'liq yuritiladi.

- **Base URL:** deploy qilingan domen (masalan `https://prod.tibstation.uz`), path'lar shu yerda ko'rsatilganidek qo'shiladi (masalan `/mobile/category`).
- **Auth:** login/OTP oqimi orqali (`POST /mobile/auth/google` yoki `/mobile/auth/user/otp/*`) olingan `access_token`ni `Authorization: Bearer <access_token>` header bilan yuboring. Token muddati tugasa (`401 "access token expired"`), `POST /auth/token/refresh` ga `{"refresh_token": "..."}` yuborib yangi juft token oling (bu endpoint `/mobile` ostida emas, root'da).
- **Til:** ko'p javoblarda matnlar tilga bog'liq bo'lsa, `Accept-Language: uz|ru|en` header yuboriladi (default `uz`).
- **Pagination:** ro'yxat endpointlari odatda `limit`, `page` query parametr oladi.
- **Xatolik formati:** xatolik bo'lsa `4xx/5xx` status + `{"error": "..."}` shaklidagi JSON qaytadi.
- **Simulyatsiya xatolari:** `404 session_not_found` — sessiya yo'q; `409 session_not_active` — allaqachon yakunlangan sessiyaga `/event` yoki `/finish` (xato UI emas, natijani ko'rsatish).
- Pastdagi "Auth" qatori shu endpoint uchun haqiqatda routerda auth middleware borligini bildiradi.
- Google login tugmasi: [`GOOGLE_AUTH_FRONTEND.md`](GOOGLE_AUTH_FRONTEND.md). FE endpoint holati: [`API_ENDPOINTS.md`](API_ENDPOINTS.md).
- Telegram Mini App: `window.Telegram.WebApp.ready()` / `expand()` chaqirish tavsiya etiladi.

---


## Autentifikatsiya (Login/Register/Token)

### `POST /mobile/auth/google`
**Google orqali kirish (1 bosqichli)**
Google Identity Services (GIS) tugmasi `id_token` beradi — qo'lda paste yo'q.
To'liq FE ulash: [`GOOGLE_AUTH_FRONTEND.md`](GOOGLE_AUTH_FRONTEND.md).
- Auth: kerak emas
**Body** (GoogleLoginReq) (majburiy):
  - `id_token`: string
  - `referral_code`: string (ixtiyoriy)
**Javob (200):**
- `access_token`: string
- `id`: string
- `refresh_token`: string
- `role`: string

### `POST /mobile/auth/user/check`
**Check user**
Check user
- Auth: kerak emas
**Body** (UserCheckReq) (majburiy):
  - `identifier`: string
**Javob (200):**
- `has_account`: boolean

### `POST /mobile/auth/user/otp/confirm`
**Verify confirmation code**
Verify the provided confirmation code and return a token if valid
- Auth: kerak emas
**Body** (ConfirmationReq) (majburiy):
  - `confirmation_code`: string
  - `identifier`: string
  - `referral_code`: string
  - `type`: string
**Javob (200):**
`string`

### `POST /mobile/auth/user/otp/send`
**Send confirmation code to email**
Send a confirmation code to the provided email address
- Auth: kerak emas
**Body** (SendConfirmationCodeReq) (majburiy):
  - `identifier`: string
  - `type`: string
**Javob (200):**
`string`

## Foydalanuvchi profili

### `GET /mobile/user/activity`
**Get user activity stats**
Returns user activity stats by type: day|week|month|year|range. For day: optional ?date=YYYY-MM-DD. For range: required ?from=YYYY-MM-DD&to=YYYY-MM-DD
- Auth: kerak (Bearer token)
**Parametrlar:**
- `type` (query, string) (majburiy): Stats type: day|week|month|year|range
- `date` (query, string): For day only: YYYY-MM-DD (default: today)
- `from` (query, string): For range only: YYYY-MM-DD
- `to` (query, string): For range only: YYYY-MM-DD
**Javob (200):**
- `items`: ActivityStatItem[]
- `total`: integer
- `type`: string
- `user_id`: string

### `POST /mobile/user/activity`
**Activity user**
Frontend yozmasin — sessiya tugagach backend o'zi hisoblaydi. Faqat `GET` o'qiladi.
- Auth: kerak (Bearer token)
**Body** (UserActivityCreateBody) (majburiy):
  - `activity`: integer
**Javob (200):**
`string`

### `DELETE /mobile/user/delete/profile`
**Delete a profile**
Delete a profile
- Auth: kerak (Bearer token)
**Javob (200):**
`string`

### `POST /mobile/user/device`
**Push token ro'yxatdan o'tkazish (ko'p qurilma support)**
Backend faqat tokenni saqlaydi. Topic obunasini frontend FCM SDK orqali o'zi qiladi
(`<lang>` = `uz` | `ru` | `en`):
- `all_<lang>` — broadcast
- `user_<userId>_<lang>` — shaxsiy (to'lov, study-plan eslatma)
Til o'zgaganda eski topic'dan `unsubscribe`, yangisiga `subscribe`; logout'da ikkalasidan chiqish.
- Auth: kerak (Bearer token)
**Body** (object) (majburiy):
  - `fcm_token`: string
  - `platform`: string
**Javob (200):**
`string`

### `DELETE /mobile/user/device`
**Push token'ni o'chirish (logout)**
- Auth: kerak (Bearer token)
**Body** (object) (majburiy):
  - `fcm_token`: string
**Javob (200):**
`string`

### `GET /mobile/user/get/profile`
**Get user profile**
Get user profile
- Auth: kerak (Bearer token)
**Javob (200):**
- `coins`: integer
- `created_at`: string
- `email`: string
- `id`: string
- `image_url`: string
- `language`: string
- `level`: integer
- `name`: string
- `phone_number`: string
- `specialization`: string
- `streak_count`: integer
- `updated_at`: string
- `xp`: integer

### `GET /mobile/user/limit`
**Kunlik bepul urinish limiti holati (home ekranidagi "35/50 Limit" belgisi)**
- Auth: kerak (Bearer token)
**Javob (200):**
- `has_subscription`: boolean
- `remaining`: integer
- `total`: integer
- `used`: integer
- `coins_per_1k_tokens`: number (`case_coin_cost` o'rniga; `0` = tanga yechilmaydi)

### `GET /mobile/user/rating`
**Reyting (leaderboard) olish**
Reytingni qaytaradi: day|week|month|year|total. Default: total. 0 activity bo'lgan userlar avtomatik oxirida turadi. Response ichida TOP list va "Me" (mening o'rnim) qaytadi.
- Auth: kerak (Bearer token)
**Parametrlar:**
- `type` (query, string): Filter type: day|week|month|year|total (default: total)
- `limit` (query, integer): Top list limit (default: 10, max: 100)
**Javob (200):**
- `items`: RatingUserItem[]
- `limit`: integer
- `me`: RatingUserItem
- `type`: RatingType

### `PUT /mobile/user/update/profile`
**Update a user profile**
Updates user profile fields via multipart/form-data. Image is optional.
- Auth: kerak (Bearer token)
**Parametrlar:**
- `name` (formData, string): User name
- `phone_number` (formData, string): Phone number
- `email` (formData, string): Email
- `language` (formData, string): Language (e.g. uz, ru, en)
- `image` (formData, file): Profile image (jpg/png/webp)
**Javob (200):**
`string`

## Foydalanuvchi (qo'shimcha)

### `GET /mobile/referral`
**Referral ma'lumotlari (do'stlarni taklif qilish)**
O'z referral_code'i, taklif qilganlar soni va ular evaziga olingan tangalar
- Auth: kerak (Bearer token)
**Javob (200):**
- `invited`: ReferralInvitedItem[]
- `invited_count`: integer
- `referral_code`: string
- `referred_reward`: integer
- `referrer_reward`: integer
- `total_coins_earned`: integer

## Bo'limlar (Category)

### `GET /mobile/category`
**Get all categories (mobile)**
- Auth: kerak (Bearer token)
**Parametrlar:**
- `Accept-Language` (header, string, default=`uz`): Language (uz|ru|en)
**Javob (200):** paginated (swagger `categories`/`count` o'rniga live shu shakl)
- `data`: CategoryMobileRes[]
- `total`: integer
- `page`: integer
- `limit`: integer
- `total_pages`: integer
- `has_previous`: boolean
- `has_next`: boolean

### `GET /mobile/category/{id}`
**Get category by ID (mobile)**
- Auth: kerak (Bearer token)
**Parametrlar:**
- `id` (path, string) (majburiy): Category ID
- `Accept-Language` (header, string, default=`uz`): Language (uz|ru|en)
**Javob (200):**
- `audience`: string
- `cases_count`: integer
- `icon_url`: string
- `id`: string
- `name`: string
- `order_num`: integer

## Mavzular (Topic)

### `GET /mobile/topic`
**Mavzular ro'yxati (mobile)**
- Auth: kerak (Bearer token)
**Parametrlar:**
- `category_id` (query, string): Category ID
- `limit` (query, integer): Limit
- `page` (query, integer): Page
- `Accept-Language` (header, string, default=`uz`): Language (uz|ru|en)
**Javob (200):**
- `count`: integer
- `topics`: TopicMobileRes[]

## Klinik Case'lar

### `GET /mobile/case`
**Get cases catalog (mobile)**
- Auth: kerak (Bearer token)
**Parametrlar:**
- `topic_id` (query, string): Topic ID
- `category_id` (query, string): Category ID
- `difficulty` (query, string): easy|medium|hard
- `status` (query, string): new|active|completed|failed|abandoned (foydalanuvchi holati)
- `search` (query, string): Search
- `limit` (query, integer): Limit
- `page` (query, integer): Page
- `Accept-Language` (header, string, default=`uz`): Language (uz|ru|en)
**Javob (200):**
- `cases`: CaseMobileRes[] (`max_attempts` — yangi case'lar default 1)
- `count`: integer

### `GET /mobile/case/random`
**"Try your luck" - tasodifiy keys (BACKEND_STRUCTURE.md 3-bo'lim)**
- Auth: kerak (Bearer token)
**Parametrlar:**
- `Accept-Language` (header, string, default=`uz`): Language (uz|ru|en)
- `category_id` (query, string): Bo'lim bo'yicha random
- `topic_id` (query, string): Mavzu bo'yicha random ("Keyingi"); yechilmaganlari birinchi
- `exclude_id` (query, string): Joriy case id — takrorlanmasin
**Javob (200):**
- `category_id`: string
- `category_name`: string
- `chief_complaint`: string
- `cover_image_url`: string
- `difficulty`: string
- `expected_duration_minutes`: integer
- `id`: string
- `is_favorite`: boolean
- `max_attempts`: integer (yangi case'lar default 1)
- `patient_age`: integer
- `patient_gender`: string
- `status`: string
- `subtitle`: string
- `title`: string
- `topic_id`: string
- `topic_name`: string

### `GET /mobile/case/{id}`
**Get case detail (mobile)**
- Auth: kerak (Bearer token)
**Parametrlar:**
- `id` (path, string) (majburiy): Case ID
- `Accept-Language` (header, string, default=`uz`): Language (uz|ru|en)
**Javob (200):**
- `category_id`: string
- `category_name`: string
- `chief_complaint`: string
- `cover_image_url`: string
- `difficulty`: string
- `expected_duration_minutes`: integer
- `id`: string
- `is_favorite`: boolean
- `max_attempts`: integer (yangi case'lar default 1)
- `patient_age`: integer
- `patient_gender`: string
- `status`: string
- `subtitle`: string
- `title`: string
- `topic_id`: string
- `topic_name`: string

## Sevimlilar (Favorites)

### `GET /mobile/favorite`
**Sevimlilar ro'yxati (GET /api/v1/favorites - BACKEND_STRUCTURE.md 3-bo'lim)**
- Auth: kerak (Bearer token)
**Parametrlar:**
- `limit` (query, integer): Limit
- `page` (query, integer): Page
- `Accept-Language` (header, string, default=`uz`): Language (uz|ru|en)
**Javob (200):**
- `cases`: CaseMobileRes[] (`max_attempts` — yangi case'lar default 1)
- `count`: integer

### `POST /mobile/favorite`
**Sevimlilarga qo'shish/olib tashlash (BACKEND_STRUCTURE.md 3-bo'lim)**
- Auth: kerak (Bearer token)
**Body** (object) (majburiy):
  - `case_id`: string
**Javob (200):**
- `is_favorite`: boolean

## Simulyatsiya dvigateli

### `GET /mobile/simulation/completed`
**Profile -> Completed (BACKEND_STRUCTURE.md 1-bo'lim)**
- Auth: kerak (Bearer token)
**Javob (200):**
- `count`: integer
- `sessions`: SimulationSessionRes[] (`max_attempts`, `attempts_used`)

### `GET /mobile/simulation/ongoing`
**Profile -> Ongoing (BACKEND_STRUCTURE.md 1-bo'lim)**
Davom ettirilganda urinish hisoblagichini tiklash uchun `max_attempts` + `attempts_used`.
- Auth: kerak (Bearer token)
**Javob (200):**
- `count`: integer
- `sessions`: SimulationSessionRes[] (`max_attempts`, `attempts_used`)

### `POST /mobile/simulation/start`
**Sessiyani boshlash (BACKEND_STRUCTURE.md 4-bo'lim)**
- Auth: kerak (Bearer token)
**Body** (object) (majburiy):
  - `case_id`: string
  - `use_coins`: boolean (ixtiyoriy) — kunlik limit tugaganda tanga hisobidan boshlash. Oldindan narx yechilmaydi; balans `> 0` bo'lishi kerak, aks holda `insufficient_coins`. Premium va bepul urinishda yuborilmaydi.
**Javob (200):**
- `case_id`: string
- `health_percent`: integer
- `initial_vitals`: CaseVitals
- `session_id`: string
- `time_limit_seconds`: integer
- `visual_state`: string
- `ws_url`: string
- `max_attempts`: integer
- `attempts_used`: integer

### `GET /mobile/simulation/{id}`
- Auth: kerak (Bearer token)
**Parametrlar:**
- `id` (path, string) (majburiy): Session ID
**Javob (200):**
- `case_id`: string
- `case_title`: string
- `coins_earned`: integer
- `ended_at`: string
- `final_score`: integer
- `health_percent`: integer
- `id`: string
- `started_at`: string
- `status`: string
- `user_id`: string
- `xp_earned`: integer
- `max_attempts`: integer
- `attempts_used`: integer

### `POST /mobile/simulation/{id}/event`
**Tashxis javobi / ovozli urinish yuborish**
Joriy user-web faqat `type: "question"` yuboradi (to'liq tashxis). Urinishlar
faqat `question` (matn va ovoz) da hisoblanadi; `exam|lab|imaging|medication|procedure`
hisoblanmaydi.
- Auth: kerak (Bearer token)
**Parametrlar:**
- `id` (path, string) (majburiy): Session ID
**Body** (SimulationEventReq) (majburiy):
  - `session_id`: string
  - `type`: string (`question` — urinish hisoblanadi)
  - `payload`: object
    - matn: `question` turida `{ "question": "..." }`, boshqa turlarda `{ "text": "..." }`
    - ovoz (matn o'rniga): `audio_base64` (raw base64, data URL prefiksisiz), `audio_mime` (ixtiyoriy, default `audio/webm`)
**Javob (200):**
- `health_delta`: integer
- `health_percent`: integer
- `is_correct`: boolean
- `max_attempts`: integer
- `attempts_used`: integer
- `attempts_left`: integer
- `tokens_used`: integer (sessiya bo'yicha jami token)
- `coins_spent`: integer (sessiya bo'yicha yechilgan tanga, `reason=ai_usage`)
- `session_ended`: boolean (`health_percent=0`, `attempts_left=0` yoki to'g'ri javob)
- `finish_result`: object (faqat `session_ended: true` da) — `session_id`, `final_score`, `xp_earned`, `coins_earned`, `debrief_ready`, `tokens_used`, `coins_spent`
- `response`: object
  - `patient_reply` / `feedback`: string (AI tahlili; FE chatda AI sifatida ko'rsatadi)
  - `transcript`: string (ovozdan Gemini STT matni)
  - `transcribe_error` / `patient_reply_error` / `feedback_error`: o'zbekcha xabar (*"AI xizmati hozir band yoki vaqtincha ishlamayapti. Birozdan so'ng qayta urinib ko'ring."*)
  - `reply_audio_base64` / `reply_audio_mime`: Gemini TTS (`audio/wav`); xabar obyektida saqlab replay qilish
**Xatolar:** `404 session_not_found`; `409 session_not_active`; `insufficient_coins` (balans 0 — keyingi event)
**Auto-finish:** `health_percent` 0 bo'lsa backend `finish(reason="health_zero")` chaqiradi.
`attempts_left = 0` — `failed`, tanga yo'q. To'g'ri javob — limitdan oldin ham `session_ended: true`.
`session_ended: true` bo'lsa FE inputni yopadi va **qo'lda `PUT /finish` chaqirmaydi**.

Ovoz: brauzer `SpeechRecognition` / `speechSynthesis` ishlatilmaydi. Mikrofon
`MediaRecorder` → `audio_base64`. Javob audiosi `reply_audio_base64`.

### `PUT /mobile/simulation/{id}/finish`
**Sessiyani yakunlash (BACKEND_STRUCTURE.md 4,5-bo'lim)**
`reason`: `manual` | `health_zero` | `timeout`. Auto-finish bo'lgan sessiyaga
qayta chaqirilsa **`409 session_not_active`** — xato UI emas, natijani ko'rsatish.
- Auth: kerak (Bearer token)
**Parametrlar:**
- `id` (path, string) (majburiy): Session ID
**Body** (object) (majburiy):
  - `reason`: string
**Javob (200):**
- `coins_earned`: integer
- `debrief_ready`: boolean
- `final_score`: integer
- `session_id`: string
- `xp_earned`: integer
- `tokens_used`: integer
- `coins_spent`: integer

### `GET /mobile/simulation/{id}/ws`
**Real-vaqt vitallar monitori (BACKEND_STRUCTURE.md 4-bo'lim, WebSocket)**
- Auth: kerak emas
**Parametrlar:**
- `id` (path, string) (majburiy): Session ID

## Debriefing hisoboti

### `GET /mobile/debrief/{session_id}`
**AI orqali Debriefing hisoboti (BACKEND_STRUCTURE.md 5-bo'lim)**
Sessiya yopilgan va report yo‘q bo‘lsa, shu GET generatsiya qiladi (5–15 s).
FE so‘rov taymauti 30 s, umumiy poll 50 s.

**404 + `error.slug`:**
- `debrief_not_ready` — sessiya hali faol, FE poll davom etadi
- `debrief_failed` — AI hisobot yarata olmadi, FE poll **to‘xtaydi**
- `session_not_found` — FE poll **to‘xtaydi**

Eski 400 “not found” o‘rniga 404 + slug. `PUT /finish` auto-finish’dan keyin **409 `session_not_active`**.
`final_score` sof `health_percent` emas: har bir `incorrect_steps` elementi uchun
10% jarima (masalan health=80%, 2 xato → 60%). XP/coin shu ballga mutanosib.
Frontend alohida hisoblamaydi.
- Auth: kerak (Bearer token)
**Parametrlar:**
- `session_id` (path, string) (majburiy): Session ID
**Javob (200):**
- `coins_earned`: integer
- `correct_steps`: string[]
- `created_at`: string
- `final_score`: integer
- `guideline_notes`: string
- `incorrect_steps`: string[]
- `session_id`: string
- `weak_topics`: string[]
- `xp_earned`: integer
- `tokens_used`: integer
- `coins_spent`: integer

## Sozlamalar (limit, ovoz)

### `GET /mobile/setting/voice`
**Ovozli funksiya global yoqilganmi**
`enabled: false` bo'lsa FE mikrofon/TTS UI ni yashiradi. Yoqilganda audio
backendda Gemini STT+TTS orqali `/event` javobidagi `reply_audio_base64` dan
keladi (brauzer `speechSynthesis` asosiy yo'l emas).
- Auth: kerak (Bearer token)
**Javob (200):**
- `enabled`: boolean

## Promokodlar

### `GET /mobile/promocode`
**Mening Promokodlarim (ishlatganlarim, BACKEND_STRUCTURE.md 5-bo'lim)**
- Auth: kerak (Bearer token)
**Parametrlar:**
- `limit` (query, integer): Limit
- `page` (query, integer): Page
**Javob (200):**
- `count`: integer
- `promocodes`: PromoCodeRes[]

### `POST /mobile/promocode/redeem`
**Promokodni kiritib tanga olish (TZ 2.3-bo'lim)**
- Auth: kerak (Bearer token)
**Body** (object) (majburiy):
  - `code`: string
**Javob (200):**
- `coins_added`: integer

## Tariflar (Obuna/Coin paket)

### `GET /mobile/tariff`
**Get all tariff**
Get all tariff with optional filtering
- Auth: kerak (Bearer token)
**Parametrlar:**
- `duration` (query, integer): Duration
**Javob (200):**
- `count`: integer
- `tariffs`: TariffRes[]

### `GET /mobile/tariff/{id}`
**Get tariff by ID**
Get a tariff by their ID
- Auth: kerak (Bearer token)
**Parametrlar:**
- `id` (path, string): Tariff ID
**Javob (200):**
- `coins`: integer
- `created_at`: string
- `description`: string
- `duration`: integer
- `id`: string
- `kind`: string
- `name`: string
- `price`: number
- `updated_at`: string

## Obuna

### `POST /mobile/subscription`
**Premium obunaga buyurtma (BACKEND_STRUCTURE.md 5-bo'lim, Click orqali to'lov)**
- Auth: kerak (Bearer token)
**Body** (OrderCreateBody) (majburiy):
  - `coins_used`: integer
  - `tariff_id`: string
**Javob (200):**
`string`

## O'quv rejasi (eslatma)

### `GET /mobile/study-plan`
- Auth: kerak (Bearer token)
**Javob (200):**
- `is_enabled`: boolean
- `remind_minutes_before`: integer
- `remind_time`: string
- `user_id`: string

### `PUT /mobile/study-plan`
**O'quv rejasi va eslatma vaqtini belgilash (BACKEND_STRUCTURE.md 2-bo'lim)**
Cron `remind_time` / `remind_minutes_before` da push yuboradi (`EventStudyReminder`).
FE alohida cron qilmaydi — push'ni UI da ko'rsatish kifoya.
- Auth: kerak (Bearer token)
**Body** (StudyPlanUpsertReq) (majburiy):
  - `is_enabled`: boolean
  - `remind_minutes_before`: integer
  - `remind_time`: string
  - `user_id`: string
**Javob (200):**
`string`

## Bildirishnomalar

### `GET /mobile/notification/user`
**Get all notification**
Get all notification with optional filtering
- Auth: kerak (Bearer token)
**Parametrlar:**
- `is_read` (query, boolean): Is Read
- `Accept-Language` (header, string, default=`uz`): Language (uz|ru|en)
**Javob (200):**
- `count`: integer
- `notifications`: UserNotificationRes[]

### `PUT /mobile/notification/{id}/read`
**Read notification**
Read notification
- Auth: kerak (Bearer token)
**Parametrlar:**
- `id` (path, string): Notification ID
**Javob (200):**
`string`

## Bannerlar

### `GET /mobile/banner`
**Get all banner**
Get all banner with optional filtering
- Auth: kerak (Bearer token)
**Parametrlar:**
- `Accept-Language` (header, string, default=`uz`): Language (uz|ru|en)
**Javob (200):**
- `banners`: BannerMobileRes[]
- `count`: integer

### `GET /mobile/banner/{id}`
**Get banner by ID**
Get a banner by their ID
- Auth: kerak (Bearer token)
**Parametrlar:**
- `id` (path, string): Banner ID
- `Accept-Language` (header, string, default=`uz`): Language (uz|ru|en)
**Javob (200):**
- `created_at`: string
- `description`: string
- `id`: string
- `image_url`: string
- `link_url`: string
- `order_num`: integer
- `title`: string
- `updated_at`: string

## Biz haqimizda

### `GET /mobile/about`
**Get all about**
Get all about with optional filtering
- Auth: kerak (Bearer token)
**Parametrlar:**
- `title` (query, string): Title
- `Accept-Language` (header, string, default=`uz`): Language (uz|ru|en)
**Javob (200):**
- `abouts`: AboutMobileRes[]
- `count`: integer

### `GET /mobile/about/{id}`
**Get about by ID**
Get a about by their ID
- Auth: kerak (Bearer token)
**Parametrlar:**
- `id` (path, string): About ID
- `Accept-Language` (header, string, default=`uz`): Language (uz|ru|en)
**Javob (200):**
- `created_at`: string
- `description`: string
- `id`: string
- `link_url`: string
- `order_num`: integer
- `title`: string
- `updated_at`: string

## FAQ

### `GET /mobile/faq`
**Get all faq**
Get all faq with optional filtering
- Auth: kerak (Bearer token)
**Parametrlar:**
- `question` (query, string): Question
- `Accept-Language` (header, string, default=`uz`): Language (uz|ru|en)
**Javob (200):**
- `count`: integer
- `faqs`: FaqMobileRes[]

### `GET /mobile/faq/{id}`
**Get faq by ID**
Get a faq by their ID
- Auth: kerak (Bearer token)
**Parametrlar:**
- `id` (path, string): Faq ID
- `Accept-Language` (header, string, default=`uz`): Language (uz|ru|en)
**Javob (200):**
- `answer`: string
- `created_at`: string
- `id`: string
- `order_num`: integer
- `question`: string
- `updated_at`: string

## Kontaktlar

### `GET /mobile/contact`
**Get all contact**
Get all contact with optional filtering
- Auth: kerak (Bearer token)
**Parametrlar:**
- `name` (query, string): Name
- `phone_number` (query, string): PhoneNumber
- `limit` (query, integer): Limit
- `page` (query, integer): Page
**Javob (200):**
- `contacts`: ContactRes[]
- `count`: integer

### `GET /mobile/contact/{id}`
**Get contact by ID**
Get a contact by their ID
- Auth: kerak (Bearer token)
**Parametrlar:**
- `id` (path, string): Contact ID
**Javob (200):**
- `created_at`: string
- `id`: string
- `link_url`: string
- `name`: string
- `phone_number`: string
- `updated_at`: string

## App Route (ilova ichki linklar)

### `GET /mobile/app-route`
**Get all appRoute**
Get all appRoute with optional filtering
- Auth: kerak emas
**Javob (200):**
- `app_routes`: AppRouteRes[]
- `count`: integer

### `GET /mobile/app-route/{id}`
**Get appRoute by ID**
Get a appRoute by their ID
- Auth: kerak emas
**Parametrlar:**
- `id` (path, string): AppRoute ID
**Javob (200):**
- `app_links`: object
- `app_version`: object
- `buy_course`: boolean
- `call_center`: string
- `created_at`: string
- `id`: string
- `payment_min_version`: string
- `support_url`: string
- `updated_at`: string

## Hamkorlar

### `GET /mobile/partner`
**Home ekranidagi "Hamkor kurslari" banneri (TZ 2.1-bo'lim)**
- Auth: kerak (Bearer token)
**Javob (200):**
- `count`: integer
- `partners`: PartnerMobileRes[]
