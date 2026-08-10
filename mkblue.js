/* Generates index-blue.html from index.html: same markup, one extra stylesheet. */
const fs = require('fs');
const dir = __dirname + '/';
let h = fs.readFileSync(dir + 'index.html', 'utf8');

const link = '<link rel="stylesheet" href="assets/css/styles.css" />';
if (!h.includes(link)) throw new Error('stylesheet link not found — did index.html change?');

h = h.replace(link, link + '\n<link rel="stylesheet" href="assets/css/theme-blue.css" />');
/* it's a comparison page, not a second copy of the site — keep it out of search results */
h = h.replace('<title>',
  '<!-- GENERATED from index.html by mkblue.js — do not edit directly -->\n' +
  '<meta name="robots" content="noindex, nofollow" />\n<title>');

fs.writeFileSync(dir + 'index-blue.html', h);
console.log('index-blue.html written,', h.length, 'bytes');
