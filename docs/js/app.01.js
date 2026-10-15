/* هُدى القرآن — الجزء 1 من 5 (أسطر 1–2052 من الملف الأصلي) */

// ── NoorAuth stub (login removed) ──────────────────────
var NoorAuth = {
  user: null,
  loginGoogle:  function(){},
  loginFacebook: function(){},
  loginEmail:   function(){},
  signupEmail:  function(){},
  forgotPass:   function(){},
  continueGuest: function(){},
  logout:       function(){},
  saveApiKey:   function(){},
  toggleDrop:   function(){},
  setupFirebase: function(){},
  autoSave:     function(){}
};
function authOpenLogin(){}
function authOpenSignup(){}
function authSwitchTab(){}
function _guardAuth(){ return true; } // everyone can participate


(function(){
  var ac=localStorage.getItem('_nq_adclient');
  if(ac){
    var s=document.createElement('script');
    s.async=true;
    s.src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client='+ac;
    s.crossOrigin='anonymous';
    document.head.appendChild(s);
  }
})();



(function(){
  function hideSplash(){
    var s=document.getElementById('splash');
    if(!s)return;
    s.classList.add('hide');
    setTimeout(function(){s.style.display='none';},600);
  }
  setTimeout(hideSplash,2200);
  document.getElementById('splash').addEventListener('click',hideSplash);
})();


// ════════════════════════════════════════════════
// ⚙️ إعدادات الأذان التلقائي
// ════════════════════════════════════════════════
var atSettings = JSON.parse(localStorage.getItem('nq_at') || '{"auto":true,"fajr":true,"vib":true}');
function saveAT(){ try{localStorage.setItem('nq_at',JSON.stringify(atSettings));}catch(e){} }

function toggleAT(key){
  atSettings[key] = !atSettings[key];
  saveAT();
  var el = document.getElementById('at-'+key);
  if(el) el.classList.toggle('on', atSettings[key]);
}

// ════════════════════════════════════════════════
// 🕌 تشغيل الأذان وإدارة المؤذنين
// ════════════════════════════════════════════════
var _adhanPlaying = false;
var _selectedAdhanIdx = parseInt(localStorage.getItem('nq_adhan_idx')||'0');
var ADHAN_KEYS = ['makkah','madinah','misri','turki'];

function selectAdhanSheikh(idx){
  idx = parseInt(idx, 10);
  if (isNaN(idx)) idx = 0;
  if (idx < 0) idx = 0;
  if (idx > 3) idx = 3;
  try {
    if (_adhanPlaying && typeof stopAdhan === 'function') stopAdhan();
  } catch (e) {}
  _selectedAdhanIdx = idx;
  window._selectedAdhanIdx = idx;
  try { if (typeof adhanSheikhIdx !== 'undefined') adhanSheikhIdx = idx; } catch (e) {}
  try { localStorage.setItem('nq_adhan_idx', String(idx)); } catch (e) {}
  // Update UI
  var grid = document.getElementById('adhan2-grid');
  if (grid) {
    var cards = grid.querySelectorAll('.adhan-mc');
    for (var i = 0; i < cards.length; i++) {
      var ci = parseInt(cards[i].getAttribute('data-idx'), 10);
      if (ci === idx) {
        cards[i].classList.add('on');
      } else {
        cards[i].classList.remove('on');
      }
    }
  }
  var names = ['مكة المكرمة', 'المدينة المنورة', 'أذان مصري', 'أذان تركي'];
  if (typeof showToast === 'function') showToast('المؤذن: ' + (names[idx] || ''));
  console.log('[Adhan] selected', idx, names[idx]);
}
window.selectAdhanSheikh = selectAdhanSheikh;

// Multiple binding strategies for adhan cards
function bindAdhanCards() {
  var grid = document.getElementById('adhan2-grid');
  if (!grid) return;
  grid.querySelectorAll('.adhan-mc').forEach(function(card) {
    card.style.cursor = 'pointer';
    card.onclick = function(ev) {
      ev.preventDefault();
      ev.stopPropagation();
      var idx = parseInt(card.getAttribute('data-idx'), 10);
      selectAdhanSheikh(idx);
    };
  });
}
document.addEventListener('DOMContentLoaded', bindAdhanCards);
document.addEventListener('click', function(e) {
  var card = e.target && e.target.closest && e.target.closest('#adhan2-grid .adhan-mc');
  if (card) {
    var idx = parseInt(card.getAttribute('data-idx'), 10);
    if (!isNaN(idx)) selectAdhanSheikh(idx);
  }
});
// Re-bind when prayer page is shown
var _origSP = null;
setTimeout(function() {
  if (typeof SP === 'function' && !_origSP) {
    _origSP = SP;
    window.SP = function(id) {
      _origSP(id);
      if (id === 'prayer' || id === 'adhan') setTimeout(bindAdhanCards, 100);
    };
  }
  bindAdhanCards();
}, 500);

function adhan2PlayToggle(){
  if(_adhanPlaying){
    stopAdhan();
    _adhanPlaying = false;
    var icon = document.getElementById('adhan2-play-icon');
    var txt  = document.getElementById('adhan2-play-txt');
    if(icon) icon.textContent = '🔊';
    if(txt)  txt.textContent  = 'تشغيل الأذان الآن';
    var now2 = document.getElementById('adhan2-now');
    if(now2) now2.style.display = 'none';
  } else {
    var key = ADHAN_KEYS[_selectedAdhanIdx] || 'makkah';
    var urls = (typeof ADHAN_URLS !== 'undefined' && ADHAN_URLS[key]) ? [...ADHAN_URLS[key]] : [];
    if(!adhanAud) adhanAud = new Audio();
    adhanAud.pause();
    function tryNext(){
      if(!urls.length){ alert('تعذّر تشغيل الأذان — تحقق من الإنترنت'); return; }
      adhanAud.src = urls.shift();
      adhanAud.volume = 1.0;
      adhanAud.play().catch(function(){ tryNext(); });
    }
    tryNext();
    _adhanPlaying = true;
    var icon = document.getElementById('adhan2-play-icon');
    var txt  = document.getElementById('adhan2-play-txt');
    if(icon) icon.textContent = '⏹';
    if(txt)  txt.textContent  = 'إيقاف الأذان';
    var now2 = document.getElementById('adhan2-now');
    if(now2) now2.style.display = 'flex';
    adhanAud.onended = function(){
      _adhanPlaying = false;
      if(icon) icon.textContent = '🔊';
      if(txt)  txt.textContent  = 'تشغيل الأذان الآن';
      if(now2) now2.style.display = 'none';
    };
  }
}

// ════════════════════════════════════════════════
// 🤖 الذكاء الاصطناعي — هُدى القرآن
// ════════════════════════════════════════════════
var _aiHistory = [];
var _aiTyping = false;

function _aiAddMsg(role, text){
  var wrap = document.getElementById('ai-msgs-wrap');
  if(!wrap) return;
  var div = document.createElement('div');
  if(role === 'user'){
    div.className = 'ai-msg ai-msg-user';
    div.innerHTML = '<div class="ai-bubble-user">' + text.replace(/</g,'&lt;').replace(/\n/g,'<br>') + '</div>';
  } else {
    div.className = 'ai-msg ai-msg-bot';
    // Format: bold **text**, code blocks, newlines
    var formatted = text
      .replace(/</g,'&lt;')
      .replace(/\*\*(.*?)\*\*/g,'<b>$1</b>')
      .replace(/`([^`]+)`/g,'<code style="background:rgba(201,168,76,.15);padding:.1em .3em;border-radius:4px;font-family:monospace">$1</code>')
      .replace(/\n/g,'<br>');
    div.innerHTML = '<div class="ai-avatar-bot">🌙</div><div class="ai-bubble-bot">' + formatted + '</div>';
  }
  wrap.appendChild(div);
  div.scrollIntoView({behavior:'smooth', block:'end'});
}

function _aiSetLoading(on){
  var btn  = document.getElementById('ai-input-btn');
  var icon = document.getElementById('ai-send-icon');
  var spin = document.getElementById('ai-send-spin');
  _aiTyping = on;
  if(btn)  btn.disabled = on;
  if(icon) icon.style.display = on ? 'none' : 'inline';
  if(spin) spin.style.display = on ? 'inline-block' : 'none';
  // Show typing indicator
  var wrap = document.getElementById('ai-msgs-wrap');
  var typing = document.getElementById('ai-typing-indicator');
  if(on && wrap && !typing){
    var td = document.createElement('div');
    td.id = 'ai-typing-indicator';
    td.className = 'ai-msg ai-msg-bot';
    td.innerHTML = '<div class="ai-avatar-bot">🌙</div><div class="ai-bubble-bot" style="color:var(--tm)">جارٍ الكتابة...</div>';
    wrap.appendChild(td);
    td.scrollIntoView({behavior:'smooth',block:'end'});
  } else if(!on && typing){
    typing.remove();
  }
}

async function aiSend(){
  if(_aiTyping) return;
  var inp = document.getElementById('ai-input');
  if(!inp) return;
  var q = inp.value.trim();
  if(!q) return;
  inp.value = '';
  // Hide suggestions
  var sugg = document.getElementById('ai-sugg');
  if(sugg) sugg.style.display = 'none';
  // Add user message
  _aiAddMsg('user', q);
  _aiHistory.push({role:'user', content:q});
  _aiSetLoading(true);
  try{
    var result = await callClaudeAPI({messages: _aiHistory});
    var answer = (result && result.content && result.content[0]) ? result.content[0].text : 'عذراً، لم أتمكن من الإجابة.';
    _aiAddMsg('bot', answer);
    _aiHistory.push({role:'assistant', content:answer});
    // Keep history max 20 messages
    if(_aiHistory.length > 20) _aiHistory = _aiHistory.slice(-20);
  }catch(e){
    _aiAddMsg('bot', '⚠️ حدث خطأ: ' + (e.message||'تعذّر الاتصال') + '\n\nتأكد من الإنترنت وحاول مجدداً.');
  }
  _aiSetLoading(false);
}

function aiAsk(q){
  var inp = document.getElementById('ai-input');
  if(inp){ inp.value = q; }
  aiSend();
}



// ══ AdSense / Monetization System ══
// لتفعيل الإعلانات: ضع الكود من Google AdSense في الدالة دي
var _adsEnabled = false; // الإعلانات معطّلة نهائياً
var _adClientId = '';

function renderAdBanner(containerId){
  if(!_adsEnabled || !_adClientId) return;
  var el = document.getElementById(containerId);
  if(!el) return;
  el.innerHTML = `<ins class="adsbygoogle" style="display:block;text-align:center" data-ad-client="${_adClientId}" data-ad-format="auto" data-full-width-responsive="true"></ins>`;
  try{ (window.adsbygoogle = window.adsbygoogle || []).push({}); }catch(e){}
}

// استدعي renderAdBanner('ad-banner-1') في أي صفحة


// ══ Share App ══
// ── Share modal helpers ──────────────────────────────────
var _shareAyahData = {text:'', surah:'', num:''};

function openShareVerse(text, surahName, ayahNum){
  _shareAyahData = {text:text||'', surah:surahName||'', num:ayahNum||''};
  // fill preview
  var at=document.getElementById('share-ayah-txt');
  var rt=document.getElementById('share-ref-txt');
  if(at) at.textContent = text||'';
  if(rt) rt.textContent = 'سورة '+(surahName||'')+' — الآية '+(ayahNum||'');
  var modal=document.getElementById('share-modal');
  if(modal) modal.style.display='flex';
}

function closeShareVerse(){
  var modal=document.getElementById('share-modal');
  if(modal) modal.style.display='none';
}

function shareAsImage(){
  shareAyahAsImage(_shareAyahData.text, _shareAyahData.surah, _shareAyahData.num);
}

function shareAsText(){
  var text = _shareAyahData.text + '\n﴿ سورة '+_shareAyahData.surah+' — الآية '+_shareAyahData.num+' ﴾\n\nهُدى القرآن';
  if(navigator.clipboard){
    navigator.clipboard.writeText(text).then(function(){ if(typeof showToast==='function') showToast('✅ تم نسخ الآية'); });
  }
}

function shareNative(){
  var text = _shareAyahData.text + '\n﴿ سورة '+_shareAyahData.surah+' — الآية '+_shareAyahData.num+' ﴾';
  if(navigator.share){
    navigator.share({title:'هُدى القرآن', text:text}).catch(function(){});
  } else {
    shareAsText();
  }
}

// Alias for tafsir popup share button
function _shareCurrentAyah(){
  var ayahEl = document.getElementById('tafsir-ayah-text');
  var titleEl = document.getElementById('tafsir-title');
  var text = ayahEl ? ayahEl.textContent : '';
  var ref  = titleEl ? titleEl.textContent : '';
  shareAyahAsImage(text, ref, '');
}

function shareApp(){
  const url = window.location.href.split('#')[0].split('?')[0];
  const text = 'تطبيق هُدى القرآن — القرآن والأذكار ومواقيت الصلاة والذكاء الاصطناعي الإسلامي';
  if(navigator.share){
    navigator.share({title:'هُدى القرآن',text:text,url:url}).catch(()=>{});
  } else {
    navigator.clipboard.writeText(url).then(()=>{
      showToast('تم نسخ الرابط ✓');
    }).catch(()=>{ alert(url); });
  }
}

function showToast(msg){
  var t=document.getElementById('nq-toast');
  if(!t){
    t=document.createElement('div');
    t.id='nq-toast';
    t.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--gold);color:#000;padding:.5rem 1.2rem;border-radius:20px;font-size:.85rem;z-index:9999;transition:opacity .3s';
    document.body.appendChild(t);
  }
  t.textContent=msg;
  t.style.opacity='1';
  clearTimeout(t._timer);
  t._timer=setTimeout(()=>{t.style.opacity='0';},2500);
}


// ══ PWA Install: انقل إلى js/pwa.js (مكان واحد فقط) ══


// ══ Keyboard Shortcuts ══
document.addEventListener('keydown', function(e){
  if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return;
  if(e.key==='ArrowRight'||e.key==='ArrowLeft'){
    if(currentSurahN){
      const dir = e.key==='ArrowLeft'?1:-1;
      const next = currentSurahN + dir;
      if(next>=1&&next<=114) loadSurah(next);
    }
  }
  // (Space يمرّر الصفحة كالمعتاد — لا يُستخدم للتشغيل)
  if(e.key==='Escape') {
    if(typeof stopPlay==='function') stopPlay();
  }
});

// ══ Online/Offline indicator ══
window.addEventListener('online', function(){ showToast('✅ عاد الاتصال بالإنترنت'); });
window.addEventListener('offline', function(){ showToast('⚠️ لا يوجد إنترنت — بعض الميزات قد لا تعمل'); });




// ══ Backend Config ══
// ✅ غيّر هذا الرابط لرابط السيرفر الحقيقي عند النشر
var HUDA_BACKEND_URL = (window.HUDA_CONFIG && window.HUDA_CONFIG.backendUrl) || 'http://localhost:3000/api';

// ══ API Key Manager (للمستخدمين الذين يريدون مفتاحهم الخاص) ══
// (تم حذف نظام مفتاح Groq من الواجهة — المفتاح يعيش على السيرفر فقط)

// ════════════════════════════════════════════════
// SURAHS META
// ════════════════════════════════════════════════
const SM=[
{n:1,ar:"الفاتحة",en:"Al-Fatihah",ay:7,tp:"مكية",pg:1},
{n:2,ar:"البقرة",en:"Al-Baqarah",ay:286,tp:"مدنية",pg:2},
{n:3,ar:"آل عمران",en:"Aal-Imran",ay:200,tp:"مدنية",pg:50},
{n:4,ar:"النساء",en:"An-Nisa",ay:176,tp:"مدنية",pg:77},
{n:5,ar:"المائدة",en:"Al-Maidah",ay:120,tp:"مدنية",pg:106},
{n:6,ar:"الأنعام",en:"Al-An'am",ay:165,tp:"مكية",pg:128},
{n:7,ar:"الأعراف",en:"Al-A'raf",ay:206,tp:"مكية",pg:151},
{n:8,ar:"الأنفال",en:"Al-Anfal",ay:75,tp:"مدنية",pg:177},
{n:9,ar:"التوبة",en:"At-Tawbah",ay:129,tp:"مدنية",pg:187},
{n:10,ar:"يونس",en:"Yunus",ay:109,tp:"مكية",pg:208},
{n:11,ar:"هود",en:"Hud",ay:123,tp:"مكية",pg:221},
{n:12,ar:"يوسف",en:"Yusuf",ay:111,tp:"مكية",pg:235},
{n:13,ar:"الرعد",en:"Ar-Ra'd",ay:43,tp:"مدنية",pg:249},
{n:14,ar:"إبراهيم",en:"Ibrahim",ay:52,tp:"مكية",pg:255},
{n:15,ar:"الحجر",en:"Al-Hijr",ay:99,tp:"مكية",pg:262},
{n:16,ar:"النحل",en:"An-Nahl",ay:128,tp:"مكية",pg:267},
{n:17,ar:"الإسراء",en:"Al-Isra",ay:111,tp:"مكية",pg:282},
{n:18,ar:"الكهف",en:"Al-Kahf",ay:110,tp:"مكية",pg:293},
{n:19,ar:"مريم",en:"Maryam",ay:98,tp:"مكية",pg:305},
{n:20,ar:"طه",en:"Ta-Ha",ay:135,tp:"مكية",pg:312},
{n:21,ar:"الأنبياء",en:"Al-Anbiya",ay:112,tp:"مكية",pg:322},
{n:22,ar:"الحج",en:"Al-Hajj",ay:78,tp:"مدنية",pg:332},
{n:23,ar:"المؤمنون",en:"Al-Mu'minun",ay:118,tp:"مكية",pg:342},
{n:24,ar:"النور",en:"An-Nur",ay:64,tp:"مدنية",pg:350},
{n:25,ar:"الفرقان",en:"Al-Furqan",ay:77,tp:"مكية",pg:359},
{n:26,ar:"الشعراء",en:"Ash-Shu'ara",ay:227,tp:"مكية",pg:367},
{n:27,ar:"النمل",en:"An-Naml",ay:93,tp:"مكية",pg:377},
{n:28,ar:"القصص",en:"Al-Qasas",ay:88,tp:"مكية",pg:385},
{n:29,ar:"العنكبوت",en:"Al-Ankabut",ay:69,tp:"مكية",pg:396},
{n:30,ar:"الروم",en:"Ar-Rum",ay:60,tp:"مكية",pg:404},
{n:31,ar:"لقمان",en:"Luqman",ay:34,tp:"مكية",pg:411},
{n:32,ar:"السجدة",en:"As-Sajdah",ay:30,tp:"مكية",pg:415},
{n:33,ar:"الأحزاب",en:"Al-Ahzab",ay:73,tp:"مدنية",pg:418},
{n:34,ar:"سبأ",en:"Saba",ay:54,tp:"مكية",pg:428},
{n:35,ar:"فاطر",en:"Fatir",ay:45,tp:"مكية",pg:434},
{n:36,ar:"يس",en:"Ya-Sin",ay:83,tp:"مكية",pg:440},
{n:37,ar:"الصافات",en:"As-Saffat",ay:182,tp:"مكية",pg:446},
{n:38,ar:"ص",en:"Sad",ay:88,tp:"مكية",pg:453},
{n:39,ar:"الزمر",en:"Az-Zumar",ay:75,tp:"مكية",pg:458},
{n:40,ar:"غافر",en:"Ghafir",ay:85,tp:"مكية",pg:467},
{n:41,ar:"فصلت",en:"Fussilat",ay:54,tp:"مكية",pg:477},
{n:42,ar:"الشورى",en:"Ash-Shura",ay:53,tp:"مكية",pg:483},
{n:43,ar:"الزخرف",en:"Az-Zukhruf",ay:89,tp:"مكية",pg:489},
{n:44,ar:"الدخان",en:"Ad-Dukhan",ay:59,tp:"مكية",pg:496},
{n:45,ar:"الجاثية",en:"Al-Jathiyah",ay:37,tp:"مكية",pg:499},
{n:46,ar:"الأحقاف",en:"Al-Ahqaf",ay:35,tp:"مكية",pg:502},
{n:47,ar:"محمد",en:"Muhammad",ay:38,tp:"مدنية",pg:507},
{n:48,ar:"الفتح",en:"Al-Fath",ay:29,tp:"مدنية",pg:511},
{n:49,ar:"الحجرات",en:"Al-Hujurat",ay:18,tp:"مدنية",pg:515},
{n:50,ar:"ق",en:"Qaf",ay:45,tp:"مكية",pg:518},
{n:51,ar:"الذاريات",en:"Adh-Dhariyat",ay:60,tp:"مكية",pg:520},
{n:52,ar:"الطور",en:"At-Tur",ay:49,tp:"مكية",pg:523},
{n:53,ar:"النجم",en:"An-Najm",ay:62,tp:"مكية",pg:526},
{n:54,ar:"القمر",en:"Al-Qamar",ay:55,tp:"مكية",pg:528},
{n:55,ar:"الرحمن",en:"Ar-Rahman",ay:78,tp:"مدنية",pg:531},
{n:56,ar:"الواقعة",en:"Al-Waqi'ah",ay:96,tp:"مكية",pg:534},
{n:57,ar:"الحديد",en:"Al-Hadid",ay:29,tp:"مدنية",pg:537},
{n:58,ar:"المجادلة",en:"Al-Mujadila",ay:22,tp:"مدنية",pg:542},
{n:59,ar:"الحشر",en:"Al-Hashr",ay:24,tp:"مدنية",pg:545},
{n:60,ar:"الممتحنة",en:"Al-Mumtahanah",ay:13,tp:"مدنية",pg:549},
{n:61,ar:"الصف",en:"As-Saf",ay:14,tp:"مدنية",pg:551},
{n:62,ar:"الجمعة",en:"Al-Jumu'ah",ay:11,tp:"مدنية",pg:553},
{n:63,ar:"المنافقون",en:"Al-Munafiqun",ay:11,tp:"مدنية",pg:554},
{n:64,ar:"التغابن",en:"At-Taghabun",ay:18,tp:"مدنية",pg:556},
{n:65,ar:"الطلاق",en:"At-Talaq",ay:12,tp:"مدنية",pg:558},
{n:66,ar:"التحريم",en:"At-Tahrim",ay:12,tp:"مدنية",pg:560},
{n:67,ar:"الملك",en:"Al-Mulk",ay:30,tp:"مكية",pg:562},
{n:68,ar:"القلم",en:"Al-Qalam",ay:52,tp:"مكية",pg:564},
{n:69,ar:"الحاقة",en:"Al-Haqqah",ay:52,tp:"مكية",pg:566},
{n:70,ar:"المعارج",en:"Al-Ma'arij",ay:44,tp:"مكية",pg:568},
{n:71,ar:"نوح",en:"Nuh",ay:28,tp:"مكية",pg:570},
{n:72,ar:"الجن",en:"Al-Jinn",ay:28,tp:"مكية",pg:572},
{n:73,ar:"المزمل",en:"Al-Muzzammil",ay:20,tp:"مكية",pg:574},
{n:74,ar:"المدثر",en:"Al-Muddaththir",ay:56,tp:"مكية",pg:575},
{n:75,ar:"القيامة",en:"Al-Qiyamah",ay:40,tp:"مكية",pg:577},
{n:76,ar:"الإنسان",en:"Al-Insan",ay:31,tp:"مدنية",pg:578},
{n:77,ar:"المرسلات",en:"Al-Mursalat",ay:50,tp:"مكية",pg:580},
{n:78,ar:"النبأ",en:"An-Naba",ay:40,tp:"مكية",pg:582},
{n:79,ar:"النازعات",en:"An-Nazi'at",ay:46,tp:"مكية",pg:583},
{n:80,ar:"عبس",en:"Abasa",ay:42,tp:"مكية",pg:585},
{n:81,ar:"التكوير",en:"At-Takwir",ay:29,tp:"مكية",pg:586},
{n:82,ar:"الانفطار",en:"Al-Infitar",ay:19,tp:"مكية",pg:587},
{n:83,ar:"المطففين",en:"Al-Mutaffifin",ay:36,tp:"مكية",pg:587},
{n:84,ar:"الانشقاق",en:"Al-Inshiqaq",ay:25,tp:"مكية",pg:589},
{n:85,ar:"البروج",en:"Al-Buruj",ay:22,tp:"مكية",pg:590},
{n:86,ar:"الطارق",en:"At-Tariq",ay:17,tp:"مكية",pg:591},
{n:87,ar:"الأعلى",en:"Al-A'la",ay:19,tp:"مكية",pg:591},
{n:88,ar:"الغاشية",en:"Al-Ghashiyah",ay:26,tp:"مكية",pg:592},
{n:89,ar:"الفجر",en:"Al-Fajr",ay:30,tp:"مكية",pg:593},
{n:90,ar:"البلد",en:"Al-Balad",ay:20,tp:"مكية",pg:594},
{n:91,ar:"الشمس",en:"Ash-Shams",ay:15,tp:"مكية",pg:595},
{n:92,ar:"الليل",en:"Al-Layl",ay:21,tp:"مكية",pg:595},
{n:93,ar:"الضحى",en:"Ad-Duha",ay:11,tp:"مكية",pg:596},
{n:94,ar:"الشرح",en:"Ash-Sharh",ay:8,tp:"مكية",pg:596},
{n:95,ar:"التين",en:"At-Tin",ay:8,tp:"مكية",pg:597},
{n:96,ar:"العلق",en:"Al-Alaq",ay:19,tp:"مكية",pg:597},
{n:97,ar:"القدر",en:"Al-Qadr",ay:5,tp:"مكية",pg:598},
{n:98,ar:"البينة",en:"Al-Bayyinah",ay:8,tp:"مدنية",pg:598},
{n:99,ar:"الزلزلة",en:"Az-Zalzalah",ay:8,tp:"مدنية",pg:599},
{n:100,ar:"العاديات",en:"Al-Adiyat",ay:11,tp:"مكية",pg:599},
{n:101,ar:"القارعة",en:"Al-Qari'ah",ay:11,tp:"مكية",pg:600},
{n:102,ar:"التكاثر",en:"At-Takathur",ay:8,tp:"مكية",pg:600},
{n:103,ar:"العصر",en:"Al-Asr",ay:3,tp:"مكية",pg:601},
{n:104,ar:"الهمزة",en:"Al-Humazah",ay:9,tp:"مكية",pg:601},
{n:105,ar:"الفيل",en:"Al-Fil",ay:5,tp:"مكية",pg:601},
{n:106,ar:"قريش",en:"Quraysh",ay:4,tp:"مكية",pg:602},
{n:107,ar:"الماعون",en:"Al-Ma'un",ay:7,tp:"مكية",pg:602},
{n:108,ar:"الكوثر",en:"Al-Kawthar",ay:3,tp:"مكية",pg:602},
{n:109,ar:"الكافرون",en:"Al-Kafirun",ay:6,tp:"مكية",pg:603},
{n:110,ar:"النصر",en:"An-Nasr",ay:3,tp:"مدنية",pg:603},
{n:111,ar:"المسد",en:"Al-Masad",ay:5,tp:"مكية",pg:603},
{n:112,ar:"الإخلاص",en:"Al-Ikhlas",ay:4,tp:"مكية",pg:604},
{n:113,ar:"الفلق",en:"Al-Falaq",ay:5,tp:"مكية",pg:604},
{n:114,ar:"الناس",en:"An-Nas",ay:6,tp:"مكية",pg:604}
];

// ════════════════════════════════════════════════
// RECITERS DATA — mp3quran.net full-surah audio
// ════════════════════════════════════════════════
window.setPlayerLabel = function(name, surahLabel, ayahLabel) {
  try {
    var n = document.getElementById('gpname'); if (n && name) n.textContent = name;
    var s = document.getElementById('gpsurah'); if (s && surahLabel) s.textContent = surahLabel;
    var a = document.getElementById('gpayah'); if (a && ayahLabel != null) a.textContent = ayahLabel;
    var dn = document.getElementById('dk-rn'); if (dn && name) dn.textContent = name;
    var ds = document.getElementById('dk-s'); if (ds && surahLabel) ds.textContent = surahLabel;
    var da = document.getElementById('dk-a'); if (da && ayahLabel != null) da.textContent = ayahLabel;
  } catch (e) {}
};
const RD = [
  {id:'alafasy', name:'مشاري راشد العفاسي', en:'', country:'🇰🇼', style:'مرتل', ini:'م ع', base:'https://server8.mp3quran.net/afs/', bg:'linear-gradient(135deg,#1a2a3a,#0d1520)', cl:'#C9A84C', bio:'', img:'', aw:''},
  {id:'dosary', name:'ياسر الدوسري', en:'', country:'🇸🇦', style:'إمام الحرم', ini:'ي د', base:'https://server11.mp3quran.net/yasser/', bg:'linear-gradient(135deg,#1a2a3a,#0d1520)', cl:'#C9A84C', bio:'', img:'', aw:''},
  {id:'sds', name:'عبد الرحمن السديس', en:'', country:'🇸🇦', style:'إمام الحرم', ini:'ع س', base:'https://server11.mp3quran.net/sds/', bg:'linear-gradient(135deg,#1a2a3a,#0d1520)', cl:'#C9A84C', bio:'', img:'', aw:''},
  {id:'shur', name:'سعود الشريم', en:'', country:'🇸🇦', style:'إمام الحرم', ini:'س ش', base:'https://server12.mp3quran.net/shur/', bg:'linear-gradient(135deg,#1a2a3a,#0d1520)', cl:'#C9A84C', bio:'', img:'', aw:''},
  {id:'basit', name:'عبد الباسط عبد الصمد', en:'', country:'🇪🇬', style:'مجوّد', ini:'ع ب', base:'https://server7.mp3quran.net/basit/', bg:'linear-gradient(135deg,#1a2a3a,#0d1520)', cl:'#C9A84C', bio:'', img:'', aw:''},
  {id:'hsry', name:'محمود خليل الحصري', en:'', country:'🇪🇬', style:'مرتل', ini:'م ح', base:'https://server13.mp3quran.net/husr/', bg:'linear-gradient(135deg,#1a2a3a,#0d1520)', cl:'#C9A84C', bio:'', img:'', aw:''},
  {id:'minsh', name:'محمد صديق المنشاوي', en:'', country:'🇪🇬', style:'مرتل', ini:'م م', base:'https://server10.mp3quran.net/minsh/', bg:'linear-gradient(135deg,#1a2a3a,#0d1520)', cl:'#C9A84C', bio:'', img:'', aw:''},
  {id:'jbrl', name:'محمد جبريل', en:'', country:'🇪🇬', style:'مرتل', ini:'م ج', base:'https://server8.mp3quran.net/jbrl/', bg:'linear-gradient(135deg,#1a2a3a,#0d1520)', cl:'#C9A84C', bio:'', img:'', aw:''},
  {id:'shatri', name:'أبو بكر الشاطري', en:'', country:'🇸🇦', style:'مرتل', ini:'أ ش', base:'https://server11.mp3quran.net/shatri/', bg:'linear-gradient(135deg,#1a2a3a,#0d1520)', cl:'#C9A84C', bio:'', img:'', aw:''},
  {id:'maher', name:'ماهر المعيقلي', en:'', country:'🇸🇦', style:'إمام الحرم', ini:'م م', base:'https://server12.mp3quran.net/maher/', bg:'linear-gradient(135deg,#1a2a3a,#0d1520)', cl:'#C9A84C', bio:'', img:'', aw:''},
  {id:'bsfr', name:'عبد الله بصفر', en:'', country:'🇸🇦', style:'مرتل', ini:'ع ب', base:'https://server6.mp3quran.net/basfar/', bg:'linear-gradient(135deg,#1a2a3a,#0d1520)', cl:'#C9A84C', bio:'', img:'', aw:''},
  {id:'rifai', name:'هاني الرفاعي', en:'', country:'🇸🇦', style:'مرتل', ini:'ه ر', base:'https://cdn.mp3quran.net/audio/hani-rifai/r1/', bg:'linear-gradient(135deg,#1a2a3a,#0d1520)', cl:'#C9A84C', bio:'', img:'', aw:''},
  {id:'akhdar', name:'إبراهيم الأخضر', en:'', country:'🇸🇦', style:'مرتل', ini:'إ أ', base:'https://cdn.mp3quran.net/audio/ibrahim-akhdar/r1/', bg:'linear-gradient(135deg,#1a2a3a,#0d1520)', cl:'#C9A84C', bio:'', img:'', aw:''},
  {id:'ayyoub', name:'محمد أيوب', en:'', country:'🇸🇦', style:'إمام النبوي', ini:'م أ', base:'https://cdn.mp3quran.net/audio/muhammad-ayyub/r1/', bg:'linear-gradient(135deg,#1a2a3a,#0d1520)', cl:'#C9A84C', bio:'', img:'', aw:''},
  {id:'jhn', name:'عبد الله الجهني', en:'', country:'🇸🇦', style:'مرتل', ini:'ع ج', base:'https://cdn.mp3quran.net/audio/abdullah-juhani/r1/', bg:'linear-gradient(135deg,#1a2a3a,#0d1520)', cl:'#C9A84C', bio:'', img:'', aw:''},
  {id:'sobhi', name:'إسلام صبحي', en:'', country:'🇪🇬', style:'عذب', ini:'إ ص', base:'https://server14.mp3quran.net/islam/', bg:'linear-gradient(135deg,#1a2a3a,#0d1520)', cl:'#C9A84C', bio:'', img:'', aw:''},
  {id:'hazza', name:'هزاع البلوشي', en:'', country:'🇴🇲', style:'مرتل', ini:'ه ب', base:'https://server8.mp3quran.net/hazza/', bg:'linear-gradient(135deg,#1a2a3a,#0d1520)', cl:'#C9A84C', bio:'', img:'', aw:''},
  {id:'idrees', name:'إدريس أبكر', en:'', country:'🇸🇩', style:'مرتل', ini:'إ أ', base:'https://cdn.mp3quran.net/audio/idrees-abkar/r1/', bg:'linear-gradient(135deg,#1a2a3a,#0d1520)', cl:'#C9A84C', bio:'', img:'', aw:''},
  {id:'lhdan', name:'محمد اللحيدان', en:'', country:'🇸🇦', style:'مرتل', ini:'م ل', base:'https://cdn.mp3quran.net/audio/muhammad-luhaidan/r1/', bg:'linear-gradient(135deg,#1a2a3a,#0d1520)', cl:'#C9A84C', bio:'', img:'', aw:''},
  {id:'hudhaify', name:'علي الحذيفي', en:'', country:'🇸🇦', style:'إمام النبوي', ini:'ع ح', base:'https://server9.mp3quran.net/hthfi/', bg:'linear-gradient(135deg,#1a2a3a,#0d1520)', cl:'#C9A84C', bio:'', img:'', aw:''},
  {id:'ajamy', name:'أحمد العجمي', en:'', country:'🇸🇦', style:'مرتل', ini:'أ ع', base:'https://cdn.mp3quran.net/audio/ahmad-ajmi/r1/', bg:'linear-gradient(135deg,#1a2a3a,#0d1520)', cl:'#C9A84C', bio:'', img:'', aw:''},
  {id:'tablawy', name:'محمد الطبلاوي', en:'', country:'🇪🇬', style:'مرتل', ini:'م ط', base:'https://cdn.mp3quran.net/audio/muhammad-tablawi/r1/', bg:'linear-gradient(135deg,#1a2a3a,#0d1520)', cl:'#C9A84C', bio:'', img:'', aw:''},
  {id:'ghamdi', name:'سعد الغامدي', en:'', country:'🇸🇦', style:'مرتل', ini:'س غ', base:'https://server7.mp3quran.net/s_gmd/', bg:'linear-gradient(135deg,#1a2a3a,#0d1520)', cl:'#C9A84C', bio:'', img:'', aw:''},
];

const PD=[
{ar:"آدم",en:"Adam عليه السلام",brief:"أبو البشر وأول الأنبياء، خُلق من طين ونُفخت فيه الروح.",tag:"أبو البشر",
info:{لقبه:"أبو البشر",قومه:"لم يُرسَل لقوم بل هو أصل البشرية",الكتاب:"لا كتاب خاص به",الزوجة:"حواء عليها السلام",الأبناء:"قابيل وهابيل وشيث وغيرهم"},
story:`<div class="pmod-section"><h4>🌿 الخلق والتكريم</h4>
<p>خلق الله آدم عليه السلام بيديه من طين الأرض، ونفخ فيه من روحه، فكان أول إنسان على وجه الأرض. أمر الله الملائكة بالسجود له تكريماً وتعظيماً لهذا المخلوق الجديد.</p>
<div class="qref">﴿ وَإِذْ قَالَ رَبُّكَ لِلْمَلَائِكَةِ إِنِّي خَالِقٌ بَشَرًا مِّن صَلْصَالٍ مِّنْ حَمَإٍ مَّسْنُونٍ ﴾ — الحجر: ٢٨</div>
<div class="qref">﴿ وَعَلَّمَ آدَمَ الْأَسْمَاءَ كُلَّهَا ﴾ — البقرة: ٣١</div></div>
<div class="pmod-section"><h4>😈 إبليس وعداوته</h4>
<p>رفض إبليس السجود لآدم تكبراً وقال: "أنا خير منه، خلقتني من نار وخلقته من طين." فلعنه الله وطرده من الجنة، وأعلن إبليس عداوته لآدم وذريته إلى يوم القيامة.</p>
<div class="qref">﴿ قَالَ مَا مَنَعَكَ أَلَّا تَسْجُدَ إِذْ أَمَرْتُكَ ۖ قَالَ أَنَا خَيْرٌ مِّنْهُ خَلَقْتَنِي مِن نَّارٍ وَخَلَقْتَهُ مِن طِينٍ ﴾ — الأعراف: ١٢</div></div>
<div class="pmod-section"><h4>🍎 الابتلاء والهبوط</h4>
<p>أسكن الله آدم وزوجته حواء الجنة وأباح لهما كل شيء إلا شجرة واحدة. وسوس إليهما إبليس حتى أكلا منها فهبطا إلى الأرض. لكن آدم تاب وأناب فتاب الله عليه.</p>
<div class="qref">﴿ فَتَلَقَّى آدَمُ مِن رَّبِّهِ كَلِمَاتٍ فَتَابَ عَلَيْهِ ۚ إِنَّهُ هُوَ التَّوَّابُ الرَّحِيمُ ﴾ — البقرة: ٣٧</div></div>
<div class="pmod-section"><h4>😢 أولاده ومأساة قابيل وهابيل</h4>
<p>كان لآدم ابنان: قابيل وهابيل. قرّبا قرباناً لله، فقُبل من هابيل ولم يقبل من قابيل. فقتل قابيل أخاه هابيل وكانت أول جريمة قتل في التاريخ. أرسل الله غراباً يبحث ليريه كيف يواري جثة أخيه.</p>
<div class="qref">﴿ مِنْ أَجْلِ ذَٰلِكَ كَتَبْنَا عَلَىٰ بَنِي إِسْرَائِيلَ أَنَّهُ مَن قَتَلَ نَفْسًا بِغَيْرِ نَفْسٍ أَوْ فَسَادٍ فِي الْأَرْضِ فَكَأَنَّمَا قَتَلَ النَّاسَ جَمِيعًا ﴾ — المائدة: ٣٢</div></div>`},

{ar:"إدريس",en:"Idris عليه السلام",brief:"رفعه الله مكاناً علياً، حكيم وعالم، أول من خط بالقلم.",tag:"النبي الحكيم",
info:{لقبه:"الحكيم — الكاتب",قومه:"أرسله الله لقوم في بابل",الكتاب:"صحف إدريس",الزمن:"قبل نوح عليه السلام"},
story:`<div class="pmod-section"><h4>📝 الحكيم الكاتب</h4>
<p>إدريس عليه السلام هو الجد الثالث لنوح عليه السلام. وُهب علماً وحكمة عظيمة، وكان أول من خط بالقلم، وأول من خاط الثياب ولبسها بعد أن كان الناس يلبسون الجلود. عُرف بالصدق والعدل.</p>
<div class="qref">﴿ وَاذْكُرْ فِي الْكِتَابِ إِدْرِيسَ ۚ إِنَّهُ كَانَ صِدِّيقًا نَّبِيًّا ﴾ — مريم: ٥٦</div></div>
<div class="pmod-section"><h4>⬆️ الرفع العلوي</h4>
<p>رفعه الله إلى مكانٍ علوي خاص، فكان ذلك من أعظم التكريم الإلهي. قال المفسرون إنه رُفع إلى السماء الرابعة وبعضهم قال السادسة. رآه النبي ﷺ ليلة الإسراء والمعراج.</p>
<div class="qref">﴿ وَرَفَعْنَاهُ مَكَانًا عَلِيًّا ﴾ — مريم: ٥٧</div></div>`},

{ar:"نوح",en:"Nuh عليه السلام",brief:"دعا قومه ٩٥٠ سنة وبنى السفينة بأمر الله، نجا المؤمنون وهلك الكافرون.",tag:"شيخ المرسلين",
info:{لقبه:"شيخ المرسلين — نبي الطوفان","مدة الدعوة":"٩٥٠ سنة",السفينة:"بناها على جبل الجودي",زوجته:"كافرة غير ناجحة",ابنه:"كنعان — غرق"},
story:`<div class="pmod-section"><h4>📣 دعوة ٩٥٠ سنة</h4>
<p>دعا نوح عليه السلام قومه الذين يعبدون الأصنام (ودّاً، وسواعاً، ويغوث، ويعوق، ونسراً) دعوةً متواصلة ٩٥٠ سنة ليلاً ونهاراً، سراً وجهاراً، فلم يؤمن معه إلا القليل.</p>
<div class="qref">﴿ رَبِّ إِنِّي دَعَوْتُ قَوْمِي لَيْلًا وَنَهَارًا ﴿٥﴾ فَلَمْ يَزِدْهُمْ دُعَائِي إِلَّا فِرَارًا ﴾ — نوح: ٥-٦</div></div>
<div class="pmod-section"><h4>🚢 بناء السفينة</h4>
<p>أوحى الله إلى نوح أن يبني سفينة كبيرة. كان قومه يمرون عليه ويسخرون منه: "كيف تبني سفينة في الصحراء؟!" فقال: سترون! بنى السفينة بطول ٣٠٠ ذراع حسب بعض الروايات.</p>
<div class="qref">﴿ وَاصْنَعِ الْفُلْكَ بِأَعْيُنِنَا وَوَحْيِنَا ﴾ — هود: ٣٧</div></div>
<div class="pmod-section"><h4>🌊 الطوفان العظيم</h4>
<p>فار التنور وجاء الطوفان من السماء والأرض. أمر نوح بحمل زوجين من كل مخلوق. حاول ابنه كنعان الهروب للجبل فأغرقه الله. وقف نوح يدعو ربه حزيناً لكن الله قال إنه من غير أهله بكفره.</p>
<div class="qref">﴿ وَقِيلَ يَا أَرْضُ ابْلَعِي مَاءَكِ وَيَا سَمَاءُ أَقْلِعِي وَغِيضَ الْمَاءُ وَقُضِيَ الْأَمْرُ ﴾ — هود: ٤٤</div></div>
<div class="pmod-section"><h4>🏔️ الاستقرار والنهاية</h4>
<p>استوت السفينة على الجودي. خرج نوح ومن معه. كرّمه الله وبارك فيه وفي ذريته. قال له ربه: "اهبط بسلام منا وبركات عليك."</p>
<div class="qref">﴿ قِيلَ يَا نُوحُ اهْبِطْ بِسَلَامٍ مِّنَّا وَبَرَكَاتٍ عَلَيْكَ ﴾ — هود: ٤٨</div></div>`},

{ar:"هود",en:"Hud عليه السلام",brief:"نبي قوم عاد العمالقة، كذّبوه فأُهلكوا بريح صرصر عاتية سبع ليالٍ وثمانية أيام.",tag:"نبي عاد",
info:{قومه:"عاد — في جنوب الجزيرة العربية (الأحقاف)",هلاكهم:"ريح صرصر سبع ليالٍ وثمانية أيام",صفتهم:"أجساد ضخمة، بنّاءون للأحقاف"},
story:`<div class="pmod-section"><h4>🏗️ قوم عاد</h4>
<p>كان قوم عاد من أقوى الأمم وأشدها بنياناً، بنوا في الأحقاف (جنوب الجزيرة) أبنية عالية وقصوراً فارهة، وكانوا من العمالقة أصحاب الأجساد الضخمة، فقالوا: "من أشد منا قوة؟"</p>
<div class="qref">﴿ أَتَبْنُونَ بِكُلِّ رِيعٍ آيَةً تَعْبَثُونَ ﴿١٢٨﴾ وَتَتَّخِذُونَ مَصَانِعَ لَعَلَّكُمْ تَخْلُدُونَ ﴾ — الشعراء: ١٢٨-١٢٩</div></div>
<div class="pmod-section"><h4>📣 دعوة هود</h4>
<p>دعاهم هود عليه السلام لعبادة الله وحده وترك الأصنام، وعدهم بزيادة القوة والنعمة إن آمنوا. لكنهم كذّبوه وقالوا إنه مجنون.</p>
<div class="qref">﴿ وَإِلَىٰ عَادٍ أَخَاهُمْ هُودًا ۚ قَالَ يَا قَوْمِ اعْبُدُوا اللَّهَ مَا لَكُم مِّنْ إِلَٰهٍ غَيْرُهُ ﴾ — الأعراف: ٦٥</div></div>
<div class="pmod-section"><h4>💨 الهلاك بالريح</h4>
<p>حين رأوا سحابة عظيمة قالوا: "هذا عارض ممطرنا!" لكنها كانت ريحاً صرصراً عاتية. استمرت سبع ليالٍ وثمانية أيام تكسّر كل شيء، ونجا هود ومن معه من المؤمنين.</p>
<div class="qref">﴿ فَأُهْلِكُوا بِرِيحٍ صَرْصَرٍ عَاتِيَةٍ ﴿٦﴾ سَخَّرَهَا عَلَيْهِمْ سَبْعَ لَيَالٍ وَثَمَانِيَةَ أَيَّامٍ حُسُومًا ﴾ — الحاقة: ٦-٧</div></div>`},

{ar:"صالح",en:"Salih عليه السلام",brief:"نبي قوم ثمود، آيته الناقة فعقروها فأُخذوا بالصيحة.",tag:"نبي ثمود",
info:{قومه:"ثمود — في الحجر (شمال الحجاز)",آيته:"ناقة الله وفصيلها",هلاكهم:"صيحة واحدة أهلكتهم جميعاً"},
story:`<div class="pmod-section"><h4>🐪 ناقة الله آية</h4>
<p>طلب قوم ثمود من صالح أن يُخرج لهم ناقة من صخرة معينة. أخرجها الله معجزةً، وكانت ناقةً عظيمة تشرب من الوادي يوماً وترعى يوماً. أمرهم أن يتركوها تأكل وتشرب ولا يمسوها بسوء.</p>
<div class="qref">﴿ هَٰذِهِ نَاقَةُ اللَّهِ لَكُمْ آيَةً ۖ فَذَرُوهَا تَأْكُلْ فِي أَرْضِ اللَّهِ ﴾ — الأعراف: ٧٣</div></div>
<div class="pmod-section"><h4>⚡ عقر الناقة والعقاب</h4>
<p>تآمر التسعة الذين كانوا أشقياء القوم، وعقروا الناقة وقتلوا فصيلها. أخبرهم صالح: "تمتعوا في داركم ثلاثة أيام." جاء عذاب الله صيحةً واحدة أهلكت الجميع ونجا صالح والمؤمنون.</p>
<div class="qref">﴿ فَعَقَرُوا النَّاقَةَ وَعَتَوْا عَنْ أَمْرِ رَبِّهِمْ وَقَالُوا يَا صَالِحُ ائْتِنَا بِمَا تَعِدُنَا إِن كُنتَ مِنَ الْمُرْسَلِينَ ﴾ — الأعراف: ٧٧</div>
<div class="qref">﴿ وَأَخَذَ الَّذِينَ ظَلَمُوا الصَّيْحَةُ فَأَصْبَحُوا فِي دِيَارِهِمْ جَاثِمِينَ ﴾ — هود: ٦٧</div></div>`},

{ar:"إبراهيم",en:"Ibrahim عليه السلام",brief:"خليل الله، كسّر الأصنام، أُلقي في النار فكانت برداً وسلاماً، وبنى الكعبة مع ابنه إسماعيل.",tag:"خليل الله",
info:{لقبه:"خليل الله — أبو الأنبياء",ابناه:"إسماعيل من هاجر — إسحاق من سارة",الكعبة:"بناها مع إسماعيل",الابتلاء:"النار — الذبح — الغربة"},
story:`<div class="pmod-section"><h4>🔨 كسر الأصنام</h4>
<p>وُلد إبراهيم في بيئة وثنية، وكان أبوه آزر يصنع الأصنام. تأمل إبراهيم في الكون وعرف أن الشمس والقمر والنجوم لا تصلح للعبادة. انتهز غياب قومه وكسّر أصنامهم جميعاً وترك الكبير ليُحاجّهم.</p>
<div class="qref">﴿ فَجَعَلَهُمْ جُذَاذًا إِلَّا كَبِيرًا لَّهُمْ لَعَلَّهُمْ إِلَيْهِ يَرْجِعُونَ ﴾ — الأنبياء: ٥٨</div></div>
<div class="pmod-section"><h4>🔥 النار تكون برداً وسلاماً</h4>
<p>غضب قومه وقرروا إحراقه. بنوا له ناراً عظيمة وأشعلوها أياماً ثم ألقوه فيها بالمنجنيق. لكن الله أمر النار: "كوني برداً وسلاماً على إبراهيم" فلم يحترق شعرة واحدة!</p>
<div class="qref">﴿ قُلْنَا يَا نَارُ كُونِي بَرْدًا وَسَلَامًا عَلَىٰ إِبْرَاهِيمَ ﴾ — الأنبياء: ٦٩</div></div>
<div class="pmod-section"><h4>🕋 بناء الكعبة</h4>
<p>أمر الله إبراهيم بترك زوجته هاجر وابنه إسماعيل في وادٍ غير ذي زرع (مكة). رعاهم الله بماء زمزم. حين كبر إسماعيل، أمر الله إبراهيم ببناء الكعبة المشرفة فبنياها معاً وهما يدعوان.</p>
<div class="qref">﴿ وَإِذْ يَرْفَعُ إِبْرَاهِيمُ الْقَوَاعِدَ مِنَ الْبَيْتِ وَإِسْمَاعِيلُ رَبَّنَا تَقَبَّلْ مِنَّا ﴾ — البقرة: ١٢٧</div></div>
<div class="pmod-section"><h4>🐏 ابتلاء الذبح العظيم</h4>
<p>رأى إبراهيم في المنام أنه يذبح ابنه إسماعيل. وقال لابنه، فقال إسماعيل: "افعل ما تُؤمر ستجدني إن شاء الله من الصابرين." وحين هّم بالذبح، فداه الله بكبشٍ عظيم.</p>
<div class="qref">﴿ وَفَدَيْنَاهُ بِذِبْحٍ عَظِيمٍ ﴿١٠٧﴾ وَتَرَكْنَا عَلَيْهِ فِي الْآخِرِينَ ﴿١٠٨﴾ سَلَامٌ عَلَىٰ إِبْرَاهِيمَ ﴾ — الصافات: ١٠٧-١٠٩</div></div>`},

{ar:"لوط",en:"Lut عليه السلام",brief:"ابن أخي إبراهيم، أُرسل لقوم سدوم الذين أُهلكوا بالخسف والحجارة.",tag:"نبي سدوم",
info:{قرابته:"ابن أخي إبراهيم",قومه:"أهل سدوم وعمورة",هلاكهم:"قلب المدينة ثم حجارة من سجيل",زوجته:"كانت مع الهالكين"},
story:`<div class="pmod-section"><h4>😈 قوم سدوم ومنكرهم</h4>
<p>كان قوم لوط يرتكبون الفاحشة الكبرى (اللواط) وما سبقهم إليها أحد من العالمين. كانوا أيضاً يقطعون الطريق ويرتكبون المنكرات في مجالسهم.</p>
<div class="qref">﴿ أَتَأْتُونَ الذُّكْرَانَ مِنَ الْعَالَمِينَ ﴿١٦٥﴾ وَتَذَرُونَ مَا خَلَقَ لَكُمْ رَبُّكُم مِّنْ أَزْوَاجِكُم ﴾ — الشعراء: ١٦٥-١٦٦</div></div>
<div class="pmod-section"><h4>👼 زيارة الملائكة</h4>
<p>جاءت الملائكة في صورة شباب حسان إلى بيت لوط ضيوفاً. خاف لوط على ضيوفه وضاق صدره. تجمع أهل المدينة يريدون سوءاً بالضيوف فضرب الملائكة أعينهم فعمهم.</p></div>
<div class="pmod-section"><h4>💥 الهلاك والخسف</h4>
<p>أمر الله لوطاً بالخروج ليلاً مع أهله ولا يلتفت أحد منهم. قلب الله المدينة على أهلها وأرسل عليهم حجارة من سجيل. التفتت زوجته فأصابها ما أصاب القوم.</p>
<div class="qref">﴿ فَجَعَلْنَا عَالِيَهَا سَافِلَهَا وَأَمْطَرْنَا عَلَيْهِمْ حِجَارَةً مِّن سِجِّيلٍ ﴾ — الحجر: ٧٤</div></div>`},

{ar:"إسماعيل",en:"Ismail عليه السلام",brief:"الذبيح الكريم، أعان أباه في بناء الكعبة، جد العرب المستعربة.",tag:"الذبيح الكريم",
info:{أمه:"هاجر أم المؤمنين",مكانه:"مكة المكرمة",لقبه:"الذبيح — صادق الوعد",ذريته:"جد قبائل عدنان — العرب"},
story:`<div class="pmod-section"><h4>💧 زمزم وهاجر</h4>
<p>تركه أبوه رضيعاً مع أمه هاجر في مكة لا ماء ولا زرع. حين نفد الماء سعت هاجر بين الصفا والمروة سبعاً تبحث عن ماء. نبع زمزم من تحت قدمي إسماعيل الرضيع ولا يزال يجري إلى اليوم.</p></div>
<div class="pmod-section"><h4>🕋 بناء الكعبة مع أبيه</h4>
<p>حين كبر إسماعيل وصار شاباً، جاء أبوه إبراهيم بأمر الله لبناء الكعبة. رفع الأب الأساس وابنه يناوله الحجارة وهما يدعوان الله أن يتقبل منهما.</p>
<div class="qref">﴿ رَبَّنَا تَقَبَّلْ مِنَّا ۖ إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ ﴾ — البقرة: ١٢٧</div></div>
<div class="pmod-section"><h4>💪 صدق الوعد والذبح</h4>
<p>وصفه الله بأنه صادق الوعد. كان الذبيح الذي أمر الله إبراهيم بذبحه فقال: "يا أبت افعل ما تُؤمر." فداه الله بكبش وكانت سنة الأضحى.</p>
<div class="qref">﴿ وَاذْكُرْ فِي الْكِتَابِ إِسْمَاعِيلَ ۚ إِنَّهُ كَانَ صَادِقَ الْوَعْدِ وَكَانَ رَسُولًا نَّبِيًّا ﴾ — مريم: ٥٤</div></div>`},

{ar:"إسحاق",en:"Ishaq عليه السلام",brief:"بُشّر به في شيخوخة إبراهيم وسارة، أبو يعقوب وجد بني إسرائيل.",tag:"ابن البشارة",
info:{أمه:"سارة زوجة إبراهيم",ابنه:"يعقوب (إسرائيل)","عمر أمه":"٩٠ سنة حين بشّرت به",ذريته:"بنو إسرائيل"},
story:`<div class="pmod-section"><h4>🎉 البشارة المعجزة</h4>
<p>جاءت الملائكة ضيوفاً لإبراهيم في صورة شباب. بشّرته بإسحاق ومن بعده يعقوب. ضحكت سارة وقالت متعجبة: "أألد وأنا عجوز وهذا بعلي شيخاً؟!" فقالت الملائكة: "أتعجبين من أمر الله؟"</p>
<div class="qref">﴿ فَبَشَّرْنَاهَا بِإِسْحَاقَ وَمِن وَرَاءِ إِسْحَاقَ يَعْقُوبَ ﴾ — هود: ٧١</div></div>
<div class="pmod-section"><h4>⭐ مكانته وذريته</h4>
<p>وُلد إسحاق وكان من أبره الناس بوالديه. أتم الله به النعمة على إبراهيم بعد إسماعيل. من ذريته يعقوب ومن ذريته الأنبياء الكثيرون من بني إسرائيل.</p>
<div class="qref">﴿ وَبَارَكْنَا عَلَيْهِ وَعَلَىٰ إِسْحَاقَ ۚ وَمِن ذُرِّيَّتِهِمَا مُحْسِنٌ وَظَالِمٌ لِّنَفْسِهِ مُبِينٌ ﴾ — الصافات: ١١٣</div></div>`},

{ar:"يعقوب",en:"Ya'qub عليه السلام",brief:"إسرائيل الصابر، أبو الأسباط الاثني عشر، بكى على يوسف حتى ابيضّت عيناه.",tag:"إسرائيل الصابر",
info:{لقبه:"إسرائيل — عبد الله",أبناؤه:"١٢ ابناً — الأسباط",معاناته:"فقد يوسف ٢٠ سنة حتى ابيضت عيناه",نهايته:"مات في مصر ونقل ليُدفن في الشام"},
story:`<div class="pmod-section"><h4>👨‍👦 أب الأسباط الاثني عشر</h4>
<p>يعقوب عليه السلام له اثنا عشر ابناً هم الأسباط الذين تفرّعت منهم قبائل بني إسرائيل: روبيل، شمعون، لاوي، يهوذا، يساكر، زبولون، يوسف، بنيامين، دان، نفتالي، جاد، أشير. أحبّ يوسف حباً شديداً لما رأى فيه.</p></div>
<div class="pmod-section"><h4>😭 فراق يوسف والصبر الجميل</h4>
<p>ألقى إخوة يوسف أخاهم في الجب وأتوا أباهم بقميصه ملطّخاً بالدم كذباً. ابيضّت عينا يعقوب من الحزن والبكاء وكظم غيظه قائلاً: "صبرٌ جميل والله المستعان على ما تصفون."</p>
<div class="qref">﴿ وَتَوَلَّىٰ عَنْهُمْ وَقَالَ يَا أَسَفَىٰ عَلَىٰ يُوسُفَ وَابْيَضَّتْ عَيْنَاهُ مِنَ الْحُزْنِ فَهُوَ كَظِيمٌ ﴾ — يوسف: ٨٤</div></div>
<div class="pmod-section"><h4>🌟 لقاء يوسف</h4>
<p>بعد سنوات طويلة، جاء البشير بقميص يوسف فألقاه على وجه يعقوب فارتد بصيراً فوراً. ذهب يعقوب إلى مصر ولقي يوسف وعانقه. رفع يوسف أبويه على العرش.</p>
<div class="qref">﴿ فَلَمَّا أَن جَاءَ الْبَشِيرُ أَلْقَاهُ عَلَىٰ وَجْهِهِ فَارْتَدَّ بَصِيرًا ﴾ — يوسف: ٩٦</div></div>`},

{ar:"يوسف",en:"Yusuf عليه السلام",brief:"أحسن القصص، من البئر إلى عزيز مصر، آية في الصبر والعفو والحسن.",tag:"الصديق الأمين",
info:{لقبه:"الصديق — الأمين",المكان:"مصر — كنعان",ابتلاؤه:"البئر — السجن — امرأة العزيز",خاتمته:"عزيز مصر — لمّ شمل العائلة"},
story:`<div class="pmod-section"><h4>⭐ الرؤيا والحسد</h4>
<p>رأى يوسف في المنام أحد عشر كوكباً والشمس والقمر يسجدون له. أخبر أباه فنهاه عن إخبار إخوته. لكن الإخوة علموا وحسدوه وتآمروا عليه.</p>
<div class="qref">﴿ نَحْنُ نَقُصُّ عَلَيْكَ أَحْسَنَ الْقَصَصِ بِمَا أَوْحَيْنَا إِلَيْكَ هَٰذَا الْقُرْآنَ ﴾ — يوسف: ٣</div></div>
<div class="pmod-section"><h4>🕳️ البئر والعبودية</h4>
<p>ألقاه إخوته في الجب وباعوه بثمن بخس دراهم معدودة. اشتراه عزيز مصر وأكرمه في بيته. كبر يوسف وكان في غاية الجمال والأمانة.</p></div>
<div class="pmod-section"><h4>🚪 الابتلاء والسجن</h4>
<p>راودته امرأة العزيز عن نفسه فاستعصم وقال: "معاذ الله إنه ربي أحسن مثواي!" سجنوه ظلماً. في السجن فسّر أحلام صاحبيه بصدق. بعد سنوات، رأى الملك رؤيا فتذكره ودعاه.</p>
<div class="qref">﴿ قَالَ رَبِّ السِّجْنُ أَحَبُّ إِلَيَّ مِمَّا يَدْعُونَنِي إِلَيْهِ ﴾ — يوسف: ٣٣</div></div>
<div class="pmod-section"><h4>👑 العزة ثم العفو</h4>
<p>فسّر يوسف رؤيا الملك: سبع سنوات خصب وسبع قحط. طلب يوسف أن يُولّى على خزائن الأرض. جاء إخوته يطلبون الطعام فعرفهم ولم يعرفوه. كشف عن نفسه ثم قال كلمة خلّدها التاريخ:</p>
<div class="qref">﴿ لَا تَثْرِيبَ عَلَيْكُمُ الْيَوْمَ ۖ يَغْفِرُ اللَّهُ لَكُمْ ﴾ — يوسف: ٩٢</div></div>`},

{ar:"أيوب",en:"Ayyub عليه السلام",brief:"رمز الصبر على البلاء، ابتُلي بالمال والولد والجسد ١٨ سنة فصبر فرفع الله بلاءه.",tag:"صاحب الصبر الأعظم",
info:{زوجته:"رحمة — ظلّت وفيّة معه طوال البلاء","مدة البلاء":"١٨ سنة (قيل ٧ سنوات)",نهايته:"رُدّ إليه كل شيء وأضعافه",المكان:"أرض البثنية بالشام"},
story:`<div class="pmod-section"><h4>💰 الغنى ثم الابتلاء</h4>
<p>كان أيوب عليه السلام من أثرى الناس وأكثرهم أولاداً وأصحّهم جسداً. ابتلاه الله بفقد المال والولد ثم بالمرض. أصابه الوجع في جسده حتى تساقط لحمه وتصدّع عظمه.</p></div>
<div class="pmod-section"><h4>🙏 الصبر والدعاء</h4>
<p>ظلّت زوجته ترعاه وتخدمه طوال سنوات. بقي أيوب صابراً شاكراً يذكر الله دون تذمر حتى قال إخوته "لا يصبر على هذا بشر!" فدعا ربه بأرق دعاء:</p>
<div class="qref">﴿ وَأَيُّوبَ إِذْ نَادَىٰ رَبَّهُ أَنِّي مَسَّنِيَ الضُّرُّ وَأَنتَ أَرْحَمُ الرَّاحِمِينَ ﴾ — الأنبياء: ٨٣</div></div>
<div class="pmod-section"><h4>💚 الفرج بعد الضيق</h4>
<p>استجاب الله فأمره بالضرب بقدمه الأرض فانبثق ماء بارد يغتسل ويشرب منه فعاد بصحته. رُدّ إليه ماله وأولاده وأضعافهم. قال الله: "رحمةً منا وذكرى لأولي الألباب."</p>
<div class="qref">﴿ فَاسْتَجَبْنَا لَهُ فَكَشَفْنَا مَا بِهِ مِن ضُرٍّ ۖ وَآتَيْنَاهُ أَهْلَهُ وَمِثْلَهُم مَّعَهُمْ ﴾ — الأنبياء: ٨٤</div></div>`},

{ar:"شعيب",en:"Shu'ayb عليه السلام",brief:"خطيب الأنبياء، أُرسل لأهل مدين والأيكة ينهاهم عن البخس والغش.",tag:"خطيب الأنبياء",
info:{قومه:"مدين والأيكة",هلاكهم:"عذاب يوم الظلة",لقبه:"خطيب الأنبياء لفصاحة بيانه"},
story:`<div class="pmod-section"><h4>⚖️ قوم مدين وغشّهم</h4>
<p>كان أهل مدين تجاراً يبخسون الناس أشياءهم في الكيل والميزان، ويقطعون الطريق على المسافرين ويفسدون في الأرض. أرسل الله إليهم شعيباً عليه السلام.</p>
<div class="qref">﴿ وَإِلَىٰ مَدْيَنَ أَخَاهُمْ شُعَيْبًا ۚ قَالَ يَا قَوْمِ اعْبُدُوا اللَّهَ وَأَوْفُوا الْكَيْلَ وَالْمِيزَانَ ﴾ — هود: ٨٤</div></div>
<div class="pmod-section"><h4>💨 عذاب يوم الظلة</h4>
<p>كذّبوه وهددوه بالطرد. أصابهم حر شديد أياماً فلجأوا لظل سحابة فاحترقوا تحتها. وكانت المدينة تنبعث منها صيحة عظيمة فخروا صرعى.</p>
<div class="qref">﴿ فَأَخَذَهُمْ عَذَابُ يَوْمِ الظُّلَّةِ ۚ إِنَّهُ كَانَ عَذَابَ يَوْمٍ عَظِيمٍ ﴾ — الشعراء: ١٨٩</div></div>`},

{ar:"موسى",en:"Musa عليه السلام",brief:"كليم الله وأكثر الأنبياء ذكراً في القرآن، واجه فرعون وفلق البحر بعصاه.",tag:"كليم الله",
info:{لقبه:"كليم الله",كتابه:"التوراة",معجزاته:"العصا — اليد البيضاء — فلق البحر — التسع آيات",فرعون:"رمسيس الثاني أو غيره"},
story:`<div class="pmod-section"><h4>🍼 الميلاد والنجاة من الإغراق</h4>
<p>أمر فرعون بقتل كل مولود ذكر لبني إسرائيل. وُلد موسى فأوحى الله لأمه: "ضعيه في التابوت وألقيه في النيل." تعلّق التابوت بأشجار قصر فرعون واشتراه جنوده. أصرّت زوجة فرعون على تربيته.</p>
<div class="qref">﴿ وَأَوْحَيْنَا إِلَىٰ أُمِّ مُوسَىٰ أَنْ أَرْضِعِيهِ فَإِذَا خِفْتِ عَلَيْهِ فَأَلْقِيهِ فِي الْيَمِّ ﴾ — القصص: ٧</div></div>
<div class="pmod-section"><h4>🔥 التكليم في الوادي المقدس</h4>
<p>خرج موسى من مصر بعد حادثة قتل القبطي ومكث في مدين سنين. حين رجع ورأى ناراً في الطريق، ناداه الله من شجرة: "يا موسى إني أنا ربك!" وكلّمه ربه وأعطاه المعجزتين: العصا واليد البيضاء.</p>
<div class="qref">﴿ وَكَلَّمَ اللَّهُ مُوسَىٰ تَكْلِيمًا ﴾ — النساء: ١٦٤</div></div>
<div class="pmod-section"><h4>🐍 مواجهة فرعون والسحرة</h4>
<p>ذهب موسى وهارون إلى فرعون وعرضا الآيات فكذّب فرعون. جمع سحرته في يوم الزينة فألقوا حبالهم وعصيّهم، ثم ألقى موسى عصاه فابتلعتها جميعاً. آمن السحرة فوراً!</p>
<div class="qref">﴿ فَأَلْقَىٰ مُوسَىٰ عَصَاهُ فَإِذَا هِيَ تَلْقَفُ مَا يَأْفِكُونَ ﴾ — الشعراء: ٤٥</div></div>
<div class="pmod-section"><h4>🌊 فلق البحر وهلاك فرعون</h4>
<p>خرج موسى ببني إسرائيل ليلاً فتبعهم فرعون وجيشه. حين وصلوا البحر قال أصحاب موسى: "أُدركنا!" فقال موسى: "كلا إن ربي معي سيهدين." ضرب عصاه البحر فانفلق اثني عشر طريقاً يابساً! اتبعهم فرعون فأُغرق.</p>
<div class="qref">﴿ فَأَوْحَيْنَا إِلَىٰ مُوسَىٰ أَنِ اضْرِب بِّعَصَاكَ الْبَحْرَ ۖ فَانفَلَقَ فَكَانَ كُلُّ فِرْقٍ كَالطَّوْدِ الْعَظِيمِ ﴾ — الشعراء: ٦٣</div></div>`},

{ar:"هارون",en:"Harun عليه السلام",brief:"أخو موسى الفصيح والوزير المعين، شريكه في مواجهة فرعون.",tag:"وزير النبوة",
info:{قرابته:"أخو موسى الأكبر",مهمته:"وزير ومعاون لموسى",لقبه:"الفصيح — الوزير",},
story:`<div class="pmod-section"><h4>🗣️ الوزير الفصيح</h4>
<p>حين كلّف الله موسى بالذهاب لفرعون، طلب موسى من ربه أن يشدّ أزره بأخيه هارون لأن هارون أفصح منه لساناً. فأوحى الله لهارون وأرسله مع موسى.</p>
<div class="qref">﴿ وَأَخِي هَارُونُ هُوَ أَفْصَحُ مِنِّي لِسَانًا فَأَرْسِلْهُ مَعِيَ رِدْءًا يُصَدِّقُنِي ﴾ — القصص: ٣٤</div></div>
<div class="pmod-section"><h4>🐄 فتنة السامري والعجل</h4>
<p>حين ذهب موسى للميقات أربعين ليلة، أضلّ السامري بني إسرائيل فصنع لهم عجلاً من الذهب وقال: "هذا إلهكم!" نهاهم هارون لكنهم أبوا. حين عاد موسى غضب وأخذ برأس أخيه وقال: "ما منعك؟" فقال هارون: "خشيت أن تقول فرّقت بين بني إسرائيل."</p>
<div class="qref">﴿ قَالَ يَا ابْنَ أُمَّ لَا تَأْخُذْ بِلِحْيَتِي وَلَا بِرَأْسِي ﴾ — طه: ٩٤</div></div>`},

{ar:"الخضر",en:"Al-Khadr عليه السلام",brief:"العبد الصالح الذي آتاه الله علم اللدنّي، علّم موسى أن الحكمة وراء الظاهر.",tag:"صاحب العلم اللدني",
info:{مكانه:"مجمع البحرين — مكان غير محدد",مكانته:"العالم المأذون بعلم خاص","هل هو نبي":"خلاف — الأرجح نعم"},
story:`<div class="pmod-section"><h4>🔍 موسى يطلب العلم</h4>
<p>أُخبر موسى عليه السلام أن في مجمع البحرين عبداً من عباد الله آتاه الله علماً لدنياً خاصاً. فسافر موسى مع فتاه يوشع يبحثان عنه حتى وجداه.</p>
<div class="qref">﴿ آتَيْنَاهُ رَحْمَةً مِّنْ عِندِنَا وَعَلَّمْنَاهُ مِن لَّدُنَّا عِلْمًا ﴾ — الكهف: ٦٥</div></div>
<div class="pmod-section"><h4>⚓🚢💀🧱 المواقف الثلاثة</h4>
<p><strong>١. خرق السفينة:</strong> خرق الخضر سفينة مساكين — لأن ملكاً ظالماً كان يأخذ كل سفينة صحيحة قسراً فجعلها معيبة لتنجو.<br><strong>٢. قتل الغلام:</strong> قتل غلاماً — لأنه كان سيكبر ليُكرِه أبويه المؤمنَين على الكفر.<br><strong>٣. إقامة الجدار:</strong> أقام جداراً منهدماً — لأن تحته كنزٌ لغلامَين يتيمَين وأبوهما صالح.</p>
<div class="qref">﴿ وَمَا فَعَلْتُهُ عَنْ أَمْرِي ۚ ذَٰلِكَ تَأْوِيلُ مَا لَمْ تَسْطِع عَّلَيْهِ صَبْرًا ﴾ — الكهف: ٨٢</div></div>`},

{ar:"داود",en:"Dawud عليه السلام",brief:"النبي الملك، قتل جالوت صغيراً وأُوتي الزبور والحكمة وتسبيح الجبال والطير.",tag:"النبي الملك",
info:{كتابه:"الزبور",معجزاته:"تليين الحديد — الجبال والطير تسبح معه",ذريته:"سليمان النبي",لقبه:"خليفة الله في الأرض"},
story:`<div class="pmod-section"><h4>⚔️ داود وجالوت</h4>
<p>كان داود غلاماً في جيش طالوت حين خرجوا لمواجهة جالوت الجبار. تحدّى جالوت الجيش فلم يجرؤ أحد. خرج داود الصغير بمقلاعه وحجر فقتل جالوت بضربة واحدة!</p>
<div class="qref">﴿ وَقَتَلَ دَاوُودُ جَالُوتَ وَآتَاهُ اللَّهُ الْمُلْكَ وَالْحِكْمَةَ وَعَلَّمَهُ مِمَّا يَشَاءُ ﴾ — البقرة: ٢٥١</div></div>
<div class="pmod-section"><h4>🏔️ الجبال والطير تسبّح معه</h4>
<p>سخّر الله الجبال والطير تسبّح مع داود كلما سبّح. كان يُسبّح فيردد الجميع معه. آتاه الله صوتاً عذباً لم يُعطَ لأحد. وأُوتي الزبور وهو مليء بالتسابيح والأدعية.</p>
<div class="qref">﴿ وَلَقَدْ آتَيْنَا دَاوُودَ مِنَّا فَضْلًا ۖ يَا جِبَالُ أَوِّبِي مَعَهُ وَالطَّيْرَ ﴾ — سبأ: ١٠</div></div>
<div class="pmod-section"><h4>🔨 تليين الحديد</h4>
<p>سخّر الله له الحديد: كان يعجن الحديد بيديه كالعجين ويصنع الدروع بلا آلة. كان يعمل بيده ولا يأكل من بيت المال بل من عمل يده.</p>
<div class="qref">﴿ وَأَلَنَّا لَهُ الْحَدِيدَ ﴿١٠﴾ أَنِ اعْمَلْ سَابِغَاتٍ وَقَدِّرْ فِي السَّرْدِ ﴾ — سبأ: ١٠-١١</div></div>`},

{ar:"سليمان",en:"Sulayman عليه السلام",brief:"ملك الأنبياء، سُخّرت له الريح والجن والإنس والطير، وبنى هيكل القدس.",tag:"ملك الأنبياء",
info:{مملكته:"من اليمن حتى بلاد الشام والعراق","سخّر له":"الريح — الجن — الإنس — الطير",القدس:"بنى بيت المقدس","ملكة سبأ":"بلقيس آمنت على يده"},
story:`<div class="pmod-section"><h4>🐜 منطق الطير والنمل</h4>
<p>آتى الله سليمان عِلم منطق الطير وسائر المخلوقات. مرّ بوادٍ من النمل فقالت نملة: "يا أيها النمل ادخلوا مساكنكم لا يحطمنّكم سليمان وجنوده." فتبسّم سليمان ضاحكاً وشكر الله.</p>
<div class="qref">﴿ عُلِّمْنَا مَنطِقَ الطَّيْرِ وَأُوتِينَا مِن كُلِّ شَيْءٍ ﴾ — النمل: ١٦</div></div>
<div class="pmod-section"><h4>🌬️ الريح والجن والجيوش</h4>
<p>سُخّرت له الريح تحمل بساطه شهراً ذهاباً وشهراً إياباً. وسُخّر له الجن يبنون ويغوصون ويعملون. كان يراجع جنوده: الجن والإنس والطير في جيش منظّم.</p>
<div class="qref">﴿ وَحُشِرَ لِسُلَيْمَانَ جُنُودُهُ مِنَ الْجِنِّ وَالْإِنسِ وَالطَّيْرِ فَهُمْ يُوزَعُونَ ﴾ — النمل: ١٧</div></div>
<div class="pmod-section"><h4>👑 ملكة سبأ وإيمانها</h4>
<p>أخبره الهدهد بملكة سبأ (بلقيس) تحكم قوماً يسجدون للشمس. أرسل إليها رسالة يدعوها للإسلام. جاءت وأذهلها قصره ذو الأرضية الزجاجية. آمنت بالله.</p>
<div class="qref">﴿ قَالَتْ رَبِّ إِنِّي ظَلَمْتُ نَفْسِي وَأَسْلَمْتُ مَعَ سُلَيْمَانَ لِلَّهِ رَبِّ الْعَالَمِينَ ﴾ — النمل: ٤٤</div></div>`},

{ar:"إلياس",en:"Ilyas عليه السلام",brief:"أُرسل لأهل بعلبك الذين يعبدون صنم البعل، فكذّبوه وأُهلكوا.",tag:"نبي البعل",
info:{قومه:"أهل بعلبك بالشام",المشكلة:"عبادة صنم البعل",مكانته:"ذكره الله مع المصطفين الأخيار"},
story:`<div class="pmod-section"><h4>🛐 قوم يعبدون البعل</h4>
<p>أُرسل إلياس عليه السلام لقوم في بعلبك (لبنان حالياً) كانوا يعبدون صنماً يُسمّى "البعل" ويتركون عبادة الله خالق السماوات والأرض.</p>
<div class="qref">﴿ وَإِنَّ إِلْيَاسَ لَمِنَ الْمُرْسَلِينَ ﴿١٢٣﴾ إِذْ قَالَ لِقَوْمِهِ أَلَا تَتَّقُونَ ﴿١٢٤﴾ أَتَدْعُونَ بَعْلًا وَتَذَرُونَ أَحْسَنَ الْخَالِقِينَ ﴾ — الصافات: ١٢٣-١٢٥</div></div>
<div class="pmod-section"><h4>⭐ مكانته عند الله</h4>
<p>كذّبوه وهدّدوه. أنجاه الله وسلّم عليه في الآخرين. ذكره الله مع المصطفين الأخيار.</p>
<div class="qref">﴿ سَلَامٌ عَلَىٰ إِلْ يَاسِينَ ﴿١٣٠﴾ إِنَّا كَذَٰلِكَ نَجْزِي الْمُحْسِنِينَ ﴾ — الصافات: ١٣٠-١٣١</div></div>`},

{ar:"اليسع",en:"Al-Yasa عليه السلام",brief:"خليفة إلياس النبي وتلميذه، اصطفاه الله على العالمين.",tag:"المصطفى على العالمين",
info:{قرابته:"خليفة إلياس ومريده",مكانته:"ذكره الله مفاضلاً على العالمين"},
story:`<div class="pmod-section"><h4>🌟 الاصطفاء الإلهي</h4>
<p>اليسع هو تلميذ إلياس عليه السلام وخليفته على النبوة بعده. ذكره الله في القرآن مرتين وفضّله على العالمين دلالةً على مكانته العالية.</p>
<div class="qref">﴿ وَإِسْمَاعِيلَ وَالْيَسَعَ وَيُونُسَ وَلُوطًا ۚ وَكُلًّا فَضَّلْنَا عَلَى الْعَالَمِينَ ﴾ — الأنعام: ٨٦</div>
<div class="qref">﴿ وَاذْكُرْ إِسْمَاعِيلَ وَالْيَسَعَ وَذَا الْكِفْلِ ۚ وَكُلٌّ مِّنَ الْأَخْيَارِ ﴾ — ص: ٤٨</div></div>`},

{ar:"ذو الكفل",en:"Dhul-Kifl عليه السلام",brief:"نبي صابر ذكره الله مع الصابرين الأخيار.",tag:"من الصابرين",
info:{اسمه:"بشر بن أيوب — أو عبيد بن آصف",قومه:"بلاد الشام",لقبه:"ذو الكفل — أي صاحب الكفالة والضمان"},
story:`<div class="pmod-section"><h4>🛡️ الكفالة والضمان</h4>
<p>قيل أن ذو الكفل ضمن أن يصوم النهار ويقوم الليل ولا يغضب في قضائه. وفاء بما ضمن فسمّاه الله ذا الكفل. كان من الصابرين الصالحين.</p>
<div class="qref">﴿ وَإِسْمَاعِيلَ وَإِدْرِيسَ وَذَا الْكِفْلِ ۖ كُلٌّ مِّنَ الصَّابِرِينَ ﴿٨٥﴾ وَأَدْخَلْنَاهُمْ فِي رَحْمَتِنَا ۖ إِنَّهُمْ مِّنَ الصَّالِحِينَ ﴾ — الأنبياء: ٨٥-٨٦</div></div>`},

{ar:"يونس",en:"Yunus عليه السلام",brief:"صاحب الحوت، ابتلعه الحوت فنجا بالتسبيح في الظلمات.",tag:"صاحب الحوت",
info:{لقبه:"ذو النون — صاحب الحوت",قومه:"أهل نينوى بالعراق",الحوت:"ابتلعه في البحر",النجاة:"التسبيح في الظلمات"},
story:`<div class="pmod-section"><h4>😤 الخروج قبل الإذن</h4>
<p>دعا يونس قومه فكذّبوه طويلاً. ظنّ أن الله يعذّبهم فخرج من بينهم قبل أن يأذن له ربّه. ركب سفينة فأقرعوا فوقعت القرعة عليه فأُلقي في البحر.</p>
<div class="qref">﴿ وَذَا النُّونِ إِذ ذَّهَبَ مُغَاضِبًا فَظَنَّ أَن لَّن نَّقْدِرَ عَلَيْهِ ﴾ — الأنبياء: ٨٧</div></div>
<div class="pmod-section"><h4>🐳 في بطن الحوت</h4>
<p>ابتلعه الحوت فكان في ظلمات ثلاث: ظلمة الليل، ظلمة البحر، ظلمة بطن الحوت. فذكر الله ونادى بالتسبيح الخالد:</p>
<div class="qref">﴿ لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ ﴾ — الأنبياء: ٨٧</div></div>
<div class="pmod-section"><h4>💚 النجاة وآمن القوم</h4>
<p>استجاب الله له وأمر الحوت فقذفه بالعراء مريضاً. أنبت الله عليه شجرة من يقطين تظلّه. عاد لقومه فآمنوا جميعاً وكانت من عجائب التاريخ أن يؤمن قوم نبي بعد رحيله.</p>
<div class="qref">﴿ فَنَبَذْنَاهُ بِالْعَرَاءِ وَهُوَ سَقِيمٌ ﴿١٤٥﴾ وَأَنبَتْنَا عَلَيْهِ شَجَرَةً مِّن يَقْطِينٍ ﴾ — الصافات: ١٤٥-١٤٦</div></div>`},

{ar:"زكريا",en:"Zakariyya عليه السلام",brief:"دعا ربه كهلاً عقيماً فبُشّر بيحيى معجزةً، كان كافل مريم.",tag:"النبي الكفيل",
info:{زوجته:"عقيم لا تلد — ثم بُشّرا بيحيى",مهمته:"كفيل مريم بنت عمران",دعاؤه:"من أجمل أدعية القرآن"},
story:`<div class="pmod-section"><h4>🕊️ كفالة مريم</h4>
<p>كان زكريا عليه السلام كافل مريم بنت عمران في بيت المقدس. كان يجد عندها رزقاً لا يعلم من أين، فسألها فقالت: "هو من عند الله." فتذكّر زكريا أن الله قادر على كل شيء.</p>
<div class="qref">﴿ كُلَّمَا دَخَلَ عَلَيْهَا زَكَرِيَّا الْمِحْرَابَ وَجَدَ عِندَهَا رِزْقًا ﴾ — آل عمران: ٣٧</div></div>
<div class="pmod-section"><h4>🤲 الدعاء الخاشع</h4>
<p>كان زكريا شيخاً كبيراً وزوجته عاقراً. لكنه لم ييأس من رحمة الله ودعاه بأعذب دعاء في ليل خاشع:</p>
<div class="qref">﴿ رَبِّ إِنِّي وَهَنَ الْعَظْمُ مِنِّي وَاشْتَعَلَ الرَّأْسُ شَيْبًا وَلَمْ أَكُن بِدُعَائِكَ رَبِّ شَقِيًّا ﴾ — مريم: ٤</div></div>
<div class="pmod-section"><h4>🎊 البشارة بيحيى</h4>
<p>بشّره الله بيحيى وجعل آيةً له ألا يكلّم الناس ثلاثة أيام إلا رمزاً. شكر الله وسبّح.</p>
<div class="qref">﴿ يَا زَكَرِيَّا إِنَّا نُبَشِّرُكَ بِغُلَامٍ اسْمُهُ يَحْيَىٰ لَمْ نَجْعَل لَّهُ مِن قَبْلُ سَمِيًّا ﴾ — مريم: ٧</div></div>`},

{ar:"يحيى",en:"Yahya عليه السلام",brief:"أُوتي الحكم صبياً، كان حصوراً تقياً وراً من الصالحين، لقي ربه شهيداً.",tag:"الحصور التقي",
info:{أبواه:"زكريا وزوجته العاقر",لقبه:"الحصور — لا يقرب النساء",شهادته:"قتله الملك الجائر"},
story:`<div class="pmod-section"><h4>🌱 النشأة الطاهرة</h4>
<p>وُلد يحيى من والدين شيخَين كبيرَين معجزةً إلهية. آتاه الله الحكم وهو طفل صغير. كان بارّاً بوالديه، لم يكن جباراً ولا عاصياً. عاش زاهداً في الدنيا.</p>
<div class="qref">﴿ يَا يَحْيَىٰ خُذِ الْكِتَابَ بِقُوَّةٍ ۖ وَآتَيْنَاهُ الْحُكْمَ صَبِيًّا ﴾ — مريم: ١٢</div></div>
<div class="pmod-section"><h4>❤️ صفاته الكريمة</h4>
<p>وصفه الله بالحنان والزكاة والتقوى والبرّ بوالديه. كان حصوراً أي لا ينحرف في شهوات. كان يأكل الجراد والحشائش ويلبس الشعر زهداً في الدنيا.</p>
<div class="qref">﴿ وَحَنَانًا مِّن لَّدُنَّا وَزَكَاةً ۖ وَكَانَ تَقِيًّا ﴿١٣﴾ وَبَرًّا بِوَالِدَيْهِ وَلَمْ يَكُن جَبَّارًا عَصِيًّا ﴾ — مريم: ١٣-١٤</div></div>
<div class="pmod-section"><h4>☮️ السلام في المواقف الثلاثة</h4>
<div class="qref">﴿ وَسَلَامٌ عَلَيْهِ يَوْمَ وُلِدَ وَيَوْمَ يَمُوتُ وَيَوْمَ يُبْعَثُ حَيًّا ﴾ — مريم: ١٥</div></div>`},

{ar:"عيسى",en:"Isa عليه السلام",brief:"روح الله وكلمته، وُلد من غير أب، أحيا الموتى بإذن الله، رُفع إلى السماء وسيعود.",tag:"روح الله وكلمته",
info:{أمه:"مريم البتول",ولادته:"من غير أب — معجزة إلهية",معجزاته:"إحياء الموتى — إبراء الأكمه والأبرص — الكلام في المهد",رفعه:"رُفع حياً إلى السماء",عودته:"سيعود آخر الزمان"},
story:`<div class="pmod-section"><h4>👶 الميلاد المعجز</h4>
<p>بُشّرت مريم العذراء بعيسى من غير أن يمسّها بشر. قالت: "أنّى يكون لي ولد ولم يمسسني بشر؟" قال الملَك: "كذلك الله يخلق ما يشاء." فكان عيسى بكلمة "كن فيكون."</p>
<div class="qref">﴿ إِنَّ مَثَلَ عِيسَىٰ عِندَ اللَّهِ كَمَثَلِ آدَمَ ۖ خَلَقَهُ مِن تُرَابٍ ثُمَّ قَالَ لَهُ كُن فَيَكُونُ ﴾ — آل عمران: ٥٩</div></div>
<div class="pmod-section"><h4>💬 الكلام في المهد</h4>
<p>حين اتُّهمت مريم، أشارت لوليدها فكلّمهم عيسى في المهد طفلاً: "إني عبد الله آتاني الكتاب وجعلني نبياً وجعلني مباركاً أينما كنت!"</p>
<div class="qref">﴿ قَالَ إِنِّي عَبْدُ اللَّهِ آتَانِيَ الْكِتَابَ وَجَعَلَنِي نَبِيًّا ﴾ — مريم: ٣٠</div></div>
<div class="pmod-section"><h4>✨ المعجزات العظيمة</h4>
<p>أحيا الموتى بإذن الله، أبرأ الأكمه والأبرص، نفخ في طير من الطين فكان طيراً حياً بإذن الله، وأنزل الله مائدة من السماء لأصحابه.</p>
<div class="qref">﴿ وَأُبْرِئُ الْأَكْمَهَ وَالْأَبْرَصَ وَأُحْيِي الْمَوْتَىٰ بِإِذْنِ اللَّهِ ﴾ — آل عمران: ٤٩</div></div>
<div class="pmod-section"><h4>☁️ الرفع إلى السماء والعودة</h4>
<p>أراد اليهود قتله فرفعه الله إليه ولم يُصلب. سيعود عيسى قبيل الساعة: يكسر الصليب ويقتل الخنزير ويضع الجزية ويقتل المسيح الدجال، ثم يتوفاه الله.</p>
<div class="qref">﴿ بَل رَّفَعَهُ اللَّهُ إِلَيْهِ ۚ وَكَانَ اللَّهُ عَزِيزًا حَكِيمًا ﴾ — النساء: ١٥٨</div></div>`},

{ar:"محمد",en:"Muhammad ﷺ",brief:"خاتم الأنبياء والمرسلين، رحمة للعالمين، أفضل الخلق، صاحب المقام المحمود.",tag:"خاتم النبيين ﷺ",
info:{الولادة:"١٢ ربيع الأول عام الفيل — ٥٧٠م",الوفاة:"١٢ ربيع الأول ١١هـ",البعثة:"عمر ٤٠ سنة — غار حراء",الهجرة:"عام ٦٢٢م إلى المدينة المنورة",زوجاته:"١١ زوجة — أولاهن خديجة"},
story:`<div class="pmod-section"><h4>🌟 الميلاد والنشأة</h4>
<p>وُلد في مكة المكرمة عام ٥٧٠م. توفي أبوه عبدالله قبل ولادته وأمه آمنة حين كان في السادسة، ثم كفله جده عبد المطلب ثم عمه أبو طالب. رعاه الله ووقاه من كل فاحشة. رافق قوافل التجارة إلى الشام وعُرف بالصادق الأمين.</p></div>
<div class="pmod-section"><h4>📖 البعثة في غار حراء</h4>
<p>في عمر الأربعين، كان يتعبّد في غار حراء. جاءه جبريل وقال: "اقرأ!" فقال: "ما أنا بقارئ." فضمّه جبريل وأنزل عليه أول آيات القرآن الكريم:</p>
<div class="qref">﴿ اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ ﴾ — العلق: ١</div></div>
<div class="pmod-section"><h4>🏙️ دعوة مكة والهجرة</h4>
<p>دعا ثلاثة عشر عاماً في مكة وتحمّل هو وأصحابه أشد أنواع الأذى والتعذيب. أُذن له بالهجرة إلى المدينة فكانت نقطة التحوّل الكبرى في تاريخ الإسلام.</p>
<div class="qref">﴿ وَمَا أَرْسَلْنَاكَ إِلَّا رَحْمَةً لِّلْعَالَمِينَ ﴾ — الأنبياء: ١٠٧</div></div>
<div class="pmod-section"><h4>⚔️ الغزوات والفتح</h4>
<p>خاض ٢٧ غزوة. فتح مكة عام ٨هـ فدخلها منتصراً ثم عفا عن أهلها. في حجة الوداع خطب خطبته الخالدة وأنزل الله: "اليوم أكملت لكم دينكم."</p>
<div class="qref">﴿ لَقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ ﴾ — الأحزاب: ٢١</div></div>
<div class="pmod-section"><h4>💚 الوفاة والمقام المحمود</h4>
<p>توفي ﷺ عن ٦٣ عاماً في المدينة المنورة. قال أبو بكر: "من كان يعبد محمداً فإن محمداً قد مات، ومن كان يعبد الله فإن الله حيٌّ لا يموت." يوم القيامة له الشفاعة الكبرى والمقام المحمود.</p>
<div class="qref">﴿ وَمَا مُحَمَّدٌ إِلَّا رَسُولٌ ﴾ — آل عمران: ١٤٤</div>
<div class="qref">﴿ مَّا كَانَ مُحَمَّدٌ أَبَا أَحَدٍ مِّن رِّجَالِكُمْ وَلَٰكِن رَّسُولَ اللَّهِ وَخَاتَمَ النَّبِيِّينَ ﴾ — الأحزاب: ٤٠</div></div>`}
];

// ════════════════════════════════════════════════
// NAVIGATION
// ════════════════════════════════════════════════
var _pageHistory = ['home'];
var _exitWarned  = false;
var _exitTimer   = null;

function SP(id, pushHistory){
  // Redirects — مقاطع محذوفة أو مدمجة
  if(id==='adhan')   { SP('prayer'); setTimeout(function(){ switchPrayerTab('adhan'); },50); return; }
  if(id==='reciters'){ SP('quran');  setTimeout(function(){ switchQuranTab('reciters'); },50); return; }
  if(id==='tafsir')  { SP('ai'); return; }
  // Hide all pages, show target
  document.querySelectorAll('.pg').forEach(function(p){p.classList.remove('on');p.style.display='';p.style.opacity='';p.style.visibility='';});
  var pg=document.getElementById('page-'+id);
  if(!pg) return;
  pg.classList.add('on');
  window.scrollTo(0,0);
  // Nav highlight
  document.querySelectorAll('.dnb,.nb').forEach(function(b){b.classList.remove('on');});
  var nb=document.getElementById('nav-'+id);
  if(nb) nb.classList.add('on');
  // History (for back button)
  if(pushHistory !== false){
    if(_pageHistory[_pageHistory.length-1] !== id)
      _pageHistory.push(id);
    try{history.pushState({page:id},'','#'+id);}catch(e){}
  }
  // Page inits
  if(id==='tasbeeh' && typeof initTasbeeh==='function') initTasbeeh();
  if(id==='hifz')    setTimeout(function(){ if(typeof buildHifz==='function') buildHifz(); },50);
  if(id==='quiz')    setTimeout(function(){ if(typeof initQuizPage==='function') initQuizPage(); },50);
  if(id==='themes')  setTimeout(function(){ if(typeof buildThemes==='function') buildThemes(); },50);
  if(id==='hisn'    && typeof renderHisnCats==='function') renderHisnCats();
  if(id==='wird'    && typeof initWird==='function') initWird();
  if(id==='tafsir'  && typeof loadTafsirPage==='function') loadTafsirPage();
  if(id==='prayer') setTimeout(function(){
    if(typeof calcPrayers==='function') calcPrayers();
    // sync adhan tab countdowns too
    if(typeof syncAdhan2Cards==='function') syncAdhan2Cards();
  },100);
  if(id==='qibla') setTimeout(()=>{ if(typeof calcQibla==='function') calcQibla(); },200);
  if(id==='asma')    setTimeout(buildAsma, 50);
  if(id==='tracker') setTimeout(loadTracker, 50);
  if(id==='hijri')   setTimeout(buildHijri, 50);
  if(id==='qsearch') setTimeout(function(){ var inp=document.getElementById('qsearch-inp'); if(inp) inp.focus(); },300);
  if(id==='seerah')  setTimeout(buildSeerah, 50);
  if(id==='mosques') setTimeout(buildMosques, 100);
  if(id==='ramadan') setTimeout(buildRamadan, 50);
  if(id==='prophets2') setTimeout(buildProphets2, 50);
  if(id==='fiqh')    setTimeout(buildFiqh, 50);
  if(id==='stats')   setTimeout(buildStats, 50);
  if(id==='themes')  setTimeout(buildThemes, 50);
  if(id==='gsearch') setTimeout(function(){ var i=document.getElementById('gs-inp'); if(i)i.focus(); },200);
  if(id==='notifs')  setTimeout(buildNotifs, 50);
  if(id==='site-settings') setTimeout(buildSiteSettings, 80);
  if(id==='favorites') setTimeout(buildFavoritesPage, 50);
  
  if(id==='notes') setTimeout(buildNotesPage, 50);
  if(id==='community') setTimeout(buildCommunity, 60);
  if(id==='profile')   setTimeout(buildProfile, 60);
  if(id==='search')    setTimeout(function(){ var i=document.getElementById('qs-inp'); if(i && !i.dataset.init){ i.dataset.init='1'; qsSearch(''); } }, 80);
  if(id==='khatma') setTimeout(updateKhatmaBookmarkUI, 100);
  // وضع القراءة المركّزة
  if(id==='quran'||id==='tafsir') checkFocusMode();
  if(id==='quran') setTimeout(function(){
    var mt=document.getElementById('quran-tab-mushaf');
    if(mt) mt.style.display='';
    if(typeof window._msInit==='function') window._msInit();
  },30);
  if(id==='hifz')    setTimeout(buildHifz, 50);
  if(id==='tajweed') setTimeout(buildTajweed, 50);
  if(id==='prophets' && typeof renderProphets==='function') setTimeout(renderProphets,50);
  if(id==='quiz'    && typeof initQuizPage==='function') initQuizPage();
  if(id==='hadiths' && typeof renderHadithPage==='function') renderHadithPage();
}

// Handle browser back button
window.addEventListener('popstate', function(e){
  if(_pageHistory.length > 1){
    _pageHistory.pop();
    var prev = _pageHistory[_pageHistory.length-1];
    SP(prev, false);
  } else {
    // On home page — double back to exit
    if(_exitWarned){
      clearTimeout(_exitTimer);
      // Confirmed exit — do nothing (browser will handle)
    } else {
      try{history.pushState({page:'home'},'','#home');}catch(e){}
      _exitWarned = true;
      _showExitToast();
      _exitTimer = setTimeout(function(){ _exitWarned = false; }, 2500);
    }
  }
});

function _showExitToast(){
  var old = document.getElementById('_exit_toast');
  if(old) old.remove();
  var t = document.createElement('div');
  t.id = '_exit_toast';
  t.innerHTML = '<div style="display:flex;align-items:center;gap:1rem;direction:rtl;">'
    +'<span style="font-size:1.1rem;">🚪</span>'
    +'<span>اضغط مرة أخرى للخروج</span>'
    +'<button onclick="window.history.go(-_pageHistory.length-1)" style="margin-right:auto;background:rgba(201,168,76,.2);border:1px solid rgba(201,168,76,.3);color:var(--gold);padding:.25rem .7rem;border-radius:8px;font-size:.8rem;cursor:pointer;">خروج</button>'
    +'</div>';
  t.style.cssText='position:fixed;bottom:90px;left:50%;transform:translateX(-50%);'
    +'background:rgba(10,25,15,.97);border:1px solid rgba(201,168,76,.35);'
    +'border-radius:14px;padding:.75rem 1rem;z-index:9999;'
    +'color:var(--cr);font-family:Tajawal,sans-serif;font-size:.88rem;'
    +'min-width:240px;box-shadow:0 8px 30px rgba(0,0,0,.5);'
    +'animation:fadeUp .3s ease;';
  document.body.appendChild(t);
  setTimeout(function(){ if(t.parentNode) t.remove(); _exitWarned=false; }, 2500);
}

// Initialize history state on load
try{history.replaceState({page:'home'},'','#home');}catch(e){}

// ════════════════════════════════════════════════
// OFFLINE / ONLINE DETECTION
// ════════════════════════════════════════════════
function updateNetStatus(){
  const b=document.getElementById('ofbadge');
  const d=document.getElementById('odot');
  b.classList.add('show');
  if(navigator.onLine){d.className='offline-dot online';}
  else{d.className='offline-dot';}
}
window.addEventListener('online',updateNetStatus);
window.addEventListener('offline',updateNetStatus);
setTimeout(updateNetStatus,500);

// ════════════════════════════════════════════════
// QURAN CACHE + LOADER
// ════════════════════════════════════════════════
const QDB='quran_v1';
let qCache={};

function getSurahCache(n){
  try{const d=localStorage.getItem(QDB+'_'+n);return d?JSON.parse(d):null;}catch{return null;}
}
function setSurahCache(n,data){
  try{localStorage.setItem(QDB+'_'+n,JSON.stringify(data));}catch{}
}

// Preload surahs in background
async function preloadAll(){
  let done=0;
  const fill=document.getElementById('cfill');
  for(let i=1;i<=114;i++){
    if(!getSurahCache(i)){
      try{
        const r=await HudaQuran.fetch(`https://api.alquran.cloud/v1/surah/${i}`);
        if(r.ok){const d=await r.json();if(d.data)setSurahCache(i,d.data.ayahs);}
      }catch{}
    }else{done++;}
    const pct=Math.round((i/114)*100);
    if(fill)fill.style.width=pct+'%';
    await new Promise(r=>setTimeout(r,60));
  }
  if(fill){setTimeout(()=>{fill.style.width='0%';},1200);}
}

let currentSurahN=0;
let readerRec='';

function renderSList(f=''){
  const list=document.getElementById('slist');
  if(!list)return;
  const filt=SM.filter(s=>s.ar.includes(f)||s.en.toLowerCase().includes(f.toLowerCase())||String(s.n).includes(f));
  list.innerHTML=filt.map(s=>`<div class="si" id="si-${s.n}" onclick="loadSurah(${s.n})"><div class="sinum">${s.n}</div><div><div class="sname">${s.ar}</div><div class="smeta">${s.ay} آية <span class="stype">${s.tp}</span></div></div></div>`).join('');
}
function filterS(v){renderSList(v);}

/* ══════════════════════════════════════════
   MUSHAF READER v4 — صفحات حقيقية
   - إطار ثابت + صفحات تتقلب
   - حفظ المكان تلقائي
   - تشغيل مستمر بين السور
══════════════════════════════════════════ */
(function(){
  // ═══ المصحف الشريف — نسخة محسّنة ═══
  const toA = n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
  const JZ  = [1,1,3,4,6,7,8,9,10,11,11,12,13,13,14,14,15,15,16,16,17,17,18,18,18,19,19,20,20,21,21,21,21,22,22,22,23,23,23,24,24,25,25,25,25,26,26,26,26,26,26,27,27,27,27,27,27,28,28,28,28,28,28,28,28,28,29,29,29,29,29,29,29,29,29,29,29,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30];
  const juz  = n=>JZ[n-1]||1;
  const $    = id=>document.getElementById(id);
  const PK   = 'nq_pos';

  let curS=1, playing=false, recId='alafasy';
  let qId='hafs', qApi='quran-uthmani';

  // expose immediately
  window._msInit  = function(){ init(); };
  window._msPages = [1]; // non-empty so SP check passes

  // ── Save/load position ──
  function savePos(){ try{localStorage.setItem(PK,JSON.stringify({s:curS}));}catch(e){} }
  function loadPos(){ try{return JSON.parse(localStorage.getItem(PK)||'null');}catch(e){return null;} }

  // ── Get ayahs for surah ──
  function getAyahs(n){
    // 1. QURAN_OFFLINE (embedded complete texts)
    if(typeof QURAN_OFFLINE!=='undefined'){
      const d = QURAN_OFFLINE[n] || QURAN_OFFLINE[String(n)];
      if(d && d.length > 0){
        const trows = (typeof TDATA_LOCAL!=='undefined') ? (TDATA_LOCAL[n]||TDATA_LOCAL[String(n)]||[]) : [];
        return d.map(function(txt,i){
          return { n:i+1, text:txt, tafsir:(trows[i]&&trows[i].tx)||'' };
        });
      }
    }
    // 2. TDATA_LOCAL
    if(typeof TDATA_LOCAL!=='undefined'){
      const rows = TDATA_LOCAL[n] || TDATA_LOCAL[String(n)] || [];
      if(rows.length > 0){
        return rows.map(function(r,i){
          return { n:i+1, text:(r.ay||r.t||'').replace(/[﴿﴾]/g,'').trim(), tafsir:r.tx||'' };
        }).filter(function(a){ return a.text; });
      }
    }
    return null;
  }

  // ── Render surah ──
  function renderSurah(n, ayahs){
    var sm = (typeof SM!=='undefined') ? SM[n-1] : {ar:'',ay:0,tp:'',n:n};
    var cont = $('ms-content');
    if(!cont) return;
    var expected = sm ? (sm.ay||0) : 0;
    var isPartial = expected > 0 && ayahs.length < expected;

    var html = '';
    html += '<div class="ms-surah-banner"><div class="ms-surah-banner-inner">'
          + '<span class="ms-surah-num">'+toA(n)+'</span>'
          + '<span class="ms-surah-name-txt">سورة '+(sm.ar||'')+'</span>'
          + '<span class="ms-surah-details">'+(sm.tp||'')+' · '+toA(sm.ay||ayahs.length)+' آية · الجزء '+toA(juz(n))+'</span>'
          + '</div></div>';

    if(n !== 1 && n !== 9){
      html += '<div class="ms-bism">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</div>';
    }

    html += '<div class="ms-flow" id="ms-flow-text">';
    ayahs.forEach(function(a){
      if(!a.text) return;
      html += a.text
            + ' <span class="ms-vn" data-a="'+a.n+'" data-s="'+n+'"'
            + ' onclick="msPlayFrom('+a.n+')"'
            + ' oncontextmenu="event.preventDefault();_showAyahMenu('+n+','+a.n+');"'
            + '>'+toA(a.n)+'</span> ';
    });
    html += '</div>';

    if(isPartial){
      html += '<div style="text-align:center;padding:.8rem;color:rgba(201,168,76,.5);font-size:.72rem;">'
            + '⚡ جارٍ تحميل باقي الآيات... <span class="ms-spin" style="display:inline-block;width:14px;height:14px;vertical-align:middle;"></span>'
            + '</div>';
    }

    cont.innerHTML = html;

    var hdrS = $('ms-hdr-sname');
    if(hdrS) hdrS.textContent = 'سورة '+(sm.ar||'');
    var hdrPg = $('ms-hdr-pg');
    if(hdrPg) hdrPg.textContent = toA(n)+' / ١١٤';

    var ft = $('ms-footer');
    if(ft){
      ft.innerHTML = '<button class="ms-nav-btn" onclick="msPrev()">&#10095;</button>'
        + '<div class="ms-ft-info">'
        + '<div class="ms-ft-surah">سورة '+(sm.ar||'')+'</div>'
        + '<div class="ms-ft-meta">جزء '+toA(juz(n))+' · '+toA(ayahs.length)+' آية</div>'
        + '</div>'
        + '<button class="ms-nav-btn" onclick="msNext()">&#10094;</button>';
    }

    document.querySelectorAll('.ms-si').forEach(function(e){ e.classList.remove('on'); });
    var si = $('ms-si-'+n);
    if(si){ si.classList.add('on'); si.scrollIntoView({block:'nearest',behavior:'smooth'}); }
    savePos();
  }

  window._showAyahMenu = function(sn,an){
    var ex = document.getElementById('ayah-ctx-menu'); if(ex) ex.remove();
    var m = document.createElement('div');
    m.id = 'ayah-ctx-menu';
    m.style.cssText = 'position:fixed;bottom:calc(90px + env(safe-area-inset-bottom,0px));left:50%;transform:translateX(-50%);max-width:94vw;background:linear-gradient(135deg,rgba(13,43,30,.98),rgba(3,10,6,.99));border:1px solid rgba(201,168,76,.3);border-radius:16px;padding:.7rem;z-index:5000;display:flex;flex-wrap:wrap;gap:.45rem;justify-content:center;direction:rtl;box-shadow:0 10px 40px rgba(0,0,0,.6);';
    var btnCss = 'background:rgba(201,168,76,.15);border:1px solid rgba(201,168,76,.3);color:#C9A84C;padding:.5rem .85rem;border-radius:10px;cursor:pointer;font-family:Tajawal,sans-serif;font-size:.82rem;min-height:40px;';
    m.innerHTML =
      '<button type="button" data-act="taf" style="'+btnCss+'">📖 تفسير</button>' +
      '<button type="button" data-act="play" style="'+btnCss+'">▶ استمع</button>' +
      '<button type="button" data-act="copy" style="'+btnCss+'">📋 نسخ</button>' +
      '<button type="button" data-act="x" style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.45);padding:.5rem .7rem;border-radius:10px;cursor:pointer;min-height:40px;">✕</button>';
    m.addEventListener('click', function(ev){
      var b = ev.target && ev.target.closest('button'); if(!b) return;
      var act = b.getAttribute('data-act');
      if(act==='taf'){ m.remove(); if(typeof openTafsirPopup==='function') openTafsirPopup(sn,an); else if(typeof openTafseer==='function') openTafseer(sn,an,''); }
      else if(act==='play'){ m.remove(); if(typeof msPlayFrom==='function') msPlayFrom(an); }
      else if(act==='copy'){
        var txt = '';
        try {
          var node = document.querySelector('.ms-vn[data-a="'+an+'"]');
          if(node && node.previousSibling) txt = (node.previousSibling.textContent||'').trim();
        } catch(e){}
        if(!txt){ var t=document.getElementById('ms-flow-text'); if(t) txt=t.textContent.trim(); }
        if(navigator.clipboard && txt) navigator.clipboard.writeText(txt).then(function(){ if(typeof showToast==='function') showToast('✅ تم النسخ'); });
        m.remove();
      } else { m.remove(); }
    });
    document.body.appendChild(m);
    setTimeout(function(){ var el=document.getElementById('ayah-ctx-menu'); if(el) el.remove(); }, 8000);
  };

  // ضغط مطوّل على الموبايل لفتح قائمة الآية (التفسير / استمع)
  (function(){
    var timer=null, startX=0, startY=0;
    document.addEventListener('touchstart', function(e){
      var vn = e.target && e.target.closest && e.target.closest('.ms-vn');
      if(!vn) return;
      startX = (e.touches[0]||{}).clientX||0; startY = (e.touches[0]||{}).clientY||0;
      clearTimeout(timer);
      timer = setTimeout(function(){
        var s = +vn.getAttribute('data-s'), a = +vn.getAttribute('data-a');
        if(s && a && typeof _showAyahMenu==='function'){ _showAyahMenu(s,a); if(navigator.vibrate) try{navigator.vibrate(12);}catch(err){} }
      }, 450);
    }, {passive:true});
    document.addEventListener('touchmove', function(e){
      if(!timer) return;
      var t=e.touches[0]; if(!t) return;
      if(Math.abs(t.clientX-startX)>12 || Math.abs(t.clientY-startY)>12){ clearTimeout(timer); timer=null; }
    }, {passive:true});
    document.addEventListener('touchend', function(){ clearTimeout(timer); timer=null; }, {passive:true});
    document.addEventListener('touchcancel', function(){ clearTimeout(timer); timer=null; }, {passive:true});
  })();


  // ── Load surah ──
  function _cacheKey(n){ return 'hq_s'+n; }
  function _saveCache(n,ayahs){ try{ localStorage.setItem(_cacheKey(n), JSON.stringify(ayahs)); }catch(e){} }
  function _loadCache(n){ try{ var d=localStorage.getItem(_cacheKey(n)); return d?JSON.parse(d):null; }catch(e){ return null; } }

  function loadSurahN(n, scroll){
    curS = n;
    var cont = $('ms-content');

    // 1. Show immediately from QURAN_OFFLINE or TDATA (partial ok)
    var immediate = getAyahs(n);
    if(immediate && immediate.length > 0){
      renderSurah(n, immediate);
      if(scroll) window.scrollTo(0,0);
      // If partial, try to load full from cache or API silently
      var expected = (typeof SM!=='undefined' && SM[n-1]) ? SM[n-1].ay : 0;
      if(expected > 0 && immediate.length < expected){
        var cached = _loadCache(n);
        if(cached && cached.length >= expected){
          renderSurah(n, cached);
        } else {
          _fetchAndCache(n, false);
        }
      }
      return;
    }

    // 2. Check localStorage cache
    var cached = _loadCache(n);
    if(cached && cached.length > 0){
      renderSurah(n, cached);
      if(scroll) window.scrollTo(0,0);
      return;
    }

    // 3. Fetch from API
    if(cont) cont.innerHTML = '<div class="ms-loading"><div class="ms-spin"></div>جارٍ تحميل السورة...</div>';
    _fetchAndCache(n, scroll);
  }

  function _fetchAndCache(n, scroll){
    var cont = $('ms-content');
    HudaQuran.fetch('https://api.alquran.cloud/v1/surah/'+n+'/'+qApi)
      .then(function(r){ return r.json(); })
      .then(function(d){
        if(d.data && d.data.ayahs){
          var ayahs = d.data.ayahs.map(function(a){
            return { n:a.numberInSurah, text:a.text, tafsir:'' };
          });
          _saveCache(n, ayahs);
          if(curS===n){ renderSurah(n, ayahs); if(scroll) window.scrollTo(0,0); }
        } else {
          _showLoadError(n, cont);
        }
      })
      .catch(function(){
        // Show what we have or error
        var fallback = getAyahs(n);
        if(fallback && fallback.length>0){
          renderSurah(n, fallback);
        } else {
          _showLoadError(n, cont);
        }
      });
  }

  function _showLoadError(n, cont){
    if(!cont) return;
    var sm = (typeof SM!=='undefined'&&SM[n-1]) ? SM[n-1] : {};
    cont.innerHTML =
      '<div style="text-align:center;padding:2rem 1rem;direction:rtl;">'
      +'<div style="font-size:2.5rem;margin-bottom:.5rem;">📖</div>'
      +'<div style="color:#C9A84C;font-size:1rem;font-weight:700;margin-bottom:.3rem;">سورة '+(sm.ar||'')+'</div>'
      +'<div style="color:rgba(255,255,255,.5);font-size:.82rem;margin-bottom:1.2rem;">تحتاج اتصال بالإنترنت لتحميل هذه السورة</div>'
      +'<button onclick="loadSurahN('+n+',false)" style="background:rgba(201,168,76,.15);border:1.5px solid rgba(201,168,76,.4);color:#C9A84C;padding:.55rem 1.5rem;border-radius:12px;cursor:pointer;font-family:Tajawal,sans-serif;font-size:.9rem;">🔄 إعادة المحاولة</button>'
      +'</div>';
  }

  // ── Navigation ──
  window.msNext = function(){
    if(curS < 114){ loadSurahN(curS+1, true); }
  };
  window.msPrev = function(){
    if(curS > 1){ loadSurahN(curS-1, true); }
  };
  window.loadSurahN = loadSurahN;
  window.msLoadSurah = function(n){ loadSurahN(n, true); };
  window.msChangeSurah = function(d){ loadSurahN(Math.max(1,Math.min(114,curS+d)), true); };

  // ── Audio ──
  window.msPlayFrom = function(ayahN){
    document.querySelectorAll('.ms-vn').forEach(function(v){ v.classList.remove('playing'); });
    if(typeof playAyahGapless==='function') playAyahGapless(ayahN);
    else if(typeof startPB==='function') startPB(recId||'alafasy', curS, false);
  };
  window.msTogglePlay = function(){
    if(playing){
      if(typeof aud!=='undefined'&&aud) aud.pause();
      playing=false;
      const btn=$('ms-play-btn'); if(btn) btn.classList.remove('active');
      document.querySelectorAll('.ms-vn').forEach(function(v){ v.classList.remove('playing'); });
    } else {
      if(typeof startPB==='function') startPB(recId||'alafasy', curS, false);
      playing=true;
      const btn=$('ms-play-btn'); if(btn) btn.classList.add('active');
    }
  };

  // ── Panels (surah list, reciters) ──
  function openP(id){ const el=$(id); if(el){ el.style.display='flex'; el.style.animation='fadeIn .18s ease both'; } }
  function closeP(id){ const el=$(id); if(el) el.style.display='none'; }
  window.msPanelOpen   = function(){ buildSurahs(); openP('ms-p-surahs'); };
  window.msOpenRec     = function(){ buildRecs(); openP('ms-p-reciters'); };
  window.msOpenQiraat  = function(){ openP('ms-p-qiraat'); };
  window.msClosePanel  = function(id){ closeP(id); };

  // ── Surah list builder ──
  function buildSurahs(){
    const list = $('ms-panel-list-s');
    if(!list || list.children.length > 0) return;
    if(typeof SM==='undefined') return;
    list.innerHTML = SM.map(function(s){
      return '<div class="ms-si" id="ms-si-'+s.n+'" onclick="msLoadSurah('+s.n+');msClosePanel(\'ms-p-surahs\')">'
        + '<div class="ms-si-n">'+toA(s.n)+'</div>'
        + '<div><div class="ms-si-name">'+s.ar+'</div>'
        + '<div class="ms-si-meta">'+s.tp+' · '+toA(s.ay)+' آية</div></div>'
        + '<div class="ms-si-juz">ج'+toA(juz(s.n))+'</div>'
        + '</div>';
    }).join('');
    // filter
    const inp = $('ms-sinp');
    if(inp) inp.oninput = function(){
      const q = this.value.trim();
      Array.from(list.children).forEach(function(el){
        el.style.display = (!q || el.textContent.includes(q)) ? '' : 'none';
      });
    };
  }

  // ── القراءات العشر (روايات) — صوت من islamic.network عند التوفر ──
  window.QIRAAT_LIST = [
  {id:'q_hafs', name:'حفص عن عاصم', reader:'عاصم الكوفي', base:'https://server13.mp3quran.net/husr/', mode:'surah'},
  {id:'q_shuaba', name:'شعبة عن عاصم', reader:'عاصم الكوفي', base:'https://cdn.mp3quran.net/audio/ahmad-deeban/r2/', mode:'surah'},
  {id:'q_warsh', name:'ورش عن نافع', reader:'نافع المدني', base:'https://server7.mp3quran.net/basit/', mode:'surah'},
  {id:'q_qalun', name:'قالون عن نافع', reader:'نافع المدني', base:'https://server11.mp3quran.net/sds/', mode:'surah'},
  {id:'q_bazzi', name:'البزي عن ابن كثير', reader:'ابن كثير المكي', base:'https://cdn.mp3quran.net/audio/ahmad-deeban/r4/', mode:'surah'},
  {id:'q_qunbul', name:'قنبل عن ابن كثير', reader:'ابن كثير المكي', base:'https://cdn.mp3quran.net/audio/ahmad-deeban/r3/', mode:'surah'},
  {id:'q_duri', name:'الدوري عن أبي عمرو', reader:'أبو عمرو البصري', base:'https://server10.mp3quran.net/minsh/', mode:'surah'},
  {id:'q_sousi', name:'السوسي عن أبي عمرو', reader:'أبو عمرو البصري', base:'https://cdn.mp3quran.net/audio/abdulrasheed-sufi/r2/', mode:'surah'},
  {id:'q_khalaf', name:'خلف عن حمزة', reader:'حمزة الزيات', base:'https://cdn.mp3quran.net/audio/abdulrasheed-sufi/r1/', mode:'surah'},
  {id:'q_shuaba2', name:'خلاد عن حمزة', reader:'حمزة الزيات', base:'https://cdn.mp3quran.net/audio/ahmad-deeban/r11/', mode:'surah'},
];


  // ── Reciters list builder (شيوخ + قراءات) ──
  function buildRecs(){
    const list = $('ms-rlist') || $('ms-panel-list-r');
    if(!list) return;
    list.innerHTML = '';
    if(typeof RD==='undefined') return;

    var hdr1 = document.createElement('div');
    hdr1.className = 'ms-sec-hdr';
    hdr1.textContent = '🎙 الشيوخ والقراء';
    list.appendChild(hdr1);

    RD.forEach(function(r){
      var d = document.createElement('div');
      d.className = 'ms-ri';
      d.innerHTML = '<div class="ms-ri-ini">'+(r.ini?r.ini[0]:r.name[0])+'</div>'
        + '<div><div class="ms-ri-name">'+r.name+'</div>'
        + '<div class="ms-ri-style">'+(r.style||'')+'</div></div>'
        + '<div class="ms-ri-country">'+(r.country||'')+'</div>';
      d.onclick = function(){ setRec(r.id, r.name); msClosePanel('ms-p-reciters'); };
      list.appendChild(d);
    });

    var hdr2 = document.createElement('div');
    hdr2.className = 'ms-sec-hdr';
    hdr2.textContent = '📖 القراءات العشر (الروايات)';
    list.appendChild(hdr2);

    var lastReader = '';
    (window.QIRAAT_LIST||[]).forEach(function(q){
      if (q.reader !== lastReader) {
        var rh = document.createElement('div');
        rh.className = 'ms-q-reader';
        rh.textContent = q.reader;
        list.appendChild(rh);
        lastReader = q.reader;
      }
      var d = document.createElement('div');
      d.className = 'ms-ri ms-qiraat';
      d.innerHTML = '<div class="ms-ri-ini">ق</div>'
        + '<div><div class="ms-ri-name">'+q.name+'</div>'
        + '<div class="ms-ri-style">'+q.reader+(q.mode==='ayah'?' · آية بآية':' · سورة كاملة')+'</div></div>';
      d.onclick = function(){ setQiraat(q.id); msClosePanel('ms-p-reciters'); };
      list.appendChild(d);
    });
  }

  window.setQiraat = function(qid) {
    var q = (window.QIRAAT_LIST || []).filter(function(x){ return x.id === qid; })[0];
    if (!q || !q.base) { if (typeof showToast==='function') showToast('الرواية غير متاحة'); return; }
    window._qiraat = q;
    window._forceEdition = null;
    window._qiraatBase = q.base;
    /* لا تُبقِ معرف الشيخ هو مصدر الصوت */
    try { localStorage.setItem('nq_qiraat_base', q.base); } catch(e){}
    try { localStorage.setItem('nq_qiraat', q.id); } catch(e){}
    try { if (window.G_STATE) { /* mark reload */ } } catch(e){}
    var lbl = document.getElementById('ms-rec-lbl'); if (lbl) lbl.textContent = q.name.split(' ')[0];
    try {
      var gn = document.getElementById('gpname'); if (gn) gn.textContent = q.name;
    } catch(e){}
    if (typeof showToast === 'function') showToast('▶ ' + q.name);
    try { if (window.__hudaMarkReload) window.__hudaMarkReload(); } catch(e){}
    var s = 1;
    try {
      var st = (typeof G_STATE === 'function') ? G_STATE() : null;
      if (st && st.s) s = st.s;
      else {
        var pos = JSON.parse(localStorage.getItem('nq_pos') || 'null');
        if (pos && pos.s) s = pos.s;
      }
      var first = document.querySelector('#mp-in .ay[data-s]');
      if (first) s = +first.getAttribute('data-s') || s;
    } catch(e){}
    try { if (window.G_STOP) { /* لا hardStop */ } } catch(e){}
    if (typeof playSurahContinuous === 'function') {
      try {
        if (window.G_STATE) {
          var _g = G_STATE();
        }
      } catch(e){}
      // أعد التشغيل بالرواية الجديدة فورًا
      if (typeof playAyahGapless === 'function') playAyahGapless(1, s);
      else playSurahContinuous(s);
    } else if (typeof playAyahGapless === 'function') playAyahGapless(1, s);
  };

  window._qPlayGen = 0;
  window.playQiraatSurahEdition = function(ed, surah, label) {
    surah = parseInt(surah,10)||1;
    var gen = ++window._qPlayGen;
    var aud = document.getElementById('aud');
    if (!aud) { aud = new Audio(); aud.id = 'aud'; document.body.appendChild(aud); }
    // أوقف gapless فقط بدون مسح #aud قبل تعيين المصدر
    try {
      if (window.G_ACTIVE && G_ACTIVE() && typeof G_STOP === 'function') {
        // أوقف gapless دون تدمير واجهة المشغّل
        try { if (window._stopGapless) { /* internal */ } } catch(e){}
      }
    } catch(e){}
    try {
      // أوقف أي صوت سابق على نفس العنصر بأمان
      aud.pause();
      aud.onended = null;
      aud.onerror = null;
    } catch(e){}

    var urls = [
      'https://cdn.islamic.network/quran/audio-surah/128/'+ed+'/'+surah+'.mp3',
      'https://cdn.islamic.network/quran/audio-surah/64/'+ed+'/'+surah+'.mp3',
      'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/'+surah+'.mp3'
    ];
    var i=0;
    function nextUrl(){
      if (gen !== window._qPlayGen) return;
      if(i>=urls.length){ if(typeof showToast==='function') showToast('تعذّر تشغيل الرواية'); return; }
      aud.onerror=function(){ if (gen !== window._qPlayGen) return; i++; nextUrl(); };
      aud.onended=function(){
        if (gen !== window._qPlayGen) return;
        if(typeof isAutoN!=='undefined' && isAutoN && surah<114) playQiraatSurahEdition(ed, surah+1, label);
      };
      aud.src=urls[i];
      var p=aud.play();
      if(p&&p.catch) p.catch(function(){ if (gen !== window._qPlayGen) return; i++; nextUrl(); });
    }
    nextUrl();
    if(typeof curSurahN!=='undefined') curSurahN=surah;
    if(typeof isPlay!=='undefined') isPlay=true;
    try{
      var gp=document.getElementById('gplayer'); if(gp) gp.classList.add('show');
      if (typeof setPlayerLabel==='function') setPlayerLabel(label||ed, 'سورة '+(typeof SM!=='undefined'&&SM[surah-1]?SM[surah-1].ar:surah), 'سورة كاملة');
      else {
        var n=document.getElementById('gpname'); if(n) n.textContent=label||ed;
        var s=document.getElementById('gpsurah'); if(s) s.textContent='سورة '+surah;
        var a=document.getElementById('gpayah'); if(a) a.textContent='سورة كاملة';
      }
      var pl=document.getElementById('gpplay'); if(pl) pl.textContent='⏸';
    }catch(e){}
    // لا تعِد تحميل الصفحة إلا إذا السورة مختلفة فعليًا
    try{
      if(window.HudaMushaf && HudaMushaf.goSurah) {
        var cur = window.HudaMushaf.currentAyah && HudaMushaf.currentAyah();
        if (!cur || +cur.s !== surah) HudaMushaf.goSurah(surah);
      }
    }catch(e){}
  };

  // ── Rec selector ──
  function setRec(id, name){
    window._qiraat = null;
    window._forceEdition = null;
    window._qiraatBase = null;
    try { localStorage.setItem('nq_rec', id); localStorage.removeItem('nq_qiraat'); } catch(e){}
    window.readerRec = id;
    if (typeof curRec !== 'undefined') curRec = id;
    const lbl = document.getElementById('ms-rec-lbl'); if(lbl) lbl.textContent = name ? name.split(' ')[0] : id;
    try {
      var gn=document.getElementById('gpname'); if(gn) gn.textContent = name || id;
      var dn=document.getElementById('dk-rn'); if(dn) dn.textContent = name || id;
    } catch(e){}
    var s = 1;
    try {
      var st = (typeof G_STATE === 'function') ? G_STATE() : null;
      if (st && st.s) s = st.s;
      var pos = JSON.parse(localStorage.getItem('nq_pos')||'null');
      if (pos && pos.s) s = pos.s;
      var first = document.querySelector('#mp-in .ay[data-s], #rd-flow .ay[data-s]');
      if (first) s = +first.getAttribute('data-s')||s;
      if (typeof currentSurahN !== 'undefined' && currentSurahN) s = +currentSurahN || s;
    } catch(e){}
    // تشغيل فوري بصوت الشيخ المختار
    if (typeof window.forcePlaySurah === 'function') {
      window.forcePlaySurah(s, id);
    } else if (typeof playSurahContinuous === 'function') {
      playSurahContinuous(s);
    } else if (typeof playAyahGapless === 'function') {
      playAyahGapless(1, s);
    } else if (typeof startPB === 'function') {
      startPB(id, s, false);
    }
    if (typeof showToast === 'function') showToast('▶ ' + (name || id));
    try { document.dispatchEvent(new CustomEvent('huda:rec')); } catch(e){}
  }

  window.setRec = setRec;

  // ── Swipe ──
  let tx=0, ty=0;
  function initSwipe(){
    const fw=$('ms-paper'); if(!fw||fw._ms)return; fw._ms=true;
    fw.addEventListener('touchstart',function(e){ tx=e.touches[0].clientX; ty=e.touches[0].clientY; },{passive:true});
    fw.addEventListener('touchend',function(e){
      const dx=e.changedTouches[0].clientX-tx;
      const dy=Math.abs(e.changedTouches[0].clientY-ty);
      if(Math.abs(dx)>45&&dy<70){ dx>0?msPrev():msNext(); }
    },{passive:true});
  }

  // ── Player watcher ──
  function watchPlayer(){
    const player=$('gplayer'), reader=$('ms-reader');
    if(!player||!reader)return;
    new MutationObserver(function(){
      reader.classList.toggle('player-open',player.classList.contains('show'));
    }).observe(player,{attributes:true,attributeFilter:['class']});
    reader.classList.toggle('player-open',player.classList.contains('show'));
  }

  // ── Init ──
  function init(){
    window._msInit = init;
    watchPlayer();
    initSwipe();
    // Restore saved rec
    try{ const r=localStorage.getItem('nq_rec'); if(r) recId=r; }catch(e){}
    if(typeof RD!=='undefined'&&RD[0]){
      const saved = recId || RD[0].id;
      const rd = RD.find(function(r){ return r.id===saved; }) || RD[0];
      setRec(rd.id, rd.name);
    }
    // Load saved surah
    const saved = loadPos();
    const n = saved ? (saved.s||1) : 1;
    loadSurahN(n, false);
  }

  // ── MutationObserver: run when quran page becomes visible ──
  const obs = new MutationObserver(function(){
    const qpg = $('page-quran');
    if(qpg && qpg.classList.contains('on')){
      // make sure mushaf tab is visible
      const mt = $('quran-tab-mushaf'); if(mt) mt.style.display='';
      init();
      obs.disconnect(); // only init once
    }
  });
  const tgt = $('page-quran');
  if(tgt) obs.observe(tgt, {attributes:true, attributeFilter:['class']});

  // Also check immediately
  if(tgt && tgt.classList.contains('on')){
    const mt = $('quran-tab-mushaf'); if(mt) mt.style.display='';
    init();
  }
})();
async function loadSurah(n){
  // إظهار شريط البحث
  const sb = document.getElementById('ayah-search-bar');
  if(sb) sb.style.display='block';
  clearAyahSearch();
  currentSurahN=n;
  const s=SM[n-1];
  document.querySelectorAll('.si').forEach(el=>el.classList.remove('on'));
  const si=document.getElementById(`si-${n}`);
  if(si){si.classList.add('on');si.scrollIntoView({block:'nearest'});}
  // على الموبايل: اسكرول للـ reader تلقائياً
  if(window.innerWidth<=900){
    const qr=document.getElementById('qreader');
    if(qr) setTimeout(()=>qr.scrollIntoView({behavior:'smooth',block:'start'}),100);
  }

  const reader=document.getElementById('qreader');
  const topbar=makeTopBar();
  reader.innerHTML=topbar+`<div class="ldbox"><div class="spinner"></div>جارٍ تحميل سورة ${s.ar}...</div>`;

  let ayahs=getSurahCache(n);
  if(!ayahs){
    try{
      const r=await HudaQuran.fetch(`https://api.alquran.cloud/v1/surah/${n}`);
      const d=await r.json();
      if(d.data){ayahs=d.data.ayahs;setSurahCache(n,ayahs);}
    }catch{}
  }
  if(!ayahs){
    reader.innerHTML=topbar+`<div class="ldbox">⚠ تعذّر التحميل. الآيات غير مخزّنة.<br><br><button class="btn-g" onclick="loadSurah(${n})">إعادة المحاولة</button></div>`;
    return;
  }
  const bism=(n!==1&&n!==9)?'<div class="bisml">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>':'';
  if(vbvMode){
    renderVBV(ayahs,n);
    return;
  }
  // جلب الترجمة لو مفعّلة
  var _transTexts = null;
  if(_showTranslation){ try{ _transTexts = await getTranslation(n); }catch(e){} }
  reader.innerHTML=topbar+`
    <div class="shdr">
      <div class="snlbl">سورة رقم ${n}</div>
      <div class="stitle">${s.ar}</div>
      <div class="snameen">${s.en}</div>
      <div class="sdets">
        <div><div class="sdv">${s.ay}</div><div class="sdl">آية</div></div>
        <div><div class="sdv">${s.tp}</div><div class="sdl">النوع</div></div>
        <div><div class="sdv">${s.pg}</div><div class="sdl">الصفحة</div></div>
      </div>
    </div>${bism}
    <div id="ac">${ayahs.map(a=>{
      const favs=getNQFavs();
      const key=`${currentSurahN}:${a.numberInSurah}`;
      const isFav=favs.some(f=>f.k===key);
      const hasNote=!!getNQNotes()[key];
      return `<div class="ayah" id="ay-${a.numberInSurah}" data-ayah="${a.numberInSurah}" data-surah="${currentSurahN}">
        <button class="apbtn" id="ab-${a.numberInSurah}" onclick="playAyahGapless(${a.numberInSurah})">▶</button>
        <span class="atxt">${a.text}<span class="anum">${a.numberInSurah}</span></span>
        <div style="display:flex;flex-direction:column;gap:.15rem;margin-top:.2rem;">
          <button class="fav-btn${isFav?' on':''}" onclick="toggleFav(${currentSurahN},${a.numberInSurah},\`${a.text.replace(/`/g,"'")}\`)" title="مفضلة">★</button>
          <button class="note-btn${hasNote?' has-note':''}" onclick="openNote(${currentSurahN},${a.numberInSurah})" title="ملاحظة">📝</button>
          <button class="note-btn" onclick="openShareVerse(${currentSurahN},${a.numberInSurah},\`${a.text.replace(/`/g,"'")}\`)" title="مشاركة">📤</button>
        </div>
      </div>`;
    }).join('')}</div>
    <div style="height:2rem"></div>`;
}

function makeTopBar(){
  var lang=typeof _appLang!=='undefined'?_appLang:'ar';
  var isAr=lang==='ar';
  const opts=RD.map(r=>`<option value="${r.id}" ${readerRec===r.id?'selected':''}>${r.name}</option>`).join('');
  var qFontClass=localStorage.getItem('nq_qfont')||'qfont-m';
  var fontLabel={'qfont-s':'ص','qfont-m':'م','qfont-l':'ك','qfont-xl':'ك+','qfont-xxl':'ض'}[qFontClass]||'م';
  var uthmaniOn=document.body.classList.contains('font-uthmani');
  return `<div class="qtopbar" id="qtopbar-main">
    <select class="rsel" id="rsel" onchange="readerRec=this.value;saveQPref()" title="${isAr?'القارئ':'Reciter'}">
      <option value="">— ${isAr?'بدون صوت':'No Audio'} —</option>${opts}
    </select>
    <button class="gpxb ${isAutoN?'on':''}" id="anb" onclick="togAutoNext()" title="${isAr?'تشغيل تلقائي':'Auto-next'}">⏭</button>
    <button class="gpxb${_showTranslation?' on':''}" id="trans-btn" onclick="toggleTranslation()" title="${isAr?'الترجمة':'Translation'}">🌐</button>
    <button class="gpxb" onclick="cycleQFont()" title="${isAr?'حجم الخط':'Font size'}" style="font-size:.7rem;font-weight:700;">${fontLabel}</button>
    <button class="gpxb${uthmaniOn?' on':''}" id="uthmani-btn" onclick="toggleUthmaniFont()" title="${isAr?'الخط العثماني':'Uthmani font'}" style="font-family:serif;font-size:.72rem;">عثـ</button>
    <button class="gpxb" onclick="toggleQExtraPanel()" title="${isAr?'تكرار وتايمر':'Repeat & Timer'}" id="qextra-toggle">⚙</button>
  </div>
  <div id="qextra-panel" style="display:none;">
    <span class="qep-lbl">${isAr?'🔁 تكرار الآية:':'🔁 Repeat:'}  </span>
    <input type="number" class="qep-inp" id="rep-count" min="1" max="99" value="${_repCount||1}" onchange="_repCount=parseInt(this.value)||1">
    <button class="qep-btn${_repEnabled?' on':''}" id="rep-btn" onclick="toggleRepMode()">${isAr?'تفعيل':'Enable'}</button>
    <span class="qep-lbl" style="margin-right:.5rem">${isAr?'😴 Sleep:':'😴 Sleep:'}</span>
    <select class="qep-inp" id="sleep-sel" style="width:80px;" onchange="setSleepTimer(this.value)">
      <option value="0">${isAr?'إيقاف':'Off'}</option>
      <option value="10">10 ${isAr?'د':'min'}</option>
      <option value="15">15 ${isAr?'د':'min'}</option>
      <option value="20">20 ${isAr?'د':'min'}</option>
      <option value="30">30 ${isAr?'د':'min'}</option>
      <option value="45">45 ${isAr?'د':'min'}</option>
      <option value="60">60 ${isAr?'د':'min'}</option>
    </select>
    <button class="qep-btn" onclick="openReaderSettings()" style="margin-right:.3rem">${isAr?'🌙 مظهر':'🌙 Theme'}</button>
  </div>`;
}

async function playAR(ayahN){
  const rId=document.getElementById('rsel')?.value||readerRec;
  if(!rId){return;}
  // Play from the specific ayah
  const pad=String(currentSurahN).padStart(3,'0')+String(ayahN).padStart(3,'0');
  const urls=[
    `https://cdn.islamic.network/quran/audio/128/${rId}/${pad}.mp3`,
    `https://everyayah.com/data/${rId}/${pad}.mp3`
  ];
  // Try each URL
  let played=false;
  for(const url of urls){
    try{
      const a=new Audio(url);
      a.volume=1;
      await new Promise((res,rej)=>{a.oncanplaythrough=res;a.onerror=rej;setTimeout(rej,5000);a.load();});
      a.play();
      played=true;
      // Show in global player
      const ti=document.getElementById('gp-title');
      const su=document.getElementById('gp-surah');
      if(ti) ti.textContent='آية '+ayahN;
      if(su) su.textContent='سورة '+currentSurahN;
      break;
    }catch(e){continue;}
  }
  if(!played){
    // Fallback: play full surah from start
    await startPB(rId,currentSurahN);
  }
}

// ════════════════════════════════════════════════
// RECITERS RENDER
// ════════════════════════════════════════════════
function buildPhotoEl(r,i){
  // Try mp3quran.net primary, fallback to beautiful initials
  const photoUrl = r.img || '';
  return `<div class="rc-photo" id="rcp-${i}">
    ${photoUrl ? `<img 
      src="${photoUrl}" 
      alt="${r.name}"
      crossorigin="anonymous"
      onload="this.closest('.rc-photo').classList.add('loaded')"
      onerror="this.remove();this.closest&&this.closest('.rc-photo')&&this.closest('.rc-photo').classList.remove('loaded')"
    >` : ''}
    <div class="rc-ini" style="background:${r.bg}">
      <span style="color:${r.cl};font-family:'Scheherazade New',serif;font-size:2.6rem;font-weight:700">${r.ini}</span>
    </div>
  </div>`;
}

function renderReciters(){
  const grid = document.getElementById('rec-grid');
  if(!grid) return;
  grid.innerHTML = RD.map((r,i)=>`
    <div class="rc" id="rc-${i}" onclick="setRec(RD[${i}].id, RD[${i}].name)" style="cursor:pointer">
      <div class="rc-photo-wrap">
        ${buildPhotoEl(r,i)}
        <div class="rc-overlay-info">
          <div class="rc-country-badge">${r.country}</div>
        </div>
        <div class="eq-bars" id="eq-${i}" style="display:none">
          <div class="eq-bar"></div><div class="eq-bar"></div>
          <div class="eq-bar"></div><div class="eq-bar"></div>
          <div class="eq-bar"></div>
        </div>
      </div>
      <div class="rc-body">
        <div class="rc-name-row">
          <div class="rname">${r.name}</div>
          <span class="rstyle">${r.style}</span>
        </div>
        <div class="rbio">${r.bio.substring(0,85)}...</div>
        <button class="rlisten" onclick="event.stopPropagation();setRec(RD[${i}].id, RD[${i}].name)">
          <span>🎧</span> استمع للتلاوة
        </button>
      </div>
    </div>`).join('');
}

// Load fresh photos from mp3quran.net API at runtime
async function loadApiPhotos(){
  try {
    const res = await fetch('https://www.mp3quran.net/api/v2/reciters?language=ar',{mode:'cors'});
    const data = await res.json();
    if(!data?.reciters) return;
    data.reciters.forEach(apiRec=>{
      const rd = RD.find(r=>r.base && apiRec.moshaf?.[0]?.server && r.base.includes(apiRec.moshaf[0].server.split('/')[0]));
      if(rd && apiRec.photo) rd.img = apiRec.photo;
    });
    renderReciters();
  } catch(e){}
}
setTimeout(loadApiPhotos, 1500);

function filterReciters(q){
  const t=q.trim().toLowerCase();
  document.querySelectorAll('#rec-grid .rc').forEach((el,i)=>{
    const r=RD[i];
    const match=!t||r.name.includes(q)||r.en.toLowerCase().includes(t)||r.country.includes(q)||r.style.includes(q);
    el.style.display=match?'':'none';
  });
}


let curModalRec=-1;
let curModalSurah=1;

function openRM(idx){
  curModalRec=idx;
  const r=RD[idx];
  const sopts=SM.map(s=>`<option value="${s.n}">${s.n}. ${s.ar}</option>`).join('');
  document.getElementById('rmod-body').innerHTML=`
    <div class="mhdr">
      <div class="mav" style="background:${r.bg}">
        ${r.img?`<img src="${r.img}" alt="${r.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="mav-ini" style="display:none;color:${r.cl}">${r.ini}</div>`:
        `<div class="mav-ini" style="color:${r.cl}">${r.ini}</div>`}
      </div>
      <div class="mi"><h2>${r.name}</h2><p>${r.country} &nbsp;·&nbsp; ${r.style}</p></div>
    </div>
    <div class="mbio">${r.bio}</div>
    <p style="font-size:.78rem;color:var(--tm);margin-bottom:1rem">🏆 ${r.aw}</p>
    <div class="mrow">
      <span class="mlbl">السورة:</span>
      <select class="msel" id="msurah" onchange="curModalSurah=+this.value">${sopts}</select>
      <button class="mplay" onclick="modalPlay()">▶ استمع</button>
    </div>
    <div id="mpanel" style="display:none">
      <div class="mpanel">
        <div class="mpt-now">يُشغّل الآن</div>
        <div class="mpt-title" id="mptitle">—</div>
        <div class="mcontrols">
          <button class="mpb" onclick="prevA()">⏮</button>
          <button class="mpb main" id="mppbtn" onclick="togPlay()">▶</button>
          <button class="mpb" onclick="nextA()">⏭</button>
        </div>
        <div class="prw">
          <span class="ptxt" id="mpcur">0:00</span>
          <div class="pbar" id="mpbar" onclick="seekMP(event)">
            <div class="pfill" id="mpfill" style="width:0%"></div>
            <div class="pthumb" id="mpthumb" style="right:0%"></div>
          </div>
          <span class="ptxt" id="mpdur">0:00</span>
        </div>
        <div class="ayah-ctr" id="mpctr"></div>
      </div>
    </div>`;
  document.getElementById('rmod').classList.add('on');
  document.body.style.overflow='hidden';
}
function closeRM(){document.getElementById('rmod').classList.remove('on');document.body.style.overflow='';}
async function modalPlay(){
  const r=RD[curModalRec];
  await startPB(r.id,curModalSurah||1,true);
}

// ════════════════════════════════════════════════
// AUDIO ENGINE — Full Surah Continuous Playback
// ════════════════════════════════════════════════
const aud=document.getElementById('aud');
let curRec=null,curSurahN=0,curIdx=0,curList=[],isRepeat=false,isAutoN=true,isPlay=false,curRecObj=null; // auto-next surah ON by default
let vbvMode=false,vbvAyahs=[],vbvIdx=0,vbvSurahN=0,vbvAutoPlay=false;

function getSurahAudioURL(recObj,surahNum){
  if(!recObj?.base)return null;
  const pad=String(surahNum).padStart(3,'0');
  return recObj.base+pad+'.mp3';
}

function toggleVBV(){
  vbvMode=!vbvMode;
  if(currentSurahN>0)loadSurah(currentSurahN);
}

function renderVBV(ayahs,surahN){
  const s=SM[surahN-1];
  vbvAyahs=ayahs;vbvIdx=0;vbvSurahN=surahN;
  const reader=document.getElementById('qreader');
  const topbar=makeTopBar();
  const bism=(surahN!==1&&surahN!==9)?`<div class="bisml" style="margin-bottom:1.2rem;font-size:1.4rem">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>`:'';
  reader.innerHTML=topbar+bism+`<div class="vbv-wrap"><div id="vbv-container"></div></div>`;
  showVBVAyah(0);
}

function showVBVAyah(idx){
  if(idx<0||idx>=vbvAyahs.length)return;
  vbvIdx=idx;
  const a=vbvAyahs[idx];
  const s=SM[vbvSurahN-1];
  const total=vbvAyahs.length;
  const pct=Math.round(((idx+1)/total)*100);
  const container=document.getElementById('vbv-container');
  if(!container)return;
  container.innerHTML=`
    <div class="vbv-card">
      <div class="vbv-badge">📖 سورة ${s.ar} — ${s.tp}</div>
      <div class="vbv-surah-info">الآية ${idx+1} من ${total}</div>
      <div class="vbv-text">${a.text}<span class="vbv-num">${a.numberInSurah}</span></div>
      <div class="vbv-nav">
        <button class="vbv-btn" onclick="vbvPrevSurah()" ${surahN<=1?'disabled':''}>◀ السابقة</button>
        <button class="vbv-btn main" id="vbv-play-btn" onclick="vbvPlay()">▶ <span data-i18n="play_surah">تشغيل السورة</span></button>
        <button class="vbv-btn" onclick="shareAyahAsImage()" style="background:rgba(201,168,76,.12);font-size:.8rem;" title="مشاركة كصورة">📸 مشاركة</button>
        <button class="vbv-btn" onclick="vbvNextSurah()" ${surahN>=114?'disabled':''}>التالية ▶</button>
      </div>
      <div class="vbv-prog">
        <div class="vbv-bar"><div class="vbv-fill" style="width:${pct}%"></div></div>
        <div class="vbv-pct">الآية ${idx+1} من ${total} — ${pct}% من السورة</div>
      </div>
    </div>`;
}
function vbvPrev(){if(vbvIdx>0)showVBVAyah(vbvIdx-1);}
function vbvNext(){if(vbvIdx<vbvAyahs.length-1)showVBVAyah(vbvIdx+1);}
function vbvPrevSurah(){if(vbvSurahN>1)loadSurah(vbvSurahN-1);}
function vbvNextSurah(){if(vbvSurahN<114)loadSurah(vbvSurahN+1);}
async function vbvPlay(){
  const rId=document.getElementById('rsel')?.value||readerRec;
  if(!rId){alert('اختر قارئاً من القائمة أولاً');return;}
  await startPB(rId,vbvSurahN);
}

// ═══ MAIN PLAYBACK with smart fallback ═══
// Alternative CDN sources for reciters that may fail
// ════ COMPREHENSIVE AUDIO CDN FALLBACKS ════
// Primary: mp3quran.net  |  Secondary: quranicaudio.com  |  Tertiary: alternative servers
const AUDIO_FALLBACKS = {
  'alafasy': ['https://server8.mp3quran.net/afs/'],
  'dosary': ['https://server11.mp3quran.net/yasser/','https://server12.mp3quran.net/yasser/'],
  'sds': ['https://server11.mp3quran.net/sds/'],
  'shur': ['https://server12.mp3quran.net/shur/'],
  'basit': ['https://server7.mp3quran.net/basit/'],
  'hsry': ['https://server13.mp3quran.net/husr/'],
  'minsh': ['https://server10.mp3quran.net/minsh/'],
  'jbrl': ['https://server8.mp3quran.net/jbrl/'],
  'shatri': ['https://server11.mp3quran.net/shatri/'],
  'maher': ['https://server12.mp3quran.net/maher/'],
  'bsfr': ['https://server6.mp3quran.net/basfar/'],
  'rifai': ['https://cdn.mp3quran.net/audio/hani-rifai/r1/'],
  'akhdar': ['https://cdn.mp3quran.net/audio/ibrahim-akhdar/r1/'],
  'ayyoub': ['https://cdn.mp3quran.net/audio/muhammad-ayyub/r1/'],
  'jhn': ['https://cdn.mp3quran.net/audio/abdullah-juhani/r1/'],
  'sobhi': ['https://server14.mp3quran.net/islam/','https://server11.mp3quran.net/islam/','https://server8.mp3quran.net/islam/'],
  'hazza': ['https://server8.mp3quran.net/hazza/','https://server12.mp3quran.net/hazza/','https://server11.mp3quran.net/hazza/'],
  'idrees': ['https://cdn.mp3quran.net/audio/idrees-abkar/r1/'],
  'lhdan': ['https://cdn.mp3quran.net/audio/muhammad-luhaidan/r1/'],
  'hudhaify': ['https://server9.mp3quran.net/hthfi/'],
  'ajamy': ['https://cdn.mp3quran.net/audio/ahmad-ajmi/r1/'],
  'tablawy': ['https://cdn.mp3quran.net/audio/muhammad-tablawi/r1/'],
  'ghamdi': ['https://server7.mp3quran.net/s_gmd/'],
};



// خريطة معرفات cdn.islamic.network — أكثر CDN استقراراً
const ISLAMIC_NET_IDS = {
  'alafasy':   'ar.alafasy',
  'dosary':    null,
  'sds':       'ar.abdurrahmaansudais',
  'shur':      'ar.saoodshuraym',
  'basit':     'ar.abdulbasitmurattal',
  'hsry':      'ar.husary',
  'minsh':     'ar.minshawi',
  'maher':     'ar.mahermuaiqly',
  'jbrl':      'ar.muhammadjibreel',
  'bsfr':      'ar.abdullahbasfar',
  'rifai':     'ar.hanirifai',
  'akhdar':    'ar.ibrahimakhbar',
  'ayyoub':    'ar.muhammadayyoub',
  'jhn':       'ar.hudhaify',
  'husary_mj': 'ar.husarymujawwad',
  'sobhi':     null,
  'hazza':     null,
  'idrees':    'ar.hudhaify',
  'lhdan':     'ar.mahermuaiqly',
  'shatri':    'ar.shaatree',
  'ajmi':      'ar.ahmedajamy',
  'hudhaify':  'ar.hudhaify',
  'ghamdi':    null,
};

// مجلدات everyayah للأصوات غير المتوفرة آية بآية على islamic.network
window.EVERYAYAH_FOLDERS = {
  alafasy: 'Alafasy_128kbps',
  dosary: 'Yasser_Ad-Dussary_128kbps',
  sds: 'Abdurrahmaan_As-Sudais_192kbps',
  shur: 'Saood_ash-Shuraym_128kbps',
  basit: 'Abdul_Basit_Murattal_192kbps',
  hsry: 'Husary_128kbps',
  minsh: 'Minshawy_Murattal_128kbps',
  maher: 'MaherAlMuaiqly128kbps',
  jbrl: 'Muhammad_Jibreel_128kbps',
  shatri: 'Abu_Bakr_Ash-Shaatree_128kbps',
  husary_mj: 'Husary_Mujawwad_128kbps',
  bsfr: 'Abdullah_Basfar_192kbps',
  rifai: 'Hani_Rifai_192kbps',
  ayyoub: 'Muhammad_Ayyoub_128kbps',
  hudhaify: 'Hudhaify_128kbps',
  ghamdi: 'Ghamadi_40kbps',
  jhn: 'Hudhaify_128kbps',
  sobhi: 'Alafasy_128kbps',
  hazza: 'Alafasy_128kbps',
  idrees: 'Hudhaify_128kbps',
  lhdan: 'MaherAlMuaiqly128kbps',
  akhdar: 'Ibrahim_Al-Akhdar_128kbps',
  tablawy: 'Mohammad_al_Tablaway_128kbps',
  ajamy: 'Ahmed_ibn_Ali_al-Ajamy_128kbps'
};

async function tryLoadAudio(urls,sNum){
  const pad=String(sNum).padStart(3,'0');
  for(const base of urls){
    const url=base+pad+'.mp3';
    try{
      aud.src=url;aud.load();
      await new Promise((res,rej)=>{
        const t=setTimeout(()=>rej(new Error('timeout')),8000);
        aud.addEventListener('canplay',()=>{clearTimeout(t);res();},{once:true});
        aud.addEventListener('error',()=>{clearTimeout(t);rej(new Error('error'));},{once:true});
      });
      return url;
    }catch{continue;}
  }
  return null;
}

async function startPB(recId,sNum,fromModal=false){
  // توجيه للمحرك الموحّد: سورة كاملة متواصلة
  if (typeof window.playSurahContinuous === 'function') {
    if (recId) {
      try { localStorage.setItem('nq_rec', recId); } catch(e){}
      window._qiraat = null; window._forceEdition = null;
    }
    return window.playSurahContinuous(sNum || 1);
  }
  const recObj=RD.find(r=>r.id===recId);
  if(!recObj){document.getElementById('gpname').textContent='⚠ قارئ غير موجود';return;}
  const gp=document.getElementById('gplayer');
  gp.classList.add('show');
  curRec=recId;curSurahN=sNum;curRecObj=recObj;curIdx=0;curList=[];
  var _dispName = (window._qiraat && window._qiraat.name) ? window._qiraat.name : (recObj && recObj.name) || recId;
  document.getElementById('gpname').textContent=_dispName;
  if (typeof setPlayerLabel==='function') setPlayerLabel(_dispName, 'سورة '+(SM[sNum-1]?SM[sNum-1].ar:sNum), 'سورة كاملة');
  document.getElementById('gpsurah').textContent='⏳ جارٍ التحميل...';
  document.getElementById('gpayah').textContent='';
  
  const pad=String(sNum).padStart(3,'0');
  const islamicNetId = (window.HudaAudio&&HudaAudio.edition)?HudaAudio.edition(recId):ISLAMIC_NET_IDS[recId];
  const allURLs=[];
  // ⓪ نسخة محفوظة على الجهاز (تعمل بلا إنترنت)
  try{ const _cu=window.HudaAudio?await HudaAudio.blobURL(recId,sNum):null; if(_cu) allURLs.push(_cu); }catch(e){}

  // ① cdn.islamic.network — أثبت CDN عالمياً
  if(islamicNetId){
    allURLs.push(`https://cdn.islamic.network/quran/audio-surah/128/${islamicNetId}/${sNum}.mp3`);
    allURLs.push(`https://cdn.islamic.network/quran/audio-surah/64/${islamicNetId}/${sNum}.mp3`);
  }
  // ② mp3quran.net — المصدر الأصلي
  allURLs.push(recObj.base+pad+'.mp3');
  // ③ download.quranicaudio.com
  const fallbacks=AUDIO_FALLBACKS[recId]||[];
  fallbacks.forEach(b=>{ const u=b+pad+'.mp3'; if(!allURLs.includes(u)) allURLs.push(u); });
  // ④ everyayah.com (بالسورة كاملة عبر الآيات — fallback أخير)
  // Note: everyayah is per-ayah so skip for full surah

  // جرب كل URL حتى ينجح الأول
  let loaded=false;
  for(const url of allURLs){
    try{
      aud.src=url; aud.load();
      await new Promise((res,rej)=>{
        const timer=setTimeout(()=>rej(new Error('timeout')),10000);
        const onCan=()=>{clearTimeout(timer);aud.removeEventListener('error',onErr);res();};
        const onErr=()=>{clearTimeout(timer);aud.removeEventListener('canplay',onCan);rej(new Error('err'));};
        aud.addEventListener('canplay',onCan,{once:true});
        aud.addEventListener('error',onErr,{once:true});
      });
      await aud.play();
      loaded=true;
      console.log('✅ صوت يشتغل:', url);
      break;
    }catch(e){ aud.pause(); console.warn('❌ فشل:', url); continue; }
  }
  
  if(!loaded){
    document.getElementById('gpsurah').textContent='⚠ تعذّر تحميل الصوت — تحقق من الإنترنت';
    document.getElementById('gpayah').textContent='';
    return;
  }
  
  isPlay=true;
  updUI();
  document.querySelectorAll('.rc').forEach((c,i)=>{c.classList.remove('playing');const eq=document.getElementById(`eq-${i}`);if(eq)eq.style.display='none';});
  const ri=RD.findIndex(r=>r.id===recId);
  if(ri>=0){document.getElementById(`rc-${ri}`)?.classList.add('playing');const eq2=document.getElementById(`eq-${ri}`);if(eq2)eq2.style.display='flex';}
  if(fromModal){const mp=document.getElementById('mpanel');if(mp)mp.style.display='block';}
}

function updUI(){
  const s=SM[curSurahN-1];
  const r=curRecObj||{name:'—',ini:'ق',cl:'#C9A84C'};
  document.getElementById('gpname').textContent=r.name;
  document.getElementById('gpsurah').textContent=`سورة ${s?.ar||''}`;
  document.getElementById('gpayah').textContent='🎵 تشغيل متواصل';
  document.getElementById('gpplay').textContent=isPlay?'⏸':'▶';
  document.getElementById('gpeq').style.display=isPlay?'flex':'none';
  const gpavEl=document.getElementById('gpav');
  if(r.img){
    gpavEl.innerHTML=`<img src="${r.img}" alt="${r.name}" style="width:100%;height:100%;object-fit:cover;object-position:center top;border-radius:8px" onerror="this.parentElement.innerHTML='<span style=\"font-family:Scheherazade New,serif;font-size:.9rem;color:'+r.cl+'\">${r.ini||'ق'}</span>'">`;
  } else {
    gpavEl.innerHTML=`<span style="font-family:'Scheherazade New',serif;font-size:.9rem;color:${r.cl}">${r.ini||'ق'}</span>`;
  }
  const mt=document.getElementById('mptitle');if(mt)mt.textContent=`سورة ${s?.ar||''} — ${r.name}`;
  const mp=document.getElementById('mppbtn');if(mp)mp.textContent=isPlay?'⏸':'▶';
}

function togPlay(){
  if (typeof window.__hudaTogPlay === 'function') return window.__hudaTogPlay();
  if(!aud || !aud.src)return;
  if(!aud.paused){aud.pause();isPlay=false;}else{aud.play();isPlay=true;}
  updUI();
}
function prevA(){if(curSurahN>1&&curRec)startPB(curRec,curSurahN-1);}
function nextA(){if(curSurahN<114&&curRec)startPB(curRec,curSurahN+1);}
function stopPlay(){
  // لا تمسح المصدر هنا — استخدم hardStop عبر G_STOP للإيقاف الكامل
  if (typeof window.G_STOP === 'function') { window.G_STOP(); return; }
  if (aud) { aud.pause(); }
  isPlay=false;
  var gp=document.getElementById('gplayer'); if(gp) gp.classList.remove('show');
  var eq=document.getElementById('gpeq'); if(eq) eq.style.display='none';
  document.querySelectorAll('.rc').forEach((c,i)=>{c.classList.remove('playing');const eq=document.getElementById(`eq-${i}`);if(eq)eq.style.display='none';});
  document.querySelectorAll('.ayah').forEach(a=>a.classList.remove('pa'));
  document.querySelectorAll('.apbtn').forEach(b=>{b.classList.remove('ac');b.textContent='▶';});
}
function togRepeat(){isRepeat=!isRepeat;document.getElementById('repbtn').classList.toggle('on',isRepeat);}
function togAutoNext(){
  isAutoN=!isAutoN;
  document.getElementById('anxtbtn')?.classList.toggle('on',isAutoN);
  document.getElementById('anb')?.classList.toggle('on',isAutoN);
}
function setVol(v){aud.volume=Math.min(1.0,parseFloat(v));} aud.volume=1.0;
function fmt(s){if(isNaN(s)||!isFinite(s))return'0:00';const m=Math.floor(s/60),sc=Math.floor(s%60);return`${m}:${sc.toString().padStart(2,'0')}`;}
function seekGP(e){const b=document.getElementById('gpbar');if(aud.duration)aud.currentTime=(e.offsetX/b.offsetWidth)*aud.duration;}
function seekMP(e){const b=document.getElementById('mpbar');if(aud.duration)aud.currentTime=(e.offsetX/b.offsetWidth)*aud.duration;}
function hlAyah(n){
  document.querySelectorAll('.ay.playing,.ayah.playing,.ay.pa,.ayah.pa').forEach(function(el){el.classList.remove('playing','pa');});
  var el = document.querySelector('#ay-'+n+', .ay[data-a="'+n+'"], .ayah[data-a="'+n+'"]');
  if(el){ el.classList.add('playing','pa'); try{el.scrollIntoView({behavior:'smooth',block:'center'});}catch(e){} }
  if(typeof highlightPlayingAyah==='function' && curSurahN) highlightPlayingAyah(curSurahN, n);
}
aud.addEventListener('ended',()=>{
  isPlay=false;updUI();
  if(isRepeat){aud.currentTime=0;aud.play();return;}
  if(isAutoN&&curSurahN<114&&curRec){
    setTimeout(function(){
      var next = curSurahN + 1;
      startPB(curRec, next);
      // Change mushaf page to the new surah
      if (typeof HudaMushaf !== 'undefined' && HudaMushaf.goSurah) {
        try { HudaMushaf.goSurah(next); } catch(e){}
      }
    }, 800);
  }
});
aud.addEventListener('timeupdate',()=>{
  const pct=aud.duration?(aud.currentTime/aud.duration*100):0;
  const gf=document.getElementById('gpfill');if(gf)gf.style.width=pct+'%';
  const mf=document.getElementById('mpfill');if(mf)mf.style.width=pct+'%';
  const mt=document.getElementById('mpthumb');if(mt)mt.style.right=(100-pct)+'%';
  const cur=fmt(aud.currentTime),dur=fmt(aud.duration);
  ['gcur','mpcur'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=cur;});
  ['gdur','mpdur'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=dur;});
});
aud.addEventListener('play',()=>{isPlay=true;updUI();
  if(typeof hlAyah==='function' && typeof curSurahN!=='undefined') hlAyah(1);
  if(typeof highlightPlayingAyah==='function' && curSurahN) highlightPlayingAyah(curSurahN, 1);
});
aud.addEventListener('pause',()=>{isPlay=false;updUI();});

// ════════════════════════════════════════════════
// PRAYER TIMES — aladhan.com API + JS fallback
// ════════════════════════════════════════════════
let userLat=parseFloat(localStorage.getItem('saved_lat'))||30.0444;
let userLng=parseFloat(localStorage.getItem('saved_lng'))||31.2357;
let prayerTimes={};

const METHODS={
  MWL:{fajr:18,isha:17,name:'رابطة العالم الإسلامي'},
  ISNA:{fajr:15,isha:15,name:'أمريكا الشمالية'},
  Egypt:{fajr:19.5,isha:17.5,name:'الهيئة المصرية'},
  Makkah:{fajr:18.5,isha:'90min',name:'أم القرى'},
  Karachi:{fajr:18,isha:18,name:'كراتشي'},
  Tehran:{fajr:17.7,isha:14,name:'طهران'}
};

// Method IDs for aladhan API: 3=MWL,2=ISNA,5=Egypt,4=Makkah,1=Karachi,7=Tehran
const METHOD_API={MWL:3,ISNA:2,Egypt:5,Makkah:4,Karachi:1,Tehran:7};

async function fetchPrayerTimesAPI(lat,lng,method){
  const mId=METHOD_API[method]||5;
  const now=new Date();
  const dd=String(now.getDate()).padStart(2,'0');
  const mm=String(now.getMonth()+1).padStart(2,'0');
  const yyyy=now.getFullYear();
  function toH(str){if(!str)return null;const[h,m]=str.split(':').map(Number);return h+m/60;}
  const tout=ms=>new Promise((_,r)=>setTimeout(()=>r(new Error('timeout')),ms));
  try{
    const url=`https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${lat}&longitude=${lng}&method=${mId}`;
    const res=await Promise.race([fetch(url),tout(7000)]);
    const data=await res.json();
    if(data.code===200&&data.data&&data.data.timings){
      const T=data.data.timings;
      return{fajr:toH(T.Fajr),sunrise:toH(T.Sunrise),dhuhr:toH(T.Dhuhr),asr:toH(T.Asr),maghrib:toH(T.Maghrib),isha:toH(T.Isha)};
    }
  }catch(e1){console.warn('Prayer API:',e1.message);}
  throw new Error('API unavailable');
}

// Fallback: pure JS prayer time calculation (corrected PrayTimes algorithm)
function calcPrayerTimesJS(date,lat,lng,tz,method){
  const M=METHODS[method]||METHODS.Egypt;
  const d2r=Math.PI/180,r2d=180/Math.PI;
  const y=date.getUTCFullYear(),mo=date.getUTCMonth()+1,d=date.getUTCDate();
  let yy=y,mm=mo;
  if(mm<=2){yy--;mm+=12;}
  const A=Math.floor(yy/100),B=2-A+Math.floor(A/4);
  const JD=Math.floor(365.25*(yy+4716))+Math.floor(30.6001*(mm+1))+d+B-1524.5;
  const D=JD-2451545.0;
  const g=d2r*((357.529+0.98560028*D)%360);
  const q=(280.459+0.98564736*D)%360;
  const L=d2r*((q+1.915*Math.sin(g)+0.02*Math.sin(2*g)+360)%360);
  const e=d2r*(23.439-0.00000036*D);
  const RA=r2d*Math.atan2(Math.cos(e)*Math.sin(L),Math.cos(L))/15;
  const eqt=q/15-((RA+24)%24);
  const dec=r2d*Math.asin(Math.sin(e)*Math.sin(L));
  const noon=12-eqt-lng/15+tz;
  function ha(alt){
    const cosH=(Math.sin(alt*d2r)-Math.sin(lat*d2r)*Math.sin(dec*d2r))/(Math.cos(lat*d2r)*Math.cos(dec*d2r));
    if(cosH<-1||cosH>1)return null;
    return r2d*Math.acos(cosH)/15;
  }
  const sunH=ha(-0.8333);
  const fajrH=ha(-M.fajr);
  const asrAlt=r2d*Math.atan(1/(1+Math.tan(Math.abs((lat-dec)*d2r))));
  const asrH=ha(asrAlt);
  let ishaH;
  if(M.isha==='90min') ishaH=null;
  else ishaH=ha(-M.isha);
  const fajr=fajrH!=null?noon-fajrH:null;
  const sunrise=sunH!=null?noon-sunH:null;
  const maghrib=sunH!=null?noon+sunH:null;
  const isha=M.isha==='90min'?(maghrib?maghrib+1.5:null):(ishaH!=null?noon+ishaH:null);
  return{fajr,sunrise,dhuhr:noon,asr:asrH?noon+asrH:null,maghrib,isha};
}

async function calcPrayers(){
  const method=(document.getElementById('calc-method')||{value:'Egypt'}).value||'Egypt';
  const grid=document.getElementById('prayers-grid');
  if(grid&&(!prayerTimes||!Object.keys(prayerTimes).length)){
    grid.innerHTML='<div class="ldbox"><div class="spinner"></div>جارٍ جلب مواقيت الصلاة...</div>';
  }
  try{
    prayerTimes=await fetchPrayerTimesAPI(userLat,userLng,method);
  }catch(e){
    const now=new Date();
    const tz=-(now.getTimezoneOffset()/60);
    const todayUTC=new Date(Date.UTC(now.getFullYear(),now.getMonth(),now.getDate()));
    prayerTimes=calcPrayerTimesJS(todayUTC,userLat,userLng,tz,method);
  }
  window.prayerTimes=prayerTimes;
  renderPrayerCards();
  if(typeof updateAdhan2Next==='function')updateAdhan2Next();
  // تحديث جدول الإشعارات عند تحديث الأوقات
  if(typeof scheduleAllNotifs==='function')scheduleAllNotifs();
  if(typeof scheduleAdhkar==='function')scheduleAdhkar();
}

function recalcPrayers(){calcPrayers();}

function decToTime(dec){
  if(dec===null||dec===undefined||isNaN(dec))return'--:--';
  let t=((dec%24)+24)%24;
  const h24=Math.floor(t),m=Math.floor((t-h24)*60);
  const ampm=h24>=12?'م':'ص';
  const h12=(h24%12)||12;
  return`${h12.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')} ${ampm}`;
}

function decToDate(dec){
  if(dec===null||dec===undefined||isNaN(dec))return null;
  let t=((dec%24)+24)%24;
  const h=Math.floor(t),m=Math.floor((t-h)*60);
  const now=new Date();
  return new Date(now.getFullYear(),now.getMonth(),now.getDate(),h,m,0,0);
}

const PRAYERS=[
  {key:'fajr',name:'الفجر',icon:'🌙',note:''},
  {key:'sunrise',name:'الشروق',icon:'🌅',note:'ليست فرضاً'},
  {key:'dhuhr',name:'الظهر',icon:'☀️',note:''},
  {key:'asr',name:'العصر',icon:'🌤',note:''},
  {key:'maghrib',name:'المغرب',icon:'🌇',note:''},
  {key:'isha',name:'العشاء',icon:'🌃',note:''}
];

function renderPrayerCards(){
  const now=new Date();
  const grid=document.getElementById('prayers-grid');
  if(!grid)return;
  let nextP=null,nextT=null;
  PRAYERS.forEach(p=>{
    const t=decToDate(prayerTimes[p.key]);
    if(t&&t>now&&(!nextT||t<nextT)){nextT=t;nextP=p;}
  });
  if(!nextP&&prayerTimes.fajr){
    nextP=PRAYERS[0];
    const f=decToDate(prayerTimes.fajr);
    if(f) nextT=new Date(f.getTime()+86400000);
  }
  grid.innerHTML=PRAYERS.map(p=>{
    const tStr=decToTime(prayerTimes[p.key]);
    const t=decToDate(prayerTimes[p.key]);
    const isNext=nextP&&p.key===nextP.key;
    const isPast=t&&t<now;
    return `<div class="prayer-card${isNext?' active-prayer':''}${isPast?' past-prayer':''}">
      <div class="p-icon">${p.icon}</div>
      <div class="p-name">${p.name}</div>
      <div class="p-time" style="color:${isPast?'var(--tm)':isNext?'var(--gold)':'var(--tl)'}">${tStr}</div>
      ${p.note?`<div class="p-note">${_escHtml(p.note)}</div>`:''}
      ${isNext?'<div class="p-next-badge">▶ القادمة</div>':''}
    </div>`;
  }).join('');
  const npName=document.getElementById('np-name');
  const npTime=document.getElementById('np-time');
  const npCdown=document.getElementById('np-cdown');
  if(nextP&&nextT){
    if(npName)npName.textContent=nextP.name+' '+nextP.icon;
    if(npTime)npTime.textContent=decToTime(prayerTimes[nextP.key]);
    if(npCdown){
      const diff=Math.max(0,Math.floor((nextT-now)/1000));
      const hh=Math.floor(diff/3600),mm=Math.floor((diff%3600)/60),ss=diff%60;
      npCdown.textContent=`${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`;
    }
  }
}

function updateCountdown(){
  if(!prayerTimes||!Object.keys(prayerTimes).length)return;
  const now=new Date();
  let nextT=null,nextP=null;
  PRAYERS.forEach(p=>{
    const t=decToDate(prayerTimes[p.key]);
    if(t&&t>now&&(!nextT||t<nextT)){nextT=t;nextP=p;}
  });
  if(!nextP&&prayerTimes.fajr){
    nextP=PRAYERS[0];
    const f=decToDate(prayerTimes.fajr);
    if(f)nextT=new Date(f.getTime()+86400000);
  }
  const el=document.getElementById('np-cdown');
  if(el&&nextT){
    const diff=Math.max(0,Math.floor((nextT-now)/1000));
    const h=Math.floor(diff/3600),m=Math.floor((diff%3600)/60),s=diff%60;
    el.textContent=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }
}

function getLocation(force){
  const el=document.getElementById('loc-name');
  // بدون force: استخدم المحفوظ إن وُجد
  if(!force){
    const _sl=localStorage.getItem('saved_lat'),_sn2=localStorage.getItem('saved_lng');
    const _sname=localStorage.getItem('saved_loc_name');
    if(_sl&&_sn2){
      userLat=parseFloat(_sl);userLng=parseFloat(_sn2);
      if(el)el.textContent=_sname||(userLat.toFixed(2)+'°، '+userLng.toFixed(2)+'°');
      calcPrayers();return;
    }
  }
  if(el) el.textContent='جارٍ تحديد موقعك...';
  if(typeof showToast==='function') showToast('📍 جارٍ تحديد موقعك...');
  if(!navigator.geolocation){
    if(el) el.textContent='المتصفح لا يدعم تحديد الموقع';
    if(typeof showToast==='function') showToast('المتصفح لا يدعم تحديد الموقع');
    userLat=30.0444; userLng=31.2357;
    calcPrayers();
    return;
  }
  navigator.geolocation.getCurrentPosition(
    function(pos){
      userLat=pos.coords.latitude;
      userLng=pos.coords.longitude;
      localStorage.setItem('saved_lat', userLat);
      localStorage.setItem('saved_lng', userLng);
      if(el) el.textContent=userLat.toFixed(3)+'° ، '+userLng.toFixed(3)+'°';
      revGeo(userLat, userLng);
      calcPrayers();
      if(typeof showToast==='function') showToast('✓ تم تحديد موقعك');
    },
    function(err){
      var msg='تعذّر تحديد الموقع';
      if(err && err.code===1) msg='يرجى السماح بالوصول للموقع من إعدادات المتصفح';
      else if(err && err.code===2) msg='الموقع غير متاح الآن';
      else if(err && err.code===3) msg='انتهت مهلة تحديد الموقع';
      if(el) el.textContent=msg;
      if(typeof showToast==='function') showToast(msg);
      // احتياطي القاهرة للحساب فقط
      if(!localStorage.getItem('saved_lat')){
        userLat=30.0444; userLng=31.2357;
        calcPrayers();
      }
    },
    { enableHighAccuracy:true, timeout:15000, maximumAge:0 }
  );
}

async function revGeo(lat,lng){
  try{
    const r=await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
    const d=await r.json();
    const city=d.address?.city||d.address?.town||d.address?.state||'موقعك';
    const country=d.address?.country||'';
    const rName=`${city}, ${country}`;
    document.getElementById('loc-name').textContent=rName;
    localStorage.setItem('saved_loc_name',rName);
  }catch{}
}

