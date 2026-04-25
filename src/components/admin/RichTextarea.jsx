import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Bold, Highlighter, Type, Minus, RemoveFormatting, ChevronDown } from 'lucide-react';

const HIGHLIGHT_COLORS = [
  { id: '', label: 'افتراضي', tailwind: 'bg-indigo-500' },
  { id: 'rose', label: 'وردي', tailwind: 'bg-rose-500' },
  { id: 'amber', label: 'ذهبي', tailwind: 'bg-amber-500' },
  { id: 'emerald', label: 'أخضر', tailwind: 'bg-emerald-500' },
  { id: 'sky', label: 'أزرق', tailwind: 'bg-sky-500' },
  { id: 'violet', label: 'بنفسجي', tailwind: 'bg-violet-500' },
];

const RichTextarea = ({ value, onChange, className = '', rows = 3, placeholder = '', dir = 'rtl' }) => {
  const textareaRef = useRef(null);
  const [hasSelection, setHasSelection] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const toolbarRef = useRef(null);

  const checkSelection = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const hasSel = ta.selectionStart !== ta.selectionEnd;
    setHasSelection(hasSel);
    if (!hasSel) setShowColorPicker(false);
  }, []);

  useEffect(() => {
    document.addEventListener('selectionchange', checkSelection);
    return () => document.removeEventListener('selectionchange', checkSelection);
  }, [checkSelection]);

  const wrapSelection = (openTag, closeTag) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    if (start === end) return;

    const before = value.substring(0, start);
    const selected = value.substring(start, end);
    const after = value.substring(end);
    const newValue = before + openTag + selected + closeTag + after;
    onChange(newValue);

    // Restore focus and move cursor after the closing tag
    requestAnimationFrame(() => {
      ta.focus();
      const newCursorPos = start + openTag.length + selected.length + closeTag.length;
      ta.setSelectionRange(newCursorPos, newCursorPos);
      setHasSelection(false);
      setShowColorPicker(false);
    });
  };

  const handleHighlight = (colorId) => {
    if (colorId) {
      wrapSelection(`<mark class="${colorId}">`, '</mark>');
    } else {
      wrapSelection('<mark>', '</mark>');
    }
  };

  const handleBold = () => wrapSelection('<b>', '</b>');
  const handleBig = () => wrapSelection('<big>', '</big>');
  const handleSmall = () => wrapSelection('<small>', '</small>');

  const handleRemoveFormat = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    if (start === end) return;

    const before = value.substring(0, start);
    const selected = value.substring(start, end);
    const after = value.substring(end);
    const cleaned = selected.replace(/<[^>]+>/g, '');
    const newValue = before + cleaned + after;
    onChange(newValue);

    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start, start + cleaned.length);
    });
  };

  // Simple preview: convert tags to styled HTML
  const getPreviewHtml = () => {
    if (!value) return '';
    return value
      .replace(/</g, '&lt;').replace(/>/g, '&gt;') // Escape first
      .replace(/&lt;mark class=&quot;([^&]*)&quot;&gt;(.*?)&lt;\/mark&gt;/g, '<span class="formatted-mark-$1">$2</span>')
      .replace(/&lt;mark&gt;(.*?)&lt;\/mark&gt;/g, '<span class="formatted-mark-default">$1</span>')
      .replace(/&lt;b&gt;(.*?)&lt;\/b&gt;/g, '<b>$1</b>')
      .replace(/&lt;big&gt;(.*?)&lt;\/big&gt;/g, '<span style="font-size:1.15em">$1</span>')
      .replace(/&lt;small&gt;(.*?)&lt;\/small&gt;/g, '<span style="font-size:0.85em">$1</span>')
      .replace(/\n/g, '<br/>');
  };

  const hasFormatting = value && /<(mark|b|big|small)[^>]*>/.test(value);

  return (
    <div className="relative w-full">
      {/* Floating Toolbar */}
      {hasSelection && (
        <div
          ref={toolbarRef}
          className="absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full z-50 flex items-center gap-1 bg-slate-800 text-white px-2 py-1.5 rounded-xl shadow-xl border border-slate-700 animate-in fade-in zoom-in-95 duration-150"
          onMouseDown={(e) => e.preventDefault()} // Prevent textarea blur
        >
          {/* Highlight with color picker */}
          <div className="relative">
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => handleHighlight('')}
                className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-0.5"
                title="تظليل"
              >
                <Highlighter size={16} />
              </button>
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-0.5 rounded hover:bg-slate-700 transition-colors"
                title="اختيار لون"
              >
                <ChevronDown size={12} />
              </button>
            </div>

            {/* Color Picker Dropdown */}
            {showColorPicker && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-slate-800 rounded-xl p-2 shadow-xl border border-slate-700 flex gap-1.5 animate-in fade-in zoom-in-95 duration-100">
                {HIGHLIGHT_COLORS.map((c) => (
                  <button
                    key={c.id || 'default'}
                    type="button"
                    onClick={() => handleHighlight(c.id)}
                    className={`w-6 h-6 rounded-full ${c.tailwind} hover:scale-125 transition-transform ring-2 ring-transparent hover:ring-white/50`}
                    title={c.label}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-5 bg-slate-600 mx-0.5" />

          <button type="button" onClick={handleBold} className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors" title="عريض">
            <Bold size={16} />
          </button>

          <div className="w-px h-5 bg-slate-600 mx-0.5" />

          <button type="button" onClick={handleBig} className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors" title="تكبير">
            <Type size={16} />
            <span className="text-[8px] font-bold absolute -bottom-0 -right-0">+</span>
          </button>
          <button type="button" onClick={handleSmall} className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors" title="تصغير">
            <Minus size={14} />
          </button>

          <div className="w-px h-5 bg-slate-600 mx-0.5" />

          <button type="button" onClick={handleRemoveFormat} className="p-1.5 rounded-lg hover:bg-slate-700 text-rose-400 hover:text-rose-300 transition-colors" title="إزالة التنسيق">
            <RemoveFormatting size={16} />
          </button>

          {/* Arrow pointer */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-slate-800" />
        </div>
      )}

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={checkSelection}
        onBlur={() => setTimeout(() => { setHasSelection(false); setShowColorPicker(false); }, 200)}
        className={className}
        rows={rows}
        placeholder={placeholder}
        dir={dir}
      />

      {/* Live Preview */}
      {hasFormatting && (
        <div className="mt-1.5 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-600 text-right leading-relaxed">
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">معاينة</span>
          <div dangerouslySetInnerHTML={{ __html: getPreviewHtml() }} />
        </div>
      )}

      {/* Preview CSS */}
      <style>{`
        .formatted-mark-default { color: #4f46e5; font-weight: 700; }
        .formatted-mark-rose { color: #e11d48; font-weight: 700; }
        .formatted-mark-amber { color: #d97706; font-weight: 700; }
        .formatted-mark-emerald { color: #059669; font-weight: 700; }
        .formatted-mark-sky { color: #0284c7; font-weight: 700; }
        .formatted-mark-violet { color: #7c3aed; font-weight: 700; }
      `}</style>
    </div>
  );
};

export default RichTextarea;
