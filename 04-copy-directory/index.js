const fs = require('fs');
const path = require('path');
const sourceDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

async function copyDir() {
  await fs.promises.mkdir(destDir, { recursive: true });
  const files = await fs.promises.readdir(sourceDir, { withFileTypes: true });

  for (const file of files) {
    const srcPath = path.join(sourceDir, file.name);
    const destPath = path.join(destDir, file.name);

    if (file.isDirectory()) {
      await copyDirRecursive(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

async function copyDirRecursive(srcDir, destDir) {
  await fs.promises.mkdir(destDir, { recursive: true });
  const files = await fs.promises.readdir(srcDir, { withFileTypes: true });

  for (const file of files) {
    const srcPath = path.join(srcDir, file.name);
    const destPath = path.join(destDir, file.name);

    if (file.isDirectory()) {
      await copyDirRecursive(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

copyDir()
  .then(() => console.log('Success copied.'))
  .catch(err => console.error('Error:', err));
