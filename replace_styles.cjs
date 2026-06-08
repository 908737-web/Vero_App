const fs = require('fs');
const path = require('path');

function replacePadding(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replacePadding(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            content = content.replace(/\bpx-6\b/g, 'px-3')
                             .replace(/\bpx-4\b/g, 'px-3')
                             .replace(/\bpx-5\b/g, 'px-3')
                             .replace(/\bpx-8\b/g, 'px-3')
                             .replace(/\b-mx-6\b/g, '-mx-3');
            fs.writeFileSync(fullPath, content);
        }
    }
}

replacePadding('./src');
console.log('Padding replaced successfully');
