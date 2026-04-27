import React, { useState } from 'react';
import { Save, X, PlusCircle, Trash2, ArrowUp, ArrowDown, Link2, GripVertical } from 'lucide-react';
import RichTextarea from './RichTextarea';

const VisualMatchingEditor = ({ section, onSave, onCancel }) => {
  const [title, setTitle] = useState(section.title || '');
  const [description, setDescription] = useState(section.description || '');
  const [theme, setTheme] = useState(section.theme || 'cyan');
  const [swapColumns, setSwapColumns] = useState(section.swapColumns || false);
  const [pairs, setPairs] = useState(section.pairs || []);

  const handlePairChange = (index, field, value) => {
    const newPairs = [...pairs];
    newPairs[index][field] = value;
    setPairs(newPairs);
  };

  const addPair = () => {
    setPairs([...pairs, { id: `m_${Date.now()}`, right: 'العبارة يميناً', left: 'العبارة يساراً' }]);
  };

  const removePair = (index) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الزوج؟')) {
      setPairs(pairs.filter((_, i) => i !== index));
    }
  };

  const movePair = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === pairs.length - 1)) return;
    const newPairs = [...pairs];
    const targetIndex = index + direction;
    [newPairs[index], newPairs[targetIndex]] = [newPairs[targetIndex], newPairs[index]];
    setPairs(newPairs);
  };

  const handleSave = () => {
    onSave({ ...section, title, description, theme, swapColumns, pairs });
  };

  const themes = ['sky', 'indigo', 'emerald', 'lime', 'green', 'rose', 'violet', 'blue', 'purple', 'orange', 'cyan'];

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl border border-cyan-100 shadow-sm mt-4 animate-in fade-in slide-in-from-top-4 max-w-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-cyan-900 flex items-center gap-2">
            <Link2 size={24} /> محرر المطابقة (التوصيل)
          </h3>
          <p className="text-sm text-slate-500">اربط بين الكلمات والمصطلحات في مجموعتين متقابلتين</p>
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
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none" />
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-2 text-sm">اللون</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none" dir="ltr">
              {themes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-slate-700 font-medium mb-2 text-sm">وصف النشاط (يدعم التنسيق)</label>
            <RichTextarea 
              value={description} 
              onChange={setDescription}
              placeholder="اكتب تعليمات النشاط هنا..."
            />
          </div>
          <div className="md:col-span-2 flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={swapColumns} 
                onChange={(e) => setSwapColumns(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              />
              <span className="text-sm font-medium text-slate-700">عكس ترتيب الأعمدة</span>
              <span className="text-xs text-slate-400">(يمين ↔ يسار)</span>
            </label>
          </div>
        </div>

        {/* Pairs List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-800">قائمة الأزواج ({pairs.length})</h4>
            <button onClick={addPair} className="flex items-center gap-1 text-sm font-medium text-cyan-600 bg-cyan-50 px-3 py-1.5 rounded-lg hover:bg-cyan-100 transition-colors">
              <PlusCircle size={16} /> إضافة زوج
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {pairs.map((pair, index) => (
              <div key={index} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative group hover:border-cyan-200 transition-all flex flex-col md:flex-row items-center gap-4">
                <div className="absolute top-2 left-2 flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
                   <button onClick={() => movePair(index, -1)} disabled={index === 0} className="text-slate-300 hover:text-cyan-600 disabled:opacity-0"><ArrowUp size={16} /></button>
                   <button onClick={() => movePair(index, 1)} disabled={index === pairs.length - 1} className="text-slate-300 hover:text-cyan-600 disabled:opacity-0"><ArrowDown size={16} /></button>
                   <button onClick={() => removePair(index)} className="text-slate-300 hover:text-rose-500"><Trash2 size={16} /></button>
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">الجهة اليمنى (النص)</label>
                  <textarea 
                    value={pair.right} 
                    onChange={(e) => handlePairChange(index, 'right', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-50 focus:border-cyan-300 outline-none font-bold text-sm bg-slate-50/30"
                    rows={1}
                  ></textarea>
                </div>

                <div className="flex-shrink-0 hidden md:block text-cyan-200">
                   <Link2 size={24} />
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">الجهة اليسرى (المطابقة)</label>
                  <textarea 
                    value={pair.left} 
                    onChange={(e) => handlePairChange(index, 'left', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-50 focus:border-cyan-300 outline-none font-bold text-sm bg-cyan-50/10"
                    rows={1}
                  ></textarea>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
        <button onClick={onCancel} className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">إلغاء</button>
        <button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700 text-white px-10 py-2 rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center gap-2">
          <Save size={20} /> حفظ نشاط المطابقة
        </button>
      </div>
    </div>
  );
};

export default VisualMatchingEditor;
