import { z } from 'zod';

/**
 * Common Schemas
 */
const ThemeSchema = z.enum(['emerald', 'orange', 'indigo', 'purple', 'violet', 'cyan', 'sky', 'rose', 'slate', 'lime', 'blue']);

// Base for all sections
const BaseSectionSchema = z.object({
  id: z.string().min(1, "معرف القسم مطلوب"),
  title: z.string().min(1, "عنوان القسم مطلوب"),
  theme: ThemeSchema.optional(), // Make optional since we have auto-theme now
  description: z.string().optional(),
});

/**
 * Activity Specific Schemas
 */

// Intro Section
const IntroContentSchema = z.object({
  icon: z.string().optional(),
  title: z.string().optional(),
  desc: z.string().optional(),
  theme: ThemeSchema.optional(),
  examples: z.string().optional(),
});

const IntroSchema = BaseSectionSchema.extend({
  type: z.literal('intro'),
  content: z.array(IntroContentSchema).min(1, "يجب إضافة محتوى واحد على الأقل للمقدمة"),
});

// MCQ & Tap to Fill
const McqQuestionSchema = z.object({
  text: z.string().min(1, "نص السؤال مطلوب"),
  options: z.array(z.string()).min(2, "يجب وجود خيارين على الأقل"),
  correct: z.number().int().min(0, "فهرس الإجابة غير صحيح"),
  hint: z.string().optional(),
  explanation: z.string().optional(),
});

const McqSchema = BaseSectionSchema.extend({
  type: z.literal('mcq'),
  questions: z.array(McqQuestionSchema).min(1, "يجب إضافة سؤال واحد على الأقل"),
});

const TapToFillSchema = BaseSectionSchema.extend({
  type: z.literal('tap_to_fill'),
  questions: z.array(McqQuestionSchema).min(1, "يجب إضافة سؤال واحد على الأقل"),
});

// Classify
const CategorySchema = z.object({
  id: z.string(),
  label: z.string(),
  theme: ThemeSchema.optional(),
});

const ClassifyQuestionSchema = z.object({
  text: z.string(),
  categoryId: z.string(),
  hint: z.string().optional(),
  explanation: z.string().optional(),
});

const ClassifySchema = BaseSectionSchema.extend({
  type: z.literal('classify'),
  categories: z.array(CategorySchema).min(2, "يجب وجود تصنيفين على الأقل"),
  questions: z.array(ClassifyQuestionSchema).min(1, "يجب إضافة سؤال واحد على الأقل"),
});

// Story
const StorySlideSchema = z.object({
  title: z.string().optional(),
  text: z.string(),
  icon: z.string().optional(),
  image: z.string().optional(),
  audio: z.string().optional(),
});

const StorySchema = BaseSectionSchema.extend({
  type: z.literal('story'),
  slides: z.array(StorySlideSchema).min(1, "يجب إضافة شريحة واحدة على الأقل"),
});

// Flashcards
const FlashcardSchema = z.object({
  front: z.string(),
  back: z.string(),
  hint: z.string().optional(),
  explanation: z.string().optional(),
});

const FlashcardsSchema = BaseSectionSchema.extend({
  type: z.literal('flashcards'),
  cards: z.array(FlashcardSchema).min(1, "يجب إضافة بطاقة واحدة على الأقل"),
});

// Radar
const RadarBranchSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  text: z.string(),
  color: z.string().optional(),
  icon: z.string().optional(),
});

const RadarSchema = BaseSectionSchema.extend({
  type: z.literal('radar'),
  mapData: z.object({
    center: z.object({
      title: z.string(),
      text: z.string(),
    }),
    branches: z.array(RadarBranchSchema),
  }),
});

// Matching
const MatchingPairSchema = z.object({
  id: z.string().optional(),
  left: z.string(),
  right: z.string(),
  desc: z.string().optional(),
});

const MatchingSchema = BaseSectionSchema.extend({
  type: z.literal('matching'),
  swapColumns: z.boolean().optional(),
  pairs: z.array(MatchingPairSchema).min(1, "يجب إضافة زوج واحد على الأقل"),
});

// Contrast Cards
const ContrastCardsSchema = BaseSectionSchema.extend({
  type: z.literal('contrast_cards'),
  pairs: z.array(MatchingPairSchema).min(1, "يجب إضافة زوج واحد على الأقل"),
});

// Hotspot & Spotting
const HotspotQuestionSchema = z.object({
  task: z.string().optional(),
  text: z.string().optional(),
  words: z.array(z.string()).optional(),
  targetIndex: z.number().optional(),
  targetIndices: z.array(z.number()).optional(),
  paragraph: z.array(z.object({
    id: z.string(),
    text: z.string(),
    isTarget: z.boolean(),
  })).optional(),
  requiredCount: z.number().optional(),
  hint: z.string().optional(),
  explanation: z.string().optional(),
});

const HotspotSchema = BaseSectionSchema.extend({
  type: z.literal('hotspot'),
  questions: z.array(HotspotQuestionSchema),
});

const SpottingSchema = BaseSectionSchema.extend({
  type: z.literal('spotting'),
  questions: z.array(HotspotQuestionSchema),
});

// Error Correction
const ErrorCorrectionQuestionSchema = z.object({
  text: z.string().optional(),
  words: z.array(z.string()),
  errorWordIndex: z.number().int(),
  options: z.array(z.string()),
  correctOptionIndex: z.number().int().optional(), // Support both formats
  correct: z.number().int().optional(),
  hint: z.string().optional(),
  explanation: z.string().optional(),
});

const ErrorCorrectionSchema = BaseSectionSchema.extend({
  type: z.literal('error_correction'),
  questions: z.array(ErrorCorrectionQuestionSchema),
});

// Sort
const SortQuestionSchema = z.object({
  text: z.string(),
  options: z.array(z.string()).optional(),
  correct: z.number().optional(),
  correctOrder: z.array(z.string()).optional(),
  hint: z.string().optional(),
  explanation: z.string().optional(),
});

const SortSchema = BaseSectionSchema.extend({
  type: z.literal('sort'),
  questions: z.array(SortQuestionSchema),
});

// Ordering (drag-and-reorder)
const OrderingQuestionSchema = z.object({
  text: z.string(),
  correctOrder: z.array(z.string()).min(2, "يجب إضافة عنصرين على الأقل"),
  hint: z.string().optional(),
  explanation: z.string().optional(),
});

const OrderingSchema = BaseSectionSchema.extend({
  type: z.literal('ordering'),
  questions: z.array(OrderingQuestionSchema).min(1, "يجب إضافة سؤال واحد على الأقل"),
});
// Sentence Builder & Word Builder (shared schema, different types)
const BuilderQuestionSchema = z.object({
  text: z.string().min(1, "نص السؤال مطلوب"),
  fragments: z.array(z.string()).min(2, "يجب إضافة قطعتين على الأقل"),
  correctOrder: z.array(z.string()).min(2, "يجب تحديد الترتيب الصحيح"),
  hint: z.string().optional(),
  explanation: z.string().optional(),
});

const SentenceBuilderSchema = BaseSectionSchema.extend({
  type: z.literal('sentence_builder'),
  questions: z.array(BuilderQuestionSchema).min(1, "يجب إضافة سؤال واحد على الأقل"),
});

const WordBuilderSchema = BaseSectionSchema.extend({
  type: z.literal('word_builder'),
  questions: z.array(BuilderQuestionSchema).min(1, "يجب إضافة سؤال واحد على الأقل"),
});

// Style Lab
const StyleExcerptSchema = z.object({
  segments: z.array(z.object({
    id: z.string().optional(),
    text: z.string(),
    isHighlight: z.boolean().optional(),
    explanation: z.string().optional(),
  })).optional(),
  text: z.string().optional(),
  analysis: z.string().optional(),
  highlight: z.string().optional(),
});

const StyleLabSchema = BaseSectionSchema.extend({
  type: z.literal('style_lab'),
  excerpts: z.array(StyleExcerptSchema),
});

// Golden Envelope
const GoldenEnvelopeSchema = BaseSectionSchema.extend({
  type: z.literal('golden_envelope'),
  quote: z.string(),
  summary: z.string(),
  question: z.string(),
});

// Morphology Scale (الميزان الصرفي)
const MorphologyQuestionSchema = z.object({
  text: z.string().min(1, "نص السؤال مطلوب"),
  word: z.string().min(1, "الكلمة مطلوبة"),
  root: z.string().optional(),
  pattern: z.string().min(1, "الوزن مطلوب"),
  options: z.array(z.string()).min(2, "يجب وجود خيارين على الأقل"),
  correct: z.number().int().min(0),
  hint: z.string().optional(),
  explanation: z.string().optional(),
});

const MorphologyScaleSchema = BaseSectionSchema.extend({
  type: z.literal('morphology_scale'),
  questions: z.array(MorphologyQuestionSchema).min(1, "يجب إضافة سؤال واحد على الأقل"),
});

// Text Highlighter (البحث عن الكلمة في النص)
const HighlighterWordSchema = z.union([
  z.string(),
  z.object({
    text: z.string().min(1),
    isTarget: z.boolean().optional(),
  }),
]);

const HighlighterQuestionSchema = z.object({
  text: z.string().min(1, "نص السؤال مطلوب"),
  words: z.array(HighlighterWordSchema).min(3, "يجب وجود ٣ كلمات على الأقل"),
  hint: z.string().optional(),
  explanation: z.string().optional(),
});

const TextHighlighterSchema = BaseSectionSchema.extend({
  type: z.literal('text_highlighter'),
  questions: z.array(HighlighterQuestionSchema).min(1, "يجب إضافة سؤال واحد على الأقل"),
});


/**
 * Master Lesson Schema
 */
const SectionSchema = z.discriminatedUnion('type', [
  IntroSchema,
  McqSchema,
  TapToFillSchema,
  ClassifySchema,
  StorySchema,
  FlashcardsSchema,
  RadarSchema,
  MatchingSchema,
  ContrastCardsSchema,
  HotspotSchema,
  SpottingSchema,
  ErrorCorrectionSchema,
  SortSchema,
  OrderingSchema,
  StyleLabSchema,
  GoldenEnvelopeSchema,
  SentenceBuilderSchema,
  WordBuilderSchema,
  MorphologyScaleSchema,
  TextHighlighterSchema,
]);

export const LessonSchema = z.object({
  id: z.string().min(1, "معرف الدرس مطلوب"),
  pageTitle: z.string().min(1, "عنوان الصفحة مطلوب"),
  headerTitle: z.string().optional(),
  headerSubtitle: z.string().optional(),
  youtubeLink: z.string().optional(),
  copyright: z.string().optional(),
  sections: z.array(SectionSchema).min(1, "يجب أن يحتوي الدرس على قسم واحد على الأقل"),
});

/**
 * Helper to get human readable error messages in Arabic
 */
export const validateLesson = (data) => {
  const result = LessonSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }

  // Format errors to be more readable
  const errors = result.error.issues.map(issue => {
    const path = issue.path.join(' -> ');
    return `[${path}]: ${issue.message}`;
  });

  return { success: false, errors };
};
