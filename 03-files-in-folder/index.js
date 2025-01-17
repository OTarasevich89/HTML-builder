const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if(err) throw err;
  files.forEach(file => {
    if (file.isFile()) {
      const filePath = path.join(folderPath, file.name);
      const fileName = path.parse(file.name).name;
      const fileExtension = path.extname(file.name).slice(1);
      fs.stat(filePath, (err, stats) => {
        if(err) throw err;
        const fileSizeInBytes = stats.size;
        const fileSizeInKB = (fileSizeInBytes / 1024).toFixed(3);
        console.log(`${fileName} - ${fileExtension} - ${fileSizeInKB}Kb`);
      });
    }
  });
});
