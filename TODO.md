# TODO — qolgan ishlar

Faqat bajarilmagan ishlar qoldirilgan. Audit **kod bo'yicha** qilingan, backendga haqiqiy so'rov yuborilmagan.

Belgilar: 🟠 shubhali / tekshirish kerak · 🟡 ishlatilmayapti · 🚀 deploy

---

## 🟠 Backend dasturchidan so'rash kerak

- [ ] **Bemor shikoyati ovozi**: simulyatsiya boshida `chief_complaint` uchun ham audio qaytarish (masalan `chief_complaint_audio_base64` + `chief_complaint_audio_mime`). Front brauzer TTS ni olib tashlagan, ovoz faqat backenddan keladi. Maydon nomi kelishilgach frontga ulash.
- [ ] **Topic bo'yicha push** (`{user_id}_{lang}`, `all_{lang}`): veb SDK da `subscribeToTopic` yo'q, backend serverda obuna qilishi kerak. Kerak bo'lsa `registerDevice` ga `lang` qo'shish va til almashganda qayta yuborish.
- [ ] **Profil `fcm_token` maydoni** va `/mobile/user/device`: backendda ikkalasi ham bormi, qaysi biri asosiy ekanini aniqlashtirish.
- [ ] **`POST /mobile/user/activity`** qachon chaqirilishi kerak (kirganda / case tugaganda)? Hozir front chaqirmaydi.
- [ ] **Bir vaqtda ruxsat etilgan qurilmalar soni** backendda belgilanadi (front qurilmalarni boshqarmaydi).
- [ ] **`image_url`** to'liq URL qaytaradimi (nisbiy bo'lsa front domen qo'shishi kerak)?

## 🟠 Tekshirish / yaxshilash

- [ ] **Google Auth**: Google Cloud Console da "Authorized JavaScript origins" ga localhost, `https://tibstation.uz` va boshqa deploy domenlarini qo'shish (aks holda `origin is not allowed`).
- [ ] **WebSocket (`/mobile/simulation/{id}/ws`)**: to'g'ridan-to'g'ri backendga ulanadi (`VITE_API_BASE`). Productionda `VITE_API_BASE=https://prod.tibstation.uz` aniq o'rnatilganini tekshirish; token URL da ketadi.
- [ ] **Debrief**: tayyor bo'lguncha 400 qaytadi, `waitForDebrief` 10×2s kutadi. Uzoq hisobotlarda yetmasligi mumkin.
- [ ] **Ro'yxat endpointlari** (`about`, `faq`, `contact`, `partner`, `banner`, `app-route`, `promocode`, `tariff`): hammasi `extractList` orqali o'qilishini tekshirish (hozir qisman `res.xxx` bilan).
- [ ] **Tarjimalar**: `pm.*`, `limitModal.*`, `guide.*` va boshqa yangi kalitlarning rus/o'zbek tarjimalarini ko'zdan kechirish.

## 🟡 Ishlatilmayotgan endpointlar (`api.js` da bor, UI da yo'q)

| Metod | Endpoint | Izoh |
|---|---|---|
| `checkUser` | `POST /mobile/auth/user/check` | Login oqimida chaqirilmaydi. |
| `postUserActivity` | `POST /mobile/user/activity` | Faollik (streak) yozilmaydi. |
| `registerDevice`, `removeDevice` | `/mobile/user/device` | Faqat `registerStoredFcmDevice` orqali; profildan qurilmalar bo'limi olib tashlangan. |
| `getPromocodes` | `GET /mobile/promocode` | Foydalanuvchi promokodlari ro'yxati UI da yo'q (faqat `redeem`). |
| `getCaseDetail`, `getCategoryById`, `getTariffById`, `getBannerById`, `getAboutById`, `getFaqById`, `getContactById`, `getAppRouteById` | `.../{id}` | Ro'yxatdan olinadi, kerak emas. |

---

## 🚀 Deploy

- [ ] **Docker**: Docker Desktop yoqilib `docker compose up --build` sinab ko'rilmagan (web: `localhost:8080`, admin: `3000`).
- [ ] **Serverda**: `.env` (VITE_FIREBASE_*, `VITE_API_BASE=https://prod.tibstation.uz`), `BACKEND_HOST`, Caddy (`Caddyfile.example` ni haqiqiy domenlar bilan to'ldirish), DNS A-yozuvlari.
- [ ] **Google Search Console**: `tibstation.uz` ni qo'shish va tasdiqlash, `https://tibstation.uz/sitemap.xml` ni Submit qilish, bosh sahifani `Request Indexing`.
- [ ] **Yandex Webmaster**: `tibstation.uz` ni qo'shish, huquqni tasdiqlash, sitemap yuborish.
