/* عنوان الباك إند (الذكاء الاصطناعي).
   • تطوير على الشبكة المحلية (http): يُكتشف تلقائياً من عنوان الصفحة نفسه + المنفذ 3000.
   • إنتاج / تطبيق أندرويد: ضع رابط السيرفر https هنا، مثال: 'https://huda-api.up.railway.app/api' */
(function () {
  var PRODUCTION_BACKEND = ''; // ← ضع رابط السيرفر المرفوع هنا عند النشر
  var url = PRODUCTION_BACKEND;
  if (!url && /^https?:$/.test(location.protocol) && location.protocol === 'http:') {
    url = 'http://' + location.hostname + ':3000/api';
  }
  window.HUDA_CONFIG = {
  adminKey: 'huda-admin-13-4-2024', backendUrl: url || 'http://localhost:3000/api' };
})();
