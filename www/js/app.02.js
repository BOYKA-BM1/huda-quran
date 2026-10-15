/* هُدى القرآن — الجزء 2 من 5 (أسطر 2053–6090 من الملف الأصلي) */
// ════════════════════════════════════════════════
// GREGORIAN + HIJRI DATES
// ════════════════════════════════════════════════
const HIJRI_MONTHS=['محرم','صفر','ربيع الأول','ربيع الثاني','جمادى الأولى','جمادى الآخرة','رجب','شعبان','رمضان','شوال','ذو القعدة','ذو الحجة'];
const GREG_DAYS=['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
const GREG_MONTHS=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

function toArabicNum(n){return String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);}

function gregToHijri(gy,gm,gd){
  // خوارزمية صحيحة — Julian Day Number
  let y=gy, m=gm;
  if(m<=2){y--;m+=12;}
  const A=Math.floor(y/100);
  const B=2-A+Math.floor(A/4);
  const JD=Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+gd+B-1524;
  // تحويل لهجري
  let l=JD-1948440+10632;
  const n=Math.floor((l-1)/10631);
  l=l-10631*n+354;
  const j=(Math.floor((10985-l)/5316))*(Math.floor((50*l)/17719))+(Math.floor(l/5670))*(Math.floor((43*l)/15238));
  l=l-(Math.floor((30-j)/15))*(Math.floor((17719*j)/50))-(Math.floor(j/16))*(Math.floor((15238*j)/43))+29;
  const hm=Math.floor((24*l)/709);
  const hd=l-Math.floor((709*hm)/24);
  const hy=30*n+j-30;
  return{y:hy,m:hm,d:hd};
}

function updateDates(){
  const now=new Date();
  // Gregorian
  const gd=`${GREG_DAYS[now.getDay()]}، ${toArabicNum(now.getDate())} ${GREG_MONTHS[now.getMonth()]} ${toArabicNum(now.getFullYear())}`;
  document.getElementById('greg-date').textContent=`${toArabicNum(now.getDate())} ${GREG_MONTHS[now.getMonth()]}`;
  document.getElementById('greg-day').textContent=`${GREG_DAYS[now.getDay()]} ${toArabicNum(now.getFullYear())}م`;
  // Hijri
  const h=gregToHijri(now.getFullYear(),now.getMonth()+1,now.getDate());
  document.getElementById('hijri-date').textContent=`${toArabicNum(h.d)} ${HIJRI_MONTHS[h.m-1]}`;
  document.getElementById('hijri-month-ar').textContent=`${toArabicNum(h.y)} هـ`;
  // Clock
  const hh=now.getHours(),mm=now.getMinutes(),ss=now.getSeconds();
  const ampm=hh>=12?'مساءً':'صباحاً';
  const hh12=hh%12||12;
  document.getElementById('current-time').textContent=`${hh12.toString().padStart(2,'0')}:${mm.toString().padStart(2,'0')}:${ss.toString().padStart(2,'0')}`;
  document.getElementById('current-ampm').textContent=ampm;
}

// ════════════════════════════════════════════════
// COMPREHENSIVE LOCAL ISLAMIC Q&A ENGINE
// ════════════════════════════════════════════════
const ISLAMIC_QA=[
// ── أركان الإسلام ──
{keys:['أركان الإسلام','اركان الاسلام','أركان','الأركان الخمسة','الإسلام كم ركن'],
ans:`<h3 style="color:var(--gold);font-family:'Scheherazade New',serif;font-size:1.4rem;margin-bottom:1rem">أركان الإسلام الخمسة</h3>
<p>قال النبي ﷺ: <span class="ai-hadith">«بُنيَ الإسلامُ على خمسٍ»</span> — متفق عليه</p>
<div class="ai-pillar"><span class="ai-num">١</span><div><strong>الشهادتان:</strong> شهادة أن لا إله إلا الله وأن محمداً رسول الله — وهي أساس الدين</div></div>
<div class="ai-pillar"><span class="ai-num">٢</span><div><strong>إقامة الصلاة:</strong> خمس صلوات في اليوم والليلة، فرضت ليلة الإسراء والمعراج</div></div>
<div class="ai-pillar"><span class="ai-num">٣</span><div><strong>إيتاء الزكاة:</strong> إخراج جزء من المال للفقراء والمساكين وسهم الله</div></div>
<div class="ai-pillar"><span class="ai-num">٤</span><div><strong>صوم رمضان:</strong> الإمساك عن المفطرات من الفجر إلى المغرب طوال شهر رمضان</div></div>
<div class="ai-pillar"><span class="ai-num">٥</span><div><strong>حج البيت:</strong> قصد مكة المكرمة لمن استطاع إليه سبيلاً — مرة في العمر</div></div>
<div class="ai-ayah">﴿ إِنَّ الدِّينَ عِندَ اللَّهِ الْإِسْلَامُ ﴾<span class="ai-ref">آل عمران: ١٩</span></div>`},

// ── أركان الإيمان ──
{keys:['أركان الإيمان','اركان الايمان','الإيمان كم ركن','ما هو الإيمان'],
ans:`<h3 style="color:var(--gold);font-family:'Scheherazade New',serif;font-size:1.4rem;margin-bottom:1rem">أركان الإيمان الستة</h3>
<p>قال الله تعالى: <div class="ai-ayah">﴿ آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ ﴾<span class="ai-ref">البقرة: ٢٨٥</span></div></p>
<div class="ai-pillar"><span class="ai-num">١</span><div><strong>الإيمان بالله:</strong> الإيمان بوجوده وأسمائه وصفاته ووحدانيته في الربوبية والإلهية</div></div>
<div class="ai-pillar"><span class="ai-num">٢</span><div><strong>الإيمان بالملائكة:</strong> الملائكة مخلوقون من نور، لا يعصون الله ما أمرهم</div></div>
<div class="ai-pillar"><span class="ai-num">٣</span><div><strong>الإيمان بالكتب:</strong> التوراة والإنجيل والزبور والقرآن الكريم وسائر الصحف</div></div>
<div class="ai-pillar"><span class="ai-num">٤</span><div><strong>الإيمان بالرسل:</strong> من آدم عليه السلام إلى محمد ﷺ خاتم النبيين</div></div>
<div class="ai-pillar"><span class="ai-num">٥</span><div><strong>الإيمان باليوم الآخر:</strong> البعث والنشور والحساب والجنة والنار</div></div>
<div class="ai-pillar"><span class="ai-num">٦</span><div><strong>الإيمان بالقدر:</strong> الإيمان بأن كل شيء بعلم الله وقضائه وقدره</div></div>`},

// ── الصلاة ──
{keys:['الصلاة','فضل الصلاة','أوقات الصلاة','كيف تصلي','فرائض الصلاة','الصلوات الخمس'],
ans:`<h3 style="color:var(--gold);font-family:'Scheherazade New',serif;font-size:1.4rem;margin-bottom:1rem">🙏 الصلاة — عمود الدين</h3>
<div class="ai-ayah">﴿ إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا ﴾<span class="ai-ref">النساء: ١٠٣</span></div>
<p>الصلوات الخمس المفروضة وأوقاتها:</p>
<div class="ai-pillar"><span class="ai-num">١</span><div><strong>الفجر (ركعتان):</strong> من طلوع الفجر الصادق حتى طلوع الشمس</div></div>
<div class="ai-pillar"><span class="ai-num">٢</span><div><strong>الظهر (٤ ركعات):</strong> من زوال الشمس حتى يصير ظل كل شيء مثله</div></div>
<div class="ai-pillar"><span class="ai-num">٣</span><div><strong>العصر (٤ ركعات):</strong> من انتهاء وقت الظهر حتى غروب الشمس</div></div>
<div class="ai-pillar"><span class="ai-num">٤</span><div><strong>المغرب (٣ ركعات):</strong> من غروب الشمس حتى مغيب الشفق الأحمر</div></div>
<div class="ai-pillar"><span class="ai-num">٥</span><div><strong>العشاء (٤ ركعات):</strong> من مغيب الشفق الأحمر حتى طلوع الفجر</div></div>
<p class="ai-hadith-box">قال النبي ﷺ: «الصلاة عماد الدين، من أقامها فقد أقام الدين، ومن تركها فقد هدم الدين» — البيهقي</p>`},

// ── الصيام ──
{keys:['الصيام','الصوم','رمضان','فضل الصيام','فضل رمضان','شهر رمضان'],
ans:`<h3 style="color:var(--gold);font-family:'Scheherazade New',serif;font-size:1.4rem;margin-bottom:1rem">🌙 الصيام — ركن عظيم</h3>
<div class="ai-ayah">﴿ يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ ﴾<span class="ai-ref">البقرة: ١٨٣</span></div>
<div class="ai-ayah">﴿ شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِّلنَّاسِ وَبَيِّنَاتٍ مِّنَ الْهُدَىٰ وَالْفُرْقَانِ ﴾<span class="ai-ref">البقرة: ١٨٥</span></div>
<p class="ai-hadith-box">قال النبي ﷺ: «من صام رمضان إيماناً واحتساباً غُفر له ما تقدم من ذنبه» — متفق عليه</p>
<p>فضائل الصيام: تكفير الذنوب، باب الريان في الجنة، الشفاعة للصائم، والصوم يضاعف ثوابه بلا حساب.</p>`},

// ── الزكاة ──
{keys:['الزكاة','زكاة المال','فضل الزكاة','نصاب الزكاة','مصارف الزكاة'],
ans:`<h3 style="color:var(--gold);font-family:'Scheherazade New',serif;font-size:1.4rem;margin-bottom:1rem">💰 الزكاة — طهارة المال</h3>
<div class="ai-ayah">﴿ خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا ﴾<span class="ai-ref">التوبة: ١٠٣</span></div>
<p>مصارف الزكاة الثمانية:</p>
<div class="ai-ayah">﴿ إِنَّمَا الصَّدَقَاتُ لِلْفُقَرَاءِ وَالْمَسَاكِينِ وَالْعَامِلِينَ عَلَيْهَا وَالْمُؤَلَّفَةِ قُلُوبُهُمْ وَفِي الرِّقَابِ وَالْغَارِمِينَ وَفِي سَبِيلِ اللَّهِ وَابْنِ السَّبِيلِ ﴾<span class="ai-ref">التوبة: ٦٠</span></div>
<p><strong>نصاب زكاة الذهب:</strong> ٨٥ جراماً — نصاب الفضة: ٥٩٥ جراماً — المقدار: ٢.٥٪ — الحول: سنة هجرية كاملة.</p>`},

// ── الحج ──
{keys:['الحج','فريضة الحج','مناسك الحج','العمرة','مكة المكرمة','الكعبة'],
ans:`<h3 style="color:var(--gold);font-family:'Scheherazade New',serif;font-size:1.4rem;margin-bottom:1rem">🕋 الحج — ركن الإسلام الخامس</h3>
<div class="ai-ayah">﴿ وَلِلَّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ مَنِ اسْتَطَاعَ إِلَيْهِ سَبِيلًا ﴾<span class="ai-ref">آل عمران: ٩٧</span></div>
<p>مناسك الحج الكبرى: الإحرام من الميقات، الطواف بالكعبة، السعي بين الصفا والمروة، الوقوف بعرفة يوم التاسع من ذي الحجة، المبيت بمزدلفة، رمي الجمرات، الحلق أو التقصير، طواف الإفاضة.</p>
<p class="ai-hadith-box">قال النبي ﷺ: «من حج فلم يرفث ولم يفسق رجع كيوم ولدته أمه» — متفق عليه</p>`},

// ── الجنة ──
{keys:['الجنة','آيات الجنة','وصف الجنة','نعيم الجنة','ما في الجنة','جنة الفردوس'],
ans:`<h3 style="color:var(--gold);font-family:'Scheherazade New',serif;font-size:1.4rem;margin-bottom:1rem">🌿 الجنة — دار الخلد والنعيم</h3>
<div class="ai-ayah">﴿ وَبَشِّرِ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ أَنَّ لَهُمْ جَنَّاتٍ تَجْرِي مِن تَحْتِهَا الْأَنْهَارُ ﴾<span class="ai-ref">البقرة: ٢٥</span></div>
<div class="ai-ayah">﴿ فِيهَا مَا تَشْتَهِيهِ الْأَنفُسُ وَتَلَذُّ الْأَعْيُنُ وَأَنتُمْ فِيهَا خَالِدُونَ ﴾<span class="ai-ref">الزخرف: ٧١</span></div>
<div class="ai-ayah">﴿ وَفِيهَا مَا تَشْتَهِيهِ الْأَنفُسُ وَتَلَذُّ الْأَعْيُنُ وَأَنتُمْ فِيهَا خَالِدُونَ ﴾<span class="ai-ref">الزخرف: ٧١</span></div>
<p class="ai-hadith-box">قال الله تعالى في الحديث القدسي: «أعددتُ لعبادي الصالحين ما لا عين رأت ولا أذن سمعت ولا خطر على قلب بشر» — متفق عليه</p>
<p>درجات الجنة: الفردوس الأعلى هي أعلى الجنة وأوسطها، وسقفها عرش الرحمن.</p>`},

// ── النار ──
{keys:['النار','جهنم','آيات النار','عذاب النار','أهل النار'],
ans:`<h3 style="color:var(--gold);font-family:'Scheherazade New',serif;font-size:1.4rem;margin-bottom:1rem">🔥 النار — نعوذ بالله منها</h3>
<div class="ai-ayah">﴿ وَاتَّقُوا النَّارَ الَّتِي أُعِدَّتْ لِلْكَافِرِينَ ﴾<span class="ai-ref">آل عمران: ١٣١</span></div>
<div class="ai-ayah">﴿ إِنَّ الَّذِينَ كَفَرُوا لَوْ أَنَّ لَهُمْ مَا فِي الْأَرْضِ جَمِيعًا وَمِثْلَهُ مَعَهُ لِيَفْتَدُوا بِهِ مِنْ عَذَابِ يَوْمِ الْقِيَامَةِ مَا تُقُبِّلَ مِنْهُمْ ﴾<span class="ai-ref">المائدة: ٣٦</span></div>
<p>طبقات النار السبع: جهنم، لظى، الحطمة، السعير، سقر، الجحيم، الهاوية. نعوذ بالله من النار.</p>
<p>دعاء النجاة: <span class="ai-hadith">«اللهم أجرنا من النار، اللهم إنا نعوذ بك من النار»</span></p>`},

// ── الصبر ──
{keys:['الصبر','آيات الصبر','فضل الصبر','اصبر','مع الصابرين'],
ans:`<h3 style="color:var(--gold);font-family:'Scheherazade New',serif;font-size:1.4rem;margin-bottom:1rem">⚖️ الصبر — نصف الإيمان</h3>
<div class="ai-ayah">﴿ يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ ﴾<span class="ai-ref">البقرة: ١٥٣</span></div>
<div class="ai-ayah">﴿ إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ ﴾<span class="ai-ref">الزمر: ١٠</span></div>
<div class="ai-ayah">﴿ وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِّنَ الْأَمْوَالِ وَالْأَنفُسِ وَالثَّمَرَاتِ ۗ وَبَشِّرِ الصَّابِرِينَ ﴾<span class="ai-ref">البقرة: ١٥٥</span></div>
<p class="ai-hadith-box">قال النبي ﷺ: «ما أُعطيَ أحدٌ عطاءً خيراً وأوسع من الصبر» — متفق عليه</p>`},

// ── التوكل ──
{keys:['التوكل','توكل على الله','آيات التوكل','حسبي الله','توكلت على الله'],
ans:`<h3 style="color:var(--gold);font-family:'Scheherazade New',serif;font-size:1.4rem;margin-bottom:1rem">🌟 التوكل على الله</h3>
<div class="ai-ayah">﴿ وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ﴾<span class="ai-ref">الطلاق: ٣</span></div>
<div class="ai-ayah">﴿ حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ ﴾<span class="ai-ref">آل عمران: ١٧٣</span></div>
<p class="ai-hadith-box">قال النبي ﷺ: «لو أنكم كنتم توكلون على الله حقَّ توكله لرزقكم كما يرزق الطير، تغدو خِماصاً وتروح بِطاناً» — الترمذي</p>`},

// ── الدعاء ──
{keys:['الدعاء','فضل الدعاء','آيات الدعاء','الله يستجيب','استجابة الدعاء','ادع ربك'],
ans:`<h3 style="color:var(--gold);font-family:'Scheherazade New',serif;font-size:1.4rem;margin-bottom:1rem">🤲 الدعاء — سلاح المؤمن</h3>
<div class="ai-ayah">﴿ وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ ﴾<span class="ai-ref">غافر: ٦٠</span></div>
<div class="ai-ayah">﴿ وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ ﴾<span class="ai-ref">البقرة: ١٨٦</span></div>
<p class="ai-hadith-box">قال النبي ﷺ: «الدعاء هو العبادة» — أبو داود والترمذي</p>
<p>أوقات إجابة الدعاء: ثلث الليل الأخير، بين الأذان والإقامة، في السجود، يوم الجمعة، عند الإفطار، في السفر.</p>`},

// ── التوبة ──
{keys:['التوبة','استغفار','أستغفر الله','فضل التوبة','يغفر الذنوب','رحمة الله'],
ans:`<h3 style="color:var(--gold);font-family:'Scheherazade New',serif;font-size:1.4rem;margin-bottom:1rem">💚 التوبة — باب الرحمة المفتوح</h3>
<div class="ai-ayah">﴿ قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا ﴾<span class="ai-ref">الزمر: ٥٣</span></div>
<div class="ai-ayah">﴿ وَتُوبُوا إِلَى اللَّهِ جَمِيعًا أَيُّهَ الْمُؤْمِنُونَ لَعَلَّكُمْ تُفْلِحُونَ ﴾<span class="ai-ref">النور: ٣١</span></div>
<p class="ai-hadith-box">قال النبي ﷺ: «إن الله يبسط يده بالليل ليتوب مسيء النهار، ويبسط يده بالنهار ليتوب مسيء الليل» — مسلم</p>`},

// ── أسماء الله ──
{keys:['أسماء الله','أسماء الله الحسنى','٩٩ اسم','الأسماء الحسنى','اسماء الله'],
ans:`<h3 style="color:var(--gold);font-family:'Scheherazade New',serif;font-size:1.4rem;margin-bottom:1rem">✨ أسماء الله الحسنى</h3>
<div class="ai-ayah">﴿ وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا ﴾<span class="ai-ref">الأعراف: ١٨٠</span></div>
<p class="ai-hadith-box">قال النبي ﷺ: «إن لله تسعةً وتسعين اسماً، مئةً إلا واحداً، من أحصاها دخل الجنة» — متفق عليه</p>
<p>من أسمائه الحسنى: <strong>الله، الرحمن، الرحيم، الملك، القدوس، السلام، المؤمن، المهيمن، العزيز، الجبار، المتكبر، الخالق، البارئ، المصور، الغفار، القهار، الوهاب، الرزاق، الفتاح، العليم، القابض، الباسط، الحفيظ، المقيت، الحسيب، الجليل، الكريم، الرقيب، المجيب، الواسع، الحكيم، الودود، المجيد، الباعث، الشهيد، الحق، الوكيل، القوي، المتين، الولي، الحميد، المحصي، المبدئ، المعيد، المحيي، المميت، الحي، القيوم، الواجد، الماجد، الواحد، الصمد، القادر، المقتدر، المقدم، المؤخر، الأول، الآخر، الظاهر، الباطن، الوالي، المتعالي، البر، التواب، المنتقم، العفو، الرؤوف، مالك الملك، ذو الجلال والإكرام، المقسط، الجامع، الغني، المغني، المانع، الضار، النافع، النور، الهادي، البديع، الباقي، الوارث، الرشيد، الصبور</strong></p>`},

// ── الإسراء والمعراج ──
{keys:['الإسراء','المعراج','إسراء','معراج','ليلة الإسراء'],
ans:`<h3 style="color:var(--gold);font-family:'Scheherazade New',serif;font-size:1.4rem;margin-bottom:1rem">🌙 الإسراء والمعراج</h3>
<div class="ai-ayah">﴿ سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ لَيْلًا مِّنَ الْمَسْجِدِ الْحَرَامِ إِلَى الْمَسْجِدِ الْأَقْصَى الَّذِي بَارَكْنَا حَوْلَهُ ﴾<span class="ai-ref">الإسراء: ١</span></div>
<p>أُسري بالنبي ﷺ ليلاً من المسجد الحرام إلى المسجد الأقصى (الإسراء)، ثم عُرج به إلى السماوات العلا (المعراج). رأى الأنبياء وصلى بهم إماماً. وصل إلى سدرة المنتهى. فُرضت الصلاة خمسين ثم خُففت إلى خمس.</p>`},

// ── القرآن الكريم ──
{keys:['القرآن','فضل القرآن','قراءة القرآن','تلاوة القرآن','حفظ القرآن'],
ans:`<h3 style="color:var(--gold);font-family:'Scheherazade New',serif;font-size:1.4rem;margin-bottom:1rem">📖 القرآن الكريم — كلام الله</h3>
<div class="ai-ayah">﴿ إِنَّ هَٰذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ ﴾<span class="ai-ref">الإسراء: ٩</span></div>
<div class="ai-ayah">﴿ وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ ﴾<span class="ai-ref">القمر: ١٧</span></div>
<p class="ai-hadith-box">قال النبي ﷺ: «اقرؤوا القرآن فإنه يأتي يوم القيامة شفيعاً لأصحابه» — مسلم</p>
<p class="ai-hadith-box">«الذي يقرأ القرآن وهو ماهر به مع السفرة الكرام البررة، والذي يقرأ القرآن ويتتعتع فيه وهو عليه شاق له أجران» — متفق عليه</p>`},

// ── ليلة القدر ──
{keys:['ليلة القدر','القدر','العشر الأواخر','خير من ألف شهر'],
ans:`<h3 style="color:var(--gold);font-family:'Scheherazade New',serif;font-size:1.4rem;margin-bottom:1rem">✨ ليلة القدر</h3>
<div class="ai-ayah">﴿ إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ ﴿١﴾ وَمَا أَدْرَاكَ مَا لَيْلَةُ الْقَدْرِ ﴿٢﴾ لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ ﴿٣﴾ تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ ﴿٤﴾ سَلَامٌ هِيَ حَتَّىٰ مَطْلَعِ الْفَجْرِ ﴾<span class="ai-ref">سورة القدر</span></div>
<p>ليلة القدر في العشر الأواخر من رمضان، وأرجحها الأوتار: ٢١، ٢٣، ٢٥، ٢٧، ٢٩. الدعاء المأثور: <span class="ai-hadith">«اللهم إنك عفوٌ تحب العفو فاعفُ عني»</span></p>`},

// ── الرسول ﷺ ──
{keys:['النبي محمد','الرسول','نبينا','سيدنا محمد','محمد ﷺ','سيرة النبي','سيرة الرسول'],
ans:`<h3 style="color:var(--gold);font-family:'Scheherazade New',serif;font-size:1.4rem;margin-bottom:1rem">🌟 سيدنا محمد ﷺ خاتم النبيين</h3>
<div class="ai-ayah">﴿ وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ ﴾<span class="ai-ref">الأنبياء: ١٠٧</span></div>
<div class="ai-ayah">﴿ لَقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ ﴾<span class="ai-ref">الأحزاب: ٢١</span></div>
<p><strong>ولادته:</strong> ١٢ ربيع الأول عام الفيل (٥٧٠م) في مكة المكرمة. <strong>أبوه:</strong> عبدالله بن عبد المطلب. <strong>أمه:</strong> آمنة بنت وهب. <strong>البعثة:</strong> في الأربعين من عمره بغار حراء. <strong>الهجرة:</strong> إلى المدينة المنورة عام ٦٢٢م. <strong>وفاته:</strong> ١٢ ربيع الأول سنة ١١هـ.</p>
<p class="ai-hadith-box">«إنما بُعثتُ لأتمم مكارم الأخلاق» — البيهقي</p>`},

// ── البسملة ──
{keys:['بسم الله','البسملة','بسم الله الرحمن الرحيم'],
ans:`<h3 style="color:var(--gold);font-family:'Scheherazade New',serif;font-size:1.8rem;margin-bottom:1rem;text-align:center">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</h3>
<p>البسملة هي أول ما أُنزل من القرآن الكريم في بعض الأقوال، وهي مفتاح كل أمر ذي بال. تبدأ بها ١١٤ سورة إلا سورة التوبة. وتُعدّ آية مستقلة في الفاتحة عند الشافعية.</p>
<div class="ai-ayah">﴿ الرَّحْمَٰنُ عَلَّمَ الْقُرْآنَ ﴾<span class="ai-ref">الرحمن: ١-٢</span></div>
<p class="ai-hadith-box">قال النبي ﷺ: «كل أمر ذي بال لا يُبدأ فيه بـ بسم الله فهو أجذم» — أبو داود</p>`},

// ── الفاتحة ──
{keys:['الفاتحة','سورة الفاتحة','أم الكتاب','أم القرآن','السبع المثاني'],
ans:`<h3 style="color:var(--gold);font-family:'Scheherazade New',serif;font-size:1.4rem;margin-bottom:1rem">📖 سورة الفاتحة — أم القرآن</h3>
<div class="ai-ayah" style="font-size:1.1rem;line-height:2.2">﴿ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾ الرَّحْمَٰنِ الرَّحِيمِ ﴿٣﴾ مَالِكِ يَوْمِ الدِّينِ ﴿٤﴾ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٥﴾ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ﴿٦﴾ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ﴿٧﴾ ﴾<span class="ai-ref">سورة الفاتحة</span></div>
<p class="ai-hadith-box">قال النبي ﷺ: «لا صلاة لمن لم يقرأ بفاتحة الكتاب» — متفق عليه</p>`},

// ── آية الكرسي ──
{keys:['آية الكرسي','الكرسي','اعظم آية','أعظم آية في القرآن'],
ans:`<h3 style="color:var(--gold);font-family:'Scheherazade New',serif;font-size:1.4rem;margin-bottom:1rem">👑 آية الكرسي — أعظم آية</h3>
<div class="ai-ayah" style="font-size:1rem;line-height:2.2">﴿ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ ﴾<span class="ai-ref">البقرة: ٢٥٥</span></div>
<p class="ai-hadith-box">قال النبي ﷺ: «من قرأ آية الكرسي دُبُر كل صلاة مكتوبة لم يمنعه من دخول الجنة إلا أن يموت» — النسائي</p>`},

// ── الصدقة ──
{keys:['الصدقة','صدقة','فضل الصدقة','تصدق','صدقة جارية'],
ans:`<h3 style="color:var(--gold);font-family:'Scheherazade New',serif;font-size:1.4rem;margin-bottom:1rem">🤝 الصدقة — خير ما أنفق</h3>
<div class="ai-ayah">﴿ مَثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنبُلَةٍ مِّائَةُ حَبَّةٍ ﴾<span class="ai-ref">البقرة: ٢٦١</span></div>
<p class="ai-hadith-box">«إذا مات الإنسان انقطع عنه عمله إلا من ثلاثة: إلا من صدقة جارية، أو علم ينتفع به، أو ولد صالح يدعو له» — مسلم</p>`},

// ── الإخلاص ──
{keys:['سورة الإخلاص','قل هو الله أحد','الإخلاص','توحيد'],
ans:`<h3 style="color:var(--gold);font-family:'Scheherazade New',serif;font-size:1.4rem;margin-bottom:1rem">سورة الإخلاص — تعدل ثلث القرآن</h3>
<div class="ai-ayah" style="font-size:1.2rem;line-height:2.4">﴿ قُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ ﴿٤﴾ ﴾<span class="ai-ref">سورة الإخلاص</span></div>
<p class="ai-hadith-box">قال النبي ﷺ: «أيعجز أحدكم أن يقرأ في ليلة ثلث القرآن؟ قالوا: وكيف يقرأ ثلث القرآن؟ قال: قل هو الله أحد تعدل ثلث القرآن» — مسلم</p>`},

// ── ذو القرنين ──
{keys:['ذو القرنين','ذو القرنين','من هو ذو القرنين'],
ans:`<h3 style="color:var(--gold);font-family:'Scheherazade New',serif;font-size:1.4rem;margin-bottom:1rem">🏔️ ذو القرنين</h3>
<div class="ai-ayah">﴿ وَيَسْأَلُونَكَ عَن ذِي الْقَرْنَيْنِ ۖ قُلْ سَأَتْلُو عَلَيْكُم مِّنْهُ ذِكْرًا ﴾<span class="ai-ref">الكهف: ٨٣</span></div>
<p>ذو القرنين ملك صالح مكّنه الله في الأرض وجعل له أسباباً. سلك ثلاثة مسالك: أتى المغرب فوجد الشمس تغرب في عين حمئة. ثم أتى المشرق. ثم بنى سداً من الحديد والنحاس بين يأجوج ومأجوج لحماية الشعوب منهم.</p>
<div class="ai-ayah">﴿ إِنَّا مَكَّنَّا لَهُ فِي الْأَرْضِ وَآتَيْنَاهُ مِن كُلِّ شَيْءٍ سَبَبًا ﴾<span class="ai-ref">الكهف: ٨٤</span></div>`},

// ── أصحاب الكهف ──
{keys:['أصحاب الكهف','الكهف','الفتية','لبثوا في الكهف'],
ans:`<h3 style="color:var(--gold);font-family:'Scheherazade New',serif;font-size:1.4rem;margin-bottom:1rem">🕌 أصحاب الكهف</h3>
<div class="ai-ayah">﴿ أَمْ حَسِبْتَ أَنَّ أَصْحَابَ الْكَهْفِ وَالرَّقِيمِ كَانُوا مِنْ آيَاتِنَا عَجَبًا ﴾<span class="ai-ref">الكهف: ٩</span></div>
<p>فتية آمنوا بالله وهربوا من ملك ظالم يُكره الناس على الشرك. لجأوا إلى كهف فأنامهم الله ٣٠٩ سنين. استيقظوا وبُعث أحدهم بوَرِقه يشتري طعاماً فاكتشفوا طول غيابهم. جعلهم الله آية ودليلاً على البعث.</p>`},

// ── يأجوج ومأجوج ──
{keys:['يأجوج','مأجوج','يأجوج ومأجوج','أشراط الساعة'],
ans:`<h3 style="color:var(--gold);font-family:'Scheherazade New',serif;font-size:1.4rem;margin-bottom:1rem">⚠️ يأجوج ومأجوج</h3>
<div class="ai-ayah">﴿ حَتَّىٰ إِذَا فُتِحَتْ يَأْجُوجُ وَمَأْجُوجُ وَهُم مِّن كُلِّ حَدَبٍ يَنسِلُونَ ﴾<span class="ai-ref">الأنبياء: ٩٦</span></div>
<p>يأجوج ومأجوج من أشراط الساعة الكبرى. خلف سد ذي القرنين. ينقرون السد كل يوم حتى يكادون يبصرون الضوء من ورائه. ويقولون: سنعود غداً فيتركه الله كما كان. يوم القيامة ييقول الله لهم: يا يأجوج ومأجوج فيأتون.</p>`}
];

// Smart search function
function doAISearch(q){
  clearTimeout(window.aiTimer);
  const res=document.getElementById('sres');
  if(!q.trim()){
    res.innerHTML=`<div style="text-align:center;padding:3rem;color:var(--tm)">
      <div style="font-size:3rem;margin-bottom:1rem">💬</div>
      <p>اكتب سؤالاً إسلامياً أو كلمة للبحث في القرآن الكريم</p>
    </div>`;
    return;
  }
  res.innerHTML='<div class="ldbox"><div class="spinner"></div>جارٍ البحث...</div>';
  window.aiTimer=setTimeout(()=>execSmartSearch(q),400);
}

function execSmartSearch(q){
  const res=document.getElementById('sres');
  const qNorm=q.trim().toLowerCase();

  // Try local Q&A first
  let bestMatch=null;
  let bestScore=0;
  for(const entry of ISLAMIC_QA){
    for(const key of entry.keys){
      const keyNorm=key.toLowerCase();
      if(qNorm.includes(keyNorm)||keyNorm.includes(qNorm)){
        const score=keyNorm.length;
        if(score>bestScore){bestScore=score;bestMatch=entry;}
      }
    }
    // Also check if 2+ words match
    const qWords=qNorm.split(/\s+/).filter(w=>w.length>2);
    for(const key of entry.keys){
      const keyNorm=key.toLowerCase();
      const matches=qWords.filter(w=>keyNorm.includes(w));
      if(matches.length>=1&&matches.length*4>bestScore){
        bestScore=matches.length*4;bestMatch=entry;
      }
    }
  }

  if(bestMatch){
    res.innerHTML=`
      <div class="ai-result">
        <div class="ai-header">
          <span class="ai-badge">📖 إجابة من القرآن والإسلام</span>
          <span class="ai-query">"${q}"</span>
        </div>
        <div class="ai-body">${bestMatch.ans}</div>
        <div class="ai-footer">
          <span>هل تريد بحثاً في الآيات؟</span>
          <button class="vbv-btn" onclick="execTextSearch(document.getElementById('si')?.value||'')">🔍 بحث نصي في القرآن</button>
        </div>
      </div>`;
  } else {
    // Fall through to Quran text search
    execTextSearch(q);
  }
}

async function execTextSearch(q){
  const res=document.getElementById('sres');
  res.innerHTML='<div class="ldbox"><div class="spinner"></div>جارٍ البحث في آيات القرآن الكريم...</div>';
  try{
    const r=await HudaQuran.fetch(`https://api.alquran.cloud/v1/search/${encodeURIComponent(q)}/all/ar`);
    const d=await r.json();
    const m=d.data?.matches;
    if(!m?.length){
      res.innerHTML=`<div class="ai-result"><div class="ai-body" style="text-align:center;padding:2rem">
        <div style="font-size:2rem;margin-bottom:1rem">🔍</div>
        <p style="color:var(--tm)">لم نجد نتائج لـ "<strong style="color:var(--gold)">${_escHtml(q)}</strong>"</p>
        <p style="color:var(--tm);font-size:.85rem;margin-top:.5rem">جرّب: الصبر، الجنة، الصلاة، الرحمن...</p>
      </div></div>`;
      return;
    }
    res.innerHTML=`<p style="color:var(--tm);font-size:.8rem;margin-bottom:1rem">🔍 نتائج القرآن الكريم: ${m.length} آية</p>`+
      m.slice(0,30).map(x=>{
        const hl=_escHtml(x.text).replace(new RegExp(_escRegex(_escHtml(q)),'g'),s=>`<span class="hl">${s}</span>`);
        const sn=SM[x.surah.number-1]?.ar||x.surah.name;
        return`<div class="sri" onclick="SP('quran');loadSurah(${x.surah.number})">
          <div class="srref">📌 سورة ${sn} — الآية ${x.numberInSurah}</div>
          <div class="srtxt">${hl}</div>
        </div>`;
      }).join('');
  }catch{
    res.innerHTML='<p style="text-align:center;color:var(--tm);padding:2rem">⚠ تعذّر الاتصال بالإنترنت. تحقق من اتصالك.</p>';
  }
}
const EG_GOVS=[
  {name:'القاهرة',lat:30.0444,lng:31.2357},
  {name:'الجيزة',lat:29.9871,lng:31.1726},
  {name:'الإسكندرية',lat:31.2001,lng:29.9187},
  {name:'الشرقية',lat:30.7487,lng:31.8767},
  {name:'الدقهلية',lat:30.9880,lng:31.4143},
  {name:'المنوفية',lat:30.4948,lng:30.9862},
  {name:'الغربية',lat:30.8667,lng:31.0333},
  {name:'كفر الشيخ',lat:31.1107,lng:30.9388},
  {name:'البحيرة',lat:30.3593,lng:30.3727},
  {name:'الإسماعيلية',lat:30.5965,lng:32.2715},
  {name:'السويس',lat:29.9737,lng:32.5270},
  {name:'بورسعيد',lat:31.2565,lng:32.2841},
  {name:'الفيوم',lat:29.3084,lng:30.8428},
  {name:'بني سويف',lat:29.0661,lng:31.0994},
  {name:'المنيا',lat:28.0871,lng:30.7618},
  {name:'أسيوط',lat:27.1809,lng:31.1837},
  {name:'سوهاج',lat:26.5590,lng:31.6948},
  {name:'قنا',lat:26.1551,lng:32.7160},
  {name:'الأقصر',lat:25.6872,lng:32.6396},
  {name:'أسوان',lat:24.0889,lng:32.8998},
  {name:'الوادي الجديد',lat:25.5000,lng:28.8333},
  {name:'مطروح',lat:31.3543,lng:27.2373},
  {name:'شمال سيناء',lat:30.2805,lng:33.6228},
  {name:'جنوب سيناء',lat:29.3100,lng:34.1500},
  {name:'البحر الأحمر',lat:26.7000,lng:33.8333},
  {name:'دمياط',lat:31.4165,lng:31.8133},
  {name:'قليوبية',lat:30.3287,lng:31.2137}
];

const WORLD_LOCS=[
  {name:'مكة المكرمة 🇸🇦',lat:21.3891,lng:39.8579},
  {name:'المدينة المنورة 🇸🇦',lat:24.5247,lng:39.5692},
  {name:'الرياض 🇸🇦',lat:24.7136,lng:46.6753},
  {name:'دبي 🇦🇪',lat:25.2048,lng:55.2708},
  {name:'الكويت 🇰🇼',lat:29.3759,lng:47.9774},
  {name:'بيروت 🇱🇧',lat:33.8938,lng:35.5018},
  {name:'عمّان 🇯🇴',lat:31.9454,lng:35.9284},
  {name:'بغداد 🇮🇶',lat:33.3152,lng:44.3661},
  {name:'دمشق 🇸🇾',lat:33.5138,lng:36.2765},
  {name:'تونس 🇹🇳',lat:36.8190,lng:10.1658},
  {name:'الجزائر 🇩🇿',lat:36.7372,lng:3.0869},
  {name:'المغرب 🇲🇦',lat:34.0209,lng:-6.8416},
  {name:'إسطنبول 🇹🇷',lat:41.0082,lng:28.9784},
  {name:'باكستان 🇵🇰',lat:33.7294,lng:73.0931},
  {name:'ماليزيا 🇲🇾',lat:3.1390,lng:101.6869},
  {name:'إندونيسيا 🇮🇩',lat:-6.2088,lng:106.8456},
  {name:'لندن 🇬🇧',lat:51.5074,lng:-0.1278},
  {name:'باريس 🇫🇷',lat:48.8566,lng:2.3522},
  {name:'نيويورك 🇺🇸',lat:40.7128,lng:-74.0060}
];

function buildLocSelector(){
  const egOpts=EG_GOVS.map(g=>`<option value="${g.lat},${g.lng}">🇪🇬 ${g.name}</option>`).join('');
  const wldOpts=WORLD_LOCS.map(g=>`<option value="${g.lat},${g.lng}">${g.name}</option>`).join('');
  const sel=document.getElementById('loc-select');
  if(sel){
    sel.innerHTML=`<option value="">— اختر موقع —</option>
    <optgroup label="محافظات مصر">${egOpts}</optgroup>
    <optgroup label="دول العالم">${wldOpts}</optgroup>`;
  }
}

function setLocFromSelect(val){
  if(!val)return;
  const [la,ln]=val.split(',').map(Number);
  userLat=la;userLng=ln;
  const allLocs=[...EG_GOVS,...WORLD_LOCS];
  const found=allLocs.find(g=>Math.abs(g.lat-la)<0.001&&Math.abs(g.lng-ln)<0.001);
  const locName=found?found.name:`${la.toFixed(2)}°, ${ln.toFixed(2)}°`;
  document.getElementById('loc-name').textContent=locName;
  // حفظ الموقع
  localStorage.setItem('saved_lat',la);
  localStorage.setItem('saved_lng',ln);
  localStorage.setItem('saved_loc_name',locName);
  calcPrayers();
}

// ════════════════════════════════════════════════
// AI SEARCH — Islamic Q&A with Claude API
// ════════════════════════════════════════════════
// PROPHETS
// ════════════════════════════════════════════════
function renderProphets(){
  const _pg=document.getElementById('pgrid');
  if(!_pg){setTimeout(renderProphets,200);return;}
  _pg.innerHTML=PD.map((p,i)=>`
    <div class="pc" onclick="openPM(${i})">
      <div class="pn">نبي ${toArabicNum(i+1)}</div>
      <div class="par">${p.ar}</div>
      <div class="pen">${p.en}</div>
      <div class="pbf">${p.brief}</div>
      <span class="ptag">${p.tag}</span>
    </div>`).join('');
}
function openPM(idx){
  const p=PD[idx];
  const infoHTML=p.info?`
    <div class="pmod-section">
      <h4>📌 معلومات سريعة</h4>
      <div class="pmod-info-grid">
        ${Object.entries(p.info).map(([k,v])=>`<div class="pmod-info-item"><strong>${k}</strong>${v}</div>`).join('')}
      </div>
    </div>`:''
  document.getElementById('pmod-body').innerHTML=`
    <div class="pmname">${p.ar}</div>
    <div class="pmen">${p.en}</div>
    <div style="text-align:center;margin-bottom:1.2rem"><span class="ptag">${p.tag}</span></div>
    <div class="hr"></div>
    ${infoHTML}
    <div class="story">${p.story}</div>`;
  document.getElementById('pmod').classList.add('on');
  document.body.style.overflow='hidden';
}
function closePM(){document.getElementById('pmod').classList.remove('on');document.body.style.overflow='';}


// ══ TASBEEHAT DATA ══
const TASBEEHAT=[
  {zikr:'سُبْحَانَ اللَّهِ',       target:33, short:'سبحان الله'},
  {zikr:'الْحَمْدُ لِلَّهِ',       target:33, short:'الحمد لله'},
  {zikr:'اللَّهُ أَكْبَرُ',        target:34, short:'الله أكبر'},
  {zikr:'لَا إِلَهَ إِلَّا اللَّهُ',target:100,short:'لا إله إلا الله'},
  {zikr:'أَسْتَغْفِرُ اللَّهَ',    target:100,short:'الاستغفار'},
  {zikr:'اللَّهُمَّ صَلِّ عَلَى مُحَمَّد',target:100,short:'الصلاة على النبي'},
  {zikr:'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',target:100,short:'حسبنا الله'},
  {zikr:'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',target:100,short:'الحوقلة'},
];

let tIdx=0,tCount=0,tTotal=0,tSoundOn=true,tVibOn=true;
function initTasbeeh(){
  try{const saved=localStorage.getItem('tasbeeh-total');if(saved)tTotal=parseInt(saved)||0;}catch(e){}
  renderTasbeehTabs();updateTasbeehUI();
}
function renderTasbeehTabs(){
  document.getElementById('t-tabs').innerHTML=TASBEEHAT.map((t,i)=>
    `<button class="tt${i===tIdx?' on':''}" onclick="setTasbeeh(${i})">${t.short}</button>`
  ).join('');
}
function setTasbeeh(i){tIdx=i;tCount=0;renderTasbeehTabs();updateTasbeehUI();}
function tasbeehNext(){setTasbeeh((tIdx+1)%TASBEEHAT.length);}
function tasbeehPrev(){setTasbeeh((tIdx-1+TASBEEHAT.length)%TASBEEHAT.length);}
function resetTasbeeh(){tCount=0;updateTasbeehUI();}

function tasbeehClick(){
  if(navigator.vibrate) navigator.vibrate(30);
  const t=TASBEEHAT[tIdx];
  tCount++;tTotal++;
  if(tSoundOn)playBeadSound();
  if(tVibOn&&navigator.vibrate)if(navigator.vibrate) navigator.vibrate(18);
  if(tCount>=t.target){
    if(tSoundOn)setTimeout(playCompleteSound,100);
    if(tVibOn&&navigator.vibrate)setTimeout(()=>navigator.vibrate([50,30,50,30,80]),120);
    // Show completion flash
    const circle=document.getElementById('t-circle');
    const flash=document.createElement('div');flash.className='tasbeeh-complete';circle.appendChild(flash);
    setTimeout(()=>flash.remove(),1000);
    // Auto advance to next
    setTimeout(()=>{
      tCount=0;
      tIdx=(tIdx+1)%TASBEEHAT.length;
      renderTasbeehTabs();updateTasbeehUI();
    },1200);
  }
  updateTasbeehUI();
}

function updateTasbeehUI(){
  const t=TASBEEHAT[tIdx];
  const pct=Math.min(100,(tCount/t.target)*100);
  const el=document.getElementById('t-circle');
  if(el)el.style.setProperty('--pct',pct.toFixed(1));
  const ce=document.getElementById('t-count');
  if(ce){
    ce.textContent=toArabicNum(tCount);
    ce.classList.add('bump');setTimeout(()=>ce.classList.remove('bump'),150);
  }
  const ze=document.getElementById('t-zikr');if(ze)ze.textContent=t.zikr;
  const te=document.getElementById('t-target');if(te)te.textContent='من '+toArabicNum(t.target);
  const tot=document.getElementById('t-total');if(tot)tot.textContent='المجموع الكلي: '+toArabicNum(tTotal);
}

function toggleTasbeehSound(){tSoundOn=!tSoundOn;document.getElementById('sound-tog').classList.toggle('on',tSoundOn);}
function toggleVib(){tVibOn=!tVibOn;document.getElementById('vib-tog').classList.toggle('on',tVibOn);}

// ═══════════════════════════════
// HISN AL-MUSLIM — Full Data
// ═══════════════════════════════

// ══ HISN AL-MUSLIM ══
const HISN_CATS=[
  {id:'sleep',    name:'أذكار النوم',          icon:'🌙', count:12},
  {id:'wake',     name:'أذكار الاستيقاظ',      icon:'🌅', count:8},
  {id:'morning',  name:'أذكار الصباح',         icon:'☀️', count:18},
  {id:'evening',  name:'أذكار المساء',         icon:'🌆', count:18},
  {id:'prayer',   name:'أذكار بعد الصلاة',     icon:'🕌', count:15},
  {id:'quran',    name:'أذكار المسجد',         icon:'📖', count:8},
  {id:'food',     name:'أذكار الأكل والشرب',   icon:'🍽️', count:10},
  {id:'home',     name:'أذكار الدخول والخروج', icon:'🚪', count:8},
  {id:'istighfar',name:'الاستغفار والتوبة',    icon:'🤲', count:12},
  {id:'worry',    name:'دعاء الهم والحزن',     icon:'💚', count:10},
  {id:'travel',   name:'أذكار السفر',          icon:'✈️', count:8},
  {id:'market',   name:'دعاء دخول السوق',      icon:'🛒', count:3},
  {id:'rain',     name:'دعاء المطر والريح',    icon:'🌧️', count:6},
  {id:'sick',     name:'أدعية المريض والعيادة',icon:'🌿', count:8},
  {id:'kafara',   name:'كفارة المجلس والذنوب', icon:'✨', count:5},
  {id:'ruqyah',   name:'الرقية الشرعية',       icon:'🛡️', count:10},
];

const HISN_DATA={
  sleep:[
    {ar:'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',src:'البخاري ٦٣٢٤ ومسلم ٢٧١١',rpt:1},
    {ar:'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَكَفَانَا وَآوَانَا، فَكَمْ مِمَّنْ لَا كَافِيَ لَهُ وَلَا مُؤْوِيَ',src:'مسلم ٢٧١٥',rpt:1},
    {ar:'اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ',src:'البخاري ٢٤٧ ومسلم ٢٧١٠',rpt:1},
    {ar:'سُبْحَانَ اللَّهِ',src:'البخاري ٣١١٣ — ٣٣ مرة قبل النوم',rpt:33},
    {ar:'الْحَمْدُ لِلَّهِ',src:'البخاري ٣١١٣',rpt:33},
    {ar:'اللَّهُ أَكْبَرُ',src:'البخاري ٣١١٣',rpt:34},
    {ar:'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',src:'أبو داود ٥٠٤٥ — صحيح',rpt:3},
    {ar:'اللَّهُمَّ بِاسْمِكَ أَحْيَا وَأَمُوتُ',src:'البخاري ٦٣٢٤',rpt:1},
    {ar:'آيَةُ الْكُرْسِيِّ ﴿اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...﴾',src:'البخاري ٢٣١١',rpt:1},
    {ar:'سُورَةُ الإِخْلَاصِ: ﴿قُلْ هُوَ اللَّهُ أَحَدٌ اللَّهُ الصَّمَدُ لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ﴾',src:'الترمذي — ٣ مرات',rpt:3},
    {ar:'سُورَةُ الفَلَقِ: ﴿قُلْ أَعُوذُ بِرَبِّ الفَلَقِ مِن شَرِّ مَا خَلَقَ...﴾',src:'أبو داود',rpt:3},
    {ar:'سُورَةُ النَّاسِ: ﴿قُلْ أَعُوذُ بِرَبِّ النَّاسِ مَلِكِ النَّاسِ...﴾',src:'أبو داود',rpt:3},
  ],
  wake:[
    {ar:'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',src:'البخاري ٦٣١٢',rpt:1},
    {ar:'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',src:'البخاري ١١٥٤',rpt:1},
    {ar:'اللَّهُمَّ رَبَّ السَّمَاوَاتِ وَرَبَّ الأَرْضِ وَرَبَّ الْعَرْشِ الْعَظِيمِ، رَبَّنَا وَرَبَّ كُلِّ شَيْءٍ، فَالِقَ الْحَبِّ وَالنَّوَى، وَمُنْزِلَ التَّوْرَاةِ وَالإِنْجِيلِ وَالْفُرْقَانِ، أَعُوذُ بِكَ مِنْ شَرِّ كُلِّ شَيْءٍ أَنْتَ آخِذٌ بِنَاصِيَتِهِ',src:'البخاري ٦٣١٧',rpt:1},
    {ar:'الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي فِي جَسَدِي وَرَدَّ عَلَيَّ رُوحِي وَأَذِنَ لِي بِذِكْرِهِ',src:'الترمذي ٣٤٠١ — حسن',rpt:1},
    {ar:'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',src:'البخاري — عشر مرات صباحاً',rpt:10},
    {ar:'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا',src:'ابن ماجه ٩٢٥ — صحيح',rpt:1},
    {ar:'أَصْبَحْنَا عَلَى فِطْرَةِ الإِسْلَامِ وَعَلَى كَلِمَةِ الإِخْلَاصِ وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ ﷺ',src:'أحمد — صحيح',rpt:1},
    {ar:'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',src:'عند الاستيقاظ من كابوس',rpt:1},
  ],
  morning:[
    {ar:'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ',src:'مسلم ٢٧٢٣',rpt:1},
    {ar:'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',src:'الترمذي ٣٣٩١ — حسن',rpt:1},
    {ar:'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',src:'البخاري ٦٣٠٦ — سيد الاستغفار',rpt:1},
    {ar:'اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ',src:'أبو داود ٥٠٨٣ — صحيح',rpt:4},
    {ar:'اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ',src:'أبو داود ٥٠٧٣ — صحيح',rpt:1},
    {ar:'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ',src:'أبو داود ٥٠٩٠ — صحيح',rpt:3},
    {ar:'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',src:'أبو داود ٥٠٨١ — صحيح',rpt:7},
    {ar:'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',src:'الترمذي ٣٣٨٨ — صحيح',rpt:3},
    {ar:'رَضِيتُ بِاللَّهِ رَبًّا وَبِالإِسْلَامِ دِينًا وَبِمُحَمَّدٍ ﷺ نَبِيًّا',src:'أبو داود ٥٠٧٢ — صحيح',rpt:3},
    {ar:'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ',src:'الحاكم — صحيح',rpt:1},
    {ar:'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',src:'مسلم ٢٦٩٢ — مئة مرة صباحاً ومساءً',rpt:100},
    {ar:'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',src:'البخاري ٦٤٠٤ — مئة مرة صباحاً',rpt:100},
    {ar:'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',src:'الترمذي',rpt:10},
    {ar:'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',src:'مسلم ٢٧٠٨',rpt:3},
    {ar:'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',src:'البخاري ٦٣٦٩',rpt:1},
    {ar:'آيَةُ الْكُرْسِيِّ',src:'إذا أصبحت مرة واحدة',rpt:1},
    {ar:'سُورَةُ الإِخْلَاصِ وَالْمُعَوِّذَتَيْنِ',src:'أبو داود — ثلاث مرات صباحاً',rpt:3},
    {ar:'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ',src:'أبو داود — صحيح',rpt:1},
  ],
  evening:[
    {ar:'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا',src:'مسلم ٢٧٢٣',rpt:1},
    {ar:'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',src:'الترمذي',rpt:1},
    {ar:'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',src:'البخاري ٦٣٠٦ — سيد الاستغفار مساءً',rpt:1},
    {ar:'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',src:'مسلم ٢٧٠٨',rpt:3},
    {ar:'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',src:'مسلم — مئة مرة مساءً',rpt:100},
    {ar:'اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ',src:'أبو داود — صحيح',rpt:4},
    {ar:'اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ',src:'أبو داود — صحيح',rpt:1},
    {ar:'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',src:'أبو داود — صحيح',rpt:7},
    {ar:'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',src:'الترمذي — صحيح',rpt:3},
    {ar:'رَضِيتُ بِاللَّهِ رَبًّا وَبِالإِسْلَامِ دِينًا وَبِمُحَمَّدٍ ﷺ نَبِيًّا',src:'أبو داود — صحيح',rpt:3},
    {ar:'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ',src:'الحاكم — صحيح',rpt:1},
    {ar:'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ',src:'أبو داود — صحيح',rpt:3},
    {ar:'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',src:'البخاري',rpt:1},
    {ar:'آيَةُ الْكُرْسِيِّ',src:'عند المساء مرة واحدة',rpt:1},
    {ar:'سُورَةُ الإِخْلَاصِ وَالْمُعَوِّذَتَيْنِ',src:'أبو داود — ثلاث مرات مساءً',rpt:3},
    {ar:'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ',src:'أبو داود',rpt:1},
    {ar:'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',src:'',rpt:10},
    {ar:'اللَّهُمَّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ',src:'ابن ماجه — مئة مرة',rpt:100},
  ],
  prayer:[
    {ar:'أَسْتَغْفِرُ اللَّهَ — ثلاث مرات',src:'مسلم ٥٩١',rpt:3},
    {ar:'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالإِكْرَامِ',src:'مسلم ٥٩٢',rpt:1},
    {ar:'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ',src:'مسلم ٥٩٣',rpt:1},
    {ar:'سُبْحَانَ اللَّهِ',src:'مسلم ٥٩٥ — ثلاثة وثلاثون',rpt:33},
    {ar:'الْحَمْدُ لِلَّهِ',src:'مسلم ٥٩٥ — ثلاثة وثلاثون',rpt:33},
    {ar:'اللَّهُ أَكْبَرُ',src:'مسلم ٥٩٥ — أربعة وثلاثون',rpt:34},
    {ar:'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',src:'مسلم ٥٩٧ — بعد التسبيح',rpt:1},
    {ar:'آيَةُ الْكُرْسِيِّ دُبُرَ كُلِّ صَلَاةٍ',src:'النسائي — صحيح',rpt:1},
    {ar:'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',src:'أبو داود ١٥٢٢ — صحيح',rpt:1},
    {ar:'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْجُبْنِ، وَأَعُوذُ بِكَ مِنَ الْبُخْلِ، وَأَعُوذُ بِكَ مِنْ أَنْ أُرَدَّ إِلَى أَرْذَلِ الْعُمُرِ، وَأَعُوذُ بِكَ مِنْ فِتْنَةِ الدُّنْيَا وَعَذَابِ الْقَبْرِ',src:'البخاري ٦٣٧٤',rpt:1},
    {ar:'اللَّهُمَّ اغْفِرْ لِي مَا قَدَّمْتُ وَمَا أَخَّرْتُ وَمَا أَسْرَرْتُ وَمَا أَعْلَنْتُ',src:'مسلم',rpt:1},
    {ar:'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ وَمِنْ عَذَابِ الْقَبْرِ وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ',src:'مسلم ٥٨٨',rpt:1},
    {ar:'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ',src:'البخاري ٦٤٠٦',rpt:1},
    {ar:'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',src:'البخاري ٣٣٧٠',rpt:1},
    {ar:'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',src:'البقرة ٢٠١',rpt:1},
  ],
  quran:[
    {ar:'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',src:'مسلم ٧١٣ — عند دخول المسجد',rpt:1},
    {ar:'أَعُوذُ بِاللَّهِ الْعَظِيمِ وَبِوَجْهِهِ الْكَرِيمِ وَسُلْطَانِهِ الْقَدِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ',src:'أبو داود — عند دخول المسجد',rpt:1},
    {ar:'اللَّهُمَّ اغْفِرْ لِي ذُنُوبِي وَافْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',src:'ابن ماجه — عند دخول المسجد',rpt:1},
    {ar:'بِسْمِ اللَّهِ وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ',src:'ابن ماجه',rpt:1},
    {ar:'اللَّهُمَّ اغْفِرْ لِي ذُنُوبِي وَافْتَحْ لِي أَبْوَابَ فَضْلِكَ',src:'ابن ماجه — عند الخروج',rpt:1},
    {ar:'الصَّلَاةُ عَلَى النَّبِيِّ ﷺ عند دخول المسجد والخروج منه',src:'ابن ماجه — صحيح',rpt:1},
    {ar:'أَعُوذُ بِاللَّهِ الْعَظِيمِ وَبِوَجْهِهِ الْكَرِيمِ مِنَ الشَّيْطَانِ الرَّجِيمِ',src:'عند الشروع في القراءة',rpt:1},
    {ar:'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ لَا إِلَهَ إِلَّا أَنْتَ أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',src:'كفارة المجلس — عند إنهاء القراءة',rpt:1},
  ],
  food:[
    {ar:'بِسْمِ اللَّهِ',src:'أبو داود ٣٧٦٧ — عند البدء',rpt:1},
    {ar:'بِسْمِ اللَّهِ أَوَّلَهُ وَآخِرَهُ — إذا نسي في البداية',src:'أبو داود ٣٧٦٧',rpt:1},
    {ar:'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',src:'الترمذي ٣٤٥٨ — حسن',rpt:1},
    {ar:'اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَأَطْعِمْنَا خَيْرًا مِنْهُ',src:'الترمذي — عند شرب اللبن',rpt:1},
    {ar:'اللَّهُمَّ أَطْعِمْ مَنْ أَطْعَمَنِي وَاسْقِ مَنْ سَقَانِي',src:'مسلم ٢٠٥٥',rpt:1},
    {ar:'بِسْمِ اللَّهِ — ثم الشرب في ثلاث جرعات',src:'مسلم ٢٠٢٨',rpt:1},
    {ar:'الْحَمْدُ لِلَّهِ',src:'مسلم — عند الانتهاء',rpt:1},
    {ar:'اللَّهُمَّ أَطْعَمْتَ وَسَقَيْتَ وَأَغْنَيْتَ وَهَدَيْتَ وَأَحْيَيْتَ',src:'',rpt:1},
    {ar:'الْحَمْدُ لِلَّهِ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ، غَيْرَ مَكْفِيٍّ وَلَا مُوَدَّعٍ وَلَا مُسْتَغْنًى عَنْهُ رَبَّنَا',src:'البخاري ٥٤٥٨',rpt:1},
    {ar:'اللَّهُمَّ أَبَارِكْ لَهُمْ فِيمَا رَزَقْتَهُمْ وَاغْفِرْ لَهُمْ وَارْحَمْهُمْ',src:'مسلم — دعاء لمن أطعمك',rpt:1},
  ],
  home:[
    {ar:'بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',src:'أبو داود — عند الدخول',rpt:1},
    {ar:'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ وَخَيْرَ الْمَخْرَجِ، بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',src:'أبو داود ٥٠٩٦ — صحيح',rpt:1},
    {ar:'بِسْمِ اللَّهِ — عند الخروج من المنزل',src:'أبو داود — صحيح',rpt:1},
    {ar:'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ أَنْ أَضِلَّ أَوْ أُضَلَّ، أَوْ أَزِلَّ أَوْ أُزَلَّ، أَوْ أَظْلِمَ أَوْ أُظْلَمَ، أَوْ أَجْهَلَ أَوْ يُجْهَلَ عَلَيَّ',src:'الترمذي — عند الخروج',rpt:1},
    {ar:'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',src:'أبو داود ٥٠٩٥ — صحيح',rpt:1},
    {ar:'دُعَاءُ دُخُولِ الْخَلَاءِ: اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',src:'البخاري ١٤٢',rpt:1},
    {ar:'دُعَاءُ الْخُرُوجِ مِنَ الْخَلَاءِ: غُفْرَانَكَ',src:'أبو داود ٣٠ — صحيح',rpt:1},
    {ar:'اللَّهُمَّ أَلِّفْ بَيْنَ قُلُوبِنَا وَأَصْلِحْ ذَاتَ بَيْنِنَا',src:'',rpt:1},
  ],
  istighfar:[
    {ar:'أَسْتَغْفِرُ اللَّهَ',src:'',rpt:100},
    {ar:'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',src:'الترمذي — صحيح',rpt:3},
    {ar:'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',src:'البخاري ٦٣٠٦ — سيد الاستغفار',rpt:1},
    {ar:'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',src:'الترمذي ٣٤٣٣ — كفارة المجلس',rpt:1},
    {ar:'رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ',src:'الأعراف ٢٣ — دعاء آدم',rpt:1},
    {ar:'لَا إِلَهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',src:'الأنبياء ٨٧ — دعاء يونس',rpt:1},
    {ar:'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنتَ التَّوَّابُ الرَّحِيمُ',src:'ابن ماجه — مئة مرة في المجلس',rpt:100},
    {ar:'اللَّهُمَّ اغْفِرْ لِي خَطِيئَتِي وَجَهْلِي وَإِسْرَافِي فِي أَمْرِي وَمَا أَنْتَ أَعْلَمُ بِهِ مِنِّي',src:'البخاري ٦٣٩٨',rpt:1},
    {ar:'اللَّهُمَّ اغْفِرْ لِي ذُنُوبِي كُلَّهَا، دِقَّهَا وَجِلَّهَا، وَأَوَّلَهَا وَآخِرَهَا وَعَلَانِيَتَهَا وَسِرَّهَا',src:'مسلم ٤٨٣',rpt:1},
    {ar:'اللَّهُمَّ إِنِّي أَسْأَلُكَ يَا اللَّهُ بِأَنَّكَ الْوَاحِدُ الأَحَدُ الصَّمَدُ الَّذِي لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ أَنْ تَغْفِرَ لِي ذُنُوبِي',src:'أبو داود — صحيح',rpt:1},
    {ar:'تُوبُوا إِلَى اللَّهِ — قال النبي ﷺ: إني لأستغفر الله وأتوب إليه في اليوم أكثر من سبعين مرة',src:'البخاري ٦٣٠٧',rpt:70},
    {ar:'رَبِّ إِنِّي ظَلَمْتُ نَفْسِي فَاغْفِرْ لِي',src:'القصص ١٦',rpt:1},
  ],
  worry:[
    {ar:'اللَّهُمَّ رَحْمَتَكَ أَرْجُو فَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ، وَأَصْلِحْ لِي شَأْنِي كُلَّهُ لَا إِلَهَ إِلَّا أَنْتَ',src:'أبو داود ٥٠٩٠ — صحيح',rpt:1},
    {ar:'لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ',src:'متفق عليه — دعاء الكرب',rpt:1},
    {ar:'اللَّهُمَّ إِنِّي عَبْدُكَ، وَابْنُ عَبْدِكَ، وَابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ، أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ سَمَّيْتَ بِهِ نَفْسَكَ، أَوْ أَنْزَلْتَهُ فِي كِتَابِكَ، أَوْ عَلَّمْتَهُ أَحَدًا مِنْ خَلْقِكَ، أَوِ اسْتَأْثَرْتَ بِهِ فِي عِلْمِ الْغَيْبِ عِنْدَكَ، أَنْ تَجْعَلَ الْقُرْآنَ رَبِيعَ قَلْبِي، وَنُورَ صَدْرِي، وَجَلَاءَ حُزْنِي، وَذَهَابَ هَمِّي',src:'أحمد — صحيح',rpt:1},
    {ar:'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',src:'البخاري ٦٣٦٩',rpt:1},
    {ar:'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',src:'التوبة ١٢٩',rpt:7},
    {ar:'اللَّهُ اللَّهُ رَبِّي لَا أُشْرِكُ بِهِ شَيْئًا',src:'أبو داود — صحيح',rpt:7},
    {ar:'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ',src:'الحاكم — صحيح',rpt:1},
    {ar:'لَا إِلَهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ — دعاء يونس عليه السلام',src:'الأنبياء ٨٧',rpt:1},
    {ar:'اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا وَأَنْتَ تَجْعَلُ الْحَزَنَ إِذَا شِئْتَ سَهْلًا',src:'ابن حبان — صحيح',rpt:1},
    {ar:'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً إِنَّكَ أَنتَ الْوَهَّابُ',src:'آل عمران ٨',rpt:1},
  ],
  travel:[
    {ar:'اللَّهُ أَكْبَرُ — ثلاث مرات عند الركوب',src:'مسلم ١٣٤٢',rpt:3},
    {ar:'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنقَلِبُونَ',src:'أبو داود ٢٦٠٢',rpt:1},
    {ar:'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ',src:'مسلم ١٣٤٢',rpt:1},
    {ar:'اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ وَالْخَلِيفَةُ فِي الأَهْلِ',src:'مسلم ١٣٤٢',rpt:1},
    {ar:'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ وَعْثَاءِ السَّفَرِ وَكَآبَةِ الْمَنْظَرِ وَسُوءِ الْمُنْقَلَبِ فِي الْمَالِ وَالأَهْلِ',src:'مسلم ١٣٤٣',rpt:1},
    {ar:'عَلَيْكُمْ بِالسَّيْرِ نَهَارًا: سُبُّوحٌ قُدُّوسٌ — التسبيح أثناء السفر',src:'أبو داود',rpt:1},
    {ar:'اللَّهُمَّ اطْوِ لَنَا الأَرْضَ وَهَوِّنْ عَلَيْنَا السَّفَرَ',src:'',rpt:1},
    {ar:'آيِبُونَ تَائِبُونَ عَابِدُونَ لِرَبِّنَا حَامِدُونَ — دعاء العودة',src:'مسلم ١٣٤٥',rpt:1},
  ],
  market:[
    {ar:'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ حَيٌّ لَا يَمُوتُ بِيَدِهِ الْخَيْرُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',src:'الترمذي ٣٤٢٨ — من قالها كتب الله له ألف ألف حسنة',rpt:1},
    {ar:'بِسْمِ اللَّهِ وَالْبَرَكَةُ',src:'عند دخول السوق',rpt:1},
    {ar:'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',src:'عند دخول السوق',rpt:1},
  ],
  rain:[
    {ar:'اللَّهُمَّ صَيِّبًا نَافِعًا',src:'البخاري ١٠٣٢ — عند نزول المطر',rpt:1},
    {ar:'مُطِرْنَا بِفَضْلِ اللَّهِ وَرَحْمَتِهِ',src:'البخاري — بعد المطر',rpt:1},
    {ar:'اللَّهُمَّ حَوَالَيْنَا وَلَا عَلَيْنَا',src:'البخاري ١٠١٦ — عند المطر الشديد',rpt:1},
    {ar:'اللَّهُمَّ اسْقِنَا غَيْثًا مُغِيثًا مَرِيئًا مَرِيعًا نَافِعًا غَيْرَ ضَارٍّ',src:'أبو داود ١١٦٩',rpt:1},
    {ar:'اللَّهُمَّ إِنَّكَ أَنْزَلْتَ هَذَا الْمَطَرَ وَأَنْتَ تَعْلَمُ حَاجَتِي',src:'',rpt:1},
    {ar:'سُبْحَانَ مَنْ تُسَبِّحُ لَهُ الرُّعُودُ',src:'الموطأ',rpt:1},
  ],
  sick:[
    {ar:'اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ وَاشْفِ أَنْتَ الشَّافِي لَا شِفَاءَ إِلَّا شِفَاؤُكَ شِفَاءً لَا يُغَادِرُ سَقَمًا',src:'البخاري ٥٧٤٣',rpt:1},
    {ar:'أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ',src:'أبو داود ٣١٠٦ — صحيح — سبع مرات',rpt:7},
    {ar:'بِسْمِ اللَّهِ — ثم: أَعُوذُ بِعِزَّةِ اللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ',src:'مسلم ٢٢٠٢ — سبع مرات على الألم',rpt:7},
    {ar:'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْبَرَصِ وَالْجُنُونِ وَالْجُذَامِ وَمِنْ سَيِّئِ الأَسْقَامِ',src:'أبو داود — صحيح',rpt:1},
    {ar:'لَا بَأْسَ طَهُورٌ إِنْ شَاءَ اللَّهُ — للمريض',src:'البخاري ٣٦١٦',rpt:1},
    {ar:'أَسْأَلُ اللَّهَ أَنْ يُعَافِيَكَ وَيُعَجِّلَ بِعَافِيَتِكَ — دعاء للمريض',src:'',rpt:1},
    {ar:'اللَّهُمَّ اشْفِ عَبْدَكَ يَنْكَأُ لَكَ عَدُوًّا، أَوْ يَمْشِي لَكَ إِلَى صَلَاةٍ',src:'أبو داود ٣١٠٧ — صحيح',rpt:1},
    {ar:'اللَّهُمَّ عَافِنِي فِي بَدَنِي اللَّهُمَّ عَافِنِي فِي سَمْعِي اللَّهُمَّ عَافِنِي فِي بَصَرِي',src:'أبو داود',rpt:1},
  ],
  kafara:[
    {ar:'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',src:'الترمذي ٣٤٣٣ — كفارة المجلس',rpt:1},
    {ar:'مَنْ قَالَ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ مِئَةَ مَرَّةٍ حُطَّتْ خَطَايَاهُ وَإِنْ كَانَتْ مِثْلَ زَبَدِ الْبَحْرِ',src:'متفق عليه',rpt:100},
    {ar:'مَنْ قَرَأَ آيَةَ الْكُرْسِيِّ دُبُرَ كُلِّ صَلَاةٍ مَكْتُوبَةٍ لَمْ يَمْنَعْهُ مِنْ دُخُولِ الْجَنَّةِ إِلَّا أَنْ يَمُوتَ',src:'النسائي — صحيح',rpt:1},
    {ar:'كُلُّ كَلَامٍ لَا يُبْدَأُ فِيهِ بِالْحَمْدِ لِلَّهِ فَهُوَ أَجْذَمُ — ابدأ كل أمر بالبسملة والحمدلة',src:'',rpt:1},
    {ar:'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',src:'البخاري — مئة مرة تعدل عتق عشر رقاب',rpt:100},
  ],
  ruqyah:[
    {ar:'بِسْمِ اللَّهِ أَرْقِيكَ، مِنْ كُلِّ شَيْءٍ يُؤْذِيكَ، مِنْ شَرِّ كُلِّ نَفْسٍ أَوْ عَيْنِ حَاسِدٍ، اللَّهُ يَشْفِيكَ، بِسْمِ اللَّهِ أَرْقِيكَ',src:'مسلم ٢١٨٦',rpt:3},
    {ar:'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ',src:'البخاري ٣٣٧١ — للأطفال',rpt:3},
    {ar:'آيَةُ الْكُرْسِيِّ — حفظ من الشيطان',src:'البخاري ٢٣١١',rpt:1},
    {ar:'سُورَةُ الفَاتِحَة — وهي الرقية الكاملة',src:'البخاري ٥٧٣٦',rpt:7},
    {ar:'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',src:'',rpt:3},
    {ar:'الْمُعَوِّذَتَانِ — الفلق والناس',src:'أبو داود — ثلاث مرات',rpt:3},
    {ar:'آيَاتُ السِّحْرِ: ﴿وَأَوْحَيْنَا إِلَى مُوسَى أَنْ أَلْقِ عَصَاكَ...﴾ الأعراف ١١٧-١٢٢',src:'',rpt:1},
    {ar:'آيَاتُ الشِّفَاءِ السِّتُّ: الفاتحة — التوبة ١٤ — يونس ٥٧ — النحل ٦٩ — الإسراء ٨٢ — الشعراء ٨٠',src:'',rpt:1},
    {ar:'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',src:'الترمذي — صحيح',rpt:3},
    {ar:'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الشَّيْطَانِ الرَّجِيمِ وَمِنْ شَرِّ كُلِّ ذِي شَرٍّ',src:'',rpt:3},
  ],
};

function renderHisnCats(){
  const cats=document.getElementById('hisn-cats');
  const view=document.getElementById('hisn-view');
  if(cats)cats.style.display='';
  if(view)view.classList.remove('on');
  if(!cats)return;
  cats.innerHTML=HISN_CATS.map((c,i)=>`
    <div class="hcat" onclick="openHisnCat('${c.id}','${c.name}')">
      <div class="hcat-icon">${c.icon}</div>
      <div class="hcat-name">${c.name}</div>
      <div class="hcat-count">${HISN_DATA[c.id]?.length||c.count} ذكر</div>
    </div>`).join('');
}

function openHisnCat(id,name){
  var cats=document.getElementById('hisn-cats');
  var view=document.getElementById('hisn-view');
  if(cats)cats.style.display='none';
  if(view)view.classList.add('on');
  var title=document.getElementById('hisn-cat-title');
  if(title)title.textContent=name;
  var adhkar=document.getElementById('hisn-adhkar');
  if(!adhkar)return;
  var data=HISN_DATA[id]||[];
  if(!data.length){adhkar.innerHTML='<p style="color:var(--tm);text-align:center;padding:2rem">جارٍ الإضافة...</p>';return;}
  var html='';
  for(var i=0;i<data.length;i++){
    var z=data[i];
    var rpt=z.rpt||1;
    var circ=113.1;
    var tasbeehHtml='';
    if(rpt>1){
      var rptWord=rpt>10?'مرة':rpt>2?'مرات':'مرتان';
      tasbeehHtml='<div class="hz-tasbih">'
        +'<div class="hz-ring-wrap" id="hzr-'+id+'-'+i+'" onclick="hzTap(\''+id+'\','+i+','+rpt+')" ontouchend="event.preventDefault();hzTap(\''+id+'\','+i+','+rpt+')">'
          +'<svg viewBox="0 0 44 44" class="hz-svg">'
            +'<circle cx="22" cy="22" r="18" class="hz-track"/>'
            +'<circle cx="22" cy="22" r="18" class="hz-prog" id="hzp-'+id+'-'+i+'" stroke-dasharray="'+circ+'" stroke-dashoffset="'+circ+'"/>'
          +'</svg>'
          +'<div class="hz-num" id="hzn-'+id+'-'+i+'">٠</div>'
        +'</div>'
        +'<div class="hz-meta">'
          +'<span class="hz-of">من '+toArabicNum(rpt)+' '+rptWord+'</span>'
          +'<button class="hz-reset-btn" onclick="hzReset(\''+id+'\','+i+','+rpt+')">↺ إعادة</button>'
        +'</div>'
      +'</div>';
    }
    html+='<div class="zikr-card">'
      +'<div class="zikr-num">'+(i+1)+'</div>'
      +'<div class="zikr-ar">'+z.ar+'</div>'
      +(z.src?'<div class="zikr-src">📚 '+z.src+'</div>':'')
      +tasbeehHtml
      +'<div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.5rem;">'
        +'<button onclick="copyZikrText(this,\''+encodeURIComponent(z.ar+(z.src?'\n📚 '+z.src:''))+'\')" style="background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.15);color:var(--tm);font-size:.7rem;padding:.22rem .65rem;border-radius:20px;cursor:pointer;font-family:\'Tajawal\',sans-serif;transition:all .25s;" onmouseover="this.style.color=\'var(--gold)\'" onmouseout="this.style.color=\'var(--tm)\'">📋 نسخ</button>'
      +'</div>'
    +'</div>';
  }
  adhkar.innerHTML=html;
}

// ══ Mini Tasbih (hz = hisn zikr) ══
var _hzCounts={};
function hzTap(catId,idx,target){
  var key=catId+'_'+idx;
  if(!_hzCounts[key])_hzCounts[key]=0;
  if(_hzCounts[key]>=target)return;
  _hzCounts[key]++;
  var count=_hzCounts[key];
  var numEl=document.getElementById('hzn-'+catId+'-'+idx);
  if(numEl)numEl.textContent=toArabicNum(count);
  var progEl=document.getElementById('hzp-'+catId+'-'+idx);
  if(progEl){
    var circ=113.1;
    progEl.style.strokeDashoffset=(circ*(1-count/target)).toFixed(2);
  }
  if(navigator.vibrate)navigator.vibrate(15);
  if(count>=target){
    var ring=document.getElementById('hzr-'+catId+'-'+idx);
    if(ring){ring.classList.add('hz-done');setTimeout(function(){ring.classList.remove('hz-done');},900);}
    if(navigator.vibrate)navigator.vibrate([40,30,40]);
  }
}
function hzReset(catId,idx,target){
  var key=catId+'_'+idx;
  _hzCounts[key]=0;
  var numEl=document.getElementById('hzn-'+catId+'-'+idx);
  if(numEl)numEl.textContent='\u0660'; // ٠
  var progEl=document.getElementById('hzp-'+catId+'-'+idx);
  if(progEl)progEl.style.strokeDashoffset='113.1';
  var ring=document.getElementById('hzr-'+catId+'-'+idx);
  if(ring)ring.classList.remove('hz-done');
}

function hisnBack(){
  document.getElementById('hisn-cats').style.display='grid';
  document.getElementById('hisn-view').classList.remove('on');
}

function copyZikrText(btn, encoded){
  const txt = decodeURIComponent(encoded||'');
  navigator.clipboard?.writeText(txt).catch(()=>{});
  if(navigator.vibrate) navigator.vibrate(30);
  const orig=btn.textContent;
  btn.textContent='✅ تم';
  setTimeout(()=>btn.textContent=orig,1500);
}

// ═══════════════════════════════════════════════════
// 🔔 إشعارات الأذكار الدورية — تتجدد باستمرار
// ═══════════════════════════════════════════════════
const ADHKAR_NOTIF_LIST = [
  "اللهم يا جامع الشمل ويا ميسر الأمور ارزق هذا العبد الصالح زوجة من أحب واجمعهما على خير ومحبة ورضا، اللهم يسر له أمره وأتم له فرحه، اللهم آمين",
  "سبحان الله وبحمده — سبحان الله العظيم",
  "اللهم صل وسلم على نبينا محمد ﷺ",
  "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير",
  "اللهم إني أسألك العافية في الدنيا والآخرة",
  "أستغفر الله العظيم الذي لا إله إلا هو الحي القيوم وأتوب إليه",
  "اللهم إنك عفو كريم تحب العفو فاعف عنا",
  "حسبنا الله ونعم الوكيل — نعم المولى ونعم النصير",
  "اللهم اهدنا فيمن هديت وعافنا فيمن عافيت وتولنا فيمن توليت",
  "لا حول ولا قوة إلا بالله العلي العظيم",
  "اللهم أعنا على ذكرك وشكرك وحسن عبادتك",
  "يا حي يا قيوم برحمتك أستغيث، أصلح لي شأني كله ولا تكلني إلى نفسي طرفة عين",
  "اللهم بارك لنا في أعمارنا وأرزاقنا وذرياتنا",
  "سبحان الله ٣٣ — الحمد لله ٣٣ — الله أكبر ٣٤",
  "اللهم اجعل القرآن الكريم ربيع قلوبنا ونور صدورنا"
];
let _adhkarNotifIdx = 0;
function sendAdhkarNotif(){
  if(Notification?.permission!=='granted') return;
  const txt = ADHKAR_NOTIF_LIST[_adhkarNotifIdx % ADHKAR_NOTIF_LIST.length];
  _adhkarNotifIdx++;
  try{
    new Notification('🌙 هُدى القرآن — ذكر اليوم', {
      body: txt,
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><text y="28" font-size="26">🌙</text></svg>',
      tag: 'adhkar-notif-'+Date.now(),
      silent: false
    });
  } catch(e){}
}
// Start rotating adhkar notifications every 15 minutes
setTimeout(()=>{
  sendAdhkarNotif();
  setInterval(sendAdhkarNotif, 15*60*1000);
}, 3000);

function openHisnPrayer(){
  SP('hisn');
  setTimeout(()=>openHisnCat('prayer','أذكار بعد الصلاة'),200);
}

// Istighfar audio using Web Speech API or Web Audio
let hisnAud=null;
function playIstighfarAudio(idx,catId){
  // Use TTS if available, otherwise synthesize
  const data=HISN_DATA[catId];if(!data||!data[idx])return;
  const text=data[idx].ar;
  // Try Web Speech API
  if('speechSynthesis' in window){
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text);
    u.lang='ar-SA';u.rate=.85;u.pitch=1;
    // Find Arabic voice
    const voices=speechSynthesis.getVoices();
    const arVoice=voices.find(v=>v.lang.startsWith('ar'));
    if(arVoice)u.voice=arVoice;
    window.speechSynthesis.speak(u);
    const btn=document.getElementById('hisn-ab-'+idx);
    if(btn){btn.classList.add('playing');btn.textContent='⏹ إيقاف';btn.onclick=()=>{window.speechSynthesis.cancel();btn.classList.remove('playing');btn.textContent='🔊 استمع';btn.onclick=()=>playIstighfarAudio(idx,catId);};}
    u.onend=()=>{const b=document.getElementById('hisn-ab-'+idx);if(b){b.classList.remove('playing');b.textContent='🔊 استمع';b.onclick=()=>playIstighfarAudio(idx,catId);}};
  }else{
    // Fallback: synthesize tone
    playBeadSound();
  }
}

// ═══════════════════════════════
// PRAYER NOTIFICATIONS — Full System
// ═══════════════════════════════

// ══ WIRD DATA ══
const WIRD_AYAHS=[
  {ar:"﴿ وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ ﴾",ref:"البقرة: ١٨٦"},
  {ar:"﴿ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ﴾",ref:"البقرة: ٢٥٥ — آية الكرسي"},
  {ar:"﴿ وَبَشِّرِ الصَّابِرِينَ ۝ الَّذِينَ إِذَا أَصَابَتْهُم مُّصِيبَةٌ قَالُوا إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ ﴾",ref:"البقرة: ١٥٥-١٥٦"},
  {ar:"﴿ وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا ۝ وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ﴾",ref:"الطلاق: ٢-٣"},
  {ar:"﴿ إِنَّ مَعَ الْعُسْرِ يُسْرًا ﴾",ref:"الشرح: ٦"},
  {ar:"﴿ وَقُل رَّبِّ زِدْنِي عِلْمًا ﴾",ref:"طه: ١١٤"},
  {ar:"﴿ فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ﴾",ref:"الشرح: ٥"},
  {ar:"﴿ حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ ﴾",ref:"آل عمران: ١٧٣"},
  {ar:"﴿ وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ ۖ إِنَّهُ لَا يَيْأَسُ مِن رَّوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ ﴾",ref:"يوسف: ٨٧"},
  {ar:"﴿ رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ ﴾",ref:"البقرة: ٢٠١"},
  {ar:"﴿ وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ ۚ عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ ﴾",ref:"هود: ٨٨"},
  {ar:"﴿ يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ﴾",ref:"البقرة: ١٥٣"},
  {ar:"﴿ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ ﴾",ref:"البقرة: ١٥٣"},
  {ar:"﴿ وَاللَّهُ غَالِبٌ عَلَىٰ أَمْرِهِ وَلَٰكِنَّ أَكْثَرَ النَّاسِ لَا يَعْلَمُونَ ﴾",ref:"يوسف: ٢١"},
  {ar:"﴿ وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ﴾",ref:"الطلاق: ٣"},
  {ar:"﴿ إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ سَيَجْعَلُ لَهُمُ الرَّحْمَٰنُ وُدًّا ﴾",ref:"مريم: ٩٦"},
  {ar:"﴿ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ ﴾",ref:"الرعد: ٢٨"},
  {ar:"﴿ وَنَفْسٍ وَمَا سَوَّاهَا ﴾",ref:"الشمس: ٧"},
  {ar:"﴿ قُلْ هُوَ اللَّهُ أَحَدٌ ﴾",ref:"الإخلاص: ١"},
  {ar:"﴿ إِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ فَإِذَا فَرَغْتَ فَانصَبْ ۝ وَإِلَىٰ رَبِّكَ فَارْغَب ﴾",ref:"الشرح: ٦-٨"},
  {ar:"﴿ وَأَنِيبُوا إِلَىٰ رَبِّكُمْ وَأَسْلِمُوا لَهُ ﴾",ref:"الزمر: ٥٤"},
  {ar:"﴿ رَبِّ اشْرَحْ لِي صَدْرِي ۝ وَيَسِّرْ لِي أَمْرِي ﴾",ref:"طه: ٢٥-٢٦"},
  {ar:"﴿ وَقُل رَّبِّ أَدْخِلْنِي مُدْخَلَ صِدْقٍ وَأَخْرِجْنِي مُخْرَجَ صِدْقٍ ﴾",ref:"الإسراء: ٨٠"},
  {ar:"﴿ فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ ﴾",ref:"البقرة: ١٥٢"},
  {ar:"﴿ وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ ﴾",ref:"الحديد: ٤"},
  {ar:"﴿ وَاللَّهُ يَدْعُو إِلَىٰ دَارِ السَّلَامِ ﴾",ref:"يونس: ٢٥"},
  {ar:"﴿ إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ ﴾",ref:"التوبة: ١٢٠"},
  {ar:"﴿ وَإِن تَعُدُّوا نِعْمَتَ اللَّهِ لَا تُحْصُوهَا ﴾",ref:"إبراهيم: ٣٤"},
  {ar:"﴿ فَأَمَّا مَن تَابَ وَآمَنَ وَعَمِلَ صَالِحًا فَعَسَىٰ أَن يَكُونَ مِنَ الْمُفْلِحِينَ ﴾",ref:"القصص: ٦٧"},
  {ar:"﴿ وَإِلَىٰ رَبِّكَ فَاصْبِرْ ﴾",ref:"المدثر: ٧"},
];

const WIRD_HADITHS=[
/* ══ العقيدة والإيمان ══ */
{ar:"إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",src:"متفق عليه — البخاري ١",cat:"العقيدة"},
{ar:"الإِيمَانُ بِضْعٌ وَسَبْعُونَ أَوْ بِضْعٌ وَسِتُّونَ شُعْبَةً، فَأَفْضَلُهَا قَوْلُ لَا إِلَهَ إِلَّا اللَّهُ، وَأَدْنَاهَا إِمَاطَةُ الأَذَى عَنِ الطَّرِيقِ",src:"مسلم ٣٥",cat:"العقيدة"},
{ar:"بُنِيَ الإِسْلامُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّداً رَسُولُ اللَّهِ، وَإِقَامِ الصَّلاةِ، وَإِيتَاءِ الزَّكَاةِ، وَحَجِّ الْبَيْتِ، وَصَوْمِ رَمَضَانَ",src:"متفق عليه — البخاري ٨",cat:"العقيدة"},
{ar:"أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ",src:"متفق عليه — البخاري ٦٤٦٤",cat:"العقيدة"},
{ar:"مَنْ مَاتَ وَهُوَ يَعْلَمُ أَنَّهُ لا إِلَهَ إِلا اللَّهُ دَخَلَ الْجَنَّةَ",src:"مسلم ٢٦",cat:"العقيدة"},
/* ══ الصلاة ══ */
{ar:"الصَّلاةُ عِمَادُ الدِّينِ، فَمَنْ أَقَامَهَا فَقَدْ أَقَامَ الدِّينَ، وَمَنْ تَرَكَهَا فَقَدْ هَدَمَ الدِّينَ",src:"البيهقي",cat:"الصلاة"},
{ar:"أَوَّلُ مَا يُحَاسَبُ بِهِ الْعَبْدُ يَوْمَ الْقِيَامَةِ الصَّلاةُ، فَإِنْ صَلُحَتْ صَلُحَ سَائِرُ عَمَلِهِ",src:"الطبراني — صحيح",cat:"الصلاة"},
{ar:"بَيْنَ الرَّجُلِ وَبَيْنَ الشِّرْكِ وَالْكُفْرِ تَرْكُ الصَّلاةِ",src:"مسلم ٨٢",cat:"الصلاة"},
{ar:"مَنْ صَلَّى الصُّبْحَ فَهُوَ فِي ذِمَّةِ اللَّهِ",src:"مسلم ٦٥٧",cat:"الصلاة"},
{ar:"مَنْ حَافَظَ عَلَيْهَا كَانَتْ لَهُ نُوراً وَبُرْهَاناً وَنَجَاةً يَوْمَ الْقِيَامَةِ",src:"أحمد — صحيح",cat:"الصلاة"},
/* ══ القرآن الكريم ══ */
{ar:"خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",src:"البخاري ٥٠٢٧",cat:"القرآن"},
{ar:"اقْرَؤُوا الْقُرْآنَ فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعاً لأَصْحَابِهِ",src:"مسلم ٨٠٤",cat:"القرآن"},
{ar:"مَثَلُ الَّذِي يَقْرَأُ الْقُرْآنَ وَهُوَ حَافِظٌ لَهُ مَعَ السَّفَرَةِ الْكِرَامِ الْبَرَرَةِ، وَمَثَلُ الَّذِي يَقْرَأُ وَهُوَ يَتَعَاهَدُهُ وَهُوَ عَلَيْهِ شَدِيدٌ فَلَهُ أَجْرَانِ",src:"متفق عليه",cat:"القرآن"},
{ar:"الَّذِي يَقْرَأُ الْقُرْآنَ وَهُوَ مَاهِرٌ بِهِ مَعَ السَّفَرَةِ الْكِرَامِ",src:"البخاري ٤٩٣٧",cat:"القرآن"},
{ar:"تَعَلَّمُوا سُورَةَ الْبَقَرَةِ، فَإِنَّ أَخْذَهَا بَرَكَةٌ، وَتَرْكَهَا حَسْرَةٌ، وَلا تَسْتَطِيعُهَا الْبَطَلَةُ",src:"مسلم ٨٠٤",cat:"القرآن"},
/* ══ الأخلاق ══ */
{ar:"الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",src:"البخاري ١٠",cat:"الأخلاق"},
{ar:"إِنَّ مِنْ أَخْيَرِكُمْ أَحْسَنَكُمْ خُلُقاً",src:"متفق عليه",cat:"الأخلاق"},
{ar:"أَكْمَلُ الْمُؤْمِنِينَ إِيمَاناً أَحْسَنُهُمْ خُلُقاً",src:"أبو داود ٤٦٨٢ — صحيح",cat:"الأخلاق"},
{ar:"لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ",src:"متفق عليه",cat:"الأخلاق"},
{ar:"لا تَغْضَبْ وَلَكَ الْجَنَّةُ",src:"الطبراني — حسن",cat:"الأخلاق"},
{ar:"إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ وَيُعْطِي عَلَى الرِّفْقِ مَا لا يُعْطِي عَلَى الْعُنْفِ",src:"مسلم ٢٥٩٣",cat:"الأخلاق"},
{ar:"لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",src:"متفق عليه",cat:"الأخلاق"},
{ar:"الْمُؤْمِنُ مِرْآةُ الْمُؤْمِنِ",src:"أبو داود ٤٩١٨ — حسن",cat:"الأخلاق"},
{ar:"مَنْ لَمْ يَشْكُرِ النَّاسَ لَمْ يَشْكُرِ اللَّهَ",src:"أبو داود ٤٨١١ — صحيح",cat:"الأخلاق"},
{ar:"الْحَيَاءُ لا يَأْتِي إِلَّا بِخَيْرٍ",src:"متفق عليه",cat:"الأخلاق"},
/* ══ العلم ══ */
{ar:"طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ",src:"ابن ماجه ٢٢٤ — صحيح",cat:"العلم"},
{ar:"مَنْ سَلَكَ طَرِيقاً يَلْتَمِسُ فِيهِ عِلْماً سَهَّلَ اللَّهُ لَهُ طَرِيقاً إِلَى الْجَنَّةِ",src:"مسلم ٢٦٩٩",cat:"العلم"},
{ar:"إِذَا مَاتَ الإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلا مِنْ ثَلاثَةٍ: إِلا مِنْ صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ",src:"مسلم ١٦٣١",cat:"العلم"},
{ar:"مَنْ يُرِدِ اللَّهُ بِهِ خَيْراً يُفَقِّهْهُ فِي الدِّينِ",src:"متفق عليه",cat:"العلم"},
{ar:"فَضْلُ الْعَالِمِ عَلَى الْعَابِدِ كَفَضْلِ الْقَمَرِ لَيْلَةَ الْبَدْرِ عَلَى سَائِرِ الْكَوَاكِبِ",src:"أبو داود ٣٦٤١ — صحيح",cat:"العلم"},
/* ══ الصيام ══ */
{ar:"مَنْ صَامَ رَمَضَانَ إِيمَاناً وَاحْتِسَاباً غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ",src:"متفق عليه",cat:"الصيام"},
{ar:"الصِّيَامُ جُنَّةٌ",src:"البخاري ١٨٩٤",cat:"الصيام"},
{ar:"مَنْ لَمْ يَدَعْ قَوْلَ الزُّورِ وَالْعَمَلَ بِهِ فَلَيْسَ لِلَّهِ حَاجَةٌ فِي أَنْ يَدَعَ طَعَامَهُ وَشَرَابَهُ",src:"البخاري ١٩٠٣",cat:"الصيام"},
{ar:"لِلصَّائِمِ فَرْحَتَانِ: فَرْحَةٌ عِنْدَ فِطْرِهِ، وَفَرْحَةٌ عِنْدَ لِقَاءِ رَبِّهِ",src:"متفق عليه",cat:"الصيام"},
{ar:"رُبَّ صَائِمٍ لَيْسَ لَهُ مِنْ صِيَامِهِ إِلَّا الْجُوعُ",src:"ابن ماجه — صحيح",cat:"الصيام"},
/* ══ الزكاة والصدقة ══ */
{ar:"مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ",src:"مسلم ٢٥٨٨",cat:"الصدقة"},
{ar:"ابْتَغُوا الرِّزْقَ بِالصَّدَقَةِ",src:"البيهقي — حسن",cat:"الصدقة"},
{ar:"تَصَدَّقُوا وَلَوْ بِشِقِّ تَمْرَةٍ",src:"متفق عليه",cat:"الصدقة"},
{ar:"كُلُّ مَعْرُوفٍ صَدَقَةٌ",src:"متفق عليه",cat:"الصدقة"},
{ar:"أَفْضَلُ الصَّدَقَةِ أَنْ تَصَدَّقَ وَأَنْتَ صَحِيحٌ شَحِيحٌ",src:"متفق عليه",cat:"الصدقة"},
/* ══ الدعاء والذكر ══ */
{ar:"الدُّعَاءُ هُوَ الْعِبَادَةُ",src:"أبو داود ١٤٧٩ — صحيح",cat:"الدعاء"},
{ar:"مَنْ لَمْ يَسْأَلِ اللَّهَ يَغْضَبْ عَلَيْهِ",src:"الترمذي ٣٣٧٣ — صحيح",cat:"الدعاء"},
{ar:"أَقْرَبُ مَا يَكُونُ الْعَبْدُ مِنْ رَبِّهِ وَهُوَ سَاجِدٌ",src:"مسلم ٤٨٢",cat:"الدعاء"},
{ar:"أَلَا أَدُلُّكَ عَلَى مَا هُوَ أَكْثَرُ مِنْ ذِكْرِ اللَّهِ اللَّيْلَ وَالنَّهَارَ؟ تَقُولُ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",src:"حسن",cat:"الذكر"},
{ar:"كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",src:"متفق عليه",cat:"الذكر"},
{ar:"مَنْ قَالَ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، مِئَةَ مَرَّةٍ فِي الْيَوْمِ كَانَتْ لَهُ عِدْلَ عَشْرِ رِقَابٍ",src:"متفق عليه",cat:"الذكر"},
/* ══ البر والصلة ══ */
{ar:"رِضَا اللَّهِ فِي رِضَا الْوَالِدَيْنِ، وَسَخَطُ اللَّهِ فِي سَخَطِ الْوَالِدَيْنِ",src:"الترمذي ١٨٩٩ — صحيح",cat:"الوالدان"},
{ar:"الْجَنَّةُ تَحْتَ أَقْدَامِ الأُمَّهَاتِ",src:"النسائي — صحيح",cat:"الوالدان"},
{ar:"مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ وَيُنْسَأَ لَهُ فِي أَثَرِهِ فَلْيَصِلْ رَحِمَهُ",src:"متفق عليه",cat:"الصلة"},
{ar:"لا يَدْخُلُ الْجَنَّةَ قَاطِعٌ",src:"متفق عليه",cat:"الصلة"},
{ar:"لَيْسَ الْوَاصِلُ بِالْمُكَافِئِ، وَلَكِنِ الْوَاصِلُ الَّذِي إِذَا قُطِعَتْ رَحِمُهُ وَصَلَهَا",src:"البخاري ٥٩٩١",cat:"الصلة"},
/* ══ التوبة والاستغفار ══ */
{ar:"التَّائِبُ مِنَ الذَّنْبِ كَمَنْ لا ذَنْبَ لَهُ",src:"ابن ماجه ٤٢٥٠ — حسن",cat:"التوبة"},
{ar:"إِنَّ اللَّهَ يَقْبَلُ تَوْبَةَ الْعَبْدِ مَا لَمْ يُغَرْغِرْ",src:"الترمذي ٣٥٣٧ — حسن",cat:"التوبة"},
{ar:"وَاللَّهِ إِنِّي لَأَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ فِي الْيَوْمِ أَكْثَرَ مِنْ سَبْعِينَ مَرَّةً",src:"البخاري ٦٣٠٧",cat:"التوبة"},
{ar:"مَنْ أَكْثَرَ الاسْتِغْفَارَ جَعَلَ اللَّهُ لَهُ مِنْ كُلِّ ضِيقٍ مَخْرَجاً",src:"أبو داود ١٥١٨ — صحيح",cat:"التوبة"},
/* ══ الجنة والنار ══ */
{ar:"حُفَّتِ الْجَنَّةُ بِالْمَكَارِهِ، وَحُفَّتِ النَّارُ بِالشَّهَوَاتِ",src:"مسلم ٢٨٢٢",cat:"الآخرة"},
{ar:"مَنْ خَافَ أَدْلَجَ، وَمَنْ أَدْلَجَ بَلَغَ الْمَنْزِلَ",src:"الترمذي — حسن",cat:"الآخرة"},
{ar:"يَقُولُ اللَّهُ تَعَالَى: أَعْدَدْتُ لِعِبَادِيَ الصَّالِحِينَ مَا لَا عَيْنٌ رَأَتْ وَلَا أُذُنٌ سَمِعَتْ",src:"متفق عليه",cat:"الآخرة"},
{ar:"أَلَيْسَ فِي أَصْحَابِ الصُّرَاطِ مَنْ يَقُولُ رَبِّي رَبِّي",src:"متفق عليه",cat:"الآخرة"},
/* ══ المعاملات ══ */
{ar:"التَّاجِرُ الصَّدُوقُ الأَمِينُ مَعَ النَّبِيِّينَ وَالصِّدِّيقِينَ وَالشُّهَدَاءِ",src:"الترمذي ١٢٠٩ — صحيح",cat:"المعاملات"},
{ar:"رَحِمَ اللَّهُ رَجُلاً سَمْحاً إِذَا بَاعَ وَإِذَا اشْتَرَى وَإِذَا اقْتَضَى",src:"البخاري ٢٠٧٦",cat:"المعاملات"},
{ar:"مَنْ غَشَّنَا فَلَيْسَ مِنَّا",src:"مسلم ١٠٢",cat:"المعاملات"},
/* ══ فضائل ══ */
{ar:"مَنْ قَرَأَ آيَةَ الْكُرْسِيِّ دُبُرَ كُلِّ صَلاةٍ مَكْتُوبَةٍ لَمْ يَمْنَعْهُ مِنَ الْجَنَّةِ إِلَّا أَنْ يَمُوتَ",src:"النسائي — صحيح",cat:"الفضائل"},
{ar:"مَنْ قَرَأَ سُورَةَ الإِخْلاصِ عَشْرَ مَرَّاتٍ بَنَى اللَّهُ لَهُ بَيْتاً فِي الْجَنَّةِ",src:"أحمد — صحيح",cat:"الفضائل"},
{ar:"مَنْ صَلَّى عَلَيَّ وَاحِدَةً صَلَّى اللَّهُ عَلَيْهِ عَشْراً",src:"مسلم ٤٠٨",cat:"الفضائل"},
{ar:"مَنْ قَالَ سُبْحَانَ اللَّهِ الْعَظِيمِ وَبِحَمْدِهِ غُرِسَتْ لَهُ نَخْلَةٌ فِي الْجَنَّةِ",src:"الترمذي ٣٤٦٤ — صحيح",cat:"الفضائل"},
/* ══ الصحة والجسد ══ */
{ar:"الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ",src:"مسلم ٢٦٦٤",cat:"الصحة"},
{ar:"نِعْمَتَانِ مَغْبُونٌ فِيهِمَا كَثِيرٌ مِنَ النَّاسِ: الصِّحَّةُ وَالْفَرَاغُ",src:"البخاري ٦٤١٢",cat:"الصحة"},
{ar:"مَا مَلَأَ ابْنُ آدَمَ وِعَاءً شَرّاً مِنْ بَطْنٍ",src:"الترمذي ٢٣٨٠ — صحيح",cat:"الصحة"},
/* ══ المجتمع والجماعة ══ */
{ar:"الْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضاً",src:"متفق عليه",cat:"الأخوة"},
{ar:"مَثَلُ الْمُؤْمِنِينَ فِي تَوَادِّهِمْ وَتَرَاحُمِهِمْ وَتَعَاطُفِهِمْ كَمَثَلِ الْجَسَدِ الْوَاحِدِ",src:"متفق عليه",cat:"الأخوة"},
{ar:"يَدُ اللَّهِ مَعَ الْجَمَاعَةِ",src:"الترمذي ٢١٦٦ — صحيح",cat:"الأخوة"},
{ar:"لا تَبَاغَضُوا وَلَا تَحَاسَدُوا وَلَا تَدَابَرُوا وَكُونُوا عِبَادَ اللَّهِ إِخْوَاناً",src:"متفق عليه",cat:"الأخوة"},
/* ══ الليل والنوافل ══ */
{ar:"أَفْضَلُ الصَّلاةِ بَعْدَ الْفَرِيضَةِ صَلاةُ اللَّيْلِ",src:"مسلم ١١٦٣",cat:"النوافل"},
{ar:"يَنْزِلُ رَبُّنَا تَبَارَكَ وَتَعَالَى كُلَّ لَيْلَةٍ إِلَى السَّمَاءِ الدُّنْيَا حِينَ يَبْقَى ثُلُثُ اللَّيْلِ الآخِرُ",src:"متفق عليه",cat:"النوافل"},
{ar:"رَكْعَتَانِ مِنَ الْفَجْرِ خَيْرٌ مِنَ الدُّنْيَا وَمَا فِيهَا",src:"مسلم ٧٢٥",cat:"النوافل"},
/* ══ الاقتصاد والرزق ══ */
{ar:"لَوْ تَوَكَّلْتُمْ عَلَى اللَّهِ حَقَّ تَوَكُّلِهِ لَرَزَقَكُمْ كَمَا يَرْزُقُ الطَّيْرَ",src:"الترمذي ٢٣٤٤ — صحيح",cat:"الرزق"},
{ar:"اطْلُبُوا الرِّزْقَ فِي خَبَايَا الأَرْضِ",src:"الطبراني — حسن",cat:"الرزق"},
{ar:"مَا أَكَلَ أَحَدٌ طَعَاماً قَطُّ خَيْراً مِنْ أَنْ يَأْكُلَ مِنْ عَمَلِ يَدِهِ",src:"البخاري ٢٠٧٢",cat:"الرزق"},
/* ══ الصبر والبلاء ══ */
{ar:"مَا يُصِيبُ الْمُسْلِمَ مِنْ نَصَبٍ وَلَا وَصَبٍ وَلَا هَمٍّ وَلَا حُزْنٍ وَلَا أَذىً وَلَا غَمٍّ حَتَّى الشَّوْكَةِ يُشَاكُهَا إِلَّا كَفَّرَ اللَّهُ بِهَا مِنْ خَطَايَاهُ",src:"متفق عليه",cat:"الصبر"},
{ar:"عَجَباً لأَمْرِ الْمُؤْمِنِ إِنَّ أَمْرَهُ كُلَّهُ خَيْرٌ",src:"مسلم ٢٩٩٩",cat:"الصبر"},
{ar:"إِنَّ عِظَمَ الْجَزَاءِ مَعَ عِظَمِ الْبَلاءِ",src:"الترمذي ٢٣٩٦ — صحيح",cat:"الصبر"},
{ar:"مَا أُعْطِيَ أَحَدٌ عَطَاءً خَيْراً وَأَوْسَعَ مِنَ الصَّبْرِ",src:"متفق عليه",cat:"الصبر"},
/* ══ الأمانة والصدق ══ */
{ar:"عَلَيْكُمْ بِالصِّدْقِ فَإِنَّ الصِّدْقَ يَهْدِي إِلَى الْبِرِّ وَإِنَّ الْبِرَّ يَهْدِي إِلَى الْجَنَّةِ",src:"متفق عليه",cat:"الصدق"},
{ar:"آيَةُ الْمُنَافِقِ ثَلاثٌ: إِذَا حَدَّثَ كَذَبَ، وَإِذَا وَعَدَ أَخْلَفَ، وَإِذَا اؤْتُمِنَ خَانَ",src:"متفق عليه",cat:"الصدق"},
{ar:"أَدِّ الأَمَانَةَ إِلَى مَنِ ائْتَمَنَكَ، وَلَا تَخُنْ مَنْ خَانَكَ",src:"الترمذي ١٢٦٤ — حسن",cat:"الأمانة"},
/* ══ الخوف والرجاء ══ */
{ar:"أَنَا عِنْدَ ظَنِّ عَبْدِي بِي",src:"متفق عليه",cat:"الرجاء"},
{ar:"لَوْ يَعْلَمُ الْمُؤْمِنُ مَا عِنْدَ اللَّهِ مِنَ الْعُقُوبَةِ مَا طَمِعَ فِي جَنَّتِهِ أَحَدٌ، وَلَوْ يَعْلَمُ الْكَافِرُ مَا عِنْدَ اللَّهِ مِنَ الرَّحْمَةِ مَا قَنَطَ مِنْ رَحْمَتِهِ أَحَدٌ",src:"مسلم ٢٧٥٥",cat:"الرجاء"},
/* ══ السيرة ══ */
{ar:"كَانَ خُلُقُهُ الْقُرْآنَ",src:"مسلم ٧٤٦ — وصف عائشة",cat:"السيرة"},
{ar:"بُعِثْتُ لأُتَمِّمَ مَكَارِمَ الأَخْلاقِ",src:"أحمد — صحيح",cat:"السيرة"},
{ar:"أَنَا سَيِّدُ وَلَدِ آدَمَ يَوْمَ الْقِيَامَةِ وَلا فَخْرَ",src:"الترمذي ٣٦١٥ — صحيح",cat:"السيرة"},
];

const MORNING_DUAS=[
  {t:"الاستيقاظ من النوم",ar:"الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",src:"البخاري ٦٣١٢"},
  {t:"أذكار الصباح",ar:"أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",src:"مسلم ٢٧٢٣"},
  {t:"سيد الاستغفار",ar:"اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي، فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",src:"البخاري ٦٣٠٦ — أفضل الاستغفار"},
  {t:"التسبيح",ar:"سُبْحَانَ اللَّهِ وَبِحَمْدِهِ — مئة مرة",src:"مسلم ٢٦٩٢"},
  {t:"الدعاء بالعافية",ar:"اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ",src:"ابن ماجه ٣٨٧١ — صحيح"},
];
const EVENING_DUAS=[
  {t:"أذكار المساء",ar:"أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",src:"مسلم ٢٧٢٣"},
  {t:"التعوذ عند المساء",ar:"أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",src:"مسلم ٢٧٠٨"},
  {t:"قبل النوم",ar:"بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",src:"البخاري ٦٣٢٤"},
  {t:"آية الكرسي",ar:"اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ",src:"البقرة: ٢٥٥ — قبل النوم"},
  {t:"الكفارة",ar:"سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ لَا إِلَهَ إِلَّا أَنْتَ أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ",src:"الترمذي ٣٤٣٣ — صحيح"},
];




// ── Tafseer ──
function initWird(){
  const day=Math.floor(Date.now()/(1000*60*60*24));
  const ayah=WIRD_AYAHS[day%WIRD_AYAHS.length];
  const hadith=WIRD_HADITHS[day%WIRD_HADITHS.length];
  const at=document.getElementById('w-ayah-txt');
  const ar=document.getElementById('w-ayah-ref');
  if(at)at.textContent=ayah.ar;
  if(ar)ar.textContent=ayah.ref;
  const ht=document.getElementById('w-hadith-txt');
  const hs=document.getElementById('w-hadith-src');
  if(ht)ht.textContent=hadith.ar;
  if(hs)hs.textContent=hadith.src;
  const md=document.getElementById('morning-duas');
  if(md)md.innerHTML=MORNING_DUAS.map(d=>`<div class="adhkar-card"><div class="adhkar-ttl">${d.t}</div><div class="adhkar-ar">${d.ar}</div><div class="adhkar-src">📚 ${d.src}</div></div>`).join('');
  const ed=document.getElementById('evening-duas');
  if(ed)ed.innerHTML=EVENING_DUAS.map(d=>`<div class="adhkar-card"><div class="adhkar-ttl">${d.t}</div><div class="adhkar-ar">${d.ar}</div><div class="adhkar-src">📚 ${d.src}</div></div>`).join('');
}

function switchWird(tab,btn){
  document.querySelectorAll('.wird-section').forEach(s=>s.classList.remove('on'));
  document.querySelectorAll('.wird-ntab,.wird-tab').forEach(b=>b.classList.remove('on'));
  document.getElementById('ws-'+tab)?.classList.add('on');
  btn.classList.add('on');
  if(tab==='dua')renderDuas();
}
function renderDuas(){
  [['صباح','morning'],['مساء','evening'],['دعاء عام','general']].forEach(([time,id])=>{
    var d=getUniqueDua(time);if(!d)return;
    var t=document.getElementById('dua-'+id+'-text');
    var r=document.getElementById('dua-'+id+'-ref');
    if(t)t.textContent=d.text;if(r)r.textContent='📚 '+d.ref;
  });
}
function nextDua(time){
  var idMap={'صباح':'morning','مساء':'evening','دعاء عام':'general'};
  var id='dua-'+idMap[time];
  var d=getUniqueDua(time);if(!d)return;
  var t=document.getElementById(id+'-text');
  var r=document.getElementById(id+'-ref');
  if(t){t.style.opacity='0';setTimeout(()=>{t.textContent=d.text;t.style.opacity='1';},180);}
  if(r)r.textContent='📚 '+d.ref;
  if(navigator.vibrate)navigator.vibrate(12);
}

// ── Tafseer ──
async function openTafseer(surahN,ayahN,ayahTxt){
  const mod=document.getElementById('tafseer-mod');
  const cnt=document.getElementById('tafseer-content');
  if(!mod||!cnt)return;
  mod.classList.add('on');
  document.body.style.overflow='hidden';
  cnt.innerHTML=`<div class="tafseer-ayah-txt">${ayahTxt}</div><div class="tafseer-lbl">📖 التفسير الميسّر</div><div class="ldbox"><div class="spinner"></div>جارٍ تحميل التفسير...</div>`;
  try{
    const r=await HudaQuran.fetch(`https://api.alquran.cloud/v1/ayah/${surahN}:${ayahN}/editions/ar.muyassar`);
    const d=await r.json();
    const txt=d.data?.[0]?.text||d.data?.text||'لم يتوفر التفسير';
    cnt.innerHTML=`
      <div class="tafseer-lbl">🔖 سورة ${document.getElementById('slist')?.querySelector('.si.on .si-ar')?.textContent||''} — آية ${ayahN}</div>
      <div class="tafseer-ayah-txt">${ayahTxt}</div>
      <div class="tafseer-lbl">📖 التفسير الميسّر</div>
      <div class="tafseer-txt">${txt}</div>`;
  }catch(e){
    cnt.innerHTML=`<div class="tafseer-ayah-txt">${ayahTxt}</div><p style="color:var(--tm);text-align:center;padding:1rem">⚠ تعذّر تحميل التفسير — تحقق من الاتصال</p>`;
  }
}

// ══ NOTIFICATIONS + ADHAN ══
let notifGranted2=false;
const PRAYER_AR_NAMES={fajr:'الفجر 🌙',dhuhr:'الظهر ☀️',asr:'العصر 🌤',maghrib:'المغرب 🌇',isha:'العشاء 🌃'};

// closePrayerToast removed

// Override or extend notification check
// in-app prayer toast removed


// ═══════════════════════════════
// SERVICE WORKER — Background Notifications
// ═══════════════════════════════
// تسجيل الـ Service Worker الوحيد موجود في js/pwa.js

function schedulePrayerNotifs(reg){
  const pt=window.prayerTimes;if(!pt||!reg?.active)return;
  const now=new Date();
  function d2ms(dec){if(!dec||isNaN(dec))return null;let t=((dec%24)+24)%24;const h=Math.floor(t),m=Math.floor((t-h)*60);const d=new Date(now.getFullYear(),now.getMonth(),now.getDate(),h,m,0);return d.getTime();}
  Object.entries(PRAYER_AR_NAMES).forEach(([k,nm])=>{
    const ms=d2ms(pt[k]);if(!ms||ms<Date.now())return;
    reg.active.postMessage({type:'SCHEDULE_PRAYER',name:nm,time:ms,key:k+'-'+now.toDateString()});
  });
}

async function reqNotifV8(){
  if(!('Notification' in window)){alert('متصفحك لا يدعم الإشعارات');return;}
  const p=await Notification.requestPermission();
  if(p==='granted'){
    notifGranted2=true;
    // Schedule for current day's prayers
    if(window._swReg)schedulePrayerNotifs(window._swReg);
    new Notification('هُدى القرآن 🌙',{
      body:'✅ ستصلك تنبيهات مواقيت الصلاة إن شاء الله',
      icon:'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><text y="28" font-size="28">🕌</text></svg>'
    });
  }
  return p;
}

// Attach to existing notif button if present
['fab-notif','notifBtn'].forEach(id=>{
  const el=document.getElementById(id);
  if(el)el.onclick=reqNotifV8;
});

// ═══════════════════════════════

// ── Multi-Sheikh Adhan System ──
// ══ REAL ADHAN AUDIO — actual prayer calls, NOT Quran recitation ══
const ADHAN_SHEIKHS = [
  {
    name:'أذان مكة المكرمة 🕋',
    sub:'المسجد الحرام',
    icon:'🕋',
    urls:[
      'https://islamicfinder.b-cdn.net/iPhoneApp/prayer/adhan_Makkah.mp3',
      'https://audio.islamweb.net/audio/Adhans/makkah.mp3',
      'https://www.islamcan.com/audio/adhan/azan1.mp3'
    ]
  },
  {
    name:'أذان المدينة المنورة 🕌',
    sub:'المسجد النبوي',
    icon:'🕌',
    urls:[
      'https://islamicfinder.b-cdn.net/iPhoneApp/prayer/adhan_Madinah.mp3',
      'https://audio.islamweb.net/audio/Adhans/madinah.mp3',
      'https://www.islamcan.com/audio/adhan/azan4.mp3'
    ]
  },
  {
    name:'أذان مصري 🇪🇬',
    urls:[
      'https://audio.islamweb.net/audio/Adhans/egyptian.mp3',
      'https://www.islamcan.com/audio/adhan/azan2.mp3'
    ]
  },
  {
    name:'أذان تركي 🌙',
    urls:[
      'https://www.islamcan.com/audio/adhan/azan3.mp3',
      'https://www.islamcan.com/audio/adhan/azan5.mp3'
    ]
  }
];
let adhanSheikhIdx = 0;
function cycleAdhanSheikh(){
  adhanSheikhIdx = (adhanSheikhIdx + 1) % ADHAN_SHEIKHS.length;
  const s = ADHAN_SHEIKHS[adhanSheikhIdx];
  const btn = document.getElementById('adhan-sheikh-btn');
  if(btn) btn.textContent = s.name;
}
window.playAdhanNow = function(){
  if(navigator.vibrate) navigator.vibrate([400,200,400,200,600,200,400]);
  const sheikh = ADHAN_SHEIKHS[adhanSheikhIdx];
  const urls = [...sheikh.urls];
  if(!adhanAud) adhanAud = new Audio();
  adhanAud.pause();
  tryNext();
  closePrayerToast();
};

// INIT V8
// ═══════════════════════════════
// Check existing notif permission
if(Notification?.permission==='granted'){
  notifGranted2=true;
  setTimeout(()=>{if(window._swReg)schedulePrayerNotifs(window._swReg);},3000);
}
// Init tasbeeh if already on page
if(document.getElementById('t-circle'))initTasbeeh();




// ════════════════════════════════════════════════
// V7 FEATURES — BOYKA EDITION 🚀
// ════════════════════════════════════════════════

// ── NAV: Add Wird ──
// nav buttons already in HTML

// ── Dark Mode ──

// ══ ADHAN SHEIKH SELECTOR ══
// ══ Adhan Sheikh Selector ══
window.selectAdhanSheikh = function(idx){
  idx = parseInt(idx, 10) || 0;
  if (idx < 0) idx = 0;
  if (idx > 3) idx = 3;
  adhanSheikhIdx = idx;
  window._selectedAdhanIdx = idx;
  try { localStorage.setItem('nq_adhan_idx', String(idx)); } catch(e){}
  // بطاقات الصفحة الرئيسية (adhan-mc)
  document.querySelectorAll('#adhan2-grid .adhan-mc, .adhan-mc').forEach(function(el){
    var ci = parseInt(el.getAttribute('data-idx'), 10);
    el.classList.toggle('on', ci === idx);
    el.classList.remove('playing');
  });
  // بطاقات قديمة إن وُجدت
  document.querySelectorAll('.adhan-card').forEach(function(el,i){
    el.classList.toggle('on', i === idx);
    el.classList.remove('playing');
  });
  // قائمة الإعدادات
  var sel = document.getElementById('ss-adhan-sel');
  if (sel) sel.value = String(idx);
  var names = ['مكة المكرمة','المدينة المنورة','أذان مصري','أذان تركي'];
  if (typeof showToast === 'function') showToast('المؤذن: ' + (names[idx] || ''));
};
window.stopAdhan = function(){
  if(adhanAud){adhanAud.pause();adhanAud.currentTime=0;}
  document.querySelectorAll('.adhan-card').forEach(el=>el.classList.remove('playing'));
};
// Override playAdhanNow to add visual card feedback
window.playAdhanNow = function(){
  try { if (typeof stopAdhan === 'function') stopAdhan(); } catch(e){}
  var idx = (typeof window._selectedAdhanIdx === 'number') ? window._selectedAdhanIdx
    : (typeof adhanSheikhIdx === 'number' ? adhanSheikhIdx : 0);
  try { idx = parseInt(localStorage.getItem('nq_adhan_idx') || idx, 10) || 0; } catch(e){}
  adhanSheikhIdx = idx;
  window._selectedAdhanIdx = idx;
  var map = ['makkah','madinah','misri','turki'];
  var key = map[idx] || 'makkah';
  var urls = [];
  if (typeof ADHAN_URLS !== 'undefined' && ADHAN_URLS[key]) {
    urls = ADHAN_URLS[key].slice();
  } else if (typeof ADHAN_SHEIKHS !== 'undefined' && ADHAN_SHEIKHS[idx]) {
    urls = (ADHAN_SHEIKHS[idx].urls || []).slice();
  } else {
    urls = ['https://www.islamcan.com/audio/adhan/azan1.mp3'];
  }
  if (!adhanAud) adhanAud = new Audio();
  adhanAud.pause();
  document.querySelectorAll('.adhan-mc, .adhan-card').forEach(function(el){ el.classList.remove('playing'); });
  var card = document.querySelector('.adhan-mc[data-idx="'+idx+'"], .adhan-card[data-idx="'+idx+'"]');
  if (card) card.classList.add('playing');
  adhanAud.onended = function(){ if (card) card.classList.remove('playing'); };
  function tryNext(){
    if (!urls.length) { if (typeof showToast==='function') showToast('تعذّر تشغيل الأذان'); return; }
    adhanAud.src = urls.shift();
    adhanAud.volume = 1;
    adhanAud.play().catch(function(){ tryNext(); });
  }
  tryNext();
  if (typeof closePrayerToast === 'function') closePrayerToast();
};




// ══ QIBLA ══

// ══ QIBLA CALCULATOR ══

/* ═══ LIVE QIBLA SYSTEM ═══ */
let _qBearing = null;   // GPS bearing to Kaaba
let _qLive = false;     // live compass active
let _tsbTouch = 0;      // tasbeeh touch timestamp (used by circle element)

function calcQibla(){
  const st = document.getElementById('qibla-status');
  const sb = document.querySelector('.qibla-status-bar');
  if(st) st.textContent = 'جارٍ تحديد موقعك بـ GPS...';
  if(!navigator.geolocation){
    if(st) st.textContent = 'الجهاز لا يدعم GPS';
    return;
  }
  navigator.geolocation.getCurrentPosition(pos=>{
    _applyGPS(pos.coords.latitude, pos.coords.longitude);
    document.getElementById('qibla-tip').style.display='block';
    if(sb) sb.classList.add('found');
  }, ()=>{
    if(st) st.textContent = 'تعذّر تحديد الموقع — تحقق من الإذن';
  },{enableHighAccuracy:true,timeout:12000});
}

function _applyGPS(lat, lng){
  const kLat=21.4225, kLng=39.8262;
  const dLng=(kLng-lng)*Math.PI/180;
  const lat1=lat*Math.PI/180, lat2=kLat*Math.PI/180;
  const y=Math.sin(dLng)*Math.cos(lat2);
  const x=Math.cos(lat1)*Math.sin(lat2)-Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLng);
  let b=Math.atan2(y,x)*180/Math.PI;
  _qBearing=(b+360)%360;

  const R=6371;
  const dLat=(kLat-lat)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLng/2)**2;
  const dist=Math.round(R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a)));

  document.getElementById('qibla-degree').textContent=Math.round(_qBearing)+'°';
  document.getElementById('qibla-dist').textContent=dist.toLocaleString('ar')+' كم';
  document.getElementById('qibla-status').textContent=
    'القبلة '+_qBearing.toFixed(1)+'° من الشمال | '+lat.toFixed(2)+'°، '+lng.toFixed(2)+'°';

  if(!_qLive){
    const d=document.getElementById('qibla-dial');
    if(d) d.style.transform='rotate('+_qBearing+'deg)';
  }
}

async function startLiveQibla(){
  const btn=document.getElementById('qibla-live-btn');
  const st=document.getElementById('qibla-status');
  if(_qLive){ stopLiveQibla(); return; }

  if(st) st.textContent='📍 جارٍ تحديد موقعك...';
  if(btn){ btn.textContent='⏳ جارٍ التفعيل...'; btn.disabled=true; }

  navigator.geolocation.getCurrentPosition(async pos=>{
    _applyGPS(pos.coords.latitude, pos.coords.longitude);

    try{
      if(typeof DeviceOrientationEvent!=='undefined' &&
         typeof DeviceOrientationEvent.requestPermission==='function'){
        const perm=await DeviceOrientationEvent.requestPermission();
        if(perm!=='granted'){ _fallbackNoCompass(); if(btn){btn.disabled=false;} return; }
      }
      _startOrientation();
      if(btn){ btn.textContent='🔴 إيقاف البوصلة'; btn.classList.add('active'); btn.disabled=false; }
      document.getElementById('qibla-compass').classList.add('live');
      document.getElementById('qibla-tip').style.display='block';
      if(st) st.textContent='البوصلة الحية تعمل — حرّك هاتفك نحو القبلة';
    }catch(e){
      _fallbackNoCompass();
      if(btn){btn.disabled=false;}
    }
  }, ()=>{
    if(st) st.textContent='تعذّر تحديد الموقع';
    if(btn){ btn.textContent='🧭 تفعيل البوصلة الحية'; btn.disabled=false; }
  },{enableHighAccuracy:true,timeout:12000});
}

function _startOrientation(){
  _qLive=true;
  window.addEventListener('deviceorientationabsolute',_onOrient,true);
  window.addEventListener('deviceorientation',_onOrient,true);
}

function _onOrient(e){
  if(_qBearing===null) return;
  let h=0;
  if(e.absolute && e.alpha!==null){
    h=360-e.alpha;
  } else if(typeof e.webkitCompassHeading!=='undefined' && e.webkitCompassHeading!==null){
    h=e.webkitCompassHeading;
  } else if(e.alpha!==null){
    h=360-e.alpha;
  } else return;

  const rot=(_qBearing-h+360)%360;
  const d=document.getElementById('qibla-dial');
  if(d) d.style.transform='rotate('+rot+'deg)';

  const aligned=(rot<12||rot>348);
  const c=document.getElementById('qibla-compass');
  if(c){ c.classList.toggle('aligned',aligned); }
  const st=document.getElementById('qibla-status');
  if(aligned && st) st.textContent='✅ أنت تواجه القبلة الآن!';
  else if(st) st.textContent='البوصلة تعمل — '+Math.round(_qBearing)+'° من الشمال';
}

function stopLiveQibla(){
  _qLive=false;
  window.removeEventListener('deviceorientationabsolute',_onOrient,true);
  window.removeEventListener('deviceorientation',_onOrient,true);
  document.getElementById('qibla-compass')?.classList.remove('live','aligned');
  const btn=document.getElementById('qibla-live-btn');
  if(btn){ btn.textContent='🧭 تفعيل البوصلة الحية'; btn.classList.remove('active'); }
  const st=document.getElementById('qibla-status');
  if(st) st.textContent='توقفت البوصلة. اضغط للتفعيل مجدداً.';
}

function _fallbackNoCompass(){
  const st=document.getElementById('qibla-status');
  if(st) st.textContent='✅ GPS محدد — جهازك لا يدعم البوصلة التلقائية';
  const btn=document.getElementById('qibla-live-btn');
  if(btn){ btn.textContent='🧭 تفعيل البوصلة الحية'; }
}




// ════════════════════════════════════════════════
// MODALS
// ════════════════════════════════════════════════
document.getElementById('rmod').addEventListener('click',e=>{if(e.target===e.currentTarget)closeRM();});
document.getElementById('pmod').addEventListener('click',e=>{if(e.target===e.currentTarget)closePM();});




// ═══════════════════════════════════════════════════════════
// V8 COMPLETE — BOYKA EDITION 🚀
// Tasbeeh + Hisn Al-Muslim + Fixed Audio + 5 New Reciters
// + Background Notifications + Audio Istighfar
// ═══════════════════════════════════════════════════════════

// ── Add Nav Buttons ──
(()=>{
  const nl=document.querySelector('.nlinks');
  if(!nl)return;
  // nav buttons already in HTML
})();

// SP patched in main definition above


// ═══════════════════════════════
// NEW RECITERS — Add to RD array
// ═══════════════════════════════
(()=>{
  const newRecs=[
    {id:'sobhi',     name:'إسلام صبحي',         en:'Islam Sobhi',          country:'🇪🇬 مصر',      style:'إماراتي — عذب وشجي',     ini:'إ ص',bg:'linear-gradient(135deg,#2a1a0d,#180e06)',cl:'#F4A460',base:'https://server6.mp3quran.net/islam_sobhi/',  bio:'قارئ مصري رائع. صوته العذب الشجي لامس قلوب الملايين. بدأ بسن مبكرة وأُثبت موهبته للعالم.',img:'https://www.mp3quran.net/api/img/IslamSobhi.jpg',aw:'من أبرز القراء المصريين الشباب عالمياً'},
    /* mossad removed: no official full-mushaf CDN */
    {id:'hazza',     name:'هزاع البلوشي',        en:'Hazza Al-Balushi',     country:'🇴🇲 عُمان',    style:'عُماني — قوة وأصالة',     ini:'ه ب',bg:'linear-gradient(135deg,#0a1a1a,#060e0e)',cl:'#7AE8E8',base:'https://server8.mp3quran.net/hazza/',         bio:'من أبرز قراء عُمان والخليج. صوته القوي الأصيل يحمل روح الجزيرة العربية الأصيلة.',img:'https://www.mp3quran.net/api/img/Hazza.jpg',aw:'من نجوم التلاوة في الخليج العربي'},
    {id:'idrees',    name:'إدريس أبكر',          en:'Idris Abkar',          country:'🇸🇩 السودان',  style:'أفريقي — رخامة وعمق',     ini:'إ أ',bg:'linear-gradient(135deg,#0a1a0a,#060e06)',cl:'#A8E87A',base:'https://server13.mp3quran.net/idrees/',        bio:'قارئ سوداني متميز. صوته الرخيم العميق يعكس أصالة المدرسة الأفريقية في تلاوة القرآن.',img:'https://www.mp3quran.net/api/img/Idrees.jpg',aw:'من أعرق أصوات التلاوة الأفريقية'},
    {id:'lhdan',     name:'محمد اللحيدان',       en:'Muhammad Al-Luhaidan', country:'🇸🇦 السعودية', style:'سعودي — هدوء واتزان',      ini:'م ل',bg:'linear-gradient(135deg,#1a1a0a,#0e0e06)',cl:'#E8E87A',base:'https://server8.mp3quran.net/lhdan/',          bio:'قارئ سعودي بصوت هادئ متزن. تلاوته المرتلة الواضحة مثالية للاستماع والحفظ.',img:'https://www.mp3quran.net/api/img/Luhaidan.jpg',aw:'من الأصوات السعودية المميزة المعاصرة'}
  ];
  // disabled: RD is clean in app.01
  // Also add fallback URLs
  // Audio fallbacks already set in AUDIO_FALLBACKS above
  // Always re-render to include new reciters
  if(typeof renderReciters==='function')renderReciters();
})();

// ═══════════════════════════════
// AUDIO ENGINE — Web Audio for sounds
// ═══════════════════════════════
let audioCtx=null;
function getACtx(){if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();return audioCtx;}

// Tasbeeh click sound — gentle wood/bead sound
function playBeadSound(){
  try{
    const ctx=getACtx();
    const buf=ctx.createBuffer(1,ctx.sampleRate*.08,ctx.sampleRate);
    const data=buf.getChannelData(0);
    for(let i=0;i<data.length;i++){
      const t=i/ctx.sampleRate;
      data[i]=Math.sin(2*Math.PI*1200*t*Math.exp(-t*45))*.6*Math.exp(-t*50);
    }
    const src=ctx.createBufferSource();src.buffer=buf;
    const gain=ctx.createGain();gain.gain.value=.7;
    src.connect(gain);gain.connect(ctx.destination);
    src.start();
  }catch{}
}

// Complete cycle sound — gentle chime
function playCompleteSound(){
  try{
    const ctx=getACtx();
    [523.25,659.25,783.99,1046.5].forEach((f,i)=>{
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.type='sine';o.frequency.value=f;
      g.gain.setValueAtTime(0,ctx.currentTime+i*.1);
      g.gain.linearRampToValueAtTime(.25,ctx.currentTime+i*.1+.04);
      g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+i*.1+.55);
      o.connect(g);g.connect(ctx.destination);
      o.start(ctx.currentTime+i*.1);o.stop(ctx.currentTime+i*.1+.6);
    });
  }catch{}
}

// Adhan audio — use Mishary Afasy from CDN
const ADHAN_URLS={
  makkah:[
    'https://audio.islamweb.net/audio/Adhans/makkah.mp3',
    'https://www.islamcan.com/audio/adhan/azan1.mp3',
    'https://ia800905.us.archive.org/7/items/AdhanMakkah/AdhanMakkah.mp3'
  ],
  madinah:[
    'https://audio.islamweb.net/audio/Adhans/madinah.mp3',
    'https://www.islamcan.com/audio/adhan/azan4.mp3',
    'https://ia800905.us.archive.org/7/items/AdhanMadinah/AdhanMadinah.mp3'
  ],
  misri:[
    'https://www.islamcan.com/audio/adhan/azan2.mp3',
    'https://audio.islamweb.net/audio/Adhans/egypt.mp3',
    'https://ia800905.us.archive.org/7/items/AdhanMisri/AdhanMisri.mp3'
  ],
  turki:[
    'https://www.islamcan.com/audio/adhan/azan3.mp3',
    'https://audio.islamweb.net/audio/Adhans/turkey.mp3',
    'https://ia800905.us.archive.org/7/items/AdhanTurki/AdhanTurki.mp3'
  ]
};
let adhanAud=null;
function playAdhanNow(){
  if(!adhanAud)adhanAud=new Audio();
  adhanAud.pause();
  // Get selected adhan type from UI
  var selCard=document.querySelector('#adhan2-grid .adhan-mc.on, #adhan2-grid .adhan-mc.playing');
  var adhanKey='makkah';
  if(selCard){
    var d=selCard.getAttribute('data-key')||selCard.id||'';
    if(d.includes('madinah')||d.includes('madina')) adhanKey='madinah';
    else if(d.includes('misri')||d.includes('egypt')) adhanKey='misri';
    else if(d.includes('turki')||d.includes('turk')) adhanKey='turki';
  }
  var urls=[...(ADHAN_URLS[adhanKey]||ADHAN_URLS.makkah)];
  function tryNext(){
    if(!urls.length){ console.warn('All adhan URLs failed'); return; }
    adhanAud.src=urls.shift();
    adhanAud.volume=1.0;
    adhanAud.play().catch(()=>tryNext());
  }
  tryNext();
  closePrayerToast();
}

// ═══════════════════════════════
// ISTIGHFAR AUDIO — Synthesized + Text
// ═══════════════════════════════
const ISTIGHFAR_TEXTS=[
  'أَسْتَغْفِرُ اللَّهَ',
  'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ',
  'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
  'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنتَ التَّوَّابُ الرَّحِيمُ',
  'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ',
];
let istighfarIdx=0;
function cycleIstighfar(){
  istighfarIdx=(istighfarIdx+1)%ISTIGHFAR_TEXTS.length;
  return ISTIGHFAR_TEXTS[istighfarIdx];
}

// ═══════════════════════════════
// TASBEEH (Prayer Beads)
// ═══════════════════════════════
// MODALS + INIT: handled below
// ── Init added features ──
// ════ FULL INIT ════
renderSList();
renderReciters();
renderProphets();
buildLocSelector();
// استعادة الموقع والطريقة المحفوظة
(function(){
  var _sl=localStorage.getItem('saved_lat'),_sng=localStorage.getItem('saved_lng');
  var _sname=localStorage.getItem('saved_loc_name');
  var _method=localStorage.getItem('nq_calc_method');
  if(_method){var em=document.getElementById('calc-method');if(em)em.value=_method;}
  if(_sl&&_sng){
    var _sel=document.getElementById('loc-select');
    if(_sel){var _v=parseFloat(_sl).toFixed(4)+','+parseFloat(_sng).toFixed(4);
      Array.from(_sel.options).forEach(function(o){if(Math.abs(parseFloat(o.value.split(',')[0])-parseFloat(_sl))<0.01)_sel.value=o.value;});}
    if(_sname){var ln=document.getElementById('loc-name');if(ln)ln.textContent=_sname;}
    userLat=parseFloat(_sl);userLng=parseFloat(_sng);
    calcPrayers();
  } else { getLocation(); }
})();
updateDates();
setInterval(function(){
  updateDates();
  updateCountdown();
  // إعادة حساب الأوقات كل ~دقيقة (random لتجنب الضغط على API)
  if(Math.random()<0.017) calcPrayers();
},1000);
// حساب فوري عند البدء
setTimeout(calcPrayers, 2000);
setTimeout(preloadAll,3000);
if(document.getElementById('t-circle')) initTasbeeh();
renderHisnCats();
initWird();
// تهيئة قائمة السور والقراء
renderSList();
renderReciters();
buildLocSelector();
// تهيئة صفحة البداية
(function(){
  var hash = window.location.hash.replace('#','') || 'home';
  // legacy redirects from old URLs
  if(hash==='adhan'){   SP('prayer'); setTimeout(function(){ switchPrayerTab('adhan'); },100); return; }
  if(hash==='reciters'){ SP('quran'); setTimeout(function(){ switchQuranTab('reciters'); },100); return; }
  var validPages = ['home','mushaf','zakat','prayer','quran','wird','hadiths','nawawi','quiz','ai','asma','khatma','qibla','tracker','hijri','seerah','hifz','tajweed','mosques','ramadan','prophets2','fiqh','stats','themes','notifs','notes','favorites','prophets','hisn'];
  var startPage = validPages.indexOf(hash) !== -1 ? hash : 'home';
  SP(startPage, false);
})();
// Set audio volume to max
var _aud=document.getElementById('aud');
if(_aud) _aud.volume=1.0;

// ════════════════════════════════════════════════
// 🤖 AI ISLAMIC ASSISTANT — Claude API Integration
// ════════════════════════════════════════════════
// ════════════════════════════════════════════════
// 🤖 callClaudeAPI — واجهة موحّدة للذكاء الاصطناعي
// ════════════════════════════════════════════════
// ── قاعدة المعرفة الإسلامية ─────────────────────────────
var ISLAMIC_KB = {

  'أسماء الله الحسنى': `أسماء الله الحُسنى تسعة وتسعون اسماً، قال ﷺ: «إنَّ لله تسعةً وتسعين اسماً، مئةً إلا واحدة، من أحصاها دخل الجنة» (متفق عليه).

أبرز الأسماء ومعانيها:
﴿الله﴾ — الاسم الجامع لكل صفات الكمال.
﴿الرحمن﴾ — واسع الرحمة يشمل كل الخلق.
﴿الرحيم﴾ — خاص برحمته للمؤمنين يوم القيامة.
﴿الملك﴾ — مالك الوجود كله.
﴿القدوس﴾ — المنزه عن كل نقص.
﴿السلام﴾ — ذو السلامة من كل عيب.
﴿المؤمن﴾ — يؤمن عباده من عذابه.
﴿العزيز﴾ — الغالب الذي لا يُقهر.
﴿الجبار﴾ — يجبر الضعيف ويقهر العاصي.
﴿المتكبر﴾ — الكبير فوق كل شيء.
﴿الخالق﴾ — موجد الأشياء من العدم.
﴿البارئ﴾ — خالق الخلق على غير مثال.
﴿المصور﴾ — مصور الخلق بما يشاء.
﴿الغفار﴾ — كثير المغفرة للذنوب.
﴿القهار﴾ — قاهر كل شيء.
﴿الوهاب﴾ — كثير العطاء بلا مقابل.
﴿الرزاق﴾ — يرزق كل مخلوق.
﴿الفتاح﴾ — يفتح أبواب الرحمة والرزق.
﴿العليم﴾ — يعلم كل شيء ظاهر وخفي.
﴿القابض﴾ — يقبض الأرواح والأرزاق بحكمة.
﴿الباسط﴾ — يبسط الرزق لمن يشاء.
﴿الخافض﴾ — يخفض المتكبرين.
﴿الرافع﴾ — يرفع المؤمنين المتواضعين.
﴿المعز﴾ — يعز من يشاء.
﴿المذل﴾ — يذل من يشاء.
﴿السميع﴾ — يسمع كل شيء.
﴿البصير﴾ — يرى كل شيء.
﴿الحكم﴾ — الحاكم العادل.
﴿العدل﴾ — لا يظلم أحداً.
﴿اللطيف﴾ — يعلم الخفايا ويلطف بعباده.
﴿الخبير﴾ — عارف بخفايا الأمور.
﴿الحليم﴾ — لا يعجل بالعقوبة.
﴿العظيم﴾ — عظيم الذات والصفات.
﴿الغفور﴾ — يغفر الذنوب مهما عظمت.
﴿الشكور﴾ — يجزي على القليل بالكثير.
﴿العلي﴾ — مرتفع فوق كل شيء.
﴿الكبير﴾ — الكبير في ذاته وصفاته.
﴿الحفيظ﴾ — يحفظ كل شيء.
﴿المقيت﴾ — يوصل القوت لكل مخلوق.
﴿الحسيب﴾ — كافي عباده وحاسبهم.
﴿الجليل﴾ — عظيم القدر جليل الشأن.
﴿الكريم﴾ — كثير العطاء والإكرام.
﴿الرقيب﴾ — مراقب لكل شيء.
﴿المجيب﴾ — يجيب دعاء من دعاه.
﴿الواسع﴾ — واسع العلم والرحمة والقدرة.
﴿الحكيم﴾ — يضع الأشياء في مواضعها.
﴿الودود﴾ — يحب المؤمنين ويحبونه.
﴿المجيد﴾ — عالي الشأن واسع الكرم.
﴿الباعث﴾ — يبعث الأموات يوم القيامة.
﴿الشهيد﴾ — شاهد على كل شيء.
﴿الحق﴾ — ثابت الوجود صادق الوعد.
﴿الوكيل﴾ — يكفي من توكل عليه.
﴿القوي﴾ — كامل القوة لا يعتريه ضعف.
﴿المتين﴾ — شديد القوة لا يُغلب.
﴿الولي﴾ — ناصر المؤمنين وحافظهم.
﴿الحميد﴾ — محمود في ذاته وصفاته.
﴿المحصي﴾ — يحصي كل شيء.
﴿المبدئ﴾ — يبدأ الخلق ابتداءً.
﴿المعيد﴾ — يعيد الخلق بعد الفناء.
﴿المحيي﴾ — يحيي الأحياء والأموات.
﴿المميت﴾ — يميت من يشاء متى يشاء.
﴿الحي﴾ — حياة كاملة لا تنقطع.
﴿القيوم﴾ — قائم بذاته مقيم لغيره.
﴿الواجد﴾ — الغني عن كل شيء.
﴿الماجد﴾ — واسع الكرم عالي الشأن.
﴿الواحد﴾ — لا شريك له في ذاته.
﴿الأحد﴾ — لا ثاني له ولا نظير.
﴿الصمد﴾ — المقصود في كل الحاجات.
﴿القادر﴾ — قادر على كل شيء.
﴿المقتدر﴾ — بالغ القدرة التامة.
﴿المقدم﴾ — يقدم من يشاء.
﴿المؤخر﴾ — يؤخر من يشاء.
﴿الأول﴾ — لا شيء قبله.
﴿الآخر﴾ — لا شيء بعده.
﴿الظاهر﴾ — ظاهر بدلائل وجوده.
﴿الباطن﴾ — محتجب عن الأبصار.
﴿الوالي﴾ — يلي أمور الخلق بالتدبير.
﴿المتعالي﴾ — متعالٍ عن صفات النقص.
﴿البر﴾ — محسن لعباده بره شامل.
﴿التواب﴾ — يقبل التوبة ويتوب على عباده.
﴿المنتقم﴾ — ينتقم من الظالمين.
﴿العفو﴾ — يمحو الذنوب ويعفو.
﴿الرؤوف﴾ — شديد الرحمة واللطف.
﴿مالك الملك﴾ — يملك الملك كله ويعطيه لمن يشاء.
﴿ذو الجلال والإكرام﴾ — صاحب العظمة والكرم.
﴿المقسط﴾ — يقسط بالعدل التام.
﴿الجامع﴾ — يجمع الخلق ليوم الحساب.
﴿الغني﴾ — غني عن كل شيء.
﴿المغني﴾ — يغني من يشاء من عباده.
﴿المانع﴾ — يمنع ما يشاء بحكمة.
﴿الضار﴾ — ينزل الضر بمن يستحقه.
﴿النافع﴾ — ينفع من يشاء.
﴿النور﴾ — نور السماوات والأرض.
﴿الهادي﴾ — يهدي إلى الحق من يشاء.
﴿البديع﴾ — مبتكر الخلق على غير مثال سابق.
﴿الباقي﴾ — دائم لا يزول.
﴿الوارث﴾ — يرث كل شيء بعد فنائه.
﴿الرشيد﴾ — يرشد إلى الصواب.
﴿الصبور﴾ — لا يعجل بالعقوبة.

قال تعالى: ﴿وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَى فَادْعُوهُ بِهَا﴾ (الأعراف: ١٨٠)`,
  'الفاتحة': `سورة الفاتحة — أم القرآن — سبع آيات، تُقرأ في كل ركعة صلاة.

﴿بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ﴾
البسملة مفتاح كل خير. الله: الاسم الجامع. الرحمن: رحمة تشمل الجميع. الرحيم: رحمة خاصة للمؤمنين.

﴿الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ﴾
الحمد الكامل المطلق لله وحده. رب العالمين: مالك ومدبر كل شيء.

﴿الرَّحْمَنِ الرَّحِيمِ﴾
تكرار الوصفين تأكيداً. رحمته هي الصفة الغالبة في تعامله مع عباده.

﴿مَالِكِ يَوْمِ الدِّينِ﴾
يوم الحساب والجزاء. الله وحده مالك ذلك اليوم، لا يملك أحد فيه شيئاً إلا بإذنه.

﴿إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ﴾
أعظم آية في التوحيد. تقديم المفعول يفيد الحصر: لك وحدك العبادة، ومنك وحدك الاستعانة. نقطة التحول من الإخبار عن الله إلى مخاطبته.

﴿اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ﴾
أعظم دعاء نردده في اليوم سبع عشرة مرة. الهداية نوعان: دلالة وتوفيق للعمل.

﴿صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ﴾
المنعَم عليهم: النبيون والصديقون والشهداء والصالحون.
المغضوب: عرفوا الحق وتركوه.
الضالون: عبدوا الله على جهل.

قال ﷺ: «قسمتُ الصلاةَ بيني وبين عبدي نصفين» (رواه مسلم) — والمراد: الفاتحة.`,
  'أركان الإسلام': `أركان الإسلام الخمسة التي بنى عليها النبي ﷺ الإسلام:

قال ﷺ: «بُنِيَ الإسلامُ على خمسٍ: شهادةِ أن لا إله إلا الله وأن محمداً رسول الله، وإقامِ الصلاةِ، وإيتاءِ الزكاةِ، وحجِّ البيتِ، وصومِ رمضان» (متفق عليه).

١. الشهادتان: الإقرار بالقلب واللسان بأن لا إله إلا الله وأن محمداً رسوله.
٢. الصلاة: خمس صلوات يومياً — فجر، ظهر، عصر، مغرب، عشاء.
٣. الزكاة: إخراج نصاب مقرر من المال للمستحقين.
٤. الصوم: صوم شهر رمضان كل عام.
٥. الحج: قصد البيت الحرام لمن استطاع إليه سبيلاً مرة في العمر.`,
  'أركان الإيمان': `أركان الإيمان الستة:

قال ﷺ في حديث جبريل: «أن تؤمن بالله وملائكته وكتبه ورسله واليوم الآخر وتؤمن بالقدر خيره وشره» (رواه مسلم).

١. الإيمان بالله: الإقرار بوجوده ووحدانيته وأسمائه وصفاته.
٢. الإيمان بالملائكة: مخلوقات نورانية لا تعصي الله.
٣. الإيمان بالكتب: التوراة والإنجيل والزبور والقرآن.
٤. الإيمان بالرسل: من آدم حتى محمد ﷺ خاتم الأنبياء.
٥. الإيمان باليوم الآخر: البعث والحساب والجنة والنار.
٦. الإيمان بالقدر: كل شيء بعلم الله وإرادته.`,
  'الصلاة': `الصلاة عمود الدين وأول ما يحاسَب عليه العبد يوم القيامة.

قال ﷺ: «أولُ ما يُحاسَب عليه العبدُ يومَ القيامةِ الصلاةُ، فإن صلُحَت صلُح سائرُ عمله» (رواه الترمذي).

الصلوات الخمس وأوقاتها:
• الفجر: من الفجر الصادق حتى الشروق — ركعتان.
• الظهر: من زوال الشمس حتى العصر — أربع ركعات.
• العصر: من بداية العصر حتى الغروب — أربع ركعات.
• المغرب: بعد الغروب مباشرة — ثلاث ركعات.
• العشاء: من غياب الشفق حتى منتصف الليل — أربع ركعات.

شروط صحة الصلاة: الطهارة، ستر العورة، استقبال القبلة، دخول الوقت، النية.
أركانها: النية، تكبيرة الإحرام، الفاتحة، الركوع، السجود، التشهد الأخير، التسليم.`,
  'الصيام': `الصيام ركن من أركان الإسلام، فرض في رمضان.

قال تعالى: ﴿يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِنْ قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ﴾ (البقرة: ١٨٣).

فضل الصيام:
قال ﷺ: «من صام رمضان إيماناً واحتساباً غُفر له ما تقدم من ذنبه» (متفق عليه).
قال ﷺ: «الصيام جُنَّة» أي وقاية من الشهوات والنار.
قال الله تعالى: «كل عمل ابن آدم له إلا الصيام فإنه لي وأنا أجزي به» (متفق عليه).

مبطلات الصيام: الأكل والشرب عمداً، الجماع، التقيؤ عمداً.`,
  'الزكاة': `الزكاة ركن من أركان الإسلام، فُرضت في السنة الثانية للهجرة.

قال تعالى: ﴿وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ﴾ — قُرنت بالصلاة في القرآن ثمانياً وعشرين مرة.

النصاب: ما يعادل 85 جراماً من الذهب أو 595 جراماً من الفضة.
المقدار: 2.5% من المال الذي مر عليه حول كامل.
مصارفها الثمانية: ﴿إِنَّمَا الصَّدَقَاتُ لِلْفُقَرَاءِ وَالْمَسَاكِينِ وَالْعَامِلِينَ عَلَيْهَا وَالْمُؤَلَّفَةِ قُلُوبُهُمْ وَفِي الرِّقَابِ وَالْغَارِمِينَ وَفِي سَبِيلِ اللَّهِ وَابْنِ السَّبِيلِ﴾ (التوبة: ٦٠).`,
  'الحج': `الحج ركن الإسلام الخامس، فُرض في السنة التاسعة للهجرة.

قال تعالى: ﴿وَلِلَّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ مَنِ اسْتَطَاعَ إِلَيْهِ سَبِيلًا﴾ (آل عمران: ٩٧).
قال ﷺ: «الحج المبرور ليس له جزاء إلا الجنة» (متفق عليه).

مناسك الحج الكبرى:
• الإحرام من الميقات.
• الطواف بالكعبة سبعة أشواط.
• السعي بين الصفا والمروة.
• الوقوف بعرفة — ركن الحج الأعظم.
• المبيت بمزدلفة.
• رمي الجمرات بمنى.
• الحلق أو التقصير.
• طواف الإفاضة.`,
  'الفاتحة_full': `**سورة الفاتحة — أم القرآن**
سبع آيات مكية، تُقرأ في كل ركعة صلاة. سُميت فاتحة لأنها تفتح المصحف وتُفتتح بها الصلاة.

﴿بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ﴾ — مفتاح كل أمر ذي بال. الله: الاسم الجامع. الرحمن: رحمة عامة للجميع. الرحيم: خاصة بالمؤمنين.
﴿الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ﴾ — الحمد المطلق لله وحده. رب العالمين: مالك ومدبر كل شيء.
﴿الرَّحْمَنِ الرَّحِيمِ﴾ — تكرار توكيداً. رحمته الصفة الغالبة في تعامله مع عباده.
﴿مَالِكِ يَوْمِ الدِّينِ﴾ — يوم الحساب والجزاء. الله وحده مالكه، لا يملك أحد فيه شيئاً.
﴿إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ﴾ — أعظم آية في التوحيد. التقديم يفيد الحصر: لك وحدك العبادة والاستعانة.
﴿اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ﴾ — أعظم دعاء، نردده 17 مرة يومياً في الصلاة.
﴿صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ﴾ — المنعَم عليهم: الأنبياء والصديقون والشهداء. المغضوب: عرفوا الحق وتركوه. الضالون: عبدوا الله على جهل.
قال ﷺ: «قسمتُ الصلاة بيني وبين عبدي نصفين» (رواه مسلم) — والمراد الفاتحة.`,
  'الفاتحة_tafsir': `**سورة الفاتحة — أم القرآن**
سبع آيات مكية، تُقرأ في كل ركعة صلاة. سُميت فاتحة لأنها تفتح المصحف وتُفتتح بها الصلاة.

﴿بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ﴾ — مفتاح كل أمر ذي بال. الله: الاسم الجامع. الرحمن: رحمة عامة للجميع. الرحيم: خاصة بالمؤمنين.
﴿الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ﴾ — الحمد المطلق لله وحده. رب العالمين: مالك ومدبر كل شيء.
﴿الرَّحْمَنِ الرَّحِيمِ﴾ — تكرار توكيداً. رحمته الصفة الغالبة في تعامله مع عباده.
﴿مَالِكِ يَوْمِ الدِّينِ﴾ — يوم الحساب والجزاء. الله وحده مالكه، لا يملك أحد فيه شيئاً.
﴿إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ﴾ — أعظم آية في التوحيد. التقديم يفيد الحصر: لك وحدك العبادة والاستعانة.
﴿اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ﴾ — أعظم دعاء، نردده 17 مرة يومياً في الصلاة.
﴿صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ﴾ — المنعَم عليهم: الأنبياء والصديقون والشهداء. المغضوب: عرفوا الحق وتركوه. الضالون: عبدوا الله على جهل.
قال ﷺ: «قسمتُ الصلاة بيني وبين عبدي نصفين» (رواه مسلم) — والمراد الفاتحة.`,
  'البقرة_full': `**سورة البقرة — أطول سور القرآن**
286 آية مدنية. سُميت بالبقرة لقصة بقرة بني إسرائيل. تحتوي على آية الكرسي (أعظم آية) وآية الدَّين (أطول آية) وخاتمة البقرة.

أبرز موضوعاتها:
• التوحيد وصفات المؤمنين والكافرين والمنافقين.
• قصة آدم وإبليس والخلافة في الأرض.
• قصة بني إسرائيل ومواقفهم مع موسى.
• تحويل القبلة من بيت المقدس إلى الكعبة.
• أحكام الصيام والحج والطلاق والربا.

﴿ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِّلْمُتَّقِينَ﴾ — القرآن هدى لمن اتقى الله واتبع أوامره.
﴿اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ﴾ — آية الكرسي، أعظم آية في القرآن.
﴿لَا إِكْرَاهَ فِي الدِّينِ﴾ — الإسلام لا يُفرض بالقوة، الرشد تبين من الغي.
﴿وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ﴾ — الله قريب من عباده يسمع دعاءهم.
قال ﷺ: «اقرؤوا سورة البقرة فإن أخذها بركة وتركها حسرة ولا تستطيعها البطلة» (رواه مسلم).`,
  'البقرة_tafsir': `**سورة البقرة — أطول سور القرآن**
286 آية مدنية. سُميت بالبقرة لقصة بقرة بني إسرائيل. تحتوي على آية الكرسي (أعظم آية) وآية الدَّين (أطول آية) وخاتمة البقرة.

أبرز موضوعاتها:
• التوحيد وصفات المؤمنين والكافرين والمنافقين.
• قصة آدم وإبليس والخلافة في الأرض.
• قصة بني إسرائيل ومواقفهم مع موسى.
• تحويل القبلة من بيت المقدس إلى الكعبة.
• أحكام الصيام والحج والطلاق والربا.

﴿ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِّلْمُتَّقِينَ﴾ — القرآن هدى لمن اتقى الله واتبع أوامره.
﴿اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ﴾ — آية الكرسي، أعظم آية في القرآن.
﴿لَا إِكْرَاهَ فِي الدِّينِ﴾ — الإسلام لا يُفرض بالقوة، الرشد تبين من الغي.
﴿وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ﴾ — الله قريب من عباده يسمع دعاءهم.
قال ﷺ: «اقرؤوا سورة البقرة فإن أخذها بركة وتركها حسرة ولا تستطيعها البطلة» (رواه مسلم).`,
  'آل_عمران_full': `**سورة آل عمران**
200 آية مدنية. نزلت في السنة الثالثة للهجرة، وتناولت غزوة أُحد وحوار وفد نجران النصاري.

﴿شَهِدَ اللَّهُ أَنَّهُ لَا إِلَٰهَ إِلَّا هُوَ وَالْمَلَائِكَةُ وَأُولُو الْعِلْمِ﴾ — شهادة الله وملائكته وأهل العلم بالوحدانية.
﴿إِنَّ الدِّينَ عِنْدَ اللَّهِ الْإِسْلَامُ﴾ — الإسلام الدين الوحيد المقبول عند الله.
﴿كُنْتُمْ خَيْرَ أُمَّةٍ أُخْرِجَتْ لِلنَّاسِ﴾ — شرف الأمة الإسلامية مشروط بالأمر بالمعروف والنهي عن المنكر.
﴿وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ﴾ — تثبيت المؤمنين بعد غزوة أُحد.
قصة مريم وزكريا ويحيى وعيسى عليهم السلام، وإثبات أن عيسى عبد الله ورسوله لا ابنه.`,
  'آل_عمران_tafsir': `**سورة آل عمران**
200 آية مدنية. نزلت في السنة الثالثة للهجرة، وتناولت غزوة أُحد وحوار وفد نجران النصاري.

﴿شَهِدَ اللَّهُ أَنَّهُ لَا إِلَٰهَ إِلَّا هُوَ وَالْمَلَائِكَةُ وَأُولُو الْعِلْمِ﴾ — شهادة الله وملائكته وأهل العلم بالوحدانية.
﴿إِنَّ الدِّينَ عِنْدَ اللَّهِ الْإِسْلَامُ﴾ — الإسلام الدين الوحيد المقبول عند الله.
﴿كُنْتُمْ خَيْرَ أُمَّةٍ أُخْرِجَتْ لِلنَّاسِ﴾ — شرف الأمة الإسلامية مشروط بالأمر بالمعروف والنهي عن المنكر.
﴿وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ﴾ — تثبيت المؤمنين بعد غزوة أُحد.
قصة مريم وزكريا ويحيى وعيسى عليهم السلام، وإثبات أن عيسى عبد الله ورسوله لا ابنه.`,
  'النساء_full': `**سورة النساء**
176 آية مدنية. سُميت بالنساء لكثرة ما فيها من أحكام تتعلق بالمرأة والأسرة.

أبرز موضوعاتها:
• أحكام الميراث والوصية.
• حقوق المرأة في الزواج والطلاق والميراث.
• أحكام اليتامى والمساكين.
• تحريم الربا وأكل المال بالباطل.

﴿يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمُ الَّذِي خَلَقَكُم مِّن نَّفْسٍ وَاحِدَةٍ﴾ — الوحدة الإنسانية من أصل واحد.
﴿إِنَّ اللَّهَ لَا يَظْلِمُ مِثْقَالَ ذَرَّةٍ﴾ — عدل الله المطلق يوم القيامة.
﴿إِنَّ اللَّهَ يَأْمُرُكُمْ أَن تُؤَدُّوا الْأَمَانَاتِ إِلَىٰ أَهْلِهَا﴾ — الأمانة واجبة في كل شيء.`,
  'النساء_tafsir': `**سورة النساء**
176 آية مدنية. سُميت بالنساء لكثرة ما فيها من أحكام تتعلق بالمرأة والأسرة.

أبرز موضوعاتها:
• أحكام الميراث والوصية.
• حقوق المرأة في الزواج والطلاق والميراث.
• أحكام اليتامى والمساكين.
• تحريم الربا وأكل المال بالباطل.

﴿يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمُ الَّذِي خَلَقَكُم مِّن نَّفْسٍ وَاحِدَةٍ﴾ — الوحدة الإنسانية من أصل واحد.
﴿إِنَّ اللَّهَ لَا يَظْلِمُ مِثْقَالَ ذَرَّةٍ﴾ — عدل الله المطلق يوم القيامة.
﴿إِنَّ اللَّهَ يَأْمُرُكُمْ أَن تُؤَدُّوا الْأَمَانَاتِ إِلَىٰ أَهْلِهَا﴾ — الأمانة واجبة في كل شيء.`,
  'المائدة_full': `**سورة المائدة**
120 آية مدنية. آخر سورة نزلت من حيث الأحكام. سُميت بالمائدة لقصة مائدة عيسى من السماء.

﴿الْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ﴾ — نزلت يوم عرفة في حجة الوداع. اكتمال الإسلام شريعةً ومنهجاً.
﴿وَلَا يَجْرِمَنَّكُمْ شَنَآنُ قَوْمٍ عَلَىٰ أَلَّا تَعْدِلُوا اعْدِلُوا﴾ — العدل واجب حتى مع الأعداء.
أحكام: الطهارة، الذبائح، الخمر والميسر، الكفارات، حد السرقة.
قصة ابني آدم (هابيل وقابيل) — أول جريمة قتل في التاريخ.`,
  'المائدة_tafsir': `**سورة المائدة**
120 آية مدنية. آخر سورة نزلت من حيث الأحكام. سُميت بالمائدة لقصة مائدة عيسى من السماء.

﴿الْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ﴾ — نزلت يوم عرفة في حجة الوداع. اكتمال الإسلام شريعةً ومنهجاً.
﴿وَلَا يَجْرِمَنَّكُمْ شَنَآنُ قَوْمٍ عَلَىٰ أَلَّا تَعْدِلُوا اعْدِلُوا﴾ — العدل واجب حتى مع الأعداء.
أحكام: الطهارة، الذبائح، الخمر والميسر، الكفارات، حد السرقة.
قصة ابني آدم (هابيل وقابيل) — أول جريمة قتل في التاريخ.`,
  'الأنعام_full': `**سورة الأنعام**
165 آية مكية. نزلت دفعة واحدة ليلاً، وشيّعها سبعون ألف ملك. تُعنى بأصول العقيدة والتوحيد ودحض الشرك.

﴿قُل لَّا أَقُولُ لَكُمْ عِندِي خَزَائِنُ اللَّهِ﴾ — النبي ﷺ بشر لا يملك خزائن الغيب.
﴿وَعِندَهُ مَفَاتِحُ الْغَيْبِ لَا يَعْلَمُهَا إِلَّا هُوَ﴾ — مفاتح الغيب الخمسة لا يعلمها إلا الله.
﴿وَلَا تَقْرَبُوا الْفَوَاحِشَ مَا ظَهَرَ مِنْهَا وَمَا بَطَنَ﴾ — تحريم الفواحش ظاهرها وباطنها.`,
  'الأنعام_tafsir': `**سورة الأنعام**
165 آية مكية. نزلت دفعة واحدة ليلاً، وشيّعها سبعون ألف ملك. تُعنى بأصول العقيدة والتوحيد ودحض الشرك.

﴿قُل لَّا أَقُولُ لَكُمْ عِندِي خَزَائِنُ اللَّهِ﴾ — النبي ﷺ بشر لا يملك خزائن الغيب.
﴿وَعِندَهُ مَفَاتِحُ الْغَيْبِ لَا يَعْلَمُهَا إِلَّا هُوَ﴾ — مفاتح الغيب الخمسة لا يعلمها إلا الله.
﴿وَلَا تَقْرَبُوا الْفَوَاحِشَ مَا ظَهَرَ مِنْهَا وَمَا بَطَنَ﴾ — تحريم الفواحش ظاهرها وباطنها.`,
  'الأعراف_full': `**سورة الأعراف**
206 آية مكية. تتناول قصص الأنبياء: آدم، نوح، هود، صالح، لوط، شعيب، موسى.

﴿وَلَقَدْ مَكَّنَّاكُمْ فِي الْأَرْضِ وَجَعَلْنَا لَكُمْ فِيهَا مَعَايِشَ﴾ — نعمة التمكين في الأرض والرزق.
﴿ادْعُوا رَبَّكُمْ تَضَرُّعًا وَخُفْيَةً﴾ — آداب الدعاء: التضرع والخفية وعدم الاعتداء.
الأعراف: مكان بين الجنة والنار يقف عليه أصحابه ينظرون إلى الفريقين.`,
  'الأعراف_tafsir': `**سورة الأعراف**
206 آية مكية. تتناول قصص الأنبياء: آدم، نوح، هود، صالح، لوط، شعيب، موسى.

﴿وَلَقَدْ مَكَّنَّاكُمْ فِي الْأَرْضِ وَجَعَلْنَا لَكُمْ فِيهَا مَعَايِشَ﴾ — نعمة التمكين في الأرض والرزق.
﴿ادْعُوا رَبَّكُمْ تَضَرُّعًا وَخُفْيَةً﴾ — آداب الدعاء: التضرع والخفية وعدم الاعتداء.
الأعراف: مكان بين الجنة والنار يقف عليه أصحابه ينظرون إلى الفريقين.`,
  'الأنفال_full': `**سورة الأنفال**
75 آية مدنية. نزلت بعد غزوة بدر الكبرى سنة 2هـ. تتناول أحكام الغنائم والجهاد وصفات المؤمنين.

﴿إِنَّمَا الْمُؤْمِنُونَ الَّذِينَ إِذَا ذُكِرَ اللَّهُ وَجِلَتْ قُلُوبُهُمْ﴾ — صفات المؤمن الحقيقي.
﴿وَأَعِدُّوا لَهُم مَّا اسْتَطَعْتُم مِّن قُوَّةٍ﴾ — الاستعداد للجهاد بكل أنواع القوة.
﴿وَاعْلَمُوا أَنَّمَا غَنِمْتُم مِّن شَيْءٍ فَأَنَّ لِلَّهِ خُمُسَهُ﴾ — حكم الغنائم وتوزيعها.`,
  'الأنفال_tafsir': `**سورة الأنفال**
75 آية مدنية. نزلت بعد غزوة بدر الكبرى سنة 2هـ. تتناول أحكام الغنائم والجهاد وصفات المؤمنين.

﴿إِنَّمَا الْمُؤْمِنُونَ الَّذِينَ إِذَا ذُكِرَ اللَّهُ وَجِلَتْ قُلُوبُهُمْ﴾ — صفات المؤمن الحقيقي.
﴿وَأَعِدُّوا لَهُم مَّا اسْتَطَعْتُم مِّن قُوَّةٍ﴾ — الاستعداد للجهاد بكل أنواع القوة.
﴿وَاعْلَمُوا أَنَّمَا غَنِمْتُم مِّن شَيْءٍ فَأَنَّ لِلَّهِ خُمُسَهُ﴾ — حكم الغنائم وتوزيعها.`,
  'التوبة_full': `**سورة التوبة (براءة)**
129 آية مدنية. الوحيدة التي لا تبدأ بالبسملة. نزلت في غزوة تبوك.

﴿لَقَدْ جَاءَكُمْ رَسُولٌ مِّنْ أَنفُسِكُمْ عَزِيزٌ عَلَيْهِ مَا عَنِتُّمْ﴾ — محبة النبي ﷺ لأمته وحرصه عليهم.
﴿إِنَّ اللَّهَ اشْتَرَىٰ مِنَ الْمُؤْمِنِينَ أَنفُسَهُمْ وَأَمْوَالَهُم بِأَنَّ لَهُمُ الْجَنَّةَ﴾ — صفقة الجنة.
أحكام الجهاد، الجزية، براءة الله ورسوله من المشركين.`,
  'التوبة_tafsir': `**سورة التوبة (براءة)**
129 آية مدنية. الوحيدة التي لا تبدأ بالبسملة. نزلت في غزوة تبوك.

﴿لَقَدْ جَاءَكُمْ رَسُولٌ مِّنْ أَنفُسِكُمْ عَزِيزٌ عَلَيْهِ مَا عَنِتُّمْ﴾ — محبة النبي ﷺ لأمته وحرصه عليهم.
﴿إِنَّ اللَّهَ اشْتَرَىٰ مِنَ الْمُؤْمِنِينَ أَنفُسَهُمْ وَأَمْوَالَهُم بِأَنَّ لَهُمُ الْجَنَّةَ﴾ — صفقة الجنة.
أحكام الجهاد، الجزية، براءة الله ورسوله من المشركين.`,
  'يونس_full': `**سورة يونس**
109 آيات مكية. تتناول قصص نوح وموسى ويونس، وتؤكد أن القرآن ليس مفترى.

﴿أَلَا إِنَّ أَوْلِيَاءَ اللَّهِ لَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ﴾ — بشرى أولياء الله في الدنيا والآخرة.
﴿قُلْ بِفَضْلِ اللَّهِ وَبِرَحْمَتِهِ فَبِذَٰلِكَ فَلْيَفْرَحُوا﴾ — الفرح الحقيقي بفضل الله لا بمتاع الدنيا.`,
  'يونس_tafsir': `**سورة يونس**
109 آيات مكية. تتناول قصص نوح وموسى ويونس، وتؤكد أن القرآن ليس مفترى.

﴿أَلَا إِنَّ أَوْلِيَاءَ اللَّهِ لَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ﴾ — بشرى أولياء الله في الدنيا والآخرة.
﴿قُلْ بِفَضْلِ اللَّهِ وَبِرَحْمَتِهِ فَبِذَٰلِكَ فَلْيَفْرَحُوا﴾ — الفرح الحقيقي بفضل الله لا بمتاع الدنيا.`,
  'هود_full': `**سورة هود**
123 آية مكية. قال ﷺ: «شيّبتني هود وأخواتها». تتناول قصص: نوح، هود، صالح، إبراهيم، لوط، شعيب، موسى.

﴿وَمَا مِن دَابَّةٍ فِي الْأَرْضِ إِلَّا عَلَى اللَّهِ رِزْقُهَا﴾ — الله ضامن رزق كل مخلوق.
﴿إِنَّهُ لَا يَيْأَسُ مِن رَّوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ﴾ — اليأس من رحمة الله كفر.`,
  'هود_tafsir': `**سورة هود**
123 آية مكية. قال ﷺ: «شيّبتني هود وأخواتها». تتناول قصص: نوح، هود، صالح، إبراهيم، لوط، شعيب، موسى.

﴿وَمَا مِن دَابَّةٍ فِي الْأَرْضِ إِلَّا عَلَى اللَّهِ رِزْقُهَا﴾ — الله ضامن رزق كل مخلوق.
﴿إِنَّهُ لَا يَيْأَسُ مِن رَّوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ﴾ — اليأس من رحمة الله كفر.`,
  'يوسف_full': `**سورة يوسف — أحسن القصص**
111 آية مكية. القرآن وصفها بـ«أحسن القصص». قصة يوسف عليه السلام كاملة من الطفولة حتى تولي العرش.

المحاور: الحسد والمكيدة — الابتلاء بالجب — العبودية في مصر — الفتنة بامرأة العزيز — السجن — تأويل الرؤيا — العرش — لقاء الأهل.
﴿إِنَّهُ مَن يَتَّقِ وَيَصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ﴾ — التقوى والصبر طريق النجاة.
﴿قَالَ لَا تَثْرِيبَ عَلَيْكُمُ الْيَوْمَ﴾ — عفو يوسف عن إخوته نموذج السماحة.`,
  'يوسف_tafsir': `**سورة يوسف — أحسن القصص**
111 آية مكية. القرآن وصفها بـ«أحسن القصص». قصة يوسف عليه السلام كاملة من الطفولة حتى تولي العرش.

المحاور: الحسد والمكيدة — الابتلاء بالجب — العبودية في مصر — الفتنة بامرأة العزيز — السجن — تأويل الرؤيا — العرش — لقاء الأهل.
﴿إِنَّهُ مَن يَتَّقِ وَيَصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ﴾ — التقوى والصبر طريق النجاة.
﴿قَالَ لَا تَثْرِيبَ عَلَيْكُمُ الْيَوْمَ﴾ — عفو يوسف عن إخوته نموذج السماحة.`,
  'الرعد_full': `**سورة الرعد**
43 آية. تجمع بين الحجج الكونية على وحدانية الله وصفات المؤمنين.

﴿اللَّهُ يَعْلَمُ مَا تَحْمِلُ كُلُّ أُنثَىٰ﴾ — الله يعلم كل ما في الأرحام.
﴿إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ﴾ — سنة التغيير الاجتماعي.
﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾ — الذكر علاج قلق النفس.`,
  'الرعد_tafsir': `**سورة الرعد**
43 آية. تجمع بين الحجج الكونية على وحدانية الله وصفات المؤمنين.

﴿اللَّهُ يَعْلَمُ مَا تَحْمِلُ كُلُّ أُنثَىٰ﴾ — الله يعلم كل ما في الأرحام.
﴿إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ﴾ — سنة التغيير الاجتماعي.
﴿أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ﴾ — الذكر علاج قلق النفس.`,
  'إبراهيم_full': `**سورة إبراهيم**
52 آية مكية. تتناول دعوة إبراهيم ودعاءه لأبنائه وللبيت الحرام.

﴿رَّبَّنَا إِنِّي أَسْكَنتُ مِن ذُرِّيَّتِي بِوَادٍ غَيْرِ ذِي زَرْعٍ﴾ — دعاء إبراهيم لمكة.
﴿وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ﴾ — الشكر سبب الزيادة في النعم.
مثل الكلمة الطيبة كالشجرة الطيبة والكلمة الخبيثة كالشجرة الخبيثة.`,
  'إبراهيم_tafsir': `**سورة إبراهيم**
52 آية مكية. تتناول دعوة إبراهيم ودعاءه لأبنائه وللبيت الحرام.

﴿رَّبَّنَا إِنِّي أَسْكَنتُ مِن ذُرِّيَّتِي بِوَادٍ غَيْرِ ذِي زَرْعٍ﴾ — دعاء إبراهيم لمكة.
﴿وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ﴾ — الشكر سبب الزيادة في النعم.
مثل الكلمة الطيبة كالشجرة الطيبة والكلمة الخبيثة كالشجرة الخبيثة.`,
  'الحجر_full': `**سورة الحجر**
99 آية مكية. تتناول تكذيب قريش وقصص لوط وإبراهيم وصالح.

﴿إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ﴾ — وعد الله بحفظ القرآن إلى يوم القيامة.
﴿وَلَقَدْ خَلَقْنَا الْإِنسَانَ مِن صَلْصَالٍ مِّنْ حَمَإٍ مَّسْنُونٍ﴾ — أصل خلق الإنسان من طين.`,
  'الحجر_tafsir': `**سورة الحجر**
99 آية مكية. تتناول تكذيب قريش وقصص لوط وإبراهيم وصالح.

﴿إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ﴾ — وعد الله بحفظ القرآن إلى يوم القيامة.
﴿وَلَقَدْ خَلَقْنَا الْإِنسَانَ مِن صَلْصَالٍ مِّنْ حَمَإٍ مَّسْنُونٍ﴾ — أصل خلق الإنسان من طين.`,
  'النحل_full': `**سورة النحل — سورة النعم**
128 آية مكية. تُعدد نعم الله على الإنسان وتأمر بالشكر.

﴿وَأَوْحَىٰ رَبُّكَ إِلَى النَّحْلِ أَنِ اتَّخِذِي مِنَ الْجِبَالِ بُيُوتًا﴾ — معجزة النحل وإلهام الله لها.
﴿إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ وَإِيتَاءِ ذِي الْقُرْبَىٰ﴾ — أجمع آية للأخلاق في القرآن.
﴿وَإِن تَعُدُّوا نِعْمَةَ اللَّهِ لَا تُحْصُوهَا﴾ — نعم الله لا تُحصى ولا تُعد.`,
  'النحل_tafsir': `**سورة النحل — سورة النعم**
128 آية مكية. تُعدد نعم الله على الإنسان وتأمر بالشكر.

﴿وَأَوْحَىٰ رَبُّكَ إِلَى النَّحْلِ أَنِ اتَّخِذِي مِنَ الْجِبَالِ بُيُوتًا﴾ — معجزة النحل وإلهام الله لها.
﴿إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ وَإِيتَاءِ ذِي الْقُرْبَىٰ﴾ — أجمع آية للأخلاق في القرآن.
﴿وَإِن تَعُدُّوا نِعْمَةَ اللَّهِ لَا تُحْصُوهَا﴾ — نعم الله لا تُحصى ولا تُعد.`,
  'الإسراء_full': `**سورة الإسراء (بني إسرائيل)**
111 آية مكية. تبدأ بذكر الإسراء والمعراج. تتضمن وصايا أخلاقية عشرة كالوصايا العشر.

﴿سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ لَيْلًا﴾ — معجزة الإسراء والمعراج.
﴿وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا﴾ — توحيد الله وبر الوالدين.
﴿وَلَا تَقْتُلُوا أَوْلَادَكُمْ خَشْيَةَ إِمْلَاقٍ﴾ — تحريم قتل الأولاد خوف الفقر.`,
  'الإسراء_tafsir': `**سورة الإسراء (بني إسرائيل)**
111 آية مكية. تبدأ بذكر الإسراء والمعراج. تتضمن وصايا أخلاقية عشرة كالوصايا العشر.

﴿سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ لَيْلًا﴾ — معجزة الإسراء والمعراج.
﴿وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا﴾ — توحيد الله وبر الوالدين.
﴿وَلَا تَقْتُلُوا أَوْلَادَكُمْ خَشْيَةَ إِمْلَاقٍ﴾ — تحريم قتل الأولاد خوف الفقر.`,
  'الكهف_full': `**سورة الكهف**
110 آيات مكية. قال ﷺ: «من قرأ سورة الكهف يوم الجمعة أضاء له من النور ما بين الجمعتين».

أربع قصص: أصحاب الكهف — صاحب الجنتين — موسى والخضر — ذو القرنين.
﴿إِنَّهُمْ فِتْيَةٌ آمَنُوا بِرَبِّهِمْ وَزِدْنَاهُمْ هُدًى﴾ — الشباب المؤمن الهارب من الفتنة.
﴿وَلَا تَقُولَنَّ لِشَيْءٍ إِنِّي فَاعِلٌ ذَٰلِكَ غَدًا إِلَّا أَن يَشَاءَ اللَّهُ﴾ — آداب قول إن شاء الله.`,
  'الكهف_tafsir': `**سورة الكهف**
110 آيات مكية. قال ﷺ: «من قرأ سورة الكهف يوم الجمعة أضاء له من النور ما بين الجمعتين».

أربع قصص: أصحاب الكهف — صاحب الجنتين — موسى والخضر — ذو القرنين.
﴿إِنَّهُمْ فِتْيَةٌ آمَنُوا بِرَبِّهِمْ وَزِدْنَاهُمْ هُدًى﴾ — الشباب المؤمن الهارب من الفتنة.
﴿وَلَا تَقُولَنَّ لِشَيْءٍ إِنِّي فَاعِلٌ ذَٰلِكَ غَدًا إِلَّا أَن يَشَاءَ اللَّهُ﴾ — آداب قول إن شاء الله.`,
  'مريم_full': `**سورة مريم**
98 آية مكية. تتناول قصص: زكريا ويحيى، مريم وعيسى، إبراهيم وأبيه، وسائر الأنبياء.

﴿كهيعص﴾ — من الحروف المقطعة، والله أعلم بمعناها.
﴿فَأَشَارَتْ إِلَيْهِ قَالُوا كَيْفَ نُكَلِّمُ مَن كَانَ فِي الْمَهْدِ صَبِيًّا﴾ — معجزة كلام عيسى في المهد.
﴿إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ سَيَجْعَلُ لَهُمُ الرَّحْمَٰنُ وُدًّا﴾ — المؤمن محبوب في الأرض.`,
  'مريم_tafsir': `**سورة مريم**
98 آية مكية. تتناول قصص: زكريا ويحيى، مريم وعيسى، إبراهيم وأبيه، وسائر الأنبياء.

﴿كهيعص﴾ — من الحروف المقطعة، والله أعلم بمعناها.
﴿فَأَشَارَتْ إِلَيْهِ قَالُوا كَيْفَ نُكَلِّمُ مَن كَانَ فِي الْمَهْدِ صَبِيًّا﴾ — معجزة كلام عيسى في المهد.
﴿إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ سَيَجْعَلُ لَهُمُ الرَّحْمَٰنُ وُدًّا﴾ — المؤمن محبوب في الأرض.`,
  'طه_full': `**سورة طه**
135 آية مكية. قصة موسى مع فرعون وبالتفصيل، وقصة آدم وإبليس.

﴿طه مَا أَنزَلْنَا عَلَيْكَ الْقُرْآنَ لِتَشْقَىٰ﴾ — القرآن تذكرة لا إرهاق.
﴿وَأَنَا اخْتَرْتُكَ فَاسْتَمِعْ لِمَا يُوحَىٰ﴾ — اصطفاء موسى للرسالة.
﴿رَّبِّ زِدْنِي عِلْمًا﴾ — أقصر وأجمع دعاء لطلب العلم.`,
  'طه_tafsir': `**سورة طه**
135 آية مكية. قصة موسى مع فرعون وبالتفصيل، وقصة آدم وإبليس.

﴿طه مَا أَنزَلْنَا عَلَيْكَ الْقُرْآنَ لِتَشْقَىٰ﴾ — القرآن تذكرة لا إرهاق.
﴿وَأَنَا اخْتَرْتُكَ فَاسْتَمِعْ لِمَا يُوحَىٰ﴾ — اصطفاء موسى للرسالة.
﴿رَّبِّ زِدْنِي عِلْمًا﴾ — أقصر وأجمع دعاء لطلب العلم.`,
  'الأنبياء_full': `**سورة الأنبياء**
112 آية مكية. تعرض سِيَر الأنبياء: إبراهيم، لوط، نوح، داود، سليمان، أيوب، إسماعيل، إدريس، ذا الكفل، يونس، زكريا، مريم.

﴿وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ﴾ — النبي ﷺ رحمة للبشرية جمعاء.
﴿إِنَّ هَٰذِهِ أُمَّتُكُمْ أُمَّةً وَاحِدَةً﴾ — الأمة الإسلامية وحدة متماسكة.`,
  'الأنبياء_tafsir': `**سورة الأنبياء**
112 آية مكية. تعرض سِيَر الأنبياء: إبراهيم، لوط، نوح، داود، سليمان، أيوب، إسماعيل، إدريس، ذا الكفل، يونس، زكريا، مريم.

﴿وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ﴾ — النبي ﷺ رحمة للبشرية جمعاء.
﴿إِنَّ هَٰذِهِ أُمَّتُكُمْ أُمَّةً وَاحِدَةً﴾ — الأمة الإسلامية وحدة متماسكة.`,
  'الحج_full': `**سورة الحج**
78 آية. تجمع بين المكي والمدني. تتناول أحكام الحج ومشاعره وفضل العبادة.

﴿يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمْ إِنَّ زَلْزَلَةَ السَّاعَةِ شَيْءٌ عَظِيمٌ﴾ — أهوال يوم القيامة.
﴿وَأَذِّن فِي النَّاسِ بِالْحَجِّ﴾ — أمر إبراهيم بالأذان للحج.
﴿إِنَّ اللَّهَ يُدَافِعُ عَنِ الَّذِينَ آمَنُوا﴾ — الله يدافع عن عباده المؤمنين.`,
  'الحج_tafsir': `**سورة الحج**
78 آية. تجمع بين المكي والمدني. تتناول أحكام الحج ومشاعره وفضل العبادة.

﴿يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمْ إِنَّ زَلْزَلَةَ السَّاعَةِ شَيْءٌ عَظِيمٌ﴾ — أهوال يوم القيامة.
﴿وَأَذِّن فِي النَّاسِ بِالْحَجِّ﴾ — أمر إبراهيم بالأذان للحج.
﴿إِنَّ اللَّهَ يُدَافِعُ عَنِ الَّذِينَ آمَنُوا﴾ — الله يدافع عن عباده المؤمنين.`,
  'المؤمنون_full': `**سورة المؤمنون**
118 آية مكية. تبدأ بصفات المؤمنين الفائزين وتنتهي بدعاء الغفران.

﴿قَدْ أَفْلَحَ الْمُؤْمِنُونَ الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ﴾ — سبع صفات للمؤمن الفائز.
﴿وَلَقَدْ خَلَقْنَا الْإِنسَانَ مِن سُلَالَةٍ مِّن طِينٍ﴾ — مراحل خلق الإنسان السبع.
﴿رَّبِّ اغْفِرْ وَارْحَمْ وَأَنتَ خَيْرُ الرَّاحِمِينَ﴾ — خاتمة السورة بالدعاء.`,
  'المؤمنون_tafsir': `**سورة المؤمنون**
118 آية مكية. تبدأ بصفات المؤمنين الفائزين وتنتهي بدعاء الغفران.

﴿قَدْ أَفْلَحَ الْمُؤْمِنُونَ الَّذِينَ هُمْ فِي صَلَاتِهِمْ خَاشِعُونَ﴾ — سبع صفات للمؤمن الفائز.
﴿وَلَقَدْ خَلَقْنَا الْإِنسَانَ مِن سُلَالَةٍ مِّن طِينٍ﴾ — مراحل خلق الإنسان السبع.
﴿رَّبِّ اغْفِرْ وَارْحَمْ وَأَنتَ خَيْرُ الرَّاحِمِينَ﴾ — خاتمة السورة بالدعاء.`,
  'النور_full': `**سورة النور**
64 آية مدنية. تتناول أحكام الأسرة والمجتمع والأخلاق العامة.

﴿اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ﴾ — آية النور، أعظم تشبيه للهداية الإلهية.
﴿الزَّانِيَةُ وَالزَّانِي فَاجْلِدُوا كُلَّ وَاحِدٍ مِّنْهُمَا مِائَةَ جَلْدَةٍ﴾ — حد الزنا.
﴿قُل لِّلْمُؤْمِنِينَ يَغُضُّوا مِنْ أَبْصَارِهِمْ﴾ — وجوب غض البصر.`,
  'النور_tafsir': `**سورة النور**
64 آية مدنية. تتناول أحكام الأسرة والمجتمع والأخلاق العامة.

﴿اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ﴾ — آية النور، أعظم تشبيه للهداية الإلهية.
﴿الزَّانِيَةُ وَالزَّانِي فَاجْلِدُوا كُلَّ وَاحِدٍ مِّنْهُمَا مِائَةَ جَلْدَةٍ﴾ — حد الزنا.
﴿قُل لِّلْمُؤْمِنِينَ يَغُضُّوا مِنْ أَبْصَارِهِمْ﴾ — وجوب غض البصر.`,
  'الفرقان_full': `**سورة الفرقان**
77 آية مكية. الفرقان اسم القرآن. تتناول ردود على شبهات المشركين وصفات عباد الرحمن.

﴿وَعِبَادُ الرَّحْمَٰنِ الَّذِينَ يَمْشُونَ عَلَى الْأَرْضِ هَوْنًا﴾ — 13 صفة لعباد الرحمن.
﴿وَالَّذِينَ لَا يَدْعُونَ مَعَ اللَّهِ إِلَٰهًا آخَرَ﴾ — براءة المؤمن من الشرك والفواحش.`,
  'الفرقان_tafsir': `**سورة الفرقان**
77 آية مكية. الفرقان اسم القرآن. تتناول ردود على شبهات المشركين وصفات عباد الرحمن.

﴿وَعِبَادُ الرَّحْمَٰنِ الَّذِينَ يَمْشُونَ عَلَى الْأَرْضِ هَوْنًا﴾ — 13 صفة لعباد الرحمن.
﴿وَالَّذِينَ لَا يَدْعُونَ مَعَ اللَّهِ إِلَٰهًا آخَرَ﴾ — براءة المؤمن من الشرك والفواحش.`,
  'الشعراء_full': `**سورة الشعراء**
227 آية مكية. تعرض قصص: موسى، إبراهيم، نوح، هود، صالح، لوط، شعيب.

﴿وَتَوَكَّلْ عَلَى الْعَزِيزِ الرَّحِيمِ﴾ — التوكل على الله ركيزة الإيمان.
﴿وَالشُّعَرَاءُ يَتَّبِعُهُمُ الْغَاوُونَ﴾ — ذم شعراء المدح والهجاء، واستثناء شعراء الحق.`,
  'الشعراء_tafsir': `**سورة الشعراء**
227 آية مكية. تعرض قصص: موسى، إبراهيم، نوح، هود، صالح، لوط، شعيب.

﴿وَتَوَكَّلْ عَلَى الْعَزِيزِ الرَّحِيمِ﴾ — التوكل على الله ركيزة الإيمان.
﴿وَالشُّعَرَاءُ يَتَّبِعُهُمُ الْغَاوُونَ﴾ — ذم شعراء المدح والهجاء، واستثناء شعراء الحق.`,
  'النمل_full': `**سورة النمل**
93 آية مكية. تتناول قصص: موسى، داود، سليمان، صالح، لوط.

﴿وَتَفَقَّدَ الطَّيْرَ فَقَالَ مَا لِيَ لَا أَرَى الْهُدْهُدَ﴾ — قصة سليمان وملكة سبأ.
﴿إِنَّهُ مِن سُلَيْمَانَ وَإِنَّهُ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ﴾ — رسالة سليمان للملكة.
﴿قُلِ الْحَمْدُ لِلَّهِ وَسَلَامٌ عَلَىٰ عِبَادِهِ الَّذِينَ اصْطَفَىٰ﴾ — التحية الإلهية للمصطفين.`,
  'النمل_tafsir': `**سورة النمل**
93 آية مكية. تتناول قصص: موسى، داود، سليمان، صالح، لوط.

﴿وَتَفَقَّدَ الطَّيْرَ فَقَالَ مَا لِيَ لَا أَرَى الْهُدْهُدَ﴾ — قصة سليمان وملكة سبأ.
﴿إِنَّهُ مِن سُلَيْمَانَ وَإِنَّهُ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ﴾ — رسالة سليمان للملكة.
﴿قُلِ الْحَمْدُ لِلَّهِ وَسَلَامٌ عَلَىٰ عِبَادِهِ الَّذِينَ اصْطَفَىٰ﴾ — التحية الإلهية للمصطفين.`,
  'القصص_full': `**سورة القصص**
88 آية مكية. أوسع سورة في قصة موسى — من الميلاد حتى الرسالة.

﴿وَأَوْحَيْنَا إِلَىٰ أُمِّ مُوسَىٰ أَنْ أَرْضِعِيهِ﴾ — الإلهام الرباني لأم موسى.
﴿إِنَّ قَارُونَ كَانَ مِن قَوْمِ مُوسَىٰ فَبَغَىٰ عَلَيْهِمْ﴾ — قصة قارون والغرور بالمال.
﴿إِنَّ الَّذِي فَرَضَ عَلَيْكَ الْقُرْآنَ لَرَادُّكَ إِلَىٰ مَعَادٍ﴾ — وعد النبي ﷺ بالعودة لمكة.`,
  'القصص_tafsir': `**سورة القصص**
88 آية مكية. أوسع سورة في قصة موسى — من الميلاد حتى الرسالة.

﴿وَأَوْحَيْنَا إِلَىٰ أُمِّ مُوسَىٰ أَنْ أَرْضِعِيهِ﴾ — الإلهام الرباني لأم موسى.
﴿إِنَّ قَارُونَ كَانَ مِن قَوْمِ مُوسَىٰ فَبَغَىٰ عَلَيْهِمْ﴾ — قصة قارون والغرور بالمال.
﴿إِنَّ الَّذِي فَرَضَ عَلَيْكَ الْقُرْآنَ لَرَادُّكَ إِلَىٰ مَعَادٍ﴾ — وعد النبي ﷺ بالعودة لمكة.`,
  'العنكبوت_full': `**سورة العنكبوت**
69 آية. تتناول الابتلاء والصبر وقصص الأنبياء.

﴿أَحَسِبَ النَّاسُ أَن يُتْرَكُوا أَن يَقُولُوا آمَنَّا وَهُمْ لَا يُفْتَنُونَ﴾ — الإيمان لا يكتمل بلا ابتلاء.
﴿مَثَلُ الَّذِينَ اتَّخَذُوا مِن دُونِ اللَّهِ أَوْلِيَاءَ كَمَثَلِ الْعَنكَبُوتِ﴾ — وهن بيت العنكبوت مثل لوهن الشرك.`,
  'العنكبوت_tafsir': `**سورة العنكبوت**
69 آية. تتناول الابتلاء والصبر وقصص الأنبياء.

﴿أَحَسِبَ النَّاسُ أَن يُتْرَكُوا أَن يَقُولُوا آمَنَّا وَهُمْ لَا يُفْتَنُونَ﴾ — الإيمان لا يكتمل بلا ابتلاء.
﴿مَثَلُ الَّذِينَ اتَّخَذُوا مِن دُونِ اللَّهِ أَوْلِيَاءَ كَمَثَلِ الْعَنكَبُوتِ﴾ — وهن بيت العنكبوت مثل لوهن الشرك.`,
  'الروم_full': `**سورة الروم**
60 آية مكية. تبشر بانتصار الروم (المسيحيين) على الفرس (المجوس) وانتصار المسلمين يوم بدر.

﴿غُلِبَتِ الرُّومُ فِي أَدْنَى الْأَرْضِ﴾ — نبوءة تحققت في بضع سنين.
﴿وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا﴾ — الزواج آية من آيات الله.`,
  'الروم_tafsir': `**سورة الروم**
60 آية مكية. تبشر بانتصار الروم (المسيحيين) على الفرس (المجوس) وانتصار المسلمين يوم بدر.

﴿غُلِبَتِ الرُّومُ فِي أَدْنَى الْأَرْضِ﴾ — نبوءة تحققت في بضع سنين.
﴿وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا﴾ — الزواج آية من آيات الله.`,
  'لقمان_full': `**سورة لقمان**
34 آية مكية. وصايا لقمان الحكيم لابنه، أجمع وصايا تربوية في القرآن.

﴿يَا بُنَيَّ لَا تُشْرِكْ بِاللَّهِ إِنَّ الشِّرْكَ لَظُلْمٌ عَظِيمٌ﴾ — أول وصية: التوحيد.
﴿يَا بُنَيَّ أَقِمِ الصَّلَاةَ وَأْمُرْ بِالْمَعْرُوفِ﴾ — الصلاة والأمر بالمعروف والصبر.
﴿وَلَا تُصَعِّرْ خَدَّكَ لِلنَّاسِ وَلَا تَمْشِ فِي الْأَرْضِ مَرَحًا﴾ — التواضع وحسن الخُلق.`,
  'لقمان_tafsir': `**سورة لقمان**
34 آية مكية. وصايا لقمان الحكيم لابنه، أجمع وصايا تربوية في القرآن.

﴿يَا بُنَيَّ لَا تُشْرِكْ بِاللَّهِ إِنَّ الشِّرْكَ لَظُلْمٌ عَظِيمٌ﴾ — أول وصية: التوحيد.
﴿يَا بُنَيَّ أَقِمِ الصَّلَاةَ وَأْمُرْ بِالْمَعْرُوفِ﴾ — الصلاة والأمر بالمعروف والصبر.
﴿وَلَا تُصَعِّرْ خَدَّكَ لِلنَّاسِ وَلَا تَمْشِ فِي الْأَرْضِ مَرَحًا﴾ — التواضع وحسن الخُلق.`,
  'السجدة_full': `**سورة السجدة**
30 آية مكية. تتناول خلق الإنسان وعالم الغيب والآخرة.

﴿اللَّهُ الَّذِي خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ وَمَا بَيْنَهُمَا﴾ — الخلق في ستة أيام.
﴿تَتَجَافَىٰ جُنُوبُهُمْ عَنِ الْمَضَاجِعِ﴾ — صفة المؤمنين القائمين بالليل.`,
  'السجدة_tafsir': `**سورة السجدة**
30 آية مكية. تتناول خلق الإنسان وعالم الغيب والآخرة.

﴿اللَّهُ الَّذِي خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ وَمَا بَيْنَهُمَا﴾ — الخلق في ستة أيام.
﴿تَتَجَافَىٰ جُنُوبُهُمْ عَنِ الْمَضَاجِعِ﴾ — صفة المؤمنين القائمين بالليل.`,
  'الأحزاب_full': `**سورة الأحزاب**
73 آية مدنية. تتناول أحداث غزوة الأحزاب (الخندق) وزواج النبي ﷺ وأحكام أهل البيت.

﴿لَّقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ﴾ — النبي ﷺ القدوة المثلى.
﴿إِنَّا عَرَضْنَا الْأَمَانَةَ عَلَى السَّمَاوَاتِ وَالْأَرْضِ﴾ — الأمانة التكليفية التي حملها الإنسان.`,
  'الأحزاب_tafsir': `**سورة الأحزاب**
73 آية مدنية. تتناول أحداث غزوة الأحزاب (الخندق) وزواج النبي ﷺ وأحكام أهل البيت.

﴿لَّقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ﴾ — النبي ﷺ القدوة المثلى.
﴿إِنَّا عَرَضْنَا الْأَمَانَةَ عَلَى السَّمَاوَاتِ وَالْأَرْضِ﴾ — الأمانة التكليفية التي حملها الإنسان.`,
  'سبأ_full': `**سورة سبأ**
54 آية مكية. قصة سبأ (اليمن) ونعمة الله عليهم وكفرهم ثم عقابهم بالسيل.

﴿لَقَدْ كَانَ لِسَبَإٍ فِي مَسْكَنِهِمْ آيَةٌ﴾ — حضارة سبأ الزائلة درس للأمم.
﴿قُلْ إِنَّ رَبِّي يَبْسُطُ الرِّزْقَ لِمَن يَشَاءُ﴾ — الرزق بيد الله وحده.`,
  'سبأ_tafsir': `**سورة سبأ**
54 آية مكية. قصة سبأ (اليمن) ونعمة الله عليهم وكفرهم ثم عقابهم بالسيل.

﴿لَقَدْ كَانَ لِسَبَإٍ فِي مَسْكَنِهِمْ آيَةٌ﴾ — حضارة سبأ الزائلة درس للأمم.
﴿قُلْ إِنَّ رَبِّي يَبْسُطُ الرِّزْقَ لِمَن يَشَاءُ﴾ — الرزق بيد الله وحده.`,
  'فاطر_full': `**سورة فاطر (الملائكة)**
45 آية مكية. تتناول ربوبية الله وخلق الملائكة وسنن الكون.

﴿الْحَمْدُ لِلَّهِ فَاطِرِ السَّمَاوَاتِ وَالْأَرْضِ جَاعِلِ الْمَلَائِكَةِ رُسُلًا﴾ — الملائكة رسل الله.
﴿إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ﴾ — العلم الحقيقي يورث خشية الله.`,
  'فاطر_tafsir': `**سورة فاطر (الملائكة)**
45 آية مكية. تتناول ربوبية الله وخلق الملائكة وسنن الكون.

﴿الْحَمْدُ لِلَّهِ فَاطِرِ السَّمَاوَاتِ وَالْأَرْضِ جَاعِلِ الْمَلَائِكَةِ رُسُلًا﴾ — الملائكة رسل الله.
﴿إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ﴾ — العلم الحقيقي يورث خشية الله.`,
  'يس_full': `**سورة يس — قلب القرآن**
83 آية مكية. قال ﷺ: «اقرؤوها على موتاكم». تتناول الإيمان بالبعث والرسالة وآيات الكون.

﴿إِنَّا نَحْنُ نُحْيِي الْمَوْتَىٰ وَنَكْتُبُ مَا قَدَّمُوا وَآثَارَهُمْ﴾ — الله يحصي كل عمل وأثر.
﴿إِنَّمَا أَمْرُهُ إِذَا أَرَادَ شَيْئًا أَن يَقُولَ لَهُ كُن فَيَكُونُ﴾ — كمال قدرة الله.
قصة أصحاب القرية ورجل مؤمن جاء من أقصى المدينة يسعى.`,
  'يس_tafsir': `**سورة يس — قلب القرآن**
83 آية مكية. قال ﷺ: «اقرؤوها على موتاكم». تتناول الإيمان بالبعث والرسالة وآيات الكون.

﴿إِنَّا نَحْنُ نُحْيِي الْمَوْتَىٰ وَنَكْتُبُ مَا قَدَّمُوا وَآثَارَهُمْ﴾ — الله يحصي كل عمل وأثر.
﴿إِنَّمَا أَمْرُهُ إِذَا أَرَادَ شَيْئًا أَن يَقُولَ لَهُ كُن فَيَكُونُ﴾ — كمال قدرة الله.
قصة أصحاب القرية ورجل مؤمن جاء من أقصى المدينة يسعى.`,
  'الصافات_full': `**سورة الصافات**
182 آية مكية. تتناول تسبيح الملائكة وقصص إبراهيم وذبح إسماعيل وإلياس ويونس.

﴿فَلَمَّا أَسْلَمَا وَتَلَّهُ لِلْجَبِينِ وَنَادَيْنَاهُ أَن يَا إِبْرَاهِيمُ﴾ — قصة الذبح العظيم.
﴿وَفَدَيْنَاهُ بِذِبْحٍ عَظِيمٍ﴾ — الفداء الإلهي لإسماعيل بكبش.`,
  'الصافات_tafsir': `**سورة الصافات**
182 آية مكية. تتناول تسبيح الملائكة وقصص إبراهيم وذبح إسماعيل وإلياس ويونس.

﴿فَلَمَّا أَسْلَمَا وَتَلَّهُ لِلْجَبِينِ وَنَادَيْنَاهُ أَن يَا إِبْرَاهِيمُ﴾ — قصة الذبح العظيم.
﴿وَفَدَيْنَاهُ بِذِبْحٍ عَظِيمٍ﴾ — الفداء الإلهي لإسماعيل بكبش.`,
  'ص_full': `**سورة ص**
88 آية مكية. تتناول قصص داود وسليمان وأيوب وإبراهيم وإسحاق ويعقوب.

﴿وَاذْكُرْ عَبْدَنَا دَاوُودَ ذَا الْأَيْدِ إِنَّهُ أَوَّابٌ﴾ — داود النبي الملك الأواب.
﴿وَأَيُّوبَ إِذْ نَادَىٰ رَبَّهُ أَنِّي مَسَّنِيَ الضُّرُّ وَأَنتَ أَرْحَمُ الرَّاحِمِينَ﴾ — دعاء أيوب في الضر.`,
  'ص_tafsir': `**سورة ص**
88 آية مكية. تتناول قصص داود وسليمان وأيوب وإبراهيم وإسحاق ويعقوب.

﴿وَاذْكُرْ عَبْدَنَا دَاوُودَ ذَا الْأَيْدِ إِنَّهُ أَوَّابٌ﴾ — داود النبي الملك الأواب.
﴿وَأَيُّوبَ إِذْ نَادَىٰ رَبَّهُ أَنِّي مَسَّنِيَ الضُّرُّ وَأَنتَ أَرْحَمُ الرَّاحِمِينَ﴾ — دعاء أيوب في الضر.`,
  'الزمر_full': `**سورة الزمر**
75 آية مكية. تدعو إلى الإخلاص في العبادة وتصف مشاهد يوم القيامة.

﴿قُلْ إِنِّي أُمِرْتُ أَنْ أَعْبُدَ اللَّهَ مُخْلِصًا لَّهُ الدِّينَ﴾ — الإخلاص ركيزة العبادة.
﴿قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ﴾ — باب التوبة مفتوح.`,
  'الزمر_tafsir': `**سورة الزمر**
75 آية مكية. تدعو إلى الإخلاص في العبادة وتصف مشاهد يوم القيامة.

﴿قُلْ إِنِّي أُمِرْتُ أَنْ أَعْبُدَ اللَّهَ مُخْلِصًا لَّهُ الدِّينَ﴾ — الإخلاص ركيزة العبادة.
﴿قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ﴾ — باب التوبة مفتوح.`,
  'غافر_full': `**سورة غافر (المؤمن)**
85 آية مكية. قصة مؤمن آل فرعون الذي كتم إيمانه ثم جاهر بالدفاع عن موسى.

﴿وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ﴾ — وعد الله بإجابة الدعاء.
﴿إِنَّ الَّذِينَ يُجَادِلُونَ فِي آيَاتِ اللَّهِ بِغَيْرِ سُلْطَانٍ أَتَاهُمْ﴾ — ذم الجدال بالباطل.`,
  'غافر_tafsir': `**سورة غافر (المؤمن)**
85 آية مكية. قصة مؤمن آل فرعون الذي كتم إيمانه ثم جاهر بالدفاع عن موسى.

﴿وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ﴾ — وعد الله بإجابة الدعاء.
﴿إِنَّ الَّذِينَ يُجَادِلُونَ فِي آيَاتِ اللَّهِ بِغَيْرِ سُلْطَانٍ أَتَاهُمْ﴾ — ذم الجدال بالباطل.`,
  'فصلت_full': `**سورة فصلت (حم السجدة)**
54 آية مكية. تتناول القرآن وموقف المشركين منه وآيات الكون.

﴿سَنُرِيهِمْ آيَاتِنَا فِي الْآفَاقِ وَفِي أَنفُسِهِمْ﴾ — الآيات الكونية والنفسية دليل على الحق.
﴿وَمَنْ أَحْسَنُ قَوْلًا مِّمَّن دَعَا إِلَى اللَّهِ﴾ — الدعوة إلى الله أحسن الأقوال.`,
  'فصلت_tafsir': `**سورة فصلت (حم السجدة)**
54 آية مكية. تتناول القرآن وموقف المشركين منه وآيات الكون.

﴿سَنُرِيهِمْ آيَاتِنَا فِي الْآفَاقِ وَفِي أَنفُسِهِمْ﴾ — الآيات الكونية والنفسية دليل على الحق.
﴿وَمَنْ أَحْسَنُ قَوْلًا مِّمَّن دَعَا إِلَى اللَّهِ﴾ — الدعوة إلى الله أحسن الأقوال.`,
  'الشورى_full': `**سورة الشورى**
53 آية مكية. تتناول الوحي والشورى وصفات المؤمنين.

﴿وَأَمْرُهُمْ شُورَىٰ بَيْنَهُمْ﴾ — الشورى أصل في نظام المسلمين.
﴿وَمَا أَصَابَكُم مِّن مُّصِيبَةٍ فَبِمَا كَسَبَتْ أَيْدِيكُمْ﴾ — المصائب نتيجة الذنوب غالباً.`,
  'الشورى_tafsir': `**سورة الشورى**
53 آية مكية. تتناول الوحي والشورى وصفات المؤمنين.

﴿وَأَمْرُهُمْ شُورَىٰ بَيْنَهُمْ﴾ — الشورى أصل في نظام المسلمين.
﴿وَمَا أَصَابَكُم مِّن مُّصِيبَةٍ فَبِمَا كَسَبَتْ أَيْدِيكُمْ﴾ — المصائب نتيجة الذنوب غالباً.`,
  'الزخرف_full': `**سورة الزخرف**
89 آية مكية. تتناول تكريم القرآن وقصة إبراهيم ومحاجته لقومه وقصة عيسى.

﴿وَإِنَّهُ لَذِكْرٌ لَّكَ وَلِقَوْمِكَ﴾ — القرآن شرف للنبي ﷺ ولأمته.
﴿الْأَخِلَّاءُ يَوْمَئِذٍ بَعْضُهُمْ لِبَعْضٍ عَدُوٌّ إِلَّا الْمُتَّقِينَ﴾ — الصداقة القائمة على المعصية تنقلب عداوة.`,
  'الزخرف_tafsir': `**سورة الزخرف**
89 آية مكية. تتناول تكريم القرآن وقصة إبراهيم ومحاجته لقومه وقصة عيسى.

﴿وَإِنَّهُ لَذِكْرٌ لَّكَ وَلِقَوْمِكَ﴾ — القرآن شرف للنبي ﷺ ولأمته.
﴿الْأَخِلَّاءُ يَوْمَئِذٍ بَعْضُهُمْ لِبَعْضٍ عَدُوٌّ إِلَّا الْمُتَّقِينَ﴾ — الصداقة القائمة على المعصية تنقلب عداوة.`,
  'الدخان_full': `**سورة الدخان**
59 آية مكية. تتناول ليلة القدر وعلامات يوم القيامة وقصة فرعون.

﴿إِنَّا أَنزَلْنَاهُ فِي لَيْلَةٍ مُّبَارَكَةٍ﴾ — نزول القرآن في ليلة القدر المباركة.
﴿فَارْتَقِبْ يَوْمَ تَأْتِي السَّمَاءُ بِدُخَانٍ مُّبِينٍ﴾ — من علامات يوم القيامة.`,
  'الدخان_tafsir': `**سورة الدخان**
59 آية مكية. تتناول ليلة القدر وعلامات يوم القيامة وقصة فرعون.

﴿إِنَّا أَنزَلْنَاهُ فِي لَيْلَةٍ مُّبَارَكَةٍ﴾ — نزول القرآن في ليلة القدر المباركة.
﴿فَارْتَقِبْ يَوْمَ تَأْتِي السَّمَاءُ بِدُخَانٍ مُّبِينٍ﴾ — من علامات يوم القيامة.`,
  'الجاثية_full': `**سورة الجاثية**
37 آية مكية. تتناول آيات الكون الدالة على وحدانية الله وجزاء المؤمنين والكافرين.

﴿وَسَخَّرَ لَكُم مَّا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ جَمِيعًا﴾ — تسخير الكون للإنسان نعمة عظيمة.
﴿وَتَرَىٰ كُلَّ أُمَّةٍ جَاثِيَةً﴾ — كل أمة جاثية على ركبها أمام الله يوم القيامة.`,
  'الجاثية_tafsir': `**سورة الجاثية**
37 آية مكية. تتناول آيات الكون الدالة على وحدانية الله وجزاء المؤمنين والكافرين.

﴿وَسَخَّرَ لَكُم مَّا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ جَمِيعًا﴾ — تسخير الكون للإنسان نعمة عظيمة.
﴿وَتَرَىٰ كُلَّ أُمَّةٍ جَاثِيَةً﴾ — كل أمة جاثية على ركبها أمام الله يوم القيامة.`,
  'الأحقاف_full': `**سورة الأحقاف**
35 آية مكية. تتناول قصة عاد وهود، وسماع الجن للقرآن.

﴿وَوَصَّيْنَا الْإِنسَانَ بِوَالِدَيْهِ إِحْسَانًا﴾ — بر الوالدين فريضة إسلامية.
﴿وَإِذْ صَرَفْنَا إِلَيْكَ نَفَرًا مِّنَ الْجِنِّ يَسْتَمِعُونَ الْقُرْآنَ﴾ — إيمان الجن بالقرآن.`,
  'الأحقاف_tafsir': `**سورة الأحقاف**
35 آية مكية. تتناول قصة عاد وهود، وسماع الجن للقرآن.

﴿وَوَصَّيْنَا الْإِنسَانَ بِوَالِدَيْهِ إِحْسَانًا﴾ — بر الوالدين فريضة إسلامية.
﴿وَإِذْ صَرَفْنَا إِلَيْكَ نَفَرًا مِّنَ الْجِنِّ يَسْتَمِعُونَ الْقُرْآنَ﴾ — إيمان الجن بالقرآن.`,
  'محمد_full': `**سورة محمد (القتال)**
38 آية مدنية. تتناول الجهاد والقتال وأحكام الأسرى.

﴿وَالَّذِينَ قُتِلُوا فِي سَبِيلِ اللَّهِ فَلَن يُضِلَّ أَعْمَالَهُمْ﴾ — الشهداء لن يضيع عملهم.
﴿فَإِذَا لَقِيتُمُ الَّذِينَ كَفَرُوا فَضَرْبَ الرِّقَابِ﴾ — أحكام القتال في الميدان.`,
  'محمد_tafsir': `**سورة محمد (القتال)**
38 آية مدنية. تتناول الجهاد والقتال وأحكام الأسرى.

﴿وَالَّذِينَ قُتِلُوا فِي سَبِيلِ اللَّهِ فَلَن يُضِلَّ أَعْمَالَهُمْ﴾ — الشهداء لن يضيع عملهم.
﴿فَإِذَا لَقِيتُمُ الَّذِينَ كَفَرُوا فَضَرْبَ الرِّقَابِ﴾ — أحكام القتال في الميدان.`,
  'الفتح_full': `**سورة الفتح**
29 آية مدنية. نزلت بعد صلح الحديبية. سماه القرآن فتحاً مبيناً رغم أنه وقف في نظر البعض.

﴿إِنَّا فَتَحْنَا لَكَ فَتْحًا مُّبِينًا﴾ — صلح الحديبية فتح مبين لأنه مهّد لفتح مكة.
﴿مُّحَمَّدٌ رَّسُولُ اللَّهِ وَالَّذِينَ مَعَهُ أَشِدَّاءُ عَلَى الْكُفَّارِ رُحَمَاءُ بَيْنَهُمْ﴾ — صفة الصحابة.`,
  'الفتح_tafsir': `**سورة الفتح**
29 آية مدنية. نزلت بعد صلح الحديبية. سماه القرآن فتحاً مبيناً رغم أنه وقف في نظر البعض.

﴿إِنَّا فَتَحْنَا لَكَ فَتْحًا مُّبِينًا﴾ — صلح الحديبية فتح مبين لأنه مهّد لفتح مكة.
﴿مُّحَمَّدٌ رَّسُولُ اللَّهِ وَالَّذِينَ مَعَهُ أَشِدَّاءُ عَلَى الْكُفَّارِ رُحَمَاءُ بَيْنَهُمْ﴾ — صفة الصحابة.`,
  'الحجرات_full': `**سورة الحجرات**
18 آية مدنية. دستور أخلاقي إسلامي شامل: الأدب مع النبي، التثبت من الأخبار، الأخوة الإسلامية.

﴿يَا أَيُّهَا الَّذِينَ آمَنُوا لَا يَسْخَرْ قَوْمٌ مِّن قَوْمٍ﴾ — تحريم السخرية والغيبة والظن السيئ.
﴿إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ﴾ — الكرم بالتقوى لا بالنسب أو اللون.
﴿إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ فَأَصْلِحُوا بَيْنَ أَخَوَيْكُمْ﴾ — الأخوة الإسلامية فريضة.`,
  'الحجرات_tafsir': `**سورة الحجرات**
18 آية مدنية. دستور أخلاقي إسلامي شامل: الأدب مع النبي، التثبت من الأخبار، الأخوة الإسلامية.

﴿يَا أَيُّهَا الَّذِينَ آمَنُوا لَا يَسْخَرْ قَوْمٌ مِّن قَوْمٍ﴾ — تحريم السخرية والغيبة والظن السيئ.
﴿إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ﴾ — الكرم بالتقوى لا بالنسب أو اللون.
﴿إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ فَأَصْلِحُوا بَيْنَ أَخَوَيْكُمْ﴾ — الأخوة الإسلامية فريضة.`,
  'ق_full': `**سورة ق**
45 آية مكية. تتناول إثبات البعث والحشر وأهوال يوم القيامة.

﴿وَلَقَدْ خَلَقْنَا الْإِنسَانَ وَنَعْلَمُ مَا تُوَسْوِسُ بِهِ نَفْسُهُ﴾ — الله يعلم خفايا النفوس.
﴿وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ﴾ — قرب الله من الإنسان أقرب من وريده.`,
  'ق_tafsir': `**سورة ق**
45 آية مكية. تتناول إثبات البعث والحشر وأهوال يوم القيامة.

﴿وَلَقَدْ خَلَقْنَا الْإِنسَانَ وَنَعْلَمُ مَا تُوَسْوِسُ بِهِ نَفْسُهُ﴾ — الله يعلم خفايا النفوس.
﴿وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ﴾ — قرب الله من الإنسان أقرب من وريده.`,
  'الذاريات_full': `**سورة الذاريات**
60 آية مكية. تتناول آيات الكون وقصة إبراهيم وقصص الأنبياء.

﴿وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ﴾ — الغاية من الخلق العبادة.
﴿وَفِي أَنفُسِكُمْ أَفَلَا تُبْصِرُونَ﴾ — الإنسان آية في نفسه.`,
  'الذاريات_tafsir': `**سورة الذاريات**
60 آية مكية. تتناول آيات الكون وقصة إبراهيم وقصص الأنبياء.

﴿وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ﴾ — الغاية من الخلق العبادة.
﴿وَفِي أَنفُسِكُمْ أَفَلَا تُبْصِرُونَ﴾ — الإنسان آية في نفسه.`,
  'الطور_full': `**سورة الطور**
49 آية مكية. قسم بخمسة أشياء مقدسة يؤكد وقوع العذاب ثم يصف نعيم الجنة.

﴿وَالطُّورِ وَكِتَابٍ مَّسْطُورٍ﴾ — قسم بالطور والكتاب المسطور والبيت المعمور.
﴿إِنَّ عَذَابَ رَبِّكَ لَوَاقِعٌ مَّا لَهُ مِن دَافِعٍ﴾ — حتمية العذاب للكافرين.`,
  'الطور_tafsir': `**سورة الطور**
49 آية مكية. قسم بخمسة أشياء مقدسة يؤكد وقوع العذاب ثم يصف نعيم الجنة.

﴿وَالطُّورِ وَكِتَابٍ مَّسْطُورٍ﴾ — قسم بالطور والكتاب المسطور والبيت المعمور.
﴿إِنَّ عَذَابَ رَبِّكَ لَوَاقِعٌ مَّا لَهُ مِن دَافِعٍ﴾ — حتمية العذاب للكافرين.`,
  'النجم_full': `**سورة النجم**
62 آية مكية. تتحدث عن الوحي والمعراج ورؤية النبي ﷺ لجبريل.

﴿وَالنَّجْمِ إِذَا هَوَىٰ مَا ضَلَّ صَاحِبُكُمْ وَمَا غَوَىٰ﴾ — تبرئة النبي ﷺ من الضلال.
﴿إِنْ هُوَ إِلَّا وَحْيٌ يُوحَىٰ﴾ — القرآن وحي من الله لا كلام بشر.`,
  'النجم_tafsir': `**سورة النجم**
62 آية مكية. تتحدث عن الوحي والمعراج ورؤية النبي ﷺ لجبريل.

﴿وَالنَّجْمِ إِذَا هَوَىٰ مَا ضَلَّ صَاحِبُكُمْ وَمَا غَوَىٰ﴾ — تبرئة النبي ﷺ من الضلال.
﴿إِنْ هُوَ إِلَّا وَحْيٌ يُوحَىٰ﴾ — القرآن وحي من الله لا كلام بشر.`,
  'القمر_full': `**سورة القمر**
55 آية مكية. تتناول انشقاق القمر وقصص نوح وعاد وثمود ولوط وفرعون.

﴿اقْتَرَبَتِ السَّاعَةُ وَانشَقَّ الْقَمَرُ﴾ — انشقاق القمر معجزة حقيقية شهدها الصحابة.
﴿وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ﴾ — القرآن ميسّر للحفظ والفهم.`,
  'القمر_tafsir': `**سورة القمر**
55 آية مكية. تتناول انشقاق القمر وقصص نوح وعاد وثمود ولوط وفرعون.

﴿اقْتَرَبَتِ السَّاعَةُ وَانشَقَّ الْقَمَرُ﴾ — انشقاق القمر معجزة حقيقية شهدها الصحابة.
﴿وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ﴾ — القرآن ميسّر للحفظ والفهم.`,
  'الرحمن_full': `**سورة الرحمن — عروس القرآن**
78 آية. تعدد نعم الله على الإنس والجن. ﴿فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ﴾ تتكرر 31 مرة.

﴿الرَّحْمَٰنُ عَلَّمَ الْقُرْآنَ خَلَقَ الْإِنسَانَ﴾ — أول نعمة: تعليم القرآن قبل خلق الإنسان.
﴿الشَّمْسُ وَالْقَمَرُ بِحُسْبَانٍ﴾ — الكون منضبط بحساب دقيق.
﴿مَرَجَ الْبَحْرَيْنِ يَلْتَقِيَانِ بَيْنَهُمَا بَرْزَخٌ﴾ — إعجاز علمي في عدم اختلاط البحرين.
﴿وَلِمَنْ خَافَ مَقَامَ رَبِّهِ جَنَّتَانِ﴾ — جزاء الخائفين من الله جنتان.`,
  'الرحمن_tafsir': `**سورة الرحمن — عروس القرآن**
78 آية. تعدد نعم الله على الإنس والجن. ﴿فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ﴾ تتكرر 31 مرة.

﴿الرَّحْمَٰنُ عَلَّمَ الْقُرْآنَ خَلَقَ الْإِنسَانَ﴾ — أول نعمة: تعليم القرآن قبل خلق الإنسان.
﴿الشَّمْسُ وَالْقَمَرُ بِحُسْبَانٍ﴾ — الكون منضبط بحساب دقيق.
﴿مَرَجَ الْبَحْرَيْنِ يَلْتَقِيَانِ بَيْنَهُمَا بَرْزَخٌ﴾ — إعجاز علمي في عدم اختلاط البحرين.
﴿وَلِمَنْ خَافَ مَقَامَ رَبِّهِ جَنَّتَانِ﴾ — جزاء الخائفين من الله جنتان.`,
  'الواقعة_full': `**سورة الواقعة**
96 آية مكية. تقسّم الناس ثلاثة أصناف: السابقون، أصحاب اليمين، أصحاب الشمال.

﴿إِذَا وَقَعَتِ الْوَاقِعَةُ لَيْسَ لِوَقْعَتِهَا كَاذِبَةٌ﴾ — القيامة واقعة لا محالة.
﴿وَالسَّابِقُونَ السَّابِقُونَ أُولَٰئِكَ الْمُقَرَّبُونَ﴾ — السابقون في الخير أقرب إلى الله.
قال ﷺ: «من قرأ سورة الواقعة كل ليلة لم تصبه فاقة أبداً» (البيهقي).`,
  'الواقعة_tafsir': `**سورة الواقعة**
96 آية مكية. تقسّم الناس ثلاثة أصناف: السابقون، أصحاب اليمين، أصحاب الشمال.

﴿إِذَا وَقَعَتِ الْوَاقِعَةُ لَيْسَ لِوَقْعَتِهَا كَاذِبَةٌ﴾ — القيامة واقعة لا محالة.
﴿وَالسَّابِقُونَ السَّابِقُونَ أُولَٰئِكَ الْمُقَرَّبُونَ﴾ — السابقون في الخير أقرب إلى الله.
قال ﷺ: «من قرأ سورة الواقعة كل ليلة لم تصبه فاقة أبداً» (البيهقي).`,
  'الحديد_full': `**سورة الحديد**
29 آية مدنية. تتناول صفات الله وفضل الإنفاق والجهاد وحقيقة الدنيا.

﴿هُوَ الْأَوَّلُ وَالْآخِرُ وَالظَّاهِرُ وَالْبَاطِنُ﴾ — أربعة أسماء جامعة لصفات الله.
﴿اعْلَمُوا أَنَّمَا الْحَيَاةُ الدُّنْيَا لَعِبٌ وَلَهْوٌ﴾ — حقيقة الدنيا الزائلة.`,
  'الحديد_tafsir': `**سورة الحديد**
29 آية مدنية. تتناول صفات الله وفضل الإنفاق والجهاد وحقيقة الدنيا.

﴿هُوَ الْأَوَّلُ وَالْآخِرُ وَالظَّاهِرُ وَالْبَاطِنُ﴾ — أربعة أسماء جامعة لصفات الله.
﴿اعْلَمُوا أَنَّمَا الْحَيَاةُ الدُّنْيَا لَعِبٌ وَلَهْوٌ﴾ — حقيقة الدنيا الزائلة.`,
  'المجادلة_full': `**سورة المجادلة**
22 آية مدنية. نزلت في شأن خولة بنت ثعلبة التي جادلت النبي ﷺ في حكم الظهار.

﴿قَدْ سَمِعَ اللَّهُ قَوْلَ الَّتِي تُجَادِلُكَ فِي زَوْجِهَا﴾ — الله سمع شكوى امرأة مستضعفة.
﴿لَا تَجِدُ قَوْمًا يُؤْمِنُونَ بِاللَّهِ وَالْيَوْمِ الْآخِرِ يُوَادُّونَ مَنْ حَادَّ اللَّهَ﴾ — حقيقة الولاء الإسلامي.`,
  'المجادلة_tafsir': `**سورة المجادلة**
22 آية مدنية. نزلت في شأن خولة بنت ثعلبة التي جادلت النبي ﷺ في حكم الظهار.

﴿قَدْ سَمِعَ اللَّهُ قَوْلَ الَّتِي تُجَادِلُكَ فِي زَوْجِهَا﴾ — الله سمع شكوى امرأة مستضعفة.
﴿لَا تَجِدُ قَوْمًا يُؤْمِنُونَ بِاللَّهِ وَالْيَوْمِ الْآخِرِ يُوَادُّونَ مَنْ حَادَّ اللَّهَ﴾ — حقيقة الولاء الإسلامي.`,
  'الحشر_full': `**سورة الحشر**
24 آية مدنية. تتناول غزوة بني النضير وأحكام الفيء وأسماء الله الحسنى في خاتمتها.

﴿هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ عَالِمُ الْغَيْبِ وَالشَّهَادَةِ﴾ — أجمع آيات في أسماء الله.
﴿لَوْ أَنزَلْنَا هَٰذَا الْقُرْآنَ عَلَىٰ جَبَلٍ لَّرَأَيْتَهُ خَاشِعًا﴾ — عظمة القرآن التي تخشع لها الجبال.`,
  'الحشر_tafsir': `**سورة الحشر**
24 آية مدنية. تتناول غزوة بني النضير وأحكام الفيء وأسماء الله الحسنى في خاتمتها.

﴿هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ عَالِمُ الْغَيْبِ وَالشَّهَادَةِ﴾ — أجمع آيات في أسماء الله.
﴿لَوْ أَنزَلْنَا هَٰذَا الْقُرْآنَ عَلَىٰ جَبَلٍ لَّرَأَيْتَهُ خَاشِعًا﴾ — عظمة القرآن التي تخشع لها الجبال.`,
  'الممتحنة_full': `**سورة الممتحنة**
13 آية مدنية. تتناول الموقف من المشركين والكافرين وحكم موالاتهم.

﴿لَّا يَنْهَاكُمُ اللَّهُ عَنِ الَّذِينَ لَمْ يُقَاتِلُوكُمْ فِي الدِّينِ﴾ — العدل والبر مع غير المحاربين مأذون به.
قصة إبراهيم وتبرئه من قومه أسوة للمؤمنين.`,
  'الممتحنة_tafsir': `**سورة الممتحنة**
13 آية مدنية. تتناول الموقف من المشركين والكافرين وحكم موالاتهم.

﴿لَّا يَنْهَاكُمُ اللَّهُ عَنِ الَّذِينَ لَمْ يُقَاتِلُوكُمْ فِي الدِّينِ﴾ — العدل والبر مع غير المحاربين مأذون به.
قصة إبراهيم وتبرئه من قومه أسوة للمؤمنين.`,
  'الصف_full': `**سورة الصف**
14 آية مدنية. تتناول الجهاد في سبيل الله والبشارة بالنبي ﷺ في الإنجيل.

﴿يَا أَيُّهَا الَّذِينَ آمَنُوا لِمَ تَقُولُونَ مَا لَا تَفْعَلُونَ﴾ — ذم قول ما لا يُفعل.
﴿وَإِذْ قَالَ عِيسَى ابْنُ مَرْيَمَ يَا بَنِي إِسْرَائِيلَ إِنِّي رَسُولُ اللَّهِ إِلَيْكُمْ مُبَشِّرًا بِرَسُولٍ يَأْتِي مِن بَعْدِي اسْمُهُ أَحْمَدُ﴾ — بشارة عيسى بمحمد ﷺ.`,
  'الصف_tafsir': `**سورة الصف**
14 آية مدنية. تتناول الجهاد في سبيل الله والبشارة بالنبي ﷺ في الإنجيل.

﴿يَا أَيُّهَا الَّذِينَ آمَنُوا لِمَ تَقُولُونَ مَا لَا تَفْعَلُونَ﴾ — ذم قول ما لا يُفعل.
﴿وَإِذْ قَالَ عِيسَى ابْنُ مَرْيَمَ يَا بَنِي إِسْرَائِيلَ إِنِّي رَسُولُ اللَّهِ إِلَيْكُمْ مُبَشِّرًا بِرَسُولٍ يَأْتِي مِن بَعْدِي اسْمُهُ أَحْمَدُ﴾ — بشارة عيسى بمحمد ﷺ.`,
  'الجمعة_full': `**سورة الجمعة**
11 آية مدنية. تتناول فرضية صلاة الجمعة وحكم السعي إليها وترك البيع.

﴿يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِن يَوْمِ الْجُمُعَةِ فَاسْعَوْا إِلَىٰ ذِكْرِ اللَّهِ﴾ — وجوب السعي لصلاة الجمعة.
فضل الجمعة: يوم عيد المسلمين الأسبوعي.`,
  'الجمعة_tafsir': `**سورة الجمعة**
11 آية مدنية. تتناول فرضية صلاة الجمعة وحكم السعي إليها وترك البيع.

﴿يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِن يَوْمِ الْجُمُعَةِ فَاسْعَوْا إِلَىٰ ذِكْرِ اللَّهِ﴾ — وجوب السعي لصلاة الجمعة.
فضل الجمعة: يوم عيد المسلمين الأسبوعي.`,
  'المنافقون_full': `**سورة المنافقون**
11 آية مدنية. تكشف صفات المنافقين وأخطارهم على المجتمع المسلم.

﴿وَإِذَا رَأَيْتَهُمْ تُعْجِبُكَ أَجْسَامُهُمْ وَإِن يَقُولُوا تَسْمَعْ لِقَوْلِهِمْ﴾ — المنافق يبهر في الظاهر.
﴿هُمُ الْعَدُوُّ فَاحْذَرْهُمْ﴾ — المنافق أشد خطراً من الكافر الصريح.`,
  'المنافقون_tafsir': `**سورة المنافقون**
11 آية مدنية. تكشف صفات المنافقين وأخطارهم على المجتمع المسلم.

﴿وَإِذَا رَأَيْتَهُمْ تُعْجِبُكَ أَجْسَامُهُمْ وَإِن يَقُولُوا تَسْمَعْ لِقَوْلِهِمْ﴾ — المنافق يبهر في الظاهر.
﴿هُمُ الْعَدُوُّ فَاحْذَرْهُمْ﴾ — المنافق أشد خطراً من الكافر الصريح.`,
  'التغابن_full': `**سورة التغابن**
18 آية. تتناول يوم التغابن (يوم القيامة) وأحكام الأسرة والأولاد.

﴿مَا أَصَابَ مِن مُّصِيبَةٍ إِلَّا بِإِذْنِ اللَّهِ﴾ — المصائب بإذن الله والإيمان بهذا يطمئن القلب.
﴿إِنَّمَا أَمْوَالُكُمْ وَأَوْلَادُكُمْ فِتْنَةٌ﴾ — الأموال والأولاد اختبار لا غاية.`,
  'التغابن_tafsir': `**سورة التغابن**
18 آية. تتناول يوم التغابن (يوم القيامة) وأحكام الأسرة والأولاد.

﴿مَا أَصَابَ مِن مُّصِيبَةٍ إِلَّا بِإِذْنِ اللَّهِ﴾ — المصائب بإذن الله والإيمان بهذا يطمئن القلب.
﴿إِنَّمَا أَمْوَالُكُمْ وَأَوْلَادُكُمْ فِتْنَةٌ﴾ — الأموال والأولاد اختبار لا غاية.`,
  'الطلاق_full': `**سورة الطلاق**
12 آية مدنية. أحكام الطلاق والعدة والنفقة بالتفصيل.

﴿وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ﴾ — التقوى مفتاح كل فرج.
﴿وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ﴾ — الله كافي المتوكل عليه.`,
  'الطلاق_tafsir': `**سورة الطلاق**
12 آية مدنية. أحكام الطلاق والعدة والنفقة بالتفصيل.

﴿وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ﴾ — التقوى مفتاح كل فرج.
﴿وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ﴾ — الله كافي المتوكل عليه.`,
  'التحريم_full': `**سورة التحريم**
12 آية مدنية. تتناول حادثة تحريم النبي ﷺ لنفسه شيئاً حلالاً وضرب الأمثال بالنساء الصالحات والطالحات.

﴿يَا أَيُّهَا النَّبِيُّ لِمَ تُحَرِّمُ مَا أَحَلَّ اللَّهُ لَكَ﴾ — لا يجوز تحريم ما أحل الله.
﴿قُوا أَنفُسَكُمْ وَأَهْلِيكُمْ نَارًا﴾ — مسؤولية الأب عن تربية أسرته.`,
  'التحريم_tafsir': `**سورة التحريم**
12 آية مدنية. تتناول حادثة تحريم النبي ﷺ لنفسه شيئاً حلالاً وضرب الأمثال بالنساء الصالحات والطالحات.

﴿يَا أَيُّهَا النَّبِيُّ لِمَ تُحَرِّمُ مَا أَحَلَّ اللَّهُ لَكَ﴾ — لا يجوز تحريم ما أحل الله.
﴿قُوا أَنفُسَكُمْ وَأَهْلِيكُمْ نَارًا﴾ — مسؤولية الأب عن تربية أسرته.`,
  'الملك_full': `**سورة الملك (تبارك)**
30 آية مكية. قال ﷺ: «إنها تشفع لصاحبها وتنجيه من عذاب القبر».

﴿تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ﴾ — الملك الكامل لله وحده.
﴿الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا﴾ — الدنيا ميدان ابتلاء.
﴿أَلَا يَعْلَمُ مَنْ خَلَقَ وَهُوَ اللَّطِيفُ الْخَبِيرُ﴾ — الخالق أعلم بما خلق.`,
  'الملك_tafsir': `**سورة الملك (تبارك)**
30 آية مكية. قال ﷺ: «إنها تشفع لصاحبها وتنجيه من عذاب القبر».

﴿تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ﴾ — الملك الكامل لله وحده.
﴿الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا﴾ — الدنيا ميدان ابتلاء.
﴿أَلَا يَعْلَمُ مَنْ خَلَقَ وَهُوَ اللَّطِيفُ الْخَبِيرُ﴾ — الخالق أعلم بما خلق.`,
  'القلم_full': `**سورة القلم (ن)**
52 آية مكية. ثاني سورة نزلت. تُثني على النبي ﷺ وترد على المشركين.

﴿وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ﴾ — شهادة الله للنبي ﷺ بعظمة الخُلق.
﴿وَلَا تُطِعْ كُلَّ حَلَّافٍ مَّهِينٍ﴾ — النهي عن طاعة كثير الحلف الحقير.`,
  'القلم_tafsir': `**سورة القلم (ن)**
52 آية مكية. ثاني سورة نزلت. تُثني على النبي ﷺ وترد على المشركين.

﴿وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ﴾ — شهادة الله للنبي ﷺ بعظمة الخُلق.
﴿وَلَا تُطِعْ كُلَّ حَلَّافٍ مَّهِينٍ﴾ — النهي عن طاعة كثير الحلف الحقير.`,
  'الحاقة_full': `**سورة الحاقة**
52 آية مكية. تصف يوم القيامة بتفصيل مدهش وتذكر أحوال المؤمنين والكافرين.

﴿الْحَاقَّةُ مَا الْحَاقَّةُ وَمَا أَدْرَاكَ مَا الْحَاقَّةُ﴾ — تعظيم يوم القيامة بالتكرار.
﴿فَأَمَّا مَنْ أُوتِيَ كِتَابَهُ بِيَمِينِهِ فَيَقُولُ هَاؤُمُ اقْرَءُوا كِتَابِيَهْ﴾ — فرح المؤمن بكتابه يوم الحساب.`,
  'الحاقة_tafsir': `**سورة الحاقة**
52 آية مكية. تصف يوم القيامة بتفصيل مدهش وتذكر أحوال المؤمنين والكافرين.

﴿الْحَاقَّةُ مَا الْحَاقَّةُ وَمَا أَدْرَاكَ مَا الْحَاقَّةُ﴾ — تعظيم يوم القيامة بالتكرار.
﴿فَأَمَّا مَنْ أُوتِيَ كِتَابَهُ بِيَمِينِهِ فَيَقُولُ هَاؤُمُ اقْرَءُوا كِتَابِيَهْ﴾ — فرح المؤمن بكتابه يوم الحساب.`,
  'المعارج_full': `**سورة المعارج**
44 آية مكية. تتناول عذاب الكافرين وصفات الإنسان ومدح المؤمنين الصابرين.

﴿إِنَّ الْإِنسَانَ خُلِقَ هَلُوعًا إِذَا مَسَّهُ الشَّرُّ جَزُوعًا وَإِذَا مَسَّهُ الْخَيْرُ مَنُوعًا﴾ — طبيعة الإنسان الجزع والمنع إلا المؤمنين.
﴿إِلَّا الْمُصَلِّينَ﴾ — استثناء المؤمنين من صفة الهلع.`,
  'المعارج_tafsir': `**سورة المعارج**
44 آية مكية. تتناول عذاب الكافرين وصفات الإنسان ومدح المؤمنين الصابرين.

﴿إِنَّ الْإِنسَانَ خُلِقَ هَلُوعًا إِذَا مَسَّهُ الشَّرُّ جَزُوعًا وَإِذَا مَسَّهُ الْخَيْرُ مَنُوعًا﴾ — طبيعة الإنسان الجزع والمنع إلا المؤمنين.
﴿إِلَّا الْمُصَلِّينَ﴾ — استثناء المؤمنين من صفة الهلع.`,
  'نوح_full': `**سورة نوح**
28 آية مكية. دعوة نوح عليه السلام لقومه 950 سنة وأساليبه المتنوعة في الدعوة.

﴿قَالَ رَبِّ إِنِّي دَعَوْتُ قَوْمِي لَيْلًا وَنَهَارًا﴾ — مثابرة نوح في الدعوة.
﴿رَّبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِمَن دَخَلَ بَيْتِيَ مُؤْمِنًا﴾ — دعاء نوح الجامع.`,
  'نوح_tafsir': `**سورة نوح**
28 آية مكية. دعوة نوح عليه السلام لقومه 950 سنة وأساليبه المتنوعة في الدعوة.

﴿قَالَ رَبِّ إِنِّي دَعَوْتُ قَوْمِي لَيْلًا وَنَهَارًا﴾ — مثابرة نوح في الدعوة.
﴿رَّبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِمَن دَخَلَ بَيْتِيَ مُؤْمِنًا﴾ — دعاء نوح الجامع.`,
  'الجن_full': `**سورة الجن**
28 آية مكية. حكاية ما قاله نفر من الجن حين سمعوا القرآن فآمنوا.

﴿إِنَّا سَمِعْنَا قُرْآنًا عَجَبًا يَهْدِي إِلَى الرُّشْدِ فَآمَنَّا بِهِ﴾ — الجن يؤمنون بمجرد سماع القرآن.
﴿وَأَنَّ الْمَسَاجِدَ لِلَّهِ فَلَا تَدْعُوا مَعَ اللَّهِ أَحَدًا﴾ — المساجد لعبادة الله وحده.`,
  'الجن_tafsir': `**سورة الجن**
28 آية مكية. حكاية ما قاله نفر من الجن حين سمعوا القرآن فآمنوا.

﴿إِنَّا سَمِعْنَا قُرْآنًا عَجَبًا يَهْدِي إِلَى الرُّشْدِ فَآمَنَّا بِهِ﴾ — الجن يؤمنون بمجرد سماع القرآن.
﴿وَأَنَّ الْمَسَاجِدَ لِلَّهِ فَلَا تَدْعُوا مَعَ اللَّهِ أَحَدًا﴾ — المساجد لعبادة الله وحده.`,
  'المزمل_full': `**سورة المزمل**
20 آية مكية. تأمر النبي ﷺ بقيام الليل وتلاوة القرآن وتحمّل أذى المشركين.

﴿يَا أَيُّهَا الْمُزَّمِّلُ قُمِ اللَّيْلَ إِلَّا قَلِيلًا﴾ — قيام الليل تكوين للنبي والمؤمنين.
﴿إِنَّ نَاشِئَةَ اللَّيْلِ هِيَ أَشَدُّ وَطْئًا وَأَقْوَمُ قِيلًا﴾ — قيام الليل أشد وقعاً في القلب.`,
  'المزمل_tafsir': `**سورة المزمل**
20 آية مكية. تأمر النبي ﷺ بقيام الليل وتلاوة القرآن وتحمّل أذى المشركين.

﴿يَا أَيُّهَا الْمُزَّمِّلُ قُمِ اللَّيْلَ إِلَّا قَلِيلًا﴾ — قيام الليل تكوين للنبي والمؤمنين.
﴿إِنَّ نَاشِئَةَ اللَّيْلِ هِيَ أَشَدُّ وَطْئًا وَأَقْوَمُ قِيلًا﴾ — قيام الليل أشد وقعاً في القلب.`,
  'المدثر_full': `**سورة المدثر**
56 آية مكية. أوائلها أول ما نزل بعد انقطاع الوحي. تأمر بالإنذار والتطهير وتكشف سبب دخول النار.

﴿يَا أَيُّهَا الْمُدَّثِّرُ قُمْ فَأَنذِرْ﴾ — الأمر بالإنذار والدعوة العامة.
﴿وَثِيَابَكَ فَطَهِّرْ﴾ — الطهارة الظاهرة والباطنة واجبة.
﴿مَا سَلَكَكُمْ فِي سَقَرَ قَالُوا لَمْ نَكُ مِنَ الْمُصَلِّينَ﴾ — ترك الصلاة أول أسباب النار.`,
  'المدثر_tafsir': `**سورة المدثر**
56 آية مكية. أوائلها أول ما نزل بعد انقطاع الوحي. تأمر بالإنذار والتطهير وتكشف سبب دخول النار.

﴿يَا أَيُّهَا الْمُدَّثِّرُ قُمْ فَأَنذِرْ﴾ — الأمر بالإنذار والدعوة العامة.
﴿وَثِيَابَكَ فَطَهِّرْ﴾ — الطهارة الظاهرة والباطنة واجبة.
﴿مَا سَلَكَكُمْ فِي سَقَرَ قَالُوا لَمْ نَكُ مِنَ الْمُصَلِّينَ﴾ — ترك الصلاة أول أسباب النار.`,
  'القيامة_full': `**سورة القيامة**
40 آية مكية. تصف يوم القيامة وساعة الاحتضار وتكذيب الإنسان للبعث.

﴿لَا أُقْسِمُ بِيَوْمِ الْقِيَامَةِ﴾ — قسم بيوم القيامة على حقيقته.
﴿أَيَحْسَبُ الْإِنسَانُ أَلَّن نَّجْمَعَ عِظَامَهُ﴾ — الله قادر على جمع كل عظمة.
﴿إِنَّ عَلَيْنَا جَمْعَهُ وَقُرْآنَهُ﴾ — الله ضمن حفظ القرآن في صدر النبي ﷺ.`,
  'القيامة_tafsir': `**سورة القيامة**
40 آية مكية. تصف يوم القيامة وساعة الاحتضار وتكذيب الإنسان للبعث.

﴿لَا أُقْسِمُ بِيَوْمِ الْقِيَامَةِ﴾ — قسم بيوم القيامة على حقيقته.
﴿أَيَحْسَبُ الْإِنسَانُ أَلَّن نَّجْمَعَ عِظَامَهُ﴾ — الله قادر على جمع كل عظمة.
﴿إِنَّ عَلَيْنَا جَمْعَهُ وَقُرْآنَهُ﴾ — الله ضمن حفظ القرآن في صدر النبي ﷺ.`,
  'الإنسان_full': `**سورة الإنسان (الدهر)**
31 آية مدنية. تذكر بدء خلق الإنسان وطريق الهداية وجزاء الأبرار في الجنة.

﴿إِنَّا خَلَقْنَا الْإِنسَانَ مِن نُّطْفَةٍ أَمْشَاجٍ نَّبْتَلِيهِ﴾ — الإنسان من نطفة ممزوجة ومبتلى.
﴿إِنَّ هَٰذَا كَانَ لَكُمْ جَزَاءً وَكَانَ سَعْيُكُمْ مَّشْكُورًا﴾ — الجنة جزاء السعي المشكور.`,
  'الإنسان_tafsir': `**سورة الإنسان (الدهر)**
31 آية مدنية. تذكر بدء خلق الإنسان وطريق الهداية وجزاء الأبرار في الجنة.

﴿إِنَّا خَلَقْنَا الْإِنسَانَ مِن نُّطْفَةٍ أَمْشَاجٍ نَّبْتَلِيهِ﴾ — الإنسان من نطفة ممزوجة ومبتلى.
﴿إِنَّ هَٰذَا كَانَ لَكُمْ جَزَاءً وَكَانَ سَعْيُكُمْ مَّشْكُورًا﴾ — الجنة جزاء السعي المشكور.`,
  'المرسلات_full': `**سورة المرسلات**
50 آية مكية. قسم بالملائكة المرسلة وتكرار ﴿وَيْلٌ يَوْمَئِذٍ لِّلْمُكَذِّبِينَ﴾ عشر مرات.

﴿وَيْلٌ يَوْمَئِذٍ لِّلْمُكَذِّبِينَ﴾ — تهديد صارم متكرر للمكذبين بيوم القيامة.
﴿انطَلِقُوا إِلَىٰ مَا كُنتُم بِهِ تُكَذِّبُونَ﴾ — يُساق الكافر إلى ما كذّب به.`,
  'المرسلات_tafsir': `**سورة المرسلات**
50 آية مكية. قسم بالملائكة المرسلة وتكرار ﴿وَيْلٌ يَوْمَئِذٍ لِّلْمُكَذِّبِينَ﴾ عشر مرات.

﴿وَيْلٌ يَوْمَئِذٍ لِّلْمُكَذِّبِينَ﴾ — تهديد صارم متكرر للمكذبين بيوم القيامة.
﴿انطَلِقُوا إِلَىٰ مَا كُنتُم بِهِ تُكَذِّبُونَ﴾ — يُساق الكافر إلى ما كذّب به.`,
  'النبأ_full': `**سورة النبأ (عم)**
40 آية مكية. النبأ العظيم: يوم القيامة. تتناول آيات الخلق ثم أهوال القيامة.

﴿عَمَّ يَتَسَاءَلُونَ عَنِ النَّبَإِ الْعَظِيمِ﴾ — السؤال عن يوم القيامة.
﴿إِنَّ يَوْمَ الْفَصْلِ كَانَ مِيقَاتًا﴾ — يوم القيامة موعد محدد لا يتأخر.`,
  'النبأ_tafsir': `**سورة النبأ (عم)**
40 آية مكية. النبأ العظيم: يوم القيامة. تتناول آيات الخلق ثم أهوال القيامة.

﴿عَمَّ يَتَسَاءَلُونَ عَنِ النَّبَإِ الْعَظِيمِ﴾ — السؤال عن يوم القيامة.
﴿إِنَّ يَوْمَ الْفَصْلِ كَانَ مِيقَاتًا﴾ — يوم القيامة موعد محدد لا يتأخر.`,
  'النازعات_full': `**سورة النازعات**
46 آية مكية. قسم بالملائكة قابضات الأرواح وتتناول قصة موسى مع فرعون وأهوال الساعة.

﴿يَوْمَ تَرْجُفُ الرَّاجِفَةُ تَتْبَعُهَا الرَّادِفَةُ﴾ — النفختان وأهوال القيامة.
﴿فَأَمَّا مَنْ طَغَىٰ وَآثَرَ الْحَيَاةَ الدُّنْيَا فَإِنَّ الْجَحِيمَ هِيَ الْمَأْوَىٰ﴾ — جزاء من آثر الدنيا.`,
  'النازعات_tafsir': `**سورة النازعات**
46 آية مكية. قسم بالملائكة قابضات الأرواح وتتناول قصة موسى مع فرعون وأهوال الساعة.

﴿يَوْمَ تَرْجُفُ الرَّاجِفَةُ تَتْبَعُهَا الرَّادِفَةُ﴾ — النفختان وأهوال القيامة.
﴿فَأَمَّا مَنْ طَغَىٰ وَآثَرَ الْحَيَاةَ الدُّنْيَا فَإِنَّ الْجَحِيمَ هِيَ الْمَأْوَىٰ﴾ — جزاء من آثر الدنيا.`,
  'عبس_full': `**سورة عبس**
42 آية مكية. نزلت في شأن الأعمى ابن أم مكتوم حين عبس النبي ﷺ وأعرض عنه.

﴿عَبَسَ وَتَوَلَّىٰ أَن جَاءَهُ الْأَعْمَىٰ﴾ — الله يعاتب النبي ﷺ على إيثار الأغنياء.
﴿وَأَمَّا مَن جَاءَكَ يَسْعَىٰ وَهُوَ يَخْشَىٰ فَأَنتَ عَنْهُ تَلَهَّىٰ﴾ — الاهتمام بطالب الهداية أولى.`,
  'عبس_tafsir': `**سورة عبس**
42 آية مكية. نزلت في شأن الأعمى ابن أم مكتوم حين عبس النبي ﷺ وأعرض عنه.

﴿عَبَسَ وَتَوَلَّىٰ أَن جَاءَهُ الْأَعْمَىٰ﴾ — الله يعاتب النبي ﷺ على إيثار الأغنياء.
﴿وَأَمَّا مَن جَاءَكَ يَسْعَىٰ وَهُوَ يَخْشَىٰ فَأَنتَ عَنْهُ تَلَهَّىٰ﴾ — الاهتمام بطالب الهداية أولى.`,
  'التكوير_full': `**سورة التكوير**
29 آية مكية. تصف أهوال يوم القيامة بصور مدهشة: انطفاء الشمس، تناثر النجوم، تسيير الجبال.

﴿إِذَا الشَّمْسُ كُوِّرَتْ﴾ — سلسلة من أحداث يوم القيامة المذهلة.
﴿عَلِمَتْ نَفْسٌ مَّا أَحْضَرَتْ﴾ — يعلم كل إنسان ما قدّم من خير أو شر.`,
  'التكوير_tafsir': `**سورة التكوير**
29 آية مكية. تصف أهوال يوم القيامة بصور مدهشة: انطفاء الشمس، تناثر النجوم، تسيير الجبال.

﴿إِذَا الشَّمْسُ كُوِّرَتْ﴾ — سلسلة من أحداث يوم القيامة المذهلة.
﴿عَلِمَتْ نَفْسٌ مَّا أَحْضَرَتْ﴾ — يعلم كل إنسان ما قدّم من خير أو شر.`,
  'الانفطار_full': `**سورة الانفطار**
19 آية مكية. تتناول أهوال القيامة وإكرام الله للإنسان ثم إهمال الإنسان لهذا الإكرام.

﴿يَا أَيُّهَا الْإِنسَانُ مَا غَرَّكَ بِرَبِّكَ الْكَرِيمِ﴾ — سؤال توبيخي للإنسان الغافل.
﴿إِنَّ الْأَبْرَارَ لَفِي نَعِيمٍ وَإِنَّ الْفُجَّارَ لَفِي جَحِيمٍ﴾ — فصل حاسم بين الفريقين.`,
  'الانفطار_tafsir': `**سورة الانفطار**
19 آية مكية. تتناول أهوال القيامة وإكرام الله للإنسان ثم إهمال الإنسان لهذا الإكرام.

﴿يَا أَيُّهَا الْإِنسَانُ مَا غَرَّكَ بِرَبِّكَ الْكَرِيمِ﴾ — سؤال توبيخي للإنسان الغافل.
﴿إِنَّ الْأَبْرَارَ لَفِي نَعِيمٍ وَإِنَّ الْفُجَّارَ لَفِي جَحِيمٍ﴾ — فصل حاسم بين الفريقين.`,
  'المطففين_full': `**سورة المطففين**
36 آية. آخر سورة مكية. تُحذر من التطفيف في الكيل والميزان وتذكر سجل الأعمال.

﴿وَيْلٌ لِّلْمُطَفِّفِينَ الَّذِينَ إِذَا اكْتَالُوا عَلَى النَّاسِ يَسْتَوْفُونَ﴾ — التطفيف في الكيل كبيرة.
﴿كَلَّا إِنَّ كِتَابَ الْأَبْرَارِ لَفِي عِلِّيِّينَ﴾ — سجل الأبرار في أعلى عليين.`,
  'المطففين_tafsir': `**سورة المطففين**
36 آية. آخر سورة مكية. تُحذر من التطفيف في الكيل والميزان وتذكر سجل الأعمال.

﴿وَيْلٌ لِّلْمُطَفِّفِينَ الَّذِينَ إِذَا اكْتَالُوا عَلَى النَّاسِ يَسْتَوْفُونَ﴾ — التطفيف في الكيل كبيرة.
﴿كَلَّا إِنَّ كِتَابَ الْأَبْرَارِ لَفِي عِلِّيِّينَ﴾ — سجل الأبرار في أعلى عليين.`,
  'الانشقاق_full': `**سورة الانشقاق**
25 آية مكية. تتناول انشقاق السماء يوم القيامة ومجيء الإنسان بعمله.

﴿يَا أَيُّهَا الْإِنسَانُ إِنَّكَ كَادِحٌ إِلَىٰ رَبِّكَ كَدْحًا فَمُلَاقِيهِ﴾ — الإنسان سائر إلى الله لا محالة.
﴿فَأَمَّا مَنْ أُوتِيَ كِتَابَهُ بِيَمِينِهِ فَسَوْفَ يُحَاسَبُ حِسَابًا يَسِيرًا﴾ — الحساب اليسير نعمة.`,
  'الانشقاق_tafsir': `**سورة الانشقاق**
25 آية مكية. تتناول انشقاق السماء يوم القيامة ومجيء الإنسان بعمله.

﴿يَا أَيُّهَا الْإِنسَانُ إِنَّكَ كَادِحٌ إِلَىٰ رَبِّكَ كَدْحًا فَمُلَاقِيهِ﴾ — الإنسان سائر إلى الله لا محالة.
﴿فَأَمَّا مَنْ أُوتِيَ كِتَابَهُ بِيَمِينِهِ فَسَوْفَ يُحَاسَبُ حِسَابًا يَسِيرًا﴾ — الحساب اليسير نعمة.`,
  'البروج_full': `**سورة البروج**
22 آية مكية. قصة أصحاب الأخدود — الشهداء الذين أُحرقوا في الخنادق لإيمانهم.

﴿وَالسَّمَاءِ ذَاتِ الْبُرُوجِ﴾ — قسم بالسماء ذات المنازل الكونية.
﴿قُتِلَ أَصْحَابُ الْأُخْدُودِ﴾ — أول شهداء الإيمان في التاريخ.
﴿إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ لَهُمْ جَنَّاتٌ تَجْرِي مِن تَحْتِهَا الْأَنْهَارُ﴾ — جزاء الصابرين.`,
  'البروج_tafsir': `**سورة البروج**
22 آية مكية. قصة أصحاب الأخدود — الشهداء الذين أُحرقوا في الخنادق لإيمانهم.

﴿وَالسَّمَاءِ ذَاتِ الْبُرُوجِ﴾ — قسم بالسماء ذات المنازل الكونية.
﴿قُتِلَ أَصْحَابُ الْأُخْدُودِ﴾ — أول شهداء الإيمان في التاريخ.
﴿إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ لَهُمْ جَنَّاتٌ تَجْرِي مِن تَحْتِهَا الْأَنْهَارُ﴾ — جزاء الصابرين.`,
  'الطارق_full': `**سورة الطارق**
17 آية مكية. تتناول حراسة الملائكة لكل إنسان وتذكير الإنسان بأصل خلقه.

﴿إِن كُلُّ نَفْسٍ لَّمَّا عَلَيْهَا حَافِظٌ﴾ — لكل نفس ملك حافظ يرصد أعمالها.
﴿فَلْيَنظُرِ الْإِنسَانُ مِمَّ خُلِقَ خُلِقَ مِن مَّاءٍ دَافِقٍ﴾ — التفكر في أصل الخلق يكسر الكبر.`,
  'الطارق_tafsir': `**سورة الطارق**
17 آية مكية. تتناول حراسة الملائكة لكل إنسان وتذكير الإنسان بأصل خلقه.

﴿إِن كُلُّ نَفْسٍ لَّمَّا عَلَيْهَا حَافِظٌ﴾ — لكل نفس ملك حافظ يرصد أعمالها.
﴿فَلْيَنظُرِ الْإِنسَانُ مِمَّ خُلِقَ خُلِقَ مِن مَّاءٍ دَافِقٍ﴾ — التفكر في أصل الخلق يكسر الكبر.`,
  'الأعلى_full': `**سورة الأعلى**
19 آية مكية. أول سورة تأمر بالتسبيح. كان النبي ﷺ يقرأها في صلاة الجمعة والعيد.

﴿سَبِّحِ اسْمَ رَبِّكَ الْأَعْلَى﴾ — الأمر بالتسبيح ابتداءً. ويقول المصلي «سبحان ربي الأعلى» في السجود.
﴿قَدْ أَفْلَحَ مَن تَزَكَّىٰ وَذَكَرَ اسْمَ رَبِّهِ فَصَلَّىٰ﴾ — الفلاح بالتزكية والذكر والصلاة.`,
  'الأعلى_tafsir': `**سورة الأعلى**
19 آية مكية. أول سورة تأمر بالتسبيح. كان النبي ﷺ يقرأها في صلاة الجمعة والعيد.

﴿سَبِّحِ اسْمَ رَبِّكَ الْأَعْلَى﴾ — الأمر بالتسبيح ابتداءً. ويقول المصلي «سبحان ربي الأعلى» في السجود.
﴿قَدْ أَفْلَحَ مَن تَزَكَّىٰ وَذَكَرَ اسْمَ رَبِّهِ فَصَلَّىٰ﴾ — الفلاح بالتزكية والذكر والصلاة.`,
  'الغاشية_full': `**سورة الغاشية**
26 آية مكية. الغاشية: القيامة التي تغشى الناس. تصف وجوه الخاسرين والفائزين وآيات الكون.

﴿هَلْ أَتَاكَ حَدِيثُ الْغَاشِيَةِ﴾ — أسلوب الإثارة والتشويق لمعرفة القيامة.
﴿أَفَلَا يَنظُرُونَ إِلَى الْإِبِلِ كَيْفَ خُلِقَتْ﴾ — دعوة للتفكر في الإبل والسماء والجبال والأرض.`,
  'الغاشية_tafsir': `**سورة الغاشية**
26 آية مكية. الغاشية: القيامة التي تغشى الناس. تصف وجوه الخاسرين والفائزين وآيات الكون.

﴿هَلْ أَتَاكَ حَدِيثُ الْغَاشِيَةِ﴾ — أسلوب الإثارة والتشويق لمعرفة القيامة.
﴿أَفَلَا يَنظُرُونَ إِلَى الْإِبِلِ كَيْفَ خُلِقَتْ﴾ — دعوة للتفكر في الإبل والسماء والجبال والأرض.`,
  'الفجر_full': `**سورة الفجر**
30 آية مكية. تتناول قصص عاد وثمود وفرعون والدرس منها ثم تصف يوم القيامة.

﴿وَالْفَجْرِ وَلَيَالٍ عَشْرٍ﴾ — قسم بالفجر وعشر ذي الحجة أفضل أيام العام.
﴿يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ ارْجِعِي إِلَىٰ رَبِّكِ رَاضِيَةً مَّرْضِيَّةً﴾ — أعظم بشارة للنفس المؤمنة.`,
  'الفجر_tafsir': `**سورة الفجر**
30 آية مكية. تتناول قصص عاد وثمود وفرعون والدرس منها ثم تصف يوم القيامة.

﴿وَالْفَجْرِ وَلَيَالٍ عَشْرٍ﴾ — قسم بالفجر وعشر ذي الحجة أفضل أيام العام.
﴿يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ ارْجِعِي إِلَىٰ رَبِّكِ رَاضِيَةً مَّرْضِيَّةً﴾ — أعظم بشارة للنفس المؤمنة.`,
  'البلد_full': `**سورة البلد**
20 آية مكية. تتناول قسماً بمكة وخلق الإنسان في كبد ثم العقبة التي يجب أن يتجاوزها.

﴿لَقَدْ خَلَقْنَا الْإِنسَانَ فِي كَبَدٍ﴾ — الإنسان خُلق ليكابد ويجاهد.
﴿فَلَا اقْتَحَمَ الْعَقَبَةَ﴾ — العقبة: فك الرقبة وإطعام اليتيم والمسكين.`,
  'البلد_tafsir': `**سورة البلد**
20 آية مكية. تتناول قسماً بمكة وخلق الإنسان في كبد ثم العقبة التي يجب أن يتجاوزها.

﴿لَقَدْ خَلَقْنَا الْإِنسَانَ فِي كَبَدٍ﴾ — الإنسان خُلق ليكابد ويجاهد.
﴿فَلَا اقْتَحَمَ الْعَقَبَةَ﴾ — العقبة: فك الرقبة وإطعام اليتيم والمسكين.`,
  'الشمس_full': `**سورة الشمس**
15 آية مكية. أقسام إلهية متتالية تنتهي بالمقسم عليه: فلاح من زكّى نفسه وخسارة من دسّاها.

﴿وَنَفْسٍ وَمَا سَوَّاهَا فَأَلْهَمَهَا فُجُورَهَا وَتَقْوَاهَا﴾ — الإنسان مُلهَم الخير والشر.
﴿قَدْ أَفْلَحَ مَن زَكَّاهَا وَقَدْ خَابَ مَن دَسَّاهَا﴾ — الفلاح بتزكية النفس.`,
  'الشمس_tafsir': `**سورة الشمس**
15 آية مكية. أقسام إلهية متتالية تنتهي بالمقسم عليه: فلاح من زكّى نفسه وخسارة من دسّاها.

﴿وَنَفْسٍ وَمَا سَوَّاهَا فَأَلْهَمَهَا فُجُورَهَا وَتَقْوَاهَا﴾ — الإنسان مُلهَم الخير والشر.
﴿قَدْ أَفْلَحَ مَن زَكَّاهَا وَقَدْ خَابَ مَن دَسَّاهَا﴾ — الفلاح بتزكية النفس.`,
  'الليل_full': `**سورة الليل**
21 آية مكية. تقسم البشر قسمين: المعطي المتقي والبخيل المستغني، وتُبيّن جزاء كل منهما.

﴿فَأَمَّا مَنْ أَعْطَىٰ وَاتَّقَىٰ وَصَدَّقَ بِالْحُسْنَىٰ فَسَنُيَسِّرُهُ لِلْيُسْرَىٰ﴾ — طريق اليسر: العطاء والتقوى.
﴿وَمَا يُغْنِي عَنْهُ مَالُهُ إِذَا تَرَدَّىٰ﴾ — المال لا ينفع يوم الهلاك.`,
  'الليل_tafsir': `**سورة الليل**
21 آية مكية. تقسم البشر قسمين: المعطي المتقي والبخيل المستغني، وتُبيّن جزاء كل منهما.

﴿فَأَمَّا مَنْ أَعْطَىٰ وَاتَّقَىٰ وَصَدَّقَ بِالْحُسْنَىٰ فَسَنُيَسِّرُهُ لِلْيُسْرَىٰ﴾ — طريق اليسر: العطاء والتقوى.
﴿وَمَا يُغْنِي عَنْهُ مَالُهُ إِذَا تَرَدَّىٰ﴾ — المال لا ينفع يوم الهلاك.`,
  'الضحى_full': `**سورة الضحى**
11 آية مكية. نزلت تسلية للنبي ﷺ حين انقطع الوحي فاغتمّ.

﴿وَالضُّحَىٰ وَاللَّيْلِ إِذَا سَجَىٰ مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ﴾ — الله لم يودع نبيه ولم يُبغضه.
﴿أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ﴾ — امتنان الله على النبي بالإيواء والهداية والإغناء.
﴿وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ﴾ — الحديث عن نعم الله شكر لها.`,
  'الضحى_tafsir': `**سورة الضحى**
11 آية مكية. نزلت تسلية للنبي ﷺ حين انقطع الوحي فاغتمّ.

﴿وَالضُّحَىٰ وَاللَّيْلِ إِذَا سَجَىٰ مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ﴾ — الله لم يودع نبيه ولم يُبغضه.
﴿أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ﴾ — امتنان الله على النبي بالإيواء والهداية والإغناء.
﴿وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ﴾ — الحديث عن نعم الله شكر لها.`,
  'الشرح_full': `**سورة الشرح (ألم نشرح)**
8 آيات مكية. امتنان الله على النبي ﷺ بشرح الصدر ووضع الوزر ورفع الذكر.

﴿أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ وَوَضَعْنَا عَنكَ وِزْرَكَ﴾ — شرح الصدر للإسلام والوحي أعظم نعمة.
﴿فَإِنَّ مَعَ الْعُسْرِ يُسْرًا إِنَّ مَعَ الْعُسْرِ يُسْرًا﴾ — يُسران مقابل عسر واحد — بشرى عظيمة.`,
  'الشرح_tafsir': `**سورة الشرح (ألم نشرح)**
8 آيات مكية. امتنان الله على النبي ﷺ بشرح الصدر ووضع الوزر ورفع الذكر.

﴿أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ وَوَضَعْنَا عَنكَ وِزْرَكَ﴾ — شرح الصدر للإسلام والوحي أعظم نعمة.
﴿فَإِنَّ مَعَ الْعُسْرِ يُسْرًا إِنَّ مَعَ الْعُسْرِ يُسْرًا﴾ — يُسران مقابل عسر واحد — بشرى عظيمة.`,
  'التين_full': `**سورة التين**
8 آيات مكية. قسم بالتين والزيتون وطور سيناء ومكة يؤكد كرامة الإنسان ثم هبوطه.

﴿لَقَدْ خَلَقْنَا الْإِنسَانَ فِي أَحْسَنِ تَقْوِيمٍ ثُمَّ رَدَدْنَاهُ أَسْفَلَ سَافِلِينَ﴾ — الإنسان في أحسن صورة فإن لم يؤمن سقط.
﴿إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ﴾ — المؤمنون مستثنون من السقوط.`,
  'التين_tafsir': `**سورة التين**
8 آيات مكية. قسم بالتين والزيتون وطور سيناء ومكة يؤكد كرامة الإنسان ثم هبوطه.

﴿لَقَدْ خَلَقْنَا الْإِنسَانَ فِي أَحْسَنِ تَقْوِيمٍ ثُمَّ رَدَدْنَاهُ أَسْفَلَ سَافِلِينَ﴾ — الإنسان في أحسن صورة فإن لم يؤمن سقط.
﴿إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ﴾ — المؤمنون مستثنون من السقوط.`,
  'العلق_full': `**سورة العلق (اقرأ)**
19 آية مكية. أول ما نزل من القرآن: أول خمس آيات. تأمر بالقراءة وتمدح القلم والعلم.

﴿اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ﴾ — أول كلمة نزلت من القرآن: اقرأ.
﴿عَلَّمَ الْإِنسَانَ مَا لَمْ يَعْلَمْ﴾ — الله المعلم الأول والعلم منه.
﴿كَلَّا إِنَّ الْإِنسَانَ لَيَطْغَىٰ أَن رَّآهُ اسْتَغْنَىٰ﴾ — الغنى سبب الطغيان.`,
  'العلق_tafsir': `**سورة العلق (اقرأ)**
19 آية مكية. أول ما نزل من القرآن: أول خمس آيات. تأمر بالقراءة وتمدح القلم والعلم.

﴿اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ﴾ — أول كلمة نزلت من القرآن: اقرأ.
﴿عَلَّمَ الْإِنسَانَ مَا لَمْ يَعْلَمْ﴾ — الله المعلم الأول والعلم منه.
﴿كَلَّا إِنَّ الْإِنسَانَ لَيَطْغَىٰ أَن رَّآهُ اسْتَغْنَىٰ﴾ — الغنى سبب الطغيان.`,
  'القدر_full': `**سورة القدر**
5 آيات مكية. تعظيم ليلة القدر التي أُنزل فيها القرآن.

﴿إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ﴾ — نزول القرآن جملةً إلى السماء الدنيا في ليلة القدر.
﴿لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ﴾ — العبادة فيها تعدل 83 سنة.
﴿تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ﴾ — الملائكة تنزل بالخير والبركة.`,
  'القدر_tafsir': `**سورة القدر**
5 آيات مكية. تعظيم ليلة القدر التي أُنزل فيها القرآن.

﴿إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ﴾ — نزول القرآن جملةً إلى السماء الدنيا في ليلة القدر.
﴿لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ﴾ — العبادة فيها تعدل 83 سنة.
﴿تَنَزَّلُ الْمَلَائِكَةُ وَالرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍ﴾ — الملائكة تنزل بالخير والبركة.`,
  'البينة_full': `**سورة البينة**
8 آيات مدنية. تتناول موقف أهل الكتاب والمشركين من البينة (القرآن والنبي ﷺ).

﴿وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ﴾ — الإخلاص جوهر العبادة في كل الشرائع.
﴿إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ أُولَٰئِكَ هُمْ خَيْرُ الْبَرِيَّةِ﴾ — المؤمنون خير الخلق.`,
  'البينة_tafsir': `**سورة البينة**
8 آيات مدنية. تتناول موقف أهل الكتاب والمشركين من البينة (القرآن والنبي ﷺ).

﴿وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ﴾ — الإخلاص جوهر العبادة في كل الشرائع.
﴿إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ أُولَٰئِكَ هُمْ خَيْرُ الْبَرِيَّةِ﴾ — المؤمنون خير الخلق.`,
  'الزلزلة_full': `**سورة الزلزلة**
8 آيات. تصف زلزلة الأرض يوم القيامة وإخراجها أثقالها وشهادتها على من عمل فيها.

﴿إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا﴾ — الزلزلة الكبرى يوم القيامة.
﴿فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ وَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ﴾ — لا يضيع مثقال ذرة.`,
  'الزلزلة_tafsir': `**سورة الزلزلة**
8 آيات. تصف زلزلة الأرض يوم القيامة وإخراجها أثقالها وشهادتها على من عمل فيها.

﴿إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا﴾ — الزلزلة الكبرى يوم القيامة.
﴿فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ وَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُ﴾ — لا يضيع مثقال ذرة.`,
  'العاديات_full': `**سورة العاديات**
11 آية مكية. قسم بالخيل الجارية في سبيل الله. تذم كنوز الإنسان وشحه.

﴿وَالْعَادِيَاتِ ضَبْحًا﴾ — قسم بالخيل تعدو في المعركة.
﴿إِنَّ الْإِنسَانَ لِرَبِّهِ لَكَنُودٌ﴾ — الإنسان جحود لنعم الله.`,
  'العاديات_tafsir': `**سورة العاديات**
11 آية مكية. قسم بالخيل الجارية في سبيل الله. تذم كنوز الإنسان وشحه.

﴿وَالْعَادِيَاتِ ضَبْحًا﴾ — قسم بالخيل تعدو في المعركة.
﴿إِنَّ الْإِنسَانَ لِرَبِّهِ لَكَنُودٌ﴾ — الإنسان جحود لنعم الله.`,
  'القارعة_full': `**سورة القارعة**
11 آية مكية. القارعة: يوم القيامة يقرع القلوب بهوله. تصف حال الناس يومها وميزان الأعمال.

﴿الْقَارِعَةُ مَا الْقَارِعَةُ وَمَا أَدْرَاكَ مَا الْقَارِعَةُ﴾ — تعظيم بالتكرار.
﴿فَمَنْ ثَقُلَتْ مَوَازِينُهُ فَهُوَ فِي عِيشَةٍ رَّاضِيَةٍ﴾ — الميزان فيصل العدل.`,
  'القارعة_tafsir': `**سورة القارعة**
11 آية مكية. القارعة: يوم القيامة يقرع القلوب بهوله. تصف حال الناس يومها وميزان الأعمال.

﴿الْقَارِعَةُ مَا الْقَارِعَةُ وَمَا أَدْرَاكَ مَا الْقَارِعَةُ﴾ — تعظيم بالتكرار.
﴿فَمَنْ ثَقُلَتْ مَوَازِينُهُ فَهُوَ فِي عِيشَةٍ رَّاضِيَةٍ﴾ — الميزان فيصل العدل.`,
  'التكاثر_full': `**سورة التكاثر**
8 آيات مكية. تُحذر من الانشغال بالتكاثر في المال والأولاد عن الآخرة.

﴿أَلْهَاكُمُ التَّكَاثُرُ حَتَّىٰ زُرْتُمُ الْمَقَابِرَ﴾ — الإنسان مشغول بالتكاثر حتى يموت.
﴿ثُمَّ لَتُسْأَلُنَّ يَوْمَئِذٍ عَنِ النَّعِيمِ﴾ — كل نعمة سيُسأل عنها العبد.`,
  'التكاثر_tafsir': `**سورة التكاثر**
8 آيات مكية. تُحذر من الانشغال بالتكاثر في المال والأولاد عن الآخرة.

﴿أَلْهَاكُمُ التَّكَاثُرُ حَتَّىٰ زُرْتُمُ الْمَقَابِرَ﴾ — الإنسان مشغول بالتكاثر حتى يموت.
﴿ثُمَّ لَتُسْأَلُنَّ يَوْمَئِذٍ عَنِ النَّعِيمِ﴾ — كل نعمة سيُسأل عنها العبد.`,
  'العصر_full': `**سورة العصر**
3 آيات مكية. قال الإمام الشافعي: لو تدبّر الناس هذه السورة لكفتهم.

﴿وَالْعَصْرِ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ﴾ — كل إنسان خاسر إلا من استوفى الشروط الأربعة.
﴿إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ﴾ — الإيمان والعمل والتواصي شروط النجاة.`,
  'العصر_tafsir': `**سورة العصر**
3 آيات مكية. قال الإمام الشافعي: لو تدبّر الناس هذه السورة لكفتهم.

﴿وَالْعَصْرِ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ﴾ — كل إنسان خاسر إلا من استوفى الشروط الأربعة.
﴿إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ﴾ — الإيمان والعمل والتواصي شروط النجاة.`,
  'الهمزة_full': `**سورة الهمزة**
9 آيات مكية. تُحذر من الهمز واللمز والاعتزاز بالمال وتصف نار الحطمة.

﴿وَيْلٌ لِّكُلِّ هُمَزَةٍ لُّمَزَةٍ الَّذِي جَمَعَ مَالًا وَعَدَّدَهُ﴾ — الويل لمن يغتاب ويعتز بماله.
﴿نَارُ اللَّهِ الْمُوقَدَةُ الَّتِي تَطَّلِعُ عَلَى الْأَفْئِدَةِ﴾ — النار تأكل القلوب قبل الأجساد.`,
  'الهمزة_tafsir': `**سورة الهمزة**
9 آيات مكية. تُحذر من الهمز واللمز والاعتزاز بالمال وتصف نار الحطمة.

﴿وَيْلٌ لِّكُلِّ هُمَزَةٍ لُّمَزَةٍ الَّذِي جَمَعَ مَالًا وَعَدَّدَهُ﴾ — الويل لمن يغتاب ويعتز بماله.
﴿نَارُ اللَّهِ الْمُوقَدَةُ الَّتِي تَطَّلِعُ عَلَى الْأَفْئِدَةِ﴾ — النار تأكل القلوب قبل الأجساد.`,
  'الفيل_full': `**سورة الفيل**
5 آيات مكية. قصة أبرهة الحبشي وجيش الفيل الذي جاء ليهدم الكعبة عام ميلاد النبي ﷺ (570م).

﴿أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ﴾ — ذكر النعمة الإلهية بحفظ الكعبة.
﴿وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ﴾ — الطيور الأبابيل بحجارة من جهنم.`,
  'الفيل_tafsir': `**سورة الفيل**
5 آيات مكية. قصة أبرهة الحبشي وجيش الفيل الذي جاء ليهدم الكعبة عام ميلاد النبي ﷺ (570م).

﴿أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ﴾ — ذكر النعمة الإلهية بحفظ الكعبة.
﴿وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ﴾ — الطيور الأبابيل بحجارة من جهنم.`,
  'قريش_full': `**سورة قريش**
4 آيات مكية. تذكّر قريشاً بنعمة الرحلتين وتأمرهم بعبادة رب البيت الذي أطعمهم وآمنهم.

﴿لِإِيلَافِ قُرَيْشٍ إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ﴾ — نعمة رحلة الشتاء لليمن والصيف للشام.
﴿فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ﴾ — الجزاء: عبادة المنعم.`,
  'قريش_tafsir': `**سورة قريش**
4 آيات مكية. تذكّر قريشاً بنعمة الرحلتين وتأمرهم بعبادة رب البيت الذي أطعمهم وآمنهم.

﴿لِإِيلَافِ قُرَيْشٍ إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ﴾ — نعمة رحلة الشتاء لليمن والصيف للشام.
﴿فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ﴾ — الجزاء: عبادة المنعم.`,
  'الماعون_full': `**سورة الماعون**
7 آيات مكية. تصف صفات المكذب بالدين: الذي يدع اليتيم ولا يحض على طعام المسكين.

﴿أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ﴾ — التكذيب بالدين يظهر في سوء المعاملة.
﴿فَوَيْلٌ لِّلْمُصَلِّينَ الَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ﴾ — الويل لمن يُصلي رياءً وسهواً.`,
  'الماعون_tafsir': `**سورة الماعون**
7 آيات مكية. تصف صفات المكذب بالدين: الذي يدع اليتيم ولا يحض على طعام المسكين.

﴿أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ﴾ — التكذيب بالدين يظهر في سوء المعاملة.
﴿فَوَيْلٌ لِّلْمُصَلِّينَ الَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ﴾ — الويل لمن يُصلي رياءً وسهواً.`,
  'الكوثر_full': `**سورة الكوثر — أقصر سور القرآن**
3 آيات مكية. نزلت رداً على العاص بن وائل الذي سمّى النبي ﷺ أبتر.

﴿إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ﴾ — الكوثر: نهر في الجنة وخيرات لا تُحصى.
﴿إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ﴾ — من أبغض النبي ﷺ هو المنقطع الذكر.`,
  'الكوثر_tafsir': `**سورة الكوثر — أقصر سور القرآن**
3 آيات مكية. نزلت رداً على العاص بن وائل الذي سمّى النبي ﷺ أبتر.

﴿إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ﴾ — الكوثر: نهر في الجنة وخيرات لا تُحصى.
﴿إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ﴾ — من أبغض النبي ﷺ هو المنقطع الذكر.`,
  'الكافرون_full': `**سورة الكافرون**
6 آيات مكية. براءة تامة من الشرك وفصل حاسم بين الإيمان والكفر. تعدل ربع القرآن.

﴿قُلْ يَا أَيُّهَا الْكَافِرُونَ لَا أَعْبُدُ مَا تَعْبُدُونَ﴾ — رفض العبادة المشتركة رفضاً قاطعاً.
﴿لَكُمْ دِينُكُمْ وَلِيَ دِينِ﴾ — الفصل التام بين الدينين دون إكراه.`,
  'الكافرون_tafsir': `**سورة الكافرون**
6 آيات مكية. براءة تامة من الشرك وفصل حاسم بين الإيمان والكفر. تعدل ربع القرآن.

﴿قُلْ يَا أَيُّهَا الْكَافِرُونَ لَا أَعْبُدُ مَا تَعْبُدُونَ﴾ — رفض العبادة المشتركة رفضاً قاطعاً.
﴿لَكُمْ دِينُكُمْ وَلِيَ دِينِ﴾ — الفصل التام بين الدينين دون إكراه.`,
  'النصر_full': `**سورة النصر**
3 آيات مدنية. آخر سورة نزلت كاملة. فيها إيذان بقرب وفاة النبي ﷺ.

﴿إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ﴾ — الفتح: فتح مكة 8هـ.
﴿فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا﴾ — الاستغفار بعد النصر لا بعد الذنب فقط.`,
  'النصر_tafsir': `**سورة النصر**
3 آيات مدنية. آخر سورة نزلت كاملة. فيها إيذان بقرب وفاة النبي ﷺ.

﴿إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ﴾ — الفتح: فتح مكة 8هـ.
﴿فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا﴾ — الاستغفار بعد النصر لا بعد الذنب فقط.`,
  'المسد_full': `**سورة المسد (تبت)**
5 آيات مكية. أشد آيات القرآن تهديداً لشخص بعينه: أبو لهب عمّ النبي ﷺ وزوجته أم جميل.

﴿تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ﴾ — لعن أبي لهب ووعيده بالجحيم.
﴿وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ﴾ — أم جميل كانت تضع الشوك في طريق النبي ﷺ.`,
  'المسد_tafsir': `**سورة المسد (تبت)**
5 آيات مكية. أشد آيات القرآن تهديداً لشخص بعينه: أبو لهب عمّ النبي ﷺ وزوجته أم جميل.

﴿تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ﴾ — لعن أبي لهب ووعيده بالجحيم.
﴿وَامْرَأَتُهُ حَمَّالَةَ الْحَطَبِ﴾ — أم جميل كانت تضع الشوك في طريق النبي ﷺ.`,
  'الإخلاص_full': `**سورة الإخلاص — تعدل ثلث القرآن**
4 آيات مكية. سورة التوحيد الخالص. قال ﷺ: «من قرأها عشر مرات بنى الله له بيتاً في الجنة».

﴿قُلْ هُوَ اللَّهُ أَحَدٌ﴾ — الأحد: لا ثاني له ولا نظير. فرد في ذاته وصفاته.
﴿اللَّهُ الصَّمَدُ﴾ — الصمد: الذي يُقصد في الحوائج. كل شيء يحتاجه وهو غني عن كل شيء.
﴿لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ﴾ — نفي الولد والوالد والمثيل.`,
  'الإخلاص_tafsir': `**سورة الإخلاص — تعدل ثلث القرآن**
4 آيات مكية. سورة التوحيد الخالص. قال ﷺ: «من قرأها عشر مرات بنى الله له بيتاً في الجنة».

﴿قُلْ هُوَ اللَّهُ أَحَدٌ﴾ — الأحد: لا ثاني له ولا نظير. فرد في ذاته وصفاته.
﴿اللَّهُ الصَّمَدُ﴾ — الصمد: الذي يُقصد في الحوائج. كل شيء يحتاجه وهو غني عن كل شيء.
﴿لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ﴾ — نفي الولد والوالد والمثيل.`,
  'الفلق_full': `**سورة الفلق**
5 آيات مدنية. المعوذة الأولى. قال ﷺ: «تعوّذ بهما فما تعوّذ متعوّذ بمثلهما».

﴿قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ﴾ — رب الفلق: رب الصبح الذي يفلق الظلام.
﴿مِن شَرِّ مَا خَلَقَ﴾ — الاستعاذة من شر كل المخلوقات.
﴿وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ﴾ — السحر والحسد شرّ حقيقي يُستعاذ منه.`,
  'الفلق_tafsir': `**سورة الفلق**
5 آيات مدنية. المعوذة الأولى. قال ﷺ: «تعوّذ بهما فما تعوّذ متعوّذ بمثلهما».

﴿قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ﴾ — رب الفلق: رب الصبح الذي يفلق الظلام.
﴿مِن شَرِّ مَا خَلَقَ﴾ — الاستعاذة من شر كل المخلوقات.
﴿وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ﴾ — السحر والحسد شرّ حقيقي يُستعاذ منه.`,
  'الناس_full': `**سورة الناس**
6 آيات مدنية. المعوذة الثانية. الاستعاذة من شر الوسواس الخناس.

﴿قُلْ أَعُوذُ بِرَبِّ النَّاسِ مَلِكِ النَّاسِ إِلَٰهِ النَّاسِ﴾ — ثلاثة أسماء: الرب والملك والإله.
﴿مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ﴾ — الشيطان يوسوس فإذا ذُكر الله انخنس وتراجع.
﴿الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ مِنَ الْجِنَّةِ وَالنَّاسِ﴾ — الوسواس من الجن والإنس.`,
  'الناس_tafsir': `**سورة الناس**
6 آيات مدنية. المعوذة الثانية. الاستعاذة من شر الوسواس الخناس.

﴿قُلْ أَعُوذُ بِرَبِّ النَّاسِ مَلِكِ النَّاسِ إِلَٰهِ النَّاسِ﴾ — ثلاثة أسماء: الرب والملك والإله.
﴿مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ﴾ — الشيطان يوسوس فإذا ذُكر الله انخنس وتراجع.
﴿الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ مِنَ الْجِنَّةِ وَالنَّاسِ﴾ — الوسواس من الجن والإنس.`,
  'أسئلة_وأجوبة': `**200+ سؤال وجواب إسلامي**

**العقيدة والتوحيد**
س: ما معنى لا إله إلا الله؟ ج: لا معبود بحق إلا الله وحده لا شريك له.
س: ما أركان الإيمان الستة؟ ج: الإيمان بالله وملائكته وكتبه ورسله واليوم الآخر والقدر خيره وشره.
س: ما الفرق بين الإسلام والإيمان والإحسان؟ ج: الإسلام: الأعمال الظاهرة. الإيمان: التصديق القلبي. الإحسان: أن تعبد الله كأنك تراه.
س: ما هو الشرك الأكبر؟ ج: صرف عبادة لغير الله كالدعاء والذبح والنذر لغيره.
س: ما هو الشرك الأصغر؟ ج: الرياء — أن تعمل لغير الله مع إيمانك به.
س: من خلق الله؟ ج: الله أزلي لا بداية له ولا نهاية — ﴿هو الأول والآخر﴾.
س: هل يُرى الله في الآخرة؟ ج: نعم، يراه المؤمنون كما يُرى القمر ليلة البدر.
س: ما معنى القضاء والقدر؟ ج: علم الله الأزلي بكل شيء وكتابته في اللوح المحفوظ.
س: هل للعبد إرادة مع القدر؟ ج: نعم، العبد مُخيَّر في أفعاله الاختيارية ومُسيَّر في غيرها.
س: ما الدليل على وجود الله؟ ج: الكون كله دليل: ﴿أفي الله شك فاطر السماوات والأرض﴾.

**الصلاة**
س: ما شروط الصلاة؟ ج: الإسلام، العقل، البلوغ، الطهارة، دخول الوقت، ستر العورة، استقبال القبلة، النية.
س: ما أركان الصلاة؟ ج: النية، تكبيرة الإحرام، القيام، الفاتحة، الركوع، السجود، التشهد الأخير، التسليم، الترتيب.
س: ما الذي يُبطل الصلاة؟ ج: الحدث، النجاسة، الكلام العمد، الضحك، أكل أو شرب، ترك ركن عمداً.
س: هل تصح صلاة من نسي الفاتحة؟ ج: لا، الفاتحة ركن في كل ركعة لمن يُحسنها.
س: ما حكم الجمع والقصر في السفر؟ ج: القصر سنة مؤكدة، والجمع جائز عند الحاجة.
س: ما حد السفر الذي يُبيح القصر؟ ج: 80 كيلومتراً تقريباً (مسيرة يوم) عند الجمهور.
س: متى تجب صلاة الجمعة؟ ج: على كل مسلم حر ذكر بالغ عاقل مقيم غير مريض.
س: ما حكم تارك الصلاة؟ ج: من تركها جحوداً فكافر. ومن تركها تكاسلاً فمرتكب كبيرة عظيمة.
س: هل يجوز الصلاة بالملابس الملونة؟ ج: نعم، الشرط النظافة وستر العورة لا اللون.
س: كيف أصلي إذا كنت مريضاً لا أستطيع القيام؟ ج: قاعداً فإن لم تستطع فعلى جنب مُومياً.

**الصيام**
س: ما مُبطلات الصيام؟ ج: الأكل والشرب والجماع والاستقاءة العمد والحيض والنفاس والردة.
س: هل يُفطّر حقن الإبر؟ ج: الإبر المغذية تُفطّر، أما الإبر العلاجية فلا على الراجح.
س: ما حكم من أفطر عمداً في رمضان؟ ج: عليه القضاء والكفارة (عتق رقبة أو صيام شهرين متتابعين أو إطعام 60 مسكيناً).
س: هل تصح نية الصيام من النهار؟ ج: لصيام الفرض لا بد من النية قبل الفجر. أما النافلة فتصح من النهار.
س: ما حكم صيام الست من شوال؟ ج: سنة مستحبة، ومن صامها مع رمضان فكأنما صام الدهر.
س: هل يجوز الإفطار بسبب المرض؟ ج: نعم إن كان الصيام يضره أو يُأخر شفاءه.
س: ما فضل ليلة القدر؟ ج: خير من ألف شهر. العبادة فيها تعدل 83 سنة وأكثر.
س: متى تكون ليلة القدر؟ ج: في العشر الأواخر من رمضان، وأرجحها ليالي الوتر وأرجحها السابعة والعشرون.

**الزكاة**
س: ما نصاب زكاة الذهب؟ ج: 85 جراماً من الذهب أو ما يعادله في الفضة (595 جرام فضة).
س: ما مقدار الزكاة؟ ج: ربع العُشر أي 2.5٪ من المال الزكوي إذا حال عليه الحول.
س: هل تجب الزكاة في المال المدّخَر؟ ج: نعم إذا بلغ النصاب وحال عليه الحول القمري.
س: من هم أهل الزكاة؟ ج: ﴿إنما الصدقات للفقراء والمساكين والعاملين عليها والمؤلفة قلوبهم وفي الرقاب والغارمين وفي سبيل الله وابن السبيل﴾.
س: هل تجوز الزكاة لبناء المساجد؟ ج: لا تجوز لبناء المساجد على الراجح، بل لأصناف الزكاة الثمانية.
س: ما الفرق بين الزكاة والصدقة؟ ج: الزكاة فريضة بنصاب وحول ومصارف محددة. الصدقة تطوع.

**الحج والعمرة**
س: ما الفرق بين الحج والعمرة؟ ج: الحج موسمي بوقت محدد (ذو الحجة) وفيه وقوف عرفة. العمرة في أي وقت ولا وقوف فيها.
س: ما محظورات الإحرام؟ ج: لبس المخيط للرجال، تغطية الرأس، قطع الشعر، قص الأظافر، الطيب، الصيد، عقد النكاح، الجماع.
س: ما طواف الوداع؟ ج: آخر طواف يطوفه الحاج قبل مغادرة مكة، وهو واجب.
س: هل العمرة فريضة؟ ج: الجمهور على أنها فرض كالحج، والحنفية يقولون سنة.
س: ما الهدي في الحج؟ ج: ذبح شاة أو سبع بقرة أو سبع ناقة للحاج المتمتع والقارن.

**الطهارة والوضوء**
س: ما نواقض الوضوء؟ ج: الخارج من السبيلين، النوم العميق، زوال العقل، لمس الفرج على الراجح، أكل لحم الإبل.
س: هل ينقض الوضوء لمس المرأة؟ ج: لمس المرأة بشهوة ينقضه عند الشافعية، وبلا شهوة لا ينقضه عند الجمهور.
س: هل يجوز التيمم عند عدم الماء؟ ج: نعم، التيمم بدل الوضوء والغسل عند عدم الماء أو الضرر من استعماله.
س: ما الغسل الواجب؟ ج: يجب بالجماع، والإنزال، والحيض والنفاس عند انقطاعهما، والموت.
س: هل المسح على الجوارب جائز؟ ج: نعم بشروط: أن تكون لبستها على طهارة، وألا تتجاوز يوم وليلة للمقيم وثلاثة للمسافر.

**النكاح والأسرة**
س: ما أركان عقد الزواج؟ ج: الإيجاب والقبول والولي والشاهدان والمهر.
س: هل يصح الزواج بدون ولي؟ ج: لا يصح عند الجمهور. قال ﷺ: «لا نكاح إلا بولي».
س: ما حكم الطلاق؟ ج: مباح في الأصل، وقد يكون واجباً أو محرماً أو مكروهاً أو مستحباً حسب الحال.
س: كم طلقة يملك الزوج؟ ج: ثلاث طلقات. بعد الثالثة لا تحل له حتى تنكح زوجاً غيره.
س: ما حكم الخلع؟ ج: جائز للمرأة إذا كرهت زوجها وأعادت له المهر.
س: ما عدة المطلقة؟ ج: ثلاثة قروء للمدخول بها. وعدة المتوفى عنها زوجها أربعة أشهر وعشرة أيام.

**المواريث**
س: ما نصيب البنت من الميراث؟ ج: النصف إذا انفردت، والثلثان لاثنتين فأكثر مع عدم الابن.
س: ما نصيب الزوجة؟ ج: الثمن مع الولد، والربع بدونه.
س: من يحجب الإخوة عن الميراث؟ ج: الابن وابن الابن والأب.
س: ما الوصية الواجبة؟ ج: لا وصية لوارث، والوصية لغير الوارث جائزة بحد الثلث.

**الأخلاق والمعاملات**
س: ما حكم الغيبة؟ ج: حرام. هي ذكرك أخاك بما يكره.
س: ما الفرق بين الغيبة والنميمة؟ ج: الغيبة: قول الحق في الغائب. النميمة: نقل الكلام بين الناس لإيقاع الفتنة.
س: ما حكم الكذب؟ ج: حرام إلا في ثلاث: الإصلاح بين المتخاصمين، وحديث الرجل زوجته، والحرب.
س: ما حكم الربا؟ ج: محرم تحريماً قاطعاً. ﴿وأحل الله البيع وحرم الربا﴾.
س: ما حكم الغش في البيع والشراء؟ ج: حرام. قال ﷺ: «من غشنا فليس منا».
س: ما حكم الرشوة؟ ج: حرام على الراشي والمرتشي معاً. لعن النبي ﷺ الراشي والمرتشي.
س: ما حكم حلق اللحية؟ ج: محرم عند الجمهور، مكروه عند بعضهم. والأمر بإعفائها ثابت في الصحيحين.
س: ما حكم التصوير؟ ج: تصوير ذوات الأرواح محل خلاف. والجمهور على تحريم ما فيه روح اليوم.
س: ما حكم الموسيقى؟ ج: محل خلاف. الجمهور على تحريم المعازف. والمباح ما خلا منها.
س: ما حكم المصافحة بين الرجال والنساء من غير المحارم؟ ج: محرمة عند الجمهور. قالت عائشة: ما مست يده ﷺ يد امرأة ليست له بمحرم.

**القرآن الكريم**
س: كم عدد سور القرآن؟ ج: 114 سورة.
س: كم عدد آيات القرآن؟ ج: 6236 آية على المشهور.
س: كم حزباً في القرآن؟ ج: 60 حزباً، أي 30 جزءاً.
س: ما أطول سورة في القرآن؟ ج: سورة البقرة 286 آية.
س: ما أقصر سورة في القرآن؟ ج: سورة الكوثر 3 آيات.
س: ما أعظم آية في القرآن؟ ج: آية الكرسي — قاله النبي ﷺ.
س: ما أول ما نزل من القرآن؟ ج: ﴿اقرأ باسم ربك الذي خلق﴾ أول خمس آيات من سورة العلق.
س: ما آخر ما نزل من القرآن؟ ج: ﴿واتقوا يوماً ترجعون فيه إلى الله﴾ أو ﴿اليوم أكملت لكم دينكم﴾.
س: ما معنى المكي والمدني؟ ج: المكي: ما نزل قبل الهجرة. المدني: ما نزل بعدها.
س: ما السور المدنية الطويلة؟ ج: البقرة، آل عمران، النساء، المائدة، التوبة، الأحزاب.

**السيرة النبوية**
س: متى وُلد النبي ﷺ؟ ج: 12 ربيع الأول، عام الفيل (571م تقريباً).
س: متى نزل أول الوحي؟ ج: في غار حراء، رمضان، السنة الأولى من البعثة (610م).
س: كم سنة دامت الدعوة في مكة؟ ج: 13 سنة.
س: متى كانت الهجرة إلى المدينة؟ ج: السنة الأولى للهجرة النبوية (622م).
س: كم غزوة غزاها النبي ﷺ؟ ج: 27 غزوة بنفسه.
س: متى كانت غزوة بدر؟ ج: 17 رمضان السنة الثانية للهجرة.
س: متى كان فتح مكة؟ ج: 20 رمضان السنة الثامنة للهجرة.
س: متى توفي النبي ﷺ؟ ج: 12 ربيع الأول سنة 11هـ عن 63 سنة.
س: من خلفاء النبي ﷺ بالترتيب؟ ج: أبو بكر ثم عمر ثم عثمان ثم علي رضي الله عنهم.
س: كم زوجة تزوج النبي ﷺ؟ ج: 13 زوجة. أولهن خديجة وآخرهن ميمونة.

**اليوم الآخر**
س: ما أشراط الساعة الصغرى؟ ج: رفع العلم، كثرة الجهل، الزنا، الخمر، قتل، كثرة النساء.
س: ما أشراط الساعة الكبرى؟ ج: الدجال، نزول عيسى، يأجوج ومأجوج، الدابة، طلوع الشمس من المغرب، النار.
س: ما عذاب القبر؟ ج: سؤال الملكين (من ربك؟ ما دينك؟ من نبيك؟) ثم النعيم أو العذاب.
س: ما الميزان يوم القيامة؟ ج: ميزان حقيقي توزن فيه الأعمال. الحسنات تُثقّله والسيئات تُخففه.
س: ما الصراط؟ ج: جسر ممدود على جهنم يعبره الناس على قدر أعمالهم.
س: كم باب للجنة؟ ج: ثمانية أبواب. باب الريان للصائمين خاصةً.
س: كم باب لجهنم؟ ج: سبعة أبواب.

**أحكام متفرقة**
س: هل يجوز أكل لحم الخنزير للضرورة؟ ج: نعم عند الاضطرار الحقيقي مع عدم البديل.
س: ما حكم الذبيحة المذكّاة بغير سم الله؟ ج: لا تحل إن تركت التسمية عمداً، وتحل إن نُسيت.
س: ما حكم ذبيحة أهل الكتاب؟ ج: حلال ما لم يُعلم أنهم ذكروا عليها غير اسم الله.
س: ما حكم التبني؟ ج: التبني المحرم هو إلحاق النسب. أما الكفالة والتبنّي العاطفي فمأجور.
س: ما حكم الاحتفال بالمولد النبوي؟ ج: محل خلاف بين العلماء: منهم من أجازه بشرط السلامة من المحرمات ومنهم من نهى عنه.
س: ما حكم التأمين؟ ج: محل خلاف. الجمهور على تحريم تأمين الربح. وبعضهم أجاز التأمين التعاوني.
س: هل يجوز قراءة القرآن للحائض؟ ج: الجمهور على الجواز بلا مس المصحف. وبعضهم أجاز المس عند الحاجة.
س: ما حكم الإجهاض؟ ج: محرم بعد نفخ الروح (120 يوم) قطعاً. وقبله محل خلاف وأكثرهم على التحريم.
`,
  'أحاديث_نبوية': `**الأحاديث النبوية الشريفة المصنفة**

**أحاديث العبادة**
• «إنما الأعمال بالنيات وإنما لكل امرئ ما نوى» — متفق عليه — أصل الإخلاص.
• «بُني الإسلام على خمس: شهادة أن لا إله إلا الله وأن محمداً رسول الله وإقام الصلاة وإيتاء الزكاة وحج البيت وصوم رمضان» — متفق عليه.
• «الصلوات الخمس والجمعة إلى الجمعة كفارة لما بينهن ما لم تُغشَ الكبائر» — رواه مسلم.
• «من صام رمضان إيماناً واحتساباً غُفر له ما تقدم من ذنبه» — متفق عليه.
• «من قام ليلة القدر إيماناً واحتساباً غُفر له ما تقدم من ذنبه» — متفق عليه.
• «الدعاء هو العبادة» — رواه أبو داود والترمذي — دليل فضل الدعاء.
• «أفضل الصلاة بعد المفروضة صلاة الليل» — رواه مسلم.
• «من حج فلم يرفث ولم يفسق رجع كيوم ولدته أمه» — متفق عليه.
• «أعطيت خمساً لم يُعطهن أحد قبلي... وأُحلت لي الغنائم ولم تحل لأحد قبلي» — متفق عليه.

**أحاديث الأخلاق**
• «إنما بُعثت لأتمم مكارم الأخلاق» — رواه أحمد — مقصد الرسالة.
• «المسلم من سلم المسلمون من لسانه ويده» — متفق عليه.
• «لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه» — متفق عليه.
• «من كان يؤمن بالله واليوم الآخر فليقل خيراً أو ليصمت» — متفق عليه.
• «اتق الله حيثما كنت وأتبع السيئة الحسنة تمحها وخالق الناس بخلق حسن» — رواه الترمذي.
• «ليس الشديد بالصُّرعة إنما الشديد الذي يملك نفسه عند الغضب» — متفق عليه.
• «لا تغضب» — قالها ثلاثاً — رواه البخاري — علاج الغضب.
• «المؤمن للمؤمن كالبنيان يشد بعضه بعضاً» — متفق عليه.
• «الراحمون يرحمهم الرحمن ارحموا من في الأرض يرحمكم من في السماء» — رواه أبو داود والترمذي.
• «من لا يرحم لا يُرحم» — متفق عليه.

**أحاديث الدنيا والزهد**
• «كن في الدنيا كأنك غريب أو عابر سبيل» — رواه البخاري.
• «ما الدنيا في الآخرة إلا كما يجعل أحدكم إصبعه هذه في اليم» — رواه مسلم.
• «ازهد في الدنيا يحبك الله وازهد فيما عند الناس يحبك الناس» — رواه ابن ماجه.
• «لو كانت الدنيا تعدل عند الله جناح بعوضة ما سقى كافراً منها شربة ماء» — رواه الترمذي.
• «الدنيا ملعونة ملعون ما فيها إلا ذكر الله وما والاه وعالم ومتعلم» — رواه الترمذي.

**أحاديث العلم**
• «طلب العلم فريضة على كل مسلم» — رواه ابن ماجه.
• «من سلك طريقاً يلتمس فيه علماً سهّل الله له طريقاً إلى الجنة» — رواه مسلم.
• «إذا مات الإنسان انقطع عمله إلا من ثلاث: صدقة جارية أو علم يُنتفع به أو ولد صالح يدعو له» — رواه مسلم.
• «العلماء ورثة الأنبياء» — رواه أبو داود والترمذي.
• «خيركم من تعلم القرآن وعلّمه» — رواه البخاري.

**أحاديث الأسرة**
• «خيركم خيركم لأهله وأنا خيركم لأهلي» — رواه الترمذي.
• «استوصوا بالنساء خيراً» — متفق عليه.
• «الجنة تحت أقدام الأمهات» — رواه ابن ماجه.
• «ما نحل والد ولده أفضل من أدب حسن» — رواه الترمذي.
• «حق الولد على الوالد أن يُحسن اسمه وأدبه» — رواه البيهقي.
• «أنت ومالك لأبيك» — رواه أبو داود — حق الوالد في المال.

**أحاديث الصحة والجسد**
• «نعمتان مغبون فيهما كثير من الناس: الصحة والفراغ» — رواه البخاري.
• «لا ضرر ولا ضرار» — رواه ابن ماجه — قاعدة فقهية أساسية.
• «المؤمن القوي خير وأحب إلى الله من المؤمن الضعيف» — رواه مسلم.
• «إن لبدنك عليك حقاً» — متفق عليه — حق الجسد على صاحبه.
• «التداووا عباد الله فإن الله لم يضع داءً إلا وضع له دواء» — رواه أبو داود.

**أحاديث المجتمع**
• «مثل المؤمنين في توادهم وتراحمهم وتعاطفهم كمثل الجسد الواحد» — رواه مسلم.
• «انصر أخاك ظالماً أو مظلوماً» — قال: كيف؟ قال: «تحجزه عن الظلم فذلك نصره» — متفق عليه.
• «من رأى منكم منكراً فليغيره بيده فإن لم يستطع فبلسانه فإن لم يستطع فبقلبه» — رواه مسلم.
• «إياكم والحسد فإن الحسد يأكل الحسنات كما تأكل النار الحطب» — رواه أبو داود.
• «لا تباغضوا ولا تحاسدوا ولا تدابروا وكونوا عباد الله إخواناً» — متفق عليه.

**أحاديث التوبة والاستغفار**
• «كل ابن آدم خطّاء وخير الخطّائين التوابون» — رواه الترمذي وابن ماجه.
• «التائب من الذنب كمن لا ذنب له» — رواه ابن ماجه.
• «إن الله يقبل توبة العبد ما لم يُغرغر» — رواه الترمذي.
• «لو أخطأتم حتى تبلغ خطاياكم السماء ثم استغفرتم الله غفر لكم» — رواه ابن ماجه.
• «سيد الاستغفار: اللهم أنت ربي لا إله إلا أنت خلقتني وأنا عبدك...» — رواه البخاري.

**أحاديث الجنة والنار**
• «حُفّت الجنة بالمكاره وحُفّت النار بالشهوات» — رواه مسلم.
• «أول زمرة يدخلون الجنة على صورة القمر ليلة البدر» — متفق عليه.
• «في الجنة ما لا عين رأت ولا أذن سمعت ولا خطر على قلب بشر» — متفق عليه.
• «أدنى أهل الجنة منزلة من له عشرة أضعاف الدنيا» — رواه مسلم.
• «يُجاء بالموت كهيئة كبش أملح فيُذبح بين الجنة والنار» — متفق عليه.
`,
  'قصة_آدم': `**قصة سيدنا آدم عليه السلام — أبو البشرية**

**الخلق والكرامة**
خلق الله آدم عليه السلام بيديه من طين، ونفخ فيه من روحه. وأسجد له الملائكة تكريماً، وعلّمه أسماء كل شيء. كان في جنة النعيم مع زوجته حواء التي خلقها الله منه.

**الابتلاء والسقوط**
نهاهما الله عن الاقتراب من شجرة واحدة. فجاء إبليس الذي أبى السجود لآدم حسداً، فوسوس لهما حتى أكلا من الشجرة. فأُنزلا إلى الأرض.

قال الله: ﴿قَالَ اهْبِطَا مِنْهَا جَمِيعًا بَعْضُكُمْ لِبَعْضٍ عَدُوٌّ﴾.

**التوبة والغفران**
فور إدراك آدم وحواء خطيئتهما تابا وقالا: ﴿رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ﴾.
فتلقّى الله توبتهما وغفر لهما. آدم أول تائب في البشرية.

**الدرس والعبرة**
الإنسان مُعرَّض للخطأ، لكن التوبة الصادقة تمحو الذنوب. عدو الإنسان الأبدي هو الشيطان الذي يُزيّن المعاصي. والجنة هي الوطن الأصلي الذي يسعى المؤمنون للعودة إليه.
`,
  'قصة_نوح': `**قصة سيدنا نوح عليه السلام — شيخ المرسلين**

**الدعوة والصبر**
دعا نوح قومه ألف سنة إلا خمسين عاماً. دعاهم ليلاً ونهاراً، سراً وجهاراً. لكنهم قالوا: ﴿لَا تَذَرُنَّ آلِهَتَكُمْ وَلَا تَذَرُنَّ وَدًّا وَلَا سُوَاعًا﴾ — كانوا يسدون آذانهم ويجعلون أصابعهم فيها كي لا يسمعوا.

آمن معه قليل من قومه فقط. وكان ابنه الكافر من أكثر المحزنين له.

**بناء السفينة والطوفان**
أمر الله نوحاً ببناء السفينة. فكان يبنيها ويسخر منه الكفار. ثم جاء الأمر الإلهي: ﴿احْمِلْ فِيهَا مِن كُلٍّ زَوْجَيْنِ اثْنَيْنِ وَأَهْلَكَ إِلَّا مَن سَبَقَ عَلَيْهِ الْقَوْلُ وَمَنْ آمَنَ﴾.

فار التنور وجاء الطوفان وغرق كل من على الأرض، حتى ابن نوح الذي قال: ﴿سَآوِي إِلَىٰ جَبَلٍ يَعْصِمُنِي مِنَ الْمَاءِ﴾، فأجابه أبوه: ﴿لَا عَاصِمَ الْيَوْمَ مِنْ أَمْرِ اللَّهِ إِلَّا مَن رَّحِمَ﴾.

**النجاة والاستقرار**
أُمرت السفينة بالاستقرار على الجودي. وقال الله: ﴿يَا نُوحُ اهْبِطْ بِسَلَامٍ مِّنَّا وَبَرَكَاتٍ عَلَيْكَ وَعَلَىٰ أُمَمٍ مِّمَّن مَّعَكَ﴾. البشرية كلها من ذرية من كان في السفينة.

**الدرس**
الصبر على الدعوة مهما طال الزمن. والنسب لا يُغني عن الإيمان. وعذاب الله لا يصمد أمامه جبل.
`,
  'قصة_إبراهيم': `**قصة سيدنا إبراهيم عليه السلام — خليل الله**

**الطفولة والتوحيد**
وُلد في بيئة تعبد الأصنام وكان أبوه آزر نجاراً يصنعها. فكّر إبراهيم وتأمل في الكون، ثم أعلن توحيده ورفض عبادة الأصنام قائلاً: ﴿إِنِّي وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمَاوَاتِ وَالْأَرْضَ حَنِيفًا وَمَا أَنَا مِنَ الْمُشْرِكِينَ﴾.

**تحطيم الأصنام والنار**
حطّم إبراهيم الأصنام وترك الكبير منها. فأرادوا حرقه. ﴿قَالُوا حَرِّقُوهُ وَانصُرُوا آلِهَتَكُمْ﴾. فألقوه في النار فقال جبريل: ألك حاجة؟ قال: أما إليك فلا. فأمر الله: ﴿يَا نَارُ كُونِي بَرْدًا وَسَلَامًا عَلَىٰ إِبْرَاهِيمَ﴾. فخرج منها سالماً.

**الهجرة وبناء الكعبة**
هاجر إبراهيم وزوجه هاجر وابنه إسماعيل. تركهما في واد غير ذي زرع مكة. فجرى ماء زمزم وسكنت القبائل حولهم. ثم أُمر إبراهيم ببناء الكعبة مع إسماعيل. وهو يبنيها يدعو: ﴿رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ﴾.

**ذبح إسماعيل — الاختبار الأعظم**
رأى إبراهيم في المنام أنه يذبح ابنه إسماعيل. فعرض الأمر على ابنه فقال: ﴿يَا أَبَتِ افْعَلْ مَا تُؤْمَرُ سَتَجِدُنِي إِن شَاءَ اللَّهُ مِنَ الصَّابِرِينَ﴾. فلما أسلما وتله للجبين: ﴿وَنَادَيْنَاهُ أَن يَا إِبْرَاهِيمُ قَدْ صَدَّقْتَ الرُّؤْيَا وَفَدَيْنَاهُ بِذِبْحٍ عَظِيمٍ﴾.

**الدرس**
التوحيد أعظم من الأب والوطن والنار والولد. والثقة بالله تُحوّل المستحيل ممكناً. من سلّم لله أمره وجد الفرج من حيث لا يحتسب.
`,
  'قصة_يوسف': `**قصة سيدنا يوسف عليه السلام — أحسن القصص**

**الرؤيا وكيد الإخوة**
رأى يوسف في المنام أحد عشر كوكباً والشمس والقمر يسجدون له. فقال أبوه يعقوب: لا تقصصها على إخوتك. لكن الإخوة حسدوه على حب أبيه له وألقوه في غيابة الجب. وأخبروا أباهم أن ذئباً أكله وجاؤوا بقميصه بدم كذب.

**العبودية والفتنة**
التقطه تجار ونُقل إلى مصر وبيع عبداً في بيت عزيزها. فلما شبّ وكمل راودته امرأة العزيز عن نفسه. فأبى وقال: ﴿مَعَاذَ اللَّهِ إِنَّهُ رَبِّي أَحْسَنَ مَثْوَايَ﴾. فسُجن ظلماً.

**السجن والتفسير**
في السجن فسّر رؤى رفيقيه. وطلب من الناجي منهما أن يذكره عند الملك، لكنه نسي سنين. ثم رأى الملك رؤيا السبع السمان والعجاف والسنابل فعبّرها يوسف وأُطلق سراحه وعيّنه الملك على خزائن الأرض.

**لقاء الإخوة والعفو**
جاء إخوته يطلبون الطعام في المجاعة ولم يعرفوه. وبعد مواقف كثيرة كشف عن نفسه فقال: ﴿أَنَا يُوسُفُ وَهَٰذَا أَخِي قَدْ مَنَّ اللَّهُ عَلَيْنَا﴾. فقالوا تائبين: ﴿لَقَدْ آثَرَكَ اللَّهُ عَلَيْنَا﴾. فعفا عنهم قائلاً: ﴿لَا تَثْرِيبَ عَلَيْكُمُ الْيَوْمَ يَغْفِرُ اللَّهُ لَكُمْ﴾.

**الدرس**
الصبر على الظلم مع التقوى يُفضي إلى التمكين. والعفو عند المقدرة من أسمى الأخلاق. ومن اتقى الله وصبر لم يُضع الله أجره.
`,
  'قصة_موسى': `**قصة سيدنا موسى عليه السلام — كليم الله**

**الميلاد والنشأة**
وُلد موسى في زمن فرعون الذي كان يذبح أبناء بني إسرائيل. فأوحى الله لأمه: ﴿أَرْضِعِيهِ فَإِذَا خِفْتِ عَلَيْهِ فَأَلْقِيهِ فِي الْيَمِّ﴾. فوجده آل فرعون في النيل وتبنّاه. وأُعيد إلى أمه مرضعاً.

**القتل والهروب**
لما كبر ورأى رجلاً من القبط يظلم إسرائيلياً، وكزه موسى فقضى عليه. فخاف وفرّ إلى مدين حيث تزوج وعمل أجيراً عشر سنين.

**البعثة والعصا**
عند جبل الطور رأى ناراً. وفي الوادي المقدس ناداه الله: ﴿إِنِّي أَنَا اللَّهُ لَا إِلَٰهَ إِلَّا أَنَا فَاعْبُدْنِي﴾. وأُعطي العصا التي تنقلب حية والبياض في يده.

**مواجهة فرعون**
ذهب موسى وهارون إلى فرعون. فقال: ﴿إِنَّ رَسُولَ رَبِّ الْعَالَمِينَ﴾. فكذّب فرعون. وأُرسلت الآيات التسع: الطوفان والجراد والقمل والضفادع والدم وانشقاق البحر. وغرق فرعون وهو يقول: ﴿آمَنتُ أَنَّهُ لَا إِلَٰهَ إِلَّا الَّذِي آمَنَتْ بِهِ بَنُو إِسْرَائِيلَ﴾.

**التيه والتوراة**
أُعطي موسى التوراة على جبل الطور بعد ميقات أربعين ليلة. ولما عاد وجد قومه يعبدون العجل.

**الدرس**
الثبات أمام الطغاة مع التوكل على الله. الله يُمهل ولا يُهمل. والعودة إلى الله في آخر لحظة لا تقبل.
`,
  'قصة_عيسى': `**قصة سيدنا عيسى عليه السلام — روح الله وكلمته**

**الميلاد المعجز**
بشّر جبريل مريم العذراء بالحمل بعيسى. قالت: ﴿أَنَّىٰ يَكُونُ لِي غُلَامٌ وَلَمْ يَمْسَسْنِي بَشَرٌ﴾. فقال: ﴿كَذَٰلِكِ اللَّهُ يَخْلُقُ مَا يَشَاءُ إِذَا قَضَىٰ أَمْرًا فَإِنَّمَا يَقُولُ لَهُ كُن فَيَكُونُ﴾.

وُلد في بيت لحم. ودافعت مريم عنه بإشارتها إليه فتكلّم في المهد: ﴿إِنِّي عَبْدُ اللَّهِ آتَانِيَ الْكِتَابَ وَجَعَلَنِي نَبِيًّا﴾.

**المعجزات والرسالة**
أُيّد عيسى بمعجزات عظيمة: يُبرئ الأكمه والأبرص، ويُحيي الموتى بإذن الله، وينفخ في الطين فيصير طائراً بإذن الله. وأُنزل عليه الإنجيل هدىً ونوراً.

دعا بني إسرائيل إلى توحيد الله وتصديق موسى والبشارة بمحمد ﷺ.

**الرفع إلى السماء**
حين تآمر بنو إسرائيل لقتله، رفعه الله إليه حياً: ﴿وَمَا قَتَلُوهُ وَمَا صَلَبُوهُ وَلَٰكِن شُبِّهَ لَهُمْ﴾. وشُبِّه لهم برجل آخر فصلبوه.

**نزوله في آخر الزمان**
يؤمن المسلمون بأن عيسى سينزل في آخر الزمان قرب دمشق ليُفسد على الدجال فتنته ويُقيم العدل في الأرض.

**الدرس**
عيسى عبد الله ورسوله، لا إله ولا ابن إله. معجزاته بإذن الله لا بقدرة ذاتية. والله يُكرم من يتوكل عليه بالرفع والنجاة.
`,
  'قصة_محمد': `**سيرة النبي محمد ﷺ — خاتم الأنبياء والمرسلين**

**المولد والنشأة (571م)**
وُلد ﷺ في مكة عام الفيل يتيم الأب. توفيت أمه آمنة وهو في السادسة. ثم كفله جده عبد المطلب ثم عمه أبو طالب. عُرف بالصادق الأمين قبل البعثة.

**البعثة (610م)**
في غار حراء في رمضان نزل جبريل: ﴿اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ﴾. فرجع يرتجف إلى خديجة فطمأنته. آمن به أبو بكر وخديجة وعلي وزيد رضي الله عنهم.

**الدعوة في مكة (13 سنة)**
دعا سراً ثم جهاراً فعذّب المستضعفون من أصحابه. ومات أبو طالب وخديجة في عام الحزن. ورحل للطائف فأُذي. ثم الإسراء والمعراج تكريماً له.

**الهجرة إلى المدينة (622م)**
أذن الله بالهجرة. وصل المدينة ففرح بها الأنصار. بنى المسجد النبوي وآخى بين المهاجرين والأنصار.

**الغزوات والفتح**
بدر (2هـ): أول نصر كبير. أُحد (3هـ): ابتلاء وصبر. الخندق (5هـ): تكتّل الأحزاب. خيبر (7هـ). الحديبية (6هـ): فتح مبين. فتح مكة (8هـ): دخل منتصراً وعفا عن أعدائه.

**حجة الوداع ووفاته (11هـ)**
حجّ وخطب: «لا تَرجعوا بعدي كفاراً يضرب بعضكم رقاب بعض». ونزل: ﴿الْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ﴾. توفي في 12 ربيع الأول عن 63 عاماً.

**الدرس**
الصبر على الأذى، والعفو عند القدرة، وحسن الخلق، هي طريق النصر. خُلقه كان القرآن.
`,
  'قصص_أنبياء_أخرى': `**قصص الأنبياء — ملخصات**

**سيدنا إدريس عليه السلام**
أول من خطّ بالقلم وخاط الثياب. رُفع مكاناً علياً. قال الله: ﴿وَرَفَعْنَاهُ مَكَانًا عَلِيًّا﴾.

**سيدنا هود عليه السلام**
أُرسل لقوم عاد الذين كانوا يبنون على كل ريع آية. كذّبوه فأرسل الله عليهم الريح الصرصر سبع ليالٍ وثمانية أيام.

**سيدنا صالح عليه السلام**
أُرسل لقوم ثمود في الحجر. أعطاهم ناقة الله آية. قال: ﴿هَٰذِهِ نَاقَةُ اللَّهِ لَكُمْ آيَةً فَذَرُوهَا تَأْكُلْ فِي أَرْضِ اللَّهِ﴾. فعقروها فأخذتهم الصيحة.

**سيدنا لوط عليه السلام**
أُرسل لقوم سدوم وعمورة أصحاب الفاحشة. نجا هو وابنتاه. وجاء أمر الله بقلب مدنهم وإمطارهم بالحجارة.

**سيدنا شعيب عليه السلام**
أُرسل لقوم مدين وأصحاب الأيكة. كانوا يطففون الكيل والميزان. فدعاهم للعدل فكذّبوه فأخذتهم الصيحة.

**سيدنا أيوب عليه السلام**
ابتُلي بفقد ماله وأولاده وصحته. صبر سبع عشرة سنة قائلاً: ﴿أَنِّي مَسَّنِيَ الضُّرُّ وَأَنتَ أَرْحَمُ الرَّاحِمِينَ﴾. فكشف الله ضره وأعاد له ضعف ما كان.

**سيدنا يحيى وزكريا عليهما السلام**
زكريا دعا ربه وهو شيخ وزوجه عاقر: ﴿رَبِّ لَا تَذَرْنِي فَرْدًا﴾ فوُلد له يحيى الذي قُتل شهيداً بسبب بنت الملك.

**سيدنا ذو الكفل عليه السلام**
نبي صابر صدق وعده، ذكره الله مع الأنبياء الصابرين.

**سيدنا يونس عليه السلام**
غضب على قومه وخرج دون إذن فالتقمه الحوت. فناداه في بطن الحوت: ﴿لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ﴾. فاستُجيب له وأُلقي على الساحل. ثم أُرسل لقوم نينوى فآمنوا جميعاً.

**سيدنا داود وسليمان عليهما السلام**
داود: مَلَك نبي، أُعطي الزَّبور، يُليّن الله له الحديد. قتل جالوت وهو شاب. سليمان: أُوتي مُلكاً لا ينبغي لأحد من بعده، يُكلّم الطير والنمل وسخّر له الجن.
`,
  'أدعية_اليوم': `**أدعية يومية متنوعة**

**أدعية الصباح**
• اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور.
• أصبحنا على فطرة الإسلام وكلمة الإخلاص وعلى دين نبينا محمد ﷺ.
• اللهم إني أسألك علماً نافعاً ورزقاً طيباً وعملاً متقبلاً.
• اللهم أنت ربي لا إله إلا أنت خلقتني وأنا عبدك.
• أعوذ بكلمات الله التامات من شر ما خلق.

**أدعية المساء**
• اللهم بك أمسينا وبك أصبحنا وبك نحيا وبك نموت وإليك المصير.
• أمسينا وأمسى الملك لله والحمد لله لا إله إلا الله وحده لا شريك له.
• اللهم ما أمسى بي من نعمة أو بأحد من خلقك فمنك وحدك لا شريك لك.
• اللهم عافني في بدني وعافني في سمعي وبصري واجعلهما الوارث مني.
• اللهم إني أعوذ بك من الهم والحزن والعجز والكسل والبخل والجبن.

**أدعية الصلاة**
• ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار.
• اللهم اغفر لي ما قدمت وما أخرت وما أسررت وما أعلنت وما أنت أعلم به مني.
• اللهم إني ظلمت نفسي ظلماً كبيراً ولا يغفر الذنوب إلا أنت.
• سبحانك اللهم وبحمدك وتبارك اسمك وتعالى جدك ولا إله غيرك.

**أدعية الرزق والعافية**
• اللهم اكفني بحلالك عن حرامك وأغنني بفضلك عمن سواك.
• اللهم إني أسألك الهدى والتقى والعفاف والغنى.
• اللهم إني أسألك الجنة وما قرّب إليها من قول وعمل.
• اللهم رب جبريل وميكائيل وإسرافيل فاطر السماوات والأرض اهدني لما اختُلف فيه من الحق.
• اللهم أصلح لي ديني الذي هو عصمة أمري وأصلح لي دنياي التي فيها معاشي.

**أدعية الهم والكرب**
• لا إله إلا الله العظيم الحليم لا إله إلا الله رب العرش العظيم.
• يا حي يا قيوم برحمتك أستغيث أصلح لي شأني كله ولا تكلني إلى نفسي طرفة عين.
• اللهم إني عبدك ابن عبدك ابن أمتك ناصيتي بيدك ماضٍ فيّ حكمك عدل فيّ قضاؤك.
• لا إله إلا أنت سبحانك إني كنت من الظالمين — دعاء يونس عليه السلام.
• حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم.

**أدعية طلب العلم والهداية**
• ربّ زدني علماً.
• رب اشرح لي صدري ويسر لي أمري واحلل عقدة من لساني يفقهوا قولي.
• اللهم انفعني بما علمتني وعلمني ما ينفعني وارزقني علماً تنفعني به.
• اللهم اهدني وسددني واذكر إذا استهديت الهداية وإذا استسددت السداد.

**أدعية قبل النوم وبعد الاستيقاظ**
• اللهم باسمك أموت وأحيا. — قبل النوم.
• الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور. — بعد الاستيقاظ.
• اللهم إني أعوذ بك من وعثاء السفر وكآبة المنظر وسوء المنقلب في المال والأهل.

**أدعية للوالدين**
• ربّ ارحمهما كما ربّياني صغيراً.
• اللهم اغفر لوالديّ وارحمهما وعافهما واعف عنهما وأدخلهما الجنة برحمتك.
• ربنا اغفر لي ولوالديّ وللمؤمنين يوم يقوم الحساب.

**أدعية للمرضى والمبتلين**
• اللهم رب الناس أذهب البأس اشفِ أنت الشافي لا شفاء إلا شفاؤك.
• أسأل الله العظيم رب العرش العظيم أن يشفيك — سبع مرات.
• اللهم إني أسألك العافية في الدنيا والآخرة.
• بسم الله أرقيك من كل شيء يؤذيك ومن شر كل نفس أو عين حاسد الله يشفيك.
`,
  'عدد آيات القرآن': `القرآن الكريم يحتوي على 6236 آية في 114 سورة و30 جزءاً.`,
  'عدد سور القرآن': `القرآن الكريم يتكون من 114 سورة. أطولها البقرة (286 آية) وأقصرها الكوثر (3 آيات).`,
  'أركان الإسلام': `أركان الإسلام خمسة: شهادة أن لا إله إلا الله — الصلاة — الزكاة — صوم رمضان — حج البيت.`,
  'أركان الإيمان': `أركان الإيمان ستة: الإيمان بالله — الملائكة — الكتب — الرسل — اليوم الآخر — القدر خيره وشره.`,
  'شروط الصلاة': `شروط صحة الصلاة: الإسلام — العقل — البلوغ — الطهارة — ستر العورة — استقبال القبلة — دخول الوقت — النية.`,
  'أوقات الصلاة': `الصلوات الخمس: الفجر (من الفجر الصادق) — الظهر (من الزوال) — العصر — المغرب (بعد الغروب) — العشاء.`,
  'نصاب الزكاة': `نصاب الزكاة من الذهب 85 جراماً ومن الفضة 595 جراماً. ومقدارها 2.5% إذا بلغ النصاب وحال عليه الحول.`,
  'أركان الحج': `أركان الحج: الإحرام — الوقوف بعرفة (أعظم ركن) — طواف الإفاضة — السعي بين الصفا والمروة.`,
  'فضل رمضان': `قال النبي: إذا دخل رمضان فُتحت أبواب الجنة وغُلقت أبواب النار وصُفدت الشياطين.`,
  'ليلة القدر': `ليلة القدر خير من ألف شهر. تُطلب في العشر الأواخر من رمضان خاصة في الأوتار: 21، 23، 25، 27، 29.`,
  'فضل يوم الجمعة': `يوم الجمعة سيد الأيام. فيه ساعة إجابة الدعاء. ومن قرأ سورة الكهف أُضيء له نور بين الجمعتين.`,
  'أسماء الله الحسنى': `أسماء الله الحسنى 99 اسماً. من أحصاها دخل الجنة. أجمعها: الله، الرحمن، الرحيم، الملك، القدوس، السلام.`,
  'معنى لا إله إلا الله': `لا إله إلا الله تعني: لا معبود بحق إلا الله. نفي العبودية عن كل ما سوى الله وإثباتها لله وحده.`,
  'نواقض الوضوء': `نواقض الوضوء: الخارج من السبيلين — النوم المستغرق — زوال العقل — لمس الفرج — أكل لحم الإبل.`,
  'متى يجب الغسل': `يجب الغسل في: الجنابة — انقطاع الحيض والنفاس — الموت. والجمعة سنة مؤكدة.`,
  'معنى البدعة': `البدعة: ما أُحدث في الدين مما ليس له أصل. كل بدعة ضلالة وكل ضلالة في النار.`,
  'الكبائر في الإسلام': `من أكبر الكبائر: الشرك بالله — قتل النفس — السحر — الربا — عقوق الوالدين — شهادة الزور.`,
  'شروط التوبة': `شروط التوبة: الإقلاع عن الذنب — الندم على ما فات — العزم على عدم العودة — رد الحق لصاحبه.`,
  'علامات الساعة الكبرى': `علامات الساعة الكبرى: الدجال — المهدي — نزول عيسى — يأجوج ومأجوج — الدخان — طلوع الشمس من مغربها.`,
  'مراتب الدين': `مراتب الدين ثلاث: الإسلام (الأعمال الظاهرة) — الإيمان (التصديق الباطن) — الإحسان (مراقبة الله في كل حال).`,
  'ما هو التوكل': `التوكل: الاعتماد على الله مع الأخذ بالأسباب. التوكل لا يعني ترك الأسباب بل إسناد الأمر لله بعدها.`,
  'معنى سبحان الله': `سبحان الله: تنزيه الله عن كل نقص. سبحان الله وبحمده مئة مرة تحط الخطايا وإن كانت كزبد البحر.`,
  'معنى لا حول ولا قوة إلا بالله': `لا حول ولا قوة إلا بالله: لا تحوّل من حال إلى حال إلا بتوفيق الله. كنز من كنوز الجنة.`,
  'دعاء الكرب': `دعاء الكرب: لا إله إلا الله العظيم الحليم لا إله إلا الله رب العرش العظيم لا إله إلا الله رب السماوات ورب الأرض ورب العرش الكريم.`,
  'فضل الصدقة': `الصدقة تطفئ الخطيئة كما يطفئ الماء النار. وأفضلها: السر — في رمضان — على ذي رحم — الجارية.`,
  'الصدقة الجارية': `الصدقة الجارية ثوابها يستمر بعد الموت. قال النبي: إذا مات الإنسان انقطع عمله إلا صدقة جارية أو علم ينتفع به أو ولد صالح.`,
  'مصارف الزكاة': `مصارف الزكاة ثمانية: الفقراء — المساكين — العاملون عليها — المؤلفة قلوبهم — الرقاب — الغارمون — في سبيل الله — ابن السبيل.`,
  'فضل العلم': `من سلك طريقاً يلتمس فيه علماً سهّل الله له طريقاً إلى الجنة. والعلم النافع يجري ثوابه بعد الموت.`,
  'حقوق المسلم': `حقوق المسلم على المسلم ستة: رد السلام — إجابة الدعوة — اتباع الجنازة — عيادة المريض — تشميت العاطس — النصح.`,
  'أفضل الأعمال': `أفضل الأعمال: الصلاة على وقتها — ثم بر الوالدين — ثم الجهاد في سبيل الله.`,
  'دعاء الاستخارة': `صلاة الاستخارة ركعتان ثم دعاء: اللهم إني أستخيرك بعلمك وأستقدرك بقدرتك وأسألك من فضلك العظيم فإنك تقدر ولا أقدر.`,
  'معنى ختم النبوة': `خاتم النبيين: لا نبي بعد محمد. قال النبي: أنا خاتم النبيين لا نبي بعدي. من ادّعى النبوة فهو كاذب دجّال.`,
  'ما هي الجنة': `الجنة دار النعيم الأبدي أعدّها الله للمتقين. فيها ما لا عين رأت ولا أذن سمعت ولا خطر على قلب بشر.`,
  'ما هو البرزخ': `البرزخ عالم القبر من الموت إلى القيامة. فيه نعيم للمؤمنين وعذاب للكافرين.`,
  'كيف تحصل على الخشوع': `الخشوع يحصل بـ: استحضار النية — تدبر المعاني — التأني — تذكر الموت — البُعد عن الشواغل.`,
  'حقوق الوالدين': `حقوق الوالدين: الطاعة في المعروف — الإحسان القولي والفعلي — عدم التأفف — التواضع لهما — الدعاء لهما بعد وفاتهما.`,
  'كيف أختم القرآن': `لإتمام ختم القرآن: اقرأ جزءاً يومياً تختم في شهر. أو 4 صفحات بعد كل صلاة. ابدأ بالفاتحة واستمتع بالرحلة.`
};

var KB_KEYS = {
  'الفاتحة': 'الفاتحة_full',
  'فاتحة': 'الفاتحة_full',
  'البقرة': 'البقرة_full',
  'بقرة': 'البقرة_full',
  'آل عمران': 'آل_عمران_full',
  'النساء': 'النساء_full',
  'المائدة': 'المائدة_full',
  'الأنعام': 'الأنعام_full',
  'الأعراف': 'الأعراف_full',
  'الأنفال': 'الأنفال_full',
  'التوبة': 'التوبة_full',
  'براءة': 'التوبة_full',
  'يونس': 'يونس_full',
  'هود': 'هود_full',
  'يوسف': 'يوسف_full',
  'الرعد': 'الرعد_full',
  'إبراهيم': 'إبراهيم_full',
  'الحجر': 'الحجر_full',
  'النحل': 'النحل_full',
  'الإسراء': 'الإسراء_full',
  'بني إسرائيل': 'الإسراء_full',
  'الكهف': 'الكهف_full',
  'مريم': 'مريم_full',
  'طه': 'طه_full',
  'الأنبياء': 'الأنبياء_full',
  'الحج': 'الحج_full',
  'المؤمنون': 'المؤمنون_full',
  'الهُدى': 'النور_full',
  'الفرقان': 'الفرقان_full',
  'الشعراء': 'الشعراء_full',
  'النمل': 'النمل_full',
  'القصص': 'القصص_full',
  'العنكبوت': 'العنكبوت_full',
  'الروم': 'الروم_full',
  'لقمان': 'لقمان_full',
  'السجدة': 'السجدة_full',
  'الأحزاب': 'الأحزاب_full',
  'سبأ': 'سبأ_full',
  'فاطر': 'فاطر_full',
  'الملائكة': 'فاطر_full',
  'يس': 'يس_full',
  'ياسين': 'يس_full',
  'الصافات': 'الصافات_full',
  'ص': 'ص_full',
  'الزمر': 'الزمر_full',
  'غافر': 'غافر_full',
  'المؤمن': 'غافر_full',
  'فصلت': 'فصلت_full',
  'الشورى': 'الشورى_full',
  'الزخرف': 'الزخرف_full',
  'الدخان': 'الدخان_full',
  'الجاثية': 'الجاثية_full',
  'الأحقاف': 'الأحقاف_full',
  'محمد': 'محمد_full',
  'الفتح': 'الفتح_full',
  'الحجرات': 'الحجرات_full',
  'ق': 'ق_full',
  'الذاريات': 'الذاريات_full',
  'الطور': 'الطور_full',
  'النجم': 'النجم_full',
  'القمر': 'القمر_full',
  'الرحمن': 'الرحمن_full',
  'الواقعة': 'الواقعة_full',
  'الحديد': 'الحديد_full',
  'المجادلة': 'المجادلة_full',
  'الحشر': 'الحشر_full',
  'الممتحنة': 'الممتحنة_full',
  'الصف': 'الصف_full',
  'الجمعة': 'الجمعة_full',
  'المنافقون': 'المنافقون_full',
  'التغابن': 'التغابن_full',
  'الطلاق': 'الطلاق_full',
  'التحريم': 'التحريم_full',
  'الملك': 'الملك_full',
  'تبارك': 'الملك_full',
  'القلم': 'القلم_full',
  'الحاقة': 'الحاقة_full',
  'المعارج': 'المعارج_full',
  'نوح': 'نوح_full',
  'الجن': 'الجن_full',
  'المزمل': 'المزمل_full',
  'المدثر': 'المدثر_full',
  'القيامة': 'القيامة_full',
  'الإنسان': 'الإنسان_full',
  'الدهر': 'الإنسان_full',
  'المرسلات': 'المرسلات_full',
  'النبأ': 'النبأ_full',
  'عم': 'النبأ_full',
  'النازعات': 'النازعات_full',
  'عبس': 'عبس_full',
  'التكوير': 'التكوير_full',
  'الانفطار': 'الانفطار_full',
  'المطففين': 'المطففين_full',
  'الانشقاق': 'الانشقاق_full',
  'البروج': 'البروج_full',
  'الطارق': 'الطارق_full',
  'الأعلى': 'الأعلى_full',
  'الغاشية': 'الغاشية_full',
  'الفجر': 'الفجر_full',
  'البلد': 'البلد_full',
  'الشمس': 'الشمس_full',
  'الليل': 'الليل_full',
  'الضحى': 'الضحى_full',
  'الشرح': 'الشرح_full',
  'ألم نشرح': 'الشرح_full',
  'التين': 'التين_full',
  'العلق': 'العلق_full',
  'اقرأ': 'العلق_full',
  'القدر': 'القدر_full',
  'ليلة القدر': 'القدر_full',
  'البينة': 'البينة_full',
  'الزلزلة': 'الزلزلة_full',
  'العاديات': 'العاديات_full',
  'القارعة': 'القارعة_full',
  'التكاثر': 'التكاثر_full',
  'العصر': 'العصر_full',
  'الهمزة': 'الهمزة_full',
  'الفيل': 'الفيل_full',
  'قريش': 'قريش_full',
  'الماعون': 'الماعون_full',
  'الكوثر': 'الكوثر_full',
  'الكافرون': 'الكافرون_full',
  'النصر': 'النصر_full',
  'المسد': 'المسد_full',
  'تبت': 'المسد_full',
  'الإخلاص': 'الإخلاص_full',
  'قل هو الله': 'الإخلاص_full',
  'الفلق': 'الفلق_full',
  'الناس': 'الناس_full',
  'أسماء الله': 'أسماء الله الحسنى',
  'الأسماء الحسنى': 'أسماء الله الحسنى',
  'الحسنى': 'أسماء الله الحسنى',
  '99 اسم': 'أسماء الله الحسنى',
  'تسعة وتسعين': 'أسماء الله الحسنى',
  'أركان الإسلام': 'أركان الإسلام',
  'أركان الإيمان': 'أركان الإيمان',
  'الصلاة': 'الصلاة',
  'الصلوات الخمس': 'الصلاة',
  'الصيام': 'الصيام',
  'رمضان': 'الصيام',
  'الزكاة': 'الزكاة',
  'مناسك': 'الحج_full',
  // أسئلة وأجوبة
  'سؤال': 'أسئلة_وأجوبة',
  'أسئلة': 'أسئلة_وأجوبة',
  'وجواب': 'أسئلة_وأجوبة',
  'سؤال وجواب': 'أسئلة_وأجوبة',
  // أحاديث
  'حديث': 'أحاديث_نبوية',
  'أحاديث': 'أحاديث_نبوية',
  'السنة النبوية': 'أحاديث_نبوية',
  'سنة': 'أحاديث_نبوية',
  // قصص الأنبياء
  'آدم': 'قصة_آدم',
  'قصة آدم': 'قصة_آدم',
  'نوح': 'قصة_نوح',
  'قصة نوح': 'قصة_نوح',
  'إبراهيم': 'قصة_إبراهيم',
  'قصة إبراهيم': 'قصة_إبراهيم',
  'خليل الله': 'قصة_إبراهيم',
  'يوسف': 'قصة_يوسف',
  'قصة يوسف': 'قصة_يوسف',
  'موسى': 'قصة_موسى',
  'قصة موسى': 'قصة_موسى',
  'كليم الله': 'قصة_موسى',
  'عيسى': 'قصة_عيسى',
  'قصة عيسى': 'قصة_عيسى',
  'روح الله': 'قصة_عيسى',
  'محمد': 'قصة_محمد',
  'سيرة النبي': 'قصة_محمد',
  'السيرة': 'قصة_محمد',
  'قصص الأنبياء': 'قصص_أنبياء_أخرى',
  'الأنبياء': 'قصص_أنبياء_أخرى',
  'هود': 'قصص_أنبياء_أخرى',
  'صالح': 'قصص_أنبياء_أخرى',
  'لوط': 'قصص_أنبياء_أخرى',
  'أيوب': 'قصص_أنبياء_أخرى',
  'يونس': 'قصص_أنبياء_أخرى',
  'داود': 'قصص_أنبياء_أخرى',
  'سليمان': 'قصص_أنبياء_أخرى',
  // أدعية
  'دعاء': 'أدعية_اليوم',
  'أدعية': 'أدعية_اليوم',
  'دعاء الصباح': 'أدعية_اليوم',
  'دعاء المساء': 'أدعية_اليوم',
  'أدعية يومية': 'أدعية_اليوم',


  // ── أسئلة وأجوبة ──
  'عدد آيات': 'عدد آيات القرآن',
  'كم آية': 'عدد آيات القرآن',
  'كم سورة': 'عدد سور القرآن',
  'عدد سور': 'عدد سور القرآن',
  'أركان الإسلام الخمسة': 'أركان الإسلام',
  'أركان إيمان': 'أركان الإيمان',
  'شروط صلاة': 'شروط الصلاة',
  'مواقيت الصلاة': 'أوقات الصلاة',
  'زكاة': 'نصاب الزكاة',
  'نصاب': 'نصاب الزكاة',
  'حج': 'أركان الحج',
  'رمضان': 'فضل رمضان',
  'قدر': 'ليلة القدر',
  'جمعة': 'فضل يوم الجمعة',
  '99 اسم': 'أسماء الله الحسنى',
  'أسماء الله': 'أسماء الله الحسنى',
  'لا إله إلا الله': 'معنى لا إله إلا الله',
  'وضوء': 'نواقض الوضوء',
  'غسل': 'متى يجب الغسل',
  'بدعة': 'معنى البدعة',
  'كبائر': 'الكبائر في الإسلام',
  'توبة': 'شروط التوبة',
  'قيامة': 'علامات الساعة الكبرى',
  'دين': 'مراتب الدين',
  'توكل': 'ما هو التوكل',
  'سبحان الله': 'معنى سبحان الله',
  'لا حول': 'معنى لا حول ولا قوة إلا بالله',
  'دعاء كرب': 'دعاء الكرب',
  'صدقة': 'فضل الصدقة',
  'صدقة جارية': 'الصدقة الجارية',
  'مصارف زكاة': 'مصارف الزكاة',
  'فضل علم': 'فضل العلم',
  'حقوق مسلم': 'حقوق المسلم',
  'حقوق والدين': 'حقوق الوالدين',
  'جنة': 'ما هي الجنة',
  'برزخ': 'ما هو البرزخ',
  'خشوع': 'كيف تحصل على الخشوع',
  'أفضل أعمال': 'أفضل الأعمال',
  'استخارة': 'دعاء الاستخارة',
  'ختم نبوة': 'معنى ختم النبوة',
  'ختم القرآن': 'كيف أختم القرآن',
};


var HADITHS_DB = {
  'العقيدة': [
    {t:`بُني الإسلام على خمس: شهادة أن لا إله إلا الله وأن محمداً رسول الله وإقام الصلاة وإيتاء الزكاة وصوم رمضان وحج البيت`,s:'متفق عليه'},
    {t:`الإيمان أن تؤمن بالله وملائكته وكتبه ورسله واليوم الآخر وتؤمن بالقدر خيره وشره`,s:'رواه مسلم'},
  ],
  'العبادة': [
    {t:`الصلاة عماد الدين فمن أقامها فقد أقام الدين ومن تركها فقد هدم الدين`,s:'رواه البيهقي'},
    {t:`أول ما يُحاسب به العبد يوم القيامة صلاته فإن صلحت فقد أفلح وأنجح`,s:'رواه الترمذي'},
    {t:`من صام رمضان إيماناً واحتساباً غُفر له ما تقدم من ذنبه`,s:'متفق عليه'},
    {t:`الحج المبرور ليس له جزاء إلا الجنة`,s:'متفق عليه'},
  ],
  'القرآن': [
    {t:`اقرؤوا القرآن فإنه يأتي يوم القيامة شفيعاً لأصحابه`,s:'رواه مسلم'},
    {t:`خيركم من تعلّم القرآن وعلّمه`,s:'رواه البخاري'},
    {t:`من قرأ حرفاً من كتاب الله فله به حسنة والحسنة بعشر أمثالها`,s:'رواه الترمذي'},
    {t:`الماهر بالقرآن مع السفرة الكرام البررة والذي يقرأ ويتتعتع فيه له أجران`,s:'متفق عليه'},
  ],
  'الأخلاق': [
    {t:`إنما بُعثت لأتمّم مكارم الأخلاق`,s:'رواه البخاري في الأدب المفرد'},
    {t:`أكمل المؤمنين إيماناً أحسنهم خُلقاً`,s:'رواه أبو داود'},
    {t:`ليس الشديد بالصُّرعة إنما الشديد الذي يملك نفسه عند الغضب`,s:'متفق عليه'},
    {t:`المسلم من سلم المسلمون من لسانه ويده`,s:'متفق عليه'},
    {t:`لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه`,s:'متفق عليه'},
    {t:`تبسّمك في وجه أخيك صدقة`,s:'رواه الترمذي'},
    {t:`من كان يؤمن بالله واليوم الآخر فليقل خيراً أو ليصمت`,s:'متفق عليه'},
  ],
  'الدعاء': [
    {t:`الدعاء هو العبادة`,s:'رواه الترمذي'},
    {t:`أقرب ما يكون العبد من ربه وهو ساجد فأكثروا الدعاء`,s:'رواه مسلم'},
    {t:`من لم يسأل الله يغضب عليه`,s:'رواه الترمذي'},
  ],
  'العلم': [
    {t:`طلب العلم فريضة على كل مسلم`,s:'رواه ابن ماجه'},
    {t:`من سلك طريقاً يلتمس فيه علماً سهّل الله له طريقاً إلى الجنة`,s:'رواه مسلم'},
    {t:`إذا مات ابن آدم انقطع عمله إلا من ثلاثة: صدقة جارية أو علم ينتفع به أو ولد صالح يدعو له`,s:'رواه مسلم'},
  ],
  'الأسرة': [
    {t:`خيركم خيركم لأهله وأنا خيركم لأهلي`,s:'رواه الترمذي'},
    {t:`الجنة تحت أقدام الأمهات`,s:'رواه النسائي'},
    {t:`رضا الله في رضا الوالدين وسخط الله في سخط الوالدين`,s:'رواه الترمذي'},
  ],
  'المعاملات': [
    {t:`من غشّنا فليس منّا`,s:'رواه مسلم'},
    {t:`التاجر الصدوق الأمين مع النبيين والصديقين والشهداء`,s:'رواه الترمذي'},
  ],
  'الصحة': [
    {t:`نعمتان مغبون فيهما كثير من الناس: الصحة والفراغ`,s:'رواه البخاري'},
    {t:`المؤمن القوي خير وأحب إلى الله من المؤمن الضعيف`,s:'رواه مسلم'},
  ],
  'الآخرة': [
    {t:`كن في الدنيا كأنك غريب أو عابر سبيل`,s:'رواه البخاري'},
    {t:`أكثروا من ذكر هاذم اللذات: الموت`,s:'رواه الترمذي'},
    {t:`موضع سوط في الجنة خير من الدنيا وما فيها`,s:'متفق عليه'},
  ],
  'التوبة': [
    {t:`كل ابن آدم خطّاء وخير الخطّائين التوّابون`,s:'رواه الترمذي'},
    {t:`التائب من الذنب كمن لا ذنب له`,s:'رواه ابن ماجه'},
  ],
  'الصبر': [
    {t:`ما أُعطي أحد عطاءً خيراً وأوسع من الصبر`,s:'متفق عليه'},
    {t:`عجباً لأمر المؤمن: إن أصابته سرّاء شكر فكان خيراً له وإن أصابته ضرّاء صبر فكان خيراً له`,s:'رواه مسلم'},
  ],
  'الرحمة': [
    {t:`الراحمون يرحمهم الرحمن ارحموا من في الأرض يرحمكم من في السماء`,s:'رواه الترمذي'},
  ],
  'الذكر': [
    {t:`مثل الذي يذكر ربه والذي لا يذكر ربه كمثل الحي والميت`,s:'رواه البخاري'},
    {t:`سبحان الله وبحمده سبحان الله العظيم: كلمتان خفيفتان على اللسان ثقيلتان في الميزان حبيبتان إلى الرحمن`,s:'متفق عليه'},
  ],
};

// ── تحويل HADITHS_DB إلى HADITHS array ──
const HADITHS = Object.entries(HADITHS_DB).flatMap(([cat, items]) =>
  items.map(item => ({cat, ar: item.t, src: item.s}))
);

// ── تحويل PROPHETS_DB إلى قائمة ──
// (يُستخدم في صفحة الأنبياء عبر renderProphetStory)
function getProphetStory(name) {
  return PROPHETS_DB[name] || PROPHETS_DB[Object.keys(PROPHETS_DB).find(k=>name.includes(k)||k.includes(name))] || null;
}

// ── أدعية يومية متنوعة غير متكررة ──
var _duaIdxMap = {};
function getUniqueDua(time) {
  const pool = DUAS_DB.filter(d => d.time === time || d.time === 'دعاء عام');
  if (!pool.length) return DUAS_DB[0];
  const used = _duaIdxMap[time] || 0;
  const next = used % pool.length;
  _duaIdxMap[time] = next + 1;
  return pool[next];
}

var PROPHETS_DB = {
  'آدم': `أبو البشرية. خُلق من تراب ونُفخ فيه الروح وعُلّم الأسماء كلها. سكن الجنة مع زوجته حواء فأُهبطا للأرض بعد أن أغواهما الشيطان. تاب فتاب الله عليه.`,
  'نوح': `لبث في قومه ألف سنة إلا خمسين عاماً يدعوهم فكذّبوه. بنى السفينة وحمل فيها من كل زوجين اثنين. أغرق الله الكافرين بالطوفان العظيم. ثاني أولي العزم.`,
  'إبراهيم': `خليل الله وأبو الأنبياء. كسر أصنام قومه فأُلقي في النار فكانت برداً وسلاماً. بنى الكعبة مع ابنه إسماعيل. ابتُلي بذبح ابنه فامتثل ففداه الله بكبش.`,
  'إسماعيل': `ابن إبراهيم من هاجر. تُرك طفلاً في وادي مكة فجرى له زمزم. شارك أباه في بناء الكعبة. كان صادق الوعد. جد العرب.`,
  'يوسف': `ابن يعقوب. حسده إخوته فألقوه في البئر وبِيع عبداً في مصر. صبر على فتنة امرأة العزيز فسُجن. فسّر رؤيا الملك فجُعل على خزائن مصر. عفا عن إخوته.`,
  'موسى': `كليم الله. وُلد في مصر ونشأ في قصر فرعون. أجرى الله على يديه التسع آيات. فلق البحر لبني إسرائيل وأغرق فرعون. أُنزلت عليه التوراة في الطور.`,
  'داود': `النبي الملك. أُوتي الزبور. قتل جالوت بحجر. تُسبّح معه الجبال والطير. آتاه الله الملك والحكمة وفصل الخطاب.`,
  'سليمان': `ملك الأنبياء. سُخّرت له الريح والجن والطير. فهم لغة الطير والنمل. راسل ملكة سبأ بلقيس فأسلمت. بنى بيت المقدس.`,
  'أيوب': `نبي الصبر. ابتُلي بالمرض سنوات فصبر وشكر. دعاؤه: أني مسّني الضر وأنت أرحم الراحمين. كشف الله ضره وآتاه أجره مضاعفاً.`,
  'يونس': `صاحب الحوت. أُرسل لأهل نينوى فخرج مغاضباً فابتلعه الحوت. دعا في الظلمات: لا إله إلا أنت سبحانك إني كنت من الظالمين. فقذفه الحوت ورجع لقومه فآمنوا.`,
  'زكريا': `كافل مريم. طاعن في السن وامرأته عاقر. دعا الله فبشّره بيحيى. قال: رب هب لي من لدنك ذرية طيبة.`,
  'يحيى': `ابن زكريا. وُلد معجزةً لأبوين طاعنَين في السن. قال تعالى: وآتيناه الحكم صبياً. كان زاهداً ورعاً. أول من بشّر بعيسى.`,
  'عيسى': `روح الله وكلمته. وُلد من مريم العذراء بلا أب. أحيا الموتى وأبرأ الأكمه والأبرص. رُفع إلى السماء. سينزل في آخر الزمان فيقتل الدجال.`,
  'شعيب': `خطيب الأنبياء. أُرسل لأهل مدين. قومه كانوا يطففون الكيل. دعاهم للتوحيد والعدل فكذّبوه فأخذهم عذاب الظلة. نسيب موسى.`,
  'هود': `أُرسل لعاد في الأحقاف. كانوا يفخرون بقوتهم. دعاهم للتوحيد فكذّبوه فأهلكهم الله بريح صرصر عاتية.`,
  'صالح': `أُرسل لقوم ثمود في الحِجر. آيته الناقة. نهاهم عن عقرها فعقروها فأمهلهم ثلاثة أيام ثم أهلكهم الله بصيحة.`,
  'لوط': `ابن أخ إبراهيم. أُرسل لقوم سدوم. دعاهم فكذّبوه. نجّاه الله وبناته وأهلك قومه بجعل عاليها سافلها.`,
  'محمد': `خاتم الأنبياء والمرسلين. وُلد في مكة 570م. بُعث نبياً وعمره 40. هاجر للمدينة. أسّس الدولة الإسلامية. فتح مكة. توفّي 63 سنة. أُرسل رحمة للعالمين.`,
};

var DUAS_DB = [
  {time:'صباح',text:`اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور`,ref:'أبو داود'},
  {time:'صباح',text:`اللهم عافني في بدني اللهم عافني في سمعي اللهم عافني في بصري لا إله إلا أنت`,ref:'أبو داود'},
  {time:'صباح',text:`اللهم إني أسألك علماً نافعاً ورزقاً طيباً وعملاً متقبلاً`,ref:'ابن ماجه'},
  {time:'صباح',text:`رضيت بالله رباً وبالإسلام ديناً وبمحمد نبياً`,ref:'أبو داود'},
  {time:'صباح',text:`بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم`,ref:'أبو داود'},
  {time:'صباح',text:`حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم`,ref:'أبو داود'},
  {time:'مساء',text:`اللهم بك أمسينا وبك أصبحنا وبك نحيا وبك نموت وإليك المصير`,ref:'أبو داود'},
  {time:'مساء',text:`اللهم ما أمسى بي من نعمة أو بأحد من خلقك فمنك وحدك لا شريك لك فلك الحمد ولك الشكر`,ref:'أبو داود'},
  {time:'مساء',text:`أعوذ بكلمات الله التامات من شر ما خلق`,ref:'مسلم'},
  {time:'مساء',text:`اللهم إني أسألك العفو والعافية في الدنيا والآخرة`,ref:'ابن ماجه'},
  {time:'نوم',text:`باسمك اللهم أموت وأحيا`,ref:'البخاري'},
  {time:'نوم',text:`اللهم قني عذابك يوم تبعث عبادك`,ref:'أبو داود'},
  {time:'نوم',text:`اللهم أسلمت نفسي إليك ووجّهت وجهي إليك وفوّضت أمري إليك وألجأت ظهري إليك`,ref:'البخاري'},
  {time:'نوم',text:`سبحان الله 33 مرة والحمد لله 33 مرة والله أكبر 34 مرة`,ref:'متفق عليه'},
  {time:'استيقاظ',text:`الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور`,ref:'البخاري'},
  {time:'طعام',text:`بسم الله وعلى بركة الله`,ref:'أبو داود'},
  {time:'طعام',text:`الحمد لله الذي أطعمني هذا ورزقنيه من غير حول مني ولا قوة`,ref:'الترمذي'},
  {time:'سفر',text:`سبحان الذي سخّر لنا هذا وما كنا له مقرنين وإنا إلى ربنا لمنقلبون`,ref:'أبو داود'},
  {time:'سفر',text:`اللهم إنا نسألك في سفرنا هذا البر والتقوى ومن العمل ما ترضى`,ref:'مسلم'},
  {time:'كرب',text:`لا إله إلا الله العظيم الحليم لا إله إلا الله رب العرش العظيم لا إله إلا الله رب السماوات والأرض والعرش الكريم`,ref:'متفق عليه'},
  {time:'كرب',text:`يا حي يا قيوم برحمتك أستغيث أصلح لي شأني كله ولا تكلني إلى نفسي طرفة عين`,ref:'الحاكم'},
  {time:'استغفار',text:`أستغفر الله العظيم الذي لا إله إلا هو الحي القيوم وأتوب إليه`,ref:'أبو داود'},
  {time:'استغفار',text:`اللهم أنت ربي لا إله إلا أنت خلقتني وأنا عبدك وأنا على عهدك ووعدك ما استطعت أعوذ بك من شر ما صنعت`,ref:'البخاري'},
  {time:'هم',text:`اللهم إني أعوذ بك من الهم والحزن والعجز والكسل والبخل والجبن وضلع الدين وغلبة الرجال`,ref:'البخاري'},
  {time:'شفاء',text:`اللهم رب الناس أذهب الباس اشفه وأنت الشافي لا شفاء إلا شفاؤك شفاءً لا يغادر سقماً`,ref:'متفق عليه'},
  {time:'بعد الصلاة',text:`اللهم أعني على ذكرك وشكرك وحسن عبادتك`,ref:'أبو داود'},
  {time:'دعاء عام',text:`ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار`,ref:'البخاري'},
  {time:'دعاء عام',text:`اللهم اغفر لي وارحمني واهدني وعافني وارزقني`,ref:'مسلم'},
  {time:'دعاء عام',text:`اللهم إني أسألك الجنة وأعوذ بك من النار`,ref:'أبو داود'},
  {time:'دعاء عام',text:`ربي زدني علماً`,ref:'سورة طه 114'},
];


async function callClaudeAPI(payload) {
  const msgs    = payload.messages || [];
  const history = msgs.slice(-10).map(m => ({
    role:    m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content
  }));

  // ══ الطريق الأول: الباك إند الخاص ══
  try {
    const ac  = new AbortController();
    const tid = setTimeout(() => ac.abort(), 20000);
    const res = await fetch(HUDA_BACKEND_URL + '/ai/chat', {
      method:  'POST',
      signal:  ac.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: history
      })
    });
    clearTimeout(tid);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.reply && data.reply.length > 5) {
        return { content: [{ type: 'text', text: data.reply }] };
      }
    }
  } catch(e) { console.warn('[Noor] Backend unreachable:', e.message); }

  return { content: [{ type: 'text', text: '⚠️ خدمة الذكاء الاصطناعي غير متاحة الآن. تأكد من اتصالك بالإنترنت وحاول بعد قليل.' }] };
}


async function adhan2Notif(){
  try{
    if(!('Notification' in window)){
      if(typeof showToast==='function') showToast('المتصفح لا يدعم الإشعارات');
      return;
    }
    var perm = Notification.permission;
    if(perm!=='granted'){
      if(typeof reqNotifV8==='function') await reqNotifV8();
      else perm = await Notification.requestPermission();
    }
    perm = Notification.permission;
    if(perm==='granted'){
      try{ localStorage.setItem('nq_notif_on','1'); }catch(e){}
      try{ localStorage.setItem('adhan_auto','1'); }catch(e){}
      // فعّل مفاتيح الأذان التلقائي في الواجهة إن وُجدت
      try{
        if(typeof toggleAT==='function'){
          var auto=document.getElementById('at-auto');
          if(auto && !auto.classList.contains('on')) toggleAT('auto');
        } else {
          var a=document.getElementById('at-auto'); if(a) a.classList.add('on');
        }
      }catch(e){}
      try{ if(typeof scheduleAllNotifs==='function') scheduleAllNotifs(); }catch(e){}
      if(typeof showToast==='function') showToast('✓ تم تفعيل تنبيهات الأذان');
    } else if(perm==='denied'){
      if(typeof showToast==='function') showToast('الإشعارات مرفوضة — فعّلها من إعدادات المتصفح');
    } else {
      if(typeof showToast==='function') showToast('لم يتم منح إذن الإشعارات');
    }
  }catch(e){
    if(typeof showToast==='function') showToast('تعذّر تفعيل التنبيهات');
  }
  updateAdhan2Notif();
}
function updateAdhan2Notif(){
  const ok = (typeof Notification!=='undefined' && Notification.permission==='granted' && localStorage.getItem('nq_notif_on')!=='0');
  const btn=document.getElementById('adhan2-notif-btn'); if(btn) btn.classList.toggle('on',!!ok);
  const i=document.getElementById('adhan2-notif-icon'); if(i) i.textContent=ok?'🔔':'🔕';
  const t=document.getElementById('adhan2-notif-txt'); if(t) t.textContent=ok?'التنبيهات مفعّلة ✓':'تفعيل التنبيهات';
}

function updateAdhan2Next(){
  const pt=window.prayerTimes||prayerTimes;
  if(!pt||!Object.keys(pt).length){
    var el0=document.getElementById('adhan2-np-name');
    if(el0 && el0.textContent.indexOf('جاري')>=0){
      // حاول حساب المواقيت فورًا
      if(typeof calcPrayers==='function'){ try{ calcPrayers(); }catch(e){} }
    }
    setTimeout(updateAdhan2Next,1500);
    return;
  }
  const PNAMES={fajr:'الفجر 🌙',dhuhr:'الظهر ☀️',asr:'العصر 🌤️',maghrib:'المغرب 🌇',isha:'العشاء 🌃'};
  const now=new Date();
  function d2t(dec){
    if(!dec||isNaN(dec))return null;
    const t=((dec%24)+24)%24,h=Math.floor(t),m=Math.floor((t-h)*60);
    return new Date(now.getFullYear(),now.getMonth(),now.getDate(),h,m,0);
  }
  let nTime=null,nName='',nDate=null;
  ['fajr','dhuhr','asr','maghrib','isha'].forEach(k=>{
    const d=d2t(pt[k]); if(d&&d>now&&(!nTime||d<nTime)){nTime=d;nName=PNAMES[k];nDate=d;}
  });
  const ne=document.getElementById('adhan2-np-name');
  const ce=document.getElementById('adhan2-cdown');
  const te=document.getElementById('adhan2-time');
  if(ne&&nName){
    ne.textContent=nName;
    const diff=nDate-now,h=Math.floor(diff/3600000),m=Math.floor((diff%3600000)/60000),s=Math.floor((diff%60000)/1000);
    if(ce) ce.textContent=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    if(te) te.textContent=nDate.toLocaleTimeString('ar-EG',{hour:'2-digit',minute:'2-digit'});
  }
  setTimeout(updateAdhan2Next,1000);
}

function syncAdhan2Cards(){
  // استعادة المؤذن المختار من localStorage
  document.querySelectorAll('#adhan2-grid .adhan-mc').forEach(function(c,i){
    c.classList.toggle('on', i===_selectedAdhanIdx);
  });
}

function initAdhan2Page(){
  try{ if(typeof calcPrayers==='function') calcPrayers(); }catch(e){}

  _selectedAdhanIdx=parseInt(localStorage.getItem('nq_adhan_idx')||'0');
  var savedVol=parseInt(localStorage.getItem('nq_adhan_vol')||'100');
  var volEl=document.getElementById('adhan2-vol');
  if(volEl)volEl.value=savedVol;
  if(adhanAud)adhanAud.volume=savedVol/100;
  Object.keys(atSettings).forEach(k=>{
    const el=document.getElementById('at-'+k);
    if(el)el.classList.toggle('on',!!atSettings[k]);
  });
  updateAdhan2Notif();
  syncAdhan2Cards();
  updateAdhan2Next();
}

