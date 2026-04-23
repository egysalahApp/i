import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, X } from 'lucide-react';

const RawSectionEditor = ({ section, onSave, onCancel }) => {
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    setJsonText(JSON.stringify(section, null, 2));
  }, [section]);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonText);
      onSave(parsed);
    } catch (err) {
      setError('يوجد خطأ في صيغة الـ JSON. لا يمكن الحفظ.');
    }
  };

  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">تعديل كود القسم (مؤقت)</h3>
          <p className="text-sm text-slate-500">هذا محرر احتياطي للأنشطة التي لم يتم برمجة واجهة مرئية لها بعد.</p>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-full border border-slate-200">
          <X size={20} />
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border-r-4 border-rose-500 p-3 rounded-lg flex items-start gap-3 mb-4">
          <AlertCircle className="text-rose-500 mt-0.5" size={18} />
          <p className="text-rose-700 text-sm font-medium">{error}</p>
        </div>
      )}

      <textarea
        value={jsonText}
        onChange={(e) => {
          setJsonText(e.target.value);
          setError(null);
        }}
        className="w-full h-[400px] p-4 rounded-lg border border-slate-200 bg-slate-900 text-green-400 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        dir="ltr"
      ></textarea>

      <div className="flex justify-end gap-3 mt-4">
        <button onClick={onCancel} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium transition-colors">
          إلغاء
        </button>
        <button onClick={handleSave} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-all active:scale-95">
          <Save size={18} />
          تحديث القسم
        </button>
      </div>
    </div>
  );
};

export default RawSectionEditor;
