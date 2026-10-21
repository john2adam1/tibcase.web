# Backend report: sessiya tugagach AI debrief yozilmayapti

**Sana:** 2026-10-21  
**Muhit:** `https://dev.tibstation.uz` (user-web `localhost:5173` → `/mobile` proxy)  
**Kim tekshirdi:** user-web (frontend)  
**Mavzu:** keys tugagach chatda “AI tahlil qilyapti...” qoladi, `GET /mobile/debrief/{session_id}` hech qachon 200 bermaydi

Bu frontend xatosi emas. FE shartnomaga rioya qiladi. Muammo: sessiya yopilgach debrief **row** yaratilmaydi.

---

## 1. Kutilgan shartnoma (`API_MOBILE.md`)

Sessiya yopilishi:

- `POST /mobile/simulation/{id}/event` `type=question`
- `session_ended: true` bo‘lsa (to‘g‘ri javob, `attempts_left=0`, `health_percent=0`) backend **auto-finish** qiladi
- FE bu holda **`PUT /finish` chaqirmaydi** (qayta chaqirish `409 session_not_active` bo‘lishi kerak)

Keyin FE:

1. Chatda loading: “AI tahlil qilyapti...”
2. `GET /mobile/debrief/{session_id}` ni poll qiladi (400/202/404 = hali tayyor emas)
3. 200 kelganda `correct_steps`, `incorrect_steps`, `weak_topics`, `guideline_notes` ni **bitta** AI xabarida ko‘rsatadi

`finish_result.debrief_ready` maydoni bor. `GET /debrief` tayyor bo‘lguncha 400 ruxsat etilgan — lekin oxir-oqibat **200 + report** bo‘lishi shart. `failed` sessiyada ham tahlil kerak (user noto‘g‘ri javob bergan bo‘lsa ham).

---

## 2. Repro (joriy sessiya)

User: `0e0839b9-778c-40d2-a0d7-91ff23adea9b`  
Case: `dc90e8c4-30cd-49d6-8699-f2435a7e7828` (STEMI / ko‘krak og‘rig‘i)  
Session: **`3457639f-683e-4fe6-8345-3b06f8876e89`**

| # | So‘rov | Natija | Vaqt |
|---|---|---|---|
| 1 | `POST /mobile/simulation/start` `{ case_id }` | 200 | ~440 ms |
| 2 | `POST /mobile/simulation/{id}/event` `type=question` | 200 | ~657 ms |
| 3 | `GET /mobile/simulation/{id}` | 200, `status=failed` | ~446 ms |
| 4 | `GET /mobile/debrief/{id}` (poll, ko‘p marta) | **400**, report yo‘q | ~360–400 ms |
| 5 | `PUT /mobile/simulation/{id}/finish` `{ "reason": "manual" }` (qo‘lda tekshiruv) | **400**, active session yo‘q | ~400 ms |

Sessiya ~21 soniyada yopilgan:

- `started_at`: `2026-10-21 17:18:17.471935+00`
- `ended_at`: `2026-10-21 17:18:38.179716+00`

### `GET /mobile/simulation/3457639f-683e-4fe6-8345-3b06f8876e89` (200)

```json
{
  "id": "3457639f-683e-4fe6-8345-3b06f8876e89",
  "user_id": "0e0839b9-778c-40d2-a0d7-91ff23adea9b",
  "case_id": "dc90e8c4-30cd-49d6-8699-f2435a7e7828",
  "case_title": "Doktor, ko'kragim qattiq siqilyapti, go'yo ustimga og'ir tos",
  "status": "failed",
  "health_percent": 100,
  "max_attempts": 1,
  "attempts_used": 1,
  "final_score": 0,
  "xp_earned": 0,
  "coins_earned": 0,
  "started_at": "2026-10-21 17:18:17.471935+00",
  "ended_at": "2026-10-21 17:18:38.179716+00"
}
```

Sessiya **yopilgan**. `attempts_used=1`, `max_attempts=1` → oxirgi urinish, `failed`.

### `GET /mobile/debrief/3457639f-683e-4fe6-8345-3b06f8876e89` (400)

Har pollda bir xil, osilib qolmaydi (~0.4 s):

```json
{
  "error": {
    "code": 400,
    "slug": "validation_error",
    "message": "Noto'g'ri so'rov ma'lumotlari",
    "details": "debrief report not found for session: 3457639f-683e-4fe6-8345-3b06f8876e89"
  }
}
```

Bu “Gemini hali yozmoqda” emas. Report **DB da yo‘q**. Poll qancha tursa ham 200 bo‘lmaydi.

### `PUT /mobile/simulation/3457639f-.../finish` (400)

```json
{
  "error": {
    "code": 400,
    "slug": "validation_error",
    "message": "Noto'g'ri so'rov ma'lumotlari",
    "details": "active session not found: 3457639f-683e-4fe6-8345-3b06f8876e89"
  }
}
```

Shartnoma: auto-finish bo‘lgan sessiya uchun **`409 session_not_active`**. Hozir **400 validation_error**. FE 409 ni “allaqachon tugagan” deb o‘qiydi; 400 ni boshqa xato deb ko‘radi.

---

## 3. Frontend nima qiladi (aybdor emas)

Auto-finish (`session_ended: true`) bo‘lsa FE `PUT /finish` **yubormaydi** — `API_MOBILE.md` shunday yozilgan.

Keys tugagach faqat `GET /debrief` poll. 400/202/404 = retry. Joriy sessiyada har retry 400 + “report not found”.

UI da loading aylanib turishi shu poll tufayli. Backend 200 bermasa, tahlil chiqmaydi.

---

## 4. API key umuman o‘lik emas

Gemini / debrief ba’zi sessiyalarda ishlagan. Misol:

`GET /mobile/debrief/768e5cda-4e12-44d9-b69d-94ecbafa078a` → **200**  
Sessiya: `completed`, `final_score=75`, `ended_at=2026-10-07`

```json
{
  "session_id": "768e5cda-4e12-44d9-b69d-94ecbafa078a",
  "correct_steps": [
    "Bemorning umumiy holati va hayotiy ko'rsatkichlarini boshida tekshirish o'tkazildi, bu ABCDE tamoyiliga mos keladi.",
    "Birlamchi EKG tekshiruvi o'z vaqtida buyurildi, bu o'tkir koronar sindromni tezda aniqlashga yordam berdi."
  ],
  "incorrect_steps": [
    "Qon bosimi past bo meyoriy ko'rsatkichlardan og'gan holatda arterial gipotenziyani hisobga olmasdan gipotensiv vosita yuborildi. ...",
    "Anamnez yig'ishda ma'lum dori vositalariga allergiya bor-yo'qligi so'ralmadi."
  ],
  "final_score": 75
}
```

Kalit umuman yo‘q / noto‘g‘ri bo‘lsa bu 200 bo‘lmasdi.

---

## 5. Pattern: oxirgi sessiyalarda report yo‘q

`GET /mobile/simulation/completed` (shu user):

| session_id | ended_at (UTC) | status | score | GET /debrief |
|---|---|---|---|---|
| `3457639f-…` (joriy, completed listida yo‘q — **failed**) | 2026-10-21 17:18 | failed | 0 | **400 not found** |
| `fee1c2a9-4228-4e5b-a77f-1a63c996933a` | 2026-10-20 18:42 | completed | 0 | **400** |
| `88bfb162-9bc2-4f85-9e23-4e6e9cbf798e` | 2026-10-18 10:01 | completed | 0 | **400** |
| `c3569d79-13aa-444f-ab5a-edf59252b85b` | 2026-10-16 17:40 | completed | 0 | **400** |
| `c21c8272-0963-4078-a1b9-9b564d749c3b` | 2026-10-16 17:34 | completed | 0 | **400** |
| `768e5cda-4e12-44d9-b69d-94ecbafa078a` | 2026-10-07 10:48 | completed | 75 | **200** |
| `8845453a-998f-4edd-a62e-fe2cac0a0a4d` | 2026-10-07 10:47 | completed | 80 | (oldingi 200-lar bilan bir xil davr) |
| `690a882f-083f-4c18-9550-f53a1268f452` | 2026-10-06 11:13 | completed | 80 | |
| `ebca3b3f-05c4-4929-b424-2a09740feea6` | 2026-10-06 11:08 | completed | 80 | |
| `61654a37-2d77-4b5f-9e43-2d8ab756c476` | 2026-09-30 21:31 | completed | 80 | |
| `820ef6ae-461c-4ca2-80e7-4a65aa2c01e8` | 2026-09-23 15:46 | completed | 100 | |

**2026-10-07 dan keyin** shu userda debrief 200 ko‘rinmadi. 16-oktabrdan beri barcha tekshirilgan sessiyalar 400.

---

## 6. Tekshirish kerak (backend)

1. **`failed` + `attempts_left=0` auto-finish** debrief job/goroutineni umuman ishga tushiradimi? Tahlil `completed` uchun ham, `failed` uchun ham kerak.
2. Gemini / debrief xatosi **yutilib yuboriladimi** (log + sessiya `ended`, report yo‘q)? 400 “not found” ni “hali generatsiya”dan farqlab bo‘lmaydi.
3. **2026-10-07 dan keyin** nima o‘zgardi: model, API key, kvota, worker, `debrief_ready` flag, failed-skip?
4. HTTP status:
   - report hali yo‘q, lekin generatsiya ketayapti → `202` yoki `400` + `debrief_not_ready` (alohida slug)
   - report umuman yozilmagan / job fail → `404` yoki `debrief_failed`, FE cheksiz kutmasin
   - auto-finish sessiyaga `PUT /finish` → **`409 session_not_active`**, hozirgi `400 validation_error` emas
5. `GET /debrief` 400 ~0.4 s — timeout emas. Queue/worker ishlamasa, poll foydasiz.

Logda qidirish: session `3457639f-683e-4fe6-8345-3b06f8876e89`, vaqt `2026-10-21 17:18:17`–`17:18:38` UTC. Gemini error, skipped debrief, panic.

---

## 7. Kutilgan tuzatish

Sessiya yopilgach (`completed` **yoki** `failed`):

1. Debrief generatsiyasi ishga tushsin (sync yoki background).
2. Muvaffaqiyat: `GET /mobile/debrief/{id}` → **200** + `correct_steps` / `incorrect_steps` / …
3. Gemini fail: sessiyada flag + FE tushunadigan xato (`debrief_failed`), yashirin 400 “not found” emas.
4. `PUT /finish` qayta chaqiriq: **409** `session_not_active`.

Tasdiq: yuqoridagi `3457639f-…` uchun `GET /debrief` 200 yoki aniq `debrief_failed`. Yangi failed sessiya (1 urinish, noto‘g‘ri javob) ham report bersin.

---

## 8. Frontend tomoni (ma’lumot)

User-web poll qiladi, debrief **generate qilmaydi**. Hozir 400 uzoq tursa loading ~50 s dan keyin “AI tahlili hozircha mavjud emas” ga o‘tadi — backend report yozmasa user osilib qolmasin. Asosiy fix backendda.
