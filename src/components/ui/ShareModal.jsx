import React, { useState, useEffect } from 'react';
import { Link2, Copy, Check, X } from 'lucide-react';

// ═══════════════════════════════════════════
// تشفير وفك تشفير رمز المشاركة
// ═══════════════════════════════════════════

export function generateShareToken(lessonId, sectionId, durationMs) {
  const payload = {
    l: lessonId,
    s: sectionId,
    e: Date.now() + durationMs,
  };
  return btoa(JSON.stringify(payload));
}

export function decodeShareToken(token) {
  try {
    const decoded = JSON.parse(atob(token));
    if (!decoded.l || !decoded.s || !decoded.e) return null;
    if (Date.now() > decoded.e) return { expired: true, lessonId: decoded.l, sectionId: decoded.s };
    return { expired: false, lessonId: decoded.l, sectionId: decoded.s, expiresAt: decoded.e };
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════
// خيارات المدة
// ═══════════════════════════════════════════

const DURATIONS = [
  { label: 'ساعة', ms: 60 * 60 * 1000 },
  { label: 'يوم', ms: 24 * 60 * 60 * 1000 },
  { label: 'أسبوع', ms: 7 * 24 * 60 * 60 * 1000 },
  { label: 'شهر', ms: 30 * 24 * 60 * 60 * 1000 },
];

// ═══════════════════════════════════════════
// مكوّن النافذة المنبثقة
// ═══════════════════════════════════════════

const ShareModal = ({ isOpen, onClose, lessonId, sectionId, sectionTitle }) => {
  const [selectedDuration, setSelectedDuration] = useState(1); // default: يوم
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const token = generateShareToken(lessonId, sectionId, DURATIONS[selectedDuration].ms);
      const baseUrl = window.location.origin;
      setGeneratedLink(`${baseUrl}/share/${token}`);
      setCopied(false);
    }
  }, [isOpen, selectedDuration, lessonId, sectionId]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = generatedLink;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] animate-fadeIn" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 md:p-8 relative animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
          dir="rtl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
              <Link2 className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">مشاركة قسم</h3>
              <p className="text-sm text-slate-500 font-medium">{sectionTitle}</p>
            </div>
          </div>

          {/* Duration Selection */}
          <div className="mb-5">
            <label className="block text-sm font-bold text-slate-600 mb-2">صلاحية الرابط</label>
            <div className="flex gap-2">
              {DURATIONS.map((dur, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDuration(idx)}
                  className={`flex-1 py-2 px-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                    selectedDuration === idx
                      ? 'bg-indigo-500 text-white shadow-md'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {dur.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generated Link */}
          <div className="mb-5">
            <label className="block text-sm font-bold text-slate-600 mb-2">الرابط</label>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left dir-ltr">
              <p className="text-xs text-slate-500 font-mono break-all leading-relaxed select-all" dir="ltr">
                {generatedLink}
              </p>
            </div>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={`w-full py-3 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
              copied
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-md'
            }`}
          >
            {copied ? (
              <>
                <Check size={20} />
                تم نسخ الرابط!
              </>
            ) : (
              <>
                <Copy size={20} />
                نسخ الرابط
              </>
            )}
          </button>

          {/* Info */}
          <p className="text-center text-xs text-slate-400 mt-4">
            الطالب سيرى هذا القسم فقط • ينتهي بعد {DURATIONS[selectedDuration].label}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.25s ease-out; }
      `}</style>
    </>
  );
};

export default ShareModal;
