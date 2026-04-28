import React, { useState, useEffect } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import fs from 'fs';

// Mock components to simulate Classify.jsx environment
const Classify = () => {
  // Simulate the issue
  return <div>Test</div>;
};

// We will just read the waqour.json file and parse it.
const data = JSON.parse(fs.readFileSync('./src/lessons/waqour.json', 'utf8'));
const classifySection = data.sections.find(s => s.type === 'classify');

console.log('Categories:', classifySection.categories);
console.log('Questions:', classifySection.questions.length);

const categoriesWithTheme = classifySection.categories.map((cat, idx) => {
  let t = cat.theme || 'sky';
  if (t === 'amber') t = 'orange';
  return { ...cat, theme: t };
});

console.log('Categories with theme:', categoriesWithTheme);
