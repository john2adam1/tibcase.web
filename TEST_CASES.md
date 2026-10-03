# Kardiologiya (5 ta) va Reanimatsiya (5 ta) — test case'lar (admin panel → Case'lar → "Yangi Case")

10 ta case: 1–5 Kardiologiya, 6–10 Reanimatsiya. Tartib: **Bo'lim → Mavzu → Sarlavha → Kichik sarlavha → Bemor shikoyati → Kutilgan javob → qolgan maydonlar**.

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

## 4. Bo'lmachalar fibrillyatsiyasi (tez qorincha javobi)

- **Bo'lim:** Kardiologiya
- **Mavzu:** Yurak ritmi buzilishlari (aritmiyalar)
- **Sarlavha:** Yurak tez urishi / Bo'lmachalar fibrillyatsiyasi
- **Kichik sarlavha:** Notekis yurak urishi, holsizlik

**Bemor shikoyati (Chief complaint)**
```
Doktor, bugun ertalab soat 6 larda uyg'onib ketdim — yuragim "qafasdan chiqib ketadigandek" tez va notekis uryapti, go'yo ichimda qush qanot qoqayotgandek. Tomirimni ushlab ko'rsam, ba'zan tez, ba'zan to'xtab-to'xtab uryapti, bir tekis emas. Holsizlik, boshim biroz aylanyapti, ko'krakda yengil siqilish va nafas yetishmasligi bor, lekin kuchli og'riq yo'q. Hushimdan ketmadim, ammo bir marta ko'zim qorong'ilashgandek bo'ldi.

Kecha kechqurun do'stimning to'yida bo'ldim, ancha ko'p spirtli ichimlik ichdim (taxminan 5–6 piyola), kam uxladim, kuchli kofe ham ichdim. Xuddi shunday holat 8 oy oldin ham bir marta bo'lgan edi, bir necha soatda o'zi o'tib ketgan, shifokorga bormaganman. Gipertoniyam bor (7 yildan beri), enalapril ichaman. Qandli diabet yo'q. Qalqonsimon bez bo'yicha tekshirtirmaganman, lekin so'nggi 2 oyda vaznim 4 kg tushdi va terlayverdim. Chekmayman. Oldin insult, qon ketishlar bo'lmagan. Qon suyultiruvchi dori ichmayman. Allergiyam yo'q. Otam 65 yoshida "yurak ritmi buzilishi" tufayli yurak kasalxonasiga yotgan edi. Ko'z oldim qorong'ilashishi qo'rqitib yubordi.
```

**Kutilgan javob**
```
TASHXIS: Bo'lmachalar fibrillyatsiyasi (paroksizmal/yangi aniqlangan), tez qorincha javobi bilan, gemodinamika nisbatan turg'un. Ehtimoliy provokatorlar: spirtli ichimlik ("holiday heart"), kofein, uyqusizlik, gipertoniya; qalqonsimon bez giperfunksiyasini (tireotoksikoz) istisno qilish kerak (vazn yo'qotish, terlash).

FARQLASH: Bo'lmachalar pirpirashi (flutter), supraventrikulyar taxikardiya, ko'p o'choqli bo'lmacha taxikardiyasi, sinusli taxikardiya, qorincha taxikardiyasi, ekstrasistoliya, ishemiya fonidagi aritmiya, elektrolitlar buzilishi (K, Mg).

KETMA-KET QADAMLAR:
1. ABCDE, monitoring (EKG, AB, SpO2), vena yo'li. Gemodinamika beqarorligi belgilari bor-yo'qligini baholash: gipotenziya (SBP <90), ko'krak og'rig'i, o'tkir yurak yetishmovchiligi, hushdan ketish.
2. 12 kanalli EKG: "mutlaqo notekis" RR intervallari, P tishlarining yo'qligi, fibrillyator to'lqinlar, QRS tor. Qorincha chastotasini hisoblash.
3. Tekshiruvlar: umumiy qon, elektrolitlar (K, Mg, Ca), kreatinin, glyukoza, TSH va erkin T4, troponin, jigar fermentlari, kerak bo'lsa ko'krak qafasi rentgeni. Exokardiografiya (chap bo'lmacha o'lchami, EF, qopqoq kasalliklari, trombning bo'lishi).
4. Beqaror bo'lsa: shoshilinch sinxronlashtirilgan elektr kardioversiya (anesteziya/sedatsiya ostida, 120–200 J bifazik).
5. Turg'un bo'lsa — chastotani nazorat qilish: metoprolol 2.5–5 mg v/i sekin (3 marta takrorlash mumkin) yoki diltiazem 0.25 mg/kg v/i (EF pasayganda, o'tkir yurak yetishmovchiligida beta-bloker/diltiazem ehtiyot bilan yoki amiodaron/digoksin). Maqsad: dam olishda qorincha chastotasi <110/min.
6. Ritmni tiklash strategiyasi: aritmiya <48 soat bo'lsa va tromboemboliya xavfi past bo'lsa — farmakologik kardioversiya (amiodaron, propafenon strukturaviy yurak kasalligi bo'lmasa) yoki elektr kardioversiya. Davomiyligi noaniq yoki >48 soat bo'lsa — kamida 3 hafta samarali antikoagulyatsiyadan keyin yoki qizilo'ngach orqali exokardiografiya (TEE) bilan tromb yo'qligini tasdiqlab kardioversiya.
7. Insultdan profilaktika: CHA2DS2-VASc ball hisoblash (bu bemorda gipertoniya = 1 ball, erkak/ayol jinsiga qarab) — 2 va undan yuqori (erkaklarda) bo'lsa antikoagulyant (apiksaban, rivaroksaban, dabigatran yoki varfarin) tavsiya etiladi. HAS-BLED bilan qon ketish xavfini baholash. Kardioversiya vaqtida geparin/enoksaparin boshlanadi.
8. Sababni bartaraf etish: spirtli ichimlikni to'xtatish, elektrolitlarni to'g'rilash, tireotoksikoz tasdiqlansa endokrinolog bilan davolash.
9. Bemorga tushuntirish: uzoq muddatli kuzatuv, Xolter-EKG, antikoagulyantga amal qilish, spirtli ichimlik va kofeindan voz kechish.

KUZATUV VA CHIQARISH: Chastota nazoratga olinsa, simptomlar qolmasa va antikoagulyant rejasi tuzilsa — ambulator kuzatuv 1 hafta ichida kardiolog ko'rigi bilan. Beqaror yoki yurak yetishmovchiligi bor bo'lsa — statsionar.

KO'P UCHRAYDIGAN XATOLAR: Antikoagulyatsiyasiz kardioversiya qilish (insult xavfi); chastotani nazorat qilishda gipotenziyali yoki EF past bemorga verapamil/diltiazem berish; qalqonsimon bezni tekshirmaslik; CHA2DS2-VASc ni hisoblamaslik; WPW da AV tugun blokatorlarini berish.
```

- **Qiyinlik:** medium · **Yosh:** 52 · **Jins:** male · **Davomiylik:** 12
- **Vitals:** HR 148 · BP 128/82 · SpO2 97 · RR 20 · Harorat 36.9 · GCS 15
- **visual_state:** unstable

**Scenario (JSON)**
```json
{
  "history": "Gipertoniya 7 yil. 8 oy oldin shunga o'xshash epizod o'z-o'zidan o'tgan. Kecha spirtli ichimlik (5–6 piyola) va ko'p kofe ichgan, kam uxlagan. 2 oyda 4 kg ozgan, terlash.",
  "comorbidities": ["Arterial gipertenziya"],
  "allergies": [],
  "medications": ["Enalapril 10 mg"],
  "exam_findings": {
    "general": "Bezovta, rangi biroz oqargan",
    "cardiovascular": "Notekis ritm, pulsi yurak urishidan kam (pulse deficit), shovqin yo'q",
    "respiratory": "Vezikulyar nafas, xirillash yo'q",
    "other": "Qo'llarda mayda tremor, terisi nam"
  },
  "diagnostics": {
    "ecg": "RR intervallari to'liq notekis, P tishlari yo'q, QRS tor, chastota ~148/min",
    "labs": "K 3.6, Mg past chegarada, TSH pasaygan, troponin normal",
    "imaging": "Exokardiografiya: chap bo'lmacha biroz kengaygan, EF 55%"
  },
  "deterioration_triggers": ["Antikoagulyatsiyasiz kardioversiya", "Gipotenziyada beta-bloker/diltiazem berilsa", "Elektrolitlar tekshirilmasa"],
  "improvement_triggers": ["Chastota nazoratga olinsa", "CHA2DS2-VASc baholansa", "Tireotoksikoz tekshirilsa"]
}
```

---

## 5. O'tkir aorta dissektsiyasi

- **Bo'lim:** Kardiologiya
- **Mavzu:** Aorta kasalliklari
- **Sarlavha:** Yirtilayotgan ko'krak og'rig'i / O'tkir aorta dissektsiyasi
- **Kichik sarlavha:** Ko'krakdan belga o'tuvchi keskin og'riq

**Bemor shikoyati (Chief complaint)**
```
Doktor, 1 soat oldin to'satdan ko'kragim o'rtasida, to'sh orqasida shunday kuchli, "pichoq bilan kesib yuborgandek, yirtilayotgandek" og'riq boshlandi. Og'riq darhol eng kuchli darajaga yetdi (10 dan 10), keyin ko'kragimdan orqamga, kurak oralig'iga, so'ng belimga tushib ketdi. Bunday og'riq umrimda bo'lmagan. Boshim aylanyapti, sovuq ter bosdi, ko'nglim aynayapti, chap oyog'im uvishib, sovuq bo'lib qolgandek.

Gipertoniyam 15 yildan beri bor, lekin dorini tartibsiz ichaman — "bosimim yaxshi" deb o'ylab tashlab qo'yaman. Oxirgi marta o'lchaganimda 190/110 bo'lgan. Kuniga 1 pachka chekaman, 30 yildan beri. Bugun ertalab sport zalda og'ir shtanga ko'tardim (kuchanib). Qandli diabet yo'q. Oilamda uzoq qo'li, bo'yi baland, "Marfan" kasalligi bor deb aytishgan (akam). Aspirin va boshqa qon suyultiruvchi ichmayman, allergiyam yo'q. Nafas olishda og'riq kuchaymaydi, yo'tal yo'q. Oldin yurak operatsiyasi bo'lmagan. Qo'rqyapman, shu og'riq juda dahshatli, o'lib qolaman deb o'ylayapman.
```

**Kutilgan javob**
```
TASHXIS: O'tkir aorta dissektsiyasi (ehtimol Stanford A yoki B turi — KT-angiografiya bilan aniqlanadi). Xavf omillari: uzoq muddat nazoratsiz gipertoniya, chekish, og'ir jismoniy zo'riqish, oilada Marfan sindromi shubhasi.

FARQLASH: STEMI/o'tkir koronar sindrom, o'pka arteriyasi tromboemboliyasi, spontan pnevmotoraks, o'tkir perikardit, qizilo'ngach yorilishi (Boerhaave), o'tkir pankreatit, mushak-skelet og'rig'i.

KETMA-KET QADAMLAR:
1. ABCDE, monitoring, 2 ta yirik periferik vena yo'li, qon guruhi va kross-moslik.
2. AB ni ikkala qo'lda o'lchash (farq >20 mm sim.ust. — tipik belgi), pulslarni 4 oyoq-qo'lda baholash, yangi diastolik shovqin (aorta yetishmovchiligi), nevrologik belgilar.
3. Ketma-ket faqat KT-angiografiya (ko'krak va qorin aortasi, EKG-sinxronlashtirilgan) — tashxis uchun oltin standart. Barqaror bo'lmasa — qizilo'ngach orqali exokardiografiya (TEE) yoki to'shak yonida exokardiografiya.
4. EKG va troponin — ACS ni istisno qilish uchun (aorta dissektsiyasi koronar arteriyani qamrab olishi mumkin). Antikoagulyant/antitrombotik BERILMAYDI, tashxis aniqlangunga qadar.
5. Og'riq va bosimni agressiv nazorat qilish: maqsad sistolik AB 100–120 mm sim.ust., yurak urishi <60/min — 20 daqiqa ichida. Birinchi navbatda beta-bloker: esmolol v/i (500 mkg/kg bolus, keyin 50–200 mkg/kg/min) yoki labetalol 20 mg v/i bolus, keyin 1–2 mg/min. Beta-bloker yetarli bo'lmasa, nitroprussid yoki nikardipin qo'shiladi (faqat beta-blokerdan KEYIN, refleks taxikardiyaning oldini olish uchun).
6. Og'riqsizlantirish: fentanil yoki morfin v/i.
7. Stanford A (ko'tariluvchi aorta): shoshilinch kardioxirurgik operatsiya (protezlash) — mortalitet har soatda 1–2% oshadi. Stanford B (tushuvchi aorta): asoratlanmagan bo'lsa konservativ (AB nazorati), asoratlangan bo'lsa (malperfuziya, yorilish, davom etuvchi og'riq) — endovaskulyar stentlash (TEVAR).
8. Shoshilinch ravishda yurak-qon tomir jarrohligi markaziga yo'naltirish, BITda kuzatuv.

KUZATUV VA ASORATLAR: Perikard tamponadasi (shok, Beck triadasi), aorta yetishmovchiligi, insult, ichki a'zolar ishemiyasi, oyoq ishemiyasi, yorilish (o'lim).

KO'P UCHRAYDIGAN XATOLAR: Tashxis qo'yilmasdan antikoagulyant/trombolitik berish (halokatli); AB ni faqat vazodilatator bilan tushirib, beta-blokerni unutish (refleks taxikardiya, dissektsiya kuchayadi); faqat EKG va troponinga tayanib ACS deb xulosa qilish; KT-angiografiyani kechiktirish; pulslarni va ikkala qo'l AB ni solishtirmaslik.
```

- **Qiyinlik:** hard · **Yosh:** 49 · **Jins:** male · **Davomiylik:** 15
- **Vitals:** HR 110 · BP 185/105 (o'ng qo'l), 140/85 (chap qo'l) · SpO2 96 · RR 22 · Harorat 36.7 · GCS 15
- **visual_state:** critical

**Scenario (JSON)**
```json
{
  "history": "Gipertoniya 15 yil, dorini tartibsiz ichadi. Chekuvchi (30 yil, kuniga 1 pachka). Bugun og'ir shtanga ko'targan. Akasida Marfan sindromi. Og'riq to'satdan, 10/10, 'yirtilayotgandek', ko'krakdan belga tarqalgan.",
  "comorbidities": ["Arterial gipertenziya (nazoratsiz)"],
  "allergies": [],
  "medications": ["Enalapril (nomuntazam)"],
  "exam_findings": {
    "general": "Rangi oqargan, sovuq ter, bezovta",
    "cardiovascular": "Taxikardiya, aortada yangi diastolik shovqin, chap qo'lda puls sust, qon bosimi qo'llarda farq qiladi",
    "respiratory": "Vezikulyar nafas",
    "other": "Chap oyoq sovuq va rangpar"
  },
  "diagnostics": {
    "ecg": "Chap qorincha gipertrofiyasi, ST ko'tarilishi yo'q",
    "labs": "Troponin biroz oshgan, D-dimer yuqori, kreatinin 105",
    "imaging": "Ko'krak rentgeni: o'rta soya kengaygan. KT-angiografiya: ko'tariluvchi aortada intimal flap (Stanford A)"
  },
  "deterioration_triggers": ["Antikoagulyant/trombolitik berilsa", "Beta-blokersiz vazodilatator berilsa", "KT-angiografiya kechiktirilsa"],
  "improvement_triggers": ["Beta-bloker bilan chastota/AB nazorat qilinsa", "Og'riq to'xtatilsa", "Shoshilinch kardioxirurgga yo'naltirilsa"]
}
```

---

## 6. Septik shok

- **Bo'lim:** Reanimatsiya
- **Mavzu:** Sepsis va septik shok
- **Sarlavha:** Isitma va past bosim / Septik shok
- **Kichik sarlavha:** Qaltirash, bosim pasayishi, aqlning xiralashishi

**Bemor shikoyati (Chief complaint)**
```
(Bemor zo'rg'a gapiradi, qizi yordam beradi) Doktor, onam 3 kundan beri isitmalab yotibdi, bugun ertalab holati keskin yomonlashdi — qattiq qaltirab, titrab, tana harorati 39 dan oshdi. Bugun ertalabdan boshlab gapirishi sekinlashdi, nimaga javob berishini bilmayapti, chalkashib gapiryapti, tunda esa 2 marta yiqilib tushdi. Siyishi juda kamaygan — kechadan beri 1 marta ham siymadi. Labi qurigan, qo'l-oyoqlari muzdek sovuq, rangi oqargan, nafasi tez-tez.

3 kun oldin pastki qorin va beli og'rigan, siyganda achishgan, siydigi loyqa va yomon hidli bo'lgan, lekin "o'tib ketadi" deb davolanmagan. Qandli diabeti bor (12 yildan beri, insulin ichadi), buyrak tosh kasalligi bo'lgan. Gipertoniyasi bor edi, lekin oxirgi 2 kun bosim dorilarini ichmadi. Allergiyasi — penitsillinga toshma bo'lgan, deb eslaydi. Oxirgi vaqtda kasalxonaga yotmagan, kateter qo'yilmagan. Ishtahasi yo'q, ovqat yemayapti, 1 marta qayt qilgan. Ko'krak og'rig'i, yo'tal yo'q. Sigaret chekmaydi, spirtli ichimlik ichmaydi.
```

**Kutilgan javob**
```
TASHXIS: Septik shok (urosepsis, ehtimol o'tkir pielonefrit/obstruktiv uropatiya fonida), diabetik bemorda. Sepsis-3 mezonlari: gumon qilingan infeksiya + SOFA ≥2; septik shok — adekvat suyuqlikka qaramay vazopressorga ehtiyoj va laktat >2 mmol/l.

FARQLASH: Kardiogen shok, gipovolemik shok, anafilaktik shok, pnevmoniya/boshqa infeksiya manbalari, diabetik ketoatsidoz, buyrak usti bezi yetishmovchiligi, o'pka arteriyasi tromboemboliyasi.

KETMA-KET QADAMLAR (Surviving Sepsis "Hour-1 bundle"):
1. ABCDE: yo'llar, kislorod (SpO2 ≥94%), monitoring, 2 ta yirik vena yo'li, qovuq kateteri (soatlik diurez nazorati).
2. Laktatni o'lchash (takroriy — 2–4 soatda), qon madaniyati (antibiotikdan OLDIN, 2 ta namuna), siydik tahlili va madaniyati, umumiy qon, kreatinin, bilirubin, koagulogramma, glyukoza, qon gazlari, CRP/prokalsitonin.
3. Keng spektrli antibiotik — 1 soat ichida: penitsillinga allergiya bor, shuning uchun seftriakson/sefepim (ehtiyotkorlik bilan, yengil allergiya bo'lsa) yoki karbapenem (meropenem 1 g v/i) yoki piperatsillin-tazobaktam o'rniga siprofloksatsin+aminoglikozid; allergiyaning turini aniqlash. Mahalliy qarshilikni hisobga olish.
4. Suyuqlik: kristalloidlar 30 ml/kg v/i dastlabki 3 soatda (balansli eritma — Ringer laktat afzal), gemodinamikaga qarab (yurak yetishmovchiligi xavfi bor bemorda ehtiyot bilan, o'pka shishi belgilarini kuzatish).
5. Vazopressor: suyuqlikdan keyin ham o'rtacha AB (MAP) <65 bo'lsa — noradrenalin 0.05–0.5 mkg/kg/min; MAP ≥65 mm sim.ust. maqsad. Markaziy vena kateteri. Refrakter shokda vazopressin 0.03 U/min qo'shish, gidrokortizon 200 mg/sutka.
6. Infeksiya manbasini nazorat qilish: UZI/KT bilan siydik yo'llarining obstruksiyasi (tosh, abssess) — obstruksiya bo'lsa shoshilinch dekompressiya (nefrostoma yoki stent) 6–12 soat ichida.
7. Qo'llab-quvvatlovchi: glyukoza 7.8–10 mmol/l ushlash (insulin infuziyasi), VTE profilaktikasi, stress yarasi profilaktikasi, kerak bo'lsa mexanik ventilyatsiya/gemodializ.
8. Qayta baholash: 1–3 soatda gemodinamika, diurez ≥0.5 ml/kg/soat, laktat klirensi, antibiotikni 48–72 soatda madaniyat natijasiga qarab toraytirish (de-eskalatsiya).

KUZATUV VA CHIQARISH: Reanimatsiya bo'limida davolanadi; MAP ≥65, laktat normallashguncha, vazopressorni to'xtatish.

KO'P UCHRAYDIGAN XATOLAR: Antibiotikni kechiktirish (har soat o'lim xavfini oshiradi); madaniyatni antibiotikdan keyin olish; suyuqlikni kam yoki haddan tashqari ko'p berish; infeksiya manbasini (obstruksiya) bartaraf qilmaslik; allergiyani hisobga olmasdan penitsillin berish; laktatni o'lchamaslik.
```

- **Qiyinlik:** hard · **Yosh:** 72 · **Jins:** female · **Davomiylik:** 15
- **Vitals:** HR 128 · BP 82/45 · SpO2 93 · RR 28 · Harorat 39.4 · GCS 13
- **visual_state:** critical

**Scenario (JSON)**
```json
{
  "history": "Diabet (insulin, 12 yil), buyrak tosh kasalligi. 3 kun oldin siyganda achishish, bel og'rig'i. Penitsillinga toshma bo'lgan. 2 kundan beri bosim dorisini ichmagan, kech bilan siymagan.",
  "comorbidities": ["Qandli diabet 2-tur", "Arterial gipertenziya", "Buyrak tosh kasalligi"],
  "allergies": ["Penitsillin (toshma)"],
  "medications": ["Insulin", "Amlodipin (ichmagan)"],
  "exam_findings": {
    "general": "Rangi oqargan, qaltiraydi, halsiz, chalkash",
    "cardiovascular": "Taxikardiya, tomir urishi sust, kapillyar to'ldirish 4 soniya",
    "respiratory": "Tezlashgan nafas, o'pkada xirillash yo'q",
    "other": "O'ng bel sohasi og'riqli, siydik loyqa, oligouriya"
  },
  "diagnostics": {
    "ecg": "Sinus taxikardiyasi",
    "labs": "Laktat 4.8, leykotsit 21, kreatinin 210, prokalsitonin yuqori, glyukoza 14",
    "imaging": "UZI: o'ng buyrak giperekogen, pielokaliektaziya, siydik yo'lida tosh"
  },
  "deterioration_triggers": ["Antibiotik 1 soatdan kech berilsa", "Suyuqlik berilmasa", "Obstruksiya bartaraf etilmasa", "Penitsillin berilsa"],
  "improvement_triggers": ["Qon madaniyati olib, antibiotik 1 soatda berilsa", "30 ml/kg kristalloid", "Noradrenalin boshlansa", "Dekompressiya"]
}
```

---

## 7. O'tkir respirator distress sindromi (ARDS)

- **Bo'lim:** Reanimatsiya
- **Mavzu:** O'tkir nafas yetishmovchiligi
- **Sarlavha:** Og'ir nafas yetishmovchiligi / ARDS
- **Kichik sarlavha:** Kislorod yetishmasligi, ikki tomonlama infiltratlar

**Bemor shikoyati (Chief complaint)**
```
(Bemor so'zlarni uzib-uzib, nafas olib gapiradi) Doktor... havo yetmayapti... 5 kundan beri isitmalab yo'talaman, avval quruq yo'tal edi, keyin balg'amli bo'ldi. Kecha va bugun nafas olish juda qiyinlashdi — bir-ikki so'z gapirsam nafasim qisiladi, o'tira olmayman, yotib bo'lmaydi. Lablarim ko'karib ketgan, deydi qizim. Ko'kragimda og'riq yo'q, lekin nafas olganda siqilish bor. Isitma 39 gacha ko'tarilgan, qaltirash, kuchli holsizlik, mushaklarim og'riydi.

7 kun oldin oilada bir kishi gripp bilan kasal bo'lgan edi, men ham shamollagan edim. Davolanmadim, faqat paratsetamol ichdim, 3 kun oldin o'zboshimchalik bilan amoksitsillin ichdim, foydasi bo'lmadi. Chekaman (25 yil), surunkali bronxit tashxisi bor edi. Semizlik (vazn 118 kg, bo'yi 170 sm). Diabet yo'q, gipertoniyasi bor. Allergiyam yo'q. Oxirgi sayohat yo'q. Vaksina olmaganman. Hozir hammasi qorong'ilashayapti, qo'rqyapman, nafas olishga kuchim yetmayapti.
```

**Kutilgan javob**
```
TASHXIS: O'tkir respirator distress sindromi (ARDS) — og'ir virusli/bakterial pnevmoniya fonida. Berlin mezonlari: o'tkir boshlanish (1 hafta ichida), ikki tomonlama o'pka infiltratlari, kardiogen sabab bilan to'liq tushuntirilmaydi, PaO2/FiO2 ≤100 (og'ir), ≤200 (o'rta), ≤300 (yengil).

FARQLASH: Kardiogen o'pka shishi, og'ir pnevmoniya, o'pka arteriyasi tromboemboliyasi, KOBL kuchayishi, diffuz alveolyar qon ketish, pnevmotoraks.

KETMA-KET QADAMLAR:
1. ABCDE, monitoring, yuqori oqimli kislorod, qon gazlari (arterial), laktat. SpO2 maqsadi 92–96%.
2. Noinvaziv usullar (yuqori oqimli burun kanyulasi — HFNC, NIV) qisqa sinov bilan; yaxshilanmasa yoki ish nafas mushaklari charchasa (RR >30, GCS pasayishi, PaO2/FiO2 <150) — endotrakeal intubatsiya va mexanik ventilyatsiya (tez ketma-ketlikda intubatsiya, tajribali shifokor).
3. Himoya ventilyatsiyasi: past tidal hajm 6 ml/kg (bashoratli tana vazni bo'yicha, 118 kg emas), plato bosimi <30 sm suv ust., PEEP yuqori (FiO2/PEEP jadvali), permissiv giperkapniya (pH >7.2).
4. Og'ir ARDS (PaO2/FiO2 <150): qorin bilan yotqizish (prone position) kuniga ≥12–16 soat; qisqa muddatli miorelaksantlar (siso-atrakuriy 48 soatgacha); konservativ suyuqlik strategiyasi.
5. Sabab: bakterial pnevmoniya uchun keng spektrli antibiotik (masalan, seftriakson + azitromitsin yoki levofloksatsin), gripp shubhasi bo'lsa oseltamivir 75 mg ×2; balg'am/qon madaniyati, virus PCR (gripp, COVID-19, RSV).
6. Kortikosteroidlar (deksametazon 6 mg/kun 10 kungacha COVID-19 ARDS da; boshqa ARDS da metilprednizolon ko'rib chiqiladi).
7. Refrakter gipoksemiyada — VV-ECMO (ixtisoslashgan markaz) ga yo'naltirish.
8. Qo'llab-quvvatlovchi: enteral ovqatlantirish, sedatsiya-analgeziya, VTE profilaktikasi, ventilyator bilan bog'liq pnevmoniya profilaktikasi (bosh uchini 30–45° ko'tarish), stress yarasi profilaktikasi, glyukoza nazorati.

KUZATUV VA CHIQARISH: Reanimatsiya bo'limi. Ventilyatordan chiqarish: spontan nafas sinovi, FiO2 ≤0.4, PEEP ≤8. Keyingi reabilitatsiya.

KO'P UCHRAYDIGAN XATOLAR: Katta tidal hajm bilan ventilyatsiya (haqiqiy vazn bo'yicha hisoblash); intubatsiyani kechiktirish; ortiqcha suyuqlik berish; prone pozitsiyani qo'llamaslik; sababni (infeksiya) bartaraf etmaslik; yuqori PEEP bilan gipotenziyani unutish.
```

- **Qiyinlik:** hard · **Yosh:** 58 · **Jins:** male · **Davomiylik:** 15
- **Vitals:** HR 118 · BP 138/84 · SpO2 82 · RR 36 · Harorat 39.1 · GCS 14
- **visual_state:** critical

**Scenario (JSON)**
```json
{
  "history": "Chekuvchi (25 yil), surunkali bronxit, semizlik (118 kg, 170 sm), gipertoniya. 7 kun oldin oilada gripp. 5 kun isitma va yo'tal, 3 kun oldin amoksitsillin o'zboshimchalik bilan. Vaksina olmagan.",
  "comorbidities": ["Surunkali bronxit", "Semizlik", "Arterial gipertenziya"],
  "allergies": [],
  "medications": ["Paratsetamol", "Amoksitsillin (3 kun)"],
  "exam_findings": {
    "general": "Qiynalib nafas oladi, lablari ko'k, gaplarini uzib-uzib aytadi",
    "cardiovascular": "Taxikardiya, ritm to'g'ri",
    "respiratory": "Ikkala o'pkada nam xirillashlar, yordamchi mushaklar ishtirokida nafas",
    "other": "Akrotsianoz"
  },
  "diagnostics": {
    "ecg": "Sinus taxikardiyasi",
    "labs": "PaO2/FiO2 ~110, laktat 3.0, leykotsit 16, CRP yuqori, gripp PCR musbat",
    "imaging": "Rentgen/KT: ikkala o'pkada diffuz shisha-ko'rinishli infiltratlar"
  },
  "deterioration_triggers": ["Intubatsiya kechiktirilsa", "Katta tidal hajm qo'llanilsa", "Ortiqcha suyuqlik berilsa"],
  "improvement_triggers": ["Himoya ventilyatsiyasi (6 ml/kg)", "Prone pozitsiya", "Antibiotik va antiviral boshlansa"]
}
```

---

## 8. Gemorragik shok (travma)

- **Bo'lim:** Reanimatsiya
- **Mavzu:** Shok holatlari va travma
- **Sarlavha:** Yo'l-transport hodisasi / Gemorragik shok
- **Kichik sarlavha:** Qorin va chanoq travmasi, qon yo'qotish

**Bemor shikoyati (Chief complaint)**
```
(Bemor qo'rqib, sekin gapiradi) Doktor, mototsiklda ketayotgan edim, mashina urib yubordi, 30 daqiqa oldin. Havoga uchib, yerga yonboshlab yiqildim. Qorin pastim va chap yonim juda og'riyapti, belim ham og'riyapti, chap sonimning yuqori qismida ham og'riq bor. Ko'zim qorong'ilashyapti, boshim aylanyapti, qattiq chanqayapman, sovuq ter bosyapti. Hushimdan ketmadim, hamma narsani eslayman. Qayt qilmadim, lekin ko'nglim aynayapti. Qorinim tarang va og'riqli, ko'k dog' paydo bo'ldi. Siydikka borolmayman, siydik qopim to'lgandek, lekin chiqmayapti, siydikda qon bor edi.

Dubulg'a kiygan edim, boshimga urilmagan. Ichimlik ichmaganman. Sog'lig'im yaxshi edi, hech qanday surunkali kasalligim yo'q. Dori qabul qilmayman, qon suyultiruvchi ichmayman. Allergiyam yo'q. Oxirgi ovqat — 4 soat oldin. Tetanusga qarshi emlash 5 yil oldin qilingan. Qon guruhimni bilmayman. Xavotirdaman, hozir bosimim tushib ketayotgandek, yuragim tez uryapti.
```

**Kutilgan javob**
```
TASHXIS: Gemorragik shok (III–IV sinf, ATLS), to'mtoq qorin va chanoq travmasi fonida — ehtimol taloq/jigar yorilishi va/yoki chanoq suyaklari sinishi, siydik yo'llari shikasti.

ATLS BO'YICHA BIRLAMCHI BAHOLASH (XABCDE):
X — jiddiy tashqi qon ketishni to'xtatish (jgut/bosim bog'ichi).
A — yo'llar o'tkazuvchanligi (bo'yin umurtqasini immobilizatsiya qilish bilan).
B — nafas: SpO2, o'pka auskultatsiyasi (pnevmotoraks/gemotoraks).
C — qon aylanishi: puls, AB, kapillyar to'lish, ikkita yirik vena yo'li, qon guruhi/kross-moslik.
D — nevrologik holat (GCS, qorachiqlar).
E — to'liq kiyimsiz ko'rik, hipotermiyaning oldini olish.

KETMA-KET QADAMLAR:
1. Yirik vena yo'llari (2 ta ≥16G) yoki intraosseal yo'l; qon namunasi (guruh, kross-moslik, gemoglobin, laktat, koagulogramma).
2. Qonni to'ldirish: "permissiv gipotenziya" strategiyasi — dastlab 1 litr isitilgan kristalloid (haddan ortiq kristalloid bermaslik), tezda qon mahsulotlariga o'tish: massiv transfuziya protokoli (MTP) — eritrotsit : plazma : trombotsit = 1:1:1. Maqsad: SBP ~80–90 (bosh miya shikasti bo'lmasa) qon ketishi nazorat qilinguncha.
3. Tranexam kislotasi 1 g v/i 10 daqiqada (travmadan 3 soat ichida), keyin 1 g 8 soatda infuziya.
4. FAST-ekspertiza (to'shak yonida UZI): erkin suyuqlik (qorin, perikard, plevra). Chanoq rentgeni. Chanoq beqaror bo'lsa — chanoq bog'ichi (pelvic binder) qo'yish.
5. Gemodinamikasi turg'un bo'lmagan bemor (FAST musbat) — shoshilinch laparotomiyaga (taloq/jigar), chanoq qon ketishida preperitoneal paketlash yoki angioembolizatsiya. Turg'un bo'lganda — KT bilan qorin va chanoq tekshiruvi.
6. Siydik yo'llari shikastlanishiga shubha: uretrada qon bo'lsa kateter qo'yilmaydi (avval uretrografiya), suprapubik drenaj ko'rib chiqiladi.
7. Isitish (iliq infuzion eritmalar, ko'rpa), kalsiy nazorati (massiv transfuziyada Ca2+), laktat va asos-kislotali balans.
8. Og'riqsizlantirish (fentanil v/i, kichik dozalarda), tetanus profilaktikasi, antibiotik profilaktikasi (ochiq jarohatlar bo'lsa).

KUZATUV VA ASORATLAR: "O'lim uchligi": gipotermiya, atsidoz, koagulopatiya; abdominal kompartment sindromi; DVS-sindrom; ko'p a'zolar yetishmovchiligi.

KO'P UCHRAYDIGAN XATOLAR: Haddan tashqari kristalloid berish (koagulopatiyani kuchaytiradi, qon ketishini oshiradi); tranexam kislotasini unutish; qon mahsulotlarini kechiktirish; FAST/chanoq tekshiruvini qilmaslik; uretra shikasti ehtimolida kateterni qo'yish; gemodinamika beqaror bemorni KTga yuborish; gipotermiyani e'tiborsiz qoldirish.
```

- **Qiyinlik:** hard · **Yosh:** 28 · **Jins:** male · **Davomiylik:** 15
- **Vitals:** HR 132 · BP 82/50 · SpO2 94 · RR 28 · Harorat 35.8 · GCS 14
- **visual_state:** critical

**Scenario (JSON)**
```json
{
  "history": "Mototsikl-mashina to'qnashuvi 30 daqiqa oldin. Dubulg'a kiygan, hushini yo'qotmagan. Surunkali kasalliklari yo'q. Qon suyultiruvchi ichmaydi. Tetanus 5 yil oldin. Oxirgi ovqat 4 soat oldin.",
  "comorbidities": [],
  "allergies": [],
  "medications": [],
  "exam_findings": {
    "general": "Rangi oqargan, sovuq ter, chanqoq, xavotirda",
    "cardiovascular": "Taxikardiya, tomir urishi ipsimon, kapillyar to'lish >3 soniya",
    "respiratory": "Tez nafas, o'pkada xirillash yo'q",
    "other": "Qorin tarang, chap qovurg'a osti ekximoz va og'riq, chanoq siqilganda og'riq, uretrada qon"
  },
  "diagnostics": {
    "ecg": "Sinus taxikardiyasi",
    "labs": "Gemoglobin 78 g/l, laktat 5.2, INR 1.4",
    "imaging": "FAST: qorin bo'shlig'ida erkin suyuqlik. Chanoq rentgeni: o'ng qo'ymich suyagi sinishi"
  },
  "deterioration_triggers": ["Kristalloid ko'p berilsa", "Qon mahsulotlari kechiksa", "Tranexam kislotasi berilmasa", "Uretrada qon bilan kateter qo'yilsa"],
  "improvement_triggers": ["MTP va 1:1:1 transfuziya", "Tranexam kislotasi", "FAST va jarrohga tezkor yo'naltirish", "Chanoq bog'ichi"]
}
```

---

## 9. Kardiogen shok

- **Bo'lim:** Reanimatsiya
- **Mavzu:** Shok holatlari va travma
- **Sarlavha:** Infarktdan keyingi shok / Kardiogen shok
- **Kichik sarlavha:** Past bosim, sovuq teri, o'pka shishi

**Bemor shikoyati (Chief complaint)**
```
(Bemor zo'rg'a gapiradi, rangi oqargan) Doktor, 6 soat oldin ko'kragimda kuchli og'riq boshlandi — siqib turgandek, chap qo'limga tarqaldi. Uyda yotib turdim, "o'tib ketar" deb kutdim, tez yordam chaqirmadim. Keyingi 2 soatda nafas olish qiyinlashdi, yotolmay qoldim, o'tirib oldim. Hozir bosh aylanishi, ko'z qorong'ilashishi, sovuq ter, qo'l-oyoqlarim muzdek sovuq. Siydikka 6 soat bo'ldi chiqmadim. Yuragim tez uryapti, tushkunlik, o'lim qo'rquvi bor.

Gipertoniyam, diabetim bor (8 yil), insulin ichmayman, tabletka ichaman, tartibsiz. Chekaman (kuniga 1 pachka). 3 yil oldin bir marta ko'krak og'rig'i bo'lgan, tekshirtirmaganman. Allergiyam yo'q. Qon suyultiruvchi ichmaganman. Otam 60 yoshida infarktdan vafot etgan. Nitroglitserin ichmadim — uyda yo'q edi. Hozir yotganda nafasim yetmayapti, balg'amli yo'talim bor, pushti ko'pik chiqayotgandek.
```

**Kutilgan javob**
```
TASHXIS: Kardiogen shok — oldingi devor keng STEMI (chap qorincha nasos funksiyasi pasayishi) fonida, o'pka shishi bilan. SCAI shok klassifikatsiyasi: C–D bosqich. Mezonlar: SBP <90 mm sim.ust. 30 daqiqadan ortiq yoki vazopressor kerak, a'zolar perfuziyasi buzilishi (sovuq teri, oliguriya, laktat >2, chalkashlik), o'pka dimlanishi.

FARQLASH: Gipovolemik shok, septik shok, o'pka arteriyasi tromboemboliyasi, perikard tamponadasi, aorta dissektsiyasi, miokardit, o'tkir mitral yetishmovchilik/qorinchalararo to'siq yorilishi (mexanik asoratlar).

KETMA-KET QADAMLAR:
1. ABCDE, reanimatsiya zali, monitoring, arterial liniya (invaziv AB), markaziy vena kateteri, siydik kateteri.
2. Kislorod/NIV (SpO2 ≥ 94%), zarur bo'lsa intubatsiya va mexanik ventilyatsiya.
3. 12 kanalli EKG, troponin, laktat, qon gazlari, BNP, elektrolitlar, kreatinin, qon guruhi; shoshilinch exokardiografiya (EF, mexanik asoratlar, o'ng qorincha, perikard suyuqligi).
4. Shoshilinch koronarografiya va to'liq revaskulyarizatsiya (PCI) — kardiogen shokda bosh yo'l (SHOCK trial: erta revaskulyarizatsiya hayotni saqlaydi). Fibrinoliz faqat PCI imkonsiz bo'lsa.
5. Gemodinamik qo'llab-quvvatlash: noradrenalin (MAP ≥65 uchun, birinchi tanlov); dobutamin 2–20 mkg/kg/min (past chiqarish), qo'shimcha sifatida. Suyuqlik: o'pka shishi bor, faqat kichik bolus (250 ml) va ehtiyotkorlik bilan.
6. Diuretik: furosemid v/i (gemodinamika turg'unlashgach, MAP yetarli bo'lganda), nitrat va beta-bloker, AAF ingibitori KONTRAINDIKATSIYA (shok davrida).
7. Mexanik qo'llab-quvvatlash: ichki aortal ballon kontrpulsatsiyasi (IABP) kam foyda; Impella yoki VA-ECMO refrakter shokda — shok jamoasi (Shock Team) qarori.
8. Antitrombotik terapiya: aspirin, P2Y12 ingibitori, geparin (PCI vaqtida).
9. Mexanik asoratlar (qorinchalararo to'siq yorilishi, papillyar mushak uzilishi, erkin devor yorilishi) — shoshilinch kardioxirurgiya.

KUZATUV VA ASORATLAR: Qorincha aritmiyalari (defibrillyator), buyrak yetishmovchiligi, ko'p a'zolar disfunksiyasi, mortalitet 40–50%.

KO'P UCHRAYDIGAN XATOLAR: Katta hajmda suyuqlik berish (o'pka shishi kuchayadi); shok davrida beta-bloker/AAF ingibitori/nitrat berish; revaskulyarizatsiyani kechiktirish; mexanik asoratlarni exokardiografiya bilan qidirmaslik; vazopressorsiz faqat dobutamin bilan MAP ni ushlamoqchi bo'lish.
```

- **Qiyinlik:** hard · **Yosh:** 66 · **Jins:** male · **Davomiylik:** 15
- **Vitals:** HR 118 · BP 78/50 · SpO2 88 · RR 30 · Harorat 36.2 · GCS 14
- **visual_state:** critical

**Scenario (JSON)**
```json
{
  "history": "Gipertoniya, diabet (8 yil), chekuvchi. 6 soat oldin ko'krak og'rig'i boshlangan, tez yordam chaqirmagan. Otasi 60 yoshida infarktdan vafot etgan. 6 soatdan beri siymagan.",
  "comorbidities": ["Arterial gipertenziya", "Qandli diabet 2-tur", "Chekish"],
  "allergies": [],
  "medications": ["Metformin (tartibsiz)"],
  "exam_findings": {
    "general": "Rangi kulrang, sovuq ter, chalkashroq",
    "cardiovascular": "Taxikardiya, III ton, bo'yin venalari bo'rtgan, qo'l-oyoqlar sovuq",
    "respiratory": "Ikkala o'pkada nam xirillash, pushti ko'pikli balg'am",
    "other": "Oliguriya, kapillyar to'lish uzaygan"
  },
  "diagnostics": {
    "ecg": "V1–V4 da ST ko'tarilishi (oldingi devor STEMI)",
    "labs": "Troponin juda yuqori, laktat 4.5, kreatinin 160",
    "imaging": "Exokardiografiya: EF 20%, oldingi devor akineziya. Rentgen: o'pka shishi"
  },
  "deterioration_triggers": ["Katta hajm suyuqlik berilsa", "Beta-bloker yoki nitrat berilsa", "Revaskulyarizatsiya kechiksa"],
  "improvement_triggers": ["Noradrenalin bilan MAP ≥65", "Shoshilinch PCI", "NIV/intubatsiya", "Mexanik qo'llab-quvvatlash (Impella/ECMO)"]
}
```

---

## 10. Status astmatikus (og'ir astma xuruji)

- **Bo'lim:** Reanimatsiya
- **Mavzu:** Respirator yordam va og'ir astma
- **Sarlavha:** Davolashga javob bermaydigan nafas qisilishi / Status astmatikus
- **Kichik sarlavha:** Ingalyatorga javob bermayotgan bo'g'ilish

**Bemor shikoyati (Chief complaint)**
```
(Bemor bir-ikki so'z aytib to'xtaydi, o'tirib, qo'llarini tizzasiga tayab nafas oladi) Doktor... bo'g'ilyapman... ingalyator yordam bermayapti. 12 soat oldin boshlandi — avval yo'tal, xirillash, ko'krak siqilishi. Ingalyatorni (salbutamol) har 20 daqiqada 2–3 nafasdan, jami 20 martadan ortiq oldim — dastlab bir oz yengillashdi, keyin umuman foyda bermay qo'ydi. Hozir gapirolmayman, lablarim ko'karganday. Nafas chiqarish juda qiyin, xirillash eshitilyapti, lekin keyingi soatda xirillash kamaygandek — nafasim "jimlashib" qolgandek.

Bolaligimdan bronxial astma bor, yiliga 2–3 marta xuruj bo'ladi, lekin bunchalik og'ir bo'lmagan. 2 yil oldin bir marta reanimatsiyada yotganman, intubatsiya qilingan. Doimiy ingalyator (budesonid/formoterol) ichishim kerak, lekin so'nggi 3 oy ichmadim — qimmat edi. Yuqori nafas yo'llari infeksiyasi bo'lgan (bir hafta shamollash). Uy changi, mushuk tuklariga allergiyam bor, dori allergiyasi yo'q. Aspirinni ichsam ham bo'g'ilmayman. Chekmayman. Kecha tunda uxlay olmadim, bo'g'ilib uyg'ondim. Hozir charchadim, nafas olishga kuchim kamayyapti, uyqum kelyapti.
```

**Kutilgan javob**
```
TASHXIS: Status astmatikus (hayot uchun xavfli bronxial astma xuruji, "near-fatal"/"life-threatening"): davolashga javob bermaydigan bronxospazm, "jim ko'krak" (silent chest), charchash. Xavf omillari: oldin intubatsiya va BIT, nazorat qiluvchi terapiyani tashlash, yaqinda infeksiya.

OG'IRLIK BELGILARI (GINA/BTS): gapira olmaydi, RR >30, puls >120–130, SpO2 <92%, "jim ko'krak", ongning o'zgarishi, siljigan PEF <33%, sianoz, bradikardiya/gipotenziya (yaqinlashayotgan to'xtash belgisi).

FARQLASH: Pnevmotoraks (taranglashuvchi), anafilaksiya, o'tkir yurak yetishmovchiligi ("yurak astmasi"), yuqori nafas yo'llari obstruksiyasi/yot jism, KOBL kuchayishi, O'ATE, psixogen nafas qisilishi.

KETMA-KET QADAMLAR:
1. ABCDE, o'tirgan holat, monitoring, SpO2, PEF imkoni bo'lsa, vena yo'li. Qon gazlari (normal yoki oshgan PaCO2 — charchash belgisi!). Ko'krak qafasi rentgeni (pnevmotoraks, pnevmoniyani istisno).
2. Kislorod: SpO2 93–95% ga yetguncha titrlab.
3. Qisqa ta'sirli beta2-agonistlar: salbutamol nebulayzer 5 mg (yoki 2.5–5 mg) har 20 daqiqada 3 marta, keyin uzluksiz nebulizatsiya (10–15 mg/soat).
4. Ipratropiy bromid 0.5 mg nebulayzer, har 20 daqiqada 3 marta.
5. Sistem kortikosteroid ERTA: gidrokortizon 100–200 mg v/i yoki metilprednizolon 60–125 mg v/i yoki prednizolon 40–50 mg ichga (1 soat ichida).
6. Magniy sulfat 2 g v/i 20 daqiqada (bir marta) — og'ir xurujda.
7. Javobsiz bo'lsa: adrenalin 0.3–0.5 mg mushak ichiga (anafilaksiya bilan farqlash qiyin bo'lsa) yoki terbutalin teri ostiga, ketamin (bronxodilatator ta'siri) ham ko'rib chiqiladi.
8. Charchash, ong buzilishi, gipoksemiya, gipperkapniya (PaCO2 >45), "jim ko'krak" — INTUBATSIYA va mexanik ventilyatsiya: katta o'lchamli quvur (≥8.0), past nafas chastotasi (8–10/min), kichik tidal hajm (6–8 ml/kg), uzaytirilgan ekspiratsiya (I:E 1:4–1:5), permissiv gipoventilyatsiya, auto-PEEP ni nazorat qilish (taranglashuvchi pnevmotoraks xavfi). Sedatsiya: ketamin.
9. Davolash ta'siri va qayta baholash har 15–30 daqiqada. Kamida 24 soat reanimatsiyada kuzatuv.
10. Chiqarishdan oldin: nazorat qiluvchi ingalyator (ICS/formoterol) qayta tiklash, ingalyator texnikasini o'rgatish, astma harakat rejasi, pulmonolog ko'rigi, trigger (infeksiya) davolash.

KUZATUV VA ASORATLAR: Pnevmotoraks, o'pka shishi (negativ bosimli), laktatli atsidoz (salbutamol natijasida), gipokaliemiya, auto-PEEP, yurak to'xtashi.

KO'P UCHRAYDIGAN XATOLAR: Faqat salbutamolni takrorlab, kortikosteroidni kechiktirish; "jim ko'krak" ni yengillashish deb noto'g'ri talqin qilish; gipoksemiya/gipperkapniyani qon gazlarisiz baholamaslik; sedativlarni intubatsiyasiz berish; ventilyatsiya paytida yuqori nafas chastotasi (auto-PEEP, pnevmotoraks); nazorat qiluvchi dorining tashlab qo'yilishi sababini aniqlamaslik.
```

- **Qiyinlik:** medium · **Yosh:** 29 · **Jins:** female · **Davomiylik:** 12
- **Vitals:** HR 132 · BP 118/72 · SpO2 86 · RR 34 · Harorat 37.4 · GCS 14
- **visual_state:** critical

**Scenario (JSON)**
```json
{
  "history": "Bolalikdan bronxial astma. 2 yil oldin intubatsiya bilan BITda yotgan. Doimiy ingalyatorni 3 oydan beri ichmagan. 1 hafta oldin yuqori nafas yo'llari infeksiyasi. 12 soatdan beri xuruj, salbutamol 20+ marta foyda bermayapti.",
  "comorbidities": ["Bronxial astma (og'ir)", "Allergik rinit"],
  "allergies": ["Uy changi", "Mushuk tuklari"],
  "medications": ["Budesonid/formoterol (ichmagan)", "Salbutamol ingalyatori"],
  "exam_findings": {
    "general": "O'tirib, tripod holatda, gaplarini uzib aytadi, charchagan",
    "cardiovascular": "Taxikardiya, pulsus paradoxus",
    "respiratory": "Xirillash kamaygan ('jim ko'krak'), ekspirator uzayish, yordamchi mushaklar nafasda",
    "other": "Lablar ko'kimtir, terisi nam"
  },
  "diagnostics": {
    "ecg": "Sinus taxikardiyasi",
    "labs": "Qon gazlari: pH 7.30, PaCO2 52, PaO2 55; K 3.3",
    "imaging": "Rentgen: o'pkalarning giperprozrachnosti, pnevmotoraks yo'q"
  },
  "deterioration_triggers": ["Kortikosteroid kechiksa", "Intubatsiya kechiksa", "Sedatsiya intubatsiyasiz berilsa", "Ventilyatsiyada yuqori nafas chastotasi"],
  "improvement_triggers": ["Nebulayzer salbutamol + ipratropiy", "Steroid v/i erta", "Magniy sulfat 2 g", "Himoya ventilyatsiyasi kerak bo'lsa"]
}
```

---

## Tezkor jadval

| # | Mavzu | Qiyinlik | Yosh/Jins | HR | BP | SpO2 | RR | T | GCS | visual_state |
|---|-------|----------|-----------|----|----|------|----|---|-----|--------------|
| 1 | STEMI | medium | 58 / male | 98 | 150/95 | 94 | 22 | 36.8 | 15 | unstable |
| 2 | Gipertonik inqiroz | easy | 55 / female | 86 | 210/120 | 97 | 18 | 36.6 | 15 | unstable |
| 3 | O'tkir yurak yetishmovchiligi | medium | 70 / male | 112 | 160/100 | 86 | 30 | 36.8 | 15 | critical |
| 4 | Bo'lmachalar fibrillyatsiyasi | medium | 52 / male | 148 | 128/82 | 97 | 20 | 36.9 | 15 | unstable |
| 5 | Aorta dissektsiyasi | hard | 49 / male | 110 | 185/105 | 96 | 22 | 36.7 | 15 | critical |
| 6 | Septik shok (Reanimatsiya) | hard | 72 / female | 128 | 82/45 | 93 | 28 | 39.4 | 13 | critical |
| 7 | ARDS (Reanimatsiya) | hard | 58 / male | 118 | 138/84 | 82 | 36 | 39.1 | 14 | critical |
| 8 | Gemorragik shok (Reanimatsiya) | hard | 28 / male | 132 | 82/50 | 94 | 28 | 35.8 | 14 | critical |
| 9 | Kardiogen shok (Reanimatsiya) | hard | 66 / male | 118 | 78/50 | 88 | 30 | 36.2 | 14 | critical |
| 10 | Status astmatikus (Reanimatsiya) | medium | 29 / female | 132 | 118/72 | 86 | 34 | 37.4 | 14 | critical |
