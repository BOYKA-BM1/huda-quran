
/* Huda persist v62 — حفظ كل الإعدادات والخطة والموضع */
(function(){
  var KEYS = [
    'huda_khatma_plan_v1','huda_khatma_bm','nq_rec','nq_rate','nq_pos','nq_last_ayah',
    'nq_gapless','nq_theme','nq_font','huda_settings','huda_favorites','huda_notes',
    'huda_tasbeeh','huda_hifz','huda_khatma_rem_fired'
  ];
  function snap(){
    var o={};
    KEYS.forEach(function(k){
      try{ var v=localStorage.getItem(k); if(v!=null) o[k]=v; }catch(e){}
    });
    // collect all huda_ and nq_ keys
    try{
      for(var i=0;i<localStorage.length;i++){
        var k=localStorage.key(i);
        if(k && (k.indexOf('huda_')===0 || k.indexOf('nq_')===0 || k.indexOf('tasbeeh')>=0)) o[k]=localStorage.getItem(k);
      }
    }catch(e){}
    return o;
  }
  function saveBackup(){
    try{
      var o=snap();
      localStorage.setItem('huda_persist_backup_v1', JSON.stringify(o));
      // IndexedDB light backup
      if(!window.indexedDB) return;
      var req=indexedDB.open('huda_persist_db',1);
      req.onupgradeneeded=function(e){ e.target.result.createObjectStore('kv'); };
      req.onsuccess=function(e){
        try{
          var db=e.target.result;
          var tx=db.transaction('kv','readwrite');
          tx.objectStore('kv').put(o, 'backup');
        }catch(err){}
      };
    }catch(e){}
  }
  function restoreBackup(){
    try{
      // if khatma missing try restore
      if(!localStorage.getItem('huda_khatma_plan_v1')){
        var raw=localStorage.getItem('huda_persist_backup_v1');
        if(raw){
          var o=JSON.parse(raw);
          Object.keys(o||{}).forEach(function(k){
            if(localStorage.getItem(k)==null && o[k]!=null) localStorage.setItem(k,o[k]);
          });
        }
      }
    }catch(e){}
    // IDB restore async
    try{
      if(!window.indexedDB) return;
      var req=indexedDB.open('huda_persist_db',1);
      req.onupgradeneeded=function(e){ e.target.result.createObjectStore('kv'); };
      req.onsuccess=function(e){
        try{
          var db=e.target.result;
          var tx=db.transaction('kv','readonly');
          var g=tx.objectStore('kv').get('backup');
          g.onsuccess=function(){
            var o=g.result;
            if(!o) return;
            Object.keys(o).forEach(function(k){
              try{ if(localStorage.getItem(k)==null && o[k]!=null) localStorage.setItem(k,o[k]); }catch(e){}
            });
          };
        }catch(err){}
      };
    }catch(e){}
  }
  restoreBackup();
  window.addEventListener('beforeunload', saveBackup);
  window.addEventListener('pagehide', saveBackup);
  document.addEventListener('visibilitychange', function(){ if(document.visibilityState==='hidden') saveBackup(); });
  setInterval(saveBackup, 15000);
  // patch localStorage.setItem to auto-backup critical
  try{
    var _set=localStorage.setItem.bind(localStorage);
    localStorage.setItem=function(k,v){ _set(k,v); if(k&&(k.indexOf('huda_')===0||k.indexOf('nq_')===0)) { try{ saveBackup(); }catch(e){} } };
  }catch(e){}
  window.HudaPersist={save:saveBackup,restore:restoreBackup};
})();
