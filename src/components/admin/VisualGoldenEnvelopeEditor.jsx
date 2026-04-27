import React, { useState } from 'react';
import { Save, X, Mail, Quote, BookOpen, MessageCircle } from 'lucide-react';

const VisualGoldenEnvelopeEditor = ({ section, onSave, onCancel }) => {
  const [title, setTitle] = useState(section.title || '');
  const [description, setDescription] = useState(section.description || '');
  const [theme, setTheme] = useState(section.theme || 'indigo');
  const [quote, setQuote] = useState(section.quote || '');
  const [summary, setSummary] = useState(section.summary || '');
  const [question, setQuestion] = useState(section.question || '');

  const handleSave = () => {
    onSave({ ...section, title, description, theme, quote, summary, question });
  };

  const themes = ['sky', 'indigo', 'emerald', 'lime', 'green', 'rose', 'violet', 'blue', 'purple', 'orange', 'cyan', 'slate'];

  return (
    <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm mt-4 animate-in fade-in slide-in-from-top-4 max-w-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
            <Mail size={24} /> محرر الظرف الذهبي (الخاتمة)
          </h3>
          <p className="text-sm text-slate-500">لخص الدرس بكلمات ملهمة وسؤال للتفكير</p>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-rose-600 bg-slate-50 p-2 rounded-full border border-slate-200 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        {/* Global Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <label className="block text-slate-700 font-medium mb-2 text-sm">عنوان القسم</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-2 text-sm">اللون الرئيسي</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" dir="ltr">
              {themes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-slate-700 font-medium mb-2 text-sm">تعليمات بسيطة</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none h-16"></textarea>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
            <label className="flex items-center gap-2 text-orange-800 font-bold mb-3">
              <Quote size={20} /> الاقتباس (المقولة المركزية)
            </label>
            <textarea 
              value={quote} 
              onChange={(e) => setQuote(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border border-white focus:border-orange-300 outline-none shadow-sm text-lg text-center leading-relaxed font-medium italic h-24"
              placeholder="اكتب اقتباساً ملهماً هنا..."
            ></textarea>
            <p className="text-[10px] text-orange-600 mt-2">ملاحظة: يمكنك استخدام وسوم HTML مثل &lt;span class="font-bold"&gt; للتمييز.</p>
          </div>

          <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
            <label className="flex items-center gap-2 text-indigo-800 font-bold mb-3">
              <BookOpen size={20} /> الخلاصة التحليلية (الزبدة)
            </label>
            <textarea 
              value={summary} 
              onChange={(e) => setSummary(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border border-white focus:border-indigo-300 outline-none shadow-sm text-lg text-center leading-relaxed h-32"
              placeholder="لخص جوهر الدرس في فقرة قوية..."
            ></textarea>
          </div>

          <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100">
            <label className="flex items-center gap-2 text-rose-800 font-bold mb-3">
              <MessageCircle size={20} /> سؤال للتفكير (الأثر الباقي)
            </label>
            <textarea 
              value={question} 
              onChange={(e) => setQuestion(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border border-white focus:border-rose-300 outline-none shadow-sm text-lg text-center leading-relaxed font-bold h-24 text-rose-900"
              placeholder="اطرح سؤالاً يحفز الطالب على التفكير..."
            ></textarea>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-slate-100">
        <button onClick={onCancel} className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">إلغاء</button>
        <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-2 rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center gap-2">
          <Save size={20} /> حفظ الظرف الذهبي
        </button>
      </div>
    </div>
  );
};

export default VisualGoldenEnvelopeEditor;
