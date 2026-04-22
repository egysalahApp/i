export const APP_DATA = {
    pageTitle: "اختبار البرمجيات | اختبار",
    headerTitle: "مختبر التطوير",
    headerSubtitle: "اختبار الميزات الجديدة",
    youtubeLink: "#",
    copyright: "2026 اختبار الميزات",
    sections: [
        {
            id: "sec1",
            type: "mcq",
            title: "أسئلة عادية",
            theme: "sky",
            description: "تأكد من وجود الترقيم والخلط هنا.",
            questions: [
                {
                    text: "سؤال عادي ١ (يجب أن يكون له ترقيم ١، ٢، ٣)",
                    options: ["خيار أ", "خيار ب", "خيار ج"],
                    correct: 0,
                    hint: "تلميح للسؤال ١",
                    explanation: "شرح للسؤال ١"
                },
                {
                    text: "سؤال عادي ٢ (يجب أن يكون له ترقيم ١، ٢، ٣)",
                    options: ["خيار ١", "خيار ٢", "خيار ٣"],
                    correct: 1,
                    hint: "تلميح للسؤال ٢",
                    explanation: "شرح للسؤال ٢"
                }
            ]
        },
        {
            id: "sec2",
            type: "mcq",
            title: "أسئلة صواب وخطأ",
            theme: "emerald",
            description: "تأكد من غياب الترقيم وثبات الترتيب هنا.",
            questions: [
                {
                    text: "هل الممنوع من الصرف يُجر بالفتحة؟ (يجب أن يظهر صواب ثم خطأ بدون أرقام)",
                    options: ["صواب", "خطأ"],
                    correct: 0,
                    hint: "تلميح صواب/خطأ",
                    explanation: "نعم، يُجر بالفتحة نيابة عن الكسرة."
                },
                {
                    text: "هل يُجر الممنوع من الصرف بالكسرة دائمًا؟ (يجب أن يظهر صواب ثم خطأ بدون أرقام)",
                    options: ["خطأ", "صواب"],
                    correct: 0,
                    hint: "تلميح صواب/خطأ ٢",
                    explanation: "خطأ، يُجر بالكسرة فقط في حالتين."
                }
            ]
        }
    ]
};
