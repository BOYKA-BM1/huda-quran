/**
 * Huda Al Quran — مكتبة الكتب الإسلامية
 * عرض شبكي · غلاف · قراءة · حفظ أوفلاين داخل التطبيق (IndexedDB)
 */
(function () {
  'use strict';

  var DB_NAME = 'huda_books_db';
  var DB_VER = 1;
  var STORE = 'books';

  var CATALOG = [
    {
      id: 'tasal',
      title: 'أنت تسأل والإسلام يجيب',
      author: 'الشيخ محمد متولي الشعراوي',
      cat: 'عقيدة وفقه',
      color: '#0d3b2e',
      accent: '#c9a84c',
      desc: 'أسئلة شائعة يجيب عنها فضيلة الشيخ الشعراوي بأسلوب واضح.',
      chapters: [
        { t: 'من هو الله؟', b: 'الله هو الخالق الرازق، الواحد الأحد، الذي لا شريك له. قال تعالى: ﴿قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ﴾ [الإخلاص]. والإيمان به أول أركان الإيمان.' },
        { t: 'لماذا خُلق الإنسان؟', b: 'خُلق الإنسان لعبادة الله تعالى. قال عز وجل: ﴿وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ﴾ [الذاريات: 56]. والعبادة تشمل الصلاة والصيام والذكر وحسن الخلق وكل عمل صالح يُبتغى به وجه الله.' },
        { t: 'ما أركان الإسلام؟', b: 'أركان الإسلام خمسة كما في حديث ابن عمر رضي الله عنهما: شهادة أن لا إله إلا الله وأن محمدًا رسول الله، وإقام الصلاة، وإيتاء الزكاة، وصوم رمضان، وحج البيت لمن استطاع إليه سبيلاً. رواه البخاري ومسلم.' },
        { t: 'ما أركان الإيمان؟', b: 'الإيمان بالله وملائكته وكتبه ورسله واليوم الآخر والقدر خيره وشره. قال النبي ﷺ في حديث جبريل: «أن تؤمن بالله وملائكته وكتبه ورسله واليوم الآخر وتؤمن بالقدر خيره وشره». رواه مسلم.' },
        { t: 'هل الإسلام دين سلام؟', b: 'نعم، والإسلام من السلم والسلام. قال تعالى: ﴿يَا أَيُّهَا الَّذِينَ آمَنُوا ادْخُلُوا فِي السِّلْمِ كَافَّةً﴾ [البقرة: 208]. والجهاد مشروع لدفع العدوان وحماية الدين بضوابط شرعية، وليس اعتداءً على الآمنين.' },
        { t: 'لماذا الصلاة خمس مرات؟', b: 'الصلاة عمود الدين، فُرضت خمس صلوات في اليوم والليلة لربط العبد بربه. قال النبي ﷺ: «العهد الذي بيننا وبينهم الصلاة، فمن تركها فقد كفر». رواه الترمذي.' },
        { t: 'ما حكم الحجاب؟', b: 'الحجاب واجب على المسلمة البالغة. قال تعالى: ﴿يَا أَيُّهَا النَّبِيُّ قُل لِّأَزْوَاجِكَ وَبَنَاتِكَ وَنِسَاءِ الْمُؤْمِنِينَ يُدْنِينَ عَلَيْهِنَّ مِن جَلَابِيبِهِنَّ﴾ [الأحزاب: 59].' },
        { t: 'كيف أتوب إلى الله؟', b: 'التوبة النصوح: الإقلاع عن الذنب، والندم عليه، والعزم على عدم العودة، ورد الحقوق إن وُجدت. قال تعالى: ﴿قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ﴾ [الزمر: 53].' }
      ]
    },
    {
      id: 'sharawi',
      title: 'فتاوى الشعراوي',
      author: 'الشيخ محمد متولي الشعراوي',
      cat: 'فتاوى',
      color: '#1a3a5c',
      accent: '#d4a84b',
      desc: 'مختارات من فتاوى وأجوبة الشيخ الشعراوي رحمه الله.',
      chapters: [
        { t: 'عن الإيمان والعمل', b: 'الإيمان ليس كلمة تُقال باللسان فقط، بل هو ما وقر في القلب وصدّقه العمل. من ادّعى الإيمان ولم يعمل بمقتضاه فهو كمن يحمل مصباحًا ولا يضيء به طريقه.' },
        { t: 'عن الرزق', b: 'الرزق مقسوم من عند الله، لكن السعي مطلوب. لا تجلس وتقول: الرزق سيأتيني، بل اعمل وخذ بالأسباب، وقل: يا رب بارك لي فيما رزقتني.' },
        { t: 'عن الابتلاء', b: 'الابتلاء ليس دائمًا عقوبة، فقد يكون رفعًا للدرجات. قال تعالى: ﴿أَحَسِبَ النَّاسُ أَن يُتْرَكُوا أَن يَقُولُوا آمَنَّا وَهُمْ لَا يُفْتَنُونَ﴾. اصبر واحتسب.' },
        { t: 'عن بر الوالدين', b: 'بر الوالدين باب من أبواب الجنة. لا تقل لهما أف، واخفض لهما جناح الذل من الرحمة. رضا الله في رضا الوالدين.' },
        { t: 'عن الصلاة بخشوع', b: 'الخشوع في الصلاة أن تستشعر أنك واقف بين يدي الله. لا تُصلِّ صلاة عادة، بل صلاة من يناجي ربه.' },
        { t: 'عن التوكل', b: 'التوكل لا يلغي العمل. اربط ناقتك وتوكل. من توكل بلا عمل فهو متواكل.' },
        { t: 'عن الذنوب', b: 'لا صغيرة مع الإصرار، ولا كبيرة مع الاستغفار. داوم على الاستغفار.' },
        { t: 'عن الآخرة', b: 'الدنيا مزرعة الآخرة. من زرع خيرًا حصد خيرًا. اجعل آخرتك نصب عينيك في كل قرار.' }
      ]
    },
    {
      id: 'riyadh',
      title: 'رياض الصالحين',
      author: 'الإمام النووي',
      cat: 'حديث',
      color: '#2d5a27',
      accent: '#e8c96a',
      desc: 'مختارات من أبواب الترغيب والأخلاق.',
      chapters: [
        { t: 'باب الإخلاص', b: 'عن عمر بن الخطاب رضي الله عنه قال: سمعت رسول الله ﷺ يقول: «إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى...». متفق عليه.' },
        { t: 'باب التوبة', b: 'عن أبي هريرة رضي الله عنه عن النبي ﷺ قال: «والله إني لأستغفر الله وأتوب إليه في اليوم أكثر من سبعين مرة». رواه البخاري.' },
        { t: 'باب الصبر', b: 'عن أبي سعيد وأبي هريرة رضي الله عنهما عن النبي ﷺ قال: «ما يصيب المسلم من نصب ولا وصب ولا هم ولا حزن ولا أذى ولا غم، حتى الشوكة يشاكها، إلا كفّر الله بها من خطاياه». متفق عليه.' },
        { t: 'باب الصدق', b: 'عن ابن مسعود رضي الله عنه عن النبي ﷺ قال: «إن الصدق يهدي إلى البر، وإن البر يهدي إلى الجنة...». متفق عليه.' },
        { t: 'باب بر الوالدين', b: 'عن عبد الله بن مسعود رضي الله عنه قال: سألت النبي ﷺ: أي العمل أحب إلى الله؟ قال: «الصلاة على وقتها». قلت: ثم أي؟ قال: «بر الوالدين». متفق عليه.' },
        { t: 'باب حق الجار', b: 'عن ابن عمر رضي الله عنهما قال: قال رسول الله ﷺ: «ما زال جبريل يوصيني بالجار حتى ظننت أنه سيورثه». متفق عليه.' },
        { t: 'باب ذكر الله', b: 'عن أبي هريرة رضي الله عنه قال: قال رسول الله ﷺ: «سبق المفردون». قالوا: وما المفردون يا رسول الله؟ قال: «الذاكرون الله كثيرًا والذاكرات». رواه مسلم.' },
        { t: 'باب الاستغفار', b: 'عن الأغرّ المزني رضي الله عنه أن رسول الله ﷺ قال: «إنه ليغان على قلبي، وإني لأستغفر الله في اليوم مائة مرة». رواه مسلم.' }
      ]
    },
    {
      id: 'hisnul',
      title: 'حصن المسلم',
      author: 'سعيد بن علي القحطاني',
      cat: 'أذكار',
      color: '#3d2a1a',
      accent: '#c9a84c',
      desc: 'أذكار الصباح والمساء والنوم والسفر.',
      chapters: [
        { t: 'أذكار الصباح', b: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.\n\nاللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ.\n\nسُبْحَانَ اللَّهِ وَبِحَمْدِهِ (مائة مرة).' },
        { t: 'أذكار المساء', b: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ...\n\nأَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ (ثلاث مرات).\n\nبِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ (ثلاث مرات).' },
        { t: 'أذكار النوم', b: 'يجمع كفيه ثم ينفث فيهما ويقرأ الإخلاص والفلق والناس ثم يمسح ما استطاع من جسده ثلاث مرات.\n\nاللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا.' },
        { t: 'دعاء دخول الخلاء', b: 'بِسْمِ اللَّهِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ.\n\nعند الخروج: غُفْرَانَكَ.' },
        { t: 'أذكار بعد الصلاة', b: 'أَسْتَغْفِرُ اللَّهَ (ثلاثًا)، اللَّهُمَّ أَنْتَ السَّلاَمُ وَمِنْكَ السَّلاَمُ تَبَارَكْتَ يَا ذَا الْجَلاَلِ وَالإِكْرَامِ.\n\nسُبْحَانَ اللَّهِ (33) الْحَمْدُ لِلَّهِ (33) اللَّهُ أَكْبَرُ (33).' },
        { t: 'دعاء السفر', b: 'اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، ﴿سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ ۝ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ﴾.' }
      ]
    },
    {
      id: 'fiqhsunna',
      title: 'فقه السنة',
      author: 'السيد سابق',
      cat: 'فقه',
      color: '#4a1f3d',
      accent: '#e0b85c',
      desc: 'مختارات ميسّرة في الطهارة والصلاة والصيام والزكاة.',
      chapters: [
        { t: 'الطهارة', b: 'الطهارة شرط لصحة الصلاة. وتشمل الوضوء والغسل والتيمم وإزالة النجاسة. قال تعالى: ﴿إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ وَيُحِبُّ الْمُتَطَهِّرِينَ﴾.' },
        { t: 'فرائض الوضوء', b: 'النية، غسل الوجه، غسل اليدين إلى المرفقين، مسح الرأس، غسل الرجلين إلى الكعبين. ويُسن السواك والتسمية.' },
        { t: 'الصلاة', b: 'الصلاة خمس: الفجر ركعتان، الظهر أربع، العصر أربع، المغرب ثلاث، العشاء أربع. وشروطها: الإسلام والعقل والتمييز ودخول الوقت والطهارة وستر العورة واستقبال القبلة والنية.' },
        { t: 'صلاة الجماعة', b: 'صلاة الجماعة أفضل من صلاة الفرد بسبع وعشرين درجة. متفق عليه.' },
        { t: 'الزكاة', b: 'تُخرج من المال إذا بلغ النصاب وحال عليه الحول. المقدار ربع العشر (2.5٪).' },
        { t: 'الصيام', b: 'صوم رمضان ركن. يمسك عن المفطرات من طلوع الفجر إلى غروب الشمس. يُستحب تأخير السحور وتعجيل الفطر.' },
        { t: 'الحج', b: 'واجب مرة في العمر على المستطيع. أركانه عند الجمهور: الإحرام، والوقوف بعرفة، وطواف الإفاضة، والسعي.' }
      ]
    },
    {
      id: 'bulugh',
      title: 'بلوغ المرام',
      author: 'ابن حجر العسقلاني',
      cat: 'حديث',
      color: '#1e3a4c',
      accent: '#c9a84c',
      desc: 'أحاديث أحكام مختارة.',
      chapters: [
        { t: 'من كتاب الطهارة', b: 'عن أبي هريرة رضي الله عنه عن النبي ﷺ قال: «لا يقبل الله صلاة أحدكم إذا أحدث حتى يتوضأ». متفق عليه.' },
        { t: 'من كتاب الصلاة', b: 'عن ابن عمر رضي الله عنهما أن رسول الله ﷺ قال: «صلاة الليل مثنى مثنى، فإذا خشي أحدكم الصبح صلى ركعة واحدة توتر له ما قد صلى». متفق عليه.' },
        { t: 'من كتاب الجنائز', b: 'عن أبي هريرة رضي الله عنه أن النبي ﷺ قال: «أسرعوا بالجنازة، فإن تك صالحة فخير تقدمونها إليه...». متفق عليه.' },
        { t: 'من كتاب الزكاة', b: 'عن ابن عباس رضي الله عنهما في بعث معاذ إلى اليمن: «... تؤخذ من أغنيائهم وتُرد على فقرائهم». متفق عليه.' }
      ]
    },
    {
      id: 'tafsirkatheer',
      title: 'مختصر تفسير ابن كثير',
      author: 'ابن كثير',
      cat: 'تفسير',
      color: '#2a1f4d',
      accent: '#d4af37',
      desc: 'مختارات تفسيرية لسور وآيات جامعة.',
      chapters: [
        { t: 'سورة الفاتحة', b: 'الفاتحة أم القرآن والسبع المثاني. الحمد لله رب العالمين، الرحمن الرحيم، مالك يوم الدين. إياك نعبد وإياك نستعين. اهدنا الصراط المستقيم.' },
        { t: 'آية الكرسي', b: 'أعظم آية في كتاب الله. فيها توحيد الله وصفاته: الحي القيوم، لا تأخذه سنة ولا نوم، له ما في السماوات وما في الأرض.' },
        { t: 'خواتيم البقرة', b: 'آخر آيتين من كنز تحت العرش. فيهما الإيمان والسمع والطاعة ودعاء العفو والمغفرة والنصر.' },
        { t: 'سورة الإخلاص', b: 'تعدل ثلث القرآن. الله الأحد الصمد، لم يلد ولم يولد، ولم يكن له كفوًا أحد.' },
        { t: 'المعوذتان', b: 'الفلق والناس. استعاذة من شر المخلوقات والغاسق والنفاثات والحاسد والوسواس الخناس.' }
      ]
    },
    {
      id: 'quranmiracles',
      title: 'من عجائب القرآن',
      author: 'مختارات إيمانية',
      cat: 'ثقافة إسلامية',
      color: '#0f2e28',
      accent: '#e8c96a',
      desc: 'لمحات في إعجاز القرآن.',
      chapters: [
        { t: 'حفظ القرآن', b: 'قال تعالى: ﴿إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ﴾. حُفظ في الصدور والسطور عبر القرون.' },
        { t: 'التحدي', b: 'تحدّى الله العرب أن يأتوا بسورة من مثله فما استطاعوا. ﴿فَأْتُوا بِسُورَةٍ مِّن مِّثْلِهِ﴾.' },
        { t: 'التشريع المتوازن', b: 'جمع بين الروح والمادة، الفرد والمجتمع، الدنيا والآخرة. حرّم الظلم وأوجب العدل.' },
        { t: 'القصص الحق', b: '﴿لَقَدْ كَانَ فِي قَصَصِهِمْ عِبْرَةٌ لِّأُولِي الْأَلْبَابِ﴾. تُبيّن عاقبة الإيمان وصبر الأنبياء.' }
      ]
    }
  ];

  var db = null;
  var currentBook = null;
  var currentChapter = 0;

  function openDb() {
    return new Promise(function (resolve, reject) {
      if (db) return resolve(db);
      var req = indexedDB.open(DB_NAME, DB_VER);
      req.onupgradeneeded = function (e) {
        var d = e.target.result;
        if (!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE, { keyPath: 'id' });
      };
      req.onsuccess = function (e) { db = e.target.result; resolve(db); };
      req.onerror = function () { reject(req.error); };
    });
  }

  function idbGet(id) {
    return openDb().then(function (d) {
      return new Promise(function (resolve) {
        var r = d.transaction(STORE, 'readonly').objectStore(STORE).get(id);
        r.onsuccess = function () { resolve(r.result || null); };
        r.onerror = function () { resolve(null); };
      });
    });
  }

  function idbPut(book) {
    return openDb().then(function (d) {
      return new Promise(function (resolve, reject) {
        var tx = d.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).put(book);
        tx.oncomplete = function () { resolve(true); };
        tx.onerror = function () { reject(tx.error); };
      });
    });
  }

  function idbDelete(id) {
    return openDb().then(function (d) {
      return new Promise(function (resolve) {
        var tx = d.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).delete(id);
        tx.oncomplete = function () { resolve(true); };
        tx.onerror = function () { resolve(false); };
      });
    });
  }

  function idbAllKeys() {
    return openDb().then(function (d) {
      return new Promise(function (resolve) {
        var r = d.transaction(STORE, 'readonly').objectStore(STORE).getAllKeys();
        r.onsuccess = function () { resolve(r.result || []); };
        r.onerror = function () { resolve([]); };
      });
    });
  }

  function findBook(id) {
    for (var i = 0; i < CATALOG.length; i++) if (CATALOG[i].id === id) return CATALOG[i];
    return null;
  }

  function toastMsg(t) {
    var el = document.getElementById('books-toast');
    if (el) { el.textContent = t; el.classList.add('on'); setTimeout(function () { el.classList.remove('on'); }, 2200); }
    else if (typeof toast === 'function') toast(t);
  }

  function coverHtml(b) {
    return '<div class="bk-cover" style="--bk:' + b.color + ';--ac:' + b.accent + '">' +
      '<div class="bk-cover-orn">☪</div>' +
      '<div class="bk-cover-title">' + b.title + '</div>' +
      '<div class="bk-cover-author">' + b.author + '</div>' +
      '<div class="bk-cover-line"></div>' +
      '</div>';
  }

  async function downloadBook(id) {
    var book = findBook(id);
    if (!book) return;
    var btn = document.querySelector('[data-dl="' + id + '"]');
    if (btn) { btn.disabled = true; btn.textContent = 'جاري الحفظ…'; }
    try {
      await idbPut({
        id: book.id, title: book.title, author: book.author, cat: book.cat,
        color: book.color, accent: book.accent, desc: book.desc,
        chapters: book.chapters, savedAt: Date.now()
      });
      toastMsg('تم الحفظ للقراءة بدون إنترنت');
      renderList();
    } catch (e) {
      if (btn) { btn.disabled = false; btn.textContent = '⬇️ دون إنترنت'; }
      toastMsg('تعذّر الحفظ');
    }
  }

  async function removeDownload(id) {
    await idbDelete(id);
    toastMsg('أُزيل من المحفوظات');
    renderList();
  }

  async function renderList() {
    var el = document.getElementById('books-list');
    if (!el) return;
    var keys = await idbAllKeys();
    var saved = {};
    keys.forEach(function (k) { saved[k] = true; });
    var q = ((document.getElementById('books-search') || {}).value || '').trim();

    el.innerHTML = CATALOG.filter(function (b) {
      if (!q) return true;
      return (b.title + b.author + b.cat + b.desc).indexOf(q) !== -1;
    }).map(function (b) {
      var on = !!saved[b.id];
      return '<article class="bk-card">' +
        coverHtml(b) +
        '<div class="bk-info">' +
        '<h3 class="bk-name">' + b.title + '</h3>' +
        '<div class="bk-author">' + b.author + '</div>' +
        '<div class="bk-cat">' + b.cat + (on ? ' · ✓ محفوظ' : '') + '</div>' +
        '<div class="bk-actions">' +
        '<button type="button" class="bk-btn bk-read" onclick="HudaBooks.open(\'' + b.id + '\')">📖 قراءة</button>' +
        (on
          ? '<button type="button" class="bk-btn bk-dl on" data-dl="' + b.id + '" onclick="HudaBooks.remove(\'' + b.id + '\')">✓ محفوظ</button>'
          : '<button type="button" class="bk-btn bk-dl" data-dl="' + b.id + '" onclick="HudaBooks.download(\'' + b.id + '\')">⬇️ دون إنترنت</button>') +
        '</div></div></article>';
    }).join('') || '<p class="bk-empty">لا نتائج</p>';
  }

  var pages = [];

  function buildPages(book) {
    pages = [];
    var maxLen = 850;
    book.chapters.forEach(function (ch, ci) {
      var paras = String(ch.b || '').replace(/\n\n+/g, '\n\n').trim().split(/\n\n+/);
      var buf = '';
      var part = 1;
      function flush() {
        if (!buf.trim()) return;
        pages.push({
          chapter: ci,
          title: ch.t + (part > 1 ? ' — ' + part : ''),
          body: buf.trim()
        });
        buf = '';
        part++;
      }
      paras.forEach(function (p) {
        if (buf && (buf.length + p.length + 2) > maxLen) flush();
        buf = buf ? (buf + '\n\n' + p) : p;
      });
      flush();
    });
    if (!pages.length) pages.push({ chapter: 0, title: book.title, body: 'لا يوجد محتوى.' });
  }

  async function openBook(id) {
    var book = findBook(id);
    var cached = await idbGet(id);
    if (cached && cached.chapters) book = Object.assign({}, book || {}, cached);
    if (!book) return;
    currentBook = book;
    currentChapter = 0;
    buildPages(book);
    var list = document.getElementById('books-library');
    var reader = document.getElementById('books-reader');
    if (list) list.style.display = 'none';
    if (reader) reader.style.display = 'block';
    try { sessionStorage.setItem('huda_books_reading', id); } catch (e) {}
    try { history.pushState({ hudaBooks: 1, id: id }, '', location.href); } catch (e) {}
    renderPage();
  }

  function backToList(ev) {
    if (ev) {
      try { ev.preventDefault(); ev.stopPropagation(); } catch (e) {}
    }
    var list = document.getElementById('books-library');
    var reader = document.getElementById('books-reader');
    if (reader) reader.style.display = 'none';
    if (list) list.style.display = 'block';
    currentBook = null;
    pages = [];
    try { sessionStorage.removeItem('huda_books_reading'); } catch (e) {}
    // تأكيد البقاء في صفحة الكتب وليس الرئيسية
    var pageBooks = document.getElementById('page-books');
    if (pageBooks) {
      document.querySelectorAll('.pg').forEach(function (el) { el.classList.remove('on'); });
      pageBooks.classList.add('on');
    }
    return false;
  }

  function renderPage() {
    if (!currentBook || !pages.length) return;
    if (currentChapter < 0) currentChapter = 0;
    if (currentChapter >= pages.length) currentChapter = pages.length - 1;
    var pg = pages[currentChapter];
    var title = document.getElementById('bk-reader-title');
    var sub = document.getElementById('bk-reader-sub');
    var body = document.getElementById('bk-reader-body');
    var prog = document.getElementById('bk-reader-prog');
    if (title) title.textContent = currentBook.title;
    if (sub) sub.textContent = pg.title;
    if (body) {
      body.innerHTML =
        '<div class="bk-paper">' +
        '<div class="bk-paper-head">' + pg.title + '</div>' +
        pg.body.split(/\n\n+/).map(function (p) {
          return '<p>' + p.replace(/\n/g, '<br>') + '</p>';
        }).join('') +
        '<div class="bk-paper-num">— ' + (currentChapter + 1) + ' —</div>' +
        '</div>';
      body.scrollTop = 0;
    }
    if (prog) prog.textContent = 'صفحة ' + (currentChapter + 1) + ' من ' + pages.length;
    var prev = document.getElementById('bk-prev');
    var next = document.getElementById('bk-next');
    if (prev) prev.disabled = currentChapter <= 0;
    if (next) next.disabled = currentChapter >= pages.length - 1;
    var toc = document.getElementById('bk-toc');
    if (toc && currentBook.chapters) {
      var seen = {};
      toc.innerHTML = pages.map(function (p, i) {
        if (seen[p.chapter]) return '';
        seen[p.chapter] = true;
        var ct = currentBook.chapters[p.chapter] ? currentBook.chapters[p.chapter].t : p.title;
        return '<button type="button" class="bk-toc-item' +
          (pages[currentChapter].chapter === p.chapter ? ' on' : '') +
          '" onclick="HudaBooks.goto(' + i + ')">' + (p.chapter + 1) + '. ' + ct + '</button>';
      }).join('');
    }
  }

  function goto(i) {
    if (!pages.length || i < 0 || i >= pages.length) return;
    currentChapter = i;
    renderPage();
  }

  function render() {
    renderList();
    backToList();
  }

  window.addEventListener('popstate', function () {
    try {
      if (sessionStorage.getItem('huda_books_reading')) backToList();
    } catch (e) {}
  });

  document.addEventListener('DOMContentLoaded', function () {
    var s = document.getElementById('books-search');
    if (s) s.addEventListener('input', function () { renderList(); });
    var backBtn = document.querySelector('#books-reader .bk-back');
    if (backBtn) {
      backBtn.setAttribute('onclick', 'return HudaBooks.back(event)');
    }
  });

  setTimeout(function () {
    if (typeof window.SP === 'function' && !window.SP.__books) {
      var orig = window.SP;
      window.SP = function (id) {
        var r = orig.apply(this, arguments);
        if (id === 'books') setTimeout(render, 40);
        return r;
      };
      window.SP.__books = true;
    }
  }, 500);

  window.HudaBooks = {
    download: downloadBook,
    remove: removeDownload,
    open: openBook,
    back: backToList,
    next: function () { goto(currentChapter + 1); },
    prev: function () { goto(currentChapter - 1); },
    goto: goto,
    render: render
  };
})();
