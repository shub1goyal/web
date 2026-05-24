import { readFileSync } from 'node:fs';

const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const mainHtml = readFileSync(new URL('../main.html', import.meta.url), 'utf8');

const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

expect(indexHtml === mainHtml, 'index.html and main.html must stay identical.');

const projectImageRefs = [
  'images/project_mahindra_esg.png',
  'images/project_dmart_dupont.png',
  'images/project_dmart_valuation.png',
];

for (const ref of projectImageRefs) {
  const imageMatch = indexHtml.match(new RegExp(`<img[^>]+src="${ref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`));
  expect(Boolean(imageMatch), `${ref} is missing from the project grid.`);
  if (imageMatch) {
    expect(imageMatch[0].includes('object-contain'), `${ref} should use object-contain so mobile does not crop it.`);
    expect(!imageMatch[0].includes('object-cover'), `${ref} should not use object-cover in the project grid.`);
  }
}

expect(!indexHtml.includes('Dupont Excel Parser'), 'AI/tool cards should not call the DuPont Excel model a parser.');
expect(!indexHtml.includes('dupont_excel_parser.py'), 'Terminal demo should not imply a non-existent DuPont parser script.');
expect(indexHtml.includes('Waste Generation &amp; Disposal Calculator'), 'Advanced waste generation/disposal calculator should be represented.');
expect(indexHtml.includes('Macro-Enabled Excel Tool'), 'Waste calculator should be framed as an Excel tool, not an AI agent.');

const freelanceCardTitles = [
  'AI Content Automation Factory',
  'Browser Workflow Automation',
  'Advanced Excel &amp; ESG Calculators',
  'Financial Research &amp; Market Intelligence',
];

expect(indexHtml.includes('id="freelance"'), 'Freelance section should be present.');
expect(indexHtml.includes('href="#freelance"'), 'Freelance section should be reachable from navigation.');
for (const title of freelanceCardTitles) {
  expect(indexHtml.includes(title), `Freelance card missing: ${title}`);
}
expect(indexHtml.includes('Viral Content Engine'), 'Freelance proof should mention the local content automation build.');
expect(indexHtml.includes('AutoJob Apply Assistant'), 'Freelance proof should mention the local browser automation extension.');

if (failures.length) {
  console.error('Portfolio content check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Portfolio content check passed.');
