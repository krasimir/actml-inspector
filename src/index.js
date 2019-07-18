const OUT = 'OUT';
const REMOVE = 'REMOVE';
const IN = 'IN';

import { printSnapshotToConsole } from './console';
import { init } from './ui/App';

module.exports = {
  watchToConsole(processor) {
    const snapshots = [];

    function snapshot(type, node) {
      snapshots.push([
        type,
        { element: { id: node.element.id, name: node.element.name }},
        processor.system().tree.diagnose()
      ]);
      printSnapshotToConsole(snapshots[snapshots.length - 1]);
    }

    // processor.onNodeIn(node => snapshot(IN, node));
    processor.onNodeOut(node => snapshot(OUT, node));
    // processor.onNodeRemove(node => snapshot(REMOVE, node));
  },
  printSnapshotToConsole(snapshots) {
    snapshots.forEach(printSnapshotToConsole);
  },
  render(snapshot) {
    if (!this.app) {
      throw new Error('You must call `actmlInspector.init` first.');
    }
    this.app.render(snapshot);
  },
  init(options) {
    if (!options || !options.container) {
      throw new Error('`init` expects an options object with a `container` (DOM element) field in it.');
    }
    this.app = init(options);
  }
};
