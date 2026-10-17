/* Huda persist v76 */
(function () {
  'use strict';
  function isCritical(k) {
    if (!k) return false;
    return k.indexOf('huda_')===0 || k.indexOf('nq_')===0 || k.indexOf('saved_')===0 || k.indexOf('tasbeeh')>=0;
  }
  function snap() {
    var o={};
    try {
      for (var i=0;i<localStorage.length;i++){
        var k=localStorage.key(i);
        if (isCritical(k)) o[k]=localStorage.getItem(k);
      }
    } catch(e){}
    return o;
  }
  function saveBackup(){
    try {
      var o=snap();
      localStorage.setItem('huda_persist_backup_v1', JSON.stringify(o));
      if(!window.indexedDB) return;
      var req=indexedDB.open('huda_persist_db',1);
      req.onupgradeneeded=function(e){var db=e.target.result;if(!db.objectStoreNames.contains('kv'))db.createObjectStore('kv');};
      req.onsuccess=function(e){try{var db=e.target.result;var tx=db.transaction('kv','readwrite');tx.objectStore('kv').put(o,'backup');}catch(err){}};
    } catch(e){}
  }
  function restoreFromObj(o){
    if(!o)return;
    Object.keys(o).forEach(function(k){
      try{if(localStorage.getItem(k)==null&&o[k]!=null)localStorage.setItem(k,o[k]);}catch(e){}
    });
  }
  function restoreBackup(){
    try{var raw=localStorage.getItem('huda_persist_backup_v1');if(raw)restoreFromObj(JSON.parse(raw));}catch(e){}
    try{
      if(!window.indexedDB)return;
      var req=indexedDB.open('huda_persist_db',1);
      req.onupgradeneeded=function(e){var db=e.target.result;if(!db.objectStoreNames.contains('kv'))db.createObjectStore('kv');};
      req.onsuccess=function(e){try{var db=e.target.result;var tx=db.transaction('kv','readonly');var g=tx.objectStore('kv').get('backup');g.onsuccess=function(){restoreFromObj(g.result);};}catch(err){}};
    }catch(e){}
  }
  restoreBackup();
  window.addEventListener('beforeunload', saveBackup);
  window.addEventListener('pagehide', saveBackup);
  document.addEventListener('visibilitychange', function(){if(document.visibilityState==='hidden')saveBackup();});
  setInterval(saveBackup, 10000);
  try{
    var _set=localStorage.setItem.bind(localStorage);
    localStorage.setItem=function(k,v){_set(k,v);if(isCritical(k)){try{saveBackup();}catch(e){}}};
  }catch(e){}
  window.HudaPersist={save:saveBackup,restore:restoreBackup};
})();
