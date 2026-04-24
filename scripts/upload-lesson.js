import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// قراءة ملف JSON من المسار المحدد (أو الافتراضي)
const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: node scripts/upload-lesson.js <path-to-json>");
  console.error("Example: node scripts/upload-lesson.js src/lessons/harouf-jar-meanings.json");
  process.exit(1);
}

const data = JSON.parse(readFileSync(filePath, 'utf-8'));

if (!data.id || !data.sections) {
  console.error("Invalid JSON: must have 'id' and 'sections'");
  process.exit(1);
}

async function upload() {
  console.log(`Uploading lesson: ${data.id} (${data.pageTitle})`);
  
  const lessonData = {
    id: data.id,
    page_title: data.pageTitle,
    header_title: data.headerTitle,
    header_subtitle: data.headerSubtitle,
    youtube_link: data.youtubeLink,
    copyright: data.copyright,
    sections: data.sections
  };

  // Check if exists
  const { data: existing } = await supabase
    .from('lessons')
    .select('id')
    .eq('id', data.id)
    .single();

  if (existing) {
    console.log("Lesson exists. Updating...");
    const { error } = await supabase.from('lessons').update(lessonData).eq('id', data.id);
    if (error) { console.error("Update failed:", error); process.exit(1); }
    console.log("✅ Updated successfully!");
  } else {
    console.log("New lesson. Inserting...");
    const { error } = await supabase.from('lessons').insert(lessonData);
    if (error) { console.error("Insert failed:", error); process.exit(1); }
    console.log("✅ Inserted successfully!");
  }
}

upload();
