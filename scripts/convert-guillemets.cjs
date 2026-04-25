/**
 * Script to convert «text» to <mark>text</mark> in lesson JSON files.
 * Only converts in question/text fields of interactive activities.
 */
const fs = require('fs');
const path = require('path');

const LESSONS_DIR = path.join(__dirname, '..', 'src', 'lessons');

// Activity types whose question text fields use «» for highlighting
const HIGHLIGHT_ACTIVITY_TYPES = ['mcq', 'tap_to_fill', 'classify', 'sort', 'error_correction'];

function convertGuillements(text) {
  if (!text || typeof text !== 'string') return text;
  // Replace «text» with <mark>text</mark>
  return text.replace(/«([^»]+)»/g, '<mark>$1</mark>');
}

function processLesson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw);
  let changeCount = 0;

  if (!data.sections) return 0;

  data.sections.forEach(section => {
    if (!HIGHLIGHT_ACTIVITY_TYPES.includes(section.type)) return;

    // Process questions array
    if (section.questions) {
      section.questions.forEach(q => {
        if (q.text && q.text.includes('«')) {
          const original = q.text;
          q.text = convertGuillements(q.text);
          if (q.text !== original) changeCount++;
        }
      });
    }
  });

  if (changeCount > 0) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
    console.log(`✅ ${path.basename(filePath)}: ${changeCount} replacements`);
  } else {
    console.log(`⏭️  ${path.basename(filePath)}: no changes needed`);
  }

  return changeCount;
}

// Process all JSON files in lessons directory
const files = fs.readdirSync(LESSONS_DIR).filter(f => f.endsWith('.json'));
let totalChanges = 0;

files.forEach(file => {
  const filePath = path.join(LESSONS_DIR, file);
  totalChanges += processLesson(filePath);
});

console.log(`\n🎉 Done! Total replacements: ${totalChanges}`);
