const express         = require('express');
const router          = express.Router();
const { searchQuran } = require('../services/quranService');

const MAX_Q_LENGTH = 500;

router.post('/', (req, res, next) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ success: false, error: 'الرجاء إدخال سؤال صحيح' });
    }

    if (question.length > MAX_Q_LENGTH) {
      return res.status(400).json({ success: false, error: `السؤال يتجاوز الحد الأقصى (${MAX_Q_LENGTH} حرف)` });
    }

    const result = searchQuran(question.trim());

    if (!result) {
      return res.status(404).json({ success: false, error: 'لا توجد نتيجة مطابقة في قاعدة البيانات' });
    }

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
