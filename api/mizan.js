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

  const prompt = `أنت عالم لغوي متخصص في الصرف العربي والتحليل الصرفي. حلّل الكلمة التالية تحليلاً صرفيًا دقيقًا ومفصلاً.

الكلمة: "${word.trim()}"

أعد الإجابة بصيغة JSON فقط (بدون أي نص إضافي أو شرح خارج JSON) وفق الهيكل التالي بالضبط:
{
  "word": "الكلمة مع التشكيل الكامل",
  "root": "الجذر الثلاثي أو الرباعي مفصولاً بمسافات (مثل: ك ت ب)",
  "pattern": "الوزن الصرفي مع التشكيل (مثل: فَعَلَ)",
  "type": "نوع الكلمة",
  "letterBreakdown": [
    {"wordLetter": "حرف مع حركته", "patternLetter": "حرف مع حركته", "isRoot": true}
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
2. التشكيل الكامل ضروري للكلمة والوزن.
3. letterBreakdown: قاعدة ذهبية: كل عنصر يحتوي على حرف أساسي واحد فقط مع حركته (مثل: "مُ"). لا تدمج حرفين مختلفين أبداً في عنصر واحد (مثلاً "ري" أو "لي" خطأ، يجب فصلهما إلى عنصرين). الشدة (ّ) تبقى مع حرفها لأنها ليست حرفاً منفصلاً. isRoot = true فقط لحروف الجذر.
   مثال صحيح لكلمة كَتَبَ: [{"wordLetter":"كَ","patternLetter":"فَ","isRoot":true},{"wordLetter":"تَ","patternLetter":"عَ","isRoot":true},{"wordLetter":"بَ","patternLetter":"لَ","isRoot":true}]
   مثال صحيح لكلمة حُرِّيَّة: [{"wordLetter":"حُ","patternLetter":"فُ","isRoot":true},{"wordLetter":"رِّ","patternLetter":"عِّ","isRoot":true},{"wordLetter":"يَّ","patternLetter":"يَّ","isRoot":false},{"wordLetter":"ة","patternLetter":"ة","isRoot":false}]
4. morphNotes: اذكر أي تغيير صرفي حدث (إعلال/إبدال/حذف/إدغام). إن لم يوجد اكتب "لا يوجد".
5. type: حدد بدقة (فعل ثلاثي مجرد، فعل ثلاثي مزيد بالهمزة، اسم فاعل، اسم مفعول، مصدر، صفة مشبهة، اسم تفضيل، اسم زمان، اسم مكان، اسم آلة، صيغة مبالغة، فعل رباعي...).

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
            // Prefer newer versions (higher numbers first)
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
              temperature: 0.1,
              maxOutputTokens: 2048,
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
    
    // Handle thinking models: find the part with actual text (not thought)
    const parts = data?.candidates?.[0]?.content?.parts || [];
    let text = '';
    for (const part of parts) {
      if (part.text && !part.thought) {
        text = part.text;
        break;
      }
    }
    // Fallback: take last part's text
    if (!text && parts.length > 0) {
      text = parts[parts.length - 1].text || '';
    }

    if (!text) {
      console.error('No text in response:', JSON.stringify(data));
      return res.status(502).json({ error: 'لم يتم الحصول على نتيجة. جرّب مرة أخرى.' });
    }

    // Robust JSON extraction
    let cleanJson = text.trim();
    // Remove markdown code fences
    cleanJson = cleanJson.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    // Try to find JSON object if wrapped in extra text
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanJson = jsonMatch[0];
    }

    const result = JSON.parse(cleanJson);

    // Post-process: merge any split diacritics back with their base letter
    if (result.letterBreakdown && Array.isArray(result.letterBreakdown)) {
      const diacriticsRegex = /^[\u064B-\u065F\u0670\u0651]+$/;
      const merged = [];
      for (let i = 0; i < result.letterBreakdown.length; i++) {
        const item = result.letterBreakdown[i];
        // If this item's wordLetter is ONLY diacritics, merge with previous
        if (diacriticsRegex.test(item.wordLetter) && merged.length > 0) {
          merged[merged.length - 1].wordLetter += item.wordLetter;
          merged[merged.length - 1].patternLetter += (item.patternLetter || '');
        } else if (diacriticsRegex.test(item.patternLetter) && !item.wordLetter && merged.length > 0) {
          merged[merged.length - 1].patternLetter += item.patternLetter;
        } else {
          merged.push({ ...item });
        }
      }

      // Post-process: split any entry with multiple base letters (e.g. "ري" → "ر" + "ي")
      const baseLetterRegex = /[\u0621-\u064A\u0671-\u06D3]/g;
      const splitCluster = (text) => {
        if (!text) return [];
        const clusters = text.match(/[\u0621-\u064A\u0671-\u06D3][\u064B-\u065F\u0670\u0651]*/g);
        return clusters || [text];
      };

      const finalBreakdown = [];
      for (const item of merged) {
        const wClusters = splitCluster(item.wordLetter);
        const pClusters = splitCluster(item.patternLetter);
        const maxLen = Math.max(wClusters.length, pClusters.length);
        
        if (maxLen <= 1) {
          finalBreakdown.push(item);
        } else {
          // Split into separate entries
          for (let j = 0; j < maxLen; j++) {
            finalBreakdown.push({
              wordLetter: wClusters[j] || '',
              patternLetter: pClusters[j] || '',
              isRoot: item.isRoot
            });
          }
        }
      }
      result.letterBreakdown = finalBreakdown;
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error('Mizan API error:', err.message, err.stack);
    return res.status(500).json({ error: 'حدث خطأ أثناء التحليل. جرّب كلمة أخرى.' });
  }
}
