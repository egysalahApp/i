import React from 'react';

export const toArabicNum = (num) => {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num)
    .split('')
    .map((c) => arabicNumbers[c] || c)
    .join('');
};

export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Renders formatted text with support for:
 * <mark>text</mark> or <mark class="color">text</mark> - highlighted text
 * <b>text</b> - bold text
 * <big>text</big> - larger text
 * <small>text</small> - smaller text
 * 
 * Returns sanitized HTML string for use with dangerouslySetInnerHTML.
 * @param {string} text - The raw text with formatting tags
 * @param {string} theme - The current section theme color (e.g. 'emerald', 'indigo')
 * @returns {string} - HTML string with Tailwind classes applied
 */
export const renderFormattedText = (text, theme) => {
  if (!text) return '';

  // Color map for mark classes
  const colorMap = {
    'rose': 'text-rose-600',
    'amber': 'text-amber-600',
    'emerald': 'text-emerald-600',
    'sky': 'text-sky-600',
    'violet': 'text-violet-600',
    'indigo': 'text-indigo-600',
    'purple': 'text-purple-600',
    'cyan': 'text-cyan-600',
    'orange': 'text-orange-600',
    'blue': 'text-blue-600',
  };

  let result = text;

  // Process <mark class="color">text</mark>
  result = result.replace(/<mark\s+class="([^"]*)">(.*?)<\/mark>/g, (_, color, content) => {
    const colorClass = colorMap[color] || `text-${color}-600`;
    return `<span class="${colorClass} font-bold">${content}</span>`;
  });

  // Process <mark>text</mark> (default = theme color)
  result = result.replace(/<mark>(.*?)<\/mark>/g, (_, content) => {
    return `<span class="text-${theme}-600 font-bold">${content}</span>`;
  });

  // Process <b>text</b>
  result = result.replace(/<b>(.*?)<\/b>/g, (_, content) => {
    return `<span class="font-bold">${content}</span>`;
  });

  // Process <big>text</big>
  result = result.replace(/<big>(.*?)<\/big>/g, (_, content) => {
    return `<span style="font-size:1.15em">${content}</span>`;
  });

  // Process <small>text</small>
  result = result.replace(/<small>(.*?)<\/small>/g, (_, content) => {
    return `<span style="font-size:0.85em">${content}</span>`;
  });

  return result;
};
