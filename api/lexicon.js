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

  const prompt = `أنت عالم لغوي متخصص في المعاجم العربية والدلالة اللغوية. قدّم شرحاً معجمياً شاملاً ومبسطاً للكلمة التالية.

الكلمة: "${word.trim()}"

أعد الإجابة بصيغة JSON فقط (بدون أي نص إضافي) وفق الهيكل التالي بالضبط:
{
  "word": "الكلمة مع التشكيل الكامل",
  "root": "الجذر الثلاثي أو الرباعي مفصولاً بمسافات (مثل: ك ت ب)",
  "type": "نوع الكلمة نحوياً (اسم / فعل / حرف / صفة...)",
  "pattern": "الوزن الصرفي مع التشكيل (مثل: فَعَلَ)",
  "plural": "جمع الكلمة مع التشكيل إذا كانت اسماً مفرداً (وإلا اتركها فارغة)",
  "singular": "مفرد الكلمة مع التشكيل إذا كانت جمعاً (وإلا اتركها فارغة)",
  "meanings": [
    {
      "meaning": "المعنى الأساسي بلغة واضحة ومبسطة",
      "example": "جملة توضيحية مشكّلة بالكامل تستخدم الكلمة في سياقها الطبيعي"
    }
  ],
  "synonyms": ["مرادف١", "مرادف٢", "مرادف٣"],
  "antonyms": ["ضد١", "ضد٢"],
  "derivatives": [
    {"word": "كلمة مشتقة مع التشكيل", "type": "نوعها (اسم فاعل / مصدر / ...)", "meaning": "معناها باختصار"}
  ],
  "usage_notes": "ملاحظات عن استخدام الكلمة: هل هي فصحى أم عامية، هل لها استخدام خاص في سياق معين، أو أي ملاحظة مهمة. إن لم يوجد اكتب فارغاً."
}

قواعد صارمة:
1. قدّم من ٢ إلى ٤ معانٍ مرتبة من الأكثر شيوعاً إلى الأقل.
2. كل معنى يجب أن يحتوي على مثال تطبيقي واضح ومشكّل بالكامل.
3. المرادفات: من ٢ إلى ٥ كلمات.
4. الأضداد: من ١ إلى ٣ كلمات (إن وجدت، وإلا أعد مصفوفة فارغة).
5. المشتقات: من ٣ إلى ٦ كلمات مشتقة من نفس الجذر.
6. التشكيل الكامل ضروري في كل الأمثلة والكلمات المشتقة.

مهم جداً: أعد JSON خالصاً فقط. لا تكتب أي نص قبله أو بعده. لا تستخدم markdown.`;

  try {
    // Auto-discover available flash models from the API
    let models = [];
    
    if (process.env.GEMINI_MODEL) {
      models.push(process.env.GEMINI_MODEL);
    }

    try {
      const listRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
      );
      if (listRes.ok) {
        const listData = await listRes.json();
        const flashModels = (listData.models || [])
          .filter(m => 
            m.name.includes('flash') && 
            m.supportedGenerationMethods?.includes('generateContent')
          )
          .map(m => m.name.replace('models/', ''))
          .sort((a, b) => {
            const vA = a.match(/(\d+\.?\d*)/)?.[1] || '0';
            const vB = b.match(/(\d+\.?\d*)/)?.[1] || '0';
            return parseFloat(vB) - parseFloat(vA);
          });
        models.push(...flashModels);
      }
    } catch (e) {
      console.warn('Could not auto-discover models, using fallbacks');
    }

    // Fallback if auto-discovery failed
    if (models.length === 0) {
      models = ['gemini-2.5-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash'];
    }

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
              temperature: 0.2,
              maxOutputTokens: 4096,
              responseMimeType: 'application/json',
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
    
    // Handle thinking models
    const parts = data?.candidates?.[0]?.content?.parts || [];
    let text = '';
    for (const part of parts) {
      if (part.text && !part.thought) {
        text = part.text;
        break;
      }
    }
    if (!text && parts.length > 0) {
      text = parts[parts.length - 1].text || '';
    }

    if (!text) {
      console.error('No text in response:', JSON.stringify(data));
      return res.status(502).json({ error: 'لم يتم الحصول على نتيجة. جرّب مرة أخرى.' });
    }

    // Robust JSON extraction
    let cleanJson = text.trim();
    cleanJson = cleanJson.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanJson = jsonMatch[0];
    }

    let result = JSON.parse(cleanJson);

    // Post-process: Apply Arabic Orthography Rules (Golden Rules)
    const applyOrthographyRules = (text) => {
      if (typeof text !== 'string') return text;
      // 1. Move tanween fatha from Alef to the preceding letter (اً -> ًا)
      let newText = text.replace(/\u0627\u064B/g, '\u064B\u0627');
      // 2. Exception: Lam + Tanween + Alef -> Lam + Alef + Tanween (لًا -> لاً)
      newText = newText.replace(/\u0644\u064B\u0627/g, '\u0644\u0627\u064B');
      return newText;
    };

    const applyRulesToObject = (obj) => {
      if (typeof obj === 'string') return applyOrthographyRules(obj);
      if (Array.isArray(obj)) return obj.map(item => applyRulesToObject(item));
      if (obj !== null && typeof obj === 'object') {
        const newObj = {};
        for (const key in obj) newObj[key] = applyRulesToObject(obj[key]);
        return newObj;
      }
      return obj;
    };

    result = applyRulesToObject(result);

    // تجاهل الأوزان للكلمات المعقدة (المصادر الصناعية، الجموع الطويلة، إلخ)
    const isComplex = (w) => {
      if (!w) return false;
      // إزالة التشكيل لمعرفة الطول الحقيقي
      const clean = w.replace(/[\u064B-\u065F\u0670\u0651\u0654\u0655]/g, '').trim();
      return (
        (clean.endsWith('ية') && clean.length > 4) || // إنسانية، ديمقراطية (وليس حرية)
        (clean.endsWith('يات') && clean.length > 5) || // إنسانيات
        clean.length > 7 // الكلمات الطويلة جداً
      );
    };

    // إذا كانت الكلمة معقدة، نحذف الوزن الصرفي
    if (isComplex(result.word) || isComplex(word)) {
      result.pattern = null;
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error('Lexicon API error:', err.message, err.stack);
    return res.status(500).json({ error: 'حدث خطأ أثناء التحليل. جرّب كلمة أخرى.' });
  }
}
