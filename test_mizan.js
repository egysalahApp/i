import { config } from 'dotenv';
config({ path: '.env' });

const handler = async () => {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `أنت عالم لغوي متخصص في الصرف العربي والتحليل الصرفي. حلّل الكلمة التالية تحليلاً صرفيًا دقيقًا ومفصلاً.

الكلمة: "استغفر"

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
   - الإعلال/الإبدال: مثل "قال" (أصلها قَوَلَ → فَعَلَ)
   - الإدغام: شدّ أصلها شَدَدَ → فَعَلَ
   - الحذف: قاضٍ أصلها قاضِيٌ → فاعِلٌ
2. التشكيل الكامل ضروري للكلمة والوزن.
3. letterBreakdown: قاعدة ذهبية: كل عنصر يحتوي على حرف أساسي واحد فقط مع حركته (مثل: "مُ"). لا تدمج حرفين مختلفين أبداً في عنصر واحد.
   - الشدة (ّ) تبقى مع حرفها. إذا كانت الشدة نتيجة إدغام حرفين أصليين (مثل "رِّ" في "حُرِّيَّة" التي أصلها "ح ر ر")، فاكتب الحرفين المقابلين في الوزن (مثل "عْلِ").
   مثال صحيح لكلمة كَتَبَ: [{"wordLetter":"كَ","patternLetter":"فَ","isRoot":true},{"wordLetter":"تَ","patternLetter":"عَ","isRoot":true},{"wordLetter":"بَ","patternLetter":"لَ","isRoot":true}]
   مثال صحيح لكلمة حُرِّيَّة (وزنها فُعْلِيَّة والجذر ح ر ر): [{"wordLetter":"حُ","patternLetter":"فُ","isRoot":true},{"wordLetter":"رِّ","patternLetter":"عْلِ","isRoot":true},{"wordLetter":"يَّ","patternLetter":"يَّ","isRoot":false},{"wordLetter":"ة","patternLetter":"ة","isRoot":false}]
4. morphNotes: اذكر أي تغيير صرفي حدث (إعلال/إبدال/حذف/إدغام). إن لم يوجد اكتب "لا يوجد".
5. type: حدد بدقة (فعل ثلاثي مجرد، فعل ثلاثي مزيد بالهمزة، اسم فاعل، اسم مفعول، مصدر، صفة مشبهة، اسم تفضيل، اسم زمان، اسم مكان، اسم آلة، صيغة مبالغة، فعل رباعي...).

مهم جداً: أعد JSON خالصاً فقط. لا تكتب أي نص قبله أو بعده. لا تستخدم markdown.` }] }],
        generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
      }),
    });
    const d = await res.json();
    console.log(d.candidates[0].content.parts[0].text);
  } catch(e) {
    console.error(e);
  }
};
handler();
