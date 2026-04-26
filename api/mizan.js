export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { word } = req.body;
  if (!word || typeof word !== 'string' || word.trim().length === 0) {
    return res.status(400).json({ error: 'الكلمة مطلوبة' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'مفتاح API غير مُعدّ' });
  }

  const prompt = `أنت عالم لغوي متخصص في الصرف العربي. حلّل الكلمة التالية تحليلاً صرفيًا دقيقًا.

الكلمة: "${word.trim()}"

أعد الإجابة بصيغة JSON فقط (بدون أي نص إضافي) وفق الهيكل التالي:
{
  "word": "الكلمة مع التشكيل الكامل",
  "root": "الجذر الثلاثي أو الرباعي (مثل: ك ت ب)",
  "pattern": "الوزن الصرفي مع التشكيل (مثل: فَعَلَ)",
  "type": "نوع الكلمة (فعل ثلاثي مجرد / فعل ثلاثي مزيد / فعل رباعي / اسم فاعل / اسم مفعول / مصدر / صفة مشبهة / اسم تفضيل / اسم زمان / اسم مكان / اسم آلة / صيغة مبالغة / ...)",
  "letterBreakdown": [
    {"wordLetter": "حرف من الكلمة", "patternLetter": "الحرف المقابل في الوزن", "isRoot": true أو false}
  ],
  "morphNotes": "ملاحظات صرفية مثل الإعلال أو الإبدال أو الحذف أو الإدغام إن وجدت، وإلا اتركه فارغًا",
  "explanation": "شرح مختصر وواضح للوزن ودلالته"
}

قواعد مهمة:
- راعِ الإعلال (مثل: قال ← قَوَلَ على وزن فَعَلَ) والإبدال والحذف والإدغام.
- التشكيل الكامل ضروري للكلمة والوزن.
- letterBreakdown يجب أن يحتوي على حرف واحد لكل موضع مع المقابل له في الوزن.
- isRoot = true فقط للحروف الأصلية من الجذر (المقابلة لـ ف ع ل في الوزن).
- أعد JSON صالحًا فقط بدون markdown أو backticks.`;

  try {
    // Try multiple models in order of preference
    const models = ['gemini-2.5-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash'];
    let response;
    let lastError = '';

    for (const model of models) {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 1024,
            },
          }),
        }
      );

      if (response.ok) break;
      lastError = await response.text();
      console.error(`Model ${model} failed:`, lastError);
    }

    if (!response.ok) {
      console.error('All models failed. Last error:', lastError);
      return res.status(502).json({ error: 'خطأ في الاتصال بخدمة التحليل. جرّب مرة أخرى.' });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(502).json({ error: 'لم يتم الحصول على نتيجة' });
    }

    // Parse the JSON response (strip any markdown code fences if present)
    const cleanJson = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const result = JSON.parse(cleanJson);

    return res.status(200).json(result);
  } catch (err) {
    console.error('Mizan API error:', err);
    return res.status(500).json({ error: 'حدث خطأ أثناء التحليل' });
  }
}
