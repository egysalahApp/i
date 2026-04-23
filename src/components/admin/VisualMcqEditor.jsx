import React, { useState } from 'react';
import { Save, X, PlusCircle, Trash2, HelpCircle, CheckCircle2, ArrowUp, ArrowDown } from 'lucide-react';

const VisualMcqEditor = ({ section, onSave, onCancel }) => {
  const [title, setTitle] = useState(section.title || '');
  const [description, setDescription] = useState(section.description || '');
  const [theme, setTheme] = useState(section.theme || 'sky');
  const [questions, setQuestions] = useState(section.questions || []);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: 'سؤال جديد؟', options: ['خيار 1', 'خيار 2', 'خيار 3'], correct: 0, hint: '', explanation: '' }
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
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

  const themes = ['sky', 'indigo', 'emerald', 'amber', 'rose', 'violet', 'blue', 'purple'];

  return (
    <div className="bg-white p-6 rounded-xl border border-purple-100 shadow-sm mt-4 animate-in fade-in slide-in-from-top-4 max-w-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-purple-900">محرر الأسئلة (واجهة مرئية)</h3>
          <p className="text-sm text-slate-500">عدل الأسئلة والخيارات والإجابات الصحيحة بسهولة</p>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-rose-600 bg-slate-50 p-2 rounded-full border border-slate-200 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <label className="block text-slate-700 font-medium mb-2 text-sm">عنوان النشاط</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none" />
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-2 text-sm">اللون</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none" dir="ltr">
              {themes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-slate-700 font-medium mb-2 text-sm">تعليمات النشاط</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none h-20"></textarea>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800">قائمة الأسئلة ({questions.length})</h4>
            <button onClick={addQuestion} className="flex items-center gap-1 text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors">
              <PlusCircle size={16} /> إضافة سؤال
            </button>
          </div>

          {questions.map((q, qIdx) => (
            <div key={qIdx} className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-sm relative group hover:border-purple-200 transition-colors">
              <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => moveQuestion(qIdx, -1)} disabled={qIdx === 0} className="text-slate-300 hover:text-purple-600 disabled:opacity-0" title="تحريك لأعلى"><ArrowUp size={20} /></button>
                <button onClick={() => moveQuestion(qIdx, 1)} disabled={qIdx === questions.length - 1} className="text-slate-300 hover:text-purple-600 disabled:opacity-0" title="تحريك لأسفل"><ArrowDown size={20} /></button>
                <button onClick={() => removeQuestion(qIdx)} className="text-slate-300 hover:text-rose-500 transition-colors" title="حذف السؤال"><Trash2 size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-600 text-xs font-bold mb-2 uppercase tracking-wider flex items-center gap-2">
                    <HelpCircle size={14} /> نص السؤال {qIdx + 1}
                  </label>
                  <textarea 
                    value={q.text} 
                    onChange={(e) => handleQuestionChange(qIdx, 'text', e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 text-lg font-medium h-24"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="relative flex items-center gap-3">
                      <button 
                        type="button"
                        onClick={() => handleQuestionChange(qIdx, 'correct', oIdx)}
                        className={`shrink-0 w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all ${q.correct === oIdx ? 'bg-emerald-500 border-emerald-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-300 hover:border-purple-300'}`}
                        title="تعيين كإجابة صحيحة"
                      >
                        <CheckCircle2 size={22} />
                      </button>
                      <textarea 
                        value={opt} 
                        onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                        className={`flex-grow px-4 py-3 rounded-xl border-2 transition-all h-16 ${q.correct === oIdx ? 'border-emerald-200 bg-emerald-50/30 text-emerald-900' : 'border-slate-100 focus:border-purple-400 text-slate-700'}`}
                        placeholder={`خيار الإجابة ${oIdx + 1}`}
                      ></textarea>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-slate-500 text-xs font-medium mb-1">التلميح (Hint)</label>
                    <input type="text" value={q.hint} onChange={(e) => handleQuestionChange(qIdx, 'hint', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-xs font-medium mb-1">الشرح (Explanation)</label>
                    <input type="text" value={q.explanation} onChange={(e) => handleQuestionChange(qIdx, 'explanation', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
        <button onClick={onCancel} className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">إلغاء</button>
        <button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-2 rounded-xl font-bold shadow-md transition-all active:scale-95">اعتماد التغييرات</button>
      </div>
    </div>
  );
};

export default VisualMcqEditor;
