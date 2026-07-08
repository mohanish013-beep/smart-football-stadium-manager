export function findShortestPath(graph, startId, endId) {
  const distances = {};
  const prev = {};
  const unvisited = new Set();

  graph.nodes.forEach(node => {
    distances[node.id] = Infinity;
    prev[node.id] = null;
    unvisited.add(node.id);
  });
  
  distances[startId] = 0;

  while (unvisited.size > 0) {
    let currNodeId = null;
    let minDistance = Infinity;
    
    unvisited.forEach(id => {
      if (distances[id] < minDistance) {
        minDistance = distances[id];
        currNodeId = id;
      }
    });

    if (currNodeId === null || currNodeId === endId) break;

    unvisited.delete(currNodeId);

    const neighbors = graph.edges.filter(e => e.source === currNodeId || e.target === currNodeId);
    
    neighbors.forEach(edge => {
      const neighborId = edge.source === currNodeId ? edge.target : edge.source;
      if (unvisited.has(neighborId)) {
        const alt = distances[currNodeId] + edge.weight;
        if (alt < distances[neighborId]) {
          distances[neighborId] = alt;
          prev[neighborId] = currNodeId;
        }
      }
    });
  }

  const path = [];
  let u = endId;
  if (prev[u] !== null || u === startId) {
    while (u !== null) {
      path.unshift(u);
      u = prev[u];
    }
  }
  
  return path;
}
