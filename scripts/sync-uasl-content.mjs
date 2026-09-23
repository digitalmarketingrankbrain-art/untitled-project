// Rebuild the static page data from the content specification supplied in this workspace.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const spec = readFileSync(new URL('../UASL_Design_and_Content_Prompt.md', import.meta.url), 'utf8');
const root = new URL('../frontend/src/', import.meta.url);
const slugs = ['information-center','use-of-logo','what-is-accreditation','how-to-become-accreditated','benefits-of-accreditation','management-system-certification','product-certification','personal-certification','inspection','rating','fee-structure','careers','terms-of-usage','cookie-policy','privacy-policy','disclaimer'];
const aliases = {'terms-of-usage':'legal/terms-of-use','cookie-policy':'legal/cookie-policy','privacy-policy':'legal/privacy-policy','disclaimer':'legal/disclaimer'};
const data = {};
for (const section of spec.split(/^### \d+\. /m).slice(1)) {
  const title = section.split('\n')[0].trim();
  const match = section.match(/\*\*URL:\*\* `https:\/\/uasl\.uk\.com\/([^`]+)\/`/);
  if (!match || !slugs.includes(match[1])) continue;
  const slug = match[1];
  const content = section.slice(match.index + match[0].length).replace(/\s*---\s*$/, '').trim();
  const lines = content.split(/\r?\n/);
  if (lines[0].toLowerCase().replace(/\?$/, '') === title.toLowerCase().replace(/\?$/, '')) lines.shift();
  data[slug] = {title: title === 'How to become accredited' ? 'How to become accredited?' : title, content: lines.join('\n').trim()};
  const path = new URL(`app/(public)/${aliases[slug] || slug}/`, root);
  mkdirSync(path, {recursive:true});
  writeFileSync(new URL('page.tsx',path), `import type { Metadata } from "next";\nimport { ReferenceContentPage } from "@/components/layout/reference-content-page";\n\nexport const metadata: Metadata = { title: ${JSON.stringify(title+' | UASL')} };\n\nexport default function Page() {\n  return <ReferenceContentPage slug=${JSON.stringify(slug)} />;\n}\n`);
}
writeFileSync(new URL('lib/uasl-reference-content.json',root), JSON.stringify(data,null,2)+'\n');
console.log(`Generated ${Object.keys(data).length} reference content pages.`);
