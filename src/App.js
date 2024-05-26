import React, { useCallback } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  BackgroundVariant,
  ReactFlowProvider,
  useStoreApi,
  MiniMap,
} from 'reactflow';

import 'reactflow/dist/style.css';
import './style.css';

import { initialEdges, initialNodes } from './nodes-and-edges';

const MIN_DISTANCE = 150;

const Flow = () => {
  const store = useStoreApi();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const getClosestNode = useCallback((node) => {
    const { nodeInternals } = store.getState();
    const storeNodes = Array.from(nodeInternals.values());

    const closestNode = storeNodes.reduce(
      (res, n) => {
        if (n.id !== node.id) {
          const dx = n.positionAbsolute.x - node.positionAbsolute.x;
          const dy = n.positionAbsolute.y - node.positionAbsolute.y;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < res.distance && d < MIN_DISTANCE) {
            res.distance = d;
            res.node = n;
          }
        }

        return res;
      },
      {
        distance: Number.MAX_VALUE,
        node: null,
      },
    );

    return closestNode.node;
  }, []);

  const getClosestEdge = useCallback((node) => {
    const { edges: currentEdges, nodeInternals } = store.getState();
    const storeNodes = Array.from(nodeInternals.values());

    let closestEdge = null;
    let minDistance = MIN_DISTANCE;

    currentEdges.forEach((edge) => {
      const sourceNode = storeNodes.find((n) => n.id === edge.source);
      const targetNode = storeNodes.find((n) => n.id === edge.target);

      const dx = (sourceNode.position.x + targetNode.position.x) / 2 - node.position.x;
      const dy = (sourceNode.position.y + targetNode.position.y) / 2 - node.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minDistance) {
        closestEdge = edge;
        minDistance = distance;
      }
    });

    return closestEdge;
  }, []);

  const isNodeOnEdge = (node, edge) => {
    const { nodeInternals } = store.getState();
    const sourceNode = nodeInternals.get(edge.source);
    const targetNode = nodeInternals.get(edge.target);

    const x1 = sourceNode.positionAbsolute.x;
    const y1 = sourceNode.positionAbsolute.y;
    const x2 = targetNode.positionAbsolute.x;
    const y2 = targetNode.positionAbsolute.y;
    const x0 = node.positionAbsolute.x;
    const y0 = node.positionAbsolute.y;

    // Calculate the distance from the node to the edge
    const distance = Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1) /
      Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2);

    return distance < 10; // Adjust this threshold as needed
  };

  const onNodeDragStop = useCallback(
    (_, node) => {
      const closestEdge = getClosestEdge(node);
      const closestNode = getClosestNode(node);

      setEdges((es) => {
        const nextEdges = es.filter((e) => e.className !== 'temp');

        if (closestEdge && isNodeOnEdge(node, closestEdge) && closestEdge.source !== node.id && closestEdge.target !== node.id) {
          const edgeExists = nextEdges.some(
            (e) =>
              (e.source === closestEdge.source && e.target === node.id) ||
              (e.source === node.id && e.target === closestEdge.target)
          );
          if (!edgeExists) {
            // Remove the closest edge and add two new edges
            const filteredEdges = nextEdges.filter((e) => e.id !== closestEdge.id);
            filteredEdges.push({
              id: `${closestEdge.source}-${node.id}`,
              source: closestEdge.source,
              target: node.id,
            });
            filteredEdges.push({
              id: `${node.id}-${closestEdge.target}`,
              source: node.id,
              target: closestEdge.target,
            });
            return filteredEdges;
          }
        } else if (closestNode && closestNode.id !== node.id) {
          const edgeExists = nextEdges.some(
            (e) =>
              (e.source === closestNode.id && e.target === node.id) ||
              (e.source === node.id && e.target === closestNode.id)
          );
          if (!edgeExists) {
            const closeNodeIsSource = closestNode.positionAbsolute.x < node.positionAbsolute.x;
            nextEdges.push({
              id: closeNodeIsSource ? `${closestNode.id}-${node.id}` : `${node.id}-${closestNode.id}`,
              source: closeNodeIsSource ? closestNode.id : node.id,
              target: closeNodeIsSource ? node.id : closestNode.id,
            });
          }
        }

        return nextEdges;
      });
    },
    [getClosestEdge, getClosestNode, isNodeOnEdge, setEdges],
  );

  const onNodeDrag = useCallback(
    (_, node) => {
      const closeEdge = getClosestEdge(node);
      const closestNode = getClosestNode(node);

      setEdges((es) => {
        const nextEdges = es.filter((e) => e.className !== 'temp');

        if (closeEdge && isNodeOnEdge(node, closeEdge) && closeEdge.source !== node.id && closeEdge.target !== node.id) {
          nextEdges.push({
            id: `${closeEdge.source}-${node.id}-temp`,
            source: closeEdge.source,
            target: node.id,
            animated: true,
            className: 'temp',
          });

          nextEdges.push({
            id: `${node.id}-${closeEdge.target}-temp`,
            source: node.id,
            target: closeEdge.target,
            animated: true,
            className: 'temp',
          });
        } else if (closestNode && closestNode.id !== node.id) {
          const closeNodeIsSource =
            closestNode.positionAbsolute.x < node.positionAbsolute.x;

          nextEdges.push({
            id: closeNodeIsSource
              ? `${closestNode.id}-${node.id}-temp`
              : `${node.id}-${closestNode.id}-temp`,
            source: closeNodeIsSource ? closestNode.id : node.id,
            target: closeNodeIsSource ? node.id : closestNode.id,
            animated: true,
            className: 'temp',
          });
        }

        return nextEdges;
      });
    },
    [getClosestEdge, getClosestNode, setEdges],
  );

  return (
    <div style={{ height: '80vh', width: '100vw' }}>
    <h1> SKILLSTURE SKILLTREE DEMO</h1>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={onNodeDragStop}
        onNodeDrag={onNodeDrag}
        onConnect={onConnect}
        fitView
      >
        <Background variant={BackgroundVariant.Cross} gap={50} />
        <MiniMap nodeStrokeWidth={3} />
      </ReactFlow>
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <Flow />
  </ReactFlowProvider>
);
