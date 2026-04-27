/**
 * 🎨 نظام الألوان المركزي للتطبيق
 * 
 * كل الأنشطة تستورد ألوانها من هنا.
 * لتغيير لون → عدّل هنا فقط → يتغير في كل التطبيق.
 * 
 * القواعد:
 * - 8 ألوان مبهجة مشبعة بدون مبالغة
 * - sky = هوية التطبيق (التبويب الأول دائماً)
 * - لون واحد فقط من عائلة الأحمر (rose)
 * - لا teal، لا fuchsia، لا ألوان مطفية
 * - كل الألوان بدرجة 500 (مشرقة وواضحة)
 */

// ═══════════════════════════════════════════
// الألوان الثمانية الأساسية للأزرار والصناديق
// ═══════════════════════════════════════════

export const ACTIVITY_COLORS = [
  { name: 'sky',     bg: 'bg-sky-500',     active: 'bg-sky-600',     border: 'border-sky-500',     ring: 'ring-sky-300' },
  { name: 'indigo',  bg: 'bg-indigo-500',  active: 'bg-indigo-600',  border: 'border-indigo-500',  ring: 'ring-indigo-300' },
  { name: 'emerald', bg: 'bg-emerald-500', active: 'bg-emerald-600', border: 'border-emerald-500', ring: 'ring-emerald-300' },
  { name: 'lime',    bg: 'bg-lime-500',    active: 'bg-lime-600',    border: 'border-lime-500',    ring: 'ring-lime-300' },
  { name: 'violet',  bg: 'bg-violet-500',  active: 'bg-violet-600',  border: 'border-violet-500',  ring: 'ring-violet-300' },
  { name: 'blue',    bg: 'bg-blue-500',    active: 'bg-blue-600',    border: 'border-blue-500',    ring: 'ring-blue-300' },
  { name: 'rose',    bg: 'bg-rose-500',    active: 'bg-rose-600',    border: 'border-rose-500',    ring: 'ring-rose-300' },
  { name: 'orange',  bg: 'bg-orange-500',  active: 'bg-orange-600',  border: 'border-orange-500',  ring: 'ring-orange-300' },
  { name: 'green',   bg: 'bg-green-500',   active: 'bg-green-600',   border: 'border-green-500',   ring: 'ring-green-300' },
];

// ═══════════════════════════════════════════
// خريطة الألوان المشبعة حسب اسم الثيم
// تُستخدم في Classify و Sort عندما يكون للفئة ثيم محدد
// ═══════════════════════════════════════════

export const SATURATED_BY_THEME = {
  'sky':     'bg-sky-500 border-sky-500',
  'indigo':  'bg-indigo-500 border-indigo-500',
  'emerald': 'bg-emerald-500 border-emerald-500',
  'lime':    'bg-lime-500 border-lime-500',
  'violet':  'bg-violet-500 border-violet-500',
  'blue':    'bg-blue-500 border-blue-500',
  'rose':    'bg-rose-500 border-rose-500',
  'orange':  'bg-orange-500 border-orange-500',
  'purple':  'bg-purple-500 border-purple-500',
  'cyan':    'bg-cyan-500 border-cyan-500',
  'slate':   'bg-slate-400 border-slate-400',
  'green':   'bg-green-500 border-green-500',
};

// ═══════════════════════════════════════════
// ألوان بطاقات المقارنة (ContrastCards)
// ═══════════════════════════════════════════

export const CONTRAST_COLORS = {
  right: { bg: 'bg-sky-50',  border: 'border-sky-200', text: 'text-sky-900' },
  left:  { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-900' },
};

// ═══════════════════════════════════════════
// باليت تلقائي للعناصر المتعددة (Intro cards, Radar branches)
// ═══════════════════════════════════════════

export const AUTO_PALETTE = ['sky', 'emerald', 'indigo', 'orange', 'violet', 'blue', 'rose', 'lime'];

// ═══════════════════════════════════════════
// ألوان التبويبات (الترتيب مهم — يتكرر دورياً)
// التبويب الأول دائماً sky (هوية التطبيق)
// ═══════════════════════════════════════════

export const FIRST_TAB_THEME = 'sky';
export const TAB_PALETTE = ['indigo', 'emerald', 'orange', 'violet', 'blue', 'green', 'purple', 'slate'];
