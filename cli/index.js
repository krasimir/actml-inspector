const fs = require('fs');
const path = require('path');

const inspector = require('../lib');
const argv = process.argv;
const file = path.normalize(__dirname + '/../' + argv[2]);

if (fs.existsSync(file)) {
  const content = require(file);

  inspector.default.printSnapshotToConsole(content);
} else {
  throw new Error(`${ file } can not be found.`);
}
