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
        id: `${ node.id }_${ parentId }`,
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
  return network = new vis.Network(
    document.querySelector(`#${ GRAPH_DOM_ID }`),
    {
      nodes: [],
      edges: []
    },
    graphOptions
  );
};
const renderSnapshot = function (currentSnapshot, newSnapshot) {
  if (newSnapshot) {
    const network = getNetwork();
    const currentData = getNetworkData(currentSnapshot);
    const newData = getNetworkData(newSnapshot);
    const patches = jiff.diff(currentData, newData);

    console.log('%c' + JSON.stringify(currentData, null, 2), 'color: #B0B0B0');
    console.log('%c' + JSON.stringify(newData, null, 2), 'color: #00009f');
    console.log('%c' + JSON.stringify(patches, null, 2), 'color: red');

    patches.forEach((patch) => {
      // ------------------------------------------------------------------ add
      if (patch.op === 'add') {
        if (patch.path.indexOf('/nodes') === 0) {
          network.body.data.nodes.add(patch.value);
        } else if (patch.path.indexOf('/edges') === 0) {
          network.body.data.edges.add(patch.value);
        } else {
          console.warn('add: unsupported path ' + patch.path);
        }
      // ------------------------------------------------------------------ test
      } else if (patch.op === 'test') {
        // noop
      // ------------------------------------------------------------------ remove
      } else if (patch.op === 'remove') {
        if (patch.path.indexOf('/nodes') === 0) {
          const nodeArrIndex = Number(patch.path.replace('/nodes/', ''));

          network.body.data.nodes.remove(currentData.nodes[nodeArrIndex].id);
        } else if (patch.path.indexOf('/edges') === 0) {
          const edgeArrIndex = Number(patch.path.replace('/edges/', ''));

          network.body.data.nodes.remove(currentData.edges[edgeArrIndex].id);
        } else {
          console.warn('remove: unsupported path ' + patch.path);
        }
      // ------------------------------------------------------------------ not supported
      } else {
        console.warn('Unsupported patch operation ' + patch.op, patch);
      }
    });

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
