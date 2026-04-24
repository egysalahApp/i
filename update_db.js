import { supabase } from './src/lib/supabase.js';

async function updateAllLessons() {
  console.log('🔄 جاري البدء في تحديث قاعدة البيانات لتطبيق نظام الألوان الجديد...');
  
  const { data: lessons, error: fetchError } = await supabase
    .from('lessons')
    .select('id, sections');

  if (fetchError) {
    console.error('❌ خطأ في جلب الدروس:', fetchError);
    return;
  }

  for (const lesson of lessons) {
    // حذف خاصية الـ theme من كل قسم ليعمل النظام التلقائي
    const updatedSections = lesson.sections.map(section => {
      const { theme, ...rest } = section;
      return rest;
    });

    const { error: updateError } = await supabase
      .from('lessons')
      .update({ sections: updatedSections })
      .eq('id', lesson.id);

    if (updateError) {
      console.error(`❌ فشل تحديث الدرس ${lesson.id}:`, updateError);
    } else {
      console.log(`✅ تم تحديث الدرس: ${lesson.id}`);
    }
  }

  console.log('✨ انتهى التحديث! جميع الدروس الآن تتبع نظام الألوان الجديد.');
}

updateAllLessons();
