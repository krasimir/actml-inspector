export const STYLE_INSPECTOR = {
  height: '100%',
  display: 'grid',
  gridTemplateRows: '40px 1fr'
};
export const STYLES_NAV = {
  background: '#f0f0f0',
  borderBottom: 'solid 1px #999'
};
export const graphOptions = {
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
  },
  physics: {
    enabled: true,
    barnesHut: {
      gravitationalConstant: -2000,
      centralGravity: 0.3,
      springLength: 95,
      springConstant: 0.04,
      damping: 0.09,
      avoidOverlap: 0
    },
    forceAtlas2Based: {
      gravitationalConstant: -50,
      centralGravity: 0.01,
      springConstant: 0.08,
      springLength: 100,
      damping: 0.4,
      avoidOverlap: 0
    },
    repulsion: {
      centralGravity: 0.2,
      springLength: 200,
      springConstant: 0.05,
      nodeDistance: 100,
      damping: 0.09
    },
    hierarchicalRepulsion: {
      centralGravity: 0.0,
      springLength: 100,
      springConstant: 0.01,
      nodeDistance: 120,
      damping: 0.09
    },
    maxVelocity: 50,
    minVelocity: 0.1,
    solver: 'barnesHut',
    stabilization: {
      enabled: true,
      iterations: 1000,
      updateInterval: 100,
      onlyDynamicEdges: false,
      fit: true
    },
    timestep: 0.5,
    adaptiveTimestep: true
  }
};
