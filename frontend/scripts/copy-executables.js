import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const releaseDir = path.resolve(__dirname, '../release');
const rootDistDir = path.resolve(__dirname, '../../dist');

if (!fs.existsSync(rootDistDir)) {
  fs.mkdirSync(rootDistDir, { recursive: true });
}

if (fs.existsSync(releaseDir)) {
  const files = fs.readdirSync(releaseDir);
  for (const file of files) {
    if (file.endsWith('.exe')) {
      const src = path.join(releaseDir, file);
      const dest = path.join(rootDistDir, file);
      fs.copyFileSync(src, dest);
      console.log(`Copied ${file} -> ${dest}`);
    }
  }
}
