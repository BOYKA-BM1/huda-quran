# صلاحيات أندرويد — الموقع والإشعارات

في الملف:
android/app/src/main/AndroidManifest.xml

داخل <manifest> أضف إن لم تكن موجودة:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
```

التحديث التلقائي:
capacitor.config.json يستخدم:
"url": "https://boyka-bm1.github.io/huda-quran/"
أي تحديث على الموقع يظهر في التطبيق بعد إعادة فتحه أو سحب للتحديث.
