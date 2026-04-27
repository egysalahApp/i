import React, { useState } from 'react';
import { Save, X, PlusCircle, Trash2, ArrowUp, ArrowDown, HelpCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import RichTextarea from './RichTextarea';

const VisualErrorCorrectionEditor = ({ section, onSave, onCancel }) => {
  const [title, setTitle] = useState(section.title || '');
  const [description, setDescription] = useState(section.description || '');
  const [theme, setTheme] = useState(section.theme || 'rose');
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
        words: ['هذه', 'جملة', 'بها', 'خطأ'], 
        errorWordIndex: 3, 
        options: ['صواب', 'تصحيح', 'بديل'], 
        correctOptionIndex: 0, 
        hint: '', 
        explanation: '' 
      }
    ]);
  };

  const removeQuestion = (index) => {
    if (window.confirm('هل أنت متأكد من الحذف؟')) {
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
    if (window.confirm('هل أنت متأكد من الحذف؟')) {
      const newQuestions = [...questions];
      if (newQuestions[qIdx].words.length > 1) {
        newQuestions[qIdx].words.splice(wIdx, 1);
        // Adjust errorWordIndex if needed
        if (newQuestions[qIdx].errorWordIndex >= newQuestions[qIdx].words.length) {
          newQuestions[qIdx].errorWordIndex = newQuestions[qIdx].words.length - 1;
        }
        setQuestions(newQuestions);
      }

    }
};

  const handleOptionChange = (qIdx, oIdx, value) => {
    const newQuestions = [...questions];
    newQuestions[qIdx].options[oIdx] = value;
    setQuestions(newQuestions);
  };

  const addOption = (qIdx) => {
    const newQuestions = [...questions];
    newQuestions[qIdx].options.push('خيار جديد');
    setQuestions(newQuestions);
  };

  const removeOption = (qIdx, oIdx) => {
    if (window.confirm('هل أنت متأكد من الحذف؟')) {
      const newQuestions = [...questions];
      if (newQuestions[qIdx].options.length > 1) {
        newQuestions[qIdx].options.splice(oIdx, 1);
        if (newQuestions[qIdx].correctOptionIndex >= newQuestions[qIdx].options.length) {
          newQuestions[qIdx].correctOptionIndex = newQuestions[qIdx].options.length - 1;
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
    <div className="bg-white p-4 md:p-6 rounded-xl border border-rose-100 shadow-sm mt-4 animate-in fade-in slide-in-from-top-4 max-w-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-rose-900 flex items-center gap-2">
            <AlertTriangle size={24} className="text-rose-600" /> محرر تصويب الأخطاء
          </h3>
          <p className="text-sm text-slate-500">حدد الكلمة الخطأ في الجملة واقترح التصويب الصحيح</p>
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
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none" />
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-2 text-sm">اللون</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none" dir="ltr">
              {themes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-slate-700 font-medium mb-2 text-sm">تعليمات النشاط (يدعم التنسيق)</label>
            <RichTextarea 
              value={description} 
              onChange={setDescription}
              placeholder="اكتب تعليمات النشاط هنا..."
            />
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800">الأسئلة ({questions.length})</h4>
            <button onClick={addQuestion} className="flex items-center gap-1 text-sm font-medium text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg hover:bg-rose-100 transition-colors border border-rose-200">
              <PlusCircle size={16} /> إضافة جملة جديدة
            </button>
          </div>

          {questions.map((q, qIdx) => (
            <div key={qIdx} className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm relative group hover:border-rose-200 transition-all overflow-hidden">
              <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">الجملة رقم {qIdx + 1}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => moveQuestion(qIdx, -1)} disabled={qIdx === 0} className="text-slate-300 hover:text-rose-600 disabled:opacity-0"><ArrowUp size={18} /></button>
                  <button onClick={() => moveQuestion(qIdx, 1)} disabled={qIdx === questions.length - 1} className="text-slate-300 hover:text-rose-600 disabled:opacity-0"><ArrowDown size={18} /></button>
                  <button onClick={() => removeQuestion(qIdx)} className="text-slate-300 hover:text-rose-600 ml-2"><Trash2 size={18} /></button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Words Editor */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-slate-700 font-bold text-sm">الجملة (اضغط على الكلمة الخطأ ⚠️)</label>
                    <button onClick={() => addWord(qIdx)} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded">إضافة كلمة +</button>
                  </div>
                  <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 min-h-[100px]">
                    {q.words.map((word, wIdx) => {
                      const isError = q.errorWordIndex === wIdx;
                      return (
                        <div key={wIdx} className={`relative flex flex-col gap-1 min-w-[80px] p-2 rounded-lg border-2 transition-all ${isError ? 'border-rose-400 bg-rose-50 ring-4 ring-rose-500/10' : 'border-transparent'}`}>
                          <div className="flex items-center justify-between mb-1">
                            <button 
                              onClick={() => handleQuestionChange(qIdx, 'errorWordIndex', wIdx)}
                              className={`p-1 rounded-md transition-all ${isError ? 'bg-rose-600 text-white shadow-md' : 'bg-white text-slate-300 hover:text-rose-500 border border-slate-100'}`}
                              title={isError ? "هذا هو الخطأ" : "اجعل هذه الكلمة هي الخطأ"}
                            >
                              <AlertTriangle size={12} />
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

                {/* Options Editor */}
                <div className="space-y-4 pt-4 border-t border-slate-50">
                   <div className="flex items-center justify-between">
                     <label className="text-slate-700 font-bold text-sm">خيارات التصويب (حدد الخيار الصحيح ✅)</label>
                     <button onClick={() => addOption(qIdx)} className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-2 py-1 rounded">إضافة خيار +</button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                     {q.options.map((opt, oIdx) => {
                       const isCorrect = q.correctOptionIndex === oIdx;
                       return (
                         <div key={oIdx} className="flex items-center gap-2 group">
                           <button 
                             onClick={() => handleQuestionChange(qIdx, 'correctOptionIndex', oIdx)}
                             className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all ${isCorrect ? 'bg-emerald-500 border-emerald-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-300 hover:border-emerald-500'}`}
                           >
                             <CheckCircle2 size={18} />
                           </button>
                           <input 
                             type="text" 
                             value={opt} 
                             onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                             className={`flex-grow px-3 py-2 rounded-lg border transition-all text-sm ${isCorrect ? 'border-emerald-200 bg-emerald-50/50 font-bold' : 'border-slate-100'}`}
                           />
                           <button onClick={() => removeOption(qIdx, oIdx)} className="text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                         </div>
                       )
                     })}
                   </div>
                </div>

                {/* Hint & Explanation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">تلميح (Hint)</label>
                    <RichTextarea 
                      value={q.hint || ''} 
                      onChange={(val) => handleQuestionChange(qIdx, 'hint', val)}
                      placeholder="تلميح..."
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">شرح (Explanation)</label>
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
        <button onClick={handleSave} className="bg-rose-600 hover:bg-rose-700 text-white px-10 py-2 rounded-xl font-bold shadow-md transition-all active:scale-95">حفظ النشاط</button>
      </div>
    </div>
  );
};

export default VisualErrorCorrectionEditor;
