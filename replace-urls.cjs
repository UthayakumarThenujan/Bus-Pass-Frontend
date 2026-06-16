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
      
      // Replace 'http://localhost:5000/api/...' with `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/...`
      const updatedContent = content.replace(/'http:\/\/localhost:5000([^']*)'/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}$1`");
      
      // Also handle backticks if any `http://localhost:5000/api/tickets/${id}` -> `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tickets/${id}`
      const updatedContent2 = updatedContent.replace(/`http:\/\/localhost:5000([^`]+)`/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}$1`");

      if (content !== updatedContent2) {
        fs.writeFileSync(fullPath, updatedContent2, 'utf8');
        console.log('Updated:', fullPath);
      }
    }
  }
}

processFiles(directory);
console.log('Done replacing hardcoded URLs.');
