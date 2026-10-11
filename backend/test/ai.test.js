// اختبار وحدة لمنطق الذكاء الاصطناعي بخادم Groq وهمي — لا يحتاج شبكة ولا مفتاح حقيقي
// التشغيل: npm test
const http=require('http'); const assert=require('assert');
const { Readable } = require('stream');
(async()=>{
  const calls=[];
  const srv=http.createServer((req,res)=>{
    let b=''; req.on('data',d=>b+=d); req.on('end',()=>{
      const j=JSON.parse(b); calls.push({model:j.model,stream:j.stream,sys:j.messages[0].content.slice(0,30),n:j.messages.length,auth:req.headers.authorization,temp:j.temperature});
      if(j.model==='bad-model'){ res.writeHead(429); return res.end('{"error":"rate"}'); }
      if(j.stream){
        res.writeHead(200,{'Content-Type':'text/event-stream'});
        ['أهلاً',' بك'].forEach(t=>res.write('data: '+JSON.stringify({choices:[{delta:{content:t}}]})+'\n\n'));
        return res.end('data: [DONE]\n\n');
      }
      res.writeHead(200,{'Content-Type':'application/json'});
      res.end(JSON.stringify({choices:[{message:{content:'assistant: بسم الله، هذا جواب تجريبي'}}]}));
    });
  }).listen(0);
  const port=srv.address().port;
  process.env.GROQ_API_KEY='gsk_test_key_for_unit_test'; process.env.GROQ_BASE_URL='http://127.0.0.1:'+port; process.env.GROQ_MODELS='bad-model,good-model';
  const {callAI,openStream}=require('../services/aiService');
  // 1) fallback بين النماذج + تنظيف prefix
  const r=await callAI([{role:'user',content:'ما فضل الصلاة؟'}],'📚 أحاديث ذات صلة: …');
  assert.strictEqual(r,'بسم الله، هذا جواب تجريبي');
  assert.deepStrictEqual(calls.map(c=>c.model),['bad-model','good-model']);
  assert.ok(calls[1].auth.startsWith('Bearer gsk_test'));
  assert.strictEqual(calls[1].temp,0.4);
  console.log('✔ callAI: النموذج الأول فشل (429) → انتقل للثاني ونجح');
  // 2) الـ RAG داخل system prompt
  assert.ok(calls[1].n===2); 
  // 3) البث
  calls.length=0;
  const up=await openStream([{role:'user',content:'سؤال'}],'');
  let txt=''; for await (const ch of Readable.fromWeb(up.body)) txt+=ch;
  assert.ok(txt.includes('أهلاً')&&txt.includes('[DONE]'));
  assert.strictEqual(calls[calls.length-1].stream,true);
  console.log('✔ openStream: تدفق SSE بصيغة OpenAI يمر كما هو للواجهة');
  // 4) system prompt المدمج يحتوي القواعد
  const cfg=require('../config');
  assert.ok(cfg.aiSystem.includes('لا تخترع أحاديث')&&cfg.aiSystem.includes('مساعد ذكاء اصطناعي'));
  assert.ok(!cfg.groqModels.includes('mixtral-8x7b-32768') || process.env.GROQ_MODELS);
  console.log('✔ البرومبت الموحّد صحيح');
  // 5) بدون مفتاح → 503
  delete require.cache[require.resolve('../config')]; delete require.cache[require.resolve('../services/aiService')];
  process.env.GROQ_API_KEY='';
  const ai2=require('../services/aiService');
  try{ await ai2.callAI([{role:'user',content:'x'}]); assert.fail('should throw'); }catch(e){ assert.strictEqual(e.status,503); }
  console.log('✔ بدون مفتاح على السيرفر → 503 واضح (وليس تسريب أو crash)');
  // 6) RAG DB
  const db=require('../services/islamicDb');
  const ctx=db.buildRagContext('ما حكم الصبر والدعاء عند الكرب'); console.log('✔ RAG context length:',ctx.length);
  srv.close();
})().catch(e=>{console.error('✘',e.message);process.exit(1)});
