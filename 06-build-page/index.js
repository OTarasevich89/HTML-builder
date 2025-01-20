const fs = require('fs');
const path = require('path');
const templatePath = path.join(__dirname, 'template.html');
const componentsDir = path.join(__dirname, 'components');
const stylesDir = path.join(__dirname, 'styles');
const projectDistDir = path.join(__dirname, 'project-dist');
const outputHtmlPath = path.join(projectDistDir, 'index.html');
const outputCssPath = path.join(projectDistDir, 'style.css');
const assetsDir = path.join(__dirname, 'assets');

async function createDirIfNotExists(dir) {
  try {
    await fs.promises.mkdir(dir, { recursive: true });
  } catch (err) {
    console.error(`Error ${dir}:`, err);
  }
}

async function replaceTemplateTags(template) {
  const regex = /{{(\w+)}}/g;
  const components = {};
  const files = await fs.promises.readdir(componentsDir);
  for (const file of files) {
    const filePath = path.join(componentsDir, file);
    const fileStat = await fs.promises.stat(filePath);
    if (fileStat.isFile() && path.extname(file) === '.html') {
      const content = await fs.promises.readFile(filePath, 'utf-8');
      const componentName = path.basename(file, '.html');
      components[componentName] = content;
    }
  }

  return template.replace(regex, (match, p1) => components[p1] || match);
}

async function mergeStyles() {
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

  await fs.promises.writeFile(outputCssPath, styles.join('\n'), 'utf-8');
}

async function copyAssets(src, dest) {
  await createDirIfNotExists(dest);
  const files = await fs.promises.readdir(src);

  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stat = await fs.promises.stat(srcPath);

    if (stat.isDirectory()) {
      await copyAssets(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
}

async function buildPage() {
  await createDirIfNotExists(projectDistDir);
  const template = await fs.promises.readFile(templatePath, 'utf-8');
  const filledTemplate = await replaceTemplateTags(template);
  await fs.promises.writeFile(outputHtmlPath, filledTemplate, 'utf-8');
  await mergeStyles();
  await copyAssets(assetsDir, path.join(projectDistDir, 'assets'));
  console.log('Page created in folder project-dist');
}

buildPage().catch(err => console.error('Error:', err));