# Arxiv / o‘chirish: user-web endi ishlatmaydigan mobile endpointlar

Sana: 2026-11-01.
Manba: `src/api.js` + UI. Pathlar o‘ylab topilmagan.

User-web da quyidagi modullar olib tashlandi. Backendda **arxiv** (o‘chirmasdan yashirish) yoki **delete** qilish mumkin.

`POST /mobile/favorite` — eski Keys xonasi hali chaqiradi. To‘liq favorite modulini o‘chirsangiz, shu POST ni ham olib tashlash kerak.

---

## Arxiv / delete (user-web tasdiqladi)

| Endpoint | Nima edi | Front holat |
|---|---|---|
| `GET /mobile/level` | Klinik daraja katalogi (Talaba, Rezident…). Profil XP progress + «Barcha darajalar» | Profil daraja bloki olib tashlandi. Wrapper qoldi |
| `GET /mobile/favorite` | Sevimli case’lar ro‘yxati | Sevimlilar tab olib tashlandi. Wrapper qoldi |
| `POST /mobile/favorite` | Case ni sevimliga qo‘shish/olish | Eski Keys (`CaseSimulationRoom`) hali yuradi |
| `GET /mobile/study-plan` | Kunlik o‘quv eslatmasi (`remind_time`, push) | O‘quv rejasi UI olib tashlandi |
| `PUT /mobile/study-plan` | Eslatmani yoqish/o‘chirish | UI yo‘q |
| `GET /mobile/partner` | Home «Hamkor kurslari» banneri | Hamkorlar UI yo‘q |
| `GET /mobile/user/rating` | Reyting / leaderboard (`type`, `items`, `me`) | Profil «Reyting» olib tashlandi. Wrapper qoldi. Backend logic tayyor bo‘lgach qaytariladi |

---

## Savol: activity nima edi?

`GET /mobile/user/activity` — profil **faollik grafigi**: kun/hafta/oy bo‘yicha nechta case **tugatilgan**. Backend sessiya `finish` da o‘zi yozadi.

`POST /mobile/user/activity` — frontend **yozmasin** (swagger). Faqat `GET` o‘qilardi.

Hozir front chaqirmaydi (grafik yo‘q). Arxiv qilish ixtiyoriy.

`GET /mobile/user/rating` — alohida modul. User-web hozircha arxivda (backend logic ishlanmoqda).

---

## Savol: mobile feedback nima edi?

`POST /mobile/feedback` — foydalanuvchi **fikri**: baho 1–5, tur (`general|bug|idea|content|nps`), matn. Admin: `GET /web/feedback`.

Profil feedback formasi olib tashlandi. Wrapper qoldi. Arxiv qilish mumkin — practice ichidagi AI `feedback` matni (javob izohi) **boshqa narsa**, shu endpoint emas.

---

## Savol: practice sessions-chi?

Ikki xil:

**Ishlayapti** (Keys/Test practice — o‘chirmang):

| Endpoint | Nima |
|---|---|
| `POST /mobile/practice/sessions` | Sessiya boshlash |
| `POST /mobile/practice/sessions/{id}/next` | Keyingi case/savol |
| `POST /mobile/practice/items/{id}/answer` | Javob |
| `POST /mobile/practice/sessions/{id}/finish` | Yakun |
| `GET /mobile/practice/sessions/{id}` | Bitta sessiya (fleshkarta poll) |
| `POST /mobile/practice/items/{id}/report` | Noto‘g‘ri kontent |

**UI chaqirmaydi:**

| Endpoint | Nima |
|---|---|
| `GET /mobile/practice/sessions` | Keys/test **tarix ro‘yxati** (limit/page) |

Ro‘yxat endpointini arxiv qilish mumkin. Yakunlangan sessiyalar admin/statistika uchun bazada qolishi kerak — `GET {id}` va POST’lar saqlansin.
