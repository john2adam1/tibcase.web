# User-web endpointlari

Oxirgi tekshiruv: 2026-10-30.

Manba: `src/api.js` + UI chaqiriqlari. Pathlar o‘ylab topilmagan.

## Holat

| Endpoint | Holat | Qayerda |
|---|---|---|
| `POST /mobile/auth/google` | Ishlayapti | AuthModal |
| `POST /mobile/auth/user/check` | Ishlayapti | AuthModal |
| `POST /mobile/auth/user/otp/send` | Ishlayapti | AuthModal email OTP (captcha ixtiyoriy). Telefon OTP UI yo‘q |
| `POST /mobile/auth/user/otp/confirm` | Ishlayapti | AuthModal |
| `POST /mobile/auth/telegram/start` | Ishlayapti | AuthModal OTP’siz Telegram |
| `POST /mobile/auth/telegram/check` | Ishlayapti | AuthModal 2s poll |
| `POST /auth/token/refresh` | Ishlayapti | api.js |
| `GET /mobile/user/get/profile` | Ishlayapti | App, Profile |
| `PUT /mobile/user/update/profile` | Ishlayapti | Profile (ism/til/rasm) |
| `DELETE /mobile/user/delete/profile` | Ishlayapti | Profile |
| `POST /mobile/user/phone/start` | Ishlayapti | Profile Telegram ulash |
| `POST /mobile/user/phone/confirm` | Ishlayapti | Profile poll |
| `DELETE /mobile/user/phone` | Ishlayapti | Profile |
| `POST /mobile/user/email/send` | Ishlayapti | Profile |
| `POST /mobile/user/email/confirm` | Ishlayapti | Profile |
| `DELETE /mobile/user/email` | Ishlayapti | Profile |
| `GET /mobile/user/limit` | Ishlayapti | App, Profile (eski simulyatsiya urinish limiti) |
| `GET /mobile/practice/wallet` | Ishlayapti | Home, Profile, App |
| `GET /mobile/level` | Ishlatilmayapti | Wrapper faqat — profil daraja bloki olib tashlandi |
| `GET /mobile/category` | Ishlayapti | Home, Keyslar/Bo‘limlar (`is_active=false` filtrlanadi) |
| `GET /mobile/topic` | Ishlayapti | Roadmap, KeysConfig, Practice |
| `GET /mobile/case` | Ishlayapti | Katalog |
| `GET /mobile/case/random` | Ishlayapti | Eski Keys |
| `POST /mobile/simulation/start` | Ishlayapti | Eski Keys |
| `POST /mobile/simulation/{id}/event` | Ishlayapti | CaseSimulationRoom |
| `PUT /mobile/simulation/{id}/finish` | Ishlayapti | App (auto-finish skip) |
| `GET /mobile/debrief/{id}` | Ishlayapti | waitForDebrief |
| `GET /mobile/favorite` | Ishlatilmayapti | Wrapper faqat — Sevimlilar tab olib tashlandi |
| `POST /mobile/favorite` | Ishlayapti | CaseSimulationRoom |
| `GET /mobile/simulation/completed` | Ishlayapti | Profile |
| `GET /mobile/simulation/ongoing` | Ishlayapti | Profile |
| `GET /mobile/setting/voice` | Ishlayapti | Simulyatsiya (`enabled === true` bo‘lsa tugma) |
| `GET /mobile/tariff` | Ishlayapti | Store |
| `POST /mobile/subscription` | Ishlayapti | Store — `coins_used` **yuborilmaydi** |
| `POST /mobile/practice/sessions` | Ishlayapti | PracticeView |
| `POST /mobile/practice/sessions/{id}/next` | Ishlayapti | PracticeView (60s) |
| `POST /mobile/practice/items/{id}/answer` | Ishlayapti | PracticeView (60s) |
| `POST /mobile/practice/sessions/{id}/finish` | Ishlayapti | PracticeView |
| `GET /mobile/practice/sessions` | Wrapper faqat | UI chaqirmaydi (keys/test tarixi) |
| `GET /mobile/practice/sessions/{id}` | Ishlayapti | Fleshkarta poll |
| `POST /mobile/practice/items/{id}/report` | Ishlayapti | PracticeView |
| `GET /mobile/flashcard/due` | Ishlayapti | FlashcardsView, Home karusel |
| `GET /mobile/flashcard/cards` | Ishlayapti | Barcha kartalar grid + Home karusel |
| `POST /mobile/flashcard/cards/{id}/review` | Ishlayapti | FlashcardsView, Home karusel |
| `GET /mobile/flashcard/stats` | Ishlayapti | Home, Flashcards |
| `GET /mobile/flashcard/decks` | Ishlayapti | FlashcardsView |
| `POST /mobile/flashcard/decks` | Ishlayapti | Flashcards, KnowledgeMap |
| `DELETE /mobile/flashcard/decks/{id}` | Ishlayapti | FlashcardsView |
| `POST /mobile/flashcard/cards` | Ishlayapti | FlashcardsView qo‘lda karta |
| `GET /mobile/roadmap` | Ishlayapti | KnowledgeMapView |
| `POST /mobile/roadmap/refresh` | Ishlayapti | KnowledgeMapView |
| `POST /mobile/feedback` | Ishlatilmayapti | Wrapper faqat — profil feedback olib tashlandi |
| `GET /mobile/about` | Ishlayapti | Profile — Ilova haqida |
| `GET /mobile/faq` | Ishlayapti | Profile — Ilova haqida |
| `GET /mobile/contact` | Ishlayapti | Profile — Ilova haqida |
| `GET /mobile/app-route` | Ishlayapti | Profile — `support_url` (Telegram), `call_center` |
| `GET /mobile/banner` | Ishlayapti | Home |
| `GET /mobile/notification/user` | Ishlayapti | App |
| `GET /mobile/study-plan` | Ishlatilmayapti | Wrapper faqat — O‘quv rejasi olib tashlandi |
| `PUT /mobile/study-plan` | Ishlatilmayapti | Wrapper faqat — O‘quv rejasi olib tashlandi |

## Warninglar

- Eski `/mobile/simulation` billing (`daily_free_limit`, `use_coins`) saqlanadi; practice esa `GET /mobile/practice/wallet` + `insufficient_coins`.
- Home/Profile "Bugungi bepul tanga" faqat `GET /mobile/practice/wallet` (`daily_free_coins` / `free_coins_left`, jumladan `{ data: wallet }` o‘ramasi). `GET /mobile/user/limit` bu belgi uchun ishlatilmaydi.
- `POST /mobile/subscription` da `coins_used > 0` → `400 coin_payment_disabled`.
- `GET /mobile/setting/voice` default `enabled: false` — ovoz tugmasi yashirin.
- 429 `too_many_requests` / `otp_locked` + `Retry-After` `ApiError.retryAfter` ga yoziladi.
- Captcha: `VITE_TURNSTILE_SITE_KEY` yoki `VITE_CAPTCHA_SITE_KEY` bo‘lsa `X-Captcha-Token` OTP send va telegram start ga qo‘yiladi.
- Admin `/web/tariff` ishlatilmaydi (403).
- `GET /mobile/app-route` live `{ data: [{ support_url, call_center, app_version }] }` — Telegram `support_url` (swagger misol: `https://t.me/support`).
