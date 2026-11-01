// One-time preprocessing script (not shipped) to turn the raw Wikimedia
// "BlankMap-World-Compact.svg" into assets/world.svg used by the app.
// Adds a clean data-country="XX" (ISO 3166-1 alpha-2, uppercase) attribute
// to every country/territory shape so the app can select/color/click them
// without depending on the file's internal class scheme.
const fs = require('fs');

const src = fs.readFileSync(__dirname + '/world-raw.svg', 'utf8');

const MARKERS = new Set(['landxx','coastxx','circlexx','subxx','unxx','noxx','limitxx','antxx','oceanxx']);
const EXCLUDE = new Set(['eu','eaeu']);

let tagged = 0;
let out = src.replace(/<(path|g|circle)([^>]*)>/g, (whole, tag, attrs) => {
  const classMatch = attrs.match(/class="([^"]*)"/);
  if (!classMatch) return whole;
  const tokens = classMatch[1].split(/\s+/).filter(Boolean);
  const hasMarker = tokens.some(t => MARKERS.has(t));
  if (!hasMarker) return whole;
  const code = tokens.find(t => /^[a-z]{2}$/.test(t) && !MARKERS.has(t) && !EXCLUDE.has(t));
  if (!code) return whole;
  if (/data-country=/.test(attrs)) return whole;
  tagged++;
  return `<${tag}${attrs} data-country="${code.toUpperCase()}">`;
});

// Strip the original embedded stylesheet; the app supplies its own.
out = out.replace(/<style id="style_css_sheet"[^>]*>[\s\S]*?<\/style>/, '');

// Strip fixed width/height so the SVG scales fluidly via CSS; keep viewBox.
out = out.replace(/(<svg[^>]*) width="[^"]*" height="[^"]*"/, '$1');

// Give the ocean rect a stable class instead of relying on the removed stylesheet.
out = out.replace('class="oceanxx"', 'class="ocean-bg"');

fs.writeFileSync(__dirname + '/world.svg', out);
console.log('tagged elements:', tagged);
console.log('output size (bytes):', Buffer.byteLength(out));
