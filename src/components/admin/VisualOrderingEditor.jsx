import React, { useState } from 'react';
import { Save, X, PlusCircle, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

const VisualOrderingEditor = ({ section, onSave, onCancel }) => {
  const [title, setTitle] = useState(section.title || '');
  const [description, setDescription] = useState(section.description || '');
  const [questions, setQuestions] = useState(section.questions || []);

  const handleQuestionChange = (qIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex][field] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: 'رتب العناصر التالية:', correctOrder: ['العنصر الأول', 'العنصر الثاني'], hint: '', explanation: '' }
    ]);
  };

  const removeQuestion = (qIndex) => {
    setQuestions(questions.filter((_, i) => i !== qIndex));
  };

  const addOrderItem = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctOrder = [...(newQuestions[qIndex].correctOrder || []), 'عنصر جديد'];
    setQuestions(newQuestions);
  };

  const removeOrderItem = (qIndex, itemIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctOrder = newQuestions[qIndex].correctOrder.filter((_, i) => i !== itemIndex);
    setQuestions(newQuestions);
  };

  const moveOrderItem = (qIndex, itemIndex, direction) => {
    const newQuestions = [...questions];
    const items = [...newQuestions[qIndex].correctOrder];
    const targetIndex = itemIndex + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    [items[itemIndex], items[targetIndex]] = [items[targetIndex], items[itemIndex]];
    newQuestions[qIndex].correctOrder = items;
    setQuestions(newQuestions);
  };

  const updateOrderItem = (qIndex, itemIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctOrder[itemIndex] = value;
    setQuestions(newQuestions);
  };

  const handleSave = () => {
    onSave({
      ...section,
      title,
      description,
      questions
    });
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl border border-indigo-100 shadow-sm mt-4 animate-in fade-in slide-in-from-top-4 max-w-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-indigo-900">محرر ترتيب الأحداث (واجهة مرئية)</h3>
          <p className="text-sm text-slate-500">أضف العناصر بالترتيب الصحيح — التطبيق سيخلطها تلقائياً للطالب</p>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-rose-600 bg-slate-50 p-2 rounded-full border border-slate-200 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-6">
        {/* Main Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="md:col-span-2">
            <label className="block text-slate-700 font-medium mb-2 text-sm">عنوان النشاط</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-slate-700 font-medium mb-2 text-sm">الوصف</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none h-20"
            />
          </div>
        </div>

        {/* Questions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-800">الأسئلة ({questions.length})</h4>
            <button onClick={addQuestion} className="flex items-center gap-1 text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
              <PlusCircle size={16} /> إضافة سؤال
            </button>
          </div>

          <div className="space-y-6">
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    السؤال {qIndex + 1}
                  </span>
                  <button onClick={() => removeQuestion(qIndex)} className="text-slate-300 hover:text-rose-500" title="حذف السؤال">
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-600 text-xs font-medium mb-1">نص السؤال</label>
                    <textarea
                      value={q.text || ''}
                      onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 h-16 text-sm"
                    />
                  </div>

                  {/* Correct Order items */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-slate-600 text-xs font-medium">العناصر (بالترتيب الصحيح من الأعلى للأسفل)</label>
                      <button
                        onClick={() => addOrderItem(qIndex)}
                        className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg hover:bg-emerald-100 font-medium"
                      >
                        + عنصر
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(q.correctOrder || []).map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 group">
                          <span className="shrink-0 w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                            {itemIndex + 1}
                          </span>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => updateOrderItem(qIndex, itemIndex, e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-sm"
                          />
                          <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <button onClick={() => moveOrderItem(qIndex, itemIndex, -1)} disabled={itemIndex === 0} className="text-slate-300 hover:text-indigo-600 disabled:opacity-20">
                              <ArrowUp size={16} />
                            </button>
                            <button onClick={() => moveOrderItem(qIndex, itemIndex, 1)} disabled={itemIndex === (q.correctOrder || []).length - 1} className="text-slate-300 hover:text-indigo-600 disabled:opacity-20">
                              <ArrowDown size={16} />
                            </button>
                            <button onClick={() => removeOrderItem(qIndex, itemIndex)} className="text-slate-300 hover:text-rose-500">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 text-xs font-medium mb-1">تلميح (اختياري)</label>
                      <input
                        type="text"
                        value={q.hint || ''}
                        onChange={(e) => handleQuestionChange(qIndex, 'hint', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 text-xs font-medium mb-1">شرح الإجابة (اختياري)</label>
                      <input
                        type="text"
                        value={q.explanation || ''}
                        onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {questions.length === 0 && (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-500 text-sm">لا توجد أسئلة. اضغط على "إضافة سؤال" للبدء.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
        <button onClick={onCancel} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">
          إلغاء التعديل
        </button>
        <button onClick={handleSave} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-lg font-bold shadow-sm transition-all active:scale-95">
          اعتماد التغييرات
        </button>
      </div>
    </div>
  );
};

export default VisualOrderingEditor;
