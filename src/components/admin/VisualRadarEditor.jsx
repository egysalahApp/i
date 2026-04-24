import React, { useState } from 'react';
import { Save, X, PlusCircle, Trash2, ArrowUp, ArrowDown, Share2, CircleDot } from 'lucide-react';

const VisualRadarEditor = ({ section, onSave, onCancel }) => {
  const [title, setTitle] = useState(section.title || '');
  const [description, setDescription] = useState(section.description || '');
  const [theme, setTheme] = useState(section.theme || 'indigo');
  
  const initialMapData = section.mapData || { 
    center: { title: 'الأطروحة المركزية', text: 'شرح المركز' }, 
    branches: [] 
  };
  
  const [center, setCenter] = useState(initialMapData.center || { title: '', text: '' });
  const [branches, setBranches] = useState(initialMapData.branches || []);

  const handleCenterChange = (field, value) => {
    setCenter({ ...center, [field]: value });
  };

  const handleBranchChange = (index, field, value) => {
    const newBranches = [...branches];
    newBranches[index][field] = value;
    setBranches(newBranches);
  };

  const addBranch = () => {
    const id = `b_${Date.now()}`;
    setBranches([...branches, { id, title: 'فرع جديد', text: 'شرح الفرع هنا', color: 'sky', icon: '✨' }]);
  };

  const removeBranch = (index) => {
    setBranches(branches.filter((_, i) => i !== index));
  };

  const moveBranch = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === branches.length - 1)) return;
    const newBranches = [...branches];
    const targetIndex = index + direction;
    [newBranches[index], newBranches[targetIndex]] = [newBranches[targetIndex], newBranches[index]];
    setBranches(newBranches);
  };

  const handleSave = () => {
    onSave({ 
      ...section, 
      title, 
      description, 
      theme, 
      mapData: { center, branches } 
    });
  };

  const themes = ['sky', 'indigo', 'emerald', 'amber', 'rose', 'violet', 'blue', 'purple', 'orange', 'cyan'];

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl border border-indigo-100 shadow-sm mt-4 animate-in fade-in slide-in-from-top-4 max-w-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
            <Share2 size={24} /> محرر الخريطة الذهنية (الرادار)
          </h3>
          <p className="text-sm text-slate-500">صمم هيكل النص وأطروحته المركزية وفروعه التفاعلية</p>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-rose-600 bg-slate-50 p-2 rounded-full border border-slate-200 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-8">
        {/* Global Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <label className="block text-slate-700 font-medium mb-2 text-sm">عنوان النشاط</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-2 text-sm">اللون (Theme)</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" dir="ltr">
              {themes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-slate-700 font-medium mb-2 text-sm">وصف النشاط</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none h-16"></textarea>
          </div>
        </div>

        {/* Center Node */}
        <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
          <CircleDot className="absolute -right-8 -top-8 w-32 h-32 opacity-10" />
          <h4 className="font-bold mb-4 flex items-center gap-2 relative">
            <CircleDot size={20} /> الأطروحة المركزية (مركز الخريطة)
          </h4>
          <div className="grid grid-cols-1 gap-4 relative">
             <input 
                type="text" 
                value={center.title} 
                onChange={(e) => handleCenterChange('title', e.target.value)}
                placeholder="عنوان المركز..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:bg-white/20 outline-none font-bold"
             />
             <textarea 
                value={center.text} 
                onChange={(e) => handleCenterChange('text', e.target.value)}
                placeholder="شرح الأطروحة المركزية..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:bg-white/20 outline-none h-20"
             ></textarea>
          </div>
        </div>

        {/* Branches */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-800">الأذرع والفروع ({branches.length})</h4>
            <button onClick={addBranch} className="flex items-center gap-1 text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
              <PlusCircle size={16} /> إضافة ذراع
            </button>
          </div>

          <div className="space-y-4">
            {branches.map((branch, index) => (
              <div key={index} className="bg-white p-5 rounded-xl border-2 border-slate-100 shadow-sm relative group hover:border-indigo-200 transition-all">
                <div className="absolute top-3 left-3 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
                  <button onClick={() => moveBranch(index, -1)} disabled={index === 0} className="text-slate-300 hover:text-indigo-600 disabled:opacity-0"><ArrowUp size={20} /></button>
                  <button onClick={() => moveBranch(index, 1)} disabled={index === branches.length - 1} className="text-slate-300 hover:text-indigo-600 disabled:opacity-0"><ArrowDown size={20} /></button>
                  <button onClick={() => removeBranch(index)} className="text-slate-300 hover:text-rose-500"><Trash2 size={20} /></button>
                </div>

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-1 text-center">
                    <label className="block text-slate-500 text-xs font-medium mb-1">إيموجي</label>
                    <input type="text" value={branch.icon || ''} onChange={(e) => handleBranchChange(index, 'icon', e.target.value)} className="w-full px-2 py-2.5 rounded-lg border border-slate-200 text-center text-xl" />
                  </div>
                  <div className="col-span-12 md:col-span-8">
                    <label className="block text-slate-500 text-xs font-medium mb-1">عنوان الذراع</label>
                    <input type="text" value={branch.title} onChange={(e) => handleBranchChange(index, 'title', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 font-bold" />
                  </div>
                  <div className="col-span-12 md:col-span-3">
                    <label className="block text-slate-500 text-xs font-medium mb-1">لون الذراع</label>
                    <select value={branch.color || 'sky'} onChange={(e) => handleBranchChange(index, 'color', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200" dir="ltr">
                      {themes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="col-span-12">
                    <label className="block text-slate-500 text-xs font-medium mb-1">المحتوى التفصيلي</label>
                    <textarea value={branch.text} onChange={(e) => handleBranchChange(index, 'text', e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 h-24 leading-relaxed"></textarea>
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
          <Save size={20} /> حفظ الخريطة الذهنية
        </button>
      </div>
    </div>
  );
};

export default VisualRadarEditor;
