export const records = Object.freeze([
  { id: 'SR-104', name: 'Trail accessibility repairs', region: 'North', status: 'Open' },
  { id: 'SR-108', name: 'Library entrance survey', region: 'North', status: 'Closed' },
  { id: 'SR-112', name: 'Bus stop lighting request', region: 'South', status: 'In review' },
  { id: 'SR-119', name: 'River path resurfacing', region: 'South', status: 'Open' }
]);

export function answerQuestion(question) {
  const text = question.toLowerCase().trim();
  if (/[^\s\w?-]|\b(?:not|except|before|after|latest|oldest|why|who|cost|budget|date|when|or)\b/.test(text)) return null;
  if (!/^[\w\s?-]+$/.test(text)) return null;
  const words = text.replace(/\?/g, '').split(/\s+/).filter(Boolean);
  const supported = /^(?:show|list|find|what|which|is|are|the|me|all|how|many|records?|requests?|in|from|north|south|open|closed|review|and|sr-\d+)$/;
  if (words.some(word => !supported.test(word))) return null;
  const ids = words.filter(word => /^sr-\d+$/.test(word));
  const regions = ['north', 'south'].filter(region => words.includes(region));
  const statuses = ['open', 'closed', 'in review'].filter(status => text.includes(status) &&
    (status === 'in review' || words.includes(status)));
  if (ids.length > 1 || regions.length > 1 || statuses.length > 1) return null;
  if (!ids.length && !regions.length && !statuses.length && !words.some(word => /^(?:records?|requests?)$/.test(word))) return null;
  return records.filter(record =>
    (!ids.length || record.id.toLowerCase() === ids[0]) &&
    (!regions.length || record.region.toLowerCase() === regions[0]) &&
    (!statuses.length || record.status.toLowerCase() === statuses[0])
  );
}
