import React, { useState } from 'react';
import { Save, X, PlusCircle, Trash2, ArrowUp, ArrowDown, Type, ListTree } from 'lucide-react';
import RichTextarea from './RichTextarea';

const VisualSentenceBuilderEditor = ({ section, onSave, onCancel }) => {
  const [title, setTitle] = useState(section.title || '');
  const [description, setDescription] = useState(section.description || '');
  const [theme, setTheme] = useState(section.theme || 'indigo');
  const [questions, setQuestions] = useState(section.questions || []);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { 
        text: 'رتب الكلمات لتكوين جملة صحيحة:', 
        fragments: ['كلمة', 'ثانية', 'ثالثة'], 
        correctOrder: ['كلمة', 'ثانية', 'ثالثة'], 
        hint: '', 
        explanation: '' 
      }
    ]);
  };

  const removeQuestion = (index) => {
    if (window.confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const moveQuestion = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === questions.length - 1)) return;
    const newQuestions = [...questions];
    const targetIndex = index + direction;
    [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];
    setQuestions(newQuestions);
  };

  const handleFragmentsChange = (qIdx, value) => {
    const frags = value.split(' ').filter(f => f.trim() !== '');
    const newQuestions = [...questions];
    newQuestions[qIdx].fragments = frags;
    newQuestions[qIdx].correctOrder = [...frags];
    setQuestions(newQuestions);
  };

  const handleSave = () => {
    onSave({ ...section, title, description, theme, questions });
  };

  const themes = ['sky', 'indigo', 'emerald', 'lime', 'green', 'rose', 'violet', 'blue', 'purple', 'orange', 'cyan'];

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl border border-indigo-100 shadow-sm mt-4 animate-in fade-in slide-in-from-top-4 max-w-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
            <Type size={24} /> محرر {section.type === 'word_builder' ? 'بناء الكلمات' : 'بناء الجمل'}
          </h3>
          <p className="text-sm text-slate-500">أدخل الجملة مرتبة وسيقوم التطبيق بتقسيمها وخلطها تلقائياً</p>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-rose-600 bg-slate-50 p-2 rounded-full border border-slate-200 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <label className="block text-slate-700 font-medium mb-2 text-sm">عنوان النشاط</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-2 text-sm">اللون</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" dir="ltr">
              {themes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-slate-700 font-medium mb-2 text-sm">تعليمات النشاط (اختياري)</label>
            <RichTextarea 
              value={description} 
              onChange={setDescription}
              placeholder="مثلاً: رتب الكلمات التالية لتكوين جملة مفيدة..."
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800">الأسئلة ({questions.length})</h4>
            <button onClick={addQuestion} className="flex items-center gap-1 text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200">
              <PlusCircle size={16} /> إضافة سؤال جديد
            </button>
          </div>

          {questions.map((q, qIdx) => (
            <div key={qIdx} className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm relative group hover:border-indigo-200 transition-all overflow-hidden">
              <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">السؤال رقم {qIdx + 1}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => moveQuestion(qIdx, -1)} disabled={qIdx === 0} className="text-slate-300 hover:text-indigo-600 disabled:opacity-0"><ArrowUp size={18} /></button>
                  <button onClick={() => moveQuestion(qIdx, 1)} disabled={qIdx === questions.length - 1} className="text-slate-300 hover:text-indigo-600 disabled:opacity-0"><ArrowDown size={18} /></button>
                  <button onClick={() => removeQuestion(qIdx)} className="text-slate-300 hover:text-rose-600 ml-2"><Trash2 size={18} /></button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-slate-700 font-bold mb-2 text-sm">نص السؤال / التوجيه</label>
                  <input 
                    type="text" 
                    value={q.text} 
                    onChange={(e) => handleQuestionChange(qIdx, 'text', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="مثلاً: رتب الكلمات التالية..."
                  />
                </div>

                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                  <label className="block text-indigo-900 font-bold mb-2 text-sm">
                    {section.type === 'word_builder' ? 'الكلمة الصحيحة (سيتم تقسيمها لحروف)' : 'الجملة الصحيحة (سيتم تقسيمها لكلمات)'}
                  </label>
                  <textarea 
                    value={section.type === 'word_builder' ? q.fragments.join('') : q.fragments.join(' ')} 
                    onChange={(e) => {
                      if (section.type === 'word_builder') {
                        const chars = e.target.value.split('');
                        const newQuestions = [...questions];
                        newQuestions[qIdx].fragments = chars;
                        newQuestions[qIdx].correctOrder = [...chars];
                        setQuestions(newQuestions);
                      } else {
                        handleFragmentsChange(qIdx, e.target.value);
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-white focus:border-indigo-400 outline-none shadow-sm text-lg font-bold text-center leading-relaxed h-20"
                    placeholder={section.type === 'word_builder' ? "اكتب الكلمة هنا..." : "اكتب الجملة هنا مرتبة ترتيباً صحيحاً..."}
                  ></textarea>
                  <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    {q.fragments.map((f, i) => (
                      <span key={i} className="bg-white px-3 py-1 rounded-lg border border-indigo-100 text-indigo-600 font-bold text-sm shadow-sm">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">تلميح (Hint)</label>
                    <RichTextarea 
                      value={q.hint || ''} 
                      onChange={(val) => handleQuestionChange(qIdx, 'hint', val)}
                      placeholder="تلميح..."
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">شرح الإجابة</label>
                    <RichTextarea 
                      value={q.explanation || ''} 
                      onChange={(val) => handleQuestionChange(qIdx, 'explanation', val)}
                      placeholder="شرح..."
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-slate-100">
        <button onClick={onCancel} className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">إلغاء</button>
        <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-2 rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center gap-2">
          <Save size={20} /> حفظ النشاط
        </button>
      </div>
    </div>
  );
};

export default VisualSentenceBuilderEditor;
