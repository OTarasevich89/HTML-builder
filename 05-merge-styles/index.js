const fs = require('fs');
const path = require('path');
const stylesDir = path.join(__dirname, 'styles');
const outputFile = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeStyles() {
  await fs.promises.unlink(outputFile).catch(err => {
    if (err.code !== 'ENOENT') {
      console.error('Error', err);
    }
  });

  const files = await fs.promises.readdir(stylesDir);
  const styles = [];

  for (const file of files) {
    const filePath = path.join(stylesDir, file);
    const fileStat = await fs.promises.stat(filePath);

    if (fileStat.isFile() && path.extname(file) === '.css') {
      const content = await fs.promises.readFile(filePath, 'utf-8');
      styles.push(content);
    }
  }

  await fs.promises.writeFile(outputFile, styles.join('\n'), 'utf-8');
  console.log('Styles combined to bundle.css');
}

mergeStyles()
  .catch(err => console.error('Error combined styles:', err));
