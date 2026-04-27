import React, { useState } from 'react';
import { Save, X, PlusCircle, Trash2, ArrowUp, ArrowDown, Scale, CheckCircle2 } from 'lucide-react';
import RichTextarea from './RichTextarea';

const VisualMorphologyScaleEditor = ({ section, onSave, onCancel }) => {
  const [title, setTitle] = useState(section.title || '');
  const [description, setDescription] = useState(section.description || '');
  const [theme, setTheme] = useState(section.theme || 'cyan');
  const [questions, setQuestions] = useState(section.questions || []);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIdx, oIdx, value) => {
    const newQuestions = [...questions];
    newQuestions[qIdx].options[oIdx] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { 
        text: 'ما هو الوزن الصرفي للكلمة التالية؟', 
        word: 'كَتَبَ', 
        root: 'كتب', 
        pattern: 'فَعَلَ', 
        options: ['فَعَلَ', 'فَاعِل', 'مَفْعُول'], 
        correct: 0, 
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

  const handleSave = () => {
    onSave({ ...section, title, description, theme, questions });
  };

  const themes = ['sky', 'indigo', 'emerald', 'lime', 'green', 'rose', 'violet', 'blue', 'purple', 'orange', 'cyan', 'slate'];

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl border border-cyan-100 shadow-sm mt-4 animate-in fade-in slide-in-from-top-4 max-w-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-cyan-900 flex items-center gap-2">
            <Scale size={24} /> محرر الميزان الصرفي
          </h3>
          <p className="text-sm text-slate-500">صمم أسئلة الوزن الصرفي والجذور اللغوية</p>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-rose-600 bg-slate-50 p-2 rounded-full border border-slate-200 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <label className="block text-slate-700 font-medium mb-2 text-sm">عنوان النشاط</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none" />
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-2 text-sm">اللون</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none" dir="ltr">
              {themes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-slate-700 font-medium mb-2 text-sm">وصف النشاط</label>
            <RichTextarea value={description} onChange={setDescription} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800">الأسئلة ({questions.length})</h4>
            <button onClick={addQuestion} className="flex items-center gap-1 text-sm font-medium text-cyan-600 bg-cyan-50 px-3 py-1.5 rounded-lg hover:bg-cyan-100 transition-colors border border-cyan-200">
              <PlusCircle size={16} /> إضافة سؤال جديد
            </button>
          </div>

          {questions.map((q, qIdx) => (
            <div key={qIdx} className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm relative group hover:border-cyan-200 transition-all overflow-hidden">
              <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">السؤال رقم {qIdx + 1}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => moveQuestion(qIdx, -1)} disabled={qIdx === 0} className="text-slate-300 hover:text-cyan-600 disabled:opacity-0"><ArrowUp size={18} /></button>
                  <button onClick={() => moveQuestion(qIdx, 1)} disabled={qIdx === questions.length - 1} className="text-slate-300 hover:text-cyan-600 disabled:opacity-0"><ArrowDown size={18} /></button>
                  <button onClick={() => removeQuestion(qIdx)} className="text-slate-300 hover:text-rose-600 ml-2"><Trash2 size={18} /></button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-slate-700 font-bold mb-2 text-sm">نص السؤال</label>
                  <input 
                    type="text" 
                    value={q.text} 
                    onChange={(e) => handleQuestionChange(qIdx, 'text', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-cyan-50/30 p-4 rounded-xl border border-cyan-100">
                  <div>
                    <label className="block text-cyan-800 font-bold mb-1 text-xs">الكلمة</label>
                    <input 
                      type="text" 
                      value={q.word} 
                      onChange={(e) => handleQuestionChange(qIdx, 'word', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-white focus:border-cyan-400 outline-none text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-800 font-bold mb-1 text-xs">الجذر (اختياري)</label>
                    <input 
                      type="text" 
                      value={q.root || ''} 
                      onChange={(e) => handleQuestionChange(qIdx, 'root', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-white focus:border-cyan-400 outline-none text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-800 font-bold mb-1 text-xs">الوزن الصحيح (للعرض)</label>
                    <input 
                      type="text" 
                      value={q.pattern} 
                      onChange={(e) => handleQuestionChange(qIdx, 'pattern', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-white focus:border-cyan-400 outline-none text-center font-bold text-cyan-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-3 text-sm flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-cyan-600" /> الخيارات (حدد الإجابة الصحيحة)
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className={`relative flex items-center gap-2 p-1 rounded-xl border-2 transition-all ${q.correct === oIdx ? 'border-cyan-500 bg-cyan-50' : 'border-slate-100 bg-slate-50/50'}`}>
                        <button 
                          onClick={() => handleQuestionChange(qIdx, 'correct', oIdx)}
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${q.correct === oIdx ? 'bg-cyan-600 text-white shadow-md' : 'bg-white text-slate-300 border border-slate-200 hover:border-cyan-300'}`}
                        >
                          {q.correct === oIdx ? <CheckCircle2 size={18} /> : (oIdx + 1)}
                        </button>
                        <input 
                          type="text" 
                          value={opt} 
                          onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                          className="w-full bg-transparent border-none focus:ring-0 outline-none font-bold text-sm"
                        />
                      </div>
                    ))}
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
        <button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700 text-white px-10 py-2 rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center gap-2">
          <Save size={20} /> حفظ النشاط
        </button>
      </div>
    </div>
  );
};

export default VisualMorphologyScaleEditor;
