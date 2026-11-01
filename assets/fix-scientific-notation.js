// Fixes path data broken by scientific-notation numbers (e.g. "10e-4") that
// Chrome's SVG path parser rejects, causing the whole path (and everything
// after the bad token within it) to silently fail to render. This affected
// ~25 paths including major countries (USA, Russia and others).
const fs = require('fs');
const path = __dirname + '/world.svg';
let src = fs.readFileSync(path, 'utf8');

let totalFixed = 0;
src = src.replace(/\bd="([^"]*)"/g, (whole, d) => {
  let count = 0;
  const fixed = d.replace(/(\d+(?:\.\d+)?)[eE]([+-]?\d+)/g, (m, mantissa, exp) => {
    count++;
    return Number(m).toString();
  });
  if (count) totalFixed += count;
  return 'd="' + fixed + '"';
});

fs.writeFileSync(path, src);
console.log('fixed numbers:', totalFixed);
