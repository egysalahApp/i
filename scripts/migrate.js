import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { lessonsData } from '../src/lessons/index.js';

// Load env vars from .env file
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrate() {
  console.log("Starting migration...");
  
  for (const [id, data] of Object.entries(lessonsData)) {
    console.log(`Migrating lesson: ${id}`);
    
    // Check if it already exists to avoid errors on re-runs
    const { data: existing, error: fetchError } = await supabase
      .from('lessons')
      .select('id')
      .eq('id', id)
      .single();
      
    if (existing) {
       console.log(`Lesson ${id} already exists. Updating...`);
       const { error } = await supabase
         .from('lessons')
         .update({
            page_title: data.pageTitle,
            header_title: data.headerTitle,
            header_subtitle: data.headerSubtitle,
            youtube_link: data.youtubeLink,
            copyright: data.copyright,
            sections: data.sections
         })
         .eq('id', id);
         
       if (error) console.error(`Failed to update ${id}:`, error);
       else console.log(`Successfully updated ${id}`);
    } else {
       console.log(`Inserting new lesson ${id}...`);
       const { error } = await supabase
         .from('lessons')
         .insert({
            id: id,
            page_title: data.pageTitle,
            header_title: data.headerTitle,
            header_subtitle: data.headerSubtitle,
            youtube_link: data.youtubeLink,
            copyright: data.copyright,
            sections: data.sections
         });
         
       if (error) console.error(`Failed to insert ${id}:`, error);
       else console.log(`Successfully inserted ${id}`);
    }
  }
  
  console.log("Migration complete!");
}

migrate();
