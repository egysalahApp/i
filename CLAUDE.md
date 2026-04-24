# قواعد العمل على هذا المشروع

## القاعدة الذهبية
**إذا لم يعمل درس جديد، أصلح بيانات الدرس (JSON) — لا تُعدّل ملفات المكونات (Components).**

## الملفات المحمية — لا تُعدَّل أبداً لأجل درس جديد
- `src/components/LessonViewer.jsx`
- أي ملف في `src/components/activities/` (MCQ, TapToFill, Classify, Intro, Hotspot, Spotting, ErrorCorrection, Sort, Flashcards, Story, Matching, GoldenEnvelope, StyleLab, Radar, ContrastCards)
- أي ملف في `src/components/ui/` (ResultBox, HintBox, FeedbackBox, SectionFooter)

هذه الملفات مستقرة وتخدم كل الدروس. تعديلها لأجل درس واحد يكسر كل الدروس الأخرى.

## إضافة درس جديد
1. أنشئ ملف JSON في `src/lessons/` بالصيغة الموثقة أدناه
2. ارفعه عبر زر "استيراد ملف JSON" في لوحة التحكم، أو عبر: `node scripts/upload-lesson.js src/lessons/الملف.json`
3. **لا تعدّل أي ملف `.jsx`**

## الترويسة الثابتة لكل الدروس
```json
"headerTitle": "العربية السهلة",
"headerSubtitle": "محمود صلاح"
```

## صيغة JSON المطلوبة

### أسماء المفاتيح الصحيحة (لا تستخدم غيرها)

| المكوّن | المفتاح الصحيح | ❌ لا تستخدم |
|---|---|---|
| نص السؤال | `text` | `question` |
| التغذية الراجعة | `explanation` | `feedback` |
| اسم التصنيف | `label` | `title` |
| وصف بطاقة المقدمة | `desc` | `text`, `description` |
| مهمة Hotspot | `task` | `text` |
| فهرس الإجابة الصحيحة | `correct` | `answer`, `correctIndex` |

### أنواع الأنشطة المتاحة
`intro`, `mcq`, `tap_to_fill`, `classify`, `spotting`, `hotspot`, `error_correction`, `story`, `flashcards`, `sort`, `matching`, `golden_envelope`, `style_lab`, `radar`, `contrast_cards`, `card_quiz`

**كل القيم بحروف إنجليزية صغيرة (lowercase) وبشرطة سفلية (_).**

### الألوان المتاحة لـ theme
`emerald`, `amber`, `indigo`, `purple`, `violet`, `cyan`, `sky`, `rose`, `slate`, `orange`, `blue`

### الفراغات في tap_to_fill
استخدم `...` (ثلاث نقاط) أو `___` (ثلاث شرطات سفلية) داخل نص السؤال.
