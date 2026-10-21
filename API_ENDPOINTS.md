# User-web API endpoint holati

Bu fayl **tibcase.web** (user ilova) qaysi `/mobile/...` endpointlarni ishlatishini
doimiy kuzatish uchun. Shartnoma: [`API_MOBILE.md`](API_MOBILE.md).
Wrapperlar: [`src/api.js`](src/api.js). Javobda bor, lekin ekranda yo‘q
maydonlar — [UI da chiqarilmaydi](#ui-da-chiqarilmaydi).

**Oxirgi tekshiruv:** 2026-10-22

Har safar API, `src/api.js` yoki endpoint chaqiruvi o‘zgarsa — shu faylni ham
yangilang (qoida: `.cursor/rules/api-endpoints.mdc`). Endpoint **bitta** holat
bo‘limida turadi (eng aniq belgi bo‘yicha).

---

## Warning

Ishlatiladi, lekin javob/body yoki oqim `API_MOBILE.md` bilan to‘liq mos emas.

| Method | Path | Client | Qayerda | Nima noto‘g‘ri |
|---|---|---|---|---|
| POST | `/mobile/simulation/{id}/event` | `sendSimulationEvent` | CaseSimulationRoom | Faqat `type=question`. `max_attempts` / `attempts_left` testda kelmadi |
| POST | `/mobile/subscription` | `subscribe` | StoreTariffs | Swagger: `tariff_id` + `coins_used`. FE qo‘shimcha `provider` (`inpay`) yuboradi |
| GET | `/mobile/case/{id}` | `getCaseDetail` | — | Detail GET chaqirilmaydi — ekran list/random obyektidan ochiladi |
| GET | `/mobile/case` | `getCases` / `getAllCases` | App katalog | Live 400: `column sub.max_attempts does not exist`. Home keys soni category `cases_count` — `/case` ni kutmaydi |
| POST | `/mobile/auth/google` | `loginWithGoogle` | AuthModal | `referral_code` yuborilmaydi (i18n da bor) |
| POST | `/mobile/auth/user/otp/confirm` | `confirmOtp` | AuthModal | `referral_code` yuborilmaydi |
| GET | `/mobile/category` | `getCategories` | CategoriesView | Swagger `{ categories, count }`. Live paginated `{ data, total, page }` |
| GET | `/mobile/level` | `getLevels` | ProfileView | `API_MOBILE.md`/swaggerda yo‘q. Live jadval teshik: 1, 4, 5 (`required_xp` 500/1500/3000). UI keyingi **mavjud** qatorni oladi, `level+1` taxmin qilmaydi |
| GET | `/mobile/tariff` | `getTariffs` | App, StoreTariffs, Profile dropdown | Swagger `{ tariffs, count }`. Live paginated `{ data, total, page }` — barcha sahifa yig‘iladi. User-web `/web/tariff` chaqirmaydi (403) |

**Batafsil**

1. Simulyatsiya javobi — tashxis urinishi. UI `exam|lab|imaging|medication|procedure`
   yubormaydi. Payload: `{ question: text }` yoki `{ audio_base64, audio_mime }`.
2. `max_attempts` / `attempts_left` start va `/event` da o‘qiladi (input lock).
   Headerda urinish badge yo‘q. Javobda yo‘q bo‘lsa default 1.
3. Case ochilishi `GET /case/random` (home/roadmap Keys sozlamalari) yoki
   sevimlilardagi list item orqali. `GET /case/{id}` chaqirilmaydi.
4. `GET /mobile/category` live paginated `{ data }`. `icon_url` bo‘sh kelsa
   CategoriesView cover o‘rniga emoji.
5. Qiyinlik filtri `GET /mobile/case/random?difficulty=easy|medium|hard`
   (`API_MOBILE.md` da yo‘q). Live 404 bo‘lsa FE `difficulty` ni tashlab
   `category_id`/`topic_id` bilan qayta so‘raydi. `GET /mobile/case` live 400.
   Home mavzular `GET /mobile/topic?limit=1` (`getTopicTotal` / `total`|`count`).
   Home keys soni category `cases_count`.
6. Darajalar: `user.level=1` + `xp=136` bo‘lsa ham L1 `required_xp=500`.
   Boshlang‘ich daraja floor=0, progress keyingi katalog qatorining
   `required_xp` siga (live: Rezident 1500). App `getLevels` ni prefetch
   qiladi; ProfileView sessiyalarni kutmaydi. `/web/level` faqat mobile
   bo‘sh/404.

---

## UI da chiqarilmaydi

Endpoint chaqiriladi (yoki javob ichida maydon bor), lekin user-web **ko‘rsatmaydi**
yoki o‘qimaydi. Wrapper “Ishlayapti” bo‘lishi mumkin — bu yerda **ekran** holati.

### Case (`GET /mobile/case`, `/random`, `/case/{id}`)

| Maydon / qism | Holat |
|---|---|
| `cover_image_url` | Rasm yo‘q: roadmap, details, sim, sevimlilar |
| `subtitle` | Details va Roadmap da yo‘q |
| `chief_complaint` | Keys sozlamalari panelida yo‘q. Sim chatda boshlang‘ich xabar |
| `topic_name` | Keys sozlamalari panelida tanlangan mavzu; Roadmap node sarlavhasi |
| `GET /case` query `status`, `search`, `difficulty` | `api.getCases` yubora oladi, UI list filterlarini yubormaydi |
| `GET /case/random` query `difficulty` | Home va Roadmap Keys sozlamalari |

### Category / Topic

| Maydon | Holat |
|---|---|
| `audience` | Category — UI da yo‘q |
| `order_num` | Category va Topic — FE sort qilmaydi |
| Topic `cases_count` | Roadmap faqat mavzu title; case soni ko‘rsatilmaydi |

`icon_url` (yo‘q bo‘lsa `image_url`) — CategoriesView kartada cover rasm, Roadmap sarlavhasida. Bo‘sh bo‘lsa emoji. `cases_count` chiqariladi.

### Simulyatsiya

| Maydon | Holat |
|---|---|
| `visual_state` | `POST /start` javobi — FE `activeCase` ga yozilmaydi |
| `health_delta` | `POST /event` javobi — FE o‘qimaydi (`health_percent` yetarli) |
| `vitals.*` (temp, rhythm, gcs, pain, rr, …) | Monitor faqat mavjud qiymatlarni chiqaradi. `null` / `''` / `0` yoki `--` ko‘rsatilmaydi — label ham yo‘q |
| `max_attempts` / `attempts_left` | Sim headerda badge yo‘q. Input lock uchun o‘qiladi |
| `response.patient_reply` | Chatda `feedback` afzal; patient_reply fallback |
| `response.feedback_error` | Keys tugaganda dummy “tahlil kelmadi” yozilmaydi — debrief kutiladi. Davom etayotgan sessiyada error matni chiqadi |
| Debrief `correct_steps` / `incorrect_steps` / `weak_topics` / `guideline_notes` | Sim chatdagi AI tahlili. Keys natijasi (DebriefModal) da **yo‘q** — u yerda faqat score / XP / tanga / token |
| Boshlang‘ich `chief_complaint` audio | `POST /start` da TTS yo‘q — brauzer o‘zbek ovoziga ega emas, shu uchun shikoyat o‘qilmaydi. Ovoz default yoqilgan. AI javobi faqat `/event` `reply_audio_base64` (Gemini) |

### Profil, app-route

| Maydon / endpoint | Holat |
|---|---|
| User `created_at`, `updated_at` | Profilda ko‘rsatilmaydi |
| AppRoute `buy_course`, `app_links`, `payment_min_version` | Profile “Biz haqimizda” da yo‘q (`call_center`, `support_url`, `app_version.android` bor) |

---

## Ishlatilmayapti

`API_MOBILE.md` da bor. `api.js` da wrapper yo‘q, UI ham chaqirmaydi.

| Method | Path | Izoh |
|---|---|---|
| POST | `/mobile/user/activity` | Backend sessiya tugagach o‘zi yozadi. FE yozmasin |
| DELETE | `/mobile/user/device` | Logout FCM tokenni backenddan o‘chirmaydi |
| GET | `/mobile/referral` | Sozlamalarda matn bor, so‘rov yo‘q |

---

## Wrapper faqat

`api.js` da funksiya bor, hech qayerda chaqirilmaydi.

| Method | Path | Client | Izoh |
|---|---|---|---|
| POST | `/mobile/auth/user/check` | `checkUser` | OTP oldidan `has_account` tekshirilmaydi |
| GET | `/mobile/user/activity` | `getUserActivity` | Statistika UI yo‘q |
| GET | `/mobile/category/{id}` | `getCategoryById` | Ro‘yxat kifoya |
| GET | `/mobile/tariff/{id}` | `getTariffById` | Ro‘yxat kifoya |
| GET | `/mobile/banner/{id}` | `getBannerById` | Ro‘yxat kifoya |
| GET | `/mobile/about/{id}` | `getAboutById` | Ro‘yxat kifoya |
| GET | `/mobile/faq/{id}` | `getFaqById` | Ro‘yxat kifoya |
| GET | `/mobile/contact/{id}` | `getContactById` | Ro‘yxat kifoya |
| GET | `/mobile/app-route/{id}` | `getAppRouteById` | Ro‘yxat kifoya |
| GET | `/mobile/promocode` | `getPromocodes` | Coupon UI yo‘q |
| POST | `/mobile/promocode/redeem` | `redeemPromocode` | Coupon UI yo‘q |
| GET | `/mobile/partner` | `getPartners` | LandingPage hamkorlar olib tashlandi |
| GET | `/mobile/topic` + `/mobile/case` | `getCatalogCounts` | Home `getTopicTotal` + category `cases_count` ishlatadi |

---

## Qo‘shimcha

`API_MOBILE.md` da yo‘q, lekin FE chaqiradi.

| Method | Path | Client | Qayerda | Izoh |
|---|---|---|---|---|
| POST | `/auth/token/refresh` | `refreshTokens` | `api.js` (401) | `/mobile` ostida emas. Token yangilash shu |
| GET | `/mobile/level` | `getLevels` | App prefetch, ProfileView | Swaggerda yo‘q. Warning: teshik `level_number` |
| GET | `/web/level` | `getLevels` fallback | ProfileView | Mobile bo‘sh yoki 404 |

---

## Ishlayapti

Wrapper bor, UI chaqiradi, noma’lum mos kelmaslik yo‘q.

### Auth va profil

| Method | Path | Client | Qayerda |
|---|---|---|---|
| POST | `/mobile/auth/user/otp/send` | `sendOtp` | AuthModal |
| PUT | `/mobile/user/update/profile` | `updateUserProfile` | ProfileView |
| DELETE | `/mobile/user/delete/profile` | `deleteProfile` | ProfileView |
| GET | `/mobile/user/get/profile` | `getUserProfile` | App, Auth, Profile, Store |
| GET | `/mobile/user/limit` | `getUserLimit` | App, Profile |
| GET | `/mobile/user/rating` | `getUserRating` | Leaderboard |
| POST | `/mobile/user/device` | `registerDevice` | push.js, `api.js` |

### Katalog

| Method | Path | Client | Qayerda |
|---|---|---|---|
| GET | `/mobile/category` | `getCategories` | App, CategoriesView |
| GET | `/mobile/topic` | `getTopics` / `getTopicTotal` | RoadmapView; Home soni (`limit=1` total); Home keys sozlamalari (`category_id`) |
| GET | `/mobile/case/random` | `getRandomCase` | App (home/roadmap Keys sozlamalari: `category_id` / `topic_id` / `difficulty`; Debrief Keyingi: `topic_id` + `exclude_id`) |
| GET | `/mobile/favorite` | `getFavorites` | CategoriesView |
| POST | `/mobile/favorite` | `toggleFavorite` | CategoriesView; CaseSimulationRoom (Saqlash) |

### Simulyatsiya

| Method | Path | Client | Qayerda |
|---|---|---|---|
| POST | `/mobile/simulation/start` | `startSimulation` | App |
| GET | `/mobile/simulation/{id}` | `getSimulation` | App (finish/debrief) |
| GET | `/mobile/simulation/{id}/ws` | `getSimulationWsUrl` | CaseSimulationRoom |
| PUT | `/mobile/simulation/{id}/finish` | `finishSimulation` | CaseSimulationRoom (yakunlash); App fallback |
| GET | `/mobile/simulation/ongoing` | `getOngoingSimulations` | CategoriesView, ProfileView |
| GET | `/mobile/simulation/completed` | `getCompletedSimulations` | CategoriesView, ProfileView |
| GET | `/mobile/debrief/{session_id}` | `getDebrief` / `waitForDebrief` | CaseSimulationRoom (chat poll, tayyor bo‘lguncha); App history — faqat score/XP/tanga |
| GET | `/mobile/setting/voice` | `getVoiceSetting` | CaseSimulationRoom |

`POST /mobile/simulation/{id}/event` — [Warning](#warning).

### Do‘kon, eslatma, kontent

| Method | Path | Client | Qayerda |
|---|---|---|---|
| GET | `/mobile/tariff` | `getTariffs` | App, StoreTariffs; Profile dropdown — barcha `kind` (inline `all`) |
| GET | `/mobile/study-plan` | `getStudyPlan` | StudyPlanView |
| PUT | `/mobile/study-plan` | `updateStudyPlan` | StudyPlanView |
| GET | `/mobile/notification/user` | `getNotifications` | App, NotificationsView |
| PUT | `/mobile/notification/{id}/read` | `markNotificationRead` | NotificationsView |
| GET | `/mobile/banner` | `getBanners` | App (Home) |
| GET | `/mobile/about` | `getAbout` | App, ProfileView |
| GET | `/mobile/faq` | `getFaqs` | App, ProfileView |
| GET | `/mobile/contact` | `getContacts` | App, ProfileView |
| GET | `/mobile/app-route` | `getAppRoutes` | ProfileView |

`POST /mobile/subscription` — [Warning](#warning).

---

## Simulyatsiya oqimi (joriy FE)

```
GET  /mobile/topic                     category_id (roadmap — faqat mavzular)
GET  /mobile/case/random               topic_id (mavzu bosish / Keyingi)
POST /mobile/simulation/start          { case_id [, use_coins: true] }
        ↓  chief_complaint chatda matn; audio yo‘q
GET  /mobile/simulation/{id}/ws        vitallar
POST /mobile/simulation/{id}/event     type=question (tashxis javobi)
        ↓
  urinish qolgan (is_correct=false, session_ended=false):
        bitta AI xabar = badge + response.feedback
  keys tugadi (is_correct | session_ended | attempts_left=0 | timeout | Yakunlash):
        chatda "AI tahlil qilyapti..." (to‘g‘ri/xato alohida yozilmaydi)
PUT  /mobile/simulation/{id}/finish    (faqat qo'lda / timeout; auto-finish / is_correct / attempts_left=0 da YO'Q; debrief poll bilan parallel)
GET  /mobile/debrief/{session_id}      poll ~50s, so‘rov 30s
        200 → tahlil
        404 debrief_not_ready → kutish
        404 debrief_failed | session_not_found → to‘xtash, "AI tahlili mavjud emas"
        ↓  bitta chat xabari: To‘g‘ri/Noto‘g‘ri badge + correct/incorrect_steps
         DebriefModal: faqat score / XP / tanga / token (AI yo‘q)
GET  /mobile/case/random               topic_id + exclude_id ("Keyingi")
```

`/event` baholaydi (`is_correct`) va qisqa `feedback` berishi mumkin; to‘liq tahlil
`GET /debrief` da. FE keys tugagach verdictni feedbacksiz ko‘rsatmaydi — debrief
kelguncha kutadi, keyin badge va tahlil **bitta** xabarda. 404 ni `error.slug`
bo‘yicha ajratadi (`debrief_not_ready` kutadi; `debrief_failed` /
`session_not_found` to‘xtaydi). Auto-finish’dan keyin `PUT /finish` yo‘q;
kelgan `409 session_not_active` xato UI emas.
`POST /start` chief_complaint uchun audio yubormaydi. Header ovoz tugmasi default o‘chiq.
Kunlik limit tugaganda start `use_coins: true` (oldindan narx yo‘q).
`insufficient_coins` — input yopiladi. Tahlil chatda; natija sahifasida `tokens_used` / `coins_spent`.

**Auth:** Google ID token yoki email/telegram OTP. Bearer token.
401 `access token expired` → `POST /auth/token/refresh`. Til: `Accept-Language: uz|ru|en`.

---

## O‘zgartirish qoidasi

Endpoint qo‘shilsa, olib tashlansa, wrapper yozilsa yoki UI ulash/uzilsa:

1. Uni **bitta** holat bo‘limiga qo‘ying yoki ko‘chiring (eski qatorda qoldirmang).
2. Warning matnini yangilang yoki o‘chiring.
3. **Oxirgi tekshiruv** sanasini yangilang.

---

## TibStation funksiyalar

Belgilar: ishlaydi ✅ · ishlatilmayapti 🚫 · qisman ⚠️

- website ✅
- telegram web app ✅

**Case**

- animatsiya ✅
- javob urinishlar ✅
- vaqt ✅
- ai tahlil ✅
- saqlangan ✅
- tarix ✅
- ongoing ✅
- xp, tanga ✅

- tariff ✅
- Prompt (tezkor qo‘llanma) ✅
- level ✅
- faollik (streak) ✅
- rating ✅
- tg auth ✅
- google auth ⚠️ (`referral_code` yuborilmaydi)
- device: 1 ✅
- Til ✅
- Bildirishnoma (firebase) ✅
- case list yuklash ✅
- case = tanga ✅
- payment ✅
- ci cd (github) ✅
- referall 🚫
- tariff (obuna, tanga) — balans ✅

### Unused funksiyalar 🚫

- promokod
- faollik (`GET /mobile/user/activity` statistika)
- O‘quv reja
- devices (ro‘yxat / `DELETE /mobile/user/device`)
- hamkorlar (landing va Home da yo‘q; wrapper bor)
- auth hamkorlar
- bemor (barcha nuqtalar: ko‘rik, lab, imaging, dori, protsedura)
- case image (`cover_image_url`)
