# Kardiologiya bo'limi — test case'lar (admin panel → Case'lar → "Yangi Case")

3 ta kardiologik case. Tartib: **Bo'lim → Mavzu → Sarlavha → Kichik sarlavha → Bemor shikoyati → Kutilgan javob → qolgan maydonlar**.

**Qo'llanma**
- **Qiyinlik:** `easy` | `medium` | `hard`. **Jins:** `male` | `female`. **visual_state:** `stable` | `unstable` | `critical`.
- "AI yordamida generatsiya qilingan case" belgisini qo'ymang (bular qo'lda yaratiladi).
- Mavzu nomlarini admin paneldagi mavjud mavzularga moslang.
- Dori dozalari va vaqt mezonlari xalqaro qo'llanmalarga (ESC/AHA/ACC) asoslangan; ishlatishdan oldin klinitsist ko'rib chiqsin.
- Barcha ma'lumotlar o'quv/test maqsadida.

---

## 1. O'tkir koronar sindrom (STEMI)

- **Bo'lim:** Kardiologiya
- **Mavzu:** O'tkir koronar sindrom
- **Sarlavha:** Shoshilinch kardiologiya / O'tkir koronar sindrom
- **Kichik sarlavha:** Ko'krak qafasidagi og'riq

**Bemor shikoyati (Chief complaint)**
```
Doktor, ko'kragim juda qattiq siqilyapti — go'yo ustimga og'ir tosh qo'yib qo'ygandek. Og'riq ko'krak o'rtasida, to'sh orqasida, u yerdan chap qo'limga, chap yelkamga va pastki jag'imga tarqalyapti. Taxminan 40 daqiqa oldin ishdan qaytib, uyimizning 3-qavatiga zinadan chiqayotganda to'satdan boshlandi. Dastlab "charchadim shekilli" deb o'tirib dam oldim, lekin og'riq o'tmadi, aksincha kuchaydi. Hozir men uni 10 balldan 8-9 deb baholayman. Sovuq ter bosdi, ko'nglim aynayapti, bir marta qayt qildim, nafasim yetmayapti, boshim biroz aylanayapti.

Uyda nitroglitserin tabletkasini til ostiga qo'ydim, 5 daqiqa kutdim, yengillashmadi, ikkinchisini ham qo'ydim — baribir o'tmadi. Bunday og'riq umrimda birinchi marta, ilgari zo'riqqanda ozgina siqilish bo'lardi, lekin tezda o'tib ketardi. Chekaman (kuniga 1 pachka, taxminan 20 yildan beri), qon bosimim yuqori (3 yildan beri), xolesterinim ham baland deyishgan, lekin davolanmaganman. Otam 55 yoshida yurak xurujidan vafot etgan. Allergiyam yo'q. Oxirgi ovqatni 3 soat oldin yedim. Qayt qilgandan keyin ham og'riq pasaymadi, qo'rqib ketdim, o'lib qolaman deb o'ylayapman.
```

**Kutilgan javob**
```
TASHXIS: Pastki devor ST ko'tarilishli o'tkir miokard infarkti (inferior STEMI), Killip I.

ASOSLASH: Tipik anginoz og'riq (to'sh orqasida, chap qo'l va jag'ga tarqaluvchi, 20 daqiqadan uzoq, nitratga javob bermaydi), vegetativ belgilar (sovuq ter, ko'ngil aynishi, qayt), xavf omillari (chekish, gipertoniya, dislipidemiya, otasida erta yurak o'limi), EKGda II, III, aVF tarmoqlarida ST ko'tarilishi.

KETMA-KET QADAMLAR:
1. Birinchi 10 daqiqa ichida: ABCDE baholash, monitoring (EKG, AB, SpO2), periferik vena yo'li, 12 kanalli EKG (pastki devor uchun o'ng tomonlama V4R ham olinadi — o'ng qorincha ishtiroki bor-yo'qligini bilish uchun).
2. Aspirin 250–300 mg chaynab ichish (yuklama doza) + P2Y12 ingibitori (tikagrelor 180 mg yoki klopidogrel 600 mg).
3. Kislorod faqat SpO2 <90% bo'lsa (bu bemorda 94% — rutin kislorod kerak emas).
4. Og'riqsizlantirish: nitroglitserin til ostiga (SBP >90 va o'ng qorincha infarkti bo'lmasa), og'riq davom etsa vena ichiga morfin 2–4 mg sekin (ehtiyotkorlik bilan, qayt/gipotenziya xavfi).
5. Antikoagulyant: geparin 70–100 birlik/kg vena ichiga yoki enoksaparin 30 mg v/i + 1 mg/kg t/o.
6. Reperfuziya strategiyasi: birlamchi PCI — birinchi tibbiy aloqadan 90 daqiqa ichida ("eshikdan balon"ga ≤60–90 daqiqa); agar PCI 120 daqiqa ichida imkonsiz bo'lsa — fibrinoliz (tenekteplaza) 30 daqiqa ichida.
7. Shoshilinch koronarografiya va PCI uchun kardioxirurgiya/rentgen-endovaskulyar markazga yo'naltirish.
8. Laborator: troponin (kutmasdan, EKG diagnostik bo'lsa reperfuziyani kechiktirmaslik), umumiy qon, elektrolitlar, kreatinin, glyukoza, lipidlar, koagulogramma.
9. Ko'krak qafasi rentgeni va exokardiografiya (qorincha funksiyasi, mexanik asoratlar) — reperfuziyani kechiktirmasdan.
10. Beta-bloker (gemodinamika turg'un va yurak yetishmovchiligi belgisi bo'lmasa), yuqori intensiv statin (atorvastatin 80 mg), AAF ingibitori keyingi kunlarda.

KUZATUV VA ASORATLAR: Aritmiyalar (qorincha fibrillyatsiyasi — defibrillyator tayyor tursin), kardiogen shok, o'ng qorincha infarkti (nitrat va diuretik berilmaydi, suyuqlik beriladi), AV blokada, mexanik asoratlar. Reanimatsiya/BIT'da kuzatuv.

KO'P UCHRAYDIGAN XATOLAR: EKGni 10 daqiqadan keyin olish; troponin natijasini kutib reperfuziyani kechiktirish; gipotenziyada nitrat berish; o'ng qorincha infarktida nitrat/morfin berish; aspirin va P2Y12 ingibitorini unutish.
```

- **Qiyinlik:** medium · **Yosh:** 58 · **Jins:** male · **Davomiylik:** 15
- **Vitals:** HR 98 · BP 150/95 · SpO2 94 · RR 22 · Harorat 36.8 · GCS 15
- **visual_state:** unstable

**Scenario (JSON)**
```json
{
  "history": "Chekuvchi (20 yil, kuniga 1 pachka), 3 yildan beri gipertoniya, davolanmagan. Og'riq jismoniy zo'riqishdan keyin boshlangan, 2 ta nitroglitserin tabletkasi yengillashtirmagan. Otasi 55 yoshida miokard infarktidan vafot etgan.",
  "comorbidities": ["Arterial gipertenziya", "Dislipidemiya"],
  "allergies": [],
  "medications": ["Amlodipin 5 mg (nomuntazam)"],
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

## 2. Gipertonik inqiroz

- **Bo'lim:** Kardiologiya
- **Mavzu:** Arterial gipertenziya
- **Sarlavha:** Bosh og'rig'i va yuqori bosim / Gipertonik inqiroz
- **Kichik sarlavha:** Qon bosimi keskin oshgan

**Bemor shikoyati (Chief complaint)**
```
Doktor, ensam ikki kundan beri og'riyapti, bugun ertalabdan esa juda kuchaydi — go'yo ensamni temir halqa bilan siqib turgandek, har yurak urishida lo'qillaydi. Boshim aylanyapti, ko'z oldim xiralashib, ba'zan "pashshalar uchib yurgandek" bo'lyapti. Quloqlarim shang'illayapti, ko'nglim aynib, bir marta qayt qildim. Uyda aparat bilan bosimni o'lchadim — 210/120 chiqdi, 15 daqiqadan keyin qayta o'lchadim, yana shunday. Yuzim qizarib, tanamda issiqlik sezyapman, bezovtalik bor.

Ko'krak og'rig'i yo'q, nafasim yetishmayapti deb ayta olmayman, qo'l-oyog'imda uvishish, gapirishda qiyinchilik yoki yuzimning qiyshayishi yo'q. Gipertoniyam 10 yildan beri bor, lizinopril ichaman, lekin so'nggi 5 kundan beri dorini muntazam ichmadim — tugab qolgandi, olishga ulgurmadim. Bundan tashqari bu kunlarda tuzli bodring, sho'r baliq ko'p yedim, oilaviy marosimda xavotir va stress ham bo'ldi. Og'riq qoldiruvchi dori (ibuprofen) ichdim, lekin foydasi bo'lmadi. Diabetim yo'q, chekmayman, spirtli ichimlik ichmayman. Allergiyam yo'q. Onam ham insultdan vafot etgan. Hozir qo'rqyapman, insult bo'lib qolmasin deb.
```

**Kutilgan javob**
```
TASHXIS: Gipertonik inqiroz — organ shikastlanishi belgilari bor-yo'qligi aniqlanadi (gipertonik shoshilinch holat yoki asoratlanmagan inqiroz). Mazkur holatda bosh og'rig'i, ko'rishning xiralashishi, qayt bor — ensefalopatiya xavfi baholanadi.

FARQLASH: Insult (ishemik/gemorragik), gipertonik ensefalopatiya, o'tkir koronar sindrom, aorta dissektsiyasi, o'tkir yurak yetishmovchiligi, preeklampsiya (ayollarda, homiladorlikni istisno qilish), feoxromotsitoma, buyrak kasalligi, dori/NPVS ta'siri.

KETMA-KET QADAMLAR:
1. ABCDE, tinch xonada dam berish, monitoring (AB har 5–15 daqiqada, EKG, SpO2).
2. AB ni ikkala qo'lda qayta o'lchash (farq >20 mm sim.ust. bo'lsa aorta dissektsiyasi haqida o'ylash).
3. Organ shikastlanishini baholash: nevrologik status (FAST, GCS), ko'z tubi (papilledema, qon quyilish), yurak (ko'krak og'rig'i, shovqinlar, o'pkada xirillash), buyrak.
4. Tekshiruvlar: 12 kanalli EKG, troponin, kreatinin, elektrolitlar, umumiy siydik tahlili (oqsil, eritrotsitlar), glyukoza, kerak bo'lsa bosh miya KT (nevrologik belgilar bo'lsa), ko'krak qafasi rentgeni.
5. Organ shikastlanishi YO'Q bo'lsa (asoratlanmagan): og'iz orqali dori bilan asta-sekin pasaytirish (amlodipin, lizinopril, kaptopril 12.5–25 mg til ostiga/ichga), 24–48 soat ichida normallashtirish. Vena ichiga kuchli dorilar kerak emas.
6. Organ shikastlanishi BOR bo'lsa: reanimatsiya/BITda vena ichiga titrlanadigan dori (nikardipin yoki labetalol, nitroprussid, nitrogliserin — kasallik turiga qarab). Maqsad: birinchi soatda o'rtacha AB ni 25% dan ortiq pasaytirmaslik, keyingi 2–6 soatda 160/100 gacha, 24–48 soatda normallashtirish.
7. Istisnolar: aorta dissektsiyasida SBP ni 5–10 daqiqada 120 gacha pasaytirish (beta-bloker bilan), o'tkir ishemik insultda (tromboliz bo'lmasa) AB ni <220/120 gacha ehtiyotkor pasaytirish.
8. Sababni aniqlash va bartaraf etish: dorini tashlab qo'yish, tuz iste'moli, NPVS, stress. Surunkali dori rejimini qayta ko'rib chiqish (kombinatsiyalangan terapiya).
9. Bemorga tushuntirish: dorini muntazam ichish, uyda AB kundaligi, tuzni kamaytirish (<5 g/kun), NPVSdan qochish, shifokor nazorati.

KUZATUV VA CHIQARISH: Asoratlanmagan holatda AB nazorat ostida tushsa va simptomlar yo'qolsa — ambulator kuzatuv (1 hafta ichida qayta ko'rik). Organ shikastlanishi bo'lsa — statsionar.

KO'P UCHRAYDIGAN XATOLAR: AB ni juda tez (til ostiga nifedipin bilan) tushirish — insult/infarkt xavfi; organ shikastlanishini baholamaslik; faqat raqamga qarab davolash; aorta dissektsiyasini o'ylamaslik; bemorni dori bilan ta'minlamay uyga yuborish.
```

- **Qiyinlik:** easy · **Yosh:** 55 · **Jins:** female · **Davomiylik:** 10
- **Vitals:** HR 86 · BP 210/120 · SpO2 97 · RR 18 · Harorat 36.6 · GCS 15
- **visual_state:** unstable

**Scenario (JSON)**
```json
{
  "history": "Gipertoniya 10 yil. 5 kundan beri dorilarni muntazam ichmagan, tuzli ovqat ko'p yegan, ibuprofen qabul qilgan. Ko'krak og'rig'i yo'q. Onasi insultdan vafot etgan.",
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

## 3. O'tkir yurak yetishmovchiligi (o'pka shishi)

- **Bo'lim:** Kardiologiya
- **Mavzu:** Yurak yetishmovchiligi
- **Sarlavha:** Tunda bo'g'ilish / O'tkir yurak yetishmovchiligi
- **Kichik sarlavha:** Yotganda nafas qisilishi, ko'pikli balg'am

**Bemor shikoyati (Chief complaint)**
```
Doktor, kechasi soat 2 larda to'satdan bo'g'ilib uyg'onib ketdim — havo yetmayapti, go'yo cho'kib ketayotgandek. Yotolmayman, o'tirib, ikki qo'limni tizzamga tayab nafas olyapman, derazani ochdim, lekin yengillashmadi. Yo'talim bor, pushti rangli, ko'pikli balg'am ajralyapti. Ko'kragimda siqilish bor, yurak tez-tez urayapti, butun badanim sovuq ter bilan qoplangan, lablarim ko'karganga o'xshaydi.

Oxirgi 2–3 haftadan beri holsizlik, zinadan chiqishda tez nafas qisilishi kuchaygan; so'nggi haftada oyoqlarim shishgan, kechalari yostiqni 3 ta qilib yotishga o'tdim, bel kamarim torayib qoldi. Ilgari 6 yil oldin miokard infarkti o'tkazganman, shifokor "yurak yetishmovchiligi, EF 30%" degan edi. Doimiy furosemid, karvedilol, enalapril ichishim kerak, lekin bir haftadan beri furosemidni ichmadim — tugab qolgandi, ko'p tuzli ovqat (osh, sho'r qaymoq, sho'rva) yedim, suv ham ko'p ichdim. Gipertoniyam bor. Qandli diabetim yo'q, chekmayman (5 yil oldin tashlaganman). Allergiyam yo'q. Isitma, shamollash, yo'tal bundan oldin bo'lmagan. Ko'krak og'rig'i bor edi, lekin kuchli emas.
```

**Kutilgan javob**
```
TASHXIS: O'tkir dekompensatsiyalangan yurak yetishmovchiligi — kardiogen o'pka shishi (surunkali yurak yetishmovchiligi fonida, EF ~30%, avvalgi miokard infarkti).

PROVOKATORLAR: Diuretikni to'xtatish, tuz va suyuqlik ko'p iste'mol qilish. Boshqa sabablarni ham istisno qilish: o'tkir koronar sindrom (troponin, EKG), aritmiya (bo'lmachalar fibrillyatsiyasi), infeksiya, anemiya, NPVS, buyrak yetishmovchiligi, gipertonik inqiroz.

FARQLASH: Pnevmoniya, KOBL/astma xuruji, o'pka arteriyasi tromboemboliyasi, ARDS (nokardiogen o'pka shishi), pnevmotoraks, perikard tamponadasi.

KETMA-KET QADAMLAR:
1. ABCDE, bemorni o'tirgan holatda (oyoqlari tushirilgan) saqlash. Monitoring: EKG, AB, SpO2, diurez nazorati (siydik kateteri).
2. Kislorod SpO2 <90% bo'lsa: niqob orqali 6–10 l/min; yetarli bo'lmasa noinvaziv ventilyatsiya (CPAP 5–10 sm suv ust. yoki BiPAP). SpO2 maqsadi ≥94%.
3. Vena ichiga loop diuretik: furosemid 40–80 mg v/i bolus (oldin qabul qilgan bo'lsa — 2.5 baravar yuqori); 1–2 soatda diurez <100–150 ml/soat bo'lsa dozani ikki baravar oshirish.
4. Vazodilatator: SBP >110 bo'lsa nitroglitserin til ostiga 0.4 mg yoki v/i infuziya 10–20 mkg/min dan; gipotenziya (SBP <90–100) bo'lsa berilmaydi.
5. Morfin faqat qo'zg'alish va og'ir dispnoe bo'lsa, ehtiyotkorlik bilan (nafas depressiyasi xavfi) — rutin tavsiya etilmaydi.
6. Kardiogen shok belgilari bo'lsa (SBP <90, sovuq akrotsianoz, oliguriya) — inotroplar (dobutamin), vazopressorlar (noradrenalin), reanimatsiya.
7. Tekshiruvlar: 12 kanalli EKG, troponin (seriyali), NT-proBNP/BNP, kreatinin, elektrolitlar (K, Na), umumiy qon, glyukoza, qon gazlari, laktat, ko'krak qafasi rentgeni, exokardiografiya (EF, qopqoqlar, perikard suyuqligi).
8. Ishemiya bo'lsa — ACS algoritmiga (antiagregantlar, koronarografiya). Aritmiya bo'lsa (masalan, tezkor bo'lmachalar fibrillyatsiyasi) — ritm/chastota nazorati yoki kardioversiya.
9. Statsionar bosqich: beta-bloker, AAF ingibitori/ARNI, MRA, SGLT2 ingibitori (keyin, turg'unlashgach), tuz va suyuqlik cheklovi, kunlik vazn nazorati.

KUZATUV VA CHIQARISH: Dispnoe yo'qolishi, SpO2 ≥94% xonaviy havoda, diurez barqarorligi, vazn kamayishi. Chiqarishdan oldin: dori rejimi, tuz <2–3 g/kun, vazn kundaligi (3 kunda >2 kg oshsa murojaat), 7 kun ichida kardiologga qayta ko'rik.

KO'P UCHRAYDIGAN XATOLAR: Bemorni yotqizib qo'yish; kislorod va NIVni kechiktirish; gipotenziyada nitrat berish; diuretik dozasini kam qo'llash; provokatorni (ishemiya, aritmiya) qidirmaslik; chiqarishda dori rejimini tushuntirmaslik.
```

- **Qiyinlik:** medium · **Yosh:** 70 · **Jins:** male · **Davomiylik:** 15
- **Vitals:** HR 112 · BP 160/100 · SpO2 86 · RR 30 · Harorat 36.8 · GCS 15
- **visual_state:** critical

**Scenario (JSON)**
```json
{
  "history": "Bir hafta davomida tuzli ovqat ko'p yeb, diuretikni ichmagan. 6 yil oldin miokard infarkti o'tkazgan. Oxirgi 2–3 haftada nafas qisilishi kuchaygan, 3 ta yostiqda yotadi.",
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
| 2 | Gipertonik inqiroz | easy | 55 / female | 86 | 210/120 | 97 | 18 | 36.6 | 15 | unstable |
| 3 | O'tkir yurak yetishmovchiligi | medium | 70 / male | 112 | 160/100 | 86 | 30 | 36.8 | 15 | critical |
