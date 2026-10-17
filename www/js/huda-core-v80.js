/* Huda core v80 — hisn back stack + native notifs only (no double handlers) */
(function(){
'use strict';
var subStack=[];
window.hudaGoBack=function(){
  if(subStack.length){
    var it=subStack.pop();
    try{it();}catch(e){}
    return true;
  }
  return false;
};
if(typeof window.openHisnCat==='function'){
  var _oh=window.openHisnCat;
  window.openHisnCat=function(id,name){
    _oh(id,name);
    subStack.push(function(){
      if(typeof renderHisnCats==='function') renderHisnCats();
      var cats=document.getElementById('hisn-cats');
      var view=document.getElementById('hisn-view');
      if(cats) cats.style.display='';
      if(view) view.classList.remove('on');
    });
  };
}
// Capacitor hardware back
try{
  var Cap=window.Capacitor;
  if(Cap&&Cap.Plugins&&Cap.Plugins.App&&Cap.Plugins.App.addListener){
    Cap.Plugins.App.addListener('backButton',function(ev){
      if(window.hudaGoBack()){ /* consumed */ }
      else if(typeof _pageHistory!=='undefined'&&_pageHistory.length>1){
        history.back();
      } else {
        // allow exit
        if(Cap.Plugins.App.exitApp) Cap.Plugins.App.exitApp();
      }
    });
  }
}catch(e){}

window.hudaRequestNotifs=async function(){
  try{
    var Cap=window.Capacitor;
    if(Cap&&Cap.isNativePlatform&&Cap.isNativePlatform()){
      var LN=Cap.Plugins&&Cap.Plugins.LocalNotifications;
      if(LN){
        var perm=await LN.requestPermissions();
        var ok=perm&&(perm.display==='granted'||perm.receive==='granted');
        if(typeof showToast==='function') showToast(ok?'✓ تم تفعيل الإشعارات':'فعّل الإشعارات من إعدادات التطبيق');
        return ok;
      }
    }
    if('Notification' in window){
      var p=await Notification.requestPermission();
      if(typeof showToast==='function') showToast(p==='granted'?'✓ تم تفعيل الإشعارات':'لم يُمنح الإذن');
      return p==='granted';
    }
  }catch(e){}
  return false;
};
window.enableNotifs=window.hudaRequestNotifs;

// Adhan robust play
window.playAdhanNow=function(){
  try{
    var urls=['https://www.islamcan.com/audio/adhan/azan1.mp3','https://www.islamcan.com/audio/adhan/azan2.mp3'];
    try{
      if(typeof ADHAN_SHEIKHS!=='undefined'&&ADHAN_SHEIKHS.length){
        var idx=typeof adhanSheikhIdx==='number'?adhanSheikhIdx:0;
        urls=(ADHAN_SHEIKHS[idx].urls||[]).concat(urls);
      }
    }catch(e){}
    if(!window._adhanAud){window._adhanAud=new Audio();window._adhanAud.setAttribute('playsinline','');}
    var au=window._adhanAud;
    try{au.pause();au.currentTime=0;}catch(e){}
    function next(){
      if(!urls.length){if(typeof showToast==='function')showToast('تعذّر تشغيل الأذان');return;}
      au.src=urls.shift();
      var p=au.play();if(p&&p.catch)p.catch(function(){next();});
    }
    next();
    if(typeof showToast==='function')showToast('🔊 جاري تشغيل الأذان');
  }catch(e){}
};

// Ensure hadiths on open
document.addEventListener('DOMContentLoaded',function(){
  setTimeout(function(){
    try{if(typeof window.HADITHS==='undefined'&&typeof HADITHS!=='undefined')window.HADITHS=HADITHS;}catch(e){}
  },500);
});
})();
