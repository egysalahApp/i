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
  { name: 'sky',     bg: 'bg-sky-500',     active: 'bg-sky-600',     border: 'border-sky-600',     ring: 'ring-sky-300' },
  { name: 'indigo',  bg: 'bg-indigo-500',  active: 'bg-indigo-600',  border: 'border-indigo-600',  ring: 'ring-indigo-300' },
  { name: 'emerald', bg: 'bg-emerald-500', active: 'bg-emerald-600', border: 'border-emerald-600', ring: 'ring-emerald-300' },
  { name: 'amber',   bg: 'bg-amber-500',   active: 'bg-amber-600',   border: 'border-amber-600',   ring: 'ring-amber-300' },
  { name: 'violet',  bg: 'bg-violet-500',  active: 'bg-violet-600',  border: 'border-violet-600',  ring: 'ring-violet-300' },
  { name: 'blue',    bg: 'bg-blue-500',    active: 'bg-blue-600',    border: 'border-blue-600',    ring: 'ring-blue-300' },
  { name: 'rose',    bg: 'bg-rose-500',    active: 'bg-rose-600',    border: 'border-rose-600',    ring: 'ring-rose-300' },
  { name: 'orange',  bg: 'bg-orange-400',  active: 'bg-orange-500',  border: 'border-orange-500',  ring: 'ring-orange-300' },
];

// ═══════════════════════════════════════════
// خريطة الألوان المشبعة حسب اسم الثيم
// تُستخدم في Classify و Sort عندما يكون للفئة ثيم محدد
// ═══════════════════════════════════════════

export const SATURATED_BY_THEME = {
  'sky':     'bg-sky-500 border-sky-600',
  'indigo':  'bg-indigo-500 border-indigo-600',
  'emerald': 'bg-emerald-500 border-emerald-600',
  'amber':   'bg-amber-500 border-amber-600',
  'violet':  'bg-violet-500 border-violet-600',
  'blue':    'bg-blue-500 border-blue-600',
  'rose':    'bg-rose-500 border-rose-600',
  'orange':  'bg-orange-400 border-orange-500',
  'purple':  'bg-purple-500 border-purple-600',
  'cyan':    'bg-cyan-500 border-cyan-600',
  'slate':   'bg-slate-400 border-slate-500',
};

// ═══════════════════════════════════════════
// ألوان بطاقات المقارنة (ContrastCards)
// ═══════════════════════════════════════════

export const CONTRAST_COLORS = {
  right: { bg: 'bg-sky-500',  border: 'border-sky-600' },
  left:  { bg: 'bg-rose-500', border: 'border-rose-600' },
};

// ═══════════════════════════════════════════
// باليت تلقائي للعناصر المتعددة (Intro cards, Radar branches)
// ═══════════════════════════════════════════

export const AUTO_PALETTE = ['sky', 'emerald', 'indigo', 'amber', 'violet', 'blue', 'rose', 'orange'];

// ═══════════════════════════════════════════
// ألوان التبويبات (الترتيب مهم — يتكرر دورياً)
// التبويب الأول دائماً sky (هوية التطبيق)
// ═══════════════════════════════════════════

export const FIRST_TAB_THEME = 'sky';
export const TAB_PALETTE = ['indigo', 'emerald', 'amber', 'violet', 'blue', 'rose', 'orange', 'slate'];
