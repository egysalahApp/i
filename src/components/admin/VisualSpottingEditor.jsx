import React, { useState } from 'react';
import { Save, X, PlusCircle, Trash2, ArrowUp, ArrowDown, Search, CheckCircle2, Info } from 'lucide-react';

const VisualSpottingEditor = ({ section, onSave, onCancel }) => {
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
        text: 'عين الاسم الممنوع من الصرف:', 
        words: ['هذا', 'ولد', 'أحمد', 'مجتهد'], 
        targetIndex: 2, 
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

  const handleWordChange = (qIdx, wIdx, value) => {
    const newQuestions = [...questions];
    newQuestions[qIdx].words[wIdx] = value;
    setQuestions(newQuestions);
  };

  const addWord = (qIdx) => {
    const newQuestions = [...questions];
    newQuestions[qIdx].words.push('كلمة');
    setQuestions(newQuestions);
  };

  const removeWord = (qIdx, wIdx) => {
    if (window.confirm('هل أنت متأكد من حذف هذه الكلمة؟')) {
      const newQuestions = [...questions];
      if (newQuestions[qIdx].words.length > 1) {
        newQuestions[qIdx].words.splice(wIdx, 1);
        if (newQuestions[qIdx].targetIndex >= newQuestions[qIdx].words.length) {
          newQuestions[qIdx].targetIndex = newQuestions[qIdx].words.length - 1;
        }
        setQuestions(newQuestions);
      }
    }
  };

  const handleSave = () => {
    onSave({ ...section, title, description, theme, questions });
  };

  const themes = ['sky', 'indigo', 'emerald', 'lime', 'green', 'rose', 'violet', 'blue', 'purple', 'orange', 'cyan', 'slate'];

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl border border-indigo-100 shadow-sm mt-4 animate-in fade-in slide-in-from-top-4 max-w-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
            <Search size={24} className="text-indigo-600" /> محرر تحديد الكلمات (Spotting)
          </h3>
          <p className="text-sm text-slate-500">أنشئ أسئلة تعتمد على اختيار الكلمة الصحيحة من بين مجموعة كلمات</p>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-rose-600 bg-slate-50 p-2 rounded-full border border-slate-200 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        {/* Settings */}
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
            <label className="block text-slate-700 font-medium mb-2 text-sm">وصف النشاط</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none h-16"></textarea>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800">قائمة الأسئلة ({questions.length})</h4>
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
                {/* Question Text */}
                <div>
                   <label className="block text-slate-700 font-bold mb-2 text-sm">نص السؤال (المهمة)</label>
                   <input 
                    type="text" 
                    value={q.text || ''} 
                    onChange={(e) => handleQuestionChange(qIdx, 'text', e.target.value)} 
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="مثال: استخرج الفاعل من الجملة التالية..."
                   />
                </div>

                {/* Words Editor */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-slate-700 font-bold text-sm">الكلمات (اضغط على الكلمة الصحيحة ✅)</label>
                    <button onClick={() => addWord(qIdx)} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded">إضافة كلمة +</button>
                  </div>
                  <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 min-h-[100px]">
                    {q.words.map((word, wIdx) => {
                      const isTarget = q.targetIndex === wIdx;
                      return (
                        <div key={wIdx} className={`relative flex flex-col gap-1 min-w-[80px] p-2 rounded-lg border-2 transition-all ${isTarget ? 'border-emerald-400 bg-emerald-50 ring-4 ring-emerald-500/10' : 'border-transparent'}`}>
                          <div className="flex items-center justify-between mb-1">
                            <button 
                              onClick={() => handleQuestionChange(qIdx, 'targetIndex', wIdx)}
                              className={`p-1 rounded-md transition-all ${isTarget ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-300 hover:text-emerald-500 border border-slate-100'}`}
                              title={isTarget ? "هذه هي الإجابة" : "اجعل هذه الكلمة هي الإجابة"}
                            >
                              <CheckCircle2 size={12} />
                            </button>
                            <button onClick={() => removeWord(qIdx, wIdx)} className="text-slate-200 hover:text-rose-500"><Trash2 size={12} /></button>
                          </div>
                          <input 
                            type="text" 
                            value={word} 
                            onChange={(e) => handleWordChange(qIdx, wIdx, e.target.value)}
                            className="w-full bg-transparent border-none focus:ring-0 outline-none text-right font-medium text-sm"
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Hint & Explanation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                  <div className="bg-orange-50/30 p-3 rounded-xl border border-orange-100">
                    <label className="block text-orange-700 text-[10px] font-bold uppercase mb-1 flex items-center gap-1"><Info size={12} /> تلميح (Hint)</label>
                    <input type="text" value={q.hint || ''} onChange={(e) => handleQuestionChange(qIdx, 'hint', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-orange-100 outline-none text-sm bg-white" />
                  </div>
                  <div className="bg-emerald-50/30 p-3 rounded-xl border border-emerald-100">
                    <label className="block text-emerald-700 text-[10px] font-bold uppercase mb-1 flex items-center gap-1"><CheckCircle2 size={12} /> شرح (Explanation)</label>
                    <input type="text" value={q.explanation || ''} onChange={(e) => handleQuestionChange(qIdx, 'explanation', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-emerald-100 outline-none text-sm bg-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-slate-100">
        <button onClick={onCancel} className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">إلغاء</button>
        <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-2 rounded-xl font-bold shadow-md transition-all active:scale-95">حفظ النشاط</button>
      </div>
    </div>
  );
};

export default VisualSpottingEditor;
