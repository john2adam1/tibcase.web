# AI orqali case yaratish uchun 15 ta kirish (admin → Case'lar → "AI bilan yaratish")

Oynadagi maydonlar: **Mavzu (matn) \***, **Qiyinlik**, **Bemor shikoyati (ixtiyoriy)**, **To'g'ri javob/tashxis (ixtiyoriy)**.
Har blokdagi **Mavzu** va **Qiyinlik** ni yozing, **Bemor shikoyati** va **To'g'ri javob/tashxis** uchun esa kod blokidagi matnni to'liq nusxalab maydonga qo'ying, keyin **Yaratish** ni bosing.

Eslatma
- **Bemor shikoyati** — bemor o'z so'zlari bilan aytadigan shikoyat, keyin esa so'ralganda aytiladigan to'liq anamnez (kasallik boshlanishi, xarakteri, hamroh belgilar, yo'q belgilar, o'tgan kasalliklar, dorilar, allergiya, odatlar). AI shu ma'lumotdan bemor roli uchun scenario yaratadi.
- **To'g'ri javob/tashxis** — yakuniy tashxis, differensial tashxis, birinchi qadamlar tartibi, tekshiruvlar, davolash, kuzatuv va muhim xatolar (nima qilmaslik kerak).
- Dori dozalari va vaqt mezonlari keng qabul qilingan xalqaro qo'llanmalarga (AHA/ESC, ATLS, ADA, GINA/BTS, Surviving Sepsis va boshqalar) asoslangan. Mahalliy protokol bilan solishtirib, mutaxassis ko'rib chiqishi kerak.
- Qiyinlik: Easy / Medium / Hard. Yosh, jins, vitallar, uch tildagi matnlar va scenario'ni AI o'zi to'ldiradi.

---

## 1. O'tkir koronar sindrom (STEMI)

**Mavzu:** O'tkir koronar sindrom (ST ko'tarilishli miokard infarkti)
**Qiyinlik:** Medium

**Bemor shikoyati:**
```
Doktor, ko'kragim qattiq siqilyapti, go'yo ustimga og'ir tosh qo'yib qo'yganday. Og'riq ko'krak qafasining o'rtasida, chap qo'limga va pastki jag'imga tarqalyapti. Taxminan 40 daqiqa oldin ish joyida zinadan ikkinchi qavatga ko'tarilayotganda boshlandi, to'xtab dam olsam ham o'tmadi. Sovuq ter bosdi, ko'nglim aynidi, nafasim yetmayapti, o'zimni o'lib qoladiganday his qilyapman. Og'riq 10 balldan 8 ball. Uyda til ostiga nitroglitserin tabletkasi qo'ydim, 5 daqiqadan keyin yana bittasini, lekin yengillashmadi.

So'ralganda aytiladigan anamnez:
- Yosh va jins: 58 yoshli erkak, haydovchi, ko'p o'tirib ishlaydi.
- Oldin shunga o'xshash og'riq: oxirgi 2 haftada zinadan chiqqanda 2-3 marta qisqa muddatli (5 daqiqagacha) siqilish bo'lgan, dam olganda o'tib ketgan, shifokorga bormagan.
- Surunkali kasalliklar: 7 yildan beri arterial gipertenziya, xolesterini yuqori deb aytilgan, lekin davolanmagan. Qandli diabet yo'q.
- Doimiy dori: amlodipin 5 mg kuniga bir marta (ba'zan unutadi). Boshqa dori, antikoagulyant yoki aspirin ichmaydi.
- Allergiya: dori yoki ovqatga allergiyasi yo'q.
- Odatlar: 20 yildan beri kuniga 1 pachka sigaret chekadi, spirtli ichimlikni kamdan-kam ichadi, jismoniy faol emas, semizlik (tana vazni indeksi taxminan 31).
- Oilaviy anamnez: otasi 55 yoshida miokard infarktidan vafot etgan.
- Yo'q belgilar: yo'tal, isitma, oyoqlarda shish yo'q; ko'krak qafasi og'rig'i nafas olishga yoki tana holatiga bog'liq emas; bel yoki orqaga yirtilayotgandek og'riq yo'q; ichak qon ketishi yoki yaqinda katta operatsiya yo'q; kuchli to'satdan "momaqaldiroq" bosh og'rig'i yo'q.
- Oxirgi ovqat 3 soat oldin. Viagra yoki shunga o'xshash dori ichmagan.
```

**To'g'ri javob/tashxis:**
```
Yakuniy tashxis: ST ko'tarilishli miokard infarkti (STEMI), pastki devor (II, III, aVF tarmoqlarida ST ko'tarilishi). Killip I sinf.

Differensial tashxis (inkor etilishi kerak): aorta disseksiyasi (qo'llarda bosim farqi, orqaga tarqalgan yirtilayotgan og'riq), o'pka arteriyasi tromboemboliyasi, perikardit (nafas va holatga bog'liq og'riq, PR depressiyasi), taranglashuvchi pnevmotoraks, qizilo'ngach spazmi yoki GERB, beqaror stenokardiya yoki NSTEMI.

Birinchi 10 daqiqa:
1. ABCDE yondashuvi, bemorni tinch yotqizish, monitoring (EKG, SpO2, NIBP), vena kateteri (kamida bitta yirik).
2. 12 kanalli EKG tibbiy aloqadan keyin 10 daqiqa ichida. Pastki devor STEMI bo'lsa o'ng qorincha infarktini inkor qilish uchun V4R tarmog'ini yozish.
3. Troponin, umumiy qon tahlili, kreatinin, elektrolitlar, glyukoza, koagulogramma, lipidlar. Reperfuziyani natija kutmasdan boshlash.
4. Aspirin 150-300 mg chaynab yutish (kontrendikatsiya bo'lmasa).
5. P2Y12 ingibitori yuklash dozasi: tikagrelor 180 mg yoki prasugrel 60 mg yoki klopidogrel 600 mg.
6. Antikoagulyant: nefraksiyalanmagan geparin 70-100 birlik/kg vena ichiga (PCI paytida) yoki enoksaparin.
7. Og'riqni kamaytirish: og'riq davom etsa vena ichiga morfin 2-4 mg yoki fentanil bosqichma-bosqich (nafas va bosimni kuzatib). Morfin P2Y12 ta'sirini sekinlashtirishi mumkin.
8. Kislorod faqat SpO2 90% dan past bo'lsa (bu bemorda SpO2 94% bo'lsa shart emas). Ortiqcha kislorod zararli.
9. Nitroglitserin til ostida 0.4 mg: faqat tizimli bosim 90 mm sim.ust. dan yuqori, o'ng qorincha infarkti belgilari yo'q va fosfodiesteraza ingibitori ichilmagan bo'lsa. Pastki devor infarktida bosimni tekshirmasdan nitrat berish xato.

Reperfuziya:
- Birlamchi PCI tanlangan usul: birinchi tibbiy aloqadan 90 daqiqa ichida ("eshikdan balongacha" vaqti), tashxisdan keyin 120 daqiqa ichida. Kateterizatsiya laboratoriyasini darhol faollashtirish.
- PCI 120 daqiqa ichida imkonsiz bo'lsa, tashxisdan 10 daqiqa ichida fibrinoliz (tenekteplaza, vaznga qarab) va keyin 2-24 soat ichida angiografiya.
- Fibrinoliz kontrendikatsiyalari: oldingi miya ichi qon ketish, 3 oy ichida ishemik insult, faol qon ketish, aorta disseksiyasi shubhasi.

Keyingi davolash (barqarorlashgandan keyin): yuqori intensivlikdagi statin (atorvastatin 80 mg), beta-bloker (gemodinamika yaxshi bo'lsa), ACE ingibitori, ikkilamchi antitrombotsit terapiya 12 oy, reanimatsiya bo'limida kuzatuv (aritmiya, qorincha fibrillyatsiyasi xavfi), defibrillyator tayyor turishi, exokardiografiya, chekishni to'xtatish, kardioreabilitatsiya.

Tez-tez uchraydigan xatolar: EKG ni 10 daqiqadan keyin olish; troponinni kutib reperfuziyani kechiktirish; vitallarni tekshirmasdan nitrat yoki morfin berish; kislorodni asossiz berish; shoshilinch PCI markaziga yo'naltirishni kechiktirish; chekish va gipertoniyani davolashni unutish.
```

---

## 2. O'tkir appenditsit

**Mavzu:** O'tkir appenditsit
**Qiyinlik:** Easy

**Bemor shikoyati:**
```
Doktor, kecha kechqurun kindik atrofida noaniq, siqib turuvchi og'riq boshlandi, o'shanda ovqatdan keyin oshqozonim buzildi deb o'yladim. Bugun ertalab og'riq qorinning o'ng pastki qismiga ko'chdi va kuchaydi, yurganimda, yo'talganimda va mashinada notekis yo'ldan o'tganimda yanada og'riydi. O'ng yonboshga egilib yotsam biroz yengillashadi. Ko'nglim aynidi, ertalab bir marta qayt qildim, ishtaham butunlay yo'q. Tana haroratini o'lchadim, 37.9 chiqdi.

So'ralganda aytiladigan anamnez:
- Yosh va jins: 24 yoshli ayol, talaba.
- Najas: kecha bir marta oddiy, bugun ich ketishi yoki qabziyat yo'q, qon yo'q. Siyishda achishish yo'q, siydik rangi odatiy.
- Ginekologik: hayz davri muntazam, oxirgi hayz 10 kun oldin boshlangan, hozir hayz emas. Jinsiy hayot bor, himoyalanadi. Homiladorlik testi uyda manfiy bo'lgan. Qin ajralmasi yoki qonli ajralma yo'q.
- O'tgan kasalliklar: surunkali kasalliklari yo'q, ilgari qorin operatsiyasi yoki appendektomiya bo'lmagan.
- Doimiy dorilar: yo'q (og'riq uchun hech narsa ichmagan).
- Allergiya: dori allergiyasi yo'q.
- Odatlar: chekmaydi, spirtli ichimlik ichmaydi.
- Oilaviy anamnez: ahamiyatli narsa yo'q.
- Yo'q belgilar: bel yoki chov tomonga tarqalgan to'lqinsimon og'riq yo'q, siydikda qon yo'q, ko'krak yoki nafas shikoyati yo'q, qaltirash bilan yuqori isitma yo'q.
- So'nggi ovqat kecha kechqurun; bugun faqat bir stakan suv ichgan.
```

**To'g'ri javob/tashxis:**
```
Yakuniy tashxis: o'tkir appenditsit (asoratsiz). Shartli tashxis bahosi: Alvarado shkalasi taxminan 7-8 ball (og'riqning ko'chishi, anoreksiya, ko'ngil aynishi, o'ng pastki kvadrantda og'riq, Shchetkin-Blyumberg belgisi, harorat 37.3 dan yuqori, leykotsitoz).

Differensial tashxis: mezenterial limfadenit, tuxumdon qisilishi (torsiya), ektopik homiladorlik (birinchi navbatda hCG), tuxumdon kistasining yorilishi, kichik chanoq yallig'lanish kasalligi, gastroenterit, Kron kasalligi, siydik yo'llari infeksiyasi yoki o'ng tomonlama buyrak sanchig'i.

Qadamlar:
1. Vitallarni baholash, ABCDE, og'riq shkalasi.
2. Anamnez va qorin tekshiruvi: o'ng yonbosh sohada mahalliy og'riq, Mak-Berni nuqtasi, Shchetkin-Blyumberg, Rovzing, psoas va obturator belgilari, qorin muskullari tarangligi.
3. Homiladorlik testi (hCG) barcha fertil yoshdagi ayollarda majburiy. Ginekologik sababni chetlatish.
4. Tahlillar: umumiy qon tahlili (leykotsitlar, neytrofillar), CRP, siydik umumiy tahlili (infeksiya va tosh uchun), elektrolitlar va kreatinin (jarrohlikka tayyorgarlik).
5. Tasvirlash: avval qorin va chanoq UZI (siqilmaydigan kengaygan appendiks, 6-7 mm dan katta). UZI noaniq bo'lsa, kontrastli qorin KT yoki MRT. Bolalar va homilador ayollarda UZI va MRT afzal.
6. Davolash: ovqat va suyuqlikni og'iz orqali to'xtatish (NPO), vena ichiga kristalloid infuziya, og'riqsizlantirish (paratsetamol, kerak bo'lsa opioid; og'riqsizlantirish tashxisni yashirmaydi), antiemetik.
7. Jarrohni ertalabdan chaqirish. Davolash tanlovi: laparoskopik appendektomiya (standart). Operatsiyadan oldin keng spektrli antibiotik profilaktikasi (masalan seftriakson plyus metronidazol). Faqat antibiotik bilan davolash tanlangan asoratsiz holatlarda bemor bilan muhokama qilinadi.
8. Asoratlar ogohlantirishi: perforatsiya (yuqori isitma, diffuz peritonit, taxikardiya), abssess, sepsis. Bunday holatda shoshilinch operatsiya va keng antibiotik.

Operatsiyadan keyin: og'riqsizlantirish, erta ovqatlanish, yara parvarishi, 24 soat ichida uyga bo'shatish mumkin (asoratsiz bo'lsa), gistologik tekshiruv.

Tez-tez uchraydigan xatolar: homiladorlik testini o'tkazib yuborish; og'riqsizlantirmasdan kuzatish; KT/UZI ni kechiktirish; ovqatlantirish; jarrohga kech yo'naltirish; tuxumdon qisilishi va ektopik homiladorlikni unutish.
```

---

## 3. Jamoada orttirilgan pnevmoniya

**Mavzu:** Jamoada orttirilgan pnevmoniya
**Qiyinlik:** Medium

**Bemor shikoyati:**
```
Doktor, uch kundan beri isitmam ko'tarilib turibdi, kechalari qaltirab ter bosadi. Yo'talim avvaliga quruq edi, kecha bugundan sariq-yashil, ba'zan zang rangiga o'xshash balg'am ajralyapti. Nafas olganda o'ng ko'krak qafasimning pastki qismi sanchib og'riydi. Bugun zinadan chiqsam nafasim qisilib qoldi, gapirganda ham to'xtab-to'xtab gapiryapman. Holsizman, ishtaham yo'q, boshim og'riydi.

So'ralganda aytiladigan anamnez:
- Yosh va jins: 67 yoshli erkak, nafaqada.
- Boshlanishi: 1 hafta oldin burun bitishi va tomoq og'rig'i (shamollash) bo'lgan, 3-4 kun yengillashgandek bo'lgan, keyin birdan yomonlashgan.
- Harorat: uyda eng baland 38.8 °C.
- Surunkali kasalliklar: 2-tur qandli diabet (10 yil), XOBL tashxisi qo'yilmagan, ammo 30 yil chekkan (hozir kuniga 5-6 dona). Yurak kasalligi yo'q.
- Doimiy dori: metformin 1000 mg kuniga ikki marta. Boshqa dori ichmaydi.
- Allergiya: penitsillin (oldin teriga toshma va qichishish bo'lgan, nafas qisilishi yoki shishish bo'lmagan).
- Emlash: gripp va pnevmokokk vaksinasi olmagan.
- Kontaktlar: nabirasi 1 hafta oldin yo'talib kasal bo'lgan. Yaqinda safar, kasalxonaga yotish yoki antibiotik qabul qilish bo'lmagan.
- Yo'q belgilar: qon tupurish, oyoqlarda shish, ko'krakda siqilish, ongning o'zgarishi, qusish, ich ketishi yo'q.
- Aspiratsiya yoki yutish qiyinligi yo'q. Spirtli ichimlik kam ichadi.
- Oxirgi 24 soatda siydik chiqarishi kamaygan, suyuqlikni kam ichgan.
```

**To'g'ri javob/tashxis:**
```
Yakuniy tashxis: jamoada orttirilgan pnevmoniya, o'ng pastki bo'lak (lobar), o'rta og'irlikdagi, gipoksemiya bilan. Xavf omillari: yosh, qandli diabet, chekish.

Differensial tashxis: o'tkir bronxit, XOBL zo'rayishi, o'pka arteriyasi tromboemboliyasi (pleuritik og'riq), yurak yetishmovchiligi, o'pka saratoni va obstruktiv pnevmoniya, o'pka sili, plevrit yoki empiyema.

Qadamlar:
1. Vitallar va ABCDE; SpO2 91% (gipoksemiya). Kislorod berish, maqsad SpO2 94-98% (XOBL xavfi bo'lsa 88-92%).
2. Tekshiruv: o'ng pastki bo'limda krepitatsiya, bronxial nafas, perkussiyada bo'g'iq tovush, ovoz titrashining kuchayishi.
3. Ko'krak qafasi rentgeni (infiltrat, plevral suyuqlik), umumiy qon tahlili, CRP yoki prokaltsitonin, glyukoza, mochevina va kreatinin, elektrolitlar, jigar fermentlari.
4. Mikrobiologiya: ikki marta qon madaniyati (antibiotikdan oldin, kasalxonaga yotqiziladigan o'rtacha-og'ir bemorlarda), balg'am madaniyati, Legionella va pnevmokokk antigeni siydikda, kerak bo'lsa SARS-CoV-2 va gripp testi.
5. Og'irlikni baholash: CURB-65 (chalkashlik, mochevina 7 mmol/l dan yuqori, nafas tezligi 30 dan ko'p, qon bosimi past, yosh 65 dan katta). Bu bemorda yosh va mochevinaga ko'ra 2 ball: kasalxonaga yotqizish tavsiya qilinadi (1 ball ambulator, 3 va ko'proq intensiv kuzatuv xavfi).
6. Antibiotik (birinchi 1-4 soat ichida, og'irlikka qarab): penitsillin allergiyasi (toshma) hisobga olinadi. Allergiyasiz holatda amoksitsillin klavulanat plyus makrolid. Bu bemorda penitsillin berilmaydi: nafas xinolonlari (levofloksatsin 750 mg yoki moksifloksatsin 400 mg kuniga bir marta) yoki doksitsiklin plyus makrolid (mahalliy qarshilik va qo'llanmaga qarab). Davomiyligi 5-7 kun.
7. Suyuqlik, isitma tushiruvchi, og'riqsizlantirish; qandli diabet monitoringi: infeksiya paytida qand ko'tariladi, metforminni dehidratatsiya yoki buyrak funksiyasi buzilsa to'xtatish va insulinga o'tishni ko'rib chiqish.
8. Qayta baholash 48-72 soatdan keyin: harorat, SpO2, nafas tezligi, CRP. Yaxshilanmasa: plevral suyuqlik (empiyema), abssess, qarshilikli mikrob, KT va bronxoskopiyani o'ylash.
9. Chiqarishdan oldin: 6 hafta keyin nazorat rentgeni (chekuvchi, 50 yoshdan katta bemorda saraton inkori uchun), chekishni to'xtatish, gripp va pnevmokokk vaksinasi.

Tez-tez uchraydigan xatolar: allergiya haqida so'ramasdan penitsillin berish; SpO2 va kislorodni e'tiborsiz qoldirish; qon madaniyatini antibiotikdan keyin olish; diabet bemorda qand va buyrakni tekshirmaslik; nazorat rentgenini unutish.
```

---

## 4. Diabetik ketoatsidoz

**Mavzu:** Diabetik ketoatsidoz
**Qiyinlik:** Hard

**Bemor shikoyati:**
```
Doktor, ikki kundan beri juda qattiq chanqayapman, bir kechada 6-7 marta siyaman, og'zim qurib qolgan. Kecha ko'nglim ayniy boshladi, bugun ertalab uch marta qayt qildim, qorinim butun bo'ylab og'riyapti. Bugun nafasim tez va chuqur bo'lib qoldi, o'zimni juda holsiz va uyquchan his qilyapman, ba'zan fikrlarim chalkashadi. Ikki kilogramm ozib ketdim.

So'ralganda aytiladigan anamnez:
- Yosh va jins: 19 yoshli ayol, universitet talabasi.
- Diabet: 1-tur qandli diabet 6 yildan beri. Insulin: glargin kechqurun va aspart ovqat oldidan.
- Sababi: 3 kun oldin shamollagan (tomoq og'rig'i, yo'tal, past isitma), "ovqat yemayapman, insulin kerak emas" deb o'ylab insulinni 2 kun o'tkazib yuborgan, glyukometr batareyasi tugagan, qandni o'lchamagan.
- Oldingi epizodlar: bir marta 2 yil oldin ketoatsidozga tushgan.
- Hayz: oxirgi hayz 2 hafta oldin, homiladorlik ehtimoli past, himoyalanadi.
- Boshqa kasalliklar: qalqonsimon bez kasalligi yo'q (tekshirilmagan), allergiya yo'q.
- Odatlar: chekmaydi, spirtli ichimlik va giyohvand moddalarni iste'mol qilmaydi. Ovqatlanish buzilishi inkor etadi.
- Hamroh belgilar: bosh og'rig'i yo'q, ko'krak og'rig'i yo'q, yo'tal yengil, siyishda achishish yo'q.
- Oxirgi 24 soatda deyarli suyuqlik ichmagan (qayt qilgani uchun).
```

**To'g'ri javob/tashxis:**
```
Yakuniy tashxis: 1-tur qandli diabetda diabetik ketoatsidoz (DKA), o'rtacha-og'ir. Provokator: insulinni o'tkazib yuborish va yuqori nafas yo'llari infeksiyasi. Mezonlar: glyukoza taxminan 11 mmol/l dan yuqori, qon pH 7.3 dan past yoki bikarbonat 18 mmol/l dan past, qon yoki siydikda ketonlar ko'p.

Differensial tashxis: giperosmolyar giperglikemik holat, alkogolli ketoatsidoz, ochlik ketozi, laktatatsidoz, boshqa sababli qorin og'rig'i (appenditsit, pankreatit) — DKA fonida qorin og'rig'i keng uchraydi, lekin tegishli tekshiruv kerak.

Birinchi qadamlar:
1. ABCDE, monitoring, ikkita vena kateteri, kasalxona reanimatsiya yoki yuqori bog'liqlik bo'limi.
2. Tahlillar: kapillyar va laborator glyukoza, qon gazi (pH, bikarbonat), keton (beta-gidroksibutirat), elektrolitlar (kaliy birinchi navbatda), mochevina va kreatinin, anion farqi, osmolyarlik, umumiy qon tahlili, CRP, laktat, homiladorlik testi, siydik tahlili va madaniyati, EKG (giper/gipokaliemiya), kerak bo'lsa ko'krak rentgeni va qon madaniyati (infeksiya manbai).
3. Suyuqlik: 0.9% NaCl 1 litr birinchi soatda (15-20 ml/kg), keyin dehidratatsiya va elektrolitlarga qarab 250-500 ml/soat. Qand 14 mmol/l dan tushganda 5-10% dekstroza qo'shiladi (insulin infuziyasini to'xtatmasdan).
4. Kaliy: insulindan oldin kaliyni bilish shart.
   - K+ 3.3 mmol/l dan past: insulinni boshlamaslik, avval kaliy to'ldirish (xavfli aritmiya).
   - K+ 3.3-5.3: har litr suyuqlikka 20-30 mmol kaliy qo'shish.
   - K+ 5.3 dan yuqori: kaliy qo'shmaslik, 2 soatda bir nazorat.
5. Insulin: qisqa ta'sirli insulin vena ichiga infuziya 0.1 birlik/kg/soat (kaliy 3.3 va undan yuqori bo'lgandan keyin). Maqsad: qand soatiga 3-4 mmol/l ga pasayishi. Tez pasayishi xavfli (miya shishi, ayniqsa yoshlarda).
6. Bikarbonat: faqat pH 6.9 dan past bo'lsa. Odatda talab qilinmaydi.
7. Provokatorni davolash: infeksiya bo'lsa antibiotik, faqat insulinni o'tkazib yuborgan bo'lsa ta'lim.
8. Monitoring: qand soatiga, keton, elektrolitlar va qon gazi har 2-4 soatda; siydik chiqishi; ong holati (GCS). Aspiratsiya xavfi bo'lsa oshqozon trubkasi.
9. DKA hal bo'lish mezonlari: pH 7.3 dan yuqori, bikarbonat 18 dan yuqori, keton 0.6 mmol/l dan past, ovqat yeya oladi. Keyin teri ostiga insulinga o'tish: avval ovqat bilan birga qisqa ta'sirli, infuziya to'xtatilishidan 1-2 soat oldin uzoq ta'sirli (glargin) boshlanadi.

Asoratlar: gipokaliemiya, gipoglikemiya, miya shishi (bosh og'rig'i, ong pasayishi), o'pka shishi, tromboz. Chiqarishdan oldin: insulin rejimi, "kasallik kunlari" qoidasi (insulinni hech qachon to'xtatmaslik, ketonni o'lchash), glyukometr va keton tasmalari, endokrinolog nazorati.

Tez-tez uchraydigan xatolar: kaliyni bilmasdan insulin boshlash; suyuqlikni kechiktirish; qandni juda tez tushirish; bikarbonatni asossiz berish; provokatorni qidirmaslik; insulinni suyuqlik va ketonlar hal bo'lguncha to'xtatish.
```

---

## 5. O'tkir ishemik insult

**Mavzu:** O'tkir ishemik insult
**Qiyinlik:** Hard

**Bemor shikoyati:**
```
(Bemor gapira olmaydi, rafiqasi aytadi.) Doktor, eri bir soat oldin kechki choy ichib o'tirgan edi, birdan choy kosasini qo'lidan tushirib yubordi. O'ng qo'li ishlamay qoldi, og'zi o'ng tomonga qiyshaydi, gapirmoqchi bo'ladi, lekin so'zlar chiqmayapti, tushunmayapti. Men uni darrov mashinaga o'tqazib olib keldim. Shikoyat boshlangan vaqt: soat 19:10, hozir 20:10.

So'ralganda aytiladigan anamnez (rafiqasi aytadi):
- Yosh va jins: 72 yoshli erkak, nafaqada.
- "Oxirgi sog'lom vaqt": soat 19:00 gacha butunlay sog'lom edi, kechki ovqatdan keyin televizor ko'rgan.
- Surunkali kasalliklar: yillar davomida arterial gipertenziya (dorini muntazam ichmaydi), 2 yil oldin "yurak urishi notekis" deb aytilgan (bo'lmachalar fibrillyatsiyasi), lekin qon suyultiruvchi dori yoki aspirin ichmagan. Qandli diabet yo'q.
- Doimiy dori: enalapril 10 mg (ba'zan unutadi).
- Allergiya: yo'q.
- Oldingi insult yoki o'tkinchi ishemik hujum (TIA): oldin "bir marta qo'li uyishib qolgan" bo'lgan, o'z-o'zidan o'tib ketgan, shifokorga bormagan.
- Yaqinda: bosh yoki bo'yin jarohati, operatsiya, ichak yoki siydik yo'llaridan qon ketish, qon ketish kasalligi, tutqanoq, yaqinda tish jarrohligi yo'q.
- Odatlar: 30 yil chekkan (3 yil oldin tashlagan), spirtli ichimlikni kamdan-kam ichadi.
- Hamroh belgilar: kuchli bosh og'rig'i, qusish, ko'krak og'rig'i, tutqanoq yo'q.
- Tekshiruvda: hushyor, ko'rsatmalarni qisman bajaradi, o'ng yuz pastki qismi simmetriyasi buzilgan, o'ng qo'lda kuch deyarli yo'q, nutq buzilgan (afaziya).
```

**To'g'ri javob/tashxis:**
```
Yakuniy tashxis: o'tkir ishemik insult, chap o'rta miya arteriyasi havzasi (afaziya, o'ng tomonlama gemiparez va yuz parezi). Ehtimoliy mexanizm: bo'lmachalar fibrillyatsiyasi sababli kardioembolik insult (antikoagulyantsiz). Shoshilinch holat: "vaqt — miya".

Differensial tashxis: gemorragik insult (intraserebral qon ketish), gipoglikemiya, tutqanoqdan keyingi Todd falaji, migren aurasi, miya o'smasi, subdural gematoma, funksional sabablar.

Birinchi qadamlar:
1. Qisqartirilgan nevrologik baholash (FAST/BE-FAST), "oxirgi sog'lom vaqt"ni aniq belgilash (19:00), shoshilinch "insult kodi"ni faollashtirish.
2. ABCDE, kislorod faqat SpO2 94% dan past bo'lsa, monitoring (EKG, SpO2, qon bosimi), vena kateteri (kamida bitta, trombolizdan oldin ikkita), qon olish.
3. Kapillyar glyukoza darhol (gipoglikemiya insultga o'xshashi mumkin).
4. Shoshilinch kontrastsiz bosh miya KT (qabul qilingandan keyin 20-25 daqiqada, "eshikdan KT"gacha), imkon bo'lsa KT-angiografiya (katta tomir oklyuziyasi), KT-perfuziya.
5. NIHSS shkalasi bilan og'irlikni baholash.
6. Tahlillar: umumiy qon tahlili, trombotsitlar, koagulogramma (INR, APTV), glyukoza, kreatinin, troponin, elektrolitlar. Trombolizni natija kutmasdan boshlash mumkin (faqat antikoagulyant ichmaganiga ishonch bo'lsa).
7. Trombolitik terapiya: qon ketish yo'q KT, vaqt oynasi 4.5 soatgacha, kontrendikatsiya yo'q bo'lsa alteplaza 0.9 mg/kg (maksimum 90 mg), 10% bolus, qolgani 60 daqiqada infuziya (yoki tenekteplaza 0.25 mg/kg, maksimum 25 mg, bir martalik bolus). "Eshikdan igna"gacha maqsad 60 daqiqadan kam (eng yaxshisi 30).
   - Trombolizdan oldin qon bosimi 185/110 mm sim.ust. dan past bo'lishi shart. Bosim 185/105 chegarada: labetalol 10-20 mg vena ichiga yoki nikardipin infuziyasi bilan sekin pasaytirish. Trombolizdan keyin 24 soat davomida bosim 180/105 dan past.
   - Kontrendikatsiyalar: KT da qon ketish, 3 oy ichida katta insult yoki bosh jarohati, faol qon ketish, INR 1.7 dan yuqori, 48 soat ichida DOAK qabul qilish, trombotsitlar 100 000 dan past, glyukoza 2.7 mmol/l dan past, katta operatsiya (14 kun).
8. Mexanik trombektomiya: katta tomir oklyuziyasi (ichki uyqu arteriyasi, o'rta miya arteriyasining M1 segmenti) tasdiqlansa, tromboliz bilan birga yoki uning o'rniga, 6 soatgacha, tanlangan bemorlarda 24 soatgacha (perfuziya mismatch'iga qarab). Insult markaziga zudlik bilan yo'naltirish.
9. Trombolizdan keyin: 24 soat antitrombotsit va antikoagulyant berilmaydi, nevrologik holat va bosim nazorati (birinchi 2 soat har 15 daqiqa), qon ketishga shubha bo'lsa (bosh og'rig'i, qusish, ong pasayishi) darhol KT va to'xtatish.
10. Tromboliz o'tkazilmasa: bosimni 220/120 gacha "ruxsat etilgan gipertenziya" sifatida tutish, KT dan keyin qon ketish yo'q bo'lsa aspirin 160-300 mg (24-48 soat ichida).
11. Umumiy yordam: NPO, yutish skriningi (aspiratsiyadan oldin hech narsa berilmaydi), kislorodsiz gipoksiya bo'lmasa, bosh ko'tarilgan, gipoglikemiya va giperglikemiyani tuzatish (7.8-10 mmol/l), isitmani tushirish, tromboemboliya profilaktikasi (kompressiya, keyinroq LMVG), erta reabilitatsiya.
12. Ikkilamchi profilaktika: bo'lmachalar fibrillyatsiyasi sababli antikoagulyant (apiksaban, rivaroksaban yoki dabigatran; boshlash vaqti insult og'irligiga qarab 1-14 kun), statin, bosimni nazorat qilish, EKG monitoringi, exokardiografiya, karotid tomirlar UZI.

Tez-tez uchraydigan xatolar: "oxirgi sog'lom vaqt"ni aniqlamaslik; glyukozani tekshirmaslik; KT ni kechiktirish; antikoagulyant ichganini so'ramasdan tromboliz berish; bosim 185/110 dan yuqori bo'lsa pasaytirmasdan tromboliz berish; bosimni keskin tushirish; yutishni tekshirmasdan og'iz orqali dori berish; trombektomiya imkoniyatini unutish.
```

---

## 6. Anafilaksiya

**Mavzu:** Anafilaktik shok
**Qiyinlik:** Medium

**Bemor shikoyati:**
```
Doktor, men bog'da gul sug'orayotgan edim, bir ari bo'ynimning chap tomoniga chaqdi. Besh daqiqa o'tmay butun badanim qichishdi, qizarib, dumaloq toshma toshdi. Keyin lablarim, qovoqlarim va yuzim shishib ketdi, tomog'imda g'uddaday narsa tiqilib qolgandek bo'ldi, ovozim bo'g'ilib qoldi. Nafas olish qiyin, xirillab nafas olyapman, boshim aylanyapti, ko'zim qorong'ilashyapti, qorin og'riyapti va ko'nglim aynayapti. Qo'shnim tez yordam chaqirdi.

So'ralganda aytiladigan anamnez:
- Yosh va jins: 30 yoshli ayol, ofis xodimi.
- Hodisa vaqti: 20 daqiqa oldin. Ari chaqqan joy: bo'yin, ari nishi hali teri ostida (olib tashlanmagan).
- Oldingi reaksiya: o'tgan yili ari chaqqanda joyi katta shishgan va qizargan (mahalliy reaksiya), tizimli reaksiya bo'lmagan. Anafilaksiya oldin bo'lmagan.
- Allergiya: boshqa dori, yeguliklar va lateksga allergiyasi yo'q.
- Surunkali kasalliklar: bronxial astma yo'q (lekin bahorda "burni bitishi" bo'lgan), yurak kasalligi yo'q.
- Doimiy dorilar: og'iz orqali kontratseptiv. Beta-bloker yoki ACE ingibitori ichmaydi.
- Homiladorlik: ehtimol yo'q.
- Odatlar: chekmaydi, spirtli ichimlik ichmagan, bugun jismoniy yuk ham bo'lmagan.
- Hamroh belgilar: hushini yo'qotish bo'lmagan, lekin bosh aylanishi kuchli. Ko'krak og'rig'i yo'q.
- Yaqinda yangi ovqat yoki dori qabul qilmagan.
```

**To'g'ri javob/tashxis:**
```
Yakuniy tashxis: anafilaktik shok (ari chaqishidan, tizimli og'ir allergik reaksiya: teri va shilliq qavat, nafas yo'llari, gipotenziya bir vaqtda). Mezon: allergen ta'siridan keyin dakikalar ichida teri/shilliq qavat belgilari plyus nafas yo'llari yoki qon aylanishi buzilishi.

Differensial tashxis: angioedema (bradikinin sababli, urtikariyasiz), astma xuruji, panik hujum, vazovagal sinkopa, boshqa sababli shok, gipoglikemiya.

Birinchi daqiqalar (hayot uchun xavfli, kechiktirmang):
1. Allergenni to'xtatish: ari nishini olib tashlash (tezda, siqmasdan). Yordamga chaqirish, tez yordam.
2. ADRENALIN — birinchi va eng muhim dori: mushak ichiga son oldingi-tashqi yuzasiga 0.5 mg (0.5 ml, 1:1000 eritma, kattalar), darhol. Kerak bo'lsa 5 daqiqadan keyin takrorlash. Subkutan yoki vena ichiga bolus berilmaydi (aritmiya xavfi). Antigistamin va steroid adrenalin o'rnini bosa olmaydi va uni kechiktirmaslik kerak.
3. Holat: bemorni orqasiga yotqizib oyoqlarini ko'tarish (qon aylanishi buzilgan bo'lsa); nafas qisilishi bo'lsa yarim o'tirgan holat. To'satdan turishga yoki o'tirishga ruxsat bermaslik (bo'sh qorincha sindromi, o'lim xavfi).
4. Yuqori oqimli kislorod (10-15 l/daq niqobda), monitoring (EKG, SpO2, qon bosimi) har 5 daqiqada.
5. Vena yo'li va suyuqlik: 1-2 litr kristalloid tez (bolalarda 20 ml/kg), shok bo'lsa takrorlash.
6. Yordamchi dorilar (adrenalindan keyin): bronxospazmga salbutamol nebulayzer; antigistamin (xlorfenamin 10 mg vena ichiga sekin yoki setirizin) qichishish va toshma uchun; gidrokortizon 200 mg vena ichiga (bifazik reaksiyaning oldini olish uchun, isbotlangan ta'siri cheklangan).
7. Davolashga javob bermasa: adrenalin vena ichiga infuziya (monitoringda, reanimatsiya), nafas yo'llari obstruksiyasi bo'lsa intubatsiya yoki shoshilinch krikotirotomiya, beta-bloker ichgan bo'lsa glyukagon.
8. Triptaza (reaksiyadan 1-2 soatdan keyin) allergiya tashxisini tasdiqlash uchun.
9. Kuzatuv: kamida 6-12 soat (bifazik reaksiya xavfi, og'ir holatda 24 soatgacha).
10. Chiqarishdan oldin: 2 ta adrenalin avtoinjektori retsept va qo'llashga o'rgatish, yozma harakat rejasi, allergolog va venom immunoterapiya, tibbiy braslet, kontratseptiv va boshqa xavf omillarni ko'rib chiqish.

Tez-tez uchraydigan xatolar: adrenalinni kechiktirish yoki faqat antigistamin va steroid berish; adrenalinni vena ichiga bolus yuborish; bemorni o'tirgan yoki turgan holatga qo'yish; shokda suyuqlik bermaslik; kuzatuvsiz bo'shatish; avtoinjektor bermaslik.
```

---

## 7. Bolada bronxial astma xuruji

**Mavzu:** Bolalarda bronxial astma xuruji
**Qiyinlik:** Easy

**Bemor shikoyati:**
```
(Onasi gapiradi, 9 yoshli o'g'li yonida o'tirib qisqa so'zlar bilan javob beradi.) Doktor, o'g'lim kechadan beri yo'talyapti, tunda 3 marta nafas qisilib uyg'ondi. Bugun ertalab nafasida "xirillash" eshitilyapti, o'tirib, oldinga egilib nafas oladi, gapirsa jumlani oxirigacha tugata olmaydi, 3-4 so'zdan keyin to'xtab nafas oladi. Ko'krak qafasi "tortilyapti". Ingalyatorini (ko'k ingalyator) 2 soat ichida 4 marta ishlatdik, avvaliga yengillashgandek bo'ldi, keyin yana yomonlashdi.

So'ralganda aytiladigan anamnez:
- Yosh va jins: 9 yoshli o'g'il bola, maktab o'quvchisi, vazni 30 kg.
- Astma tashxisi 4 yoshdan beri. Oxirgi yilda 2 marta shoshilinch yordamga murojaat qilgan, 1 marta kasalxonaga yotgan, intensiv terapiya bo'lmagan.
- Doimiy davolash: kuniga ikki marta beklometazon (ingalyatsion steroid), kerak bo'lganda salbutamol. Maktabda ingalyatorni muntazam ishlatmaydi, spacer kamdan-kam.
- Sabab: 3 kun oldin shamollash (burun oqishi, yengil isitma). Kontakt: sinfdoshlari kasal.
- Allergiya: chang oqarishi, mushuk junlariga allergiya; oziq-ovqat va dori allergiyasi yo'q. Uyda mushuk bor. Passiv chekish (otasi uyda chekadi).
- Allergik rinit va atopik dermatit.
- Hamroh belgilar: isitma 37.6 °C gacha, bosh og'rig'i yo'q, qusish yo'q, lablar ko'karishi yo'q (lekin rangi oqargan), ongi aniq, lekin charchagan.
- Oxirgi ovqat va suyuqlik: ertalab yengil nonushta.
- Kimyoviy yoki yangi tashqi trigger: yo'q.
```

**To'g'ri javob/tashxis:**
```
Yakuniy tashxis: bolada o'rtacha-og'ir (og'ir belgilar bilan) bronxial astma xuruji, virusli yuqori nafas yo'llari infeksiyasi bilan qo'zg'algan. Og'irlik belgilari: gapirishda 3-4 so'zdan to'xtash, SpO2 92%, nafas tezligi 30, yordamchi mushaklar ishtiroki, ingalyator yordami vaqtinchalik.

Differensial tashxis: pnevmoniya, begona jism aspiratsiyasi, krup/epiglottit, vokal kord disfunksiyasi, anafilaksiya, yurak yetishmovchiligi, pnevmotoraks.

Qadamlar:
1. ABCDE, vitallar (SpO2, nafas va yurak tezligi, ong), tez baholash: gapirish qobiliyati, yordamchi mushaklar, "jim ko'krak" (xavfli belgi).
2. Kislorod: maqsad SpO2 94-98%. Niqob yoki burun kanyulasi.
3. Tezkor ta'sirli bronxodilatator: salbutamol — spacer orqali 4-10 puff (100 mcg/puff) har 20 daqiqada 1 soat davomida yoki nebulayzer 2.5-5 mg har 20 daqiqada (6 yoshdan katta, 5 mg). Og'ir holatda uzluksiz nebulayzer.
4. Antixolinergik: ipratropiy bromid 250 mcg (nebulayzer) birinchi 3 ta salbutamol bilan birga, har 20 daqiqada.
5. Tizimli kortikosteroid birinchi soatda: prednizolon 1-2 mg/kg og'iz orqali (maksimum 40 mg) yoki deksametazon 0.6 mg/kg bir martalik; qusayotgan bo'lsa vena ichiga gidrokortizon. 3-5 kun davom ettiriladi.
6. Har 20 daqiqada qayta baholash: nafas tezligi, SpO2, ong, xirillash, gapirish, kerak bo'lsa tepalik nafas oqimi (PEF).
7. Javob bermasa (og'ir/hayot uchun xavfli): vena ichiga magniy sulfat 40 mg/kg (maksimum 2 g) 20 daqiqada; vena ichiga salbutamol; intensiv terapiyani chaqirish. Sedativlar berilmaydi. Intubatsiya oxirgi chora.
8. Ko'krak qafasi rentgeni faqat pnevmotoraks, pnevmoniya yoki aspiratsiyaga shubha bo'lsa. Antibiotik odatda kerak emas.
9. Yotqizish mezonlari: 1-2 soatdan keyin ham SpO2 92% dan past, kuchli nafas qisilishi, takroriy yomonlashish. Uyga qaytarish: SpO2 94% dan yuqori, 1-4 soat salbutamol talab qilmaydi, gapirishi tiklangan.
10. Chiqarishdan oldin: ingalyator texnikasi va spacer, yozma astma harakat rejasi, nazorat qilinadigan terapiyani kuchaytirish (steroid dozasini oshirish yoki beklometazon plyus formoterol), triggerlarni kamaytirish (mushuk, passiv chekish), 2-7 kun ichida nazorat.

Tez-tez uchraydigan xatolar: kislorodni kechiktirish; ipratropiyni va steroidni birinchi soatda bermaslik; sedativ yoki antibiotikni asossiz berish; "jim ko'krak" belgisini yengillashish deb talqin qilish; yozma reja va texnikani o'rgatmaslik.
```

---

## 8. Gipertonik inqiroz

**Mavzu:** Gipertonik inqiroz
**Qiyinlik:** Easy

**Bemor shikoyati:**
```
Doktor, kechasi soat uchda ensam qattiq og'rib uyg'ondim, boshim aylanyapti, ko'z oldim xiralashib qoldi, quloqlarim shang'illayapti. Uyda bosimni o'lchadim, 215/122 chiqdi, ikkinchi marta o'lchaganimda 210/120. Ko'nglim ayniydi, bir marta qayt qildim, lekin ko'krak og'rig'i yo'q va nafasim qisilmayapti. O'zimni juda xavotirda his qilyapman.

So'ralganda aytiladigan anamnez:
- Yosh va jins: 55 yoshli ayol, maktab o'qituvchisi.
- Gipertoniya 10 yildan beri. Oxirgi 5 kun davomida dorilarni muntazam ichmagan (dori tugab qolgan, yangisini sotib olmagan).
- Doimiy dori: lizinopril 10 mg kuniga bir marta, ba'zan amlodipin 5 mg.
- Boshqa kasalliklar: qandli diabet yo'q, yurak yoki buyrak kasalligi tashxisi yo'q, lekin yillar davomida siydik tahlili qilmagan. Dislipidemiya aytilgan, statin ichmaydi.
- Sababi: bir haftadan beri ish stressi, uyqu kam, sho'r ovqat va tuzlangan mahsulot ko'p, NSAID (ibuprofen) bosh og'rig'i uchun 2 kun ichgan. Dekongestant yoki giyohvand modda ishlatmagan, qahva kuniga 4-5 chashka.
- Homiladorlik/menopauza: menopauzada, gormonal terapiya olmaydi.
- Allergiya: yo'q.
- Odatlar: chekmaydi, spirtli ichimlikni kam ichadi.
- Oilaviy anamnez: onasi insultdan vafot etgan, otasida gipertoniya.
- Yo'q belgilar: nutq buzilishi, bir tomonlama kuchsizlik, yuz qiyshayishi, ko'krak og'rig'i, orqaga yirtilayotgan og'riq, nafas qisilishi, hushni yo'qotish, tutqanoq, siydikda qon yo'q.
- Ko'z: xiralashish ikkala ko'zda, ikkilanma ko'rish yo'q.
```

**To'g'ri javob/tashxis:**
```
Yakuniy tashxis: arterial gipertenziya fonida gipertonik inqiroz; organ shikastlanishi belgilari bor-yo'qligiga qarab farqlanadi. Bu bemorda bosh og'rig'i va ko'rishning xiralashishi (gipertonik retinopatiya yoki ensefalopatiya) organ shikastlanishiga shubha tug'diradi, shuning uchun gipertonik shoshilinch holat (hypertensive emergency) sifatida tekshirish kerak.

Farqlash: 
- Gipertonik shoshilinch holat — qon bosimi 180/120 dan yuqori plyus yangi yoki yomonlashayotgan organ shikastlanishi (ensefalopatiya, insult, o'tkir koronar sindrom, o'pka shishi, aorta disseksiyasi, o'tkir buyrak yetishmovchiligi, eklampsiya).
- Gipertonik shoshilinchlik (urgency) — bosim baland, organ shikastlanishi yo'q.

Differensial tashxis: insult (ishemik yoki gemorragik), aorta disseksiyasi, feoxromotsitoma, preeklampsiya (homilador bo'lmaganida yo'q), dori yoki giyohvand moddalar (simpatomimetik), qoldiq og'riq va xavotir sababli bosim ko'tarilishi, buyrak arteriyasi stenozi.

Qadamlar:
1. ABCDE, ikkala qo'lda bosimni takroriy o'lchash (to'g'ri manjet, o'tirgan holda, 5 daqiqa dam).
2. Maqsadli tekshiruv: nevrologik holat (GCS, fokal belgilar), ko'z tubi (papillashish, qon quyilish), yurak va o'pka (shish, xirillash), nabz va bosim farqi qo'llarda (disseksiya), qorin (buyrak arteriyasi shovqini).
3. EKG, troponin (agar ko'krak belgilar), umumiy qon tahlili, kreatinin va elektrolitlar, siydik umumiy tahlili (oqsil, eritrotsit), glyukoza. Nevrologik belgilar bo'lsa shoshilinch bosh miya KT. Ko'krak og'rig'i yoki disseksiyaga shubha bo'lsa KT-angiografiya.
4. Organ shikastlanishi bo'lsa — reanimatsiya yoki yuqori bog'liqlik bo'limida vena ichiga davolash:
   - Labetalol 20 mg vena ichiga bolus, keyin 20-80 mg har 10 daqiqada yoki infuziya; yoki nikardipin infuziyasi 5 mg/soatdan; kerak bo'lsa klevidipin yoki natriy nitroprussid (monitoring bilan).
   - Maqsad: birinchi soatda o'rtacha arterial bosimni 25% dan ko'p pasaytirmaslik; keyingi 2-6 soatda 160/100-110 gacha; 24-48 soat ichida normal darajaga.
   - Istisnolar: aorta disseksiyasi (sistolik bosim 120 gacha va yurak urishi 60 gacha, birinchi 20 daqiqada), o'tkir ishemik insult (tromboliz bo'lsa 185/110 gacha; bo'lmasa 220/120 gacha ruxsat), preeklampsiya.
5. Organ shikastlanishi bo'lmasa — og'iz orqali dori rejimini tiklash: lizinopril/amlodipin, bir necha soat kuzatuv, bosimni asta-sekin (24-48 soatda) pasaytirish. Tez pasaytirish xavfli (miya va yurak ishemiyasi).
6. Sabablarni bartaraf etish: NSAID to'xtatish, tuzni kamaytirish, qahva, stress, doriga rioya qilish.
7. Chiqarishdan oldin: uy sharoitida bosimni o'lchashga o'rgatish, dori rejimi, 1 hafta ichida oila shifokori nazorati, ikkilamchi gipertoniyani qidirish (yosh bemor yoki davolashga chidamli bo'lsa).

Tez-tez uchraydigan xatolar: bosimni juda tez tushirish; til ostiga nifedipin berish (nazoratsiz keskin tushish); organ shikastlanishini tekshirmaslik; aorta disseksiyasi va insultni inkor etmaslik; NSAID va tuzning rolini e'tiborsiz qoldirish; nazoratga yozmaslik.
```

---

## 9. O'pka arteriyasi tromboemboliyasi

**Mavzu:** O'pka arteriyasi tromboemboliyasi
**Qiyinlik:** Hard

**Bemor shikoyati:**
```
Doktor, ikki kun oldin 11 soatlik parvozdan qaytdim. Bugun ertalab zinadan chiqayotganda to'satdan nafasim qisib qoldi, yurak tez urdi. Nafas olganda ko'krak qafasining o'ng tomoni sanchiydi, yo'talsam yana kuchayadi. Bir marta ozgina qonli balg'am chiqdi. O'ng boldirim 3 kundan beri shishgan, qizargan va bosganda og'riydi. Bir marta bosh aylanib, hushimni yo'qotayozdim. Qo'rqib ketdim.

So'ralganda aytiladigan anamnez:
- Yosh va jins: 38 yoshli ayol, marketing mutaxassisi.
- Xavf omillari: uzoq parvoz (11 soat, deyarli o'tirgan), og'iz orqali kombinatsiyalangan kontratseptiv (estrogenli) 5 yildan beri, kamharakat ish. Homiladorlik yo'q (so'nggi hayz 2 hafta oldin).
- Oldin vena trombozi yoki emboliya bo'lmagan. Oilada: onasining opasi chuqur vena trombozi o'tkazgan.
- Surunkali kasalliklar: yo'q, saraton tashxisi yo'q, yaqinda operatsiya yoki jarohat yo'q, aktiv saraton belgilari yo'q.
- Doimiy dori: kontratseptiv. Antikoagulyant ichmaydi.
- Allergiya: dori allergiyasi yo'q.
- Odatlar: chekmaydi, spirtli ichimlikni kam ichadi.
- Hamroh belgilar: yengil isitma (37.2 °C), yurak urishi, qorinda va oyoqdagi og'riq.
- Yo'q belgilar: ko'krak qafasida siqilish va chap qo'lga tarqalish, yo'tal bilan ko'p balg'am, isitma va qaltirash, qon ketish (hayz og'ir emas).
- Tekshiruvda o'ng boldir chap tomonga nisbatan 3 sm katta, paypaslaganda og'riqli.
```

**To'g'ri javob/tashxis:**
```
Yakuniy tashxis: o'pka arteriyasi tromboemboliyasi (O'ATE), chuqur vena trombozi (o'ng boldir) fonida; provokator xavf omillari: uzoq parvoz va estrogenli kontratseptiv. Gemodinamik jihatdan barqaror (sistolik bosim 90 dan yuqori) bo'lsa ham, o'rta-yuqori xavf (troponin ko'tarilgan, o'ng qorincha yuklamasi belgilari, EKG da S1Q3T3).

Differensial tashxis: o'tkir koronar sindrom, pnevmoniya, plevrit, pnevmotoraks, perikardit, aorta disseksiyasi, astma, panik hujum, yurak yetishmovchiligi.

Qadamlar:
1. ABCDE, kislorod (maqsad SpO2 94% dan yuqori), monitoring (EKG, SpO2, qon bosimi), vena yo'li.
2. Klinik ehtimolni baholash — Uells shkalasi: chuqur vena trombozi klinikasi (3 ball), O'ATE eng ehtimoliy tashxis (3 ball), yurak urishi 100 dan yuqori (1.5 ball) = taxminan 7.5 ball: yuqori ehtimol (6 dan yuqori). Yuqori ehtimolda D-dimer yetarli emas — to'g'ridan-to'g'ri tasvirlash.
3. Shu bilan birga, tasdiqlashni kutmasdan antikoagulyantni darhol boshlash (qon ketish kontrendikatsiyasi bo'lmasa): past molekulyar geparin (enoksaparin 1 mg/kg har 12 soatda yoki 1.5 mg/kg kuniga bir marta) yoki nefraksiyalanmagan geparin (agar reperfuziya ehtimol yoki buyrak yetishmovchiligi bo'lsa).
4. Tasdiqlash: o'pka KT-angiografiyasi (birinchi tanlov), o'ng qorincha/chap qorincha nisbati. Homiladorlik testi KT dan oldin. Kontrastga kontrendikatsiya bo'lsa V/Q stsintigrafiya. Oyoq venalarining kompression UZI.
5. Qo'shimcha tahlillar: troponin, BNP, umumiy qon tahlili, koagulogramma, kreatinin, qon gazi, EKG (S1Q3T3, o'ng qorincha yuklamasi, taxikardiya). Exokardiografiya: o'ng qorincha kengayishi va disfunksiyasi.
6. Xavf darajasi (ESC): yuqori xavf — gipotenziya (sistolik bosim 90 dan past), shok: shoshilinch reperfuziya (sistemik tromboliz: alteplaza 100 mg 2 soatda; yoki kateter yoki jarrohlik embolektomiya). O'rta-yuqori xavf — troponin va o'ng qorincha yuklamasi bor, lekin bosim barqaror: antikoagulyant va yaqin monitoring, dekompensatsiya bo'lsa qutqaruv reperfuziyasi. Past xavf — uyda davolash mumkin.
7. Suyuqlikni ortiqcha yubormaslik (o'ng qorincha yetishmovchiligi); gipotenziyada vazopressor (norepinefrin).
8. Uzoq muddatli antikoagulyant: oral antikoagulyantga o'tish (rivaroksaban 15 mg kuniga ikki marta 21 kun, keyin 20 mg; yoki apiksaban 10 mg kuniga ikki marta 7 kun, keyin 5 mg ikki marta). Davomiyligi provokatsion hodisada kamida 3 oy.
9. Kontratseptivni to'xtatish va estrogensiz usulga o'tish (ginekolog bilan). Trombofiliya testi odatda talab qilinmaydi (provokator aniq).
10. Chiqarishdan oldin: dorilar, qon ketish belgilari, 3 oydan keyin nazorat (kompleks nafas qisilishi bo'lsa surunkali tromboembolik o'pka gipertenziyasini baholash), uzoq parvozda harakat va kompression paypoq.

Tez-tez uchraydigan xatolar: antikoagulyantni tasdiqlashni kutib kechiktirish; yuqori ehtimolda D-dimerga tayanish; homiladorlik testisiz KT; kontratseptivni to'xtatmaslik; ortiqcha suyuqlik berish; xavf darajasini (troponin, o'ng qorincha) baholamaslik.
```

---

## 10. Yuqori oshqozon-ichak qon ketishi

**Mavzu:** Yuqori oshqozon-ichak qon ketishi
**Qiyinlik:** Medium

**Bemor shikoyati:**
```
Doktor, ikki kundan beri najasim qora, qatronga o'xshash, yopishqoq va juda yomon hidli. Bugun ertalab qahva donasiga o'xshash qora qayt qildim, keyin yana bir marta ozgina yangi qizil qon aralash qayt qildim. Boshim aylanyapti, turganimda ko'zim qorong'ilashadi, yurak tez uradi, juda holsizman, terim sovuq va oqarib ketdi. Qornimning yuqori qismida (epigastriyada) yonish va og'riq bor, ovqatdan keyin kuchayadi.

So'ralganda aytiladigan anamnez:
- Yosh va jins: 50 yoshli erkak, qurilish nazoratchisi.
- Og'riq dori: bel og'rig'i uchun bir oy davomida diklofenak 75 mg kuniga ikki marta ichgan, ovqatsiz holda.
- Oshqozon: oldin "gastrit" tashxisi bo'lgan, ba'zan yonish bo'lgan, lekin endoskopiya qilinmagan. Yara tashxisi bo'lmagan.
- Spirtli ichimlik: haftasiga 3-4 marta ko'p miqdorda, so'nggi 3 kun ichida kuchli ichkilik ichgan. Jigar kasalligi tashxisi yo'q, lekin sariqlik yoki qorinda suyuqlik yo'q.
- Chekadi: kuniga 10 dona.
- Antikoagulyant yoki antitrombotsit (aspirin, klopidogrel, varfarin) ichmaydi. Boshqa dori: yo'q.
- Allergiya: yo'q.
- Qon ketish kasalligi va oldin shunday qon ketish: bo'lmagan.
- Hamroh belgilar: ko'krak og'rig'i yo'q, nafas qisilishi yengil (kamqonlikdan), vazn yo'qotish yo'q, yutishda qiyinlik yo'q, kuchli qayt qilib "yirtilish" bo'lmagan (Mallori-Veys xavfi past).
- Oxirgi ovqat 6 soat oldin. Siydik kamaygan.
```

**To'g'ri javob/tashxis:**
```
Yakuniy tashxis: yuqori oshqozon-ichak qon ketishi (hematemezis va melena), ehtimol NSAID bilan bog'liq o'n ikki barmoq ichak yoki oshqozon yarasi (Forrest tasnifi endoskopiyada aniqlanadi); gemorragik gipovolemiya (shok boshlanishi: taxikardiya, gipotenziya, Hb past).

Differensial tashxis: varikoz kengaygan venalardan qon ketish (jigar sirrozi, spirtli ichimlik fonida), Mallori-Veys yirtilishi, eroziv gastrit/ezofagit, o'sma, angiodisplaziya, Dyulafua yarasi, qizilo'ngach yaralari.

Qadamlar:
1. ABCDE, nafas yo'llarini himoya qilish (hushi pasaygan yoki massiv qon qayt qilsa intubatsiya), kislorod.
2. Reanimatsiya: kamida ikkita yirik vena kateteri (14-16G), tez kristalloid infuzia (dastlab 1-2 litr), monitoring, siydik chiqishi, gemodinamikani baholash. Qon yo'qotish 1500 ml dan ko'p bo'lsa massiv transfuziya protokoli.
3. Tahlillar: umumiy qon tahlili (Hb), qon guruhi va moslashuvchanlik, koagulogramma, mochevina va kreatinin (mochevina yuqori — yuqori GI qon ketish belgisi), jigar fermentlari, elektrolitlar, laktat, EKG, troponin (ishemiya xavfi bo'lsa).
4. Xavf darajasini baholash: Glasgow-Blatchford shkalasi (Hb, mochevina, sistolik bosim, puls, melena, sinkopa, jigar kasalligi, yurak yetishmovchiligi) — yuqori ball (7 dan ko'p) shoshilinch gospitalizatsiya va endoskopiya. Bu bemor yuqori xavf guruhida.
5. Transfuziya: cheklangan strategiya — Hb 70 g/l dan past bo'lganda (yurak kasalligi bo'lsa 80 g/l), maqsad 70-90 g/l. Gemodinamik beqarorlik bo'lsa Hb ga qaramay qon quyish. Koagulopatiya bo'lsa mos choralar. Ortiqcha transfuziya qayta qon ketish xavfini oshiradi.
6. Dori: proton nasosi ingibitori vena ichiga (esomeprazol yoki pantoprazol 80 mg bolus, keyin 8 mg/soat infuziya yoki 40 mg har 12 soatda); endoskopiyadan oldin eritromitsin 250 mg vena ichiga (oshqozonni bo'shatish, ixtiyoriy). Sirroz shubhasi bo'lsa: terlipressin yoki oktreotid, profilaktik antibiotik (seftriakson).
7. Endoskopiya: gemodinamika barqarorlashgandan keyin birinchi 24 soat ichida (beqaror bo'lsa 12 soat ichida). Endoskopik gemostaz: epinefrin in'ektsiyasi plyus klip yoki termokoagulyatsiya (ikki usul). Forrest Ia, Ib, IIa — yuqori qayta qon ketish xavfi. Variks bo'lsa bog'lash.
8. Endoskopiyadan keyin: yuqori dozali PPI 72 soat, keyin og'iz orqali; Helicobacter pylori testi va eradikatsiya; NSAID ni to'xtatish (zarur bo'lsa selektiv COX-2 plyus PPI); spirtni to'xtatish, chekishni tashlash.
9. Qayta qon ketishi yoki endoskopiya muvaffaqiyatsizligi: takroriy endoskopiya, angioembolizatsiya, jarrohlik.
10. Chiqarishdan oldin: kamqonlikni davolash (temir), dorilarni qayta ko'rib chiqish, ambulator nazorat, 8-12 haftadan keyin yara bitishini tasdiqlash (oshqozon yarasi bo'lsa).

Tez-tez uchraydigan xatolar: suyuqlik va qon almashtirishni kechiktirish; ortiqcha transfuziya; PPI ni vena ichiga bermaslik; endoskopiyani kechiktirish; NSAID ni to'xtatmaslik; sirrozni o'ylamaslik va variks bo'lsa vazoaktiv dori bermaslik; H. pylori ni tekshirmaslik.
```

---

## 11. Urosepsis

**Mavzu:** Urosepsis (siydik yo'llari infeksiyasidan sepsis)
**Qiyinlik:** Medium

**Bemor shikoyati:**
```
(Bemor ayol chalkashroq gapiradi, qizi yonida va tafsilotlarni to'ldiradi.) Doktor, kechadan beri qaltirab isitmam chiqdi, ikki marta qattiq titroq tutdi. Chap belim og'riydi, siyganda achishadi, siydigim loyqa va yomon hidli. Bugun ertalab chalkashib qoldim, onam o'z uyini tanimay qoldi deydi qizi. Boshim aylanyapti, qorinim og'riydi, ko'nglim ayniydi, juda holsiz. Bugun ertalabdan beri kam siydim.

So'ralganda aytiladigan anamnez:
- Yosh va jins: 68 yoshli ayol, nafaqada.
- Boshlanishi: 3 kun oldin siydik chiqarishda achishish va tez-tez siyish boshlangan, davolanmagan ("o'zi o'tib ketadi" deb o'ylagan, ko'p suv ichmagan). Kecha isitma va titroq qo'shilgan.
- Harorat: uyda 38.9 °C.
- Takroriy siydik yo'llari infeksiyalari: o'tgan yili 3 marta bo'lgan. Buyrak toshlari: 5 yil oldin siydik yo'li toshi bo'lgan (o'z-o'zidan chiqqan).
- Surunkali kasalliklar: 2-tur qandli diabet (12 yil), arterial gipertenziya.
- Doimiy dorilar: metformin 1000 mg ikki marta, amlodipin 5 mg. Antikoagulyant ichmaydi.
- Allergiya: dori allergiyasi yo'q (antibiotiklarga bardosh bergan).
- Yaqinda: kateter, siydik yo'llari operatsiyasi, kasalxonaga yotish yoki antibiotik qabul qilish bo'lmagan.
- Hamroh belgilar: qusish yo'q, ich ketishi yo'q, nafas qisilishi yengil, yo'tal yo'q, qin ajralmasi yo'q.
- Odatlar: chekmaydi, spirtli ichimlik ichmaydi.
- Siydik: oxirgi 12 soatda kam, to'q rangda.
- Holat: tana harorati yuqori, terisi issiq va qizargan, chalkash, bosimi past.
```

**To'g'ri javob/tashxis:**
```
Yakuniy tashxis: siydik yo'llari infeksiyasidan kelib chiqqan sepsis (urosepsis), o'tkir pielonefrit (chap), ehtimol obstruksiya (UZI da chap buyrak jomining kengayishi), septik shok boshlanishi (bosim past, laktat ko'tarilgan). Qo'shimcha: qandli diabet fonida o'tkir buyrak shikastlanishi xavfi.

Differensial tashxis: pnevmoniya, qorin bo'shlig'i sepsisi (xolangit, apenditsit, divertikulit), meningit, sepsis boshqa manbadan, toksik shok, qandli diabet asoratlari (DKA, giperosmolyar holat).

Tezkor tashxis: qSOFA (chalkashlik, nafas tezligi 22 dan yuqori, sistolik bosim 100 dan past) — bu bemorda 3 ta, yuqori o'lim xavfi. Sepsis-3: infeksiya plyus SOFA ballining 2 va undan ko'p oshishi; septik shok — gipotenziya, vazopressor kerak va laktat 2 mmol/l dan yuqori suyuqlikdan keyin.

Qadamlar (birinchi soat — "Sepsis soati"):
1. ABCDE, kislorod (SpO2 94% dan yuqori), monitoring, ikkita vena kateteri, siydik kateteri (soatlik diurez maqsadi 0.5 ml/kg/soat dan yuqori).
2. Tahlillar: laktat (qayta o'lchash 2-4 soatda), ikki marta qon madaniyati (antibiotikdan oldin, lekin antibiotikni 45 daqiqadan ortiq kechiktirmasdan), siydik tahlili va madaniyati, umumiy qon tahlili, CRP yoki prokaltsitonin, kreatinin, elektrolitlar, glyukoza, jigar fermentlari, koagulogramma, qon gazi.
3. Antibiotik: birinchi soat ichida, keng spektrli, mahalliy qarshilik hisobga olinadi: masalan seftriakson 2 g vena ichiga yoki piperatsillin-tazobaktam 4.5 g; ESBL xavfi yoki yaqinda antibiotik bo'lsa karbapenem (meropenem). Dozani buyrak funksiyasiga moslash, lekin birinchi dozani kamaytirmaslik.
4. Suyuqlik: kristalloid 30 ml/kg birinchi 3 soatda (bosim past yoki laktat 4 dan yuqori bo'lsa), keyin dinamik baholash (kapillyar to'lish, diurez, laktat).
5. Vazopressor: suyuqlikdan keyin ham o'rtacha arterial bosim 65 mm sim.ust. dan past bo'lsa norepinefrin (markaziy yoki periferik vena); maqsad O'AB 65 dan yuqori. Gidrokortizon 200 mg/sut vazopressor talab qilsa.
6. Manba nazorati (eng muhimi): UZI yoki KT bilan obstruksiya (tosh, abssess, pionefroz) aniqlansa — shoshilinch drenaj (nefrostomiya yoki ureteral stent) bir necha soat ichida. Antibiotik drenajsiz yetarli emas.
7. Metforminni darhol to'xtatish (laktatatsidoz va o'tkir buyrak shikastlanishi), glyukozani insulin bilan nazorat qilish (7.8-10 mmol/l), nefrotoksik dorilardan (NSAID) saqlanish.
8. Tromboemboliya profilaktikasi, oshqozon yarasi profilaktikasi (xavf omillari bo'lsa), erta oziqlantirish.
9. Reanimatsiya bo'limiga yo'naltirish: vazopressor, mexanik ventilyatsiya, buyrak o'rnini bosish terapiyasi ehtiyoji.
10. Qayta baholash: 48-72 soatda madaniyat natijasiga ko'ra antibiotikni toraytirish (de-eskalatsiya), davomiyligi taxminan 7 kun (drenajdan keyin).

Tez-tez uchraydigan xatolar: antibiotikni birinchi soatdan keyin berish; qon madaniyatini antibiotikdan keyin olish; suyuqlikni yetarli bermaslik yoki ortiqcha berish; obstruksiyani UZI bilan izlamaslik va drenajni kechiktirish; metforminni to'xtatmaslik; qandni nazorat qilmaslik; laktatni qayta o'lchamaslik.
```

---

## 12. Buyrak sanchig'i

**Mavzu:** Buyrak sanchig'i (siydik yo'li toshi)
**Qiyinlik:** Easy

**Bemor shikoyati:**
```
Doktor, bir soat oldin uyda o'tirgan paytimda o'ng belimda to'satdan juda qattiq, to'lqinsimon og'riq boshlandi. Og'riq pastga, qorinning o'ng pastki qismiga va chovga, ba'zan moyakka tarqalyapti. Joyimda turolmayapman, yotsam ham, o'tirsam ham yengillashmayapti, uyni ichida aylanib yuribman. Ko'nglim aynidi, bir marta qayt qildim. Siydigimga qon aralashganday bo'ldi, rangi pushti.

So'ralganda aytiladigan anamnez:
- Yosh va jins: 35 yoshli erkak, IT mutaxassisi.
- Oldingi toshlar: oldin bunday og'riq bo'lmagan, siydik yo'li toshi tashxisi qo'yilmagan.
- Xavf omillari: kuniga atigi 1 litr suyuqlik ichadi, go'shtli va sho'r ovqatni yoqtiradi, kofe va gazli ichimliklarni ko'p ichadi, yozda ko'p terlaydi. Oilada: otasida buyrak toshlari bo'lgan.
- Siydik: pushti rangli, bir marta bo'sh siydik chiqargan; siyishda achishish yo'q, tez-tez siyish bor, to'liq bo'shamaydi degan his yo'q. Isitma va titroq yo'q.
- Surunkali kasalliklar: yo'q, podagra yo'q, yurak yoki buyrak kasalligi yo'q.
- Doimiy dorilar: yo'q. Og'riq uchun hech narsa ichmagan.
- Allergiya: dori allergiyasi yo'q (NSAID allergiyasi yo'q), oshqozon yarasi yo'q.
- Yo'q belgilar: yuqori isitma, qaltirash, oyoq uyishishi, moyak shishi, tez yurak urishi, nafas qisilishi yo'q.
- Qorin: yumshoq, bel (o'ng kostovertebral burchak) urib ko'rilganda og'riqli.
```

**To'g'ri javob/tashxis:**
```
Yakuniy tashxis: o'ng siydik yo'lining pastki qismidagi toshdan buyrak sanchig'i (taxminan 5 mm), yengil gidronefroz, mikrogematuriya, infeksiyasiz.

Differensial tashxis: o'tkir appenditsit, o'tkir pankreatit, aorta anevrizmasi yorilishi (50 yoshdan katta bemorlarda va xavf omillari bilan; bu yoshda kam), o'ng tomonlama pielonefrit, moyak buralishi (chovga va moyakka tarqalayotgan og'riq — tekshirish shart), ichak tutilishi, ginekologik sabab (ayollarda), mushak-skelet og'rig'i, o'ng tomonlama pnevmoniya.

Qadamlar:
1. Vitallarni (shu jumladan harorat), og'riq shkalasini, ABCDE baholash. Isitma, gipotenziya, anuriya — xavfli belgilar.
2. Og'riqsizlantirish (birinchi navbatda): NSAID (diklofenak 75 mg mushak ichiga yoki ketorolak 30 mg vena ichiga yoki ibuprofen); kontrendikatsiya (buyrak yetishmovchiligi, yara) bo'lsa paratsetamol vena ichiga; kuchli og'riqda opioid (morfin, fentanil) qo'shish. Antiemetik (metoklopramid yoki ondansetron), suyuqlik (dehidratatsiya bo'lsa).
3. Tahlillar: siydik umumiy tahlili (eritrotsit, leykotsit, nitrit), siydik madaniyati (infeksiya bo'lsa), umumiy qon tahlili, kreatinin va elektrolitlar, CRP, siydik kislotasi, kaltsiy.
4. Tasvirlash: past dozali kontrastsiz KT (qorin va chanoq, "KT-KUB") — tashxis uchun oltin standart (taxminan 95% sezgirlik). UZI (gidronefroz va tosh) va qorin umumiy rentgeni (KUB) birinchi qadam sifatida ham mumkin, ayniqsa yoshlarda. Bolalar va homilador ayollarda UZI.
5. Infeksiya yoki obstruktsiya xavfi belgilarini aniqlash: isitma, leykotsitoz, bitta buyrak, buyrak yetishmovchiligi, tosh 10 mm dan katta — shoshilinch urolog (infeksiyalangan obstruksiya — shoshilinch drenaj: stent yoki nefrostomiya).
6. Davolash tanlovi: 5 mm gacha distal tosh — taxminan 90% o'z-o'zidan chiqadi. Kutish taktikasi: yetarli suyuqlik (kuniga 2-3 litr siydik chiqishi uchun), og'riqsizlantirishni uyda davom ettirish, medikamentoz ekspulsiv terapiya (tamsulozin 0.4 mg kuniga bir marta, 5 mm dan katta distal toshlarda dalillar aralash), siydikni suzgichdan o'tkazish (toshni tahlilga olish), 1-2 haftada urolog nazorati.
7. Qo'ng'iroq qilish belgilari (qaytish): isitma va titroq, nazoratga bo'ysunmaydigan og'riq, siydik chiqmasligi, qusish.
8. Muolaja kerak bo'lsa: URS (ureteroskopiya) yoki ESWL (masofadan tosh maydalash), kattaroq toshlar uchun PNL.
9. Profilaktika: ko'p suyuqlik (>2.5 litr/sut), tuz va hayvon oqsilini kamaytirish, sitrus ichimliklar, metabolik tekshiruv (takroriy tosh, yosh bemor): siydik kislotasi, kaltsiy, oksalat, sitrat, tosh tahlili.

Tez-tez uchraydigan xatolar: og'riqsizlantirmaslik; infeksiya va obstruksiya belgilarini tekshirmaslik; moyak buralishi va appenditsitni inkor etmaslik; NSAID ni buyrak yetishmovchiligida berish; toshni tahlilga yubormaslik; profilaktikani tushuntirmaslik.
```

---

## 13. Gipoglikemiya

**Mavzu:** Gipoglikemiya
**Qiyinlik:** Easy

**Bemor shikoyati:**
```
(Bemor chalkash, rafiqasi gapiradi.) Doktor, eri tushlikdan oldin odatdagidek insulin qildi, lekin ovqat yemadi, chunki ish ko'p edi va og'ir yuk ko'tarish bilan band bo'ldi. Soat ikkida to'satdan rangi oqarib, ter bosdi, qo'llari titray boshladi, gapi chalkashdi, so'ralgan savolga noto'g'ri javob beryapti, ba'zan unutib qo'yadi. Yurak tez uryapti. Bir marta "boshim aylanyapti, ochman" dedi.

So'ralganda aytiladigan anamnez (rafiqasi va bemor):
- Yosh va jins: 45 yoshli erkak, qurilishchi.
- Diabet: 1-tur qandli diabet 15 yildan beri. Insulin: tez ta'sirli aspart ovqat oldidan (bugun ertalab 10 birlik, tushlik oldidan 12 birlik qildi), uzoq ta'sirli glargin kechqurun 24 birlik. Insulin dozasini odatdagidek hisoblagan, lekin ovqat yemagan.
- Oldingi gipoglikemiya: oyiga 1-2 marta yengil, "ogohlantiruvchi belgilar" ba'zan sezmaydi. Og'ir (hushni yo'qotish yoki tutqanoq) hodisa bo'lmagan.
- Glyukometr: bugun o'lchamagan; hozir kapillyar qand 2.4 mmol/l (maktabda ishlatadigan glyukometr).
- Jismoniy faollik: ertalabdan beri og'ir mehnat (g'isht tashish), odatdagidan ko'p.
- Spirtli ichimlik: bugun ichmagan, odatda kam ichadi.
- Boshqa kasalliklar: buyrak yetishmovchiligi, jigar kasalligi yo'q, yurak kasalligi yo'q.
- Doimiy dori: faqat insulin. Beta-bloker yoki sulfanilmochevina ichmaydi.
- Allergiya: yo'q.
- Hamroh belgilar: tutqanoq yo'q, bosh jarohati yo'q, nutq buzilishi (chalkash, lekin fokal nevrologik yetishmovchilik yo'q), ko'krak og'rig'i yo'q.
- Yutish: yutish refleksi saqlangan, ichimlik so'ralganda yutishga urinadi, lekin hushyorligi pasaygan.
```

**To'g'ri javob/tashxis:**
```
Yakuniy tashxis: insulin bilan davolanadigan 1-tur qandli diabetda gipoglikemiya (2-3 daraja: glyukoza 3.0 mmol/l dan past, ong buzilishi bor, begona yordam talab qilinadi). Sababi: insulinni qabul qilib ovqat yemaslik va kuchli jismoniy yuk.

Differensial tashxis: insult, tutqanoqdan keyingi holat, intoksikatsiya (spirt, giyohvand moddalar), sepsis, DKA, bosh jarohati, yurak aritmiyasi, gipoksemiya.

Qadamlar:
1. ABCDE, ong (GCS), vitallar. Glyukozani DARHOL kapillyar va keyin laborator o'lchash (gipoglikemiya aniqlansa, tashxis uchun kutmasdan davolash).
2. Gipoglikemiya darajasini baholash va yutish xavfsizligini aniqlash.
3. Bemor hushyor, yutishga qodir va hamkorlik qilsa: tez uglevod 15-20 g og'iz orqali (glyukoza tabletkalari 3-4 dona, 150-200 ml meva sharbati yoki shakar eritmasi). Murakkab uglevod yoki chokolad berilmaydi (sekin so'riladi). 15 daqiqada qayta o'lchash; hali ham 4 mmol/l dan past bo'lsa takrorlash.
4. Bemor chalkash, hushi pasaygan, yutishga xavfli yoki qusyapti: og'iz orqali berilmaydi (aspiratsiya xavfi). Vena ichiga 10% dekstroza 150-200 ml 15 daqiqada (yoki 50% dekstroza 25-50 ml tomir toshib ketmasligiga e'tibor berib), kerak bo'lsa takrorlash. Vena yo'li bo'lmasa: glyukagon 1 mg mushak ichiga yoki teri ostiga.
5. Qand 4 mmol/l dan yuqori bo'lgach va ong tiklanganda: murakkab uglevodli ovqat (non, sut, bo'tqa) bilan ovqatlanish, chunki glargin uzoq ta'sirli.
6. Monitoring: 15 daqiqada, keyin soatiga qand, takroriy gipoglikemiya ehtimoli (uzoq ta'sirli insulin). Og'ir yoki sulfanilmochevina bilan bog'liq bo'lsa kuzatuv 24 soatgacha.
7. Sababni aniqlash va tuzatish: ovqatni o'tkazib yuborish, jismoniy yuk, insulin dozasi xatosi, buyrak yetishmovchiligi, alkogol. Insulin dozasini ovqat va faoliyatga moslash (jismoniy yukdan oldin uglevod yoki dozani kamaytirish), glyukozaning uzluksiz monitoringi (CGM) ni ko'rib chiqish.
8. Ta'lim: gipoglikemiya belgilari, "15-15 qoidasi" (15 g uglevod, 15 daqiqa kutish), yaqinlarini glyukagon (burun yoki in'ektsiya) bilan o'rgatish, haydovchilik cheklovlari, ish joyida tayyor uglevod saqlash.
9. Endokrinolog nazorati: bazal-bolyus rejimi, takroriy gipoglikemiya bo'lsa dozalarni qayta ko'rish.

Tez-tez uchraydigan xatolar: glyukozani o'lchamasdan davolash yoki aksincha kechiktirish; hushi pasaygan bemorga og'iz orqali ovqat/ichimlik berish; chokolad yoki murakkab uglevod bilan boshlash; keyin ovqatlantirmaslik va kuzatmaslik; sababni aniqlamaslik; glyukagon va ta'limni unutish.
```

---

## 14. Taranglashuvchi pnevmotoraks

**Mavzu:** Taranglashuvchi pnevmotoraks (ko'krak qafasi travmasi)
**Qiyinlik:** Hard

**Bemor shikoyati:**
```
Doktor, men tog' velosipedida yiqildim, chap qovurg'amning ustiga rul tegib ketdi. Dastlab biroz og'riqdi, lekin 30-40 daqiqadan keyin nafas olish tobora qiyinlashdi. Hozir bo'g'ilyapman, havo yetmayapti, chap ko'krak qafasim juda qattiq og'riyapti, nafas olsam yanada og'riydi. Yurak urishi tez. Boshim aylanyapti, ko'z oldim xiralashyapti, terlab ketdim, juda qo'rqyapman, "o'lib qolaman" deb o'ylayapman.

So'ralganda aytiladigan anamnez:
- Yosh va jins: 25 yoshli erkak, talaba, sportchi.
- Jarohat: taxminan 1 soat oldin, tezlikda velosipeddan yiqilgan, rul chap qovurg'a sohasiga urilgan. Kaska kiygan edi, bosh jarohati va hushni yo'qotish bo'lmagan.
- O'tgan kasalliklar: sog'lom, astma yoki XOBL yo'q, ilgari pnevmotoraks bo'lmagan. Marfan belgilari (uzun bo'yli, ozg'in) yo'q.
- Doimiy dorilar: yo'q. Allergiya: yo'q.
- Odatlar: chekmaydi, ba'zan sportda energetik ichimlik. Spirt yoki giyohvand modda bugun iste'mol qilmagan.
- Hamroh belgilar: yo'tal yo'q, qonli balg'am yo'q, qorin og'rig'i yo'q, bo'yin va umurtqa og'rig'i yo'q, oyoq-qo'llarda kuchsizlik yo'q.
- Oxirgi ovqat 4 soat oldin.
- Tekshiruvda: chap ko'krak qafasi yarmi harakatlanmaydi, nafas tovushi chapda eshitilmaydi, perkussiyada timpanit, traxeya o'ngga siljigan, bo'yin venalari bo'rtgan, teri ostida emfizema (qovurg'alar atrofi).
```

**To'g'ri javob/tashxis:**
```
Yakuniy tashxis: chap tomonlama taranglashuvchi pnevmotoraks (travmatik, ehtimol qovurg'a sinishi bilan), obstruktiv shok boshlanishi. Klinik tashxis — rentgen kutilmaydi.

Tashxis belgilari: nafas qisilishi, taxikardiya, gipotenziya, SpO2 pasayishi, bir tomonlama nafas tovushi yo'qligi, perkussiyada timpanit, traxeya siljishi (kech belgi), bo'yin venalarining bo'rtishi, teri ostida emfizema.

Differensial tashxis: katta gemotoraks, yurak tamponadasi, ochiq pnevmotoraks, o'pka kontuziyasi, flail chest, diafragma yirtilishi, miokard kontuziyasi, spontan pnevmotoraks.

Qadamlar (ATLS prinsipi, birinchi navbatda hayotga xavf soluvchi holatni bartaraf etish):
1. Ishchi tashxis va tezkor baholash: ABCDE yondashuvi, jarrohlik jamoasini chaqirish, bo'yin umurtqasini himoya qilish (travma), kislorod 15 l/daq (niqob bilan zahira xaltasi), monitoring, ikkita yirik vena kateteri.
2. Taranglashuvchi pnevmotoraks klinik tashxis qo'yilgach DARHOL igna dekompressiyasi (rentgen yoki KT ni kutmaslik): kamida 14G, kattalarda 8 sm uzun igna, nuqta — beshinchi qovurg'alararo bo'shliq old qo'ltiq chizig'ida (ATLS 10) yoki ikkinchi qovurg'alararo bo'shliq o'rta o'mrov chizig'ida; igna qovurg'aning yuqori chetidan o'tkaziladi (tomir-nerv dastasini jarohatlamaslik). Havo chiqishi eshitiladi, bemorning holati yaxshilanadi.
3. Keyingi aniq davolash: ko'krak qafasi drenaji (torakostomiya) — beshinchi qovurg'alararo bo'shliq, old va o'rta qo'ltiq chiziqlar orasida, 28-32 Fr naycha (gemopnevmotoraks bo'lsa katta), suv ostidagi to'siqli tizimga ulash. Tekshirish: havo pufakchalari, nafas harakati.
4. Qayta baholash: SpO2, nafas tovushi, qon bosimi. Igna dekompressiyasi muvaffaqiyatsiz bo'lsa (igna egilishi, qalin ko'krak devori) takroriy dekompressiya yoki darhol drenaj. Dekompressiyadan keyin ham yomonlashsa — katta gemotoraks yoki bronx yirtilishini o'ylash.
5. Musbat bosimli ventilyatsiya (intubatsiya) boshlanishidan oldin dekompressiya/drenaj shart, aks holda holat keskin yomonlashadi.
6. Qo'shimcha tekshiruv: e-FAST (suyuqlik, yurak tamponadasi, pnevmotoraks), ko'krak qafasi rentgeni (drenajdan keyin joylashuvni tekshirish), KT (gemodinamika barqaror bo'lsa), qon guruhi va moslashuvchanlik, umumiy qon tahlili, qon gazi, EKG. Boshqa jarohatlar: qovurg'alar sinishi, o'pka kontuziyasi, qorin va umurtqa.
7. Suyuqlik: shok belgilarida ehtiyotkorlik bilan; gemotoraks bo'lsa qon yo'qotishni to'ldirish.
8. Og'riqsizlantirish (qovurg'a sinishi): multimodal — paratsetamol, NSAID (kontrendikatsiya yo'q bo'lsa), opioid; regional blokada (erektor spinae yoki intercostal); chuqur nafas va yo'talni rag'batlantirish (spirometr).
9. Yotqizish: reanimatsiya yoki travma bo'limi; drenaj havo oqmasa 24-48 soatdan keyin olib tashlanadi (rentgen nazorati). Uchishdan va g'avvoslikdan saqlanish (6 hafta).

Tez-tez uchraydigan xatolar: rentgenni kutib vaqt yo'qotish; igna dekompressiyasini kechiktirish; dekompressiyasiz musbat bosimli ventilyatsiya; noto'g'ri joy yoki qisqa igna; dekompressiyadan keyin drenaj qo'ymaslik; boshqa jarohatlarni (gemotoraks, tamponada, umurtqa) baholamaslik; og'riqsizlantirmaslik.
```

---

## 15. O'tkir yurak yetishmovchiligi (o'pka shishi)

**Mavzu:** O'tkir yurak yetishmovchiligi (kardiogen o'pka shishi)
**Qiyinlik:** Medium

**Bemor shikoyati:**
```
Doktor, tunda soat ikkida to'satdan bo'g'ilib uyg'onib ketdim, havo yetmadi. Yotib bo'lmaydi, deraza oldiga chiqib o'tirib nafas olyapman. Yo'talaman, pushti rangli ko'pikli balg'am ajralyapti. Bir haftadan beri oyoqlarim shishgan, kechqurunlari ko'proq, bir necha kundan beri yostiqni ikkitaga ko'tarib yotardim. Ko'krak qafasi og'riyapti emas, lekin siqilganday. Terim sovuq, ter bosgan, yurak tez uryapti, juda qo'rqyapman.

So'ralganda aytiladigan anamnez:
- Yosh va jins: 70 yoshli erkak, nafaqada.
- Yurak kasalliklari: 5 yil oldin miokard infarkti o'tkazgan (stent qo'yilgan), keyin surunkali yurak yetishmovchiligi (chap qorincha chiqarish fraksiyasi taxminan 30%). Arterial gipertenziya.
- Sabab (provokator): bir haftadan beri tuzli va qovurilgan ovqat, tuzlangan mahsulot ko'p; furosemidni 4 kundan beri ichmagan (dori tugab qolgan); kechqurun ko'p suyuqlik (choy, sho'rva) ichgan. Ko'krak og'rig'i yo'q, isitma yo'q (infeksiya belgisi yo'q). Yurak urishi tartibsizligini sezmaydi, lekin ba'zan "to'xtab qoladi".
- Doimiy dorilar: furosemid 40 mg ertalab, karvedilol 12.5 mg ikki marta, enalapril 10 mg ikki marta, aspirin 75 mg, atorvastatin 40 mg. Spironolakton ichmaydi, NSAID ichmagan.
- Boshqa kasalliklar: qandli diabet yo'q, buyrak yetishmovchiligi yengil (kreatinin 120 atrofida), XOBL yo'q.
- Allergiya: yo'q.
- Odatlar: oldin chekkan (10 yil oldin tashlagan), spirtli ichimlikni kam ichadi.
- Hamroh belgilar: isitma yo'q, bosh aylanishi bor, hushni yo'qotish yo'q, qorin shishi va og'irlik bor (qon dimlanishi), siydik kam.
- Vazn: 1 haftada 4 kg ortgan.
- Tekshiruvda: o'tirib bo'g'iladi, tashqi ko'rinishi oqarib, sovuq ter, ikkala o'pkada nam xirillash (pastdan yuqoriga qarab), III yurak toni, bo'yin venalari bo'rtgan, boldirlarda botuvchi shish.
```

**To'g'ri javob/tashxis:**
```
Yakuniy tashxis: surunkali yurak yetishmovchiligi (ishemik kardiomiopatiya, chiqarish fraksiyasi taxminan 30%) fonida o'tkir dekompensatsiya, kardiogen o'pka shishi. Provokatorlar: diuretikni to'xtatish, tuz va suyuqlikni ko'p iste'mol qilish; bundan tashqari o'tkir koronar sindrom, aritmiya (bo'lmachalar fibrillyatsiyasi), infeksiya, noadekvat gipertenziya inkor etilishi kerak.

Differensial tashxis: o'tkir koronar sindrom, o'pka arteriyasi tromboemboliyasi, pnevmoniya, XOBL yoki astma zo'rayishi, nokardiogen o'pka shishi (ARDS), buyrak yetishmovchiligi sababli suyuqlik ortiqchaligi, aritmiya (taxiaritmiya), klapan kasalligi, perikard tamponadasi.

Qadamlar:
1. ABCDE, bemorni o'tirgan (yarim o'tirgan) holatda tutish, oyoqlarni tushirish (venoz qaytishni kamaytirish).
2. Kislorod: SpO2 90% dan past bo'lsa (bu bemorda 86%) — kislorod maqsad 94-98%; yuqori oqimli niqob. Nafas ishi kuchli, SpO2 past bo'lsa noinvaziv ventilyatsiya (CPAP 5-10 sm suv ust. yoki BiPAP) erta boshlanadi; intubatsiya CPAP muvaffaqiyatsiz bo'lsa.
3. Monitoring (EKG, SpO2, bosim), vena yo'li, siydik kateteri (diurezni o'lchash).
4. Loop diuretik vena ichiga: furosemid 40-80 mg bolus (surunkali ichgan bemorda kunlik og'iz dozasining 1-2.5 baravari); diurez soatiga 100-150 ml dan kam bo'lsa 1-2 soatdan keyin dozani ikki barobarga oshirish yoki infuziya. Diurezni va elektrolitlarni (kaliy, natriy), kreatininni kuzatish.
5. Vazodilatator (nitrat): bosim yetarli bo'lsa (sistolik 110 mm sim.ust. dan yuqori) — nitroglitserin til ostida 0.4 mg yoki vena ichiga 10-20 mkg/daq (bosimga qarab oshirish). Bu bemorda bosim 160/100 — nitrat ko'rsatilgan. Gipotenziyada (sistolik bosim 90 dan past) nitrat berilmaydi. Morfin muntazam tavsiya etilmaydi (nafas depressiyasi, yomon natija).
6. Tahlillar va tekshiruvlar: EKG (ishemiya, aritmiya), troponin, BNP yoki NT-proBNP, umumiy qon tahlili, elektrolitlar, kreatinin, glyukoza, jigar fermentlari, qon gazi, laktat; ko'krak qafasi rentgeni (o'pka shishi, kardiomegaliya, plevral suyuqlik); ekokardiografiya (chap qorincha funksiyasi, klapan, mexanik asoratlar); o'tkir koronar sindromga shubha bo'lsa kardiolog va angiografiya.
7. Provokatorni davolash: aritmiya (taxiaritmiya) bo'lsa ritm yoki urish tezligini nazorat qilish, ischemiya bo'lsa reperfuziya, infeksiya bo'lsa antibiotik, bosim nazorati.
8. Qiyin holatlar: kardiogen shok (gipotenziya, sovuq akrolar, oliguriya) — inotroplar (dobutamin) va vazopressorlar (norepinefrin), reanimatsiya, mexanik yurak qo'llab-quvvatlash.
9. Barqarorlashgandan keyin: surunkali davolash qayta ishga tushiriladi — beta-bloker (kardiogen shok bo'lmasa davom ettirish), ACE ingibitori yoki ARNI, mineralokortikoid retseptor antagonisti (spironolakton), SGLT2 ingibitori; kunlik tortish, tuz (3-5 g gacha) va suyuqlik cheklovi, kardiolog nazorati, ICD/CRT ko'rsatmalarini baholash (chiqarish fraksiyasi 35% dan past), kardioreabilitatsiya.
10. Chiqarishdan oldin: "quruq vazn"ga yetish, dori bilan ta'minlash, ta'lim (vazn 2 kg/3 kun ortsa shifokorga murojaat), 7 kun ichida nazorat.

Tez-tez uchraydigan xatolar: bemorni yotqizish; kislorod/CPAP ni kechiktirish; diuretikni yetarli dozada bermaslik; bosim past bo'lganda nitrat berish; morfinni muntazam berish; provokator (ishemiya, aritmiya, infeksiya) ni qidirmaslik; barqarorlashgach surunkali davolashni qayta boshlamaslik; tuz va suyuqlikni cheklashni tushuntirmaslik.
```

---

## Sinash tartibi

1. Avval bitta case'ni to'liq (shikoyat va tashxis bilan) yarating va natijani tekshiring.
2. Keyin xuddi shu mavzuni faqat **Mavzu + Qiyinlik** bilan yarating va AI shikoyat/tashxisni o'zi to'g'ri tanlayotganini solishtiring.
3. Natijada quyidagilarni tekshiring:
   - Uch tilda (uz/ru/en) sarlavha va shikoyat to'liq bormi.
   - Yosh, jins, vitallar mantiqiy bormi (SpO2 ≤ 100, puls 20-250).
   - Tashxis va kutilgan javob kiritilgan ma'lumotga mos bormi, anamnezdagi detallar scenario'ga o'tganmi.
   - **Qiyinlik** tanlangan darajaga mos bormi.
4. Natijalar yaxshi bo'lmasa, `AI_PROMPTS.md` dagi `case_generation` promptini qo'llang va qayta sinang.
