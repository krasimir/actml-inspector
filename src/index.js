/* eslint-disable */

const IN = 'IN';
const OUT = 'OUT';
const REMOVE = 'REMOVE';

import { printSnapshotToConsole } from './console';
import { render } from './ui/Renderer';

module.exports = {
  watchToConsole(processor) {
    const snapshots = [];

    function snapshot(type, node) {
      snapshots.push([
        type,
        { element: { id: node.element.id }},
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
  render
};
