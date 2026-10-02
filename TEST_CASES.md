# Test case'lar (admin panel → Case'lar → "Yangi Case")

15 ta tayyor case. Har birida admin paneldagi forma maydonlari tartibi bilan berilgan:
Mavzu, Sarlavha, Kichik sarlavha, Chief complaint (UZ/RU/EN), Kutilgan javob, Qiyinlik, Bemor yoshi/jinsi,
Davomiylik, Vitals (HR, BP, SpO2, RR, Harorat, GCS), visual_state va Scenario (JSON).

**Qo'llanma**
- **Mavzu (Topic)** — admin paneldagi mavjud mavzular ro'yxatidan mosini tanlang (taxminiy mavzu nomi har case'da ko'rsatilgan).
- **Qiyinlik:** `easy` | `medium` | `hard`. **Jins:** `male` (Erkak) | `female` (Ayol).
- **visual_state:** `stable` | `unstable` | `critical` (ilova bemor animatsiyasini shu qiymatlar bo'yicha ko'rsatadi).
- **"AI yordamida generatsiya qilingan case"** belgisini qo'ymang (bular qo'lda yaratiladi), AI generatsiyani sinash uchun
  esa har case'dagi **"AI generatsiya uchun kirish"** qatoridan foydalaning (Mavzu, Qiyinlik, Shikoyat, To'g'ri javob).
- **Muqova rasm URL** — ixtiyoriy, bo'sh qoldirsangiz bo'ladi.
- Barcha ma'lumotlar o'quv/test maqsadida; real bemorga tegishli emas.

---

## 1. O'tkir koronar sindrom (STEMI)

- **Mavzu:** Kardiologiya
- **Sarlavha** — UZ: Shoshilinch kardiologiya / O'tkir koronar sindrom · RU: Неотложная кардиология / Острый коронарный синдром · EN: Emergency cardiology / Acute coronary syndrome
- **Kichik sarlavha** — UZ: Ko'krak qafasidagi og'riq · RU: Боль в груди · EN: Chest pain
- **Chief complaint**
  - UZ: Ko'kragim qattiq siqilyapti, og'riq chap qo'lim va jag'imga tarqalyapti. 40 daqiqa oldin zinadan chiqayotganda boshlandi, sovuq ter bosdi, nafasim yetmayapti.
  - RU: Сильно давит в груди, боль отдаёт в левую руку и челюсть. Началась 40 минут назад при подъёме по лестнице, холодный пот, не хватает воздуха.
  - EN: I have crushing chest pain spreading to my left arm and jaw. It started 40 minutes ago climbing stairs, I'm sweating and short of breath.
- **Kutilgan javob:** ST ko'tarilishli miokard infarkti (STEMI). Birinchi qadamlar: ABCDE, monitoring, 12 kanalli EKG (10 daqiqa ichida), kislorod (SpO2 <90% bo'lsa), aspirin, antiagregant, nitrat (gipotenziya bo'lmasa), og'riqsizlantirish, shoshilinch reperfuziya (PCI).
- **Qiyinlik:** medium · **Yosh:** 58 · **Jins:** male · **Davomiylik:** 15
- **Vitals:** HR 98 · BP 150/95 · SpO2 94 · RR 22 · Harorat 36.8 · GCS 15
- **visual_state:** unstable
- **AI generatsiya uchun kirish:** Mavzu: O'tkir koronar sindrom (STEMI) · Qiyinlik: medium

**Scenario (JSON)**
```json
{
  "history": "Chekuvchi (20 yil), 3 yildan beri gipertoniya. Og'riq jismoniy zo'riqishdan keyin boshlangan, nitroglitserin qabul qilgan, yengillashmagan.",
  "comorbidities": ["Arterial gipertenziya", "Dislipidemiya"],
  "allergies": [],
  "medications": ["Amlodipin 5 mg"],
  "exam_findings": {
    "general": "Rangi oqargan, sovuq ter, xavotirda",
    "cardiovascular": "Ritm to'g'ri, shovqin yo'q",
    "respiratory": "Pastki bo'limlarda mayda nam xirillash yo'q",
    "other": "Oyoqlarda shish yo'q"
  },
  "diagnostics": {
    "ecg": "II, III, aVF tarmoqlarida ST ko'tarilishi (pastki devor)",
    "labs": "Troponin ko'tarilgan, qand 6.1 mmol/l",
    "imaging": "Ko'krak qafasi rentgeni: o'zgarish yo'q"
  },
  "deterioration_triggers": ["EKG 10 daqiqadan keyin olinsa", "Vitallarni tekshirmasdan nitrat berilsa", "Reperfuziya kechiktirilsa"],
  "improvement_triggers": ["Aspirin va antiagregant berilsa", "Og'riq kamaysa", "PCI uchun yo'naltirilsa"]
}
```

---

## 2. O'tkir appenditsit

- **Mavzu:** Jarrohlik
- **Sarlavha** — UZ: Qorin og'rig'i / O'tkir appenditsit · RU: Боль в животе / Острый аппендицит · EN: Abdominal pain / Acute appendicitis
- **Kichik sarlavha** — UZ: O'ng pastki qorin og'rig'i · RU: Боль в правом нижнем отделе живота · EN: Right lower abdominal pain
- **Chief complaint**
  - UZ: Kecha kindik atrofida og'riq boshlandi, bugun u qorinning o'ng pastki qismiga ko'chdi. Ko'ngil aynidi, bir marta qayt qildim, ishtaham yo'q.
  - RU: Вчера заболело вокруг пупка, сегодня боль переместилась в правый нижний отдел живота. Тошнит, была однократная рвота, нет аппетита.
  - EN: Yesterday I had pain around my belly button; today it moved to the lower right of my abdomen. I feel nauseous, vomited once and have no appetite.
- **Kutilgan javob:** O'tkir appenditsit. Qadamlar: anamnez va qorinni ko'zdan kechirish (Mak-Berni, Shchetkin-Blyumberg), umumiy qon tahlili, CRP, qorin UZI, ovqatdan voz kechish, vena ichiga suyuqlik, jarrohga yo'naltirish (appendektomiya).
- **Qiyinlik:** easy · **Yosh:** 24 · **Jins:** female · **Davomiylik:** 10
- **Vitals:** HR 92 · BP 118/74 · SpO2 99 · RR 16 · Harorat 37.9 · GCS 15
- **visual_state:** stable
- **AI generatsiya uchun kirish:** Mavzu: O'tkir appenditsit · Qiyinlik: easy

**Scenario (JSON)**
```json
{
  "history": "Oldin jarrohlik amaliyoti bo'lmagan. Oxirgi hayz 10 kun oldin, homiladorlik testi manfiy.",
  "comorbidities": [],
  "allergies": [],
  "medications": [],
  "exam_findings": {
    "general": "O'ng yonboshiga yotishni afzal ko'radi",
    "cardiovascular": "Ritm to'g'ri",
    "respiratory": "Vezikulyar nafas",
    "other": "O'ng yonbosh sohada tarang va og'riqli, Shchetkin-Blyumberg musbat"
  },
  "diagnostics": {
    "ecg": "Sinus ritmi",
    "labs": "Leykotsitlar 14.2, CRP 48",
    "imaging": "UZI: appendiks diametri 9 mm, siqilmaydi"
  },
  "deterioration_triggers": ["Og'riqsizlantirmasdan uzoq kutilsa", "Jarrohga kech yo'naltirilsa"],
  "improvement_triggers": ["Vena ichiga suyuqlik va antibiotik boshlansa", "Jarrohga o'z vaqtida yo'naltirilsa"]
}
```

---

## 3. Jamoada orttirilgan pnevmoniya

- **Mavzu:** Pulmonologiya
- **Sarlavha** — UZ: Yo'tal va isitma / Pnevmoniya · RU: Кашель и лихорадка / Пневмония · EN: Cough and fever / Pneumonia
- **Kichik sarlavha** — UZ: Balg'amli yo'tal, isitma · RU: Кашель с мокротой, лихорадка · EN: Productive cough, fever
- **Chief complaint**
  - UZ: Uch kundan beri isitmam bor, yo'talim balg'amli, nafas olganda o'ng ko'kragim og'riydi. Bugun nafasim qisilyapti.
  - RU: Три дня температура, кашель с мокротой, при вдохе болит справа в груди. Сегодня появилась одышка.
  - EN: For three days I've had a fever and a cough with phlegm, and my right chest hurts when I breathe in. Today I became short of breath.
- **Kutilgan javob:** Jamoada orttirilgan pnevmoniya (o'ng pastki bo'lak). Qadamlar: SpO2 va vitallar, ko'krak qafasi rentgeni, qon tahlili, CURB-65 bilan og'irlikni baholash, empirik antibiotik, kislorod (kerak bo'lsa), gospitalizatsiya mezonlarini baholash.
- **Qiyinlik:** medium · **Yosh:** 67 · **Jins:** male · **Davomiylik:** 12
- **Vitals:** HR 104 · BP 126/78 · SpO2 91 · RR 24 · Harorat 38.8 · GCS 15
- **visual_state:** unstable
- **AI generatsiya uchun kirish:** Mavzu: Jamoada orttirilgan pnevmoniya · Qiyinlik: medium

**Scenario (JSON)**
```json
{
  "history": "XOBL tashxisi yo'q, 30 yil chekkan. Yaqinda yuqori nafas yo'llari infeksiyasi bo'lgan.",
  "comorbidities": ["2-tur qandli diabet"],
  "allergies": ["Penitsillin (toshma)"],
  "medications": ["Metformin 1000 mg"],
  "exam_findings": {
    "general": "Holsiz, tez-tez yo'talyapti",
    "cardiovascular": "Taxikardiya, ritm to'g'ri",
    "respiratory": "O'ng pastki bo'limda krepitatsiya va bronxial nafas, perkussiyada bo'g'iq tovush",
    "other": "Labda tsianoz yo'q"
  },
  "diagnostics": {
    "ecg": "Sinus taxikardiyasi",
    "labs": "Leykotsitlar 16.5, CRP 120, mochevina 8 mmol/l",
    "imaging": "Rentgen: o'ng pastki bo'lakda infiltratsiya"
  },
  "deterioration_triggers": ["Penitsillin allergiyasi so'ralmasdan penitsillin berilsa", "SpO2 nazorat qilinmasa"],
  "improvement_triggers": ["Allergiyaga mos antibiotik tanlansa", "Kislorod berilsa va gospitalizatsiya rejalashtirilsa"]
}
```

---

## 4. Diabetik ketoatsidoz

- **Mavzu:** Endokrinologiya
- **Sarlavha** — UZ: Qandli diabet / Diabetik ketoatsidoz · RU: Сахарный диабет / Диабетический кетоацидоз · EN: Diabetes / Diabetic ketoacidosis
- **Kichik sarlavha** — UZ: Chanqoq, qusish va holsizlik · RU: Жажда, рвота и слабость · EN: Thirst, vomiting and weakness
- **Chief complaint**
  - UZ: Ikki kundan beri qattiq chanqayapman, ko'p siyaman, ko'ngil ayniydi, qorin og'riydi. Bugun nafasim tez-tez va chuqur, o'zimni juda holsiz his qilyapman.
  - RU: Два дня сильная жажда, частое мочеиспускание, тошнота, боль в животе. Сегодня дыхание частое и глубокое, очень слабая.
  - EN: For two days I've been very thirsty, urinating often, nauseous with abdominal pain. Today my breathing is fast and deep and I feel extremely weak.
- **Kutilgan javob:** Diabetik ketoatsidoz (1-tur diabet). Qadamlar: ABCDE, glyukoza va keton, qon gazi, elektrolitlar (K+), 0.9% NaCl bilan suyuqlik, kaliy nazorati ostida qisqa ta'sirli insulin infuziyasi, provokator sababni qidirish, monitoring.
- **Qiyinlik:** hard · **Yosh:** 19 · **Jins:** female · **Davomiylik:** 20
- **Vitals:** HR 118 · BP 100/60 · SpO2 97 · RR 28 · Harorat 37.2 · GCS 14
- **visual_state:** unstable
- **AI generatsiya uchun kirish:** Mavzu: Diabetik ketoatsidoz · Qiyinlik: hard

**Scenario (JSON)**
```json
{
  "history": "1-tur diabet 6 yildan beri. 3 kun oldin insulin dozasini o'tkazib yuborgan, shamollash bo'lgan.",
  "comorbidities": ["1-tur qandli diabet"],
  "allergies": [],
  "medications": ["Insulin glargin", "Insulin aspart"],
  "exam_findings": {
    "general": "Quruq shilliq qavatlar, atseton hidi, uyquchan",
    "cardiovascular": "Taxikardiya, teri turgori pasaygan",
    "respiratory": "Chuqur va tez nafas (Kussmaul)",
    "other": "Qorin yumshoq, diffuz og'riqli"
  },
  "diagnostics": {
    "ecg": "Sinus taxikardiyasi",
    "labs": "Glyukoza 29 mmol/l, pH 7.12, bikarbonat 8, ketonlar yuqori, K+ 5.4",
    "imaging": "Talab qilinmaydi"
  },
  "deterioration_triggers": ["Insulin suyuqliksiz boshlansa", "Kaliy nazorat qilinmasa", "Glyukoza tez tushirilsa"],
  "improvement_triggers": ["Suyuqlik infuziyasi boshlansa", "Insulin infuziyasi kaliyni hisobga olib berilsa"]
}
```

---

## 5. Ishemik insult

- **Mavzu:** Nevrologiya
- **Sarlavha** — UZ: To'satdan nutq buzilishi / Ishemik insult · RU: Внезапное нарушение речи / Ишемический инсульт · EN: Sudden speech problems / Ischemic stroke
- **Kichik sarlavha** — UZ: Yuz qiyshayishi va qo'l zaifligi · RU: Перекос лица и слабость в руке · EN: Facial droop and arm weakness
- **Chief complaint**
  - UZ: Bir soat oldin to'satdan o'ng qo'lim ishlamay qoldi, og'zim qiyshaydi, gapirolmayapman. Rafiqam shoshib olib keldi.
  - RU: Час назад внезапно перестала двигаться правая рука, перекосило рот, не могу говорить. Жена срочно привезла.
  - EN: An hour ago my right arm suddenly stopped working, my mouth drooped and I can't speak. My wife rushed me in.
- **Kutilgan javob:** O'tkir ishemik insult (chap o'rta miya arteriyasi). Qadamlar: "oxirgi sog'lom vaqt"ni aniqlash, glyukoza, shoshilinch bosh miya KT (qon ketishni inkor), NIHSS, trombolitik terapiya mezonlarini baholash (4.5 soat), trombektomiya imkoniyati, qon bosimini nazorat qilish.
- **Qiyinlik:** hard · **Yosh:** 72 · **Jins:** male · **Davomiylik:** 20
- **Vitals:** HR 88 · BP 185/105 · SpO2 96 · RR 18 · Harorat 36.7 · GCS 13
- **visual_state:** unstable
- **AI generatsiya uchun kirish:** Mavzu: Ishemik insult · Qiyinlik: hard

**Scenario (JSON)**
```json
{
  "history": "Simptomlar 60 daqiqa oldin boshlangan. Bosh jarohati yo'q. Bemor so'zlarni noaniq talaffuz qiladi, yaqinlari tarixni aytadi.",
  "comorbidities": ["Arterial gipertenziya", "Bo'lmachalar fibrillyatsiyasi (antikoagulyant olmagan)"],
  "allergies": [],
  "medications": ["Enalapril 10 mg"],
  "exam_findings": {
    "general": "Hushyor, buyruqlarga qisman javob beradi",
    "cardiovascular": "Aritmik puls",
    "respiratory": "Vezikulyar nafas",
    "other": "O'ng yuz ostida simmetriya buzilgan, o'ng qo'lda kuch 1/5, afaziya"
  },
  "diagnostics": {
    "ecg": "Bo'lmachalar fibrillyatsiyasi",
    "labs": "Glyukoza 6.8, INR 1.0, trombotsitlar normal",
    "imaging": "KT: qon ketish yo'q, erta ishemik belgilar minimal"
  },
  "deterioration_triggers": ["KT kechiktirilsa", "Qon bosimi me'yordan keskin tushirilsa", "Vaqt oynasi o'tib ketsa"],
  "improvement_triggers": ["KT tezda olinsa", "Trombolitik terapiya mezonlari baholansa", "Insult markaziga yo'naltirilsa"]
}
```

---

## 6. Anafilaksiya

- **Mavzu:** Shoshilinch yordam
- **Sarlavha** — UZ: Allergik reaksiya / Anafilaksiya · RU: Аллергическая реакция / Анафилаксия · EN: Allergic reaction / Anaphylaxis
- **Kichik sarlavha** — UZ: Ari chaqqandan keyin nafas qisilishi · RU: Одышка после укуса осы · EN: Breathlessness after a wasp sting
- **Chief complaint**
  - UZ: Bog'da meni ari chaqdi. Besh daqiqadan keyin butun badanim qichishdi, lablarim va yuzim shishdi, nafas olish qiyin, bosh aylanyapti.
  - RU: В саду меня ужалила оса. Через пять минут всё тело зачесалось, отекли губы и лицо, трудно дышать, кружится голова.
  - EN: A wasp stung me in the garden. Within five minutes my whole body itched, my lips and face swelled, I'm struggling to breathe and feel dizzy.
- **Kutilgan javob:** Anafilaktik shok. Qadamlar: darhol mushak ichiga adrenalin (son tashqi yuzasi), yotqizib oyoqlarni ko'tarish, kislorod yuqori oqimda, vena ichiga suyuqlik, keyin antigistamin va glyukokortikoid, kuzatuv, qayta reaksiya xavfi.
- **Qiyinlik:** medium · **Yosh:** 30 · **Jins:** female · **Davomiylik:** 10
- **Vitals:** HR 130 · BP 80/50 · SpO2 90 · RR 28 · Harorat 36.6 · GCS 15
- **visual_state:** critical
- **AI generatsiya uchun kirish:** Mavzu: Anafilaksiya · Qiyinlik: medium

**Scenario (JSON)**
```json
{
  "history": "Ilgari ari chaqishiga yengil reaksiya bo'lgan. Bronxial astma yo'q.",
  "comorbidities": [],
  "allergies": ["Ari chaqishi"],
  "medications": [],
  "exam_findings": {
    "general": "Tashvishda, yuz va lablar shishgan",
    "cardiovascular": "Taxikardiya, sovuq akrolar",
    "respiratory": "Stridor, o'pkada sibilant xirillash",
    "other": "Butun badanda urtikar toshma"
  },
  "diagnostics": {
    "ecg": "Sinus taxikardiyasi",
    "labs": "Odatda talab qilinmaydi, triptaza keyin olinadi",
    "imaging": "Talab qilinmaydi"
  },
  "deterioration_triggers": ["Adrenalin kechiktirilsa yoki vena ichiga bolus berilsa", "Faqat antigistamin berilsa"],
  "improvement_triggers": ["Mushak ichiga adrenalin berilsa", "Kislorod va suyuqlik boshlansa"]
}
```

---

## 7. Bronxial astma xuruji (bola)

- **Mavzu:** Pediatriya
- **Sarlavha** — UZ: Bolada nafas qisilishi / Astma xuruji · RU: Одышка у ребёнка / Приступ астмы · EN: Child with breathlessness / Asthma attack
- **Kichik sarlavha** — UZ: Xirillash va yo'tal · RU: Свистящее дыхание и кашель · EN: Wheezing and cough
- **Chief complaint**
  - UZ: (Onasi aytadi) O'g'lim kechadan beri yo'talyapti, nafasi xirillayapti, gapirganda gapini tugata olmayapti. Ingalyatori yordam bermayapti.
  - RU: (Рассказывает мама) Сын с вечера кашляет, дыхание свистящее, не может договорить фразу. Ингалятор не помогает.
  - EN: (Mother speaking) My son has been coughing since last night, his breathing is wheezy and he can't finish his sentences. His inhaler isn't helping.
- **Kutilgan javob:** O'rta og'irlikdagi astma xuruji. Qadamlar: SpO2, kislorod (<94%), qisqa ta'sirli beta-2 agonist (salbutamol) nebulayzer/spacer, ipratropiy, tizimli glyukokortikoid, qayta baholash, og'irlashsa shoshilinch yordam.
- **Qiyinlik:** easy · **Yosh:** 9 · **Jins:** male · **Davomiylik:** 10
- **Vitals:** HR 125 · BP 100/65 · SpO2 92 · RR 30 · Harorat 36.9 · GCS 15
- **visual_state:** unstable
- **AI generatsiya uchun kirish:** Mavzu: Bolalarda bronxial astma xuruji · Qiyinlik: easy

**Scenario (JSON)**
```json
{
  "history": "Astma 4 yoshdan. Shamollashdan keyin yomonlashgan. Ingalyatorni tungi soatlardan beri 4 marta ishlatgan.",
  "comorbidities": ["Allergik rinit"],
  "allergies": ["Chang", "Mushuk junlari"],
  "medications": ["Salbutamol ingalyatori (kerak bo'lganda)", "Beklometazon ingalyatori"],
  "exam_findings": {
    "general": "O'tirib, oldinga egilgan, gaplashishi qiyin",
    "cardiovascular": "Taxikardiya",
    "respiratory": "Chiqarishda diffuz xirillash, yordamchi mushaklar ishtirokida",
    "other": "Tsianoz yo'q"
  },
  "diagnostics": {
    "ecg": "Talab qilinmaydi",
    "labs": "Talab qilinmaydi",
    "imaging": "Odatda talab qilinmaydi"
  },
  "deterioration_triggers": ["Kislorodsiz kuzatilsa", "Davolash kechiktirilsa"],
  "improvement_triggers": ["Salbutamol nebulayzer berilsa", "Glyukokortikoid berilsa"]
}
```

---

## 8. Gipertonik inqiroz

- **Mavzu:** Kardiologiya
- **Sarlavha** — UZ: Bosh og'rig'i va yuqori bosim / Gipertonik inqiroz · RU: Головная боль и высокое давление / Гипертонический криз · EN: Headache and high blood pressure / Hypertensive crisis
- **Kichik sarlavha** — UZ: Qon bosimi keskin oshgan · RU: Резкий подъём давления · EN: Sharp rise in blood pressure
- **Chief complaint**
  - UZ: Ensam qattiq og'riyapti, boshim aylanyapti, ko'z oldim xiralashdi. Uyda bosimni o'lchadim, juda baland chiqdi.
  - RU: Сильно болит затылок, кружится голова, мутнеет в глазах. Дома измерила давление, очень высокое.
  - EN: I have a severe headache at the back of my head, dizziness and blurred vision. I measured my blood pressure at home and it was very high.
- **Kutilgan javob:** Gipertonik inqiroz (organ shikastlanishi belgilari bor-yo'qligini baholash). Qadamlar: takroriy o'lchash ikkala qo'lda, nevrologik/ko'z tubi/yurak tekshiruvi, EKG, siydik va qon tahlili, bosimni bosqichma-bosqich (birinchi soatda ≤25%) pasaytirish, dori rejimini aniqlash.
- **Qiyinlik:** easy · **Yosh:** 55 · **Jins:** female · **Davomiylik:** 10
- **Vitals:** HR 86 · BP 210/120 · SpO2 97 · RR 18 · Harorat 36.6 · GCS 15
- **visual_state:** unstable
- **AI generatsiya uchun kirish:** Mavzu: Gipertonik inqiroz · Qiyinlik: easy

**Scenario (JSON)**
```json
{
  "history": "Gipertoniya 10 yil. 5 kundan beri dorilarni muntazam ichmagan. Ko'krak og'rig'i yo'q.",
  "comorbidities": ["Arterial gipertenziya"],
  "allergies": [],
  "medications": ["Lizinopril (nomuntazam)"],
  "exam_findings": {
    "general": "Bezovta, yuzi qizargan",
    "cardiovascular": "Ritm to'g'ri, shovqin yo'q",
    "respiratory": "Vezikulyar nafas",
    "other": "Nevrologik o'choqli belgilar yo'q"
  },
  "diagnostics": {
    "ecg": "Chap qorincha gipertrofiyasi belgilari",
    "labs": "Kreatinin 98, siydikda oqsil izlari",
    "imaging": "Talab qilinmaydi"
  },
  "deterioration_triggers": ["Bosim juda tez tushirilsa", "Organ shikastlanishi baholanmasa"],
  "improvement_triggers": ["Bosim nazorat ostida pasaytirilsa", "Doimiy terapiya qayta ko'rib chiqilsa"]
}
```

---

## 9. O'pka arteriyasi tromboemboliyasi

- **Mavzu:** Pulmonologiya
- **Sarlavha** — UZ: To'satdan nafas qisilishi / O'pka arteriyasi tromboemboliyasi · RU: Внезапная одышка / ТЭЛА · EN: Sudden breathlessness / Pulmonary embolism
- **Kichik sarlavha** — UZ: Uzoq parvozdan keyin · RU: После долгого перелёта · EN: After a long flight
- **Chief complaint**
  - UZ: Uzoq parvozdan qaytganimdan ikki kun o'tdi. Bugun to'satdan nafasim qisdi, nafas olganda ko'kragim sanchiydi, o'ng boldirim shishgan va og'riydi.
  - RU: Два дня назад вернулась с долгого перелёта. Сегодня внезапно возникла одышка, колет в груди при вдохе, правая голень отекла и болит.
  - EN: I returned from a long flight two days ago. Today I suddenly became breathless, my chest stings when I inhale, and my right calf is swollen and painful.
- **Kutilgan javob:** O'pka arteriyasi tromboemboliyasi (chuqur vena trombozi fonida). Qadamlar: Wells/Geneva ball, kislorod, D-dimer, o'pka KT-angiografiyasi, oyoq venalari UZI, antikoagulyant terapiya (kontrendikatsiya bo'lmasa), og'ir holatda tromboliz.
- **Qiyinlik:** hard · **Yosh:** 38 · **Jins:** female · **Davomiylik:** 20
- **Vitals:** HR 112 · BP 110/70 · SpO2 89 · RR 26 · Harorat 37.1 · GCS 15
- **visual_state:** critical
- **AI generatsiya uchun kirish:** Mavzu: O'pka arteriyasi tromboemboliyasi · Qiyinlik: hard

**Scenario (JSON)**
```json
{
  "history": "11 soatlik parvoz. Kontratseptiv tabletkalar qabul qiladi. Chekmaydi.",
  "comorbidities": [],
  "allergies": [],
  "medications": ["Kombinatsiyalangan og'iz kontratseptivi"],
  "exam_findings": {
    "general": "Tashvishda, nafas olishi qiyin",
    "cardiovascular": "Taxikardiya, bo'yin venalari biroz bo'rtgan",
    "respiratory": "Vezikulyar nafas, pleura ishqalanishi yo'q",
    "other": "O'ng boldir 3 sm kattaroq, paypaslanganda og'riqli"
  },
  "diagnostics": {
    "ecg": "Sinus taxikardiyasi, S1Q3T3 belgisi",
    "labs": "D-dimer yuqori, troponin biroz oshgan",
    "imaging": "KT-angiografiya: o'ng o'pka arteriyasida to'ldirish defekti"
  },
  "deterioration_triggers": ["Antikoagulyant kechiktirilsa", "Kislorod berilmasa", "Gipotenziya yuzaga kelsa"],
  "improvement_triggers": ["Kislorod va antikoagulyant boshlansa", "KT-angiografiya o'z vaqtida o'tkazilsa"]
}
```

---

## 10. Yuqori oshqozon-ichak qon ketishi

- **Mavzu:** Gastroenterologiya
- **Sarlavha** — UZ: Qonli qusish / Oshqozon-ichak qon ketishi · RU: Рвота с кровью / ЖКК · EN: Vomiting blood / GI bleeding
- **Kichik sarlavha** — UZ: Qora najas va holsizlik · RU: Чёрный стул и слабость · EN: Black stools and weakness
- **Chief complaint**
  - UZ: Ikki kundan beri najasim qora, qatronsimon. Bugun qahva donasiga o'xshash qayt qildim, boshim aylanyapti, o'zimni juda holsiz his qilyapman.
  - RU: Два дня чёрный дёгтеобразный стул. Сегодня была рвота «кофейной гущей», кружится голова, очень слабость.
  - EN: For two days my stools have been black and tarry. Today I vomited material like coffee grounds, I feel dizzy and very weak.
- **Kutilgan javob:** Yuqori oshqozon-ichak qon ketishi (ehtimol oshqozon yarasi). Qadamlar: ABCDE, ikkita yirik vena kateteri, suyuqlik, qon guruhi va moslik, gemoglobin, proton nasosi ingibitori vena ichiga, NSAID to'xtatish, shoshilinch endoskopiya, kerak bo'lsa qon quyish.
- **Qiyinlik:** medium · **Yosh:** 50 · **Jins:** male · **Davomiylik:** 15
- **Vitals:** HR 120 · BP 90/60 · SpO2 96 · RR 22 · Harorat 36.5 · GCS 15
- **visual_state:** unstable
- **AI generatsiya uchun kirish:** Mavzu: Yuqori oshqozon-ichak qon ketishi · Qiyinlik: medium

**Scenario (JSON)**
```json
{
  "history": "Bel og'rig'i uchun bir oy davomida diklofenak ichgan. Spirtli ichimliklarni haftasiga bir necha marta iste'mol qiladi.",
  "comorbidities": ["Surunkali gastrit"],
  "allergies": [],
  "medications": ["Diklofenak 75 mg"],
  "exam_findings": {
    "general": "Rangi oqargan, yengil terlagan",
    "cardiovascular": "Taxikardiya, kapillyar to'lish sekin",
    "respiratory": "Vezikulyar nafas",
    "other": "Epigastriyada yengil og'riq, rektal tekshiruvda melena"
  },
  "diagnostics": {
    "ecg": "Sinus taxikardiyasi",
    "labs": "Gemoglobin 78 g/l, mochevina yuqori",
    "imaging": "Endoskopiya: ikkitali o'n ikki barmoq ichak yarasi, faol qon ketish"
  },
  "deterioration_triggers": ["Suyuqlik kechiktirilsa", "NSAID to'xtatilmasa", "Endoskopiya kechiksa"],
  "improvement_triggers": ["Suyuqlik va PPI boshlansa", "Endoskopik gemostaz o'tkazilsa"]
}
```

---

## 11. Urosepsis (septik shok xavfi)

- **Mavzu:** Ichki kasalliklar
- **Sarlavha** — UZ: Isitma va holsizlik / Urosepsis · RU: Лихорадка и слабость / Уросепсис · EN: Fever and weakness / Urosepsis
- **Kichik sarlavha** — UZ: Titroq bilan isitma, bel og'rig'i · RU: Озноб с лихорадкой, боль в пояснице · EN: Fever with chills, back pain
- **Chief complaint**
  - UZ: Kechadan beri qaltirab isitmam chiqdi, belim og'riydi, siyganda achishadi. Bugun chalkashib qoldim, o'zimni juda yomon his qilyapman.
  - RU: С вечера озноб и температура, болит поясница, жжение при мочеиспускании. Сегодня спутанность, очень плохо себя чувствую.
  - EN: Since last night I've had fever with shivering, back pain and burning on urination. Today I feel confused and very unwell.
- **Kutilgan javob:** Siydik yo'llari infeksiyasidan sepsis. Qadamlar: qon va siydik madaniyati, laktat, birinchi soatda keng spektrli antibiotik, 30 ml/kg kristalloid suyuqlik, MAP nazorati, manbani aniqlash (UZI), vazopressorga ehtiyoj bo'lsa reanimatsiya.
- **Qiyinlik:** medium · **Yosh:** 68 · **Jins:** female · **Davomiylik:** 15
- **Vitals:** HR 114 · BP 88/52 · SpO2 94 · RR 24 · Harorat 38.9 · GCS 14
- **visual_state:** critical
- **AI generatsiya uchun kirish:** Mavzu: Urosepsis · Qiyinlik: medium

**Scenario (JSON)**
```json
{
  "history": "Takroriy siydik yo'llari infeksiyalari. Uch kundan beri siydik chiqarishda og'riq, davolanmagan.",
  "comorbidities": ["2-tur qandli diabet", "Arterial gipertenziya"],
  "allergies": [],
  "medications": ["Metformin", "Amlodipin"],
  "exam_findings": {
    "general": "Chalkash, terisi issiq va qizargan",
    "cardiovascular": "Taxikardiya",
    "respiratory": "Tez nafas, o'pkada xirillash yo'q",
    "other": "Chap bel sohasi urib ko'rilganda og'riqli"
  },
  "diagnostics": {
    "ecg": "Sinus taxikardiyasi",
    "labs": "Leykotsitlar 21, laktat 3.8 mmol/l, siydikda piuriya, kreatinin oshgan",
    "imaging": "UZI: chap buyrakda kengaygan jom"
  },
  "deterioration_triggers": ["Antibiotik soatdan keyin berilsa", "Suyuqlik yetarli bo'lmasa", "Siydik yo'llari obstruksiyasi chetda qolsa"],
  "improvement_triggers": ["Antibiotik va suyuqlik birinchi soatda berilsa", "Manba nazorati (drenaj) rejalashtirilsa"]
}
```

---

## 12. Buyrak sanchig'i

- **Mavzu:** Urologiya
- **Sarlavha** — UZ: Bel og'rig'i / Buyrak sanchig'i · RU: Боль в пояснице / Почечная колика · EN: Flank pain / Renal colic
- **Kichik sarlavha** — UZ: Qattiq, to'lqinsimon og'riq · RU: Сильная приступообразная боль · EN: Severe colicky pain
- **Chief complaint**
  - UZ: Bir soat oldin o'ng belimda to'satdan qattiq og'riq boshlandi, pastga, chov tomonga tarqalyapti. Joyimda turolmayapman, ko'ngil aynidi.
  - RU: Час назад внезапно начались сильные боли в правой пояснице, отдают вниз в пах. Не могу найти место, тошнит.
  - EN: An hour ago severe pain suddenly started in my right flank, radiating down toward the groin. I can't stay still and feel nauseous.
- **Kutilgan javob:** O'ng siydik yo'li toshidan buyrak sanchig'i. Qadamlar: og'riqsizlantirish (NSAID), siydik umumiy tahlili, kreatinin, UZI yoki past dozali KT, infeksiya belgilarini inkor etish, toshni chiqarishga yordam (suyuqlik, alfa-blokator), og'ir holatda urologga yo'naltirish.
- **Qiyinlik:** easy · **Yosh:** 35 · **Jins:** male · **Davomiylik:** 10
- **Vitals:** HR 92 · BP 140/85 · SpO2 99 · RR 18 · Harorat 36.9 · GCS 15
- **visual_state:** stable
- **AI generatsiya uchun kirish:** Mavzu: Buyrak sanchig'i · Qiyinlik: easy

**Scenario (JSON)**
```json
{
  "history": "Ilgari toshlar bo'lmagan. Ichimlik suvini kam iste'mol qiladi.",
  "comorbidities": [],
  "allergies": [],
  "medications": [],
  "exam_findings": {
    "general": "Bezovta, harakatlanib turadi",
    "cardiovascular": "Ritm to'g'ri",
    "respiratory": "Vezikulyar nafas",
    "other": "O'ng bel sohasi urib ko'rilganda og'riqli, qorin yumshoq"
  },
  "diagnostics": {
    "ecg": "Sinus ritmi",
    "labs": "Siydikda eritrotsitlar, leykotsitlar normal, kreatinin normal",
    "imaging": "UZI: o'ng siydik yo'lining pastki qismida 5 mm tosh, yengil gidronefroz"
  },
  "deterioration_triggers": ["Isitma qo'shilsa va infeksiya tan olinmasa", "Og'riqsizlantirish kechiktirilsa"],
  "improvement_triggers": ["NSAID berilsa", "Tahlillar va UZI o'tkazilsa"]
}
```

---

## 13. Gipoglikemiya

- **Mavzu:** Endokrinologiya
- **Sarlavha** — UZ: Terlash va titroq / Gipoglikemiya · RU: Потливость и дрожь / Гипогликемия · EN: Sweating and tremor / Hypoglycemia
- **Kichik sarlavha** — UZ: Insulindan keyin holat yomonlashdi · RU: Ухудшение после инсулина · EN: Feeling unwell after insulin
- **Chief complaint**
  - UZ: (Rafiqasi aytadi) Eri insulin qilib, ovqat yemagan edi. Endi terlab ketdi, qo'llari titrayapti, gapi chalkash, javoblari sekin.
  - RU: (Рассказывает жена) Муж сделал инсулин и не поел. Теперь весь в поту, дрожат руки, речь спутанная, отвечает медленно.
  - EN: (Wife speaking) My husband took insulin and skipped his meal. Now he's drenched in sweat, his hands are shaking, he's confused and slow to answer.
- **Kutilgan javob:** Og'ir bo'lmagan/o'rtacha gipoglikemiya. Qadamlar: kapillyar glyukoza darhol, hushi o'z joyida bo'lsa og'iz orqali tez uglevod (15–20 g), bo'lmasa vena ichiga dekstroza yoki mushak ichiga glyukagon, 15 daqiqada qayta o'lchash, keyin murakkab uglevodli ovqat, sababni aniqlash.
- **Qiyinlik:** easy · **Yosh:** 45 · **Jins:** male · **Davomiylik:** 8
- **Vitals:** HR 108 · BP 120/75 · SpO2 98 · RR 18 · Harorat 36.5 · GCS 13
- **visual_state:** unstable
- **AI generatsiya uchun kirish:** Mavzu: Gipoglikemiya · Qiyinlik: easy

**Scenario (JSON)**
```json
{
  "history": "1-tur diabet 15 yil. Tushlikdan keyin odatdagi dozada tez ta'sirli insulin qilgan, ovqatlanmagan, ishda jismoniy mehnat qilgan.",
  "comorbidities": ["1-tur qandli diabet"],
  "allergies": [],
  "medications": ["Insulin aspart", "Insulin glargin"],
  "exam_findings": {
    "general": "Rangi oqargan, nam teri, titroq",
    "cardiovascular": "Taxikardiya",
    "respiratory": "Vezikulyar nafas",
    "other": "O'choqli nevrologik belgilar yo'q"
  },
  "diagnostics": {
    "ecg": "Sinus taxikardiyasi",
    "labs": "Kapillyar glyukoza 2.4 mmol/l",
    "imaging": "Talab qilinmaydi"
  },
  "deterioration_triggers": ["Glyukoza o'lchanmasa", "Hushi pasayganda og'iz orqali ovqat berilsa"],
  "improvement_triggers": ["Tez uglevod yoki vena ichiga dekstroza berilsa", "Glyukoza qayta tekshirilsa"]
}
```

---

## 14. Taranglashuvchi pnevmotoraks

- **Mavzu:** Shoshilinch yordam / Travma
- **Sarlavha** — UZ: Travmadan keyin nafas qisilishi / Taranglashuvchi pnevmotoraks · RU: Одышка после травмы / Напряжённый пневмоторакс · EN: Breathlessness after trauma / Tension pneumothorax
- **Kichik sarlavha** — UZ: Qovurg'alarga zarbadan keyin · RU: После удара в рёбра · EN: After a blow to the ribs
- **Chief complaint**
  - UZ: Velosipeddan yiqilib, chap qovurg'amga urildim. Hozir nafas olish juda qiyin, chap tomonim qattiq og'riydi, bo'g'ilayapman.
  - RU: Упал с велосипеда, ударился левой стороной грудной клетки. Сейчас очень трудно дышать, сильно болит слева, задыхаюсь.
  - EN: I fell off my bike and hit my left ribs. Now it's very hard to breathe, my left side hurts badly and I feel like I'm suffocating.
- **Kutilgan javob:** Chap tomonlama taranglashuvchi pnevmotoraks. Qadamlar: ABCDE, yuqori oqimli kislorod, klinik tashxis (rentgenni kutmasdan), shoshilinch igna dekompressiyasi, so'ng ko'krak qafasi drenaji, qayta baholash.
- **Qiyinlik:** hard · **Yosh:** 25 · **Jins:** male · **Davomiylik:** 12
- **Vitals:** HR 130 · BP 85/50 · SpO2 85 · RR 32 · Harorat 36.4 · GCS 14
- **visual_state:** critical
- **AI generatsiya uchun kirish:** Mavzu: Taranglashuvchi pnevmotoraks · Qiyinlik: hard

**Scenario (JSON)**
```json
{
  "history": "Sog'lom yigit, bir soat oldin velosipeddan yiqilgan. Chekmaydi, surunkali kasalliklari yo'q.",
  "comorbidities": [],
  "allergies": [],
  "medications": [],
  "exam_findings": {
    "general": "Qo'rquvda, bo'g'ilmoqda, ter bosgan",
    "cardiovascular": "Taxikardiya, bo'yin venalari bo'rtgan",
    "respiratory": "Chapda nafas tovushi eshitilmaydi, perkussiyada timpanit, traxeya o'ngga siljigan",
    "other": "Chap qovurg'alarda teri osti emfizemasi"
  },
  "diagnostics": {
    "ecg": "Sinus taxikardiyasi",
    "labs": "Qon gazi: gipoksemiya",
    "imaging": "Rentgen tashxis uchun kutilmaydi; keyin chapda to'liq pnevmotoraks"
  },
  "deterioration_triggers": ["Rentgen kutib vaqt yo'qotilsa", "Dekompressiya kechiktirilsa", "Musbat bosimli ventilyatsiya dekompressiyasiz boshlansa"],
  "improvement_triggers": ["Igna dekompressiyasi o'tkazilsa", "Drenaj qo'yilsa"]
}
```

---

## 15. O'tkir yurak yetishmovchiligi (o'pka shishi)

- **Mavzu:** Kardiologiya
- **Sarlavha** — UZ: Tunda bo'g'ilish / O'tkir yurak yetishmovchiligi · RU: Ночное удушье / Острая сердечная недостаточность · EN: Night-time breathlessness / Acute heart failure
- **Kichik sarlavha** — UZ: Yotganda nafas qisilishi, ko'pikli balg'am · RU: Одышка лёжа, пенистая мокрота · EN: Breathlessness lying flat, frothy sputum
- **Chief complaint**
  - UZ: Tunda to'satdan bo'g'ilib uyg'onib ketdim, yotolmayman, o'tirib nafas olyapman. Pushti ko'pikli balg'am ajralyapti. Oyoqlarim bir haftadan beri shishgan.
  - RU: Ночью внезапно проснулся от удушья, не могу лежать, дышу только сидя. Отходит розовая пенистая мокрота. Неделю отекают ноги.
  - EN: I woke suddenly at night gasping, can't lie down and breathe only sitting up. I'm coughing up pink frothy sputum. My legs have been swollen for a week.
- **Kutilgan javob:** O'tkir kardiogen o'pka shishi (dekompensatsiyalangan surunkali yurak yetishmovchiligi). Qadamlar: o'tirgan holat, kislorod/NIV (CPAP), vena ichiga loop diuretik, nitrat (SBP >100 bo'lsa), EKG, troponin, BNP, ko'krak qafasi rentgeni, provokatorni qidirish (ishemiya, aritmiya, tuz/suyuqlik).
- **Qiyinlik:** medium · **Yosh:** 70 · **Jins:** male · **Davomiylik:** 15
- **Vitals:** HR 112 · BP 160/100 · SpO2 86 · RR 30 · Harorat 36.8 · GCS 15
- **visual_state:** critical
- **AI generatsiya uchun kirish:** Mavzu: O'tkir yurak yetishmovchiligi / o'pka shishi · Qiyinlik: medium

**Scenario (JSON)**
```json
{
  "history": "Bir hafta davomida tuzli ovqat ko'p yeb, diuretikni ichmagan. Oldin miokard infarkti o'tkazgan.",
  "comorbidities": ["Surunkali yurak yetishmovchiligi (EF 30%)", "Arterial gipertenziya", "Eski miokard infarkti"],
  "allergies": [],
  "medications": ["Furosemid 40 mg (nomuntazam)", "Karvedilol", "Enalapril"],
  "exam_findings": {
    "general": "O'tirib, bo'g'ilmoqda, terlagan",
    "cardiovascular": "Taxikardiya, III ton, bo'yin venalari bo'rtgan",
    "respiratory": "Ikkala o'pkada nam mayda va o'rta pufakchali xirillash",
    "other": "Boldirlarda botuvchi shish"
  },
  "diagnostics": {
    "ecg": "Sinus taxikardiyasi, eski Q tishlari",
    "labs": "BNP juda yuqori, troponin biroz oshgan, kreatinin 120",
    "imaging": "Rentgen: o'pka shishi, yurak soyasi kengaygan"
  },
  "deterioration_triggers": ["Kislorod berilmasa", "Yotqizib qo'yilsa", "Nitrat gipotenziyada berilsa"],
  "improvement_triggers": ["Kislorod/CPAP boshlansa", "Vena ichiga furosemid berilsa", "Nitrat to'g'ri ko'rsatmada berilsa"]
}
```

---

## Tezkor jadval

| # | Mavzu | Qiyinlik | Yosh/Jins | HR | BP | SpO2 | RR | T | GCS | visual_state |
|---|-------|----------|-----------|----|----|------|----|---|-----|--------------|
| 1 | STEMI | medium | 58 / male | 98 | 150/95 | 94 | 22 | 36.8 | 15 | unstable |
| 2 | Appenditsit | easy | 24 / female | 92 | 118/74 | 99 | 16 | 37.9 | 15 | stable |
| 3 | Pnevmoniya | medium | 67 / male | 104 | 126/78 | 91 | 24 | 38.8 | 15 | unstable |
| 4 | DKA | hard | 19 / female | 118 | 100/60 | 97 | 28 | 37.2 | 14 | unstable |
| 5 | Ishemik insult | hard | 72 / male | 88 | 185/105 | 96 | 18 | 36.7 | 13 | unstable |
| 6 | Anafilaksiya | medium | 30 / female | 130 | 80/50 | 90 | 28 | 36.6 | 15 | critical |
| 7 | Astma (bola) | easy | 9 / male | 125 | 100/65 | 92 | 30 | 36.9 | 15 | unstable |
| 8 | Gipertonik inqiroz | easy | 55 / female | 86 | 210/120 | 97 | 18 | 36.6 | 15 | unstable |
| 9 | O'ATE | hard | 38 / female | 112 | 110/70 | 89 | 26 | 37.1 | 15 | critical |
| 10 | Yuqori GI qon ketish | medium | 50 / male | 120 | 90/60 | 96 | 22 | 36.5 | 15 | unstable |
| 11 | Urosepsis | medium | 68 / female | 114 | 88/52 | 94 | 24 | 38.9 | 14 | critical |
| 12 | Buyrak sanchig'i | easy | 35 / male | 92 | 140/85 | 99 | 18 | 36.9 | 15 | stable |
| 13 | Gipoglikemiya | easy | 45 / male | 108 | 120/75 | 98 | 18 | 36.5 | 13 | unstable |
| 14 | Taranglashuvchi pnevmotoraks | hard | 25 / male | 130 | 85/50 | 85 | 32 | 36.4 | 14 | critical |
| 15 | O'tkir yurak yetishmovchiligi | medium | 70 / male | 112 | 160/100 | 86 | 30 | 36.8 | 15 | critical |
