import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { ZipArchive } = require('archiver');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '../..'); // C:\Users\GameXspace\PrivSearch
const outputPath = path.join(rootDir, 'PrivSearch-source.zip');
const frontendOutputPath = path.resolve(__dirname, '../PrivSearch-source.zip');

console.log('Creating source archive from:', rootDir);
console.log('Output target:', outputPath);

const output = fs.createWriteStream(outputPath);
const archive = new ZipArchive({
  zlib: { level: 9 }
});

output.on('close', () => {
  const sizeMb = (archive.pointer() / 1024 / 1024).toFixed(2);
  console.log(`Successfully created PrivSearch-source.zip (${sizeMb} MB)`);
  // Also copy to frontend directory for convenience
  try {
    fs.copyFileSync(outputPath, frontendOutputPath);
  } catch {}
});

archive.on('error', (err) => {
  console.error('Archiver error:', err);
  process.exit(1);
});

archive.pipe(output);

// Exclude patterns
const isExcluded = (filePath) => {
  const normalized = filePath.replace(/\\/g, '/');
  const excludedNames = [
    'node_modules',
    'dist',
    'dist-electron',
    'release',
    '.git',
    '.env', // do not include real secrets
    '.gemini',
    'cache',
    '.vite',
    'PrivSearch-source.zip'
  ];

  for (const part of normalized.split('/')) {
    if (excludedNames.includes(part)) {
      // Allow .env.example
      if (part === '.env' && normalized.endsWith('.env.example')) {
        continue;
      }
      return true;
    }
  }

  // Exclude .log files
  if (normalized.endsWith('.log')) return true;

  return false;
};

// Recursive file walker
function addDirectory(currentDir, archivePrefix = '') {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    const relativePath = path.join(archivePrefix, entry.name);

    if (isExcluded(fullPath)) {
      continue;
    }

    if (entry.isDirectory()) {
      addDirectory(fullPath, relativePath);
    } else if (entry.isFile()) {
      archive.file(fullPath, { name: relativePath.replace(/\\/g, '/') });
    }
  }
}

addDirectory(rootDir);
archive.finalize();
