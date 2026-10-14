# إدارة الكتب عبر GitHub فقط (بدون أدمن)

## إضافة كتاب
1. ضع ملف PDF في:
   - `docs/data/books/files/mybook.pdf`
   - `www/data/books/files/mybook.pdf`
2. عدّل `docs/data/books/catalog.json` و `www/data/books/catalog.json`:

```json
[
  {
    "id": "mybook1",
    "title": "عنوان الكتاب",
    "author": "المؤلف",
    "cat": "فقه",
    "hasPdf": true,
    "pdfUrl": "data/books/files/mybook.pdf",
    "coverUrl": "",
    "chapters": []
  }
]
```

3. ارفع:
```bash
git add docs/data/books www/data/books
git commit -m "Add book"
git push
```

## حذف كتاب
1. احذف العنصر من `catalog.json`
2. احذف ملف PDF إن وُجد
3. `git commit` + `git push`

خلال دقيقة بعد التحديث، كل الزوار يرون القائمة الجديدة.
