import { z } from 'zod';

/**
 * Common Schemas
 */
const ThemeSchema = z.enum(['emerald', 'amber', 'indigo', 'purple', 'violet', 'cyan', 'sky', 'rose', 'slate']);

// Base for all sections
const BaseSectionSchema = z.object({
  id: z.string().min(1, "معرف القسم مطلوب"),
  title: z.string().min(1, "عنوان القسم مطلوب"),
  theme: ThemeSchema,
  description: z.string().optional(),
});

/**
 * Activity Specific Schemas
 */

// Intro Section
const IntroContentSchema = z.object({
  icon: z.string(),
  title: z.string(),
  desc: z.string(),
  theme: ThemeSchema,
  examples: z.string(),
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
  theme: ThemeSchema,
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
  text: z.string(),
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
});

const FlashcardsSchema = BaseSectionSchema.extend({
  type: z.literal('flashcards'),
  cards: z.array(FlashcardSchema).min(1, "يجب إضافة بطاقة واحدة على الأقل"),
});

// Radar
const RadarBranchSchema = z.object({
  title: z.string(),
  text: z.string(),
  color: z.string().optional(),
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
  left: z.string(),
  right: z.string(),
});

const MatchingSchema = BaseSectionSchema.extend({
  type: z.literal('matching'),
  pairs: z.array(MatchingPairSchema).min(1, "يجب إضافة زوج واحد على الأقل"),
});

// Hotspot & Spotting
const HotspotQuestionSchema = z.object({
  task: z.string(),
  content: z.string(),
  correctWords: z.array(z.string()),
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
  words: z.array(z.string()),
  errorWordIndex: z.number().int(),
  options: z.array(z.string()),
  correct: z.number().int(),
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
  correctOrder: z.array(z.string()),
  hint: z.string().optional(),
  explanation: z.string().optional(),
});

const SortSchema = BaseSectionSchema.extend({
  type: z.literal('sort'),
  questions: z.array(SortQuestionSchema),
});

// Style Lab
const StyleExcerptSchema = z.object({
  text: z.string(),
  analysis: z.string(),
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

// Card Quiz (New Activity)
const CardQuizSchema = BaseSectionSchema.extend({
  type: z.literal('card_quiz'),
  questions: z.array(z.object({
    text: z.string().min(1, "نص البطاقة مطلوب"),
    options: z.array(z.string()).length(3, "يجب وجود ٣ اختيارات بالضبط"),
    correct: z.number().int().min(0).max(2),
    hint: z.string().optional(),
    explanation: z.string().optional(),
  })).min(1, "يجب إضافة بطاقة واحدة على الأقل"),
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
  HotspotSchema,
  SpottingSchema,
  ErrorCorrectionSchema,
  SortSchema,
  StyleLabSchema,
  GoldenEnvelopeSchema,
  CardQuizSchema,
]);

export const LessonSchema = z.object({
  id: z.string().min(1, "معرف الدرس مطلوب"),
  pageTitle: z.string().min(1, "عنوان الصفحة مطلوب"),
  headerTitle: z.string().default("العربية السهلة"),
  headerSubtitle: z.string().default("محمود صلاح"),
  youtubeLink: z.string().optional().default(""),
  copyright: z.string().optional().default("© 2025 العربية السهلة"),
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
