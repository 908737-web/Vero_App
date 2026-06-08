import fs from 'fs';
const text = fs.readFileSync('./repo_index.css', 'utf-8');
fs.writeFileSync('./src/index.css', text);
