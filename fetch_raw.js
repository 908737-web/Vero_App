import fs from 'fs';
fetch('https://raw.githubusercontent.com/908737-web/Vero-App-Ed-030626/refs/heads/main/src/App.tsx')
  .then(r => r.text())
  .then(t => fs.writeFileSync('./repo_app.txt', t));
