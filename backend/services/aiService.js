const config = require('../config');

// يعتمد على fetch المدمج في Node ≥ 18 (لا حاجة لـ node-fetch)
const REQUEST_TIMEOUT_MS = 20_000;

function buildMessages(messages, ragContext) {
  const trimmed = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
  const systemContent = ragContext
    ? `${config.aiSystem}\n\n--- معلومات من قاعدة البيانات الإسلامية (استخدمها فقط إن كانت مرتبطة فعلاً بسؤال المستخدم، وإلا تجاهلها تماماً) ---\n${ragContext}\n---`
    : config.aiSystem;
  return [{ role: 'system', content: systemContent }, ...trimmed];
}

function unavailable() {
  return Object.assign(new Error('تعذّر الاتصال بخدمة الذكاء الاصطناعي'), { status: 503 });
}

async function groqRequest(model, allMessages, stream) {
  const ac  = new AbortController();
  const tid = setTimeout(() => ac.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(`${config.groqBaseUrl}/chat/completions`, {
      method: 'POST', signal: ac.signal,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.groqApiKey}` },
      body: JSON.stringify({
        model, messages: allMessages, stream,
        max_tokens: config.aiMaxTokens, temperature: config.aiTemperature
      })
    });
    // للبث: نترك المؤقت يُلغى عند أول استجابة ناجحة فقط
    clearTimeout(tid);
    return res;
  } catch (err) {
    clearTimeout(tid);
    throw err;
  }
}

/** رد كامل (غير متدفق) */
async function callAI(messages, ragContext = '') {
  if (!config.groqApiKey) throw Object.assign(new Error('خدمة الذكاء الاصطناعي غير مهيّأة على الخادم'), { status: 503 });
  const all = buildMessages(messages, ragContext);
  for (const model of config.groqModels) {
    try {
      const res = await groqRequest(model, all, false);
      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content?.trim();
        if (text && text.length > 5) return cleanResponse(text);
      } else {
        console.warn(`[AI] Model ${model} HTTP ${res.status}`);
      }
    } catch (err) {
      if (err.name !== 'AbortError') console.warn(`[AI] ${model}:`, err.message);
    }
  }
  throw unavailable();
}

/** يرجع Response متدفقاً (SSE بصيغة OpenAI) من أول نموذج يعمل */
async function openStream(messages, ragContext = '') {
  if (!config.groqApiKey) throw Object.assign(new Error('خدمة الذكاء الاصطناعي غير مهيّأة على الخادم'), { status: 503 });
  const all = buildMessages(messages, ragContext);
  for (const model of config.groqModels) {
    try {
      const res = await groqRequest(model, all, true);
      if (res.ok && res.body) return res;
      console.warn(`[AI] Stream model ${model} HTTP ${res.status}`);
    } catch (err) {
      if (err.name !== 'AbortError') console.warn(`[AI] Stream ${model}:`, err.message);
    }
  }
  throw unavailable();
}

function cleanResponse(text) {
  return text.replace(/^(assistant:|AI:)/i, '').trim();
}

module.exports = { callAI, openStream, buildMessages };
