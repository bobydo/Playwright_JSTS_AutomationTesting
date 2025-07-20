const path = require('path');
const fs = require('fs');

class FileHelper {
  constructor() {
    this.downloadDir = path.join(__dirname, '../test-results/download');
    this.ensureDownloadDir();
  }

  ensureDownloadDir() {
    if (!fs.existsSync(this.downloadDir)) {
      fs.mkdirSync(this.downloadDir, { recursive: true });
    }
  }

  getDownloadFilePath(filename = 'download.xlsx') {
    return path.join(this.downloadDir, filename);
  }
}
module.exports = {FileHelper};