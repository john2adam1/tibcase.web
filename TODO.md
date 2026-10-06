# TODO — API endpointlar auditi

Manba: `src/api.js`, `API_MOBILE.md`, `user-panel.html` (ishlaydi deb hisoblangan namuna) va kod bo'ylab qidiruv.
Eslatma: bu audit **kod bo'yicha** qilingan. Backendga haqiqiy so'rov yuborilmagan, shuning uchun
"ishlaydi" degani "kodi to'g'ri ulangan" degani, javob real tekshirilmagan.

Belgilar: 🔴 xato / ishlamaydi · 🟠 shubhali / zaif · 🟡 ishlatilmayapti · 🟢 yaxshi

---

## 🔴 Xato yoki ishlamayotganlar

- [x] **`GET /mobile/level` / `/web/level` (`api.getLevels`) — to'liq ulandi va ishga tushirildi.**
  - `src/api.js` dagi `getLevels` `/mobile/level` va fallback `/web/level` ga moslandi hamda `extractList` bilan o'raldi.
  - `ProfileView.jsx` da `Promise.all` ga `api.getLevels()` qo'shildi va `setLevelsList(freshLevels)` yuklandi.
  - Natijada: profil kartasidagi daraja nishoni (badge), keyingi darajagacha kerakli XP miqdori, progress bar foizi va kubok bosilganda "Klinik Darajalar Tizimi" jadval modalining ochilishi to'liq ishlaydi.
- [x] **Bildirishnomalar (`GET /mobile/notification/user`) — `extractList` ga o'tkazildi.**
  - `src/api.js`, `src/views/NotificationsView.jsx` va `src/App.jsx` da `extractList` qo'llanildi. Backend `notifications`, `items`, `data` yoki to'g'ridan-to'g'ri massiv qaytarsa ham xatosiz o'qiladi.
  - Push bildirishnoma kelganda `onForegroundPush` orqali ro'yxat avtomatik yangilanadi.
- [x] **O'quv rejasi (`/mobile/study-plan`).** GET va PUT so'rovlari muvaffaqiyatli ishlayapti (`PUT /mobile/study-plan` 200 OK qaytarmoqda, foydalanuvchi token orqali aniqlanadi, alohida `user_id` talab qilinmaydi). Belgilangan vaqtda push kelishi backenddagi foniy cron scheduler / worker ga bog'liq.
- [ ] **Qurilmalar (`/mobile/user/device`).** Faqat `POST` va `DELETE` bor, ro'yxat olish endpointi yo'q. Shu sababli UI faqat shu brauzerdagi qurilmani ko'rsata oladi, boshqa qurilmalar ko'rinmaydi va ularni chiqarib bo'lmaydi.
  - Backenddan so'rash: `GET /mobile/user/devices` va `DELETE /mobile/user/devices/{id}`.

## 🟠 Shubhali / yaxshilanishi kerak

- [ ] **Topic bo'yicha push** (`{user_id}_{lang}`, `all_{lang}`): veb SDK da `subscribeToTopic` yo'q, backend serverda obuna qilishi kerak. Backend dasturchi javobini kutish. Kerak bo'lsa `registerDevice` ga `lang` qo'shish va til almashganda qayta yuborish.
- [ ] **Profil `fcm_token` maydoni** (imedteam shunday qiladi) va `/mobile/user/device` — backendda ikkalasi ham bormi, qaysi biri asosiy ekanini aniqlashtirish.
- [ ] **Google Auth (`POST /mobile/auth/google`)**: kod tayyor, lekin Google Cloud Console da "Authorized JavaScript origins" ga sayt manzillari (localhost, Vercel domeni) qo'shilmagan bo'lsa `GSI_LOGGER: origin is not allowed` chiqadi.
- [x] **`PUT /mobile/user/update/profile`**: profil rasmi yuklash qaytarildi (backendda `image` maydoni va `image_url` bor). Profil tahrirlash oynasida "Rasm yuklash" (jpg/png/webp, max 5 MB); rasm bo'lmasa bosh harflar avatari. Tekshirish kerak: backend `image_url` ni to'liq URL qilib qaytaradimi (nisbiy bo'lsa domen qo'shish kerak).
- [x] **SEO va Qidiruv optimizatsiyasi (Google #1 o'rin uchun)**: `index.html` (Title, Description, Keywords, Canonical, OpenGraph 1200x630, Twitter Cards, Schema.org JSON-LD WebSite/WebApplication/EducationalOrganization), `public/robots.txt`, `public/sitemap.xml`, `public/manifest.json`, `public/og-image.png`.
- [x] **Yangi brend logotipi (`gemini-svg.svg`)**: T ustidagi 3D ilon, lokatsiya pini ichidagi S harfi bilan to'liq moslandi (`logo-full.svg`, `logo-full.png`, `logo.svg`, `favicon.svg`, `logo.png`, `logo-192.png`). Sidebar, Landing, TabletHeader, AuthModal ga o'rnatildi.
- [ ] **WebSocket (`/mobile/simulation/{id}/ws`)**: to'g'ridan-to'g'ri backendga ulanadi (`VITE_API_BASE`). Production da `VITE_API_BASE` Vercel da o'rnatilganini tekshirish; token URL da ketadi.
- [ ] **Debrief**: tayyor bo'lguncha 400 qaytadi, `waitForDebrief` 10×2s kutadi. Uzoq hisobotlarda yetmasligi mumkin.
- [ ] **Hamma ro'yxat endpointlari** (`about`, `faq`, `contact`, `partner`, `banner`, `app-route`, `promocode`, `tariff`) javob shakli har xil bo'lishi mumkin. Hammasi `extractList` orqali o'qilganini tekshirish (hozir qisman `res.xxx` bilan).

## 🟡 Ishlatilmayotgan endpointlar (`api.js` da bor, UI da yo'q)

| Metod | Endpoint | Izoh |
|---|---|---|
| `checkUser` | `POST /mobile/auth/user/check` | Login oqimida chaqirilmaydi (`user-panel.html` chaqiradi). Kerak: akkaunt bor/yo'qligini oldindan bilish. |
| `postUserActivity` | `POST /mobile/user/activity` | Faollik (streak) yozilmaydi. Kirganda/case tugaganda chaqirish kerakmi, backenddan so'rash. |
| `getCategoryById` | `GET /mobile/category/{id}` | Kerak emas (ro'yxatdan olinadi). |
| `getCaseDetail` | `GET /mobile/case/{id}` | Case tafsilotlari ro'yxat ma'lumotidan olinadi. Alohida yuklash aniqroq bo'lishi mumkin. |
| `getDebrief` | `GET /mobile/debrief/{id}` | Faqat `waitForDebrief` orqali ishlatiladi (normal). |
| `getPromocodes` | `GET /mobile/promocode` | Foydalanuvchi promokodlari ro'yxati UI da yo'q (faqat `redeem` bor). |
| `getTariffById` | `GET /mobile/tariff/{id}` | Ishlatilmaydi (ro'yxat yetarli). |
| `getBannerById`, `getAboutById`, `getFaqById`, `getContactById`, `getAppRouteById` | `.../{id}` | Ishlatilmaydi (normal, ro'yxatdan olinadi). |

## 🟢 Ulangan va kod bo'yicha to'g'ri

Auth (`google`, `otp/send`, `otp/confirm`), profil (`get`, `update`, `delete`), `limit`, `activity` (GET), `rating`,
`referral`, `device` (POST/DELETE), `category`, `topic`, `case` (+`random`), `favorite`, `simulation`
(`start`, `event`, `finish`, `completed`, `ongoing`, `{id}`), `setting/voice`, `promocode/redeem`, `tariff`,
`subscription`, `banner`, `about`, `faq`, `contact`, `app-route`, `partner`.

---

## Keyingi qadamlar (tavsiya etilgan tartib)

1. [x] Levels yo'lini tuzatish (`/mobile/level`) va `ProfileView` ga ulash (bajarildi).
2. [x] Bildirishnomalarni `extractList` ga o'tkazish (bajarildi).
3. [x] Brauzer Network tabida study-plan va bildirishnomalar tekshirildi (study-plan PUT 200 OK, FCM push ishlayapti).
4. [ ] Backend dasturchidan so'rash: device ro'yxati endpointi, topic obunasi, `activity` POST qachon chaqirilishi.
5. [ ] Google Console origins va Vercel env (`VITE_*`) ni to'ldirish.

---

## 🚀 Saytni deploy qilib, domenga (`tibstation.uz`) ulagandan keyingi ishlar (SEO & Qidiruv)

- [ ] **Google Search Console**:
  - `tibstation.uz` mulkini (property) qo'shish va DNS/HTML orqali tasdiqlash.
  - Sitemaps bo'limiga `https://tibstation.uz/sitemap.xml` ni kiritib Submit qilish.
  - URL Inspection orqali bosh sahifani `Request Indexing` qilish (Googlebot tezroq indekslashi uchun).
- [ ] **Yandex Webmaster**:
  - `webmaster.yandex.ru` ga `tibstation.uz` ni qo'shish va huquqni tasdiqlash.
  - Sitemaps bo'limiga `https://tibstation.uz/sitemap.xml` ni yuborish.
- [ ] **Google Cloud Console (Auth Origin)**:
  - Authorized JavaScript origins ga `https://tibstation.uz` ni qo'shish (Google bilan kirish xatosiz ishlashi uchun).

