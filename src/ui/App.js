import vis from 'vis'; // https://visjs.org/docs/network/nodes.html
import React from 'react';
import ReactDOM from 'react-dom';

import { STYLE_INSPECTOR } from './styles';
import Navigation from './Navigation';

const GRAPH_DOM_ID = '__graph__';

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

class AppComponent extends React.Component {
  render() {
    return (
      <div className='actml-inspector' style={ STYLE_INSPECTOR }>
        <Navigation />
        <div id={ GRAPH_DOM_ID }></div>
      </div>
    );
  }
}

export function init(options) {
  const snapshots = [];

  ReactDOM.render(<AppComponent />, options.container);

  return {
    render(snapshot) {
      snapshots.push(snapshot);

      const tree = snapshot[2];
      const nodes = [];
      const edges = [];

      fillNodesAndEdges([ tree ], nodes, edges, 0);

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
      let network = new vis.Network(document.querySelector(`#${ GRAPH_DOM_ID }`), data, options);

      network.on('click', (event) => {
        console.log(event);
      });
    }
  };
}
