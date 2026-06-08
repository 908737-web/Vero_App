const fs = require('fs');
const path = require('path');

// فقط پوشه سورس را اسکن می‌کنیم
const DIRECTORIES_TO_SCAN = ['src']; 
// پسوندهای مجاز که هوش مصنوعی نیاز دارد
const ALLOWED_EXTENSIONS = ['.ts', '.tsx', '.css'];
// نام فایل خروجی برای AI Studio
const OUTPUT_FILE = 'Vero_App_Context.txt';

let combinedCode = 'You are an AI assistant. Below is the complete source code for my language learning application.\n\n';

function readDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      readDirectory(fullPath); // اسکن تو در تو
    } else {
      const ext = path.extname(fullPath);
      if (ALLOWED_EXTENSIONS.includes(ext)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        combinedCode += `\n\n// ==========================================\n`;
        combinedCode += `// File Path: ${fullPath}\n`;
        combinedCode += `// ==========================================\n\n`;
        combinedCode += content;
      }
    }
  });
}

// اضافه کردن package.json به انتهای فایل برای درک وابستگی‌ها
if (fs.existsSync('package.json')) {
    const pkg = fs.readFileSync('package.json', 'utf8');
    combinedCode += `\n\n// ==========================================\n// File Path: package.json\n// ==========================================\n\n${pkg}`;
}

// اجرای اسکریپت
DIRECTORIES_TO_SCAN.forEach(dir => readDirectory(dir));
fs.writeFileSync(OUTPUT_FILE, combinedCode);

console.log(`✅ انجام شد! کل پروژه در فایل "${OUTPUT_FILE}" بسته بندی شد. حالا فقط همین یک فایل را در AI Studio آپلود کنید.`);
