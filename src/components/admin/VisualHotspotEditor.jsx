import React, { useState } from 'react';
import { Save, X, PlusCircle, Trash2, ArrowUp, ArrowDown, Target, Highlighter, Info } from 'lucide-react';
import RichTextarea from './RichTextarea';

const VisualHotspotEditor = ({ section, onSave, onCancel }) => {
  const [title, setTitle] = useState(section.title || '');
  const [description, setDescription] = useState(section.description || '');
  const [theme, setTheme] = useState(section.theme || 'cyan');
  const [questions, setQuestions] = useState(section.questions || []);

  const addQuestion = () => {
    setQuestions([...questions, { 
      task: 'استخرج من النص...', 
      requiredCount: 1, 
      paragraph: [{ id: `p_${Date.now()}`, text: 'اكتب النص هنا...', isTarget: false }],
      hint: '',
      explanation: ''
    }]);
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

  const handleQuestionChange = (qIdx, field, value) => {
    const newQuestions = [...questions];
    newQuestions[qIdx] = { ...newQuestions[qIdx], [field]: value };
    setQuestions(newQuestions);
  };

  const addParagraphPart = (qIdx) => {
    const newQuestions = [...questions];
    const newPara = [...newQuestions[qIdx].paragraph];
    newPara.push({ id: `p_${qIdx}_${newPara.length}_${Date.now().toString().slice(-3)}`, text: '...', isTarget: false });
    newQuestions[qIdx] = { ...newQuestions[qIdx], paragraph: newPara };
    setQuestions(newQuestions);
  };

  const removeParagraphPart = (qIdx, pIdx) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الجزء من الفقرة؟')) {
      const newQuestions = [...questions];
      const newPara = [...newQuestions[qIdx].paragraph];
      newPara.splice(pIdx, 1);
      newQuestions[qIdx] = { ...newQuestions[qIdx], paragraph: newPara };
      setQuestions(newQuestions);
    }
  };

  const toggleTarget = (qIdx, pIdx) => {
    const newQuestions = [...questions];
    const newPara = [...newQuestions[qIdx].paragraph];
    newPara[pIdx] = { ...newPara[pIdx], isTarget: !newPara[pIdx].isTarget };
    newQuestions[qIdx] = { ...newQuestions[qIdx], paragraph: newPara };
    setQuestions(newQuestions);
  };

  const handleParaPartChange = (qIdx, pIdx, value) => {
    const newQuestions = [...questions];
    const newPara = [...newQuestions[qIdx].paragraph];
    newPara[pIdx] = { ...newPara[pIdx], text: value };
    newQuestions[qIdx] = { ...newQuestions[qIdx], paragraph: newPara };
    setQuestions(newQuestions);
  };

  const handleSave = () => {
    onSave({ ...section, title, description, theme, questions });
  };

  const themes = ['sky', 'indigo', 'emerald', 'lime', 'green', 'rose', 'violet', 'blue', 'purple', 'orange', 'cyan'];

  return (
    <div className="bg-white p-6 rounded-xl border border-cyan-100 shadow-sm mt-4 animate-in fade-in slide-in-from-top-4 max-w-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-cyan-900 flex items-center gap-2">
            <Target size={24} /> محرر النص التفاعلي (Hotspot)
          </h3>
          <p className="text-sm text-slate-500">أنشئ أسئلة تعتمد على استخراج كلمات محددة من الفقرة</p>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-rose-600 bg-slate-50 p-2 rounded-full border border-slate-200 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Settings */}
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
            <h4 className="font-bold text-slate-800">الأسئلة الاستخراجية ({questions.length})</h4>
            <button onClick={addQuestion} className="flex items-center gap-1 text-sm font-medium text-cyan-600 bg-cyan-50 px-3 py-1.5 rounded-lg hover:bg-cyan-100 transition-colors border border-cyan-200">
              <PlusCircle size={16} /> إضافة سؤال
            </button>
          </div>

          {questions.map((q, qIdx) => (
            <div key={qIdx} className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm relative overflow-hidden group hover:border-cyan-200 transition-all">
              <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 tracking-widest uppercase">السؤال رقم {qIdx + 1}</span>
                <div className="flex items-center gap-2">
                   <button onClick={() => moveQuestion(qIdx, -1)} disabled={qIdx === 0} className="text-slate-300 hover:text-cyan-600 disabled:opacity-0"><ArrowUp size={16} /></button>
                   <button onClick={() => moveQuestion(qIdx, 1)} disabled={qIdx === questions.length - 1} className="text-slate-300 hover:text-cyan-600 disabled:opacity-0"><ArrowDown size={16} /></button>
                   <button onClick={() => removeQuestion(qIdx)} className="text-slate-300 hover:text-rose-500 ml-2"><Trash2 size={16} /></button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Question Task */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-10">
                    <label className="block text-slate-700 font-bold mb-1 text-sm">مهمة الطالب (السؤال)</label>
                    <textarea 
                      value={q.task} 
                      onChange={(e) => handleQuestionChange(qIdx, 'task', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none h-20"
                      placeholder="مثلاً: استخرج الكلمة الممنوعة من الصرف..."
                    ></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-slate-700 font-bold mb-1 text-sm text-center">العدد المطلوب</label>
                    <input 
                      type="number" 
                      value={q.requiredCount} 
                      onChange={(e) => handleQuestionChange(qIdx, 'requiredCount', parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 text-center font-bold h-20 text-2xl"
                    />
                  </div>
                </div>

                {/* Paragraph Editor */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-widest">فقرة الاستخراج (قسم النص إلى أجزاء)</label>
                     <div className="text-[10px] text-cyan-600 font-bold bg-cyan-50 px-2 py-0.5 rounded">اضغط على زر الهدف 🎯 لتحديد الإجابة الصحيحة</div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">
                    {q.paragraph.map((part, pIdx) => (
                      <div key={pIdx} className={`relative flex flex-col gap-1 min-w-[100px] p-2 rounded-lg border-2 transition-all ${part.isTarget ? 'border-cyan-400 bg-cyan-100/50 ring-4 ring-cyan-500/10' : 'border-transparent'}`}>
                        <div className="flex items-center justify-between mb-1">
                           <button 
                             onClick={() => toggleTarget(qIdx, pIdx)} 
                             className={`p-1 rounded-md transition-all ${part.isTarget ? 'bg-cyan-600 text-white shadow-md' : 'bg-white text-slate-300 hover:text-cyan-500 border border-slate-100'}`}
                             title={part.isTarget ? "هذه إجابة صحيحة" : "اجعلها إجابة صحيحة"}
                           >
                             <Target size={12} />
                           </button>
                           <button onClick={() => removeParagraphPart(qIdx, pIdx)} className="text-slate-200 hover:text-rose-500"><Trash2 size={12} /></button>
                        </div>
                        <textarea 
                          value={part.text} 
                          onChange={(e) => handleParaPartChange(qIdx, pIdx, e.target.value)}
                          className="w-full bg-transparent border-none focus:ring-0 outline-none text-right font-medium resize-none overflow-hidden"
                          rows={1}
                        ></textarea>
                      </div>
                    ))}
                    <button 
                      onClick={() => addParagraphPart(qIdx)} 
                      className="h-10 w-10 flex items-center justify-center rounded-full border-2 border-dashed border-slate-300 text-slate-300 hover:border-cyan-400 hover:text-cyan-600 hover:bg-cyan-50 transition-all"
                    >
                      <PlusCircle size={20} />
                    </button>
                  </div>
                </div>

                {/* Hint & Explanation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="bg-orange-50/30 p-4 rounded-xl border border-orange-100">
                      <label className="block text-orange-700 text-xs font-bold mb-2 flex items-center gap-1">
                        <Info size={14} /> التلميح (Hint)
                      </label>
                      <RichTextarea 
                        value={q.hint || ''} 
                        onChange={(val) => handleQuestionChange(qIdx, 'hint', val)}
                        placeholder="ساعد الطالب بكلمة..."
                      />
                   </div>
                   <div className="bg-emerald-50/30 p-4 rounded-xl border border-emerald-100">
                      <label className="block text-emerald-700 text-xs font-bold mb-2 flex items-center gap-1">
                        <Save size={14} /> شرح الإجابة
                      </label>
                      <RichTextarea 
                        value={q.explanation || ''} 
                        onChange={(val) => handleQuestionChange(qIdx, 'explanation', val)}
                        placeholder="لماذا هذه هي الإجابة؟"
                      />
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-12 pt-6 border-t border-slate-100">
        <button onClick={onCancel} className="px-8 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-colors">إلغاء</button>
        <button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700 text-white px-12 py-2.5 rounded-xl font-bold shadow-lg shadow-cyan-200 transition-all active:scale-95 flex items-center gap-2">
          <Save size={20} /> حفظ النص التفاعلي
        </button>
      </div>
    </div>
  );
};

export default VisualHotspotEditor;
