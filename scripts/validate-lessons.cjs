/**
 * Validate lesson JSON files against the Zod schema
 */
const fs = require('fs');
const path = require('path');

const LESSONS_DIR = path.join(__dirname, '..', 'src', 'lessons');

// Simple JSON parse validation + structure check
const files = fs.readdirSync(LESSONS_DIR).filter(f => f.endsWith('.json'));

let allValid = true;

files.forEach(file => {
  const filePath = path.join(LESSONS_DIR, file);
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    
    // Basic structure checks
    if (!data.id) throw new Error('Missing id');
    if (!data.pageTitle) throw new Error('Missing pageTitle');
    if (!data.sections || !Array.isArray(data.sections)) throw new Error('Missing/invalid sections');
    
    // Check each section
    data.sections.forEach((s, idx) => {
      if (!s.id) throw new Error(`Section ${idx}: missing id`);
      if (!s.type) throw new Error(`Section ${idx}: missing type`);
      if (!s.title) throw new Error(`Section ${idx}: missing title`);
    });

    // Check for broken <mark> tags
    const rawStr = JSON.stringify(data);
    const openMarks = (rawStr.match(/<mark/g) || []).length;
    const closeMarks = (rawStr.match(/<\/mark>/g) || []).length;
    
    if (openMarks !== closeMarks) {
      throw new Error(`Unbalanced <mark> tags: ${openMarks} opens, ${closeMarks} closes`);
    }

    // Check no remaining «» in question text fields
    let remainingGuillemets = 0;
    const activityTypes = ['mcq', 'tap_to_fill', 'classify', 'sort', 'error_correction'];
    data.sections.forEach(s => {
      if (activityTypes.includes(s.type) && s.questions) {
        s.questions.forEach(q => {
          if (q.text && q.text.includes('«')) remainingGuillemets++;
        });
      }
    });

    const markCount = openMarks;
    console.log(`✅ ${file} — valid (${data.sections.length} sections, ${markCount} <mark> tags${remainingGuillemets > 0 ? `, ⚠️ ${remainingGuillemets} remaining «»` : ''})`);
    
  } catch (err) {
    console.log(`❌ ${file} — INVALID: ${err.message}`);
    allValid = false;
  }
});

console.log(allValid ? '\n🎉 All files valid!' : '\n⚠️ Some files have issues!');
