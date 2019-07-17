import vis from 'vis';

// https://visjs.org/docs/network/nodes.html

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

export function render(snapshots, container) {
  const snapshot = snapshots.pop();
  const tree = snapshot[2];
  const nodes = [];
  const edges = [];

  fillNodesAndEdges([ tree ], nodes, edges, 0);

  console.log(nodes);
  console.log(edges);

  // create a network
  let data = {
    nodes: nodes,
    edges: edges
  };
  let options = {
    nodes: {
      shape: 'dot',
      size: 16,
      font: {
        size: 14,
        color: '#000000',
        strokeWidth: 10,
        strokeColor: '#FFFFFF'
      },
      borderWidth: 2
    },
    edges: {
      width: 2,
      arrows: {
        from: true
      },
      arrowStrikethrough: false
    }
  };
  let network = new vis.Network(container, data, options);
};
