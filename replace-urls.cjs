const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, 'src', 'pages');

function processFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processFiles(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}` with `https://bus-pass-backend-production.up.railway.app`
      const searchString = "\\$\\{import\\.meta\\.env\\.VITE_API_URL \\|\\| 'http://localhost:5000'\\}";
      const regex = new RegExp(searchString, 'g');
      const updatedContent = content.replace(regex, "https://bus-pass-backend-production.up.railway.app");

      if (content !== updatedContent) {
        fs.writeFileSync(fullPath, updatedContent, 'utf8');
        console.log('Updated:', fullPath);
      }
    }
  }
}

processFiles(directory);
console.log('Done replacing hardcoded URLs.');
