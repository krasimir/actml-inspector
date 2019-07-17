const fs = require('fs');
const path = require('path');

const inspector = require('../actml-inspector.js');
const argv = process.argv;
const file = path.normalize(__dirname + '/../' + argv[2]);

if (fs.existsSync(file)) {
  const content = require(file);

  inspector.printSnapshotToConsole(content);
} else {
  throw new Error(`${ file } can not be found.`);
}
