import fetch from 'node-fetch';
import { config } from 'dotenv';
config({ path: '.env' });

const handler = async () => {
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `أنت عالم لغوي متخصص في الصرف العربي والتحليل الصرفي. حلّل الكلمة التالية تحليلاً صرفيًا دقيقًا ومفصلاً.

الكلمة: "سيّئ"

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
   - الإعلال بالقلب: قال أصلها قَوَلَ → فَعَلَ (الواو قُلبت ألفاً)
   - الإعلال بالحذف: عِدْ أصلها وَعَدَ → فَعَلَ (حُذفت الواو)
   - الإعلال بالنقل: يقول أصلها يَقْوُلُ → يَفْعُلُ
   - الإبدال: اضطرب أصلها اضْتَرَبَ → افْتَعَلَ (التاء أُبدلت طاءً)
   - الإدغام: شدّ أصلها شَدَدَ → فَعَلَ
   - الحذف: قاضٍ أصلها قاضِيٌ → فاعِلٌ
3. انتبه للكلمات المعقدة إملائياً وصرفياً:
   - الكلمات مثل (سَيِّئ، سَيِّد، مَيِّت، جَيِّد، هَيِّن، لَيِّن): وزنها "فَيْعِل". الشدة فيها عبارة عن ياء الوزن الزائدة + عين الكلمة (الواو أو الياء الأصلية) التي أُدغمت فيها. جذورها هي (س و أ، س و د، م و ت، الخ).
   - الشدة (ّ) في الكلمات المضعفة (مثل حُرِّيَّة من ح ر ر) تُقابل بحرفين في الوزن (مثل عْلِ).
4. letterBreakdown: قاعدة ذهبية: كل عنصر يحتوي على حرف أساسي واحد فقط مع حركته (مثل: "مُ"). لا تدمج حرفين مختلفين أبداً في عنصر واحد.
   - إذا كانت الشدة نتيجة إدغام حرفين (مثل رِّ)، فاكتب الحرفين المقابلين في الوزن (مثل عْلِ).
   - بالنسبة لكلمة مثل "سَيِّئ": السين تقابل الفاء (فَـ)، والياء المشددة تقابل الياء المفتوحة الزائدة والعين المكسورة (يْعِـ)، والهمزة تقابل اللام (لٌ).
   مثال صحيح لكلمة كَتَبَ: [{"wordLetter":"كَ","patternLetter":"فَ","isRoot":true},{"wordLetter":"تَ","patternLetter":"عَ","isRoot":true},{"wordLetter":"بَ","patternLetter":"لَ","isRoot":true}]
   مثال صحيح لكلمة سَيِّئ: [{"wordLetter":"سَ","patternLetter":"فَ","isRoot":true},{"wordLetter":"يِّ","patternLetter":"يْعِ","isRoot":true},{"wordLetter":"ئٌ","patternLetter":"لٌ","isRoot":true}]

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
