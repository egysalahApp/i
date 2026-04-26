const merged = [
  { wordLetter: "حُ", patternLetter: "فُ", isRoot: true },
  { wordLetter: "رِّ", patternLetter: "عْلِ", isRoot: true },
  { wordLetter: "يَّة", patternLetter: "يَّة", isRoot: false }
];

const splitCluster = (text) => {
  if (!text) return [];
  const clusters = text.match(/[\u0621-\u064A\u0671-\u06D3][\u064B-\u065F\u0670\u0651]*/g);
  return clusters || [text];
};

const finalBreakdown = [];
for (const item of merged) {
  const wClusters = splitCluster(item.wordLetter);
  const pClusters = splitCluster(item.patternLetter);
  const maxLen = Math.max(wClusters.length, pClusters.length);
  
  if (maxLen <= 1) {
    finalBreakdown.push(item);
  } else {
    for (let j = 0; j < maxLen; j++) {
      finalBreakdown.push({
        wordLetter: wClusters[j] || '',
        patternLetter: pClusters[j] || '',
        isRoot: item.isRoot
      });
    }
  }
}

console.log(finalBreakdown);
