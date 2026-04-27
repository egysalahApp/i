import React, { useState } from 'react';
import { Save, X, PlusCircle, Trash2, ArrowUp, ArrowDown, Microscope, Highlighter, Info } from 'lucide-react';

const VisualStyleLabEditor = ({ section, onSave, onCancel }) => {
  const [title, setTitle] = useState(section.title || '');
  const [description, setDescription] = useState(section.description || '');
  const [theme, setTheme] = useState(section.theme || 'emerald');
  const [excerpts, setExcerpts] = useState(section.excerpts || []);

  const addExcerpt = () => {
    setExcerpts([...excerpts, { segments: [{ text: 'اكتب النص هنا...' }] }]);
  };

  const removeExcerpt = (index) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المقتطف؟')) {
      setExcerpts(excerpts.filter((_, i) => i !== index));
    }
  };

  const addSegment = (excerptIdx) => {
    const newExcerpts = [...excerpts];
    const newSegments = [...newExcerpts[excerptIdx].segments];
    newSegments.push({ text: '...', id: `h_${excerptIdx}_${newSegments.length}_${Date.now().toString().slice(-3)}` });
    newExcerpts[excerptIdx] = { ...newExcerpts[excerptIdx], segments: newSegments };
    setExcerpts(newExcerpts);
  };

  const removeSegment = (excerptIdx, segIdx) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الجزء؟')) {
      const newExcerpts = [...excerpts];
      const newSegments = [...newExcerpts[excerptIdx].segments];
      newSegments.splice(segIdx, 1);
      newExcerpts[excerptIdx] = { ...newExcerpts[excerptIdx], segments: newSegments };
      setExcerpts(newExcerpts);
    }
  };

  const moveSegment = (excerptIdx, segIdx, direction) => {
    const newExcerpts = [...excerpts];
    const newSegments = [...newExcerpts[excerptIdx].segments];
    const targetIdx = segIdx + direction;
    if (targetIdx < 0 || targetIdx >= newSegments.length) return;
    [newSegments[segIdx], newSegments[targetIdx]] = [newSegments[targetIdx], newSegments[segIdx]];
    newExcerpts[excerptIdx] = { ...newExcerpts[excerptIdx], segments: newSegments };
    setExcerpts(newExcerpts);
  };

  const handleSegmentChange = (excerptIdx, segIdx, field, value) => {
    const newExcerpts = [...excerpts];
    const newSegments = [...newExcerpts[excerptIdx].segments];
    newSegments[segIdx] = { ...newSegments[segIdx], [field]: value };
    newExcerpts[excerptIdx] = { ...newExcerpts[excerptIdx], segments: newSegments };
    setExcerpts(newExcerpts);
  };

  const toggleHighlight = (excerptIdx, segIdx) => {
    const newExcerpts = [...excerpts];
    const newSegments = [...newExcerpts[excerptIdx].segments];
    const seg = { ...newSegments[segIdx] };
    
    if (seg.isHighlight) {
      delete seg.isHighlight;
      delete seg.explanation;
      // We keep the ID or remove it? The viewer uses ID for selection. 
      // But if it's not a highlight, ID isn't used.
    } else {
      seg.isHighlight = true;
      seg.explanation = seg.explanation || 'اكتب الشرح البلاغي هنا...';
      seg.id = seg.id || `h_${excerptIdx}_${segIdx}_${Date.now().toString().slice(-4)}`;
    }
    
    newSegments[segIdx] = seg;
    newExcerpts[excerptIdx] = { ...newExcerpts[excerptIdx], segments: newSegments };
    setExcerpts(newExcerpts);
  };

  const handleSave = () => {
    onSave({ ...section, title, description, theme, excerpts });
  };

  const themes = ['sky', 'indigo', 'emerald', 'lime', 'green', 'rose', 'violet', 'blue', 'purple', 'orange', 'cyan', 'slate'];

  return (
    <div className="bg-white p-6 rounded-xl border border-emerald-100 shadow-sm mt-4 animate-in fade-in slide-in-from-top-4 max-w-full">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
            <Microscope size={24} /> محرر مختبر الأسلوب (تحليل النصوص)
          </h3>
          <p className="text-sm text-slate-500">حلل النصوص البلاغية وأضف شروحات تفاعلية للكلمات</p>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-rose-600 bg-slate-50 p-2 rounded-full border border-slate-200 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="space-y-8">
        {/* Settings */}
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
            <label className="block text-slate-700 font-medium mb-2 text-sm">وصف النشاط</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none h-16"></textarea>
          </div>
        </div>

        {/* Excerpts List */}
        <div className="space-y-12">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-800">الفقرات التحليلية ({excerpts.length})</h4>
            <button onClick={addExcerpt} className="flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl hover:bg-emerald-100 transition-colors border border-emerald-100 shadow-sm">
              <PlusCircle size={18} /> إضافة فقرة جديدة
            </button>
          </div>

          {excerpts.map((excerpt, eIdx) => (
            <div key={eIdx} className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm relative overflow-hidden">
              <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-500">الفقرة رقم {eIdx + 1}</span>
                <button onClick={() => removeExcerpt(eIdx)} className="text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1 text-xs font-medium">
                  <Trash2 size={16} /> حذف الفقرة
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Visual Preview */}
                <div className="bg-emerald-50/30 p-5 rounded-xl border border-emerald-100 mb-4">
                  <label className="block text-emerald-700 text-[10px] font-bold uppercase mb-2">معاينة النص المتصل</label>
                  <div className="text-lg leading-relaxed text-right flex flex-wrap gap-x-1">
                    {excerpt.segments.map((seg, i) => (
                      <span key={i} className={seg.isHighlight ? "font-bold text-emerald-600 underline decoration-2 underline-offset-4" : "text-slate-600"}>
                        {seg.text}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-slate-500 text-xs font-bold mb-2 uppercase tracking-wider">تقسيم النص والتحليل</label>
                  <div className="grid grid-cols-1 gap-4">
                    {excerpt.segments.map((seg, sIdx) => (
                      <div key={sIdx} className={`p-4 rounded-xl border-2 transition-all ${seg.isHighlight ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-50 bg-slate-50/30'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                             <button 
                               onClick={() => toggleHighlight(eIdx, sIdx)} 
                               className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${seg.isHighlight ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-200 hover:border-emerald-300 hover:text-emerald-600'}`}
                             >
                               <Highlighter size={14} />
                               {seg.isHighlight ? 'مميّزة (نشط)' : 'تمييز الكلمة'}
                             </button>
                             <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                                <button onClick={() => moveSegment(eIdx, sIdx, -1)} disabled={sIdx === 0} className="p-1 hover:bg-slate-50 text-slate-400 disabled:opacity-0"><ArrowUp size={14} /></button>
                                <button onClick={() => moveSegment(eIdx, sIdx, 1)} disabled={sIdx === excerpt.segments.length - 1} className="p-1 hover:bg-slate-50 text-slate-400 disabled:opacity-0"><ArrowDown size={14} /></button>
                             </div>
                          </div>
                          <button onClick={() => removeSegment(eIdx, sIdx)} className="text-slate-300 hover:text-rose-500 transition-colors" title="حذف هذا الجزء"><Trash2 size={16} /></button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                           <div className={`${seg.isHighlight ? 'md:col-span-5' : 'md:col-span-12'}`}>
                              <textarea 
                                value={seg.text} 
                                onChange={(e) => handleSegmentChange(eIdx, sIdx, 'text', e.target.value)}
                                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 outline-none text-lg transition-all ${seg.isHighlight ? 'border-emerald-300 focus:ring-emerald-500 font-bold' : 'border-slate-200 focus:ring-indigo-500'}`}
                                placeholder="اكتب الجزء من النص هنا..."
                                rows={2}
                              ></textarea>
                           </div>
                           {seg.isHighlight && (
                             <div className="md:col-span-7">
                               <textarea 
                                  value={seg.explanation || ''} 
                                  onChange={(e) => handleSegmentChange(eIdx, sIdx, 'explanation', e.target.value)}
                                  className="w-full text-sm px-4 py-2 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500 outline-none h-full min-h-[80px]"
                                  placeholder="اكتب الشرح البلاغي أو الإعرابي هنا..."
                               ></textarea>
                             </div>
                           )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => addSegment(eIdx)} 
                    className="w-full py-3 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all font-bold text-sm"
                  >
                    <PlusCircle size={20} /> إضافة جزء نصي للفقرة
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-12 pt-6 border-t border-slate-100">
        <button onClick={onCancel} className="px-8 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold transition-colors">إلغاء</button>
        <button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center gap-2">
          <Save size={20} /> حفظ مختبر الأسلوب
        </button>
      </div>
    </div>
  );
};

export default VisualStyleLabEditor;
