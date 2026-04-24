import { validateLesson } from '../src/lib/schemas.js';

const validLesson = {
  id: "test-lesson",
  pageTitle: "عنوان الاختبار",
  sections: [
    {
      id: "sec_1",
      type: "intro",
      title: "مقدمة",
      theme: "sky",
      content: [
        {
          icon: "📍",
          title: "عنوان",
          desc: "وصف",
          theme: "emerald",
          examples: "مثال"
        }
      ]
    },
    {
      id: "sec_2",
      type: "mcq",
      title: "سؤال",
      theme: "indigo",
      questions: [
        {
          text: "ما هو؟",
          options: ["أ", "ب"],
          correct: 0
        }
      ]
    },
    {
      id: "sec_3",
      type: "card_quiz",
      title: "اختبر معناك",
      theme: "indigo",
      questions: [
        {
          text: "جاء المعلم «بـ»ـالعلم",
          options: ["الوسيلة", "المكان", "الزمان"],
          correct: 0
        }
      ]
    }
  ]
};

const invalidLesson = {
  id: "test-lesson",
  pageTitle: "عنوان الاختبار",
  sections: [
    {
      id: "sec_1",
      type: "mcq",
      title: "سؤال ناقص",
      theme: "indigo",
      questions: [
        {
          text: "ما هو؟",
          // options: ["أ", "ب"], // Missing options
          correct: "صفر" // Should be number
        }
      ]
    }
  ]
};

console.log("--- Testing Valid Lesson ---");
const validResult = validateLesson(validLesson);
console.log("Success:", validResult.success);
if (!validResult.success) console.log("Errors:", validResult.errors);

console.log("\n--- Testing Invalid Lesson ---");
const invalidResult = validateLesson(invalidLesson);
console.log("Success:", invalidResult.success);
if (!invalidResult.success) {
    console.log("Found", invalidResult.errors.length, "errors:");
    invalidResult.errors.forEach(e => console.log(" -", e));
}
