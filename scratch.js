import { config } from 'dotenv';
config({ path: '.env' });
const word = "تَحِيَّة";
const prompt = `أنت عالم لغوي متخصص في الصرف العربي والتحليل الصرفي. حلّل الكلمة التالية تحليلاً صرفيًا دقيقًا ومفصلاً.

الكلمة: "${word.trim()}"

أعد الإجابة بصيغة JSON فقط (بدون أي نص إضافي أو شرح خارج JSON) وفق الهيكل التالي بالضبط:
{
  "word": "الكلمة مع التشكيل الكامل",
  "root": "الجذر الثلاثي أو الرباعي مفصولاً بمسافات (مثل: ك ت ب)",
  "pattern": "الوزن الصرفي مع التشكيل (مثل: فَعَلَ)",
  "type": "نوع الكلمة",
  "letterBreakdown": [
    {"wordLetter": "حرف", "patternLetter": "حرف", "isRoot": true}
  ],
  "morphNotes": "ملاحظات صرفية",
  "explanation": "شرح مختصر"
}

قواعد صارمة يجب اتباعها:
1. راعِ جميع التغييرات الصرفية:
2. التشكيل الكامل ضروري للكلمة والوزن.
3. letterBreakdown: قاعدة ذهبية: كل عنصر يحتوي على حرف أساسي واحد فقط مع حركته (مثل: "مُ"). لا تدمج حرفين مختلفين أبداً في عنصر واحد.
   - الشدة (ّ) تبقى مع حرفها. إذا كانت الشدة نتيجة إدغام حرفين أصليين (مثل "رِّ" في "حُرِّيَّة" التي أصلها "ح ر ر")، فاكتب الحرفين المقابلين في الوزن (مثل "عْلِ").
   مثال صحيح لكلمة كَتَبَ: [{"wordLetter":"كَ","patternLetter":"فَ","isRoot":true},{"wordLetter":"تَ","patternLetter":"عَ","isRoot":true},{"wordLetter":"بَ","patternLetter":"لَ","isRoot":true}]
   مثال صحيح لكلمة حُرِّيَّة (وزنها فُعْلِيَّة والجذر ح ر ر): [{"wordLetter":"حُ","patternLetter":"فُ","isRoot":true},{"wordLetter":"رِّ","patternLetter":"عْلِ","isRoot":true},{"wordLetter":"يَّ","patternLetter":"يَّ","isRoot":false},{"wordLetter":"ة","patternLetter":"ة","isRoot":false}]
4. morphNotes: اذكر أي تغيير صرفي حدث (إعلال/إبدال/حذف/إدغام). إن لم يوجد اكتب "لا يوجد".

مهم جداً: أعد JSON خالصاً فقط. لا تكتب أي نص قبله أو بعده. لا تستخدم markdown.`;

fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
  }),
}).then(r => r.json()).then(d => {
  if(d.error) console.error(d.error);
  else console.log(JSON.stringify(JSON.parse(d.candidates[0].content.parts[0].text), null, 2));
});
