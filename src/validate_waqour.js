import fs from 'fs';
import { validateLesson } from './lib/schemas.js';

const data = JSON.parse(fs.readFileSync('./lessons/waqour.json', 'utf8'));
const result = validateLesson(data);

if (result.success) {
  console.log("Validation Successful!");
} else {
  console.error("Validation Failed:", result.errors);
}
