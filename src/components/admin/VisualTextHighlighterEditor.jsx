import React, { useState } from 'react';
import { Save, X, PlusCircle, Trash2, ArrowUp, ArrowDown, Highlighter, CheckCircle2 } from 'lucide-react';
import RichTextarea from './RichTextarea';

const VisualTextHighlighterEditor = ({ section, onSave, onCancel }) => {
  const [title, setTitle] = useState(section.title || '');
  const [description, setDescription] = useState(section.description || '');
  const [theme, setTheme] = useState(section.theme || 'lime');
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
        text: 'استخرج الكلمات التي تحتوي على (ال) الشمسية:', 
        words: [
          { text: 'السماء', isTarget: true },
          { text: 'جميلة', isTarget: false },
          { text: 'والشمس', isTarget: true },
          { text: 'ساطعة', isTarget: false }
        ], 
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

  const handleRawTextChange = (qIdx, text) => {
    const parts = text.split(/\s+/).filter(p => p.trim() !== '');
    const newWords = parts.map(p => ({ text: p, isTarget: false }));
    handleQuestionChange(qIdx, 'words', newWords);
  };

  const toggleTarget = (qIdx, wIdx) => {
    const newQuestions = [...questions];
    const words = [...newQuestions[qIdx].words];
    const word = words[wIdx];
    
    if (typeof word === 'string') {
      words[wIdx] = { text: word, isTarget: true };
    } else {
      words[wIdx] = { ...word, isTarget: !word.isTarget };
    }
    
    newQuestions[qIdx].words = words;
    setQuestions(newQuestions);
  };

  const handleSave = () => {
    onSave({ ...section, title, description, theme, questions });
  };

  const themes = ['sky', 'indigo', 'emerald', 'lime', 'green', 'rose', 'violet', 'blue', 'purple', 'orange', 'cyan', 'slate'];

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl border border-lime-100 shadow-sm mt-4 animate-in fade-in slide-in-from-top-4 max-w-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-lime-900 flex items-center gap-2">
            <Highlighter size={24} /> محرر صائد الكلمات (Text Highlighter)
          </h3>
          <p className="text-sm text-slate-500">أدخل النص ثم انقر على الكلمات التي يجب على الطالب اختيارها</p>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-rose-600 bg-slate-50 p-2 rounded-full border border-slate-200 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <label className="block text-slate-700 font-medium mb-2 text-sm">عنوان النشاط</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-lime-500 outline-none" />
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-2 text-sm">اللون</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-lime-500 outline-none" dir="ltr">
              {themes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-slate-700 font-medium mb-2 text-sm">تعليمات النشاط</label>
            <RichTextarea value={description} onChange={setDescription} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800">الأسئلة ({questions.length})</h4>
            <button onClick={addQuestion} className="flex items-center gap-1 text-sm font-medium text-lime-600 bg-lime-50 px-3 py-1.5 rounded-lg hover:bg-lime-100 transition-colors border border-lime-200">
              <PlusCircle size={16} /> إضافة سؤال جديد
            </button>
          </div>

          {questions.map((q, qIdx) => (
            <div key={qIdx} className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm relative group hover:border-lime-200 transition-all overflow-hidden">
              <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">السؤال رقم {qIdx + 1}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => moveQuestion(qIdx, -1)} disabled={qIdx === 0} className="text-slate-300 hover:text-lime-600 disabled:opacity-0"><ArrowUp size={18} /></button>
                  <button onClick={() => moveQuestion(qIdx, 1)} disabled={qIdx === questions.length - 1} className="text-slate-300 hover:text-lime-600 disabled:opacity-0"><ArrowDown size={18} /></button>
                  <button onClick={() => removeQuestion(qIdx)} className="text-slate-300 hover:text-rose-600 ml-2"><Trash2 size={18} /></button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-slate-700 font-bold mb-2 text-sm">المطلوب من الطالب (مثل: استخرج المبتدأ)</label>
                  <input 
                    type="text" 
                    value={q.text} 
                    onChange={(e) => handleQuestionChange(qIdx, 'text', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-lime-500 outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-2 text-sm">النص الكامل (سيتم تقسيمه تلقائياً)</label>
                  <textarea 
                    defaultValue={q.words.map(w => typeof w === 'string' ? w : w.text).join(' ')}
                    onBlur={(e) => handleRawTextChange(qIdx, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-lime-400 outline-none h-24 text-lg leading-relaxed"
                    placeholder="اكتب النص هنا..."
                  ></textarea>
                  <p className="text-[10px] text-slate-400 mt-1">ملاحظة: سيتم تحديث الكلمات عند الخروج من حقل النص.</p>
                </div>

                <div className="bg-lime-50/30 p-4 rounded-xl border border-lime-100">
                  <label className="block text-lime-800 font-bold mb-3 text-xs uppercase tracking-wider">انقر على الكلمات الصحيحة (الأهداف)</label>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {q.words.map((w, wIdx) => {
                      const isTarget = typeof w === 'string' ? false : !!w.isTarget;
                      const text = typeof w === 'string' ? w : w.text;
                      
                      return (
                        <button 
                          key={wIdx}
                          onClick={() => toggleTarget(qIdx, wIdx)}
                          className={`px-3 py-1.5 rounded-lg font-bold text-sm transition-all active:scale-95 border-2 ${isTarget ? 'bg-lime-500 border-lime-600 text-white shadow-md' : 'bg-white border-slate-100 text-slate-600 hover:border-lime-200'}`}
                        >
                          {text}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">تلميح (Hint)</label>
                    <RichTextarea value={q.hint || ''} onChange={(val) => handleQuestionChange(qIdx, 'hint', val)} />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">شرح الإجابة</label>
                    <RichTextarea value={q.explanation || ''} onChange={(val) => handleQuestionChange(qIdx, 'explanation', val)} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-slate-100">
        <button onClick={onCancel} className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">إلغاء</button>
        <button onClick={handleSave} className="bg-lime-600 hover:bg-lime-700 text-white px-10 py-2 rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center gap-2">
          <Save size={20} /> حفظ النشاط
        </button>
      </div>
    </div>
  );
};

export default VisualTextHighlighterEditor;
