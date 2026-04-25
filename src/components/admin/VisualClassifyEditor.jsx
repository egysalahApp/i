import React, { useState } from 'react';
import { Save, X, PlusCircle, Trash2, ArrowUp, ArrowDown, LayoutGrid, CheckCircle2 } from 'lucide-react';
import RichTextarea from './RichTextarea';

const VisualClassifyEditor = ({ section, onSave, onCancel }) => {
  const [title, setTitle] = useState(section.title || '');
  const [description, setDescription] = useState(section.description || '');
  const [theme, setTheme] = useState(section.theme || 'indigo');
  const [categories, setCategories] = useState(section.categories || []);
  const [questions, setQuestions] = useState(section.questions || []);

  const handleCategoryChange = (index, field, value) => {
    const newCats = [...categories];
    newCats[index][field] = value;
    setCategories(newCats);
  };

  const addCategory = () => {
    const id = `cat_${Date.now()}`;
    setCategories([...categories, { id, label: 'تصنيف جديد', theme: 'sky' }]);
  };

  const removeCategory = (index) => {
    const catId = categories[index].id;
    setCategories(categories.filter((_, i) => i !== index));
    // Also remove questions belonging to this category or reset them? 
    // Usually better to just keep them but the UI might break. 
    // For now, let's just remove the category.
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: 'نص البطاقة الجديد', categoryId: categories[0]?.id || '', explanation: '', hint: '' }
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
    onSave({ ...section, title, description, theme, categories, questions });
  };

  const themes = ['sky', 'indigo', 'emerald', 'amber', 'rose', 'violet', 'blue', 'purple', 'orange', 'cyan', 'slate'];

  return (
    <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm mt-4 animate-in fade-in slide-in-from-top-4 max-w-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
            <LayoutGrid size={24} /> محرر صناديق التصنيف (الفرز)
          </h3>
          <p className="text-sm text-slate-500">أنشئ مجموعات وصنف الجمل والكلمات داخلها</p>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-rose-600 bg-slate-50 p-2 rounded-full border border-slate-200 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <label className="block text-slate-700 font-medium mb-2 text-sm">عنوان النشاط</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-2 text-sm">اللون الرئيسي</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" dir="ltr">
              {themes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-slate-700 font-medium mb-2 text-sm">تعليمات النشاط</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none h-20"></textarea>
          </div>
        </div>

        {/* Categories Setup */}
        <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-indigo-900">1. إعداد المجموعات (التصنيفات)</h4>
            <button onClick={addCategory} className="flex items-center gap-1 text-sm font-medium text-indigo-600 bg-white px-3 py-1.5 rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors">
              <PlusCircle size={16} /> إضافة مجموعة
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((cat, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-indigo-200 shadow-sm relative group">
                <button onClick={() => removeCategory(idx)} className="absolute -top-2 -left-2 bg-white text-rose-500 p-1 rounded-full border border-rose-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                <div className="space-y-3">
                  <input 
                    type="text" 
                    value={cat.label} 
                    onChange={(e) => handleCategoryChange(idx, 'label', e.target.value)}
                    placeholder="اسم المجموعة"
                    className="w-full font-bold text-center border-b border-slate-100 focus:border-indigo-500 outline-none pb-1"
                  />
                  <select 
                    value={cat.theme || 'sky'} 
                    onChange={(e) => handleCategoryChange(idx, 'theme', e.target.value)}
                    className="w-full text-xs p-1 rounded border border-slate-100"
                    dir="ltr"
                  >
                    {themes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Questions Setup */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-800">2. البطاقات المطلوب تصنيفها ({questions.length})</h4>
            <button onClick={addQuestion} className="flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors">
              <PlusCircle size={16} /> إضافة بطاقة
            </button>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group hover:border-indigo-300 transition-colors">
                <div className="absolute top-3 left-3 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
                   <button onClick={() => moveQuestion(idx, -1)} disabled={idx === 0} className="text-slate-300 hover:text-indigo-600 disabled:opacity-0"><ArrowUp size={20} /></button>
                   <button onClick={() => moveQuestion(idx, 1)} disabled={idx === questions.length - 1} className="text-slate-300 hover:text-indigo-600 disabled:opacity-0"><ArrowDown size={20} /></button>
                   <button onClick={() => removeQuestion(idx)} className="text-slate-300 hover:text-rose-500"><Trash2 size={20} /></button>
                </div>

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-8">
                    <label className="block text-slate-500 text-xs font-medium mb-1">نص البطاقة</label>
                    <RichTextarea 
                      value={q.text} 
                      onChange={(val) => handleQuestionChange(idx, 'text', val)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-200 font-medium h-16"
                      rows={2}
                    />
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <label className="block text-slate-500 text-xs font-medium mb-1 text-indigo-600 font-bold">المجموعة الصحيحة</label>
                    <select 
                      value={q.categoryId} 
                      onChange={(e) => handleQuestionChange(idx, 'categoryId', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border-2 border-indigo-100 focus:border-indigo-500 outline-none bg-indigo-50/30 h-16 font-bold"
                    >
                      <option value="">اختر المجموعة...</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <label className="block text-slate-500 text-xs font-medium mb-1">تلميح (Hint)</label>
                    <input 
                      type="text" 
                      value={q.hint || ''} 
                      onChange={(e) => handleQuestionChange(idx, 'hint', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-100 text-sm"
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    <label className="block text-slate-500 text-xs font-medium mb-1">شرح الإجابة الصحيحة</label>
                    <input 
                      type="text" 
                      value={q.explanation || ''} 
                      onChange={(e) => handleQuestionChange(idx, 'explanation', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-slate-100 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
        <button onClick={onCancel} className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">إلغاء</button>
        <button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-2 rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center gap-2">
          <Save size={20} /> اعتماد وحفظ النشاط
        </button>
      </div>
    </div>
  );
};

export default VisualClassifyEditor;
