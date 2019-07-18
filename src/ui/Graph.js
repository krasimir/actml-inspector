/* eslint-disable no-return-assign */
import vis from 'vis'; // https://visjs.org/docs/network/nodes.html
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import jiff from 'jiff';

import { graphOptions } from './constants';

const GRAPH_DOM_ID = '__graph__';
var network;

const fillNodesAndEdges = function (snapshotNodes, graphNodes, graphEdges, groupId, parentId) {
  snapshotNodes.forEach(node => {
    if (node.children.length > 0) {
      fillNodesAndEdges(node.children, graphNodes, graphEdges, groupId + 1, node.id);
    }
    if (typeof parentId !== 'undefined') {
      graphEdges.push({
        from: node.id,
        to: parentId
      });
    }
    graphNodes.push({
      id: node.id,
      label: `<${ node.name }>`,
      group: groupId
    });
  });
};
const getNetworkData = snapshot => {
  if (!snapshot) {
    return {
      nodes: [],
      edges: []
    };
  }
  const nodes = [];
  const edges = [];

  fillNodesAndEdges([ snapshot[2] ], nodes, edges, 0);

  return { nodes, edges };
};
const getNetwork = function () {
  if (network) return network;

  let data = {
    nodes: [],
    edges: []
  };

  return network = new vis.Network(document.querySelector(`#${ GRAPH_DOM_ID }`), data, graphOptions);
};
const getSnapshotElId = snapshot => {
  if (snapshot) {
    return snapshot[1].element.id;
  }
  return null;
};
const renderSnapshot = function (currentSnapshot, newSnapshot) {
  console.log(getSnapshotElId(currentSnapshot), getSnapshotElId(newSnapshot));
  if (newSnapshot) {
    const network = getNetwork();
    const currentData = getNetworkData(currentSnapshot);
    const newData = getNetworkData(newSnapshot);
    const patches = jiff.diff(currentData, newData);

    const patchedData = patches.reduce(({ nodes, edges }, patch) => {
      if (patch.op === 'add') {
        if (patch.path.indexOf('/nodes') === 0) {
          nodes.push(patch.value);
        } else if (patch.path.indexOf('/edges') === 0) {
          edges.push(patch.value);
        } else {
          console.warn('Unsupported path ' + patch.path);
        }
      } else {
        console.warn('Unsupported patch operation ' + patch.op, patch);
      }
      return { nodes, edges };
    }, { nodes: [], edges: [] });

    network.setData(newData);

    return newSnapshot;
  }
  return null;
};

export default function Graph({ snapshot }) {
  const [ lastRenderedSnapshot, setLastRenderedSnapshot ] = useState();

  useEffect(() => {
    setLastRenderedSnapshot(renderSnapshot(lastRenderedSnapshot, snapshot));
  }, [ snapshot ]);

  return (
    <div id={ GRAPH_DOM_ID }></div>
  );
}
Graph.propTypes = {
  snapshot: PropTypes.array
};
