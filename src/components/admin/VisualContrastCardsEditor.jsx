import React, { useState } from 'react';
import { Save, X, PlusCircle, Trash2, ArrowUp, ArrowDown, Columns } from 'lucide-react';

const VisualContrastCardsEditor = ({ section, onSave, onCancel }) => {
  const [title, setTitle] = useState(section.title || '');
  const [description, setDescription] = useState(section.description || '');
  const [theme, setTheme] = useState(section.theme || 'orange');
  const [pairs, setPairs] = useState(section.pairs || []);

  const handlePairChange = (index, field, value) => {
    const newPairs = [...pairs];
    newPairs[index][field] = value;
    setPairs(newPairs);
  };

  const addPair = () => {
    setPairs([...pairs, { id: `cc_${Date.now()}`, right: 'المصطلح', left: 'المقابل/الضد' }]);
  };

  const removePair = (index) => {
    setPairs(pairs.filter((_, i) => i !== index));
  };

  const movePair = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === pairs.length - 1)) return;
    const newPairs = [...pairs];
    const targetIndex = index + direction;
    [newPairs[index], newPairs[targetIndex]] = [newPairs[targetIndex], newPairs[index]];
    setPairs(newPairs);
  };

  const handleSave = () => {
    onSave({ ...section, title, description, theme, pairs });
  };

  const themes = ['sky', 'indigo', 'emerald', 'lime', 'rose', 'violet', 'blue', 'purple', 'orange', 'cyan', 'slate'];

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl border border-orange-100 shadow-sm mt-4 animate-in fade-in slide-in-from-top-4 max-w-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-orange-900 flex items-center gap-2">
            <Columns size={24} className="text-orange-600" /> محرر بطاقات المقارنة (Contrast Cards)
          </h3>
          <p className="text-sm text-slate-500">أنشئ أزواجاً من الكلمات المتقابلة أو المتضادة للمقارنة بينها</p>
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
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-2 text-sm">اللون</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none" dir="ltr">
              {themes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-slate-700 font-medium mb-2 text-sm">وصف النشاط</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none h-16"></textarea>
          </div>
        </div>

        {/* Pairs List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-800">قائمة البطاقات ({pairs.length})</h4>
            <button onClick={addPair} className="flex items-center gap-1 text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors border border-orange-200">
              <PlusCircle size={16} /> إضافة بطاقة جديدة
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {pairs.map((pair, index) => (
              <div key={index} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative group hover:border-orange-200 transition-all flex flex-col md:flex-row items-center gap-4">
                <div className="absolute top-2 left-2 flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
                   <button onClick={() => movePair(index, -1)} disabled={index === 0} className="text-slate-300 hover:text-orange-600 disabled:opacity-0"><ArrowUp size={16} /></button>
                   <button onClick={() => movePair(index, 1)} disabled={index === pairs.length - 1} className="text-slate-300 hover:text-orange-600 disabled:opacity-0"><ArrowDown size={16} /></button>
                   <button onClick={() => removePair(index)} className="text-slate-300 hover:text-rose-500"><Trash2 size={16} /></button>
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">الكلمة/المصطلح</label>
                  <textarea 
                    value={pair.right} 
                    onChange={(e) => handlePairChange(index, 'right', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-50 focus:border-orange-300 outline-none font-bold text-sm bg-slate-50/30"
                    rows={1}
                  ></textarea>
                </div>

                <div className="flex-shrink-0 hidden md:block text-orange-200">
                   <Columns size={24} />
                </div>

                <div className="flex-1 w-full">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1">المقابل/الضد</label>
                  <textarea 
                    value={pair.left} 
                    onChange={(e) => handlePairChange(index, 'left', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-slate-50 focus:border-orange-300 outline-none font-bold text-sm bg-orange-50/10"
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
        <button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-2 rounded-xl font-bold shadow-md transition-all active:scale-95">حفظ النشاط</button>
      </div>
    </div>
  );
};

export default VisualContrastCardsEditor;
