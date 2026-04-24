import React, { useState } from 'react';
import { Save, X, PlusCircle, Trash2, ArrowUp, ArrowDown, Layers, MousePointer2 } from 'lucide-react';

const VisualSortEditor = ({ section, onSave, onCancel }) => {
  const [title, setTitle] = useState(section.title || '');
  const [description, setDescription] = useState(section.description || '');
  const [theme, setTheme] = useState(section.theme || 'emerald');
  
  // In sort, we often have the same options for all questions. 
  // Let's extract options from the first question if available.
  const initialOptions = section.questions?.[0]?.options || ['التصنيف الأول', 'التصنيف الثاني'];
  const [globalOptions, setGlobalOptions] = useState(initialOptions);
  
  const [questions, setQuestions] = useState(section.questions || []);

  const handleOptionChange = (idx, value) => {
    const newOpts = [...globalOptions];
    newOpts[idx] = value;
    setGlobalOptions(newOpts);
    
    // Update all questions' options
    const newQuestions = questions.map(q => ({ ...q, options: newOpts }));
    setQuestions(newQuestions);
  };

  const addOption = () => {
    const newOpts = [...globalOptions, `تصنيف جديد ${globalOptions.length + 1}`];
    setGlobalOptions(newOpts);
    const newQuestions = questions.map(q => ({ ...q, options: newOpts }));
    setQuestions(newQuestions);
  };

  const removeOption = (idx) => {
    if (globalOptions.length <= 1) return;
    const newOpts = globalOptions.filter((_, i) => i !== idx);
    setGlobalOptions(newOpts);
    
    // Update all questions, resetting 'correct' if it was this option or fixing index
    const newQuestions = questions.map(q => {
      let newCorrect = q.correct;
      if (q.correct === idx) newCorrect = 0;
      else if (q.correct > idx) newCorrect -= 1;
      return { ...q, options: newOpts, correct: newCorrect };
    });
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (idx, field, value) => {
    const newQuestions = [...questions];
    newQuestions[idx][field] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { 
      text: 'محتوى البطاقة الجديد...', 
      options: globalOptions, 
      correct: 0, 
      hint: '', 
      explanation: '' 
    }]);
  };

  const removeQuestion = (idx) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const moveQuestion = (idx, direction) => {
    if ((direction === -1 && idx === 0) || (direction === 1 && idx === questions.length - 1)) return;
    const newQuestions = [...questions];
    const targetIdx = idx + direction;
    [newQuestions[idx], newQuestions[targetIdx]] = [newQuestions[targetIdx], newQuestions[idx]];
    setQuestions(newQuestions);
  };

  const handleSave = () => {
    onSave({ ...section, title, description, theme, questions });
  };

  const themes = ['sky', 'indigo', 'emerald', 'amber', 'rose', 'violet', 'blue', 'purple', 'orange', 'cyan'];

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl border border-blue-100 shadow-sm mt-4 animate-in fade-in slide-in-from-top-4 max-w-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
            <Layers size={24} /> محرر فرز البطاقات (Sort)
          </h3>
          <p className="text-sm text-slate-500">صمم بطاقات ليقوم الطالب بفرزها إلى مجموعات</p>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-rose-600 bg-slate-50 p-2 rounded-full border border-slate-200 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-8">
        {/* Global Config */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <label className="block text-slate-700 font-medium mb-2 text-sm">عنوان النشاط</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-2 text-sm">اللون</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none" dir="ltr">
              {themes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-slate-700 font-medium mb-2 text-sm">تعليمات النشاط</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none h-16"></textarea>
          </div>
        </div>

        {/* Global Categories */}
        <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
           <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-emerald-900">1. مجموعات الفرز (التصنيفات الثابتة)</h4>
              <button onClick={addOption} className="text-xs font-bold bg-white text-emerald-600 px-3 py-1.5 rounded-lg border border-emerald-200 shadow-sm flex items-center gap-1">
                 <PlusCircle size={14} /> إضافة تصنيف
              </button>
           </div>
           <div className="flex flex-wrap gap-3">
              {globalOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-emerald-100 shadow-sm group">
                  <input 
                    type="text" 
                    value={opt} 
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    className="bg-transparent border-none focus:ring-0 outline-none font-bold text-emerald-800 text-sm w-32"
                  />
                  <button onClick={() => removeOption(idx)} className="text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
           </div>
        </div>

        {/* Cards List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-800">2. البطاقات المطلوب فرزها ({questions.length})</h4>
            <button onClick={addQuestion} className="flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors">
              <PlusCircle size={16} /> إضافة بطاقة
            </button>
          </div>

          <div className="space-y-4">
            {questions.map((q, qIdx) => (
              <div key={qIdx} className="bg-white p-5 rounded-xl border-2 border-slate-100 shadow-sm relative group hover:border-emerald-300 transition-all">
                <div className="absolute top-3 left-3 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
                   <button onClick={() => moveQuestion(qIdx, -1)} disabled={qIdx === 0} className="text-slate-300 hover:text-emerald-600 disabled:opacity-0"><ArrowUp size={20} /></button>
                   <button onClick={() => moveQuestion(qIdx, 1)} disabled={qIdx === questions.length - 1} className="text-slate-300 hover:text-emerald-600 disabled:opacity-0"><ArrowDown size={20} /></button>
                   <button onClick={() => removeQuestion(qIdx)} className="text-slate-300 hover:text-rose-500"><Trash2 size={20} /></button>
                </div>

                <div className="grid grid-cols-12 gap-6">
                   <div className="col-span-12 md:col-span-7">
                      <label className="block text-slate-500 text-[10px] font-bold uppercase mb-2">محتوى البطاقة</label>
                      <textarea 
                        value={q.text} 
                        onChange={(e) => handleQuestionChange(qIdx, 'text', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-lg font-medium leading-relaxed h-24"
                      ></textarea>
                   </div>
                   <div className="col-span-12 md:col-span-5 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <label className="block text-emerald-700 text-[10px] font-bold uppercase mb-3 flex items-center gap-1">
                        <MousePointer2 size={12} /> التصنيف الصحيح
                      </label>
                      <div className="space-y-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                         {globalOptions.map((opt, oIdx) => (
                           <button 
                             key={oIdx}
                             onClick={() => handleQuestionChange(qIdx, 'correct', oIdx)}
                             className={`w-full text-right px-3 py-1.5 rounded-lg text-sm font-bold transition-all border-2 ${q.correct === oIdx ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-200'}`}
                           >
                             {opt}
                           </button>
                         ))}
                      </div>
                   </div>
                   <div className="col-span-12 md:col-span-6">
                      <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">تلميح</label>
                      <input type="text" value={q.hint || ''} onChange={(e) => handleQuestionChange(qIdx, 'hint', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-100 text-sm focus:border-emerald-300 outline-none" />
                   </div>
                   <div className="col-span-12 md:col-span-6">
                      <label className="block text-slate-500 text-[10px] font-bold uppercase mb-1">شرح الإجابة</label>
                      <input type="text" value={q.explanation || ''} onChange={(e) => handleQuestionChange(qIdx, 'explanation', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-100 text-sm focus:border-emerald-300 outline-none" />
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-12 pt-6 border-t border-slate-100">
        <button onClick={onCancel} className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">إلغاء</button>
        <button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-2 rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center gap-2">
          <Save size={20} /> حفظ نشاط الفرز
        </button>
      </div>
    </div>
  );
};

export default VisualSortEditor;
