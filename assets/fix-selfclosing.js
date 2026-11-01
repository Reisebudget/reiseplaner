// Fixes malformed self-closing tags introduced by the earlier data-country
// tagging pass: `.../d="..."/ data-country="XX">` is invalid XML (the stray
// "/" sits mid-attribute-list instead of right before ">"). This silently
// confused downstream parsing for a large part of the document (every
// element after the first malformed one), which is why whole countries
// (USA, Russia, ...) failed to render correctly.
const fs = require('fs');
const path = __dirname + '/world.svg';
let src = fs.readFileSync(path, 'utf8');

let count = 0;
src = src.replace(/"\/ data-country="([A-Z]{2})">/g, (whole, code) => {
  count++;
  return '" data-country="' + code + '"/>';
});

fs.writeFileSync(path, src);
console.log('fixed self-closing tags:', count);
